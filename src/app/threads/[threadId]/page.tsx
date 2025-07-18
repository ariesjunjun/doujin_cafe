import ClientThreadContent from "@/components/ClientThreadContent";

export default async function ThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  return <ClientThreadContent threadId={params.threadId} />;
}
