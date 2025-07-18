"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { tagList } from "@/components/TagList";

function getTagNameByName(name: string | null) {
  if (!name) return "";
  const found = tagList.find((t) => t.name === name);
  return found ? found.name : name;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.trim() || "";
  const rawTag = searchParams.get("tag");
  const tag = rawTag ? decodeURIComponent(rawTag.trim()) : "";

  const [threads, setThreads] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThreads() {
      setLoading(true);

      let qb = supabase
        .from("threads")
        .select("*");

      if (tag) {
        qb = qb.contains("tags", [tag]);
      }

      if (query) {
        qb = qb.ilike("title", `%${query}%`);
      }

      const { data, error } = await qb;

      if (error) {
        setError(error.message);
        setThreads([]);
      } else {
        setThreads(data || []);
      }

      setLoading(false);
    }

    if (query || tag) {
      fetchThreads();
    } else {
      setThreads([]);
      setLoading(false);
    }
  }, [query, tag]);

  if (!query && !tag) {
    return (
      <p className="text-center mt-8">
        検索キーワードまたはタグを指定してください。
      </p>
    );
  }

  if (loading) {
    return <p className="text-center mt-8">検索中...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-600">
        検索に失敗しました：{error}
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-text">
        {tag
          ? `タグ「#${getTagNameByName(tag)}」のスレッド一覧（${threads.length}件）`
          : `「${query}」の検索結果（${threads.length}件）`}
      </h1>

      {threads.map((thread) => (
        <div key={thread.id} className="border-b py-3">
          <Link
            href={`/threads/${thread.id}`}
            className="text-lg font-semibold text-primary hover:underline"
          >
            {thread.title}
          </Link>
          <div className="text-xs text-gray-500 mt-1">
            投稿者: {thread.author_name || "名無し"} ／{" "}
            {new Date(thread.created_at).toLocaleString()}
          </div>
          {thread.tags && thread.tags.length > 0 && (
            <div className="mt-2 text-xs flex flex-wrap gap-2">
              {thread.tags.map((t: string) => (
                <Link
                  key={t}
                  href={`/search?tag=${encodeURIComponent(t)}`}
                  className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      {threads.length === 0 && (
        <p>該当するスレッドは見つかりませんでした。</p>
      )}
    </div>
  );
}
