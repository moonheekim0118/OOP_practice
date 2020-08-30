
const $selectedContainer= document.getElementById('selected__list');
const $selectedInnerContainer=document.getElementById('selected__movies');
const $screenContainer = document.getElementById('screening');
const $date = document.querySelectorAll('.day__week');
const $screenTitle=document.getElementById('screening__date');
const $originFee=document.getElementById('origin__fee');
const $discountFee=document.getElementById('discount__fee');
const $totalFee=document.getElementById('total__fee');
const $alertContainer=document.getElementById('alert__container');
const $darkModeSwitch=document.querySelector('.theme-switch input[type="checkbox"]');
let $screenMovie;
let $removeBtns;

let reservedList=[];
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
   if(startMin>=6){
       startMin=startMin-6;
       startHour++;
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
   if(endMin>=6){
       endMin=endMin-6;
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

    getTitle(){
        return this.screening.getMovieTitle();
    }

    getTime(){
        return this.screening.getTime();
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

    getSpecificDate(selectedDate){
        const daysInMonth = +this.getDaysInMonth(); 
        const today = +this.getDate();
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
        return idx;
    }

}

const date = new CalcDate();

class Store{
    
    filter(index){
        reservedList=reservedList.filter((val,i)=>i!==index);
    }

    AddnewItem(newItem){
        let flag=false;
        reservedList.forEach(list=>{
            if(JSON.stringify(list.reservation)===JSON.stringify(newItem.reservation) && list.date===newItem.date){
                list.qty++;
                flag=true;
            }
        })
        if(flag===false){
            reservedList.push(newItem);
        }
        return flag;
    }

    getOriginFeeReduce(){
        return reservedList.reduce((accum,val)=>accum+ (+val.originMoney)*(+val.qty),0);
    }

    getDiscountFeeReduce(){
        return reservedList.reduce((accum,val)=>accum+ (+val.discountMoney)*(+val.qty),0);
    }
    
}

const store = new Store();

class UI{

    initSelectedContainer(){
        $selectedContainer.classList.add('hidden');
    }

    showMovies(selectedDate){ // 특정 날짜 선택시, 해당 날짜에 상영하는 영화 나열 
       let idx= date.getSpecificDate(selectedDate);
       const screenList= screeningList[idx];  // 해당 날짜에 상영하는 영화 리스트
       let html =`
       <tr>
            <th>상영시간</th>
            <th>제목</th>
            <th>가격</th>
        </tr>
        `
       screenList.forEach((movie,index)=>{
           const money= movie.CalcMoney();
           const totalFee = money.getTotal()-money.getDiscount();
           html+=`
           <tr class="screening__movies">
                <td>${movie.getTime()}</td>
                <td>${movie.getMovieTitle()}</td>
                <td>${totalFee}</td>
                <td class="hidden">${idx},${index},${selectedDate}</td>
           </tr>
           `;
       })
       $screenContainer.innerHTML=html;
       $screenMovie=document.querySelectorAll('.screening__movies');
       movieSelectEvent();
    }

    fetchReservationContainer(){
        let html='';
        reservedList.forEach(list=>{
            html+=`
                <div class="single__movie">
                <i class="fas fa-times" id="remove"></i>
                <li class="movie__info">${list.date}일,${list.reservation.getTitle()}${list.reservation.getTime()} ${list.qty}장</li>
                <div class="hidden">${reservedList.indexOf(list)}</div>
                </div>
                `;
        })    
        $selectedInnerContainer.innerHTML=html;
    }

    updateFee(){ // 가격 업데이트

        const origin=store.getOriginFeeReduce();
        const discount=store.getDiscountFeeReduce();
        const total = origin-discount;
        $originFee.innerText=`원가: ${origin}원`;
        $discountFee.innerText=`할인액: ${discount}원`;
        $totalFee.innerText=`총액: ${total}원`;
    }

    addReservation(newItem){
        if($selectedContainer.classList.contains('hidden')){
            $selectedContainer.classList.remove('hidden');
        }
        const flag=store.AddnewItem(newItem);
        if(flag===true){
            this.fetchReservationContainer();
        }
        else{
            let html=`
            <div class="single__movie">
            <i class="fas fa-times" id="remove"></i>
            <li class="movie__info">${newItem.date}일,${newItem.reservation.getTitle()}${newItem.reservation.getTime()} 1장</li>
            <div class="hidden">${reservedList.indexOf(newItem)}</div>
            </div>
            `
            $selectedInnerContainer.innerHTML+=html;
        }
        $removeBtns=document.querySelectorAll('#remove');
        reservationRemoveEvent();
    }

    removeReservation(){
        // 삭제되었으니, 새로 fetch 해줘야함
        this.fetchReservationContainer();
        this.updateFee();
        if(reservedList.length ===0){
            this.initSelectedContainer();
        }
        $removeBtns=document.querySelectorAll('#remove');
        reservationRemoveEvent();
    }

    showAlert(message){
        $alertContainer.classList.add('show');
        $alertContainer.innerText=`${message}`;
        setTimeout(()=>{
            $alertContainer.classList.remove('show');
        },3000);
    }

    changeBtnColor(btn){
        $date.forEach(value=>{
            if(value.classList.contains('show')){
               value.classList.remove('show');
            }
        })
        btn.classList.add('show');
    }

    initTheme(){
        const currentTheme=localStorage.getItem('theme');
        if(currentTheme){
            document.documentElement.setAttribute('data-theme', currentTheme);
            if(currentTheme === 'dark'){
                $darkModeSwitch.checked=true;
            }
        }
    }

    changeTheme(e){
        if(e.target.checked){
            document.documentElement.setAttribute('data-theme','dark');
            localStorage.setItem('theme','dark');
        }
        else{
            document.documentElement.setAttribute('data-theme','light');
            localStorage.setItem('theme','light');
        }
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
    const arrLen=movieList.length;
    for(i=0;i<7;i++){ 
        let newDate=today_date+i;
        if(newDate>=DaysInMonth){
            newDate-=DaysInMonth;
        }
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],6,policy3));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],7.30,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],8,policy3));

        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],12,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],12,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],13,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],15,policy3));

        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],17,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],18,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],20,policy3));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],21,policy1));

        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],21.35,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],22,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],23,policy1));
        screeningList[i].push(new Screening(newDate,movieList[Math.floor(Math.random() * arrLen) ],24,policy3));
    }

}


const ui = new UI();
const init=function(){
    ui.initSelectedContainer();
}
const dateEvent=function(){
    $date.forEach(date=>{
        date.addEventListener('click',(e)=>{
            // 일 , 월 만 빼오기  
            
            const selectedDate=date.children[1].innerText;
            const selectedMonth=date.children[0].innerText;
            $screenTitle.innerText=`${selectedMonth} ${selectedDate}`;
            ui.showMovies(+selectedDate.replace('일',''));
            ui.changeBtnColor(date);
        })
    })
}

function movieSelectEvent(){
    $screenMovie.forEach(movie=>{
        movie.addEventListener('click',()=>{
            const index = movie.children[3].innerText.split(','); // hidden으로 숨겨온 인덱스 가져와서 인스턴스에 접근하기
            const firstIndex = +index[0];
            const secondIndex= +index[1];
            const date =+index[2];
            const screening=screeningList[firstIndex][secondIndex];
            const reservation = new Reservation(screening,screening.CalcMoney());
            const newItem=
            {
                reservation:reservation,
                date:date,
                qty:1,
                originMoney:+reservation.getMoney().getTotal(),
                discountMoney:+reservation.getMoney().getDiscount()
            }
            ui.addReservation(newItem);
            ui.updateFee();
            ui.showAlert('예매가 완료되었습니다.');
        })
    })
}

function reservationRemoveEvent(){
    $removeBtns.forEach(btn=>{
        btn.addEventListener('click',()=>{
            const target = +btn.parentNode.children[2].innerText; 
            // hidden 값으로 넘겨받은 해당 객체 index 
            store.filter(target);
            ui.removeReservation();
            ui.showAlert('예매가 취소되었습니다.');
        })
    })
}
init();

ui.initTheme();
dateEvent();

initScreening();

$darkModeSwitch.addEventListener('change',ui.changeTheme,false);