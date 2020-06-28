package com.example.demo.pojo;

import java.io.Serializable;

public class PrivateRoomSocketPojo implements Serializable {
    private int socketId;
    private String socketPort;
    private String brokerName;

    public int getSocketId() {
        return socketId;
    }

    public void setSocketId(int socketId) {
        this.socketId = socketId;
    }

    public String getBrokerName() {
        return brokerName;
    }

    public void setBrokerName(String brokerName) {
        this.brokerName = brokerName;
    }

    public String getSocketPort() {
        return socketPort;
    }

    public void setSocketPort(String socketPort) {
        this.socketPort = socketPort;
    }
}
