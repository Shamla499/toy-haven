
const feedbackForm = document.getElementById("feedbackForm");

const nameInput = document.getElementById("feedbackName");

const emailInput = document.getElementById("feedbackEmail");

const topicInput = document.getElementById("feedbackTopic");

const messageInput = document.getElementById("feedbackMessage");


function showError(input, errorId, text) {

    document.getElementById(errorId).textContent = text;

    input.classList.add("input-error");         // red border

    input.setAttribute("aria-invalid", "true");

}


function clearError(input, errorId) {

    document.getElementById(errorId).textContent = "";

    input.classList.remove("input-error");

    input.setAttribute("aria-invalid", "false");

}


function checkName() {

    const name = nameInput.value.trim();

    if (name === "") {
        showError(nameInput, "nameError", "Please enter your name.");
        return false;
    }

    if (name.length < 3) {
        showError(nameInput, "nameError", "Your name must have at least 3 letters.");
        return false;
    }

    clearError(nameInput, "nameError");
    return true;

}


function checkEmail() {

    const email = emailInput.value.trim();

    if (email === "") {
        showError(emailInput, "emailError", "Please enter your email address.");
        return false;
    }

    // must have text @ text . text  (e.g. name@gmail.com)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showError(emailInput, "emailError", "Please enter a valid email, e.g. name@gmail.com");
        return false;
    }

    clearError(emailInput, "emailError");
    return true;

}


function checkMessage() {

    const message = messageInput.value.trim();

    if (message === "") {
        showError(messageInput, "messageError", "Please write a message.");
        return false;
    }

    if (message.length < 10) {
        showError(messageInput, "messageError", "Your message must be at least 10 characters.");
        return false;
    }

    clearError(messageInput, "messageError");
    return true;

}


nameInput.addEventListener("blur", checkName);

emailInput.addEventListener("blur", checkEmail);

messageInput.addEventListener("blur", checkMessage);

messageInput.addEventListener("input", function () {

    document.getElementById("characterCount").textContent =
        messageInput.value.length + " / 500";

});



feedbackForm.addEventListener("submit", function (event) {

    event.preventDefault();     

    const nameOK = checkName();
    const emailOK = checkEmail();
    const messageOK = checkMessage();


    if (!nameOK || !emailOK || !messageOK) {

        feedbackForm.classList.add("shake");    

        setTimeout(function () {
            feedbackForm.classList.remove("shake");
        }, 500);

        return;
    }

    const feedbackList = loadData("feedback");

    feedbackList.push({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        topic: topicInput.value,
        message: messageInput.value.trim(),
        date: new Date().toLocaleString()
    });

    saveData("feedback", feedbackList);

    document.getElementById("thankName").textContent = nameInput.value.trim();

    feedbackForm.style.display = "none";

    document.getElementById("thankYou").style.display = "block";


    feedbackForm.reset();

    document.getElementById("characterCount").textContent = "0 / 500";

});


document.getElementById("sendAnother").addEventListener("click", function () {

    document.getElementById("thankYou").style.display = "none";

    feedbackForm.style.display = "block";

});


const faqQuestions = document.querySelectorAll(".faq-question");


faqQuestions.forEach(function (question) {

    question.addEventListener("click", function () {

        const item = question.parentElement;          

        const isOpen = item.classList.contains("open");

        document.querySelectorAll(".faq-item").forEach(function (otherItem) {
            otherItem.classList.remove("open");
            otherItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
            item.classList.add("open");
            question.setAttribute("aria-expanded", "true");
        }

    });

});