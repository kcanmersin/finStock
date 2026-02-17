export const aiPromptTemplate = {
  title: "Yapay Zeka Yatirim Analiz Sablonu",

  description: `Bu sablon, yatirim verilerinizi yapay zeka ile analiz etmeniz icin tasarlanmistir.

Adim 1: Sistemden fon veya hisse senedi verilerinizi Excel formatinda disari aktarin.
Adim 2: Asagidaki uygun promptu (fon veya hisse icin) kopyalayin.
Adim 3: ChatGPT veya Claude gibi bir yapay zeka aracina promptu ve Excel dosyasini birlikte gonderin.
Adim 4: Yapay zekanin urettigi sonuc tablosunu Excel formatinda kaydedin.
Adim 5: Kaydedilen Excel dosyasini tekrar sisteme yukleyerek AI onerilerini goruntueleyin.`,

  promptForFunds: `Sen bir profesyonel Turk yatirim fonu analistisin. Sana ekli Excel dosyasindaki Turkiye yatirim fonu verilerini analiz etmeni istiyorum.

Gorev:
Ekli Excel dosyasindaki tum fonlari detayli sekilde analiz et ve sonuclari asagidaki formatta yeni bir Excel tablosu olarak olustur.

Cikti Tablosu Sutunlari:
- Isim: Fonun tam adi
- Kod: Fonun kisa kodu
- Oneri: AL, TUT, SAT veya IZLE (yalnizca bu dort degerden biri)
- Puan: 1 ile 100 arasinda bir tam sayi (1 en kotu, 100 en iyi)
- Gerekce: Onerinin kisa ve net aciklamasi (en fazla 2 cumle)

Analiz Kriterleri:
1. Yillik Getiri: Son 1 yillik getiri performansi. Yuksek getiri olumlu degerlendirilmeli.
2. Aylik Getiri Trendi: Son aylardaki getiri yonu ve istikrari. Yukselis trendinde olan fonlar tercih edilmeli.
3. Risk/Getiri Dengesi: Risk seviyesine gore elde edilen getirinin makul olup olmadigi. Dusuk riskle yuksek getiri ideal durumdur.
4. Yonetim Ucreti: Fonun yillik yonetim ucreti orani. Dusuk ucretler tercih edilmeli.
5. Fon Buyuklugu: Toplam fon buyuklugu. Cok kucuk fonlar likidite riski tasiyabilir.
6. Yatirimci Sayisi: Fona yatirim yapan kisi sayisi. Dusuk yatirimci sayisi guven eksikligine isaret edebilir.

Zorunlu Kurallar:
- Tum fonlarin en az yuzde 60'i AL veya IZLE onerisi almalidir. Eger cok fazla SAT onerisi cikarsa, esik degerlerini biraz gevset.
- Risk seviyesi 5 ve uzerinde olan fonlara dikkat et. Bu fonlar icin getirinin riski karsiladigina emin ol, aksi halde puani dusur.
- Yonetim ucreti yuzde 2'nin uzerinde olan fonlari cezalandir. Bu fonlarin puanindan 5-15 puan arasinda dusurme uygula.
- Yillik getirisi negatif olan fonlara SAT veya IZLE onerisi ver. Negatif getirili bir fona asla AL onerisi verme.
- Puanlama tutarli olsun: AL onerisi verilen fonlar 65 ve uzeri, TUT 40-64 arasi, IZLE 30-55 arasi, SAT 1-35 arasi puan almalidir.

Ciktiyi Excel uyumlu tablo formatinda olustur. Baslik satirini ve tum satirlari icersin. Ekstra aciklama ekleme, sadece tabloyu ver.`,

  promptForStocks: `Sen bir profesyonel Borsa Istanbul (BIST) hisse senedi analistisin. Sana ekli Excel dosyasindaki BIST hisse senedi verilerini analiz etmeni istiyorum.

Gorev:
Ekli Excel dosyasindaki tum hisse senetlerini detayli sekilde analiz et ve sonuclari asagidaki formatta yeni bir Excel tablosu olarak olustur.

Cikti Tablosu Sutunlari:
- Isim: Sirketin tam adi
- Kod: Hisse senedinin BIST kodu
- Oneri: AL, TUT, SAT veya IZLE (yalnizca bu dort degerden biri)
- Puan: 1 ile 100 arasinda bir tam sayi (1 en kotu, 100 en iyi)
- Gerekce: Onerinin kisa ve net aciklamasi (en fazla 2 cumle)

Analiz Kriterleri:
1. F/K Orani (P/E): Fiyat/Kazanc oranini sektorel ortalamaya gore degerledir. Sektor ortalamasinin altinda olan F/K olumlu, cok ustunde olan olumsuz degerlendirilmeli.
2. PD/DD Orani (P/B): Piyasa Degeri / Defter Degeri orani. 1'in altinda olan degerler potansiyel firsata, cok yuksek degerler asiri fiyatlanmaya isaret edebilir.
3. Gunluk ve Haftalik Momentum: Kisa vadeli fiyat hareketi ve yonu. Pozitif momentum olumlu ancak asiri hizli yukselis dikkatle degerlendirilmeli.
4. Aylik ve Yillik Getiri: Orta ve uzun vadeli performans. Tutarli yukselis trendi tercih edilmeli.
5. Islem Hacmi: Gunluk ortalama islem hacmi. Yeterli likiditeye sahip hisseler tercih edilmeli.
6. Piyasa Degeri: Sirketin toplam piyasa degeri. Buyuk sirketler genellikle daha dusuk risk tasir.
7. Sektor Analizi: Hissenin bulundugu sektorun genel gorunumu ve sektordeki konumu.

Zorunlu Kurallar:
- F/K oranini mutlaka sektorel bazda degerledir. Bir teknoloji sirketi icin 25 F/K normal olabilirken, bir enerji sirketi icin yuksek sayilabilir.
- Gunluk fiyat degisimi yuzde 5'ten fazla olan hisseler icin volatilite uyarisi ekle. Bu hisseler icin Gerekce sutununda "Yuksek volatilite" ibaresini kullan.
- Islem hacmi dusuk olan hisseler icin likidite riski belirt. Dusuk hacimli hisselerin puanindan 5-10 puan dusur.
- Yillik getirisi yuzde 30'un uzerinde olan hisselerde kar realizasyonu riskini degerledir. Bu hisselerin Gerekce sutununda "Kar realizasyonu riski mevcut" ibaresini ekle.
- Negatif F/K oranina sahip (zarar eden) sirketlere dikkat et. Bu sirketlere AL onerisi vermeden once diger kriterlerin cok guclu oldugundan emin ol.
- Puanlama tutarli olsun: AL onerisi verilen hisseler 65 ve uzeri, TUT 40-64 arasi, IZLE 30-55 arasi, SAT 1-35 arasi puan almalidir.

Ciktiyi Excel uyumlu tablo formatinda olustur. Baslik satirini ve tum satirlari icersin. Ekstra aciklama ekleme, sadece tabloyu ver.`,

  exampleOutput: `| Isim | Kod | Oneri | Puan | Gerekce |
|------|-----|-------|------|---------|
| Ak Portfoy BIST 30 Endeks Fonu | AK3 | AL | 82 | Yillik getiri sektor ortalamasinin uzerinde, yonetim ucreti makul seviyede. |
| Garanti Portfoy Para Piyasasi Fonu | GPP | TUT | 58 | Dusuk risk profili ile istikrarli getiri sunuyor ancak buyume potansiyeli sinirli. |
| Is Portfoy Teknoloji Sektoru Fonu | IST | AL | 75 | Teknoloji sektorundeki yukselis trendinden faydalaniyor, aylik getiri trendi pozitif. |
| Yapi Kredi Portfoy Altin Fonu | YKA | IZLE | 45 | Altin fiyatlarindaki belirsizlik nedeniyle kisa vadede temkinli yaklasim onerilir. |
| Deniz Portfoy Kisa Vadeli Tahvil Fonu | DKT | SAT | 28 | Yillik getiri negatif, yonetim ucreti yuzde 2.5 ile yuksek, risk-getiri dengesi olumsuz. |
| Halk Portfoy Dengeli Degisken Fonu | HDD | IZLE | 42 | Orta duzeyde getiri sunuyor ancak risk seviyesi 5 ile dikkatli takip gerektiriyor. |`,
};
