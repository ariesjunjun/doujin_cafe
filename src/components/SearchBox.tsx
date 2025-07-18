"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchForm() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert("検索ワードを入力してください！");
      return;
    }

    router.push(`/search?query=${encodeURIComponent(keyword.trim())}`);
  };

return (
  <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
<input
  type="text"
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}
  placeholder="サイト内検索"
  className="border border-primary focus:border-primary focus:outline-none focus:ring-0 p-1 h-12 rounded w-full text-gray-800"
/>

    <button
      type="submit"
      className="bg-primary text-white px-3 py-1 h-12 rounded hover:bg-text flex items-center justify-center"
    >
      <Search size={20} />
    </button>
  </form>
);


}
