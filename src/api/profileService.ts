import { SOCIAL_URL } from './config';
import { getAccessTokenFromLocalStorage } from '../storage';

const STATIC_API_KEY = 'e2a86d95-9023-4b1c-8677-8337058737d2';

export async function followProfile(name: string) {
    const token = getAccessTokenFromLocalStorage();
    if (!token) throw new Error('Missing token');

    const res = await fetch(`${SOCIAL_URL}/profiles/${name}/follow`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': STATIC_API_KEY,
        },
    });

    if (!res.ok) {
        throw new Error('Could not follow user');
    }

    return res.json();
}

export async function unfollowProfile(name: string) {
    const token = getAccessTokenFromLocalStorage();
    if (!token) throw new Error('Missing token');

    const res = await fetch(`${SOCIAL_URL}/profiles/${name}/unfollow`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': STATIC_API_KEY,
        },
    });

    if (!res.ok) {
        throw new Error('Could not unfollow user');
    }

    return res.json();
}

export async function getProfileWithFollowing(name: string) {
    const token = getAccessTokenFromLocalStorage();
    if (!token) throw new Error('Missing token');

    const res = await fetch(`${SOCIAL_URL}/profiles/${name}?_following=true`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': STATIC_API_KEY,
        },
    });

    const json = await res.json();

    if (!res.ok) {
        const msg =
            json?.errors?.[0]?.message ||
            json?.message ||
            'Could not load profile';
        throw new Error(msg);
    }

    return json.data;
}
