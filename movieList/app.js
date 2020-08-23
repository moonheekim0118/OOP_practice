

window.onload=function(){
        // movie constructor
    let removeBtn=document.querySelectorAll('#remove');
    let movieDetail=document.querySelectorAll('.movie');
    const modalContainer = document.getElementById('modal__container');
    const modal__title = document.getElementById('movie__title');
    const modal__year = document.getElementById('movie__year');
    const modal__director=document.getElementById('movie__director');
    const modal__comment = document.getElementById('movie__comment');
    const modal__close = document.getElementById('close');
    const form = document.getElementById('form');


    // store : 로컬 스토리지에 저장 및 불러내기
    function store(){}

    store.prototype.set= function(items){
        localStorage.setItem('movieList',JSON.stringify(items));
    }

    store.prototype.get=function(){
        return JSON.parse(localStorage.getItem('movieList'));
    }

    const store__=new store();

    // movie 
    function movie(title,director,year,comment){
        this.title=title;
        this.director=director;
        this.year=year;
        this.comment=comment;
    }

    movie.prototype.add = function(){
        // local stroage에 저장
        const newMovie = {
            title:this.title,
            director:this.director,
            year:this.year,
            comment:this.comment
        }
        let movieList =store__.get()||[];
        movieList.push(newMovie);
        store__.set(movieList);
        if(movieList.length===1){ 
            initalCheck(1);
        }
    }
    
    // UI 
    function UI(){}

    UI.prototype.fetch=function(){ // localStorage로부터 불러들여서 테이블에 쓰기
        const movieList= store__.get()||[];
        const table = document.getElementById('movie__container');
        if(movieList.length >0){
            movieList.forEach(movie=>{
                let tr = document.createElement('tr');
                tr.className='movie';
                tr.innerHTML=`
                    <td>${movie.title}</td>
                    <td>${movie.director}</td>
                    <td>${movie.year}</td>
                    <td>${movie.comment}</td>
                    <i class="fas fa-minus-circle" id="remove"></i>
                `;
                table.appendChild(tr);
            })
        }
        movieDetail=document.querySelectorAll('.movie');
        removeBtn=document.querySelectorAll('#remove'); //fetch 후 remove btn 갱신 
        initalCheck(movieList.length);
    
    }

    UI.prototype.add= function(movie){
        const table = document.getElementById('movie__container');
        let tr = document.createElement('tr');
        tr.className='movie';
        tr.innerHTML=`
            <td>${movie.title}</td>
            <td>${movie.director}</td>
            <td>${movie.year}</td>
            <td>${movie.comment}</td>
            <i class="fas fa-minus-circle" id="remove"></i>
        `;
        table.appendChild(tr);
        movieDetail=document.querySelectorAll('.movie');
        removeBtn=document.querySelectorAll('#remove'); //add 후 remove btn 갱신
        console.log(removeBtn);
    }

    UI.prototype.remove = function(target){ 
        const parentNode= target.parentNode;
        const text = parentNode.innerText;
        let movieInfo=text.split('\t');
        const title = movieInfo[0];
        const director = movieInfo[1];
        const year = movieInfo[2];
        const comment= movieInfo[3];
        const movieList = store__.get();
        const updateMovieList = movieList.filter(movie=>{
            return movie.title != title || movie.director!=director || movie.year!=year || movie.comment!=comment;
        })
        store__.set(updateMovieList);
        movieDetail=document.querySelectorAll('.movie');
        removeBtn=document.querySelectorAll('#remove');
        initalCheck(updateMovieList.length);
        target.parentNode.innerHTML='';
    }

    UI.prototype.modal = function(target){
        const parentNode= target.parentNode;
        if(parentNode===null) return false;
        const text = parentNode.innerText;
        let movieInfo=text.split('\t');
        modal__title.innerText=movieInfo[0];
        modal__director.innerText=movieInfo[1];
        modal__year.innerText=movieInfo[2];
        modal__comment.innerText=movieInfo[3];
        modalContainer.classList.add('show');
    }

    UI.prototype.showAlert= function(alertMessage){
        const alert = document.getElementById('alert__container');
        alert.classList.add('show');
        alert.innerText=alertMessage;
        setTimeout(()=>showOffAlert(),3000);
        
    }

    UI.prototype.clearFields = function(){
        document.getElementById('title').value = '';
        document.getElementById('director').value='';
        document.getElementById('year').value='';
        document.getElementById('comment').value='';
    }


   const showOffAlert=function(){
        const alert = document.getElementById('alert__container');
        alert.classList.remove('show');
        alert.innerText='';
    }

    const validator = function(movie){ 
        if(movie.title.length === 0){
            return '제목을 입력해주세요'
        }
        if(movie.director.length === 0){
            return '감독 이름을 입력해주세요'
        }
        if(movie.year.length <4){
            return '제작년도를 올바르게 입력해주세요.'
        }
        if(movie.comment.length < 5 || movie.comment.length > 20){
            return '한줄평은 최소 5자, 최대 20자까지 가능합니다'
        }
        return true;
        
    }


    const UI__ = new UI();
    const initalCheck = function(len){
        const movie__container= document.getElementById('movie__container');
        if(len > 0){ // 요소 추가시에도 
            movie__container.classList.add('show');
        }
        else { // 요소 삭제시에도 
            movie__container.classList.remove('show'); 
        }
    }
    UI__.fetch(); // 이전 local Storage로부터 데이터 가져와서 화면에 뿌리기 

    const removeEvents = function(){ // remove 버튼 events 
        if(removeBtn.length >0){
            removeBtn.forEach(btn=>{
                btn.addEventListener('click',(e)=>{
                    UI__.remove(e.target);
                })
             })
         }
    }

    const modalEvents = function(){
        if(movieDetail.length > 0){
            movieDetail.forEach(movie=>{
                movie.addEventListener('click',(e)=>{
                    UI__.modal(e.target);
                })
            })
        }
    }

    modal__close.addEventListener('click',()=>{
        modalContainer.classList.remove('show');
    })
    removeEvents();
    modalEvents();

    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const director = document.getElementById('director').value.trim();
        const year = document.getElementById('year').value.trim();
        const comment = document.getElementById('comment').value.trim();
        const vaildationResult = validator(
            {
                title:title,
                director:director,
                year:year,
                comment:comment
            }
        );

        if(vaildationResult!==true){
            UI__.showAlert(vaildationResult);
        }
        else{
            const movie__ = new movie(title,director,year,comment); 
            movie__.add();
            UI__.add(movie__);
            UI__.clearFields();
            removeEvents();
            modalEvents();
            UI__.showAlert('영화가 추가되었습니다');
        }
    })

}