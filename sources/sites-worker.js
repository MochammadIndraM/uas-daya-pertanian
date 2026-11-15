/**
 * UAS Daya Dalam Bidang Pertanian — sumber server.
 *
 * Untuk deployment Worker, atur binding D1 "DB" dan rahasia "KODE_REKAP_DOSEN".
 * Halaman ujian berada di / dan rekap dosen di /rekap.
 * Terapkan SQL awal berikut di database D1 sebelum pengujian pertama.
 *
 * CREATE TABLE quiz_attempts (
 *   id TEXT PRIMARY KEY NOT NULL,
 *   full_name TEXT NOT NULL,
 *   nim TEXT NOT NULL,
 *   group_name TEXT NOT NULL CHECK (group_name IN ('A', 'B', 'C')),
 *   started_at INTEGER NOT NULL,
 *   deadline_at INTEGER NOT NULL,
 *   question_ids TEXT NOT NULL,
 *   reset_events TEXT NOT NULL DEFAULT '[]',
 *   reset_count INTEGER NOT NULL DEFAULT 0,
 *   last_reset_at INTEGER,
 *   submitted_at INTEGER,
 *   correct_count INTEGER,
 *   score INTEGER
 * );
 * CREATE INDEX quiz_attempts_recap ON quiz_attempts (submitted_at DESC, nim) WHERE submitted_at IS NOT NULL;
 */
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

const html = [
  "<!doctype html>",
  "<html lang=\"id\">",
  "<head>",
  "  <meta charset=\"utf-8\">",
  "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
  "  <meta name=\"color-scheme\" content=\"light\">",
  "  <title>__PAGE_TITLE__</title>",
  "  <link rel=\"stylesheet\" href=\"/styles.css\">",
  "</head>",
  "<body data-recap=\"__VIEW_RECAP__\">",
  "  <a class=\"skip-link\" href=\"#main\" target=\"_self\">Lewati ke konten</a>",
  "  <header class=\"site-header\">",
  "    <div class=\"shell header-inner\">",
  "      <a class=\"wordmark\" href=\"/\">",
  "        <span class=\"brand-icon\" aria-hidden=\"true\">",
  "          <svg viewBox=\"0 0 24 24\" fill=\"none\" width=\"23\" height=\"23\">",
  "            <path d=\"M12 20V10m0 3c-5 0-8-3-8-8 5 0 8 3 8 8Zm0 3c5 0 8-3 8-8-5 0-8 3-8 8Z\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>",
  "          </svg>",
  "        </span>",
  "        <span>Kuis Pertanian</span>",
  "      </a>",
  "      <nav class=\"site-nav\" aria-label=\"Navigasi kuis\">",
  "        <a href=\"/\" id=\"nav-student\">Peserta</a>",
  "        <a href=\"/rekap\" id=\"nav-teacher\">Rekap dosen</a>",
  "      </nav>",
  "    </div>",
  "  </header>",
  "  <main id=\"main\" class=\"shell\" tabindex=\"-1\">",
  "    <noscript><p class=\"notice\">Aktifkan JavaScript untuk membuka kuis.</p></noscript>",
  "    <div id=\"view\" aria-busy=\"true\"><p class=\"loading\">Memuat kuis…</p></div>",
  "  </main>",
  "  <script src=\"/app.js\" defer></script>",
  "</body>",
  "</html>",
].join("\n");
const stylesheet = [
  "@font-face {",
  "  font-family: \"Geist\";",
  "  src: local(\"Geist\");",
  "  font-display: swap;",
  "}",
  "",
  ":root {",
  "  font-family: \"Geist\", \"Segoe UI\", system-ui, sans-serif;",
  "  color: #202b26;",
  "  background: #f5f6f0;",
  "  font-size: 16px;",
  "  line-height: 1.52;",
  "  font-synthesis: none;",
  "  --ink: #202b26;",
  "  --muted: #52645a;",
  "  --green: #1b4d3c;",
  "  --deep-green: #153c31;",
  "  --line: #dce3d9;",
  "  --paper: #fff;",
  "  --tint: #edf3eb;",
  "  --amber-bg: #fff5df;",
  "  --amber-text: #67481e;",
  "}",
  "",
  "* { box-sizing: border-box; }",
  "[hidden] { display: none !important; }",
  "body { margin: 0; }",
  "button, input, select { font: inherit; }",
  "button, a { -webkit-tap-highlight-color: transparent; }",
  "a { color: inherit; }",
  "button { cursor: pointer; }",
  "button:disabled { cursor: default; opacity: .5; }",
  ":focus-visible { outline: 3px solid #a87525; outline-offset: 4px; }",
  "",
  ".shell { width: min(100% - 64px, 1112px); margin-inline: auto; }",
  ".site-header { background: #fbfcf8; border-bottom: 1px solid var(--line); }",
  ".header-inner { min-height: 75px; display: flex; justify-content: space-between; align-items: center; gap: 18px; }",
  ".wordmark { display: inline-flex; align-items: center; gap: 11px; text-decoration: none; font-weight: 720; letter-spacing: -.035em; }",
  ".brand-icon { display: inline-grid; place-items: center; width: 39px; height: 39px; border-radius: 11px; background: var(--green); color: #fff; }",
  ".site-nav { display: flex; align-items: center; gap: 5px; }",
  ".site-nav a { padding: 8px 12px; border-radius: 8px; color: var(--muted); text-decoration: none; font-size: .91rem; font-weight: 600; }",
  ".site-nav a[aria-current] { color: var(--green); background: var(--tint); }",
  "main.shell { padding-top: clamp(32px, 6vh, 70px); padding-bottom: 62px; }",
  ".loading { color: var(--muted); }",
  "",
  ".landing { display: grid; grid-template-columns: 1.08fr .92fr; align-items: stretch; gap: 18px; }",
  ".hero { background: var(--deep-green); color: #fff; border-radius: 23px; padding: clamp(27px, 5vw, 56px); display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }",
  ".eyebrow { color: #c6dac7; margin: 0 0 17px; font-size: .84rem; font-weight: 680; letter-spacing: .022em; }",
  ".hero h1 { margin: 0; max-width: 11ch; font-size: clamp(2.35rem, 5.2vw, 4.25rem); font-weight: 680; line-height: 1.02; letter-spacing: -.062em; text-wrap: balance; }",
  ".hero .subtitle { margin: 22px 0 28px; color: #d8e6dc; max-width: 31ch; }",
  ".topics { display: flex; gap: 7px; flex-wrap: wrap; margin: 0; padding: 0; list-style: none; }",
  ".topics li { color: #edf5ed; padding: 5px 9px; border: 1px solid #628075; border-radius: 6px; font-size: .81rem; }",
  ".facts { margin: 34px 0 0; padding-top: 22px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; border-top: 1px solid #56766a; }",
  ".facts div { min-width: 0; }",
  ".facts dd { margin: 0; font-size: clamp(1.4rem, 3vw, 2.05rem); font-weight: 660; line-height: 1; letter-spacing: -.05em; }",
  ".facts dt { margin-top: 5px; color: #d0e1d4; font-size: .82rem; }",
  "",
  ".panel { border: 1px solid var(--line); background: var(--paper); border-radius: 20px; padding: clamp(20px, 3.25vw, 35px); min-width: 0; }",
  ".identity { align-self: stretch; }",
  ".panel h2, .recap-header h1, .result h1, .page-title { margin: 0; line-height: 1.13; letter-spacing: -.048em; }",
  ".panel h2 { font-size: clamp(1.35rem, 2.5vw, 1.85rem); }",
  ".identity .panel-caption { color: var(--muted); margin: 7px 0 21px; }",
  ".identity form { display: grid; gap: 15px; }",
  ".field { display: grid; gap: 5px; }",
  ".field label { font-weight: 650; font-size: .89rem; }",
  ".field input, .field select { color: var(--ink); width: 100%; min-height: 44px; background: #fdfefb; border: 1px solid #c8d2c8; border-radius: 8px; padding: 9px 11px; }",
  ".field input::placeholder { color: #65716a; }",
  ".field-row { display: grid; grid-template-columns: 1.35fr 1fr; gap: 11px; }",
  ".button { display: inline-flex; justify-content: center; align-items: center; min-height: 44px; padding: 9px 15px; text-decoration: none; border: 1px solid transparent; border-radius: 8px; font-weight: 680; line-height: 1.25; }",
  ".button-primary { background: var(--green); color: white; }",
  ".button-primary:hover:not(:disabled) { background: #143f32; }",
  ".button-secondary { color: var(--green); background: white; border-color: #c3d2c6; }",
  ".button-secondary:hover:not(:disabled) { background: var(--tint); }",
  ".notice { border: 1px solid #e8d6a8; background: var(--amber-bg); color: var(--amber-text); border-radius: 9px; padding: 12px 14px; margin: 0; font-size: .875rem; }",
  ".error { margin: 0; color: #9b3428; font-size: .88rem; }",
  ".demo-note { margin: 17px 0 0; color: var(--muted); font-size: .82rem; }",
  "",
  ".exam-layout { display: grid; grid-template-columns: minmax(0, 1fr) 262px; gap: 16px; align-items: start; }",
  ".exam-heading { grid-column: 1 / -1; display: flex; align-items: end; justify-content: space-between; gap: 14px; margin-bottom: 5px; }",
  ".page-title { font-size: clamp(1.75rem, 3.8vw, 2.75rem); }",
  ".identity-caption { margin: 7px 0 0; color: var(--muted); font-size: .91rem; overflow-wrap: anywhere; }",
  ".clock { background: var(--deep-green); color: #fff; padding: 9px 15px; border-radius: 10px; text-align: right; min-width: 110px; }",
  ".clock span { display: block; color: #d7e6db; font-size: .76rem; line-height: 1.35; }",
  ".clock time { font-size: 1.4rem; font-weight: 675; font-variant-numeric: tabular-nums; line-height: 1.12; }",
  ".clock.is-low { background: #763f1d; }",
  ".exam-notice { grid-column: 1 / -1; }",
  ".question-meta { color: var(--green); font-weight: 690; font-size: .84rem; margin: 0 0 12px; }",
  ".question h2 { line-height: 1.28; font-size: clamp(1.32rem, 3.1vw, 1.95rem); }",
  ".options { display: grid; gap: 8px; margin: 21px 0 0; padding: 0; border: 0; min-width: 0; }",
  ".option { display: grid; grid-template-columns: 18px 1fr; gap: 10px; align-items: start; min-height: 49px; padding: 11px 13px; border-radius: 9px; border: 1px solid var(--line); cursor: pointer; overflow-wrap: anywhere; }",
  ".option:hover { background: #f6f9f4; }",
  ".option:has(input:checked) { border-color: #56866f; background: var(--tint); }",
  ".option input { margin: 4px 0 0; accent-color: var(--green); width: 16px; height: 16px; }",
  ".question-actions { display: flex; align-items: center; justify-content: space-between; gap: 9px; margin-top: 22px; }",
  ".question-actions .button { font-size: .9rem; }",
  ".progress-panel h2 { font-size: 1.2rem; }",
  ".progress-label { margin: 6px 0 11px; color: var(--muted); font-size: .88rem; }",
  "progress { width: 100%; height: 9px; border: 0; border-radius: 8px; background: #e1e8e0; accent-color: var(--green); }",
  "progress::-webkit-progress-bar { background: #e1e8e0; border-radius: 8px; }",
  "progress::-webkit-progress-value { background: var(--green); border-radius: 8px; }",
  "progress::-moz-progress-bar { background: var(--green); border-radius: 8px; }",
  ".progress-panel .button { width: 100%; margin-top: 10px; font-size: .89rem; }",
  ".progress-panel .error { margin-top: 9px; }",
  ".reset-count { color: var(--muted); font-size: .82rem; margin: 13px 0 0; }",
  "",
  ".result { max-width: 635px; margin-inline: auto; text-align: center; padding-block: 36px; }",
  ".result h1 { font-size: clamp(1.55rem, 3.5vw, 2.4rem); }",
  ".result .result-note { color: var(--muted); margin: 10px 0 0; }",
  ".score { color: var(--green); font-weight: 730; line-height: .94; font-size: clamp(3.75rem, 11vw, 6.75rem); letter-spacing: -.09em; margin: 28px 0 12px; }",
  ".score small { font-size: .43em; color: #637a6d; font-weight: 620; letter-spacing: -.05em; margin-left: 6px; }",
  ".result-actions { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-top: 25px; }",
  "",
  ".recap-header { display: flex; justify-content: space-between; align-items: end; flex-wrap: wrap; gap: 13px; margin-bottom: 17px; }",
  ".recap-header h1 { font-size: clamp(2rem, 4.7vw, 3.2rem); }",
  ".recap-header p { margin: 7px 0 0; color: var(--muted); }",
  ".metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }",
  ".metric { border: 1px solid var(--line); background: var(--paper); padding: 16px 18px; border-radius: 12px; }",
  ".metric dt { color: var(--muted); font-size: .84rem; }",
  ".metric dd { font-weight: 710; font-size: 1.55rem; margin: 2px 0 0; color: var(--green); }",
  ".recap-toolbar { display: flex; justify-content: space-between; flex-wrap: wrap; align-items: end; gap: 10px; margin-bottom: 15px; }",
  ".recap-toolbar .field { width: min(200px, 100%); }",
  ".table-wrap { overflow: auto; }",
  "table { border-collapse: collapse; width: 100%; min-width: 750px; }",
  "th, td { padding: 11px 9px; border-bottom: 1px solid var(--line); text-align: left; font-size: .84rem; }",
  "th { background: #f3f6f0; color: var(--green); font-weight: 680; }",
  "td { overflow-wrap: anywhere; }",
  "td:first-child { font-weight: 630; }",
  ".empty { color: var(--muted); margin: 12px 0 0; }",
  "",
  ".skip-link { position: absolute; left: 10px; top: 10px; transform: translateY(-150%); background: white; padding: 8px 12px; z-index: 2; }",
  ".skip-link:focus { transform: translateY(0); }",
  "",
  "@media (max-width: 800px) {",
  "  .shell { width: min(100% - 32px, 660px); }",
  "  .landing, .exam-layout { grid-template-columns: 1fr; }",
  "  .hero { padding: 29px 26px; }",
  "  .hero h1 { max-width: 15ch; }",
  "  .facts { margin-top: 25px; }",
  "  .progress-panel { padding: 17px 20px; }",
  "}",
  "",
  "@media (max-width: 435px) {",
  "  .header-inner { min-height: 63px; gap: 5px; }",
  "  .wordmark { font-size: .86rem; gap: 6px; }",
  "  .brand-icon { width: 31px; height: 31px; border-radius: 8px; }",
  "  .brand-icon svg { width: 19px; height: 19px; }",
  "  .site-nav { gap: 1px; }",
  "  .site-nav a { font-size: .8rem; padding-inline: 7px; }",
  "  .field-row { grid-template-columns: 1fr; }",
  "  .metric { padding: 9px 9px; }",
  "  .metric dt { font-size: .76rem; }",
  "  .metric dd { font-size: 1.25rem; }",
  "}",
  "",
  "#question-prompt, .options .option > span { -webkit-user-select: none; user-select: none; }",
].join("\n");
const client = [
  "const view = document.querySelector(\"#view\");",
  "const attemptKey = \"kuis-daya.active-attempt\";",
  "const wib = new Intl.DateTimeFormat(\"id-ID\", {",
  "  timeZone: \"Asia/Jakarta\", dateStyle: \"medium\", timeStyle: \"short\",",
  "});",
  "const isRecap = document.body.dataset.recap === \"true\";",
  "const focusGraceMs = 1000;",
  "const fallbackStorage = new Map();",
  "const tabData = {",
  "  getItem(key) { try { return sessionStorage.getItem(key); } catch { return fallbackStorage.get(key); } },",
  "  setItem(key, value) { try { sessionStorage.setItem(key, value); } catch { fallbackStorage.set(key, value); } },",
  "  removeItem(key) { try { sessionStorage.removeItem(key); } catch { fallbackStorage.delete(key); } },",
  "};",
  "document.querySelector(isRecap ? \"#nav-teacher\" : \"#nav-student\").setAttribute(\"aria-current\", \"page\");",
  "",
  "let attempt = null;",
  "let questions = [];",
  "let answers = {};",
  "let position = 0;",
  "let timeOffset = 0;",
  "let pendingResets = new Set();",
  "let resetSync = null;",
  "let leftPage = false;",
  "let focusLostAt = null;",
  "let focusLossTimer;",
  "let submitting = false;",
  "let notice = \"\";",
  "",
  "function display(markup) {",
  "  view.innerHTML = markup;",
  "  view.setAttribute(\"aria-busy\", \"false\");",
  "}",
  "",
  "function escapeHtml(value) {",
  "  return String(value ?? \"\").replace(/[&<>\"']/g, (char) => ({",
  "    \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\",",
  "  })[char]);",
  "}",
  "",
  "function showError(id, message) {",
  "  const element = document.getElementById(id);",
  "  if (element) {",
  "    element.textContent = message;",
  "    element.hidden = !message;",
  "  }",
  "}",
  "",
  "async function quizRequest(action, body) {",
  "  let response;",
  "  let data;",
  "  try {",
  "    response = await fetch(\"/api/quiz/\" + action, {",
  "      method: \"POST\",",
  "      headers: {\"Content-Type\": \"application/json\"},",
  "      body: JSON.stringify(body),",
  "      keepalive: action === \"reset\",",
  "    });",
  "    data = await response.json();",
  "  } catch {",
  "    throw new Error(\"Server tidak dapat dihubungi. Coba lagi.\");",
  "  }",
  "  if (response.ok && !data.error) return data;",
  "  const error = new Error(data.error || \"Permintaan belum berhasil. Coba lagi.\");",
  "  error.status = response.status;",
  "  error.payload = data;",
  "  throw error;",
  "}",
  "",
  "function api(path, body) {",
  "  if (path === \"/api/attempts\") {",
  "    const id = tabData.getItem(attemptKey) || crypto.randomUUID();",
  "    tabData.setItem(attemptKey, id);",
  "    return quizRequest(\"start\", {...body, id});",
  "  }",
  "  const [, id, action = \"get\"] = path.match(/^\\/api\\/attempts\\/([^/]+)(?:\\/([^/]+))?$/);",
  "  return quizRequest(action, {...body, id});",
  "}",
  "",
  "function acceptState(data) {",
  "  const next = data.attempt;",
  "  if (attempt?.id === next.id && next.status === \"active\" && next.resetCount < attempt.resetCount) return;",
  "  timeOffset = next.serverTime - Date.now();",
  "  attempt = next;",
  "  questions = data.questions;",
  "}",
  "",
  "function loadPending(id) {",
  "  try {",
  "    return new Set(JSON.parse(tabData.getItem(`kuis-daya.pending.${id}`) || \"[]\"));",
  "  } catch {",
  "    return new Set();",
  "  }",
  "}",
  "",
  "function savePending(id) {",
  "  const key = `kuis-daya.pending.${id}`;",
  "  if (pendingResets.size) tabData.setItem(key, JSON.stringify([...pendingResets]));",
  "  else tabData.removeItem(key);",
  "}",
  "",
  "function clearDraft(message) {",
  "  answers = {};",
  "  position = 0;",
  "  if (message) notice = message;",
  "}",
  "",
  "function landing(message = \"\") {",
  "  display(`",
  "    <div class=\"landing\">",
  "      <section class=\"hero\" aria-labelledby=\"quiz-title\">",
  "        <div>",
  "          <p class=\"eyebrow\">D3 Keteknikan Pertanian</p>",
  "          <h1 id=\"quiz-title\">UAS Daya Dalam Bidang Pertanian</h1>",
  "          <p class=\"subtitle\">Kuis pemahaman dan perhitungan energi pada alat pertanian.</p>",
  "          <ul class=\"topics\"><li>Pompa air</li><li>Blower</li><li>Panel surya</li><li>Kincir angin</li></ul>",
  "        </div>",
  "        <dl class=\"facts\">",
  "          <div><dd>25</dd><dt>Soal</dt></div>",
  "          <div><dd>30</dd><dt>Menit</dt></div>",
  "          <div><dd>100</dd><dt>Poin maksimal</dt></div>",
  "        </dl>",
  "      </section>",
  "      <section class=\"panel identity\" aria-labelledby=\"identity-title\">",
  "        <h2 id=\"identity-title\">Identitas peserta</h2>",
  "        <p class=\"panel-caption\">Isi identitas untuk memulai ujian.</p>",
  "        <form id=\"start-form\">",
  "          <div class=\"field\">",
  "            <label for=\"full-name\">Nama lengkap</label>",
  "            <input id=\"full-name\" name=\"fullName\" maxlength=\"100\" minlength=\"2\" autocomplete=\"name\" required>",
  "          </div>",
  "          <div class=\"field-row\">",
  "            <div class=\"field\">",
  "              <label for=\"nim\">NIM</label>",
  "              <input id=\"nim\" name=\"nim\" maxlength=\"25\" pattern=\"[A-Za-z0-9]{3,25}\" autocapitalize=\"characters\" required>",
  "            </div>",
  "            <div class=\"field\">",
  "              <label for=\"group\">Golongan</label>",
  "              <select id=\"group\" name=\"group\" required>",
  "                <option value=\"\">Pilih golongan</option><option>A</option><option>B</option><option>C</option>",
  "              </select>",
  "            </div>",
  "          </div>",
  "          <p class=\"notice\">Jika tab tersembunyi atau halaman kehilangan fokus selama 1 detik, jawaban draf terhapus dan kuis dimulai lagi dari soal pertama dengan paket acak baru. Timer tetap berjalan. Penyalinan langsung teks soal dibatasi.</p>",
  "          <p id=\"start-error\" class=\"error\" role=\"alert\" hidden></p>",
  "          <button id=\"start-button\" class=\"button button-primary\" type=\"submit\">Mulai kuis</button>",
  "        </form>",
  "      </section>",
  "    </div>",
  "  `);",
  "  showError(\"start-error\", message);",
  "  document.querySelector(\"#start-form\").addEventListener(\"submit\", async (event) => {",
  "    event.preventDefault();",
  "    const form = event.currentTarget;",
  "    const button = document.querySelector(\"#start-button\");",
  "    if (button.disabled) return;",
  "    button.disabled = true;",
  "    button.textContent = \"Membuka sesi…\";",
  "    showError(\"start-error\", \"\");",
  "    try {",
  "      await enterAttempt(await api(\"/api/attempts\", Object.fromEntries(new FormData(form))));",
  "    } catch (error) {",
  "      showError(\"start-error\", error.message);",
  "      button.disabled = false;",
  "      button.textContent = \"Mulai kuis\";",
  "    }",
  "  });",
  "}",
  "",
  "async function enterAttempt(data) {",
  "  acceptState(data);",
  "  tabData.setItem(attemptKey, attempt.id);",
  "  pendingResets = loadPending(attempt.id);",
  "  leftPage = false;",
  "  clearDraft(pendingResets.size ? \"Jawaban draf telah dikosongkan. Mulai kembali dari soal pertama.\" : \"\");",
  "  renderAttempt();",
  "  if (attempt.status !== \"active\") return;",
  "  if (document.hidden) resetDraft(\"Tab ujian sempat tersembunyi.\");",
  "  else await synchronizeResets();",
  "}",
  "",
  "function showClock() {",
  "  if (attempt?.status !== \"active\") return;",
  "  const left = attempt.deadlineAt - (Date.now() + timeOffset);",
  "  const seconds = Math.max(0, Math.ceil(left / 1000));",
  "  const clock = document.querySelector(\"#clock-time\");",
  "  if (clock) {",
  "    clock.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, \"0\")}`;",
  "    clock.parentElement.classList.toggle(\"is-low\", seconds <= 60);",
  "  }",
  "  if (left <= 0 && !submitting) {",
  "    attempt = { ...attempt, status: \"expired\" };",
  "    clearDraft();",
  "    renderAttempt();",
  "  }",
  "}",
  "",
  "function updateProgress() {",
  "  const answered = Object.keys(answers).length;",
  "  document.querySelector(\"#progress-label\").textContent = `${answered} dari ${questions.length} dijawab`;",
  "  document.querySelector(\"#progress\").value = answered;",
  "  document.querySelector(\"#submit-button\").disabled = answered !== questions.length || submitting;",
  "  const unanswered = document.querySelector(\"#unanswered\");",
  "  unanswered.hidden = answered === 0 || answered === questions.length;",
  "  unanswered.disabled = submitting;",
  "  document.querySelector(\"#previous\").disabled = position === 0 || submitting;",
  "  document.querySelector(\"#next\").disabled = position === questions.length - 1 || submitting;",
  "}",
  "",
  "function goTo(index) {",
  "  if (submitting || index < 0 || index >= questions.length) return;",
  "  position = index;",
  "  renderExam();",
  "  document.querySelector(\"#question-prompt\").focus({ preventScroll: true });",
  "  document.querySelector(\"#question-panel\").scrollIntoView({ block: \"nearest\" });",
  "}",
  "",
  "function renderExam() {",
  "  if (pendingResets.size) {",
  "    display(`",
  "      <section class=\"panel\" aria-label=\"Paket soal diperbarui\">",
  "        <h1>Paket soal diperbarui</h1>",
  "        <p role=\"status\">${escapeHtml(notice)}</p>",
  "        <p>Sisa waktu <time id=\"clock-time\">—</time></p>",
  "        <button type=\"button\" class=\"button button-primary\" id=\"retry-package\">Muat ulang paket</button>",
  "        <p id=\"package-error\" class=\"error\" role=\"alert\" hidden></p>",
  "      </section>",
  "    `);",
  "    document.querySelector(\"#retry-package\").addEventListener(\"click\", () => void synchronizeResets());",
  "    showClock();",
  "    return;",
  "  }",
  "  const question = questions[position];",
  "  const section = question.section === \"hitungan\" ? \"Perhitungan\" : \"Pemahaman\";",
  "  display(`",
  "    <section class=\"exam-layout\" aria-label=\"Pengerjaan kuis\">",
  "      <div class=\"exam-heading\">",
  "        <div>",
  "          <h1 class=\"page-title\">Pengerjaan kuis</h1>",
  "          <p class=\"identity-caption\">${escapeHtml(attempt.fullName)} · ${escapeHtml(attempt.nim)} · Golongan ${escapeHtml(attempt.group)}</p>",
  "        </div>",
  "        <div class=\"clock\"><span>Sisa waktu</span><time id=\"clock-time\">—</time></div>",
  "      </div>",
  "      <p id=\"exam-notice\" class=\"notice exam-notice\" role=\"status\" ${notice ? \"\" : \"hidden\"}>${escapeHtml(notice)}</p>",
  "      <article class=\"panel question\" id=\"question-panel\">",
  "        <p class=\"question-meta\">${section} · ${escapeHtml(question.topic)}</p>",
  "        <h2 id=\"question-prompt\" tabindex=\"-1\">${escapeHtml(question.prompt)}</h2>",
  "        <fieldset class=\"options\" aria-labelledby=\"question-prompt\" ${submitting ? \"disabled\" : \"\"}>",
  "          ${question.options.map((option, index) => `",
  "            <label class=\"option\">",
  "              <input type=\"radio\" name=\"answer\" value=\"${index}\" ${answers[question.id] === index ? \"checked\" : \"\"}>",
  "              <span>${escapeHtml(option)}</span>",
  "            </label>",
  "          `).join(\"\")}",
  "        </fieldset>",
  "        <div class=\"question-actions\">",
  "          <button type=\"button\" class=\"button button-secondary\" id=\"previous\">Sebelumnya</button>",
  "          <button type=\"button\" class=\"button button-secondary\" id=\"next\">Berikutnya</button>",
  "        </div>",
  "      </article>",
  "      <aside class=\"panel progress-panel\" aria-labelledby=\"progress-title\">",
  "        <h2 id=\"progress-title\">Progres</h2>",
  "        <p class=\"progress-label\" id=\"progress-label\"></p>",
  "        <progress id=\"progress\" max=\"${questions.length}\" value=\"0\" aria-label=\"Jumlah soal yang dijawab\"></progress>",
  "        <button id=\"unanswered\" class=\"button button-secondary review-button\" type=\"button\">Ke soal belum dijawab</button>",
  "        <button id=\"submit-button\" class=\"button button-primary submit-button\" type=\"button\">${submitting ? \"Mengirim…\" : \"Kirim jawaban\"}</button>",
  "        <p id=\"submit-error\" class=\"error\" role=\"alert\" hidden></p>",
  "        <p class=\"reset-count\" id=\"reset-count\">Reset tercatat: ${attempt.resetCount}</p>",
  "      </aside>",
  "    </section>",
  "  `);",
  "  document.querySelector(\".options\").addEventListener(\"change\", (event) => {",
  "    answers[question.id] = Number(event.target.value);",
  "    showError(\"submit-error\", \"\");",
  "    updateProgress();",
  "  });",
  "  document.querySelector(\"#previous\").addEventListener(\"click\", () => goTo(position - 1));",
  "  document.querySelector(\"#next\").addEventListener(\"click\", () => goTo(position + 1));",
  "  document.querySelector(\"#unanswered\").addEventListener(\"click\", () => {",
  "    goTo(questions.findIndex((item) => !Object.hasOwn(answers, item.id)));",
  "  });",
  "  document.querySelector(\"#submit-button\").addEventListener(\"click\", submit);",
  "  updateProgress();",
  "  showClock();",
  "}",
  "",
  "function renderAttempt() {",
  "  if (attempt.status === \"active\") {",
  "    renderExam();",
  "    return;",
  "  }",
  "  const complete = attempt.status === \"submitted\";",
  "  const result = attempt.result;",
  "  display(`",
  "    <section class=\"panel result\">",
  "      <h1>${complete ? \"Jawaban terkirim\" : \"Waktu pengerjaan habis\"}</h1>",
  "      <p class=\"result-note\">${escapeHtml(attempt.fullName)} · ${escapeHtml(attempt.nim)} · Golongan ${escapeHtml(attempt.group)}</p>",
  "      ${complete ? `<p class=\"score\" aria-label=\"Nilai ${result.score} dari ${result.maxScore}\">${result.score}<small>/ ${result.maxScore}</small></p>",
  "        <p class=\"result-note\">${result.correct} dari ${questions.length} jawaban benar</p>",
  "        <p class=\"result-note\">Dikirim ${wib.format(result.submittedAt)} WIB</p>` :",
  "        '<p class=\"result-note\">Sesi ini berakhir sebelum jawaban dikirim.</p>'}",
  "      <div class=\"result-actions\">",
  "        <button class=\"button button-secondary\" id=\"try-another\" type=\"button\">Coba identitas lain</button>",
  "      </div>",
  "    </section>",
  "  `);",
  "  document.querySelector(\"#try-another\").addEventListener(\"click\", () => {",
  "    tabData.removeItem(attemptKey);",
  "    attempt = null;",
  "    notice = \"\";",
  "    landing();",
  "  });",
  "}",
  "",
  "async function synchronizeResets() {",
  "  if (resetSync) return resetSync;",
  "  if (!pendingResets.size || attempt?.status !== \"active\") return true;",
  "  const id = attempt.id;",
  "  resetSync = (async () => {",
  "    for (const eventId of pendingResets) {",
  "      try {",
  "        const data = await api(\"/api/attempts/\" + id + \"/reset\", {eventId});",
  "        if (attempt?.id !== id) return false;",
  "        acceptState(data);",
  "        pendingResets.delete(eventId);",
  "        if (attempt.status !== \"active\") pendingResets.clear();",
  "        savePending(id);",
  "      } catch (error) {",
  "        showError(\"package-error\", error.message);",
  "        return false;",
  "      }",
  "    }",
  "    if (attempt?.id === id) renderAttempt();",
  "    return true;",
  "  })();",
  "  try {",
  "    return await resetSync;",
  "  } finally {",
  "    resetSync = null;",
  "  }",
  "}",
  "",
  "function resetDraft(reason) {",
  "  if (leftPage || attempt?.status !== \"active\") return;",
  "  leftPage = true;",
  "  window.clearTimeout(focusLossTimer);",
  "  focusLostAt = null;",
  "  clearDraft(reason + \" Jawaban dikosongkan. Mulai lagi dari soal pertama dengan paket baru.\");",
  "  pendingResets.add(crypto.randomUUID());",
  "  savePending(attempt.id);",
  "  if (!submitting) renderExam();",
  "  void synchronizeResets();",
  "}",
  "",
  "function resumeExam() {",
  "  if (document.hidden) return;",
  "  if (document.hasFocus()) {",
  "    if (focusLostAt !== null && performance.now() - focusLostAt >= focusGraceMs) {",
  "      resetDraft(\"Halaman ujian sempat kehilangan fokus.\");",
  "    }",
  "    window.clearTimeout(focusLossTimer);",
  "    focusLostAt = null;",
  "    leftPage = false;",
  "  }",
  "  showClock();",
  "  void synchronizeResets();",
  "}",
  "",
  "function blockCopy(event) {",
  "  if (attempt?.status !== \"active\") return;",
  "  event.preventDefault();",
  "  if (!notice) showError(\"exam-notice\", \"Penyalinan teks soal dibatasi selama kuis.\");",
  "}",
  "",
  "async function submit() {",
  "  if (submitting || document.hidden || pendingResets.size || attempt?.status !== \"active\" ||",
  "    Object.keys(answers).length !== questions.length) return;",
  "  submitting = true;",
  "  renderExam();",
  "  try {",
  "    if (!await synchronizeResets()) throw new Error(\"Catatan reset belum tersimpan. Periksa koneksi lalu coba lagi.\");",
  "    if (attempt.status !== \"active\") return;",
  "    if (Object.keys(answers).length !== questions.length) {",
  "      throw new Error(\"Draf telah dikosongkan. Jawab semua soal sebelum mengirim.\");",
  "    }",
  "    const data = await api(`/api/attempts/${attempt.id}/submit`, {",
  "      answers, resetCount: attempt.resetCount,",
  "    });",
  "    acceptState(data);",
  "    clearDraft();",
  "    renderAttempt();",
  "  } catch (error) {",
  "    if (error.payload?.attempt) acceptState(error.payload);",
  "    if (error.status === 409) clearDraft(error.message);",
  "    submitting = false;",
  "    renderAttempt();",
  "    if (attempt.status === \"active\" && error.status !== 409) showError(\"submit-error\", error.message);",
  "  } finally {",
  "    submitting = false;",
  "  }",
  "}",
  "",
  "function formatTime(value) {",
  "  return value == null ? \"—\" : `${wib.format(value)} WIB`;",
  "}",
  "",
  "function renderRecap() {",
  "  display(`",
  "    <header class=\"recap-header\">",
  "      <div><h1>Rekap dosen</h1><p>UAS Daya Dalam Bidang Pertanian</p></div>",
  "      <button class=\"button button-primary\" id=\"export\" type=\"button\" disabled>Unduh CSV untuk Excel</button>",
  "    </header>",
  "    <form id=\"recap-login\" class=\"panel identity\" aria-label=\"Buka rekap dosen\">",
  "      <div class=\"field\"><label for=\"recap-code\">Kode rekap dosen</label>",
  "      <input id=\"recap-code\" type=\"password\" autocomplete=\"off\" maxlength=\"100\" required></div>",
  "      <button class=\"button button-primary\" type=\"submit\">Buka rekap</button>",
  "      <p id=\"recap-login-error\" class=\"error\" role=\"alert\" hidden></p>",
  "    </form>",
  "    <div id=\"recap-content\" hidden>",
  "    <dl class=\"metrics\">",
  "      <div class=\"metric\"><dt>Pengiriman</dt><dd id=\"count\">—</dd></div>",
  "      <div class=\"metric\"><dt>Rata-rata</dt><dd id=\"average\">—</dd></div>",
  "      <div class=\"metric\"><dt>Nilai tertinggi</dt><dd id=\"highest\">—</dd></div>",
  "    </dl>",
  "    <section class=\"panel\" aria-label=\"Daftar nilai\">",
  "      <div class=\"recap-toolbar\">",
  "        <div class=\"field\">",
  "          <label for=\"recap-group\">Golongan</label>",
  "          <select id=\"recap-group\"><option value=\"\">Semua golongan</option><option>A</option><option>B</option><option>C</option></select>",
  "        </div>",
  "        <button id=\"refresh-recap\" class=\"button button-secondary\" type=\"button\">Muat ulang</button>",
  "      </div>",
  "      <p id=\"recap-error\" class=\"error\" role=\"alert\" hidden></p>",
  "      <p id=\"recap-empty\" class=\"empty\" role=\"status\">Memuat hasil…</p>",
  "      <div id=\"recap-table\" class=\"table-wrap\" tabindex=\"0\" aria-label=\"Tabel nilai peserta\" hidden>",
  "        <table>",
  "          <thead><tr><th scope=\"col\">Nama</th><th scope=\"col\">NIM</th><th scope=\"col\">Golongan</th><th scope=\"col\">Benar</th><th scope=\"col\">Nilai</th><th scope=\"col\">Dikirim</th><th scope=\"col\">Reset</th><th scope=\"col\">Reset terakhir</th></tr></thead>",
  "          <tbody id=\"recap-rows\"></tbody>",
  "        </table>",
  "      </div>",
  "    </section>",
  "    </div>",
  "  `);",
  "",
  "  let latest = 0;",
  "  let code = \"\";",
  "  let loadedRows = [];",
  "  const login = document.querySelector(\"#recap-login\");",
  "  const content = document.querySelector(\"#recap-content\");",
  "  const exportButton = document.querySelector(\"#export\");",
  "  const group = document.querySelector(\"#recap-group\");",
  "  const empty = document.querySelector(\"#recap-empty\");",
  "  const table = document.querySelector(\"#recap-table\");",
  "  async function refresh() {",
  "    const request = ++latest;",
  "    if (!code) return;",
  "    exportButton.disabled = true;",
  "    showError(\"recap-error\", \"\");",
  "    try {",
  "      const { results } = await quizRequest(\"recap\", {code, group: group.value});",
  "      if (request !== latest) return;",
  "      loadedRows = results;",
  "      login.hidden = true;",
  "      content.hidden = false;",
  "      exportButton.disabled = results.length === 0;",
  "      const scores = results.map((row) => row.score);",
  "      const decimal = new Intl.NumberFormat(\"id-ID\", { maximumFractionDigits: 1 });",
  "      document.querySelector(\"#count\").textContent = scores.length;",
  "      document.querySelector(\"#average\").textContent = scores.length",
  "        ? decimal.format(scores.reduce((sum, score) => sum + score, 0) / scores.length) : \"—\";",
  "      document.querySelector(\"#highest\").textContent = scores.length ? Math.max(...scores) : \"—\";",
  "      document.querySelector(\"#recap-rows\").innerHTML = results.map((row) => `<tr>",
  "        <td>${escapeHtml(row.full_name)}</td><td>${escapeHtml(row.nim)}</td><td>${escapeHtml(row.group_name)}</td>",
  "        <td>${row.correct_count}/25</td><td>${row.score}</td><td>${formatTime(row.submitted_at)}</td>",
  "        <td>${row.reset_count}</td><td>${formatTime(row.last_reset_at)}</td>",
  "      </tr>`).join(\"\");",
  "      table.hidden = !results.length;",
  "      empty.hidden = !!results.length;",
  "      empty.textContent = \"Belum ada jawaban yang berhasil dikirim pada golongan ini.\";",
  "    } catch (error) {",
  "      if (request !== latest) return;",
  "      empty.hidden = true;",
  "      if (error.status === 403) {",
  "        code = \"\";",
  "        loadedRows = [];",
  "        login.hidden = false;",
  "        content.hidden = true;",
  "      }",
  "      showError(login.hidden ? \"recap-error\" : \"recap-login-error\", error.message);",
  "    }",
  "  }",
  "  group.addEventListener(\"change\", refresh);",
  "  document.querySelector(\"#refresh-recap\").addEventListener(\"click\", refresh);",
  "  exportButton.addEventListener(\"click\", () => downloadRecap(loadedRows));",
  "  login.addEventListener(\"submit\", (event) => {",
  "    event.preventDefault();",
  "    const input = document.querySelector(\"#recap-code\");",
  "    code = input.value.trim();",
  "    input.value = \"\";",
  "    showError(\"recap-login-error\", \"\");",
  "    void refresh();",
  "  });",
  "}",
  "",
  "async function restoreAttempt(id) {",
  "  try {",
  "    await enterAttempt(await api(`/api/attempts/${id}`));",
  "  } catch (error) {",
  "    if (error.status === 404) tabData.removeItem(attemptKey);",
  "    landing(error.message);",
  "  }",
  "}",
  "",
  "if (isRecap) {",
  "  renderRecap();",
  "} else {",
  "  const id = tabData.getItem(attemptKey);",
  "  if (id) void restoreAttempt(id);",
  "  else landing();",
  "  document.addEventListener(\"visibilitychange\", () => {",
  "    if (document.hidden) resetDraft(\"Tab ujian sempat tersembunyi.\");",
  "    else resumeExam();",
  "  });",
  "  window.addEventListener(\"blur\", () => {",
  "    if (attempt?.status !== \"active\" || leftPage || focusLostAt !== null) return;",
  "    focusLostAt = performance.now();",
  "    focusLossTimer = window.setTimeout(() => {",
  "      if (!document.hasFocus()) resetDraft(\"Halaman ujian sempat kehilangan fokus.\");",
  "    }, focusGraceMs);",
  "  });",
  "  window.addEventListener(\"focus\", resumeExam);",
  "  window.addEventListener(\"pagehide\", () => resetDraft(\"Halaman ujian sempat ditinggalkan.\"));",
  "  window.addEventListener(\"pageshow\", resumeExam);",
  "  document.addEventListener(\"copy\", blockCopy, true);",
  "  document.addEventListener(\"cut\", blockCopy, true);",
  "  window.setInterval(showClock, 400);",
  "}",
  "",
  "function downloadRecap(results) {",
  "  const fields = [\"Nama lengkap\", \"NIM\", \"Golongan\", \"Jawaban benar\", \"Nilai\", \"Dikirim (WIB)\", \"Jumlah reset\", \"Reset terakhir (WIB)\"];",
  "  const rows = results.map(row => [",
  "    row.full_name, row.nim, row.group_name, row.correct_count, row.score,",
  "    formatTime(row.submitted_at), row.reset_count, formatTime(row.last_reset_at),",
  "  ]);",
  "  const csvCell = (value) => {",
  "    const cell = String(value ?? \"\");",
  "    const safe = /^[\\s\\uFEFF]*[=+@-]/u.test(cell) ? \"'\" + cell : cell;",
  "    return '\"' + safe.replace(/\"/g, '\"\"') + '\"';",
  "  };",
  "  const csv = \"\\uFEFF\" + [fields, ...rows].map(row => row.map(csvCell).join(\";\")).join(\"\\r\\n\") + \"\\r\\n\";",
  "  const url = URL.createObjectURL(new Blob([csv], {type: \"text/csv;charset=utf-8\"}));",
  "  const link = document.createElement(\"a\");",
  "  link.href = url;",
  "  link.target = \"_self\";",
  "  link.download = \"Rekap_Kuis_Daya_Pertanian.csv\";",
  "  document.body.append(link);",
  "  link.click();",
  "  link.remove();",
  "  window.setTimeout(() => URL.revokeObjectURL(url), 1000);",
  "}",
].join("\n");

const durationMs = 30 * 60 * 1000;
const groups = new Set(["A", "B", "C"]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const byId = new Map(BANK_DAYA_50.map(question => [question.id, question]));
const securityHeaders = {
  "Cache-Control": "private, no-store",
  "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
};

function response(body, type, status = 200) {
  return new Response(body, {status, headers: {...securityHeaders, "Content-Type": type}});
}

function json(body, status = 200) {
  return response(JSON.stringify(body), "application/json; charset=utf-8", status);
}

function error(message, status, extra = {}) {
  return json({error: message, ...extra}, status);
}

async function readBody(request) {
  const type = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (type !== "application/json" || !request.body) return null;
  const limit = 8192;
  const reader = request.body.getReader();
  const bytes = new Uint8Array(limit);
  let size = 0;
  try {
    for (;;) {
      const {value, done} = await reader.read();
      if (done) break;
      if (size + value.byteLength > limit) {
        await reader.cancel();
        return null;
      }
      bytes.set(value, size);
      size += value.byteLength;
    }
    const body = JSON.parse(new TextDecoder("utf-8", {fatal: true}).decode(bytes.subarray(0, size)));
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

function findAttempt(db, id) {
  return db.prepare("SELECT * FROM quiz_attempts WHERE id = ?").bind(id).first();
}

function attemptStatus(row, now) {
  if (row.submitted_at !== null) return "submitted";
  return now >= row.deadline_at ? "expired" : "active";
}

function attemptQuestions(row) {
  return JSON.parse(row.question_ids).map(id => byId.get(id));
}

function payload(row) {
  const now = Date.now();
  const status = attemptStatus(row, now);
  const questions = attemptQuestions(row).map(({id, section, topic, prompt, options, points}) => (
    {id, section, topic, prompt, options, points}
  ));
  const attempt = {
    id: row.id,
    fullName: row.full_name,
    nim: row.nim,
    group: row.group_name,
    deadlineAt: row.deadline_at,
    serverTime: now,
    resetCount: row.reset_count,
    lastResetAt: row.last_reset_at,
    status,
    result: status === "submitted" ? {
      correct: row.correct_count, score: row.score, maxScore: 100, submittedAt: row.submitted_at,
    } : null,
  };
  return {attempt, questions};
}

async function startAttempt(db, data) {
  const fullName = typeof data.fullName === "string" ? data.fullName.trim() : "";
  const nim = typeof data.nim === "string" ? data.nim.trim().toUpperCase() : "";
  const group = data.group;
  if (fullName.length < 2 || fullName.length > 100 || /[\u0000-\u001f\u007f]/u.test(fullName) ||
      !/^[A-Z0-9]{3,25}$/.test(nim) || !groups.has(group)) {
    return error("Isi nama, NIM (3–25 huruf atau angka), dan golongan.", 400);
  }

  const existing = await findAttempt(db, data.id);
  if (existing) return json(payload(existing));
  const now = Date.now();
  const questionIds = pilihPaketKuis_(BANK_DAYA_50).map(({id}) => id);
  const inserted = await db.prepare(
    "INSERT INTO quiz_attempts (id, full_name, nim, group_name, started_at, deadline_at, question_ids) " +
    "VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING RETURNING *",
  ).bind(data.id, fullName, nim, group, now, now + durationMs, JSON.stringify(questionIds)).first();
  return json(payload(inserted ?? await findAttempt(db, data.id)));
}

async function resetAttempt(db, id, data) {
  if (typeof data.eventId !== "string" || !uuid.test(data.eventId)) {
    return error("Catatan reset tidak valid.", 400);
  }
  for (let retry = 0; retry < 4; retry++) {
    const row = await findAttempt(db, id);
    if (!row) return error("Sesi kuis tidak ditemukan.", 404);
    const now = Date.now();
    const events = JSON.parse(row.reset_events);
    if (attemptStatus(row, now) !== "active" || events.includes(data.eventId)) return json(payload(row));
    if (events.length >= 120) return error("Batas pencatatan reset sesi ini tercapai.", 429);

    const oldIds = JSON.parse(row.question_ids);
    const questionIds = pilihPaketKuis_(BANK_DAYA_50, Math.random, oldIds).map(question => question.id);
    const updated = await db.prepare(
      "UPDATE quiz_attempts SET question_ids = ?, reset_events = ?, reset_count = reset_count + 1, last_reset_at = ? " +
      "WHERE id = ? AND reset_count = ? AND submitted_at IS NULL AND deadline_at > ? RETURNING *",
    ).bind(JSON.stringify(questionIds), JSON.stringify([...events, data.eventId]), now, id, row.reset_count, now).first();
    if (updated) return json(payload(updated));
  }
  return error("Server sedang sibuk. Muat ulang paket.", 503);
}

function submissionConflict(row, resetCount) {
  if (row.submitted_at !== null) return json(payload(row));
  if (Date.now() >= row.deadline_at) return error("Waktu pengerjaan sudah habis.", 410, payload(row));
  if (row.reset_count !== resetCount) {
    return error("Paket sudah berubah. Mulai lagi dari soal pertama.", 409, payload(row));
  }
  return null;
}

async function submitAttempt(db, id, data) {
  const row = await findAttempt(db, id);
  if (!row) return error("Sesi kuis tidak ditemukan.", 404);
  const conflict = submissionConflict(row, data.resetCount);
  if (conflict) return conflict;

  const {answers} = data;
  const questions = attemptQuestions(row);
  const valid = answers && typeof answers === "object" && !Array.isArray(answers) &&
    Object.keys(answers).length === questions.length && questions.every(question => {
      const index = answers[question.id];
      return Object.hasOwn(answers, question.id) && Number.isInteger(index) && index >= 0 && index < question.options.length;
    });
  if (!valid) return error("Jawab semua soal pada paket aktif sebelum mengirim.", 400);

  const correct = questions.filter(question => answers[question.id] === question.correct);
  const score = correct.reduce((total, question) => total + question.points, 0);
  const now = Date.now();
  const saved = await db.prepare(
    "UPDATE quiz_attempts SET submitted_at = ?, correct_count = ?, score = ? " +
    "WHERE id = ? AND reset_count = ? AND submitted_at IS NULL AND deadline_at > ? RETURNING *",
  ).bind(now, correct.length, score, id, row.reset_count, now).first();
  if (saved) return json(payload(saved));
  const latest = await findAttempt(db, id);
  if (!latest) return error("Sesi kuis tidak ditemukan.", 404);
  return submissionConflict(latest, data.resetCount) ?? error("Pengiriman belum tersimpan. Coba lagi.", 503);
}

async function matchingRecapCode(actual, expected) {
  if (typeof actual !== "string" || actual.length > 100 || !actual.trim()) return false;
  const bytes = new TextEncoder();
  const algorithm = {name: "HMAC", hash: "SHA-256"};
  const [supplied, configured] = await Promise.all([actual.trim(), expected].map(
    value => crypto.subtle.importKey("raw", bytes.encode(value), algorithm, false, ["sign", "verify"]),
  ));
  const subject = bytes.encode("rekap-kuis-daya");
  const signature = await crypto.subtle.sign("HMAC", supplied, subject);
  return crypto.subtle.verify("HMAC", configured, signature, subject);
}

async function recap(db, secret, data) {
  const expected = typeof secret === "string" ? secret.trim() : "";
  if (!expected) return error("Kode rekap dosen belum dikonfigurasi.", 503);
  if (!await matchingRecapCode(data.code, expected)) return error("Kode rekap dosen salah.", 403);
  const group = data.group ?? "";
  if (group && !groups.has(group)) return error("Golongan tidak valid.", 400);

  const {results} = await db.prepare(
    "SELECT full_name, nim, group_name, correct_count, score, submitted_at, reset_count, last_reset_at " +
    "FROM quiz_attempts WHERE submitted_at IS NOT NULL AND (? = '' OR group_name = ?) ORDER BY submitted_at DESC, nim",
  ).bind(group, group).all();
  return json({results});
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (request.method === "GET" && (path === "/" || path === "/rekap")) {
    const teacher = path === "/rekap" || url.searchParams.get("halaman") === "rekap";
    return response(html.replace("__VIEW_RECAP__", String(teacher)).replace(
      "__PAGE_TITLE__", teacher ? "Rekap Dosen | UAS Daya" : "UAS Daya Dalam Bidang Pertanian",
    ), "text/html; charset=utf-8");
  }
  if (request.method === "GET" && path === "/styles.css") return response(stylesheet, "text/css; charset=utf-8");
  if (request.method === "GET" && path === "/app.js") return response(client, "text/javascript; charset=utf-8");
  if (!path.startsWith("/api/quiz/") || request.method !== "POST") return error("Halaman tidak ditemukan.", 404);
  if (request.headers.get("sec-fetch-site") === "cross-site") return error("Permintaan lintas situs ditolak.", 403);
  if (!env.DB) return error("Penyimpanan kuis sedang tidak tersedia.", 503);

  const data = await readBody(request);
  if (!data) return error("Permintaan belum valid.", 400);
  const action = path.slice("/api/quiz/".length);
  if (action === "recap") return recap(env.DB, env.KODE_REKAP_DOSEN, data);
  if (typeof data.id !== "string" || !uuid.test(data.id)) return error("Sesi kuis tidak ditemukan.", 404);
  if (action === "start") return startAttempt(env.DB, data);
  if (action === "reset") return resetAttempt(env.DB, data.id, data);
  if (action === "submit") return submitAttempt(env.DB, data.id, data);
  if (action === "get") {
    const row = await findAttempt(env.DB, data.id);
    return row ? json(payload(row)) : error("Sesi kuis tidak ditemukan.", 404);
  }
  return error("Halaman tidak ditemukan.", 404);
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (cause) {
      console.error("Quiz request failed", cause?.name ?? "Error");
      return error("Permintaan belum berhasil. Coba lagi.", 503);
    }
  },
};
