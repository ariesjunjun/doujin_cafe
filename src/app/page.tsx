// app/page.tsx
import { Suspense } from "react";
import ClientHomePage from "./ClientHomePage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientHomePage />
    </Suspense>
  );
}
