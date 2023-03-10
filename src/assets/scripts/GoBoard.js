import { GameObject } from "./GameObject";

export class GoBoard extends GameObject {
    constructor(ctx, parent, rows, cols, store, room_id) {
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
        this.room_id = room_id;
    }

    init_stars() {
        for (let i = 4; i <= 16; i += 6) {
            for (let j = 4; j <= 16; j += 6) {
                this.draw_stars(i, j);
            }
        }
    }

    add_mouse_events() {
        this.ctx.canvas.addEventListener("mousemove", this.handle_mousemove);
        this.ctx.canvas.addEventListener("click", this.handle_mouseclick);
    }

    handle_mousemove = (e) => {
        const g = this.store.state.gogame.board;
        if (g == null) return;
        let click_x = e.offsetX;
        let click_y = e.offsetY;
        let x = Math.floor(click_y / this.cell_len);
        let y = Math.floor(click_x / this.cell_len);
        if (x <= 0 || x > 19 || y <= 0 || y > 19 || g[x][y]) {
            this.virtual_x = -1;
            this.virtual_y = -1;
            return;
        }
        this.virtual_x = y;
        this.virtual_y = x;
    }

    handle_mouseclick = (e) => {
        const g = this.store.state.gogame.board;
        if (g == null) return;
        let click_x = e.offsetX;
        let click_y = e.offsetY;
        let x = Math.floor(click_y / this.cell_len);
        let y = Math.floor(click_x / this.cell_len);
        this.virtual_x = -1; 
        this.virtual_y = -1;
        if (x <= 0 || x > 19 || y <= 0 || y > 19 || g[x][y]) return;
        
        this.store.state.gogame.socket.send(JSON.stringify({
            event: "play",
            x: x,
            y: y,
            room_id: this.room_id,
        }));
        this.remove_mouse_events();
    }

    remove_mouse_events() {
        this.ctx.canvas.removeEventListener("mousemove", this.handle_mousemove);
        this.ctx.canvas.removeEventListener("click", this.handle_mouseclick);
    }

    start() {
        
    }

    draw_virtual_stone(x, y) {
        const center_x = (x) * this.cell_len;
        const center_y = (y) * this.cell_len;
        const r = this.cell_len / 2 * 0.9;
        if (this.store.state.gogame.current == 1 && this.store.state.gogame.which == 1 || this.store.state.gogame.current == 0) {
            let gradient = this.ctx.createRadialGradient(center_x, center_y, r / 1.8, center_x, center_y, 0);
            gradient.addColorStop(0, "#333333");
            gradient.addColorStop(1, "#4d4d4d");
            this.ctx.fillStyle = gradient;
        } else if (this.store.state.gogame.current == 2 && this.store.state.gogame.which == 2) {
            let gradient = this.ctx.createRadialGradient(center_x, center_y, r, center_x, center_y, 0);
            gradient.addColorStop(0.1, "#ffffff");
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
            this.ctx.lineTo(this.cell_len * 19, this.cell_len * i);
            this.ctx.stroke();
            this.ctx.moveTo(this.cell_len * i, this.cell_len);
            this.ctx.lineTo(this.cell_len * i, this.cell_len * 19);
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
            this.ctx.fillText(alp, this.cell_len * i, this.ctx.canvas.height - this.cell_len + 15);
        }
    }

    draw_stars(x, y) {
        this.ctx.fillStyle = "#f402f26";
        this.ctx.beginPath();
        this.ctx.arc(x * this.cell_len, y * this.cell_len, this.cell_len / 5 * 0.75, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // ?????????????????????????????????
    update_size() {
        // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(center_x, center_y, r / 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    draw_territory(x, y, color) {
        const center_x = (x - 0.25) * this.cell_len;
        const center_y = (y - 0.25) * this.cell_len;
        const r = this.cell_len;
        if (color == 1) this.ctx.fillStyle = 'black';
        else this.ctx.fillStyle = 'white';
        this.ctx.fillRect(center_x, center_y, r / 2.2, r / 2.2);
    }

    on_destory() {
        this.clear_board();
    }

    update() {
        if (this.store.state.gogame.current == this.store.state.gogame.which && this.room_id == this.store.state.gogame.room_id) {
            this.add_mouse_events();
        } else this.remove_mouse_events();
        this.update_size();
        this.draw_lines();
        this.init_stars();
        this.draw_indexes();
        this.render();
    }

    render() {
        const g = this.store.state.gogame.board;
        const territory = this.store.state.gogame.territory;
        const last_x = this.store.state.gogame.last_x;
        const last_y = this.store.state.gogame.last_y;
        const show_territory = this.store.state.gogame.show_territory;
        if (g === null) return;
        for (let r = 1; r <= this.rows; r++) {
            for (let c = 1; c <= this.cols; c++) {
                this.draw_stones(c, r, g[r][c]);
                if (last_x != -1 && last_y != -1) this.draw_red_point(last_y, last_x);
                if (this.virtual_x != -1 && this.virtual_y != -1) this.draw_virtual_stone(this.virtual_x, this.virtual_y);
                if (g[r][c] == 0 && show_territory == true && territory[r][c] > 50) {
                    if (territory[r][c] > 75) {
                        this.draw_territory(c, r, 1);
                    } else this.draw_territory(c, r, 2);
                }
            }
        }
    }
}