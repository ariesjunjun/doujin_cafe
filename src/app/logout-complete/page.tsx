import React, { Suspense } from "react";
import LogoutCompleteClient from "./LogoutCompleteClient";

export default function LogoutCompletePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogoutCompleteClient />
    </Suspense>
  );
}
