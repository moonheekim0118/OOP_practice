
window.onload=function(){
    // api class
    const $posts=document.getElementById('post__container');
    const $loader=document.querySelector('.loader');
    const $modalContainer= document.getElementById('modal__container');
    const $updatedTitle = document.getElementById('updated__title')
    const $updatedContents = document.getElementById('updated__contents');
    const $postId=document.getElementById('post__id');
    const $filter= document.getElementById('filter');
    const $closeBtn= document.getElementById('close__btn');
    const $updateForm= document.getElementById('update__form');
    const limit = 5;
    let page=1;

    function api() {};

    // 서버로부터 post 받아오기 
    api.prototype.get=async function(){
        const response = await fetch (`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
        const post = await response.json();
        return post;
    }

    // 포스트 정보 수정하기
    api.prototype.put=async function(){
        const id = +$postId.value;
        const title= $updatedTitle.value;
        const body= $updatedContents.value;
        const sendingData = 
        {
            id: id,
            title:title,
            body:body
        }
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method:'PUT',
            body: JSON.stringify(sendingData),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const updatedPost = await response.json();
        const update_info={
            post: updatedPost,
            id:id
        }
        return update_info;
    }
    
    // UI class

    const api__=new api();
    function UI(){};
    
    // 받아온 post 화면에 뿌려주기 
    UI.prototype.drawPost=function(postList){
        postList.forEach(post=>{
            const newPost = document.createElement('div');
            newPost.className='post';
            newPost.innerHTML=`
            <div class="number">${post.id}</div>
            <div class="edit" id="edit"><i class="fas fa-edit"></i></div>
            <div class="post__info">
                <h2 class="post__title">${post.title}</h2>
                <p class="post__body">
                ${post.body}
                </p>
            </div>
            `
        $posts.appendChild(newPost);
        })

    }

    // post 내용 변경해주기 
    UI.prototype.editPost= function(update_info){
        const id = update_info.id-1;
        const post = update_info.post;
        $posts.children[id].innerHTML=
        `
        <div class="number">${id+1}</div>
        <div class="edit" id="edit"><i class="fas fa-edit"></i></div>
        <div class="post__info">
            <h2 class="post__title">${post.title}</h2>
            <p class="post__body">
            ${post.body}
            </p>
        </div>
        `
    }

    // 로딩해주기 
    UI.prototype.loading = function(){
        $loader.classList.add('show');

        setTimeout(()=>{
            $loader.classList.remove('show');
            loadPost();
        },1000);
    }


    // keyWord를 가지고 있는 포스트만 보여주기 
    UI.prototype.filterPost=function(keyWord){
        const posts = document.querySelectorAll('.post');
        posts.forEach(post=>{
            const title = post.querySelector('.post__title').innerText.toUpperCase();
            const body= post.querySelector('.post__body').innerText.toUpperCase();
            if(title.indexOf(keyWord)==-1 || body.indexOf(keyWord)==-1){
                post.classList.add('hidden');
            }
            else{
                if(post.classList.contains('hidden')){
                    post.classList.remove('hidden');
                } 
            }
        })
    }

    // modal 띄우기 
    UI.prototype.showModal=function(e){
        const infoNode= e.target.parentNode.parentNode.children[2];
        const postId = e.target.parentNode.parentNode.children[0].innerText;
        const title = infoNode.children[0].innerText; // 기존의 타이틀과 바디 
        const body = infoNode.children[1].innerText;
        $updatedTitle.value=title;
        $updatedContents.value=body;
        $postId.value=postId;
        $modalContainer.classList.add('show');
    }

    // modal 닫기 
    UI.prototype.closeModal=function(){
        $modalContainer.classList.remove('show');
    }

    // alert 띄우주기
    UI.prototype.showAlert=function(message){
        const $alert = document.getElementById('alert__container');
        $alert.innerText=message;
        $alert.classList.add('show');
        setTimeout(()=>{
            $alert.classList.remove('show');
        },3000);
    }

    const UI__=new UI();
   async function getPosts(){
        const posts = await api__.get();
        UI__.drawPost(posts);
    }

    const eventListeners = function(){
        $posts.addEventListener('click',UI__.showModal);
        
        $updateForm.addEventListener('submit',async(e)=>{
            e.preventDefault();
            const update_info=await api__.put(); // 변경된 내용 받아오기
            UI__.editPost(update_info); // UI 변경 
            UI__.closeModal(); // 모달 닫기 
            UI__.showAlert('Updated Successfully😀');
        });
        
        window.addEventListener('scroll',()=>{
            const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
            
            if(scrollTop+clientHeight >= scrollHeight-5){
                UI__.loading();
            }
        })

        $filter.addEventListener('input',(e)=>{
            const keyWord = e.target.value.toUpperCase();
            UI__.filterPost(keyWord);
        });
    
        $closeBtn.addEventListener('click',UI__.closeModal);
    
    }

    function loadPost(){
        setTimeout(()=>{
            page++;
            getPosts();
        }, 300);
    }

    getPosts(); //init 
    eventListeners();
}