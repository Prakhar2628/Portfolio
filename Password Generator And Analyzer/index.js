function generatePassword() {
    const length = 12; // You can adjust the length as needed
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById("generatedPassword").value = password;
}

function copyPassword() {
    const passwordField = document.getElementById("generatedPassword");
    passwordField.select();
    document.execCommand("copy");
}

function analyzePassword() {
    const password = document.getElementById("passwordInput").value;
    let strength = calculatePasswordStrength(password);
    updateStrengthDisplay(strength);
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[^a-zA-Z0-9]+/)) strength++;
    return strength;
}

function updateStrengthDisplay(strength) {
    const strengthText = document.getElementById("strength-text");
    const strengthBar = document.getElementById("strength-bar");

    switch (strength) {
        case 0:
            strengthText.innerText = "Very Weak";
            strengthBar.style.width = "20%";
            strengthBar.style.backgroundColor = "red";
            break;
        case 1:
            strengthText.innerText = "Weak";
            strengthBar.style.width = "40%";
            strengthBar.style.backgroundColor = "orange";
            break;
        case 2:
            strengthText.innerText = "Moderate";
            strengthBar.style.width = "60%";
            strengthBar.style.backgroundColor = "yellow";
            break;
        case 3:
            strengthText.innerText = "Strong";
            strengthBar.style.width = "80%";
            strengthBar.style.backgroundColor = "green";
            break;
        case 4:
        case 5:
            strengthText.innerText = "Very Strong";
            strengthBar.style.width = "100%";
            strengthBar.style.backgroundColor = "darkgreen";
            break;
        default:
            strengthText.innerText = "-";
            strengthBar.style.width = "0%";
            strengthBar.style.backgroundColor = "lightgray";
    }
}