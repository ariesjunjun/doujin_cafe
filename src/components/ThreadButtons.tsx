"use client";

import { useRouter } from "next/navigation";

export function ThreadButtons() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center mt-12">
      <button
        onClick={() => router.push("/threads/new")}
        className="px-5 py-3 bg-primary text-white font-semibold rounded-full hover:bg-text transition-colors duration-200"
      >
        スレッドを作成する
      </button>
      <button
        onClick={() => router.push("/")}
        className="px-5 py-3 border-1 border border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors duration-200"
      >
        TOPに戻る
      </button>
    </div>
  );
}
