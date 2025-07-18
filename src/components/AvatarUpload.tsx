"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AvatarUploadProps = {
  userId: string;
  avatarUrl: string | null;
  onUpload: (url: string) => void;
};

export default function AvatarUpload({
  userId,
  avatarUrl,
  onUpload,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("ファイルを選択してください");
      return;
    }

    if (!userId) {
      alert("ユーザーIDが取得できませんでした");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    setUploading(true);

    try {
      // 新しい画像をアップロード
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: false,
        });

      if (uploadError) {
        alert("画像のアップロードに失敗しました: " + uploadError.message);
        return;
      }

      // 公開URLを取得
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) {
        alert("画像URLの取得に失敗しました");
        return;
      }

      // キャッシュバスター付きURLを生成
      const newUrl = `${publicUrl}?t=${Date.now()}`;

      // URLを親に渡す
      onUpload(newUrl);

      // ユーザーのフォルダ内の画像一覧を取得して古い画像を削除（最新2件を残す）
      const { data: fileList, error: listError } = await supabase.storage
        .from("avatars")
        .list(userId, {
          sortBy: { column: "name", order: "desc" },
        });

      if (listError) {
        console.error("画像一覧の取得に失敗:", listError.message);
      } else if (fileList && fileList.length > 2) {
        // アップロード順に並んでいない可能性があるため、名前でソートして再確認
        const sorted = fileList
          .slice()
          .sort((a, b) => b.name.localeCompare(a.name));

        const filesToDelete = sorted
          .slice(2) // 最新2件を残す
          .map((file) => `${userId}/${file.name}`);

        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove(filesToDelete);

        if (deleteError) {
          console.error("古い画像の削除に失敗:", deleteError.message);
        }
      }
    } catch (e: any) {
      console.error("アップロード中にエラー:", e);
      alert("想定外のエラーが発生しました: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-24 h-24">
      <label className="cursor-pointer block w-full h-full rounded-full overflow-hidden">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-sm">
            No Image
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full text-white text-sm">
          アップロード中...
        </div>
      )}
    </div>
  );
}
