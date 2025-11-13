import { getPostById } from '../api/postsService';
import { getAccessTokenFromLocalStorage } from '../storage';

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

const titleElement = document.querySelector<HTMLElement>('#post-title');
const postContainer = document.querySelector<HTMLElement>('#single-post');

if (!titleElement || !postContainer) {
    console.error('Missing #post-title or #single-post in HTML');
}

if (!postId) {
    if (postContainer) {
        postContainer.innerHTML = '<p>No post selected.</p>';
    }
    throw new Error('Missing post id in URL');
}

console.log('Post ID from URL:', postId);

async function renderSinglePost() {
    if (!postContainer || !titleElement) return;

    const token = getAccessTokenFromLocalStorage();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    postContainer.innerHTML = '<p>Loading post...</p>';

    try {
        const post = await getPostById(postId!, token);

        titleElement.textContent = post.title || 'Untitled post';

        const createdText = post.created
            ? new Date(post.created).toLocaleString('no-NO')
            : '';

        postContainer.innerHTML = `
            ${
                post.media?.url
                    ? `<img src="${post.media.url}" alt="${post.media.alt ?? 'Post image'}" width="400">`
                    : ''
            }
            ${post.body ? `<p>${post.body}</p>` : '<p>No content.</p>'}
            <p><strong>By:</strong> ${post.author?.name || 'Anonymous'}</p>
            ${
                createdText
                    ? `<p><strong>Posted:</strong> ${createdText}</p>`
                    : ''
            }
        `;
    } catch (error) {
        console.error(error);
        postContainer.innerHTML = '<p>Could not load post.</p>';
    }
}

renderSinglePost();
