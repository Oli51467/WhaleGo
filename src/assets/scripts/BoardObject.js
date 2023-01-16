"use strict";

const BLACK = 1;
const WHITE = 2;
const EMPTY = 0;
let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];

export class Board {
    constructor(width, height, handicap) {
        this.width = width;
        this.height = height;
        this.board = [];
        this.st = [];
        this.blackForbidden = new Point(-1, -1);
        this.whiteForbidden = new Point(-1, -1);
        for (let x = 1; x <= this.width; x ++ ) {
            this.board[x] = [];
            this.st[x] = [];
            for (let y = 1; y <= this.height; y ++ ) {
                this.board[x][y] = EMPTY;
                this.st[x][y] = false;
            }
        }
        if (handicap == 0) this.player = BLACK;
        else this.player = WHITE;
        for (let x = 4; x <= 16; x += 6) {
            for (let y = 4; y <= 16; y += 6) {
                if (handicap != 0) {{
                    this.board[x][y] = BLACK;
                    this.handicap --;
                }}
            }
        }
    }

    get_board() {
        return this.board;
    }

    changePlayer() {
        if (this.player == BLACK) this.player = WHITE;
        else this.player = BLACK;
    }

    isInBoard(x, y) {
        return x > 0 && x <= this.width && y > 0 && y <= this.height;
    }

    reset() {
        for (let i = 1; i <= this.width; i ++ ) {
            for (let j = 1; j <= this.height; j ++ ) {
                this.st[i][j] = false;
            }
        }
    }

    getAllGroupsLengthAndLiberty(self_count) {
        let count = 0, count_eat = 0, ko_x = -1, ko_y = -1;
        for (let x = 1; x <= this.width; x ++ ) {
            for (let y = 1; y <= this.height; y ++ ) {
                if (this.st[x][y] || this.board[x][y] == EMPTY) continue;
                this.st[x][y] = true;
                let group = new Group(x, y);
                group.getGroupLengthAndLiberty(x, y, this.board[x][y], this.board);
                for (let stone of group.stones) {
                    this.st[stone.get_x()][stone.get_y()] = true;
                }
                if (group.get_liberties() == 0) {
                    count_eat ++;
                    for (let stone of group.stones) {
                        this.board[stone.get_x()][stone.get_y()] = EMPTY;
                    }
                    if (group.get_length() == 1) {
                        count ++;
                        for (let stone of group.stones) {
                            ko_x = stone.get_x();
                            ko_y = stone.get_y();
                        }
                    }
                }
            }
        }
        if (count == 1 && self_count == 1) {
            if (this.player == BLACK) {
                this.whiteForbidden.set_x(ko_x);
                this.whiteForbidden.set_y(ko_y);
            } else if (this.player == WHITE) {
                this.blackForbidden.set_x(ko_x);
                this.blackForbidden.set_y(ko_y);
            }
        }
        return count_eat;
    }

    play(x, y) {
        if (!this.isInBoard(x, y) || this.board[x][y] != EMPTY) {
            return false;
        }
        if (this.player == BLACK) {
            if (this.blackForbidden.get_x() == x && this.blackForbidden.get_y() == y) {
                return false;
            }
        } else if (this.player == WHITE) {
            if (this.whiteForbidden.get_x() == x && this.whiteForbidden.get_y() == y) {
                return false;
            }
        }
        this.board[x][y] = this.player;
        this.reset();
        let cur_group = new Group(x, y);
        cur_group.getGroupLengthAndLiberty(x, y, this.player, this.board);
        let self_count = 0;
        for (let stone of cur_group.stones) {
            this.st[stone.get_x()][stone.get_y()] = true;
            self_count ++;
        }
        let eat_oppo_groups = this.getAllGroupsLengthAndLiberty(self_count);
        if (cur_group.get_liberties() == 0 && eat_oppo_groups == 0) {
            this.board[x][y] = EMPTY;
            return false;
        } else {
            if (this.player == WHITE) {
                this.whiteForbidden.set_x(-1);
                this.whiteForbidden.set_y(-1);
            } else {
                this.blackForbidden.set_x(-1);
                this.blackForbidden.set_y(-1);
            }
            this.changePlayer();
            return true;
        }
    }
}

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get_x() {
        return this.x;
    }

    get_y() {
        return this.y;
    }
    
    set_x(x) {
        this.x = x;
    }

    set_y(y) {
        this.y = y;
    }
}

export class Group {
    constructor(x, y) {
        this.liberties = 0;
        this.length = 1;
        this.stones = new Set();
        this.st = [];
        for (let x = 1; x <= 20; x ++ ) {
            this.st[x] = [];
            for (let y = 1; y <= 20; y ++ ) {
                this.st[x][y] = false;
            }
        }
        this.add2Group(x, y);
    }

    reset() {
        for (let x = 1; x <= 19; x ++ ) {
            for (let y = 1; y <= 19; y ++ ) {
                this.st[x][y] = false;
            }
        }
    }

    isInBoard(x, y) {
        return x > 0 && x <= 19 && y > 0 && y <= 19;
    }

    add2Group(x, y) {
        let point = new Point(x, y);
        this.stones.add(point);
    }

    getGroupLengthAndLiberty(x, y, color, board) {
        this.reset();
        this.getGroupLength(x, y, color, board);
    }

    getGroupLength(x, y, color, board) {
        for (let i = 0; i < 4; i ++ ) {
            let nx = parseInt(x) + dx[i];
            let ny = parseInt(y) + dy[i];
            if (!this.isInBoard(nx, ny) || this.st[nx][ny]) continue;
            if (board[nx][ny] === EMPTY) {
                this.liberties ++;
                this.st[nx][ny] = true;
                continue;
            }
            if (board[nx][ny] != color) {
                this.st[nx][ny] = true;
                continue;
            }
            this.st[nx][ny] = true;
            this.length ++;
            this.add2Group(nx, ny);
            this.getGroupLength(nx, ny, color, board);
        }
    }

    get_liberties() {
        return this.liberties;
    }

    get_length() {
        return this.length;
    }
}