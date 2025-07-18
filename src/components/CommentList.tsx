"use client";

import { useEffect, useState, useRef } from "react";
import CommentForm from "./CommentForm";
import { Reply } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Comment = {
  id: string;
  body: string;
  author_name: string;
  created_at: string;
  parent_comment_id: string | null;
  serial_number: number;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
}

export default function CommentList({ threadId }: { threadId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyFormVisible, setReplyFormVisible] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("thread_id", threadId)
      .order("serial_number", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setComments(data || []);
  };

  useEffect(() => {
    fetchComments();
  }, [threadId]);

  const toggleReplyForm = (commentId: string) => {
    setReplyFormVisible((prev) => (prev === commentId ? null : commentId));
  };

  const parentComments = comments.filter(
    (comment) => comment.parent_comment_id === null
  );

  const getReplies = (parentId: string) => {
    return comments.filter(
      (comment) => comment.parent_comment_id === parentId
    );
  };

  const isCommentLimitReached = comments.length >= 1000;

  if (comments.length === 0) {
    return (
      <>
        <hr />
        <h2 className="text-center text-xl font-bold text-primary mb-4 mt-12">
          💬 気軽にコメントしてみよう！
        </h2>
        {!isCommentLimitReached && (
          <CommentForm threadId={threadId} onSubmitted={fetchComments} />
        )}
        {isCommentLimitReached && (
          <p className="text-center text-red-500 mt-4">
            このスレッドはコメント上限（1000件）に達しています。
          </p>
        )}
      </>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-center text-xl font-bold text-primary mb-4">
        💬 みんなのコメント
      </h2>

      {/* 📜 下に移動ボタン */}
<div className="text-center mb-4">
  <button
    onClick={scrollToBottom}
    className="px-4 py-2 bg-secondary text-text rounded-full shadow-sm hover:bg-text transition hover:text-white"
  >
    一番下のコメントに移動
  </button>
</div>


      {!isCommentLimitReached && (
        <div className="mb-4">
          <CommentForm threadId={threadId} onSubmitted={fetchComments} />
        </div>
      )}

      {isCommentLimitReached && (
        <p className="text-center text-red-500 mb-4">
          このスレッドはコメント上限（1000件）に達しています。
        </p>
      )}

      {parentComments.map((parent) => {
        const replies = getReplies(parent.id);

        return (
          <div key={parent.id}>
            {/* 親コメント */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-400 mb-1">
                ID.{parent.serial_number}
              </div>

              <div className="text-gray-800 whitespace-pre-wrap mb-3">
                {parent.body}
              </div>

              <div className="flex justify-between items-center text-xs text-primary">
                {!isCommentLimitReached && (
                  <button
                    className="flex items-center gap-1 text-primary hover:underline transition"
                    onClick={() => toggleReplyForm(parent.id)}
                  >
                    <Reply size={16} />
                    <span>返信</span>
                  </button>
                )}
                <div className="text-right">
                  {parent.author_name
                    ? `投稿者：${parent.author_name}`
                    : "投稿者：名無しの創作者さん"} ／{" "}
                  {formatDate(parent.created_at)}
                </div>
              </div>

              {/* 返信フォーム */}
              {!isCommentLimitReached &&
                replyFormVisible === parent.id && (
                  <div className="mt-3">
                    <CommentForm
                      threadId={threadId}
                      parentId={parent.id}
                      onSubmitted={() => {
                        setReplyFormVisible(null);
                        fetchComments();
                      }}
                    />
                  </div>
                )}
            </div>

            {/* 返信コメント */}
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="ml-6 mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-[#1e3932]"
              >
                <div className="text-xs text-gray-400 mb-1">
                  ID.{reply.serial_number}
                </div>
                <div className="text-gray-800 whitespace-pre-wrap mb-3">
                  {reply.body}
                </div>
                <div className="text-right text-xs text-primary">
                  {reply.author_name || "名無しの創作者さん"} ・{" "}
                  {new Date(reply.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* 📍 最下部スクロール用 */}
      <div ref={bottomRef} />
    </div>
  );
}
