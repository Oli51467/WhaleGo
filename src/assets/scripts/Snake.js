import { GameObject } from "./GameObject";
import { Cell } from "./Cell";

export class Snake extends GameObject {
    constructor(info, gamemap) {
        super();

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)];    // 存储蛇身体里的所有部分（占据的格子） cells[0]存放蛇头
        this.next_cell = null;  // 下一步的目标位置

        this.speed = 5;         // 蛇每秒走5个格子
        this.direction = -1;    // -1表示没有移动指令，0、1、2、3分别表示上、右、下、左
        this.status = "idle";   // idle表示静止  move表示正在移动 die表示死亡

        this.dr = [-1, 0, 1, 0];    // 行偏移量
        this.dc = [0, 1, 0, -1];    // 列偏移量

        this.step = 0;  // 当前回合数
        this.eps = 1e-2;    // 距离误差

        this.eye_direction = 0;
        if (this.id === 1) this.eye_direction = 2;

        this.eye_dx = [ // 蛇眼睛不同方向x的偏移量
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ]
        this.eye_dy = [ // 蛇眼睛不同方向y的偏移量
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ]
    }

    start() {

    }

    // 设置方向的统一接口 因为给定蛇的方向可能是键盘输入 也可能是从后端获取
    set_direction(d) {
        this.direction = d;
    }

    set_eye_direction(d) {
        this.eye_direction = d;
    }

    check_tail_move() {
        if (this.step <= 10) return false;
        if (this.step % 3 === 1) return false;
        return true;
    }

    next_step() {   // 将蛇的状态变为走下一步 更新this.next_cell
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.eye_direction = d; // 为了画眼睛，改变蛇头的方向
        this.direction = -1;    // 清空操作
        this.status = "move";
        this.step ++;

        const k = this.cells.length;
        for (let i = k; i > 0; i -- ) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));  // 将旧的复制一份
        }
    }

    update_move() { // 每秒钟控制蛇的移动
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx, dy * dy);

        if (distance < this.eps) {  // 接近于走完了一格的长度
            this.cells[0] = this.next_cell; // 添加一个新蛇头
            this.next_cell = null;
            this.status = "idle";   // 走完了 更新状态

            if (this.check_tail_move()) {    // 蛇不变长就将蛇尾砍掉
                this.cells.pop();
            }
        } else {
            const move_distance = this.speed * this.timedelta / 1000;
            this.cells[0].x += move_distance * dx / distance;   // x实际走的距离
            this.cells[0].y += move_distance * dy / distance;

            if (this.check_tail_move()) {
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    // 每一帧执行一次 每秒执行60次
    update() {
        if (this.status === 'move') {
            this.update_move();
        }
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        if (this.status === "die") {
            ctx.fillStyle = "white";
        }

        for (const cell of this.cells) {
            ctx.beginPath();
            // 前两个参数是圆弧中点，第三个参数是圆弧半径， 后两个参数是起始角度和中止角度
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // 渲染的时候将蛇身连起来，思路是在两个相邻的蛇身之间画一个矩形
        for (let i = 1; i < this.cells.length; i ++ ) {
            const a = this.cells[i - 1], b = this.cells[i];
            // 如果两个格子已经移动地很近，则可以不用画
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) continue;
            if (Math.abs(a.x - b.x) < this.eps) {   // 竖直方向相连的情况
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        ctx.fillStyle = "black";
        // 画两只眼睛
        for (let i = 0; i < 2; i ++ ) {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.08, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}