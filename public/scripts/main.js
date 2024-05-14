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

    // Show event form when a cell is clicked
    calendarEl.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('empty-cell')) {
            document.getElementById('event-form').style.display = 'block';
        } else {
            document.getElementById('event-form').style.display = 'none';
        }
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
    
    const today = new Date(); // Get today's date
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;

    // Add empty cell before the days
    const emptyCellBeforeDays = document.createElement('div');
    emptyCellBeforeDays.classList.add('empty-cell');
    calendarEl.appendChild(emptyCellBeforeDays);

    // Create day names row with dates
    for (let i = 0; i < 7; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        const dayDate = new Date(weekStart);
        dayDate.setDate(dayDate.getDate() + i);
        const day = dayDate.getDate();
        const month = dayDate.getMonth() + 1;
        const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}`;
        dayCell.textContent = days[i] + ' ' + formattedDate;

        // Check if the current cell corresponds to today's date
        if (day === todayDay && month === todayMonth) {
            dayCell.classList.add('current-day');
            console.log("currentDate.getDate():", currentDate.getDate());
            console.log("currentDate.getMonth() + 1:", currentDate.getMonth() + 1);
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
            calendarEl.appendChild(emptyCell);
        }
    }
}


function addEvent() {
    const title = document.getElementById('title').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const description = document.getElementById('description').value;

    const eventData = { title, start, end, description };

    fetch('/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add event');
        }
        return response.json();
    })
    .then(data => {
        console.log('Event added successfully:', data);
        // Optionally, update the UI to reflect the added event
    })
    .catch(error => {
        console.error('Error adding event:', error);
    });
}
