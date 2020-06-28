package com.example.demo.cache;

import com.example.demo.pojo.PrivateRoomSocketPojo;
import com.example.demo.pojo.WebSocketPojo;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@CacheConfig(cacheNames = "storage")
public class CommonCache {

    public final String SOCKET_SIZE = "SOCKET_SIZE";
    public final  String EMPTY_CONNECTION_SIZE = "EMPTY_CONNECTION_SIZE";
    public final  String USERS_SOCKET = "USERS_SOCKET";
    public final String PRIVATE_ROOM_SOCKET_POJO = "PRIVATE_ROOM_SOCKET_POJO";

    @Cacheable(key = "#p0")
    public List<String> getPrivateRoomUser(String odaKey){
        return new ArrayList<>();
    }

    @CachePut(key = "#p0")
    public List<String> setPrivateRoomUser(String odaKey, List<String> privateRoomUsers){
        return privateRoomUsers;
    }


    @Cacheable(key = "#p0")
    public WebSocketPojo getWebSocketPojo(int socketKey){
        return new WebSocketPojo();
    }

    @CachePut(key = "#p0")
    public WebSocketPojo setWebSocketPojo(int socketKey, WebSocketPojo socketPojo){
        return socketPojo;
    }

    @CacheEvict(key = "#p0")
    public void deleteWebSocketPojo(int socketKey) {}

    @Cacheable(key = "#root.target.SOCKET_SIZE")
    public int getWebsocketSize(){
        return  0;
    }

    @CachePut(key = "#root.target.SOCKET_SIZE")
    public int setWebSocketSize(int socketSize){
        return socketSize;
    }


    @Cacheable(key = "#root.target.EMPTY_CONNECTION_SIZE")
    public int getEmptyConnectionSize(){
        return  0;
    }

    @CachePut(key = "#root.target.EMPTY_CONNECTION_SIZE")
    public int setEmptyConnectionSize(int socketSize){
        return socketSize;
    }

    @Cacheable(value = USERS_SOCKET, key = "#p0")
    public PrivateRoomSocketPojo getPrivateRoomSocketPojo(String roomKey){
        return new PrivateRoomSocketPojo();
    }

    @CachePut(value = USERS_SOCKET,  key = "#p0")
    public PrivateRoomSocketPojo setPrivateRoomSocketPojo(String roomKey, PrivateRoomSocketPojo roomSocketPojo){
        return roomSocketPojo;
    }
}
