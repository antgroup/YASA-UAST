import { Controller } from 'chair';
import { taintFlowOnDecorator } from '../authentication/taint_decorator';

class TaintController extends Controller {
    
    @taintFlowOnDecorator
    async t1({ userId }) {
        const { ctx } = this;
        const taint = ctx.request;
        //## 【污点sink检出】
        __chair_input_sink(taint);
        //## 排除，预期没有检出
        __chair_input_sink(_, taint);
        
        const foo = {
            a: 1,
            taint: taint,
        }
        
        //## 【污点sink检出】
        __chair_input_sink(foo);
        //## 排除，预期没有检出
        __chair_input_sink(foo.a);
        //## 【污点sink检出】
        __chair_input_sink(foo.taint);
        
        // 污点sanitize
        foo.taint = 1;
        //## 排除，预期没有检出
        __chair_input_sink(foo.taint);
        
        
        let bar = 1;
        if (ctx.request.input < 1) {
            bar = taint;
            //## 【污点sink检出】
            __chair_input_sink(bar);
        } else {
            // false分支不受true分支赋值影响
            //pass
            __chair_input_sink(bar);
        }
        
        const output = {};
        const ret = taint_flow(taint, output);
        
        //## 【污点sink检出】
        __chair_input_sink(ret);
        //## 【污点sink检出】
        __chair_input_sink(output);
        
        await ctx.service.taint.taintService(taint);
    }
}

function taint_flow(input, output) {
    output.taint = input;
    return input;
}

export default TaintController;
