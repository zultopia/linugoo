import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from "react-native-vector-icons/Feather";
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from "react-native-toast-message";

const { width } = Dimensions.get('window');
const isSmallDevice = width < 768;

const ProfilePage = () => {
  const router = useRouter();
  // Define interfaces for the types
  interface CourseData {
    id: number;
    name: string;
    progress: number;
  }

  interface UserDataType {
    username: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
    role: string;
    joinDate: string;
    lastActive: string;
    language: string;
    courses: CourseData[];
  }

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserDataType>({
    username: '',
    name: '',
    email: '',
    phone: '',
    avatarUrl: null,
    role: 'Student',
    joinDate: '',
    lastActive: '',
    language: 'English',
    courses: []
  });

  interface FormDataType {
    name: string;
    email: string;
    phone: string;
  }

  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      const mockUserData: UserDataType = {
        username: 'marzuli',
        name: 'Marzuli Suhada',
        email: 'marzuli@example.com',
        phone: '08123456789',
        avatarUrl: null,
        role: 'Student',
        joinDate: 'April 5, 2025',
        lastActive: 'Today',
        language: 'English, Indonesian',
        courses: [
          { id: 1, name: 'Basic English Grammar', progress: 78 },
          { id: 2, name: 'Intermediate Vocabulary', progress: 45 },
          { id: 3, name: 'Conversational Spanish', progress: 12 },
        ]
      };

      setUserData(mockUserData);
      setFormData({
        name: mockUserData.name,
        email: mockUserData.email,
        phone: mockUserData.phone,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // This is where you would call your API to update the user profile
      // const response = await fetch(`http://localhost:5000/user/profile`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local user data
      setUserData(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }));

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Profile Updated',
        text2: 'Your profile has been successfully updated',
      });

      setIsEditing(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Update Failed',
        text2: 'There was an error updating your profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Call logout API
      // await fetch('http://localhost:5000/auth/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to login page
      router.replace('/(auth)/login');
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Logout Failed',
        text2: 'There was an error logging out',
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C70039" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Profile</Text>
          {!isEditing ? (
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Icon name="edit-2" size={20} color="#555" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            {userData.avatarUrl ? (
              <Image source={{ uri: userData.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>
                  {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
            )}
            
            <View style={styles.profileInfo}>
              {isEditing ? (
                <TextInput
                  style={styles.inputName}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Full Name"
                />
              ) : (
                <Text style={styles.userName}>{userData.name}</Text>
              )}
              <Text style={styles.userRole}>{userData.role}</Text>
              <View style={styles.usernameBadge}>
                <Text style={styles.usernameText}>@{userData.username}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon name="mail" size={18} color="#C70039" />
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.infoText}>{userData.email}</Text>
              )}
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon name="phone" size={18} color="#C70039" />
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>{userData.phone}</Text>
              )}
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon name="calendar" size={18} color="#C70039" />
              </View>
              <Text style={styles.infoText}>Joined {userData.joinDate}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon name="globe" size={18} color="#C70039" />
              </View>
              <Text style={styles.infoText}>Languages: {userData.language}</Text>
            </View>
          </View>
        </View>
        
        {/* Learning Progress */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          
          {userData.courses.map((course) => (
            <View key={course.id} style={styles.courseItem}>
              <Text style={styles.courseName}>{course.name}</Text>
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    {width: `${course.progress}%`}
                  ]}
                />
                <Text style={styles.progressText}>{course.progress}%</Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Courses</Text>
            <Icon name="chevron-right" size={16} color="#C70039" />
          </TouchableOpacity>
        </View>
        
        {/* Achievements */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          <View style={styles.achievementsGrid}>
            {/* Achievement Item */}
            <View style={styles.achievementItem}>
              <View style={styles.achievementBadge}>
                <MaterialIcons name="star" size={24} color="#FFD700" />
              </View>
              <Text style={styles.achievementName}>Level 1</Text>
              <Text style={styles.achievementDesc}>Completed first lesson</Text>
            </View>
            
            {/* Achievement Item */}
            <View style={styles.achievementItem}>
              <View style={styles.achievementBadge}>
                <MaterialIcons name="timer" size={24} color="#FFD700" />
              </View>
              <Text style={styles.achievementName}>Quick Learner</Text>
              <Text style={styles.achievementDesc}>Practice 5 days in a row</Text>
            </View>
            
            {/* Achievement Item (Locked) */}
            <View style={[styles.achievementItem, styles.lockedAchievement]}>
              <View style={[styles.achievementBadge, styles.lockedBadge]}>
                <MaterialIcons name="lock" size={24} color="#AAA" />
              </View>
              <Text style={styles.lockedText}>Vocabulary Master</Text>
              <Text style={styles.achievementDesc}>Learn 100 new words</Text>
            </View>
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color="#FFF" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.footerSpace} />
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  editButtonText: {
    marginLeft: 5,
    color: '#555',
    fontWeight: '500',
  },
  editActions: {
    flexDirection: 'row',
  },
  cancelButton: {
    padding: 8,
    marginRight: 10,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    color: '#555',
  },
  saveButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#C70039',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: isSmallDevice ? 'column' : 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: isSmallDevice ? 0 : 20,
    marginBottom: isSmallDevice ? 15 : 0,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C70039',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isSmallDevice ? 0 : 20,
    marginBottom: isSmallDevice ? 15 : 0,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileInfo: {
    flex: 1,
    alignItems: isSmallDevice ? 'center' : 'flex-start',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  usernameBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  usernameText: {
    fontSize: 13,
    color: '#555',
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  inputName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 8,
    width: '100%',
    marginBottom: 4,
  },
  infoInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 8,
    flex: 1,
    fontSize: 15,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  courseItem: {
    marginBottom: 15,
  },
  courseName: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#C70039',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    right: 10,
    top: 2,
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  viewAllText: {
    color: '#C70039',
    fontWeight: '500',
    marginRight: 5,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    width: '31%',
    alignItems: 'center',
    marginBottom: 10,
  },
  lockedAchievement: {
    opacity: 0.7,
  },
  achievementBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  lockedBadge: {
    backgroundColor: '#F0F0F0',
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  lockedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C70039',
    marginHorizontal: 16,
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footerSpace: {
    height: 50,
  },
});

export default ProfilePage;