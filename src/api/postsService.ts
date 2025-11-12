import { SOCIAL_URL } from './config';

// Remember! move API key to localStorage before deployment
const STATIC_API_KEY = 'e2a86d95-9023-4b1c-8677-8337058737d2';

type Media = { url: string; alt?: string };
type Post = {
    id: number;
    title: string;
    body: string;
    media?: Media;
    tags?: string[];
    created?: string;
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
            media: { url: mediaUrl, alt: 'user-posted image' },
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
