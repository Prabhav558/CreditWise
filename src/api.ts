import { supabase } from "@/integrations/supabase/client";

export async function askCreditWise(message: string) {
  const { data, error } = await supabase.functions.invoke("chat", {
    body: { message }
  });
  if (error) throw error;
  return data as { answer: string; sources?: any[] };
}