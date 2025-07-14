import { Spinner } from "@/components/ui/spinner";

export default function PricingLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-medium mb-4">Faça upgrade no seu plano</h1>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Spinner className="w-6 h-6" />
          <p className="text-muted-foreground">Carregando planos...</p>
        </div>
      </div>
    </div>
  );
} 