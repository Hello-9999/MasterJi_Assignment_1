// Store mood data in localStorage
let moodData = JSON.parse(localStorage.getItem("moodData")) || {};

// Current date and default view
let currentDate = new Date();
let currentView = "week";

// Get references to HTML elements
const viewButtons = document.querySelectorAll(".view-btn");
const moodButtons = document.querySelectorAll(".mood-btn");
const prevButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");
const currentPeriodElement = document.getElementById("currentPeriod");
const weekViewElement = document.getElementById("weekView");
const calendarViewElement = document.getElementById("calendarView");

// Function to format a date as "Day, Month Date"
function formatDate(date) {
  return date.toLocaleDateString("en-US", { 
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Function to switch between 'week' and 'calendar' view
function changeView(view) {
  currentView = view;
  viewButtons.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.view === view)
  );
  // render();
}
viewButtons.forEach((btn) => {
  btn.addEventListener("click", () => changeView(btn.dataset.view));
});

// Function to save the selected mood for today
function saveMood(mood) {
  const today = new Date().toISOString().split("T")[0];
  moodData[today] = mood;
  localStorage.setItem("moodData", JSON.stringify(moodData));
  render();
}
moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => saveMood(btn.dataset.mood));
});

// Function to navigate between weeks or months
function navigate(direction) {
  const daysToMove = currentView === "week" ? 7 : 30;

  currentDate.setDate(currentDate.getDate() + direction * daysToMove);

  render();
}

prevButton.addEventListener("click", () => navigate(-1));
nextButton.addEventListener("click", () => navigate(1));

// Function to get the start and end date of the current view
function getDateRange() {
  let start = new Date(currentDate);
  let end = new Date(currentDate);

  if (currentView === "week") {
    // Clone the date to avoid modifying the original `currentDate`
    start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week (Sunday)

    end = new Date(start); // Clone `start` before modifying it
    end.setDate(start.getDate() + 6); // End of the week (Saturday)
  } else {
    start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the month
    end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the month
  }

  return { start, end };
}

// Function to get the emoji for a mood
function getMoodEmoji(mood) {
  const moodEmojis = {
    happy: "😊",
    excited: "🤗",
    neutral: "😐",
    sad: "😔",
    angry: "😠",
  };
  return moodEmojis[mood] || "❓";
}

// Function to render the week view
function renderWeekView() {
  const { start, end } = getDateRange();
  let html = '<div class="timeline-view">';

  console.log(html, "html");

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const dateStr = date.toISOString().split("T")[0];
    const mood = moodData[dateStr];

    html += `
            <div class="mood-entry">
                <span class="mood-date">${formatDate(date)}</span>
                <span class="mood-emoji">${
                  mood ? getMoodEmoji(mood) : "—"
                }</span>
            </div>
        `;
  }

  html += "</div>";
  return html;
}

// Function to render the calendar view
function renderCalendarView() {
  const { start, end } = getDateRange();
  let html = '<div class="calendar-grid">';
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add day headers
  days.forEach((day) => {
    html += `<div class="calendar-day header">${day}</div>`;
  });

  // Add empty spaces before the first day of the month
  for (let i = 0; i < start.getDay(); i++) {
    html += '<div class="calendar-day empty"></div>';
  }

  // Add days with mood data
  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const dateStr = date.toISOString().split("T")[0];
    const mood = moodData[dateStr];
    const isToday = date.toDateString() === new Date().toDateString();

    html += `
            <div class="calendar-day ${mood ? "has-mood" : ""} ${
      isToday ? "today" : ""
    }">
                <div class="day-number">${date.getDate()}</div>
                ${
                  mood
                    ? `<div class="mood-emoji">${getMoodEmoji(mood)}</div>`
                    : ""
                }
            </div>
        `;
  }

  html += "</div>";
  return html;
}

// // Function to render the entire UI
function render() {
  const { start, end } = getDateRange();
  console.log({ start, end }, "start, end");
  currentPeriodElement.textContent =
    currentView === "week"
      ? `${formatDate(start)} - ${formatDate(end)}`
      : currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

  if (currentView === "calendar") {
    calendarViewElement.innerHTML = renderCalendarView();
  } else {
    weekViewElement.innerHTML = renderWeekView();
  }

  // Show active view
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle(
      "active",
      view.id === (currentView === "week" ? "weekView" : "calendarView")
    );
  });
}

document.addEventListener("DOMContentLoaded", render);
