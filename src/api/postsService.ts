import { getAccessTokenFromLocalStorage } from '../storage';
import { SOCIAL_URL } from './config';

// Remember! move API key to localStorage before deployment
const STATIC_API_KEY = 'e2a86d95-9023-4b1c-8677-8337058737d2';

type Media = { url: string; alt?: string };

export type Post = {
    id: number;
    title: string;
    body: string;
    media?: Media;
    tags?: string[];
    created?: string;
    author?: {
        name?: string;
        email?: string;
        avatar?: string | null;
    };
};

/**
 * Creates a new post on the Noroff API.
 * @param {string} title - The title of the post.
 * @param {string} body - The main text content of the post.
 * @param {string} mediaUrl - The URL of the image used in the post.
 * @param {string} token - The access token from the logged in user.
 * @returns {Promise<object>} - The data for the created post.
 * @throws {Error} - If the API request fails.
 * @example
 * // Example usage:
 * const post = await createNewPost("My Title", "Hello world!", "https://example.com/image.jpg", token);
 */
export async function createNewPost(
    title: string,
    body: string,
    mediaUrl: string,
    token: string
) {
    const res = await fetch(`${SOCIAL_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': STATIC_API_KEY,
        },
        body: JSON.stringify({
            title,
            body,
            media: { url: mediaUrl, alt: 'user image' },
        }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg =
            json?.errors?.[0]?.message ||
            json?.message ||
            `Post failed: ${res.status}`;
        throw new Error(msg);
    }
    return json.data;
}

export async function getAllPosts(token: string) {
    const response = await fetch(
        'https://v2.api.noroff.dev/social/posts?_author=true',
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': STATIC_API_KEY,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    return data.data;
}

export async function getPostById(id: string, token: string): Promise<Post> {
    const response = await fetch(
        `${SOCIAL_URL}/posts/${id}?_author=true&_comments=true&_reactions=true`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': STATIC_API_KEY,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch post');
    }

    const data = await response.json();
    return data.data;
}

export async function getPostsByProfile(name: string) {
    const token = getAccessTokenFromLocalStorage();
    if (!token) {
        throw new Error('Missing access token');
    }

    const res = await fetch(
        `${SOCIAL_URL}/profiles/${name}/posts?_author=true`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': STATIC_API_KEY,
            },
        }
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
        const msg =
            json?.errors?.[0]?.message ||
            json?.message ||
            `Get posts failed: ${res.status}`;

        throw new Error(msg);
    }

    return json.data;
}

export async function deleteUserPost(id: string, token: string) {
    const res = await fetch(`${SOCIAL_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': STATIC_API_KEY,
        },
    });

    if (!res.ok) {
        let message = `Delete failed: ${res.status}`;

        try {
            const json = await res.json();
            message = json?.errors?.[0]?.message || json?.message || message;
        } catch {}

        throw new Error(message);
    }

    return;
}

export async function updateUserPost(
    id: string,
    title: string,
    body: string,
    mediaUrl: string,
    token: string
) {
    const res = await fetch(`${SOCIAL_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': STATIC_API_KEY,
        },
        body: JSON.stringify({
            title,
            body,
            media: { url: mediaUrl, alt: 'updated image' },
        }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message =
            json?.errors?.[0]?.message ||
            json?.message ||
            `Update failed: ${res.status}`;
        throw new Error(message);
    }

    return json.data;
}

export async function searchPosts(query: string, token: string) {
    const res = await fetch(
        `${SOCIAL_URL}/posts/search?q=${encodeURIComponent(query)}&_author=true`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': STATIC_API_KEY,
            },
        }
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
        const msg =
            json?.errors?.[0]?.message ||
            json?.message ||
            `Search failed: ${res.status}`;
        throw new Error(msg);
    }

    return json.data;
}
