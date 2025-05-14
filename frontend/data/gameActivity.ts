import { Activity } from "@/types/activity.types";
import { images } from "@/data/images";

export const gameActivities: Record<string, Activity[]> = {
  // Kelas 1 - Bandar Lampung (Literasi Baca Tulis)
  "1": [
    {
      id: "intro",
      type: "info",
      title: "Kain Tapis Lampung",
      description: "Lino tiba di Lampung, tanah yang terkenal dengan Kain Tapis yang indah. Mari kita pelajari tentang kain tradisional ini sambil belajar membaca!",
      image: images.kainTapis,
      infoText: "Ketuk untuk melihat fakta!",
      facts: [
        "Kain Tapis adalah kain tradisional khas Lampung",
        "Kain ini dibuat dengan tenunan benang emas dan perak",
        "Motif geometris dan flora sering ditemukan pada Kain Tapis",
        "Kain Tapis digunakan dalam upacara adat",
        "Pembuatan Kain Tapis membutuhkan waktu berbulan-bulan"
      ]
    },
    {
      id: "quiz1",
      type: "quiz",
      title: "Membaca Kata",
      description: "Mari belajar membaca kata-kata sederhana tentang budaya Lampung.",
      question: "Manakah kata yang benar untuk gambar ini?",
      image: images.gajahLampung,
      options: [
        { id: "1", text: "GAJAH" },
        { id: "2", text: "KUDA" },
        { id: "3", text: "AYAM" },
        { id: "4", text: "BEBEK" }
      ],
      correctAnswer: "1"
    },
    {
      id: "dialog",
      type: "dialog",
      title: "Bertemu Azul",
      description: "Lino bertemu Azul, anak Lampung yang suka membaca cerita rakyat.",
      image: images.aniCharacter,
      dialogOption: "Ketuk ikon 💬 untuk membaca percakapan dengan Azul.",
      dialog: [
        "Azul: Hai! Namaku Azul. Aku suka membaca cerita rakyat Lampung.",
        "Lino: Hai Azul! Cerita apa yang paling kamu suka?",
        "Azul: Aku suka cerita tentang Si Pahit Lidah dan Putri Kumbang Malam.",
        "Lino: Wah, menarik! Bisakah kamu ceritakan sedikit?",
        "Azul: Tentu! Tapi kita harus belajar membaca dulu agar bisa menikmati ceritanya.",
        "Lino: Baik! Ayo kita belajar bersama!"
      ]
    },
    {
      id: "writingScan",
      type: "writing_scan",
      title: "Berlatih Menulis",
      description: "Mari berlatih menulis dengan rapi dan indah! Tulislah kalimat 'Aku suka membaca buku' di kertas, lalu ambil foto untuk diperiksa.",
      image: images.writingScanBackground,
      instructions: "1. Tulis kalimat di atas pada kertas\n2. Ambil foto tulisanmu\n3. AI akan memberikan masukan untuk tulisanmu",
      evaluationCriteria: [
        { id: "1", text: "Bentuk huruf" },
        { id: "2", text: "Kerapian tulisan" },
        { id: "3", text: "Jarak antar kata" },
        { id: "4", text: "Konsistensi ukuran" }
      ],
      sampleImage: images.writingSampleImage
    },
  ],

  // Kelas 2 - Bandung (Numerasi) 
  "2": [
    {
      id: "intro",
      type: "info",
      title: "Batik Megamendung",
      description: "Lino sampai di Bandung, kota yang sejuk dengan batik Megamendung yang indah. Mari kita belajar menghitung sambil menikmati keindahan batik!",
      image: images.batikMegamendung,
      infoText: "Ketuk untuk melihat fakta!",
      facts: [
        "Megamendung adalah motif batik khas Cirebon",
        "Motif awan berlapis melambangkan hujan yang membawa kesuburan",
        "Warna biru mendominasi batik Megamendung",
        "Batik ini dipengaruhi budaya Tiongkok",
        "Ada 7-9 gradasi warna dalam motif Megamendung"
      ]
    },
    {
      id: "math",
      type: "math",
      title: "Menghitung Surabi",
      description: "Kamu dan teman-teman menikmati Surabi, kue tradisional Bandung.",
      image: images.surabi,
      question: "Ada 12 Surabi di piring. Jika kamu makan 3, berapa yang tersisa?",
      options: [
        { id: "1", text: "7" },
        { id: "2", text: "8" },
        { id: "3", text: "9" },
        { id: "4", text: "10" }
      ],
      correctAnswer: "3"
    },
    {
      id: "quiz1",
      type: "quiz",
      title: "Pola Angka",
      description: "Mari belajar mengenali pola angka dari motif batik.",
      question: "Lengkapi pola: 2, 4, 6, 8, ...",
      image: images.polaBatik,
      options: [
        { id: "1", text: "9" },
        { id: "2", text: "10" },
        { id: "3", text: "11" },
        { id: "4", text: "12" }
      ],
      correctAnswer: "2"
    }
  ],

  // Kelas 3 - Palangka Raya (Sains)
  "3": [
    {
      id: "intro",
      type: "info",
      title: "Hutan Kalimantan",
      description: "Lino tiba di Palangka Raya, Kalimantan Tengah, dengan hutan tropis yang lebat. Mari kita pelajari sains melalui eksperimen sederhana!",
      image: images.hutanKalimantan,
      infoText: "Ketuk untuk melihat fakta!",
      facts: [
        "Kalimantan memiliki hutan hujan tropis terluas di Indonesia",
        "Orangutan adalah primata khas Kalimantan",
        "Hutan Kalimantan menyimpan banyak jenis tumbuhan obat",
        "Pohon Ulin adalah kayu terkuat dari Kalimantan",
        "Sungai Kahayan adalah sungai terpanjang di Kalimantan Tengah"
      ]
    },
    {
      id: "quiz1",
      type: "quiz",
      title: "Eksperimen Terapung-Tenggelam",
      description: "Mari uji benda mana yang mengapung di air sungai.",
      question: "Manakah benda yang akan mengapung di air?",
      image: images.objekAir,
      options: [
        { id: "1", text: "Batu" },
        { id: "2", text: "Daun kering" },
        { id: "3", text: "Paku" },
        { id: "4", text: "Koin" }
      ],
      correctAnswer: "2"
    },
    {
      id: "safety",
      type: "safety",
      title: "Keamanan Eksperimen",
      description: "Sebelum melakukan eksperimen, kita harus tahu cara yang aman.",
      questions: [
        {
          text: "Menggunakan sarung tangan saat eksperimen",
          safe: true
        },
        {
          text: "Mencicipi bahan eksperimen",
          safe: false
        },
        {
          text: "Mencuci tangan setelah eksperimen",
          safe: true
        }
      ],
      image: images.safetyScience
    }
  ],

  // Makassar activities (ID: 4)
  "4": [
    {
      id: "intro",
      type: "info",
      title: "Kapal Phinisi",
      description: "Lino tiba di Makassar, kota pesisir yang kaya budaya dan sejarah. Angin laut bertiup sejuk saat kapal-kapal berlayar di Pelabuhan Paotere. Di sini, masyarakat hidup berdampingan dengan laut, dari para nelayan hingga pedagang yang menjual hasil laut segar.",
      image: images.phinisiDiagram,
      infoText: "Ketuk untuk melihat fakta!",
      facts: [
        "Kapal Phinisi adalah kapal layar tradisional dari Sulawesi Selatan",
        "Pembuatan kapal Phinisi tidak menggunakan paku, hanya kayu dan tali tambang",
        "Kapal Phinisi memiliki dua tiang utama dan tujuh layar",
        "Phinisi dikenal sebagai kapal yang tangguh dan mampu mengarungi lautan dalam",
        "UNESCO mengakui pembuatan kapal Phinisi sebagai Warisan Budaya Takbenda pada tahun 2017"
      ]
    },
    {
      id: "quiz1",
      type: "quiz",
      title: "Bagian Kapal Phinisi",
      description: "Di pelabuhan, terdapat kapal dengan nama kapal Phinisi. Kapal ini dibuat dengan teknik tradisional tanpa paku, hanya menggunakan kayu dan tali tambang. Keahlian ini diwariskan turun-temurun oleh para pembuat kapal Makassar.",
      question: "Bagian yang diberi tanda tanya adalah...",
      image: images.phinisiQuiz,
      options: [
        { id: "1", text: "Tiang Utama Sombala" },
        { id: "2", text: "Layar Tanpasere" },
        { id: "3", text: "Layar Utama Sombala" },
        { id: "4", text: "Layar Pembantu" }
      ],
      correctAnswer: "3"
    },
    {
      id: "dialog",
      type: "dialog",
      title: "Bertemu Rafi",
      description: "Setelah berjalan-jalan, Lino bertemu Rafi, anak Makassar yang suka belajar dan membuat konten digital. Ia menjelaskan bagaimana internet membantu belajar dan berbagi ilmu.",
      image: images.rafiCharacter,
      dialogOption: "Ketuk ikon 💬 untuk membaca percakapan dengan Rafi tentang dunia digital.",
      dialog: [
        "Rafi: Hai! Namaku Rafi. Aku suka belajar tentang teknologi dan internet.",
        "Lino: Hai Rafi! Apa yang kamu suka dari internet?",
        "Rafi: Internet membantu kita mencari informasi dan belajar hal baru. Kita bisa belajar dari video, artikel, dan kursus online.",
        "Lino: Wah, keren! Apa lagi yang bisa kita lakukan dengan internet?",
        "Rafi: Kita bisa berbagi pengetahuan dengan membuat blog atau video. Tapi kita juga harus hati-hati dan menjaga keamanan data kita.",
        "Lino: Oh, maksudnya data pribadi ya?",
        "Rafi: Betul! Tidak semua orang di internet memiliki niat baik. Kita harus pintar menjaga informasi pribadi kita."
      ]
    },
    {
      id: "math",
      type: "math",
      title: "Pisang Epe",
      description: "Saat lapar, kamu dan Rafi menikmati Pisang Epe yang dipotong menjadi beberapa bagian.",
      image: images.pisangEpe,
      question: "Pisang Epe dibagi menjadi 8 bagian. Jika kamu makan 2 bagian, berapa pecahan yang kamu makan?",
      options: [
        { id: "1", text: "1/2" },
        { id: "2", text: "1/5" },
        { id: "3", text: "1/6" },
        { id: "4", text: "1/8" },
        { id: "5", text: "1/3" },
        { id: "6", text: "3/4" },
        { id: "7", text: "5/6" },
        { id: "8", text: "1/3" },
        { id: "9", text: "2/8" },
        { id: "10", text: "7/8" }
      ],
      correctAnswer: "9"
    },
    {
      id: "safety",
      type: "safety",
      title: "Keamanan Internet",
      description: "Setelah mengisi perut, Lino dan Rafi mulai membahas mengenai internet. Rafi menunjukkan bagaimana internet membantunya belajar dan berbagi pengetahuan. Rafi mengingatkan bahwa di internet, tidak semua orang memiliki niat baik. Kita harus berhati-hati dalam membagikan informasi pribadi seperti alamat rumah, nomor telepon, atau password.",
      questions: [
        {
          text: "Membagikan password ke teman dekat",
          safe: false
        },
        {
          text: "Menggunakan password yang kuat dengan kombinasi huruf dan angka",
          safe: true
        },
        {
          text: "Menulis informasi pribadi di media sosial",
          safe: false
        }
      ],
      image: images.safetyCheck
    },
    {
      id: "password",
      type: "password",
      title: "Buat Password",
      description: "Setelah mengetahui mana tindakan yang aman dan mana tindakan yang tidak aman, Lino menyadari bahwa dia perlu melindungi data pribadinya. Bantu Lino untuk membuat kata sandi yang kuat!",
      requirements: [
        { text: "Minimal 8 karakter", color: "#4CAF50" },
        { text: "Setidaknya memiliki huruf besar dan kecil", color: "#FFC107" },
        { text: "Harus mengandung angka", color: "#E91E63" }
      ],
      image: images.passwordInput
    }
  ],

  // Kelas 5 - Lanjutan Literasi Digital
  "5": [
    {
      id: "intro",
      type: "info",
      title: "Internet yang Bertanggung Jawab",
      description: "Lino melanjutkan perjalanannya untuk belajar lebih dalam tentang penggunaan internet yang bijak dan bertanggung jawab.",
      image: images.internetResponsibility,
      infoText: "Ketuk untuk melihat fakta!",
      facts: [
        "Etika digital penting untuk keamanan online",
        "Tidak semua informasi di internet adalah benar",
        "Privasi online harus dijaga dengan baik",
        "Cyberbullying dapat dicegah dengan sikap positif",
        "Digital footprint akan selalu ada di internet"
      ]
    },
    {
      id: "quiz1",
      type: "quiz",
      title: "Mengenali Hoax",
      description: "Mari belajar membedakan informasi yang benar dan hoax.",
      question: "Manakah ciri-ciri berita hoax?",
      image: images.hoaxNews,
      options: [
        { id: "1", text: "Judul sensasional dan provokatif" },
        { id: "2", text: "Memiliki sumber yang jelas" },
        { id: "3", text: "Dapat diverifikasi" },
        { id: "4", text: "Ditulis dengan bahasa yang baik" }
      ],
      correctAnswer: "1"
    }
  ],

  // Kelas 6 - Wanggar, Papua (Literasi Finansial)
  "6": [
    {
      id: "intro",
      type: "info",
      title: "Pasar Tradisional Papua",
      description: "Lino tiba di Papua, mempelajari bagaimana masyarakat mengelola keuangan melalui pasar tradisional.",
      image: images.pasarPapua,
      infoText: "Ketuk untuk melihat fakta!",
      facts: [
        "Noken adalah tas tradisional Papua untuk membawa barang",
        "Sistem barter masih digunakan di beberapa daerah Papua",
        "Sagu adalah makanan pokok masyarakat Papua",
        "Pasar Mama-mama Papua terkenal dengan hasil buminya",
        "Koteka adalah pakaian tradisional pria suku Dani"
      ]
    },
    {
      id: "math",
      type: "math",
      title: "Menabung untuk Masa Depan",
      description: "Lino belajar menabung dari hasil panen sagu.",
      image: images.tabungan,
      question: "Jika menabung Rp 5.000 setiap hari selama 10 hari, berapa total tabungan?",
      options: [
        { id: "1", text: "Rp 40.000" },
        { id: "2", text: "Rp 45.000" },
        { id: "3", text: "Rp 50.000" },
        { id: "4", text: "Rp 55.000" }
      ],
      correctAnswer: "3"
    },
    {
      id: "quiz1",
      type: "quiz",
      title: "Prioritas Keuangan",
      description: "Mari belajar mengatur prioritas pengeluaran.",
      question: "Manakah yang termasuk kebutuhan pokok?",
      image: images.kebutuhan,
      options: [
        { id: "1", text: "Mainan baru" },
        { id: "2", text: "Makanan sehari-hari" },
        { id: "3", text: "Gadget terbaru" },
        { id: "4", text: "Jajan di kantin" }
      ],
      correctAnswer: "2"
    }
  ]
};