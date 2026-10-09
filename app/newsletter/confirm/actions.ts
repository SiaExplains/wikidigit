"use server";

import { getEmailConfig } from "@/lib/email/config";
import { handleConfirm, type ConfirmResult } from "@/lib/email/handlers";

export async function confirmSubscription(_prev: ConfirmResult | null, formData: FormData): Promise<ConfirmResult> {
  const config = getEmailConfig();
  if (!config) return "error";
  return handleConfirm(formData.get("token"), config);
}
