'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Define types for activities
interface BaseActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  image: any; // Changed from string to any to accept require() images
}

interface InfoActivity extends BaseActivity {
  type: 'info';
  infoText: string;
  facts: string[];
}

interface QuizActivity extends BaseActivity {
  type: 'quiz';
  question: string;
  options: Array<{id: string, text: string}>;
  correctAnswer: string;
}

interface DialogActivity extends BaseActivity {
  type: 'dialog';
  dialogOption: string;
  dialog: string[];
}

interface MathActivity extends BaseActivity {
  type: 'math';
  question: string;
  options: Array<{id: string, text: string}>;
  correctAnswer: string;
}

interface SafetyActivity extends BaseActivity {
  type: 'safety';
  questions: Array<{text: string, safe: boolean}>;
}

interface PasswordActivity extends BaseActivity {
  type: 'password';
  requirements: Array<{text: string, color: string}>;
}

type Activity = InfoActivity | QuizActivity | DialogActivity | MathActivity | SafetyActivity | PasswordActivity;

// Import all images
const images = {
  // Kelas 1 - Lampung
  kainTapis: require('../../../../assets/images/lino.png'),
  gajahLampung: require('../../../../assets/images/lino.png'),
  aniCharacter: require('../../../../assets/images/lino.png'),

  // Kelas 2 - Bandung
  batikMegamendung: require('../../../../assets/images/lino.png'),
  surabi: require('../../../../assets/images/lino.png'),
  polaBatik: require('../../../../assets/images/lino.png'),

  // Kelas 3 - Palangka Raya
  hutanKalimantan: require('../../../../assets/images/lino.png'),
  objekAir: require('../../../../assets/images/lino.png'),
  safetyScience: require('../../../../assets/images/lino.png'),

  // Kelas 4 - Makassar
  phinisiDiagram: require('../../../../assets/images/phinisi-diagram.png'),
  phinisiQuiz: require('../../../../assets/images/lino.png'),
  rafiCharacter: require('../../../../assets/images/lino.png'),
  pisangEpe: require('../../../../assets/images/lino.png'),
  safetyCheck: require('../../../../assets/images/lino.png'),
  passwordInput: require('../../../../assets/images/lino.png'),
  internetResponsibility: require('../../../../assets/images/lino.png'),

  // Kelas 5 - Lanjutan
  hoaxNews: require('../../../../assets/images/lino.png'),

  // Kelas 6 - Papua
  pasarPapua: require('../../../../assets/images/lino.png'),
  tabungan: require('../../../../assets/images/lino.png'),
  kebutuhan: require('../../../../assets/images/lino.png'),
  
  // Character
  lino: require('../../../../assets/images/lino.png'),
};

// Game activities data
const gameActivities: Record<string, Activity[]> = {
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
      title: "Bertemu Ani",
      description: "Lino bertemu Ani, anak Lampung yang suka membaca cerita rakyat.",
      image: images.aniCharacter,
      dialogOption: "Ketuk ikon 💬 untuk membaca percakapan dengan Ani.",
      dialog: [
        "Ani: Hai! Namaku Ani. Aku suka membaca cerita rakyat Lampung.",
        "Lino: Hai Ani! Cerita apa yang paling kamu suka?",
        "Ani: Aku suka cerita tentang Si Pahit Lidah dan Putri Kumbang Malam.",
        "Lino: Wah, menarik! Bisakah kamu ceritakan sedikit?",
        "Ani: Tentu! Tapi kita harus belajar membaca dulu agar bisa menikmati ceritanya.",
        "Lino: Baik! Ayo kita belajar bersama!"
      ]
    }
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

export default function LearningActivitiesPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [dialogIndex, setDialogIndex] = useState(0);
  const [showingFact, setShowingFact] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    casing: false,
    numbers: false
  });
  const [showScore, setShowScore] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Get class ID from route params - with fallback
  const classId = params.id as string || '1';
  
  // Get activities for this class
  const activities = gameActivities[classId] || [];
  
  // Current activity
  const currentActivity = activities[currentActivityIndex];

  // Handle goBack navigation
  const handleGoBack = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
      // Reset state for the previous activity
      setShowingFact(false);
      setFactIndex(0);
      setDialogIndex(0);
    } else {
      router.back();
    }
  };

  // Handle going to next activity
  const handleNextActivity = () => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
      // Reset state for the next activity
      setShowingFact(false);
      setFactIndex(0);
      setDialogIndex(0);
    } else {
      // Calculate final score
      calculateFinalScore();
      setShowScore(true);
    }
  };

  // Calculate final score
  const calculateFinalScore = () => {
    let correctAnswers = 0;
    let totalQuestions = 0;

    // Loop through all activities
    activities.forEach(activity => {
      if (activity.type === 'quiz' || activity.type === 'math') {
        totalQuestions++;
        if (answers[activity.id] === activity.correctAnswer) {
          correctAnswers++;
        }
      } else if (activity.type === 'safety') {
        activity.questions.forEach((question, index) => {
          totalQuestions++;
          if (answers[`${activity.id}_${index}`] === question.safe) {
            correctAnswers++;
          }
        });
      } else if (activity.type === 'password') {
        totalQuestions++;
        if (passwordValid.length && passwordValid.casing && passwordValid.numbers) {
          correctAnswers++;
        }
      } else if (activity.type === 'dialog' || activity.type === 'info') {
        // These are considered completed if the user went through them
        totalQuestions++;
        if (answers[activity.id]) {
          correctAnswers++;
        }
      }
    });

    // Calculate percentage
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setFinalScore(score);
  };

  // Handle finish and return to class detail
  const handleFinish = () => {
    router.push(`/(games)/detail/${classId}/page`);
  };

  // Handle quiz answer selection
  const handleAnswerSelect = (activityId: string, answerId: string) => {
    setAnswers({
      ...answers,
      [activityId]: answerId
    });
  };

  // Handle safety check
  const handleSafetyCheck = (activityId: string, questionIndex: number, isSafe: boolean) => {
    setAnswers({
      ...answers,
      [`${activityId}_${questionIndex}`]: isSafe
    });
  };

  // Handle dialog progression
  const handleDialogProgress = (activityId: string) => {
    if (dialogIndex < (currentActivity?.type === 'dialog' ? currentActivity.dialog.length - 1 : 0)) {
      setDialogIndex(dialogIndex + 1);
    } else {
      // Mark dialog as completed
      setAnswers({
        ...answers,
        [activityId]: true
      });
    }
  };

  // Handle fact viewing
  const handleViewFact = (activityId: string) => {
    if (!showingFact) {
      setShowingFact(true);
    } else {
      if (factIndex < (currentActivity?.type === 'info' ? currentActivity.facts.length - 1 : 0)) {
        setFactIndex(factIndex + 1);
      } else {
        // Mark as completed after viewing all facts
        setAnswers({
          ...answers,
          [activityId]: true
        });
        setShowingFact(false);
        setFactIndex(0);
      }
    }
  };

  // Handle password input
  const handlePasswordChange = (text: string) => {
    setPasswordInput(text);
    
    // Validate password
    const hasMinLength = text.length >= 8;
    const hasBothCases = /[a-z]/.test(text) && /[A-Z]/.test(text);
    const hasNumbers = /[0-9]/.test(text);
    
    setPasswordValid({
      length: hasMinLength,
      casing: hasBothCases,
      numbers: hasNumbers
    });
  };

  // Render progress indicators
  const renderProgressIndicators = () => {
    return activities.map((activity, index) => {
      const isCompleted = index < currentActivityIndex;
      const isCurrent = index === currentActivityIndex;
      
      return (
        <View 
          key={index}
          style={[
            styles.progressIndicator, 
            isCompleted ? styles.completedIndicator : styles.incompleteIndicator,
            isCurrent ? styles.currentIndicator : null
          ]}
        />
      );
    });
  };

  // Info activity with facts
  const renderInfoActivity = (activity: InfoActivity) => {
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <TouchableOpacity 
          style={styles.infoImageContainer}
          onPress={() => handleViewFact(activity.id)}
        >
          <Image 
            source={activity.image}
            style={styles.infoImage} 
            resizeMode="contain"
          />
          
          {!showingFact && (
            <View style={styles.magnifyingGlass}>
              <Image source={require('../../../../assets/images/loop.png')} />
              <Text style={styles.infoText}>{activity.infoText}</Text>
            </View>
          )}
          
          {showingFact && (
            <View style={styles.factContainer}>
              <Text style={styles.factText}>{activity.facts[factIndex]}</Text>
              {factIndex < activity.facts.length - 1 ? (
                <Text style={styles.tapMoreText}>Ketuk untuk fakta lainnya</Text>
              ) : (
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextActivity}
                >
                  <Text style={styles.nextButtonText}>Lanjut</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Quiz activity
  const renderQuizActivity = (activity: QuizActivity) => {
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={activity.image}
            style={styles.activityImage} 
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.questionText}>{activity.question}</Text>
        
        <View style={styles.optionsGrid}>
          {activity.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                answers[activity.id] === option.id && 
                  (option.id === activity.correctAnswer 
                    ? styles.correctOption 
                    : styles.incorrectOption)
              ]}
              onPress={() => handleAnswerSelect(activity.id, option.id)}
              disabled={answers[activity.id] !== undefined}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {answers[activity.id] !== undefined && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {answers[activity.id] === activity.correctAnswer 
                ? "Benar! Bagus sekali." 
                : "Belum tepat, coba lagi."}
            </Text>
            {answers[activity.id] === activity.correctAnswer && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextActivity}
              >
                <Text style={styles.nextButtonText}>Lanjut</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  // Dialog activity
  const renderDialogActivity = (activity: DialogActivity) => {
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.dialogContainer}>
          <Image 
            source={activity.image}
            style={styles.characterImage} 
            resizeMode="contain"
          />
          
          {dialogIndex === 0 ? (
            <View style={styles.dialogOption}>
              <Text style={styles.dialogOptionText}>{activity.dialogOption}</Text>
              <TouchableOpacity
                style={styles.dialogBubble}
                onPress={() => handleDialogProgress(activity.id)}
              >
                <Text style={styles.dialogBubbleText}>💬</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.dialogTextContainer}>
              <Text style={styles.dialogText}>
                {activity.dialog[dialogIndex]}
              </Text>
              <TouchableOpacity
                style={styles.dialogNext}
                onPress={() => {
                  if (dialogIndex < activity.dialog.length - 1) {
                    handleDialogProgress(activity.id);
                  } else {
                    // Mark as completed and move to next
                    setAnswers({...answers, [activity.id]: true});
                    handleNextActivity();
                  }
                }}
              >
                <Text style={styles.dialogNextText}>
                  {dialogIndex < activity.dialog.length - 1 ? "Lanjut" : "Selesai"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Math activity
  const renderMathActivity = (activity: MathActivity) => {
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={activity.image}
            style={styles.activityImage} 
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.questionText}>{activity.question}</Text>
        
        <View style={styles.optionsGrid}>
          {activity.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                answers[activity.id] === option.id && 
                  (option.id === activity.correctAnswer 
                    ? styles.correctOption 
                    : styles.incorrectOption)
              ]}
              onPress={() => handleAnswerSelect(activity.id, option.id)}
              disabled={answers[activity.id] !== undefined}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {answers[activity.id] !== undefined && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {answers[activity.id] === activity.correctAnswer 
                ? "Benar! Bagus sekali." 
                : "Belum tepat, coba lagi."}
            </Text>
            {answers[activity.id] === activity.correctAnswer && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextActivity}
              >
                <Text style={styles.nextButtonText}>Lanjut</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  // Safety activity
  const renderSafetyActivity = (activity: SafetyActivity) => {
    // Check if all questions are answered correctly
    const allQuestionsAnswered = activity.questions.every(
      (_, index) => answers[`${activity.id}_${index}`] !== undefined
    );
    
    const allCorrect = activity.questions.every(
      (question, index) => answers[`${activity.id}_${index}`] === question.safe
    );

    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.safetyContainer}>
          <View style={styles.safetyHeader}>
            <Text style={styles.safetyHeaderText}>Aman</Text>
            <Text style={styles.safetyHeaderText}>Tidak Aman</Text>
          </View>
          
          {activity.questions.map((question, index) => (
            <View key={index} style={styles.safetyQuestion}>
              <View style={styles.safetyQuestionTextContainer}>
                <Text style={styles.safetyQuestionText}>{question.text}</Text>
              </View>
              
              <View style={styles.safetyOptions}>
                <TouchableOpacity
                  style={[
                    styles.safetyCheckbox,
                    answers[`${activity.id}_${index}`] === true && styles.safetySelected
                  ]}
                  onPress={() => handleSafetyCheck(activity.id, index, true)}
                >
                  {answers[`${activity.id}_${index}`] === true && <Text>✓</Text>}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.safetyCheckbox,
                    answers[`${activity.id}_${index}`] === false && styles.safetySelected
                  ]}
                  onPress={() => handleSafetyCheck(activity.id, index, false)}
                >
                  {answers[`${activity.id}_${index}`] === false && <Text>✓</Text>}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        
        {allQuestionsAnswered && allCorrect && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextActivity}
          >
            <Text style={styles.nextButtonText}>Lanjut</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Password activity
  const renderPasswordActivity = (activity: PasswordActivity) => {
    const allValid = passwordValid.length && passwordValid.casing && passwordValid.numbers;
    
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Masukan password yang kuat!"
            value={passwordInput}
            onChangeText={handlePasswordChange}
            secureTextEntry={true}
          />
          
          <View style={styles.requirementsList}>
            {activity.requirements.map((req, index) => (
              <Text 
                key={index} 
                style={[
                  styles.requirementText,
                  { color: req.color },
                  index === 0 && passwordValid.length && styles.validRequirement,
                  index === 1 && passwordValid.casing && styles.validRequirement,
                  index === 2 && passwordValid.numbers && styles.validRequirement
                ]}
              >
                {req.text}
              </Text>
            ))}
          </View>
        </View>
        
        {allValid && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextActivity}
          >
            <Text style={styles.nextButtonText}>Lanjut</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render the current activity
  const renderActivity = () => {
    if (!currentActivity) return null;

    switch (currentActivity.type) {
      case 'info':
        return renderInfoActivity(currentActivity);
      case 'quiz':
        return renderQuizActivity(currentActivity);
      case 'dialog':
        return renderDialogActivity(currentActivity);
      case 'math':
        return renderMathActivity(currentActivity);
      case 'safety':
        return renderSafetyActivity(currentActivity);
      case 'password':
        return renderPasswordActivity(currentActivity);
      default:
        return null;
    }
  };

  // Score screen
  const renderScoreScreen = () => {
    return (
      <View style={styles.scoreContainer}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Pembelajaran Selesai!</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{finalScore}%</Text>
          </View>
          <Text style={styles.scoreMessage}>
            {finalScore >= 80 
              ? "Luar biasa! Kamu berhasil menguasai materi ini dengan sangat baik."
              : finalScore >= 60
                ? "Bagus! Kamu telah menguasai sebagian besar materi ini."
                : "Teruslah berlatih, kamu pasti bisa lebih baik!"}
          </Text>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinish}
          >
            <Text style={styles.finishButtonText}>Selesai</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Loading state
  if (!currentActivity && !showScore) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header with back button and progress indicators */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        
        <View style={styles.progressIndicatorsContainer}>
          {renderProgressIndicators()}
        </View>
      </View>
      
      {/* Main content */}
      <ScrollView style={styles.content}>
        {!showScore ? (
          <View style={styles.gameWrapper}>
            {currentActivity && <Text style={styles.gameTitle}>{currentActivity.title}</Text>}
            {renderActivity()}
          </View>
        ) : (
          renderScoreScreen()
        )}
      </ScrollView>
      
      {/* Character mascot */}
      {!showScore && (
        <Image
          source={images.lino}
          style={styles.mascot}
          resizeMode="contain"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A365D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A365D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressIndicatorsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  progressIndicator: {
    height: 6,
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 3,
  },
  completedIndicator: {
    backgroundColor: '#FFA726',
  },
  incompleteIndicator: {
    backgroundColor: 'white',
  },
  currentIndicator: {
    height: 8,
  },
  content: {
    flex: 1,
  },
  gameWrapper: {
    backgroundColor: 'rgba(255, 250, 230, 0.95)',
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 500,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A365D',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  activityContainer: {
    padding: 20,
  },
  activityDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  activityImage: {
    width: '100%',
    height: 200,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  correctOption: {
    backgroundColor: '#A5D6A7',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#EF9A9A',
    borderWidth: 2,
    borderColor: '#E53935',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#E30425',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialogContainer: {
    alignItems: 'center',
  },
  characterImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  dialogOption: {
    alignItems: 'center',
  },
  dialogOptionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  dialogBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  dialogBubbleText: {
    fontSize: 30,
  },
  dialogTextContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    width: '100%',
  },
  dialogText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  dialogNext: {
    alignSelf: 'flex-end',
    backgroundColor: '#E30425',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  dialogNextText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  safetyContainer: {
    marginVertical: 20,
  },
  safetyHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  safetyHeaderText: {
    width: 100,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1A365D',
  },
  safetyQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  safetyQuestionTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  safetyQuestionText: {
    fontSize: 16,
    color: '#333',
  },
  safetyOptions: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-around',
  },
  safetyCheckbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#1A365D',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetySelected: {
    backgroundColor: '#A5D6A7',
    borderColor: '#4CAF50',
  },
  passwordContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  passwordInput: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  requirementsList: {
    alignSelf: 'flex-start',
  },
  requirementText: {
    fontSize: 16,
    marginBottom: 8,
  },
  validRequirement: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  infoImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 20,
  },
  infoImage: {
    width: '100%',
    height: 250,
  },
  magnifyingGlass: {
    position: 'absolute',
    bottom: '-10%',
    right: '25%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#1A365D',
    fontWeight: 'bold',
  },
  factContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  factText: {
    fontSize: 16,
    color: '#1A365D',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tapMoreText: {
    fontSize: 14,
    color: '#E30425',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  scoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#A5D6A7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 8,
    borderColor: '#4CAF50',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  scoreMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
    lineHeight: 24,
  },
  finishButton: {
    backgroundColor: '#E30425',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mascot: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 100,
    height: 100,
  },
});