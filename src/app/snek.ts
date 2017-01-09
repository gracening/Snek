var app = angular.module("snek", []);

app.controller("SnekCtrl", ["$scope", "$timeout", "$log", function ($scope, $timeout, $log) {
    $log.debug("Initializing Controller");
    var BOARD_SIZE = 20;

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

    $scope.colour = function(col, row) {
        if (game_over) {
            //do something
        }
        else if (dot.x == row && dot.y == col) {
            //let's make it black for now
            return '#FFFFFF';
        }
        else if (snake.bod[0].x == row && snake.bod[0].y == col) {
            //blue snek
            return '#007399';
        }
        else if ($scope.board[row][col]) {
            return '#007399';
        }
        return '#e6e6e6';
    }

    function gameOver() {
        game_over = true; 
    }

    $scope.start = function() {
        $log.debug("started game");
        game_over = false;

        $log.debug("set up board");
        setUp();

        createSnek();
        $log.debug("created snek");
        dirInput = RIGHT;

        //$log.debug($scope.board[1][2] === false);
        update();
    };

    function createSnek() {
        for (var i = 0; i < 4; i++) {
            snake.bod.push({x:10+i, y:10});
        }
    }

    $scope.key = function($event) {
        console.log($event.keyCode);
        if ($event.keyCode == UP) {
            dirInput = UP;
        }
        else if ($event.keyCode == RIGHT) {
            dirInput = RIGHT;
        }
        else if ($event.keyCode == DOWN) {
            dirInput = DOWN;
        }
        else if ($event.keyCode == LEFT) {
            dirInput = LEFT;
        }
    }

    function update() {
        var head = updateHead();

        if (hitSelf(head) || hitBoard(head)) {
            //game over
        }

        var tail = snake.bod.pop();
        $scope.board[tail.y][tail.x] = false;
        
        snake.bod.unshift(head);
        snake.bod[head.y][head.x] = true;
        
        snake.dir = dirInput;
        $timeout(update, 500);
    }

    function updateHead() {
        var head = angular.copy(snake.bod[0]);

        $log.debug(snake.bod[0]);
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
        //$log.debug($scope.board[head.y][head.x]);
        return $scope.board[head.y][head.x] === true;
    }

}]);
