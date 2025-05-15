import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Linking,
  Platform
} from 'react-native';
import { Svg, Circle, Text as SvgText } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Toast from "react-native-toast-message";
import Navbar from '../components/navbar';
import { Ionicons } from '@expo/vector-icons';

const API_URL = process.env.API_URL || 'https://linugoo-production-e38a.up.railway.app';

const windowWidth = Dimensions.get('window').width;
const isTablet = windowWidth >= 768;

interface Student {
  id: string;
  _id?: string; 
  username: string;
  name: string;
  email: string;
  role: string;
  class?: string;
  grade?: string;
  profile_picture?: string;
  parent_phone?: string;
  literacy_progress?: {
    baca: number;
    numerasi: number;
    sains: number;
    digital: number;
    finansial: number;
  };
  digital_progress?: {
    membacaDigital: number;
    menulisTeks: number;
    berhitungDigital: number;
    mediaPembelajaran: number;
  };
  modules_completed?: string[];
  files_accessed?: string[];
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const CircularProgress = ({ percentage, size = 80, strokeWidth = 6, color = "#C70039" }: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - percentage) / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E5E5"
        strokeWidth={strokeWidth}
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={progress}
        strokeLinecap="round"
        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
      />
      <SvgText
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        alignmentBaseline="central"
        fontSize={size * 0.2}
        fontWeight="bold"
        fill={color}
      >
        {percentage}%
      </SvgText>
    </Svg>
  );
};

const DataSiswa = () => {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const [selectedClass, setSelectedClass] = useState("Kelas 5 - 5A");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);
  
  const dummyProgress = {
    literacy_progress: {
      baca: 85,
      numerasi: 78,
      sains: 65,
      digital: 90,
      finansial: 45
    },
    digital_progress: {
      membacaDigital: 88,
      menulisTeks: 75,
      berhitungDigital: 92,
      mediaPembelajaran: 60
    },
    modules_completed: [
      "Pulau Sumatra - Baca Tulis Dasar",
      "Pulau Jawa - Numerasi Lanjutan",
      "Pulau Kalimantan - Sains Alam",
      "Pulau Sulawesi - Literasi Digital"
    ],
    files_accessed: [
      "Materi Huruf Abjad.pdf",
      "Latihan Matematika Dasar.pdf",
      "Panduan Internet Aman.pdf",
      "Worksheet Sains.pdf"
    ]
  };

  const classOptions = [
    "Kelas 1 - 1A", "Kelas 1 - 1B",
    "Kelas 2 - 2A", "Kelas 2 - 2B",
    "Kelas 3 - 3A", "Kelas 3 - 3B",
    "Kelas 4 - 4A", "Kelas 4 - 4B",
    "Kelas 5 - 5A", "Kelas 5 - 5B",
    "Kelas 6 - 6A", "Kelas 6 - 6B"
  ];
  
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);
  
  useEffect(() => {
    if (!authLoading && user && user.role !== 'Guru') {
      router.replace('/(games)/base');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!token || !isMounted) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/users/students`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!isMounted) return;
        
        const data = await response.json();
        
        if (response.ok) {
          let studentsList = [];
          
          if (data.students && Array.isArray(data.students)) {
            studentsList = data.students;
          } else if (Array.isArray(data)) {
            studentsList = data;
          } else if (data.data && Array.isArray(data.data)) {
            studentsList = data.data;
          }
          
          studentsList = studentsList.map((student: Student) => ({
            ...student,
            ...dummyProgress,
            parent_phone: '+6285809859941' 
          }));
          
          if (isMounted) {
            setStudents(studentsList);
            
            if (studentsList.length > 0 && !selectedStudent) {
              setSelectedStudent(studentsList[0]);
            }
          }
        } else {
          const errorMessage = data.message || 'Failed to fetch students';
          if (isMounted) {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Error',
              text2: errorMessage,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        if (isMounted) {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Error',
            text2: 'Network error. Please check your connection.',
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    if (user?.role === 'Guru' && token) {
      fetchStudents();
    }
  }, [token, user, isMounted]);

  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleNavigation = (route: string) => {
    try {
      if (route === 'profile') {
        router.push('/(tabs)/profile');
      } else if (route === 'jurnal') {
        router.push('/(teacher)/jurnal');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const generateProgressReport = (student: Student) => {
    const literacyAvg = student.literacy_progress 
      ? Object.values(student.literacy_progress).reduce((a, b) => a + b, 0) / Object.values(student.literacy_progress).length 
      : 0;
    
    const digitalAvg = student.digital_progress
      ? Object.values(student.digital_progress).reduce((a, b) => a + b, 0) / Object.values(student.digital_progress).length
      : 0;

    let report = `*Laporan Progress Siswa*\n`;
    report += `Nama: ${student.name}\n`;
    report += `Kelas: ${selectedClass}\n`;
    report += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n\n`;
    
    report += `*Progress Literasi:*\n`;
    report += `• Kemampuan Baca: ${student.literacy_progress?.baca || 0}%\n`;
    report += `• Kemampuan Numerasi: ${student.literacy_progress?.numerasi || 0}%\n`;
    report += `• Kemampuan Sains: ${student.literacy_progress?.sains || 0}%\n`;
    report += `• Literasi Digital: ${student.literacy_progress?.digital || 0}%\n`;
    report += `• Literasi Finansial: ${student.literacy_progress?.finansial || 0}%\n`;
    report += `Rata-rata: ${literacyAvg.toFixed(1)}%\n\n`;
    
    report += `*Progress Literasi Digital:*\n`;
    report += `• Membaca Digital: ${student.digital_progress?.membacaDigital || 0}%\n`;
    report += `• Menulis Teks: ${student.digital_progress?.menulisTeks || 0}%\n`;
    report += `• Berhitung Digital: ${student.digital_progress?.berhitungDigital || 0}%\n`;
    report += `• Media Pembelajaran: ${student.digital_progress?.mediaPembelajaran || 0}%\n`;
    report += `Rata-rata: ${digitalAvg.toFixed(1)}%\n\n`;
    
    report += `*Modul yang Diselesaikan:*\n`;
    student.modules_completed?.forEach((module, index) => {
      report += `${index + 1}. ${module}\n`;
    });
    
    report += `\n*Materi yang Diakses:*\n`;
    student.files_accessed?.forEach((file, index) => {
      report += `${index + 1}. ${file}\n`;
    });
    
    report += `\n_Laporan ini dikirim melalui aplikasi Linugoo_`;
    
    return report;
  };

  const sendProgressToWhatsApp = () => {
    if (!selectedStudent) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Pilih siswa terlebih dahulu',
      });
      return;
    }

    const phoneNumber = selectedStudent.parent_phone || '+6281234567890';
    const message = generateProgressReport(selectedStudent);
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          const webWhatsAppUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          return Linking.openURL(webWhatsAppUrl);
        }
      })
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Tidak dapat membuka WhatsApp',
        });
      });
  };
  
  if (authLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C70039" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (user.role !== 'Guru') {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Unauthorized Access</Text>
      </View>
    );
  }

  // Rendering the progress cards using FlatList instead of ScrollView
  const renderProgressCards = () => {
    if (!selectedStudent || !selectedStudent.literacy_progress) return null;
    
    const progressData = Object.entries(selectedStudent.literacy_progress).map(([key, value]) => ({
      key,
      value
    }));
    
    // Render directly without FlatList to avoid nesting issues
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.progressCardsContainer}
      >
        {progressData.map(item => (
          <View key={item.key} style={styles.progressCard}>
            <CircularProgress percentage={item.value} size={80} color="#C70039" />
            <Text style={styles.progressCardTitle}>
              {item.key.charAt(0).toUpperCase() + item.key.slice(1)}
            </Text>
            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Detail</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  // Main layout - using View instead of ScrollView at the top level
  // Function to render the right panel content with proper structure to avoid nested VirtualizedLists
  const renderRightPanelContent = () => {
    if (!selectedStudent) {
      return (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="person-outline" size={64} color="#CCC" />
          <Text style={styles.emptyStateText}>Pilih siswa untuk melihat progress</Text>
        </View>
      );
    }

    // Instead of returning nested Flatlist components, we'll render items directly for modules and files
    const renderDigitalProgresses = () => {
      if (!selectedStudent.digital_progress) return null;
      
      return Object.entries(selectedStudent.digital_progress).map(([key, value]) => (
        <View key={key} style={styles.barContainer}>
          <Text style={styles.barValue}>{value}%</Text>
          <View style={styles.barWrapper}>
            <View 
              style={[
                styles.bar, 
                { 
                  height: (value / 100) * 160,
                  backgroundColor: value >= 80 ? '#4CAF50' : value >= 60 ? '#FFC107' : '#C70039'
                }
              ]} 
            />
          </View>
          <Text style={styles.barLabel}>
            {key === 'membacaDigital' ? 'Membaca\nDigital' :
             key === 'menulisTeks' ? 'Menulis\nTeks' :
             key === 'berhitungDigital' ? 'Berhitung\nDigital' :
             key === 'mediaPembelajaran' ? 'Media\nPembelajaran' :
             key.charAt(0).toUpperCase() + key.slice(1)}
          </Text>
        </View>
      ));
    };

    // Render modules directly instead of using FlatList
    const renderModulesDirectly = () => {
      if (!selectedStudent.modules_completed) return null;
      
      return selectedStudent.modules_completed.map((module, index) => (
        <View key={index} style={styles.moduleItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.moduleText}>{module}</Text>
        </View>
      ));
    };

    // Render files directly instead of using FlatList
    const renderFilesDirectly = () => {
      if (!selectedStudent.files_accessed) return null;
      
      return selectedStudent.files_accessed.map((file, index) => (
        <View key={index} style={styles.fileItem}>
          <Ionicons name="document-text" size={20} color="#2196F3" />
          <Text style={styles.fileText}>{file}</Text>
        </View>
      ));
    };

    // Structure using a single FlatList for the main content
    return (
      <FlatList
        data={[{ key: 'content' }]} // Single item to render everything in one pass
        renderItem={() => (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Progress Literasi - {selectedStudent.name}</Text>
              <TouchableOpacity 
                style={[
                  styles.whatsappButton,
                  !isTablet && styles.whatsappButtonMobile
                ]}
                onPress={sendProgressToWhatsApp}
              >
                <Ionicons name="logo-whatsapp" size={isTablet ? 20 : 18} color="#FFFFFF" />
                {windowWidth > 350 ? (
                  <Text style={[
                    styles.whatsappButtonText,
                    !isTablet && styles.whatsappButtonTextMobile
                  ]}>
                    {isTablet ? 'Kirim ke Orang Tua' : 'Kirim Rapor'}
                  </Text>
                ) : null}
              </TouchableOpacity>
            </View>
            
            {/* Progress Cards - Horizontal FlatList */}
            {renderProgressCards()}

            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>Progress Pembelajaran Digital</Text>
              
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.legendText}>Sangat Baik (≥80%)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
                  <Text style={styles.legendText}>Baik (60-79%)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#C70039' }]} />
                  <Text style={styles.legendText}>Perlu Peningkatan (&lt;60%)</Text>
                </View>
              </View>
              
              <View style={styles.barChartContainer}>
                {renderDigitalProgresses()}
              </View>
            </View>

            <View style={styles.modulesSection}>
              <View style={styles.moduleContainer}>
                <Text style={styles.moduleTitle}>Modul yang Diselesaikan</Text>
                <View style={styles.moduleList}>
                  {renderModulesDirectly()}
                </View>
              </View>

              <View style={styles.fileContainer}>
                <Text style={styles.fileTitle}>Materi yang Diakses</Text>
                <View style={styles.fileList}>
                  {renderFilesDirectly()}
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.rightPanelContent}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E0" />
      
      <Navbar onNavigate={handleNavigation} />
      
      <View style={styles.mainContent}>
        <View style={isTablet ? styles.contentTablet : styles.contentMobile}>
          <View style={styles.leftPanel}>
            <View style={styles.classSelectorContainer}>
              <TouchableOpacity 
                style={styles.classSelector}
                onPress={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
              >
                <Text style={styles.classSelectorText}>{selectedClass}</Text>
                <Ionicons 
                  name={isClassDropdownOpen ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#14213D" 
                />
              </TouchableOpacity>
              
              {isClassDropdownOpen && (
                <View style={styles.dropdownOverlay}>
                  <View style={styles.dropdownMenu}>
                    <FlatList
                      data={classOptions}
                      keyExtractor={(item, index) => `class-${index}`}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          style={[
                            styles.dropdownItem,
                            selectedClass === item && styles.dropdownItemSelected
                          ]}
                          onPress={() => {
                            setSelectedClass(item);
                            setIsClassDropdownOpen(false);
                          }}
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            selectedClass === item && styles.dropdownItemTextSelected
                          ]}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                      style={styles.dropdownScroll}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.classInfo}>
              <View style={styles.classInfoHeader}>
                <Ionicons name="school-outline" size={24} color="#C70039" />
                <Text style={styles.classTitle}>{selectedClass}</Text>
              </View>
              <View style={styles.classStats}>
                <View style={styles.statItem}>
                  <Ionicons name="people-outline" size={20} color="#14213D" />
                  <Text style={styles.statText}>{students.length} Siswa</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="analytics-outline" size={20} color="#14213D" />
                  <Text style={styles.statText}>78% Progress</Text>
                </View>
              </View>
            </View>

            <View style={styles.studentListContainer}>
              <View style={styles.studentListHeader}>
                <Text style={styles.studentListTitle}>Daftar Siswa</Text>
                <TouchableOpacity style={styles.addStudentButton}>
                  <Ionicons name="add-circle" size={24} color="#C70039" />
                </TouchableOpacity>
              </View>
              
              {isLoading ? (
                <ActivityIndicator style={styles.listLoader} color="#C70039" size="large" />
              ) : (
                <FlatList
                  data={students}
                  keyExtractor={(item) => item.id || item._id || String(item.username)}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.studentItem, 
                        selectedStudent?.id === item.id && styles.studentItemSelected
                      ]}
                      onPress={() => selectStudent(item)}
                    >
                      <View style={styles.studentAvatar}>
                        <Text style={styles.studentAvatarText}>
                          {item.name?.charAt(0) || item.username?.charAt(0) || '?'}
                        </Text>
                      </View>
                      <View style={styles.studentInfo}>
                        <Text style={[
                          styles.studentName, 
                          selectedStudent?.id === item.id && styles.studentNameSelected
                        ]}>
                          {item.name || item.username || 'Unknown Student'}
                        </Text>
                        <Text style={[
                          styles.studentDetail,
                          selectedStudent?.id === item.id && styles.studentDetailSelected
                        ]}>
                          Progress: {item.literacy_progress 
                            ? Math.round(Object.values(item.literacy_progress).reduce((a, b) => a + b, 0) / Object.values(item.literacy_progress).length)
                            : 0}%
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  style={styles.studentList}
                  ListEmptyComponent={
                    <Text style={styles.emptyListText}>
                      Belum ada siswa di kelas ini.
                    </Text>
                  }
                />
              )}
            </View>
          </View>

          <View style={styles.rightPanel}>
            {renderRightPanelContent()}
          </View>
        </View>
      </View>
      <Toast />
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
  mainContent: {
    flex: 1,
    padding: 16,
  },
  contentMobile: {
    flexDirection: 'column',
    height: '100%',
  },
  contentTablet: {
    flexDirection: 'row',
    height: '100%',
  },
  leftPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flex: isTablet ? 1 : undefined,
    marginRight: isTablet ? 16 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: isTablet ? '100%' : 500,
  },
  rightPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: isTablet ? 2.5 : undefined,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: isTablet ? '100%' : undefined,
  },
  rightPanelContent: {
    paddingBottom: 20,
  },
  classSelectorContainer: {
    position: 'relative',
    marginBottom: 16,
    zIndex: 100,
  },
  classSelector: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  classSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14213D',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#FFF0F5',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#C70039',
    fontWeight: '600',
  },
  classInfo: {
    marginBottom: 24,
  },
  classInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#14213D',
    marginLeft: 8,
  },
  classStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  studentListContainer: {
    flex: 1,
  },
  studentListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14213D',
  },
  addStudentButton: {
    padding: 4,
  },
  studentList: {
    maxHeight: isTablet ? 400 : 300,
  },
  listLoader: {
    marginTop: 20,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    padding: 20,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  studentItemSelected: {
    backgroundColor: '#FFF0F5',
    borderWidth: 1,
    borderColor: '#C70039',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  studentNameSelected: {
    color: '#C70039',
    fontWeight: '600',
  },
  studentDetail: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  studentDetailSelected: {
    color: '#C70039',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: 'bold',
    color: '#14213D',
    flex: 1,
    marginBottom: 5,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  whatsappButtonMobile: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  whatsappButtonTextMobile: {
    fontSize: 12,
    marginLeft: 4,
  },
  progressCardsContainer: {
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14213D',
    marginTop: 12,
    marginBottom: 8,
  },
  detailButton: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailButtonText: {
    color: '#C70039',
    fontSize: 12,
    fontWeight: '500',
  },
  chartSection: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14213D',
    marginBottom: 16,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 200,
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    justifyContent: 'flex-end',
    height: '100%',
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  barWrapper: {
    width: '80%',
    height: 160, 
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderRadius: 6,
    minHeight: 5,
  },
  barLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    height: 35,
    lineHeight: 14,
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  modulesSection: {
    flexDirection: isTablet ? 'row' : 'column',
    gap: 16,
  },
  moduleContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    height: 250,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14213D',
    marginBottom: 12,
  },
  moduleList: {
    height: 200,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  moduleText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  fileContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    height: 250,
  },
  fileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14213D',
    marginBottom: 12,
  },
  fileList: {
    height: 200,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fileText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default DataSiswa;