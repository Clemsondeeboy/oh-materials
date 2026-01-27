/****************************************************
 * LOGIN / PROFILE / CART HANDLING
 ****************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const cartWrapper = document.getElementById("cartWrapper");
  const userIcon = document.getElementById("userIcon");

  // Get login status
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  /***************
   * ICON VISIBILITY & REDIRECTS
   ***************/
  // Always show user icon
  if (userIcon) {
    userIcon.classList.remove("d-none");

    userIcon.addEventListener("click", (e) => {
      e.preventDefault();

      if (isLoggedIn) {
        // Go to user-dashboard page when logged in
        window.location.href = "user-dashboard.html";
      } else {
        // Go to login page when not logged in
        window.location.href = "login.html";
      }
    });
  }

  // Hide or show cart based on login status
  if (cartWrapper) {
    if (isLoggedIn) {
      cartWrapper.classList.remove("d-none");
    } else {
      cartWrapper.classList.add("d-none");
    }
  }

  /***************
   * LOGIN HANDLER
   ***************/
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Simple frontend validation
      if (username && password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert("Please enter a valid username and password.");
      }
    });
  }

  /***************
   * LOGOUT HANDLER (if used in profile.html)
   ***************/
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      window.location.href = "login.html";
    });
  }

  /***************
   * PROFILE DISPLAY (on user-dashboard.html)
   ***************/
  const profileName = document.getElementById("profileName");
  if (profileName && isLoggedIn) {
    const username = localStorage.getItem("username") || "User";
    profileName.textContent = username;
  }
});

/****************************************************
 * CART LOGIC
 ****************************************************/
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const itemCountEl = document.getElementById("item-count");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkoutBtn");

// Update cart badge
function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalQty;
  if (itemCountEl) itemCountEl.textContent = totalQty;
}

// Update totals
function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (subtotalEl) subtotalEl.textContent = "£" + subtotal.toFixed(2);
  if (totalEl) totalEl.textContent = "£" + subtotal.toFixed(2);
  if (checkoutBtn) checkoutBtn.textContent = "Checkout (£" + subtotal.toFixed(2) + ")";
  updateCartBadge();
}

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateTotals();
}

// Render cart items
function renderCart() {
  if (!cartItemsContainer) {
    updateCartBadge();
    return;
  }

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-section text-center py-5">
        <i class="bi bi-cart-x display-4 text-muted"></i>
        <h6 class="mt-3 text-muted">Your cart is empty</h6>
        <a href="marketplace.html" class="btn btn-success mt-3">Go to Marketplace</a>
      </div>`;
    updateTotals();
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-section");
    div.innerHTML = `
      <div class="cart-item d-flex justify-content-between align-items-start mb-4 border-bottom pb-3">
        <div class="d-flex align-items-start gap-3">
          <img src="${item.image}" alt="${item.name}" class="rounded" style="width:100px; height:100px; object-fit:cover;">
          <div>
            <h6 class="fw-semibold">${item.name}</h6>
            <p class="mb-1 text-muted small">Vendor: ${item.vendor}</p>
            <p class="mb-2 text-success small">In Stock</p>
            <button class="btn btn-sm btn-outline-danger remove-btn"><i class="bi bi-trash"></i> Remove</button>
          </div>
        </div>
        <div class="text-end">
          <div class="fw-bold mb-1">£${item.price.toFixed(2)}</div>
          <div class="d-flex justify-content-end align-items-center gap-2">
            <button class="btn btn-light btn-sm quantity-btn decrease">-</button>
            <input class="quantity-input text-center border rounded" type="text" value="${item.quantity}" readonly style="width:40px;">
            <button class="btn btn-light btn-sm quantity-btn increase">+</button>
          </div>
        </div>
      </div>
    `;

    div.querySelector(".increase").addEventListener("click", () => {
      item.quantity++;
      saveCart();
      renderCart();
    });

    div.querySelector(".decrease").addEventListener("click", () => {
      if (item.quantity > 1) item.quantity--;
      else cart.splice(index, 1);
      saveCart();
      renderCart();
    });

    div.querySelector(".remove-btn").addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart();
      renderCart();
    });

    cartItemsContainer.appendChild(div);
  });

  updateTotals();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartBadge();
});
