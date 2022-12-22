import { GameObject } from "./GameObject";

export class Wall extends GameObject {
    constructor(row, col, gamemap) {
        super();

        this.row = row;
        this.col = col;
        this.gamemap = gamemap;
        this.color = "#B37226";
    }

    update() {
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.col * L, this.row * L, L, L);
    }
}