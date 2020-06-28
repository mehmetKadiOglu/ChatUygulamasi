package com.example.demo.pojo;

public class PrivateRoomLoginResponsePojo {
    private  PrivateRoomSocketPojo  privateRoomSocketPojo;
    private String userId;

    public PrivateRoomSocketPojo getPrivateRoomSocketPojo() {
        return privateRoomSocketPojo;
    }

    public void setPrivateRoomSocketPojo(PrivateRoomSocketPojo privateRoomSocketPojo) {
        this.privateRoomSocketPojo = privateRoomSocketPojo;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
