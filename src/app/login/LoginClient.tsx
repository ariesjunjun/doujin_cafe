"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // エラーメッセージを日本語化する関数
  const translateErrorMessage = (message: string) => {
    switch (message) {
      case "Invalid login credentials":
        return "メールアドレスまたはパスワードが正しくありません。";
      case "Email not confirmed":
        return "メールアドレスが確認されていません。確認メールをご確認ください。";
      case "User already registered":
        return "このメールアドレスはすでに登録されています。";
      case "Invalid email or password":
        return "メールアドレスまたはパスワードが間違っています。";
      case "User not found":
        return "ユーザーが見つかりません。";
      case "User has been deleted":
        return "このユーザーアカウントは削除されています。";
      case "Network error":
        return "ネットワークエラーが発生しました。再度お試しください。";
      case "Invalid token":
        return "トークンが無効です。再度やり直してください。";
      case "Token has expired or is invalid":
        return "トークンが期限切れか無効です。再度ログインしてください。";
      default:
        return message || "不明なエラーが発生しました。";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(translateErrorMessage(error.message));
      console.error(error);
      setLoading(false);
    } else {
      alert("ログイン成功！");
      console.log(data);
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error(error);
      alert("Googleログインに失敗しました。");
      setLoading(false);
    } else {
      window.location.href = data.url;
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">
        ログイン
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3932]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3932]"
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
          {loading ? "ログイン中..." : "ログインする"}
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full border border-gray-300 py-2 rounded transition flex items-center justify-center gap-2 ${
            loading ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"
          }`}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span className="text-gray-700">
            {loading ? "処理中..." : "Googleでログイン"}
          </span>
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-4">
        パスワードをお忘れですか？{" "}
        <Link href="/reset-password" className="text-primary hover:underline">
          こちらから再設定
        </Link>
      </p>

      <p className="text-center text-sm text-gray-600 mt-2">
        <Link href="/register" className="text-primary hover:underline">
          新規登録はこちら
        </Link>
      </p>
    </main>
  );
}
