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
    }

    start() {

    }

    // 设置方向的统一接口 因为给定蛇的方向可能是键盘输入 也可能是从后端获取
    set_direction(d) {
        this.direction = d;
    }

    check_tail_increasing() {
        if (this.step <= 10) return true;
        if (this.step % 3 === 1) return true;
        return false;
    }

    next_step() {   // 将蛇的状态变为走下一步 更新this.next_cell
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
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

            if (!this.check_tail_increasing()) {    // 蛇不变长就将蛇尾砍掉
                this.cells.pop();
            }
        } else {
            const move_distance = this.speed * this.timedelta / 1000;
            this.cells[0].x += move_distance * dx / distance;   // x实际走的距离
            this.cells[0].y += move_distance * dy / distance;

            if (!this.check_tail_increasing()) {
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
        for (const cell of this.cells) {
            ctx.beginPath();
            // 前两个参数是圆弧中点，第三个参数是圆弧半径， 后两个参数是起始角度和中止角度
            ctx.arc(cell.x * L, cell.y * L, L / 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
}