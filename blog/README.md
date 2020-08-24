# 무한 스크롤 블로그 프로젝트🤹🏻‍♀️

- 자바스크립트 OOP를 공부하기 위해 하루동안 만들어본 무한 스크롤 블로그 프로젝트
- jsonplaceholder를 이용하여 dummy posts를 api로 받아옴  

# <img src="demo/blog-demo.gif?raw=true">



## 구현한 기능

- [x] api 를 이용하여 post를 받아오고, 받아온 post의 내용을 수정 할 수 있다.
- [x] post 내용 수정 시, 모달 창을 띄우도록 하였다. 
- [x] 가져올 수 있는 post 갯수의 제한을 두어 무한 스크롤링을 구현하였다. 
- [x] 검색어 filter 기능을 이용하여 특정 단어를 포함한 post만 띄울 수 있도록 하였다.



## 클래스

- api 
  - 서버에 get 요청을 보낸 후 , 여러개의 post를 받아온다.
  - 변경된 값을 이용하여 서버에 put 요청을 보낸 후 , 변경된 post를 받아온다.
- UI
  -  post들을 화면에 보여준다.
  - 업데이트 된 post의 내용을 변경해준다.
  - loading UI를 화면에 띄워준다.
  - 필터 input에 대하여 input 이벤트 발생 시, post 컨테이너에서 해당 keyword를 title혹은 body에 가진 포스트(들)를 추출하여 보여준다.
  - 모달 창을 열어준다.
  - 모달 창을 닫아준다.
  - alert 창을 열고 3초 후에 닫아준다. 



### 그 외 함수

- getPost 
  - 최초 화면 로드 시, api 클래스의 get 메서드를 호출하여 post들을 가져오고, UI 클래스의 drawPost 메서드를 이용하여 해당 post들을 화면에 띄워주는 함수
- editEventListeners
  - edit button(여러개) 에 대한 이벤트 리스너를 실행해주는 함수
- loadPost
  - 스크롤 로딩 시 현재 페이지 넘버를 증가시켜주고, getPost를 호출하여 post를 가져와주는 함수
- formUpdateEventListener
  - 모달 창이 띄워진 상태에서 내부 form에 대하여 submit 이벤트를 처리해주는 함수 
- 그 외, scroll 이벤트 리스너, filter 이벤트 리스너, close 버튼 (모달창) 이벤트 리스너



