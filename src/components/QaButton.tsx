"use client";

import Link from "next/link";

export default function QaButton() {
  return (
    <Link href="/qa">
      <button
        className="
          w-full
          max-w-xs
          bg-primary
          text-white
          text-base
          font-semibold
          py-3
          px-8
          rounded-full
          hover:bg-text
          transition
          my-8
          mx-auto
          block
          text-center
        "
      >
        Q&Aを見る
      </button>
    </Link>
  );
}
