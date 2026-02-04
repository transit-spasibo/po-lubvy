document.addEventListener('DOMContentLoaded', () => {
    const recipientInput = document.getElementById('recipient-name');
    const gratitudeInput = document.getElementById('gratitude-text');
    const outputName = document.getElementById('output-name');
    const outputText = document.getElementById('output-text');
    const charCount = document.getElementById('char-count');
    const bgSelection = document.getElementById('background-selection');
    const cardOutput = document.getElementById('card-output');
    const downloadBtn = document.getElementById('download-button');
    const resetBtn = document.getElementById('reset-form');

    // Названия файлов фонов
    const backgroundImages = [
        { id: 'bg1', url: 'bg1.png' },
        { id: 'bg2', url: 'bg2.png' },
        { id: 'bg3', url: 'bg3.png' },
        { id: 'bg4', url: 'bg4.png' },
        { id: 'bg5', url: 'bg5.png' },
        { id: 'bg6', url: 'bg6.png' }
    ];

    let currentBg = backgroundImages[0].url;

    // Инициализация фонов
    function initBackgrounds() {
        if (!bgSelection) return;
        bgSelection.innerHTML = ''; // Очистка перед инициализацией
        
        backgroundImages.forEach((bg, index) => {
            const opt = document.createElement('div');
            opt.className = 'bg-option';
            opt.style.backgroundImage = `url(${bg.url})`;
            if (index === 0) opt.classList.add('selected');
            
            opt.addEventListener('click', () => {
                document.querySelectorAll('.bg-option').forEach(el => el.classList.remove('selected'));
                opt.classList.add('selected');
                currentBg = bg.url;
                cardOutput.style.backgroundImage = `url(${bg.url})`;
            });
            bgSelection.appendChild(opt);
        });
        cardOutput.style.backgroundImage = `url(${currentBg})`;
    }

    // Обновление превью
    function updatePreview() {
        const name = recipientInput.value.trim();
        const msg = gratitudeInput.value.trim();
        outputName.textContent = name || "Коллега";
        outputText.textContent = msg ? `«${msg}»` : "«Текст вашей признательности»";
        charCount.textContent = `${gratitudeInput.value.length}/250`;
    }

    // Оптимизированный генератор сердечек
    function spawnHeart() {
        const container = document.getElementById('bgHearts');
        if (!container) return;
        
        // Ограничение: не создаем новые сердца, если их уже слишком много (больше 40)
        if (container.children.length > 40) return;

        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = '💙';
        
        const randomLeft = Math.random() * 95; // Ограничение по ширине, чтобы не было скролла
        heart.style.left = randomLeft + 'vw';
        
        const size = (Math.random() * 15 + 10);
        heart.style.fontSize = size + 'px';
        
        // Индивидуальная скорость анимации
        const duration = (7 + Math.random() * 4);
        heart.style.animationDuration = `${duration}s, ${1.5 + Math.random()}s`;
        
        container.appendChild(heart);

        // Гарантированное удаление элемента после завершения анимации
        setTimeout(() => {
            if (heart && heart.parentNode === container) {
                container.removeChild(heart);
            }
        }, duration * 1000);
    }

    // Создаем сердечки с умеренным интервалом
    function startHeartStorm() {
        // Увеличили интервал до 600мс для стабильности
        setInterval(spawnHeart, 600);
    }

    // Скачивание
    async function download() {
        const to = recipientInput.value.trim() || "Коллега";
        const msg = gratitudeInput.value.trim();

        if (!msg) {
            // Используем стандартный UI вместо alert, если это критично, 
            // но для простоты оставим логику проверки
            return;
        }

        const renderArea = document.getElementById('render-area');
        const renderCard = document.getElementById('renderCard');
        const rTo = document.getElementById('r-to');
        const rMsg = document.getElementById('r-msg');

        if (!renderArea || !renderCard) return;

        rTo.innerText = to;
        rMsg.innerText = `«${msg}»`;
        renderCard.style.backgroundImage = `url(${currentBg})`;

        const originalBtnText = downloadBtn.textContent;
        downloadBtn.textContent = "⏳ Сохраняем...";
        downloadBtn.disabled = true;

        try {
            // Оптимизация html2canvas: отключение лишних функций
            const canvas = await html2canvas(renderArea, {
                width: 900,
                height: 900,
                scale: 1,
                useCORS: true,
                logging: false,
                backgroundColor: null,
                removeContainer: true
            });

            const link = document.createElement('a');
            link.download = `TRANSITinka_${to.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (e) {
            console.error("Download error:", e);
        } finally {
            downloadBtn.textContent = originalBtnText;
            downloadBtn.disabled = false;
        }
    }

    // Слушатели событий
    if (recipientInput) recipientInput.addEventListener('input', updatePreview);
    if (gratitudeInput) gratitudeInput.addEventListener('input', updatePreview);
    if (downloadBtn) downloadBtn.addEventListener('click', download);
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const form = document.getElementById('card-form');
            if (form) form.reset();
            updatePreview();
        });
    }

    // Инициализация
    initBackgrounds();
    startHeartStorm();
});
