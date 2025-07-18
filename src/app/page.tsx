"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThreadButtons } from "@/components/ThreadButtons";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";
import { RoomCard } from "@/components/RoomCard";

const roomList = [
  {
    id: "abc123",
    name: "夜のお絵かき部屋",
    isLocked: true,
    currentMembers: 4,
    adminName: "User123",
    roomUrl: "https://yourapp.com/rooms/abc123",
  },
  {
    id: "xyz456",
    name: "雑談ルーム",
    isLocked: false,
    currentMembers: 2,
    adminName: "User456",
    roomUrl: "https://yourapp.com/rooms/xyz456",
  },
];

type Thread = {
  id: string;
  title: string;
  body?: string;
  author_name?: string;
  created_at: string;
  image_url?: string;
  last_comment_at?: string | null;
};

function formatRelativeTime(dateString: string | null | undefined) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}日前`;
  if (hours > 0) return `${hours}時間前`;
  if (minutes > 0) return `${minutes}分前`;
  return `${seconds}秒前`;
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;

  const [threads, setThreads] = useState<Thread[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const THREADS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchThreads() {
      setLoading(true);

      const { data, error, count } = await supabase
        .from("threads")
        .select(
          "id, title, body, author_name, created_at, image_url",
          { count: "exact" }
        );

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setTotalCount(count || 0);

      const threadsWithLastComment = await Promise.all(
        (data || []).map(async (thread) => {
          const { data: commentData, error: commentError } = await supabase
            .from("comments")
            .select("created_at")
            .eq("thread_id", thread.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (commentError) {
            console.error(commentError);
          }

          return {
            ...thread,
            last_comment_at: commentData?.created_at || null,
          };
        })
      );

      const sortedThreads = threadsWithLastComment.sort((a, b) => {
        const dateA = new Date(a.last_comment_at || a.created_at).getTime();
        const dateB = new Date(b.last_comment_at || b.created_at).getTime();
        return dateB - dateA;
      });

      const paginatedThreads = sortedThreads.slice(
        (currentPage - 1) * THREADS_PER_PAGE,
        currentPage * THREADS_PER_PAGE
      );

      setThreads(paginatedThreads);
      fetchCommentCounts(paginatedThreads);
      setLoading(false);
    }

    async function fetchCommentCounts(threads: Thread[]) {
      const counts: Record<string, number> = {};

      for (const thread of threads) {
        const { count, error } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("thread_id", thread.id);

        if (error) {
          console.error(error);
          continue;
        }

        counts[thread.id] = count || 0;
      }

      setCommentCounts(counts);
    }

    fetchThreads();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / THREADS_PER_PAGE);

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  return (
    <main className="flex flex-col md:flex-row gap-6 w-full">
      <section className="flex-1 w-full">

        {/* 🔽 掲示板リストの上にルーム一覧を表示 */}
        <div className="p-3 mb-8 ">
          <h2 className="text-xl font-bold mb-4 text-center md:text-left text-primary">
  現在開いているルーム
</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roomList.map((room) => (
              <RoomCard {...room} key={room.id} />
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            読み込み中...
          </div>
        ) : (
          <>
            <ul className="space-y-6">
              {threads.map((thread) => {
                const timeToShow = thread.last_comment_at || thread.created_at;

                return (
                  <li
                    key={thread.id}
                    className="border border-primary rounded-xl bg-white shadow-sm hover:shadow-md transition"
                  >
                    <Link
                      href={`/threads/${thread.id}`}
                      className="flex p-4 no-underline text-inherit"
                    >
                      {/* 左: コメント数 */}
                      <div className="flex flex-col items-center justify-center w-16 mr-4">
                        <span className="text-xl font-bold text-gray-800">
                          {commentCounts[thread.id] || 0}
                        </span>
                        <span className="text-xs text-gray-500">
                          コメント
                        </span>
                      </div>

                      {/* 中央: 画像 */}
                      {thread.image_url && (
                        <div className="flex-shrink-0 mr-4">
                          <img
                            src={thread.image_url}
                            alt="サムネイル"
                            className="w-24 h-24 object-cover rounded"
                          />
                        </div>
                      )}

                      {/* 右: タイトル・本文 */}
                      <div className="flex-1 flex flex-col gap-2">
                        <h2 className="text-base md:text-lg font-semibold text-primary">
                          {thread.title}
                        </h2>

                        {thread.body && (
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {thread.body}
                          </p>
                        )}

                        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
                          <span>
                            投稿者: {thread.author_name || "匿名"}
                          </span>
                          <span>{formatRelativeTime(timeToShow)}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded transition ${
                      currentPage === i + 1
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <ThreadButtons />
      </section>

      <div className="w-full md:w-64 md:flex-shrink-0">
        <Sidebar />
      </div>
    </main>
  );
}
