
  function toggleMenu() {
  document.querySelector(".top-bar").classList.toggle("active");
}
  let reviews = {};
let currentProductName = "";
  

function addReview() {
  let text = document.getElementById("reviewText").value;

  if (text === "") return;

  if (!reviews[currentProductName]) {
    reviews[currentProductName] = [];
  }
  reviews[currentProductName].push(text);
  document.getElementById("reviewText").value = "";

  displayReviews();
}

function displayReviews() {
  let box = document.getElementById("reviewsList");
  box.innerHTML = "";

  reviews[currentProductName]?.forEach(r => {
    box.innerHTML += "<p>💬 " + r + "</p>";
  });
}


  let selectedProduct = null;

function openModal(name, price, img, desc) {
  selectedProduct = { name, price };
  currentProductName = name;

  document.getElementById("modalName").innerText = name;
  document.getElementById("modalPrice").innerText = price;
  document.getElementById("modalImg").src = img;
  document.getElementById("modalDesc").innerText = desc;

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
  c.style.display = c.style.display === "flex" ? "none" : "flex";
}

function sendMessage() {
  let input = document.getElementById("userInput").value;
  let chat = document.getElementById("chat");

  if(!input) return;

  chat.innerHTML += "<div class='user'>"+input+"</div>";

  let reply = getBotReply(input);

  chat.innerHTML += "<div class='bot'>"+reply+"</div>";

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

function getBotReply(message) { message = message.toLowerCase(); 
if (message.includes("price")) { return "Prices are 15,000 TSh (~$6) 😊"; } 
else if (message.includes("hello")) { return "Hi 👋 Welcome to Mariam Sandal Store!"; } 
else if (message.includes("size")) { return "All sizes are available: 0 - 50👍"; } 
else if (message.includes("buy")) { return "Click Buy Now to order via WhatsApp 📲"; } 
else { return "Ask me about price, size or buying 😊"; } }



