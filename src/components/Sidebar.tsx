import { PopularTags } from "@/components/PopularTags";
import SearchBox from "./SearchBox";
import { CreateThreadButton } from "@/components/CreateThreadButton";
import { tagList } from "@/components/TagList";


export function Sidebar() {
  return (
    <aside className="w-full">
      {/* PC（md以上）のときだけ表示 */}
      <div className="hidden md:block">
        <CreateThreadButton />
      </div>
      <SearchBox />

<div className="py-1">
      <PopularTags tags={tagList} />
</div>

    </aside>
  );
}
