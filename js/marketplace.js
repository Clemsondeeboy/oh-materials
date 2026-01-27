/***********************
 * SAMPLE PRODUCT DATA
 ***********************/
const PRODUCTS = [
  {
    id: 1,
    title: "Dangote Cement 50kg",
    price: 45.45,
    category: "Cement",
    location: "Lagos",
    vendor: "BuildMart",
    rating: 4.5,
    stock: true,
    image: "images/save-6.png"
  },
  {
    id: 2,
    title: "12mm Iron Rod",
    price: 49.99,
    category: "Steel Rods",
    location: "Abuja",
    vendor: "SteelSupreme",
    rating: 4.8,
    stock: true,
    image: "images/save-2.png"
  },
  {
    id: 3,
    title: "BUA Cement 50kg",
    price: 52.99,
    category: "Cement",
    location: "Kano",
    vendor: "Supreme Supplies",
    rating: 4.0,
    stock: false,
    image: "images/save-4.png"
  },
  {
    id: 4,
    title: "Mahogany Wood Plank",
    price: 35.45,
    category: "Wood",
    location: "Rivers",
    vendor: "WoodMart",
    rating: 4.6,
    stock: false,
    image: "images/explore-product-4.png"
  },
  {
    id: 5,
    title: "Italian Ceramic Floor Tiles",
    price: 130.99,
    category: "Tiles",
    location: "Lagos",
    vendor: "TileWorld",
    rating: 4.5,
    stock: true,
    image: "images/explore-product-1.png"
  },
  {
    id: 6,
    title: "Lafarge Cement 25kg",
    price: 65.75,
    category: "Cement",
    location: "Lagos",
    vendor: "MegaBuild",
    rating: 5.0,
    stock: true,
    image: "images/save-6.png"
  },
  {
    id: 7,
    title: "Plank Wood",
    price: 35.45,
    category: "Wood",
    location: "Abia",
    vendor: "PLankWood",
    rating: 4.6,
    stock: false,
    image: "images/explore-product-4.png"
  },
  {
    id: 8,
    title: "Cupboard",
    price: 130.99,
    category: "Cupboard",
    location: "Benin",
    vendor: "Cupboard World",
    rating: 4.8,
    stock: true,
    image: "images/save-1.png"
  },
  {
    id: 9,
    title: "Lafarge Cement 25kg",
    price: 65.75,
    category: "Cement",
    location: "Lagos",
    vendor: "MegaBuild",
    rating: 5.0,
    stock: true,
    image: "images/save-6.png"
  }
];

/***********************
 * GLOBAL STATE
 ***********************/
let selectedCategory = "all";

/***********************
 * UTILITIES
 ***********************/
function formatPrice(n) {
  return "£" + n.toFixed(2);
}

function debounce(fn, delay) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

/***********************
 * CATEGORY RENDERING
 ***********************/
function renderCategories() {
  const uniq = ["all", ...new Set(PRODUCTS.map(p => p.category))];
  const container = document.getElementById('categoryList');
  if (!container) return;
  container.innerHTML = "";

  uniq.forEach(cat => {
    const a = document.createElement('a');
    a.className = 'category-item';
    a.dataset.category = cat;
    a.textContent = cat === "all" ? "All" : cat;
    a.href = 'javascript:void(0)';
    a.onclick = () => {
      selectedCategory = (selectedCategory === cat) ? "all" : cat;
      updateCategoryActive();
      filterAndRender();
    };
    container.appendChild(a);
  });
  updateCategoryActive();
}

function updateCategoryActive() {
  const links = document.querySelectorAll('#categoryList a');
  links.forEach(a => {
    a.classList.toggle('active', a.dataset.category === selectedCategory);
  });
}

/***********************
 * PRODUCT RENDERING
 ***********************/
function renderProducts(items) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = "";

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="p-4 bg-white rounded shadow-sm text-center">
          No products found.
        </div>
      </div>`;
    return;
  }

  items.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 d-flex';
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img loading="lazy" class="product-img" src="${p.image}" alt="${p.title}">
      <div class="product-title">${p.title}</div>
      <div class="d-flex justify-content-between align-items-center mt-2">
        <div>
          <div class="price ${p.stock ? '' : 'out'}">${formatPrice(p.price)}</div>
          <div class="vendor">${p.vendor}</div>
          <div class="rating">${renderStars(p.rating)} 
            <span style="color:#222; font-weight:600; margin-left:6px;">${p.rating.toFixed(1)}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="stock" style="color:${p.stock ? '#0bbf8e' : '#e74a3b'}">${p.stock ? 'In Stock' : 'Out of stock'}</div>
        </div>
      </div>
      <div class="card-actions mt-3">
        <button class="btn-cart add-ro-cart-btn" ${p.stock ? "" : "enable"}>Add to cart</button>
        <button class="btn-quote">Request quote</button>
      </div>
    `;
    col.appendChild(card);
    grid.appendChild(col);
  });

  attachCartButtons(items);
}

/***********************
 * STAR RATING
 ***********************/
function renderStars(r) {
  const full = Math.floor(r);
  let stars = "";
  for (let i = 0; i < full; i++) stars += "★";
  for (let i = full; i < 5; i++) stars += "☆";
  return `<span style="color:#f6b518; font-size:14px;">${stars}</span>`;
}

/***********************
 * FILTER LOGIC
 ***********************/
function filterAndRender() {
  const minVal = parseFloat(document.getElementById('minPrice')?.value);
  const maxVal = parseFloat(document.getElementById('maxPrice')?.value);
  const location = document.getElementById('locationFilter')?.value;
  const vendorSearch = document.getElementById('vendorSearch')?.value.trim().toLowerCase() || "";
  const productSearch = document.getElementById('productSearch')?.value.trim().toLowerCase() || "";
  const sortBy = document.getElementById('sortSelect')?.value;

  let min = Number.isFinite(minVal) ? minVal : -Infinity;
  let max = Number.isFinite(maxVal) ? maxVal : Infinity;
  if (Number.isFinite(minVal) && Number.isFinite(maxVal) && minVal > maxVal) [min, max] = [max, min];

  let filtered = PRODUCTS.filter(p => {
    const catMatch = selectedCategory === "all" ? true : (p.category === selectedCategory);
    const priceMatch = p.price >= min && p.price <= max;
    const locMatch = location === "all" || !location ? true : p.location === location;
    const vendorMatch = p.vendor.toLowerCase().includes(vendorSearch);
    const productMatch = p.title.toLowerCase().includes(productSearch);
    return catMatch && priceMatch && locMatch && vendorMatch && productMatch;
  });

  if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating-desc") filtered.sort((a, b) => b.rating - a.rating);

  renderProducts(filtered);
}

/***********************
 * CART LOGIC
 ***********************/
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const badge = document.getElementById('cart-count');
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) badge.textContent = totalQty;
}

function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(item => item.name === product.title);
  if (existing) existing.quantity += 1;
  else {
    cart.push({
      name: product.title,
      price: product.price,
      image: product.image,
      vendor: product.vendor,
      quantity: 1
    });
  }
  saveCart(cart);
}

function attachCartButtons(items) {
  const cartButtons = document.querySelectorAll('.btn-cart');
  cartButtons.forEach((button, i) => {
    const product = items[i];
    button.addEventListener('click', () => {
      if (!product.stock) return;
      addToCart(product);
      button.textContent = "Added!";
      button.classList.add('added');
      setTimeout(() => {
        button.textContent = "Add to cart";
        button.classList.remove('added');
      }, 1000);
    });
  });
}

/***********************
 * RECENTLY SEARCHED
 ***********************/
const recentlySearchedProducts = [
  {
    name: "Mahogany Wood Plank",
    price: 35.45,
    stock: false,
    vendor: "WoodMart",
    rating: 4.6,
    image: "images/explore-product-4.png"
  },
  {
    name: "Lafarge Cement 25kg",
    price: 65.75,
    stock: true,
    vendor: "MegaBuild",
    rating: 5.0,
    image: "images/save-1.png"
  },
  {
    name: "12mm Iron Rod",
    price: 49.99,
    stock: true,
    vendor: "SteelSupreme",
    rating: 4.8,
    image: "images/save-2.png"
  },
  {
    name: "Italian Ceramic Floor Tiles",
    price: 130.99,
    stock: true,
    vendor: "TileWorld",
    rating: 4.5,
    image: "images/save-6.png"
  }
];


function renderRecentlySearched() {
  const container = document.getElementById("recently-searched-container");
  if (!container) return;
  container.innerHTML = "";
  recentlySearchedProducts.forEach(p => {
    const div = document.createElement("div");
    div.className = "col-md-3 col-sm-6 mb-4";
    div.innerHTML = `
      <div class="recently-searched-card h-100">
        <img src="${p.image}" alt="${p.name}">
        <h6>${p.name}</h6>
        <p class="price">${formatPrice(p.price)}</p>
        <p class="stock ${p.stock ? 'in' : 'out'}">${p.stock ? 'In Stock' : 'Out of Stock'}</p>
        <p class="vendor">${p.vendor}</p>
        <div class="rating mb-2">
          ${'<i class="bi bi-star-fill"></i>'.repeat(Math.floor(p.rating))}
          ${p.rating % 1 ? '<i class="bi bi-star-half"></i>' : ''}
        </div>
        <div class="d-flex flex-wrap">
          <button class="btn add-to-cart add-ro-cart-btn">Add to cart</button>
          <button class="btn btn-outline-success">Request quote</button>
        </div>
      </div>`;
    div.querySelector(".add-to-cart").addEventListener("click", () => {
      addToCart({
        title: p.name,
        price: p.price,
        image: p.image,
        vendor: p.vendor,
        stock: p.stock
      });
    });
    container.appendChild(div);
  });
}



/***********************
 * INITIALIZATION
 ***********************/
document.getElementById('applyPrice')?.addEventListener('click', filterAndRender);
document.getElementById('clearPrice')?.addEventListener('click', () => {
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  filterAndRender();
});
document.getElementById('locationFilter')?.addEventListener('change', filterAndRender);
document.getElementById('vendorSearch')?.addEventListener('input', debounce(filterAndRender, 250));
document.getElementById('productSearch')?.addEventListener('input', debounce(filterAndRender, 250));
document.getElementById('sortSelect')?.addEventListener('change', filterAndRender);

/* Initialize Everything */
renderCategories();
filterAndRender();
updateCartCount();
renderRecentlySearched();
