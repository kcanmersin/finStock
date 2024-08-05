import os

# Tüm .cs dosyalarının içeriğinin yazılacağı çıkış dosyası
output_file_path = "combined_output.txt"

# Çıkış dosyasını aç. Eğer varsa üzerine yazılacak, yoksa yeni oluşturulacak.
with open(output_file_path, 'w', encoding='utf-8') as output_file:
    # Çalışılan klasördeki tüm klasörleri ve dosyaları dolaş
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.endswith(".cs"):
                # .cs dosyasının tam yolunu al
                source_path = os.path.join(root, file)
                
                # .cs dosyasını oku ve içeriğini çıkış dosyasına yaz
                with open(source_path, 'r', encoding='utf-8') as source_file:
                    content = source_file.read()
                    output_file.write(content + "\n")  # İçeriği yaz ve bir satır boşluk bırak

                print(f"{source_path} dosyasının içeriği çıkış dosyasına eklendi.")

