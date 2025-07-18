// threads/confirm/page.tsx

import dynamic from "next/dynamic";

// クライアントコンポーネントを動的importしてSSR無効化
const ThreadConfirmClient = dynamic(() => import("./ThreadConfirmClient"), {
  ssr: false,
});

export default function ThreadConfirmPage() {
  return <ThreadConfirmClient />;
}
