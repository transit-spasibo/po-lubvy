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

    // Список фонов
    const backgroundImages = [
        { id: 'bg1', url: 'bg1.png' },
        { id: 'bg2', url: 'bg2.png' },
        { id: 'bg3', url: 'bg3.png' },
        { id: 'bg4', url: 'bg4.png' },
        { id: 'bg6', url: 'bg6.png' }
    ];

    let currentBg = backgroundImages[0].url;

    // Инициализация фонов
    function initBackgrounds() {
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

    // Живое обновление текста (без кавычек)
    function updatePreview() {
        const name = recipientInput.value.trim();
        const msg = gratitudeInput.value.trim();
        outputName.textContent = name || "Имя";
        outputText.textContent = msg ? msg : "Текст вашей признательности";
        charCount.textContent = `${gratitudeInput.value.length}/250`;
    }

   // Анимация сердечек (улучшено распределение)
    function spawnHeart(initial = false) {
        const container = document.getElementById('bgHearts');
        if (!container || container.children.length > 30) return; 

        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = '💙';
        
        // Случайное положение по горизонтали
        heart.style.left = Math.random() * 95 + 'vw';
        
        // Если это начальная генерация, распределяем по всей высоте экрана
        // Если обычная — пускаем снизу (стандартное поведение анимации)
        if (initial) {
            const startY = Math.random() * 100;
            heart.style.top = startY + 'vh';
            // Уменьшаем задержку для тех, что уже на экране
            heart.style.animationDelay = `-${Math.random() * 10}s`;
        }

        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        heart.style.animationDuration = (6 + Math.random() * 6) + 's';
        
        container.appendChild(heart);
        setTimeout(() => { if(heart.parentElement) heart.remove(); }, 12000);
    }

    // Генерация изображения 900x900
    async function download() {
        const name = recipientInput.value.trim() || "Коллега";
        const msg = gratitudeInput.value.trim();
        if (!msg) return alert("Пожалуйста, напишите текст благодарности!");

        const renderArea = document.getElementById('render-area');
        const renderCard = document.getElementById('renderCard');
        const rTo = document.getElementById('r-to');
        const rMsg = document.getElementById('r-msg');
        
        // Заполняем данные для рендера
        rTo.innerText = name;
        rMsg.innerText = msg;
        renderCard.style.backgroundImage = `url(${currentBg})`;

        downloadBtn.textContent = "⏳ Создание...";
        downloadBtn.disabled = true;

        try {
            // Ждем отрисовки шрифтов и фона
            await new Promise(r => setTimeout(r, 200));

            const canvas = await html2canvas(renderArea, {
                width: 900,
                height: 900,
                scale: 1, // Фиксируем масштаб 1:1 для размера 900x900
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                windowWidth: 900,
                windowHeight: 900
            });

            // Конвертация в файл
            const link = document.createElement('a');
            link.download = `TRANSITka_${name}.png`;
            // Используем максимальное качество PNG
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
        } catch (e) {
            console.error("Ошибка рендера:", e);
            alert("Не удалось сохранить изображение.");
        } finally {
            downloadBtn.textContent = "📥 Скачать ТРАНЗИТку";
            downloadBtn.disabled = false;
        }
    }

    recipientInput.addEventListener('input', updatePreview);
    gratitudeInput.addEventListener('input', updatePreview);
    downloadBtn.addEventListener('click', download);
    resetBtn.addEventListener('click', () => {
        if(confirm("Очистить форму?")) {
            document.getElementById('card-form').reset();
            updatePreview();
        }
    });

    initBackgrounds();
    setInterval(spawnHeart, 800);
});

