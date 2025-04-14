"use client"

import { useState } from "react"
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native"

interface Marker {
  id: string
  x: number
  y: number
  active?: boolean
}

const windowWidth = Dimensions.get("window").width
const isMobile = windowWidth < 768

const IslandMap = ({
  classId,
  markers = [],
  onMarkerPress,
}: {
  classId: string
  markers?: Marker[]
  onMarkerPress?: (markerId: string) => void
}) => {
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 })

  const getTransformForClassId = (classId: string) => {
    switch (classId) {
      case "1": 
        return { scale: 2, translateX: 280, translateY: -20 }
      case "2": 
        return { scale: 2, translateX: -200, translateY: -200 }
      case "3": 
        return { scale: 2, translateX: 35, translateY: -200 }
      case "4": 
        return { scale: 3, translateX: -120, translateY: -40 }
      case "5": 
        return { scale: 2, translateX: -600, translateY: -350 }
      default:
        return { scale: 1, translateX: 0, translateY: 0 }
    }
  }

  const transform = getTransformForClassId(classId)

  // Handle container layout to get dimensions
  const onLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout
    setMapDimensions({ width, height })
  }

  return (
    <View style={styles.islandMapContainer} onLayout={onLayout}>
      {/* Peta background sebagai image */}
      <Image
        source={require("../../../assets/images/indonesia-map-bg.svg")}
        style={[
          styles.mapImage,
          {
            transform: [
              { scale: transform.scale },
              { translateX: transform.translateX },
              { translateY: transform.translateY },
            ],
          },
        ]}
        resizeMode="contain"
      />

      {/* Markers */}
      {markers.map((marker) => (
        <TouchableOpacity
          key={marker.id}
          style={[
            styles.marker,
            {
              left: marker.x,
              top: marker.y,
            },
          ]}
          onPress={() => onMarkerPress && onMarkerPress(marker.id)}
          activeOpacity={0.8}
        >
          <View style={[styles.markerOuter, marker.active ? styles.markerOuterActive : {}]}>
            <View style={[styles.markerInner, marker.active ? styles.markerInnerActive : {}]} />
          </View>
          {marker.active && (
            <Image source={require("@/assets/images/owl-wood.svg")} style={styles.owlMarker} resizeMode="contain" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  islandMapContainer: {
    width: isMobile ? "100%" : "60%",
    aspectRatio: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(225, 245, 245, 0.5)",
  },
  mapImage: {
    width: 1000, 
    height: 800,
    position: "absolute",
  },
  marker: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  markerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#CCCCCC",
  },
  markerOuterActive: {
    borderColor: "#E30425",
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#CCCCCC",
  },
  markerInnerActive: {
    backgroundColor: "#E30425",
  },
  owlMarker: {
    width: 40,
    height: 40,
    position: "absolute",
    bottom: 20,
    right: -10,
  },
})

export default IslandMap
