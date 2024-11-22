---
title: Menggunakan Visual Studio Code di Browser melalui VPS
cover: ./cover.png
author: hasan
date: 2022-12-04
---

Visual Studio Code atau yang lebih sering kita kenal dengan VSCode adalah salah satu software development yang banyak sekali digunakan oleh para developers. Microsoft mencatat total 14 Juta pengguna telah memasang VSCode. Development aplikasi, website maupun program apapun dapat kita lakukan dengan VSCode, baik di Windows, Linux maupun MacOS. Salah satu web apps pengembangan dari source code VSCode adalah code-server.

Saya menemukan code-server ini beberapa bulan yang lalu ketika iseng mencari tahu di internet, karena VSCode desktop sendiri berbasis Electron yang berarti di dalamnya sebenarnya terdapat kode-kode JavaScript, HTML dan NodeJS. Code Server ini berbeda dengan vscode remote release. Untuk mengetahui lebih lanjut tentang code-server anda dapat mengunjungi [repositori githubnya](https://github.com/coder/code-server).

## Persiapan

Kali ini kita akan mencoba memasang code-server di VPS Ubuntu dan mencoba mengaksesnya melalui browser. Sebenarnya tidak harus VPS, yang terpenting Anda memiliki akses super admin ke server yang ingin Anda pasang code-server. Silakan akses server anda menggunakan SSH (jika menggunakan server cloud).

## Proses Instalasi

Proses installasi code-server sangatlah mudah karena sudah disediakan script shell untuk melakukan installasi.

### Menjalankan Installer Script

Silakan ketikan perintah berikut ini di terminal anda:

```sh
curl -fsSL https://code-server.dev/install.sh | sh
```

Perintah tersebut akan menginstall code-server beserta dengan beberapa dependensinya.

![1.png]

### Melakukan konfigurasi

Selanjutnya kita akan mengubah konfigurasi code-server kita. File konfigurasi code-server terletak di `~/.config/code-server/config.yaml`. Kita akan menggunakan text editor nano untuk mengubah konfigurasi tersebut:

```sh
nano ~/.config/code-server/config.yaml
```

![2.png]

Silakan ubah password di konfigurasi tersebut (field key password, bukan auth). Untuk bind address biarkan 127.0.0.1:8080, kita akan melakukan forwarding port dengan nginx dan menambahkan  sertifikat https nantinya di nginx. Lakukan restart pada service code-server:

```sh
sudo systemctl restart code-server@$USER
```


## Mengonfigurasi NGINX untuk Port Forwarding

Kita akan menggunakan NGINX sebagai web server kita sehingga web code-server kita tidak langsung terhubung dengan Web Server NodeJS milik code-server.

Silakan install NGINX:
```sh
sudo apt update
sudo apt install nginx
```

Lalu buat sebuah konfigurasi untuk code-server di nginx dengan nano:
```sh
nano /etc/nginx/sites-available/code-server
```

Isikan file tersebut dengan konfigurasi nginx seperti dibawah ini:
```
server {
    listen 80;
    listen [::]:80;
    server_name domainanda.com;

    location / {
      proxy_pass http://localhost:8080/;
      proxy_set_header Host $host;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection upgrade;
      proxy_set_header Accept-Encoding gzip;
    }
}
```

Silakan ubah `domainanda.com` dengan nama domain yang server anda miliki. Disini kita akan memforward request dari domainanda.com (default port http 80) ke code-server yang kita binding di port 8080. Lalu lakukan symlink konfigurasi tersebut agar terbaca oleh nginx:

```sh
sudo ln -s /etc/nginx/sites-available/code-server /etc/nginx/sites-enabled/code-server
```

Lakukan restart nginx dengan perintah:

```sh
sudo systemctl restart nginx
```

Sampai disini ketika kalian mengakses domain server, akan muncul halaman login code-server.

![3.png]

Setelah memasukkan password, Anda akan disuguhkan dengan landing page code-server yang sama seperti VSCode.

![4.png]

Disini Anda dapat membuka file atau folder di server Anda maupun membuka sebuah terminal untuk melakukan cloning git repository.

Selamat, proses instalasi code-server telah berhasil! Kini Anda dapat langsung melakukan coding melalui server VPS Anda!

Terima kasih telah membaca!