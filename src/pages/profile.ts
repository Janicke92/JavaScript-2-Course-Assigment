import {
    getAccessTokenFromLocalStorage,
    getUserFromLocalStorage,
} from '../storage';
import { getPostsByProfile } from '../api/postsService';
import { PostCard } from '../components/PostCard';

const token = getAccessTokenFromLocalStorage();
if (!token) {
    window.location.href = '/login.html';
}

const user = getUserFromLocalStorage();

const titleElement = document.querySelector<HTMLElement>('#profile-title');
const usernameElement =
    document.querySelector<HTMLElement>('#profile-username');
const emailElement = document.querySelector<HTMLElement>('#profile-email');
const postsContainer = document.querySelector<HTMLElement>('#profile-posts');

let username: string | null = null;

if (user) {
    username = user.name ?? user.email.split('@')[0];

    if (titleElement) titleElement.textContent = 'My Profile';
    if (usernameElement) usernameElement.textContent = username;
    if (emailElement) emailElement.textContent = user.email;
} else {
    if (titleElement) titleElement.textContent = 'Unknown profile';
}

if (postsContainer && username) {
    loadProfilePosts(username);
}

async function loadProfilePosts(profileName: string) {
    if (!postsContainer) return;

    postsContainer.textContent = `Loading posts for ${profileName}...`;

    try {
        const posts = await getPostsByProfile(profileName);

        if (!posts.length) {
            postsContainer.textContent = 'This user has not posted yet.';
            return;
        }

        postsContainer.innerHTML = posts.map((p: any) => PostCard(p)).join('');
    } catch (error) {
        console.error(error);
        postsContainer.textContent = 'Could not get posts from this profile.';
    }
}
