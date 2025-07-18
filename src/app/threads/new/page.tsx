// threads/new/page.tsx

import dynamic from "next/dynamic";

// クライアントコンポーネントを動的import（SSRなし）
const NewThreadClient = dynamic(() => import("./NewThreadClient"), {
  ssr: false,
});

export default function NewThreadPage() {
  return <NewThreadClient />;
}
