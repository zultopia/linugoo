"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import StudentNavbar from "../components/StudentsNavbar";

// Ukuran map tetap (relatif ke versi PNG)
const mapWidth = 1750;
const mapHeight = 750;

// Data marker
const classMarkers = [
  {
    id: 1,
    name: "Kelas 1",
    location: { topPercent: 25, leftPercent: 13 },
    image: require("../../assets/images/kelas1.svg"),
  },
  {
    id: 2,
    name: "Kelas 2",
    location: { topPercent: 59, leftPercent: 30 },
    image: require("../../assets/images/kelas2.svg"),
  },
  {
    id: 3,
    name: "Kelas 3",
    location: { topPercent: 12, leftPercent: 42 },
    image: require("../../assets/images/kelas3.svg"),
  },
  {
    id: 4,
    name: "Kelas 4-5",
    location: { topPercent: 48, leftPercent: 58 },
    image: require("../../assets/images/kelas4-5.svg"),
  },
  {
    id: 6,
    name: "Kelas 6",
    location: { topPercent: 22, leftPercent: 81 },
    image: require("../../assets/images/kelas6.svg"),
  },
];

export default function GameMapPage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);

  const isMobile = screenWidth < 768;

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

  const renderMarkers = (containerWidth: number, containerHeight: number) => {
    return classMarkers.map((marker) => {
      const topValue = (containerHeight * marker.location.topPercent) / 100;
      const leftValue = (containerWidth * marker.location.leftPercent) / 100;
      const isHovered = hoveredMarkerId === marker.id;

      return (
        <View
          key={marker.id}
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
            onAccessibilityTap={() => setHoveredMarkerId(null)}
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

  const renderMap = () => {
    if (isMobile) {
      return (
        <ScrollView horizontal>
          <ScrollView>
            <View style={styles.mapContainer}>
              <Image
                source={require("../../assets/images/indonesia-map-bg.svg")}
                style={styles.mapImage}
                resizeMode="cover"
              />
              {renderMarkers(mapWidth, mapHeight)}
            </View>
          </ScrollView>
        </ScrollView>
      );
    }

    // DESKTOP: auto-fit map within screen width
    const scale = screenWidth / mapWidth;
    const heightScaled = mapHeight * scale;

    return (
      <View
        style={[
          styles.mapContainerFixed,
          { width: screenWidth, height: heightScaled },
        ]}
      >
        <Image
          source={require("../../assets/images/indonesia-map-bg.svg")}
          style={styles.mapImage}
          resizeMode="contain"
        />
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
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.popupTitle}>
            {classMarkers.find((marker) => marker.id === selectedClass)?.name}
          </Text>
          <Text style={styles.popupDescription}>
            {selectedClass === 1 &&
              "Belajar membaca dan menulis dasar dengan tema kebudayaan Sumatra."}
            {selectedClass === 2 &&
              "Belajar numerasi dasar dengan tema kebudayaan Jawa, Bali, dan Nusa Tenggara."}
            {selectedClass === 3 &&
              "Belajar konsep sains dasar dengan tema kebudayaan Kalimantan."}
            {selectedClass === 4 &&
              "Belajar literasi digital dengan tema kebudayaan Sulawesi."}
            {selectedClass === 5 &&
              "Melanjutkan pembelajaran literasi digital dengan tema lanjutan."}
            {selectedClass === 6 &&
              "Belajar literasi finansial dengan tema kebudayaan Maluku dan Papua."}
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
  markerImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
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
