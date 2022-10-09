
// 1. 캔버스 셋팅 
let canvas;
let ctx; // 이미지 그리는 걸 도와줄 변수
canvas = document.createElement("canvas") // 캔버스 요소를 만든다
ctx = canvas.getContext("2d")             // 2d의 세계를 넣을거야, 그려주는 역할 
canvas.width = 400;                       // 캔버스 가로
canvas.height = 700;                      // 캔버스 세로
document.body.appendChild(canvas);       // HTML body에 넣기

// 2. 이미지 불러오는 함수 만들기
let backgroundImage, spaeShiptImage, bulletImage, enemyImage, gameoverImage;

// 9. 게임 오버 변수
let gameOver = false // true 이면 게임 끝, false는 게임 끝남 
// 10. 점수
let score=0;

// 우주선 좌표 -> 계속 바뀔 예정이므로 따로 선언
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64; //우주선이 64px이므로 계산해보기..

// 7-2. 총알 함수 만들기(클래스 대체) 
let bulletList =[] // 총알들 저장하는 리스트
function Bullet(){
    this.x = 0; 
    this.y = 0;
    this.init = function(){
        this.x =spaceshipX+20; // 왼쪽으로 지우친 총알을 가운데로 맞추기 위해 +20
        this.y = spaceshipY;
        this.alive = true // true 살아있는 총알, false 사용한 총알 

        bulletList.push(this);
    };
    this.update = function(){
        this.y -= 10 ;
    };

    this.checkHit = function(){
       for(let i=0; i<enemyList.length; i++){
        if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x+40){
                // 총알이 죽게됨. 적군의 우주선이 없어짐, 점수 획득
                score++;
                this.alive = false // 죽은 총알. 
                enemyList.splice(i,1);

            }
       }
        
    }
}// end of Bullet


// 8. 적군 함수 만들기(클래스 대체)
let enemyList=[] // 적군을 저장하는 리스트
function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min // 내용 찾아보기
    return randomNum;
}

function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0; // 제일 상단에서 오니까
        this.x = generateRandomValue(0,canvas.width-50) // 랜덤하게 위치 지정되므로 함수이용
        enemyList.push(this);
    };    
    this.update = function(){
        this.y += 4; // 적군의 속도 조절

        // 9-1. y 좌표 통해서 적군이 바닥에 닿을 때 gameOver true로 만듦
        if(this.y >= canvas.height-50){
            gameOver = true; 
        }
    }
}


function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/background.jpg";
    
    spaeShiptImage = new Image();
    spaeShiptImage.src="images/spaceship2.png";
    
    bulletImage = new Image();
    bulletImage.src="images/bullet.png";
    
    enemyImage = new Image();
    enemyImage.src="images/enemy.png";
    
    gameoverImage = new Image();
    gameoverImage.src="images/gameover.png";
}

// 5. 방향키 이벤트 만들기  

let keysDown={}; 
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        keysDown[event.keyCode] = true //클릭한 키 저장 
       // console.log("키다운객체에 들어간 값?", keysDown)
    });
    document.addEventListener("keyup", function(){
        delete keysDown[event.keyCode]
        //console.log("버튼클릭후",keysDown)

        //7. 총알 발사 이벤트 (스페이스 한번 -> 총알 한발)
        if(event.keyCode == 32){
            createBullet() // 총알생성
        }

    }); 
}

// 7-1. 총알 만들기
function createBullet(){
    console.log("총알생성")
    let b = new Bullet(); // 총알 하나 생성 
    b.init();
    console.log("새로운 총알 리스트", bulletList)
}

//8-2. 적군 만들기 
// setInterval(호출하고 싶은 함수, 시간)
function createEnemy(){ 
    const interval = setInterval(function(){
        let e = new Enemy(); // 적군 하나 생성 
        e.init();    
    },1000); // 원하는 시간마다 함수 호출, 1000밀리 세컨 = 1초
};




// 6. 우주선 움직이기(우주선의 xy 좌표가 바뀜)
 function update(){

    if(39 in keysDown) {
        spaceshipX += 7; // 우주선 속도
    } // right : x 좌표의 값이 증가한다

    if(37 in keysDown){
        spaceshipX -= 7; //우주선 속도
    } // left : x 좌표의 값이 감소한다.

    //6-1. 우주선의 좌표값이 경기장 안에서만 있게 하려면? 

    //왼쪽은 0보다 작아지면 0으로 다시 만들기
    if(spaceshipX <=0){
        spaceshipX = 0;
    }
    // 오른쪽은 canvas width 좌표보다 커지면 canvas width로 돌려놓기
    // 가로 64px이므로 width -64해서 더 나가지 않도록 만들기
    if(spaceshipX>=canvas.width-64){
        spaceshipX = canvas.width-64;
    }

    // 7.3 총알의 y좌표 업데이트하는 함수 호출
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
        bulletList[i].update(); //main 함수(무한반복)에 있으므로 계속 나아감!
        bulletList[i].checkHit(); // 총알 사용 여부 체크
    }
}

    //8-3. 적군의 y좌표 업데이트 하는 함수 호출
    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update(); //main 함수 (무한반복)에 있으므로 계속 내려옴
    } 
}



// 3. 이미지를 보여주는 함수 만들기
//render : ui를 그려줌
// drawImage(image, dx, dy, dWidth, dHeight)... 함수 봐놓기

function render(){
    //배경
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);         
    // 우주선
    ctx.drawImage(spaeShiptImage, spaceshipX, spaceshipY);
    // 점수
    ctx.fillText(`score:${score}`, 20, 20);
    ctx.fillStyle="white";
    ctx.font="20px Arial";

    // 총알
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
}
    // 적군 
    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
        
    }


}    

 // 이미지를 무한 호출하는 역할. 윌레스와 그로밋처럼.. 한컷한컷 반복해야 보임.
function main(){
    // 9-2. gameOver이 false 일때만 돌아가게끔
    if(!gameOver){
        update(); //좌표값을 업데이트 하고
        render();  // 그려주고!
        requestAnimationFrame(main) // main을 계속 부르면서 무한반복    
    }else{
        ctx.drawImage(gameoverImage, 55,230,280,280);
    }
    
// console.log("animation calls main function!!") -> console보면 무한 반복되고 있음
   
}

 //4. 함수 불러주기 
 loadImage(); 
 setupKeyboardListener();
 createEnemy(); // 시작하자마자 적군 내려오므로! 
 main();




 //=================================================================
/* 우주선 움직이기
    1) 방향키를 누르면
    2) 우주선의 xy 좌표가 바뀌고
    3) 다시 render를 그려준다 
*/




 /* 총알 만들기 
  1) 스페이스 누르면 -> 발사  (이벤트)
  2) 총알 발사 할때  위로 나아감 = y 값은 줄어듦,  
     x 값은 스페이스를 누른 순간 우주선의 x 좌표 
  3) 발사된 총알은 총알 배열에 저장 
  4) 총알들은 x,y 좌표값이 있어야한다.
  5) 총알은 O배열을 가지고 render 그려준다.
 */


 /* 적군 만들기
    1) 적군은 위치가 랜덤하다
    2) 적군은 밑으로 내려온다 = y값 늘어남
    3) 적군은 1초마다 새로 등장한다 
    4) 적군이 바닥에 닿으면 Game Over
    5) 적군과 총알이 만나면 적군이 사라진다 + 점수 1점 획득*/

/* 적군이 죽는다
    1) 총알이 적군에 닿는다 
   =  총알.y < 적군.y (위로 간다 = y값 줄어듦) 
     And 총알.x >= 적군.x 
     And 총알.x <= 적군.x + 적군의 넓이
     => 닿았다
     => 적군의 우주선이 없어짐, 점수 획득
     */    