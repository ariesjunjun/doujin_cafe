import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-white text-center text-xs md:text-sm py-6 mt-10">
      <div className="max-w-4xl mx-auto space-y-2 px-4">
        <div className="font-semibold">
          © 2025 DOUJIN CAFE All rights reserved.
        </div>
        <div className="text-white/80">
        創作者のための、お悩み相談・おしゃべりコミュニティ
        </div>

        <div className="flex justify-center flex-wrap gap-4 pt-2">
          <Link
            href="/privacy"
            className="hover:underline hover:text-white/90 transition"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/about"
            className="hover:underline hover:text-white/90 transition"
          >
            サイトについて
          </Link>
        </div>
      </div>
    </footer>
  );
}
