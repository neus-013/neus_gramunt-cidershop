const API_BASE = "http://localhost:4000/api";

export async function createCart() {
  const res = await fetch(`${API_BASE}/carts`, { method: "POST" });
  return res.json();
}

export async function addToCart(cartId, productId, quantity = 1) {
  const res = await fetch(`${API_BASE}/carts/${cartId}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
  return res.json();
}

export async function viewCart(cartId) {
  const res = await fetch(`${API_BASE}/carts/${cartId}`);
  return res.json();
}

export async function checkout(cartId) {
  const res = await fetch(`${API_BASE}/carts/${cartId}/checkout`, {
    method: "POST",
  });
  return res.json();
}

export async function viewProduct(productId){
    const res = await fetch(`${API_BASE}/products/${productId}`);
    return res.json();
}