// app/comments/success/page.tsx
import dynamic from "next/dynamic";

// クライアントコンポーネントを動的import（SSR無効化）
const CommentSuccessClient = dynamic(() => import("./CommentSuccessClient"), {
  ssr: false,
});

export default function CommentSuccessPage() {
  return <CommentSuccessClient />;
}
