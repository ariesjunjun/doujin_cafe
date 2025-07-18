"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import { ThreadButtons } from "@/components/ThreadButtons";
import { Sidebar } from "@/components/Sidebar";
import { ReportModal } from "./ReportModal";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

function ReportButton({ threadId }: { threadId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-gray-400 hover:text-red-500 underline transition"
      >
        不適切な投稿を通報する
      </button>
      {open && (
        <ReportModal threadId={threadId} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

type Thread = {
  id: string;
  title: string;
  body?: string;
  author_name?: string;
  created_at: string;
  image_url?: string;
  tags?: string[];
};

export default function ThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchThreadAndCount() {
      const [threadRes, countRes] = await Promise.all([
        supabase
          .from("threads")
          .select("*")
          .eq("id", params.threadId)
          .single(),

        supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("thread_id", params.threadId),
      ]);

      if (threadRes.error) {
        console.error(threadRes.error);
        setLoading(false);
        return;
      }

      setThread(threadRes.data);
      setCommentCount(countRes.count ?? 0);
      setLoading(false);
    }

    fetchThreadAndCount();
  }, [params.threadId]);

  if (loading) {
    return <p className="text-center text-primary">読み込み中...</p>;
  }

  if (!thread) {
    return (
      <div className="p-4 text-center">
        <p className="text-primary mb-4">スレッドが見つかりませんでした。</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 text-sm rounded bg-primary text-white hover:bg-[#163029] transition"
        >
          戻る
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-col md:flex-row gap-6 w-full">
      {/* メインコンテンツ */}
      <section className="flex-1 max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">
          {thread.title}
        </h1>

        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {thread.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?tag=${encodeURIComponent(tag)}`}
                className="inline-block text-primary text-xs font-semibold px-2 py-1 rounded-full bg-white border border-primary hover:bg-primary hover:text-white transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {thread.body && (
          <p className="mb-4 text-gray-700 whitespace-pre-wrap">
            {thread.body}
          </p>
        )}

        {thread.image_url && (
          <div className="mb-6">
            <img
              src={thread.image_url}
              alt="投稿画像"
              className="max-w-xs w-full h-auto"
            />
          </div>
        )}

        <div className="text-xs text-gray-500 mb-6">
          投稿者：{" "}
          <span className="text-primary font-semibold">
            {thread.author_name || "名無しの創作者さん"}
          </span>{" "}
          ／
          {new Date(thread.created_at).toLocaleString("ja-JP", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </div>

        <div className="text-xs text-gray-500 mb-2">
          <ReportButton threadId={thread.id} />
        </div>

        <CommentList threadId={thread.id} />

        {commentCount !== null && commentCount < 1000 && (
          <CommentForm threadId={thread.id} />
        )}
        {commentCount !== null && commentCount >= 1000 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            ※ このスレッドはコメントが上限（1000件）に達しました。
          </p>
        )}

        <ThreadButtons />
      </section>

      {/* サイドバー */}
      <div className="w-full md:w-64 md:flex-shrink-0">
        <Sidebar />
      </div>
    </main>
  );
}
