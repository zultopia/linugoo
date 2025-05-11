import React from "react";
import { View, ScrollView, Dimensions, StyleSheet, Image } from "react-native";
// import MapBackgroundSvg from '../../assets/images/indonesia-map-bg.svg';

const mapWidth = 1750;
const mapHeight = 750;
const screenWidth = Dimensions.get("window").width;
const isMobile = screenWidth < 768;

interface Props {
  renderMarkers?: (width: number, height: number) => React.ReactNode;
}

export default function InteractiveMapBackground({ renderMarkers }: Props) {
  if (isMobile) {
    return (
      <ScrollView horizontal>
        <ScrollView>
          <View style={styles.mapContainer}>
            <Image
              source={require("../../../assets/images/indonesia-map-bg.svg")}
              style={styles.mapImage}
              resizeMode="cover"
            />
            {renderMarkers?.(mapWidth, mapHeight)}
          </View>
        </ScrollView>
      </ScrollView>
    );
  }

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
        source={require("../../../assets/images/indonesia-map-bg.svg")}
        style={styles.mapImage}
        resizeMode="cover"
      />
      {/* <SvgXml xml={MapBackgroundSvg} width="100%" height="100%" style={styles.mapImage} /> */}
      {renderMarkers?.(screenWidth, heightScaled)}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: mapWidth,
    height: mapHeight,
    position: "relative",
  },
  mapContainerFixed: {
    position: "relative",
  },
  mapImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
