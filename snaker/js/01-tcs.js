var ctx = document.getElementById("MyCanvas").getContext("2d");

/*****食物类******/
//属性: 颜色，大小，位置, 状态
function Food(Op) {
  this.Fstatic = true;
  this.color = Op.color;
  this.width = Op.width;
  this.height = Op.height;
  //随机X位置
  this.X = Math.floor(Math.random() * ((500 - this.width) / this.width)) * this.width;

  this.Y = Math.floor(Math.random() * ((400 - this.height) / this.height)) * this.height;
}

//食物重生
Food.prototype.dir = function() {
  this.X = Math.floor(Math.random() * ((500 - this.width) / this.width)) * this.width;

  this.Y = Math.floor(Math.random() * ((400 - this.height) / this.height)) * this.height;
}

/******蛇类*******/
//属性:初始位置，颜色，蛇节大小 状态,方向;
//方法:移动，吃，死亡
function Snake(Op) {
  this.Sstatic = true;
  this.hColor = Op.hColor;
  this.bColor = Op.bColor;
  this.direction = "right" //默认右方向
  this.width = Op.width;
  this.height = Op.height;
  this.snakeList = [
    [3, 2, this.hColor, this.width, this.height],
    [2, 2, this.bColor, this.width, this.height],
    [1, 2, this.bColor, this.width, this.height]
  ]
}
//移动
Snake.prototype.move = function() {
  var s = this.snakeList;
  var X = s[0][0] * this.width;
  var Y = s[0][1] * this.height;
  for (var i = 1; i < s.length; i++) {
    if (s[0][0] === s[i][0] && s[0][1] === s[i][1]) {
      this.Sstatic = false;
      return;
    }
  }
  //判断有没有超出边界a
  if (X < 0 || Y < 0 || X > 480 || Y > 380) {
    this.Sstatic = false;
    console.log(X);
    return;
  }

  for (var i = s.length - 1; i > 0; i--) {
    s[i][0] = s[i - 1][0];
    s[i][1] = s[i - 1][1];
  }
  switch (this.direction) {
    case 'right':
      s[0][0]++;
      break;
    case 'left':
      s[0][0]--;
      break;
    case 'up':
      s[0][1]--;
      break;
    case 'down':
      s[0][1]++;
      break;
  }
}
//控制方向
Snake.prototype.direc = function(code) {
  switch (code) {
    case 37:
      if (this.direction === 'right') return;
      this.direction = 'left';
      break;
    case 38:
      if (this.direction === 'down') return;
      this.direction = 'up';
      break;
    case 39:
      if (this.direction === 'left') return;
      this.direction = 'right';
      break;
    case 40:
      if (this.direction === 'up') return;
      this.direction = 'down';
      break;
  }
}

//吃 --得分
Snake.prototype.eat = function() {
  var s = this.snakeList;
  var h = s.length - 1;
  if (s[0][0] * this.width === food.X && s[0][1] * this.height === food.Y) {
    food.Fstatic = false;
    s.push([s[h][0], s[h][1], this.bColor, this.width, this.height]);
  }
}

/******地图类*******/
//方法:绘制场景
function _Map(Op, snake, food) {
  var s = snake.snakeList;
  var w = Op.width; //画布宽
  var h = Op.height; //画布高

  this.show = function() {
    if (!snake.Sstatic) {
      clearInterval(time);
      alert("Game Over");
      return;
    }
    ctx.clearRect(0, 0, w, h); //每次执行清除画布
    //绘制食物
    if (food.Fstatic) {
      ctx.fillStyle = food.color;
      ctx.fillRect(food.X, food.Y, food.width, food.height);
    } else {
      food.dir();
      ctx.fillStyle = food.color;
      ctx.fillRect(food.X, food.Y, food.width, food.height);
      food.Fstatic = true;
    }
    //绘制蛇
    snake.move();
    snake.eat();
    for (var i = 0; i < s.length; i++) {
      ctx.fillStyle = s[i][2];
      ctx.fillRect(s[i][0] * s[i][3], s[i][1] * s[i][4], s[i][3], s[i][4]);
    }
  }
}

/***********************************************************/
//实例化方法：
var food = new Food({
  color: "red",
  width: 20,
  height: 20
});

var snake = new Snake({
  hColor: "#000",
  bColor: "#f0f",
  width: 20,
  height: 20
});

var _map = new _Map({
  width: 500,
  height: 400
}, snake, food)

var time = setInterval('_map.show()', 100);

document.onkeydown = function(e) {
  var code = e.keyCode;
  snake.direc(code);
}
