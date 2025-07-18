// app/comments/confirm/page.tsx

import dynamic from "next/dynamic";

// クライアントコンポーネントを動的import（サーバー側でレンダリングしない）
const CommentConfirmClient = dynamic(
  () => import("./CommentConfirmClient"),
  { ssr: false }
);

export default function CommentConfirmPage() {
  return <CommentConfirmClient />;
}
