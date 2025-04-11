'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Mendapatkan dimensi layar
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Data kelas dan region
const classData = [
  {
    id: '1',
    number: '1',
    title: 'Bandar Lampung',
    subtitle: 'Lampung',
    culturalItem: 'Kain Tapis Lampung',
    culturalDescription: 'Kain Tapis Lampung adalah kain tradisional khas Lampung yang terbuat dari tenunan benang kapas dengan hiasan sulaman benang emas atau perak. Kain ini memiliki motif geometris, flora, fauna, dan simbol budaya yang melambangkan nilai adat, spiritualitas, serta status sosial pemakainya.',
    story: 'Lino, seorang anak yang penuh rasa ingin tahu, tiba di Lampung, tanah yang terkenal dengan gajah Sumatra yang megah, kain Tapis yang indah, dan Tari Sigeh Pengunten yang anggun. Begitu tiba, ia disambut oleh semilir angin pantai dan suara riuh pasar tradisional yang menjual berbagai kerajinan khas.\n\nNamun, perjalanan Lino tidak hanya sekadar melihat dan menikmati keindahan Lampung. Ia memiliki sebuah misi: mempelajari budaya Lampung sambil meningkatkan keterampilannya dalam membaca dan menulis! Tapi tentu saja, ia tidak bisa melakukannya sendiri. Ayo, bantu Lino dalam petualangan ini!\n\nPertama, ia harus membaca cerita rakyat Lampung untuk memahami legenda yang berkembang di daerah ini. Tapi ada satu masalah—beberapa halaman buku yang ia baca memiliki kata-kata yang hilang! Bisakah kamu membantu Lino menemukan kata yang tepat?',
    progress: {
      reading: 80,
      writing: 45,
      locked: true
    },
    backgroundImage: require('../../../../assets/images/kelas1.svg'),
  },
  {
    id: '2',
    number: '3',
    title: 'Bandung',
    subtitle: 'Jawa Barat',
    culturalItem: 'Batik Motif Megamendung',
    culturalDescription: 'Megamendung adalah motif batik yang berasal dari Cirebon dan dipengaruhi oleh budaya Tiongkok. Motif awan yang berlapis-lapis dalam batik ini melambangkan hujan yang membawa kesuburan bagi pertanian. Selain itu, awan dalam budaya Tiongkok melambangkan nirwana, kehidupan abadi, dan kebebasan.',
    story: 'Setelah berpetualang di Jakarta, kini Lino tiba di Bandung, kota yang terkenal dengan keindahan alamnya, udara yang sejuk, serta makanan lezat seperti Batagor yang renyah dan Surabi yang manis. Dengan penuh semangat, ia mulai menjelajahi setiap sudut kota, dari alun-alun hingga pasar tradisional, mencicipi berbagai makanan khas dan berinteraksi dengan penduduk setempat. Namun, ada satu tantangan besar yang harus ia selesaikan: ia harus mengasah keterampilan berhitungnya dalam sebuah petualangan penuh angka dan teka-teki seru yang tersebar di berbagai tempat menarik di kota ini!',
    progress: {
      reading: 80,
      writing: 45,
      locked: true
    },
    backgroundImage: require('../../../../assets/images/kelas2.svg'),
  },
  {
    id: '3',
    number: '4',
    title: 'Palangka Raya',
    subtitle: 'Kalimantan Tengah',
    culturalItem: 'Baju Sangkarut',
    culturalDescription: 'Baju Sangkarut adalah pakaian adat khas suku Dayak yang terbuat dari kulit kayu atau kain dengan hiasan motif khas, seperti ukiran alam dan simbol budaya Dayak. Baju ini biasanya dikenakan dalam upacara adat, tarian, atau ritual sebagai simbol keberanian, spiritualitas, dan identitas suku Dayak.',
    story: 'Petualangan Lino berlanjut ke Palangka Raya, Kalimantan Tengah, daerah yang terkenal dengan hutan tropisnya yang lebat dan budaya Dayak yang kaya. Saat berjalan-jalan di sekitar Sungai Kahayan, ia melihat sekelompok anak sedang melakukan eksperimen seru dengan air dan berbagai benda.\n\n"Kami sedang melakukan eksperimen untuk melihat benda apa saja yang bisa mengapung dan tenggelam," kata salah satu anak.\n\nLino sangat penasaran! Ia ingin ikut serta dan menguji berbagai benda seperti batu, kayu, dan bahkan daun kelapa. Tapi sebelum itu, ia ingin tahu: menurutmu, benda apa saja yang bisa mengapung, dan mana yang akan tenggelam? Yuk, coba tebak sebelum melakukan eksperimen!',
    progress: {
      reading: 80,
      writing: 45,
      locked: true
    },
    backgroundImage: require('../../../../assets/images/kelas3.svg'),
  },
  {
    id: '4',
    number: '1',
    title: 'Makassar',
    subtitle: 'Sulawesi Selatan',
    culturalItem: 'Batik Motif La Galigo',
    culturalDescription: 'Motif La Galigo adalah motif batik yang berasal dari Sulawesi Selatan. Motif ini menggambarkan sebuah karya sastra yang terkenal dari suku Bugis yang memiliki 300.000 cerita epik. La Galigo menceritakan tentang asal-usul Sangiang Serri, tradisi persembahan petani sebelum musim tanam.',
    story: 'Setelah menyelesaikan petualangannya di Pulau Kalimantan dan mempelajari berbagai ilmu sains, Linu, si burung hantu cerdas, kini terbang menuju Pulau Sulawesi. Dari ketinggian, ia melihat hamparan laut biru yang luas, dengan ombak yang memecah di tepi pantai berpasir putih. Di kejauhan, tampak kapal-kapal kayu berlayar gagah, membawa hasil laut dan rempah-rempah yang menjadi kebanggaan daerah ini.\n\nSaat mendarat di pesisir Makassar, Linu merasakan semilir angin laut yang menyegarkan. Kota ini kaya akan sejarah dan kebudayaan, mulai dari kapal legendaris Phinisi, kuliner khas seperti Coto Makassar, hingga nilai-nilai luhur yang dijunjung tinggi oleh masyarakatnya. Di era modern ini, teknologi digital mulai mengambil peran dalam melestarikan dan memperkanalkan budaya Makassar ke dunia.\n\nPenasaran dengan bagaimana teknologi bisa membantu kehidupan masyarakat di sini, Linu memutuskan untuk menjelajah lebih dalam. Perjalanannya baru saja dimulai, dan di depan sana, berbagai pengalaman menarik telah menantinya!',
    progress: {
      reading: 80,
      writing: 45,
      locked: true
    },
    backgroundImage: require('../../../../assets/images/kelas4-5.svg'),
  },
  {
    id: '5',
    number: '5',
    title: 'Wanggar',
    subtitle: 'Papua Tengah',
    culturalItem: 'Holim',
    culturalDescription: 'Holim adalah pakaian adat khas suku Dani di Papua, yang biasanya dikenakan oleh pria. Pakaian ini terbuat dari serat alam dan sering dipadukan dengan koteka, digunakan dalam upacara adat sebagai simbol budaya dan tradisi masyarakat Dani.',
    story: 'Setelah menjelajahi keindahan Papua Barat, Linu, si burung hantu penjelajah, kembali mengepakkan sayapnya menuju Papua Tengah. Dari udara, ia melihat gugusan pegunungan tinggi, lembah hijau yang luas, dan sungai-sungai yang berkelok seperti jalur emas di antara hutan belantara. Saat mendekati kota Nabire, ibu kota Papua Tengah, Linu menyaksikan masyarakat setempat yang hidup berdampingan dengan alam, berburu ikan di perairan Teluk Cenderawasih dan berdagang hasil bumi di pasar tradisional.\n\nLinu tertarik untuk belajar lebih dalam tentang bagaimana masyarakat di Papua Tengah mengelola hasil alam mereka secara bijak. Ia penasaran, bagaimana mereka menabung dari hasil panen? Bagaimana cara mereka mengatur uang agar cukup untuk kebutuhan sehari-hari? Di sinilah petualangan baru dimulai!',
    progress: {
      reading: 80,
      writing: 45,
      locked: true
    },
    backgroundImage: require('../../../../assets/images/kelas6.svg'),
  },
];

// CircleProgress component
const CircleProgress = ({ percentage, size = 80, strokeWidth = 10, color = '#4CAF50' }: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = ((100 - percentage) / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke="#E0E0E0"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
        {/* Percentage value is displayed separately, not inside SVG */}
      </Svg>
    </View>
  );
};

export default function ClassDetailPage({ route }: { route: any }) {
  const navigation = useNavigation<any>();
  const [classInfo, setClassInfo] = useState<any>(null);
  
  // Get the class ID from the route params
  const classId = route?.params?.id || '1';
  
  useEffect(() => {
    // Find the class info based on the ID
    const currentClass = classData.find(c => c.id === classId);
    if (currentClass) {
      setClassInfo(currentClass);
    }
  }, [classId]);
  
  // If class info is not loaded yet, show a loading screen
  if (!classInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const handleStartLearning = () => {
    // Navigate to the first lesson of the class
    navigation.navigate(`Class${classId}Lesson1` as never);
  };
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Cultural Item Banner */}
      <View style={styles.culturalBanner}>
        <Text style={styles.culturalTitle}>{classInfo.culturalItem}</Text>
        <Text style={styles.culturalDescription}>{classInfo.culturalDescription}</Text>
      </View>
      
      {/* Main content with map background */}
      <ImageBackground 
        source={classInfo.backgroundImage} 
        style={styles.mapBackground}
        resizeMode="cover"
      >
        {/* Content panel on the right */}
        <View style={styles.contentContainer}>
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          
          {/* Class header */}
          <View style={styles.classHeader}>
            <View style={styles.classNumberBadge}>
              <Text style={styles.classNumberText}>{classInfo.number}</Text>
            </View>
            <View style={styles.classTitleContainer}>
              <Text style={styles.classTitle}>{classInfo.title}</Text>
              <Text style={styles.classSubtitle}>{classInfo.subtitle}</Text>
            </View>
            <Image 
              source={require('../../../../assets/images/owl-academic.png')} 
              style={styles.owlCharacter} 
              resizeMode="contain"
            />
          </View>
          
          {/* Class Story */}
          <ScrollView style={styles.storyContainer}>
            <Text style={styles.storyText}>{classInfo.story}</Text>
          </ScrollView>
          
          {/* Progress indicators */}
          <View style={styles.progressContainer}>
            <View style={styles.progressItem}>
              <CircleProgress 
                percentage={classInfo.progress.reading} 
                color="#4CAF50" 
              />
              <Text style={styles.progressLabel}>{classInfo.progress.reading}%</Text>
            </View>
            <View style={styles.progressItem}>
              <CircleProgress 
                percentage={classInfo.progress.writing} 
                color="#FFC107" 
              />
              <Text style={styles.progressLabel}>{classInfo.progress.writing}%</Text>
            </View>
            <View style={styles.progressItem}>
              {classInfo.progress.locked ? (
                <View style={styles.lockedIcon}>
                  <Text style={styles.lockText}>🔒</Text>
                </View>
              ) : (
                <CircleProgress percentage={0} color="#E91E63" />
              )}
            </View>
          </View>
          
          {/* Start button */}
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartLearning}
          >
            <Text style={styles.startButtonText}>Mulai</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// Import these at the top of your file
import Svg, { Circle } from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  culturalBanner: {
    backgroundColor: 'rgba(249, 246, 238, 0.9)',
    padding: 16,
    paddingTop: StatusBar.currentHeight || 40,
  },
  culturalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 4,
  },
  culturalDescription: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  mapBackground: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    width: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#E30425',
    fontSize: 16,
    fontWeight: 'bold',
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  classNumberBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E30425',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginRight: 16,
  },
  classNumberText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  classTitleContainer: {
    flex: 1,
  },
  classTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#E30425',
  },
  classSubtitle: {
    fontSize: 18,
    color: '#666',
  },
  owlCharacter: {
    width: 60,
    height: 60,
  },
  storyContainer: {
    flex: 1,
    marginBottom: 20,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressLabel: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  lockedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    fontSize: 30,
  },
  startButton: {
    backgroundColor: '#E30425',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});