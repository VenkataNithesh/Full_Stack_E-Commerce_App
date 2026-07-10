const LOGIN_API = "http://localhost:8080/api/admins/login";

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const adminId = document.getElementById("adminId").value;
  const password = document.getElementById("password").value;

  fetch(LOGIN_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminId, password })
  })
    .then(res => res.json())
    .then(success => {
      if (success) {
        sessionStorage.setItem("admin_logged_in", "true");
        window.location.href = "admin.html";
      } else {
        alert("Invalid Admin ID or Password");
      }
    })
    .catch(err => {
      console.error("Login failed:", err);
      alert("Server error. Please try again.");
    });
});
