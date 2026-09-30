import { createHash } from "node:crypto";
import type {
  CheckoutRequest,
  NormalizedWebhookEvent,
  PaymentProvider,
} from "@/lib/payments/types";

// TODO: this follows Wompi Colombia's publicly documented Web Checkout and
// events integration as of this writing. Re-verify the integrity signature
// and webhook checksum recipes against https://docs.wompi.co before
// processing real payments — do not trust this without checking current docs.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. See .env.example.`);
  return value;
}

export class WompiProvider implements PaymentProvider {
  buildCheckoutUrl(request: CheckoutRequest): string {
    const publicKey = requireEnv("WOMPI_PUBLIC_KEY");
    const integritySecret = requireEnv("WOMPI_INTEGRITY_SECRET");
    const currency = "COP";

    const signaturePayload = `${request.reference}${request.amountCopMinor}${currency}${integritySecret}`;
    const signature = createHash("sha256")
      .update(signaturePayload)
      .digest("hex");

    const params = new URLSearchParams({
      "public-key": publicKey,
      "currency": currency,
      "amount-in-cents": String(request.amountCopMinor),
      "reference": request.reference,
      "signature:integrity": signature,
      "redirect-url": request.redirectUrl,
      "customer-data:email": request.buyerEmail,
    });

    return `https://checkout.wompi.co/p/?${params.toString()}`;
  }

  verifyWebhookSignature(rawBody: string): boolean {
    const eventsSecret = requireEnv("WOMPI_EVENTS_SECRET");
    const event = JSON.parse(rawBody);

    const properties: string[] = event?.signature?.properties ?? [];
    const checksum: string | undefined = event?.signature?.checksum;
    const timestamp: number | undefined = event?.timestamp;
    if (!checksum || !timestamp || properties.length === 0) return false;

    const values = properties
      .map((path) => getByPath(event.data, path.replace(/^data\./, "")))
      .join("");

    const computed = createHash("sha256")
      .update(`${values}${timestamp}${eventsSecret}`)
      .digest("hex");

    return computed.toLowerCase() === checksum.toLowerCase();
  }

  parseWebhookEvent(rawBody: string): NormalizedWebhookEvent {
    const event = JSON.parse(rawBody);
    const transaction = event?.data?.transaction;
    if (!transaction) throw new Error("Malformed Wompi webhook payload.");

    const statusMap: Record<string, NormalizedWebhookEvent["status"]> = {
      APPROVED: "approved",
      DECLINED: "declined",
      PENDING: "pending",
      VOIDED: "voided",
      ERROR: "error",
    };

    return {
      eventId: `${transaction.id}:${event.timestamp}`,
      reference: transaction.reference,
      providerTransactionId: transaction.id,
      status: statusMap[transaction.status] ?? "error",
      amountCopMinor: transaction.amount_in_cents,
    };
  }
}

function getByPath(obj: unknown, path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
      obj,
    );
  return value === undefined || value === null ? "" : String(value);
}
