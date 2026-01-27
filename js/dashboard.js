// DASHBOARD PAGE NAVIGATION
document.addEventListener("DOMContentLoaded", function () {

      const sections = document.querySelectorAll(".page-section");
      const sidebarLinks = document.querySelectorAll("#sidebar-links .nav-link");
      const sidebarLinksMobile = document.querySelectorAll("#sidebar-links-mobile .nav-link");

      function showPage(page) {
          sections.forEach(sec => sec.classList.remove("active"));
          document.getElementById("page-" + page).classList.add("active");

          // Highlight active link (desktop)
          sidebarLinks.forEach(link => link.classList.remove("active"));
          document.querySelector(`#sidebar-links .nav-link[data-page="${page}"]`)?.classList.add("active");

          // Highlight active link (mobile)
          sidebarLinksMobile.forEach(link => link.classList.remove("active"));
          document.querySelector(`#sidebar-links-mobile .nav-link[data-page="${page}"]`)?.classList.add("active");

          // Save to localStorage
          localStorage.setItem("activeDashboardPage", page);
      }

      // Load saved page or default to "account"
      const savedPage = localStorage.getItem("activeDashboardPage") || "account";
      showPage(savedPage);

      // Desktop click
      sidebarLinks.forEach(link => {
          link.addEventListener("click", function () {
              const page = this.getAttribute("data-page");
              showPage(page);
          });
      });

      // OFFCANVAS INSTANCE
      const offcanvasEl = document.getElementById("offcanvasLeft");
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);

      // MOBILE SIDEBAR CLICK HANDLER
      sidebarLinksMobile.forEach(link => {
          link.addEventListener("click", function () {

              // Get selected page
              const page = this.getAttribute("data-page");

              showPage(page);   // Switch content
              bsOffcanvas.hide(); // Auto-close the offcanvas

          });
      });

  });


// DYNAMIC RECENTLY VIEWED
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("recently-viewed-container");

    // Example structure of each product (You can replace with your API/localStorage)
    // If you're using localStorage, simply store this same kind of object.
    const recentlyViewed = JSON.parse(localStorage.getItem("recent_products")) || [
        {
            name: "Italian Ceramic Floor Tiles",
            price: "£130.99 / sqm",
            inStock: true,
            vendor: "TileWorld",
            rating: 4.5,
            image: "images/tiles.jpg"
        },
        {
            name: "Mahogany Wood Plank",
            price: "£35.45",
            inStock: false,
            vendor: "WoodMart",
            rating: 4.6,
            image: "images/stack-wooden.jpg"
        },
        {
            name: "12mm Iron Rod",
            price: "£49.99",
            inStock: true,
            vendor: "SteelSupreme",
            rating: 4.8,
            image: "images/save-2.png"
        },
        {
            name: "Lafarge Cement 25kg",
            price: "£65.75",
            inStock: true,
            vendor: "MegaBuild",
            rating: 5.0,
            image: "images/save-5.png"
        }
    ];

    container.innerHTML = ""; // clear container first

    recentlyViewed.forEach(product => {
        const stockText = product.inStock
            ? `<p class="text-success fw-bold mb-1">In Stock</p>`
            : `<p class="text-danger fw-bold mb-1">Out of Stock</p>`;

        const card = `
    <div class="col-md-3 col-sm-6 mb-4">
        <div class="recent-card shadow-sm rounded-4 p-3">
            <img src="${product.image}" class="recent-img rounded-3 mb-3">
            <h6 class="fw-bold mb-2">${product.name}</h6>

            <p class="fw-bold mb-1">${product.price}</p>
            ${stockText}

            <p class="text-muted small mb-1">${product.vendor}</p>

            <p class="text-warning small mb-3">
                ${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}
                <span class="text-dark fw-semibold">${product.rating}</span>
            </p>

            <div class="d-flex gap-2">
                <button class="btn btn-teal">Add to cart</button>
                <button class="btn btn-outline-teal">Request quote</button>
            </div>
        </div>
    </div>
`;
        container.insertAdjacentHTML("beforeend", card);
    });


    // Attach Add to Cart event after rendering cards
    const buttons = document.querySelectorAll(".btn-teal");

    buttons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const product = recentlyViewed[index];

            addToCart({
                title: product.name,
                price: product.price,
                image: product.image,
                vendor: product.vendor,
                stock: product.inStock
            });

            alert(product.name + " added to cart!");
        });
    });

});

    function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Convert the incoming product into the correct format
  const formattedProduct = {
      name: product.title || product.name,      // support both
      price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
      quantity: 1,
      image: product.image,
      vendor: product.vendor || "Unknown"
  };

  cart.push(formattedProduct);
  localStorage.setItem("cart", JSON.stringify(cart));
  }


  function updateStatus(status) {
  const progressMap = {
    dispatched: 25,
    transit: 50,
    delivered: 75,
    onsite: 100
  };

  document.querySelector(".progress-bar").style.width =
    progressMap[status] + "%";
  }

  items.forEach(item => {
  if (item.available) {
      // show price + add button
  } else {
      // show NOT AVAILABLE + out of stock
  }
  });