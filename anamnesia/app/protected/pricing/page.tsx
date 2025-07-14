import { createUpdateClient } from "@/utils/update/server";
import PricingContent from "@/components/pricing-content";

export default async function PricingPage() {
  const client = await createUpdateClient();
  const { data, error } = await client.billing.getProducts();
  const { data: subscriptionData } = await client.billing.getSubscriptions();

  if (error) {
    return <div>Erro ao carregar as assinaturas. Tente novamente.</div>;
  }

  const currentProductId =
    subscriptionData.subscriptions == null ||
    subscriptionData.subscriptions.length === 0
      ? null
      : subscriptionData.subscriptions[0].product.id;

  return (
    <>
      <div>
        <h1 className="text-2xl font-medium">Planos disponíveis</h1>
        <p className="text-muted-foreground mt-2">
          Escolha o plano que melhor se ajusta às suas necessidades.
        </p>
      </div>

      <PricingContent
        products={data.products}
        currentProductId={currentProductId}
      />
    </>
  );
}
