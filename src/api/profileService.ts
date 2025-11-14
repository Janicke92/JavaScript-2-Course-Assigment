import { SOCIAL_URL } from './config';
import {
    getAccessTokenFromLocalStorage,
    getApiKeyFromLocalStorage,
} from '../storage';

export async function followProfile(name: string) {
    const token = getAccessTokenFromLocalStorage();
    const apiKey = getApiKeyFromLocalStorage();
    if (!token) throw new Error('Missing token');
    if (!apiKey) throw new Error('Missing API key');

    const res = await fetch(`${SOCIAL_URL}/profiles/${name}/follow`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': apiKey,
        },
    });

    if (!res.ok) {
        throw new Error('Could not follow user');
    }

    return res.json();
}

export async function unfollowProfile(name: string) {
    const token = getAccessTokenFromLocalStorage();
    const apiKey = getApiKeyFromLocalStorage();
    if (!token) throw new Error('Missing token');
    if (!apiKey) throw new Error('Missing API key');

    const res = await fetch(`${SOCIAL_URL}/profiles/${name}/unfollow`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': apiKey,
        },
    });

    if (!res.ok) {
        throw new Error('Could not unfollow user');
    }

    return res.json();
}

export async function getProfileWithFollowing(name: string) {
    const token = getAccessTokenFromLocalStorage();
    const apiKey = getApiKeyFromLocalStorage();
    if (!token) throw new Error('Missing token');
    if (!apiKey) throw new Error('Missing API key');

    const res = await fetch(`${SOCIAL_URL}/profiles/${name}?_following=true`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': apiKey,
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
