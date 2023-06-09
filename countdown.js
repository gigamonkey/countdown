// This variable and the next function can be used in testing but aren't
// otherwise used.
let offset = 0;

// eslint-disable-next-line no-unused-vars
const setOffset = (year, month, date, hour = 12, min = 0, second = 0) => {
  offset = new Date(year, month - 1, date, hour, min, second).getTime() - new Date().getTime();
};

// Always use this to get the "current" time to ease testing.
const now = () => {
  return new Date(new Date().getTime() + offset).getTime();
};

const $ = (id) => document.getElementById(id);

let intervalID = null;

const start = () => {
  const params = new URL(window.location).searchParams;

  if (!(params.get("title") || params.get("label")) || !params.get("date") || !params.get("time")) {
    $("config").style.display = "flex";
  } else {
    const title = params.get("title") || params.get("label");
    const date = params.get("date");
    const time = params.get("time");
    const end = parseDateAndTime(date, time);
    const done = params.get("done") || "🎉 Done 🎉";
    const justHours = params.get("hours");

    const textFn = justHours ? countdownTextHoursMax : countdownText;

    const update = () => countdown(title, done, end, now(), textFn);

    update();
    intervalID = setInterval(update, 1000);
  }
};

const countdown = (title, done, end, t, textFn) => {
  const millis = end.getTime() - t;
  if (millis < 0) clearInterval(intervalID);
  $("countdown").replaceChildren(
    div(title, "title"),
    div(millis > 0 ? textFn(millis) : done, "countdown"),
    div(end, "time")
  );
};

const div = (contents, className = null) => {
  const d = document.createElement("div");
  if (className !== null) d.classList.add(className);
  d.innerHTML = contents;
  return d;
};

const countdownText = (millis) => {
  let seconds = Math.floor(millis / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let weeks = Math.floor(days / 7);

  let ss = seconds % 60;
  let mm = minutes % 60;
  let hh = hours % 24;
  let dd = days % 7;

  let r = [
    noZero(weeks, `${weeks} ${plural("week", weeks)}`),
    noZero(dd, `${dd} ${plural("day", dd)}`),
    noZero(hh, `${hh} ${plural("hour", hh)}`),
    noZero(mm, `${mm} ${plural("minute", mm)}`),
    noZero(ss, `${ss} ${plural("second", ss)}`),
  ];
  return r.filter((x) => x != null).join(", ");
};

const countdownTextHoursMax = (millis) => {
  let seconds = Math.floor(millis / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  let ss = seconds % 60;
  let mm = minutes % 60;

  let r = [
    noZero(hours, `${hours} ${plural("hour", hours)}`),
    noZero(mm, `${mm} ${plural("minute", mm)}`),
    noZero(ss, `${ss} ${plural("second", ss)}`),
  ];
  return r.filter((x) => x != null).join(", ");
};

const plural = (text, n) => (n == 1 ? text : text + "s");

const noZero = (n, text) => (n == 0 ? null : text);

const parseDateAndTime = (date, time) => {
  let [year, month, day] = date.split("-").map((s) => parseInt(s));
  let [h, m] = time.split(":").map((s) => parseInt(s));
  return new Date(year, month - 1, day, h, m);
};

start();
