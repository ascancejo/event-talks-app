
document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const talks = JSON.parse(scheduleContainer.dataset.talks);

    function renderSchedule(data) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule

        data.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('talk-card');
            if (item.isBreak) {
                card.classList.add('lunch-break');
                card.innerHTML = `
                    <p class="time">${item.startTime} - ${item.endTime}</p>
                    <h3>${item.title}</h3>
                `;
            } else {
                // Use innerHTML directly for the content, it's safer when not user-generated
                card.innerHTML = `
                    <p class="time">${item.startTime} - ${item.endTime}</p>
                    <h3>${item.title}</h3>
                    <p class="speakers">Speakers: ${item.speakers.join(', ')}</p>
                    <p class="category">Category: ${item.category.map(c => `<span>${c}</span>`).join('')}</p>
                    <p>${item.description}</p>
                `;
                card.dataset.category = item.category.map(c => c.toLowerCase()).join(' ');
            }
            scheduleContainer.appendChild(card);
        });
    }

    function filterTalks() {
        const searchInput = document.getElementById('category-search').value.toLowerCase();
        const talkCards = document.querySelectorAll('.talk-card:not(.lunch-break)');

        talkCards.forEach(card => {
            const categories = card.dataset.category;
            if (searchInput === '' || (categories && categories.includes(searchInput))) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    renderSchedule(talks);
    document.getElementById('search-button').addEventListener('click', filterTalks);
    document.getElementById('category-search').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            filterTalks();
        }
    });
});
