import { createNewPost } from '../api/postsService';
import { getAccessTokenFromLocalStorage } from '../storage';
import { getAllPosts } from '../api/postsService';
import type { Post } from '../api/postsService';
import { PostCard } from '../components/PostCard';

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
        // Remember! Show validation message
        return;
    }

    const token = getAccessTokenFromLocalStorage();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        await createNewPost(title, body, mediaUrl, token);
        createPostForm?.reset();
        // Remember! render post feed;
    } catch (err) {
        console.error('Error creating post:', err);
    }
});

async function renderPostsFeed() {
    const feed = document.querySelector<HTMLElement>('#feed');
    if (!feed) return;

    const token = getAccessTokenFromLocalStorage();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    feed.innerHTML = '<p>Loading posts...</p>';

    try {
        const posts = await getAllPosts(token);

        feed.innerHTML = posts.map((p: Post) => PostCard(p)).join('');
    } catch (error) {
        console.error(error);
        feed.innerHTML = '<p>Unable to get feed.</p>';
    }
}

renderPostsFeed();
