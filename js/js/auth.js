const emailInput = document.getElementById("email");
const sendOtpBtn = document.getElementById("send-otp-btn");
const otpScreen = document.getElementById("otp-screen");
const verifyScreen = document.getElementById("verify-screen");
const otpInput = document.getElementById("otp");
const verifyBtn = document.getElementById("verify-btn");
const backBtn = document.getElementById("back-btn");
const messageEl = document.getElementById("message");

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = "message " + type;
}

sendOtpBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  if (!email) {
    showMessage("Kripya email daalein", "error");
    return;
  }
  sendOtpBtn.disabled = true;
  showMessage("OTP bhej raha hai...", "");

  const { error } = await supabaseClient.auth.signInWithOtp({
    email: email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    showMessage("Error: " + error.message, "error");
    sendOtpBtn.disabled = false;
    return;
  }

  showMessage("OTP aapke email par bhej diya gaya!", "success");
  otpScreen.style.display = "none";
  verifyScreen.style.display = "block";
});

verifyBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const token = otpInput.value.trim();
  if (token.length !== 6) {
    showMessage("6 ank ka code daalein", "error");
    return;
  }
  verifyBtn.disabled = true;
  showMessage("Verify kar raha hai...", "");

  const { error } = await supabaseClient.auth.verifyOtp({
    email: email,
    token: token,
    type: "email",
  });

  if (error) {
    showMessage("Error: " + error.message, "error");
    verifyBtn.disabled = false;
    return;
  }

  showMessage("Login safal! Dashboard khul raha hai...", "success");
  window.location.href = "dashboard.html";
});

backBtn.addEventListener("click", () => {
  verifyScreen.style.display = "none";
  otpScreen.style.display = "block";
  showMessage("", "");
});

(async () => {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    window.location.href = "dashboard.html";
  }
})();
