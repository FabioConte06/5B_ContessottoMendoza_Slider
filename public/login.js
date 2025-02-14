const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const privateSection = document.getElementById("private-section");
const registerUsername = document.getElementById("register-username");
const registerPassword = document.getElementById("register-password");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const openModalButton = document.getElementById("openModalButton");
const modifyButton = document.getElementById("modifyButton");
const deleteButton = document.getElementById("deleteButton");

const isLogged = sessionStorage.getItem("Logged") === "true";

if (isLogged) {
}

const register = function (username, password) {
  return fetch("conf.json")
    .then((response) => response.json())
    .then((confData) => {
      return fetch("https://ws.cipiaceinfo.it/credential/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          key: confData.cacheToken,
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => {
          console.log("Stato HTTP:", response.status);
          return response.json();
        })
        .then((result) => {
          console.log("Corpo della risposta:", result);
          if (result.result === "Ok") {
            alert("Registrazione completata con successo!");
            sessionStorage.setItem("Logged", "true");
          } else {
            console.error("Errore durante la registrazione:", result);
            alert("Registrazione fallita.");
          }
        })
        .catch((error) => {
          console.error("Errore registrazione:", error);
          alert("Registrazione fallita.");
        });
    });
};

const login = function (username, password) {
  return fetch("conf.json")
    .then((response) => response.json())
    .then((confData) => {
      return fetch("https://ws.cipiaceinfo.it/credential/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          key: confData.cacheToken,
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.result === true) {
            alert("Login effettuato con successo!");
            sessionStorage.setItem("Logged", "true");
          } else {
            alert("Credenziali errate.");
          }
        })
        .catch((error) => {
          console.error("Errore login:", error);
          alert("Login fallito. Controlla le credenziali.");
        });
    });
};

loginButton.onclick = () => {
  const username = loginUsername.value;
  const password = loginPassword.value;
  if (username && password) {
    login(username, password);
  } else {
    alert("Compila tutti i campi.");
  }
};