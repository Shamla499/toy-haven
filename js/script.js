const observer = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }

    });

});


document.querySelectorAll(".reveal").forEach(function (item) {

    observer.observe(item);

});


function saveData(key, data) {

    localStorage.setItem(key, JSON.stringify(data));

}


function loadData(key) {

    return JSON.parse(localStorage.getItem(key)) || [];

}


function showMessage(text) {

    const message = document.createElement("div");

    message.className = "toast";

    message.textContent = text;

    document.body.appendChild(message);

    setTimeout(function () {
        message.remove();
    }, 2500);

}

/* Mobile*/
const menuButton = document.getElementById("menuButton");

const navigation = document.getElementById("navigation");


if (menuButton && navigation) {

    menuButton.addEventListener("click", function () {

        navigation.classList.toggle("show");

        menuButton.classList.toggle("open");   // turns the 3 lines into an X

    });

}

function addToCart(id) {

    let cart = loadData("cart");

    let found = false;

    for (let i = 0; i < cart.length; i++) {

        if (cart[i].id === id) {
            cart[i].quantity = cart[i].quantity + 1;
            found = true;
        }

    }

    if (found === false) {
        cart.push({ id: id, quantity: 1 });
    }


    saveData("cart", cart);

    updateCartCount();

    for (let i = 0; i < products.length; i++) {

        if (products[i].id === id) {
            showMessage(products[i].name + " added to cart!");
        }

    }

}


function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }


    let cart = loadData("cart");

    let total = 0;


    for (let i = 0; i < cart.length; i++) {
        total = total + cart[i].quantity;
    }


    cartCount.textContent = total;

}


updateCartCount();


function createProductCard(product) {

    return `
        <article class="product-card">

            <div class="product-image ${product.category}">
                <img src="${product.image}" alt="${product.name}"
                style="width: ${product.imageSize || 90}%; height: ${product.imageSize || 90}%;">
            </div>

            <div class="product-information">

                <p class="product-category">${product.categoryName}</p>

                <h3>${product.name}</h3>

                <p class="product-price">Rs. ${product.price}</p>

                <button type="button" class="product-button" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

            </div>

        </article>
    `;

}


const featuredContainer = document.getElementById("featuredContainer");


if (featuredContainer) {

    for (let i = 0; i < products.length; i++) {

        if (products[i].featured === true) {
            featuredContainer.innerHTML += createProductCard(products[i]);
        }

    }

}


function displayProductOfDay() {

    const name = document.getElementById("productOfDayName");

    if (!name) {
        return;
    }


    const today = new Date().getDate();

    const productIndex = today % products.length;

    const product = products[productIndex];


    name.textContent = product.name;

    document.getElementById("productOfDayDescription").textContent = product.description;

    document.getElementById("productOfDayPrice").textContent = "Rs. " + product.price;

    document.getElementById("productOfDayImage").src = product.image;

    document.getElementById("productOfDayImage").alt = product.name;
    document.getElementById("productOfDayImage").style.width = (product.imageSize || 90) + "%";

    document.getElementById("productOfDayImage").style.height = (product.imageSize || 90) + "%";


    document.getElementById("productOfDayButton").addEventListener("click", function () {
        addToCart(product.id);
    });

}


displayProductOfDay();


const newsletterForm = document.getElementById("newsletterForm");


if (newsletterForm) {

    newsletterForm.addEventListener("submit", function (event) {

        event.preventDefault();   // stop the page from reloading


        const emailInput = document.getElementById("newsletterEmail");

        const message = document.getElementById("newsletterMessage");

        const email = emailInput.value.trim();

        if (email === "") {
            message.textContent = "Please enter your email address.";
            message.className = "error";
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            message.textContent = "Please enter a valid email address.";
            message.className = "error";
            return;
        }

        let emails = loadData("newsletter");

        if (emails.includes(email)) {
            message.textContent = "You have already subscribed!";
            message.className = "success";
            return;
        }

        emails.push(email);

        saveData("newsletter", emails);


        message.textContent = "Thank you for subscribing to Toy Haven!";
        message.className = "success";

        emailInput.value = "";

    });

}


const heroBanners = [

    {
        title: "Discover Your Next Favourite Toy",
        text: "Explore our exciting collection of toys, figurines, board games and diecast cars.",
        image: "images/toy banner 1.png",
        link: "products.html"
    },

    {
        title: "Collect Amazing Figurines",
        text: "Heroes and characters for every shelf and desk.",
        image: "images/toy banner 2.png",
        link: "products.html?category=figurines"
    },

    {
        title: "Fun Board Games for Everyone",
        text: "Bring the family together for a great game night.",
        image: "images/toy banner 3.png",
        link: "products.html?category=board-games"
    },

    {
        title: "Detailed Diecast Cars",
        text: "Classic and racing model cars for collectors.",
        image: "images/car-1.png",
        link: "products.html?category=diecast-cars"
    }

];


let heroIndex = 0;


function changeHeroBanner() {

    const heroImage = document.getElementById("heroImage");

    const heroContent = document.getElementById("heroContent");


    if (!heroImage) {
        return;
    }


    heroIndex++;

    if (heroIndex >= heroBanners.length) {
        heroIndex = 0;
    }


    // 1. fade out
    heroImage.classList.add("fade");
    heroContent.classList.add("fade");

    setTimeout(function () {

        const banner = heroBanners[heroIndex];

        heroImage.src = banner.image;
        heroImage.alt = banner.title;

        document.getElementById("herotitle").textContent = banner.title;
        document.getElementById("herodescription").textContent = banner.text;
        document.getElementById("heroButton").href = banner.link;

        heroImage.classList.remove("fade");
        heroContent.classList.remove("fade");

    }, 500);

}


setInterval(changeHeroBanner, 4000);


if ("serviceWorker" in navigator && location.protocol !== "file:") {

    navigator.serviceWorker.register("sw.js");

}