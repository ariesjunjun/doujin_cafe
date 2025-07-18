import dynamic from "next/dynamic";

// クライアント専用コンポーネントを動的に読み込む（SSRしない）
const LoginClient = dynamic(() => import("./LoginClient"), { ssr: false });

export default function LoginPage() {
  return <LoginClient />;
}
