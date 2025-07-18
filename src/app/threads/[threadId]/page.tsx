import ClientThreadContent from "@/components/ClientThreadContent";

type ThreadPageProps = {
  params: {
    threadId: string;
  };
};

export default function ThreadPage({ params }: ThreadPageProps) {
  // サーバーコンポーネントなのでクライアント用コンポーネントを呼び出すだけ
  return <ClientThreadContent threadId={params.threadId} />;
}
