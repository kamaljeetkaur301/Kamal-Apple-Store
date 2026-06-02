let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

async function fetchProducts() {
    try {
        const response = await fetch("products.json");
        products = await response.json();
        console.log(products);
        displayProducts(products);
        populateCategories();
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function displayProducts(productsToDisplay) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    productsToDisplay.forEach((product) => {
        const productCard = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="price">Rs ${product.price.toFixed(2)}</p>
                <p class="category">${product.category}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", productCard);
    });
}
//polulate category dropdown
function populateCategories() {
    const categories = [...new Set(products.map((p) => p.category))];
    const filter = document.getElementById("category-filter");
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filter.appendChild(option);
    });
}
// 🛒 CART FUNCTIONS

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    cartContainer.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        cartContainer.innerHTML += `
            <li>
                ${item.title} x ${item.quantity}
                - Rs ${(item.price * item.quantity).toFixed(2)}
                <button onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </li>
        `;
    });

    totalElement.textContent = total.toFixed(2);

    document.getElementById("cart-count").textContent = count;
    document.getElementById("cart-badge").textContent = count;
}
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}
// Event Listeners
document.getElementById("search").addEventListener("input", filterProducts);
document.getElementById("category-filter").addEventListener("change", filterProducts);
document.getElementById("sort").addEventListener("change", sortProducts);

function filterProducts() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const category = document.getElementById("category-filter").value;

    let filtered = products.filter((product) => {
        return (
            product.title.toLowerCase().includes(searchTerm) &&
            (category === "all" || product.category === category)
        );
    });

    displayProducts(filtered);
}

function sortProducts() {
    const sortValue = document.getElementById("sort").value;
    let sortedProducts = [...products];

    switch (sortValue) {
        case "price-low":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case "Price-High":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
    }

    displayProducts(sortedProducts);
}
fetchProducts();