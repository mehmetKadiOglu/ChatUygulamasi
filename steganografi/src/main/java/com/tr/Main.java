package com.tr;

import com.tr.FxmlController.SteganografiPaneController;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.fxml.JavaFXBuilderFactory;
import javafx.scene.Scene;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Stage;

import java.io.IOException;

public class Main extends Application {
    public static Stage baseStage;
    public static void main(String[] args) {
        launch(args);
    }

    public void start(Stage primaryStage) throws Exception {

        SteganografiPaneController controller = (SteganografiPaneController) openSubStage();
        Scene scene = new Scene(controller.getBasePane(),1100,650);
        baseStage = primaryStage;
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private Initializable openSubStage() throws IOException {
        FXMLLoader fxmLoader = new FXMLLoader();
        fxmLoader.setBuilderFactory(new JavaFXBuilderFactory());
        fxmLoader.setLocation(Main.class.getResource("/SteganografiFxml.fxml"));
        fxmLoader.load();

        return (Initializable) fxmLoader.getController();
    }
    private AnchorPane openFxml() throws IOException {
        return new FXMLLoader(Main.class.getResource("/SteganografiFxml.fxml")).load();

    }
}
