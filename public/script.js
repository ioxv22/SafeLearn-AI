// State
let currentUser = null;
let liveCheatCount = 0;

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

// Views & Menu
const studentChatView = document.getElementById('studentChatView');
const teacherDashboardView = document.getElementById('teacherDashboardView');
const menuTeacherAI = document.getElementById('menuTeacherAI');
const menuTeacherControl = document.getElementById('menuTeacherControl');
const menuClassroom = document.getElementById('menuClassroom');
const menuReports = document.getElementById('menuReports');

// Login Flow
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    const btn = loginForm.querySelector('.btn-glow');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري التحقق...';
    
    setTimeout(() => {
        if (email.includes('admin') || email.includes('teacher')) {
            currentUser = { role: 'teacher', name: 'لجنة التحكيم' };
            menuTeacherControl.classList.remove('hidden');
            showView('teacherDashboardView');
        } else {
            currentUser = { role: 'student', name: 'الطالب التجريبي' };
            menuTeacherControl.classList.add('hidden');
            showView('studentChatView');
        }
        
        loginPage.classList.add('hidden');
        appPage.classList.remove('hidden');
        btn.innerHTML = '<span>تسجيل الدخول للمنصة</span><i class="fa-solid fa-arrow-left"></i>';
    }, 1200);
});

function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    
    // Update active menu
    document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
    if (viewId === 'studentChatView') menuTeacherAI.classList.add('active');
    if (viewId === 'teacherDashboardView') menuTeacherControl.classList.add('active');
}

menuTeacherAI.onclick = () => showView('studentChatView');
menuTeacherControl.onclick = () => showView('teacherDashboardView');
menuClassroom.onclick = () => alert('هذه الميزة ستكون متاحة في النسخة النهائية لإدارة الفصول.');
menuReports.onclick = () => alert('تقارير مفصلة عن أداء الطلاب والنزاهة الأكاديمية.');

logoutBtn.addEventListener('click', () => {
    appPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
});

// Modal Flow
generateVideoBtn.onclick = () => modal.classList.remove('hidden');
closeModal.onclick = () => modal.classList.add('hidden');

// Chat Flow
function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

function appendMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    const avatar = isUser ? 'St' : 'AI';
    const bg = isUser ? '6366f1' : '10b981';
    
    div.innerHTML = `
        <img src="https://ui-avatars.com/api/?name=${avatar}&background=${bg}&color=fff" class="msg-avatar">
        <div class="msg-content glass-msg">${text}</div>
    `;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Ethical Monitoring (Safe Mode)
    const cheatKeywords = ['حل', 'اعطني', 'اجابة', 'الجواب', 'solve', 'answer'];
    if (cheatKeywords.some(kw => text.includes(kw))) {
        liveCheatCount++;
        document.getElementById('liveCheatCount').innerText = liveCheatCount;
        document.getElementById('teacherCheatCounter').innerText = 342 + liveCheatCount;
        
        // Add to feed
        const feed = document.getElementById('activityFeed');
        const alertDiv = document.createElement('div');
        alertDiv.className = 'feed-item danger';
        alertDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i><div><p><strong>تنبيه:</strong> محاولة استخراج حل مباشر!</p><span>الآن</span></div>`;
        feed.prepend(alertDiv);
    }

    appendMessage(text, true);
    userInput.value = '';

    // Thinking placeholder
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.innerHTML = `<img src="https://ui-avatars.com/api/?name=AI&background=10b981&color=fff" class="msg-avatar"><div class="msg-content glass-msg"><i class="fa-solid fa-ellipsis fa-fade"></i></div>`;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(`/api/chat?text=${encodeURIComponent(text)}`);
        const data = await response.json();
        chatBox.removeChild(typingDiv);
        appendMessage(data.reply || "أنا هنا للمساعدة، دعنا نفكر في الخطوة التالية سوياً.", false);
    } catch (error) {
        chatBox.removeChild(typingDiv);
        appendMessage('عذراً، فشل الاتصال بخوادم SafeLearn. يرجى المحاولة لاحقاً.', false);
    }
}

// Video Search (YouTube)
document.getElementById('submitVideoBtn').onclick = async () => {
    const prompt = document.getElementById('videoPromptInput').value.trim();
    if(!prompt) return;

    const loader = document.getElementById('videoLoader');
    const iframe = document.getElementById('resultVideo');
    const btn = document.getElementById('submitVideoBtn');
    
    document.getElementById('videoContainer').classList.remove('hidden');
    loader.classList.remove('hidden');
    iframe.classList.add('hidden');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري البحث...';

    try {
        const response = await fetch(`/api/youtube?q=${encodeURIComponent(prompt)}`);
        const data = await response.json();
        
        loader.classList.add('hidden');
        if(data.success && data.videoId) {
            iframe.src = `https://www.youtube.com/embed/${data.videoId}?autoplay=1`;
            iframe.classList.remove('hidden');
        } else {
            // Fallback
            iframe.src = `https://www.youtube.com/embed/NybHckSEQBI?autoplay=1`;
            iframe.classList.remove('hidden');
        }
    } catch(err) {
        loader.innerHTML = "<p style='color:#ef4444'>خطأ في الاتصال بالخادم.</p>";
    }
    btn.innerHTML = 'بدء العرض';
}
