"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";

type CreditSummaryData = {
  monthly_used: number;
  monthly_total: number;
  monthly_remaining: number;
  next_reset_date: string;
  lifetime_used: number;
  lifetime_total: number;
  lifetime_remaining: number;
};

export function CreditSummary() {
  const supabase = createSupabaseClient();
  const [data, setData] = useState<CreditSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Error fetching user:", authError);
        setLoading(false);
        return;
      }

      const { data: summary, error } = await supabase
        .rpc("get_credit_summary", { user_uuid: user.id })
        .single<CreditSummaryData>();

      if (error) {
        console.error("Error fetching credit summary:", error);
      } else {
        setData(summary);
      }
      setLoading(false);
    }
    fetchSummary();
  }, [supabase]);

  if (loading) return <div>Carregando créditos…</div>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Créditos Mensais */}
      <div className="p-4 bg-white border rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Créditos Mensais</span>
          <span className="text-sm text-gray-500">
            Renova em {new Date(data.next_reset_date).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-2">
          <progress
            className="w-full"
            value={data.monthly_used}
            max={data.monthly_total}
          />
          <div className="flex justify-between text-sm mt-1">
            <span>Usados: {data.monthly_used}</span>
            <span>Restam: {data.monthly_remaining}</span>
          </div>
        </div>
      </div>

      {/* Créditos Vitalícios */}
      <div className="p-4 bg-white border rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Créditos Vitalícios</span>
          <span className="text-sm text-gray-500">Não expiram</span>
        </div>
        <div className="mt-2">
          <progress
            className="w-full"
            value={data.lifetime_used}
            max={data.lifetime_total}
          />
          <div className="flex justify-between text-sm mt-1">
            <span>Usados: {data.lifetime_used}</span>
            <span>Restam: {data.lifetime_remaining}</span>
          </div>
        </div>
      </div>
    </div>
  );
}