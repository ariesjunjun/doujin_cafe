"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterClient() {
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
      {/* ここに元のJSXをそのまま貼り付けてください */}
      {/* ...省略 */}
    </main>
  );
}
