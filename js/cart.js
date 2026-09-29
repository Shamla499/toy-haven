
function findProduct(id) {

    for (let i = 0; i < products.length; i++) {

        if (products[i].id === id) {
            return products[i];
        }

    }

    return null;   

}

function showCart() {

    const cart = loadData("cart");

    const cartItems = document.getElementById("cartItems");

    const emptyCart = document.getElementById("emptyCart");

    const cartLayout = document.getElementById("cartLayout");

    if (cart.length === 0) {
        emptyCart.style.display = "block";
        cartLayout.style.display = "none";
        return;
    }

    emptyCart.style.display = "none";
    cartLayout.style.display = "flex";

    cartItems.innerHTML = "";   

    let total = 0;

    let totalItems = 0;


    for (let i = 0; i < cart.length; i++) {

        const item = cart[i];

        const product = findProduct(item.id);

        if (product === null) {
            continue;
        }

        const subtotal = product.price * item.quantity;

        total = total + subtotal;

        totalItems = totalItems + item.quantity;

        cartItems.innerHTML += `
            <tr>

                <td data-label="Product">
                    <div class="cart-product">
                        <img src="${product.image}" alt="${product.name}">
                        <div>
                            <p class="product-category">${product.categoryName}</p>
                            <p class="cart-product-name">${product.name}</p>
                        </div>
                    </div>
                </td>

                <td data-label="Price">Rs. ${product.price.toLocaleString()}</td>

                <td data-label="Quantity">
                    <div class="quantity-box">
                        <button type="button" class="quantity-button"
                                onclick="changeQuantity(${product.id}, -1)"
                                aria-label="Remove one ${product.name}">−</button>

                        <span class="quantity-number">${item.quantity}</span>

                        <button type="button" class="quantity-button"
                                onclick="changeQuantity(${product.id}, 1)"
                                aria-label="Add one more ${product.name}">+</button>
                    </div>
                </td>

                <td data-label="Subtotal" class="subtotal">Rs. ${subtotal.toLocaleString()}</td>

                <td data-label="Remove">
                    <button type="button" class="remove-button"
                            onclick="removeItem(${product.id})"
                            aria-label="Remove ${product.name} from cart">🗑</button>
                </td>

            </tr>
        `;

    }


    document.getElementById("totalItems").textContent = totalItems;

    document.getElementById("cartTotal").textContent = "Rs. " + total.toLocaleString();

}


function changeQuantity(id, change) {

    let cart = loadData("cart");


    for (let i = 0; i < cart.length; i++) {

        if (cart[i].id === id) {
            cart[i].quantity = cart[i].quantity + change;
        }

    }


    cart = cart.filter(function (item) {
        return item.quantity > 0;
    });


    saveData("cart", cart);

    showCart();

    updateCartCount();   

}


function removeItem(id) {

    let cart = loadData("cart");

    const product = findProduct(id);

    cart = cart.filter(function (item) {
        return item.id !== id;
    });


    saveData("cart", cart);

    showCart();

    updateCartCount();

    showMessage(product.name + " removed from cart");

}


document.getElementById("clearCartButton").addEventListener("click", function () {

    // ask first, so the user doesn't clear it by mistake
    const sure = confirm("Are you sure you want to remove everything from your cart?");

    if (sure) {

        saveData("cart", []);   

        showCart();

        updateCartCount();

        showMessage("Your cart is now empty");

    }

});


showCart();