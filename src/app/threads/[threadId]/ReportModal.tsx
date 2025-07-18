"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"

export function ReportModal({
  threadId,
  onClose,
}: {
  threadId: string;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!reason) return;

    setLoading(true);

    const { error } = await supabase.from("reports").insert({
      thread_id: threadId,
      reason,
    });

    setLoading(false);

if (error) {
  console.error("Supabase Insert Error:", error);
  alert("通報の送信に失敗しました: " + error.message);
} else {
  alert("通報を送信しました！");
}

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4 text-primary">通報する</h2>

        <label className="block text-sm text-gray-700 mb-2">
          通報理由
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="block w-full border-gray-300 rounded mt-1"
          >
            <option value="">選択してください</option>
            <option value="不適切な表現">不適切な表現</option>
            <option value="スパム">スパム</option>
            <option value="著作権侵害">著作権侵害</option>
            <option value="その他">その他</option>
          </select>
        </label>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason || loading}
            className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-[#163029] disabled:opacity-50"
          >
            {loading ? "送信中..." : "通報する"}
          </button>
        </div>
      </div>
    </div>
  );
}
