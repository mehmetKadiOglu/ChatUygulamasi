package com.example.demo.cache;

import com.hazelcast.config.Config;
import com.hazelcast.config.MulticastConfig;
import com.hazelcast.config.TcpIpConfig;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public Config hazelcastConfig(){
        Config config = new Config();
        config.setInstanceName("hazelcast-config");
        config.getNetworkConfig().getJoin().setMulticastConfig(new MulticastConfig().setEnabled(false));
        config.getNetworkConfig().getJoin().setTcpIpConfig(new TcpIpConfig().setEnabled(true).setMembers(Collections.singletonList("127.0.0.1:9902")));
        config.getNetworkConfig().setPort(9902);
        return config;

    }
}
