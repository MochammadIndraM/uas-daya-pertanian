// UAS Daya Dalam Bidang Pertanian — versi 4.
// Tambahkan KODE_MULAI_UAS di Project Settings > Script Properties saat siap membuka UAS.
// Selama properti kosong, halaman peserta dapat dibuka untuk tes tautan.
// Kode mulai harus berbeda dari KODE_REKAP_DOSEN dan paling panjang 100 karakter.
// Soal dan kunci jawaban tersimpan di server. Berkas ini untuk dosen.

// Tahap 1: modul server untuk Apps Script. Jangan sertakan bank ini di HTML peserta.
// Paket mengambil satu soal dari tiap pasangan q1/q26 sampai q25/q50.
// Pemanggil perlu menyimpan ID soal sesuai urutan, mengirim soal tanpa `correct`,
// dan menggunakan paket yang tersimpan untuk validasi dan penilaian.

const BANK_DAYA_50 = [
  {
    "id": "q1",
    "section": "pemahaman",
    "topic": "Pompa air",
    "prompt": "Apa fungsi utama impeller pada pompa sentrifugal yang digunakan untuk irigasi?",
    "options": [
      "Mengatur tekanan masuk dengan mempersempit pipa isap.",
      "Mengubah energi listrik menjadi putaran poros motor.",
      "Memindahkan energi dari putaran poros ke aliran air.",
      "Mengumpulkan aliran dari sudu dan mengarahkannya ke pipa keluar."
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q2",
    "section": "pemahaman",
    "topic": "Pompa air",
    "prompt": "Sebuah pompa sumur bor beroperasi terendam dan memakai impeller sentrifugal. Bagaimana pompa ini dapat diklasifikasikan?",
    "options": [
      "Pompa sentrifugal permukaan, karena impeller harus beroperasi di atas muka air.",
      "Pompa sentrifugal submersible, karena mekanismenya sentrifugal dan pemasangannya terendam.",
      "Pompa submersible perpindahan positif, karena setiap pompa celup memakai ruang bertekanan tertutup.",
      "Pompa submersible aliran aksial, karena air keluar melalui pipa vertikal."
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q3",
    "section": "pemahaman",
    "topic": "Pompa air",
    "prompt": "Pompa memindahkan air antara dua tandon besar yang terbuka. Pada debit tertentu, besaran apa yang perlu diperhitungkan untuk menentukan head total sistem?",
    "options": [
      "Panjang seluruh pipa dan kedalaman dasar tandon.",
      "Beda tinggi muka air dan panjang seluruh pipa.",
      "Rugi aliran pada pipa dan volume air di tandon tujuan.",
      "Beda tinggi muka air dan rugi aliran pada pipa serta sambungan."
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q4",
    "section": "pemahaman",
    "topic": "Pompa air",
    "prompt": "Sistem irigasi membutuhkan debit 3 L/s pada head 12 m. Data mana yang menunjukkan pompa memenuhi kedua kebutuhan itu secara bersamaan?",
    "options": [
      "Kurva pompa menunjukkan debit 3 L/s pada head 12 m.",
      "Kurva pompa menunjukkan debit 3 L/s pada head 5 m.",
      "Head maksimum pompa mencapai 12 m pada debit mendekati nol.",
      "Spesifikasi mencantumkan debit maksimum 3 L/s dan head maksimum 12 m pada titik yang berbeda."
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q5",
    "section": "pemahaman",
    "topic": "Blower",
    "prompt": "Pada pengering gabah dengan pemanas dan blower terpisah, apa fungsi utama blower?",
    "options": [
      "Menetapkan suhu udara dengan mengatur daya elemen pemanas.",
      "Mengurangi kelembapan udara melalui proses kondensasi.",
      "Mengukur perubahan kadar air gabah selama pengeringan.",
      "Mengalirkan udara melalui bahan dan membawa uap air keluar."
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q6",
    "section": "pemahaman",
    "topic": "Blower",
    "prompt": "Kecepatan udara di tengah saluran blower lebih tinggi daripada di dekat dinding. Bagaimana cara memperoleh taksiran debit yang lebih mewakili seluruh penampang?",
    "options": [
      "Menggunakan kecepatan tertinggi di tengah saluran dan luas seluruh penampang.",
      "Mengukur kecepatan di beberapa titik yang mewakili penampang, lalu menggunakan kecepatan rata-ratanya dan luas penampang.",
      "Menggunakan kecepatan terendah di dekat dinding dan luas seluruh penampang.",
      "Menggunakan kecepatan pada satu titik dekat dinding dan luas bagian tengah saluran."
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q7",
    "section": "pemahaman",
    "topic": "Blower",
    "prompt": "Dua blower listrik diuji untuk membandingkan efisiensi dari listrik ke aliran udara. Besaran apa yang diperlukan pada titik kerja masing-masing?",
    "options": [
      "Putaran motor, diameter impeller, dan lama pengujian.",
      "Kecepatan udara maksimum, daya nominal motor, dan diameter saluran.",
      "Debit udara, kenaikan tekanan total, dan daya listrik aktif yang terukur.",
      "Kenaikan tekanan total, putaran motor, dan suhu udara keluar."
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q8",
    "section": "pemahaman",
    "topic": "Blower",
    "prompt": "Tegangan dan arus efektif blower AC satu fasa sudah diukur. Besaran tambahan apa yang diperlukan untuk memperoleh daya listrik aktif dari kedua pengukuran itu?",
    "options": [
      "Faktor daya pada kondisi pengukuran.",
      "Efisiensi motor pada kondisi pengukuran.",
      "Frekuensi sumber listrik pada kondisi pengukuran.",
      "Putaran poros pada kondisi pengukuran."
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q9",
    "section": "pemahaman",
    "topic": "Panel surya",
    "prompt": "Bagaimana panel fotovoltaik memasok listrik untuk sensor di lahan pertanian?",
    "options": [
      "Panel memusatkan cahaya untuk menghasilkan uap yang memutar turbin.",
      "Sel semikonduktor mengubah energi cahaya menjadi listrik DC.",
      "Panel memanaskan udara yang memutar rotor generator.",
      "Sel semikonduktor menyimpan panas untuk menggerakkan pompa kalor."
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q10",
    "section": "pemahaman",
    "topic": "Panel surya",
    "prompt": "Dua panel identik diuji dengan orientasi, suhu, dan beban yang sebanding. Satu panel terkena bayangan sebagian. Apa dampak yang paling mungkin pada panel yang terbayangi?",
    "options": [
      "Daya meningkat karena bagian panel yang terkena matahari menerima lebih banyak radiasi.",
      "Daya tetap karena kapasitas tertera pada label panel sama.",
      "Daya meningkat karena bayangan menambah arus dari sel yang tertutup.",
      "Daya cenderung menurun karena sebagian sel menerima lebih sedikit cahaya."
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q11",
    "section": "pemahaman",
    "topic": "Panel surya",
    "prompt": "Apa arti kapasitas 100 Wp pada label modul fotovoltaik?",
    "options": [
      "Daya puncak nominal 100 W pada kondisi uji standar.",
      "Daya keluaran tetap 100 W selama modul terkena cahaya.",
      "Energi listrik total 100 Wh yang dihasilkan setiap hari.",
      "Energi tersimpan 100 Wh yang tersedia saat malam hari."
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q12",
    "section": "pemahaman",
    "topic": "Panel surya",
    "prompt": "Mahasiswa ingin mengetahui daya yang benar-benar diterima kipas DC dari panel surya. Pasangan pengukuran mana yang tepat?",
    "options": [
      "Tegangan rangkaian terbuka dan arus hubung singkat.",
      "Tegangan saat kipas terhubung dan arus hubung singkat panel.",
      "Tegangan dan arus saat kipas terhubung pada kondisi operasi yang sama.",
      "Tegangan rangkaian terbuka dan arus yang tertera pada label kipas."
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q13",
    "section": "pemahaman",
    "topic": "Panel surya",
    "prompt": "Sistem fotovoltaik mandiri harus menyalakan sensor tanah setelah matahari terbenam. Komponen apa yang menyediakan energi yang telah dikumpulkan pada siang hari?",
    "options": [
      "Inverter yang mengubah arus searah menjadi arus bolak-balik.",
      "Pengatur pengisian yang mengatur aliran daya dari panel.",
      "Modul fotovoltaik yang mengubah cahaya menjadi listrik.",
      "Baterai yang menyimpan energi untuk dipakai saat radiasi matahari rendah."
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q14",
    "section": "pemahaman",
    "topic": "Kincir angin",
    "prompt": "Apa urutan konversi energi pada kincir angin yang digunakan untuk memasok listrik ke sensor cuaca?",
    "options": [
      "Energi kinetik angin → putaran rotor dan poros → energi listrik dari generator.",
      "Energi kinetik angin → energi listrik dari bilah → putaran poros.",
      "Energi kinetik angin → energi listrik dari poros → putaran generator.",
      "Energi kinetik angin → putaran menara → energi listrik dari bilah."
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q15",
    "section": "pemahaman",
    "topic": "Kincir angin",
    "prompt": "Apa pembeda utama antara turbin angin sumbu horizontal (HAWT) dan turbin angin sumbu vertikal (VAWT)?",
    "options": [
      "Posisi generator terhadap permukaan tanah.",
      "Orientasi sumbu putar rotor terhadap permukaan tanah.",
      "Arah putaran rotor jika dilihat dari depan turbin.",
      "Jumlah tingkat transmisi antara rotor dan generator."
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q16",
    "section": "pemahaman",
    "topic": "Kincir angin",
    "prompt": "Data mana yang paling berguna untuk membandingkan potensi dua lokasi pemasangan turbin kecil di lahan pertanian?",
    "options": [
      "Satu pembacaan kecepatan angin siang hari pada setiap lokasi.",
      "Kecepatan angin tertinggi yang tercatat satu kali di permukaan tanah.",
      "Catatan kecepatan angin selama periode yang mewakili kondisi setempat pada ketinggian rotor yang direncanakan.",
      "Rata-rata kecepatan angin dari lokasi lain dengan ketinggian dan hambatan sekitar yang berbeda."
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q17",
    "section": "pemahaman",
    "topic": "Kincir angin",
    "prompt": "Apa arti batas Betz sebesar sekitar 59,3% dalam pembahasan turbin angin?",
    "options": [
      "Batas teoritis efisiensi generator dalam mengubah daya poros menjadi listrik.",
      "Persentase daya listrik nominal yang dihasilkan turbin pada kecepatan angin berapa pun.",
      "Persentase waktu minimum turbin beroperasi selama satu tahun.",
      "Fraksi maksimum daya angin pada luas sapuan rotor yang secara teori dapat ditangkap rotor ideal sebagai daya mekanik."
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q18",
    "section": "hitungan",
    "topic": "Pompa air",
    "prompt": "Pompa mengisi wadah dengan 30 L air dalam 15 detik. Berapa debit aliran dalam m³/s?",
    "options": [
      "0,0002 m³/s",
      "0,0200 m³/s",
      "0,0020 m³/s",
      "0,2000 m³/s"
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q19",
    "section": "hitungan",
    "topic": "Pompa air",
    "prompt": "Pompa memindahkan air antara dua tandon besar yang terbuka. Beda tinggi muka air 9 m, rugi aliran pada debit terukur 3 m, debit 1,5 L/s, dan daya listrik aktif masuk 360 W. Gunakan massa jenis air 1.000 kg/m³ dan g = 9,81 m/s². Berapa efisiensi listrik ke air? Bulatkan hingga dua angka di belakang koma.",
    "options": [
      "49,05%",
      "36,79%",
      "61,31%",
      "12,26%"
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q20",
    "section": "hitungan",
    "topic": "Blower",
    "prompt": "Luas penampang saluran blower 0,05 m² dan kecepatan rata-rata udara pada penampang itu 6 m/s. Kenaikan tekanan total antara sisi masuk dan keluar adalah 300 Pa. Berapa daya udara yang dihasilkan blower?",
    "options": [
      "15 W",
      "900 W",
      "1.800 W",
      "90 W"
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q21",
    "section": "hitungan",
    "topic": "Blower",
    "prompt": "Blower AC satu fasa bekerja pada tegangan efektif 220 V, arus efektif 2 A, dan faktor daya 0,80. Daya udara yang dihasilkan adalah 88 W. Berapa efisiensi dari daya listrik aktif ke daya udara?",
    "options": [
      "20,00%",
      "25,00%",
      "31,25%",
      "40,00%"
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q22",
    "section": "hitungan",
    "topic": "Panel surya",
    "prompt": "Pada kondisi berbeban yang sama, tegangan keluaran DC panel surya 18 V dan arusnya 2,5 A. Berapa daya listrik yang diterima beban?",
    "options": [
      "45,0 W",
      "20,5 W",
      "7,2 W",
      "72,0 W"
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q23",
    "section": "hitungan",
    "topic": "Panel surya",
    "prompt": "Panel surya memasok daya rata-rata 80 W selama 3 jam pertama dan 50 W selama 2 jam berikutnya. Berapa energi listrik total yang dihasilkan dalam lima jam, dinyatakan dalam kWh?",
    "options": [
      "0,130 kWh",
      "0,325 kWh",
      "0,340 kWh",
      "0,650 kWh"
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q24",
    "section": "hitungan",
    "topic": "Kincir angin",
    "prompt": "Kecepatan angin seragam di bidang rotor adalah 5 m/s. Luas sapuan rotor 2 m² dan massa jenis udara 1,20 kg/m³. Berapa daya angin yang tersedia pada bidang sapuan rotor?",
    "options": [
      "30 W",
      "150 W",
      "300 W",
      "6 W"
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q25",
    "section": "hitungan",
    "topic": "Kincir angin",
    "prompt": "Pada suatu pengujian, daya angin yang tersedia pada bidang rotor adalah 180 W. Generator memasok listrik DC ke beban dengan tegangan 12 V dan arus 3 A. Berapa persentase daya angin tersedia yang menjadi daya listrik pada beban?",
    "options": [
      "15%",
      "30%",
      "36%",
      "20%"
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q26",
    "section": "pemahaman",
    "topic": "Pompa air",
    "prompt": "Pada pompa sentrifugal, komponen mana yang secara langsung memberi energi mekanis kepada air?",
    "options": [
      "Motor listrik",
      "Sudu impeller yang berputar",
      "Katup pada pipa keluar",
      "Saringan di ujung pipa isap"
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q27",
    "section": "pemahaman",
    "topic": "Pompa air",
    "prompt": "Pompa dengan impeller sentrifugal dipasang di ruang mesin yang kering dan menyedot air melalui pipa. Bagaimana klasifikasi pemasangannya?",
    "options": [
      "Pompa sentrifugal submersibel karena sumber air berada di bawahnya.",
      "Pompa perpindahan positif karena menggunakan pipa isap.",
      "Pompa sentrifugal permukaan karena unit pompa berada di luar air.",
      "Pompa aksial karena air masuk melalui pipa."
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q28",
    "section": "pemahaman",
    "topic": "Pompa air",
    "prompt": "Dua tandon irigasi terbuka memiliki muka air pada elevasi yang sama. Saat air mengalir, apa penyumbang head total pada sistem tersebut?",
    "options": [
      "Rugi aliran pada pipa, katup, dan sambungan.",
      "Selisih volume air di kedua tandon.",
      "Kedalaman dasar tandon dari permukaan tanah.",
      "Tekanan atmosfer yang hanya bekerja pada tandon sumber."
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q29",
    "section": "pemahaman",
    "topic": "Pompa air",
    "prompt": "Pompa harus memasok 4 L/s pada head 10 m. Informasi mana yang cukup untuk memastikan kebutuhan tersebut terpenuhi pada titik kerja?",
    "options": [
      "Debit maksimum 4 L/s saat head mendekati nol.",
      "Head maksimum 10 m saat debit mendekati nol.",
      "Daya motor sama dengan daya motor pompa lama.",
      "Kurva pompa menunjukkan head 10 m pada debit 4 L/s."
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q30",
    "section": "pemahaman",
    "topic": "Blower",
    "prompt": "Pada pengering hasil pertanian, apa peran aliran udara yang dihasilkan blower setelah udara dipanaskan?",
    "options": [
      "Mengangkut uap air dari bahan menuju saluran buang.",
      "Mengukur suhu permukaan bahan.",
      "Menambah panas dengan mengubah setelan elemen pemanas.",
      "Menentukan massa awal bahan tanpa sensor."
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q31",
    "section": "pemahaman",
    "topic": "Blower",
    "prompt": "Kecepatan udara di saluran blower tidak seragam. Jika penampang dibagi menjadi beberapa bagian dengan luas yang sama, cara apa yang lebih tepat untuk memperkirakan debit?",
    "options": [
      "Mengalikan kecepatan pada satu titik di tengah dengan luas total.",
      "Mengalikan rata-rata kecepatan yang diukur pada setiap bagian dengan luas total.",
      "Mengalikan selisih kecepatan terbesar dan terkecil dengan luas total.",
      "Menjumlahkan kecepatan hasil pengukuran tanpa menggunakan luas."
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q32",
    "section": "pemahaman",
    "topic": "Blower",
    "prompt": "Tekanan total masuk dan keluar serta debit udara sebuah blower sudah diukur. Pengukuran tambahan apa yang diperlukan untuk menghitung efisiensi listrik ke udara?",
    "options": [
      "Kecepatan putaran poros.",
      "Suhu permukaan motor.",
      "Daya listrik aktif yang masuk.",
      "Diameter luar rumah blower."
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q33",
    "section": "pemahaman",
    "topic": "Blower",
    "prompt": "Dua blower AC satu fasa bekerja pada tegangan dan arus efektif yang sama. Blower A memiliki faktor daya lebih tinggi daripada blower B. Bagaimana daya listrik aktif keduanya?",
    "options": [
      "Blower A lebih tinggi.",
      "Blower B lebih tinggi.",
      "Daya listrik aktif keduanya sama.",
      "Daya listrik aktif keduanya selalu nol."
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q34",
    "section": "pemahaman",
    "topic": "Panel surya",
    "prompt": "Apa yang terjadi pada sel fotovoltaik ketika terkena cahaya dan dihubungkan ke beban yang sesuai?",
    "options": [
      "Sel menyimpan energi sebagai udara bertekanan.",
      "Cahaya memungkinkan terbentuknya arus listrik searah melalui beban.",
      "Sel menghasilkan arus bolak-balik tanpa rangkaian tambahan.",
      "Arus terbentuk semata-mata dari kenaikan suhu permukaan sel."
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q35",
    "section": "pemahaman",
    "topic": "Panel surya",
    "prompt": "Dua modul surya identik diuji pada kondisi dan beban yang sebanding. Bayangan pada sebagian permukaan salah satu modul dihilangkan. Bagaimana kecenderungan daya modul itu?",
    "options": [
      "Daya turun karena permukaan yang menerima cahaya bertambah.",
      "Daya selalu tetap karena rating Wp tidak berubah.",
      "Daya cenderung naik karena bagian yang sebelumnya terbayang kembali menerima cahaya.",
      "Daya berubah menjadi energi tersimpan tanpa perubahan keluaran listrik."
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q36",
    "section": "pemahaman",
    "topic": "Panel surya",
    "prompt": "Sebuah panel 150 Wp hanya menghasilkan 100 W saat diuji di lapangan. Bagaimana membaca label 150 Wp?",
    "options": [
      "Sebagai jaminan keluaran 150 W setiap saat.",
      "Sebagai kapasitas penyimpanan energi 150 Wh.",
      "Sebagai energi minimum 150 Wh setiap hari.",
      "Sebagai daya puncak nominal pada kondisi uji standar."
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q37",
    "section": "pemahaman",
    "topic": "Panel surya",
    "prompt": "Voltmeter sudah mengukur tegangan di terminal beban DC yang tersambung ke panel surya. Pembacaan apa yang harus dipasangkan dengan tegangan itu untuk menghitung daya beban?",
    "options": [
      "Arus yang melewati beban pada kondisi operasi yang sama.",
      "Arus hubung singkat panel saat beban dilepas.",
      "Arus maksimum pada label panel.",
      "Tegangan rangkaian terbuka panel."
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q38",
    "section": "pemahaman",
    "topic": "Panel surya",
    "prompt": "Pada sistem surya mandiri, komponen mana yang memasok energi tersimpan untuk lampu kandang saat panel tidak menghasilkan daya?",
    "options": [
      "Inverter, karena mengubah bentuk arus.",
      "Baterai, karena menyimpan energi dari pengisian sebelumnya.",
      "Kabel, karena menyimpan tegangan panel semalaman.",
      "Pengatur pengisian, karena selalu menghasilkan energi sendiri."
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q39",
    "section": "pemahaman",
    "topic": "Kincir angin",
    "prompt": "Generator turbin angin terhubung ke rotor melalui poros. Bentuk energi apa yang diterima generator dari poros sebelum diubah menjadi listrik?",
    "options": [
      "Energi kimia dari udara.",
      "Energi radiasi yang diserap bilah.",
      "Energi mekanis berupa putaran.",
      "Energi listrik yang dihasilkan langsung oleh bilah."
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q40",
    "section": "pemahaman",
    "topic": "Kincir angin",
    "prompt": "Sumbu putar rotor sebuah turbin angin tegak lurus terhadap permukaan tanah yang datar. Jenis turbin apakah itu?",
    "options": [
      "Turbin angin sumbu horizontal.",
      "Turbin angin sumbu vertikal.",
      "Turbin angin yang jenisnya ditentukan oleh tegangan generator.",
      "Turbin angin yang jenisnya ditentukan oleh jumlah bilah."
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q41",
    "section": "pemahaman",
    "topic": "Kincir angin",
    "prompt": "Dua lokasi akan dibandingkan untuk memasang turbin angin di kebun. Prosedur pengukuran mana yang paling mendukung perbandingan?",
    "options": [
      "Mencatat satu embusan terkuat di setiap lokasi.",
      "Membandingkan pembacaan sesaat dari ketinggian yang berbeda.",
      "Menggunakan pengukuran dari lokasi terdekat untuk mewakili kedua lokasi.",
      "Mencatat kecepatan angin selama periode representatif pada ketinggian rotor rencana di masing-masing lokasi."
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q42",
    "section": "pemahaman",
    "topic": "Kincir angin",
    "prompt": "Dalam analisis turbin angin, batas Betz membatasi rasio besaran apa?",
    "options": [
      "Daya mekanis yang ditangkap rotor terhadap daya angin yang tersedia di luas sapuannya.",
      "Daya listrik keluaran generator terhadap daya masuk generator.",
      "Energi harian turbin terhadap kapasitas baterai.",
      "Kecepatan ujung bilah terhadap kecepatan putaran generator."
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q43",
    "section": "hitungan",
    "topic": "Pompa air",
    "prompt": "Pompa mengisi wadah dengan 48 L dalam 20 detik. Berapa debitnya dalam m³/s?",
    "options": [
      "0,024",
      "0,0024",
      "0,00024",
      "2,4"
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q44",
    "section": "hitungan",
    "topic": "Pompa air",
    "prompt": "Pompa mengalirkan air 2 L/s di antara dua tandon terbuka dengan beda tinggi muka air 7 m dan rugi head 3 m. Daya listrik masuk 400 W. Gunakan massa jenis air 1.000 kg/m³ dan g = 9,81 m/s². Berapa efisiensi listrik ke air?",
    "options": [
      "34,34%",
      "98,10%",
      "49,05%",
      "19,62%"
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q45",
    "section": "hitungan",
    "topic": "Blower",
    "prompt": "Luas penampang saluran blower 0,08 m², kecepatan rata-rata udara 5 m/s, dan kenaikan tekanan total 250 Pa. Berapa daya udara yang dihasilkan?",
    "options": [
      "20 W",
      "50 W",
      "125 W",
      "100 W"
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q46",
    "section": "hitungan",
    "topic": "Blower",
    "prompt": "Blower satu fasa menarik arus efektif 2,5 A pada 220 V dengan faktor daya 0,80. Daya udara keluar sebesar 132 W. Berapa efisiensinya dari daya listrik aktif ke daya udara?",
    "options": [
      "30%",
      "24%",
      "40%",
      "60%"
    ],
    "correct": 0,
    "points": 4
  },
  {
    "id": "q47",
    "section": "hitungan",
    "topic": "Panel surya",
    "prompt": "Sebuah panel surya memasok beban DC. Tegangan dan arus yang diukur pada beban adalah 20 V dan 1,8 A. Berapa daya listrik yang diterima beban?",
    "options": [
      "18 W",
      "21,8 W",
      "36 W",
      "40 W"
    ],
    "correct": 2,
    "points": 4
  },
  {
    "id": "q48",
    "section": "hitungan",
    "topic": "Panel surya",
    "prompt": "Panel surya menghasilkan daya rata-rata 60 W selama 2 jam, lalu 90 W selama 3 jam. Berapa energi listrik yang dihasilkan dalam 5 jam?",
    "options": [
      "0,150 kWh",
      "0,390 kWh",
      "0,450 kWh",
      "3,90 kWh"
    ],
    "correct": 1,
    "points": 4
  },
  {
    "id": "q49",
    "section": "hitungan",
    "topic": "Kincir angin",
    "prompt": "Kecepatan angin seragam di bidang rotor adalah 6 m/s, luas sapuan rotor 2 m², dan massa jenis udara 1,25 kg/m³. Berapa daya angin yang tersedia pada bidang sapuan rotor?",
    "options": [
      "108 W",
      "180 W",
      "540 W",
      "270 W"
    ],
    "correct": 3,
    "points": 4
  },
  {
    "id": "q50",
    "section": "hitungan",
    "topic": "Kincir angin",
    "prompt": "Daya angin yang tersedia pada bidang rotor adalah 240 W. Keluaran generator ke beban DC sebesar 24 V dan 2,5 A. Berapa persentase daya angin yang menjadi daya listrik pada beban?",
    "options": [
      "25%",
      "10%",
      "40%",
      "60%"
    ],
    "correct": 0,
    "points": 4
  }
];

function pilihPaketKuis_(bank, rng = Math.random, previous = []) {
  if (bank.length !== 50) throw new Error("Bank kuis harus berisi 50 soal.");
  const byId = new Map(bank.map((item) => [item.id, item]));
  if (byId.size !== 50) throw new Error("ID soal harus unik.");
  const paket = [];
  for (let index = 1; index <= 25; index++) {
    const awal = byId.get("q" + index);
    const padanan = byId.get("q" + (index + 25));
    if (!awal || !padanan || awal.topic !== padanan.topic ||
        awal.section !== padanan.section || awal.points !== padanan.points) {
      throw new Error("Pasangan soal tidak cocok untuk q" + index + ".");
    }
    paket.push(rng() < 0.5 ? awal : padanan);
  }

  const previousIds = new Set(previous);
  if (paket.every((item) => previousIds.has(item.id))) {
    const index = Math.floor(rng() * paket.length);
    const oldNumber = Number(paket[index].id.slice(1));
    const otherNumber = oldNumber <= 25 ? oldNumber + 25 : oldNumber - 25;
    paket[index] = byId.get("q" + otherNumber);
  }

  for (let index = paket.length - 1; index > 0; index--) {
    const other = Math.floor(rng() * (index + 1));
    [paket[index], paket[other]] = [paket[other], paket[index]];
  }
  return paket;
}

const QUIZ_MS = 30 * 60 * 1000;
const QUIZ_GROUPS = new Set(["A", "B", "C"]);
const QUIZ_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const QUIZ_START_KEY = "KODE_MULAI_UAS";
const QUIZ_RECAP_KEY = "KODE_REKAP_DOSEN";
const QUIZ_ATTEMPT_PREFIX = "quiz:";
const QUIZ_BY_ID = new Map(BANK_DAYA_50.map((question) => [question.id, question]));

function doGet(event) {
  const recap = event?.parameter?.halaman === "rekap";
  if (recap) quizInitializeRecap_();
  const template = HtmlService.createTemplate(QUIZ_HTML);
  template.recap = recap ? "true" : "false";
  template.appUrl = ScriptApp.getService().getUrl();
  return template.evaluate().setTitle(recap ? "Rekap Dosen | UAS Daya" : "UAS Daya Dalam Bidang Pertanian")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function quizRpc(action, body) {
  try {
    const properties = PropertiesService.getScriptProperties();
    const data = body && typeof body === "object" && !Array.isArray(body) ? body : {};
    if (action === "recap") return quizRecap_(properties, data);
    if (action === "start") return quizStart_(properties, data);
    if (!["get", "reset", "submit"].includes(action) || !quizValidId_(data.id)) {
      return quizError_("Sesi UAS tidak ditemukan.", 404);
    }
    const key = QUIZ_ATTEMPT_PREFIX + data.id;
    if (action === "get") {
      const row = quizRead_(properties, key);
      return row?.accessGranted === true ? quizPayload_(row) : quizError_("Sesi UAS tidak ditemukan.", 404);
    }
    return quizLocked_(() => {
      const row = quizRead_(properties, key);
      if (row?.accessGranted !== true) return quizError_("Sesi UAS tidak ditemukan.", 404);
      return action === "reset" ? quizReset_(properties, key, row, data) : quizSubmit_(properties, key, row, data);
    });
  } catch (error) {
    console.error("Quiz request failed", error?.name);
    return quizError_("Permintaan belum berhasil. Coba lagi.", 503);
  }
}

function quizInitializeRecap_() {
  const properties = PropertiesService.getScriptProperties();
  if (properties.getProperty(QUIZ_RECAP_KEY)) return;
  quizLocked_(() => {
    if (!properties.getProperty(QUIZ_RECAP_KEY)) {
      properties.setProperty(QUIZ_RECAP_KEY, Utilities.getUuid() + Utilities.getUuid());
    }
  });
}

function quizLocked_(action) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return quizError_("Server sedang sibuk. Coba lagi.", 503);
  try {
    return action();
  } finally {
    lock.releaseLock();
  }
}

function quizValidId_(value) {
  return typeof value === "string" && QUIZ_UUID.test(value);
}

function quizRead_(properties, key) {
  const saved = properties.getProperty(key);
  return saved ? JSON.parse(saved) : null;
}

function quizError_(error, status, payload = {}) {
  return { error, status, ...payload };
}

function quizState_(row) {
  const now = Date.now();
  const status = row.submittedAt !== null ? "submitted" : now >= row.deadlineAt ? "expired" : "active";
  return {
    id: row.id, fullName: row.fullName, nim: row.nim, group: row.group,
    deadlineAt: row.deadlineAt, serverTime: now, resetCount: row.events.length,
    lastResetAt: row.lastResetAt, status,
    result: status === "submitted"
      ? { correct: row.correct, score: row.score, maxScore: 100, submittedAt: row.submittedAt }
      : null,
  };
}

function quizQuestions_(row) {
  // Rows created by older deployments used the original fixed set.
  return row.questionIds ? row.questionIds.map((id) => QUIZ_BY_ID.get(id)) : BANK_DAYA_50.slice(0, 25);
}

function quizPayload_(row) {
  const questions = quizQuestions_(row).map(({ id, section, topic, prompt, options, points }) => (
    { id, section, topic, prompt, options, points }
  ));
  return { attempt: quizState_(row), questions };
}

function quizStart_(properties, data) {
  const fullName = typeof data.fullName === "string" ? data.fullName.trim() : "";
  const nim = typeof data.nim === "string" ? data.nim.trim().toUpperCase() : "";
  if (!quizValidId_(data.id) || fullName.length < 2 || fullName.length > 100 ||
      /[\u0000-\u001f\u007f]/u.test(fullName) || !/^[A-Z0-9]{3,25}$/.test(nim) || !QUIZ_GROUPS.has(data.group)) {
    return quizError_("Isi nama, NIM (3–25 huruf atau angka), dan golongan.", 400);
  }
  const startCode = properties.getProperty(QUIZ_START_KEY)?.trim();
  const recapCode = properties.getProperty(QUIZ_RECAP_KEY)?.trim();
  if (!startCode || startCode.length > 100 || startCode === recapCode) {
    return quizError_("UAS belum dibuka. Tunggu kode dari dosen.", 403);
  }
  if (!quizCodeMatches_(data.startCode, startCode)) return quizError_("Kode mulai UAS tidak valid.", 403);

  return quizLocked_(() => {
    const key = QUIZ_ATTEMPT_PREFIX + data.id;
    const existing = quizRead_(properties, key);
    if (existing) {
      if (existing.accessGranted === true) return quizPayload_(existing);
      return quizError_("Sesi UAS tidak ditemukan. Silakan mulai lagi.", 404);
    }
    const row = {
      id: data.id, fullName, nim, group: data.group, accessGranted: true,
      deadlineAt: Date.now() + QUIZ_MS,
      questionIds: pilihPaketKuis_(BANK_DAYA_50).map(({id}) => id),
      events: [], lastResetAt: null, submittedAt: null, correct: null, score: null,
    };
    properties.setProperty(key, JSON.stringify(row));
    return quizPayload_(row);
  });
}

function quizReset_(properties, key, row, data) {
  if (!quizValidId_(data.eventId)) return quizError_("Catatan reset tidak valid.", 400);
  if (quizState_(row).status !== "active" || row.events.includes(data.eventId)) return quizPayload_(row);
  if (row.events.length >= 120) return quizError_("Batas pencatatan reset sesi ini tercapai.", 429);
  const previous = quizQuestions_(row).map(({id}) => id);
  row.questionIds = pilihPaketKuis_(BANK_DAYA_50, Math.random, previous).map(({id}) => id);
  row.events.push(data.eventId);
  row.lastResetAt = Date.now();
  properties.setProperty(key, JSON.stringify(row));
  return quizPayload_(row);
}

function quizSubmit_(properties, key, row, data) {
  const state = quizState_(row);
  if (state.status === "submitted") return quizPayload_(row);
  if (state.status === "expired") return quizError_("Waktu pengerjaan sudah habis.", 410, quizPayload_(row));
  if (data.resetCount !== state.resetCount) {
    return quizError_("Paket sudah berubah. Mulai lagi dari soal pertama.", 409, quizPayload_(row));
  }
  const answers = data.answers;
  const questions = quizQuestions_(row);
  const valid = answers && typeof answers === "object" && !Array.isArray(answers) &&
    Object.keys(answers).length === questions.length && questions.every(({id, options}) =>
      Number.isInteger(answers[id]) && answers[id] >= 0 && answers[id] < options.length);
  if (!valid) return quizError_("Jawab semua soal pada paket aktif sebelum mengirim.", 400);
  const correct = questions.filter((question) => answers[question.id] === question.correct);
  const submittedAt = Date.now();
  if (submittedAt >= row.deadlineAt) return quizError_("Waktu pengerjaan sudah habis.", 410, quizPayload_(row));
  row.submittedAt = submittedAt;
  row.correct = correct.length;
  row.score = correct.reduce((sum, question) => sum + question.points, 0);
  properties.setProperty(key, JSON.stringify(row));
  return quizPayload_(row);
}

function quizCodeMatches_(value, secret) {
  const supplied = typeof value === "string" ? value.trim() : "";
  if (!secret || supplied.length !== secret.length) return false;
  let difference = 0;
  for (let index = 0; index < secret.length; index++) {
    difference |= supplied.charCodeAt(index) ^ secret.charCodeAt(index);
  }
  return difference === 0;
}

function quizRecap_(properties, data) {
  const secret = properties.getProperty(QUIZ_RECAP_KEY);
  if (!quizCodeMatches_(data.code, secret)) return quizError_("Kode rekap tidak valid.", 403);
  if (data.group && !QUIZ_GROUPS.has(data.group)) return quizError_("Golongan tidak valid.", 400);
  const results = Object.entries(properties.getProperties())
    .filter(([key]) => key.startsWith(QUIZ_ATTEMPT_PREFIX))
    .map(([, value]) => JSON.parse(value))
    .filter((row) => row.submittedAt !== null && (!data.group || row.group === data.group))
    .sort((left, right) => right.submittedAt - left.submittedAt || left.nim.localeCompare(right.nim))
    .map((row) => ({
      full_name: row.fullName, nim: row.nim, group_name: row.group,
      correct_count: row.correct, score: row.score, submitted_at: row.submittedAt,
      reset_count: row.events.length, last_reset_at: row.lastResetAt,
    }));
  return {results};
}

// Tampilan peserta dan rekap. Kunci tetap di fungsi server.
const QUIZ_HTML = "<!doctype html>\n<html lang=\"id\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <meta name=\"color-scheme\" content=\"light\">\n  <title>UAS Daya Dalam Bidang Pertanian</title>\n  <base target=\"_top\">\n  <style>\n@font-face {\n  font-family: \"Geist\";\n  src: local(\"Geist\");\n  font-display: swap;\n}\n\n:root {\n  font-family: \"Geist\", \"Segoe UI\", system-ui, sans-serif;\n  color: #202b26;\n  background: #f5f6f0;\n  font-size: 16px;\n  line-height: 1.52;\n  font-synthesis: none;\n  --ink: #202b26;\n  --muted: #52645a;\n  --green: #1b4d3c;\n  --deep-green: #153c31;\n  --line: #dce3d9;\n  --paper: #fff;\n  --tint: #edf3eb;\n  --amber-bg: #fff5df;\n  --amber-text: #67481e;\n}\n\n* { box-sizing: border-box; }\n[hidden] { display: none !important; }\nbody { margin: 0; }\nbutton, input, select { font: inherit; }\nbutton, a { -webkit-tap-highlight-color: transparent; }\na { color: inherit; }\nbutton { cursor: pointer; }\nbutton:disabled { cursor: default; opacity: .5; }\n:focus-visible { outline: 3px solid #a87525; outline-offset: 4px; }\n\n.shell { width: min(100% - 64px, 1112px); margin-inline: auto; }\n.site-header { background: #fbfcf8; border-bottom: 1px solid var(--line); }\n.header-inner { min-height: 75px; display: flex; justify-content: space-between; align-items: center; gap: 18px; }\n.wordmark { display: inline-flex; align-items: center; gap: 11px; text-decoration: none; font-weight: 720; letter-spacing: -.035em; }\n.brand-icon { display: inline-grid; place-items: center; width: 39px; height: 39px; border-radius: 11px; background: var(--green); color: #fff; }\n.site-nav { display: flex; align-items: center; gap: 5px; }\n.site-nav a { padding: 8px 12px; border-radius: 8px; color: var(--muted); text-decoration: none; font-size: .91rem; font-weight: 600; }\n.site-nav a[aria-current] { color: var(--green); background: var(--tint); }\nmain.shell { padding-top: clamp(32px, 6vh, 70px); padding-bottom: 62px; }\n.loading { color: var(--muted); }\n\n.landing { display: grid; grid-template-columns: 1.08fr .92fr; align-items: stretch; gap: 18px; }\n.hero { background: var(--deep-green); color: #fff; border-radius: 23px; padding: clamp(27px, 5vw, 56px); display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }\n.eyebrow { color: #c6dac7; margin: 0 0 17px; font-size: .84rem; font-weight: 680; letter-spacing: .022em; }\n.hero h1 { margin: 0; max-width: 11ch; font-size: clamp(2.35rem, 5.2vw, 4.25rem); font-weight: 680; line-height: 1.02; letter-spacing: -.062em; text-wrap: balance; }\n.hero .subtitle { margin: 22px 0 28px; color: #d8e6dc; max-width: 31ch; }\n.topics { display: flex; gap: 7px; flex-wrap: wrap; margin: 0; padding: 0; list-style: none; }\n.topics li { color: #edf5ed; padding: 5px 9px; border: 1px solid #628075; border-radius: 6px; font-size: .81rem; }\n.facts { margin: 34px 0 0; padding-top: 22px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; border-top: 1px solid #56766a; }\n.facts div { min-width: 0; }\n.facts dd { margin: 0; font-size: clamp(1.4rem, 3vw, 2.05rem); font-weight: 660; line-height: 1; letter-spacing: -.05em; }\n.facts dt { margin-top: 5px; color: #d0e1d4; font-size: .82rem; }\n\n.panel { border: 1px solid var(--line); background: var(--paper); border-radius: 20px; padding: clamp(20px, 3.25vw, 35px); min-width: 0; }\n.identity { align-self: stretch; }\n.panel h2, .recap-header h1, .result h1, .page-title { margin: 0; line-height: 1.13; letter-spacing: -.048em; }\n.panel h2 { font-size: clamp(1.35rem, 2.5vw, 1.85rem); }\n.identity .panel-caption { color: var(--muted); margin: 7px 0 21px; }\n.identity form { display: grid; gap: 15px; }\n.field { display: grid; gap: 5px; }\n.field label { font-weight: 650; font-size: .89rem; }\n.field input, .field select { color: var(--ink); width: 100%; min-height: 44px; background: #fdfefb; border: 1px solid #c8d2c8; border-radius: 8px; padding: 9px 11px; }\n.field input::placeholder { color: #65716a; }\n.field-row { display: grid; grid-template-columns: 1.35fr 1fr; gap: 11px; }\n.button { display: inline-flex; justify-content: center; align-items: center; min-height: 44px; padding: 9px 15px; text-decoration: none; border: 1px solid transparent; border-radius: 8px; font-weight: 680; line-height: 1.25; }\n.button-primary { background: var(--green); color: white; }\n.button-primary:hover:not(:disabled) { background: #143f32; }\n.button-secondary { color: var(--green); background: white; border-color: #c3d2c6; }\n.button-secondary:hover:not(:disabled) { background: var(--tint); }\n.notice { border: 1px solid #e8d6a8; background: var(--amber-bg); color: var(--amber-text); border-radius: 9px; padding: 12px 14px; margin: 0; font-size: .875rem; }\n.error { margin: 0; color: #9b3428; font-size: .88rem; }\n.demo-note { margin: 17px 0 0; color: var(--muted); font-size: .82rem; }\n\n.exam-layout { display: grid; grid-template-columns: minmax(0, 1fr) 262px; gap: 16px; align-items: start; }\n.exam-heading { grid-column: 1 / -1; display: flex; align-items: end; justify-content: space-between; gap: 14px; margin-bottom: 5px; }\n.page-title { font-size: clamp(1.75rem, 3.8vw, 2.75rem); }\n.identity-caption { margin: 7px 0 0; color: var(--muted); font-size: .91rem; overflow-wrap: anywhere; }\n.clock { background: var(--deep-green); color: #fff; padding: 9px 15px; border-radius: 10px; text-align: right; min-width: 110px; }\n.clock span { display: block; color: #d7e6db; font-size: .76rem; line-height: 1.35; }\n.clock time { font-size: 1.4rem; font-weight: 675; font-variant-numeric: tabular-nums; line-height: 1.12; }\n.clock.is-low { background: #763f1d; }\n.exam-notice { grid-column: 1 / -1; }\n.question-meta { color: var(--green); font-weight: 690; font-size: .84rem; margin: 0 0 12px; }\n.question h2 { line-height: 1.28; font-size: clamp(1.32rem, 3.1vw, 1.95rem); }\n.options { display: grid; gap: 8px; margin: 21px 0 0; padding: 0; border: 0; min-width: 0; }\n.option { display: grid; grid-template-columns: 18px 1fr; gap: 10px; align-items: start; min-height: 49px; padding: 11px 13px; border-radius: 9px; border: 1px solid var(--line); cursor: pointer; overflow-wrap: anywhere; }\n.option:hover { background: #f6f9f4; }\n.option:has(input:checked) { border-color: #56866f; background: var(--tint); }\n.option input { margin: 4px 0 0; accent-color: var(--green); width: 16px; height: 16px; }\n.question-actions { display: flex; align-items: center; justify-content: space-between; gap: 9px; margin-top: 22px; }\n.question-actions .button { font-size: .9rem; }\n.progress-panel h2 { font-size: 1.2rem; }\n.progress-label { margin: 6px 0 11px; color: var(--muted); font-size: .88rem; }\nprogress { width: 100%; height: 9px; border: 0; border-radius: 8px; background: #e1e8e0; accent-color: var(--green); }\nprogress::-webkit-progress-bar { background: #e1e8e0; border-radius: 8px; }\nprogress::-webkit-progress-value { background: var(--green); border-radius: 8px; }\nprogress::-moz-progress-bar { background: var(--green); border-radius: 8px; }\n.progress-panel .button { width: 100%; margin-top: 10px; font-size: .89rem; }\n.progress-panel .error { margin-top: 9px; }\n.reset-count { color: var(--muted); font-size: .82rem; margin: 13px 0 0; }\n\n.result { max-width: 635px; margin-inline: auto; text-align: center; padding-block: 36px; }\n.result h1 { font-size: clamp(1.55rem, 3.5vw, 2.4rem); }\n.result .result-note { color: var(--muted); margin: 10px 0 0; }\n.score { color: var(--green); font-weight: 730; line-height: .94; font-size: clamp(3.75rem, 11vw, 6.75rem); letter-spacing: -.09em; margin: 28px 0 12px; }\n.score small { font-size: .43em; color: #637a6d; font-weight: 620; letter-spacing: -.05em; margin-left: 6px; }\n.result-actions { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-top: 25px; }\n\n.recap-header { display: flex; justify-content: space-between; align-items: end; flex-wrap: wrap; gap: 13px; margin-bottom: 17px; }\n.recap-header h1 { font-size: clamp(2rem, 4.7vw, 3.2rem); }\n.recap-header p { margin: 7px 0 0; color: var(--muted); }\n.metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }\n.metric { border: 1px solid var(--line); background: var(--paper); padding: 16px 18px; border-radius: 12px; }\n.metric dt { color: var(--muted); font-size: .84rem; }\n.metric dd { font-weight: 710; font-size: 1.55rem; margin: 2px 0 0; color: var(--green); }\n.recap-toolbar { display: flex; justify-content: space-between; flex-wrap: wrap; align-items: end; gap: 10px; margin-bottom: 15px; }\n.recap-toolbar .field { width: min(200px, 100%); }\n.table-wrap { overflow: auto; }\ntable { border-collapse: collapse; width: 100%; min-width: 750px; }\nth, td { padding: 11px 9px; border-bottom: 1px solid var(--line); text-align: left; font-size: .84rem; }\nth { background: #f3f6f0; color: var(--green); font-weight: 680; }\ntd { overflow-wrap: anywhere; }\ntd:first-child { font-weight: 630; }\n.empty { color: var(--muted); margin: 12px 0 0; }\n\n.skip-link { position: absolute; left: 10px; top: 10px; transform: translateY(-150%); background: white; padding: 8px 12px; z-index: 2; }\n.skip-link:focus { transform: translateY(0); }\n\n@media (max-width: 800px) {\n  .shell { width: min(100% - 32px, 660px); }\n  .landing, .exam-layout { grid-template-columns: 1fr; }\n  .hero { padding: 29px 26px; }\n  .hero h1 { max-width: 15ch; }\n  .facts { margin-top: 25px; }\n  .progress-panel { padding: 17px 20px; }\n}\n\n@media (max-width: 435px) {\n  .header-inner { min-height: 63px; gap: 5px; }\n  .wordmark { font-size: .86rem; gap: 6px; }\n  .brand-icon { width: 31px; height: 31px; border-radius: 8px; }\n  .brand-icon svg { width: 19px; height: 19px; }\n  .site-nav { gap: 1px; }\n  .site-nav a { font-size: .8rem; padding-inline: 7px; }\n  .field-row { grid-template-columns: 1fr; }\n  .metric { padding: 9px 9px; }\n  .metric dt { font-size: .76rem; }\n  .metric dd { font-size: 1.25rem; }\n}\n\n#question-prompt, .options .option > span { -webkit-user-select: none; user-select: none; }\n  </style>\n</head>\n<body data-recap=\"<?= recap ?>\">\n  <a class=\"skip-link\" href=\"#main\" target=\"_self\">Lewati ke konten</a>\n  <header class=\"site-header\">\n    <div class=\"shell header-inner\">\n      <a class=\"wordmark\" href=\"<?= appUrl ?>\">\n        <span class=\"brand-icon\" aria-hidden=\"true\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" width=\"23\" height=\"23\">\n            <path d=\"M12 20V10m0 3c-5 0-8-3-8-8 5 0 8 3 8 8Zm0 3c5 0 8-3 8-8-5 0-8 3-8 8Z\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n          </svg>\n        </span>\n        <span>UAS Daya Pertanian</span>\n      </a>\n      <nav class=\"site-nav\" aria-label=\"Navigasi UAS\">\n        <a href=\"<?= appUrl ?>\" id=\"nav-student\">Peserta</a>\n        <a href=\"<?= appUrl ?>?halaman=rekap\" id=\"nav-teacher\">Rekap dosen</a>\n      </nav>\n    </div>\n  </header>\n  <main id=\"main\" class=\"shell\" tabindex=\"-1\">\n    <noscript><p class=\"notice\">Aktifkan JavaScript untuk membuka UAS.</p></noscript>\n    <div id=\"view\" aria-busy=\"true\"><p class=\"loading\">Memuat UAS…</p></div>\n  </main>\n  <script>\nconst view = document.querySelector(\"#view\");\nconst attemptKey = \"uas-daya.active-attempt\";\nconst wib = new Intl.DateTimeFormat(\"id-ID\", {\n  timeZone: \"Asia/Jakarta\", dateStyle: \"medium\", timeStyle: \"short\",\n});\nconst isRecap = document.body.dataset.recap === \"true\";\nconst focusGraceMs = 1000;\nconst fallbackStorage = new Map();\nconst tabData = {\n  getItem(key) { try { return sessionStorage.getItem(key); } catch { return fallbackStorage.get(key); } },\n  setItem(key, value) { try { sessionStorage.setItem(key, value); } catch { fallbackStorage.set(key, value); } },\n  removeItem(key) { try { sessionStorage.removeItem(key); } catch { fallbackStorage.delete(key); } },\n};\ndocument.querySelector(isRecap ? \"#nav-teacher\" : \"#nav-student\").setAttribute(\"aria-current\", \"page\");\n\nlet attempt = null;\nlet questions = [];\nlet answers = {};\nlet position = 0;\nlet timeOffset = 0;\nlet pendingResets = new Set();\nlet resetSync = null;\nlet leftPage = false;\nlet focusLostAt = null;\nlet focusLossTimer;\nlet submitting = false;\nlet notice = \"\";\n\nfunction display(markup) {\n  view.innerHTML = markup;\n  view.setAttribute(\"aria-busy\", \"false\");\n}\n\nfunction escapeHtml(value) {\n  return String(value ?? \"\").replace(/[&<>\"']/g, (char) => ({\n    \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\",\n  })[char]);\n}\n\nfunction showError(id, message) {\n  const element = document.getElementById(id);\n  if (element) {\n    element.textContent = message;\n    element.hidden = !message;\n  }\n}\n\nfunction quizRequest(action, body) {\n  return new Promise((resolve, reject) => {\n    google.script.run.withSuccessHandler((data) => {\n      if (!data?.error) return resolve(data);\n      const error = new Error(data.error);\n      error.status = data.status;\n      error.payload = data;\n      reject(error);\n    }).withFailureHandler(() => reject(new Error(\"Server tidak dapat dihubungi. Coba lagi.\")))\n      .quizRpc(action, body);\n  });\n}\n\nfunction api(path, body) {\n  if (path === \"/api/attempts\") {\n    const id = tabData.getItem(attemptKey) || crypto.randomUUID();\n    tabData.setItem(attemptKey, id);\n    return quizRequest(\"start\", {...body, id});\n  }\n  const [, id, action = \"get\"] = path.match(/^\\/api\\/attempts\\/([^/]+)(?:\\/([^/]+))?$/);\n  return quizRequest(action, {...body, id});\n}\n\nfunction acceptState(data) {\n  const next = data.attempt;\n  if (attempt?.id === next.id && next.status === \"active\" && next.resetCount < attempt.resetCount) return;\n  timeOffset = next.serverTime - Date.now();\n  attempt = next;\n  questions = data.questions;\n}\n\nfunction loadPending(id) {\n  try {\n    return new Set(JSON.parse(tabData.getItem(`kuis-daya.pending.${id}`) || \"[]\"));\n  } catch {\n    return new Set();\n  }\n}\n\nfunction savePending(id) {\n  const key = `kuis-daya.pending.${id}`;\n  if (pendingResets.size) tabData.setItem(key, JSON.stringify([...pendingResets]));\n  else tabData.removeItem(key);\n}\n\nfunction clearDraft(message) {\n  answers = {};\n  position = 0;\n  if (message) notice = message;\n}\n\nfunction landing(message = \"\") {\n  display(`\n    <div class=\"landing\">\n      <section class=\"hero\" aria-labelledby=\"quiz-title\">\n        <div>\n          <p class=\"eyebrow\">D3 Keteknikan Pertanian · Semester 1</p>\n          <h1 id=\"quiz-title\">UAS Daya Dalam Bidang Pertanian</h1>\n          <p class=\"subtitle\">Pemahaman dan perhitungan energi pada alat pertanian.</p>\n          <ul class=\"topics\"><li>Pompa air</li><li>Blower</li><li>Panel surya</li><li>Kincir angin</li></ul>\n        </div>\n        <dl class=\"facts\">\n          <div><dd>25</dd><dt>Soal</dt></div>\n          <div><dd>30</dd><dt>Menit</dt></div>\n          <div><dd>100</dd><dt>Poin maksimal</dt></div>\n        </dl>\n      </section>\n      <section class=\"panel identity\" aria-labelledby=\"identity-title\">\n        <h2 id=\"identity-title\">Identitas peserta</h2>\n        <p class=\"panel-caption\">Jika hanya mengetes tautan, cukup pastikan formulir ini tampil. Kode mulai dibagikan dosen saat ujian.</p>\n        <form id=\"start-form\" method=\"post\">\n          <div class=\"field\">\n            <label for=\"full-name\">Nama lengkap</label>\n            <input id=\"full-name\" name=\"fullName\" maxlength=\"100\" minlength=\"2\" autocomplete=\"name\" required>\n          </div>\n          <div class=\"field-row\">\n            <div class=\"field\">\n              <label for=\"nim\">NIM</label>\n              <input id=\"nim\" name=\"nim\" maxlength=\"25\" pattern=\"[A-Za-z0-9]{3,25}\" autocapitalize=\"characters\" required>\n            </div>\n            <div class=\"field\">\n              <label for=\"group\">Golongan</label>\n              <select id=\"group\" name=\"group\" required>\n                <option value=\"\">Pilih golongan</option><option>A</option><option>B</option><option>C</option>\n              </select>\n            </div>\n          </div>\n          <div class=\"field\">\n            <label for=\"start-code\">Kode mulai UAS</label>\n            <input id=\"start-code\" name=\"startCode\" type=\"password\" maxlength=\"100\" autocomplete=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n          </div>\n          <p class=\"notice\">Jika tab tersembunyi atau halaman kehilangan fokus selama 1 detik, jawaban draf terhapus dan ujian dimulai lagi dari soal pertama dengan paket acak baru. Timer tetap berjalan. Penyalinan langsung teks soal dibatasi.</p>\n          <p id=\"start-error\" class=\"error\" role=\"alert\" hidden></p>\n          <button id=\"start-button\" class=\"button button-primary\" type=\"submit\">Mulai UAS</button>\n        </form>\n      </section>\n    </div>\n  `);\n  showError(\"start-error\", message);\n  document.querySelector(\"#start-form\").addEventListener(\"submit\", async (event) => {\n    event.preventDefault();\n    const form = event.currentTarget;\n    const button = document.querySelector(\"#start-button\");\n    if (button.disabled) return;\n    button.disabled = true;\n    button.textContent = \"Membuka sesi…\";\n    showError(\"start-error\", \"\");\n    try {\n      await enterAttempt(await api(\"/api/attempts\", Object.fromEntries(new FormData(form))));\n    } catch (error) {\n      showError(\"start-error\", error.message);\n      button.disabled = false;\n      if (error.status === 404) tabData.removeItem(attemptKey);\n      button.textContent = \"Mulai UAS\";\n    }\n  });\n}\n\nasync function enterAttempt(data) {\n  acceptState(data);\n  tabData.setItem(attemptKey, attempt.id);\n  pendingResets = loadPending(attempt.id);\n  leftPage = false;\n  clearDraft(pendingResets.size ? \"Jawaban draf telah dikosongkan. Mulai kembali dari soal pertama.\" : \"\");\n  renderAttempt();\n  if (attempt.status !== \"active\") return;\n  if (document.hidden) resetDraft(\"Tab ujian sempat tersembunyi.\");\n  else await synchronizeResets();\n}\n\nfunction showClock() {\n  if (attempt?.status !== \"active\") return;\n  const left = attempt.deadlineAt - (Date.now() + timeOffset);\n  const seconds = Math.max(0, Math.ceil(left / 1000));\n  const clock = document.querySelector(\"#clock-time\");\n  if (clock) {\n    clock.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, \"0\")}`;\n    clock.parentElement.classList.toggle(\"is-low\", seconds <= 60);\n  }\n  if (left <= 0 && !submitting) {\n    attempt = { ...attempt, status: \"expired\" };\n    clearDraft();\n    renderAttempt();\n  }\n}\n\nfunction updateProgress() {\n  const answered = Object.keys(answers).length;\n  document.querySelector(\"#progress-label\").textContent = `${answered} dari ${questions.length} dijawab`;\n  document.querySelector(\"#progress\").value = answered;\n  document.querySelector(\"#submit-button\").disabled = answered !== questions.length || submitting;\n  const unanswered = document.querySelector(\"#unanswered\");\n  unanswered.hidden = answered === 0 || answered === questions.length;\n  unanswered.disabled = submitting;\n  document.querySelector(\"#previous\").disabled = position === 0 || submitting;\n  document.querySelector(\"#next\").disabled = position === questions.length - 1 || submitting;\n}\n\nfunction goTo(index) {\n  if (submitting || index < 0 || index >= questions.length) return;\n  position = index;\n  renderExam();\n  document.querySelector(\"#question-prompt\").focus({ preventScroll: true });\n  document.querySelector(\"#question-panel\").scrollIntoView({ block: \"nearest\" });\n}\n\nfunction renderExam() {\n  if (pendingResets.size) {\n    display(`\n      <section class=\"panel\" aria-label=\"Paket soal diperbarui\">\n        <h1>Paket soal diperbarui</h1>\n        <p role=\"status\">${escapeHtml(notice)}</p>\n        <p>Sisa waktu <time id=\"clock-time\">—</time></p>\n        <button type=\"button\" class=\"button button-primary\" id=\"retry-package\">Muat ulang paket</button>\n        <p id=\"package-error\" class=\"error\" role=\"alert\" hidden></p>\n      </section>\n    `);\n    document.querySelector(\"#retry-package\").addEventListener(\"click\", () => void synchronizeResets());\n    showClock();\n    return;\n  }\n  const question = questions[position];\n  const section = question.section === \"hitungan\" ? \"Perhitungan\" : \"Pemahaman\";\n  display(`\n    <section class=\"exam-layout\" aria-label=\"Pengerjaan UAS\">\n      <div class=\"exam-heading\">\n        <div>\n          <h1 class=\"page-title\">Pengerjaan UAS</h1>\n          <p class=\"identity-caption\">${escapeHtml(attempt.fullName)} · ${escapeHtml(attempt.nim)} · Golongan ${escapeHtml(attempt.group)}</p>\n        </div>\n        <div class=\"clock\"><span>Sisa waktu</span><time id=\"clock-time\">—</time></div>\n      </div>\n      <p id=\"exam-notice\" class=\"notice exam-notice\" role=\"status\" ${notice ? \"\" : \"hidden\"}>${escapeHtml(notice)}</p>\n      <article class=\"panel question\" id=\"question-panel\">\n        <p class=\"question-meta\">${section} · ${escapeHtml(question.topic)}</p>\n        <h2 id=\"question-prompt\" tabindex=\"-1\">${escapeHtml(question.prompt)}</h2>\n        <fieldset class=\"options\" aria-labelledby=\"question-prompt\" ${submitting ? \"disabled\" : \"\"}>\n          ${question.options.map((option, index) => `\n            <label class=\"option\">\n              <input type=\"radio\" name=\"answer\" value=\"${index}\" ${answers[question.id] === index ? \"checked\" : \"\"}>\n              <span>${escapeHtml(option)}</span>\n            </label>\n          `).join(\"\")}\n        </fieldset>\n        <div class=\"question-actions\">\n          <button type=\"button\" class=\"button button-secondary\" id=\"previous\">Sebelumnya</button>\n          <button type=\"button\" class=\"button button-secondary\" id=\"next\">Berikutnya</button>\n        </div>\n      </article>\n      <aside class=\"panel progress-panel\" aria-labelledby=\"progress-title\">\n        <h2 id=\"progress-title\">Progres</h2>\n        <p class=\"progress-label\" id=\"progress-label\"></p>\n        <progress id=\"progress\" max=\"${questions.length}\" value=\"0\" aria-label=\"Jumlah soal yang dijawab\"></progress>\n        <button id=\"unanswered\" class=\"button button-secondary review-button\" type=\"button\">Ke soal belum dijawab</button>\n        <button id=\"submit-button\" class=\"button button-primary submit-button\" type=\"button\">${submitting ? \"Mengirim…\" : \"Kirim jawaban\"}</button>\n        <p id=\"submit-error\" class=\"error\" role=\"alert\" hidden></p>\n        <p class=\"reset-count\" id=\"reset-count\">Reset tercatat: ${attempt.resetCount}</p>\n      </aside>\n    </section>\n  `);\n  document.querySelector(\".options\").addEventListener(\"change\", (event) => {\n    answers[question.id] = Number(event.target.value);\n    showError(\"submit-error\", \"\");\n    updateProgress();\n  });\n  document.querySelector(\"#previous\").addEventListener(\"click\", () => goTo(position - 1));\n  document.querySelector(\"#next\").addEventListener(\"click\", () => goTo(position + 1));\n  document.querySelector(\"#unanswered\").addEventListener(\"click\", () => {\n    goTo(questions.findIndex((item) => !Object.hasOwn(answers, item.id)));\n  });\n  document.querySelector(\"#submit-button\").addEventListener(\"click\", submit);\n  updateProgress();\n  showClock();\n}\n\nfunction renderAttempt() {\n  if (attempt.status === \"active\") {\n    renderExam();\n    return;\n  }\n  const complete = attempt.status === \"submitted\";\n  const result = attempt.result;\n  display(`\n    <section class=\"panel result\">\n      <h1>${complete ? \"Jawaban terkirim\" : \"Waktu pengerjaan habis\"}</h1>\n      <p class=\"result-note\">${escapeHtml(attempt.fullName)} · ${escapeHtml(attempt.nim)} · Golongan ${escapeHtml(attempt.group)}</p>\n      ${complete ? `<p class=\"score\" aria-label=\"Nilai ${result.score} dari ${result.maxScore}\">${result.score}<small>/ ${result.maxScore}</small></p>\n        <p class=\"result-note\">${result.correct} dari ${questions.length} jawaban benar</p>\n        <p class=\"result-note\">Dikirim ${wib.format(result.submittedAt)} WIB</p>` :\n        '<p class=\"result-note\">Sesi ini berakhir sebelum jawaban dikirim.</p>'}\n      <div class=\"result-actions\">\n        <button class=\"button button-secondary\" id=\"try-another\" type=\"button\">Coba identitas lain</button>\n      </div>\n    </section>\n  `);\n  document.querySelector(\"#try-another\").addEventListener(\"click\", () => {\n    tabData.removeItem(attemptKey);\n    attempt = null;\n    notice = \"\";\n    landing();\n  });\n}\n\nasync function synchronizeResets() {\n  if (resetSync) return resetSync;\n  if (!pendingResets.size || attempt?.status !== \"active\") return true;\n  const id = attempt.id;\n  resetSync = (async () => {\n    for (const eventId of pendingResets) {\n      try {\n        const data = await api(\"/api/attempts/\" + id + \"/reset\", {eventId});\n        if (attempt?.id !== id) return false;\n        acceptState(data);\n        pendingResets.delete(eventId);\n        if (attempt.status !== \"active\") pendingResets.clear();\n        savePending(id);\n      } catch (error) {\n        showError(\"package-error\", error.message);\n        return false;\n      }\n    }\n    if (attempt?.id === id) renderAttempt();\n    return true;\n  })();\n  try {\n    return await resetSync;\n  } finally {\n    resetSync = null;\n  }\n}\n\nfunction resetDraft(reason) {\n  if (leftPage || attempt?.status !== \"active\") return;\n  leftPage = true;\n  window.clearTimeout(focusLossTimer);\n  focusLostAt = null;\n  clearDraft(reason + \" Jawaban dikosongkan. Mulai lagi dari soal pertama dengan paket baru.\");\n  pendingResets.add(crypto.randomUUID());\n  savePending(attempt.id);\n  if (!submitting) renderExam();\n  void synchronizeResets();\n}\n\nfunction resumeExam() {\n  if (document.hidden) return;\n  if (document.hasFocus()) {\n    if (focusLostAt !== null && performance.now() - focusLostAt >= focusGraceMs) {\n      resetDraft(\"Halaman ujian sempat kehilangan fokus.\");\n    }\n    window.clearTimeout(focusLossTimer);\n    focusLostAt = null;\n    leftPage = false;\n  }\n  showClock();\n  void synchronizeResets();\n}\n\nfunction blockCopy(event) {\n  if (attempt?.status !== \"active\") return;\n  event.preventDefault();\n  if (!notice) showError(\"exam-notice\", \"Penyalinan teks soal dibatasi selama ujian.\");\n}\n\nasync function submit() {\n  if (submitting || document.hidden || pendingResets.size || attempt?.status !== \"active\" ||\n    Object.keys(answers).length !== questions.length) return;\n  submitting = true;\n  renderExam();\n  try {\n    if (!await synchronizeResets()) throw new Error(\"Catatan reset belum tersimpan. Periksa koneksi lalu coba lagi.\");\n    if (attempt.status !== \"active\") return;\n    if (Object.keys(answers).length !== questions.length) {\n      throw new Error(\"Draf telah dikosongkan. Jawab semua soal sebelum mengirim.\");\n    }\n    const data = await api(`/api/attempts/${attempt.id}/submit`, {\n      answers, resetCount: attempt.resetCount,\n    });\n    acceptState(data);\n    clearDraft();\n    renderAttempt();\n  } catch (error) {\n    if (error.payload?.attempt) acceptState(error.payload);\n    if (error.status === 409) clearDraft(error.message);\n    submitting = false;\n    renderAttempt();\n    if (attempt.status === \"active\" && error.status !== 409) showError(\"submit-error\", error.message);\n  } finally {\n    submitting = false;\n  }\n}\n\nfunction formatTime(value) {\n  return value == null ? \"—\" : `${wib.format(value)} WIB`;\n}\n\nfunction renderRecap() {\n  display(`\n    <header class=\"recap-header\">\n      <div><h1>Rekap dosen</h1><p>UAS Daya Dalam Bidang Pertanian</p></div>\n      <button class=\"button button-primary\" id=\"export\" type=\"button\" disabled>Unduh CSV untuk Excel</button>\n    </header>\n    <form id=\"recap-login\" class=\"panel identity\" aria-label=\"Buka rekap dosen\">\n      <div class=\"field\"><label for=\"recap-code\">Kode rekap dosen</label>\n      <input id=\"recap-code\" type=\"password\" autocomplete=\"off\" maxlength=\"100\" required></div>\n      <button class=\"button button-primary\" type=\"submit\">Buka rekap</button>\n      <p id=\"recap-login-error\" class=\"error\" role=\"alert\" hidden></p>\n    </form>\n    <div id=\"recap-content\" hidden>\n    <dl class=\"metrics\">\n      <div class=\"metric\"><dt>Pengiriman</dt><dd id=\"count\">—</dd></div>\n      <div class=\"metric\"><dt>Rata-rata</dt><dd id=\"average\">—</dd></div>\n      <div class=\"metric\"><dt>Nilai tertinggi</dt><dd id=\"highest\">—</dd></div>\n    </dl>\n    <section class=\"panel\" aria-label=\"Daftar nilai\">\n      <div class=\"recap-toolbar\">\n        <div class=\"field\">\n          <label for=\"recap-group\">Golongan</label>\n          <select id=\"recap-group\"><option value=\"\">Semua golongan</option><option>A</option><option>B</option><option>C</option></select>\n        </div>\n        <button id=\"refresh-recap\" class=\"button button-secondary\" type=\"button\">Muat ulang</button>\n      </div>\n      <p id=\"recap-error\" class=\"error\" role=\"alert\" hidden></p>\n      <p id=\"recap-empty\" class=\"empty\" role=\"status\">Memuat hasil…</p>\n      <div id=\"recap-table\" class=\"table-wrap\" tabindex=\"0\" aria-label=\"Tabel nilai peserta\" hidden>\n        <table>\n          <thead><tr><th scope=\"col\">Nama</th><th scope=\"col\">NIM</th><th scope=\"col\">Golongan</th><th scope=\"col\">Benar</th><th scope=\"col\">Nilai</th><th scope=\"col\">Dikirim</th><th scope=\"col\">Reset</th><th scope=\"col\">Reset terakhir</th></tr></thead>\n          <tbody id=\"recap-rows\"></tbody>\n        </table>\n      </div>\n    </section>\n    </div>\n  `);\n\n  let latest = 0;\n  let code = \"\";\n  let loadedRows = [];\n  const login = document.querySelector(\"#recap-login\");\n  const content = document.querySelector(\"#recap-content\");\n  const exportButton = document.querySelector(\"#export\");\n  const group = document.querySelector(\"#recap-group\");\n  const empty = document.querySelector(\"#recap-empty\");\n  const table = document.querySelector(\"#recap-table\");\n  async function refresh() {\n    const request = ++latest;\n    if (!code) return;\n    exportButton.disabled = true;\n    showError(\"recap-error\", \"\");\n    try {\n      const { results } = await quizRequest(\"recap\", {code, group: group.value});\n      if (request !== latest) return;\n      loadedRows = results;\n      login.hidden = true;\n      content.hidden = false;\n      exportButton.disabled = results.length === 0;\n      const scores = results.map((row) => row.score);\n      const decimal = new Intl.NumberFormat(\"id-ID\", { maximumFractionDigits: 1 });\n      document.querySelector(\"#count\").textContent = scores.length;\n      document.querySelector(\"#average\").textContent = scores.length\n        ? decimal.format(scores.reduce((sum, score) => sum + score, 0) / scores.length) : \"—\";\n      document.querySelector(\"#highest\").textContent = scores.length ? Math.max(...scores) : \"—\";\n      document.querySelector(\"#recap-rows\").innerHTML = results.map((row) => `<tr>\n        <td>${escapeHtml(row.full_name)}</td><td>${escapeHtml(row.nim)}</td><td>${escapeHtml(row.group_name)}</td>\n        <td>${row.correct_count}/25</td><td>${row.score}</td><td>${formatTime(row.submitted_at)}</td>\n        <td>${row.reset_count}</td><td>${formatTime(row.last_reset_at)}</td>\n      </tr>`).join(\"\");\n      table.hidden = !results.length;\n      empty.hidden = !!results.length;\n      empty.textContent = \"Belum ada jawaban yang berhasil dikirim pada golongan ini.\";\n    } catch (error) {\n      if (request !== latest) return;\n      empty.hidden = true;\n      if (error.status === 403) {\n        code = \"\";\n        loadedRows = [];\n        login.hidden = false;\n        content.hidden = true;\n      }\n      showError(login.hidden ? \"recap-error\" : \"recap-login-error\", error.message);\n    }\n  }\n  group.addEventListener(\"change\", refresh);\n  document.querySelector(\"#refresh-recap\").addEventListener(\"click\", refresh);\n  exportButton.addEventListener(\"click\", () => downloadRecap(loadedRows));\n  login.addEventListener(\"submit\", (event) => {\n    event.preventDefault();\n    const input = document.querySelector(\"#recap-code\");\n    code = input.value.trim();\n    input.value = \"\";\n    showError(\"recap-login-error\", \"\");\n    void refresh();\n  });\n}\n\nasync function restoreAttempt(id) {\n  try {\n    await enterAttempt(await api(`/api/attempts/${id}`));\n  } catch (error) {\n    if (error.status === 404) tabData.removeItem(attemptKey);\n    landing(error.message);\n  }\n}\n\nif (isRecap) {\n  renderRecap();\n} else {\n  const id = tabData.getItem(attemptKey);\n  if (id) void restoreAttempt(id);\n  else landing();\n  document.addEventListener(\"visibilitychange\", () => {\n    if (document.hidden) resetDraft(\"Tab ujian sempat tersembunyi.\");\n    else resumeExam();\n  });\n  window.addEventListener(\"blur\", () => {\n    if (attempt?.status !== \"active\" || leftPage || focusLostAt !== null) return;\n    focusLostAt = performance.now();\n    focusLossTimer = window.setTimeout(() => {\n      if (!document.hasFocus()) resetDraft(\"Halaman ujian sempat kehilangan fokus.\");\n    }, focusGraceMs);\n  });\n  window.addEventListener(\"focus\", resumeExam);\n  window.addEventListener(\"pagehide\", () => resetDraft(\"Halaman ujian sempat ditinggalkan.\"));\n  window.addEventListener(\"pageshow\", resumeExam);\n  document.addEventListener(\"copy\", blockCopy, true);\n  document.addEventListener(\"cut\", blockCopy, true);\n  window.setInterval(showClock, 400);\n}\n\nfunction downloadRecap(results) {\n  const fields = [\"Nama lengkap\", \"NIM\", \"Golongan\", \"Jawaban benar\", \"Nilai\", \"Dikirim (WIB)\", \"Jumlah reset\", \"Reset terakhir (WIB)\"];\n  const rows = results.map(row => [\n    row.full_name, row.nim, row.group_name, row.correct_count, row.score,\n    formatTime(row.submitted_at), row.reset_count, formatTime(row.last_reset_at),\n  ]);\n  const csvCell = (value) => {\n    const cell = String(value ?? \"\");\n    const safe = /^[\\s\\uFEFF]*[=+@-]/u.test(cell) ? \"'\" + cell : cell;\n    return '\"' + safe.replace(/\"/g, '\"\"') + '\"';\n  };\n  const csv = \"\\uFEFF\" + [fields, ...rows].map(row => row.map(csvCell).join(\";\")).join(\"\\r\\n\") + \"\\r\\n\";\n  const url = URL.createObjectURL(new Blob([csv], {type: \"text/csv;charset=utf-8\"}));\n  const link = document.createElement(\"a\");\n  link.href = url;\n  link.target = \"_self\";\n  link.download = \"Rekap_UAS_Daya_Pertanian.csv\";\n  document.body.append(link);\n  link.click();\n  link.remove();\n  window.setTimeout(() => URL.revokeObjectURL(url), 1000);\n}\n\n  </script>\n</body>\n</html>\n";
