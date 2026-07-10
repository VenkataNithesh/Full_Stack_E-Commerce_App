const API = "http://localhost:8080/api/products";
const form = document.getElementById("product-form");
const productList = document.getElementById("product-list");

if (sessionStorage.getItem("admin_logged_in") !== "true") {
  alert("Access denied. Please login.");
  window.location.href = "admin-login.html";
}

// Load existing products
fetch(API)
  .then(res => res.json())
  .then(data => {
    data.forEach(displayProduct);
  })
  .catch(err => console.error("Error loading products:", err));

// Save or update product
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const productId = document.getElementById("product-id").value;
  const product = {
    name: form.name.value,
    description: form.description.value,
    price: parseFloat(form.price.value),
    stock: parseInt(form.stock.value),
    imageUrl: form.imageUrl.value,
  };

  const url = productId ? `${API}/${productId}` : API;
  const method = productId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to save/update product");
      return res.json();
    })
    .then(() => location.reload())
    .catch(err => alert(err.message));
});

// Display a product in admin list
function displayProduct(p) {
  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `
    <img src="${p.imageUrl}" alt="${p.name}" width="100" />
    <h3>${p.name}</h3>
    <p>₹${p.price}</p>
    <p>Stock: ${p.stock}</p>
    <button onclick="editProduct(${p.id})">Edit</button>
    <button onclick="deleteProduct(${p.id})" style="background-color:red;color:white;">Delete</button>
  `;
  productList.appendChild(div);
}

// Edit a product
function editProduct(id) {
  fetch(`${API}/${id}`)
    .then(res => res.json())
    .then(p => {
      document.getElementById("product-id").value = p.id;
      form.name.value = p.name;
      form.description.value = p.description;
      form.price.value = p.price;
      form.stock.value = p.stock;
      form.imageUrl.value = p.imageUrl;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(err => alert("Failed to load product for edit"));
}

// Delete a product
function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(() => location.reload())
      .catch(err => alert("Failed to delete product"));
  }
}

// Update cart count in header
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
  document.getElementById("logout-btn").addEventListener("click", function () {
    sessionStorage.removeItem("admin_logged_in");
    window.location.href = "index.html";
  });
   
}

document.addEventListener("DOMContentLoaded", updateCartCount);
