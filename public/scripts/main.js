document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const currentDate = new Date(); // Get current date

    renderWeek(calendarEl, currentDate);

    document.getElementById('prev-week').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 7); // Move back by one week
        renderWeek(calendarEl, currentDate);
    });

    document.getElementById('next-week').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 7); // Move forward by one week
        renderWeek(calendarEl, currentDate);
    });
});

function renderWeek(calendarEl, currentDate) {
    calendarEl.innerHTML = ''; // Clear previous content

    const weekStart = new Date(currentDate);
    // Adjust the start of the week to the previous Monday
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Get end of the week

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Create day names row with dates
    for (let i = 0; i < 7; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        dayCell.textContent = days[i] + ' ' + (weekStart.getDate() + i) + '/' + (weekStart.getMonth() + 1);
        if (currentDate.getDate() === weekStart.getDate() + i) {
            dayCell.classList.add('current-day');
        }
        calendarEl.appendChild(dayCell);
    }

    // Create hour names column
    const hourNames = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    for (let i = 0; i < 24; i++) {
        const hourCell = document.createElement('div');
        hourCell.classList.add('hour-cell');
        hourCell.textContent = hourNames[i];
        calendarEl.appendChild(hourCell);
        
        // Create empty cells for each hour
        for (let j = 0; j < 7; j++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty-cell');
            if (currentDate.getDate() === weekStart.getDate() + j) {
                emptyCell.classList.add('current-day');
            }
            calendarEl.appendChild(emptyCell);
        }
    }
}




