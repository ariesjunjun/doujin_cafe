"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("セッション取得エラー:", error);
        alert("ログインに失敗しました");
        router.push("/login");
        return;
      }

      const user = session?.user;

      if (user) {
        // profilesに既にレコードがあるか確認
        const { data: existingProfile, error: selectError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (selectError && selectError.code !== "PGRST116") {
          // PGRST116 = no rows returned
          console.error("プロフィール確認エラー:", selectError);
          alert("プロフィール確認に失敗しました");
          router.push("/login");
          return;
        }

        if (!existingProfile) {
          const userId = `user_${Math.random().toString(36).substring(2, 10)}`;
          const username =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "No Name";

          const { error: insertError } = await supabase.from("profiles").insert([
            {
              id: user.id,
              username,
              birthday: null,
              user_id: userId,
            },
          ]);

          if (insertError) {
            console.error("プロフィール作成エラー:", insertError);
            alert("プロフィール作成に失敗しました");
            router.push("/login");
            return;
          }
        }

        // 完了したら任意のページへ遷移
        router.push("/");
      } else {
        console.error("ユーザー情報が取得できませんでした");
        router.push("/login");
      }
    };

    handleOAuthCallback();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-700">ログイン処理中...</p>
    </div>
  );
}
