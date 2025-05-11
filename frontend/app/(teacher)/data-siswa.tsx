import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Svg, Circle, Text as SvgText, G } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Toast from "react-native-toast-message";
import Navbar from '../components/navbar';

const API_URL = process.env.API_URL || 'http://localhost:5000';

const LinkIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <G>
      <Circle cx="12" cy="12" r="10" fill="#F1F1F1" />
      <Circle cx="12" cy="12" r="8" fill="#FFFFFF" />
    </G>
  </Svg>
);

const windowWidth = Dimensions.get('window').width;
const isTablet = windowWidth >= 768;

const progressData = [
  { label: "Keamanan Internet", value: 83 },
  { label: "Netiket", value: 58 },
  { label: "Safe Browsing", value: 97 },
  { label: "Hoaks", value: 42 },
];

const literacyData = [
  { type: "Baca", percentage: 80 },
  { type: "Numerasi", percentage: 92 },
  { type: "Sains", percentage: 65 },
  { type: "Finansial", percentage: 73 },
  { type: "Budaya", percentage: 80 },
];

const modules = Array(6).fill("Hoaks dan Informasi Palsu");
const files = Array(5).fill("Hoaks dan Informasi Palsu");

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
}

const DataSiswa = () => {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const [selectedClass, setSelectedClass] = useState("Kelas 5 - 5A");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);
  
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
    console.log('Auth state:', { user, token, authLoading });
  }, [user, token, authLoading]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!token || !isMounted) {
        console.log('No token available or component unmounted');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log('Fetching from:', `${API_URL}/api/users/students`);
        
        const response = await fetch(`${API_URL}/api/users/students`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status); 
        
        if (!isMounted) return;
        
        const data = await response.json();
        console.log('Response data:', data); 
        
        if (response.ok) {
          let studentsList = [];
          
          if (data.students && Array.isArray(data.students)) {
            studentsList = data.students;
          } else if (Array.isArray(data)) {
            studentsList = data;
          } else if (data.data && Array.isArray(data.data)) {
            studentsList = data.data;
          }
          
          console.log('Students list:', studentsList); 
          
          if (isMounted) {
            setStudents(studentsList);
            
            if (studentsList.length > 0 && !selectedStudent) {
              const firstStudentId = studentsList[0].id || studentsList[0]._id;
              if (firstStudentId) {
                setSelectedStudent(firstStudentId);
              }
            }
          }
        } else {
          const errorMessage = data.message || 'Failed to fetch students';
          console.error('Error from server:', errorMessage);
          
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

  const toggleStudent = (id: string | undefined) => {
    if (id) {
      setSelectedStudent(id);
    }
  };

  const renderCircleProgress = ({ type, percentage }: { type: string, percentage: number }) => {
    const radius = 18;
    const strokeWidth = 3;
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;

    return (
      <View style={styles.circleProgressContainer}>
        <Svg height="100" width="100" viewBox="0 0 50 50">
          <Circle
            cx="25"
            cy="25"
            r={radius}
            stroke="#FFCCCC"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx="25"
            cy="25"
            r={radius}
            stroke="#FF5252"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            transform="rotate(-90, 25, 25)"
          />
          <SvgText
            x="25"
            y="25"
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="#333333"
          >
            {percentage}%
          </SvgText>
        </Svg>
        <Text style={styles.circleProgressType}>{type}</Text>
        <Text style={styles.circleProgressDetail}>detil penilaian</Text>
      </View>
    );
  };

  const handleNavigation = (route: string) => {
    try {
      if (route === 'profile') {
        router.push('/(tabs)/profile');
      } else if (route === 'jurnal') {
        router.push('/(teacher)/jurnal');
      } else if (route === 'data-siswa') {
        console.log('Already on data-siswa page');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Navbar onNavigate={handleNavigation} />
      
      <ScrollView style={styles.mainContent}>
        <View style={isTablet ? styles.contentTablet : styles.contentMobile}>
          <View style={styles.leftPanel}>
            <View style={styles.classSelectorContainer}>
              <TouchableOpacity 
                style={styles.classSelector}
                onPress={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
              >
                <Text style={styles.classSelectorText}>Pilih Kelas</Text>
                <Text style={styles.classSelectorArrow}>▼</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
              
              {isClassDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedClass('Kelas 5 - 5A');
                      setIsClassDropdownOpen(false);
                    }}
                  >
                    <Text>Kelas 5 - 5A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedClass('Kelas 5 - 5B');
                      setIsClassDropdownOpen(false);
                    }}
                  >
                    <Text>Kelas 5 - 5B</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedClass('Kelas 6 - 6A');
                      setIsClassDropdownOpen(false);
                    }}
                  >
                    <Text>Kelas 6 - 6A</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.classInfo}>
              <Text style={styles.classTitle}>{selectedClass}</Text>
              <Text style={styles.classDetail}>Jumlah Siswa: {students.length}</Text>
              <Text style={styles.classDetail}>Link Masuk Kelas:</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.studentListContainer}>
              <View style={styles.studentListHeader}>
                <Text style={styles.studentListTitle}>Siswa Kelas</Text>
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
                        selectedStudent === (item.id || item._id) && styles.studentItemSelected
                      ]}
                      onPress={() => toggleStudent(item.id || item._id)}
                    >
                      <Text style={[
                        styles.studentName, 
                        selectedStudent === (item.id || item._id) && styles.studentNameSelected
                      ]}>
                        {item.name || item.username || 'Unknown Student'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  style={styles.studentList}
                  ListEmptyComponent={
                    <Text style={styles.emptyListText}>
                      {students.length === 0 
                        ? "No students found. Add students through the admin panel."
                        : "Loading students..."}
                    </Text>
                  }
                />
              )}
            </View>
          </View>

          <View style={styles.rightPanel}>
            <Text style={styles.sectionTitle}>Sejarah Penilaian Literasi</Text>
            
            <View style={styles.literacyProgressContainer}>
              {literacyData.map((item, index) => (
                <React.Fragment key={`literacy-${index}`}>
                  {renderCircleProgress(item)}
                </React.Fragment>
              ))}
            </View>

            <View style={styles.literacyStatsContainer}>
              <View style={styles.progressContainer}>
                <Text style={styles.progressTitle}>Progress Literasi Digital</Text>
                <View style={styles.barChartContainer}>
                  {progressData.map((item, index) => (
                    <View key={`progress-${index}`} style={styles.barChartColumn}>
                      <View style={[styles.bar, { height: `${item.value}%` }]} />
                      <Text style={styles.barLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.modulesContainer}>
                <Text style={styles.modulesTitle}>Modul Terkait</Text>
                <ScrollView style={styles.modulesList}>
                  {modules.map((module, index) => (
                    <View key={`module-${index}`} style={styles.moduleItem}>
                      <LinkIcon />
                      <Text style={styles.moduleText}>{module}</Text>
                    </View>
                  ))}
                </ScrollView>
                
                <Text style={[styles.modulesTitle, styles.filesTitle]}>File Terkait</Text>
                <ScrollView style={styles.filesList}>
                  {files.map((file, index) => (
                    <View key={`file-${index}`} style={styles.fileItem}>
                      <LinkIcon />
                      <Text style={styles.fileText}>{file}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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
  },
  contentTablet: {
    flexDirection: 'row',
  },
  leftPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flex: isTablet ? 1 : undefined,
    marginRight: isTablet ? 16 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rightPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    flex: isTablet ? 2 : undefined,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  classSelectorContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  classSelector: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  classSelectorText: {
    fontWeight: '600',
    color: '#333333',
  },
  classSelectorArrow: {
    color: '#1A2B6D',
  },
  addButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#1A2B6D',
    borderRadius: 4,
    width: 40,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  classInfo: {
    marginBottom: 24,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  classDetail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginTop: 8,
  },
  studentListContainer: {
    flex: 1,
  },
  studentListHeader: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
    paddingVertical: 8,
    marginBottom: 8,
  },
  studentListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E30425',
    textAlign: 'center',
  },
  studentList: {
    flex: 1,
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
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  studentItemSelected: {
    backgroundColor: '#E30425',
  },
  studentName: {
    fontSize: 14,
    color: '#333333',
  },
  studentNameSelected: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E30425',
    marginBottom: 20,
  },
  literacyProgressContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  circleProgressContainer: {
    alignItems: 'center',
    width: '20%',
    marginBottom: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
  },
  circleProgressType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginTop: 4,
  },
  circleProgressDetail: {
    fontSize: 10,
    color: '#999999',
  },
  literacyStatsContainer: {
    flexDirection: isTablet ? 'row' : 'column',
  },
  progressContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 16,
    marginBottom: isTablet ? 0 : 16,
    marginRight: isTablet ? 16 : 0,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  barChartContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  barChartColumn: {
    alignItems: 'center',
    width: '22%',
  },
  bar: {
    width: '100%',
    backgroundColor: '#1A2B6D',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  modulesContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 16,
  },
  modulesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  filesTitle: {
    marginTop: 16,
  },
  modulesList: {
    maxHeight: 120,
  },
  filesList: {
    maxHeight: 100,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  fileText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
});

export default DataSiswa;