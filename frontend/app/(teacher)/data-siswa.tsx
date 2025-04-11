import React, { useState } from 'react';
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
} from 'react-native';
import { Svg, Circle, Text as SvgText, G } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

// Sample student data
const students = [
  { id: 1, name: "Andrea Hiputolon", selected: false },
  { id: 2, name: "Marzuli Suhada M", selected: true },
  { id: 3, name: "Ahmad Mudab", selected: false },
  { id: 4, name: "Arif Ribbad", selected: false },
  { id: 5, name: "Ahmad Arif", selected: false },
  { id: 6, name: "Sahida Marzilah", selected: false },
  { id: 7, name: "Qanita Marhada", selected: false },
  { id: 8, name: "Serenada Marzuli", selected: false },
  { id: 9, name: "Suhanada Cinta", selected: false },
  { id: 10, name: "Hirais Mas'udah", selected: false },
  { id: 11, name: "Zahifa Mudadah", selected: false },
];

// Sample literacy assessment data
const literacyData = [
  { type: "Baca", percentage: 80 },
  { type: "Numerasi", percentage: 92 },
  { type: "Sains", percentage: 65 },
  { type: "Finansial", percentage: 73 },
  { type: "Budaya", percentage: 80 },
];

// Sample progress data
const progressData = [
  { label: "Keamanan Internet", value: 83 },
  { label: "Netiket", value: 58 },
  { label: "Safe Browsing", value: 97 },
  { label: "Hoaks", value: 42 },
];

// Sample module data
const modules = Array(6).fill("Hoaks dan Informasi Palsu");
const files = Array(5).fill("Hoaks dan Informasi Palsu");

// Link Icon component
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

const DataSiswa = () => {
  // Untuk TypeScript, bisa menggunakan tipe any untuk sementara
  const navigation = useNavigation<any>();
  const [selectedClass, setSelectedClass] = useState("Kelas 5 - 5A");
  const [selectedStudent, setSelectedStudent] = useState(2); // Marzuli Suhada M
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);

  const toggleStudent = (id: number) => {
    setSelectedStudent(id);
  };

  const renderCircleProgress = ({ type, percentage }: { type: string, percentage: number }) => {
    const radius = 18;
    const strokeWidth = 3;
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;

    return (
      <View style={styles.circleProgressContainer}>
        <Svg height="100" width="100" viewBox="0 0 50 50">
          {/* Background Circle */}
          <Circle
            cx="25"
            cy="25"
            r={radius}
            stroke="#FFCCCC"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
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
            transform={`rotate(-90, 25, 25)`}
          />
          {/* Percentage Text */}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/lino.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoText}>linugoo</Text>
            <Text style={styles.logoSubtext}>untuk guru</Text>
          </View>
        </View>
        <View style={styles.navContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Jurnal' as never)}>
            <Text style={styles.navItemJurnal}>Jurnal</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DataSiswa' as never)}>
            <Text style={styles.navItemDataSiswa}>Data Siswa</Text>
          </TouchableOpacity>
          <View style={styles.profilePic} />
        </View>
      </View>
      
      <ScrollView style={styles.mainContent}>
        <View style={isTablet ? styles.contentTablet : styles.contentMobile}>
          {/* Left Panel - Class and Student Selection */}
          <View style={styles.leftPanel}>
            {/* Class Selector */}
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
                  <TouchableOpacity style={styles.dropdownItem}>
                    <Text>Kelas 5 - 5A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem}>
                    <Text>Kelas 5 - 5B</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem}>
                    <Text>Kelas 6 - 6A</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Class Info */}
            <View style={styles.classInfo}>
              <Text style={styles.classTitle}>Kelas 5 - 5A</Text>
              <Text style={styles.classDetail}>Jumlah Siswa: 20</Text>
              <Text style={styles.classDetail}>Link Masuk Kelas:</Text>
              <View style={styles.divider} />
            </View>

            {/* Student List */}
            <View style={styles.studentListContainer}>
              <View style={styles.studentListHeader}>
                <Text style={styles.studentListTitle}>Siswa Kelas</Text>
              </View>
              <FlatList
                data={students}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[
                      styles.studentItem, 
                      selectedStudent === item.id && styles.studentItemSelected
                    ]}
                    onPress={() => toggleStudent(item.id)}
                  >
                    <Text style={[
                      styles.studentName, 
                      selectedStudent === item.id && styles.studentNameSelected
                    ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.studentList}
              />
            </View>
          </View>

          {/* Right Panel - Student Data */}
          <View style={styles.rightPanel}>
            {/* Assessment History */}
            <Text style={styles.sectionTitle}>Sejarah Penilaian Literasi</Text>
            
            {/* Literacy Progress Circles */}
            <View style={styles.literacyProgressContainer}>
              {literacyData.map((item, index) => renderCircleProgress(item))}
            </View>

            {/* Digital Literacy Progress */}
            <View style={styles.literacyStatsContainer}>
              <View style={styles.progressContainer}>
                <Text style={styles.progressTitle}>Progress Literasi Digital</Text>
                <View style={styles.barChartContainer}>
                  {progressData.map((item, index) => (
                    <View key={index} style={styles.barChartColumn}>
                      <View style={[styles.bar, { height: `${item.value}%` }]} />
                      <Text style={styles.barLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Related Modules */}
              <View style={styles.modulesContainer}>
                <Text style={styles.modulesTitle}>Modul Terkait</Text>
                <ScrollView style={styles.modulesList}>
                  {modules.map((module, index) => (
                    <View key={index} style={styles.moduleItem}>
                      <LinkIcon />
                      <Text style={styles.moduleText}>{module}</Text>
                    </View>
                  ))}
                </ScrollView>
                
                <Text style={[styles.modulesTitle, styles.filesTitle]}>File Terkait</Text>
                <ScrollView style={styles.filesList}>
                  {files.map((file, index) => (
                    <View key={index} style={styles.fileItem}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoTextContainer: {
    marginLeft: 8,
  },
  logoText: {
    color: '#E30425',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#E30425',
    fontSize: 12,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItemJurnal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginRight: 24,
  },
  navItemDataSiswa: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E30425',
    marginRight: 24,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCCCCC',
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