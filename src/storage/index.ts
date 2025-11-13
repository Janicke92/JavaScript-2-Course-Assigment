export const AUTH_STORAGE_KEY = 'petpalace_auth';

export type AuthData = {
    accessToken: string;
    email: string;
    name?: string;
};

export function saveAuthenticatedUser(auth: AuthData) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function getAccessTokenFromLocalStorage(): string | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as AuthData;
        return parsed.accessToken ?? null;
    } catch {
        return null;
    }
}

export function getUserFromLocalStorage(): AuthData | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    try {
        const data = JSON.parse(raw) as AuthData;

        if (!data.email || !data.accessToken) {
            return null;
        }

        return data;
    } catch {
        return null;
    }
}
