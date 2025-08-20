
import { Context, Controller } from 'chair';
import * as querystring from 'querystring';
declare module 'chair' {
export interface IApiController {
        xdev: XdevController;
    }
}
/**
 * Xdev接口
 */
export default class XdevController extends Controller {
    
    public async getProxy() {
        const { ctx } = this;
        const { api, noWrap = true, ...restParams } = ctx.query;
        const result = await ctx.service.xdevApi.request(api, 'GET', restParams);
        if (noWrap === true) {
            ctx.body = this.atitSuccessResult(result);
        } else {
            ctx.body = result;
        }
    }
    
    public async postProxy() {
        const { ctx } = this;
        const { api, noWrap = true, ...restParams } = ctx.extendParams;
        const result = await ctx.service.xdevApi.request(api, 'POST', restParams);
        if (noWrap === true) {
            ctx.body = this.atitSuccessResult(result);
        } else {
            ctx.body = result;
        }
    }
    
    public async postProxyV2() {
        const { ctx } = this;
        const { api, noWrap = true, ...restParams } = ctx.query;
        const result = await ctx.service.xdevApi.request('${api}?${querystring.stringify(restParams)}', 'POST', ctx.body);
        if (noWrap === true) {
            ctx.body = this.atitSuccessResult(result);
        } else {
            ctx.body = result;
        }
    }
    
    public async putProxy() {
        const { ctx } = this;
        const { api, noWrap = true, ...restParams } = ctx.extendParams;
        const result = await ctx.service.xdevApi.request(api, 'PUT', restParams);
        if (noWrap === true) {
            ctx.body = this.atitSuccessResult(result);
        } else {
            ctx.body = result;
        }
    }
    
    public async deleteProxy() {
        const { ctx } = this;
        const { api, noWrap = true, ...restParams } = ctx.extendParams;
        const result = await ctx.service.xdevApi.request(api, 'DELETE', restParams);
        if (noWrap === true) {
            ctx.body = this.atitSuccessResult(result);
        } else {
            ctx.body = result;
        }
    }
    
    /**
     * 用户点赞过的文章列表
     */
    public async getUserVotedArticles() {
        const { ctx } = this;
        const { page, pageSize, workNo } = ctx.extendParams;
        const result = await ctx.service.xdevApi.getUserVotedArticles(page, pageSize, workNo);
        ctx.body = this.atitSuccessResult(result);
    }
    
    public async getUserViewsHistory() {
        const { ctx } = this;
        const { page, pageSize, category, workNo } = ctx.extendParams;
        const result = await ctx.service.xdevApi.getUserViewsHistory(page, pageSize, category, workNo);
        ctx.body = this.atitSuccessResult(result);
    }
    
    private atitSuccessResult(data: any) {
        return { msg: '', stat: 'ok', data };
    }
}
function getInfo5(name:string):string
function getInfo5(age:number):number
function getInfo5(str:any):any{
    if(typeof str == 'string'){
        return str
    }else{
        return str
    }
}

class Person3{
    name:string  //属性，前面省略了public关键词
    constructor(name:string){ //构造函数 实例化类的时候触发的函数
        this.name = name
    }
    getName():string{
        return this.name
    }
    setName(name:string):void{
        this.name=name
    }
    static print(){
        alert('这是静态方法')
        // 静态方法没办法直接调用类里面的属性
    }
}

abstract class Animal{
    name:string
    constructor(name:string){
        this.name = name
    }
    abstract eat():any
}
class Dog extends Animal{
    constructor(name:any){
        super(name)
    }
    // 抽象类的子类必须实现抽象类里面的方法
    eat(){
        console.log(this.name+'吃肉')
    }
}
var d = new Dog('xiaogou')
d.eat()
