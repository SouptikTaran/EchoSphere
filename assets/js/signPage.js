async function register(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastname").value;
    const username = firstName + " " +lastName ;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const params = new URLSearchParams();
    params.append("username" , username);
    params.append("email", email);
    params.append("password", password);
    const response = await fetch("/user/Signup", {
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
    console.log("data: ", data);
    setTimeout(() => {
        message.style.display = 'none';
    }, 5000);
}