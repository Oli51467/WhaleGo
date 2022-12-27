import { GameObject } from "./GameObject";

export class GoBoard extends GameObject {
    constructor(ctx, parent, rows, cols) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.rows = rows;
        this.cols = cols;
        this.L = 0;
        this.cell_len = 0;
        this.stones = [];
    }

    init_stones() {
        for (let r = 1; r <= this.rows; r ++ ) {
            this.stones[r] = [];
            for(let c = 1; c <= this.cols; c ++ ) {
                this.stones[r][c] = 0;
            }
        }
    }

    init_stars() {
        for (let i = 4; i <= 16; i += 6) {
            for (let j = 4; j <= 16; j += 6) {
                this.draw_stars(i, j);
            }
        }
    }

    start() {
        this.init_stones();
    }

    draw_lines() {
        this.ctx.strokeStyle = "#522";
        this.ctx.lineWidth = 0.8;

        for (let i = 1; i <= 19; i++) {
            this.ctx.moveTo(this.cell_len, this.cell_len * i);
            this.ctx.lineTo(this.ctx.canvas.width - this.cell_len - 4, this.cell_len * i);
            this.ctx.stroke();
            this.ctx.moveTo(this.cell_len * i, this.cell_len);
            this.ctx.lineTo(this.cell_len * i, this.ctx.canvas.height - this.cell_len - 4);
            this.ctx.stroke();
        }
    }

    draw_stars(x, y) {
        this.ctx.fillStyle = "#402f26";
        this.ctx.beginPath();
        this.ctx.arc(x * this.cell_len, y * this.cell_len, this.cell_len / 5 * 0.75, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 每秒根据浏览器更新大小
    update_size() {
        // 因为区域是不断变化的，所以要在每一帧里动态地求一个区域中可以包含的最大的矩形的一个格子的长和宽
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
        this.cell_len = parseInt(this.ctx.canvas.width / 20);
    }

    draw_stones(x, y, color) {
        if (color === 0) return;
        else if (color === 1) {
            this.ctx.fillStyle = "black";
        } else if (color === 2) {
            this.ctx.fillStyle = "white";
        } 
        this.ctx.beginPath();
        this.ctx.arc(x * this.cell_len, y * this.cell_len, this.cell_len / 2 * 0.75, 0, Math.PI * 2);
        this.ctx.fill();
    }

    update() {
        this.update_size();
        this.render();
    }

    render() {
        this.draw_lines();
        this.init_stars();
        for (let r = 1; r <= this.rows; r ++ ) {
            for (let c = 1; c <= this.cols; c ++ ) {
                this.draw_stones(c, r, this.stones[r][c]);
            }
        }
    }
}