# 🎬인생영화 저장소 프로젝트

- 자바스크립트를 OOP를 공부하기 위해 하루동안 만들어본 인생영화 저장소 프로젝트  

# <img src="demo/demo.gif?raw=true">


## 클래스

- store  
  - local storage에 저장된 movieList 조회
  - local storage에 새로운 movieList 저장
  - local storage에 저장된 movieList 갱신 (삭제 , 추가 )
- movie
  - 영화 제목, 감독이름, 제작년도, 한줄평을 입력받아 새로운 객체 생성
- UI 
  - 생성된 movie 객체를 화면에 보여준다.
  - 삭제된 movie 객체를 화면에서 삭제한다.
  - validation에 대한 에러메시지나, 성공 메시지를 화면에 띄워준다.
  - modal 이벤트 리스너 헬퍼 함수의 도움을 받아, modal을 화면에 띄워준다.
  - 이전에 입력되었던 value를 비워준다.



### 그 외 함수

- 입력받은 영화 정보를 매개변수로 받아, validation을 수행하는 함수 
- vaildation으로 인해 띄워진 alert를 특정 시간 후에 화면에서 삭제하는 함수
- local storage에 저장된 내용이 하나도 없다면 영화 테이블의 목차를 삭제해주고, 하나라도 있다면 목차를 띄워주는 함수  
- 각각 영화 목록의 삭제 버튼에 대한 이벤트 리스너 / 모달 닫기 버튼에 대한 이벤트 리스너 / 폼에 대한 이벤트 리스너 



## 구현한 기능

- [x] 영화 정보 추가, 삭제, 조회
- [x] local storage를 이용하여 영화 정보를 저장하여 저장된 데이터 불러오고 화면에 띄울 수 있다.
- [x] local storage에 저장된 내용을 삭제하여 화면 정보를 변경할 수 있다.

