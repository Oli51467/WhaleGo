import { GameObject } from "./GameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends GameObject {
    constructor(ctx, parent) {
        super();    // 这里先执行父类的构造函数

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;     // 每个格子的绝对距离
        this.rows = 19;
        this.cols = 20;

        this.inner_walls_count = 55;
        this.walls = []; // 存储所有的墙

        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2}, this),
        ]
    }

    // flood fill判断连通性
    check_connectivity(g, sx, sy, tx, ty) {
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = true;   // 该位置走过了，不要往回走
        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i ++ ) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty)) {
                return true;
            }
        }
        return false;
    }

    // 创建障碍物
    create_walls() {
        const g = [];   // 位置是否有墙的二维bool数组
        for (let r = 0; r < this.rows; r ++ ) {
            g[r] = [];
            for (let c = 0; c < this.cols; c ++ ) {
                g[r][c] = false;
            }
        }
        // 给四周加墙
        for (let r = 0; r < this.rows; r ++ ) {
            g[r][0] = g[r][this.cols - 1] = true;
        }

        for (let c = 0; c < this.cols; c ++ ) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建随机障碍物
        for (let i = 0; i < this.inner_walls_count / 2; i ++ ) {
            for (let j = 0; j < 1000; j ++ ) {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue;   // 若已经覆盖则继续
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2) continue; // 若随机到左下或右下，则继续
                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
                break;
            }
        }

        const cogy_g = JSON.parse(JSON.stringify(g));   // 将墙的位置的参数传过去 为了不脏掉重新复制一份
        // 检查连通性 如果两头不连通 则返回重新生成
        if (!this.check_connectivity(cogy_g, this.rows - 2, 1, 1, this.cols - 2)) {
            return false;
        }
        for (let r = 0; r < this.rows; r ++ ) {
            for(let c = 0; c < this.cols; c ++ ) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
        return true;
    }

    // 给canvas添加监听事件
    add_listening_events() {
        this.ctx.canvas.focus();    // 先聚焦
        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.key === 'w') snake0.set_direction(0);
            else if (e.key === 'd') snake0.set_direction(1);
            else if (e.key === 's') snake0.set_direction(2);
            else if (e.key === 'a') snake0.set_direction(3);
            else if (e.key === 'ArrowUp') snake1.set_direction(0);
            else if (e.key === 'ArrowRight') snake1.set_direction(1);
            else if (e.key === 'ArrowDown') snake1.set_direction(2);
            else if (e.key === 'ArrowLeft') snake1.set_direction(3);
        });
    }

    // 开始执行一次
    start() {
        for (let i = 0; i < 1000; i ++ ) {
            if (this.create_walls()) {
                break;
            }
        }
        this.add_listening_events();
    }

    // 每秒根据浏览器更新大小
    update_size() {
        // 因为区域是不断变化的，所以要在每一帧里动态地求一个区域中可以包含的最大的矩形的一个格子的长和宽
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    // 检查两条蛇是否准备好 并且是否都发出了移动指令
    check_ready() { 
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    // 判断目标位置是否合法：没有撞到两条蛇的身体和障碍物
    check_valid_move(cell) {
        for (const wall of this.walls) {
            if (wall.row === cell.r && wall.col === cell.c) return false;
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (snake.check_tail_move()) {     // 蛇尾移动的时候不判断自己的头咬到尾
                k -- ;
            } 
            for (let i = 0; i < k; i ++ ) {
                if (cell.r === snake.cells[i].r && cell.c === snake.cells[i].c) 
                    return false;
            }
        }

        return true;
    }

    // 当两条蛇给出移动指令时，控制两条蛇移动进入下一回合
    next_step() {   
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    // 每秒执行60次
    update() {
        this.update_size();
        if (this.check_ready()) {
             this.next_step();   
        }
        this.render();
    }

    // 渲染
    render() {
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                // canvas的坐标系是(col, row), 后两个参数是填充的长和宽
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}