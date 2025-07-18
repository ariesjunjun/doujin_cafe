"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type CommentFormProps = {
  threadId: string;
  parentId?: string | null;
  onSubmitted?: () => void;
};

export default function CommentForm({
  threadId,
  parentId = null,
  onSubmitted,
}: CommentFormProps) {
  const router = useRouter();
  const defaultAuthorName = "名無しの創作者さん";

  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState(defaultAuthorName);
  const [anonymous, setAnonymous] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [defaultNameLoaded, setDefaultNameLoaded] = useState(false);

  // ✅ ログインユーザーから authorName を取得
  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (user) {
        setUserId(user.id);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.warn("プロフィール取得エラー:", profileError.message);
          setAuthorName(defaultAuthorName);
        } else {
          setAuthorName(profileData?.username || defaultAuthorName);
        }
      } else {
        setAuthorName(defaultAuthorName);
      }

      setDefaultNameLoaded(true);
    };

    fetchUser();
  }, []);

  const handleAuthorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorName(e.target.value);
    if (anonymous && e.target.value !== "") {
      setAnonymous(false);
    }
  };

  // ✅ 投稿処理ではなく確認ページへ遷移
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!body.trim()) {
      alert("コメントの内容が記入されていません。");
      return;
    }

    const query = new URLSearchParams({
      threadId,
      parentId: parentId || "",
      body,
      authorName: anonymous ? defaultAuthorName : authorName || defaultAuthorName,
      anonymous: anonymous ? "1" : "0",
    });

    router.push(`/comments/confirm?${query.toString()}`);
  };

  if (!defaultNameLoaded) {
    return <div>読み込み中...</div>;
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-4 mt-6">
      {/* 名前 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          名前（省略で匿名）
        </label>
        <input
          type="text"
          disabled={anonymous}
          className="w-full border border-primary focus:border-primary focus:ring-1 focus:ring-primary p-3 rounded transition disabled:bg-gray-100"
          value={authorName}
          onChange={handleAuthorNameChange}
          placeholder={defaultAuthorName}
        />
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => {
              setAnonymous(e.target.checked);
              if (e.target.checked) {
                setAuthorName(defaultAuthorName);
              } else {
                setAuthorName(userId ? authorName : defaultAuthorName);
              }
            }}
          />
          <span className="text-sm text-gray-700">匿名で投稿する</span>
        </div>
      </div>

      {/* コメント本文 */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="コメントを入力"
        rows={4}
        className="border border-primary p-2 rounded w-full text-gray-800"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-text transition"
        >
          確認画面へ進む
        </button>

        {parentId && onSubmitted && (
          <button
            type="button"
            onClick={onSubmitted}
            className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-text transition"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
