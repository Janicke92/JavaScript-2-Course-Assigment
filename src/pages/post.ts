import { getPostById, deleteUserPost } from '../api/postsService';
import {
    getAccessTokenFromLocalStorage,
    getUserFromLocalStorage,
} from '../storage';

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
                <p>
                    <strong>By:</strong>
                    ${
                        post.author?.name
                            ? `<a href="profile.html?name=${post.author.name}">${post.author.name}</a>`
                            : 'Anonymous'
                    }
                </p>
            ${
                createdText
                    ? `<p><strong>Posted:</strong> ${createdText}</p>`
                    : ''
            }
        `;

        const actions = document.querySelector<HTMLElement>('#post-actions');
        const user = getUserFromLocalStorage();

        if (actions && user) {
            const loggedInName = user.name ?? user.email.split('@')[0];

            if (post.author?.name === loggedInName) {
                actions.style.display = 'block';
            } else {
                actions.style.display = 'none';
            }
        }
    } catch (error) {
        console.error(error);
        postContainer.innerHTML = '<p>Could not load post.</p>';
    }
}

const deleteBtn = document.querySelector<HTMLButtonElement>('#delete-post-btn');

if (deleteBtn && postId) {
    deleteBtn.addEventListener('click', async () => {
        const confirmed = confirm('Are you sure you want to delete this post?');
        if (!confirmed) return;

        const token = getAccessTokenFromLocalStorage();
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        try {
            await deleteUserPost(postId, token);
            window.location.href = 'profile.html';
        } catch (error) {
            console.error(error);
            alert('Could not delete the post.');
        }
    });
}

const editBtn = document.querySelector<HTMLButtonElement>('#edit-post-btn');

if (editBtn && postId) {
    editBtn.addEventListener('click', () => {
        window.location.href = `edit.html?id=${postId}`;
    });
}

renderSinglePost();
