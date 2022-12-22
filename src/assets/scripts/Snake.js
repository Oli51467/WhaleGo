import { GameObject } from "./GameObject";
import { Cell } from "./Cell";

export class Snake extends GameObject {
    constructor(info, gamemap) {
        super();

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)];    // 存储蛇身体里的所有部分（占据的格子） cells[0]存放蛇头
        this.speed = 5;         // 蛇每秒走5个格子
    }

    start() {

    }

    update_move() { // 每秒钟控制蛇的移动
        this.cells[0].x += this.speed * this.timedelta / 1000;
    }

    update() {
        this.update_move();
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