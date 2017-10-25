import * as React from 'react';
import { Component, PropTypes } from 'react';
import Sequential from './Sequential';
export default class Example extends React.Component<any, any> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isEnd: false,
            items: [] // 数组列表
        }
        this.animQue = [];
        this.list = [];
    }

    remove = (item, index) => {
        console.log(item, index)
        if (this.animQue.length != 0) {
            return;
        }
        this.animQue.push(new Sequential(this.list[index], ['transform', 'opacity'], [['translateX(', 'px)'], ['', '']], [0, 1], [-1000, 0],
            500, 16, null, false));
        let upDist = this.list[index].offsetHeight;
        var tmp = [];
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i] != null) {
                tmp.push(this.list[i]);
            }
        }
        this.list = tmp;
        while (++index <= 2 && index < this.list.length) {
            if (index == 1 && this.list.length == 2) {
                break;
            }
            this.animQue.push(new Sequential(this.list[index], 'transform', ['translateY(', 'px)'],
                0, -upDist, 400, 16, null, true, index == 1 ? 400 : 0));
            this.animQue[this.animQue.length - 2].next.push(this.animQue[this.animQue.length - 1]);
        }
        let items = this.state.items.filter(function (itm) {
            return item.id != itm.id;
        })
        function reset(items) {
            this.setState({
                items: items
            })
            this.animQue = [];
            setTimeout(() => { this.forceUpdate.bind(this) }, 400);
        }
        this.animQue[this.animQue.length - 1].callback = reset.bind(this, items);
        this.animQue[0].run();
    }

    render() {
        return (
            <div>
                {[1, 2, 3, 4].map((item, index) => {
                    return <div className="list"
                        key={index}
                        ref={(div) => { this.list[index] = div; }}
                        onClick = {()=>{this.remove(this, index)}}
                    >
                        {item}
                    </div>
                })}

            </div>
        );
    }
}
