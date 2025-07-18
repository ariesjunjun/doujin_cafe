"use client";

import { useEffect } from "react";

type ThreadPageProps = {
  threadId: string;
};

export default function ThreadPage({ threadId }: ThreadPageProps) {
  useEffect(() => {
    console.log("Load comments only once for threadId", threadId);
    // fetch comments etc.
  }, [threadId]);

  return (
    <div>
      <h1>Thread {threadId}</h1>
      {/* コメント表示 */}
    </div>
  );
}
