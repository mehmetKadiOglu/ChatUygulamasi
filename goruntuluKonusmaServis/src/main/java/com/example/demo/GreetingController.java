package com.example.demo;

import com.example.demo.cache.CommonCache;
import com.example.demo.pojo.PrivateRoomLoginResponsePojo;
import com.example.demo.pojo.PrivateRoomPOJO;
import com.example.demo.pojo.PrivateRoomSocketPojo;
import com.example.demo.pojo.WebSocketPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@CrossOrigin(allowedHeaders = {"User_Header"})
public class GreetingController {

    @Autowired
    CommonCache commonCache;

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public ResponseEntity<Greeting> greeting(HelloMessage message) {
        Greeting greeting =  new Greeting(message.getName());
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Baeldung-Example-Header",
                "Value-ResponseEntityBuilderWithHttpHeaders");
        return ResponseEntity.ok().header(String.valueOf(responseHeaders)).body(greeting);
    }

    @GetMapping
    public ResponseEntity<Greeting> Mesaj(){
        Greeting greeting =  new Greeting("Mesaj");
        return ResponseEntity.ok(greeting);
    }


    @PostMapping(path = "/privateRoomRegister")
    public void privateRoomRegister(PrivateRoomPOJO roomPOJO){
        commonCache.setPrivateRoomUser(roomPOJO.getOdaKey(), roomPOJO.getUserList());
        PrivateRoomSocketPojo privateRoomSocketPojo = getSocketPort();
        commonCache.setPrivateRoomSocketPojo(roomPOJO.getOdaKey(), privateRoomSocketPojo);
    }

    @PostMapping(path = "/privateRoomLogin")
    public ResponseEntity<PrivateRoomLoginResponsePojo> privateRoomLogin(String odaKey,  String userName){
        List<String> userList = commonCache.getPrivateRoomUser(odaKey);
        int userId = userList.indexOf(userName);
        if (userId != -1){
            PrivateRoomLoginResponsePojo loginResponsePojo = new PrivateRoomLoginResponsePojo();
            loginResponsePojo.setPrivateRoomSocketPojo(commonCache.getPrivateRoomSocketPojo(odaKey));
            loginResponsePojo.setUserId(String.valueOf(userId + 1));
            return ResponseEntity.ok(loginResponsePojo);
        }
        return ResponseEntity.ok(new PrivateRoomLoginResponsePojo());
    }

    private PrivateRoomSocketPojo getSocketPort(){

        int socketIndex = findEmptySocket();
        PrivateRoomSocketPojo privateRoomSocketPojo = createPrivateRoomSocketPojo(socketIndex);
        updateWebSocketPojoCache(socketIndex);


        if (commonCache.getEmptyConnectionSize() < 3 ){
            System.out.println("şlfdgşdf");
            //socket Kaldir ancak bir sonrakini kontrol et kalmış var mı.
        }


       return privateRoomSocketPojo;
    }

    private int findEmptySocket(){
        int socketSize = commonCache.getWebsocketSize();
        for (int socketIndex = 1 ; socketIndex<=socketSize; socketIndex++)
            if (commonCache.getWebSocketPojo(socketIndex).getMemberSize()<40)
                return socketIndex;
        return -1;
    }
    private PrivateRoomSocketPojo createPrivateRoomSocketPojo(int socketIndex){
        PrivateRoomSocketPojo privateRoomSocketPojo = new PrivateRoomSocketPojo();
        WebSocketPojo webSocketPojo = commonCache.getWebSocketPojo(socketIndex);

        privateRoomSocketPojo.setSocketPort(webSocketPojo.getSocketPort());
        privateRoomSocketPojo.setBrokerName(webSocketPojo.getBroker());
        privateRoomSocketPojo.setSocketId(socketIndex);

        return privateRoomSocketPojo;
    }

    private void updateWebSocketPojoCache(int socketIndex){
        commonCache.setEmptyConnectionSize(commonCache.getEmptyConnectionSize() - 1);
        WebSocketPojo webSocketPojo = commonCache.getWebSocketPojo(socketIndex);
        webSocketPojo.getBroker();
        webSocketPojo.increaseMemberSize();
        commonCache.setWebSocketPojo(socketIndex, webSocketPojo);
    }

}