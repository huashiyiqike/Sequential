export default class Sequential{
    next:Array<Sequential> = [];
    callback: Function;
    val: number|Array<number>;
    count:number = 0;
    diff:number|Array<number>;
    timeDiv:number;
    attr: string | Array<string>;
    attrVal: Array<string> | Array<Array<string>>;
    counter: number;
    duration: number;
    forceupdate: Function;
    dom: any;
    reset: boolean;
    reset_wait: number;
    constructor(dom, attr:string|Array<string>, attrVal:Array<string>|Array<Array<string>>, start:number|Array<number>, end:number|Array<number>, duration:number, timeDiv: number, forceupdate: Function, reset: boolean = true, reset_wait = 0){
        this.val = start;
        this.timeDiv = timeDiv;
        this.attr = attr;
        this.attrVal = attrVal;
        this.duration = duration;
        if(this.val instanceof Array){
            this.diff = [];
            for(let i = 0 ; i < this.val.length; i++){
                this.diff.push( (end[i]- start[i])/(duration/timeDiv) );
            }
        }else{
            this.diff = (end-start)/(duration/timeDiv);
        }
        this.forceupdate = forceupdate;
        this.dom = dom;
        this.counter = 0;
        this.reset = reset;
        this.reset_wait = reset_wait;
    }
    public run(){
        let move = function(){
            if(this.val instanceof Array){
                for(let i = 0 ; i < this.val.length; i++){
                    this.val[i] += this.diff[i];
                    this.dom.style[this.attr[i]] = this.attrVal[i][0] + this.val[i] + this.attrVal[i].slice(1).join('');
                }
            }else{
                this.val += this.diff;
                this.dom.style[this.attr] = this.attrVal[0] + this.val + this.attrVal.slice(1).join('');
                // console.log(this.counter++, this.val)
            }
        }
        function reset(){
            if(this.attr instanceof Array){
                for(let i = 0; i < this.attr.length; i++){
                    this.dom.style[this.attr[i]] = '';
                }
            }else{
                this.dom.style[this.attr] = '';
            }
        }
        let timer = setInterval(move.bind(this), this.timeDiv);
        function finish() {
            clearInterval(timer);
            if (this.reset) {
                if(this.reset_wait !== 0){
                    setTimeout(reset.bind(this), this.reset_wait);
                }else{
                    reset.bind(this)();
                }
            }
            for(let i = 0; i < this.next.length; i++) {
                this.next[i].run();
            }
            if (this.callback != null) {
                this.callback();
            }
        }
        setTimeout(finish.bind(this), this.duration);
    }
}