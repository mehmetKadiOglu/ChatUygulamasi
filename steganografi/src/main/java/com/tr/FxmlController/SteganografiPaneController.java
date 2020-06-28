package com.tr.FxmlController;

import com.tr.Main;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TextArea;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.AnchorPane;
import javafx.stage.FileChooser;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ResourceBundle;

public class SteganografiPaneController implements Initializable {


    BufferedImage processingImage = null;
    File file;
    HashMap<String, String> turkceKarakter = null;


    @FXML
    AnchorPane basePane;
    @FXML
    ImageView imageFxml;

    @FXML
    Button imageChose;
    @FXML
    Button decode;
    @FXML
    Button encode;

    @FXML
    TextArea textAreaFxml;

    public void initialize(URL location, ResourceBundle resources) {
        this.initFxmlClick();
        this.imageFxml.setFitHeight(380);
        this.imageFxml.setFitWidth(450);
        this.initTurkceKarakterHashMap();
    }
    private void initFxmlClick(){
        imageChose.setOnMouseClicked(event->{
            FileChooser fileChooser = new FileChooser();
            fileChooser.setTitle("Open Resource File");
            this.file = fileChooser.showOpenDialog(Main.baseStage);
            try {
                if (this.file != null){
                    processingImage = ImageIO.read(this.file);
                    imageFxml.setImage(new Image(file.toURI().toString()));
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
    });

        encode.setOnMouseClicked(event -> {
            if (processingImage != null){
                this.encodeText(textAreaFxml.getText());
                textAreaFxml.setText("");
                processingImage = null;
            }
            else
                this.hataMesaji();

        });
        decode.setOnMouseClicked(event -> {
            if (processingImage != null){
                this.decodeText();
                processingImage = null;
            }
            else
                this.hataMesaji();
        });

    }

    private void hataMesaji(){
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Hata");
        alert.setHeaderText(null);
        alert.setContentText("Lütfen Resim Seçiniz");
        alert.showAndWait();
    }

    private void initTurkceKarakterHashMap(){
        this.turkceKarakter = new HashMap<>();
        turkceKarakter.put("ğ","g");
        turkceKarakter.put("Ğ","G");
        turkceKarakter.put("ç","c");
        turkceKarakter.put("Ç","C");
        turkceKarakter.put("Ş","S");
        turkceKarakter.put("ş","s");
        turkceKarakter.put("Ü","U");
        turkceKarakter.put("ü","u");
        turkceKarakter.put("ö","o");
        turkceKarakter.put("Ö","O");
        turkceKarakter.put("ı","i");
        turkceKarakter.put("İ","I");
    }

    private void encodeText(String metin){
        StringBuilder stringBuffer = new StringBuilder("00000000");
        stringBuffer.charAt(1);
        String bit = textToBit(metin);
        String [] rgbBit = new String[3];
        int bitIndex = 0;
        BufferedImage image2 = new BufferedImage(processingImage.getWidth(), processingImage.getHeight(), BufferedImage.TYPE_INT_RGB);
        for (int i = 0; i < processingImage.getWidth(); i++) {
            for (int j = 0; j < processingImage.getHeight(); j++) {
                int [] rgbArray = this.processingImage.getRaster().getPixel(i, j, new int[4]);
                for (int rgb =0; rgb<3; rgb++){
                    if (bitIndex >= bit.length()) {
                        if (stringBuffer.length()>0){
                            rgbBit[rgb] = checkBitSize(Integer.toString(rgbArray[rgb], 2)).substring(0, 7) + stringBuffer.charAt(0);
                            stringBuffer.deleteCharAt(0);
                        }else{
                            rgbBit[rgb] = checkBitSize(Integer.toString(rgbArray[rgb], 2));
                        }
                    } else {
                        rgbBit[rgb] = checkBitSize(Integer.toString(rgbArray[rgb], 2)).substring(0, 7) + bit.charAt(bitIndex++);
                    }
                }
                int red = Integer.parseInt(rgbBit[0], 2);
                int green = Integer.parseInt(rgbBit[1], 2);
                int blue = Integer.parseInt(rgbBit[2], 2);
                image2.getRaster().setPixel(i, j, new int[]{red, green, blue});
            }
        }

        try {
            ImageIO.write(image2, "png", new File(getImagePath()+".png"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String getImagePath(){
       String root =  file.getParent();
       String fileName = file.getName().split("\\.")[0];
       return root+ "\\" +fileName+"xx";
    }
    private String textToBit(String metin){
        String bit = "";
        String turkceKarakter = null;
        for (int index = 0; index<metin.length(); index++){
            if ( (turkceKarakter = this.turkceKarakter.get(String.valueOf(metin.charAt(index)))) != null)
                bit += checkBitSize(Integer.toBinaryString(turkceKarakter.charAt(0)));
                else
            bit += checkBitSize(Integer.toBinaryString(metin.charAt(index)));
        }
        return bit;
    }


    private void decodeText(){
        List<String> metinArray = new ArrayList<>();
        String textBit = "";
        String metin = "";
        int size = 0;
        outerloop:
        for (int i = 0; i < processingImage.getWidth(); i++) {
            for (int j = 0; j < processingImage.getHeight() ; j++) {
                int [] rgbArray = processingImage.getRaster().getPixel(i, j, new int[3]);
                for (int rgbIndex=0; rgbIndex<3; rgbIndex++){
                    textBit += checkBitSize(Integer.toString(rgbArray[rgbIndex], 2)).substring(7, 8);
                    if (++size == 8){
                        if (textBit.equals("00000000")){
                            break outerloop;
                        }else{
                            metinArray.add(textBit);
                            textBit = "";
                            size = 0;
                        }
                    }
                }
            }
        }

        for (String bit : metinArray){
            metin += (char)Integer.parseInt(bit, 2);
        }
        textAreaFxml.setText(metin);
    }

    private String checkBitSize(String bit){
        for (; bit.length()<8 ;){
            bit = "0" + bit;
        }
        return bit;
    }
    // resim işlem bitiş



    public AnchorPane getBasePane() {
        return basePane;
    }

}
