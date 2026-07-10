const API = "http://localhost:8080/api/products";
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
let allProducts = [];

// Fetch and display products
fetch(API)
  .then(response => response.json())
  .then(products => {
    allProducts = products;
    displayProducts(products);
  })
  .catch(err => console.error("Error loading products:", err));

// Display function for product cards
function displayProducts(products) {
  productList.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}" style="cursor:pointer;" onclick="viewDetails(${product.id})"/>
      <h3>${product.name}</h3>
      <p><strong>₹${product.price}</strong></p>
      <p>${product.description}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}

// Add to Cart Function
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(item => item.id === productId);

  if (index !== -1) {
    cart[index].quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart!");
}

// View Details Function
function viewDetails(id) {
  window.location.href = `product.html?id=${id}`;
}

// Update cart count in header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");

  if (totalCount > 0) {
    cartCount.style.display = "inline-block";
    cartCount.textContent = totalCount;
  } else {
    cartCount.style.display = "none";
  }
}

// Live search filter
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(query)
    );
    displayProducts(filtered);
  });

  function goToAdmin() {
    if (localStorage.getItem("admin_logged_in") === "true") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "admin-login.html";
    }
  }
}

document.addEventListener("DOMContentLoaded", updateCartCount);
