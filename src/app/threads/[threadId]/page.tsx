import ClientThreadContent from "@/components/ClientThreadContent";

interface ThreadPageProps {
  params: {
    threadId: string;
  };
}

// async関数にしてPromiseを返す形にする
export default async function ThreadPage({ params }: ThreadPageProps) {
  // もしサーバーでデータ取得があればここでawaitで実行

  return <ClientThreadContent threadId={params.threadId} />;
}
