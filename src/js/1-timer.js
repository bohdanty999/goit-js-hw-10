import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateInput = document.querySelector('#datetime-picker');
const btn = document.querySelector('[data-start]');
const displayedlDays = document.querySelector('[data-days]');
const displayedHours = document.querySelector('[data-hours]');
const displayedMinutes = document.querySelector('[data-minutes]');
const displayedSeconds = document.querySelector('[data-seconds]');
let intervalId;
let userSelectedDate;
btn.disabled = true;

const fp = flatpickr(dateInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const diff = selectedDates[0] - new Date();
    if (diff <= 0) {
      iziToast.show({
        message: 'Please choose a date in the future',
      });
      btn.disabled = true;
      clearInterval(intervalId);
    } else if (diff > 0) {
      btn.disabled = false;
    }
    userSelectedDate = selectedDates[0];
  },
});

btn.addEventListener('click', () => {
  btn.disabled = true;
  dateInput.disabled = true;
  intervalId = setInterval(() => {
    const diff = userSelectedDate - new Date();

    if (diff < 1000) {
      dateInput.disabled = false;
      clearInterval(intervalId);
    }
    const { days, hours, minutes, seconds } = convertMs(diff);
    displayedlDays.textContent = addLeadingZero(days);
    displayedHours.textContent = addLeadingZero(hours);
    displayedMinutes.textContent = addLeadingZero(minutes);
    displayedSeconds.textContent = addLeadingZero(seconds);
  }, 1000);
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);

  const hours = Math.floor((ms % day) / hour);

  const minutes = Math.floor(((ms % day) % hour) / minute);

  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
