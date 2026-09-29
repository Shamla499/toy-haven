
const DELIVERY_FEE = 350;           

const FREE_DELIVERY_FROM = 5000;     

function findCheckoutProduct(id) {

    for (let i = 0; i < products.length; i++) {

        if (products[i].id === id) {
            return products[i];
        }

    }

    return null;

}


function calculateOrder() {

    const cart = loadData("cart");

    const items = [];

    let subtotal = 0;


    for (let i = 0; i < cart.length; i++) {

        const product = findCheckoutProduct(cart[i].id);

        if (product === null) {
            continue;
        }

        items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: cart[i].quantity
        });

        subtotal = subtotal + product.price * cart[i].quantity;

    }

    let delivery = DELIVERY_FEE;

    if (subtotal >= FREE_DELIVERY_FROM) {
        delivery = 0;
    }


    return {
        items: items,
        subtotal: subtotal,
        delivery: delivery,
        total: subtotal + delivery
    };

}


function itemsToHTML(items) {

    let html = "";

    for (let i = 0; i < items.length; i++) {

        const item = items[i];

        html += `
            <li>
                <span>${item.name} × ${item.quantity}</span>
                <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
            </li>
        `;

    }

    return html;

}


function showSummary() {

    const order = calculateOrder();

    if (order.items.length === 0) {
        document.getElementById("checkoutEmpty").style.display = "block";
        document.getElementById("checkoutLayout").style.display = "none";
        return;
    }


    document.getElementById("summaryItems").innerHTML = itemsToHTML(order.items);

    document.getElementById("subtotalAmount").textContent = "Rs. " + order.subtotal.toLocaleString();

    if (order.delivery === 0) {
        document.getElementById("deliveryAmount").textContent = "FREE";
    } else {
        document.getElementById("deliveryAmount").textContent = "Rs. " + order.delivery.toLocaleString();
    }

    document.getElementById("totalAmount").textContent = "Rs. " + order.total.toLocaleString();

}


function getPaymentMethod() {

    return document.querySelector('input[name="payment"]:checked').value;

}


document.querySelectorAll('input[name="payment"]').forEach(function (radio) {

    radio.addEventListener("change", function () {

        document.querySelectorAll(".payment-option").forEach(function (option) {
            option.classList.remove("selected");
        });

        radio.parentElement.classList.add("selected");


        if (getPaymentMethod() === "Card") {
            document.getElementById("cardDetails").style.display = "block";
        } else {
            document.getElementById("cardDetails").style.display = "none";
        }

    });

});


function setError(id, text) {

    document.getElementById(id + "Error").textContent = text;

    document.getElementById(id).classList.add("input-error");

    document.getElementById(id).setAttribute("aria-invalid", "true");

}


function clearFieldError(id) {

    document.getElementById(id + "Error").textContent = "";

    document.getElementById(id).classList.remove("input-error");

    document.getElementById(id).setAttribute("aria-invalid", "false");

}

function getValue(id) {

    return document.getElementById(id).value.trim();

}


function validateForm() {

    let isValid = true;

    if (getValue("fullName").length < 3) {
        setError("fullName", "Please enter your full name (at least 3 letters).");
        isValid = false;
    } else {
        clearFieldError("fullName");
    }


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(getValue("email"))) {
        setError("email", "Please enter a valid email, e.g. name@gmail.com");
        isValid = false;
    } else {
        clearFieldError("email");
    }

    const phonePattern = /^0\d{9}$/;

    if (!phonePattern.test(getValue("phone").replace(/\s/g, ""))) {
        setError("phone", "Please enter a 10-digit phone number, e.g. 0712345678");
        isValid = false;
    } else {
        clearFieldError("phone");
    }

    if (getValue("address").length < 10) {
        setError("address", "Please enter your full delivery address.");
        isValid = false;
    } else {
        clearFieldError("address");
    }

    if (getPaymentMethod() === "Card") {

        const cardNumber = getValue("cardNumber").replace(/\s/g, "");

        if (!/^\d{16}$/.test(cardNumber)) {
            setError("cardNumber", "Card number must be 16 digits.");
            isValid = false;
        } else {
            clearFieldError("cardNumber");
        }

        if (!isExpiryValid(getValue("expiry"))) {
            setError("expiry", "Enter a valid future date as MM/YY.");
            isValid = false;
        } else {
            clearFieldError("expiry");
        }

        if (!/^\d{3}$/.test(getValue("cvv"))) {
            setError("cvv", "CVV must be 3 digits.");
            isValid = false;
        } else {
            clearFieldError("cvv");
        }

    }


    return isValid;

}


function isExpiryValid(text) {

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(text)) {
        return false;
    }

    const month = Number(text.substring(0, 2));

    const year = 2000 + Number(text.substring(3, 5));

    const today = new Date();

    const thisMonth = today.getMonth() + 1;      

    const thisYear = today.getFullYear();

    return year > thisYear || (year === thisYear && month >= thisMonth);

}


document.getElementById("checkoutForm").addEventListener("submit", function (event) {

    event.preventDefault();     


    if (!validateForm()) {

        const firstError = document.querySelector(".input-error");

        if (firstError) {
            firstError.focus();
        }

        return;
    }

    const order = calculateOrder();

    document.getElementById("confirmName").textContent = getValue("fullName");

    document.getElementById("confirmEmail").textContent = getValue("email");

    document.getElementById("confirmPhone").textContent = getValue("phone");

    document.getElementById("confirmAddress").textContent = getValue("address");

    document.getElementById("confirmPayment").textContent = getPaymentMethod();

    document.getElementById("confirmItems").innerHTML = itemsToHTML(order.items);

    document.getElementById("confirmTotal").textContent = "Rs. " + order.total.toLocaleString();


    document.getElementById("confirmModal").showModal();

});

document.getElementById("editOrderButton").addEventListener("click", function () {

    document.getElementById("confirmModal").close();

});


document.getElementById("placeOrderButton").addEventListener("click", function () {

    const order = calculateOrder();

    const orderNumber = "TH" + String(Date.now()).slice(-6);

    const orders = loadData("orders");

    orders.push({
        orderNumber: orderNumber,
        date: new Date().toLocaleString(),
        name: getValue("fullName"),
        email: getValue("email"),
        phone: getValue("phone"),
        address: getValue("address"),
        payment: getPaymentMethod(),
        items: order.items,
        subtotal: order.subtotal,
        delivery: order.delivery,
        total: order.total
    });

    saveData("orders", orders);

    saveData("cart", []);

    updateCartCount();

    document.getElementById("confirmModal").close();

    document.getElementById("checkoutLayout").style.display = "none";

    document.getElementById("orderNumber").textContent = orderNumber;

    document.getElementById("successDetails").textContent =
        "Total paid: Rs. " + order.total.toLocaleString() + " (" + getPaymentMethod() + "). " +
        "A confirmation will be sent to " + getValue("email") + ".";

    document.getElementById("orderSuccess").style.display = "block";

    window.scrollTo({ top: 0, behavior: "smooth" });

});


showSummary();