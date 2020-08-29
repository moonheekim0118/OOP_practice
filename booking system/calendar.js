// 오늘부터 일주일 구현하기 
const $weekly=document.getElementById('weekly__calendar');



const getWeek= function(params){
    const month=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월', '11월', '12월'];
    const day = ['월','화','수','목','금','토','일'];
    const daysInMonth=getDaysInMonth(params.month, params.year);
    function getDaysInMonth(month,year){ // 현재 month의 총 일자 구하기 
        return new Date(year, month+1,0).getDate();
    }
    let html='';
    let newMonth = month[params.month]; // 월 
    let dayCount = params.day-2; // 요일 

    for(let i=0; i<7; i++){ //일주일단위
        dayCount++;
        if(dayCount === 7) {
            dayCount=0;
        }
        let newDay = day[dayCount];
        let newDate = params.date+i;
        if(newDate > daysInMonth) {
            newDate-=daysInMonth;
            params.month ===11 ? newMonth=month[0] : newMonth=month[params.month+1]; // month 도 바꿔주기
        }
        html+=`<div class="day__week ${i===0 ? 'today' :''}">
            <span id="Month">${newMonth}</span>
            <span id="Date">${newDate}일</span>
            <span id="Day">${newDay}</span> 
        </div>`;
    }
    $weekly.innerHTML=html;
}


const today= new Date();
const now_date = today.getDate();
const now_month = today.getMonth();
const now_day = today.getDay();
const now_year = today.getFullYear();

getWeek({
    month: now_month,
    date: now_date,
    day: now_day,
    year: now_year
});