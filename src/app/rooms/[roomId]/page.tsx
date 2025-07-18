import React, { Suspense } from "react";
import RoomClient from "./RoomClient";

export default function RoomPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomClient />
    </Suspense>
  );
}
