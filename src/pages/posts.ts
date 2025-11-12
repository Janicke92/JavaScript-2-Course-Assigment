import { createNewPost } from '../api/postsService';
import { getAccessTokenFromLocalStorage } from '../storage';

const storedUserData = localStorage.getItem('petpalace_auth');
if (!storedUserData) {
    window.location.href = 'login.html';
}

const createPostForm =
    document.querySelector<HTMLFormElement>('#create-post-form');

createPostForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document
        .querySelector<HTMLInputElement>('#title')
        ?.value.trim();
    const body = document
        .querySelector<HTMLTextAreaElement>('#body')
        ?.value.trim();
    const mediaUrl = document
        .querySelector<HTMLInputElement>('#mediaUrl')
        ?.value.trim();

    if (!title || !mediaUrl || !body) {
        // Remember! Show vilidation message
        return;
    }

    const token = getAccessTokenFromLocalStorage();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const newPost = await createNewPost(title, body, mediaUrl, token);
        // Remember! render post feed;
    } catch (err) {
        console.error('Error creating post:', err);
    }
});
