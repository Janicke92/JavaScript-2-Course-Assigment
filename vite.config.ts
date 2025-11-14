import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                login: 'login.html',
                register: 'register.html',
                feed: 'feed.html',
                profile: 'profile.html',
                post: 'post.html',
                edit: 'edit.html',
            },
        },
    },
});
