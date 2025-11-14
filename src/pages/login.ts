import { loginExistingUser } from '../api/authService';
import { saveAuthenticatedUser } from '../storage';

const form = document.querySelector<HTMLFormElement>('#login-form');

form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document
        .querySelector<HTMLInputElement>('#email')
        ?.value.trim();
    const password =
        document.querySelector<HTMLInputElement>('#password')?.value;

    if (!email || !password) {
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
        window.location.href = '../../feed.html';
    } catch (err) {
        // Remember! Add later!
    }
});
