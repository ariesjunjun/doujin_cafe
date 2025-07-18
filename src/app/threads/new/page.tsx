// threads/new/page.tsx

import React, { Suspense } from "react";
import NewThreadClient from "./NewThreadClient";

export default function NewThreadPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <NewThreadClient />
    </Suspense>
  );
}
