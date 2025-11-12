import { registerNewUser } from '../api/authService';

const form = document.querySelector<HTMLFormElement>('#register-form')!;

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(form);

    const password = String(fd.get('password') ?? '');
    if (password.length < 8) {
        return; // Remember! Add lateer
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
    } catch (err) {
        // Remember! Add later
    }
});
