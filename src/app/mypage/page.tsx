"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AvatarUpload from "@/components/AvatarUpload";


export default function MyPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editingUsername, setEditingUsername] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        router.push("/login");
        return;
      }
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
    };

    getUser();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // プロフィール取得
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error(profileError);
        } else {
          setProfile(profileData);
          setEditingUsername(profileData.username || "");
        }

        // スレッド取得
        const { data: threadsData, error: threadsError } = await supabase
          .from("threads")
          .select("*")
          .eq("author_id", user.id)
          .order("created_at", { ascending: false });

        if (threadsError) {
          console.error(threadsError);
        } else {
          setThreads(threadsData || []);
        }

        // コメント取得＋該当スレッドタイトルも取得（JOIN）
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select(`
            *,
            threads (
              title
            )
          `)
          .eq("author_id", user.id)
          .order("created_at", { ascending: false });

        if (commentsError) {
          console.error(commentsError);
        } else {
          setComments(commentsData || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSaveUsername = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ username: editingUsername })
      .eq("id", user.id);

    if (error) {
      alert("ユーザー名の更新に失敗しました");
      console.error(error);
    } else {
      alert("ユーザー名を更新しました");
      setProfile((prev: any) => ({
        ...prev,
        username: editingUsername,
      }));
      setIsEditingUsername(false);
    }
    setSaving(false);
  };

  const handleCancelEdit = () => {
    setEditingUsername(profile?.username || "");
    setIsEditingUsername(false);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        ロード中...
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">
        マイページ
      </h1>

<div className="p-6 mb-8 max-w-xl mx-auto flex flex-col items-center">
  {/* アバター中央揃え */}
  <div className="mb-6">
    <AvatarUpload
      userId={user?.id}
      avatarUrl={profile?.avatar_url}
      onUpload={async (url) => {
        console.log("onUpload url:", url);
        if (!url) return;

        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: url })
          .eq("id", user.id);

        if (error) {
          console.error(error);
          alert("プロフィール更新に失敗しました: " + error.message);
          return;
        }

        // クエリパラメータをつけてキャッシュ回避！
        const newUrl = url + `?t=${Date.now()}`;

        setProfile((prev: any) => ({
          ...prev,
          avatar_url: newUrl,
        }));

        alert("プロフィール画像を更新しました！");
      }}
    />
  </div>



    {/* プロフィール情報も中央揃え */}
<div className="w-full max-w-sm text-center space-y-4 mx-auto">
  {/* ユーザーID */}
  <div className="flex justify-center items-center gap-2">
    <span className="font-semibold">ID:</span>
    <span>{profile?.user_id || "未発行"}</span>
  </div>


    {/* ユーザー名 */}
    <div className="flex flex-wrap justify-center items-center gap-2">
      <span className="font-semibold">ユーザー名:</span>
      {isEditingUsername ? (
        <>
          <input
            type="text"
            value={editingUsername}
            onChange={(e) => setEditingUsername(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-64 text-center"
          />
          <button
            onClick={handleSaveUsername}
            disabled={saving}
            className={`px-3 py-1 rounded text-white ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-[#163029]"
            }`}
          >
            {saving ? "保存中..." : "保存"}
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-3 py-1 rounded border border-gray-400"
          >
            キャンセル
          </button>
        </>
      ) : (
        <>
          <span>{profile?.username || "未設定"}</span>
          <button
            onClick={() => setIsEditingUsername(true)}
            className="px-2 py-0.5 text-sm rounded text-white bg-primary hover:bg-text"
          >
            編集
          </button>
        </>
      )}
    </div>

    {/* 生年月日 */}
    <div className="flex justify-center items-center gap-2">
      <span className="font-semibold">生年月日:</span>
      {profile?.birthday ? (
        <span>{new Date(profile.birthday).toLocaleDateString()}</span>
      ) : (
        <span className="text-gray-500">未登録</span>
      )}
    </div>
  </div>
</div>




<div className="mb-8">
  <h2 className="text-lg font-semibold mb-2">自分の投稿</h2>
  {threads.length === 0 ? (
    <p className="text-gray-500">投稿がありません</p>
  ) : (
    <ul className="space-y-2">
      {threads.map((thread) => (
        <li key={thread.id} className="border p-4 rounded border-primary">
          <a
            href={`/threads/${thread.id}`}
            className="font-bold text-primary hover:underline"
          >
            {thread.title}
          </a>
          <p className="text-sm text-gray-600">
            {new Date(thread.created_at).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  )}
</div>


      <div>
        <h2 className="text-lg font-semibold mb-2">自分のコメント</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500">コメントがありません</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li key={comment.id} className="border p-4 rounded border-primary">
                <p>{comment.body}</p>
                <p className="text-sm text-gray-600">
                  投稿日: {new Date(comment.created_at).toLocaleString()}
                </p>
                {comment.threads ? (
                  <p className="text-sm mt-1">
                    スレッド:{" "}
                    <a
                      href={`/threads/${comment.thread_id}`}
                      className="text-primary hover:underline"
                    >
                      {comment.threads.title}
                    </a>
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">スレッド情報なし</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
