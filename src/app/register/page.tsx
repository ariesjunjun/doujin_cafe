"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const generateUserId = () => {
    return `user_${Math.random().toString(36).substring(2, 10)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      console.error(error);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (user) {
      const userId = generateUserId();

      const { error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            username,
            birthday,
            user_id: userId,
          },
        ]);

      if (insertError) {
        console.error(insertError);
        alert("プロフィール保存に失敗しました");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    alert("登録用の確認メールを送信しました！");
    router.push("/login");
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error(error);
      alert("Googleログインに失敗しました");
    } else {
      window.location.href = data.url;
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-primary mb-8 text-center">
        会員登録
      </h1>
      <Link href="/qa"><p className="text-sm text-text mb-4 text-center hover:underline">会員登録で何ができるの？</p></Link>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ユーザー名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3932]"
              placeholder="ユーザー名は後から変更できます"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              生年月日
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3932]"
            />
            <p className="text-xs text-gray-500 mt-1">
              ※ 生年月日は後から変更できません
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              minLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3932]"
            />
            <p className="text-xs text-gray-500 mt-1">
              ※ パスワードは半角英数字・6文字以上で設定してください。
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded hover:bg-text transition"
          >
            {loading ? "登録中..." : "登録する"}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span className="text-gray-700">Googleで登録 / ログイン</span>
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6">
        すでにアカウントをお持ちですか？{" "}
        <Link href="/login" className="text-primary hover:underline">
          ログインはこちら
        </Link>
      </p>
    </main>
  );
}
