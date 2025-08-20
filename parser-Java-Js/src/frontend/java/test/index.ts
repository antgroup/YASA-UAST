import fs from 'fs'
import { assert } from 'chai'
import path from 'path'
import * as parser from '../parser'
import { parse, parseImport, parsePackage, parseClass, parseClassBody, parseInstruction } from './utils'
import * as UAST from '@ant-yasa/uast-spec';
import testCases from './benchmark/benchmark.json';

describe('#parse', function () {
    it('parses test file correctly', function () {
        const testSolPath = path.resolve(__dirname, 'benchmark', 'test.java')
        const content = fs.readFileSync(testSolPath)
        const ast = parser.parse(content.toString(), { sourcefile: testSolPath });
        console.log(JSON.stringify(ast, null, 2));
    })
})

describe('#AST', function () {
    for (const caseName in testCases) {
        if (caseName.startsWith('_test')) {
            const testCase = testCases[caseName];
            it(caseName.substring(5), function () {
                const ast: any = testCase.parse(testCase.test, { sourcefile: '' });
                if (testCase.debug) {
                    console.log(JSON.stringify(stripMeta(ast), null, 2));
                }
                console.log(`===== ${caseName.substring(5)} ========`)
                console.log(UAST.prettyPrint(ast));
                console.log('================================\n');
                assertNodeEqual(ast, testCase.expected);
            })
        }

    }
})

describe('#for debug', function () {
    it('print', function () {
        const testCase = {
            // test: `(int even, int odd) -> even + odd;`,
            // test: `void foo() { a = b;return a;}`,
            // test: `@Retention(RetentionPolicy.RUNTIME)class Person { void foo(int a, int c){a = b; return a;}}`,
//             test: `/*
//  * Ant Group
//  * Copyright (c) 2004-2022 All Rights Reserved.
//  */
// package com.alipay.awatch.module.rdata.config.model;
//
// import com.alipay.awatch.module.rdata.Constants;
// import com.alibaba.fastjson.annotation.JSONField;
// import com.alibaba.fastjson.serializer.SerializerFeature;
// import lombok.Data;
//
// import java.util.Map;
//
// /**
//  * 默认 Spring 配置
//  *
//  * @author qier.lqe
//  * @version DefaultPropertyConfig.java, v 0.1 2022-05-26 14:54 qier.lqe
//  */
// @Data
// public class DefaultPropertyConfig extends BasePileConfig {
//     /**
//      * 要额外加载的 property 值，覆盖 config/echox.properties 里的值
//      */
//     @JSONField(serialzeFeatures = { SerializerFeature.WriteMapNullValue })
//     private Map<String, Object> overrides;
// }`,
//             test: `public @interface TvmPermission {
//        /**
//      * 权限校验器类型
//      *
//      * @return
//      */
//     PermissionCheckerEnum permissionChecker() default PermissionCheckerEnum.PERMISSION_CODE;
//
//     /**
//      * 操作类型
//      */
//     OperationTypeEnum operationType();
//
//     /**
//      * 角色码，使用BUSERVICE维护用户与角色关系
//      */
//     RoleCodeEnum roleCode();
//
//     /**
//      * 强弱鉴权模式，默认为false 当为true时，则仅判断当前用户是否有某指定角色 当为false时，则当用户无权限码权限时，还会判定用户是否有该漏洞权限
//      */
//     boolean strictMode() default false;
//
//     /**
//      * 所访问的资源ID所在参数序号，从0开始，如strictMode为true时，无需定义此值
//      */
//     int resourceIdArgsIdx() default -1;
//
//     /**
//      * 所访问资源ID所在的feild 如参数本身为简单类型，如int、long等数字类型，则无需定义此值 如参数本身为一个类，则需要定义漏洞ID在对类的字段 如入参类为UpdateVulRequest，则resourceIdArgsField定义为：vulId
//      * 如字段存在类嵌套时，则resourceIdArgsField定义为：object1.object2.filed 注意：类必须实现标准的资源ID get 函数
//      */
//     String resourceIdArgsField() default "";
//
//     /*
//      * 是否能通过token访问
//      */
//     boolean isToken() default false;
// }`,
            test: `
import com.alipay.drm.client.manager.DistributedResourceManager;
class Test{
  public static void main(String[] args) {
      DistributedResourceManager manager = (DistributedResourceManager) target.getRetObject();
  }
};
`,
            expected: {},
            parse: parse,
            debug: true,
        }

        const ast: any = testCase.parse(testCase.test, { sourcefile: '' });
        console.log(UAST.prettyPrint(ast));
        console.log(JSON.stringify(stripMeta(ast), null, 2));
    })
})


function assertNodeEqual(node, expected) {
    node = stripMeta(node);
    expected = stripMeta(expected);
    assert.deepEqual(node, expected);
}

function stripMeta(node) {
    if (!node) {
        return;
    }
    if (Array.isArray(node)) {
        return node.map(n => stripMeta(n));
    }
    if (node instanceof Object) {
        if (node._meta && Object.keys(node._meta).length === 0) {
            delete node._meta;
        }
        delete node.loc;
        for (const prop in node) {
            stripMeta(node[prop]);
        }
        return node;
    }

    return node;
}

