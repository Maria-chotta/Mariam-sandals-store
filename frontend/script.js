// ===================== API CONFIG =====================
const API_BASE_URL = "https://mariam-sandals-store-production.up.railway.app";

// ===================== MENU =====================
function toggleMenu() {
  document.querySelectorAll(".nav-links").forEach(nav => {
    nav.classList.toggle("active");
  });
}

// ===================== LOCAL STORAGE INIT =====================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ===================== REVIEWS =====================
let reviews = {};
let ratings = {};
let currentProductName = "";
let currentRating = 0;
let selectedProduct = null;

// ===================== CART =====================
let quantity = 1;
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price) {
  cart.push({ name, price, quantity: 1 });
  saveCart();
  updateCart();

  showToast("🛒 Added to cart successfully!");
}

function addToCartFromModal() {
  if (!selectedProduct) return;

  cart.push({
  name: selectedProduct.name,
  price: selectedProduct.price,
  quantity: quantity
});
  saveCart();
  updateCart();

  document.getElementById("cartCount").innerText = cart.length;

  showToast("🛒 Added to cart successfully!");

  closeModal();
}

function updateCart() {
  saveCart();

  let list = document.getElementById("cartItems");
  let total = 0;

  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = `
      <p class="empty-cart">
        🛒 Your cart is empty
      </p>
    `;

    document.getElementById("total").innerText = 0;
    document.getElementById("cartCount").innerText = 0;
    document.getElementById("cartCountNav").innerText = 0;

    return;
  }

  cart.forEach((item, i) => {
    const quantity = Number(item.quantity) || 1;
    const itemTotal = Number(item.price) * quantity;
    total += itemTotal;

    list.innerHTML += `
      <div>
        ${item.name} × ${quantity} - ${itemTotal} TSh
        <button onclick="removeItem(${i})">❌</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
  document.getElementById("cartCount").innerText = cart.length;
  document.getElementById("cartCountNav").innerText = cart.length;
}

function removeItem(i) {
  cart.splice(i, 1);
  updateCart();
}



// ===================== CART TOGGLE =====================
function toggleCart() {
  let box = document.getElementById("cartBox");
  box.style.display = box.style.display === "block" ? "none" : "block";
}

// ===================== CHECKOUT =====================
function openOrderModal() {
  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  const summary = cart.map(item => {
    const quantity = Number(item.quantity) || 1;
    const total = Number(item.price) * quantity;
    return `<p>${item.name} × ${quantity} — ${total.toLocaleString()} TSh</p>`;
  }).join("");

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price) * (Number(item.quantity) || 1), 0);

  document.getElementById("orderSummary").innerHTML = `
    <p><strong>Order items:</strong></p>
    ${summary}
    <p><strong>Total:</strong> ${cartTotal.toLocaleString()} TSh</p>
  `;

  document.getElementById("orderModal").style.display = "block";
}

function closeOrderModal() {
  document.getElementById("orderModal").style.display = "none";
}

async function submitOrder() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const note = document.getElementById("customerNote").value.trim();

  if (!name || !phone || !address) {
    showToast("Please enter name, phone, and address.");
    return;
  }

  const items = cart.map(item => ({
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity) || 1
  }));

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderData = {
    customer: { name, phone, address, note },
    items,
    total,
    status: "pending"
  };

  const whatsappText = `Hello, I would like to order:\n${items.map(i => `${i.name} × ${i.quantity} - ${i.price} TSh`).join("\n")}\nTotal: ${total} TSh\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nNote: ${note}`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=255624060759&text=${encodeURIComponent(whatsappText)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to save order.");
    }

    showToast("Order saved. Opening WhatsApp to confirm.");
  } catch (err) {
    console.error(err);
    showToast("Opening WhatsApp to confirm your order.");
  }

  closeOrderModal();
  cart = [];
  saveCart();
  updateCart();
  window.location.href = whatsappUrl;
}

function checkout() {
  openOrderModal();
}

// ===================== FAVORITES =====================
function toggleFavorite(name) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.includes(name)) {
    favorites = favorites.filter(p => p !== name);
  } else {
    favorites.push(name);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  alert("❤️ Favorites updated");
}

// ===================== DARK MODE =====================
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// ===================== CURRENCY =====================
let currency = "TSh";

function toggleCurrency() {
  let prices = document.querySelectorAll(".price");

  if (currency === "TSh") {
    currency = "USD";
    prices.forEach(p => p.innerHTML = "$" + p.dataset.usd);
  } else {
    currency = "TSh";
    prices.forEach(p => p.innerHTML = p.dataset.tsh + " TSh");
  }
}

function changeQty(value){

  quantity += value;

  if(quantity < 1){
    quantity = 1;
  }

  document.getElementById("quantity").innerText = quantity;
}
// ===================== PRODUCT MODAL =====================
function openModal(name, price, img, desc) {
  const numericPrice = Number(price.toString().replace(/[^0-9.-]/g, "")) || 0;
  selectedProduct = { name, price: numericPrice, priceText: price };
  currentProductName = name;
  currentRating = 0;

  document.getElementById("modalName").innerText = name;
  document.getElementById("modalPrice").innerText = price;
  document.getElementById("modalImg").src = img;
  document.getElementById("modalDesc").innerText = desc;

  updateRatingStars(0);
  updateRatingSummary(name);
  displayReviews();

  quantity = 1;
document.getElementById("quantity").innerText = quantity;

  document.getElementById("productModal").style.display = "block";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

// ===================== REVIEWS =====================
function addReview() {
  let text = document.getElementById("reviewText").value.trim();

  if (text === "" && currentRating === 0) return;

  if (text !== "") {
    if (!reviews[currentProductName]) reviews[currentProductName] = [];
    reviews[currentProductName].push(text);
  }

  if (currentRating > 0) {
    if (!ratings[currentProductName]) ratings[currentProductName] = [];
    ratings[currentProductName].push(currentRating);
  }

  document.getElementById("reviewText").value = "";
  currentRating = 0;

  updateRatingStars(0);
  displayReviews();
  updateRatingSummary(currentProductName);
}

function updateRatingStars(value) {
  currentRating = value;

  document.querySelectorAll("#ratingStars .star").forEach(star => {
    let starValue = Number(star.dataset.value);
    star.classList.toggle("selected", starValue <= value);
  });
}

function updateRatingSummary(productName) {
  let summary = document.getElementById("ratingSummary");
  let productRatings = ratings[productName] || [];

  if (productRatings.length === 0) {
    summary.innerText = "No ratings yet. Be the first to rate this product.";
    return;
  }

  let average = productRatings.reduce((a, b) => a + b, 0) / productRatings.length;

  summary.innerText =
    `Rating: ${average.toFixed(1)} / 5 (${productRatings.length} review${productRatings.length === 1 ? '' : 's'})`;
}

function displayReviews() {
  let box = document.getElementById("reviewsList");
  box.innerHTML = "";

  if (reviews[currentProductName]?.length) {
    reviews[currentProductName].forEach(r => {
      box.innerHTML += `<p>💬 ${r}</p>`;
    });
  } else {
    box.innerHTML = `<p class="no-reviews">No reviews yet. Share your feedback above.</p>`;
  }
}

// ===================== CHAT =====================
function toggleChat() {
  let c = document.getElementById("chatBox");
  let chat = document.getElementById("chat");

  let isOpen = c.classList.contains("open");

  if (isOpen) {
    c.classList.remove("open");
  } else {
    c.classList.add("open");

    if (!chat.dataset.started) {
      chat.innerHTML += "<div class='bot'>Hello! Welcome to Mariam Sandal Store.</div>";
      chat.dataset.started = "true";
    }
  }
}

function sendMessage() {
  let input = document.getElementById("userInput").value.trim();
  let chat = document.getElementById("chat");

  if (!input) return;

  chat.innerHTML += `<div class='user'>${input}</div>`;

  const normalized = input.toLowerCase();
  if (/\b(cancel|stop|quit|clear|reset)\b/.test(normalized)) {
    chat.innerHTML += `<div class='bot'>Okay, I closed the chat for you. Tap the chat button again when you're ready.</div>`;
    document.getElementById("userInput").value = "";
    chat.scrollTop = chat.scrollHeight;
    setTimeout(closeChat, 700);
    return;
  }

  chat.innerHTML += `<div class='bot'>${getBotReply(input)}</div>`;
  document.getElementById("userInput").value = "";
  chat.scrollTop = chat.scrollHeight;
}

function closeChat() {
  const c = document.getElementById("chatBox");
  const chat = document.getElementById("chat");
  c.classList.remove("open");
  chat.dataset.started = "";
  chat.innerHTML = "";
}

// ===================== SEARCH & FILTER =====================
let activeCategory = "all";

function getCategoryLabel(category) {
  const labels = {
    all: "all sandals",
    men: "men's sandals",
    women: "women's sandals"
  };

  return labels[category] || "sandals";
}

function updateCategoryControls() {
  document.querySelectorAll(".category-card").forEach(button => {
    button.classList.toggle("active", button.dataset.category === activeCategory);
  });

  const title = document.getElementById("collectionTitle");
  const subtitle = document.getElementById("collectionSubtitle");
  const status = document.getElementById("categoryStatus");

  if (title) {
    title.innerText = activeCategory === "all"
      ? "Featured Collection"
      : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Sandals`;
  }

  if (subtitle) {
    subtitle.innerText = activeCategory === "men"
      ? "Only men's sandals are shown in this group"
      : activeCategory === "women"
        ? "Only women's sandals are shown in this group"
        : "Best selling sandals picked for you";
  }

  if (status) {
    status.innerText = `Showing ${getCategoryLabel(activeCategory)}`;
  }
}

function applyProductFilters() {
  const input = document.getElementById("searchInput")?.value.toLowerCase() || "";
  let visibleCount = 0;

  document.querySelectorAll(".product").forEach(product => {
    const matchesCategory = activeCategory === "all" || product.classList.contains(activeCategory);
    const matchesSearch = product.innerText.toLowerCase().includes(input);
    const isVisible = matchesCategory && matchesSearch;

    product.style.display = isVisible ? "block" : "none";
    if (isVisible) visibleCount += 1;
  });

  const status = document.getElementById("categoryStatus");
  if (status) {
    const searchText = input ? ` matching "${input}"` : "";
    status.innerText = `${visibleCount} product${visibleCount === 1 ? "" : "s"} in ${getCategoryLabel(activeCategory)}${searchText}`;
  }
}

function searchProducts() {
  applyProductFilters();
}

function filterProducts(category) {
  activeCategory = category;
  updateCategoryControls();
  applyProductFilters();
  document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateProductCardButtons() {
  document.querySelectorAll(".add-cart-btn").forEach(button => {
    button.innerText = "Order Now";
  });
}

// ===================== WHATSAPP BUY =====================
function buyOnWhatsApp() {
  let name = document.getElementById("modalName").innerText;
  let price = document.getElementById("modalPrice").innerText;

  let message = `Hello, I want to order:\nProduct: ${name}\nPrice: ${price}`;

  let phone = "255624060759";

  let web =
    `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

  let app =
    `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

  // try app first
  window.location.href = app;

  // fallback after 1 second
  setTimeout(() => {
    window.location.href = web;
  }, 1000);
}

function showToast(message) {
  let toast = document.getElementById("toast");

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}


let topBtn = document.getElementById("topBtn");

window.onscroll = function () {

  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }

};

topBtn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

// ===================== BOT =====================
function getBotReply(message) {
  message = message.toLowerCase().trim();

  const isSwahili = /\b(salamu|habari|bei|gharama|kiasi|ukubwa|agiza|wasap|shukrani|asante)\b/.test(message);

  // =====================
  // SMART CONTEXT DETECTION
  // =====================

  const intent = {
    price: /(price|cost|how much|bei|gharama)/.test(message),
    greeting: /(hello|hi|hey|habari|hujambo|mambo)/.test(message),
    size: /(size|fit|ukubwa)/.test(message),
    order: /(buy|order|purchase|nunua|agiza)/.test(message),
    shipping: /(shipping|delivery|ship|usafiri|uwasilishaji)/.test(message),
    whatsapp: /(whatsapp|contact|support|wasap)/.test(message),
    thanks: /(thank|thanks|asante|shukrani)/.test(message),
    help: /(help|what can you do|unaweza|msaada)/.test(message),
    recommend: /(recommend|suggest|best|top seller|favorite|good one|modern|style|fashion)/.test(message),
    cancel: /(cancel|stop|quit|clear|reset)/.test(message)
  };

  // =====================
  // SWAHILI MODE (NATURAL)
  // =====================
  if (isSwahili) {
    if (intent.greeting) {
      return "👋 Habari! Karibu kwenye Mariam Sandal Store. Naweza kukusaidia kuchagua viatu, bei au oda yako?";
    }

    if (intent.price) {
      return "💰 Bei zetu ni TSh 15,000 kwa kila sandal (takriban $6 USD). Ungependa nikusaidie kuchagua style?";
    }

    if (intent.size) {
      return "📏 Tunauza size 36 hadi 42. Niambie mguu wako au style unayotaka nikusaidie kuchagua sahihi.";
    }

    if (intent.order) {
      return "🛒 Unaweza kuagiza moja kwa moja kupitia WhatsApp. Nikitaka, naweza kukuandalia oda yako hapa.";
    }

    if (intent.shipping) {
      return "🚚 Usafirishaji unafanyika baada ya uthibitisho wa oda kupitia WhatsApp. Tunakuhakikishia delivery salama.";
    }

    if (intent.thanks) {
      return "😊 Karibu sana! Niko hapa kukusaidia wakati wowote.";
    }

    return "🤖 Niko hapa kukusaidia kuhusu bei, size, oda na delivery. Niulize chochote kuhusu bidhaa zetu.";
  }

  // =====================
  // ENGLISH MODE (SMART AI STYLE)
  // =====================

  if (intent.greeting) {
    return "👋 Hello! Welcome to Mariam Sandal Store. I can help you find products, check prices, or place an order.";
  }

  if (intent.recommend) {
    return "✨ I recommend our top sellers like Luxury beach sandal, Classic Leather Sandal, and Urban comfort sandal. Want me to help you choose the best fit?";
  }

  if (intent.price) {
    return "💰 Our sandals cost 15,000 TSh (~$6 USD). We also offer fast delivery and easy WhatsApp ordering.";
  }

  if (intent.size) {
    return "📏 We offer sizes 36–42. If you tell me your preference, I can recommend the best fit for you.";
  }

  if (intent.order) {
    return "🛒 You can place an order directly via WhatsApp. I can also prepare your order details for you instantly.";
  }

  if (intent.shipping) {
    return "🚚 Delivery is arranged after WhatsApp confirmation. We ensure fast and safe delivery.";
  }

  if (intent.whatsapp) {
    return "📱 You can contact us via WhatsApp at +255 624060759 for fast support.";
  }

  if (intent.help) {
    return "🤖 I can help you with: product info, pricing, sizes, orders, and delivery. What would you like to know?";
  }

  if (intent.thanks) {
    return "😊 You're welcome! Let me know if you need anything else.";
  }

  // =====================
  // SMART FALLBACK (IMPORTANT)
  // =====================
  return `
🤖 I'm not fully sure, but I can help you with:

• Product prices 💰  
• Shoe sizes 📏  
• Orders 🛒  
• Delivery 🚚  

Try asking something like:
"How much are sandals?"
or
"What sizes do you have?"
  `;
}

async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`);
    const products = await res.json();

    console.log("Loaded products:", products);

    if (!Array.isArray(products) || !products.length) return;

    const usableProducts = products.filter(product => {
      const image = product.image || "";
      return product.name && Number(product.price) > 0 && image.startsWith("images/");
    });

    if (!usableProducts.length) {
      console.warn("API products are missing usable local images; static product listing is preserved.");
      return;
    }

    const container = document.getElementById("products");
    container.innerHTML = "";

    usableProducts.forEach((product) => {
      let imageSrc = product.image;

      if (!imageSrc || typeof imageSrc !== "string") {
        console.warn("Product has invalid image path:", product);
        imageSrc = "images/sandal.jpg";
      }

      const productName = JSON.stringify(product.name);
      const productDesc = JSON.stringify(product.description || "");
      const categoryClass = product.category ? product.category.toLowerCase() : "";
      const usdPrice = ((product.price || 0) / 2500).toFixed(2);
      const sizeText = Array.isArray(product.sizes) ? product.sizes.join(" - ") : "36 - 42";

      container.innerHTML += `
        <div class="product ${categoryClass}">
          <img src="${imageSrc}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p class="sizes">Sizes: ${sizeText}</p>
          <p class="price" data-tsh="${product.price}" data-usd="${usdPrice}">
            ${product.price.toLocaleString()} TSh
          </p>
          <div class="product-buttons">
            <button class="view-btn" onclick="openModal(${productName}, '${product.price.toLocaleString()} TZS', '${imageSrc}', ${productDesc})">View Product</button>
            <button class="add-cart-btn" onclick="addToCart(${productName}, ${product.price})">Order Now</button>
            <button class="fav-btn" onclick="toggleFavorite(${productName})">❤️</button>
          </div>
        </div>
      `;
    });

    updateProductCardButtons();
    updateCategoryControls();
    applyProductFilters();
  } catch (error) {
    console.warn("Unable to load products from API; static product listing is preserved.", error);
  }
}

// run when page loads
// Static products are already rendered in HTML. API loading is optional and
// should only be enabled when the live database contains production products.
if (window.USE_API_PRODUCTS === true) {
  loadProducts();
}

updateCart();
updateProductCardButtons();
updateCategoryControls();
applyProductFilters();
