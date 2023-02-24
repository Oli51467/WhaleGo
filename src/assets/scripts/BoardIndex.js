import { GameObject } from "./GameObject";

export class BoardIndex extends GameObject {
    constructor(ctx, parent, rows, cols, store) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.rows = rows;
        this.cols = cols;
        this.store = store;
        this.L = 0;
        this.cell_len = 0;
        this.is_black = true;
        this.virtual_x = -1;
        this.virtual_y = -1;
    }

    init_stars() {
        for (let i = 4; i <= 16; i += 6) {
            for (let j = 4; j <= 16; j += 6) {
                this.draw_stars(i, j);
            }
        }
    }

    start() {
        
    }

    draw_lines() {
        this.ctx.strokeStyle = "#522";
        this.ctx.lineWidth = 0.5;

        for (let i = 1; i <= 19; i++) {
            this.ctx.moveTo(this.cell_len, this.cell_len * i);
            this.ctx.lineTo(this.cell_len * this.cols, this.cell_len * i);
            this.ctx.stroke();
            this.ctx.moveTo(this.cell_len * i, this.cell_len);
            this.ctx.lineTo(this.cell_len * i, this.cell_len * this.rows);
            this.ctx.stroke();
        }
    }

    draw_stars(x, y) {
        this.ctx.fillStyle = "#f402f26";
        this.ctx.beginPath();
        this.ctx.arc(x * this.cell_len, y * this.cell_len, this.cell_len / 5 * 0.75, 0, Math.PI * 2);
        this.ctx.fill();
    }

    draw_light_territory(x, y) {
        const center_x = (x - 0.25) * this.cell_len;
        const center_y = (y - 0.25) * this.cell_len;
        const r = this.cell_len;
        this.ctx.fillRect(center_x, center_y, r / 2.2, r / 2.2);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
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

    // 每秒根据浏览器更新大小
    update_size() {
        // 因为区域是不断变化的，所以要在每一帧里动态地求一个区域中可以包含的最大的矩形的一个格子的长和宽
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
        this.cell_len = parseInt(this.ctx.canvas.width / 20);
    }

    on_destory() {
        this.clear_board();
    }

    update() {
        this.update_size();
        this.draw_lines();
        this.init_stars();
        this.draw_indexes();
        this.render();
    }

    render() {
        this.draw_light_territory(2, 3);
    }
}