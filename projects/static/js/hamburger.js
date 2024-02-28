const burger = document.querySelector(".burger");
const nav = document.querySelector(".header");
const navLinks = document.querySelectorAll(".nav-links div");

burger.addEventListener("click", () => {
  nav.classList.toggle("nav-active");
  burger.classList.toggle("toggle");
});
