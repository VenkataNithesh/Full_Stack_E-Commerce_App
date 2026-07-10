const API = "http://localhost:8080/api/products";
const ORDER_API = "http://localhost:8080/api/orders";
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartDiv = document.getElementById("cart-items");

function goToAdmin(){
  if (sessionStorage.getItem("admin_logged_in") === "true") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "admin-login.html";
  }
}
// Display cart items
cart.forEach(item => {
  fetch(`${API}/${item.id}`)
    .then(res => res.json())
    .then(p => {
      const productCard = document.createElement("div");
      productCard.className = "cart-card";
      productCard.innerHTML = `
        <img src="${p.imageUrl}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p><strong>Price:</strong> ₹${p.price}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        <p><strong>Total:</strong> ₹${item.quantity * p.price}</p>
      `;
      cartDiv.appendChild(productCard);
    });
});

// Handle checkout form submission
document.getElementById("checkout-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = this.name.value;
  const email = this.email.value;
  const address = this.address.value;

  let itemsToSave = [];

  for (let item of cart) {
    const res = await fetch(`${API}/${item.id}`);
    const product = await res.json();
    itemsToSave.push({
      productId: item.id,
      quantity: item.quantity,
      price: product.price
    });
  }

  const orderData = {
    name,
    email,
    address,
    items: itemsToSave
  };

  fetch(ORDER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to place order");
      return res.text();
    })
    .then(msg => {
      alert(msg);
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
});

// Update cart count badge in header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countBadge = document.getElementById("cart-count");

  if (countBadge) {
    if (total > 0) {
      countBadge.innerText = total;
      countBadge.style.display = "inline-block";
    } else {
      countBadge.style.display = "none";
    }
  }
}
  

document.addEventListener("DOMContentLoaded", updateCartCount);
