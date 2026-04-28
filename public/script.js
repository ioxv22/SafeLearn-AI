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
const classroomView = document.getElementById('classroomView');
const reportsView = document.getElementById('reportsView');

const menuTeacherAI = document.getElementById('menuTeacherAI');
const menuTeacherControl = document.getElementById('menuTeacherControl');
const menuClassroom = document.getElementById('menuClassroom');
const menuReports = document.getElementById('menuReports');

// Toast System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info-circle';
    if(type === 'success') icon = 'check-circle';
    if(type === 'warning') icon = 'exclamation-triangle';
    if(type === 'danger') icon = 'shield-alert';
    
    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-20px)';
        setTimeout(() => container.removeChild(toast), 300);
    }, 4000);
}

// Login Flow
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    const btn = loginForm.querySelector('.btn-glow');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري التحقق من البروتوكولات...';
    
    setTimeout(() => {
        if (email.includes('admin') || email.includes('teacher')) {
            currentUser = { role: 'teacher', name: 'رئيس لجنة التحكيم' };
            menuTeacherControl.classList.remove('hidden');
            showView('teacherDashboardView');
            showToast('مرحباً بك حضرة المحكم. نظام الرقابة والتحكم نشط بالكامل.', 'success');
        } else {
            currentUser = { role: 'student', name: 'الطالب التجريبي' };
            menuTeacherControl.classList.add('hidden');
            showView('studentChatView');
            showToast('تم الدخول بنجاح. تذكر: العلم يبنى بالفهم وليس بالنقل.', 'info');
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
    if (viewId === 'classroomView') menuClassroom.classList.add('active');
    if (viewId === 'reportsView') menuReports.classList.add('active');
}

menuTeacherAI.onclick = () => showView('studentChatView');
menuTeacherControl.onclick = () => showView('teacherDashboardView');
menuClassroom.onclick = () => showView('classroomView');
menuReports.onclick = () => showView('reportsView');

logoutBtn.addEventListener('click', () => {
    appPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
    showToast('تم تسجيل الخروج بأمان.', 'info');
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
        const liveCountEl = document.getElementById('liveCheatCount');
        if(liveCountEl) {
            liveCountEl.innerText = `${liveCheatCount} مخالفات`;
            liveCountEl.className = 'text-red';
        }
        document.getElementById('teacherCheatCounter').innerText = 342 + liveCheatCount;
        
        showToast('تنبيه: محاولة غش مكتشفة! تم إرسال تقرير فوري للجنة التحكيم.', 'danger');

        // Add to feed
        const feed = document.getElementById('activityFeed');
        const alertDiv = document.createElement('div');
        alertDiv.className = 'feed-item danger';
        alertDiv.innerHTML = `<i class="fa-solid fa-shield-alert"></i><div><p><strong>تنبيه أمني:</strong> محاولة استخراج حل مباشر من قبل الطالب.</p><span>الآن</span></div>`;
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
            showToast('تم العثور على أفضل شرح مرئي لموضوعك.', 'success');
        } else {
            iframe.src = `https://www.youtube.com/embed/NybHckSEQBI?autoplay=1`;
            iframe.classList.remove('hidden');
        }
    } catch(err) {
        showToast('خطأ في الاتصال بخدمة الفيديو.', 'danger');
    }
    btn.innerHTML = 'بدء العرض';
}
