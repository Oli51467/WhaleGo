import { GameObject } from "./GameObject";

export class GameMap extends GameObject {
    constructor(ctx, parent) {
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;     // 每个格子的绝对距离
    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        
    }
}