/*
 * Ant Group
 * Copyright (c) 2004-2022 All Rights Reserved.
 */
package com.alipay.clouduapmng;

import org.slf4j.MDC;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.boot.context.event.ApplicationFailedEvent;
import org.springframework.boot.context.event.ApplicationPreparedEvent;
import org.springframework.boot.context.event.ApplicationStartingEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.GenericApplicationListener;
import org.springframework.core.Ordered;
import org.springframework.core.ResolvableType;
import org.springframework.core.env.ConfigurableEnvironment;

import java.util.Arrays;
import java.util.List;

/**
 * @author ziqiy
 * @version MDCPropertiesForwarder.java, v 0.1 2022年05月23日 10:27 上午 ziqiy
 */
public class MDCPropertiesForwarder implements GenericApplicationListener {
    public static final int DEFAULT_ORDER = Ordered.HIGHEST_PRECEDENCE + 10;
    private static final Class<?>[] EVENT_TYPES = {ApplicationStartingEvent.class,
            ApplicationEnvironmentPreparedEvent.class, ApplicationPreparedEvent.class,
            ContextClosedEvent.class, ApplicationFailedEvent.class};
    private static final Class<?>[] SOURCE_TYPES = {SpringApplication.class,
            ApplicationContext.class};
    /**
     * 会将配置文件里面指定的配置传递到 log4j 的 Thread Context Map(MDC).
     * log4f xml 引用方式: ${ctx:your.property.key}
     */
    private final List<String> forward2MDCKeys = Arrays.asList(
            "spring.application.name",
            "logging.path",
            "logging.level.com.alipay.cloudsrpmng",
            "sls.log.project",
            "sls.log.endpoint",
            "sls.log.accessKeyId",
            "sls.log.accessKeySecret",
            "sls.log.logStore.common-error"
    );

    @Override
    public boolean supportsEventType(ResolvableType resolvableType) {
        return isAssignableFrom(resolvableType.getRawClass(), EVENT_TYPES);
    }

    @Override
    public boolean supportsSourceType(Class<?> sourceType) {
        return isAssignableFrom(sourceType, SOURCE_TYPES);
    }

    @Override
    public int getOrder() {
        return DEFAULT_ORDER;
    }

    @Override
    public void onApplicationEvent(ApplicationEvent applicationEvent) {
        if (applicationEvent instanceof ApplicationEnvironmentPreparedEvent) {
            ConfigurableEnvironment env = ((ApplicationEnvironmentPreparedEvent) applicationEvent).getEnvironment();
            for (String forward2MDCKey : forward2MDCKeys) {
                forward2MDC(env, forward2MDCKey);
            }

            // for SOFATracer (com.alipay.common.tracer.core.appender.TracerLogRootDaemon)
            setupLoggingPath4Tracert(env);
        }
    }

    private void setupLoggingPath4Tracert(ConfigurableEnvironment env) {
        // set logging.path to System Property for Tracer
        String loggingPath = env.getProperty("logging.path");
        if (loggingPath != null && !loggingPath.isEmpty()) {
            System.setProperty("logging.path", loggingPath);
        }
    }

    private boolean isAssignableFrom(Class<?> type, Class<?>... supportedTypes) {
        if (type != null) {
            for (Class<?> supportedType : supportedTypes) {
                if (supportedType.isAssignableFrom(type)) {
                    return true;
                }
            }
        }
        return false;
    }

    private void forward2MDC(ConfigurableEnvironment env, String propertyKey) {
        String propertyValue = env.getProperty(propertyKey);
        if (propertyValue != null) {
            MDC.put(propertyKey, propertyValue);
        }
    }
}
