"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CommentConfirmClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const threadId = searchParams.get("threadId");
  const parentId = searchParams.get("parentId") || null;
  const body = searchParams.get("body") || "";
  const authorName = searchParams.get("authorName") || "名無しの創作者さん";
  const anonymous = searchParams.get("anonymous") === "1";

  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id ?? null);
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!threadId || !body.trim()) {
      alert("投稿内容が不正です");
      return;
    }

    setIsSubmitting(true);

    // 最新のserial_numberを取得
    const { data: maxData, error: fetchError } = await supabase
      .from("comments")
      .select("serial_number")
      .eq("thread_id", threadId)
      .order("serial_number", { ascending: false })
      .limit(1);

    if (fetchError) {
      alert("番号取得に失敗しました");
      console.error(fetchError);
      setIsSubmitting(false);
      return;
    }

    const maxSerial = maxData?.[0]?.serial_number || 0;

    // コメントを挿入
    const { error: insertError } = await supabase.from("comments").insert({
      thread_id: threadId,
      parent_comment_id: parentId || null,
      body,
      author_name: authorName,
      created_at: new Date().toISOString(),
      serial_number: maxSerial + 1,
      author_id: userId,
    });

    if (insertError) {
      console.error(insertError);
      if (insertError.message.includes("コメント上限")) {
        alert("投稿上限1000件に達しました。新しいスレッドを作成してね！");
      } else {
        alert("投稿に失敗しました");
      }
      setIsSubmitting(false);
      return;
    }

    router.push(`/comments/success?threadId=${encodeURIComponent(threadId)}`);
  };

  return (
    <main className="max-w-xl mx-auto mt-10 px-4 py-6 border rounded bg-white shadow">
      <h1 className="text-2xl font-bold mb-6 text-primary">投稿内容の確認</h1>

      <div className="mb-4">
        <p className="text-sm text-gray-500">スレッドID: {threadId}</p>
      </div>

      <div className="mb-6">
        <label className="font-semibold">名前：</label>
        <p className="whitespace-pre-wrap bg-gray-100 p-3 rounded mt-1">{authorName}</p>
      </div>

      <div className="mb-6">
        <label className="font-semibold">コメント：</label>
        <p className="whitespace-pre-wrap bg-gray-100 p-3 rounded mt-1">{body}</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition"
          disabled={isSubmitting}
        >
          戻って修正
        </button>
        <button
          onClick={handleSubmit}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-text transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "送信中..." : "投稿する"}
        </button>
      </div>

      {/* 🔽 注意書きセクション */}
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
