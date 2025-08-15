'use strict';

export const transformDate = dateStr => {
    const dateObj: any = {};
    
    if (!dateStr || !/^\d{8}$/.test(dateStr)) {
        return dateObj;
    }
    
    // 如果是纯数字先转换成字符串
    dateStr = dateStr.toString();
    const dateArr = dateStr.match(/(\d{4})(\d{2})(\d{2})/);
    
    dateObj.year = dateArr[1];
    dateObj.month = dateArr[2];
    dateObj.day = dateArr[3];
    
    return dateObj;
};

/**
 * 获取当前时间下一个月份,带年
 *
 * @return {Object} 时间对象
 */
export function getCurrentNextMonth() {
    const now = new Date();
    
    now.setMonth(now.getMonth() + 1, 1); // 强制指定为每个月的1号,防止3月31日调用变成5月1日
    
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
    };
}
