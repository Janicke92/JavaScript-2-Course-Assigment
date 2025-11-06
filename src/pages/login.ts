import { AUTH_URL } from '../api/config';

const AUTH_STORAGE_KEY = 'pp_auth';

type LoginResponse = {
    accessToken: string;
    name?: string;
    email?: string;
};

type AuthData = {
    accessToken: string;
    email: string;
    name?: string;
};

function saveAuthenticatedUserDataToLocalStorage(authData: AuthData) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

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
        const data: LoginResponse = await sendLoginDetailsToAPI(
            email,
            password
        );

        if (!data?.accessToken) return;

        saveAuthenticatedUserDataToLocalStorage({
            accessToken: data.accessToken,
            email,
            name: data.name,
        });

        window.location.href = 'posts.html';
    } catch (err) {
        // Remember! Add later!
    }
});

async function sendLoginDetailsToAPI(
    email: string,
    password: string
): Promise<LoginResponse> {
    const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
        const msg =
            json?.errors?.[0]?.message ||
            json?.message ||
            `Login failed: ${res.status}`;
        throw new Error(msg);
    }

    return (json?.data ?? {}) as LoginResponse;
}
