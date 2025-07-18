import React, { Suspense } from "react";
import CommentSuccessClient from "./CommentSuccessClient";

export default function CommentSuccessPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <CommentSuccessClient />
    </Suspense>
  );
}
