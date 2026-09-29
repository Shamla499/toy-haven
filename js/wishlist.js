
let currentStatus = "All";    

function findWishlistProduct(id) {

    for (let i = 0; i < products.length; i++) {

        if (products[i].id === id) {
            return products[i];
        }

    }

    return null;

}

function createWishlistCard(product, status) {

    const statusClass = "status-" + status.toLowerCase().replace(" ", "-");

    let interestedActive = "";
    let ownedActive = "";
    let notInterestedActive = "";

    if (status === "Interested") {
        interestedActive = "active";
    } else if (status === "Owned") {
        ownedActive = "active";
    } else {
        notInterestedActive = "active";
    }


    return `
        <article class="wishlist-card ${statusClass}">

            <div class="wishlist-image">

                <img src="${product.image}" alt="${product.name}">

                <span class="status-badge">${status}</span>

            </div>


            <div class="wishlist-info">

                <p class="product-category">${product.categoryName}</p>

                <h3>${product.name}</h3>

                <p class="product-price">Rs. ${product.price.toLocaleString()}</p>


                <!-- the 3 status buttons -->
                <p class="status-label">Mark as:</p>

                <div class="status-buttons">

                    <button type="button" class="status-button interested ${interestedActive}"
                            onclick="changeStatus(${product.id}, 'Interested')">
                        ❤ Interested
                    </button>

                    <button type="button" class="status-button owned ${ownedActive}"
                            onclick="changeStatus(${product.id}, 'Owned')">
                        ✔ Owned
                    </button>

                    <button type="button" class="status-button not-interested ${notInterestedActive}"
                            onclick="changeStatus(${product.id}, 'Not Interested')">
                        ✖ Not Interested
                    </button>

                </div>


                <!-- cart and remove buttons -->
                <div class="wishlist-actions">

                    <button type="button" class="product-button" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                    <button type="button" class="remove-wishlist" onclick="removeFromWishlist(${product.id})"
                            aria-label="Remove ${product.name} from wishlist">
                        🗑
                    </button>

                </div>

            </div>

        </article>
    `;

}



function showWishlist() {

    const wishlist = loadData("wishlist");

    const grid = document.getElementById("wishlistGrid");

    const emptyBox = document.getElementById("emptyWishlist");


    grid.innerHTML = "";

    let shown = 0;


    for (let i = 0; i < wishlist.length; i++) {

        const item = wishlist[i];

        const product = findWishlistProduct(item.id);

        if (product === null) {
            continue;
        }

        if (currentStatus === "All" || item.status === currentStatus) {
            grid.innerHTML += createWishlistCard(product, item.status);
            shown++;
        }

    }


    if (shown === 0) {

        emptyBox.style.display = "block";

        if (wishlist.length === 0) {
            document.getElementById("emptyTitle").textContent = "Your wishlist is empty";
            document.getElementById("emptyText").textContent = "Tap the ♡ on any product to save it here.";
        } else {
            document.getElementById("emptyTitle").textContent = "Nothing here yet";
            document.getElementById("emptyText").textContent = "No toys are marked as \"" + currentStatus + "\".";
        }

    } else {
        emptyBox.style.display = "none";
    }


    updateCounts();

}


function updateCounts() {

    const wishlist = loadData("wishlist");

    let interested = 0;
    let owned = 0;
    let notInterested = 0;


    for (let i = 0; i < wishlist.length; i++) {

        if (wishlist[i].status === "Interested") {
            interested++;
        } else if (wishlist[i].status === "Owned") {
            owned++;
        } else {
            notInterested++;
        }

    }


    document.getElementById("countAll").textContent = wishlist.length;

    document.getElementById("countInterested").textContent = interested;

    document.getElementById("countOwned").textContent = owned;

    document.getElementById("countNotInterested").textContent = notInterested;

}


function changeStatus(id, newStatus) {

    const wishlist = loadData("wishlist");


    for (let i = 0; i < wishlist.length; i++) {

        if (wishlist[i].id === id) {
            wishlist[i].status = newStatus;
        }

    }


    saveData("wishlist", wishlist);    

    showWishlist();

    showMessage("Marked as " + newStatus);

}


function removeFromWishlist(id) {

    let wishlist = loadData("wishlist");

    const product = findWishlistProduct(id);

    wishlist = wishlist.filter(function (item) {
        return item.id !== id;
    });


    saveData("wishlist", wishlist);

    showWishlist();

    showMessage(product.name + " removed from wishlist");

}


const statusTabs = document.querySelectorAll(".status-tab");


statusTabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        currentStatus = tab.dataset.status;

        statusTabs.forEach(function (otherTab) {
            otherTab.classList.remove("active");
        });

        tab.classList.add("active");


        showWishlist();

    });

});


showWishlist();