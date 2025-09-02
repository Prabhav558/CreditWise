import { supa } from "@/lib/supa";

export async function askCreditWise(message: string) {
  const { data, error } = await supa.functions.invoke("chat", {
    body: { message }
  });
  if (error) throw error;
  return data as { answer: string; sources?: any[] };
}