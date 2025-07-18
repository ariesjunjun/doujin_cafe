import ClientThreadContent from "@/components/ClientThreadContent";

type ThreadPageProps = {
  params: { threadId: string };
};

export default async function ThreadPage({ params }: ThreadPageProps) {
  // async関数にするだけでOK
  return <ClientThreadContent threadId={params.threadId} />;
}
