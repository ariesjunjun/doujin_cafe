// app/logout-complete/page.tsx
import dynamic from "next/dynamic";

const LogoutCompleteClient = dynamic(
  () => import("./LogoutCompleteClient"),
  { ssr: false }
);

export default function LogoutCompletePage() {
  return <LogoutCompleteClient />;
}
