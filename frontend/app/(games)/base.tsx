'use client';

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mendapatkan dimensi layar
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Data untuk marker peta dengan persentase yang dikonversi menjadi nilai numerik
const classMarkers = [
  {
    id: 1,
    name: 'Kelas 1',
    location: { topPercent: 32, leftPercent: 18 },
    image: require('../../assets/images/kelas1.svg'),
  },
  {
    id: 2,
    name: 'Kelas 2',
    location: { topPercent: 65, leftPercent: 30 },
    image: require('../../assets/images/kelas2.svg'),
  },
  {
    id: 3,
    name: 'Kelas 3',
    location: { topPercent: 42, leftPercent: 48 },
    image: require('../../assets/images/kelas3.svg'),
  },
  {
    id: 4,
    name: 'Kelas 4-5',
    location: { topPercent: 52, leftPercent: 65 },
    image: require('../../assets/images/kelas4-5.svg'),
  },
  {
    id: 6,
    name: 'Kelas 6',
    location: { topPercent: 48, leftPercent: 88 },
    image: require('../../assets/images/kelas6.svg'),
  },
];

export default function GameMapPage() {
  const navigation = useNavigation<any>();
  
  // State untuk menampilkan popup informasi kelas
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  
  // Handler ketika marker diklik
  const handleMarkerPress = (classId: number) => {
    if (selectedClass === classId) {
      // Jika marker yang sama diklik lagi, arahkan ke halaman kelas
      navigation.navigate('ClassDetail', { id: classId.toString() } as never);
    } else {
      // Tampilkan informasi kelas
      setSelectedClass(classId);
    }
  };
  
  // Fungsi untuk menutup popup
  const closePopup = () => {
    setSelectedClass(null);
  };
  
  // Navigasi ke halaman detail kelas
  const navigateToClassDetail = (classId: number) => {
    navigation.navigate('ClassDetail', { id: classId.toString() } as never);
  };
  
  // Render marker kelas pada peta
  const renderMarkers = () => {
    return classMarkers.map((marker) => {
      // Konversi persentase ke nilai absolut berdasarkan dimensi layar
      const topValue = (windowHeight * marker.location.topPercent) / 100;
      const leftValue = (windowWidth * marker.location.leftPercent) / 100;
      
      return (
        <View 
          key={marker.id} 
          style={[
            styles.markerContainer,
            { 
              top: topValue, 
              left: leftValue 
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => handleMarkerPress(marker.id)}
            activeOpacity={0.8}
          >
            <View style={styles.markerImageContainer}>
              <Image source={marker.image} style={styles.markerImage} />
              <Text style={styles.markerText}>{marker.name}</Text>
            </View>
            <View style={styles.markerArrow} />
          </TouchableOpacity>
        </View>
      );
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/lino.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoTitle}>linugoo</Text>
            <Text style={styles.logoSubtitle}>untuk siswa</Text>
          </View>
        </View>
      </View>
      
      {/* Game Map Content */}
      <ImageBackground 
        source={require('../../assets/images/indonesia-map-bg.svg')} 
        style={styles.mapBackground}
        resizeMode="cover"
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Peta Literasi dan Numerasi: Ayo Jelajahi, Pelajari, Kuasai!</Text>
        </View>
        
        {/* Render semua marker kelas */}
        {renderMarkers()}
        
        {/* Popup informasi kelas jika ada yang dipilih */}
        {selectedClass !== null && (
          <View style={styles.popup}>
            <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.popupTitle}>
              {classMarkers.find(marker => marker.id === selectedClass)?.name}
            </Text>
            <Text style={styles.popupDescription}>
              {selectedClass === 1 && "Belajar membaca dan menulis dasar dengan tema kebudayaan Sumatra."}
              {selectedClass === 2 && "Belajar numerasi dasar dengan tema kebudayaan Jawa, Bali, dan Nusa Tenggara."}
              {selectedClass === 3 && "Belajar konsep sains dasar dengan tema kebudayaan Kalimantan."}
              {selectedClass === 4 && "Belajar literasi digital dengan tema kebudayaan Sulawesi."}
              {selectedClass === 6 && "Belajar literasi finansial dengan tema kebudayaan Maluku dan Papua."}
            </Text>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => navigateToClassDetail(selectedClass)}
            >
              <Text style={styles.startButtonText}>Mulai Belajar</Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  logoTextContainer: {
    marginLeft: 8,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E30425',
  },
  logoSubtitle: {
    fontSize: 16,
    color: '#E30425',
  },
  mapBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A365D',
    textAlign: 'center',
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  markerImageContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  markerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    alignSelf: 'center',
  },
  popup: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E30425',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  popupDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#E30425',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});