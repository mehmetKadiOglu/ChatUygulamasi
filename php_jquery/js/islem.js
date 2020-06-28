$(function name() {


    //websocket ile konu gönderimi tamamlandı
    //websocket ile yorum gönderimi tamamlandı
    // websocket ile konu silme tamamlandı. Kullanici odaklı yapıldı.
    // websocket ile yorum silme tamamlandı. Kullanici odaklı yapıldı.

    // Guncelleme yapılmadı
    // yorum divin keyini değiştir


    /*
    !! Mysql veri tabanı için BaseCommand = MysqlCommand 
    !! MongoDB veri tabanı için BaseCommand = MongoDbCommand 


    !! Kullanici kayit için command = kayitYap
    !! Kullanici giris için command = girisYap
    !! Yorumları getirmek için command = yorumlariGetir
    !! Konuları getirmek için command = konulariGetir
    !! Konu acmak için command = konuAc
    !! Yorum yapmak için command = yorumYap
    !! Yorum silmek için command = yorumSil
    !! Konu silmek için command = konuSil
    */

    class KullaniciKayit {

        islemBaslat() {


            $.PhpIslem.AjaxIslem(this.ajaxPostDataHazirla()).then(function (sonuc) {
                if (sonuc["Basarili"])
                    alert(sonuc["Basarili"]);
                else
                    alert(sonuc["Hata"]);


            });
        }
        ajaxPostDataHazirla() {

            let ad = $.SayfaIslem.FormValue("[name=adText]");
            let soyad = $.SayfaIslem.FormValue("[name=soyAdText]");
            let mail = $.SayfaIslem.FormValue("[name=mailText]");
            let sifre = $.SayfaIslem.FormValue("[name=sifreText]");
            let data = "kullaniciAd=" + ad + "&kullaniciSoyAd=" + soyad + "&mail=" + mail + "&sifre=" + sifre + "&Command=kayitYap&BaseCommand=MysqlCommand";
            $.SayfaIslem.ValueSifirla("[name=sifreText],[name=mailText],[name=soyAdText],[name=adText]");

            return data;
        }
    }
    class KullaniciGiris {

        islemBaslat() {
            $.PhpIslem.AjaxIslem(this.ajaxPostDataHazirla()).then(function (sonuc) {
                if (sonuc["Hata"])
                    alert(sonuc["Hata"]);
                else if (sonuc["Post_Hatasi"])
                    alert(sonuc["Post_Hatasi"]);
                else {
                    KULLANICI_MAIL = sonuc["kullanici"];
                    $.Yonlendirici.BasariliGirisIslem(sonuc["kullanici"]);
                }

            });
        }
        ajaxPostDataHazirla() {

            let kullaniciMail = $.SayfaIslem.FormValue("[name=kullaniciMail]");
            //let sifre = $.SayfaIslem.FormValue("[name=kullaniciSifre]");


            //let kullaniciMail = "admin@admin.com";
            //let kullaniciMail = "mehmet@mehmet";
            let sifre = "123456";
            let data = "mail=" + kullaniciMail + "&sifre=" + sifre + "&Command=girisYap&BaseCommand=MysqlCommand";

            $.SayfaIslem.ValueSifirla("[name=kullaniciMail],[name=kullaniciSifre]");

            return data;
        }
    }
    class YorumlariGetir {

        islemBaslat() {

            $.PhpIslem.AjaxIslem(this.ajaxPostDataHazirla()).then(function (data) {

                $.Yonlendirici.YorumDivBas(data["data"]);
            });
        }
        ajaxPostDataHazirla() {
            // let parentKey = $.SayfaIslem.AttrValue("#yorumKonuDiv", "key");
            let data = "parentKey=" + GLOBAL_YORUMLARIN_KONU_KEYI + "&Command=yorumlariGetir&BaseCommand=MongoDbCommand";
            return data;
        }

    }
    class KonulariGetir {

        islemBaslat() {

            $.PhpIslem.AjaxIslem(this.ajaxPostDataHazirla()).then(function (sonuc) {
                if (sonuc["Hata"])
                    alert(sonuc["Hata"]);
                else {
                    $.Yonlendirici.KonuDivBas(sonuc["data"]);
                    $.Yonlendirici.normalOdaGonderilenResimlerInit(sonuc["data"]);
                }

            });
        }
        ajaxPostDataHazirla() {
            return "Command=konulariGetir&BaseCommand=MongoDbCommand";
        }

    }
    class KonuAc {

        islemBaslat() {

            $.PhpIslem.AjaxIslem(this.ajaxPostDataHazirla()).then(function (veri) {
                if (veri["Hata"])
                    alert(veri["Hata"]);
                else {
                    if (OLUSTURULAN_ODA_TURU == "OZEL") {
                        OZEL_ODA_KULLANICI["odaKey"] = veri.anahtar;
                        $.JavaIslem.AjaxIslem(OZEL_ODA_KULLANICI, "/privateRoomRegister");
                    }
                    $.PHPWebSocketIslem.SocketKonuMetniGonder(veri);
                }
                OLUSTURULAN_ODA_TURU = "NORMAL";
            });
        }
        ajaxPostDataHazirla() {

            let konu = $.SayfaIslem.FormValue("#konuInput");
            let konuText = $.SayfaIslem.FormValue("#konuMetin");
            $.SayfaIslem.ValueSifirla("#konuInput, #konuMetin, [name='kullanici2'], [name='kullanici3'], [name='kullanici4']");

            let data = "konu=" + konu + "&yazilanMetin=" + konuText + "&ozelOda=" + OLUSTURULAN_ODA_TURU + "&Command=konuAc&BaseCommand=MongoDbCommand";
            return data;
        }

    }
    class YorumYap {

        islemBaslat() {

            $.PhpIslem.AjaxIslem(this.ajaxPostDataHazirla()).then(function (veri) {
                if (veri["Hata"])
                    alert(veri["Hata"]);
                else
                    $.PHPWebSocketIslem.SocketYorumMetniGonder(veri);
            });
        }
        ajaxPostDataHazirla() {

            let metin = $.SayfaIslem.FormValue("#yorumText");
            let parentKey = $.SayfaIslem.AttrValue("#yorumKonuDiv", "key");
            $.SayfaIslem.ValueSifirla("#yorumText");

            let data = "yazilanMetin=" + metin + "&parentKey=" + parentKey + "&Command=yorumYap&BaseCommand=MongoDbCommand";

            return data;
        }
    }
    class YorumSil {
        islemBaslat(yorumDiv) {

            let data = this.ajaxPostDataHazirla(yorumDiv);
            $.PhpIslem.AjaxIslem(data["ajaxVeri"]).then(function (veri) {
                if (veri["Basarili"]) {
                    $.PHPWebSocketIslem.SocketYorumSilmeGonder(GLOBAL_YORUMLARIN_KONU_KEYI, data["yorumKey"]);
                    alert(veri["Basarili"]);
                }
                else {
                    alert(veri["Hata"]);
                }
            });
        }
        ajaxPostDataHazirla(yorumDiv) {

            let array = {};
            array["yorumKey"] = $.SayfaIslem.AttrValue(yorumDiv, "key");
            // let parentKey = $.SayfaIslem.AttrValue("#yorumKonuDiv", "key");
            array["ajaxVeri"] = "yorumKey=" + array["yorumKey"] + "&parentKey=" + GLOBAL_YORUMLARIN_KONU_KEYI + "&Command=yorumSil&BaseCommand=MongoDbCommand";

            return array;
        }
    }
    class KonuSil {

        islemBaslat() {

            $.PhpIslem.AjaxIslem(this.ajaxPostDataHazirla()).then(function (veri) {
                if (veri["Basarili"]) {
                    $.PHPWebSocketIslem.SocketKonuSilmeGonder(GLOBAL_YORUMLARIN_KONU_KEYI);
                    $.Yonlendirici.KonuSilme(GLOBAL_YORUMLARIN_KONU_KEYI);
                    alert(veri["Basarili"]);
                }
                else {
                    alert(veri["Hata"]);
                }

            });
        }
        ajaxPostDataHazirla() {

            //let parentKey = $.SayfaIslem.AttrValue("#yorumKonuDiv", "key");
            let data = "konuKey=" + GLOBAL_YORUMLARIN_KONU_KEYI + "&Command=konuSil&BaseCommand=MongoDbCommand";

            return data;
        }
    }
    class Command {

        constructor() {

            this.nesneDizisi = {};
            this.nesneDizisiDoldur();

        }
        nesneDizisiDoldur() {
            this.nesneDizisi["kullaniciKayit"] = new KullaniciKayit();
            this.nesneDizisi["kullaniciGiris"] = new KullaniciGiris();
            this.nesneDizisi["konuGetir"] = new KonulariGetir();
            this.nesneDizisi["yorumYap"] = new YorumYap();
            this.nesneDizisi["konuAc"] = new KonuAc();
            this.nesneDizisi["yorumlariGetir"] = new YorumlariGetir();
            this.nesneDizisi["yorumSil"] = new YorumSil();
            this.nesneDizisi["konuSil"] = new KonuSil();
        }
        calistir(key) {
            this.nesneDizisi[key].islemBaslat();
        }
        calistir(key, data) {
            this.nesneDizisi[key].islemBaslat(data);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    class BaseYorumKonuTagHazirla {

        privateGetTagHazirlamaDataEleman(key) {
            return this.tagHazirlamaData[key];
        }

        privateSetTagHazirlamaData(data) {
            this.tagHazirlamaData = data;
        }
        tagDataHazirlaTemplate(data) {
            this.privateSetTagHazirlamaData(data);
            this.privateSpanMetinTemizle();
            this.privateSpanMetinHazirla();
        }
        privateSpanMetinHazirla() {

            this.privateSetSpanMetin("Tarih", this.privateGetTagHazirlamaDataEleman("tarih"));
            this.privateSetSpanMetin("Yazan", this.privateGetTagHazirlamaDataEleman("yazanKullanici"));

        }
        privateSpanMetinTemizle() {
            this.spanMetin = {};
        }

        privateSetSpanMetin(key, value) {
            this.spanMetin[key] = value;
        }
        privateGetSpanMetinArray() {
            return this.spanMetin;
        }
        privateGetSpanMetinValue(key) {
            return this.spanMetin[key];
        }

    }
    class KonuTag extends BaseYorumKonuTagHazirla {

        privateSpanMetinHazirla() {

            this.privateSetSpanMetin("Konu", this.privateGetTagHazirlamaDataEleman("konu"));
            super.privateSpanMetinHazirla();

        }

        tagHazirla() {

            let kaplayiciDivAcili = '<div ozelOda=' + this.privateGetTagHazirlamaDataEleman("ozelOda") + ' konuKey=' + this.privateGetTagHazirlamaDataEleman("anahtar") + ' class="konularTextKutu-boyut konularTextKutu-hizalama konularTextKutu-gorsel">';
            let kaplayiciDivKapanis = '</div>';

            let htmlTag = kaplayiciDivAcili + this.privateKonuUstDiv() + this.privateKonuAltDiv() + kaplayiciDivKapanis;

            return htmlTag;
        }

        privateKonuUstDiv() {

            let divAcilis = '<div>';
            let divKapanis = '</div>';
            let spanKapanis = '</span>';
            let metinAyrintiSpan = '<span class="konuTextSpan-hizalama">';
            let spanlar = '';

            for (var key in this.privateGetSpanMetinArray())
                spanlar += (metinAyrintiSpan + key + spanKapanis) + (metinAyrintiSpan + this.privateGetSpanMetinValue(key) + spanKapanis);

            return divAcilis + spanlar + divKapanis;
        }

        privateKonuAltDiv() {

            let divAcilis = '<div class="konuText-boyut konuText-gorsel konuText-hizalama">';
            let divKapanis = '</div>';
            let metin = '<p>' + this.privateGetTagHazirlamaDataEleman("metin") + '</p>';

            return divAcilis + metin + divKapanis;

        }
    }
    class YorumTag extends BaseYorumKonuTagHazirla {

        tagHazirla() {

            let kaplayiciDivAcili = '<div key="' + this.privateGetTagHazirlamaDataEleman("anahtar") + '"  class="yorum-boyut yorum-hizalama yorum-gorsel">';
            let kaplayiciDivKapanis = '</div>';

            let htmlTag = kaplayiciDivAcili + this.privateKonuUstDiv() + this.privateKonuAltDiv() + kaplayiciDivKapanis;

            return htmlTag;
        }

        privateKonuUstDiv() {

            let divAcilis = '<div>';
            let divKapanis = '</div>';
            let spanKapanis = '</span>';
            let metinAyrintiSpan = '<span class="yorumTextSpan-hizalama">';
            let spanlar = '';

            for (var key in this.privateGetSpanMetinArray())
                spanlar += (metinAyrintiSpan + key + spanKapanis) + (metinAyrintiSpan + this.privateGetSpanMetinValue(key) + spanKapanis);

            return divAcilis + spanlar + divKapanis;
        }

        privateKonuAltDiv() {

            let divAcilis = '<div class="yorumText-boyut yorumText-gorsel yorumText-hizalama">';
            let divKapanis = '</div>';
            let metin = '<p>' + this.privateGetTagHazirlamaDataEleman("metin") + '</p>';

            return divAcilis + metin + divKapanis;

        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $.PHPWebSocket = {
        socketAc: function () {
            websocket_server.onopen = function (e) {
            };

        },

        socketHata: function () {

            websocket_server.onerror = function (e) {

            }

        },

        socketDinle: function () {

            websocket_server.onmessage = function (e) {
                var json = JSON.parse(e.data);
                switch (json.type) {
                    case 'konu':
                        data = $.PHPWebSocket.konuSifreCoz(json);
                        console.log(json);
                        console.log(data);
                        let konu = new KonuTag();
                        konu.tagDataHazirlaTemplate(data);
                        $.SayfaIslem.TagPrepend("#konular", konu.tagHazirla());
                        if (data.ozelOda == "NORMAL")
                            NORMAL_ODA_GONDERILEN_RESIMLER[data.anahtar] = [];
                        break;
                    case 'yorum':
                        data = $.PHPWebSocket.yorumSifreCoz(json);
                        let yorum = new YorumTag();
                        yorum.tagDataHazirlaTemplate(data);
                        $.SayfaIslem.TagPrepend("#yorumlarinKutusu", yorum.tagHazirla());
                        break;
                    case 'konuSil':
                        $.Yonlendirici.KonuSilme(json.konuKey);
                        break;
                    case 'yorumSil':
                        $.Yonlendirici.YorumSime(json.yorumKey, json.konuKey);
                        break;
                    case 'resimGonder':
                        $.Yonlendirici.webSocketYeniResimEkle(json);
                        break;
                }
            }

        },
        konuSifreCoz: function (veri) {
            let desifrelenmisData = {};

            SIFRELEME.setSifreSayisal(false);
            desifrelenmisData["konu"] = SIFRELEME.sifreCoz(veri.konu);

            SIFRELEME.setSifreSayisal(true);
            desifrelenmisData["yazanKullanici"] = SIFRELEME.sifreCoz(veri.yazanKullanici);

            SIFRELEME.setSifreSayisal(false);
            desifrelenmisData["metin"] = SIFRELEME.sifreCoz(veri.metin);

            SIFRELEME.setSifreSayisal(true);
            desifrelenmisData["tarih"] = SIFRELEME.sifreCoz(veri.tarih);


            SIFRELEME.setSifreSayisal(false);
            desifrelenmisData["anahtar"] = SIFRELEME.sifreCoz(veri.anahtar);

            SIFRELEME.setSifreSayisal(true);
            desifrelenmisData["ozelOda"] = SIFRELEME.sifreCoz(veri.ozelOda);

            return desifrelenmisData;
        },
        yorumSifreCoz: function (veri) {

            let desifrelenmisData = {};

            SIFRELEME.setSifreSayisal(false);
            desifrelenmisData["anahtar"] = SIFRELEME.sifreCoz(veri.anahtar);

            SIFRELEME.setSifreSayisal(true);
            desifrelenmisData["yazanKullanici"] = SIFRELEME.sifreCoz(veri.yazanKullanici);

            SIFRELEME.setSifreSayisal(false);
            desifrelenmisData["metin"] = SIFRELEME.sifreCoz(veri.metin);

            SIFRELEME.setSifreSayisal(true);
            desifrelenmisData["tarih"] = SIFRELEME.sifreCoz(veri.tarih);

            return desifrelenmisData;
        }

    }
    $.PHPWebSocketIslem = {
        SocketKonuMetniGonder: function (veri) {
            veri["ozelOda"] = OLUSTURULAN_ODA_TURU;
            sifreliVeri = $.PHPWebSocketIslem.sifreleKonu(veri);
            console.log(sifreliVeri);
            websocket_server.send(
                JSON.stringify({
                    'type': 'konu',
                    // 'user_id': kullaniciMail,
                    'konu': sifreliVeri.konu,
                    'kullanici': sifreliVeri.kullanici,
                    'metin': sifreliVeri.metin,
                    'tarih': sifreliVeri.tarih,
                    'anahtar': sifreliVeri.anahtar,
                    'ozelOda': sifreliVeri.ozelOda,
                })
            );
        },
        sifreleKonu: function (veri) {
            let sifrelenmisData = {};
            SIFRELEME.setSifreSayisal(false);
            sifrelenmisData["konu"] = SIFRELEME.sifrele(veri.konu);

            SIFRELEME.setSifreSayisal(true);
            sifrelenmisData["kullanici"] = SIFRELEME.sifrele(veri.kullanici);

            SIFRELEME.setSifreSayisal(false);
            sifrelenmisData["metin"] = SIFRELEME.sifrele(veri.metin);

            SIFRELEME.setSifreSayisal(true);
            sifrelenmisData["tarih"] = SIFRELEME.sifrele(veri.tarih);


            SIFRELEME.setSifreSayisal(false);
            sifrelenmisData["anahtar"] = SIFRELEME.sifrele(veri.anahtar);

            SIFRELEME.setSifreSayisal(true);
            sifrelenmisData["ozelOda"] = SIFRELEME.sifrele(veri.ozelOda);

            return sifrelenmisData;
        },
        SocketYorumMetniGonder: function (veri) {
            sifreliVeri = $.PHPWebSocketIslem.sifreleYorum(veri);
            websocket_server.send(
                JSON.stringify({
                    'type': 'yorum',
                    // 'user_id': kullaniciMail,
                    'anahtar': sifreliVeri.anahtar,
                    'kullanici': sifreliVeri.kullanici,
                    'metin': sifreliVeri.metin,
                    'tarih': sifreliVeri.tarih,
                })
            );
        },
        sifreleYorum: function (veri) {
            sifrelenmisData = {};
            SIFRELEME.setSifreSayisal(false);
            sifrelenmisData["anahtar"] = SIFRELEME.sifrele(veri.anahtar);

            SIFRELEME.setSifreSayisal(true);
            sifrelenmisData["kullanici"] = SIFRELEME.sifrele(veri.kullanici);

            SIFRELEME.setSifreSayisal(false);
            sifrelenmisData["metin"] = SIFRELEME.sifrele(veri.metin);

            SIFRELEME.setSifreSayisal(true);
            sifrelenmisData["tarih"] = SIFRELEME.sifrele(veri.tarih);

            return sifrelenmisData;
        },
        SocketKonuSilmeGonder: function (konuKey) {
            websocket_server.send(
                JSON.stringify({
                    'type': 'konuSil',
                    'konuKey': konuKey,
                })
            );
        },
        SocketYorumSilmeGonder: function (konuKey, yorumKey) {
            websocket_server.send(
                JSON.stringify({
                    'type': 'yorumSil',
                    'konuKey': konuKey,
                    'yorumKey': yorumKey
                })
            );
        },
        SocketResimGönder: function (imageData) {
            websocket_server.send(
                JSON.stringify({
                    'type': 'resimGonder',
                    'konuKey': GLOBAL_YORUMLARIN_KONU_KEYI,
                    'imageData': imageData
                })
            );
        }
    }
    $.JavaWebSocket = {
        socketAc: function (portNumber) {
            var socket = new SockJS('http://localhost:' + portNumber + '/videoTalk');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                stompClient.subscribe("/" + WEB_SOCKET_GORUNTU.WEB_SOCKET_BROKER, function (greeting) {
                    WEB_SOCKET_GORUNTU.GORUNTU_BAS(JSON.parse(greeting.body));
                });
            });
        }
    }
    $.JavaWebSocketIslem = {
        sendImage: function (socketData) {
            stompClient.send('/videoTalk', {}, JSON.stringify(socketData));
        }
    }
    $.PhpIslem = {

        IslemYap: function (id) {
            commandGlobalNesne.calistir(id);
        },

        AjaxIslem: function (veri) {
            return $.ajax({
                url: "Post_Index.php",
                type: "POST",
                data: veri,
                dataType: "json",
            });
        },

        AjaxIslem2: function (veri) {
            $.ajax({
                url: "Post_Index.php",
                type: "POST",
                data: veri,
                dataType: "json",
                error: function (a) {
                    console.log(a);
                    console.log(a.responseText);
                    alert("hata var");
                },
                success: function (cevap) {
                    console.log(cevap);
                }
            });
        }
    }
    $.JavaIslem = {
        AjaxIslem: function (veri, path) {
            return $.ajax({
                url: JAVA_API_URL + path,
                headers: {
                    "User_Header": "User_Header",
                },
                type: "POST",
                data: veri,
                dataType: "json",
            });
        },

        AjaxIslem2: function (veri, path) {
            $.ajax({
                url: JAVA_API_URL + path,
                headers: {
                    "User_Header": "User_Header",
                },
                type: "POST",
                data: veri,
                dataType: "json",
                error: function (a) {
                    console.log(a);
                    console.log(a.responseText);
                    alert("hata var");
                },
                success: function (cevap) {
                    console.log(cevap);
                }
            });
        }
    }
    $.SayfaIslem = {

        AttrValue: function (id, attrId) {
            return $(id).attr(attrId);
        },

        FormValue: function (id) {

            return $(id).val();
        },

        ValueSifirla: function (id) {

            $(id).val("");

        },

        HtmlSifirla: function (id) {
            $(id).html("");
        },

        TagSetAttr: function (id, attr, deger) {
            $(id).attr(attr, deger);
        },

        TagAppent: function (id, data) {
            $(id).append(data);
        },
        TagPrepend: function (id, data) {
            $(id).prepend(data);
        }

    }
    $.Yonlendirici = {

        YorumlarKonuYaz: function (yorumKonuDivKeyAttr, konuHtml) {

            $.SayfaIslem.HtmlSifirla("#yorumlarinKutusu, #yorumKonuDiv");
            $.SayfaIslem.TagAppent("#yorumKonuDiv", konuHtml);
            $.SayfaIslem.TagSetAttr("#yorumKonuDiv", "key", yorumKonuDivKeyAttr)
            GLOBAL_YORUMLARIN_KONU_KEYI = yorumKonuDivKeyAttr;
        },
        YorumDivBas: function (data) {

            let yorumNesne = new YorumTag();

            for (let index = 0; index < data.length; index++) {
                yorumNesne.tagDataHazirlaTemplate(data[index]);
                $.SayfaIslem.TagAppent("#yorumlarinKutusu", yorumNesne.tagHazirla())
            }
        },
        KonuDivBas: function (data) {

            let konuNesne = new KonuTag();
            for (let index = 0; index < data.length; index++) {
                konuNesne.tagDataHazirlaTemplate(data[index]);
                $.SayfaIslem.TagAppent("#konular", konuNesne.tagHazirla())

            }
        },
        normalOdaGonderilenResimlerInit: function (data) {
            for (let index = 0; index < data.length; index++)
                if (data[index].ozelOda == "NORMAL")
                    NORMAL_ODA_GONDERILEN_RESIMLER[data[index].anahtar] = [];

        },
        SocketBaslat: function () {
            $.PHPWebSocket.socketAc();
            $.PHPWebSocket.socketHata();
            $.PHPWebSocket.socketDinle();
        },
        FormSayfasiHazirla: function () {

            $.SayfaIslem.TagSetAttr("#giris", "class", "sakla");
            $.SayfaIslem.TagSetAttr("#konular", "class", "konular-boyut konular-gorsel konular-hizalama");
            $.SayfaIslem.TagSetAttr("#konuFooter_ic", "class", "konuFooter_Ic-boyut konuFooter_Ic-gorsel konuFooter_Ic-hizalama");
        },
        KullaniciGirisTipiIslem: function (kullanici) {

            if (kullanici == "admin@admin.com") {
                $.SayfaIslem.TagSetAttr("#kaydetButton", "onclick", "$.PhpIslem.IslemYap('kullaniciKayit')");
                $.SayfaIslem.TagSetAttr("#kullaniciKayitForm", "class", "kayitForm-hizalama");
                $.Yonlendirici.SilmeClickFonksiyon();

            }
            else {
                $.SayfaIslem.TagSetAttr("#ozelOdaOlustur", "class", "kayitButton-hizalama kayitButton-gorsel");
                $.SayfaIslem.TagSetAttr("#kaydetButton", "onclick", "$.PhpIslem.IslemYap('konuAc')");
                $.SayfaIslem.TagSetAttr("#konuForm", "class", "konuForm-hizalama");
            }
        },
        SilmeClickFonksiyon: function () {

            $("#yorumKonuDiv").dblclick(function () {
                commandGlobalNesne.calistir("konuSil");
            });

            $("#yorumlarinKutusu").on("dblclick", "[class='yorum-boyut yorum-hizalama yorum-gorsel']", function () {
                commandGlobalNesne.calistir("yorumSil", this)
            });
        },
        KonuSilme: function (konuKey) {
            $.SayfaIslem.TagSetAttr($("[konuKey=" + konuKey + "]"), "class", "sakla");
            if (GLOBAL_YORUMLARIN_KONU_KEYI == konuKey)
                $.Yonlendirici.YorumKonuSayfasiGecis('#yorumBolum', '#girisKonuBolum');
        },
        YorumSime: function (yorumKey, konuKey) {

            if (GLOBAL_YORUMLARIN_KONU_KEYI == konuKey)
                $.SayfaIslem.TagSetAttr($("[key=" + yorumKey + "]"), "class", "sakla");


        },
        BasariliGirisIslem: function (kullanici) {

            $.PhpIslem.IslemYap("konuGetir");
            $.Yonlendirici.FormSayfasiHazirla();
            $.Yonlendirici.KullaniciGirisTipiIslem(kullanici);
        },
        YorumKonuSayfasiGecis: function (SaklaId, GosterId) {
            if (GLOBAL_YORUMLARIN_KONU_KEYI != "1") GLOBAL_YORUMLARIN_KONU_KEYI = "1";
            $.SayfaIslem.TagSetAttr(SaklaId, "class", "sakla");
            $.SayfaIslem.TagSetAttr(GosterId, "class", "bolum-boy");
        },
        GoruntuluSohbetAc: function () {
            var video = $("#video").get()[0]; // or $("#video")[0])
            var mediaConfig = { video: true };
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(mediaConfig).then(function (stream) {
                    //video.src = window.URL.createObjectURL(stream);
                    // $.SayfaIslem.TagSetAttr("[kutuAttr='kutuAttr']", "class", "videoKutusu");
                    $.SayfaIslem.TagSetAttr("#goruntuluKonusma", "onclick", "$.Yonlendirici.GoruntuluSohbetKapat()");
                    $("#goruntuluKonusma").text('Görüntü Kapat');
                    video.srcObject = stream;
                    video.play();
                    GoruntuAlma.startInterval();
                }, function (params) {
                    alert("kapalı kamera");
                });
            }


        },
        GoruntuluSohbetKapat: function () {
            var videoEl = $("#video").get()[0];
            stream = videoEl.srcObject;
            tracks = stream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            videoEl.srcObject = null;
            // $.SayfaIslem.TagSetAttr("[kutuAttr='kutuAttr']", "class", "sakla");
            $.SayfaIslem.TagSetAttr("#goruntuluKonusma", "onclick", "$.Yonlendirici.GoruntuluSohbetAc()");
            $("#goruntuluKonusma").text('Görüntü Başlat');
            GoruntuAlma.clearInterval();
            // $.SayfaIslem.TagSetAttr("#myImg1", "src", "");

        },
        webSocketYeniResimEkle: function (data) {
            if (data.konuKey == GLOBAL_YORUMLARIN_KONU_KEYI)
                $.Yonlendirici.resimPrepend(data.image, NORMAL_ODA_GONDERILEN_RESIMLER[data.konuKey].length);
            NORMAL_ODA_GONDERILEN_RESIMLER[data.konuKey].push(data.image);
        },
        resimPrepend: function (imageData, resimId) {
            let tag = '<img class="resimListEleman" src="' + imageData + '" resimId=' + resimId + ' alt="">';
            $.SayfaIslem.TagPrepend("#solGonderilenResimlerDiv", tag);
        }

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    $("#konular").on("click", "[class='konularTextKutu-boyut konularTextKutu-hizalama konularTextKutu-gorsel']", function () {
        if (($.SayfaIslem.AttrValue(this, "ozelOda") == "NORMAL" || KULLANICI_MAIL == "admin@admin.com")) {
            GIRIS_YAPILAN_ODA_TURU = "NORMAL";
            $.SayfaIslem.TagSetAttr("#solGonderilenResimlerDiv", "class", "resimListeDiv");
            $.SayfaIslem.TagSetAttr("#resimYukle", "class", "geriGelButton-gorsel geriGelButton-boyut");
            konularClick(this);
            resimleriGoster();
        } else {
            $.SayfaIslem.TagSetAttr("#solGoruntuKonusmaDiv", "class", "goruntuluKonusmaKapsayıcı");
            GIRIS_YAPILAN_ODA_TURU = "OZEL";
            ozelOdaIstelem(this);
        }

    });
    function konularClick(konuTag) {
        $.Yonlendirici.YorumKonuSayfasiGecis("#girisKonuBolum", "#yorumBolum");
        $.Yonlendirici.YorumlarKonuYaz($.SayfaIslem.AttrValue(konuTag, "konuKey"), $(konuTag).html());
        commandGlobalNesne.calistir("yorumlariGetir");
    }
    function resimleriGoster() {
        NORMAL_ODA_GONDERILEN_RESIMLER[GLOBAL_YORUMLARIN_KONU_KEYI].map((value, key) => $.Yonlendirici.resimPrepend(value, key));
    }
    function ozelOdaIstelem(konuTag) {
        $.JavaIslem.AjaxIslem({ odaKey: $.SayfaIslem.AttrValue(konuTag, "konuKey"), userName: KULLANICI_MAIL }, "/privateRoomLogin").then(function (veri) {
            if (veri.userId != null) {
                konularClick(konuTag);
                $.SayfaIslem.TagSetAttr("#goruntuluKonusma", "class", "geriGelButton-gorsel geriGelButton-boyut");
                WEB_SOCKET_GORUNTU.INIT(veri);
                $.JavaWebSocket.socketAc(veri.privateRoomSocketPojo.socketPort);
            } else {
                alert("odaya kayitli değilsiniz");
            }
        });
    }

    $("#geriGelButton").click(function () {
        $.Yonlendirici.YorumKonuSayfasiGecis('#yorumBolum', '#girisKonuBolum');

        if (GIRIS_YAPILAN_ODA_TURU == "NORMAL") {
            $.SayfaIslem.TagSetAttr("#solGonderilenResimlerDiv", "class", "sakla");
            $.SayfaIslem.TagSetAttr("#resimYukle", "class", "sakla");
            $("#solGonderilenResimlerDiv").empty();
        }
        else {
            $.SayfaIslem.TagSetAttr("#solGoruntuKonusmaDiv", "class", "sakla");
            $.SayfaIslem.TagSetAttr("#goruntuluKonusma", "class", "sakla");
        }
    });

    $("#ozelOdaOlustur").click(function () {
        $.SayfaIslem.TagSetAttr("#konuFooter_ic", "class", "sakla");
        $.SayfaIslem.TagSetAttr("#ozelOda", "class", "odaOlusturKapsayivciDiv");
        $.SayfaIslem.TagSetAttr("[name='kullanici1']", "value", KULLANICI_MAIL);
    });
    $("#ozelOdaIptal").click(function () {
        OLUSTURULAN_ODA_TURU = "NORMAL";
        $.SayfaIslem.TagSetAttr("#konuFooter_ic", "class", "konuFooter_Ic-boyut konuFooter_Ic-gorsel konuFooter_Ic-hizalama");
        $.SayfaIslem.TagSetAttr("#ozelOda", "class", "sakla");
    });
    $("#ozelOdaKaydet").click(function () {
        OLUSTURULAN_ODA_TURU = "OZEL";
        OZEL_ODA_KULLANICI["userList"] = {
            0: $.SayfaIslem.FormValue("[name='kullanici1']"),
            1: $.SayfaIslem.FormValue("[name='kullanici2']"),
            2: $.SayfaIslem.FormValue("[name='kullanici3']"),
            3: $.SayfaIslem.FormValue("[name='kullanici4']")
        };

        $.SayfaIslem.TagSetAttr("#konuFooter_ic", "class", "konuFooter_Ic-boyut konuFooter_Ic-gorsel konuFooter_Ic-hizalama");
        $.SayfaIslem.TagSetAttr("#ozelOda", "class", "sakla");
    });

    $('input[name=myfile]').change(function (ev) {

        if ($("#myfile").get(0).files[0] != undefined) {
            getBase64($("#myfile").get(0).files[0]).then(function (data) {
                $.PHPWebSocketIslem.SocketResimGönder(data)
            });
        }
    });
    $("#solGonderilenResimlerDiv").on("dblclick", "[class='resimListEleman']", function () {
        let resimId = $(this).attr("resimId");
        console.log(NORMAL_ODA_GONDERILEN_RESIMLER);
        DOWNLOAD.href = NORMAL_ODA_GONDERILEN_RESIMLER[GLOBAL_YORUMLARIN_KONU_KEYI][parseInt(resimId)];
        DOWNLOAD.download = "resim";
        DOWNLOAD.click();
    });
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let JAVA_API_URL = "http://localhost:8093";
    let GLOBAL_YORUMLARIN_KONU_KEYI = "1";
    let OZEL_ODA_KULLANICI = {};
    let KULLANICI_MAIL;
    let OLUSTURULAN_ODA_TURU = "NORMAL"; // 1 OZEL ODA, 2 NORMAL ODA
    let GIRIS_YAPILAN_ODA_TURU = "NORMAL";

    let NORMAL_ODA_GONDERILEN_RESIMLER = {};

    let DOWNLOAD = document.createElement('a');


    /*
        Apiden kullanıcıların idlerini alıyoruz. Bu idlerler listedeki kayit sırası.
        Odaya giren kişinin idsi 3 olabilir ve bu kullanıcının kendisi olabilir. 
        Kullanıcının görüntüsü her zaman sol üstte olacağından, 3 ıd geldiğinde bunu 1 ile yer değiştirecek.
    */
    let WEB_SOCKET_GORUNTU = {
        SOCKET_KULLANICI_ID: "1",
        WEB_SOCKET_BROKER: "",
        GORUNTU_BAS: function () { },
        INIT: function (initData) {
            WEB_SOCKET_GORUNTU.WEB_SOCKET_BROKER = initData.privateRoomSocketPojo.brokerName;
            if (initData.userId == "1")
                WEB_SOCKET_GORUNTU.GORUNTU_BAS = function (data) {
                    if (data.userId != "1")
                        $.SayfaIslem.TagSetAttr("#myImg" + data.userId, "src", data.imageData);
                }

            else {
                WEB_SOCKET_GORUNTU.SOCKET_KULLANICI_ID = initData.userId;
                WEB_SOCKET_GORUNTU.GORUNTU_BAS = function (data) {
                    if (data.userId != WEB_SOCKET_GORUNTU.SOCKET_KULLANICI_ID) {
                        if (data.userId == "1") {
                            $.SayfaIslem.TagSetAttr("#myImg" + WEB_SOCKET_GORUNTU.SOCKET_KULLANICI_ID, "src", data.imageData);
                        }
                        else
                            $.SayfaIslem.TagSetAttr("#myImg" + data.userId, "src", data.imageData);
                    }
                }
            }
        }

    };


    let commandGlobalNesne = new Command();
    let websocket_server = new WebSocket("ws://localhost:8080/");
    let stompClient = null;

    let GoruntuAlma = {
        intervalVal: function () { },
        startInterval: function () {

            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            GoruntuAlma.intervalVal = setInterval(function () {
                context.drawImage(video, 0, 0, 200, 200);
                let socketData = {
                    brokerName: WEB_SOCKET_GORUNTU.WEB_SOCKET_BROKER,
                    imageData: canvas.toDataURL(),
                    userId: WEB_SOCKET_GORUNTU.SOCKET_KULLANICI_ID
                }
                $.JavaWebSocketIslem.sendImage(socketData);
            }, 50);
        },
        clearInterval: function () {
            clearInterval(GoruntuAlma.intervalVal);
            setTimeout(() => {
                let socketData = {
                    brokerName: WEB_SOCKET_GORUNTU.WEB_SOCKET_BROKER,
                    imageData: "",
                    userId: WEB_SOCKET_GORUNTU.SOCKET_KULLANICI_ID
                }
                $.JavaWebSocketIslem.sendImage(socketData);
            }, 200);
        }
    }
    initSifreleme();
    $.Yonlendirici.SocketBaslat();

    SIFRELEME.setSifreSayisal(true);
    let metin = SIFRELEME.sifrele("NORMAL");
    console.log(metin);
    console.log(SIFRELEME.sifreCoz(metin));
    /*
        SIFRELEME.setSifreSayisal(true);
        let sifrelenmis = SIFRELEME.sifrele("mehmet katı"); // sifrele ve sifreCoz
        console.log(sifrelenmis);
        console.log(SIFRELEME.sifreCoz(sifrelenmis));*/
});