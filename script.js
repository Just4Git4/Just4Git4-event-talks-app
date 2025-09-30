document.addEventListener('DOMContentLoaded', () => {
    const schedule = document.getElementById('schedule');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    let talks = [];

    fetch('talks.json')
        .then(response => response.json())
        .then(data => {
            talks = data;
            renderSchedule(talks);
        });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = talks.filter(talk => 
            talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talksToRender) {
        schedule.innerHTML = '';
        let startTime = 10 * 60; // 10:00 AM in minutes

        talksToRender.forEach((talk, index) => {
            const talkElement = document.createElement('div');
            talkElement.classList.add('talk');

            const time = `${Math.floor(startTime / 60)}:${(startTime % 60).toString().padStart(2, '0')}`;
            const endTime = startTime + talk.duration;
            const endTimeStr = `${Math.floor(endTime / 60)}:${(endTime % 60).toString().padStart(2, '0')}`;

            talkElement.innerHTML = `
                <div class="details">
                    <span>${time} - ${endTimeStr}</span>
                    <span class="category">${talk.category.join(', ')}</span>
                </div>
                <h2>${talk.title}</h2>
                <p><strong>Speakers:</strong> ${talk.speakers.join(', ')}</p>
                <p>${talk.description}</p>
            `;
            schedule.appendChild(talkElement);

            startTime = endTime + 10; // Add 10 minute break

            if (index === 2) { // Add lunch break after the 3rd talk
                const lunchBreak = document.createElement('div');
                lunchBreak.classList.add('talk');
                lunchBreak.innerHTML = `
                    <div class="details">
                        <span>${Math.floor(startTime / 60)}:${(startTime % 60).toString().padStart(2, '0')} - ${Math.floor((startTime + 60) / 60)}:${((startTime + 60) % 60).toString().padStart(2, '0')}</span>
                        <span class="category">Break</span>
                    </div>
                    <h2>Lunch Break</h2>
                `;
                schedule.appendChild(lunchBreak);
                startTime += 60;
            }
        });
    }
});