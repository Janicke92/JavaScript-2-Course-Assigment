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
                ? `<div class="post-header">
                    <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
                </div>`
                : ''
        }

        ${
            post.media?.url
                ? `<div class="post-media">
                    <a href="post.html?id=${post.id}">
                        <img src="${post.media.url}" alt="${post.media.alt ?? 'Post image'}">
                    </a>
                </div>`
                : ''
        }

        ${
            post.body
                ? `<div class="post-body">
                    <p>${post.body}</p>
                </div>`
                : ''
        }

        <div class="post-footer">
            <small>By ${post.author?.name || 'Anonymous'}</small>
        </div>
    </article>
    `;
}
