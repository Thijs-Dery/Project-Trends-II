function hamburgerShow() {
    let x = document.getElementById("links");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}


let currentWeek = new Date();
currentWeek.setDate(currentWeek.getDate() - (currentWeek.getDay() + 6) % 7);

function renderWeek() {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const calendar = document.querySelector('.calendar');

    calendar.innerHTML = '';

    weekDays.forEach((dayOfWeek, index) => {
        const day = new Date(currentWeek);
        day.setDate(currentWeek.getDate() + index);

        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');

        const dayNameDiv = document.createElement('div');
        dayNameDiv.classList.add('day-name');
        dayNameDiv.textContent = dayOfWeek + ' ' + day.getDate(); // Append date to day name

        const hoursContainerDiv = document.createElement('div');
        hoursContainerDiv.classList.add('hours-container');

        const hoursDiv = document.createElement('div');
        hoursDiv.classList.add('hours');

        for (let hour = 0; hour < 24; hour++) {
            const hourDiv = document.createElement('div');
            hourDiv.classList.add('hour');
            hourDiv.textContent = hour.toString().padStart(2, '0') + ':00';
            hoursDiv.appendChild(hourDiv);
        }

        hoursContainerDiv.appendChild(hoursDiv);
        dayDiv.appendChild(dayNameDiv);
        dayDiv.appendChild(hoursContainerDiv);

        calendar.appendChild(dayDiv);
    });
}

function prevWeek() {
    currentWeek.setDate(currentWeek.getDate() - 7);
    renderWeek();
}

function nextWeek() {
    currentWeek.setDate(currentWeek.getDate() + 7);
    renderWeek();
}

renderWeek();

