"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
    });

    if (error) {
      alert("エラーが発生しました: " + error.message);
      console.error(error);
    } else {
      alert(
        "パスワードリセット用のメールを送信しました。メールをご確認ください。"
      );
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">
        パスワードリセット
      </h1>

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            登録済みのメールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3932]"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-text"
          }`}
        >
          {loading ? "送信中..." : "リセットリンクを送信"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        <a
          href="/login"
          className="text-primary hover:underline"
        >
          ログイン画面へ戻る
        </a>
      </p>
    </main>
  );
}
