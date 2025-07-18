import ClientThreadContent from "@/components/ClientThreadContent";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  return <ClientThreadContent threadId={threadId} />;
}
