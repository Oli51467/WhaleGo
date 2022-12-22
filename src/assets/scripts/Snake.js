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
    }

    start() {

    }

    // 设置方向的统一接口 因为给定蛇的方向可能是键盘输入 也可能是从后端获取
    set_direction(d) {
        this.direction = d;
    }

    next_step() {   // 将蛇的状态变为走下一步 更新this.next_cell
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.direction = -1;    // 清空操作
        this.status = "move";
        this.step ++;

        
    }

    update_move() { // 每秒钟控制蛇的移动
        this.cells[0].x += this.speed * this.timedelta / 1000;
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