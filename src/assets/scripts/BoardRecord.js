import { GameObject } from "./GameObject";
import { Board } from "./BoardObject";

export class BoardRecord extends GameObject {
    constructor(ctx, parent, rows, cols, steps, btn_proceed) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.rows = rows;
        this.cols = cols;
        this.steps = {};
        this.steps = steps;
        this.btn_proceed = btn_proceed;
        this.cur = 0;
        this.L = 0;
        this.cell_len = 0;
        this.g = [];
        this.virtual_x = -1;
        this.virtual_y = -1;
        this.board = new Board(19, 19, 0);
    }

    proceed = () => {
        if (this.cur >= this.steps.length) return;
        const step = this.steps[this.cur ++].split(',');
        const x = step[0];
        const y = step[1];
        let player = this.board.getPlayer();
        this.board.play(x, y, player);
        this.board.nextPlayer();
        let last_turn = this.board.gameRecord.getLastTurn();    // 上一步走棋的回合记录
        let last_board = last_turn.boardState;                  // 上一步走的棋盘状态
        this.g = last_board;
    }

    init_board() {
        for (let i = 1; i <= 19; i ++ ) {
            this.g[i] = [];
            for (let j = 1; j <= 19; j ++ ) {
                this.g[i][j] = 0;
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
        this.init_board();
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
            let gradient = this.ctx.createRadialGradient(center_x, center_y, r / 1.8, center_x, center_y, 0);
            gradient.addColorStop(0, "#e6e6e6");
            gradient.addColorStop(1, "#ffffff");
            this.ctx.fillStyle = gradient;
        }
        this.ctx.beginPath();
        this.ctx.arc(center_x, center_y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    on_destory() {
        this.clear_board();
    }

    update() {
        this.update_size();
        this.draw_lines();
        this.init_stars();
        this.draw_indexes();
        this.btn_proceed.addEventListener('click', this.proceed);
        this.render();
    }

    render() {
        for (let r = 1; r <= this.rows; r++) {
            for (let c = 1; c <= this.cols; c++) {
                this.draw_stones(c, r, this.g[r][c]);
                //if (this.virtual_x != -1 && this.virtual_y != -1) this.draw_virtual_stone(this.virtual_x, this.virtual_y);
            }
        }
    }
}