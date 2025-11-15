import { logoutUser } from '../storage';

export function initLogoutButton() {
    const logoutBtn = document.querySelector('#logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        logoutUser();
        window.location.href = 'login.html';
    });
}
