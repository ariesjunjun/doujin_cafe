import React, { Suspense } from "react";
import CommentConfirmClient from "./CommentConfirmClient";

export default function CommentConfirmPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <CommentConfirmClient />
    </Suspense>
  );
}
