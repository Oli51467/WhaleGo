"use strict";

const BLACK_STONE = 1;
const WHITE_STONE = 2;

// 玩家类
export class Player {
    constructor(identifier) {
        this.identifier = identifier;
    }

    // identifier=1:黑方 identifier=2:白方
    getIdentifier() {
        return this.identifier;
    }
}

// 棋盘上的交叉点
export class Point {
    // 根据不同的参数构造函数
    constructor(args) {
        if (args['color']) {
            this.color = args['color'];
            this.x = args['x'];
            this.y = args['y'];
            this.step = args['step'];
        } else if (args['board']) {
            this.board = args['board'];
            this.x = args['x'];
            this.y = args['y'];
            this.group = null;
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getGroup() {
        return this.group;
    }

    getColor() {
        return this.color;
    }

    getStep() {
        return this.step;
    }

    setColor(color) {
        this.color = color;
    }

    setGroup(group) {
        this.group = group;
    }

    isEmpty() {
        return this.group === null;
    }

    // 取得一个棋子周围相邻气的所有组
    getAdjacentGroups() {
        let adjacentGroups = new Set();
        // 遍历周围四个棋盘格
        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i++) {
            let newX = this.x + dx[i];
            let newY = this.y + dy[i];
            if (this.board.indexIsInBoard(newX, newY)) {
                // 取得相邻的point
                let adjPoint = this.board.getPoint(newX, newY);
                // 如果这个点上有棋子 则加入
                if (adjPoint.group != null) {
                    adjacentGroups.add(adjPoint.group);
                }
            }
        }
        return adjacentGroups;
    }

    // 拿到相邻棋子周围空的组（气）
    getEmptyNeighbors() {
        let emptyNeighbors = new Array();
        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i++) {
            let newX = this.x + dx[i];
            let newY = this.y + dy[i];
            if (this.board.indexIsInBoard(newX, newY)) {
                // 取得相邻的point
                let adjPoint = this.board.getPoint(newX, newY);
                // 如果这个点上没有棋子，则是一口气，则加入
                if (adjPoint.isEmpty()) {
                    emptyNeighbors.push(adjPoint);
                }
            }
        }
        return emptyNeighbors;
    }
}

// 组(龙) 连在一起的棋子集合
export class Group {
    // 三种初始化方法
    constructor(args) {
        if (args['stones']) {
            this.stones = args['stones'];
            this.liberties = args['liberties'];
            this.owner = args['owner'];
        } else if (args['point']) {
            this.stones = new Set();
            this.stones.add(args['point']);
            this.owner = args['owner'];
            this.liberties = new Set();
            this.liberties = set_update(this.liberties, args['point'].getEmptyNeighbors());
        } else if (args['group']) {
            this.stones = new Set();
            this.stones = set_update(this.stones, args['group'].stones);
            this.liberties = new Set();
            this.liberties = set_update(this.liberties, args['group'].liberties);
            this.owner = args['group'].owner;
        }
    }

    getOwner() {
        return this.owner;
    }

    getLiberties() {
        return this.liberties;
    }

    getStones() {
        return this.stones;
    }

    // 将一颗棋子添加到该组中
    add(group, playedStone) {
        // 修改该组中的棋子集合、气集合，最后将该组里放置棋子的气移除
        this.stones = set_update(this.stones, group.stones);
        this.liberties = set_update(this.liberties, group.liberties);
        this.liberties.delete(playedStone);
    }

    // 移除一口气
    removeLiberty(playedStone) {
        let newGroup = new Group({ "stones": this.stones, "liberties": this.liberties, "owner": this.owner });
        newGroup.liberties.delete(playedStone);
    }

    // 一个组(或一颗棋子)死亡
    die() {
        for (let rollingStone of this.stones) {
            // 将该组中所有棋子的位置的组置空
            rollingStone.setGroup(null);
            let adjacentGroups = rollingStone.getAdjacentGroups();
            // 将死亡棋子的相邻棋子(若有)的气增加一口
            for (let group of adjacentGroups) {
                group.liberties.add(rollingStone);
            }
        }
    }
}

// 一个回合
export class GameTurn {
    constructor(args) {
        if (args['playerId'] === undefined) {
            this.boardState = [];
            for (let i = 1; i <= 20; i ++ ) {
                this.boardState[i] = [];
                for (let j = 1; j <= 20; j ++ ) {
                    this.boardState[i][j] = 0;
                }
            }
            //this.boardState = new Array(args['width'] + 1).fill(0).map(v=>new Array(args['height'] + 1).fill(0));
            this.x = -1;
            this.y = -1;
            // 计算二维数组的hash
            this.hashCode = getDeepHashCode(this.boardState);
        } else {
            let width = args['prev'].boardState.length;
            //let height = args['prev'].boardState[0].length;
            this.boardState = [];
            for (let i = 1; i <= 20; i ++ ) {
                this.boardState[i] = [];
                for (let j = 1; j <= 20; j ++ ) {
                    this.boardState[i][j] = 0;
                }
            }
            //this.boardState = new Array(width + 1).fill(0).map(new Array(height + 1).fill(0));
            for (let i = 1; i < width; i++) {
                this.boardState[i] = clone(args['prev'].boardState[i]);
            }
            this.x = args['x'];
            this.y = args['y'];
            if (args['x'] > 0 && args['y'] > 0) {
                this.boardState[args['x']][args['y']] = args['playerId'];
            }
            for (let point of args['freedPoint']) {
                this.boardState[point.getX()][point.getY()] = 0;
            }
            this.hashCode = getDeepHashCode(this.boardState);
        }
    }

    // 生成下一轮棋局
    toNext(x, y, playerId, freedPoint) {
        return new GameTurn({ "prev": this, "x": x, "y": y, "playerId": playerId, "freedPoint": freedPoint });
    }

    getBoardState() {
        return this.boardState;
    }

    getHashCode() {
        return this.hashCode;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    // 判断两个回合是否相同。必须两个回合的hash值相同，且每个位置指向的内存和值都要相同
    equals(obj) {
        if (this === obj) return true;
        if (obj === null || typeof (this) != typeof (obj)) return false;
        return this.hashCode === obj.hashCode && deep_equals(this.boardState, obj.boardState);
    }
}

// 记录棋局 将每个GameTurn压栈保存
export class GameRecord {
    constructor(width, height) {
        this.preceding = new Stack();
        this.following = new Stack();
        let first = new GameTurn({ "width": width, "height": height });
        this.apply(first);
    }

    apply(turn) {
        this.preceding.push(turn);
        this.following.clear();
    }

    hasPreceding() {
        return this.preceding.size() > 1;
    }

    nbrPreceding() {
        return this.preceding.size() - 1;
    }

    hasFollowing() {
        return this.following.size() > 0;
    }

    // 悔棋
    undo() {
        if (this.preceding.size() > 1) {
            this.following.push(this.preceding.pop());
        }
    }

    // 在悔棋后重进(往后走悔棋的那一步)
    redo() {
        if (this.following.isEmpty()) return;
        this.preceding.push(this.following.pop());
    }

    getTurns() {
        return this.preceding;
    }

    getLastTurn() {
        if (!this.preceding.isEmpty()) {
            return this.preceding.peek();
        }
        else return new GameTurn({ "width": 20, "height": 20 });
    }

    getSize() {
        return this.preceding.size();
    }
}

// 自定义栈
export class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    get(i) {
        return this.items[i];
    }

    clear() {
        this.items = [];
    }

    // 增加 Symbol.iterator 方法 转为一个可迭代对象
    [Symbol.iterator]() {
        let values = Object.values(this)
        let index = 0
        let iterator = {
            next() {
                if (index < values.length) {
                    return { done: false, value: values[index++] }
                } else {
                    return { done: true, value: undefined }
                }
            }
        }
        return iterator
    }
}

// 棋盘类
export class Board {
    constructor(width, height, handicap) {
        this.width = width;
        this.height = height;
        this.initialHandicap = handicap;
        this.points = [];
            for (let i = 1; i <= 20; i ++ ) {
                this.points[i] = [];
                for (let j = 1; j <= 20; j ++ ) {
                    this.points[i][j] = new Point({});
                }
            }
        //this.points = new Array(width + 1).fill(new Point({})).map(new Array(height + 1).fill(new Point({})));
        this.gameRecord = new GameRecord(width, height);
        this.recordPoints = new Array();
        this.initBoard();
    }

    // 初始化棋盘 将每个Point初始化
    initBoard() {
        this.P1 = new Player(1);
        this.P2 = new Player(2);
        this.actualPlayer = this.P1;
        for (let x = 1; x <= this.width; x++) {
            for (let y = 1; y <= this.height; y++) {
                this.points[x][y] = new Point({ "board": this, "x": x, "y": y });
            }
        }
        this.handicap = 0;
    }

    // 判断一个坐标是否在棋盘内
    indexIsInBoard(x, y) {
        return x > 0 && x < this.width && y > 0 && y < this.height;
    }

    // 判断一个Point对象是否在棋盘内
    pointIsInBoard(point) {
        let x = point.getX();
        let y = point.getY();
        return this.indexIsInBoard(x, y);
    }

    // 从棋盘上取得一个点
    getPoint(x, y) {
        if (this.indexIsInBoard(x, y)) {
            return this.points[x][y];
        } else {
            return null;
        }
    }

    // 走棋前的判断
    play(x, y, player) {
        let point = this.getPoint(x, y);
        if (point === null) {
            console.log("error", "落子超出棋盘范围了 请重新落子！");
            return false;
        }
        return this.play_in_board(point, player, true);
    }

    // 走棋的深度判断 handleKo为是否判断打劫 如果落子有效则记录，落子无效则报错且不记录
    play_in_board(point, player, handleKo) {
        let currentTurn = null;
        let ko = false;

        if (!this.pointIsInBoard(point)) return false;  // 落子不在棋盘内 直接返回False
        if (point.getGroup() != null) return false; // 如果该位置已经有棋子 直接返回False

        this.capturedStones = null;
        let capturedGroups = null;
        if (handleKo) {
            this.capturedStones = new Set();
            capturedGroups = new Set();
        }

        let adjGroups = point.getAdjacentGroups();  // 获得这个棋子周围相邻的组
        let newGroup = new Group({ "point": point, "owner": player });
        point.setGroup(newGroup);
        // 将该棋子周围同类的组 进行连接
        for (let group of adjGroups) {
            if (group.getOwner() === player) {
                newGroup.add(group, point);
            } else {
                // 如果该棋子周围是异类 则移出它的一口气
                group.removeLiberty(point);
                // 如果所有气都被移出 则被吃掉
                if (group.liberties.size === 0) {
                    if (handleKo) {
                        this.capturedStones = set_update(this.capturedStones, group.getStones());
                        capturedGroups.add(new Group({ "group": group }));
                    }
                    // 这个子连同它的组都死掉
                    group.die();
                }
            }
        }
        // 打劫逻辑
        if (handleKo) {
            currentTurn = this.gameRecord.getLastTurn().toNext(point.getX(), point.getY(), player.getIdentifier(), this.capturedStones);
            for (let i = 0; i < this.gameRecord.getTurns().size(); i++) {
                let turn = this.gameRecord.getTurns().get(i);
                if (turn.equals(currentTurn)) {
                    ko = true;
                    break;
                }
            }
            if (ko) {
                for (let chain of capturedGroups) {
                    for (let stone of chain.getStones()) {
                        stone.setGroup(chain);
                    }
                }
            }
        }

        // 不能自杀 或者对手提劫后不能再提劫 三劫循环或多劫循环的特殊情况除外
        if (newGroup.liberties.size === 0 || ko) {
            for (let chain of point.getAdjacentGroups()) {
                chain.getLiberties().add(point);
            }
            point.setGroup(null);
            return false;
        }
        // 落子有效
        for (let stone of newGroup.getStones()) {
            stone.setGroup(newGroup);
        }

        if (handleKo) {
            this.gameRecord.apply(currentTurn);
        }
        this.recordPoints.push(point);
        return true;
    }

    // 获取现在棋盘上将要进行落子的player
    getPlayer() {
        return this.actualPlayer;
    }

    // 允许下一个玩家落子，落子、redo时使用
    nextPlayer() {
        this.changePlayer(false);
    }

    // 允许前一个玩家落子，undo时使用
    precedentPlayer() {
        this.changePlayer(true);
    }

    // 改变落子者
    changePlayer(undo) {
        if (this.handicap < this.initialHandicap && !undo) {
            this.handicap++;
        } else if (undo && this.gameRecord.nbrPreceding() < this.initialHandicap) {
            this.handicap--;
        } else {
            if (this.actualPlayer == this.P1) {
                this.actualPlayer = this.P2;
                console.log("info->", "Changing player for P2");
            } else {
                this.actualPlayer = this.P1;
                console.log("info->", "Changing player for P1");
            }
        }
    }

    // 悔棋
    undo() {
        if (this.gameRecord.hasPreceding()) {
            this.gameRecord.undo();
            let last = this.gameRecord.getLastTurn();
            this.takeGameTurn(last, this.P1, this.P2);
            this.precedentPlayer();
            return true;
        } else {
            return false;
        }
    }

    redo() {
        if (this.gameRecord.hasFollowing()) {
            this.gameRecord.redo();
            let next = this.gameRecord.getLastTurn();
            this.takeGameTurn(next, this.P1, this.P2);
            this.nextPlayer();
        }
    }

    // 进行一个游戏回合，并使用游戏回合中存储的信息填充棋盘。
    takeGameTurn(gameTurn, one, two) {
        this.freeIntersections();
        let boardState = gameTurn.getBoardState();
        for (let x = 1; x <= this.width; x++) {
            for (let y = 1; y <= this.height; y++) {
                let state = boardState[x][y];
                if (state === BLACK_STONE) {
                    this.play(this.getPoint(x, y), one, false);
                } else if (state === WHITE_STONE) {
                    this.play(this.getPoint(x, y), two, false);
                }
            }
        }
    }

    // 移除棋盘上的所有棋子
    freeIntersections() {
        for (let i = 1; i < this.width; i++) {
            for (let j = 1; j < this.height; j++) {
                let point = this.getPoint(i, j);
                point.setGroup(null);
            }
        }
    }

    toString() {
        let board = "";
        for (let i = 1; i < this.width; i++) {
            for (let j = 1; j < this.height; j++) {
                let cross = this.points[i][j];
                if (cross.getGroup() === null) {
                    board += '· ';
                } else {
                    board += cross.getGroup().getOwner().getIdentifier() === 1 ? '1' : '2' + " ";
                }
            }
            board += "\n";
        }
        return board;
    }
}

// 将一个棋盘坐标(如D4)转化为行列坐标(如16 4)
// let transform_indexes = function (index) {
//     let alpha = index[0];
//     let number = index.substring(1);
//     let cnt = 1;
//     for (var i = 0; i < 26; i++) {
//         let c_ = String.fromCharCode((65 + i));
//         if (c_ === 'I') {
//             continue;
//         }
//         if (c_ === alpha) {
//             break;
//         }
//         cnt += 1;
//     }
//     return { "x": 20 - parseInt(number), "y": cnt };
// }

// // 将行列坐标(如16 4)转化为棋盘坐标(D 4)
// let get_index = function (x, y) {
//     let cnt_ = 1;
//     let position = "";
//     for (let c = 0; c < 26; c++) {
//         let c_ = String.fromCharCode((65 + c));
//         if (c === 'I') continue;
//         if (cnt_ === y) {
//             position += c_;
//             break;
//         }
//         cnt_ += 1;
//     }
//     position += (20 - x).toString();
//     return position;
// }

// 复制一个对象
let clone = function (obj) {
    var o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0; i <= 19; i++) {
                    o.push(clone(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    o[j] = clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}

// 计算二维数组的hash
let getDeepHashCode = function (obj) {
    if (obj === null) {
        return 0;
    }
    let result = 1;
    for (let i = 1; i <= 19; i++) {
        let element_hash = get_hash(obj[i]);
        result = 31 * result + element_hash;
    }
    return result;
}

// 计算一维数组的hash
let get_hash = function (o) {
    if (o === null) {
        return 0;
    }
    let result = 1;
    for (let i = 1; i <= 19; i++) {
        result = 31 * result + o[i];
    }
    return result;
}

// 判断二维数组是否深度相等
let deep_equals = function (a, b) {
    if (a === b) {
        return true;
    }
    if (a === null || b === null) {
        return false;
    }
    for (let i = 1; i <= 19; i++) {
        let e1 = a[i];
        let e2 = b[i];
        if (e1 === e2) {
            continue;
        }
        if (e1 === null) {
            return false;
        }
        let eq = deep_equals0(e1, e2);
        if (!eq) {
            return false;
        }
    }
    return true;
}

// 判断一维数组是否深度相等
let deep_equals0 = function (e1, e2) {
    if (e1 === e2) {
        return true;
    }
    if (e1 === null || e2 === null) {
        return false;
    }
    for (let i = 1; i <= 19; i++) {
        if (e1[i] != e2[i]) {
            return false;
        }
    }
    return true;
}

// 将一个集合的元素全部添加到另一个集合，若被添加的集合中已经存在该元素，则不添加
let set_update = function (set_a, set_b) {
    for (let new_element of set_b) {
        if (!set_a.has(new_element)) {
            set_a.add(new_element);
        }
    }
    return set_a;
}


// let main = function () {
//     let board_play = new Board(19, 19, 0);
//     // 模拟了一些落子位置
//     let moves = ["D4", "D3", "C3", "C4", "E3", "E4", "D2", "D5", "E5", "D3", "D4"];
//     for (let move of moves) {
//         // 将这些落子位置转化成行列坐标
//         let index_x = transform_indexes(move).x;
//         let index_y = transform_indexes(move).y;
//         let player = board_play.getPlayer();    // 获取当前走棋的玩家
//         if (board_play.play(index_x, index_y, player) === true) {   // 若能正常落子
//             console.log("info", "正常落子");
//             board_play.nextPlayer();    // 下一位玩家落子
//             let last_turn = board_play.gameRecord.getLastTurn();    // 上一步走棋的回合记录
//             let last_board = last_turn.boardState;                  // 上一步走的棋盘状态
//             let last_move = board_play.getPoint(last_turn.getX(), last_turn.getY()); // 上一步
//             let captured_stones = board_play.capturedStones;    // 被吃的子的Set
//             let result = new Array();
//             for (let stones of captured_stones) {
//                 // 将被吃子转化为棋盘坐标显示
//                 result.push(get_index(stones.getX(), stones.getY()));
//             }
//             console.log("hashcode:", last_turn.hashCode);
//             console.log("吃子:", result);
//             console.log("lastBoard", last_board);
//             console.log("上一步:", last_move);
//         }
//         else {
//             console.log("这里不可以落子");
//         }
//     }
// 