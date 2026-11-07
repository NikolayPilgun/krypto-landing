(() => {
  'use strict';

  /* ---------- Утилиты ---------- */
  const pad = (n) => String(n).padStart(2, '0');

  const MS_IN_SECOND = 1000;
  const MS_IN_MINUTE = 60 * MS_IN_SECOND;
  const MS_IN_HOUR = 60 * MS_IN_MINUTE;
  const MS_IN_DAY = 24 * MS_IN_HOUR;

  /* ---------- Таймер ---------- */
  const UNITS = ['days', 'hours', 'minutes', 'seconds'];

  function getTimeParts(diff) {
    return {
      days: Math.floor(diff / MS_IN_DAY),
      hours: Math.floor((diff % MS_IN_DAY) / MS_IN_HOUR),
      minutes: Math.floor((diff % MS_IN_HOUR) / MS_IN_MINUTE),
      seconds: Math.floor((diff % MS_IN_MINUTE) / MS_IN_SECOND),
    };
  }

  function initTimer(root) {
    const target = new Date(root.dataset.timer).getTime();

    if (Number.isNaN(target)) {
      console.warn('Timer: некорректная дата в data-timer:', root.dataset.timer);
      return null;
    }

    const nodes = {};
    UNITS.forEach((unit) => {
      nodes[unit] = root.querySelector(`[data-${unit}]`);
    });

    let intervalId = null;

    const render = () => {
      const diff = target - Date.now();

      if (diff <= 0) {
        UNITS.forEach((unit) => {
          if (nodes[unit]) nodes[unit].textContent = '00';
        });
        clearInterval(intervalId);
        intervalId = null;
        return;
      }

      const time = getTimeParts(diff);

      UNITS.forEach((unit) => {
        if (nodes[unit]) nodes[unit].textContent = pad(time[unit]);
      });
    };

    render();
    intervalId = setInterval(render, 1000);

    return {
      stop() {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
      },
    };
  }

  function bindTimer() {
    const root = document.querySelector('[data-timer]');
    if (!root) return;

    let timer = initTimer(root);
    if (!timer) return;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        timer.stop();
      } else {
        timer = initTimer(root);
      }
    });
  }

  /* ---------- Точка входа ---------- */
  document.addEventListener('DOMContentLoaded', bindTimer);
})();
