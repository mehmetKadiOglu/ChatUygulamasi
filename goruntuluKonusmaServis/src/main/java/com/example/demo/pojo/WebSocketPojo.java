package com.example.demo.pojo;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.Queue;

public class WebSocketPojo implements Serializable {
    private String socketPort;
    private int memberSize;

    Queue<String> queueBroker;


    public WebSocketPojo() {
        this.init();
    }

    private void init(){
        this.setMemberSize();
        this.initQueueBroker();
    }
    private void initQueueBroker(){
        this.queueBroker = new LinkedList<>();
        for (int brokerIndex = 1 ; brokerIndex <= 10; brokerIndex++)
            queueBroker.add("broker" + brokerIndex);
    }

    public String getSocketPort() {
        return socketPort;
    }

    public void setSocketPort(String socketPort) {
        this.socketPort = socketPort;
    }

    public int getMemberSize() {
        return memberSize;
    }

    private void setMemberSize(){
         this.memberSize = 0;
    }

    public void increaseMemberSize() {
        this.memberSize = memberSize + 4;
    }

    public String getBroker(){
        return this.queueBroker.remove();
    }

    public void addBroker(String broker){
        this.queueBroker.add(broker);
    }


}
