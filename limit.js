const currentTimeFontSize = 20;
const limitTimeFontSize = 30;
const KEY_START_TIME = "start_time";
const KEY_END_TIME = "end_time";

let startTimeText = getCookie(KEY_START_TIME);
let endTimeText = getCookie(KEY_END_TIME);

let cookieLife = new Date();
cookieLife.setMonth(cookieLife.getMonth() + 1);

if(startTimeText == undefined){
    startTimeText = "12:00:00";
    document.cookie = KEY_START_TIME + "=" + startTimeText + "; expires=" + cookieLife.toUTCString();
}

if(endTimeText == undefined){
    endTimeText = "13:00:00";
    document.cookie = KEY_END_TIME + "=" + endTimeText + "; expires=" + cookieLife.toUTCString();
}

let startTime = new Date();
let endTime = new Date();
let startTimeMilliSeconds = 0;
let endTimeMilliSeconds = 0;
let betweenTime = 0;

init();

function init(){
    //日付はダミー
    startTime = new Date("2000-01-01T" + startTimeText + "+09:00");
    endTime = new Date("2000-01-01T" + endTimeText + "+09:00");
    startTimeMilliSeconds = getTimeMilliSeconds(startTime);
    endTimeMilliSeconds = getTimeMilliSeconds(endTime);
    if(startTime > endTime){
        endTimeMilliSeconds += 24 * 3600000; //開始時間と終了時間が逆転していたら終了時間を一日進める
    }
    betweenTime = endTimeMilliSeconds - startTimeMilliSeconds;
}

function limit(){
    const startTimeFrom = document.getElementById("start-time");
    const endTimeFrom = document.getElementById("end-time");
    startTimeFrom.value = startTimeText;
    endTimeFrom.value = endTimeText;
    document.getElementById("start-time-info").innerHTML = startTimeText;
    document.getElementById("end-time-info").innerHTML = endTimeText;
    
    const setTimeBtn = document.getElementById("set-time");
    setTimeBtn.addEventListener("click", () => {
        startTimeText = startTimeFrom.value;
        endTimeText = endTimeFrom.value;
        init();
        document.getElementById("start-time-info").innerHTML = startTimeText;
        document.getElementById("end-time-info").innerHTML = endTimeText;
        document.cookie = KEY_START_TIME + "=" + startTimeText + "; expires=" + cookieLife.toUTCString();
        document.cookie = KEY_END_TIME + "=" + endTimeText + "; expires=" + cookieLife.toUTCString();
    });

    const can = document.getElementById("main");
    const ctx = can.getContext("2d");

    can.width = 600;
    can.height = 600;

    const width = can.width;
    const height = can.height;
    const radius = can.width * 0.4;
    const cx = width / 2;
    const cy = height / 2;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    setInterval(() => {
        let now = new Date();
        ctx.clearRect(0, 0, width, height);
        draw(ctx, cx, cy, radius, now);
    },100);
}

function draw(ctx, x, y, radius, now){
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.font = currentTimeFontSize + "px sans-serif";
    ctx.fillText(timeFormat(now), x, y - radius / 3);

    const nowTimeMilliSeconds = getTimeMilliSeconds(now);

    if(nowTimeMilliSeconds >= startTimeMilliSeconds && nowTimeMilliSeconds <= endTimeMilliSeconds){
        const betweenNow = endTimeMilliSeconds - nowTimeMilliSeconds;
        const circleAngle = betweenNow / betweenTime * (Math.PI * 2);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.arc(x, y, radius - ctx.lineWidth, -Math.PI / 2, circleAngle - Math.PI / 2, false);
        ctx.stroke();
        ctx.font = limitTimeFontSize + "px sans-serif";
        ctx.fillText("残り時間 " + getMilliSecondsToString(betweenNow), x, y);
    }
}

function getTimeMilliSeconds(date){
    return date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds();
}

function getMilliSecondsToString(milliSeconds){
    return zeroPadding(Math.floor(milliSeconds / 3600000), 2) + ":"
    + zeroPadding(Math.floor(milliSeconds / 60000) % 60, 2) + ":"
    + zeroPadding(Math.floor(milliSeconds / 1000) % 60, 2);
}

function timeFormat(date){
    return zeroPadding(date.getHours(), 2) + ":" + zeroPadding(date.getMinutes(), 2) + ":" + zeroPadding(date.getSeconds(), 2);
}

function zeroPadding(num, len){
    return (Array(len).join("0") + num).slice(-len);
}

function getCookie(key){
    let cookies = document.cookie.split("; ");
    let value;
    cookies.forEach(c => {
        let [_key, _value] = c.split("=");
        if(_key == key){
            value = _value;
            return;
        }
    })
    return value;
}

document.addEventListener("DOMContentLoaded", limit);