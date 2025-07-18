// app/update-password/page.tsx

import React, { Suspense } from "react";
import UpdatePasswordClient from "./UpdatePasswordClient";

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <UpdatePasswordClient />
    </Suspense>
  );
}
