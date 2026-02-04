// Массив фонов (PNG)
const backgrounds = [
    'url("bg1.png")',
    'url("bg2.png")',
    'url("bg3.png")',
    'url("bg4.png")',
    'url("bg5.png")'',
    'url("bg6.png")
];

let currentBgIndex = 0;

const toInput = document.getElementById('toInput');
const msgInput = document.getElementById('msgInput');
const dlBtn = document.getElementById('dlBtn');
const changeBgBtn = document.getElementById('changeBgBtn');

// Обновление текста на странице (Превью)
function updateUI() {
    const to = toInput.value.trim();
    const msg = msgInput.value.trim();

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

// Скачивание изображения
async function downloadImage() {
    const to = toInput.value.trim();
    const msg = msgInput.value.trim();
    const renderCard = document.getElementById('renderCard');
    
    // Подготовка данных для скрытого рендера
    document.getElementById('r-to').innerText = to;
    document.getElementById('r-msg').innerText = "«" + msg + "»";
    renderCard.style.background = backgrounds[currentBgIndex];

    dlBtn.innerText = "⏳ Генерирую...";
    dlBtn.disabled = true;

    try {
        // Рендерим скрытую область 900x900
        const canvas = await html2canvas(document.getElementById('render-area'), {
            width: 900, 
            height: 900, 
            scale: 2, // Высокое качество (DPI)
            useCORS: true, 
            allowTaint: true,
            backgroundColor: null
        });

        const link = document.createElement('a');
        // Название файла начинается с TRANSITinka
        link.download = `TRANSITinka_${to}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (err) {
        console.error("Ошибка при создании изображения:", err);
    } finally {
        dlBtn.innerText = "📥 Скачать ТРАНЗИТинку";
        dlBtn.disabled = false;
    }
}

// Создание декоративных сердечек на фоне сайта
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

// Слушатели событий
toInput.addEventListener('input', updateUI);
msgInput.addEventListener('input', updateUI);
changeBgBtn.addEventListener('click', cycleBackground);
dlBtn.addEventListener('click', downloadImage);

window.onload = () => {
    createHearts();
    // Сразу устанавливаем первый фон из массива
    document.getElementById('mainPreview').style.background = backgrounds[0];
};

