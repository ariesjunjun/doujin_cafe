import dynamic from "next/dynamic";

// クライアントコンポーネントを動的import（SSR無効化）
const RoomClient = dynamic(() => import("./RoomClient"), { ssr: false });

export default function RoomPage() {
  return <RoomClient />;
}
