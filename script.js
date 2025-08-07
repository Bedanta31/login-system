const firebaseConfig = {
  apiKey: "AIzaSyA3fybKFHQwk65Mw-dPDiQU4TQqeUzq9nU",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function showMessage(text, type) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.className = "message " + type;
}

function toggleLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return showMessage("Please enter both email and password.", "error");

  toggleLoader(true);
  showMessage("", "");

  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    if (!result.user.emailVerified) {
      await auth.signOut();
      showMessage("Your email is not verified. Check your mailbox.", "error");
    } else {
      const doc = await db.collection("users").doc(result.user.uid).get();
      const role = doc.exists ? doc.data().role : null;
      if (role === "Technician") window.location.href = "technician.html";
      else if (role === "Engineer") window.location.href = "engineer.html";
      else showMessage("Unknown role. Contact Admin.", "error");
    }
  } catch (error) {
    const msg = error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials'
      ? "Wrong Email or Password"
      : error.message;
    showMessage("Login failed: " + msg, "error");
  } finally {
    toggleLoader(false);
  }
}
