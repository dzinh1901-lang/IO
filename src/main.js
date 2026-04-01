import './style.css';

const app = document.querySelector('#app');
const loading = document.createElement('div');
loading.id = 'loading';
loading.textContent = 'Preparing Vite galaxy platform...';
document.body.appendChild(loading);

const message = document.createElement('div');
message.style.color = '#d9e8ff';
message.style.display = 'flex';
message.style.alignItems = 'center';
message.style.justifyContent = 'center';
message.style.width = '100%';
message.style.height = '100%';
message.textContent = 'Vite upgrade complete. Scene modules are next.';
app.appendChild(message);

requestAnimationFrame(() => {
  loading.classList.add('hidden');
  setTimeout(() => loading.remove(), 700);
});