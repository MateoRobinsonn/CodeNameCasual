const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

type WhatsAppButtonProps = {
  message?: string;
  className?: string;
};

/**
 * Renders nothing until NEXT_PUBLIC_WHATSAPP_NUMBER is configured, so the
 * storefront never leaks a personal number or points at a dead link.
 */
export function WhatsAppButton({ message, className }: WhatsAppButtonProps) {
  if (!WHATSAPP_NUMBER) return null;

  const href = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
  if (message) href.searchParams.set("text", message);

  return (
    <a
      href={href.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      }
    >
      Escríbenos
    </a>
  );
}
