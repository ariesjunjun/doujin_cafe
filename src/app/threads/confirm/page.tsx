// threads/confirm/page.tsx

import React, { Suspense } from "react";
import ThreadConfirmClient from "./ThreadConfirmClient";

export default function ThreadConfirmPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ThreadConfirmClient />
    </Suspense>
  );
}
