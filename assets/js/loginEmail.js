async function loginUser(event) {
    event.preventDefault(); // Prevent form submission
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    const response = await fetch("/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });

    const data = await response.json();
    const message = document.getElementById("loginMessage");
    if (data.redirect) {
        window.location.href = data.redirect;
    } else {
        message.innerHTML = `<strong>${data.error}</strong>`;
        message.style.display = "block";
    }   
    setTimeout(() => {
        message.style.display = "none";
    }, 5000);
}