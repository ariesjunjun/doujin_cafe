// app/mypage/page.tsx
import dynamic from "next/dynamic";

const MyPageClient = dynamic(() => import("./MyPageClient"), { ssr: false });

export default function MyPage() {
  return <MyPageClient />;
}
