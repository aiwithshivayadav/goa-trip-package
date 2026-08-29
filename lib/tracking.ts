declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

function fbq(...args: unknown[]) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
}

export function trackViewItem(item: {
  id: string;
  name: string;
  category: string;
  price: number;
}) {
  gtag("event", "view_item", {
    currency: "INR",
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, item_category: item.category, price: item.price }],
  });
  fbq("track", "ViewContent", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: item.price,
    currency: "INR",
  });
}

export function trackBeginCheckout(item: {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}) {
  gtag("event", "begin_checkout", {
    currency: "INR",
    value: item.price * item.quantity,
    items: [{ item_id: item.id, item_name: item.name, item_category: item.category, price: item.price, quantity: item.quantity }],
  });
  fbq("track", "InitiateCheckout", {
    content_ids: [item.id],
    content_name: item.name,
    value: item.price * item.quantity,
    currency: "INR",
    num_items: item.quantity,
  });
}

export function trackPurchase(order: {
  transactionId: string;
  value: number;
  itemId: string;
  itemName: string;
  category: string;
  quantity: number;
}) {
  gtag("event", "purchase", {
    transaction_id: order.transactionId,
    currency: "INR",
    value: order.value,
    items: [{ item_id: order.itemId, item_name: order.itemName, item_category: order.category, quantity: order.quantity }],
  });
  gtag("event", "conversion", {
    send_to: "AW-16848391068/purchase",
    transaction_id: order.transactionId,
    value: order.value,
    currency: "INR",
  });
  fbq("track", "Purchase", {
    content_ids: [order.itemId],
    content_name: order.itemName,
    value: order.value,
    currency: "INR",
    num_items: order.quantity,
  });
}

export function trackLead(lead: {
  productName: string;
  productId: string;
  value?: number;
}) {
  gtag("event", "generate_lead", {
    currency: "INR",
    value: lead.value ?? 0,
  });
  gtag("event", "conversion", {
    send_to: "AW-16848391068/lead",
    value: lead.value ?? 0,
    currency: "INR",
  });
  fbq("track", "Lead", {
    content_name: lead.productName,
    content_ids: [lead.productId],
    value: lead.value ?? 0,
    currency: "INR",
  });
}
