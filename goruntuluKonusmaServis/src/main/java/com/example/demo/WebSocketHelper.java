package com.example.demo;

import com.example.demo.cache.CommonCache;
import com.example.demo.pojo.WebSocketPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;

@Component
public class WebSocketHelper {

    @Autowired
    CacheManager cacheManager;
    private CommonCache commonCache;
    private HashMap<String, Process> socketProcess;
    private Queue<String> queuePortNumber;
    private static WebSocketHelper webSocketHelper;


    @PostConstruct
    private void init(){
        this.socketProcess = new HashMap<>();
        this.initQueueBroker();
    }
    @Autowired
    private void setCommonCache(CommonCache commonCache){
        this.commonCache = commonCache;
    }
    @Autowired
    private void setWebSocketHelper(WebSocketHelper webSocketHelper){
        WebSocketHelper.webSocketHelper = webSocketHelper;
    }

    @PreDestroy
    public void onDestroy() throws Exception {
        this.socketProcess.forEach((key, val) -> val.destroy());
    }

    public static WebSocketHelper getInstance(){
        return webSocketHelper;
    }

    // 10 adet port setlendi.
    private void initQueueBroker(){
        this.queuePortNumber = new LinkedList<>();
        for (int portIndex = 8081 ; portIndex <= 8091; portIndex++)
            queuePortNumber.add(String.valueOf(portIndex));
    }

    private String getPortNumber(){
        return this.queuePortNumber.remove();
    }
    private void addPortNumber(String portNumber){
        this.queuePortNumber.add(portNumber);
    }

    public void destroySocket(){
        int socketSize = commonCache.getWebsocketSize();
        WebSocketPojo webSocketPojo = commonCache.getWebSocketPojo(socketSize);
        socketProcess.get(webSocketPojo.getSocketPort()).destroy();
        socketProcess.remove(webSocketPojo.getSocketPort());
        commonCache.deleteWebSocketPojo(socketSize);
        commonCache.setWebSocketSize(socketSize - 1);
        commonCache.setEmptyConnectionSize(commonCache.getEmptyConnectionSize() - 10);

    }

    public void standUpSocket(){
        String portNumber =  runtimeExecSocketJar();
        WebSocketPojo webSocketPojo = createWebSocketPojo(portNumber);
        putCacheWebSocketPojo(webSocketPojo);
    }
    private String runtimeExecSocketJar(){
            String portNumber = getPortNumber();
        try {
           //java -jar -Dserver.port=8081
            System.out.println(DemoApplication.class.getResource("/websocket.jar").getPath());
            System.out.println(DemoApplication.class.getResource("/websocket.jar").getPath().substring(1) + " " + portNumber );
            System.out.println("**************************************");
            socketProcess.put(portNumber, Runtime.getRuntime().exec("java -jar "+ DemoApplication.class.getResource("/websocket.jar").getPath().substring(1) + " " + portNumber ));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return portNumber;
    }
    private WebSocketPojo createWebSocketPojo(String portNumber){
        WebSocketPojo webSocketPojo = new WebSocketPojo();
        webSocketPojo.setSocketPort(portNumber);
        return webSocketPojo;
    }
    private void putCacheWebSocketPojo(WebSocketPojo webSocketPojo){
        commonCache.setWebSocketSize(commonCache.getWebsocketSize() + 1);
        commonCache.setWebSocketPojo(commonCache.getWebsocketSize(), webSocketPojo);
        commonCache.setEmptyConnectionSize(commonCache.getEmptyConnectionSize() + 10);
    }
}
