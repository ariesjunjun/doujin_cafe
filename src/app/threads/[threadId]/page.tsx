import ClientThreadContent from "@/components/ClientThreadContent";

type Props = {
  params: { threadId: string };
};

export default async function ThreadPage({ params }: Props) {
  return <ClientThreadContent threadId={params.threadId} />;
}
