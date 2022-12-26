import { GameObject } from "./GameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends GameObject {
    constructor(ctx, parent, store) {
        super();    // 这里先执行父类的构造函数

        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
        this.L = 0;     // 每个格子的绝对距离
        this.rows = 19;
        this.cols = 20;

        this.inner_walls_count = 55;
        this.walls = []; // 存储所有的墙

        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2}, this),
        ]
    }

    // 创建障碍物
    create_map() {
        const g = this.store.state.game.gamemap;
        for (let r = 0; r < this.rows; r ++ ) {
            for(let c = 0; c < this.cols; c ++ ) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
    }

    // 给canvas添加监听事件
    add_listening_events() {
        this.ctx.canvas.focus();    // 先聚焦
        this.ctx.canvas.addEventListener("keydown", e => {
            let d = -1;
            if (e.key === 'w') d = 0;
            else if (e.key === 'd')  d = 1;
            else if (e.key === 's')  d = 2;
            else if (e.key === 'a')  d = 3;
            // 检测到移动 向后端发送请求
            if (d >= 0) {
                this.store.state.game.socket.send(JSON.stringify({
                    event: "move",
                    direction: d,
                }));
            }

        });
    }

    // 开始执行一次
    start() {
        this.create_map();
        this.add_listening_events();
    }

    // 每秒根据浏览器更新大小
    update_size() {
        // 因为区域是不断变化的，所以要在每一帧里动态地求一个区域中可以包含的最大的矩形的一个格子的长和宽
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    // 当两条蛇给出移动指令时，控制两条蛇移动进入下一回合
    next_step() {   
        for (const snake of this.snakes) {
            if (snake.direction != -1) snake.next_step();
        }
    }

    // 每秒执行60次
    update() {
        this.update_size();
        this.next_step();
        this.render();
    }

    // 渲染
    render() {
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                // canvas的坐标系是(col, row), 后两个参数是填充的长和宽
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}