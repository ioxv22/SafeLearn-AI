// State
let currentUser = null;
let liveCheatCount = 0;
let currentHints = [];
let currentHintIndex = 0;
let hintTimerInterval = null;
let isVoiceTutorActive = false;
let isChallengeMode = false;
let totalQuestions = 0;
let hintsUsedTotal = 0;
let behaviorScoreValue = 92;

const selfAwarePhrases = [
    "أنا هنا لأبني مهارتك في التفكير، وليس لأعطيك الحل الجاهز.",
    "تذكر أن الخطأ هو جزء من التعلم، حاول وسأقوم بتوجيهك.",
    "هدفي هو أن تصبح مفكراً مستقلاً، لذا سأعطيك طرف الخيط فقط.",
    "الذكاء ليس في الوصول للحل، بل في فهم كيفية الوصول إليه."
];

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

// Theme System
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    const icon = document.getElementById('themeToggle').querySelector('i');
    icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    showToast(`تم تفعيل الوضع ${newTheme === 'dark' ? 'الليلي' : 'النهاري'}`, 'info');
}

// Set default theme
document.documentElement.setAttribute('data-theme', 'dark');

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

    totalQuestions++;
    
    // Smart Anti-Cheat (Intelligent Redirection)
    const cheatRegex = /(حل|اعطني|اجابة|الجواب|solve|answer|just give it)/i;
    if (cheatRegex.test(text)) {
        liveCheatCount++;
        updateIndependenceScore(-5);
        showToast('تنبيه: محاولة غش مكتشفة! تذكر أن الفهم هو هدفنا.', 'danger');
        
        appendMessage(text, true);
        userInput.value = '';
        
        showThinking();
        setTimeout(() => {
            removeThinking();
            const selfAware = selfAwarePhrases[Math.floor(Math.random() * selfAwarePhrases.length)];
            appendMessage(`${selfAware} أفهم أنك تريد الوصول للحل بسرعة، ولكن لنجرب التفكير في أول خطوة معاً. هل يمكنك إخباري ما هو المعطى الأول في المسألة؟`, false);
        }, 1500);
        return;
    }

    appendMessage(text, true);
    userInput.value = '';

    showThinking();

    try {
        const response = await fetch(`/api/chat?text=${encodeURIComponent(text)}${isChallengeMode ? '&mode=challenge' : ''}`);
        const data = await response.json();
        removeThinking();
        
        const reply = data.reply || "أنا هنا للمساعدة، دعنا نفكر في الخطوة التالية سوياً.";
        
        // Split reply into hints if it contains steps
        if (reply.includes('الخطوة')) {
            currentHints = reply.split(/\n|الخطوة \d+:/).filter(h => h.trim().length > 5);
            currentHintIndex = 0;
            displayHint(currentHints[0]);
            showHintControls();
            startHintTimer();
        } else {
            appendMessage(reply, false);
            hideHintControls();
        }
    } catch (error) {
        removeThinking();
        appendMessage('عذراً، فشل الاتصال بخوادم SafeLearn. يرجى المحاولة لاحقاً.', false);
    }
}

function showThinking() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message thinking-msg';
    typingDiv.id = 'thinkingDiv';
    typingDiv.innerHTML = `
        <img src="https://ui-avatars.com/api/?name=AI&background=10b981&color=fff" class="msg-avatar">
        <div class="msg-content glass-msg">
            <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
        </div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinking() {
    const div = document.getElementById('thinkingDiv');
    if (div) div.remove();
}

function showHintControls() {
    document.getElementById('hintRevealControl').classList.remove('hidden');
}

function hideHintControls() {
    document.getElementById('hintRevealControl').classList.add('hidden');
}

function startHintTimer() {
    let seconds = 10;
    const timerEl = document.getElementById('hintTimer');
    const btn = document.getElementById('nextHintBtn');
    
    btn.disabled = true;
    timerEl.innerText = `00:${seconds < 10 ? '0' : ''}${seconds}`;
    
    if (hintTimerInterval) clearInterval(hintTimerInterval);
    
    hintTimerInterval = setInterval(() => {
        seconds--;
        timerEl.innerText = `00:${seconds < 10 ? '0' : ''}${seconds}`;
        if (seconds <= 0) {
            clearInterval(hintTimerInterval);
            btn.disabled = false;
            showToast('يمكنك الآن الانتقال للتلميح التالي', 'info');
        }
    }, 1000);
}

function validateAndRevealHint() {
    const attempt = document.getElementById('attemptInput').value.trim();
    if (attempt.length < 10) {
        showToast('يرجى كتابة محاولة جادة (١٠ أحرف على الأقل) قبل رؤية التلميح التالي.', 'warning');
        return;
    }
    
    // Update behavior score based on effort
    const effortBonus = Math.min(5, Math.floor(attempt.length / 20));
    updateBehaviorScore(effortBonus);
    
    document.getElementById('attemptInput').value = '';
    revealNextHint();
}

function revealNextHint() {
    currentHintIndex++;
    hintsUsedTotal++;
    updateIndependenceScore(-2);
    updateBehaviorScore(-1); // Penalty for needing more help
    
    if (currentHintIndex < currentHints.length) {
        displayHint(currentHints[currentHintIndex]);
        if (currentHintIndex === currentHints.length - 1) {
            hideHintControls();
            showMicroReflection();
        } else {
            startHintTimer();
        }
    }
}

function showMicroReflection() {
    setTimeout(() => {
        appendMessage("🎉 رائع! لقد وصلت لنهاية التلميحات. أخبرني بكلمة واحدة، ما هو المفهوم الجديد الذي تعلمته الآن؟", false);
        updateBehaviorScore(5); // Reflection bonus
    }, 2000);
}

function updateBehaviorScore(change) {
    behaviorScoreValue = Math.max(0, Math.min(100, behaviorScoreValue + change));
    const scoreEl = document.getElementById('behaviorScore');
    if (scoreEl) {
        scoreEl.innerText = `${behaviorScoreValue}%`;
        document.querySelector('.behavior-score .progress-fill').style.width = `${behaviorScoreValue}%`;
    }
    updateThinkerLevel();
}

function updateThinkerLevel() {
    const levelEl = document.getElementById('thinkerLevel');
    let level = "Beginner Thinker";
    const score = parseInt(document.getElementById('independenceScore').innerText);
    
    if (score > 90) level = "Critical Thinker";
    else if (score > 75) level = "Independent Solver";
    else if (score > 50) level = "Guided Learner";
    
    if (levelEl) levelEl.innerText = level;
}

function displayHint(text) {
    appendMessage(text, false);
    if (isVoiceTutorActive) speakText(text);
}

function updateIndependenceScore(change) {
    let currentScore = parseInt(document.getElementById('independenceScore').innerText);
    currentScore = Math.max(0, Math.min(100, currentScore + change));
    document.getElementById('independenceScore').innerText = `${currentScore}%`;
    document.querySelector('.progress-fill').style.width = `${currentScore}%`;
}

function toggleVoiceTutor() {
    isVoiceTutorActive = !isVoiceTutorActive;
    const btn = document.getElementById('voiceTutorBtn');
    btn.classList.toggle('active');
    showToast(`تم ${isVoiceTutorActive ? 'تفعيل' : 'تعطيل'} المعلم الصوتي`, 'info');
}

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
}

function toggleChallengeMode() {
    isChallengeMode = !isChallengeMode;
    const btn = document.getElementById('challengeModeBtn');
    btn.classList.toggle('active');
    showToast(`تم ${isChallengeMode ? 'تفعيل' : 'تعطيل'} وضع التحدي 🔥`, 'warning');
}

// Auth UI Flow
function showRegister() {
    document.getElementById('loginStep1').classList.add('hidden');
    document.getElementById('registerStep').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('loginStep1').classList.remove('hidden');
    document.getElementById('registerStep').classList.add('hidden');
}

function finalizeRegister() {
    const name = document.getElementById('regName').value;
    if(!name) return showToast('يرجى إدخال اسمك أولاً', 'warning');
    
    showToast(`مرحباً ${name}! جاري تهيئة بيئة التعلم الآمنة...`, 'success');
    setTimeout(() => {
        currentUser = { role: 'student', name: name };
        loginPage.classList.add('hidden');
        appPage.classList.remove('hidden');
    }, 1500);
}

function simulateGoogleLogin() {
    const btn = document.querySelector('.btn-google');
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الاتصال بخدمة Google...';
    btn.disabled = true;
    
    // Create a fake "Google Popup" effect
    showToast('جاري التحقق من الهوية عبر Google API...', 'info');
    
    setTimeout(() => {
        showToast('تمت المصادقة بنجاح! مرحباً بك.', 'success');
        
        // Final transition
        setTimeout(() => {
            currentUser = { role: 'student', name: 'مستخدم Google' };
            
            // Update UI with Google profile info (mock)
            document.getElementById('displayUserName').innerText = 'طالب Google';
            document.getElementById('displayUserAvatar').src = 'https://ui-avatars.com/api/?name=G&background=ea4335&color=fff';
            
            loginPage.classList.add('hidden');
            appPage.classList.remove('hidden');
            
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }, 800);
    }, 1800);
}

// Teacher Class Creation
const createClassModal = document.getElementById('createClassModal');

function showCreateClassModal() {
    createClassModal.classList.remove('hidden');
    document.querySelector('.class-setup').classList.remove('hidden');
    document.getElementById('classResult').classList.add('hidden');
}

function closeCreateClassModal() {
    createClassModal.classList.add('hidden');
}

function generateClassCode() {
    const className = document.getElementById('newClassName').value;
    if(!className) return showToast('يرج(' + 'يرجى إدخال اسم المادة أولاً', 'warning');
    
    showToast('جاري تشفير وتفعيل الفصل الدراسي...', 'info');
    
    setTimeout(() => {
        const code = 'SAFE-' + Math.floor(1000 + Math.random() * 9000);
        document.getElementById('generatedCode').innerText = code;
        document.querySelector('.class-setup').classList.add('hidden');
        document.getElementById('classResult').classList.remove('hidden');
        showToast('تم تفعيل الفصل بنجاح!', 'success');
    }, 1500);
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
