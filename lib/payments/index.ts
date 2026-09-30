import { WompiProvider } from "@/lib/payments/wompi";
import type { PaymentProvider } from "@/lib/payments/types";

export type { PaymentProvider, CheckoutRequest, NormalizedWebhookEvent } from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProvider {
  return new WompiProvider();
}
