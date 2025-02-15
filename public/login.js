// Selettori degli elementi HTML
const loginButton = document.getElementById("login-button");
const privateSection = document.getElementById("admin-page"); // usiamo admin-page come sezione privata
const loginUsername = document.getElementById("username");
const loginPassword = document.getElementById("password");
const adminContent = document.getElementById("admin-content");
const loginForm = document.getElementById("login-form"); // Aggiungi questa riga per selezionare il form

// Selettori per il pulsante di accesso all'Admin dalla pagina pubblica
const adminAccessButton = document.getElementById("admin-access-button");
const publicPage = document.getElementById("public-page");

// Controllo se l'utente è già loggato
const isLogged = sessionStorage.getItem("Logged") === "true";

// Mostra o nasconde la sezione admin in base allo stato del login
if (privateSection) {
  if (isLogged) {
    privateSection.style.display = "block";
    if (publicPage) {
      publicPage.style.display = "none";
    }
    if (loginForm) {
      loginForm.style.display = "none"; // Nasconde il form di login se già loggato
    }
  } else {
    privateSection.style.display = "none";
    if (loginForm) {
      loginForm.style.display = "block"; // Mostra il form di login se non loggato
    }
  }
}

// Funzione per il login
const login = async (username, password) => {
  try {
    const confResponse = await fetch("conf.json");
    if (!confResponse.ok) throw new Error("Errore nel caricamento di conf.json");
    const confData = await confResponse.json();

    const response = await fetch("https://ws.cipiaceinfo.it/credential/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key: confData.token,
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error("Errore nel login");

    const result = await response.json();

    if (result.result === true) {
      alert("Login effettuato con successo!");
      sessionStorage.setItem("Logged", "true");
      if (privateSection) {
        privateSection.style.display = "block";
      }
      if (publicPage) {
        publicPage.style.display = "none";
      }
      if (adminContent) {
        adminContent.style.display = "block";
      }
      if (loginForm) {
        loginForm.style.display = "none"; // Nasconde il form di login dopo il login
      }
    } else {
      alert("Credenziali errate.");
    }
  } catch (error) {
    console.error("Errore login:", error);
    alert("Login fallito. Controlla le credenziali.");
  }
};

// Gestione del click sul pulsante di login
if (loginButton) {
  loginButton.onclick = (event) => {
    event.preventDefault(); // Previene il submit del form che potrebbe ricaricare la pagina
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (username && password) {
      login(username, password);
    } else {
      alert("Compila tutti i campi.");
    }
  };
} else {
  console.error("Elemento login-button non trovato.");
}

// Gestione del click sul pulsante "Accedi all'Admin" dalla pagina pubblica
if (adminAccessButton && publicPage && privateSection) {
  adminAccessButton.onclick = () => {
    publicPage.style.display = "none";
    privateSection.style.display = "block";
  };
}
