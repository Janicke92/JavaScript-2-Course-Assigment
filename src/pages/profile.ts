import {
    getAccessTokenFromLocalStorage,
    getUserFromLocalStorage,
} from '../storage';
import { getPostsByProfile } from '../api/postsService';
import { PostCard } from '../components/PostCard';
import {
    followProfile,
    unfollowProfile,
    getProfileWithFollowing,
} from '../api/profileService';

const token = getAccessTokenFromLocalStorage();
if (!token) {
    window.location.href = '/login.html';
}

const user = getUserFromLocalStorage();

const params = new URLSearchParams(window.location.search);
const nameFromUrl = params.get('name');

const loggedInDisplayName = user
    ? (user.name ?? user.email.split('@')[0])
    : null;

const profileNameToShow: string = nameFromUrl || loggedInDisplayName || '';

if (!profileNameToShow) {
    alert('No profile selected.');
    window.location.href = '/login.html';
}

const titleElement = document.querySelector<HTMLElement>('#profile-title');
const usernameElement =
    document.querySelector<HTMLElement>('#profile-username');
const emailElement = document.querySelector<HTMLElement>('#profile-email');
const postsContainer = document.querySelector<HTMLElement>('#profile-posts');
const followBtn = document.querySelector<HTMLButtonElement>('#follow-btn');

if (titleElement) {
    if (loggedInDisplayName && profileNameToShow === loggedInDisplayName) {
        titleElement.textContent = 'My Profile';
    } else {
        titleElement.textContent = `${profileNameToShow}'s Profile`;
    }
}

if (usernameElement) {
    usernameElement.textContent = profileNameToShow;
}

if (emailElement) {
    if (
        user &&
        loggedInDisplayName &&
        profileNameToShow === loggedInDisplayName
    ) {
        emailElement.textContent = user.email;
    } else {
        emailElement.textContent = '';
    }
}

if (postsContainer) {
    loadProfilePosts(profileNameToShow);
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

if (
    followBtn &&
    user &&
    loggedInDisplayName &&
    profileNameToShow !== loggedInDisplayName
) {
    initFollowButton();
} else if (followBtn) {
    followBtn.style.display = 'none';
}

async function initFollowButton() {
    if (!followBtn || !user || !loggedInDisplayName) return;

    followBtn.style.display = 'inline-block';
    followBtn.disabled = true;
    followBtn.textContent = 'Loading...';

    let isFollowing = false;

    try {
        const me = await getProfileWithFollowing(loggedInDisplayName);

        isFollowing =
            me.following?.some(
                (profile: any) => profile.name === profileNameToShow
            ) ?? false;
    } catch (error) {
        console.error(error);
    }

    followBtn.textContent = isFollowing ? 'Unfollow user' : 'Follow user';
    followBtn.dataset.following = isFollowing ? 'true' : 'false';
    followBtn.disabled = false;

    followBtn.addEventListener('click', async () => {
        const currentlyFollowing = followBtn.dataset.following === 'true';

        try {
            followBtn.disabled = true;

            if (currentlyFollowing) {
                await unfollowProfile(profileNameToShow);
                followBtn.textContent = 'Follow user';
                followBtn.dataset.following = 'false';
            } else {
                await followProfile(profileNameToShow);
                followBtn.textContent = 'Unfollow user';
                followBtn.dataset.following = 'true';
            }
        } catch (error) {
            console.error(error);
            alert('Could not update follow status.');
        } finally {
            followBtn.disabled = false;
        }
    });
}
