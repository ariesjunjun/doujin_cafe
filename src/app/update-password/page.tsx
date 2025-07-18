"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserLoaded(true);
      } else {
        alert("ログイン情報が見つかりません。メールのリンクを再度開いてください。");
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      alert("パスワードは6文字以上で入力してください。");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert("パスワードの更新に失敗しました: " + error.message);
      console.error(error);
    } else {
      alert("パスワードを更新しました。ログインし直してください。");
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">
        新しいパスワード設定
      </h1>

      {!userLoaded ? (
        <p className="text-center">ユーザー情報を確認しています...</p>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新しいパスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3932]"
            />
            <p className="mt-1 text-sm text-gray-500">
              ※パスワードは半角英数字・6文字以上で設定してください。
            </p>
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
            {loading ? "更新中..." : "パスワードを更新する"}
          </button>
        </form>
      )}
    </main>
  );
}
