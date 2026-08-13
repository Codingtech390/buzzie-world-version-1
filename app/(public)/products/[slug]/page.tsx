import ComingSoonPage from "@/components/admin/ComingSoonPage";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <ComingSoonPage
      title={`Product: ${slug}`}
      description="The product detail page will be implemented here."
    />
  );
}
