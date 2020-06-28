package com.example.demo.pojo;

import java.util.HashMap;
import java.util.List;

public class PrivateRoomPOJO {
    private List<String> userList;
    private String odaKey;

    public List<String> getUserList() {
        return userList;
    }

    public void setUserList(List<String> userList) {
        this.userList = userList;
    }

    public String getOdaKey() {
        return odaKey;
    }

    public void setOdaKey(String odaKey) {
        this.odaKey = odaKey;
    }
}
