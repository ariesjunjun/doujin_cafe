// src/app/api/report/route.ts (app router)
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: Request) {
  const { threadId, reason } = await req.json();



  const { error } = await supabase.from("reports").insert({
    thread_id: threadId,
    reason,
  });

  if (error) {
    console.error("通報エラー", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
