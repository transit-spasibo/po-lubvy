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

    const backgroundImages = [
        { id: 'bg1', url: 'bg1.png' },
        { id: 'bg2', url: 'bg2.png' },
        { id: 'bg3', url: 'bg3.png' },
        { id: 'bg4', url: 'bg4.png' },
        { id: 'bg6', url: 'bg6.png' }
    ];

    let currentBg = backgroundImages[0].url;

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

    function updatePreview() {
        const name = recipientInput.value.trim();
        const msg = gratitudeInput.value.trim();
        outputName.textContent = name || "Коллега";
        outputText.textContent = msg || "Текст вашей признательности";
        charCount.textContent = `${gratitudeInput.value.length}/250`;
    }

    // Обновленная функция: сердца падают сверху вниз без переворота
    function spawnHeart(initial = false) {
        const container = document.getElementById('bgHearts');
        if (!container || container.children.length > 40) return; 

        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = '💙';
        heart.style.left = Math.random() * 95 + 'vw';
        
        const duration = (6 + Math.random() * 6);
        heart.style.top = '-5vh';
        heart.style.transform = 'scale(0.8)';
        
        if (initial) {
            heart.style.top = Math.random() * 100 + 'vh';
        }

        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        
        // Ключевые кадры: только движение вниз без вращения (rotate)
        const animName = `fallDown_${Math.random().toString(36).substr(2, 9)}`;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes ${animName} {
                0% { transform: translateY(0) scale(0.5); opacity: 0; }
                10% { opacity: 0.8; }
                90% { opacity: 0.8; }
                100% { transform: translateY(110vh) scale(1.2); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
        
        heart.style.animation = `${animName} ${duration}s linear forwards`;
        
        container.appendChild(heart);
        
        setTimeout(() => { 
            if(heart.parentElement) heart.remove(); 
            styleSheet.remove();
        }, duration * 1000);
    }

    async function download() {
        const name = recipientInput.value.trim() || "Коллега";
        const msg = gratitudeInput.value.trim();
        if (!msg) return;

        const renderArea = document.getElementById('render-area');
        const rTo = document.getElementById('r-to');
        const rMsg = document.getElementById('r-msg');
        const renderCard = document.getElementById('renderCard');
        
        rTo.innerText = name;
        rMsg.innerText = msg;
        renderCard.style.backgroundImage = `url(${currentBg})`;

        downloadBtn.textContent = "⏳ Создание...";
        downloadBtn.disabled = true;

        try {
            await new Promise(r => setTimeout(r, 150));
            
            // Захват с принудительным масштабированием и очисткой стилей клона
            const canvas = await html2canvas(renderArea, {
                width: 900,
                height: 900,
                scale: 2, 
                useCORS: true,
                backgroundColor: null,
                removeContainer: true,
                logging: false,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('render-area');
                    if (el) {
                        el.style.left = '0';
                        el.style.top = '0';
                        el.style.border = 'none';
                        el.style.boxShadow = 'none';
                        // Убираем возможные фоны, которые могут давать серый оттенок
                        el.querySelectorAll('*').forEach(child => {
                            child.style.boxShadow = 'none';
                            child.style.border = 'none';
                        });
                    }
                }
            });

            const link = document.createElement('a');
            link.download = `TRANSITka_${name}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
        } catch (e) {
            console.error(e);
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
    for(let i = 0; i < 15; i++) spawnHeart(true);
    setInterval(() => spawnHeart(false), 600);
});
