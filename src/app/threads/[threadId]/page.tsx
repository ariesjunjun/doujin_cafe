import ClientThreadContent from "@/components/ClientThreadContent";

export default function ThreadPage({ params }: { params: { threadId: string } }) {
  return <ClientThreadContent threadId={params.threadId} />;
}
