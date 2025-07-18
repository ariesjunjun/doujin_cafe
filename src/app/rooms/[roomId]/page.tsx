"use client";

import { useParams } from "next/navigation";

export default function RoomPage() {
  const params = useParams();
  return (
    <div>
      <h1>Room Page</h1>
      <p>Room ID: {params.roomId}</p>
    </div>
  );
}
