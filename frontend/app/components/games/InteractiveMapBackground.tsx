import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import IndonesiaMap from "../../../assets/images/indonesia-map-bg.svg";

interface Props {
  offsetX?: number;
  offsetY?: number;
  zoom?: number;
  width?: number;
  height?: number;
  mapWidth?: number;
  mapHeight?: number;
  renderMarkers?: (scaledWidth: number, scaledHeight: number) => React.ReactNode;
}

export default function InteractiveMapViewport({
  offsetX = 0,
  offsetY = 0,
  zoom = 1,
  width = Dimensions.get("window").width,
  height = Dimensions.get("window").height,
  mapWidth = 1000,
  mapHeight = 750,
  renderMarkers,
}: Props) {
  const scaledWidth = mapWidth * zoom;
  const scaledHeight = mapHeight * zoom;

  return (
    <View style={[styles.viewport, { width, height }]}>
      <View
        style={{
          width: scaledWidth,
          height: scaledHeight,
          transform: [
            { translateX: -offsetX * zoom },
            { translateY: -offsetY * zoom },
            { scale: zoom },
          ],
        }}
      >
        {/* <Image
          source={require("../../../assets/images/indonesia-map-bg.svg")}
          style={{ width: mapWidth, height: mapHeight, position: "absolute" }}
          resizeMode="cover"
        /> */}
        <IndonesiaMap
          width={mapWidth}
          height={mapHeight}
          style={{ position: "absolute" }}
        />
        {renderMarkers?.(scaledWidth, scaledHeight)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    overflow: "hidden",
    position: "relative",
  },
});
