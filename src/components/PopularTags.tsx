// components/PopularTags.tsx
import { Tag } from "@/types";
import Link from "next/link";

export function PopularTags({ tags }: { tags: Tag[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {tags.map((tag) => (
<Link
  key={tag.id}
  href={`/search?tag=${encodeURIComponent(tag.id)}`}
  className="bg-accent text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-300 transition"
>
  #{tag.name}
</Link>

      ))}
    </div>
  );
}
