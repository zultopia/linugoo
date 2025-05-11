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
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/navbar';
import { router } from 'expo-router';

const colors = {
  primary: '#1a2d5e',
  secondary: '#c1123d',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#0EA5E9',
  purple: '#8B5CF6',
  lightBg: '#F5F5F5',
  white: '#FFFFFF',
  gray: '#777777',
  darkGray: '#333333',
  lightGray: '#E5E5E5',
};

type EventCategory = {
  color: string;
  highlightColor: string;
  textColor: string;
  icon: string;
};

type EventCategories = {
  [key: string]: EventCategory;
};

const eventCategories: EventCategories = {
  literasi: { color: '#DCECEC', highlightColor: '#10B981', textColor: '#047857', icon: 'book-outline' },
  matematika: { color: '#DDD8EC', highlightColor: '#8B5CF6', textColor: '#6D2869', icon: 'calculator-outline' },
  evaluasi: { color: '#F2EAE0', highlightColor: '#F59E0B', textColor: '#B45309', icon: 'clipboard-outline' },
  upacara: { color: '#DBEAF6', highlightColor: '#0EA5E9', textColor: '#0369A1', icon: 'flag-outline' },
  olahraga: { color: '#FFE4E1', highlightColor: '#FF6B6B', textColor: '#D63447', icon: 'fitness-outline' },
  sains: { color: '#E6F3FF', highlightColor: '#4B9CE2', textColor: '#1E5899', icon: 'flask-outline' },
};

interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface Event {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  description: string;
  date: string;
}

interface StudentProgress {
  [subject: string]: {
    average: number;
    needImprovement: string[];
  };
}

interface WeekDay {
  day: string;
  date: string;
  fullDate: string;
  fullDateObj: Date;
}

interface MonthDay {
  date: string;
  fullDate: string;
  fullDateObj: Date;
  isToday: boolean;
}

const Jurnal = () => {
  const { width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(width < 768);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTab, setSelectedTab] = useState('Week');
  const [selectedDay, setSelectedDay] = useState(4);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1)); 
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2025, 0, 24));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: 'Halo! Saya Lino, asisten AI untuk kurikulum dinamis. Saya akan membantu Anda menyesuaikan materi pembelajaran berdasarkan progress siswa dan panduan Kemdikbud. 🎓\n\nBeberapa hal yang bisa saya bantu:\n• Rekomendasi materi pembelajaran\n• Evaluasi progress siswa\n• Penyesuaian kurikulum',
      isBot: true,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({
    '2025-01-26': [
      {
        id: 1,
        title: 'Literasi Pagi',
        startTime: '08:00',
        endTime: '09:00',
        category: 'literasi',
        description: 'Membaca nyaring dan pemahaman bacaan',
        date: '2025-01-27'
      },
      {
        id: 2,
        title: 'Matematika',
        startTime: '09:00',
        endTime: '11:00',
        category: 'matematika',
        description: 'Perkalian dan pembagian',
        date: '2025-01-27'
      }
    ],
    '2025-01-27': [
      {
        id: 3,
        title: 'Istirahat & Olahraga',
        startTime: '11:00',
        endTime: '12:00',
        category: 'olahraga',
        description: 'Senam ringan dan permainan',
        date: '2025-01-27'
      },
      {
        id: 4,
        title: 'Sains',
        startTime: '13:00',
        endTime: '14:00',
        category: 'sains',
        description: 'Eksperimen sederhana tentang air',
        date: '2025-01-27'
      }
    ],
    '2025-01-28': [
      {
        id: 5,
        title: 'Upacara Bendera',
        startTime: '07:00',
        endTime: '08:00',
        category: 'upacara',
        description: 'Upacara bendera mingguan',
        date: '2025-01-28'
      },
      {
        id: 6,
        title: 'Evaluasi Mingguan',
        startTime: '10:00',
        endTime: '11:00',
        category: 'evaluasi',
        description: 'Tes pemahaman materi minggu ini',
        date: '2025-01-28'
      }
    ]
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ date: string; startTime: string; endTime?: string } | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('literasi');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [selectingEndTime, setSelectingEndTime] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentMonth.getFullYear());
  
  const [studentProgress] = useState<StudentProgress>({
    literasi: { average: 75, needImprovement: ['membaca pemahaman', 'menulis kreatif'] },
    matematika: { average: 68, needImprovement: ['perkalian', 'pembagian'] },
    sains: { average: 82, needImprovement: ['eksperimen'] },
  });

  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);

  const callGeminiAI = async (prompt: string, context: StudentProgress): Promise<string> => {
    return simulateAIResponse(prompt, context);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages([...chatMessages, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await callGeminiAI(message, studentProgress);
      
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        text: aiResponse,
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = (userMessage: string, progress: StudentProgress): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = '';
        
        if (userMessage.toLowerCase().includes('progress') || userMessage.toLowerCase().includes('evaluasi')) {
          response = `Berdasarkan data terkini, berikut adalah evaluasi progress siswa:\n\n` +
            `📚 Literasi: ${progress.literasi.average}%\n` +
            `   Perlu ditingkatkan: ${progress.literasi.needImprovement.join(', ')}\n\n` +
            `🔢 Matematika: ${progress.matematika.average}%\n` +
            `   Perlu ditingkatkan: ${progress.matematika.needImprovement.join(', ')}\n\n` +
            `🔬 Sains: ${progress.sains.average}%\n` +
            `   Perlu ditingkatkan: ${progress.sains.needImprovement.join(', ')}\n\n` +
            `Rekomendasi: Fokus pada materi ${progress.matematika.needImprovement[0]} untuk matematika, dan ${progress.literasi.needImprovement[0]} untuk literasi.`;
        } else if (userMessage.toLowerCase().includes('kurikulum') || userMessage.toLowerCase().includes('materi')) {
          response = `Berdasarkan analisis progress siswa dan kurikulum Kemdikbud, saya merekomendasikan:\n\n` +
            `1. Literasi: Tambahkan latihan membaca pemahaman dengan teks naratif dan deskriptif\n` +
            `2. Matematika: Gunakan metode visual untuk mengajarkan perkalian\n` +
            `3. Sains: Integrasikan eksperimen sederhana dalam pembelajaran\n\n` +
            `Pendekatan ini sesuai dengan Kurikulum Merdeka yang menekankan pembelajaran berbasis proyek dan pemahaman konsep.`;
        } else if (userMessage.toLowerCase().includes('penyesuaian') || userMessage.toLowerCase().includes('adaptasi')) {
          response = `Untuk penyesuaian pembelajaran hari ini, saya sarankan:\n\n` +
            `🌅 Pagi (08:00-10:00): Literasi dengan fokus membaca pemahaman\n` +
            `🌞 Siang (10:00-12:00): Matematika dengan permainan perkalian interaktif\n` +
            `🌄 Sore (13:00-14:00): Review dan evaluasi harian\n\n` +
            `Metode ini akan membantu siswa yang masih lemah di area tertentu sambil mempertahankan progress siswa yang sudah baik.`;
        } else {
          response = `Saya memahami pertanyaan Anda. Berdasarkan data progress siswa dan panduan Kemdikbud, ` +
            `saya dapat memberikan rekomendasi yang lebih spesifik. Apa yang ingin Anda ketahui lebih lanjut? ` +
            `Misalnya tentang evaluasi progress, penyesuaian kurikulum, atau rekomendasi materi pembelajaran?`;
        }
        
        resolve(response);
      }, 1500); 
    });
  };

  const getDaysInWeek = (startDate: Date): WeekDay[] => {
    const days: WeekDay[] = [];
    const dayNames = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      days.push({
        day: dayNames[date.getDay()],
        date: date.getDate().toString(),
        fullDate: date.toISOString().split('T')[0],
        fullDateObj: date
      });
    }
    
    return days;
  };

  const getDaysInMonth = (): (MonthDay | null)[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (MonthDay | null)[] = [];

    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let date = 1; date <= lastDay.getDate(); date++) {
      const currentDate = new Date(year, month, date);
      days.push({
        date: date.toString(),
        fullDate: currentDate.toISOString().split('T')[0],
        fullDateObj: currentDate,
        isToday: currentDate.toDateString() === new Date().toDateString()
      });
    }
    
    return days;
  };

  const getMonthYearString = () => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentDisplay = selectedTab === 'Week' ? currentWeekStart : currentMonth;
    return `${months[currentDisplay.getMonth()]} ${currentDisplay.getFullYear()}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
    setSelectedMonth(newMonth.getMonth());
    setSelectedYear(newMonth.getFullYear());
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    if (direction === 'prev') {
      newWeekStart.setDate(currentWeekStart.getDate() - 7);
    } else {
      newWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    setCurrentWeekStart(newWeekStart);
    
    const weekMiddle = new Date(newWeekStart);
    weekMiddle.setDate(newWeekStart.getDate() + 3);
    setCurrentMonth(new Date(weekMiddle.getFullYear(), weekMiddle.getMonth(), 1));
  };

  const weekDays = selectedTab === 'Week' ? getDaysInWeek(currentWeekStart) : [];
  const monthDays = selectedTab === 'Month' ? getDaysInMonth() : [];

  const handleCellPress = (date: string, time: string) => {
    if (!selectingEndTime) {
      setSelectedCell({ date, startTime: time });
      setSelectingEndTime(true);
    } else {
      const startHour = parseInt(selectedCell!.startTime.split(':')[0]);
      const endHour = parseInt(time.split(':')[0]);
      
      if (selectedCell!.date === date && endHour > startHour) {
        setSelectedCell({
          ...selectedCell!,
          endTime: time
        });
        setShowEventModal(true);
        setSelectingEndTime(false);
      } else {
        // Reset if invalid selection
        setSelectedCell(null);
        setSelectingEndTime(false);
      }
    }
  };

  const addEvent = () => {
    if (!newEventTitle.trim() || !selectedCell || !selectedCell.endTime) return;

    const newEvent: Event = {
      id: Date.now(),
      title: newEventTitle,
      startTime: selectedCell.startTime,
      endTime: selectedCell.endTime,
      category: newEventCategory,
      description: newEventDescription,
      date: selectedCell.date,
    };

    setEvents(prev => ({
      ...prev,
      [selectedCell.date]: [...(prev[selectedCell.date] || []), newEvent],
    }));

    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventCategory('literasi');
    setSelectedCell(null);
    setShowEventModal(false);
  };

  const renderTimeSlots = () => {
    const timeSlots = [];
    
    for (let hour = 7; hour <= 15; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const slotsForTime: { dayIndex: number; date: string; event?: Event }[] = [];

      weekDays.forEach((day, dayIndex) => {
        const dayEvents = events[day.fullDate] || [];
        const eventsAtTime = dayEvents.filter((e: Event) => {
          const startHour = parseInt(e.startTime.split(':')[0]);
          const endHour = parseInt(e.endTime.split(':')[0]);
          const currentHour = parseInt(time.split(':')[0]);
          return currentHour >= startHour && currentHour < endHour;
        });
        
        slotsForTime.push({ 
          dayIndex, 
          date: day.fullDate,
          event: eventsAtTime[0] 
        });
      });

      timeSlots.push({ time, slots: slotsForTime });
    }
    return timeSlots;
  };

  const renderEventModal = () => (
    <Modal
      visible={showEventModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setShowEventModal(false);
        setSelectedCell(null);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tambah Jadwal</Text>
            <TouchableOpacity onPress={() => {
              setShowEventModal(false);
              setSelectedCell(null);
            }}>
              <Ionicons name="close" size={24} color={colors.darkGray} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Judul Kegiatan</Text>
            <TextInput
              style={styles.modalInput}
              value={newEventTitle}
              onChangeText={setNewEventTitle}
              placeholder="Contoh: Kelas Literasi"
              placeholderTextColor={colors.gray}
            />

            <Text style={styles.inputLabel}>Waktu</Text>
            <View style={styles.timeRangeContainer}>
              <View style={styles.timeBox}>
                <Text style={styles.timeRangeLabel}>Mulai</Text>
                <Text style={styles.timeValue}>{selectedCell?.startTime}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={colors.gray} />
              <View style={styles.timeBox}>
                <Text style={styles.timeRangeLabel}>Selesai</Text>
                <Text style={styles.timeValue}>{selectedCell?.endTime}</Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>Kategori</Text>
            <View style={styles.categoryContainer}>
              {Object.entries(eventCategories).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: value.color },
                    newEventCategory === key && styles.categoryButtonSelected
                  ]}
                  onPress={() => setNewEventCategory(key)}
                >
                  <Ionicons name={value.icon as any} size={20} color={value.textColor} />
                  <Text style={[styles.categoryButtonText, { color: value.textColor }]}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Deskripsi (Opsional)</Text>
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              value={newEventDescription}
              onChangeText={setNewEventDescription}
              placeholder="Tambahkan deskripsi kegiatan..."
              placeholderTextColor={colors.gray}
              multiline={true}
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setShowEventModal(false);
                setSelectedCell(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={addEvent}
            >
              <Text style={styles.submitButtonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderMonthPickerModal = () => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

    return (
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.monthPickerModal}>
            <View style={styles.monthPickerHeader}>
              <Text style={styles.monthPickerTitle}>Pilih Bulan & Tahun</Text>
              <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                <Ionicons name="close" size={24} color={colors.darkGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.monthPickerContent}>
              <View style={styles.monthGrid}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthOption,
                      selectedMonth === index && styles.monthOptionSelected
                    ]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    <Text style={[
                      styles.monthOptionText,
                      selectedMonth === index && styles.monthOptionTextSelected
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.yearPicker}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.yearOption,
                        selectedYear === year && styles.yearOptionSelected
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text style={[
                        styles.yearOptionText,
                        selectedYear === year && styles.yearOptionTextSelected
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.monthPickerFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowMonthPicker(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={() => {
                  const newDate = new Date(selectedYear, selectedMonth, 1);
                  setCurrentMonth(newDate);
                  if (selectedTab === 'Week') {
                    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
                    const dayOfWeek = firstDayOfMonth.getDay();
                    const firstSunday = new Date(firstDayOfMonth);
                    firstSunday.setDate(1 - dayOfWeek);
                    setCurrentWeekStart(firstSunday);
                  }
                  setShowMonthPicker(false);
                }}
              >
                <Text style={styles.submitButtonText}>Pilih</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderChatSection = () => (
    <View style={[styles.chatContainer, isMobile && styles.chatContainerMobile]}>
      <View style={styles.chatHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/images/lino.png')}
            style={styles.avatar}
          />
        </View>
        <View style={styles.chatTitleContainer}>
          <Text style={styles.chatTitle}>Tanya Lino Yuk!</Text>
          <Text style={styles.chatSubtitle}>Siap membantu Anda 24/7 ✨</Text>
        </View>
      </View>

      <ScrollView
        style={styles.chatMessages}
        contentContainerStyle={styles.chatMessagesContent}
        ref={ref => { if (ref) ref.scrollToEnd({ animated: true }); }}
      >
        {chatMessages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageContainer,
              msg.isBot ? styles.botMessageContainer : styles.userMessageContainer,
            ]}
          >
            {msg.isBot && (
              <Image
                source={require('../../assets/images/lino.png')}
                style={styles.messageAvatar}
              />
            )}
            <View
              style={[
                styles.messageBubble,
                msg.isBot ? styles.botMessageBubble : styles.userMessageBubble,
              ]}
            >
              <Text style={[
                styles.messageText,
                !msg.isBot && styles.userMessageText
              ]}>
                {msg.text}
              </Text>
              <Text style={[
                styles.messageTime,
                !msg.isBot && styles.userMessageTime
              ]}>
                {msg.timestamp}
              </Text>
            </View>
          </View>
        ))}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Lino sedang berpikir...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.quickActions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setMessage('Bagaimana progress siswa saat ini?')}
          >
            <Ionicons name="analytics" size={16} color={colors.primary} />
            <Text style={styles.quickActionText}>Evaluasi Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setMessage('Berikan rekomendasi materi pembelajaran')}
          >
            <Ionicons name="bulb" size={16} color={colors.primary} />
            <Text style={styles.quickActionText}>Rekomendasi Materi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setMessage('Bagaimana penyesuaian pembelajaran hari ini?')}
          >
            <Ionicons name="calendar" size={16} color={colors.primary} />
            <Text style={styles.quickActionText}>Penyesuaian Harian</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Tanya tentang kurikulum, progress siswa..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor={colors.gray}
            multiline
          />
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic-outline" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Ionicons name="send" size={20} color={colors.white} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );

  const renderCalendarSection = () => (
    <View style={[styles.calendarSection, isMobile && styles.calendarSectionMobile]}>
      <View style={styles.calendarHeader}>
        <View style={styles.monthNavigation}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => selectedTab === 'Week' ? navigateWeek('prev') : navigateMonth('prev')}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMonthPicker(true)} style={styles.monthButton}>
            <Text style={styles.monthText}>{getMonthYearString()}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.primary} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => selectedTab === 'Week' ? navigateWeek('next') : navigateMonth('next')}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.viewToggle}>
          {['Week', 'Month'].map((view) => (
            <TouchableOpacity
              key={view}
              style={[styles.viewButton, selectedTab === view && styles.viewButtonActive]}
              onPress={() => setSelectedTab(view)}
            >
              <Text style={[styles.viewButtonText, selectedTab === view && styles.viewButtonTextActive]}>
                {view === 'Week' ? 'Minggu' : 'Bulan'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedTab === 'Week' ? (
        <>
          <View style={styles.daysHeader}>
            {weekDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayColumn,
                  selectedDay === index && styles.dayColumnSelected,
                  day.fullDateObj.getDay() === 0 && styles.sundayColumn,
                ]}
                onPress={() => setSelectedDay(index)}
              >
                <Text style={[
                  styles.dayName,
                  selectedDay === index && styles.dayNameSelected,
                  day.fullDateObj.getDay() === 0 && styles.sundayText,
                ]}>
                  {day.day}
                </Text>
                <Text style={[
                  styles.dayDate,
                  selectedDay === index && styles.dayDateSelected,
                  day.fullDateObj.getDay() === 0 && styles.sundayText,
                ]}>
                  {day.date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.timeSlotContainer}>
            {renderTimeSlots().map((slot, index) => (
              <View key={index} style={styles.timeSlotRow}>
                <Text style={styles.timeLabel}>{slot.time}</Text>
                <View style={styles.eventSlotsRow}>
                  {slot.slots.map((slotData, slotIndex) => (
                    <TouchableOpacity
                      key={slotIndex}
                      style={[
                        styles.eventSlot,
                        selectedDay === slotData.dayIndex && styles.eventSlotSelected,
                        selectingEndTime && selectedCell?.date === slotData.date && 
                        parseInt(slot.time.split(':')[0]) >= parseInt(selectedCell.startTime.split(':')[0]) &&
                        styles.eventSlotHighlight
                      ]}
                      onPress={() => handleCellPress(slotData.date, slot.time)}
                    >
                      {slotData.event && (
                        <View
                          style={[
                            styles.eventCard,
                            {
                              backgroundColor: eventCategories[slotData.event.category]?.color || '#FFFFFF',
                              borderLeftColor: eventCategories[slotData.event.category]?.highlightColor || '#000000',
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.eventTitle,
                              { color: eventCategories[slotData.event.category]?.textColor || '#000000' }
                            ]}
                            numberOfLines={1}
                          >
                            {slotData.event.title}
                          </Text>
                          <Text
                            style={[
                              styles.eventTime,
                              { color: eventCategories[slotData.event.category]?.textColor || '#000000' }
                            ]}
                          >
                            {slotData.event.startTime} - {slotData.event.endTime}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={styles.monthViewContainer}>
          <View style={styles.monthDaysHeader}>
            {['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map((day, index) => (
              <View key={index} style={styles.monthDayHeader}>
                <Text style={[
                  styles.monthDayHeaderText,
                  index === 0 && styles.sundayText
                ]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.monthGrid}>
            {monthDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthDay,
                  day?.isToday && styles.monthDayToday,
                  day?.fullDateObj?.getDay() === 0 && styles.monthDaySunday,
                ]}
                onPress={() => day && console.log('Selected date:', day.fullDate)}
              >
                {day && (
                  <>
                    <Text style={[
                      styles.monthDayText,
                      day.isToday && styles.monthDayTodayText,
                      day.fullDateObj.getDay() === 0 && styles.sundayText,
                    ]}>
                      {day.date}
                    </Text>
                    {events[day.fullDate] && events[day.fullDate].length > 0 && (
                      <View style={styles.monthDayEventIndicator}>
                        <View style={styles.monthDayEventDot} />
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {selectingEndTime && (
        <View style={styles.selectionHint}>
          <Text style={styles.selectionHintText}>
            Klik jam selesai untuk agenda yang dimulai jam {selectedCell?.startTime}
          </Text>
        </View>
      )}

    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isMobile && styles.mobileContainer]}>
      <StatusBar style="auto" />
      
      {isMobile ? (
        <>
          <Navbar />

          <View style={styles.mobileContent}>
            {activeTab === 0 ? renderCalendarSection() : renderChatSection()}
          </View>

          <View style={styles.mobileTabBar}>
            <TouchableOpacity
              style={[styles.mobileTab, activeTab === 0 && styles.mobileTabActive]}
              onPress={() => setActiveTab(0)}
            >
              <Ionicons
                name="calendar"
                size={24}
                color={activeTab === 0 ? colors.primary : colors.gray}
              />
              <Text style={[styles.mobileTabText, activeTab === 0 && styles.mobileTabTextActive]}>
                Kalender
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mobileTab, activeTab === 1 && styles.mobileTabActive]}
              onPress={() => setActiveTab(1)}
            >
              <Ionicons
                name="chatbubbles"
                size={24}
                color={activeTab === 1 ? colors.primary : colors.gray}
              />
              <Text style={[styles.mobileTabText, activeTab === 1 && styles.mobileTabTextActive]}>
                AI Chat
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Navbar onNavigate={(route) => {
            if (route === 'jurnal') {
              router.push('/(teacher)/jurnal');
            } else if (route === 'data-siswa') {
              router.push('/(teacher)/data-siswa');
            } else if (route === 'profile') {
              router.push('/(tabs)/profile');
            }
          }} />
          
          <View style={styles.desktopContent}>
            <View style={styles.leftPanel}>
              {renderChatSection()}
            </View>
            
            <View style={styles.rightPanel}>
              <View style={styles.rightPanelHeader}>
                <Text style={styles.rightPanelTitle}>Agenda & Jadwal</Text>
                <TouchableOpacity style={styles.todayButton}>
                  <Text style={styles.todayButtonText}>Hari Ini</Text>
                </TouchableOpacity>
              </View>
              
              {renderCalendarSection()}
            </View>
          </View>
        </>
      )}

      {renderEventModal()}
      {renderMonthPickerModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  mobileContainer: {
    backgroundColor: '#FFF5E0',
  },
  
  desktopContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    gap: 20,
  },
  leftPanel: {
    width: 380,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  rightPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  rightPanelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  todayButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  todayButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  
  mobileContent: {
    flex: 1,
    backgroundColor: '#FFF5E0',
  },
  mobileTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  mobileTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  mobileTabActive: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  mobileTabText: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  mobileTabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  chatContainerMobile: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  chatTitleContainer: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  chatSubtitle: {
    fontSize: 12,
    color: '#E0E0E0',
  },
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  botMessageBubble: {
    backgroundColor: '#F0F7FF',
    borderBottomLeftRadius: 4,
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: 40,
  },
  messageText: {
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.white,
  },
  messageTime: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 4,
  },
  userMessageTime: {
    color: '#E0E0E0',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: colors.gray,
    fontSize: 14,
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    maxHeight: 100,
    color: colors.darkGray,
  },
  micButton: {
    padding: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.lightGray,
  },

  calendarSection: {
    flex: 1,
  },
  calendarSectionMobile: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarHeader: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.lightBg,
    borderRadius: 20,
    padding: 4,
    marginTop: 12,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  viewButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewButtonText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  viewButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  daysHeader: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingLeft: 60, 
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: colors.lightGray,
    minHeight: 60,
  },
  dayColumnSelected: {
    backgroundColor: colors.primary,
    borderTopWidth: 3,
    borderTopColor: colors.secondary,
  },
  sundayColumn: {
    backgroundColor: '#FFF5F5',
  },
  dayName: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
  },
  dayNameSelected: {
    color: colors.white,
  },
  sundayText: {
    color: colors.secondary,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
  },
  dayDateSelected: {
    color: colors.white,
  },
  timeSlotContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  timeSlotRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    minHeight: 60,
  },
  timeLabel: {
    width: 60,
    padding: 8,
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  eventSlotsRow: {
    flex: 1,
    flexDirection: 'row',
  },
  eventSlot: {
    flex: 1,
    minHeight: 60,
    borderRightWidth: 1,
    borderRightColor: colors.lightGray,
    padding: 4,
  },
  eventSlotSelected: {
    backgroundColor: '#F0F7FF',
  },
  eventSlotHighlight: {
    backgroundColor: '#E6F3FF',
  },
  eventCard: {
    backgroundColor: '#E6F3FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 2,
  },
  selectionHint: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectionHintText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  monthViewContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  monthDaysHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  monthDayHeader: {
    flex: 1,
    alignItems: 'center',
  },
  monthDayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
  },
  monthDay: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  monthDayToday: {
    backgroundColor: colors.primary,
  },
  monthDaySunday: {
    backgroundColor: '#FFF0F0',
  },
  monthDayText: {
    fontSize: 14,
    color: colors.darkGray,
  },
  monthDayTodayText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  monthDayEventIndicator: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
  },
  monthDayEventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
    marginHorizontal: 1,
  },
  monthPickerModal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  monthPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  monthPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  monthPickerContent: {
    padding: 20,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  monthOption: {
    width: '33.33%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 4,
  },
  monthOptionSelected: {
    backgroundColor: colors.primary,
  },
  monthOptionText: {
    fontSize: 14,
    color: colors.darkGray,
  },
  monthOptionTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
  yearPicker: {
    marginTop: 10,
  },
  yearOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.lightBg,
  },
  yearOptionSelected: {
    backgroundColor: colors.primary,
  },
  yearOptionText: {
    fontSize: 16,
    color: colors.darkGray,
  },
  yearOptionTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
  monthPickerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    gap: 12,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '90%',
    maxWidth: 480,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 8,
    marginTop: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.darkGray,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightBg,
    padding: 12,
    borderRadius: 8,
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
  },
  timeRangeLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.lightBg,
  },
  cancelButtonText: {
    color: colors.darkGray,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default Jurnal;