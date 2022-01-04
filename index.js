let nav = 0;
let clicked = null;

const testEvents = [
  {
    date: "2022-01-03",
    title: "2021 review",
    startTime: "10:00",
    endTime: "11:00",
    type: "eventMeeting",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    date: "2022-01-04",
    title: "2022 planning",
    startTime: "10:00",
    endTime: "11:00",
    type: "eventCall",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    date: "2022-01-05",
    title: "Lunch",
    startTime: "10:00",
    endTime: "11:00",
    type: "eventOutOfOffice",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
];

sessionStorage.setItem("testEvents", JSON.stringify(testEvents));

let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : JSON.parse(sessionStorage.getItem("testEvents"));
const container = document.getElementById("container");
const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const eventDateInput = document.getElementById("eventDateInput");
const eventStartTimeInput = document.getElementById("eventStartTimeInput");
const eventEndTimeInput = document.getElementById("eventEndTimeInput");
const eventTypeInput = document.getElementById("eventTypeInput");
const eventDescriptionInput = document.getElementById("eventDescriptionInput");
const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const openModal = (date) => {
  clicked = date;
  const eventForDay = events.find((e) => e.date === clicked);
  if (eventForDay) {
    document.getElementById("eventTitle").innerText = eventForDay.title;
    document.getElementById("eventDate").innerText = eventForDay.date;
    document.getElementById("eventStartTime").innerText = eventForDay.startTime;
    document.getElementById("eventEndTime").innerText = eventForDay.endTime;
    switch (eventForDay.type) {
      case "eventMeeting":
        document.getElementById("eventType").innerText = "Meeting";
        break;
      case "eventCall":
        document.getElementById("eventType").innerText = "Call";
        break;
      case "eventOutOfOffice":
        document.getElementById("eventType").innerText = "Out of office";
        break;
    }
    document.getElementById("eventDescription").innerText =
      eventForDay.description;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
    eventDateInput.value = date;
  }

  backDrop.style.display = "block";
};

const load = () => {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-us",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${year}-${
      month + 1 < 10 ? "0" + (month + 1) : month + 1
    }-${i - paddingDays < 10 ? "0" + (i - paddingDays) : i - paddingDays}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find((e) => {
        return e.date === dayString;
      });

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.classList.add(eventForDay.type);
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
};

const closeModal = () => {
  eventTitleInput.classList.remove("error");
  eventDateInput.classList.remove("error");
  eventStartTimeInput.classList.remove("error");
  eventEndTimeInput.classList.remove("error");
  eventTypeInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  eventDateInput.value = "";
  eventStartTimeInput.value = "";
  eventEndTimeInput.value = "";
  eventTypeInput.value = "";
  eventDescriptionInput.value = "";
  clicked = null;
  load();
};

const saveEvent = () => {
  const startTime = eventStartTimeInput.value.split(":");
  const endTime = eventEndTimeInput.value.split(":");

  if (
    eventTitleInput.value &&
    eventDateInput.value &&
    eventTypeInput.value &&
    startTime < endTime
  ) {
    eventTitleInput.classList.remove("error");
    eventDateInput.classList.remove("error");
    eventStartTimeInput.classList.remove("error");
    eventEndTimeInput.classList.remove("error");
    eventTypeInput.classList.remove("error");

    events.push({
      date: eventDateInput.value,
      title: eventTitleInput.value,
      startTime: eventStartTimeInput.value,
      endTime: eventEndTimeInput.value,
      type: eventTypeInput.value,
      description: eventDescriptionInput.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    !eventTitleInput.value
      ? eventTitleInput.classList.add("error")
      : eventTitleInput.classList.remove("error");
    !eventDateInput.value
      ? eventDateInput.classList.add("error")
      : eventDateInput.classList.remove("error");
    !eventStartTimeInput.value
      ? eventStartTimeInput.classList.add("error")
      : eventStartTimeInput.classList.remove("error");
    !eventEndTimeInput.value || startTime > endTime
      ? eventEndTimeInput.classList.add("error")
      : eventEndTimeInput.classList.remove("error");
    !eventTypeInput.value
      ? eventTypeInput.classList.add("error")
      : eventTypeInput.classList.remove("error");
  }
};

const deleteEvent = () => {
  if (confirm("Are you sure you want to delete this event?")) {
    events = events.filter((e) => e.date !== clicked);
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    closeModal();
  }
};

const initButtons = () => {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
  document.getElementById("closeButton").addEventListener("click", closeModal);
};

initButtons();
load();
