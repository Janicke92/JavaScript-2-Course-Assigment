import type { Post } from '../api/postsService';

/**
 * Generates HTML for a single post.
 * @param {Post} post - The post object from the API.
 * @returns {string} HTML markup for the post.
 */
export function PostCard(post: Post): string {
    return `
    <article class="post">
        ${
            post.title
                ? `<h3><a href="post.html?id=${post.id}">${post.title}</a></h3>`
                : ''
        }
        ${
            post.media?.url
                ? `<a href="post.html?id=${post.id}">
                <img src="${post.media.url}" alt="${post.media.alt ?? 'Post image'}" width="200">
                </a>`
                : ''
        }
        ${post.body ? `<p>${post.body}</p>` : ''}
        <small>By ${post.author?.name || 'Anonymous'}</small>
        </article>
    `;
}
