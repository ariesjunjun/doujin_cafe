import React, { Suspense } from "react";
import MyPageClient from "./MyPageClient";

export default function MyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyPageClient />
    </Suspense>
  );
}
