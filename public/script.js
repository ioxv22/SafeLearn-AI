// ═══════════════════════════════════════════
// SafeLearn AI – Elite Behavioral Engine v3.0
// ═══════════════════════════════════════════

// ── State ──
let currentUser = null;
let liveCheatCount = 0;
let currentHints = [];
let currentHintIndex = 0;
let hintTimerInterval = null;
let isChallengeMode = false;
let voiceEnabled = false;
let totalQuestions = 0;
let hintsUsedTotal = 0;
let behaviorScoreValue = 94;
let independenceScoreValue = 88;

// ── AI Personality ──
const teacherPhrases = [
    "هدفي أن أكون مرشدك في رحلة التفكير، وليس مجرد آلة تعطي إجابات.",
    "تذكر: كل محاولة تقوم بها اليوم هي استثمار في عقلك للمستقبل.",
    "أنا هنا لأدعمك خطوة بخطوة، الحل الحقيقي هو الذي تكتشفه بنفسك.",
    "الذكاء ليس في معرفة الإجابة، بل في فهم كيفية الوصول إليها بصبر.",
    "أحب طريقتك في المحاولة، دعنا نتعمق أكثر في هذا المفهوم معاً.",
    "لا تقلق من الخطأ، فهو أول درجة في سلم التعلم الحقيقي."
];

// ── DOM Elements ──
const loginPage = document.getElementById('loginPage');
const appPage = document.getElementById('appPage');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

const studentChatView = document.getElementById('studentChatView');
const teacherDashboardView = document.getElementById('teacherDashboardView');
const classroomView = document.getElementById('classroomView');
const reportsView = document.getElementById('reportsView');

const menuTeacherAI = document.getElementById('menuTeacherAI');
const menuTeacherControl = document.getElementById('menuTeacherControl');
const menuClassroom = document.getElementById('menuClassroom');
const menuReports = document.getElementById('menuReports');

// ── Theme System ──
document.documentElement.setAttribute('data-theme', 'dark');

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    const icon = document.getElementById('themeToggle')?.querySelector('i');
    if (icon) icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    showToast(`تم تفعيل الوضع ${next === 'dark' ? 'الليلي' : 'النهاري'}`, 'info');
}

// ── Voice Mode ──
function toggleVoiceMode() {
    voiceEnabled = !voiceEnabled;
    showToast(voiceEnabled ? 'تم تفعيل وضع المعلم الصوتي 🎙️' : 'تم إيقاف وضع المعلم الصوتي', 'info');
    const btn = document.getElementById('voiceTutorBtn');
    if (btn) btn.classList.toggle('active', voiceEnabled);
}

function speakText(text) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    const clean = text.replace(/<[^>]*>/g, '').replace(/[📍🎉💡🛡️🤖📈✨]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
}

// ── Toast Notifications ──
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'danger') icon = 'shield-exclamation';
    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ── Login Flow ──
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('emailInput')?.value || '';
        const btn = loginForm.querySelector('.btn-glow');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري التحقق...';

        setTimeout(() => {
            if (email.includes('admin') || email.includes('teacher')) {
                currentUser = { role: 'teacher', name: 'رئيس لجنة التحكيم' };
                if (menuTeacherControl) menuTeacherControl.classList.remove('hidden');
                showView('teacherDashboardView');
                showToast('مرحباً بك حضرة المحكم. نظام الرقابة نشط.', 'success');
            } else {
                currentUser = { role: 'student', name: 'الطالب التجريبي' };
                if (menuTeacherControl) menuTeacherControl.classList.add('hidden');
                showView('studentChatView');
                showToast('تم الدخول بنجاح. العلم يبنى بالفهم وليس بالنقل.', 'info');
            }
            if (loginPage) loginPage.classList.add('hidden');
            if (appPage) appPage.classList.remove('hidden');
            if (btn) btn.innerHTML = '<span>تسجيل الدخول للمنصة</span><i class="fa-solid fa-arrow-left"></i>';
        }, 1500);
    });
}

function simulateGoogleLogin() {
    const btn = document.querySelector('.btn-google');
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الاتصال بخوادم Google...';
    btn.disabled = true;
    showToast('جاري التحقق من الهوية عبر Google...', 'info');

    setTimeout(() => {
        currentUser = { role: 'student', name: 'مستخدم Google' };
        const nameEl = document.getElementById('displayUserName');
        const avatarEl = document.getElementById('displayUserAvatar');
        if (nameEl) nameEl.innerText = 'طالب Google';
        if (avatarEl) avatarEl.src = 'https://ui-avatars.com/api/?name=G&background=ea4335&color=fff';
        if (menuTeacherControl) menuTeacherControl.classList.add('hidden');
        showView('studentChatView');
        if (loginPage) loginPage.classList.add('hidden');
        if (appPage) appPage.classList.remove('hidden');
        showToast('تم تسجيل الدخول بواسطة Google بنجاح.', 'success');
        btn.innerHTML = original;
        btn.disabled = false;
    }, 1800);
}

function showRegister() {
    document.getElementById('loginStep1')?.classList.add('hidden');
    document.getElementById('registerStep')?.classList.remove('hidden');
}
function showLogin() {
    document.getElementById('loginStep1')?.classList.remove('hidden');
    document.getElementById('registerStep')?.classList.add('hidden');
}
function finalizeRegister() {
    const name = document.getElementById('regName')?.value;
    if (!name) return showToast('يرجى إدخال اسمك أولاً', 'warning');
    showToast(`مرحباً ${name}! جاري تهيئة بيئة التعلم...`, 'success');
    setTimeout(() => {
        currentUser = { role: 'student', name };
        if (loginPage) loginPage.classList.add('hidden');
        if (appPage) appPage.classList.remove('hidden');
    }, 1500);
}

// ── Navigation ──
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(viewId);
    if (target) target.classList.remove('hidden');
    document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
    if (viewId === 'studentChatView' && menuTeacherAI) menuTeacherAI.classList.add('active');
    if (viewId === 'teacherDashboardView') {
        const link = menuTeacherControl?.querySelector('a');
        if (link) link.classList.add('active');
    }
    if (viewId === 'classroomView' && menuClassroom) menuClassroom.classList.add('active');
    if (viewId === 'reportsView' && menuReports) menuReports.classList.add('active');
}

if (menuTeacherAI) menuTeacherAI.onclick = () => showView('studentChatView');
if (menuClassroom) menuClassroom.onclick = () => showView('classroomView');
if (menuReports) menuReports.onclick = () => showView('reportsView');
const teacherLink = menuTeacherControl?.querySelector('a');
if (teacherLink) teacherLink.onclick = () => showView('teacherDashboardView');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (appPage) appPage.classList.add('hidden');
        if (loginPage) loginPage.classList.remove('hidden');
        showToast('تم تسجيل الخروج بأمان.', 'info');
    });
}

// ── Video Modal ──
const closeModal = document.getElementById('closeModal');
if (closeModal) closeModal.onclick = () => document.getElementById('videoModal')?.classList.add('hidden');

// ── Chat System ──
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function autoResizeInput() {
    if (!userInput) return;
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
}

function appendMessage(text, isUser) {
    if (!chatBox) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    const avatar = isUser
        ? 'https://ui-avatars.com/api/?name=ST&background=6366f1&color=fff'
        : 'https://ui-avatars.com/api/?name=AI&background=10b981&color=fff';
    msgDiv.innerHTML = `
        <img src="${avatar}" class="msg-avatar">
        <div class="msg-content glass-msg">
            ${text.replace(/\n/g, '<br>')}
            <span class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    `;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    if (!isUser) speakText(text);
}

function showThinking() {
    if (!chatBox) return;
    const div = document.createElement('div');
    div.className = 'message bot-message';
    div.id = 'thinking-indicator';
    div.innerHTML = `
        <img src="https://ui-avatars.com/api/?name=AI&background=10b981&color=fff" class="msg-avatar">
        <div class="msg-content glass-msg thinking-dots">
            <span>المعلم الذكي يفكر</span>
            <div class="dots"><span>.</span><span>.</span><span>.</span></div>
        </div>
    `;
    chatBox.appendChild(div);
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
}

function removeThinking() {
    document.getElementById('thinking-indicator')?.remove();
}

// ── Smart Anti-Cheat ──
const cheatRegex = /(حل|اعطني|اجابة|الجواب|solve|answer|just give|كامل|مباشر)/i;

async function sendMessage() {
    if (!userInput) return;
    const text = userInput.value.trim();
    if (!text) return;
    totalQuestions++;

    // Anti-cheat detection
    if (cheatRegex.test(text)) {
        liveCheatCount++;
        updateBehaviorScore(-10);
        appendMessage(text, true);
        userInput.value = '';
        autoResizeInput();
        showThinking();
        setTimeout(() => {
            removeThinking();
            const phrase = teacherPhrases[Math.floor(Math.random() * teacherPhrases.length)];
            appendMessage(`🤖 ${phrase}\n\nأفهم رغبتك في الوصول للحل بسرعة، ولكن لنجرب أول خطوة معاً. ما هو المعطى الأهم في هذا السؤال برأيك؟`, false);
        }, 1500);
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
        const reply = data.reply || "دعنا نحلل هذا معاً خطوة بخطوة. ما هو أول شيء تلاحظه في المسألة؟";

        if (reply.includes('الخطوة') || reply.includes('أولاً') || reply.length > 200) {
            currentHints = reply.split(/\n|الخطوة \d+:|أولاً:|ثانياً:|ثالثاً:/).filter(h => h.trim().length > 5);
            if (currentHints.length > 1) {
                currentHintIndex = 0;
                appendMessage(`📍 الخطوة 1: ${currentHints[0]}`, false);
                showHintControls();
                startHintTimer();
            } else {
                appendMessage(reply, false);
            }
        } else {
            appendMessage(reply, false);
        }
    } catch (error) {
        removeThinking();
        // Fallback: simulate a smart AI response
        setTimeout(() => {
            appendMessage(`شكراً لمشاركتك! 🧠\n\nدعني أساعدك بطريقة تبني تفكيرك:\n\n📍 أولاً: حدد المعطيات الأساسية في المسألة.\n📍 ثانياً: فكر في القانون أو المبدأ المرتبط.\n📍 ثالثاً: حاول تطبيق ما تعرفه وسأرشدك.\n\nما هي الخطوة الأولى التي تراها مناسبة؟`, false);
        }, 1500);
    }
}

// ── Hint Control System ──
function showHintControls() {
    const ctrl = document.getElementById('hintRevealControl');
    if (ctrl) ctrl.classList.remove('hidden');
}

function hideHintControls() {
    const ctrl = document.getElementById('hintRevealControl');
    if (ctrl) ctrl.classList.add('hidden');
}

function startHintTimer() {
    const btn = document.getElementById('nextHintBtn');
    const timer = document.getElementById('hintTimer');
    if (!btn) return;
    btn.disabled = true;
    let seconds = 8;
    if (timer) timer.innerText = `00:0${seconds}`;

    clearInterval(hintTimerInterval);
    hintTimerInterval = setInterval(() => {
        seconds--;
        if (timer) timer.innerText = `00:0${seconds}`;
        if (seconds <= 0) {
            clearInterval(hintTimerInterval);
            btn.disabled = false;
            if (timer) timer.innerText = '✅';
        }
    }, 1000);
}

function validateAndRevealHint() {
    const attemptInput = document.getElementById('attemptInput');
    if (attemptInput && attemptInput.value.trim().length < 3) {
        showToast('اكتب محاولتك أولاً! أريد أن أرى تفكيرك قبل أن أعطيك الخطوة التالية.', 'warning');
        return;
    }

    currentHintIndex++;
    hintsUsedTotal++;
    updateBehaviorScore(-1);
    updateIndependenceScore(-2);

    if (attemptInput) {
        appendMessage(attemptInput.value, true);
        attemptInput.value = '';
    }

    if (currentHintIndex < currentHints.length) {
        appendMessage(`📍 الخطوة ${currentHintIndex + 1}: ${currentHints[currentHintIndex]}`, false);
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
        appendMessage("🎉 مذهل! لقد أكملت التحدي بنجاح.\n\nما هو أكثر جزء شعرت فيه بالفخر بنفسك أثناء التفكير؟", false);
        updateBehaviorScore(5);
        setTimeout(() => {
            const el = document.getElementById('finalIndependence');
            if (el) el.innerText = independenceScoreValue + "%";
            const modal = document.getElementById('growthModal');
            if (modal) modal.classList.remove('hidden');
            showToast('تم تحليل أدائك: نمو ممتاز في التفكير المستقل!', 'success');
        }, 3000);
    }, 2000);
}

// ── Score System ──
function updateBehaviorScore(change) {
    behaviorScoreValue = Math.max(0, Math.min(100, behaviorScoreValue + change));
    const el = document.getElementById('behaviorScore');
    const fill = document.querySelector('.behavior-score .progress-fill');
    if (el) el.innerText = `${behaviorScoreValue}%`;
    if (fill) fill.style.width = `${behaviorScoreValue}%`;
}

function updateIndependenceScore(change) {
    independenceScoreValue = Math.max(0, Math.min(100, independenceScoreValue + change));
    const el = document.getElementById('independenceScore');
    const fill = document.querySelector('.sidebar-stats .progress-fill');
    if (el) el.innerText = `${independenceScoreValue}%`;
    if (fill) fill.style.width = `${independenceScoreValue}%`;
}

// ── Class Management ──
function showCreateClassModal() {
    const m = document.getElementById('createClassModal');
    if (m) m.classList.remove('hidden');
    document.querySelector('.class-setup')?.classList.remove('hidden');
    document.getElementById('classResult')?.classList.add('hidden');
}
function closeCreateClassModal() {
    document.getElementById('createClassModal')?.classList.add('hidden');
}
function generateClassCode() {
    const name = document.getElementById('newClassName')?.value;
    if (!name) return showToast('يرجى إدخال اسم المادة أولاً', 'warning');
    showToast('جاري تشفير وتفعيل الفصل الدراسي...', 'info');
    setTimeout(() => {
        const code = 'SAFE-' + Math.floor(1000 + Math.random() * 9000);
        const el = document.getElementById('generatedCode');
        if (el) el.innerText = code;
        document.querySelector('.class-setup')?.classList.add('hidden');
        document.getElementById('classResult')?.classList.remove('hidden');
        showToast('تم تفعيل الفصل بنجاح!', 'success');
    }, 1500);
}

// ── Video Search (Reliable Demo) ──
const submitVideoBtn = document.getElementById('submitVideoBtn');
if (submitVideoBtn) {
    submitVideoBtn.onclick = async () => {
        const prompt = document.getElementById('videoPromptInput')?.value.trim();
        if (!prompt) return showToast('يرجى كتابة موضوع البحث أولاً', 'warning');
        const loader = document.getElementById('videoLoader');
        const iframe = document.getElementById('resultVideo');
        const container = document.getElementById('videoContainer');
        if (container) container.classList.remove('hidden');
        if (loader) loader.classList.remove('hidden');
        if (iframe) iframe.classList.add('hidden');
        submitVideoBtn.innerHTML = '<i class="fa-solid fa-brain fa-spin"></i> جاري تحليل الموضوع...';
        setTimeout(() => { submitVideoBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles fa-spin"></i> جاري التوليد...'; }, 1500);

        setTimeout(() => {
            if (loader) loader.classList.add('hidden');
            if (iframe) {
                iframe.src = 'https://www.youtube.com/embed/NybHckSEQBI?autoplay=1';
                iframe.classList.remove('hidden');
            }
            showToast('تم إعداد الشرح المرئي الذكي.', 'success');
            submitVideoBtn.innerHTML = 'بدء العرض';
        }, 3000);
    };
}
