export default {
    name: "Linugoo",
    slug: "linugoo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./frontend/assets/images/logo.svg",
    splash: {
      image: "./frontend/assets/images/background.svg",
      resizeMode: "contain",
      backgroundColor: "#3a7bd5"
    },
    android: {
      package: "com.linugoo.app",
      adaptiveIcon: {
        foregroundImage: "./frontend/assets/images/logo.svg",
        backgroundColor: "#3a7bd5"
      }
    },
    extra: {
      apiUrl: process.env.API_URL || "https://api.linugoo.com"
    }
  };