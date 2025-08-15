package com.alipay.sts.jdtplus.antgraph.util;

import java.util.ArrayList;
import java.util.List;

// 定义一个泛型类
class Box<T> {
    private T item;

    // 设置值
    public void setItem(T item) {
        this.item = item;
    }

    // 获取值
    public T getItem() {
        return item;
    }
}

// 定义一个带泛型方法的工具类
class Utils {
    // 泛型方法：打印列表中的所有元素
    public static <E> void printList(List<E> list) {
        for (E element : list) {
            System.out.println(element);
        }
    }

    // 泛型方法：返回两个值中较大的一个（要求类型实现 Comparable 接口）
    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) > 0 ? a : b;
    }
}

public class GenericExample {
    public static void main(String[] args) {
        // 使用泛型类
        Box<String> stringBox = new Box<>();
        stringBox.setItem("Hello, Generics!");
        System.out.println("Box contains: " + stringBox.getItem());

        Box<Integer> integerBox = new Box<>();
        integerBox.setItem(123);
        System.out.println("Box contains: " + integerBox.getItem());

        // 使用泛型方法
        List<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");

        System.out.println("Names in the list:");
        Utils.printList(names);

        // 使用带约束的泛型方法
        String strMax = Utils.max("apple", "banana");
        System.out.println("Max string: " + strMax);

        Integer intMax = Utils.max(10, 20);
        System.out.println("Max integer: " + intMax);

        // 使用通配符
        List<? extends Number> numbers = new ArrayList<>();
        // numbers.add(42); // 编译错误：不能向通配符类型添加元素
        System.out.println("Numbers list is empty: " + numbers.isEmpty());
    }
}
