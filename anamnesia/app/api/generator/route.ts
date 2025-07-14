import { createUpdateClient } from "@/utils/update/server";

export async function POST() {
  const client = await createUpdateClient();
  const subscriptionTypes = ["pro", "premium", "basic"];

  let hasAccess = false;
  let error = null;

  // Verifica cada tipo de assinatura até encontrar uma ativa
  for (const subType of subscriptionTypes) {
    const { data, error: subError } = await client.entitlements.check(subType);
    if (subError) {
      error = subError;
      break; // Sai do loop se houver erro
    }
    if (data.hasAccess) {
      hasAccess = true;
      break; // Sai do loop se encontrar uma assinatura ativa
    }
  }

  // Retorna erro 500 se houve falha na verificação
  if (error) {
    return new Response("Error fetching subscriptions", { status: 500 });
  }

  // Retorna erro 403 se nenhuma assinatura está ativa
  if (!hasAccess) {
    return new Response("Sem assinaturas ativas (pro, premium, ou basic)", { status: 403 });
  }

  // Prossegue com a chamada à The Cat API se houver acesso
  const response = await fetch("https://api.thecatapi.com/v1/images/search");
  const json = await response.json();
  return new Response(JSON.stringify(json));
}