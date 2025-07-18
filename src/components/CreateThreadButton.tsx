"use client";

import Link from "next/link";

export function CreateThreadButton() {
  return (
<Link
  href="http://localhost:3000/threads/new"
  className="block bg-primary text-white text-sm font-semibold py-2 px-6 rounded-full hover:bg-text transition mb-4 mx-auto text-center"
>
  スレッドを作成する
</Link>
  );
}
