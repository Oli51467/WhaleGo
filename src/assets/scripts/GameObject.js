const GAME_OBJECTS = [];

export class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);
        this.timedelta = 0; // 当前帧距离上一帧的时间间隔 帧与帧之间的时间间隔不一定相同
        this.has_called_start = false;
    }

    start() {   // 只执行一次
    }

    update() {  // 除第一帧外，每一帧执行一次
    }

    on_destory() {  // 删除之前执行
    }

    destory() {
        this.on_destory();
        for (let i in GAME_OBJECTS) {
            const obj = GAME_OBJECTS[i];
            if (obj === this) {
                GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}

let last_timestamp; // 辅助变量，上一次执行的时刻
const step = timestamp => {     // 每一帧执行的回调函数 传入一个timestamp表示当前的时刻
    for (let obj of GAME_OBJECTS) {
        if (!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(step);
}

requestAnimationFrame(step)