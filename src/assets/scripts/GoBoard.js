import { GameObject } from "./GameObject";

export class GoBoard extends GameObject {
    constructor(ctx, parent, rows, cols, store) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.rows = rows;
        this.cols = cols;
        this.store = store;
        this.L = 0;
        this.cell_len = 0;
        this.stones = [];
        this.is_black = true;
        this.virtual_x = -1;
        this.virtual_y = -1;
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

    add_mouse_events() {
        this.ctx.canvas.addEventListener("mousemove", e => {
            let click_x = e.offsetX;
            let click_y = e.offsetY;
            let x = Math.floor(click_y / 32);
            let y = Math.floor(click_x / 32);
            if (x <= 0 || x > 19 || y <= 0 || y > 19 || this.stones[x][y]) {
                this.virtual_x = -1;
                this.virtual_y = -1;
                return;
            }
            this.virtual_x = y;
            this.virtual_y = x;
        });
        this.ctx.canvas.addEventListener("click", e => {
            let click_x = e.offsetX;
            let click_y = e.offsetY;
            let x = Math.floor(click_y / 32);
            let y = Math.floor(click_x / 32);
            this.virtual_x = -1;
            this.virtual_y = -1;
            if (x <= 0 || x > 19 || y <= 0 || y > 19 || this.stones[x][y]) return;
            // 调试 在前端落子
            if (this.is_black) {
                this.stones[x][y] = 1;
            } else {
                this.stones[x][y] = 2;
            }
            this.is_black = !this.is_black;
            // if (d >= 0) {
            //     this.store.state.game.socket.send(JSON.stringify({
            //         event: "move",
            //         direction: d,
            //     }));
            // }

        });
    }

    start() {
        this.init_stones();
        this.add_mouse_events();
    }

    draw_virtual_stone(x, y) {
        const center_x = x * this.cell_len;
        const center_y = y * this.cell_len;
        const r = this.cell_len / 2 * 0.9;
        if (this.is_black) {
            let gradient = this.ctx.createRadialGradient(center_x, center_y, r / 1.8, center_x, center_y, 0);
            gradient.addColorStop(0, "#333333");
            gradient.addColorStop(1, "#4d4d4d");
            this.ctx.fillStyle = gradient;
        } else {
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
        for (let i = 1; i <= 19; i ++ ) {
            this.ctx.fillStyle = "black";
            this.ctx.font = "30px";
            this.ctx.fillText(String.fromCharCode(64 + i), this.cell_len - 20, this.cell_len * i + 4);
        }
        for (let i = 1; i <= 19; i ++ ) {
            this.ctx.fillStyle = "black";
            this.ctx.font = "30px";
            this.ctx.fillText(i, this.cell_len * i - 3, this.ctx.canvas.height - this.cell_len + 15);
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

    draw_stones(x, y, color) {
        const center_x = x * this.cell_len;
        const center_y = y * this.cell_len;
        const r = this.cell_len / 2 * 0.9;
        if (color === 0) return;
        else if (color === 1) {
            let gradient = this.ctx.createRadialGradient(center_x, center_y, r / 1.8, center_x, center_y, 0);
            gradient.addColorStop(0, "#0a0a0a");
            gradient.addColorStop(1, "#4d4d4d");
            this.ctx.fillStyle = gradient;
        } else if (color === 2) {
            let gradient = this.ctx.createRadialGradient(center_x, center_y, r / 1.8, center_x, center_y, 0);
            gradient.addColorStop(0, "#e6e6e6");
            gradient.addColorStop(1, "#ffffff");
            this.ctx.fillStyle = gradient;
        } 
        this.ctx.beginPath();
        this.ctx.arc(center_x, center_y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    update() {
        this.update_size();
        this.render();
    }

    render() {
        this.draw_lines();
        this.init_stars();
        this.draw_indexes();
        this.draw_stones(5, 5, 2);
        for (let r = 1; r <= this.rows; r ++ ) {
            for (let c = 1; c <= this.cols; c ++ ) {
                this.draw_stones(c, r, this.stones[r][c]);
                if (this.virtual_x != -1 && this.virtual_y != -1) this.draw_virtual_stone(this.virtual_x, this.virtual_y);
            }
        }
    }
}