const container = document.getElementById("container");
const registerbtn = document.getElementById("register");
const loginbtn = document.getElementById("login");

registerbtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginbtn.addEventListener("click", () => {
  container.classList.remove("active");
});

import data from "../data.json";
const parse = require('node-html-parser');
console.log(parse(data));

document.getElementById('login-form').addEventListener('submit', function(event) {
  const emailInput = document.getElementById('email');
  const emailValue = emailInput.value;
  if (!emailValue.endsWith('@gmail.com')) {
      alert('Please enter a valid @gmail.com email address.');
      event.preventDefault(); // Prevent form submission
  }
});