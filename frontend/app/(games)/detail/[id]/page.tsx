"use client";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import InteractiveMapViewport from "@/app/components/games/InteractiveMapBackground";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
// const screenWidth = Dimensions.get("window").width;
// const isMobile = windowWidth < 768;

const classData = [
  {
    id: "1",
    number: "1",
    title: "Bandar Lampung",
    subtitle: "Lampung",
    culturalItem: "Kain Tapis Lampung",
    culturalDescription:
      "Kain Tapis Lampung adalah kain tradisional khas Lampung yang terbuat dari tenunan benang kapas dengan hiasan sulaman benang emas atau perak. Kain ini memiliki motif geometris, flora, fauna, dan simbol budaya yang melambangkan nilai adat, spiritualitas, serta status sosial pemakainya.",
    story:
      "Lino, seorang anak yang penuh rasa ingin tahu, tiba di Lampung, tanah yang terkenal dengan gajah Sumatra yang megah, kain Tapis yang indah, dan Tari Sigeh Pengunten yang anggun. Begitu tiba, ia disambut oleh semilir angin pantai dan suara riuh pasar tradisional yang menjual berbagai kerajinan khas.\n\nNamun, perjalanan Lino tidak hanya sekadar melihat dan menikmati keindahan Lampung. Ia memiliki sebuah misi: mempelajari budaya Lampung sambil meningkatkan keterampilannya dalam membaca dan menulis! Tapi tentu saja, ia tidak bisa melakukannya sendiri. Ayo, bantu Lino dalam petualangan ini!\n\nPertama, ia harus membaca cerita rakyat Lampung untuk memahami legenda yang berkembang di daerah ini. Tapi ada satu masalah—beberapa halaman buku yang ia baca memiliki kata-kata yang hilang! Bisakah kamu membantu Lino menemukan kata yang tepat?",
    progress: {
      reading: 80,
      writing: 45,
      locked: true,
    },
    mapViewport: {
      offsetX: -470,
      offsetY: -10,
      zoom: 1.6,
      width: windowWidth,
      height: windowHeight,
      mapWidth: 2000,
      mapHeight: 750,
    },
    backgroundImage: require("../../../../assets/images/kelas1.svg"),
  },
  {
    id: "2",
    number: "2",
    title: "Bandung",
    subtitle: "Jawa Barat",
    culturalItem: "Batik Motif Megamendung",
    culturalDescription:
      "Megamendung adalah motif batik yang berasal dari Cirebon dan dipengaruhi oleh budaya Tiongkok. Motif awan yang berlapis-lapis dalam batik ini melambangkan hujan yang membawa kesuburan bagi pertanian. Selain itu, awan dalam budaya Tiongkok melambangkan nirwana, kehidupan abadi, dan kebebasan.",
    story:
      "Setelah berpetualang di Jakarta, kini Lino tiba di Bandung, kota yang terkenal dengan keindahan alamnya, udara yang sejuk, serta makanan lezat seperti Batagor yang renyah dan Surabi yang manis. Dengan penuh semangat, ia mulai menjelajahi setiap sudut kota, dari alun-alun hingga pasar tradisional, mencicipi berbagai makanan khas dan berinteraksi dengan penduduk setempat. Namun, ada satu tantangan besar yang harus ia selesaikan: ia harus mengasah keterampilan berhitungnya dalam sebuah petualangan penuh angka dan teka-teki seru yang tersebar di berbagai tempat menarik di kota ini!",
    progress: {
      reading: 80,
      writing: 45,
      locked: true,
    },
    mapViewport: {
      offsetX: 280,
      offsetY: 420,
      zoom: 2,
      width: 600,
      height: 450,
      mapWidth: 1000,
      mapHeight: 750,
    },
    backgroundImage: require("../../../../assets/images/kelas2.svg"),
  },
  {
    id: "3",
    number: "3",
    title: "Palangka Raya",
    subtitle: "Kalimantan Tengah",
    culturalItem: "Baju Sangkarut",
    culturalDescription:
      "Baju Sangkarut adalah pakaian adat khas suku Dayak yang terbuat dari kulit kayu atau kain dengan hiasan motif khas, seperti ukiran alam dan simbol budaya Dayak. Baju ini biasanya dikenakan dalam upacara adat, tarian, atau ritual sebagai simbol keberanian, spiritualitas, dan identitas suku Dayak.",
    story:
      'Petualangan Lino berlanjut ke Palangka Raya, Kalimantan Tengah, daerah yang terkenal dengan hutan tropisnya yang lebat dan budaya Dayak yang kaya. Saat berjalan-jalan di sekitar Sungai Kahayan, ia melihat sekelompok anak sedang melakukan eksperimen seru dengan air dan berbagai benda.\n\n"Kami sedang melakukan eksperimen untuk melihat benda apa saja yang bisa mengapung dan tenggelam," kata salah satu anak.\n\nLino sangat penasaran! Ia ingin ikut serta dan menguji berbagai benda seperti batu, kayu, dan bahkan daun kelapa. Tapi sebelum itu, ia ingin tahu: menurutmu, benda apa saja yang bisa mengapung, dan mana yang akan tenggelam? Yuk, coba tebak sebelum melakukan eksperimen!',
    progress: {
      reading: 80,
      writing: 45,
      locked: true,
    },
    mapViewport: {
      offsetX: 310,
      offsetY: 250,
      zoom: 1.9,
      width: 600,
      height: 450,
      mapWidth: 1000,
      mapHeight: 750,
    },
    backgroundImage: require("../../../../assets/images/kelas3.svg"),
  },
  {
    id: "4",
    number: "4",
    title: "Makassar",
    subtitle: "Sulawesi Selatan",
    culturalItem: "Batik Motif La Galigo",
    culturalDescription:
      "Motif La Galigo adalah motif batik yang berasal dari Sulawesi Selatan. Motif ini menggambarkan sebuah karya sastra yang terkenal dari suku Bugis yang memiliki 300.000 cerita epik. La Galigo menceritakan tentang asal-usul Sangiang Serri, tradisi persembahan petani sebelum musim tanam.",
    story:
      "Setelah menyelesaikan petualangannya di Pulau Kalimantan dan mempelajari berbagai ilmu sains, Linu, si burung hantu cerdas, kini terbang menuju Pulau Sulawesi. Dari ketinggian, ia melihat hamparan laut biru yang luas, dengan ombak yang memecah di tepi pantai berpasir putih. Di kejauhan, tampak kapal-kapal kayu berlayar gagah, membawa hasil laut dan rempah-rempah yang menjadi kebanggaan daerah ini.\n\nSaat mendarat di pesisir Makassar, Linu merasakan semilir angin laut yang menyegarkan. Kota ini kaya akan sejarah dan kebudayaan, mulai dari kapal legendaris Phinisi, kuliner khas seperti Coto Makassar, hingga nilai-nilai luhur yang dijunjung tinggi oleh masyarakatnya. Di era modern ini, teknologi digital mulai mengambil peran dalam melestarikan dan memperkanalkan budaya Makassar ke dunia.\n\nPenasaran dengan bagaimana teknologi bisa membantu kehidupan masyarakat di sini, Linu memutuskan untuk menjelajah lebih dalam. Perjalanannya baru saja dimulai, dan di depan sana, berbagai pengalaman menarik telah menantinya!",
    progress: {
      reading: 80,
      writing: 45,
      locked: true,
    },
    mapViewport: {
      offsetX: 570,
      offsetY: 350,
      zoom: 2.1,
      width: 600,
      height: 450,
      mapWidth: 1000,
      mapHeight: 750,
    },
    backgroundImage: require("../../../../assets/images/kelas4-5.svg"),
  },
  {
    id: "5",
    number: "5",
    title: "Daerah Lanjutan",
    subtitle: "Literasi Digital",
    culturalItem: "Teknologi Modern Indonesia",
    culturalDescription:
      "Di era modern ini, Indonesia sedang bertransformasi digital. Dari Sabang sampai Merauke, teknologi membawa perubahan positif dalam pendidikan, ekonomi, dan budaya. Literasi digital menjadi kunci untuk memastikan semua anak Indonesia dapat memanfaatkan teknologi dengan bijak dan bertanggung jawab.",
    story:
      "Lino melanjutkan perjalanannya untuk mempelajari lebih dalam tentang literasi digital. Kali ini, ia akan fokus pada bagaimana membedakan informasi yang benar dan hoax, serta pentingnya etika digital dalam bermedia sosial. Dengan pemahaman yang lebih baik tentang dunia digital, Lino siap menjadi generasi yang cerdas dan bertanggung jawab di era teknologi.",
    progress: {
      reading: 80,
      writing: 45,
      locked: true,
    },
    mapView: {
      offsetX: 200,
      offsetY: 100,
      width: 800,
      height: 600,
    },
    backgroundImage: require("../../../../assets/images/kelas4-5.svg"),
  },
  {
    id: "6",
    number: "6",
    title: "Wanggar",
    subtitle: "Papua Tengah",
    culturalItem: "Holim",
    culturalDescription:
      "Holim adalah pakaian adat khas suku Dani di Papua, yang biasanya dikenakan oleh pria. Pakaian ini terbuat dari serat alam dan sering dipadukan dengan koteka, digunakan dalam upacara adat sebagai simbol budaya dan tradisi masyarakat Dani.",
    story:
      "Setelah menjelajahi keindahan Papua Barat, Linu, si burung hantu penjelajah, kembali mengepakkan sayapnya menuju Papua Tengah. Dari udara, ia melihat gugusan pegunungan tinggi, lembah hijau yang luas, dan sungai-sungai yang berkelok seperti jalur emas di antara hutan belantara. Saat mendekati kota Nabire, ibu kota Papua Tengah, Linu menyaksikan masyarakat setempat yang hidup berdampingan dengan alam, berburu ikan di perairan Teluk Cenderawasih dan berdagang hasil bumi di pasar tradisional.\n\nLinu tertarik untuk belajar lebih dalam tentang bagaimana masyarakat di Papua Tengah mengelola hasil alam mereka secara bijak. Ia penasaran, bagaimana mereka menabung dari hasil panen? Bagaimana cara mereka mengatur uang agar cukup untuk kebutuhan sehari-hari? Di sinilah petualangan baru dimulai!",
    progress: {
      reading: 80,
      writing: 45,
      locked: true,
    },
    mapViewport: {
      offsetX: 780,
      offsetY: 320,
      zoom: 2.2,
      width: 600,
      height: 450,
      mapWidth: 1000,
      mapHeight: 750,
    },
    backgroundImage: require("../../../../assets/images/kelas6.svg"),
  },
];

const CircleProgress = ({
  percentage,
  size = 50,
  strokeWidth = 6,
  color = "#4CAF50",
  showTextInside = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = ((100 - percentage) / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          stroke="#E0E0E0"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
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
      </Svg>
      {showTextInside && (
        <Text style={{ fontSize: 12, fontWeight: "bold", color: "#333" }}>
          {percentage}%
        </Text>
      )}
    </View>
  );
};

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [classInfo, setClassInfo] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get("window").height
  );

  const isMobile = windowWidth < 768;
  const screenWidth = windowWidth;

  const classId = (params.id as string) || "1";

  useEffect(() => {
    const updateLayout = () => {
      const { width, height } = Dimensions.get("window");
      setWindowWidth(width);
      setWindowHeight(height);
    };
    const subscription = Dimensions.addEventListener("change", updateLayout);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const currentClass = classData.find((c) => c.id === classId);
    if (currentClass) {
      const updatedMapViewport = {
        ...currentClass.mapViewport,
        width: windowWidth,
        height: windowHeight,
      };

      setClassInfo({
        ...currentClass,
        mapViewport: updatedMapViewport,
      });
    }
  }, [classId, windowWidth, windowHeight]);

  if (!classInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleStartLearning = () => {
    router.push(`/(games)/activities/${classId}/page`);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.culturalBanner}>
        <Text style={styles.culturalTitle}>{classInfo.culturalItem}</Text>
        <Text style={styles.culturalDescription}>
          {classInfo.culturalDescription}
        </Text>
      </View>

      <InteractiveMapViewport
        offsetX={classInfo.mapViewport.offsetX}
        offsetY={classInfo.mapViewport.offsetY}
        zoom={classInfo.mapViewport.zoom}
        width={classInfo.mapViewport.width}
        height={classInfo.mapViewport.height}
        mapWidth={classInfo.mapViewport.mapWidth}
        mapHeight={classInfo.mapViewport.mapHeight}
        renderMarkers={() => null}
      />

      <View
        style={[
          styles.floatingContent,
          isMobile
            ? { alignItems: "center", left: 0, right: 0, bottom: 0 }
            : {
                right: 30,
                alignItems: "flex-start",
                width: screenWidth * 0.45,
              },
        ]}
      >
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>

          <View style={styles.classHeader}>
            <View style={styles.classNumberCircle}>
              <Text style={styles.classNumberText}>{classInfo.number}</Text>
            </View>
            <View style={styles.classTitleContainer}>
              <Text style={styles.classTitle}>{classInfo.title}</Text>
              <Text style={styles.classSubtitle}>{classInfo.subtitle}</Text>
            </View>
            <Image
              source={require("../../../../assets/images/owl-academic.png")}
              style={styles.owlCharacter}
              resizeMode="contain"
            />
          </View>

          <ScrollView
            style={[
              styles.storyContainer,
              isMobile ? { maxHeight: 80 } : { maxHeight: 400 },
            ]}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.storyText}>{classInfo.story}</Text>
          </ScrollView>
          <View style={styles.bottomRow}>
            <View style={styles.progressContainer}>
              <View style={styles.progressItem}>
                <CircleProgress
                  percentage={classInfo.progress.reading}
                  color="#4CAF50"
                />
                <Text style={styles.progressLabel}>Membaca</Text>
              </View>
              <View style={styles.progressItem}>
                <CircleProgress
                  percentage={classInfo.progress.writing}
                  color="#FFC107"
                />
                <Text style={styles.progressLabel}>Menulis</Text>
              </View>
              <View style={styles.progressItem}>
                {/* {classInfo.progress.locked ? (
                  <View style={styles.lockedIcon}>
                    <Text style={styles.lockText}>🔒</Text>
                  </View>
                ) : (
                  <CircleProgress percentage={0} color="#E91E63" />
                )} */}
                {/* <Text style={styles.progressLabel}>Terkunci</Text> */}
              </View>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartLearning}
            >
              <Text style={styles.startButtonText}>Mulai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "#E1F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  culturalBanner: {
    backgroundColor: "rgba(249, 246, 238, 0.95)",
    padding: 16,
    paddingTop: StatusBar.currentHeight || 10,
  },
  culturalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A365D",
    marginBottom: 4,
  },
  culturalDescription: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
  },
  floatingContent: {
    marginTop: 115,
    position: "absolute",
    zIndex: 10,
    // margin: 10,
  },
  contentContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 20,
    marginTop: 20,
    borderRadius: 16,
    width: "100%",
    minHeight: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButtonText: {
    color: "#E30425",
    fontSize: 16,
    fontWeight: "bold",
  },
  classHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  classNumberCircle: {
    backgroundColor: "#E30425",
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  classNumberText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  classTitleContainer: {
    flex: 1,
  },
  classTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E30425",
  },
  classSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  owlCharacter: {
    width: 50,
    height: 50,
  },
  storyContainer: {
    marginBottom: 10,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#333",
    textAlign: "justify",
  },
  // progressContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  //   paddingVertical: 15,
  //   alignItems: "center",
  // },
  progressContainer: {
    flexDirection: "row",
    // justifyContent: "flex-start",
    paddingVertical: 10,
    gap: 10,
  },
  progressItem: {
    alignItems: "center",
  },
  progressLabel: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
  lockedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  lockText: {
    fontSize: 18,
  },
  startButton: {
    backgroundColor: "#E30425",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    alignSelf: "center",
    minWidth: 90,
    marginTop: 5,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
