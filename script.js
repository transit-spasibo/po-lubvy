// Массив фонов (теперь PNG и сразу предлагается подгруженный фон)
const backgrounds = [
    'url("bg1.png")',
    'url("bg2.png")',
    'url("bg3.png")',
    'url("bg4.png")',
    'url("bg5.png")',
    'url("bg6.png")'
];

let currentBgIndex = 0;

const toInput = document.getElementById('toInput');
const msgInput = document.getElementById('msgInput');
const dlBtn = document.getElementById('dlBtn');
const changeBgBtn = document.getElementById('changeBgBtn');

// Обновление текста
function updateUI() {
    const to = toInput.value.trim();
    const msg = msgInput.value.trim();

    // Обновляем текст (убрано "Для:")
    document.getElementById('p-to').innerText = to ? to : "Имя";
    document.getElementById('p-msg').innerText = msg ? "«" + msg + "»" : "«Текст вашей признательности»";

    if (to.length > 0 && msg.length > 0) {
        dlBtn.classList.add('visible');
    } else {
        dlBtn.classList.remove('visible');
    }
}

// Смена фона
function cycleBackground() {
    currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
    const currentBg = backgrounds[currentBgIndex];
    const preview = document.getElementById('mainPreview');

    preview.style.background = currentBg;
    document.getElementById('bgNum').innerText = currentBgIndex + 1;
}

// Скачивание
async function downloadImage() {
    const to = toInput.value.trim();
    const msg = msgInput.value.trim();
    const renderCard = document.getElementById('renderCard');
    
    // Подготовка данных для рендера (без "Для:")
    document.getElementById('r-to').innerText = to;
    document.getElementById('r-msg').innerText = "«" + msg + "»";
    renderCard.style.background = backgrounds[currentBgIndex];

    dlBtn.innerText = "⏳ Генерирую...";
    dlBtn.disabled = true;

    try {
        const canvas = await html2canvas(document.getElementById('render-area'), {
            width: 800, 
            height: 800, 
            scale: 2, 
            useCORS: true, 
            allowTaint: true,
            backgroundColor: null
        });

        const link = document.createElement('a');
        link.download = `Valentine_${to}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (err) {
        console.error("Ошибка при создании изображения:", err);
    } finally {
        dlBtn.innerText = "📥 Скачать ТРАНЗИТинку";
        dlBtn.disabled = false;
    }
}

// Создание сердечек
function createHearts() {
    const container = document.getElementById('bgHearts');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = '💙';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.animationDelay = Math.random() * 10 + 's';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        container.appendChild(heart);
    }
}

toInput.addEventListener('input', updateUI);
msgInput.addEventListener('input', updateUI);
changeBgBtn.addEventListener('click', cycleBackground);
dlBtn.addEventListener('click', downloadImage);

window.onload = () => {
    createHearts();
    // Сразу устанавливаем первый подгруженный фон
    document.getElementById('mainPreview').style.background = backgrounds[0];
};
