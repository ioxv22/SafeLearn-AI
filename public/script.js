// Elements
const loginPage = document.getElementById('loginPage');
const appPage = document.getElementById('appPage');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

const modal = document.getElementById('videoModal');
const generateVideoBtn = document.getElementById('generateVideoBtn');
const closeModal = document.getElementById('closeModal');

// Login Flow
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('.btn-glow');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري تسجيل الدخول...';
    
    // Simulate network delay
    setTimeout(() => {
        loginPage.classList.add('hidden');
        appPage.classList.remove('hidden');
        btn.innerHTML = '<span>تسجيل الدخول</span><i class="fa-solid fa-arrow-left"></i>';
    }, 1500);
});

logoutBtn.addEventListener('click', () => {
    appPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
});

// Modal Flow
generateVideoBtn.onclick = () => modal.classList.remove('hidden');
closeModal.onclick = () => modal.classList.add('hidden');
window.onclick = (event) => {
    if (event.target == modal) {
        modal.classList.add('hidden');
    }
}

// Chat Flow
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

function appendMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatarStr = isUser 
        ? '<img src="https://ui-avatars.com/api/?name=St&background=6366f1&color=fff" class="msg-avatar">'
        : '<img src="https://ui-avatars.com/api/?name=AI&background=10b981&color=fff" class="msg-avatar">';
        
    div.innerHTML = `
        ${avatarStr}
        <div class="msg-content glass-msg">${text}</div>
    `;
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, true);
    userInput.value = '';

    // Thinking placeholder
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing';
    typingDiv.innerHTML = `
        <img src="https://ui-avatars.com/api/?name=AI&background=10b981&color=fff" class="msg-avatar">
        <div class="msg-content glass-msg"><i class="fa-solid fa-ellipsis fa-fade" style="font-size: 1.5rem;"></i></div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        chatBox.removeChild(typingDiv);
        
        if (data.success) {
            appendMessage(data.reply, false);
        } else {
            appendMessage('عذراً، حدث خطأ في معالجة طلبك.', false);
        }
    } catch (error) {
        chatBox.removeChild(typingDiv);
        appendMessage('عذراً، فشل الاتصال بخوادم SafeLearn.', false);
    }
}

// Video Generation
document.getElementById('submitVideoBtn').onclick = async () => {
    const prompt = document.getElementById('videoPromptInput').value.trim();
    if(!prompt) return;

    const loader = document.getElementById('videoLoader');
    const video = document.getElementById('resultVideo');
    const btn = document.getElementById('submitVideoBtn');
    
    document.getElementById('videoContainer').classList.remove('hidden');
    loader.classList.remove('hidden');
    video.classList.add('hidden');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التوليد...';
    btn.disabled = true;

    try {
        const response = await fetch('/api/video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        
        if(data.success) {
            loader.classList.add('hidden');
            video.src = data.video_url;
            video.classList.remove('hidden');
        } else {
            loader.innerHTML = "<p style='color:#ef4444'>فشل توليد الفيديو.</p>";
        }
    } catch(err) {
        loader.innerHTML = "<p style='color:#ef4444'>خطأ في الاتصال بالخادم.</p>";
    }
    btn.innerHTML = '<span>توليد الفيديو التعليمي</span>';
    btn.disabled = false;
}
