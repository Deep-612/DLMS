import { notFound } from "next/navigation"
import { ReviewPage } from "@/components/review/review-page"
import { MOCK_DOCUMENTS } from "@/lib/mock-data"

type Props = {
  params: Promise<{ docId: string }>
}

export default async function Page({ params }: Props) {
  const { docId } = await params
  const document = MOCK_DOCUMENTS.find((d) => d.id === docId)
  if (!document) notFound()
  return <ReviewPage document={document} />
}
