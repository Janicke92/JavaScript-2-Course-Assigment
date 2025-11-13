import { getAccessTokenFromLocalStorage } from '../storage';
import { getPostById, updateUserPost } from '../api/postsService';

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

if (!postId) {
    alert('No post selected.');
    window.location.href = 'feed.html';
}

const titleInput = document.querySelector<HTMLInputElement>('#title');
const bodyInput = document.querySelector<HTMLTextAreaElement>('#body');
const mediaInput = document.querySelector<HTMLInputElement>('#mediaUrl');

async function loadPostForEditing() {
    const token = getAccessTokenFromLocalStorage();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const post = await getPostById(postId!, token);

    if (titleInput) titleInput.value = post.title || '';
    if (bodyInput) bodyInput.value = post.body || '';
    if (mediaInput) mediaInput.value = post.media?.url || '';
}

loadPostForEditing();

const form = document.querySelector<HTMLFormElement>('#edit-post-form');

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = getAccessTokenFromLocalStorage();
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const updatedTitle = titleInput?.value || '';
        const updatedBody = bodyInput?.value || '';
        const updatedMedia = mediaInput?.value || '';

        try {
            await updateUserPost(
                postId!,
                updatedTitle,
                updatedBody,
                updatedMedia,
                token
            );

            window.location.href = `post.html?id=${postId}`;
        } catch (error) {
            console.error(error);
            alert('Could not update the post.');
        }
    });
}
