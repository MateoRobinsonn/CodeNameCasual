// Hand-written to match supabase/migrations/0001_init.sql. Once the project
// is linked, prefer regenerating this with:
//   npx supabase gen types typescript --linked > lib/supabase/types.ts

export type ProductStatus = "draft" | "published" | "archived";
export type PaymentStatus =
  | "pending"
  | "approved"
  | "declined"
  | "expired"
  | "refunded"
  | "voided";
export type FulfillmentStatus =
  | "awaiting_payment"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "refunded";
export type NotificationChannel = "email" | "sms";
export type NotificationRecipient = "buyer" | "seller";
export type NotificationStatus = "pending" | "sent" | "failed";

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          category: string;
          status: ProductStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          slug: string;
          name: string;
          category: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          path: string;
          sort_order: number;
          alt_text: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["product_images"]["Row"]
        > & { product_id: string; path: string };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          size: string;
          color: string;
          price_cop_minor: number;
          stock_on_hand: number;
          active: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["variants"]["Row"]> & {
          product_id: string;
          sku: string;
          size: string;
          color: string;
          price_cop_minor: number;
        };
        Update: Partial<Database["public"]["Tables"]["variants"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          buyer_name: string;
          buyer_phone: string;
          buyer_email: string;
          buyer_department: string;
          buyer_municipality: string;
          buyer_address: string;
          buyer_notes: string | null;
          subtotal_cop_minor: number;
          shipping_cop_minor: number;
          total_cop_minor: number;
          payment_status: PaymentStatus;
          fulfillment_status: FulfillmentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & {
          order_number: string;
          buyer_name: string;
          buyer_phone: string;
          buyer_email: string;
          buyer_department: string;
          buyer_municipality: string;
          buyer_address: string;
          subtotal_cop_minor: number;
          shipping_cop_minor: number;
          total_cop_minor: number;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string | null;
          sku: string;
          product_name: string;
          size: string;
          color: string;
          price_cop_minor: number;
          quantity: number;
        };
        Insert: Partial<Database["public"]["Tables"]["order_items"]["Row"]> & {
          order_id: string;
          sku: string;
          product_name: string;
          size: string;
          color: string;
          price_cop_minor: number;
          quantity: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "variants";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          provider: string;
          provider_reference: string;
          provider_transaction_id: string | null;
          status: PaymentStatus;
          amount_cop_minor: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]> & {
          order_id: string;
          provider: string;
          provider_reference: string;
          amount_cop_minor: number;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      shipments: {
        Row: {
          id: string;
          order_id: string;
          carrier: string;
          guide_number: string | null;
          shipping_cost_cop_minor: number;
          status: string;
          tracking_url: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["shipments"]["Row"]> & {
          order_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["shipments"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          order_id: string;
          recipient_type: NotificationRecipient;
          channel: NotificationChannel;
          template: string;
          status: NotificationStatus;
          sent_at: string | null;
          provider_message_id: string | null;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["notifications"]["Row"]
        > & {
          order_id: string;
          recipient_type: NotificationRecipient;
          channel: NotificationChannel;
          template: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_events: {
        Row: {
          id: string;
          provider: string;
          event_id: string;
          payload: Record<string, unknown>;
          processed_at: string | null;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["payment_events"]["Row"]
        > & { provider: string; event_id: string; payload: Record<string, unknown> };
        Update: Partial<Database["public"]["Tables"]["payment_events"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
