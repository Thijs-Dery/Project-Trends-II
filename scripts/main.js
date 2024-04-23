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

    for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeek);
        day.setDate(currentWeek.getDate() + i);
        const dayOfWeek = weekDays[i];
        const weekDayDiv = document.createElement('div');
        weekDayDiv.classList.add('week');
        weekDayDiv.textContent = dayOfWeek + ' ' + day.getDate();
        calendar.appendChild(weekDayDiv);
    }
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