

const _canvas = document.querySelector('.drawCanvas');
const start=document.querySelector('.btnStart');
const gamer=document.querySelector('.gamer');
const blank=document.querySelector('.blank');
const table=document.querySelector('.table');
const listData=document.querySelector('.listData');

let record={};
let recordAry=[];


//該函數用來改變畫布大小
function resizeCanvas(){
    _canvas.setAttribute('width',window.innerWidth);
    _canvas.setAttribute('height',window.innerHeight);
};
//每當視窗改變時也要呼叫 resizeCanvas() 函數用來改變畫布的大小
window.onresize=resizeCanvas();
let ctx = _canvas.getContext('2d');
//每個圖形都要借於.beginPath()與.closePatch()之間
//畫布變數
let x = _canvas.width/2;
let y = _canvas.height-30;

//座標原點在左上方
let dx = 5;
let dy = -5; //負值的變動量代表球往上跑
//球的半徑
const ballRadius = 20;

//定義球板
const paddleHeight = 15;
const paddleWidth = 150;
//)畫布寬度-球板寬度)/2
let paddleX = (_canvas.width-paddleWidth)/2;
//用鍵盤控制球板
//初始化預設,默認是沒有被點擊的
let rightPressed = false;
let leftPressed = false;

//定義磚塊:每塊磚的寬度=100+20
let brickRowCount = 3;
let brickColumnCount = 12;
const brickWidth = 100;
const brickHeight = 30;
const brickPadding = 20;

//磚塊與畫面上方/左方的距離
const brickOffsetTop = 50;
const brickOffsetLeft = 250;
let bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        //每一個磚塊的x、y座標與狀態1是顯示 0是消失
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
};
let clearBrick=0;
//計算得分
let score = 0;

//每次的遊戲次數
let lifes = 3;



//監聽鍵盤行為
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//監聽滑鼠移動
document.addEventListener("mousemove", mouseMoveHandler, false);

//畫球
function drawBall(){
    ctx.beginPath();
    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#F1C40F";
    ctx.fill();
    ctx.closePath();
};
//畫磚塊
function drawBricks() {
    ////磚列（c），磚行（R）
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status === 1){
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                //取出磚塊座標的X值
                bricks[c][r].x = brickX;
                //取出磚塊座標的Y值
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#34DB97";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
};
//畫球板
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, _canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#3498DB";
    ctx.fill();
    ctx.closePath();
};
//鍵盤控制球板
function keyDownHandler(e) {
    //右邊方向鍵
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    //左邊方向鍵
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
//滑鼠控制球板
function mouseMoveHandler(e) {
    let relativeX = e.clientX - _canvas.offsetLeft;
    if(relativeX > 0 && relativeX < _canvas.width) {
        //確保球板中心點是跟著游標 位移的
        paddleX = relativeX - paddleWidth/2;
    }
}

//偵測磚塊被撞擊:
/* 球的 X 位置大於磚塊的 X 位置。(球撞到左邊的磚塊)
球的 X 位置小於磚塊的 X 位置加上它的宽度。(球撞到右邊的磚塊)
球的 Y 位置大於磚塊的 Y 位置
球的 Y 位置小於磚塊的 Y 位置加上它的高度。 */
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            const b = bricks[c][r];
            // calculations
            if(b.status===1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    b.status=0;
                    //球撞到磚塊即反彈
                    dy = -dy;
                    score += 100;
                    clearBrick++;
                    if(score === 100*brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    } else if(clearBrick===3){
                        dx++;
                        dy++;
                        clearBrick=0;
                    }
                }
            }

        }
    }
    
}
//顯示出得分
function drawScore() {
    ctx.font = "100px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Your Score: "+score, _canvas.width-1200, _canvas.height-300);
    ctx.textBaseline = 'hanging';
}
//每局遊戲剩下的次數
function drawLives() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lifes, _canvas.width-160, 50);
}

function storageGame(){
    const stringRecord=  JSON.stringify(recordAry);
    localStorage.setItem('GameRecord',stringRecord);
}

function listResult(){
    const getRecords=localStorage.getItem('GameRecord');
    const recordData=JSON.parse(getRecords);
    //console.log(recordData.length);
    function updatedList(){
      let items='';
      for (let i = 0; i < recordData.length; i++) {
        items +=`<tr class="text-center">
          <th scope="row" data-num="${i+1}">${i+1}</th>
          <td>${recordData[i].name}</td>
          <td>${recordData[i].score}</td>
        </tr>`
      };
      listData.innerHTML=items;
    };
    updatedList();
};
function checkLocalStorage(){
    if(window.localStorage.length!==0){
      listResult();
    } else{ //以下不會執行
        table.classList.add('none');
        blank.innerHTML=`<p>目前沒有任何遊戲紀錄</p>`;
    
    };
  };

//定義一個繪製用的迴圈
function draw() {
    //在每個影格開始前清除 canvas
    ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    // drawing code
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    //檢查球是否接觸(相撞)牆壁，如果有碰到，我們將改變球的行進方向
    //球碰到上方 or canvas.height畫布的高度=畫面的高度
    if(x + dx < 0 | x + dx > _canvas.width-ballRadius) {
        dx=-dx;
    };
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > _canvas.height-ballRadius) {
        //如果球击中画布的底部边缘，我们需要检查它是否碰到球拍
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lifes--;
            if(!lifes) {
                alert("GAME OVER");
                //localstorage儲存分數
                record.score=score;
                recordAry.push(record);
                storageGame();
                //console.log(recordAry);
                document.location.reload();
                listResult();
            }
            else {
                x = _canvas.width/2;
                y = _canvas.height-30;
                dx++;
                dx++;
                paddleX = (_canvas.width-paddleWidth)/2;
            }
        }
    };
    //球板移動
    if(rightPressed && paddleX < _canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x +=dx;
    y +=dy;
    requestAnimationFrame(draw);
};

function init(){
    checkLocalStorage();
    if (_canvas.getContext) { //判斷是否支援
        //宣告ctx渲染方式
        let ctx = _canvas.getContext('2d');
        start.addEventListener('click',startGame,false);
        function startGame(){
            //localstorage儲存遊戲者的暱稱
            record.name=gamer.value;
            console.log(record);
            let title=document.querySelector('.brickGame');
            title.classList.add('none');
            let canvas = document.querySelector('.drawCanvas');
            canvas.setAttribute('id','drawCanvas');
            canvas.style.display = 'block';
            //將主畫面隱藏,顯示出遊戲畫面
            resizeCanvas();
            draw();
        }

    }else {
        alert('瀏覽器不支援此遊戲')
        //如果不支援
    };
}
init();