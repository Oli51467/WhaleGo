"use strict";

export class ChatBody {
    constructor(body) {
        this.chat_body = body;
        this.init();
    }

    init() {
        let flag = false;
        this.chat_body.addEventListener('mousedown', (e) => {
            flag = true;
            let x = e.offsetX;
            let y = e.offsetY;
            this.chat_body.addEventListener('mousemove', (e) => {
                let body_left = e.clientX - x;
                let body_top = e.clientY - y;
                let _h = window.innerHeight - this.chat_body.offsetHeight;
                let _w = window.innerWidth - this.chat_body.offsetWidth;
                body_top = Math.min(Math.max(0, body_top), _h);
                body_left = Math.min(Math.max(0, body_left), _w);
                if (flag) {
                    this.chat_body.style.left = body_left + "px";
                    this.chat_body.style.top = body_top + "px";
                }
            });
        });
        this.chat_body.addEventListener('mouseup', () => {
            flag = false;
        })
    }
}