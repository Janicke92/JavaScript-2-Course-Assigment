import { AUTH_URL } from './config';

/**
 * Registers a new user with the Noroff API.
 * @param payload - The user data to send.
 * @returns The API response if it is successful.
 * @throws {Error} If the registration fails.
 */
export async function registerNewUser(payload: object) {
    const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const message =
            data?.errors?.[0]?.message || data?.message || res.statusText;
        throw new Error(message);
    }

    return data;
}

type LoginSuccess = {
    accessToken: string;
    email: string;
    name?: string;
};

export async function loginExistingUser(
    email: string,
    password: string
): Promise<LoginSuccess> {
    const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const json = await res.json().catch(() => ({}) as any);

    if (!res.ok) {
        const message =
            json?.errors?.[0]?.message || json?.message || res.statusText;
        throw new Error(message);
    }

    return json.data as LoginSuccess;
}
