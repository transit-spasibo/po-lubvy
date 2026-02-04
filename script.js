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
        { id: 'bg5', url: 'bg5.png' }
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
        
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = '💙';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
        
        container.appendChild(heart);

        // Удаляем элемент после завершения анимации (через 10сек), чтобы не перегружать DOM
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }

    // Создаем сердечки через интервал, а не все сразу
    function startHeartStorm() {
        setInterval(spawnHeart, 800);
    }

    // Скачивание
    async function download() {
        const to = recipientInput.value.trim() || "Коллега";
        const msg = gratitudeInput.value.trim();

        if (!msg) {
            alert("Напишите хотя бы пару слов благодарности!");
            return;
        }

        const renderArea = document.getElementById('render-area');
        const renderCard = document.getElementById('renderCard');
        document.getElementById('r-to').innerText = to;
        document.getElementById('r-msg').innerText = `«${msg}»`;
        renderCard.style.backgroundImage = `url(${currentBg})`;

        downloadBtn.textContent = "⏳ Сохраняем...";
        downloadBtn.disabled = true;

        try {
            const canvas = await html2canvas(renderArea, {
                width: 900,
                height: 900,
                scale: 1, // Оставляем масштаб 1 для скорости, html2canvas и так возьмет размеры контейнера
                useCORS: true
            });

            const link = document.createElement('a');
            link.download = `TRANSITinka_${to}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (e) {
            console.error(e);
        } finally {
            downloadBtn.textContent = "📥 Скачать ТРАНЗИТинку";
            downloadBtn.disabled = false;
        }
    }

    recipientInput.addEventListener('input', updatePreview);
    gratitudeInput.addEventListener('input', updatePreview);
    downloadBtn.addEventListener('click', download);
    resetBtn.addEventListener('click', () => {
        document.getElementById('card-form').reset();
        updatePreview();
    });

    initBackgrounds();
    startHeartStorm();
});
