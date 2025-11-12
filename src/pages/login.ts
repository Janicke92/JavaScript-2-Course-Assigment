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
        window.location.href = '../../posts.html';
    } catch (err) {
        // Remember! Add later!
    }
});
