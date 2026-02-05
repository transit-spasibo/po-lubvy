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

    // Названия файлов должны точно совпадать с теми, что на GitHub (включая регистр)
    const backgroundImages = [
        { id: 'bg1', url: 'bg1.png' },
        { id: 'bg2', url: 'bg2.png' },
        { id: 'bg3', url: 'bg3.png' },
        { id: 'bg4', url: 'bg4.png' },
        { id: 'bg5', url: 'bg5.png' },
        { id: 'bg6', url: 'bg6.png' }
    ];

    let currentBg = backgroundImages[0].url;

    // Инициализация сетки фонов
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

    // Живое обновление текста (БЕЗ КАВЫЧЕК)
    function updatePreview() {
        const name = recipientInput.value.trim();
        const msg = gratitudeInput.value.trim();
        outputName.textContent = name || "Имя";
        // Здесь удалены кавычки
        outputText.textContent = msg ? msg : "Текст вашей признательности";
        charCount.textContent = `${gratitudeInput.value.length}/250`;
    }

    // Оптимизированная анимация сердечек
    function spawnHeart() {
        const container = document.getElementById('bgHearts');
        if (!container || container.children.length > 25) return; 

        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = '💙';
        heart.style.left = Math.random() * 95 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        heart.style.animationDuration = (6 + Math.random() * 6) + 's';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            if(heart.parentElement) heart.remove();
        }, 12000);
    }

    // Генерация изображения (БЕЗ КАВЫЧЕК)
    async function download() {
        const name = recipientInput.value.trim() || "Коллега";
        const msg = gratitudeInput.value.trim();
        if (!msg) return alert("Пожалуйста, напишите текст благодарности!");

        const renderCard = document.getElementById('renderCard');
        const rTo = document.getElementById('r-to');
        const rMsg = document.getElementById('r-msg');
        
        rTo.innerText = name;
        // Здесь удалены кавычки
        rMsg.innerText = msg;
        renderCard.style.backgroundImage = `url(${currentBg})`;

        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = "⏳ Создание...";
        downloadBtn.disabled = true;

        try {
            await new Promise(r => setTimeout(r, 100));

            const canvas = await html2canvas(document.getElementById('render-area'), {
                width: 900,
                height: 900,
                scale: 2, 
                useCORS: true,
                allowTaint: true,
                backgroundColor: null
            });

            const link = document.createElement('a');
            link.download = `TRANSITka_${name}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (e) {
            console.error("Ошибка при создании картинки:", e);
            alert("Не удалось сохранить изображение. Попробуйте другой браузер.");
        } finally {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        }
    }

    // Слушатели
    recipientInput.addEventListener('input', updatePreview);
    gratitudeInput.addEventListener('input', updatePreview);
    downloadBtn.addEventListener('click', download);
    resetBtn.addEventListener('click', () => {
        if(confirm("Очистить форму?")) {
            document.getElementById('card-form').reset();
            updatePreview();
        }
    });

    // Запуск
    initBackgrounds();
    setInterval(spawnHeart, 800);
});


