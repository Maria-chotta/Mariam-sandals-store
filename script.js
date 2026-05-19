
  function toggleMenu() {
  document.querySelector(".top-bar").classList.toggle("active");
}
  let reviews = {};
let ratings = {};
let currentProductName = "";
let currentRating = 0;
  

function addReview() {
  let text = document.getElementById("reviewText").value.trim();

  if (text === "" && currentRating === 0) return;

  if (text !== "") {
    if (!reviews[currentProductName]) {
      reviews[currentProductName] = [];
    }
    reviews[currentProductName].push(text);
  }

  if (currentRating > 0) {
    if (!ratings[currentProductName]) {
      ratings[currentProductName] = [];
    }
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
  let stars = document.querySelectorAll("#ratingStars .star");
  stars.forEach(star => {
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

  let average = productRatings.reduce((sum, rate) => sum + rate, 0) / productRatings.length;
  summary.innerText = `Rating: ${average.toFixed(1)} / 5 (${productRatings.length} review${productRatings.length === 1 ? '' : 's'})`;
}

function displayReviews() {
  let box = document.getElementById("reviewsList");
  box.innerHTML = "";

  if (reviews[currentProductName]?.length) {
    reviews[currentProductName].forEach(r => {
      box.innerHTML += "<p>💬 " + r + "</p>";
    });
  } else {
    box.innerHTML = "<p class='no-reviews'>No reviews yet. Share your feedback above.</p>";
  }
}


  let selectedProduct = null;

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

function addToCartFromModal() {
  cart.push(selectedProduct);
  document.getElementById("cartCount").innerText = cart.length;
  closeModal();
}

// CART SYSTEM
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
let cart = [];


function addToCart(name, price) {
  cart.push({name, price});
  updateCart();
}

function updateCart() {
  let list = document.getElementById("cartItems");
  let total = 0;

  list.innerHTML = "";

  cart.forEach((item, i) => {
    total += item.price;
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
  cart.splice(i,1);
  updateCart();
}

function toggleCart() {
  let box = document.getElementById("cartBox");
  box.style.display = box.style.display === "block" ? "none" : "block";
}

function checkout() {
  let phone = "255624060759";
  let msg = "Order:\n";

  cart.forEach(i => {
    msg += i.name + " - " + i.price + " TSh\n";
  });

  let url = "https://api.whatsapp.com/send?phone="+phone+"&text="+encodeURIComponent(msg);
  window.location.href = url;
}

let favorites = [];

function toggleFavorite(name) {
  if (favorites.includes(name)) {
    favorites = favorites.filter(p => p !== name);
  } else {
    favorites.push(name);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  alert("❤️ Favorites updated");
}



// CURRENCY
let currency = "TSh";

function toggleCurrency() {
  let prices = document.querySelectorAll(".price");

  if(currency === "TSh") {
    currency = "USD";
    prices.forEach(p => p.innerHTML = "$" + p.dataset.usd);
  } else {
    currency = "TSh";
    prices.forEach(p => p.innerHTML = p.dataset.tsh + " TSh");
  }
}

// CHAT
function toggleChat() {
  let c = document.getElementById("chatBox");
  let chat = document.getElementById("chat");
  let isOpen = c.classList.contains("open");

  if (isOpen) {
    c.classList.remove("open");
  } else {
    c.classList.add("open");

    if (!chat.dataset.started) {
      chat.innerHTML += "<div class='bot'>Hello! Welcome to Mariam Sandal Store. How may I assist you today?</div>";
      chat.dataset.started = "true";
      chat.scrollTop = chat.scrollHeight;
    }
  }
}

function sendMessage() {
  let input = document.getElementById("userInput").value.trim();
  let chat = document.getElementById("chat");

  if (!input) return;

  chat.innerHTML += "<div class='user'>" + input + "</div>";

  let reply = getBotReply(input);
  chat.innerHTML += "<div class='bot'>" + reply + "</div>";

  document.getElementById("userInput").value = "";
  chat.scrollTop = chat.scrollHeight;
}

function searchProducts() {

  let input = document.getElementById("searchInput").value.toLowerCase();

  let products = document.querySelectorAll(".product");

  products.forEach(product => {

    let text = product.innerText.toLowerCase();

    if(text.includes(input)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }

  });

}
function filterProducts(category) {
  let products = document.querySelectorAll(".product");

  products.forEach(p => {
    if (category === "all") {
      p.style.display = "block";
    } else if (p.classList.contains(category)) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });
}
function buyOnWhatsApp() {
  let name = document.getElementById("modalName").innerText;
  let price = document.getElementById("modalPrice").innerText;

  let msg = `Hello, I want to order:\n${name}\nPrice: ${price}`;

  let url = "https://wa.me/255624060759?text=" + encodeURIComponent(msg);

  window.open(url, "_blank");
}
function filterProducts(category) {
  let products = document.querySelectorAll(".product");

  products.forEach(product => {

    if (category === "all") {
      product.style.display = "block";
    }

    else if (product.classList.contains(category)) {
      product.style.display = "block";
    }

    else {
      product.style.display = "none";
    }

  });
}
function buyOnWhatsApp() {

  let productName =
    document.getElementById("modalName").innerText;

  let productPrice =
    document.getElementById("modalPrice").innerText;

  let message =
`Hello, I want to order:

Product: ${productName}
Price: ${productPrice}`;

  let phoneNumber = "2557XXXXXXXX";

  let whatsappURL =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");
}


function getBotReply(message) {
  message = message.toLowerCase().trim();

  let isSwahili = /\b(salamu|habari|bei|gharama|kiasi|ukubwa|siti|kutoa|agiza|ujumbe|wasap|shukrani|asante|asanteni|usafi|ufuata)\b/.test(message);

  if (isSwahili) {
    if (message.includes("bei") || message.includes("gharama") || message.includes("kiasi")) {
      return "Bei za viatu ni 15,000 TSh (takriban $6 USD). Tafadhali nijulishe ikiwa ungependa ushauri wa mtindo.";
    } else if (message.includes("salamu") || message.includes("habari") || message.includes("hujambo") || message.includes("mambo")) {
      return "Habari! Karibu kwenye Duka la Mariam Sandal. Naweza kukusaidia vipi leo?";
    } else if (message.includes("ukubwa") || message.includes("size") || message.includes("fit")) {
      return "Tunauza saizi 36 hadi 42. Ikiwa ungependa ushauri wa ukubwa, niko tayari kusaidia.";
    } else if (message.includes("nunua") || message.includes("agiza") || message.includes("kununua") || message.includes("buy")) {
      return "Unaweza kuagiza kupitia WhatsApp au kwa kubonyeza kitufe cha kununua. Ninaweza pia kukusaidia kuandaa maelezo ya agizo.";
    } else if (message.includes("usafirishaji") || message.includes("uwasilishaji") || message.includes("delivery") || message.includes("ship")) {
      return "Usafirishaji unaratibiwa baada ya uthibitisho wa WhatsApp. Tafadhali tuma eneo lako na muda unaopendelea kwa haraka zaidi.";
    } else if (message.includes("whatsapp") || message.includes("wasap") || message.includes("mawasiliano") || message.includes("support")) {
      return "Unaweza kutuwasiliana kupitia WhatsApp kwa +255 624060759. Niko hapa kujibu maswali yako.";
    } else if (message.includes("asante") || message.includes("shukrani")) {
      return "Karibu sana. Tafadhali niambie ikiwa kuna kitu kingine ninachoweza kukusaidia nacho.";
    } else {
      return "Niko hapa kusaidia kwa maelezo ya bidhaa, ukubwa, bei, na maagizo. Tafadhali uliza swali lako au fafanua jinsi ninavyoweza kukusaidia.";
    }
  }

  if (message.includes("price") || message.includes("cost") || message.includes("how much")) {
    return "Our sandals are priced at 15,000 TSh (approximately $6 USD). Please let me know if you need help choosing a style.";
  } else if (message.includes("hello") || message.includes("hi") || message.includes("good morning") || message.includes("good afternoon") || message.includes("good evening")) {
    return "Hello! Welcome to Mariam Sandal Store. How may I assist you with your order today?";
  } else if (message.includes("size") || message.includes("fit") || message.includes("available")) {
    return "We offer sizes from 36 to 42. If you would like recommendations for fit, I am happy to assist.";
  } else if (message.includes("buy") || message.includes("order") || message.includes("purchase")) {
    return "You can place your order through WhatsApp or by using the Buy button. I can also help you prepare the order details.";
  } else if (message.includes("shipping") || message.includes("delivery") || message.includes("ship")) {
    return "Delivery is arranged after WhatsApp confirmation. Please share your location and preferred delivery time for the fastest response.";
  } else if (message.includes("whatsapp") || message.includes("contact") || message.includes("support")) {
    return "You may reach us on WhatsApp at +255 624060759. I am here to answer your questions.";
  } else if (message.includes("thank") || message.includes("thanks")) {
    return "You’re welcome. Please let me know if there is anything else I can assist you with.";
  } else {
    return "I am here to assist with product details, sizing, pricing, and orders. Please ask your question or specify how I can help.";
  }
}



