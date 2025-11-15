import { registerNewUser } from '../api/authService';

const form = document.querySelector<HTMLFormElement>('#register-form')!;

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorElement = document.querySelector<HTMLElement>('#register-error');
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }

    const fd = new FormData(form);

    const password = String(fd.get('password') ?? '');
    if (password.length < 8) {
        if (errorElement) {
            errorElement.textContent =
                'Password must be at least 8 characters long.';
            errorElement.style.display = 'block';
        }
        return;
    }

    const name = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const bio = String(fd.get('bio') ?? '');
    const avatar = String(fd.get('avatar') ?? '');

    try {
        await registerNewUser({
            name,
            email,
            password,
            bio,
            avatar: { url: avatar, alt: `${name}'s avatar` },
        });

        window.location.href = 'login.html';
    } catch (err: any) {
        if (errorElement) {
            errorElement.textContent =
                err?.message || 'Could not register user. Please try again.';
            errorElement.style.display = 'block';
        }
    }
});
