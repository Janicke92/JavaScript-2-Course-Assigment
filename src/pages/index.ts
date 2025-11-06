const registerButton =
    document.querySelector<HTMLButtonElement>('#register-button');

registerButton?.addEventListener('click', () => {
    window.location.href = '/register.html';
});

const loginButton = document.querySelector<HTMLButtonElement>('#login-button');

loginButton?.addEventListener('click', () => {
    window.location.href = 'login.html';
});
