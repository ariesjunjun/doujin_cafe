"use client";
import { useState } from "react";

type Props = {
  threadId: string;
  onClose: () => void;
};

export function ReportModal({ threadId, onClose }: Props) {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;

    const res = await fetch("/api/report", {
      method: "POST",
      body: JSON.stringify({ threadId, reason }),
    });

    if (res.ok) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full">
        {submitted ? (
          <p className="text-green-600">通報が送信されました。ご協力ありがとうございます！</p>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4">通報の理由</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="例: 差別的な表現が含まれている"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={onClose} className="text-sm text-gray-600 hover:underline">
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                通報する
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
