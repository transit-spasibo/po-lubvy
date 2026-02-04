document.getElementById('valentineForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Получаем данные
    const recipient = document.getElementById('recipient').value;
    const message = document.getElementById('message').value;
    const sender = document.getElementById('sender').value || 'Анонимно';

    // Создаем карточку
    createValentine(recipient, message, sender);

    // Очищаем форму
    this.reset();
});

function createValentine(to, msg, from) {
    const grid = document.getElementById('valentinesGrid');
    
    const card = document.createElement('div');
    card.className = 'v-card card';
    
    card.innerHTML = `
        <h3>Для: ${to}</h3>
        <p>"${msg}"</p>
        <span class="from">От: ${from}</span>
        <div style="position:absolute; top:10px; right:10px; opacity:0.3">💙</div>
    `;

    // Добавляем в начало списка
    grid.insertBefore(card, grid.firstChild);
}

// Пример данных при загрузке
window.onload = () => {
    createValentine("Алексея", "Спасибо за помощь с годовым отчетом! Ты спас проект.", "Мария");
    createValentine("Команды дизайна", "Ваши идеи всегда вдохновляют нас на крутые решения.", "Отдел маркетинга");
};
