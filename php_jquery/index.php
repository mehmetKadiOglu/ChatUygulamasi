<?php include_once "header.php";?>

<section id="girisKonuBolum"  class="bolum-boy">
    <div class="konu_GirisContent-boyut konu_GirisContent-gorsel konu_GirisContent-hizalama">
        <div id="konular" class="sakla">
        </div>
        <div id="giris" class="giris-gorsel giris-boyut giris-hizalama">
            <input type="text" name="kullaniciMail" placeholder="Mail" class="girisInput-gorsel girisInput-boyut">
            <input type="password" name="kullaniciSifre" placeholder="Sifre" class="girisInput-gorsel girisInput-boyut">
            <button onclick="$.PhpIslem.IslemYap('kullaniciGiris')" id="giris" class="girisButton-gorsel girisButton-boyut">
                Giris Yap
            </button>
        </div>
    </div>
    <footer class="konuFooter-boyut konuFooter-gorsel konuFooter-hizalama">
        <div id="konuFooter_ic" class="sakla">
            <form id="konuForm" class="sakla">
                <div>
                    <span>Konu Giriniz</span>
                    <span><input id="konuInput" type="text"> </span>
                </div>
                <div>
                    <textarea id="konuMetin" name="konuMetin" cols="85%" rows="3" style="resize:none;"></textarea>
                </div>
            </form>
            <form id="kullaniciKayitForm" class="sakla">
                <div>
                    <span class="kayitFormText-boyut kayitFormText-hizalama">Ad Giriniz</span>
                    <span class="kayitFormInput-hizalama"><input name="adText" type="text" placeholder="Ad"> </span>
                    <span class="kayitFormText-boyut kayitFormText-hizalama">Soyad Giriniz</span>
                    <span class="kayitFormInput-hizalama"><input name="soyAdText" type="text" placeholder="Soy Ad"></span>
                </div>
                <div class="kayitFormAltDiv-hizalama">
                    <span class="kayitFormText-boyut kayitFormText-hizalama">Mail Giriniz</span>
                    <span class="kayitFormInput-hizalama"><input name="mailText" type="text" placeholder="Mail"> </span>
                    <span class="kayitFormText-boyut kayitFormText-hizalama">Şifre Giriniz</span>
                    <span class="kayitFormInput-hizalama"><input name="sifreText" type="password" placeholder="Sifre"></span>
                </div>
            </form>
            <div class="kaydetButtonDiv">
                <button id="kaydetButton" onclick="$.PhpIslem.IslemYap('kullaniciKayit')" class="kayitButton-hizalama kayitButton-gorsel">Kaydet</button>
                <button id="ozelOdaOlustur"  class="sakla">Ozel Oda</button>
            </div>
        </div>

        <div id="ozelOda" class ="sakla">
            <div class="odaOlustur">
                <input type="text"  class = "odaText" placeholder="kullanici 1" name="kullanici1" id="" readonly>
                <input type="text" class = "odaText" placeholder="kullanici 2" name="kullanici2" id="">
            </div>
            <div class="odaOlustur">
                <input type="text" class = "odaText" placeholder="kullanici 3" name="kullanici3" id="">
                <input type="text" class = "odaText" placeholder="kullanici 4" name="kullanici4" id="">
            </div>
            <div class="odaOlustur">
                <button id = "ozelOdaKaydet" class ="odaButton"> Kaydet </button>
                <button id="ozelOdaIptal" class ="odaButton"> İptal </button>
            </div>
        </div>
    </footer>
</section>

<section id="yorumBolum" class="sakla">
    <canvas id="canvas" width="200" height="200" class="sakla"></canvas>
    <section  id="yorumKapsayıcı">
        <div id="solGoruntuKonusmaDiv" class="sakla">
            <div kutuAttr="kutuAttr" class="videoKutusu">
            <video id="video" autoplay></video>
            </div>
            <div kutuAttr="kutuAttr" class="videoKutusu">
                <img id="myImg3" class="goruntuImage">
            </div>
        </div>

        <div id="solGonderilenResimlerDiv" class="sakla">
        </div>
        <div class="yorumKapsayıcı">
            <div class="yorumContent-boyut yorumContent-gorsel yorumContent-hizalama">
                <div id="yorumAnaKutu" class="yorumGenelDiv-boyut yorumGenelDiv-gorsel yorumGenelDiv-hizalama">
                    <div key="" id="yorumKonuDiv" class="konularTextKutu-boyut konularTextKutu-hizalama konularTextKutu-gorsel">
                    </div>
                    <div id="yorumlarinKutusu" class="yorumKutusu-boyut yorumKutusu-hizalama">
                    </div>
                </div>
            </div>

            <footer class="yorumFooter-boyut yorumFooter-gorsel yorumFooter-hizalama">
                <div class="yorumFooter_ic-boyut yorumFooter_ic-gorsel  yorumFooter_ic-hizalama">
                    <div class="yorumFooter_ic_textarea-boyut yorumFooter_ic_textarea-gorsel  yorumFooter_ic-hizalama">
                        <textarea id="yorumText"  cols="85%" rows="4" style="resize:none;"></textarea>
                    </div>
                    <div class="yorumFooter_ic_button-boyut yorumFooter_ic_button-gorsel  yorumFooter_ic_button-hizalama">
                        <input type="file" id="myfile" name="myfile" style="display:none">
                        <button id="resimYukle" onclick="document.getElementById('myfile').click();" class="sakla">Resim Yükle</button>
                        <button id="goruntuluKonusma" onclick="$.Yonlendirici.GoruntuluSohbetAc()" class="sakla"> Görüntü Başlat </button>
                        <button onclick="$.PhpIslem.IslemYap('yorumYap')" class="geriGelButton-gorsel geriGelButton-boyut"> Yorum Yap </button>
                        <button id="geriGelButton" class="geriGelButton-gorsel geriGelButton-boyut"> Ana Sayfa </button>
                    </div>
                </div>
            </footer>
        </div>
        <div class="goruntuluKonusmaKapsayıcı">
            <div kutuAttr="kutuAttr" class="videoKutusu">
                <img id="myImg2" class="goruntuImage">
            </div>
            <div kutuAttr="kutuAttr" class="videoKutusu">
                <img id="myImg4" class="goruntuImage">
            </div>
        </div>
   </section>
</section>


</body>

</html>
