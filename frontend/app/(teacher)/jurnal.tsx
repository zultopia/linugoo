import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/navbar';
import { router } from 'expo-router';

const Jurnal = () => {
  const { width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(width < 768);
  const [activeTab, setActiveTab] = useState(0); // 0: Agenda, 1: Chat

  // Update isMobile when screen size changes
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);
  const [selectedTab, setSelectedTab] = useState('Week');
  const [selectedDay, setSelectedDay] = useState(4); // Wednesday is selected by default (index 4)
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: 'Halo, Aku Lino! 👋 Aku adalah personal assistantmu. Bagaimana aku bisa membantu?',
      isBot: true,
      timestamp: 'Wed 8:21 AM',
    },
    {
      id: 2,
      text: 'Bagaimana progress siswa sejauh ini?',
      isBot: false,
    },
    {
      id: 3,
      text: 'Bagaimana kurikulum terkini?',
      isBot: false,
    },
    {
      id: 4,
      text: 'Baiklah. Bagaimana dengan ini?',
      isBot: true,
    },
  ]);

  const days = [
    { day: 'SUN', date: '23', full: 'Sunday' },
    { day: 'MON', date: '24', full: 'Monday' },
    { day: 'TUE', date: '25', full: 'Tuesday' },
    { day: 'WED', date: '26', full: 'Wednesday' },
    { day: 'THU', date: '27', full: 'Thursday' },
    { day: 'FRI', date: '28', full: 'Friday' },
    { day: 'SAT', date: '1', full: 'Saturday' },
  ];

  const timeSlots = [
    { time: '07:00', events: [] },
    { 
      time: '08:00', 
      events: [
        { day: 1, title: 'Upacara Bendera', highlightColor: '#0EA5E9', color: '#DBEAF6', textColor: '#0369A1' }, 
      ] 
    },
    { 
      time: '09:00', 
      events: [
        { day: 3, title: 'Kelas Literasi', highlightColor: '#10B981', color: '#DCECEC', textColor: '#047857' }, 
      ] 
    },
    { 
      time: '10:00', 
      events: [
        { day: 5, title: 'Kelas Matematika', highlightColor: '#8B5CF6', color: '#DDD8EC', textColor: '#6D2869' },
      ] 
    },
    { time: '11:00', events: [] },
    { time: '12:00', events: [] },
    { time: '13:00', events: [] },
    { 
      time: '14:00', 
      events: [
        { day: 2, title: 'Evaluasi Harian', highlightColor: '#F59E0B', color: '#F2EAE0', textColor: '#B45309' }, 
      ] 
    },
  ];

  const handleNavigation = (route: string) => {
    if (route === 'profile') {
      router.push('/(tabs)/profile');
    } else if (route === 'jurnal') {
      router.push('/(teacher)/jurnal');
    } else if (route === 'data-siswa') {
      router.push('/(teacher)/data-siswa');
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          text: message,
          isBot: false,
        },
      ]);
      setMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: 'Saya telah mencatat permintaan Anda. Ada yang bisa saya bantu lagi?',
            isBot: true,
          },
        ]);
      }, 1000);
    }
  };

  const renderCalendarHeader = () => {
    return (
      <View style={styles.calendarHeader}>
        <View style={styles.calendarNavigation}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarTabsContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'Day' && styles.selectedTab]}
            onPress={() => setSelectedTab('Day')}
          >
            <Text style={[styles.tabText, selectedTab === 'Day' && styles.selectedTabText]}>Day</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'Week' && styles.selectedTab]}
            onPress={() => setSelectedTab('Week')}
          >
            <Text style={[styles.tabText, selectedTab === 'Week' && styles.selectedTabText]}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'Month' && styles.selectedTab]}
            onPress={() => setSelectedTab('Month')}
          >
            <Text style={[styles.tabText, selectedTab === 'Month' && styles.selectedTabText]}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'Year' && styles.selectedTab]}
            onPress={() => setSelectedTab('Year')}
          >
            <Text style={[styles.tabText, selectedTab === 'Year' && styles.selectedTabText]}>Year</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search" 
            placeholderTextColor="#999" 
          />
        </View>
      </View>
    );
  };

  const renderWeekCalendar = () => {
    return (
      <View style={styles.weekCalendar}>
        <View style={styles.dayHeadersRow}>
          {days.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.dayHeader, 
                selectedDay === index && styles.selectedDayHeader,
                index === 6 && { backgroundColor: '#c1123d' }, // Saturday is red
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[styles.dayText, (selectedDay === index || index === 6) && styles.selectedDayText]}>
                {item.day}
              </Text>
              <Text style={[styles.dateText, (selectedDay === index || index === 6) && styles.selectedDayText]}>
                {item.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.timelineContainer}>
          {timeSlots.map((slot, slotIndex) => (
            <View key={slotIndex} style={styles.timeSlot}>
              <Text style={styles.timeText}>{slot.time}</Text>
              <View style={styles.timeSlotRow}>
                {days.map((_, dayIndex) => {
                  const event = slot.events.find(e => e.day === dayIndex);
                  return (
                    <View 
                      key={dayIndex} 
                      style={[
                        styles.timeSlotCell,
                        event && { backgroundColor: event.color },
                        selectedDay === dayIndex && { backgroundColor: event ? event.color : '#F2F2F7' },
                      ]}
                    >
                      {event && (
                        <View style={[styles.eventContainer, event && { borderLeftColor: event.highlightColor }]}>
                          <Text style={[styles.eventTime, { color: event.textColor }]}>{slot.time}</Text>
                          <Text style={[styles.eventTitle, { color: event.textColor }]}>{event.title}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderChatSection = () => {
    return (
      <View style={styles.chatContainer}>
        {!isMobile && (
          <View style={styles.chatHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../../assets/images/lino.png')}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.chatTitle}>Tanya Lino Yuk!</Text>
          </View>
        )}

        <ScrollView style={styles.chatMessages}>
          {isMobile && (
            <Text style={styles.messageTimeHeader}>Wed 8:21 AM</Text>
          )}
          
          {chatMessages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.isBot ? styles.botMessageContainer : styles.userMessageContainer,
              ]}
            >
              {message.isBot && (
                <Image
                  source={require('../../assets/images/lino.png')}
                  style={styles.messageAvatar}
                />
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.isBot ? styles.botMessageBubble : styles.userMessageBubble,
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
                {message.timestamp && !isMobile && (
                  <Text style={styles.messageTime}>{message.timestamp}</Text>
                )}
              </View>
            </View>
          ))}

          {/* Quick action buttons */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Penyesuaian pembelajaran hari ini</Text>
            </TouchableOpacity>
            
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={[styles.smallActionButton, { backgroundColor: '#ffffff' }]}>
                <Text style={styles.smallActionText}>Literasi 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallActionButton, { backgroundColor: '#ffffff' }]}>
                <Text style={styles.smallActionText}>Berhitung</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallActionButton, { backgroundColor: '#ffffff' }]}>
                <Text style={styles.smallActionText}>Olahraga</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.micButtonInside}>
              <Ionicons name="mic-outline" size={20} color="#777" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  };

  // Render mobile-specific headers and tab navigation
  const renderMobileHeader = () => {
    if (activeTab === 0) { // Agenda tab
      return (
        <View style={styles.mobileHeader}>
          <View style={styles.agendaHeader}>
            <Text style={styles.agendaTitle}>Agenda Hari Ini</Text>
          </View>
        </View>
      );
    } else { // Chat tab
      return (
        <View style={styles.mobileHeader}>
          <View style={styles.chatHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../../assets/images/lino.png')}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.chatTitle}>Tanya Lino Yuk!</Text>
          </View>
        </View>
      );
    }
  };

  const renderMobileTabBar = () => {
    return (
      <View style={styles.mobileTabBar}>
        <TouchableOpacity 
          style={[styles.mobileTab, activeTab === 0 && styles.mobileTabActive]} 
          onPress={() => setActiveTab(0)}
        >
          <Ionicons 
            name="calendar" 
            size={24} 
            color={activeTab === 0 ? '#1a2d5e' : '#777'} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mobileTab, activeTab === 1 && styles.mobileTabActive]} 
          onPress={() => setActiveTab(1)}
        >
          <Ionicons 
            name="chatbubble-ellipses" 
            size={24} 
            color={activeTab === 1 ? '#1a2d5e' : '#777'} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {isMobile ? (
        // Mobile layout
        <>
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="menu" size={24} color="#c1123d" />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/lino.png')}
                style={styles.logoIcon}
                resizeMode="contain"
              />
            </View>
            
            <TouchableOpacity style={styles.profileContainer}>
              <View style={styles.profileImage}>
                <Ionicons name="person" size={24} color="#ccc" />
              </View>
            </TouchableOpacity>
          </View>

          {renderMobileHeader()}

          <View style={styles.mobileContent}>
            {activeTab === 0 ? (
              // Agenda/Calendar tab content
              <View style={styles.mobileSection}>
                <View style={styles.classScheduleContainer}>
                  <View style={styles.scheduleItem}>
                    <Text style={styles.scheduleTime}>10:00 - 11:00</Text>
                    <Text style={styles.scheduleText}>Belajar Perkalian Bab 3</Text>
                  </View>
                  <View style={styles.scheduleItem}>
                    <Text style={styles.scheduleTime}>10:00 - 11:00</Text>
                    <Text style={styles.scheduleText}>Belajar Perkalian Bab 3</Text>
                  </View>
                </View>

                {renderCalendarHeader()}
                {renderWeekCalendar()}
              </View>
            ) : (
              // Chat tab content
              <View style={styles.mobileSection}>
                {renderChatSection()}
              </View>
            )}
          </View>

          {renderMobileTabBar()}
        </>
      ) : (
        // Desktop layout
        <>
          <Navbar onNavigate={handleNavigation} />

          <View style={styles.content}>
            <View style={styles.leftSection}>
              {renderChatSection()}
            </View>

            <View style={styles.rightSection}>
              <View style={styles.agendaHeader}>
                <Text style={styles.agendaTitle}>Agenda Hari Ini</Text>
                <View style={styles.classScheduleContainer}>
                  <View style={styles.scheduleItem}>
                    <Text style={styles.scheduleTime}>10:00 - 11:00</Text>
                    <Text style={styles.scheduleText}>Belajar Perkalian Bab 3</Text>
                  </View>
                  <View style={styles.scheduleItem}>
                    <Text style={styles.scheduleTime}>10:00 - 11:00</Text>
                    <Text style={styles.scheduleText}>Belajar Perkalian Bab 3</Text>
                  </View>
                </View>
              </View>

              {renderCalendarHeader()}
              {renderWeekCalendar()}
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  logoTextContainer: {
    flexDirection: 'column',
  },
  logoText: {
    color: '#C70039',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#555555',
    fontSize: 12,
    marginTop: -5,
  },
  navContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  navItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navText: {
    fontSize: 18,
    color: '#333',
  },
  activeNav: {
    color: '#c1123d',
    fontWeight: 'bold',
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  // Desktop layout
  content: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 32,
  },
  leftSection: {
    width: '30%',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
  rightSection: {
    flex: 1,
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
  // Mobile layout
  mobileHeader: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  mobileContent: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mobileSection: {
    flex: 1,
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mobileTabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    height: 56,
  },
  mobileTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileTabActive: {
    borderTopWidth: 2,
    borderTopColor: '#1a2d5e',
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#1a2d5e',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  chatMessages: {
    flex: 1,
    padding: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  botMessageBubble: {
    backgroundColor: '#FFF3E0',
    borderBottomLeftRadius: 4,
  },
  userMessageBubble: {
    backgroundColor: '#F2F8FF',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#777',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  quickActionsContainer: {
    padding: 8,
    marginHorizontal: 32,
    backgroundColor: '#F2F8FF',
    borderRadius: 24,
  },
  actionButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#0070F0',
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  smallActionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  smallActionText: {
    color: '#72777A',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    fontSize: 14,
  },
  micButtonInside: {
    position: 'absolute',
    right: 8,
    height: '100%',
    justifyContent: 'center',
    padding: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a2d5e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agendaHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  agendaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  classScheduleContainer: {
    flexDirection: 'row',
    padding: 8,
    flexWrap: 'wrap',
  },
  scheduleItem: {
    flex: 1,
    backgroundColor: '#1a2d5e',
    borderRadius: 8,
    padding: 12,
    margin: 4,
    minWidth: 150,
  },
  scheduleTime: {
    color: 'white',
    fontSize: 12,
    marginBottom: 4,
  },
  scheduleText: {
    color: 'white',
    fontWeight: '500',
  },
  messageTimeHeader: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginVertical: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    padding: 8,
  },
  calendarNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  todayText: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  calendarTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  selectedTab: {
    backgroundColor: '#1a2d5e',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTabText: {
    color: 'white',
  },
  todayButton: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  todayButtonText: {
    fontSize: 14,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
  },
  weekCalendar: {
    flex: 1,
  },
  dayHeadersRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginLeft: 50,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  selectedDayHeader: {
    backgroundColor: '#1a2d5e',
  },
  dayText: {
    fontSize: 12,
    color: '#333',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDayText: {
    color: 'white',
  },
  timelineContainer: {
    flex: 1,
  },
  timeSlot: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  timeText: {
    width: 50,
    padding: 8,
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
  },
  timeSlotRow: {
    flex: 1,
    flexDirection: 'row',
  },
  timeSlotCell: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
    minHeight: 60,
  },
  eventContainer: {
    borderLeftWidth: 4,
    paddingHorizontal: 4,
    flex: 1,
  },
  eventTime: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});

export default Jurnal;