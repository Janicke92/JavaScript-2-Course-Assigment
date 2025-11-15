import { loginExistingUser } from '../api/authService';
import { saveAuthenticatedUser } from '../storage';

const form = document.querySelector<HTMLFormElement>('#login-form');

form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const errorElement = document.querySelector<HTMLElement>('#login-error');
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }

    const email = document
        .querySelector<HTMLInputElement>('#email')
        ?.value.trim();
    const password =
        document.querySelector<HTMLInputElement>('#password')?.value;

    if (!email || !password) {
        if (errorElement) {
            errorElement.textContent = 'Please enter both email and password.';
            errorElement.style.display = 'block';
        }
        return;
    }

    try {
        const data = await loginExistingUser(email, password);
        saveAuthenticatedUser({
            accessToken: data.accessToken,
            email: data.email,
            name: data.name,
        });
        localStorage.setItem('apiKey', 'e2a86d95-9023-4b1c-8677-8337058737d2');
        window.location.href = 'feed.html';
    } catch (err: any) {
        if (errorElement) {
            errorElement.textContent =
                err?.message || 'Incorrect email or password.';
            errorElement.style.display = 'block';
        }
    }
});
