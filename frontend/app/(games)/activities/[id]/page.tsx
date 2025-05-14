'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

import { InfoActivity, QuizActivity, MathActivity, DialogActivity, SafetyActivity, PasswordActivity, WritingScanActivity } from '@/types/activity.types';  
import { gameActivities } from '@/data/gameActivity';
import { images } from '@/data/images';
import { analyzeHandwriting } from '@/utils/handwriting.services';

export default function LearningActivitiesPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [dialogIndex, setDialogIndex] = useState(0);
  const [showingFact, setShowingFact] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    casing: false,
    numbers: false
  });
  const [showScore, setShowScore] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<null | {
    score: number;
    aspectScores?: {
      legibility: number;
      consistency: number;
      spacing: number;
      alignment: number;
    };
    feedback: string[];
    overallImpression: string;
    recommendations?: {
      title: string;
      description: string;
      exercise: string;
    }[];
    processedImageUri?: string;
  }>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Get class ID from route params - with fallback
  const classId = params.id as string || '1';
  
  // Get activities for this class
  const activities = gameActivities[classId] || [];
  
  // Current activity
  const currentActivity = activities[currentActivityIndex];

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handle goBack navigation
  const handleGoBack = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
      // Reset state for the previous activity
      setShowingFact(false);
      setFactIndex(0);
      setDialogIndex(0);
    } else {
      router.back();
    }
  };

  // Handle going to next activity
  const handleNextActivity = () => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
      // Reset state for the next activity
      setShowingFact(false);
      setFactIndex(0);
      setDialogIndex(0);
    } else {
      // Calculate final score
      calculateFinalScore();
      setShowScore(true);
    }
  };

  // Calculate final score
  const calculateFinalScore = () => {
    let correctAnswers = 0;
    let totalQuestions = 0;

    activities.forEach(activity => {
      if (activity.type === 'quiz' || activity.type === 'math') {
        totalQuestions++;
        if (answers[activity.id] === activity.correctAnswer) {
          correctAnswers++;
        }
      } else if (activity.type === 'safety') {
        totalQuestions++;
        const allCorrect = activity.questions.every((question, index) => 
          answers[`${activity.id}_${index}`] === question.safe
        );
        if (allCorrect) correctAnswers++;
      } else if (activity.type === 'password') {
        totalQuestions++;
        if (passwordValid.length && passwordValid.casing && passwordValid.numbers) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setFinalScore(score);
  };

  // Handle finish and return to class detail
  const handleFinish = () => {
    router.push(`/(games)/detail/${classId}/page`);
  };

  // Handle quiz answer selection
  const handleAnswerSelect = (activityId: string, answerId: string) => {
    setAnswers({
      ...answers,
      [activityId]: answerId
    });
  };

  // Handle safety check
  const handleSafetyCheck = (activityId: string, questionIndex: number, isSafe: boolean) => {
    setAnswers({
      ...answers,
      [`${activityId}_${questionIndex}`]: isSafe
    });
  };

  // Handle dialog progression
  const handleDialogProgress = (activityId: string) => {
    if (dialogIndex < (currentActivity?.type === 'dialog' ? currentActivity.dialog.length - 1 : 0)) {
      setDialogIndex(dialogIndex + 1);
    } else {
      // Mark dialog as completed
      setAnswers({
        ...answers,
        [activityId]: true
      });
    }
  };

  // Handle fact viewing
  const handleViewFact = (activityId: string) => {
    if (!showingFact) {
      setShowingFact(true);
    } else {
      if (factIndex < (currentActivity?.type === 'info' ? currentActivity.facts.length - 1 : 0)) {
        setFactIndex(factIndex + 1);
      } else {
        // Mark as completed after viewing all facts
        setAnswers({
          ...answers,
          [activityId]: true
        });
        setShowingFact(false);
        setFactIndex(0);
      }
    }
  };

  // Handle password input
  const handlePasswordChange = (text: string) => {
    setPasswordInput(text);
    
    // Validate password
    const hasMinLength = text.length >= 8;
    const hasBothCases = /[a-z]/.test(text) && /[A-Z]/.test(text);
    const hasNumbers = /[0-9]/.test(text);
    
    setPasswordValid({
      length: hasMinLength,
      casing: hasBothCases,
      numbers: hasNumbers
    });
  };

  const takePicture = async () => {
    if (!hasPermission) {
      alert('Izin akses kamera diperlukan untuk fitur ini.');
      return;
    }
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
        // Process the captured image
        processWritingImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      alert('Terjadi kesalahan saat mengambil gambar.');
    }
  };

  const processWritingImage = async (imageUri: string) => {
    setIsProcessing(true);
    
    try {
      // Use the real handwriting analysis service
      const result = await analyzeHandwriting(imageUri);
      
      // Update the state with real results including aspect scores
      setScanResult({
        score: result.score,
        aspectScores: result.aspectScores,
        feedback: result.feedback,
        overallImpression: result.overallImpression,
        processedImageUri: result.processedImageUri,
        recommendations: result.recommendations
      });
      
      // Mark activity as completed
      setAnswers({
        ...answers,
        [currentActivity.id]: true
      });
    } catch (error) {
      console.error('Error analyzing handwriting:', error);
      
      // Generate default recommendations for fallback
      const defaultRecommendations = [
        {
          title: "Latihan Bentuk Huruf",
          description: "Perhatikan bentuk setiap huruf saat menulis.",
          exercise: "Tuliskan huruf alfabet (a-z) dengan hati-hati dan perhatikan bentuknya."
        },
        {
          title: "Latihan Konsistensi",
          description: "Jaga agar ukuran huruf tetap konsisten.",
          exercise: "Tuliskan nama lengkapmu 5 kali dengan ukuran huruf yang sama."
        },
        {
          title: "Latihan Kelurusan",
          description: "Gunakan kertas bergaris untuk panduan menulis yang lurus.",
          exercise: "Tuliskan sebuah kalimat pendek pada kertas bergaris dan usahakan untuk mengikuti garis."
        }
      ];
      
      // Fallback to basic feedback if analysis fails
      setScanResult({
        score: 70,
        aspectScores: {
          legibility: 70,
          consistency: 70,
          spacing: 70,
          alignment: 70
        },
        feedback: [
          "Terjadi kesalahan saat menganalisis tulisan.",
          "Pastikan tulisan terlihat jelas dalam gambar.",
          "Cobalah untuk mengambil foto dengan pencahayaan yang baik."
        ],
        overallImpression: "Sistem tidak dapat menganalisis tulisan dengan baik. Silakan coba lagi dengan foto yang lebih jelas.",
        recommendations: defaultRecommendations
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderRecommendations = () => {
    if (!scanResult?.recommendations || scanResult.recommendations.length === 0) {
      return null;
    }
    
    return (
      <View style={styles.recommendationsContainer}>
        <Text style={styles.recommendationsTitle}>Latihan yang Direkomendasikan:</Text>
        
        {scanResult.recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
            <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
            <View style={styles.exerciseContainer}>
              <Text style={styles.exerciseLabel}>Latihan:</Text>
              <Text style={styles.exerciseText}>{recommendation.exercise}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Function to get color based on score
  const getColorForScore = (score: number) => {
    if (score >= 90) return '#4CAF50';      // Green
    if (score >= 75) return '#8BC34A';      // Light Green
    if (score >= 60) return '#FFC107';      // Amber
    if (score >= 40) return '#FF9800';      // Orange
    return '#F44336';                       // Red
  };

  // Render the aspect ratings if available
  const renderAspectRatings = () => {
    if (!scanResult?.aspectScores) return null;
    
    const aspects = [
      { name: 'Bentuk Huruf', score: scanResult.aspectScores.legibility },
      { name: 'Konsistensi', score: scanResult.aspectScores.consistency },
      { name: 'Jarak', score: scanResult.aspectScores.spacing },
      { name: 'Kelurusan', score: scanResult.aspectScores.alignment }
    ];
    
    return (
      <View style={styles.aspectContainer}>
        {aspects.map((aspect, index) => (
          <View key={index} style={styles.aspectItem}>
            <Text style={styles.aspectName}>{aspect.name}</Text>
            <View style={styles.aspectBarContainer}>
              <View 
                style={[
                  styles.aspectBar, 
                  { 
                    width: `${aspect.score}%`,
                    backgroundColor: getColorForScore(aspect.score)
                  }
                ]} 
              />
            </View>
            <Text style={styles.aspectScore}>{aspect.score}%</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render progress indicators
  const renderProgressIndicators = () => {
    return activities.map((activity, index) => {
      const isCompleted = index < currentActivityIndex;
      const isCurrent = index === currentActivityIndex;
      
      return (
        <View 
          key={index}
          style={[
            styles.progressIndicator, 
            isCompleted ? styles.completedIndicator : styles.incompleteIndicator,
            isCurrent ? styles.currentIndicator : null
          ]}
        />
      );
    });
  };

  // Info activity with facts
  const renderInfoActivity = (activity: InfoActivity) => {
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <TouchableOpacity 
          style={styles.infoImageContainer}
          onPress={() => handleViewFact(activity.id)}
        >
          <Image 
            source={activity.image}
            style={styles.infoImage} 
            resizeMode="contain"
          />
          
          {!showingFact && (
            <View style={styles.magnifyingGlass}>
              <Image source={require('../../../../assets/images/loop.png')} />
              <Text style={styles.infoText}>{activity.infoText}</Text>
            </View>
          )}
          
          {showingFact && (
            <View style={styles.factContainer}>
              <Text style={styles.factText}>{activity.facts[factIndex]}</Text>
              {factIndex < activity.facts.length - 1 ? (
                <Text style={styles.tapMoreText}>Ketuk untuk fakta lainnya</Text>
              ) : (
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextActivity}
                >
                  <Text style={styles.nextButtonText}>Lanjut</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Quiz activity
  const renderQuizActivity = (activity: QuizActivity) => {
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={activity.image}
            style={styles.activityImage} 
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.questionText}>{activity.question}</Text>
        
        <View style={styles.optionsGrid}>
          {activity.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                answers[activity.id] === option.id && 
                  (option.id === activity.correctAnswer 
                    ? styles.correctOption 
                    : styles.incorrectOption)
              ]}
              onPress={() => handleAnswerSelect(activity.id, option.id)}
              disabled={answers[activity.id] !== undefined}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {answers[activity.id] !== undefined && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {answers[activity.id] === activity.correctAnswer 
                ? "Benar! Bagus sekali." 
                : "Belum tepat, coba lagi."}
            </Text>
            {answers[activity.id] === activity.correctAnswer && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextActivity}
              >
                <Text style={styles.nextButtonText}>Lanjut</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  // Dialog activity
  const renderDialogActivity = (activity: DialogActivity) => {
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.dialogContainer}>
          <Image 
            source={activity.image}
            style={styles.characterImage} 
            resizeMode="contain"
          />
          
          {dialogIndex === 0 ? (
            <View style={styles.dialogOption}>
              <Text style={styles.dialogOptionText}>{activity.dialogOption}</Text>
              <TouchableOpacity
                style={styles.dialogBubble}
                onPress={() => handleDialogProgress(activity.id)}
              >
                <Text style={styles.dialogBubbleText}>💬</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.dialogTextContainer}>
              <Text style={styles.dialogText}>
                {activity.dialog[dialogIndex]}
              </Text>
              <TouchableOpacity
                style={styles.dialogNext}
                onPress={() => {
                  if (dialogIndex < activity.dialog.length - 1) {
                    handleDialogProgress(activity.id);
                  } else {
                    // Mark as completed and move to next
                    setAnswers({...answers, [activity.id]: true});
                    handleNextActivity();
                  }
                }}
              >
                <Text style={styles.dialogNextText}>
                  {dialogIndex < activity.dialog.length - 1 ? "Lanjut" : "Selesai"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Math activity
  const renderMathActivity = (activity: MathActivity) => {
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={activity.image}
            style={styles.activityImage} 
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.questionText}>{activity.question}</Text>
        
        <View style={styles.optionsGrid}>
          {activity.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                answers[activity.id] === option.id && 
                  (option.id === activity.correctAnswer 
                    ? styles.correctOption 
                    : styles.incorrectOption)
              ]}
              onPress={() => handleAnswerSelect(activity.id, option.id)}
              disabled={answers[activity.id] !== undefined}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {answers[activity.id] !== undefined && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {answers[activity.id] === activity.correctAnswer 
                ? "Benar! Bagus sekali." 
                : "Belum tepat, coba lagi."}
            </Text>
            {answers[activity.id] === activity.correctAnswer && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextActivity}
              >
                <Text style={styles.nextButtonText}>Lanjut</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  // Safety activity
  const renderSafetyActivity = (activity: SafetyActivity) => {
    // Check if all questions are answered correctly
    const allQuestionsAnswered = activity.questions.every(
      (_, index) => answers[`${activity.id}_${index}`] !== undefined
    );
    
    const allCorrect = activity.questions.every(
      (question, index) => answers[`${activity.id}_${index}`] === question.safe
    );

    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.safetyContainer}>
          <View style={styles.safetyHeader}>
            <Text style={styles.safetyHeaderText}>Aman</Text>
            <Text style={styles.safetyHeaderText}>Tidak Aman</Text>
          </View>
          
          {activity.questions.map((question, index) => (
            <View key={index} style={styles.safetyQuestion}>
              <View style={styles.safetyQuestionTextContainer}>
                <Text style={styles.safetyQuestionText}>{question.text}</Text>
              </View>
              
              <View style={styles.safetyOptions}>
                <TouchableOpacity
                  style={[
                    styles.safetyCheckbox,
                    answers[`${activity.id}_${index}`] === true && styles.safetySelected
                  ]}
                  onPress={() => handleSafetyCheck(activity.id, index, true)}
                >
                  {answers[`${activity.id}_${index}`] === true && <Text>✓</Text>}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.safetyCheckbox,
                    answers[`${activity.id}_${index}`] === false && styles.safetySelected
                  ]}
                  onPress={() => handleSafetyCheck(activity.id, index, false)}
                >
                  {answers[`${activity.id}_${index}`] === false && <Text>✓</Text>}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        
        {allQuestionsAnswered && allCorrect && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextActivity}
          >
            <Text style={styles.nextButtonText}>Lanjut</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Password activity
  const renderPasswordActivity = (activity: PasswordActivity) => {
    const allValid = passwordValid.length && passwordValid.casing && passwordValid.numbers;
    
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Masukan password yang kuat!"
            value={passwordInput}
            onChangeText={handlePasswordChange}
            secureTextEntry={true}
          />
          
          <View style={styles.requirementsList}>
            {activity.requirements.map((req, index) => (
              <Text 
                key={index} 
                style={[
                  styles.requirementText,
                  { color: req.color },
                  index === 0 && passwordValid.length && styles.validRequirement,
                  index === 1 && passwordValid.casing && styles.validRequirement,
                  index === 2 && passwordValid.numbers && styles.validRequirement
                ]}
              >
                {req.text}
              </Text>
            ))}
          </View>
        </View>
        
        {allValid && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextActivity}
          >
            <Text style={styles.nextButtonText}>Lanjut</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderWritingScanActivity = (activity: WritingScanActivity) => {
    // Function to get color based on score
    const getColorForScore = (score: number) => {
      if (score >= 90) return '#4CAF50';      // Green
      if (score >= 75) return '#8BC34A';      // Light Green
      if (score >= 60) return '#FFC107';      // Amber
      if (score >= 40) return '#FF9800';      // Orange
      return '#F44336';                       // Red
    };

    // Render the aspect ratings if available
    const renderAspectRatings = () => {
      if (!scanResult?.aspectScores) return null;
      
      const aspects = [
        { name: 'Bentuk Huruf', score: scanResult.aspectScores.legibility },
        { name: 'Konsistensi', score: scanResult.aspectScores.consistency },
        { name: 'Jarak', score: scanResult.aspectScores.spacing },
        { name: 'Kelurusan', score: scanResult.aspectScores.alignment }
      ];
      
      return (
        <View style={styles.aspectContainer}>
          {aspects.map((aspect, index) => (
            <View key={index} style={styles.aspectItem}>
              <Text style={styles.aspectName}>{aspect.name}</Text>
              <View style={styles.aspectBarContainer}>
                <View 
                  style={[
                    styles.aspectBar, 
                    { 
                      width: `${aspect.score}%`,
                      backgroundColor: getColorForScore(aspect.score)
                    }
                  ]} 
                />
              </View>
              <Text style={styles.aspectScore}>{aspect.score}%</Text>
            </View>
          ))}
        </View>
      );
    };

    return (
      <View style={styles.activityContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.writingScanInstructions}>
          <Text style={styles.instructionsTitle}>Petunjuk:</Text>
          <Text style={styles.instructionsText}>{activity.instructions}</Text>
        </View>
        
        <View style={styles.sampleContainer}>
          <Text style={styles.sampleTitle}>Contoh Tulisan:</Text>
          <Image 
            source={activity.sampleImage}
            style={styles.sampleImage} 
            resizeMode="contain"
          />
        </View>
        
        {!capturedImage ? (
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={takePicture}
          >
            <Image 
              source={images.cameraIcon}
              style={styles.cameraIcon} 
              resizeMode="contain"
            />
            <Text style={styles.cameraButtonText}>Ambil Foto Tulisan</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.capturedImageContainer}>
            <Image 
              source={{ uri: capturedImage }}
              style={styles.capturedImage} 
              resizeMode="contain"
            />
            
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#E30425" />
                <Text style={styles.processingText}>Menganalisis tulisan...</Text>
                <Text style={styles.processingSubtext}>AI sedang memeriksa tulisan kamu</Text>
              </View>
            ) : scanResult ? (
              <View style={styles.resultContainer}>
                <View style={styles.scoreCircleContainer}>
                  <View style={[
                    styles.scoreCircle, 
                    { borderColor: getColorForScore(scanResult.score) }
                  ]}>
                    <Text style={styles.scoreText}>{scanResult.score}</Text>
                    <Text style={styles.scoreLabel}>dari 100</Text>
                  </View>
                </View>
                
                {renderAspectRatings()}
                
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackTitle}>Umpan Balik:</Text>
                  {scanResult.feedback.map((item, index) => (
                    <Text key={index} style={styles.feedbackItem}>• {item}</Text>
                  ))}
                  
                  <Text style={styles.overallFeedback}>{scanResult.overallImpression}</Text>
                </View>
                
                {/* Recommendations toggle button */}
                <TouchableOpacity
                  style={styles.recommendationsButton}
                  onPress={() => setShowRecommendations(!showRecommendations)}
                >
                  <Text style={styles.recommendationsButtonText}>
                    {showRecommendations ? 'Sembunyikan Latihan' : 'Lihat Latihan yang Direkomendasikan'}
                  </Text>
                </TouchableOpacity>
                
                {/* Show recommendations if toggle is on */}
                {showRecommendations && renderRecommendations()}
                
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextActivity}
                >
                  <Text style={styles.nextButtonText}>Lanjut</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            
            {!scanResult && !isProcessing && (
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => setCapturedImage(null)}
              >
                <Text style={styles.retakeButtonText}>Ambil Ulang</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  // Render the current activity
  const renderActivity = () => {
    if (!currentActivity) return null;

    switch (currentActivity.type) {
      case 'info':
        return renderInfoActivity(currentActivity);
      case 'quiz':
        return renderQuizActivity(currentActivity);
      case 'dialog':
        return renderDialogActivity(currentActivity);
      case 'math':
        return renderMathActivity(currentActivity);
      case 'safety':
        return renderSafetyActivity(currentActivity);
      case 'password':
        return renderPasswordActivity(currentActivity);
      case 'writing_scan':
        return renderWritingScanActivity(currentActivity);
      default:
        return null;
    }
  };

  // Score screen
  const renderScoreScreen = () => {
    return (
      <View style={styles.scoreContainer}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Pembelajaran Selesai!</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{finalScore}%</Text>
          </View>
          <Text style={styles.scoreMessage}>
            {finalScore >= 80 
              ? "Luar biasa! Kamu berhasil menguasai materi ini dengan sangat baik."
              : finalScore >= 60
                ? "Bagus! Kamu telah menguasai sebagian besar materi ini."
                : "Teruslah berlatih, kamu pasti bisa lebih baik!"}
          </Text>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinish}
          >
            <Text style={styles.finishButtonText}>Selesai</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Loading state
  if (!currentActivity && !showScore) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header with back button and progress indicators */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        
        <View style={styles.progressIndicatorsContainer}>
          {renderProgressIndicators()}
        </View>
      </View>
      
      {/* Main content */}
      <ScrollView style={styles.content}>
        {!showScore ? (
          <View style={styles.gameWrapper}>
            {currentActivity && <Text style={styles.gameTitle}>{currentActivity.title}</Text>}
            {renderActivity()}
          </View>
        ) : (
          renderScoreScreen()
        )}
      </ScrollView>
      
      {/* Character mascot */}
      {!showScore && (
        <Image
          source={images.lino}
          style={styles.mascot}
          resizeMode="contain"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A365D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A365D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressIndicatorsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  progressIndicator: {
    height: 6,
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 3,
  },
  completedIndicator: {
    backgroundColor: '#FFA726',
  },
  incompleteIndicator: {
    backgroundColor: 'white',
  },
  currentIndicator: {
    height: 8,
  },
  content: {
    flex: 1,
  },
  gameWrapper: {
    backgroundColor: 'rgba(255, 250, 230, 0.95)',
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 500,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A365D',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  activityContainer: {
    padding: 20,
  },
  activityDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  activityImage: {
    width: '100%',
    height: 200,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  correctOption: {
    backgroundColor: '#A5D6A7',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#EF9A9A',
    borderWidth: 2,
    borderColor: '#E53935',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#E30425',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialogContainer: {
    alignItems: 'center',
  },
  characterImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  dialogOption: {
    alignItems: 'center',
  },
  dialogOptionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  dialogBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  dialogBubbleText: {
    fontSize: 30,
  },
  dialogTextContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    width: '100%',
  },
  dialogText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  dialogNext: {
    alignSelf: 'flex-end',
    backgroundColor: '#E30425',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  dialogNextText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  safetyContainer: {
    marginVertical: 20,
  },
  safetyHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  safetyHeaderText: {
    width: 100,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1A365D',
  },
  safetyQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  safetyQuestionTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  safetyQuestionText: {
    fontSize: 16,
    color: '#333',
  },
  safetyOptions: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-around',
  },
  safetyCheckbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#1A365D',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetySelected: {
    backgroundColor: '#A5D6A7',
    borderColor: '#4CAF50',
  },
  passwordContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  passwordInput: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  requirementsList: {
    alignSelf: 'flex-start',
  },
  requirementText: {
    fontSize: 16,
    marginBottom: 8,
  },
  validRequirement: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  infoImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 20,
  },
  infoImage: {
    width: '100%',
    height: 250,
  },
  magnifyingGlass: {
    position: 'absolute',
    bottom: '-10%',
    right: '25%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#1A365D',
    fontWeight: 'bold',
  },
  factContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  factText: {
    fontSize: 16,
    color: '#1A365D',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tapMoreText: {
    fontSize: 14,
    color: '#E30425',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  writingScanInstructions: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  sampleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 8,
  },
  sampleImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cameraButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  cameraIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  capturedImageContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  processingContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  processingText: {
    fontSize: 16,
    color: '#1A365D',
    fontStyle: 'italic',
  },
  retakeButton: {
    backgroundColor: '#FFA726',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  // scoreLabel: {
  //   fontSize: 18,
  //   color: '#1A365D',
  //   fontWeight: 'bold',
  //   marginRight: 10,
  // },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  // feedbackTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#1A365D',
  //   marginBottom: 10,
  // },
  // feedbackItem: {
  //   fontSize: 16,
  //   color: '#333',
  //   marginBottom: 8,
  //   paddingLeft: 10,
  // },
  // overallFeedback: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   color: '#1A365D',
  //   marginVertical: 15,
  //   textAlign: 'center',
  // },
  // aspectContainer: {
  //   width: '100%',
  //   marginVertical: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 12,
  //   padding: 15,
  //   elevation: 2,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 1.5,
  // },
  // aspectItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 12,
  // },
  // aspectName: {
  //   width: 90,
  //   fontSize: 14,
  //   fontWeight: 'bold',
  //   color: '#333',
  // },
  // aspectBarContainer: {
  //   flex: 1,
  //   height: 12,
  //   backgroundColor: '#E0E0E0',
  //   borderRadius: 6,
  //   overflow: 'hidden',
  //   marginRight: 10,
  // },
  // aspectBar: {
  //   height: '100%',
  //   borderRadius: 6,
  // },
  // aspectScore: {
  //   width: 40,
  //   fontSize: 12,
  //   fontWeight: 'bold',
  //   color: '#666',
  //   textAlign: 'right',
  // },
  // scoreCircleContainer: {
  //   alignItems: 'center',
  //   marginBottom: 15,
  // },
  // scoreCircle: {
  //   width: 100,
  //   height: 100,
  //   borderRadius: 50,
  //   borderWidth: 8,
  //   borderColor: '#4CAF50',
  //   backgroundColor: 'white',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   elevation: 4,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 3,
  // },
  // processingSubtext: {
  //   fontSize: 14,
  //   color: '#666',
  //   marginTop: 8,
  // },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 20,
  },
  // scoreCircle: {
  //   width: 120,
  //   height: 120,
  //   borderRadius: 60,
  //   backgroundColor: '#A5D6A7',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 20,
  //   borderWidth: 8,
  //   borderColor: '#4CAF50',
  // },
  // Add these styles to your styles object in LearningActivitiesPage.tsx
  // Add these styles to your styles object in LearningActivitiesPage.tsx
  aiStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  aiStatusLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  aspectContainer: {
    width: '100%',
    marginVertical: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  aspectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aspectName: {
    width: 90,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  aspectBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 10,
  },
  aspectBar: {
    height: '100%',
    borderRadius: 6,
  },
  aspectScore: {
    width: 40,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'right',
  },
  scoreCircleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#4CAF50',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  feedbackContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 10,
  },
  feedbackItem: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 10,
  },
  overallFeedback: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A365D',
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tipsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 10,
  },
  tipItem: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 6,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  captureButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  analyzeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationsButton: {
    backgroundColor: '#1A365D',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginVertical: 15,
  },
  recommendationsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  recommendationsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 15,
    textAlign: 'center',
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 5,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  exerciseContainer: {
    backgroundColor: '#E8F4F8',
    borderRadius: 6,
    padding: 10,
  },
  exerciseLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 5,
  },
  exerciseText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  // feedbackContainer: {
  //   backgroundColor: '#E3F2FD',
  //   borderRadius: 12,
  //   padding: 15,
  //   marginVertical: 20,
  // },
  // recommendationsButton: {
  //   backgroundColor: '#1A365D',
  //   borderRadius: 20,
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   alignSelf: 'center',
  //   marginVertical: 15,
  // },
  // recommendationsButtonText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   fontSize: 14,
  // },
  // recommendationsContainer: {
  //   backgroundColor: '#F5F5F5',
  //   borderRadius: 12,
  //   padding: 15,
  //   marginVertical: 10,
  // },
  // recommendationsTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#1A365D',
  //   marginBottom: 15,
  //   textAlign: 'center',
  // },
  // recommendationCard: {
  //   backgroundColor: 'white',
  //   borderRadius: 8,
  //   padding: 12,
  //   marginBottom: 10,
  //   elevation: 2,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 1.5,
  // },
  // recommendationTitle: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   color: '#1A365D',
  //   marginBottom: 5,
  // },
  // recommendationDescription: {
  //   fontSize: 14,
  //   color: '#333',
  //   marginBottom: 10,
  // },
  // exerciseContainer: {
  //   backgroundColor: '#E8F4F8',
  //   borderRadius: 6,
  //   padding: 10,
  // },
  // exerciseLabel: {
  //   fontSize: 14,
  //   fontWeight: 'bold',
  //   color: '#1A365D',
  //   marginBottom: 5,
  // },
  // exerciseText: {
  //   fontSize: 14,
  //   color: '#333',
  //   fontStyle: 'italic',
  // },
  // scoreText: {
  //   fontSize: 36,
  //   fontWeight: 'bold',
  //   color: '#1A365D',
  // },
  scoreMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
    lineHeight: 24,
  },
  finishButton: {
    backgroundColor: '#E30425',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mascot: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 75,
    height: 75,
  },
});