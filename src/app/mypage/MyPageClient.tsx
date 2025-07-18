"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AvatarUpload from "@/components/AvatarUpload";

export default function MyPageClient() {
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

        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select(`*, threads ( title )`)
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
    return <div className="max-w-xl mx-auto mt-10 text-center">ロード中...</div>;
  }

  return (
    <main className="max-w-2xl mx-auto mt-10 p-4">
      {/* （元のUIコードはそのまま） */}
      {/* ... */}
    </main>
  );
}
