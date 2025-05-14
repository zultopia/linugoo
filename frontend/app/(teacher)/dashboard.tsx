import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Dimensions, 
  Platform, 
  ActivityIndicator,
  useWindowDimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/navbar';

const { width: screenWidth } = Dimensions.get('window');

interface Student {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

const dummyData = {
  monthlyProgress: {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    datasets: [{
      data: [72, 75, 78, 82, 85, 88],
      color: (opacity = 1) => `rgba(199, 0, 57, ${opacity})`,
      strokeWidth: 2
    }]
  },
  literacyData: [
    {
      name: "Baca Tulis",
      value: 30,
      color: "#FF6384",
      legendFontColor: "#333",
      legendFontSize: 12
    },
    {
      name: "Numerasi",
      value: 25,
      color: "#36A2EB",
      legendFontColor: "#333",
      legendFontSize: 12
    },
    {
      name: "Sains",
      value: 15,
      color: "#FFCE56",
      legendFontColor: "#333",
      legendFontSize: 12
    },
    {
      name: "Digital",
      value: 20,
      color: "#4BC0C0",
      legendFontColor: "#333",
      legendFontSize: 12
    },
    {
      name: "Finansial",
      value: 10,
      color: "#9966FF",
      legendFontColor: "#333",
      legendFontSize: 12
    }
  ],
  weeklyActivity: {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum"],
    datasets: [{
      data: [25, 28, 26, 30, 22]
    }]
  }
};

const DashboardPage = () => {
  const router = useRouter();
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { width, height } = useWindowDimensions();
  
  const isSmallDevice = width < 768;
  const isMediumDevice = width >= 768 && width < 1024;
  const isLargeDevice = width >= 1024;
  
  const chartWidth = isSmallDevice ? width - 40 : isMediumDevice ? width - 60 : Math.min(width * 0.4, 600);
  const chartHeight = isSmallDevice ? 200 : 220;

  const chartConfig = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(199, 0, 57, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#C70039"
    }
  };

  useEffect(() => {
    if (!authLoading && user && user.role !== 'Guru') {
      router.replace('/(games)/base');
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.API_URL || 'http://192.168.1.105:5000'}/api/users/students`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudents();
  }, [token]);

  const handleNavigation = (route: string) => {
    if (route === 'profile') {
      router.push('/(tabs)/profile');
    } else if (route === 'jurnal') {
      router.push('/(teacher)/jurnal');
    } else if (route === 'data-siswa') {
      router.push('/(teacher)/data-siswa');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error saat logout:', error);
      router.replace('/(auth)/login');
    }
  };

  if (authLoading || (user && user.role !== 'Guru')) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C70039" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbar onNavigate={handleNavigation} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.backgroundPattern}>
          <View style={styles.backgroundContainer}>
            {[...Array(Math.ceil(height / 500))].map((_, index) => (
              <Image 
                key={index}
                source={require("../../assets/images/background.svg")}
                style={[styles.backgroundTile, { top: index * 500 }]}
                resizeMode="repeat"
              />
            ))}
          </View>
          
          <View style={[styles.contentContainer, { paddingHorizontal: isSmallDevice ? 20 : 40 }]}>
            <View style={styles.welcomeContainer}>
              <View style={[styles.welcomeCard, { width: isSmallDevice ? '100%' : '70%' }]}>
                <View style={styles.welcomeTextContainer}>
                  <Text style={styles.welcomeText}>Selamat Datang di</Text>
                  <Text style={styles.brandText}>linugoo</Text>
                </View>
                {user && (
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                      </Text>
                    </View>
                    <View style={styles.greetingContainer}>
                      <Text style={styles.greetingText}>Hai, {user.name || user.username}! 👋</Text>
                      <Text style={styles.roleText}>Guru Pengajar</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.cardsContainer, { 
              flexDirection: isSmallDevice ? 'column' : 'row',
              alignItems: isSmallDevice ? 'stretch' : 'center'
            }]}>
              <TouchableOpacity 
                style={[styles.cardJurnal, { 
                  width: isSmallDevice ? '100%' : '48%',
                  maxWidth: isLargeDevice ? 300 : undefined 
                }]}
                onPress={() => handleNavigation('jurnal')}
              >
                <View style={styles.cardIconPlaceholder}>
                  <Ionicons name="journal-outline" size={40} color="#FFFFFF" />
                </View>
                <Text style={styles.cardText}>Jurnal</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.cardSiswa, { 
                  width: isSmallDevice ? '100%' : '48%',
                  maxWidth: isLargeDevice ? 300 : undefined 
                }]}
                onPress={() => handleNavigation('data-siswa')}
              >
                <View style={styles.cardIconPlaceholder}>
                  <Ionicons name="people-outline" size={40} color="#FFFFFF" />
                </View>
                <Text style={styles.cardText}>Data Siswa</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.quickStatsContainer, {
              flexDirection: isSmallDevice ? 'column' : 'row',
              gap: isSmallDevice ? 10 : 20
            }]}>
              <View style={[styles.quickStatCard, { width: isSmallDevice ? '100%' : 'auto' }]}>
                <Ionicons name="school-outline" size={24} color="#C70039" />
                <Text style={styles.quickStatNumber}>{students.length}</Text>
                <Text style={styles.quickStatLabel}>Total Siswa</Text>
              </View>
              
              <View style={[styles.quickStatCard, { width: isSmallDevice ? '100%' : 'auto' }]}>
                <Ionicons name="book-outline" size={24} color="#4BC0C0" />
                <Text style={styles.quickStatNumber}>78%</Text>
                <Text style={styles.quickStatLabel}>Kemampuan Literasi</Text>
              </View>
              
              <View style={[styles.quickStatCard, { width: isSmallDevice ? '100%' : 'auto' }]}>
                <Ionicons name="calculator-outline" size={24} color="#FFCE56" />
                <Text style={styles.quickStatNumber}>82%</Text>
                <Text style={styles.quickStatLabel}>Kemampuan Numerasi</Text>
              </View>
            </View>

            <View style={[styles.chartsSection, {
              flexDirection: isLargeDevice ? 'row' : 'column',
              gap: 20,
              flexWrap: 'wrap'
            }]}>
              <View style={[styles.chartContainer, { 
                width: isLargeDevice ? '48%' : '100%' 
              }]}>
                <Text style={styles.chartTitle}>Progress Literasi & Numerasi</Text>
                <Text style={styles.chartSubtitle}>Perkembangan nilai rata-rata kelas dalam 6 bulan</Text>
                <LineChart
                  data={dummyData.monthlyProgress}
                  width={chartWidth}
                  height={chartHeight}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  withInnerLines={false}
                  withOuterLines={true}
                  withVerticalLabels={true}
                  withHorizontalLabels={true}
                  withDots={true}
                  withShadow={false}
                  fromZero={true}
                />
              </View>

              <View style={[styles.chartContainer, { 
                width: isLargeDevice ? '48%' : '100%' 
              }]}>
                <Text style={styles.chartTitle}>Distribusi Pembelajaran per Pulau</Text>
                <Text style={styles.chartSubtitle}>Progress siswa berdasarkan level pembelajaran</Text>
                <PieChart
                  data={dummyData.literacyData}
                  width={chartWidth}
                  height={chartHeight}
                  chartConfig={chartConfig}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft={isSmallDevice ? "0" : "15"}
                  style={styles.chart}
                />
              </View>

              <View style={[styles.chartContainer, { 
                width: isLargeDevice ? '48%' : '100%' 
              }]}>
                <Text style={styles.chartTitle}>Partisipasi Siswa</Text>
                <Text style={styles.chartSubtitle}>Jumlah siswa aktif dalam permainan edukatif</Text>
                <BarChart
                  data={dummyData.weeklyActivity}
                  width={chartWidth}
                  height={chartHeight}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    ...chartConfig,
                    barPercentage: 0.7,
                  }}
                  style={styles.chart}
                  showBarTops={true}
                  showValuesOnTopOfBars={true}
                  withInnerLines={true}
                  segments={5}
                />
              </View>
            </View>

            <View style={[styles.bottomSection, {
              flexDirection: isLargeDevice ? 'row' : 'column',
              gap: 20
            }]}>
              <View style={[styles.metricsContainer, { 
                width: isLargeDevice ? '58%' : '100%' 
              }]}>
                <Text style={styles.metricsTitle}>Capaian Pembelajaran Literasi & Numerasi</Text>
                
                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <Ionicons name="book" size={32} color="#4CAF50" />
                  </View>
                  <View style={styles.metricContent}>
                    <Text style={styles.metricValue}>134</Text>
                    <Text style={styles.metricLabel}>Buku Digital Dibaca</Text>
                    <Text style={styles.metricChange}>+15 buku minggu ini</Text>
                  </View>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <Ionicons name="calculator" size={32} color="#2196F3" />
                  </View>
                  <View style={styles.metricContent}>
                    <Text style={styles.metricValue}>256</Text>
                    <Text style={styles.metricLabel}>Soal Matematika Diselesaikan</Text>
                    <Text style={styles.metricChange}>Akurasi 85% (+3%)</Text>
                  </View>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <Ionicons name="trending-up" size={32} color="#FFC107" />
                  </View>
                  <View style={styles.metricContent}>
                    <Text style={styles.metricValue}>12</Text>
                    <Text style={styles.metricLabel}>Siswa Naik Level</Text>
                    <Text style={styles.metricChange}>Dari Sumatra ke Jawa</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.eventsContainer, { 
                width: isLargeDevice ? '38%' : '100%',
                marginTop: isSmallDevice ? 50 : 0
              }]}>
                <Text style={styles.eventsTitle}>Kegiatan Pembelajaran</Text>
                
                <View style={styles.eventCard}>
                  <View style={styles.eventDate}>
                    <Text style={styles.eventDay}>18</Text>
                    <Text style={styles.eventMonth}>DES</Text>
                  </View>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>Lomba Cerdas Cermat Literasi</Text>
                    <Text style={styles.eventTime}>09:00 - 11:00 WIB</Text>
                  </View>
                </View>

                <View style={styles.eventCard}>
                  <View style={styles.eventDate}>
                    <Text style={styles.eventDay}>22</Text>
                    <Text style={styles.eventMonth}>DES</Text>
                  </View>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>Festival Numerasi Nusantara</Text>
                    <Text style={styles.eventTime}>08:00 - 12:00 WIB</Text>
                  </View>
                </View>

                <View style={styles.eventCard}>
                  <View style={styles.eventDate}>
                    <Text style={styles.eventDay}>28</Text>
                    <Text style={styles.eventMonth}>DES</Text>
                  </View>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>Pameran Karya Literasi Siswa</Text>
                    <Text style={styles.eventTime}>10:00 - 15:00 WIB</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF5E0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5E0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  scrollView: {
    flex: 1,
  },
  backgroundPattern: {
    flex: 1,
    position: 'relative',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  backgroundTile: {
    position: 'absolute',
    width: '100%',
    height: 500,
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
    zIndex: 2,
    paddingVertical: 20,
  },
  welcomeContainer: {
    marginBottom: 30,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  welcomeTextContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#14213D',
    marginBottom: 5,
  },
  brandText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#C70039',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#C70039',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14213D',
  },
  roleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardsContainer: {
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  cardJurnal: {
    backgroundColor: '#14213D',
    borderRadius: 15,
    padding: 30,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  cardSiswa: {
    backgroundColor: '#C70039',
    borderRadius: 15,
    padding: 30,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  cardIconPlaceholder: {
    marginBottom: 15,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickStatsContainer: {
    marginBottom: 30,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  quickStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14213D',
    marginVertical: 5,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartsSection: {
    marginBottom: 30,
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  bottomSection: {
    marginBottom: 50,
  },
  metricsContainer: {
    flex: 1,
  },
  metricsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  metricCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  metricIcon: {
    marginRight: 15,
  },
  metricContent: {
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14213D',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  metricChange: {
    fontSize: 12,
    color: '#4CAF50',
  },
  eventsContainer: {
    flex: 1,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  eventDate: {
    backgroundColor: '#C70039',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    alignItems: 'center',
    width: 60,
  },
  eventDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  eventMonth: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default DashboardPage;