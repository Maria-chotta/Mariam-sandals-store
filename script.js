// ===================== MENU =====================
function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("active");
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
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price) {
  cart.push({ name, price });
  saveCart();
  updateCart();

  showToast("🛒 Added to cart successfully!");
}

function addToCartFromModal() {
  if (!selectedProduct) return;

  cart.push(selectedProduct);
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

  cart.forEach((item, i) => {
    total += Number(item.price);

    list.innerHTML += `
      <div>
        ${item.name} - ${item.price} TSh
        <button onclick="removeItem(${i})">❌</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
  document.getElementById("cartCount").innerText = cart.length;
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
function checkout() {
  let phone = "255624060759";
  let msg = "Order:\n";

  cart.forEach(i => {
    msg += `${i.name} - ${i.price} TSh\n`;
  });

  let url = "https://api.whatsapp.com/send?phone=" + phone +
    "&text=" + encodeURIComponent(msg);

  window.location.href = url;
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

// ===================== PRODUCT MODAL =====================
function openModal(name, price, img, desc) {
  selectedProduct = { name, price };
  currentProductName = name;
  currentRating = 0;

  document.getElementById("modalName").innerText = name;
  document.getElementById("modalPrice").innerText = price;
  document.getElementById("modalImg").src = img;
  document.getElementById("modalDesc").innerText = desc;

  updateRatingStars(0);
  updateRatingSummary(name);
  displayReviews();

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
  chat.innerHTML += `<div class='bot'>${getBotReply(input)}</div>`;

  document.getElementById("userInput").value = "";
  chat.scrollTop = chat.scrollHeight;
}

// ===================== SEARCH =====================
function searchProducts() {
  let input = document.getElementById("searchInput").value.toLowerCase();

  document.querySelectorAll(".product").forEach(product => {
    product.style.display =
      product.innerText.toLowerCase().includes(input) ? "block" : "none";
  });
}

// ===================== FILTER =====================
function filterProducts(category) {
  document.querySelectorAll(".product").forEach(product => {
    if (category === "all" || product.classList.contains(category)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
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
    help: /(help|what can you do|unaweza|msaada)/.test(message)
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

  if (intent.price) {
    return "💰 Our sandals cost 15,000 TSh (~$6 USD). Would you like recommendations based on style or size?";
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