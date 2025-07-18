"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NewThreadClient() {
  const [defaultAuthorName, setDefaultAuthorName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const router = useRouter();

  const tagOptions = [
    "質問", "Twitter", "字書き", "愚痴", "ツイッター", "支部", "BL", "絵描き", "壁打ち",
    "同人誌", "相談", "雑談", "イベント", "二次創作", "漫画", "地雷", "部数", "アンソロ",
    "イラスト", "マシュマロ", "人間関係", "感想", "小説", "印刷所", "吐き出し",
    "一言物申す", "悩み", "一次創作", "同人", "漫画家志望", "pixiv"
  ];

  useEffect(() => {
    // URL パラメータから初期値復元
    const searchParams = new URLSearchParams(window.location.search);
    const titleFromParams = searchParams.get("title");
    const bodyFromParams = searchParams.get("body");
    const authorNameFromParams = searchParams.get("authorName");
    const anonymousParam = searchParams.get("anonymous");
    const tagsParam = searchParams.get("tags");

    if (titleFromParams) setTitle(titleFromParams);
    if (bodyFromParams) setBody(bodyFromParams);
    if (authorNameFromParams) setAuthorName(authorNameFromParams);
    if (anonymousParam === "1") setAnonymous(true);
    if (tagsParam) setSelectedTags(tagsParam.split(","));
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!session?.user) {
        console.error("ユーザーセッションが見つかりません");
        return;
      }

      const user = session.user;
      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("プロフィール取得エラー:", profileError.message);
        return;
      }

      const name = profile?.username || "";
      setDefaultAuthorName(name);
      setAuthorName(name);
    };

    fetchUserName();
  }, []);

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const postAuthorName =
      anonymous || !authorName.trim() ? "名無しの創作者さん" : authorName.trim();

    const query = new URLSearchParams({
      title,
      body,
      authorName: postAuthorName,
      anonymous: anonymous ? "1" : "0",
      tags: selectedTags.join(","),
    });

    router.push(`/threads/confirm?${query.toString()}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        新規スレッド作成
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タイトル
          </label>
          <input
            type="text"
            className="w-full border border-[#c2d2c5] focus:border-[#1e3932] focus:ring-1 focus:ring-[#1e3932] p-3 rounded transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            本文（任意）
          </label>
          <textarea
            className="w-full border border-[#c2d2c5] focus:border-[#1e3932] focus:ring-1 focus:ring-[#1e3932] p-3 rounded transition"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            名前（省略で匿名）
          </label>
          <input
            type="text"
            disabled={anonymous}
            className="w-full border border-[#c2d2c5] focus:border-[#1e3932] focus:ring-1 focus:ring-[#1e3932] p-3 rounded transition disabled:bg-gray-100"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="名無しの創作者さん"
          />
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => {
                setAnonymous(e.target.checked);
                setAuthorName(e.target.checked ? "" : defaultAuthorName);
              }}
            />
            <span className="text-sm text-gray-700">匿名で投稿する</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タグ（複数選択可）
          </label>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`px-3 py-1 rounded-full border ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-white border-[#1e3932]"
                    : "border-[#c2d2c5] text-gray-700 hover:bg-gray-100"
                } transition text-sm`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            画像（任意）
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImageFile(file || null);
            }}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white font-semibold py-3 rounded hover:bg-text transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "投稿中..." : "投稿する"}
        </button>
      </form>
    </div>
  );
}
