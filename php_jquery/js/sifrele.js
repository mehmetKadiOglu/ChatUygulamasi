class BenzersizMatris {
    SifreSayisal = true;
    HarfMatris = {}; // harflere denk gelen sayıları tutuyor
    SayiMatris = {}; // sayılara denk gelen harfleri tutuyor. 

    TersAnahtar = []; // Deşifrelemede kullanılcak anahtar
    Anahtar = [];

    constructor() {
        this.anahtarMatris();
        this.setHarfSayiMatris();
    }
    getAnahtar() { return this.Anahtar; }
    setAnahtar(Satir, Sutun, Value) { this.getAnahtar()[Satir][Sutun] = Value; }

    getTersAnahtar() { return this.TersAnahtar; }
    setTersAnahtar(Anahtar) { this.TersAnahtar = Anahtar; }

    getHarfMatris() { return this.HarfMatris; }
    getSayiMatris() { return this.SayiMatris; }

    setSifreSayisal(Durum) { this.SifreSayisal = Durum; return this; }
    getSifreSayisal() { return this.SifreSayisal; }

    setHarfSayiMatris()// karakterler ve onlara denk gelen karakter sayılarını dolduruyor.
    {
        let sutun = 70;
        for (let satir = 97; satir <= 122; satir++ , sutun++) {
            let harf = String.fromCharCode(satir);
            let harf2 = String.fromCharCode(satir - 32);
            this.getHarfMatris()[harf] = sutun;
            this.getSayiMatris()[sutun] = harf;

            this.getHarfMatris()[harf2] = sutun + 100;
            this.getSayiMatris()[sutun + 100] = harf2;

        }
        let string = "şüöğıçŞÜİÖĞÇ?,!'.\";-:1234567890"
        for (let satir = 0; satir < string.length; satir++ , sutun++) {
            this.getHarfMatris()[string[satir]] = sutun;
            this.getSayiMatris()[sutun] = string[satir];

        }
        this.getHarfMatris()[' '] = 0;
        this.getSayiMatris()[0] = ' ';

    }
    anahtarMatris() // Anahatara varsayılan değerleri atar
    {

        this.getAnahtar().push([]);
        this.getAnahtar().push([]);
        this.getAnahtar().push([]);

        this.setAnahtar(0, 0, 3);
        this.setAnahtar(0, 1, 2);
        this.setAnahtar(0, 2, 2);

        this.setAnahtar(1, 0, 0);
        this.setAnahtar(1, 1, 1);
        this.setAnahtar(1, 2, 0);

        this.setAnahtar(2, 0, 1);
        this.setAnahtar(2, 1, 0);
        this.setAnahtar(2, 2, 1);
    }
    sifrelencekMetinSayiMatrisi(SifrelencekMetin) // Şifrelencek metindeki harfleri, HarfMatris'de belirtilen sayılar ile değiştiriliyor
    {
        let matris = [];
        let MetinIndex = 0;

        for (let satir = 0; satir < 3; satir++) {
            matris.push([]);
            for (let sutun = 0; sutun < Math.ceil(SifrelencekMetin.length / 3); sutun++) {
                if (MetinIndex < SifrelencekMetin.length)
                    matris[satir][sutun] = this.getHarfMatris()[SifrelencekMetin[MetinIndex++]]; //harflere göre sayılar geliyor
                else
                    matris[satir][sutun] = this.getHarfMatris()[' '];//eğer metin uzunluğu aşılmış ise sonuna boşluk ekleniyor
            }
        }
        return matris;
    }
    sifrele(SifrelencekMetin) {

        let sifrelencekMetinSayiMatrisi = this.sifrelencekMetinSayiMatrisi(SifrelencekMetin);
        //  console.log("şifrelemede metinlerin sayıya dönüştüğü matris");
        //console.log(sifrelencekMetinSayiMatrisi);
        let sifreliMetin = "";
        let toplamSayi = 0; // çarpma işlemindeki sonucu tutacak

        for (let satir = 0; satir < 3; satir++)
            for (let sutun = 0; sutun < Math.ceil(SifrelencekMetin.length / 3); sutun++) {
                toplamSayi = 0;
                for (let index3 = 0; index3 < 3; index3++)
                    toplamSayi += this.getAnahtar()[satir][index3] * sifrelencekMetinSayiMatrisi[index3][sutun];
                if (this.getSifreSayisal()) {
                    if (toplamSayi == 0) {
                        sifreliMetin += "0000";
                    }
                    else {

                        let sayiMetin = toplamSayi.toString();
                        //sifreliMetin += sayiMetin.length > 2 ? sayiMetin : (sayiMetin + ".");
                        if (sayiMetin.length == 4) {
                            sifreliMetin += sayiMetin;
                        }
                        else {
                            for (let noktaIndex = sayiMetin.length; noktaIndex < 4; noktaIndex++)
                                sayiMetin += ".";
                            sifreliMetin += sayiMetin;
                        }
                    }

                }
                else {
                    if (toplamSayi == 0) // 0 değeri SayiMatris'de boşluktur
                        sifreliMetin += " ";
                    else
                        sifreliMetin += String.fromCharCode(toplamSayi);
                }
            }
        return sifreliMetin;
    }
    integerArray(DefsifrelencekMetin) {
        // şifrelerken 0 kokuyoruz metne. bu sıfır boşluk değeri. Normal sayılardanda sıfır gelebilir.
        // 3er 3er gidiyoruz burdan sıfırı alırız. başlangıcı sıfır olursa bu değer boşluktur
        if (DefsifrelencekMetin.length % 12 != 0) return 0;
        let metinUzunlugu = (DefsifrelencekMetin.length) / 12;
        let integreAray = [];
        let metinIndex = 3;
        for (let satir = 0; satir < 3; satir++) {
            integreAray.push([]);
            for (let sutun = 0; sutun < metinUzunlugu; sutun++) {
                if (DefsifrelencekMetin[metinIndex - 3] == "0") // baş harf sıfır olamaz. Eğer olursa boşluk değeri
                {
                    integreAray[satir][sutun] = 0;
                }
                else {
                    let sayi = DefsifrelencekMetin[metinIndex - 3] + DefsifrelencekMetin[metinIndex - 2];// DefsifrelencekMetin[metinIndex];
                    sayi += DefsifrelencekMetin[metinIndex - 1] == "." ? "" : DefsifrelencekMetin[metinIndex - 1];
                    sayi += DefsifrelencekMetin[metinIndex] == "." ? "" : DefsifrelencekMetin[metinIndex];
                    integreAray[satir][sutun] = parseInt(sayi);
                }
                metinIndex += 4;
            }
        }
        return integreAray;
    }
    asciiArray(DesifrelencekMetin) {

        /*
          3 3 3  a b c d ...
          3 3 3  x y z t ...
          3 3 3  q w e r ...
          
          Şeklindeki 3x3 matris carpılması icin Satır uzunlukları aynı 3xY matris gerekmektedir. 
          örneğin 3x4 lük bir matris satır sayısı 12dir. Gelen metin uzunluğu ise 10. Aşağıdaki for icersinde bu kontrol edilip, metin uzunluğunu gectiği anda
          matrise belirlenen değer atanmaya başlanır
        */
        let asciArray = []; // verilen string metnin ascıı karşılığını tutacak

        let metinIndex = 0;
        for (let satir = 0; satir < 3; satir++) {
            asciArray.push([]);
            for (let sutun = 0; sutun < Math.ceil(DesifrelencekMetin.length / 3); sutun++) {
                if (metinIndex < DesifrelencekMetin.length) {
                    if (DesifrelencekMetin[metinIndex].charCodeAt(0) == 32) // boşluk değeri
                        asciArray[satir][sutun] = 0;
                    else
                        asciArray[satir][sutun] = DesifrelencekMetin[metinIndex].charCodeAt(0);

                    metinIndex++;
                }
                else
                    asciArray[satir][sutun] = 0;
            }
        }
        //console.log("ascii arrayyy");
        //console.log(asciArray);
        return asciArray;
    }
    sifreCoz(DesifrelencekMetin) {
        let desifreArray = this.getSifreSayisal() ? this.integerArray(DesifrelencekMetin) : this.asciiArray(DesifrelencekMetin);
        if (!desifreArray) return 0
        let toplamSayi = 0; // çarpma işlemindeki sonucu tutacak
        let sifreliMetin = "";

        for (let satir = 0; satir < 3; satir++)
            for (let sutun = 0; sutun < desifreArray[0].length; sutun++) {
                toplamSayi = 0
                for (let sutun2 = 0; sutun2 < 3; sutun2++) {

                    toplamSayi += this.getTersAnahtar()[satir][sutun2] * desifreArray[sutun2][sutun];

                }
                //console.log("şifre çözz toplam sayi" + toplamSayi);
                sifreliMetin += this.getSayiMatris()[toplamSayi];
            }

        return sifreliMetin;
    }
}
class MatrisKafaktor {

    KafaktorMatrs = [];

    getKafaktorMatrs() { return this.KafaktorMatrs; }
    setKafaktorMatrs(Satir, Sutun, value) { this.getKafaktorMatrs()[Satir][Sutun] = value; }

    setMatris(Matris) // ters ve kofaktör matrisleri oluşturulur.
    {
        let determinant = 0;
        for (let satir = 0; satir < 3; satir++) {
            this.getKafaktorMatrs().push([]);
            for (let sutun = 0; sutun < 3; sutun++) {
                determinant = this.minorMatrisDeterminant(satir, sutun, Matris);
                this.setKafaktorMatrs(satir, sutun, determinant);
            }
        }
    }

    minorMatrisDeterminant(Satir, Sutun, Matris) {

        let sagSolKontrol = true;
        let ciftKontrol = 0;
        let sag = 1;
        let sol = 1;
        /*
        a b
        c d  matrisinin determinantı alınırken a*d (sağ) - b*c (sol) dir. Burda b ve c arka arkaya gelmektedir.
        Yani gelme sırası a  bc  ve d olucaktır. Arka arkaya(ciftlik) gelme durumunu(bc)  'ciftKontrol' değişkeni kontrol eder.
        */
        for (let satir = 0; satir < 3; satir++) {
            for (let sutun = 0; sutun < 3; sutun++) {

                if (satir != Satir && sutun != Sutun) {
                    if (sagSolKontrol) {
                        sag *= Matris[satir][sutun];
                        sagSolKontrol = false;
                    }
                    else {
                        sol *= Matris[satir][sutun];
                        ciftKontrol++;
                        if (ciftKontrol >= 2)
                            sagSolKontrol = true;
                    }
                }

            }
        }
        return sag - sol;
    }

    minorKofaktor() // kafaktor matrisinin işaretleri değiştirip transpozu alınıyor. Bu işlemden sonra dizimiz kafaktor halini alıyor
    {
        let i = -1;
        let minor = [];
        minor.push([]); // pushlama for icersinde yapılmadı. Nedeni, minor matris sutun olarak ekleme yapıyor
        minor.push([]);
        minor.push([]);
        for (let satir = 0; satir < 3; satir++) {
            for (let sutun = 0; sutun < 3; sutun++) {
                i *= -1;
                this.setKafaktorMatrs(satir, sutun, this.getKafaktorMatrs()[satir][sutun] * i); // işaret değişimi
                minor[sutun][satir] = this.getKafaktorMatrs()[satir][sutun];  // transpoz

            }
        }
        return minor;
    }

    kofaktorMatrisİslem() {

        let minor = this.minorKofaktor();
        for (let satir = 0; satir < 3; satir++)
            for (let sutun = 0; sutun < 3; sutun++)
                this.setKafaktorMatrs(satir, sutun, minor[satir][sutun]);
    }

}
class MatrisTersleme {

    static matrisTersle(Kafaktor, Matris) {

        let tersMatris = [];
        let determinant = Determinant.determinantHesapla(Kafaktor, Matris);

        for (let satir = 0; satir < 3; satir++) {
            tersMatris.push([]);
            for (let sutun = 0; sutun < 3; sutun++)
                tersMatris[satir][sutun] = Kafaktor[satir][sutun] * determinant;
        }


        return tersMatris;
    }
}
class Determinant {

    static determinantHesapla(Kafaktor, Matris) {
        let determinant = 0;
        for (let satir = 0; satir < 3; satir++)
            determinant += Kafaktor[satir][0] * Matris[0][satir];

        return determinant;
    }
}

/*
let nesnem = new MatrisKafaktor();
let benzersizSifreleme = new BenzersizMatris();
nesnem.setMatris(benzersizSifreleme.getAnahtar());
nesnem.kofaktorMatrisİslem();
benzersizSifreleme.setTersAnahtar(MatrisTersleme.matrisTersle(nesnem.getKafaktorMatrs(), benzersizSifreleme.getAnahtar()));
*/
let SIFRELEME; // sifrele ve sifreCoz

function initSifreleme() {
    let nesnem = new MatrisKafaktor();
    SIFRELEME = new BenzersizMatris();
    SIFRELEME.setSifreSayisal(false);
    nesnem.setMatris(SIFRELEME.getAnahtar());
    nesnem.kofaktorMatrisİslem();
    SIFRELEME.setTersAnahtar(MatrisTersleme.matrisTersle(nesnem.getKafaktorMatrs(), SIFRELEME.getAnahtar()));
}