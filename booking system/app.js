
const $selectedContainer= document.getElementById('selected__list');
const $reservationContainer=document.getElementById('reservation__container');
const $screenContainer = document.getElementById('screening');
const $date = document.querySelectorAll('.day__week');
const $screenTitle=document.getElementById('screening__date');
const screeningList=
[
    [],
    [],
    [],
    [],
    [],
    [],
    []
]

function timestamp(startTime, endTime)
{
   
   const start= startTime.split('.');
   let startHour = start[0];
   let startMin = start[1];
   if(startMin ===undefined){
       startMin=0;
   }
   if(startMin===6){
       startMin=0;
       starTHour++;
   }
   if(startHour.length===1){
       startHour= `0${startHour}`
   }
   if(startMin>=0 && startMin<10){
       startMin=`${startMin}0`
   }
   const end=endTime.split('.');
   let endHour = end[0];
   let endMin= end[1];
   if(endMin === undefined){
       endMin=0;
   }
   if(endMin===6){
       endMin=0;
       endHour++;
   }
   if(endHour.length===1){
       endHour=`0${endHour}`;
   }
   if(endMin>=0 && endMin <10){
       endMin=`${endMin}0`;
   }

   return `${startHour}:${startMin} ~ ${endHour}:${endMin}`;
}
class Movie {
    constructor(title, sequence, fee){
        this.title=title;
        this.sequence=sequence;
        this.fee=fee;
    }

    getDate(){
        return this.date;
    }
    getTitle(){
        return this.title;
    }

    getSequence(){
        return this.sequence;
    }
    getFee(){
        return this.fee;
    }
}


class Money{
    constructor(total, discount){
        this.total=total;
        this.discount=discount;
    }

    getTotal(){
        return this.total;
    }

    getDiscount(){
        return this.discount;
    }

    setTotal(money){
        this.total=money;
    }

    setDiscount(discount){
        this.discount=discount;
    }

    getMovieFee(){
        return this.total-this.discount;
    }
}

class Screening{
    constructor(date,movie, startTime, discountPolicy){
        this.date=date;
        this.movie=movie;
        this.startTime=startTime; // 시작시간
        this.discountPolicy=discountPolicy;
        this.endTime=(+movie.getSequence())+startTime;
    }
    
    getTime(){ // 상영시간 
        // start time~ endtime 조합해서 리턴하기
        let start= +this.startTime;
        let end = +this.endTime;
        if(start>=24){
            start-=24;
        }
        if(end >=24){
            end-=24;
        }
        end=end.toFixed(1);
        return timestamp(start.toString(),end.toString());
    }
    
    getMovieTitle(){
        return this.movie.getTitle();
    }

    
    CalcMoney(){ // 할인가 계산 
        const movieFee=this.movie.getFee();
        const requirement = this.discountPolicy.getRequirement();
        const money = new Money(movieFee,0);
        if(requirement.check(this.startTime, this.endTime)===true){ // 할인 조건 충족시 할인 
            const discount = this.discountPolicy.getDiscount();
            if(discount < 0){ // static 
                money.setDiscount(discount*(-1));
            }
            else{ // percentage 
                money.setDiscount(movieFee*discount);
            }
         }
        return money;
    }
}

class Reservation{
    constructor(screening, money){
        this.screening=screening;
        this.money=money;
    }
    
    getScreening (){
        return this.screening;
    }

    getMoney(){
        return this.money;
    }
}

class DiscountPolicy{ // 할인 정책 
    constructor(discountRequirment,amount){
        this.discountRequirment=discountRequirment;  // 할인 조건 
        this.amount=amount;
    }
    
    getRequirement(){
        return this.discountRequirment;
    }
    getDiscount(){
        return this.amount;
    }
}

class StaticDiscount extends DiscountPolicy{ // 특정 금액 할인 
    constructor(discountRequirment, amount){
        super(discountRequirment,amount);
    }
    getDiscount(){
        return this.amount*(-1);
    }
}

class PercentageDiscount extends DiscountPolicy{ // 퍼센테이지 할인 
    constructor(discountRequirment, amount){
        super(discountRequirment,amount);
    }
    getDiscount(){
        return this.amount/100; 
    }
}

class DiscountRequirement{ // 특정 상영시간 내의 영화만 할인 
    constructor(startTime, endTime){
        this.startTime=startTime;
        this.endTime=endTime;
    }
    
    check(startTime,endTime){
        if(startTime>=this.startTime || endTime <= this.endTime){
            return true;
        }
        else{
            return false;
        }
    }
    
}

// 저장될 것
// 선택된 영화 리스트
// 예약한 영화 리스트 
// 상영 영화 리스트 
class Store{ // local Storage에 저장하는 클래스 

    getSelectedList(){
        return JSON.parse(localStorage.getItem('selectedList'))||[];
    }

    getReservedList(){
        return JSON.parse(localStorage.getItem('reservedList'))||[];
    }


    setSelectedList(newItem){
        const selectedList=this.getSelectedList();
        selectedList.push(newItem);
        localStorage.setItem('selectedList',JSON.stringify(selectedList));
    }

    setReservedList(newItem){
        const reservedList = this.getReservedList();
        reservedList.push(newItem);
        localStorage.setItem('reservedList',JSON.stringify(reservedList));
    }

}

class CalcDate{
    constructor(){
        const today= new Date();
        this.date= today.getDate();
        this.month= today.getMonth();
        this.year= today.getFullYear();
    }

    getDate(){
        return this.date;
    }

    getMonth(){
        return this.month;
    }

    getYear(){
        return this.year;
    }
    
    getDaysInMonth(){
        return new Date(parseInt(this.year), parseInt(this.month)+1,0).getDate();
    }

}

const date = new CalcDate();

const store = new Store();

class UI{

    initSelectedContainer(){
        if(store.getSelectedList().length===0){
            $selectedContainer.classList.add('hidden');
        }
    }

    initReservedContainer(){
        if(store.getReservedList().length===0){
            $reservationContainer.classList.add('hidden');
        }
    }

    showMovies(selectedDate){ // 특정 날짜 선택시, 해당 날짜에 상영하는 영화 나열 
        const daysInMonth = +date.getDaysInMonth(); 
        const today = +date.getDate();
        let idx;
        for(let i = 0; i<7; i++){
            let newDate= today+i;
            if(newDate>daysInMonth){
                newDate-=daysInMonth;
            }
            if(newDate === selectedDate){
                idx=i;
                break;
            }
        }
       const screenList= screeningList[idx];  // 해당 날짜에 상영하는 영화 리스트
       let html =`
       <tr>
            <th>상영시간</th>
            <th>제목</th>
            <th>가격</th>
        </tr>
        `
       screenList.forEach(movie=>{
           console.log(movie);
           const money= movie.CalcMoney();
           const totalFee = money.getTotal()-money.getDiscount();
           html+=`
           <tr>
                <td>${movie.getTime()}</td>
                <td>${movie.getMovieTitle()}</td>
                <td>${totalFee}</td>

           </tr>
           `;
       })
       $screenContainer.innerHTML=html;
    }
}


// 조조 할인
const morningDiscount = new DiscountRequirement(7,12);
// 심야 할인 
const nightDiscount = new DiscountRequirement(22,24);

// 할인 정책 
const policy1=  new StaticDiscount(morningDiscount,3000); // 조조할인 + 고정가격할인
const policy2= new StaticDiscount(nightDiscount,2000); // 심야할인 + 고정가격 할인
const policy3= new PercentageDiscount(morningDiscount, 20); // 조조할인 + 퍼센테이지 할인
const policy4 = new PercentageDiscount(nightDiscount, 10); // 심야할인 + 퍼센테이지 할인


// 상영 스케줄 로컬 스토리지에 저장   
// 점심에는 기본적으로 할인정책 들어가지만, 적용되지는 않음
const initScreening=function(){ 
    // 영화 리스트 
    const movie1 = new Movie('작은 아씨들', '2', '12000');
    const movie2 = new Movie('브루클린', '1.30','12000');
    const movie3 = new Movie('다크나이트', '3', '11000');
    const movie4 = new Movie('인셉션', '2.30', '12000');
    const movie5 = new Movie('센과 치히로의 행방불명', '2', '8000');
    const movie6 = new Movie('가디언즈 오브 갤럭시', '3', '10000');
    const movie7 = new Movie('어느 가족', '2', '11000');
    const movieList=[movie1,movie2,movie3,movie4,movie5,movie6,movie7];
    const today_date=date.getDate();
    const DaysInMonth= date.getDaysInMonth();
    for(i=0;i<7;i++){ 
        let newDate=today_date+i;
        if(newDate>=DaysInMonth){
            newDate-=DaysInMonth;
        }
        let obj=new Screening(newDate,movie1,7,policy1);
        screeningList[i].push(obj);
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],8,policy3));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],6,policy3));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],7.30,policy1));

        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],12,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],12,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],13,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],15,policy3));

        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],17,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],18,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],20,policy3));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],21,policy1));

        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],21.35,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],22,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],23,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * 7) ],24,policy3));
    }

}


const ui = new UI();
const init=function(){
    ui.initSelectedContainer();
    ui.initReservedContainer();
}
const dateEvent=function(){
    $date.forEach(date=>{
        date.addEventListener('click',(e)=>{
            // 일 , 월 만 빼오기  
            
            const selectedDate=date.children[1].innerText;
            const selectedMonth=date.children[0].innerText;
            $screenTitle.innerText=`${selectedMonth} ${selectedDate}`;
            ui.showMovies(+selectedDate.replace('일',''));
        })
    })
}
init();

dateEvent();

initScreening();