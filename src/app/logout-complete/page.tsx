"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutCompletePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000); // 2秒後にTOPへ遷移

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="max-w-xl mx-auto mt-10 p-4 text-center">
      <h1 className="text-2xl font-bold text-primary mb-4">
        ログアウトしました
      </h1>
      <p className="text-gray-700">
        トップページに移動します…
      </p>
    </main>
  );
}
