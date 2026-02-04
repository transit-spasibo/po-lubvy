// Настройка фонов: 1 градиент + 5 ваших файлов
const backgrounds = [
    'linear-gradient(135deg, #1e293b, #0f172a)', 
    'url("bg1.png")',
    'url("bg2.png")',
    'url("bg3.png")',
    'url("bg4.png")',
    'url("bg5.png")',
    'url("bg5.png")
];

let currentBgIndex = 0;

const toInput = document.getElementById('toInput');
const msgInput = document.getElementById('msgInput');
const dlBtn = document.getElementById('dlBtn');
const changeBgBtn = document.getElementById('changeBgBtn');
const bgNumSpan = document.getElementById('bgNum');

function updateUI() {
    const to = toInput.value.trim();
    const msg = msgInput.value.trim();

    document.getElementById('p-to').innerText = to ? "Для: " + to : "Для: Коллеги";
    document.getElementById('p-msg').innerText = msg ? "«" + msg + "»" : "«Текст вашего поздравления»";

    if (to.length > 0 && msg.length > 0) {
        dlBtn.classList.add('visible');
    } else {
        dlBtn.classList.remove('visible');
    }
}

function cycleBackground() {
    currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
    const currentBg = backgrounds[currentBgIndex];
    const preview = document.getElementById('mainPreview');

    preview.style.background = currentBg.includes('url') 
        ? `${currentBg} center/cover no-repeat` 
        : currentBg;

    bgNumSpan.innerText = currentBgIndex + 1;
}

async function downloadImage() {
    const to = toInput.value.trim();
    const msg = msgInput.value.trim();
    const renderCard = document.getElementById('renderCard');
    const bg = backgrounds[currentBgIndex];

    document.getElementById('r-to').innerText = "Для: " + to;
    document.getElementById('r-msg').innerText = "«" + msg + "»";
    renderCard.style.background = bg.includes('url') 
        ? `${bg} center/cover no-repeat` 
        : bg;

    dlBtn.innerText = "⏳ Секунду...";
    dlBtn.disabled = true;

    try {
        const canvas = await html2canvas(document.getElementById('render-area'), {
            width: 800, height: 800, scale: 2, useCORS: true
        });

        const link = document.createElement('a');
        link.download = `Valentine_for_${to}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (err) {
        console.error("Ошибка сохранения:", err);
    } finally {
        dlBtn.innerText = "📥 Скачать валентинку";
        dlBtn.disabled = false;
    }
}

function createHearts() {
    const container = document.getElementById('bgHearts');
    if (!container) return;
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = '💙';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.fontSize = (Math.random() * 10 + 10) + 'px';
        container.appendChild(heart);
    }
}

toInput.addEventListener('input', updateUI);
msgInput.addEventListener('input', updateUI);
changeBgBtn.addEventListener('click', cycleBackground);
dlBtn.addEventListener('click', downloadImage);

window.onload = () => {
    createHearts();
    document.getElementById('mainPreview').style.background = backgrounds[0];
};
