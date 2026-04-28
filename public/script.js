// Elite Behavioral & AI State
let currentUser = null;
let liveCheatCount = 0;
let currentHints = [];
let currentHintIndex = 0;
let hintTimerInterval = null;
let isVoiceTutorActive = false;
let isChallengeMode = false;
let totalQuestions = 0;
let hintsUsedTotal = 0;
let behaviorScoreValue = 94;
let independenceScoreValue = 88;
let solveHistory = [];

const selfAwarePhrases = [
    "هدفي أن تتعلم كيف تفكر، وليس فقط أن تحصل على النتيجة.",
    "تذكر: كل محاولة تقوم بها هي خطوة نحو بناء 'عضلة التفكير'.",
    "أنا هنا لأرشدك، الحل الحقيقي يكمن في عقلك أنت.",
    "الذكاء ليس في معرفة الإجابة، بل في فهم الرحلة إليها.",
    "أنا هنا لأبني مهارتك في التفكير، وليس لأعطيك الحل الجاهز.",
    "تذكر أن الخطأ هو جزء من التعلم، حاول وسأقوم بتوجيهك.",
    "هدفي هو أن تصبح مفكراً مستقلاً، لذا سأعطيك طرف الخيط فقط."
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
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('emailInput');
        const email = emailInput ? emailInput.value : '';
        const btn = loginForm.querySelector('.btn-glow');
        
        if (btn) btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري التحقق...';
        
        setTimeout(() => {
            if (email.includes('admin') || email.includes('teacher')) {
                currentUser = { role: 'teacher', name: 'رئيس لجنة التحكيم' };
                if (menuTeacherControl) menuTeacherControl.classList.remove('hidden');
                showView('teacherDashboardView');
                showToast('مرحباً بك حضرة المحكم. نظام الرقابة والتحكم نشط بالكامل.', 'success');
            } else {
                currentUser = { role: 'student', name: 'الطالب التجريبي' };
                if (menuTeacherControl) menuTeacherControl.classList.add('hidden');
                showView('studentChatView');
                showToast('تم الدخول بنجاح. تذكر: العلم يبنى بالفهم وليس بالنقل.', 'info');
            }
            
            if (loginPage) loginPage.classList.add('hidden');
            if (appPage) appPage.classList.remove('hidden');
            if (btn) btn.innerHTML = '<span>تسجيل الدخول للمنصة</span><i class="fa-solid fa-arrow-left"></i>';
        }, 1500);
    });
}

function simulateGoogleLogin() {
    const btn = document.querySelector('.btn-google');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الاتصال بخوادم Google...';
    
    setTimeout(() => {
        currentUser = { role: 'student', name: 'مستخدم Google' };
        if (menuTeacherControl) menuTeacherControl.classList.add('hidden');
        showView('studentChatView');
        if (loginPage) loginPage.classList.add('hidden');
        if (appPage) appPage.classList.remove('hidden');
        showToast('تم تسجيل الدخول بواسطة Google بنجاح.', 'success');
        btn.innerHTML = originalText;
    }, 1500);
}

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
    
    // Smart Anti-Cheat System
    const cheatRegex = /(حل|اعطني|اجابة|الجواب|solve|answer|just give it|كامل|مباشر)/i;
    if (cheatRegex.test(text)) {
        liveCheatCount++;
        updateBehaviorScore(-10);
        showToast('تنبيه: محاولة تخطي التفكير! تذكر أن هدفنا هو التعلم.', 'danger');
        
        appendMessage(text, true);
        userInput.value = '';
        
        showThinking();
        setTimeout(() => {
            removeThinking();
            const phrase = selfAwarePhrases[Math.floor(Math.random() * selfAwarePhrases.length)];
            appendMessage(`🤖 ${phrase} \n\nأفهم رغبتك في الوصول للحل بسرعة، ولكن لنجرب أول خطوة معاً. ما هو المعطى الأهم في هذا السؤال برأيك؟`, false);
        }, 1200);
        return;
    }

    appendMessage(text, true);
    userInput.value = '';
    autoResizeInput();

    showThinking();

    try {
        const response = await fetch(`/api/chat?text=${encodeURIComponent(text)}${isChallengeMode ? '&mode=challenge' : ''}`);
        const data = await response.json();
        removeThinking();
        
        const reply = data.reply || "أنا هنا للمساعدة، دعنا نحلل المسألة خطوة بخطوة.";
        
        // Socratic Logic: Split into hints if steps are present
        if (reply.includes('الخطوة') || reply.includes('أولاً')) {
            currentHints = reply.split(/\n|الخطوة \d+:|أولاً:|ثانياً:|ثالثاً:/).filter(h => h.trim().length > 5);
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

function autoResizeInput() {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
}

function appendMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} fade-in`;
    
    const avatar = isUser ? 
        'https://ui-avatars.com/api/?name=ST&background=6366f1&color=fff' : 
        'https://ui-avatars.com/api/?name=AI&background=10b981&color=fff';
        
    msgDiv.innerHTML = `
        <img src="${avatar}" class="msg-avatar">
        <div class="msg-content glass-msg">
            ${text.replace(/\n/g, '<br>')}
            <span class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    `;
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
}

function revealNextHint() {
    currentHintIndex++;
    hintsUsedTotal++;
    updateIndependenceScore(-2);
    updateBehaviorScore(-1);
    
    if (currentHintIndex < currentHints.length) {
        // Story Mode: Add step labels for a guided journey
        const stepLabel = `📍 الخطوة ${currentHintIndex + 1}: `;
        displayHint(stepLabel + currentHints[currentHintIndex]);
        
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
        appendMessage("🎉 مذهل! لقد أكملت التحدي بنجاح. ما هو أكثر جزء شعرت فيه بالفخر بنفسك أثناء التفكير؟", false);
        updateBehaviorScore(5);
        showSessionSummary();
    }, 2000);
}

function showSessionSummary() {
    const improvement = Math.floor(Math.random() * 10) + 5; 
    const summaryMsg = `
        <div class="session-summary glass-panel fade-in">
            <h4 style="margin-bottom:10px;">📈 ملخص النمو المعرفي</h4>
            <div class="summary-stats" style="display:flex; gap:15px; margin-bottom:15px;">
                <div class="s-stat" style="flex:1; background:rgba(0,0,0,0.2); padding:10px; border-radius:12px; text-align:center;">
                    <span style="font-size:0.8rem; display:block;">تطور الاستقلالية</span>
                    <strong style="color:var(--success); font-size:1.2rem;">+${improvement}% اليوم</strong>
                </div>
                <div class="s-stat" style="flex:1; background:rgba(0,0,0,0.2); padding:10px; border-radius:12px; text-align:center;">
                    <span style="font-size:0.8rem; display:block;">جودة التفكير</span>
                    <strong style="color:var(--primary); font-size:1.2rem;">ممتاز ✨</strong>
                </div>
            </div>
            <p style="font-size:0.9rem; border-top:1px solid var(--glass-border); padding-top:10px;">💡 <strong>رؤية المعلم:</strong> لقد بدأت تعتمد على التفكير المنطقي أكثر من طلب المساعدة المباشرة. هذا هو سر النجاح!</p>
        </div>
    `;
    setTimeout(() => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot-message';
        msgDiv.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=AI&background=10b981&color=fff" class="msg-avatar">
            <div class="msg-content no-bg" style="background:transparent !important; border:none !important; box-shadow:none !important; padding:0 !important;">${summaryMsg}</div>
        `;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    }, 3000);
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
