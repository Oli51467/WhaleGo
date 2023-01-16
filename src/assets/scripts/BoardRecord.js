import { GameObject } from "./GameObject";
import { Board } from "./BoardObject";

export class BoardRecord extends GameObject {
    constructor(ctx, parent, rows, cols, steps, btn_proceed, btn_fast_proceed, btn_undo, btn_fast_undo) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.rows = rows;
        this.cols = cols;
        this.steps = {};
        this.steps = steps;
        this.btn_proceed = btn_proceed;
        this.btn_fast_proceed = btn_fast_proceed;
        this.btn_undo = btn_undo;
        this.btn_fast_undo = btn_fast_undo;
        this.cur = 0;
        this.size = this.steps.length;
        this.L = 0;
        this.cell_len = 0;
        this.g = [];
        this.virtual_x = -1;
        this.virtual_y = -1;
        this.board = new Board(19, 19, 0);
    }

    click_proceed = () => {
        if (this.cur < this.size) this.cur ++;
    }

    click_fast_proceed = () => {
        for (let i = 0; i < 5; i ++ ) {
            this.click_proceed();
        }
    }

    click_undo = () => {
        if (this.cur > 0) this.cur --;
    }

    click_fast_undo = () => {
        for (let i = 0; i < 5; i ++ ) {
            this.click_undo();
        }
    }


    init_board() {
        for (let i = 0; i <= 400; i ++ ) {
            this.g[i] = [];
            for (let j = 1; j <= 19; j ++ ) {
                this.g[i][j] = [];
                for (let k = 1; k <= 19; k ++ ) {
                    this.g[i][j][k] = 0;
                }
            }
        }
        for (let i = 1; i <= this.steps.length; i ++ ) {
            const step = this.steps[i - 1].split(',');
            const x = step[0], y = step[1];
            this.board.play(parseInt(x), parseInt(y));
            console.log(parseInt(x), parseInt(y));
            // 这里一定要转化一下！！否则会直接把引用赋值
            const t = JSON.parse(JSON.stringify(this.board.board));
            this.g[i] = t;
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
        this.init_board();
        this.btn_proceed.addEventListener('click', this.click_proceed);
        this.btn_fast_proceed.addEventListener('click', this.click_fast_proceed);
        this.btn_undo.addEventListener('click', this.click_undo);
        this.btn_fast_undo.addEventListener('click', this.click_fast_undo);
    }

    draw_virtual_stone(x, y) {
        const center_x = x * this.cell_len;
        const center_y = y * this.cell_len;
        const r = this.cell_len / 2 * 0.9;
        if (this.store.state.gogame.current == 1 && this.store.state.gogame.which == 1 || this.store.state.gogame.current == 0) {
            let gradient = this.ctx.createRadialGradient(center_x, center_y, r / 1.8, center_x, center_y, 0);
            gradient.addColorStop(0, "#333333");
            gradient.addColorStop(1, "#4d4d4d");
            this.ctx.fillStyle = gradient;
        } else if (this.store.state.gogame.current == 2 && this.store.state.gogame.which == 2) {
            let gradient = this.ctx.createRadialGradient(center_x, center_y, r / 1.8, center_x, center_y, 0);
            gradient.addColorStop(0, "#e6e6e6");
            gradient.addColorStop(1, "#ffffff");
            this.ctx.fillStyle = gradient;
        }
        this.ctx.beginPath();
        this.ctx.arc(center_x, center_y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    draw_lines() {
        this.ctx.strokeStyle = "#522";
        this.ctx.lineWidth = 0.5;

        for (let i = 1; i <= 19; i++) {
            this.ctx.moveTo(this.cell_len, this.cell_len * i);
            this.ctx.lineTo(this.ctx.canvas.width * 0.944, this.cell_len * i);
            this.ctx.stroke();
            this.ctx.moveTo(this.cell_len * i, this.cell_len);
            this.ctx.lineTo(this.cell_len * i, this.ctx.canvas.height * 0.944);
            this.ctx.stroke();
        }
    }

    draw_indexes() {
        for (let i = 1; i <= 19; i++) {
            this.ctx.fillStyle = "black";
            this.ctx.font = "30px";
            this.ctx.fillText(i, this.cell_len - 20, this.cell_len * i + 4);
        }
        for (let i = 1; i <= 19; i++) {
            this.ctx.fillStyle = "black";
            this.ctx.font = "30px";
            let alp;
            if (i >= 9) {
                alp = String.fromCharCode(65 + i)
            } else alp = String.fromCharCode(64 + i); 
            this.ctx.fillText(alp, this.cell_len * i - 3, this.ctx.canvas.height - this.cell_len + 8);
        }
    }

    draw_stars(x, y) {
        this.ctx.fillStyle = "#f402f26";
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

    draw_stones (x, y, color) {
        const center_x = x * this.cell_len;
        const center_y = y * this.cell_len;
        const r = this.cell_len / 2 * 0.9;
        if (color === 0) return;
        else if (color == 1) {
            let gradient = this.ctx.createRadialGradient(center_x, center_y, r / 1.8, center_x, center_y, 0);
            gradient.addColorStop(0, "#0a0a0a");
            gradient.addColorStop(1, "#4d4d4d");
            this.ctx.fillStyle = gradient;
        } else if (color == 2) {
            let gradient = this.ctx.createRadialGradient(center_x, center_y, r, center_x, center_y, 0);
            gradient.addColorStop(0.05, "#4d4d4d");
            gradient.addColorStop(0.1, "#ffffff");
            this.ctx.fillStyle = gradient;
        }
        this.ctx.beginPath();
        this.ctx.arc(center_x, center_y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    draw_red_point(x, y) {
        const center_x = x * this.cell_len;
        const center_y = y * this.cell_len;
        const r = this.cell_len / 2 * 0.9;
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(center_x, center_y, r / 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    on_destory() {
        this.board.clear();
    }

    update() {
        this.update_size();
        this.draw_lines();
        this.init_stars();
        this.draw_indexes();
        this.render();
    }

    render() {
        for (let r = 1; r <= this.rows; r++) {
            for (let c = 1; c <= this.cols; c++) {
                this.draw_stones(c, r, this.g[this.cur][r][c]);
                if (this.cur == 0) break;
                this.draw_red_point(this.steps[this.cur - 1].split(',')[1], this.steps[this.cur - 1].split(',')[0]);
            }
        }
    }
}