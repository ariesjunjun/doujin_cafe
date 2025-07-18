"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ThreadConfirmClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const title = searchParams.get("title") || "";
  const body = searchParams.get("body") || "";
  const authorName = searchParams.get("authorName") || "名無しの創作者さん";
  const anonymous = searchParams.get("anonymous") === "1";
  const tags = searchParams.get("tags")?.split(",") || [];

  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id ?? null);
    };
    fetchUser();
  }, []);

  const handleConfirm = async () => {
    setSubmitting(true);

    const { error } = await supabase.from("threads").insert([
      {
        title,
        body,
        author_name: authorName,
        author_id: userId,
        tags,
      },
    ]);

    setSubmitting(false);

    if (error) {
      console.error(error);
      alert("投稿に失敗しました");
    } else {
      router.push("/");
    }
  };

  return (
    <main className="max-w-xl mx-auto mt-10 px-4 py-6 border rounded bg-white shadow">
      <h1 className="text-2xl font-bold mb-6 text-primary">投稿内容の確認</h1>

      <div className="mb-4">
        <label className="font-semibold">タイトル：</label>
        <p className="whitespace-pre-wrap bg-gray-100 p-3 rounded mt-1">{title}</p>
      </div>

      <div className="mb-4">
        <label className="font-semibold">名前：</label>
        <p className="whitespace-pre-wrap bg-gray-100 p-3 rounded mt-1">{authorName}</p>
      </div>

      <div className="mb-4">
        <label className="font-semibold">タグ：</label>
        <p className="whitespace-pre-wrap bg-gray-100 p-3 rounded mt-1">{tags.join(", ")}</p>
      </div>

      <div className="mb-6">
        <label className="font-semibold">本文：</label>
        <p className="whitespace-pre-wrap bg-gray-100 p-3 rounded mt-1">{body}</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            const params = new URLSearchParams({
              title,
              body,
              authorName,
              anonymous: anonymous ? "1" : "0",
              tags: tags.join(","),
            });
            router.push(`/threads/new?${params.toString()}`);
          }}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition"
          disabled={submitting}
        >
          戻って修正
        </button>

        <button
          onClick={handleConfirm}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-text transition"
          disabled={submitting}
        >
          {submitting ? "投稿中..." : "投稿する"}
        </button>
      </div>

      {/* 注意書きセクション */}
      <div className="text-sm text-gray-600 border-t pt-4 mt-8">
        <p className="mb-1">⚠️ 以下の内容は禁止されています：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>誹謗中傷や攻撃的な発言</li>
          <li>個人情報の書き込み</li>
          <li>差別的・不適切な内容</li>
        </ul>
        <p className="mt-3">
          ※上記に該当すると判断した場合、管理人が投稿を削除することがあります。
        </p>
      </div>
    </main>
  );
}
