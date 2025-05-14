"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  useWindowDimensions,
  AppState,
  AppStateStatus,
  Platform,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import StudentNavbar from "../components/StudentsNavbar";

// Import SVG sebagai komponen
import IndonesiaMap from "../../assets/images/indonesia-map-bg.svg";
import Kelas1 from "../../assets/images/kelas1.svg";
import Kelas2 from "../../assets/images/kelas2.svg";
import Kelas3 from "../../assets/images/kelas3.svg";
import Kelas4_5 from "../../assets/images/kelas4-5.svg";
import Kelas6 from "../../assets/images/kelas6.svg";

// Konstanta
const mapWidth = 1750;
const mapHeight = 750;

// Data marker dengan definisi yang lebih baik
const classMarkers = [
  {
    id: 1,
    name: "Kelas 1",
    location: { topPercent: 25, leftPercent: 13 },
    Component: Kelas1,
    description: "Belajar membaca dan menulis dasar dengan tema kebudayaan Sumatra."
  },
  {
    id: 2,
    name: "Kelas 2",
    location: { topPercent: 59, leftPercent: 30 },
    Component: Kelas2,
    description: "Belajar numerasi dasar dengan tema kebudayaan Jawa, Bali, dan Nusa Tenggara."
  },
  {
    id: 3,
    name: "Kelas 3",
    location: { topPercent: 12, leftPercent: 42 },
    Component: Kelas3,
    description: "Belajar konsep sains dasar dengan tema kebudayaan Kalimantan."
  },
  {
    id: 4,
    name: "Kelas 4-5",
    location: { topPercent: 48, leftPercent: 58 },
    Component: Kelas4_5,
    description: "Belajar literasi digital dengan tema kebudayaan Sulawesi dan lanjutannya."
  },
  {
    id: 6,
    name: "Kelas 6",
    location: { topPercent: 22, leftPercent: 81 },
    Component: Kelas6,
    description: "Belajar literasi finansial dengan tema kebudayaan Maluku dan Papua."
  },
];

export default function GameMapPage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const [mapKey, setMapKey] = useState(0);
  const [svgReady, setSvgReady] = useState(false);
  const appState = useRef(AppState.currentState);
  const isMounted = useRef(true);

  // Fungsi untuk memaksa render ulang komponen SVG
  const refreshSvgComponents = useCallback(() => {
    setSvgReady(false);
    // Gunakan timeout untuk memberi waktu pada unmount
    setTimeout(() => {
      if (isMounted.current) {
        setMapKey(prev => prev + 1);
        setSvgReady(true);
      }
    }, 50);
  }, []);

  // Deteksi perubahan status aplikasi (aktif/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App kembali ke foreground
        refreshSvgComponents();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [refreshSvgComponents]);

  // Lifecycle hooks
  useEffect(() => {
    isMounted.current = true;
    setSvgReady(true);

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fokus effect untuk memuat ulang SVG saat kembali ke halaman
  useFocusEffect(
    useCallback(() => {
      refreshSvgComponents();
      
      return () => {
        setSelectedClass(null);
        setHoveredMarkerId(null);
      };
    }, [refreshSvgComponents])
  );

  const isMobile = screenWidth < 768;

  // Handlers
  const handleMarkerPress = (classId: number) => {
    if (selectedClass === classId) {
      router.push(`/(games)/detail/${classId}/page`);
    } else {
      setSelectedClass(classId);
    }
  };

  const closePopup = () => setSelectedClass(null);
  
  const navigateToClassDetail = (classId: number) =>
    router.push(`/(games)/detail/${classId}/page`);

  // Render marker dengan error handling
  const renderMarkers = (containerWidth: number, containerHeight: number) => {
    return classMarkers.map((marker) => {
      const topValue = (containerHeight * marker.location.topPercent) / 100;
      const leftValue = (containerWidth * marker.location.leftPercent) / 100;
      const isHovered = hoveredMarkerId === marker.id;
      const MarkerIcon = marker.Component;

      return (
        <View
          key={`marker-${marker.id}-${mapKey}`}
          style={[
            styles.markerContainer,
            {
              top: topValue,
              left: leftValue,
              transform: [{ scale: isHovered ? 1.2 : 1 }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleMarkerPress(marker.id)}
            onPressIn={() => setHoveredMarkerId(marker.id)}
            onPressOut={() => setHoveredMarkerId(null)}
            activeOpacity={0.8}
          >
            <View style={styles.markerImageContainer}>
              <View style={styles.svgWrapper}>
                {svgReady && (
                  <MarkerIcon
                    key={`svg-marker-${marker.id}-${mapKey}`}
                    width={80}
                    height={80}
                    fill={isHovered ? "#E30425" : "#000000"}
                  />
                )}
              </View>
              <Text style={styles.markerText}>{marker.name}</Text>
            </View>
            <View style={styles.markerArrow} />
          </TouchableOpacity>
        </View>
      );
    });
  };

  // Render map dengan error handling
  const renderMap = () => {
    if (isMobile) {
      return (
        <ScrollView horizontal key={`mobile-map-${mapKey}`}>
          <ScrollView>
            <View style={styles.mapContainer}>
              {svgReady && (
                <IndonesiaMap
                  key={`indonesia-map-mobile-${mapKey}`}
                  width={mapWidth}
                  height={mapHeight}
                  style={styles.mapImage}
                />
              )}
              {renderMarkers(mapWidth, mapHeight)}
            </View>
          </ScrollView>
        </ScrollView>
      );
    }

    const scale = screenWidth / mapWidth;
    const heightScaled = mapHeight * scale;

    return (
      <View
        key={`desktop-map-${mapKey}`}
        style={[
          styles.mapContainerFixed,
          { width: screenWidth, height: heightScaled },
        ]}
      >
        {svgReady && (
          <IndonesiaMap
            key={`indonesia-map-desktop-${mapKey}`}
            width={mapWidth}
            height={mapHeight}
            style={styles.mapImage}
          />
        )}
        {renderMarkers(screenWidth, heightScaled)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <StudentNavbar />

      {renderMap()}

      {selectedClass !== null && (
        <View style={styles.popup}>
          <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.popupTitle}>
            {classMarkers.find((marker) => marker.id === selectedClass)?.name}
          </Text>
          <Text style={styles.popupDescription}>
            {classMarkers.find((marker) => marker.id === selectedClass)?.description}
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigateToClassDetail(selectedClass)}
          >
            <Text style={styles.startButtonText}>Mulai Belajar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F4F1",
  },
  mapContainer: {
    width: mapWidth,
    height: mapHeight,
    position: "relative",
  },
  mapContainerFixed: {
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  markerContainer: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  markerImageContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 4,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  svgWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
    textAlign: "center",
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
    alignSelf: "center",
  },
  popup: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E30425",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  popupDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#E30425",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});