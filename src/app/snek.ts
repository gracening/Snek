var app = angular.module("snek", []);

app.controller("SnekCtrl", ["$scope", "$timeout", "$log", function ($scope, $timeout, $log) {
    $log.debug("Initializing Controller");
    var BOARD_SIZE = 35;
    $scope.score = 0;

    var UP = 38;
    var RIGHT = 39;
    var DOWN = 40;
    var LEFT = 37;

    var game_over; 
    var dirInput;

    var snake = {
        dir: RIGHT,
        bod: [{x: -1, y: -1}]
    };

    //the thing the snake eats
    var dot = {
        x: -1, y: -1
    };

    function setUp() {
        $scope.board=[];
        for (var i = 0; i < BOARD_SIZE; i++) {
            $scope.board[i] = [];
            for (var j = 0; j < BOARD_SIZE; j++) {
                $scope.board[i][j] = false;
            }
        }
    }

    setUp();

    $scope.colour = function(col, row) {
        if (dot.x == row && dot.y == col) {
            return '#ff4d4d';
        }
        else if (snake.bod[0].x == row && snake.bod[0].y == col) {
            //blue snek
            return '#007399';
        }
        else if ($scope.board[col][row] === true) {
            return '#007399';
        }
        return '#e6e6e6';
    }

    function gameOver() {
        game_over = true; 
    }

    function createSnek() {
        for (var i = 0; i < 6; i++) {
            snake.bod.push({x:10+i, y:10});
        }
    }

    function createDot() {
        do {
            var x = Math.floor((Math.random())*BOARD_SIZE);
            var y = Math.floor((Math.random())*BOARD_SIZE);
        }
        while ($scope.board[x][y] === true);
        dot.x = x;
        dot.y = y;
    }

    $scope.key = function($event) {
        if ($event.keyCode == UP && snake.dir != DOWN) {
            dirInput = UP;
        }
        else if ($event.keyCode == RIGHT && snake.dir != LEFT) {
            dirInput = RIGHT;
        }
        else if ($event.keyCode == DOWN && snake.dir != UP) {
            dirInput = DOWN;
        }
        else if ($event.keyCode == LEFT && snake.dir != RIGHT) {
            dirInput = LEFT;
        }
    }

    function update() {
        var head = updateHead();

        if (hitBoard(head) || hitSelf(head)) {
            $log.debug("rip");
            alert("Game Over");
            return;
        }
        else if (hitDot(head)) {
            createDot();
            var tindex = snake.bod.length-1;
            var newTail = angular.copy(snake.bod[tindex]);
            snake.bod.push(newTail);
            $scope.score++;
        }

        var tail = snake.bod.pop();
        $scope.board[tail.y][tail.x] = false;
        
        snake.bod.unshift(head);
        $scope.board[head.y][head.x] = true;
        
        snake.dir = dirInput;
        //$log.debug("updated");
        $timeout(update, 100);
    }

    function updateHead() {
        var head = angular.copy(snake.bod[0]);

        //$log.debug(snake.bod[0]);
        if (dirInput === UP) {
            head.y -= 1;
        }
        else if (dirInput === DOWN) {
            head.y += 1;
        }
        else if (dirInput === LEFT) {
            head.x -= 1;
        }
        else if (dirInput === RIGHT) {
            head.x += 1;
        }
        return head;
    }

    //hits
    function hitBoard(head) {
        return head.x === BOARD_SIZE || head.y === BOARD_SIZE || head.x === -1 || head.y === -1;
    }

    function hitSelf(head) {
        return $scope.board[head.y][head.x] === true;
    }

    function hitDot(head) {
        return head.x === dot.x && head.y === dot.y;
    }

    $scope.start = function() {
        $log.debug("started game");
        game_over = false;
        setUp();
        snake = {
            dir: RIGHT, bod: []
        };

        createSnek();
        createDot();
        dirInput = RIGHT;

        update();
    };

}]);
