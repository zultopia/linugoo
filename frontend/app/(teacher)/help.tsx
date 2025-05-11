import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function Help() {
  const router = useRouter();
  const { user } = useAuth();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'Bagaimana cara mengubah foto profil?',
      answer: 'Untuk mengubah foto profil, masuk ke halaman Profil, kemudian tap pada foto profil Anda. Pilih foto baru dari galeri dan simpan perubahan.',
    },
    {
      id: 2,
      question: 'Bagaimana cara reset password?',
      answer: 'Jika Anda lupa password, gunakan opsi "Lupa Password" di halaman login. Masukkan email yang terdaftar dan ikuti instruksi yang dikirim ke email Anda.',
    },
    {
      id: 3,
      question: 'Bagaimana cara melihat progress siswa?',
      answer: 'Guru dapat melihat progress siswa melalui Dashboard. Pilih kelas dan siswa yang ingin dilihat progressnya untuk melihat detail pencapaian pembelajaran.',
    },
    {
      id: 4,
      question: 'Bagaimana cara membuat jurnal mengajar?',
      answer: 'Untuk membuat jurnal mengajar, masuk ke menu Jurnal, klik tombol "Tambah Jurnal", isi detail pembelajaran, dan simpan jurnal Anda.',
    },
    {
      id: 5,
      question: 'Apakah data saya aman di aplikasi ini?',
      answer: 'Ya, semua data pengguna disimpan dengan enkripsi dan kami menerapkan standar keamanan tinggi untuk melindungi privasi Anda.',
    },
  ];

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@linugoo.com?subject=Bantuan%20Aplikasi%20Linugoo');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+62812345678');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/62812345678');
  };

  const brandColor = user?.role === 'Guru' ? '#C70039' : '#E30425';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
            <Text style={styles.headerTitle}>Bantuan</Text>
            <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pertanyaan yang Sering Diajukan</Text>
          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(faq.id)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Ionicons 
                  name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
              {expandedFAQ === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hubungi Kami</Text>
          
          <TouchableOpacity 
            style={styles.contactOption}
            onPress={handleContactSupport}
          >
            <View style={[styles.contactIcon, { backgroundColor: brandColor }]}>
              <Ionicons name="mail-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactSubtitle}>support@linugoo.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactOption}
            onPress={handleCallSupport}
          >
            <View style={[styles.contactIcon, { backgroundColor: brandColor }]}>
              <Ionicons name="call-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Telepon</Text>
              <Text style={styles.contactSubtitle}>+62 812-3456-789</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactOption}
            onPress={handleWhatsApp}
          >
            <View style={[styles.contactIcon, { backgroundColor: '#25D366' }]}>
              <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>WhatsApp</Text>
              <Text style={styles.contactSubtitle}>+62 812-3456-789</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sumber Daya</Text>
          
          <TouchableOpacity style={styles.resourceItem}>
            <Text style={styles.resourceTitle}>Panduan Pengguna</Text>
            <MaterialIcons name="open-in-new" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Text style={styles.resourceTitle}>Video Tutorial</Text>
            <MaterialIcons name="open-in-new" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Text style={styles.resourceTitle}>Kebijakan Privasi</Text>
            <MaterialIcons name="open-in-new" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Text style={styles.resourceTitle}>Syarat & Ketentuan</Text>
            <MaterialIcons name="open-in-new" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Linugoo v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Linugoo. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 10,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 8,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  faqAnswer: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 8,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  resourceTitle: {
    fontSize: 15,
    color: '#333',
  },
  versionInfo: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
  },
});