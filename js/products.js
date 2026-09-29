let currentCategory = "all";     

let searchText = "";             


function createShopCard(product) {

    let heart = "♡";

    if (isInWishlist(product.id)) {
        heart = "♥";
    }


    return `
        <article class="product-card">

            <div class="product-image ${product.category}">

                <img src="${product.image}" alt="${product.name}"
                     style="width: ${product.imageSize || 90}%; height: ${product.imageSize || 90}%;">

                <button type="button" class="heart-button" onclick="toggleWishlist(${product.id})"
                        aria-label="Add ${product.name} to wishlist">${heart}</button>

            </div>

            <div class="product-information">

                <p class="product-category">${product.categoryName}</p>

                <h3>${product.name}</h3>

                <p class="product-price">Rs. ${product.price.toLocaleString()}</p>

                <div class="card-buttons">

                    <button type="button" class="product-button" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                    <button type="button" class="view-button" onclick="openModal(${product.id})">
                        Quick View
                    </button>

                </div>

            </div>

        </article>
    `;

}


function showProducts() {

    const productGrid = document.getElementById("productGrid");

    const noResults = document.getElementById("noResults");

    const resultCount = document.getElementById("resultCount");


    productGrid.innerHTML = "";   // clear the old cards

    let count = 0;


    for (let i = 0; i < products.length; i++) {

        const product = products[i];

        const categoryMatches =
            currentCategory === "all" || product.category === currentCategory;

        const searchMatches =
            product.name.toLowerCase().includes(searchText);

        if (categoryMatches && searchMatches) {
            productGrid.innerHTML += createShopCard(product);
            count++;
        }

    }

    resultCount.textContent = "Showing " + count + " product(s)";

    if (count === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

}


const filterButtons = document.querySelectorAll(".filter-button");


function selectCategory(category) {

    currentCategory = category;

    filterButtons.forEach(function (button) {

        if (button.dataset.category === category) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }

    });


    showProducts();

}


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        selectCategory(button.dataset.category);

    });

});


document.getElementById("searchInput").addEventListener("input", function () {

    searchText = this.value.trim().toLowerCase();

    showProducts();

});



function isInWishlist(id) {

    const wishlist = loadData("wishlist");

    for (let i = 0; i < wishlist.length; i++) {

        if (wishlist[i].id === id) {
            return true;
        }

    }

    return false;

}


function toggleWishlist(id) {

    let wishlist = loadData("wishlist");

    const product = getProductById(id);


    if (isInWishlist(id)) {

        wishlist = wishlist.filter(function (item) {
            return item.id !== id;
        });

        showMessage(product.name + " removed from wishlist");

    } else {

        wishlist.push({ id: id, status: "Interested" });

        showMessage("♥ " + product.name + " added to wishlist!");

    }


    saveData("wishlist", wishlist);

    showProducts();          

    updateModalHeart(id);    

}


function getProductById(id) {

    for (let i = 0; i < products.length; i++) {

        if (products[i].id === id) {
            return products[i];
        }

    }

}


function openModal(id) {

    const product = getProductById(id);

    document.getElementById("modalImage").src = product.image;

    document.getElementById("modalImage").alt = product.name;

    document.getElementById("modalCategory").textContent = product.categoryName;

    document.getElementById("modalName").textContent = product.name;

    document.getElementById("modalPrice").textContent = "Rs. " + product.price.toLocaleString();

    document.getElementById("modalDescription").textContent = product.description;


    document.getElementById("modalCartButton").onclick = function () {
        addToCart(id);
    };

    document.getElementById("modalWishlistButton").onclick = function () {
        toggleWishlist(id);
    };

    updateModalHeart(id);


    document.getElementById("productModal").showModal();

}


function updateModalHeart(id) {

    const button = document.getElementById("modalWishlistButton");

    if (isInWishlist(id)) {
        button.textContent = "♥ In Wishlist";
    } else {
        button.textContent = "♡ Add to Wishlist";
    }

}


document.getElementById("closeModal").addEventListener("click", function () {

    document.getElementById("productModal").close();

});


document.getElementById("productModal").addEventListener("click", function (event) {

    if (event.target === this) {
        this.close();
    }

});


const urlCategory = new URLSearchParams(window.location.search).get("category");


if (urlCategory) {
    selectCategory(urlCategory);
} else {
    showProducts();
}