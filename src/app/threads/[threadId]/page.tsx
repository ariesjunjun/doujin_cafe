import ClientThreadContent from "@/components/ClientThreadContent";

type ThreadPageProps = {
  params: { threadId: string } | Promise<{ threadId: string }>;
};

export default async function ThreadPage({ params }: ThreadPageProps) {
  // paramsがPromiseならawait
  const resolvedParams = await params;
  return <ClientThreadContent threadId={resolvedParams.threadId} />;
}
