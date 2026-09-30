export type CheckoutRequest = {
  orderId: string;
  reference: string;
  amountCopMinor: number;
  buyerEmail: string;
  redirectUrl: string;
};

export type NormalizedWebhookEvent = {
  eventId: string;
  reference: string;
  providerTransactionId: string;
  status: "approved" | "declined" | "pending" | "voided" | "error";
  amountCopMinor: number;
};

/**
 * Adapter boundary so a provider swap (Mercado Pago, Bold) only touches one
 * file, per AGENTS.md's "keep payment code behind an adapter" guidance.
 * Nothing calling this interface should know which provider is behind it.
 */
export interface PaymentProvider {
  /** Returns the URL to send the buyer to for hosted checkout. */
  buildCheckoutUrl(request: CheckoutRequest): string;

  /** Verifies the webhook's signature against the raw request body. */
  verifyWebhookSignature(rawBody: string): boolean;

  /** Parses a verified webhook body into a provider-agnostic shape. */
  parseWebhookEvent(rawBody: string): NormalizedWebhookEvent;
}
