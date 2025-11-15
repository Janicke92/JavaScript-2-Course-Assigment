import {
    createNewPost,
    getAllPosts,
    searchPosts,
    type Post,
} from '../api/postsService';
import { getAccessTokenFromLocalStorage } from '../storage';
import { PostCard } from '../components/PostCard';
import { initLogoutButton } from '../utils/logout';

const storedUserData = localStorage.getItem('petpalace_auth');
if (!storedUserData) {
    window.location.href = 'login.html';
}

const createPostForm =
    document.querySelector<HTMLFormElement>('#create-post-form');
const searchForm = document.querySelector<HTMLFormElement>('#search-form');
const searchInput = document.querySelector<HTMLInputElement>('#search-input');
const feed = document.querySelector<HTMLElement>('#feed');

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

async function handleSearch(event: SubmitEvent) {
    event.preventDefault();

    if (!searchInput || !feed) return;

    const query = searchInput.value.trim();
    const token = getAccessTokenFromLocalStorage();

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    if (!query) {
        await renderPostsFeed();
        return;
    }

    try {
        const posts = await searchPosts(query, token);

        if (!posts.length) {
            feed.innerHTML = `<p>No posts found for "${query}".</p>`;
            return;
        }

        feed.innerHTML = posts.map((p: any) => PostCard(p)).join('');
    } catch (error) {
        console.error(error);
        feed.innerHTML = `<p>Could not search posts.</p>`;
    }
}

if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
}

initLogoutButton();
