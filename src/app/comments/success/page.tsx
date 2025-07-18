"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CommentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const threadId = searchParams.get("threadId");

  useEffect(() => {
    if (!threadId) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      router.push(`/threads/${threadId}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, threadId]);

  return (
    <main className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="bg-white border border-[#1e3932]/20 rounded-xl p-8 shadow-md max-w-md w-full text-center animate-fadeIn">
        <h1 className="text-2xl font-bold text-primary mb-4">
          コメントを投稿しました！
        </h1>
        <p className="text-gray-700 mb-6">
          数秒後にスレッドに戻ります...
        </p>
        <p className="text-sm text-primary">
          ※戻らない場合{" "}
          <button
            onClick={() => router.push(`/threads/${threadId}`)}
            className="underline hover:text-[#163028] transition"
          >
            こちらをクリック
          </button>
        </p>
      </div>
    </main>
  );
}
