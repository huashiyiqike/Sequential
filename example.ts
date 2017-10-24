import * as React from 'react';
import { Component, PropTypes } from 'react';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import Toast from '../Toast';
import * as axios from 'axios';
import * as Util from '../Util';
import './style.less';
import Sequential from './Sequential';
/**
 * 局部数据源卡片
 *
 * @export
 * @class DynamicListCard
 * @extends {Component}
 */
@observer
export default class example extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isEnd: false,
            items: [] // 数组列表
        }
        this.page = +this.props.pn || 1;
        this.isLoading = false;
        this.loadData = this.loadData.bind(this);
        this.list = [];
        this.animQue= [];
    }

    componentWillMount() {
        let { auto_load } = this.props;
        if (auto_load == 1) {
            this.loadData();
        }
    }

    componentWillReceiveProps(nextProps){
        console.log('receive props',nextProps.followedGod)
         let {
            items,
            isEnd
        } = this.state;
        for(let i = 0; i < this.state.items.length; i++){
            if(this.state.items[i].id == nextProps.followedGod){
                this.remove(this.state.items[i], i)
            }
        }
    }

    componentDidUpdate(){
     if(this.state.items.length == 0){
            this.props.eventHandler('set_state', [0]); 
        }
    }

    // 加载数据
    loadData() {

        let self = this;
        let { shouldLoadMore, api, data_map } = this.props;
        if (self.state.isEnd || !api || this.isLoading) {
            return;
        }
        if (shouldLoadMore) {
            self.page++;
            let pn_params = "pn=" + self.page;
            api = String(api).indexOf("?") > 0 ? api += '&' + pn_params : api += "?" + pn_params;
        }

        if (window.location.host.indexOf('.otp.baidu.com') > 0) {
            let pos = api.indexOf("?"); // 第一个问号前面为path 后面为query
            let query = pos > 0 ? api.substr(pos) : "";
            let path = pos > 0 ? encodeURIComponent(api.substr(0, pos)) : api;
            if (api.indexOf("/apage-runtime/") < 0) {
                api = "/n/apage-runtime/api/proxy" + query;
                api = api.indexOf("?") > -1 ? `${api}&_proxy=${path}` : `${api}?_proxy=${path}`;
            }
        }

        this.isLoading = true;
        axios.get(api).then((res) => {
            this.isLoading = false;
            if (res.status == 200 && res.data
                && (res.data.errno == 0 || res.data.no == 0 || res.data.error_code == 0)) {
                let has_more = _.get(res.data, 'data.has_more', 0);
                let new_items = [];
                let rt = _.get(res.data, data_map);
                if (rt && _.isArray(rt)) {
                    new_items = rt;
                }
                self.setState({
                    isEnd: has_more == 0,
                    items: self.state.items.concat(new_items)
                })
            }
        })
            .catch(function(error) {
                console.log(error);
                self.isLoading = false;
            });
    }

    getSingleCard(itemData, index) {
        console.log(itemData)
        return this.props.getSingleComponent(itemData, index, itemData);
    }

    Banner = () => {
        return <div className="recommend-banner">
            <span className="recommend-banner-text">猜你可能也会想要关注这些大神</span>
            <a href="javascript:void(0)"
                onClick={() => { this.props.eventHandler('set_state', [0]) }}
                className="recommend-banner-button"
            >先算了</a>
        </div>
    }

    
    remove = (item, index) => {
        if(this.animQue.length != 0){
            return;
        }
        this.animQue.push(new Sequential(this.list[index],['transform', 'opacity'],[['translateX(','px)'], ['','']],[0, 1],[-1000, 0],
        500,16,null,false));
        let upDist = this.list[index].offsetHeight;
        var tmp = [];
        for(var i = 0 ; i < this.list.length; i++){
            if(this.list[i] != null){
                tmp.push(this.list[i]);
            }
        }
        this.list = tmp;
        while (++index <= 2 && index < this.list.length) {
                if(index == 1 && this.list.length == 2){
                    break;
                }
                this.animQue.push(new Sequential(this.list[index],'transform',['translateY(','px)'],
                0,-upDist, 400,16,null, true, index==1?400:0));
                this.animQue[this.animQue.length-2].next.push(this.animQue[this.animQue.length-1]);
        }
        let items = this.state.items.filter(function(itm) {
            return item.id != itm.id;
        })
        function reset(items){
            this.setState({
                items: items
            })
            this.animQue = [];
            setTimeout(() =>{this.forceUpdate.bind(this)}, 400);
        }
        this.animQue[this.animQue.length-1].callback = reset.bind(this, items);
        this.animQue[0].run();
    }

    render() {
      
        let {
            className,
            cards,
            trigger,
            bgcover
        } = this.props;

        let {
            items,
            isEnd
        } = this.state;
       
        return (
            <div>
              {
                items.length > 0 && <div className={bgcover==1?"bgcover":""}>
                    <div className={`dynamic-list-card ${className || ""}`}>
                        <div style={{overflow:"hidden"}}>
                            {items && this.Banner()}
                            {items && items.map((item, index) => {
                                if (index < 3) {
                                    return <div key={item.id} ref={(div) => { this.list[index] = div; }}>
                                        {this.props.getSingleComponent(item, index, item)}
                                    </div>
                                }
                            })}
                        </div>
                        <div className="tail">{ }</div>
                    </div>
                    </div>
            }
           </div>
        );
    }
}
