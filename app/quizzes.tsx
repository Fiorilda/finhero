import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { Quiz, addChildXP, completeQuiz, getChildById, getQuizzesByAge } from '@/app/mock-data';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
  negative: '#F44336',
  teal: '#37a69b',
};

// Mock child ID until we have auth
const MOCK_CHILD_ID = 'c1';

// Confetti component for celebrations
const Confetti = ({ count = 50, duration = 5000 }) => {
  // Array to store confetti pieces
  const confetti = [...Array(count)].map(() => {
    return {
      key: Math.random().toString(),
      x: Math.random() * 100, // Random horizontal position (0-100%)
      y: -Math.random() * 20, // Start above the screen
      size: Math.random() * 8 + 4, // Random size between 4-12
      color: [BRAND_COLORS.primary, BRAND_COLORS.secondary, BRAND_COLORS.teal, BRAND_COLORS.positive, '#FF9800'][
        Math.floor(Math.random() * 5)
      ], // Random color
      rotation: Math.random() * 360, // Random initial rotation
      rotationSpeed: (Math.random() - 0.5) * 10, // Random rotation speed
      xSpeed: (Math.random() - 0.5) * 5, // Random horizontal movement
      ySpeed: Math.random() * 3 + 2, // Random fall speed
    };
  });

  // Animation values
  const animations = useRef(confetti.map(() => new Animated.Value(0))).current;
  
  useEffect(() => {
    // Start animations
    animations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  return (
    <View style={styles.confettiContainer}>
      {confetti.map((piece, index) => {
        // Interpolate animation values
        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [`${piece.y}%`, '120%'],
        });
        
        const translateX = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [`${piece.x}%`, `${piece.x + piece.xSpeed * 20}%`],
        });
        
        const rotate = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [`${piece.rotation}deg`, `${piece.rotation + piece.rotationSpeed * 360}deg`],
        });

        return (
          <Animated.View
            key={piece.key}
            style={[
              styles.confettiPiece,
              {
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                transform: [
                  { translateX },
                  { translateY },
                  { rotate },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

export default function QuizzesScreen() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [childData, setChildData] = useState(getChildById(MOCK_CHILD_ID));
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Load quizzes suitable for the child's age
  useEffect(() => {
    if (childData) {
      const availableQuizzes = getQuizzesByAge(childData.age);
      setQuizzes(availableQuizzes);
    }
  }, [childData]);
  
  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setShowConfetti(false);
    setQuizModalVisible(true);
  };
  
  const checkAnswer = () => {
    if (selectedOption !== null && selectedQuiz) {
      setIsAnswerChecked(true);
      if (selectedOption === selectedQuiz.questions[currentQuestion].correctOption) {
        setScore(score + 1);
      }
    } else {
      Alert.alert('Select an option', 'Please select an answer before checking.');
    }
  };
  
  const nextQuestion = () => {
    if (selectedQuiz) {
      if (currentQuestion < selectedQuiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        // Quiz completed, award XP
        if (childData && selectedQuiz && !childData.completedQuizzes.includes(selectedQuiz.id)) {
          completeQuiz(childData.id, selectedQuiz.id);
          const updatedChild = addChildXP(childData.id, selectedQuiz.xpReward);
          if (updatedChild) {
            setChildData(updatedChild);
          }
        }
        
        const totalQuestions = selectedQuiz.questions.length;
        const percentage = Math.round((score / totalQuestions) * 100);
        
        // Show confetti for superhero quiz or high scores
        if (selectedQuiz.id === 'q5' || percentage >= 80) {
          setShowConfetti(true);
        }
        
        setQuizCompleted(true);
      }
    }
  };
  
  const closeQuiz = () => {
    setQuizModalVisible(false);
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setQuizCompleted(false);
    setShowConfetti(false);
  };
  
  const renderQuizItem = ({ item }: { item: Quiz }) => {
    const isCompleted = childData?.completedQuizzes.includes(item.id);
    const isSuperheroQuiz = item.id === 'q5';
    
    return (
      <TouchableOpacity
        style={[
          styles.quizCard, 
          isCompleted && styles.completedQuizCard,
          isSuperheroQuiz && styles.superheroQuizCard
        ]}
        onPress={() => startQuiz(item)}
      >
        {isSuperheroQuiz && (
          <View style={styles.superheroTag}>
            <FontAwesome5 name="mask" size={14} color="#FFFFFF" />
            <Text style={styles.superheroTagText}>SUPERHERO</Text>
          </View>
        )}
        
        <View style={styles.quizCardHeader}>
          <View style={styles.quizDifficulty}>
            {Array(item.difficulty === 'easy' ? 1 : item.difficulty === 'medium' ? 2 : 3).fill(0).map((_, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.difficultyDot, 
                  { backgroundColor: isSuperheroQuiz ? '#FF9800' : BRAND_COLORS.secondary }
                ]} 
              />
            ))}
          </View>
          <Text style={[
            styles.quizXp,
            isSuperheroQuiz && { color: '#FF9800' }
          ]}>+{item.xpReward} XP</Text>
        </View>
        
        <Text style={[
          styles.quizTitle,
          isSuperheroQuiz && { color: BRAND_COLORS.secondary }
        ]}>{item.title}</Text>
        <Text style={styles.quizDescription}>{item.description}</Text>
        
        <View style={styles.quizCardFooter}>
          <View style={[
            styles.quizCategoryContainer,
            isSuperheroQuiz && { backgroundColor: BRAND_COLORS.secondary }
          ]}>
            <Text style={[
              styles.quizCategory,
              isSuperheroQuiz && { color: '#FFFFFF' }
            ]}>{item.category}</Text>
          </View>
          <View style={styles.quizTimeContainer}>
            <AntDesign name="clockcircleo" size={14} color="#555" />
            <Text style={styles.quizTime}>{item.completionTime}</Text>
          </View>
          
          {isCompleted && (
            <View style={styles.completedBadge}>
              <AntDesign name="checkcircle" size={14} color={BRAND_COLORS.positive} />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderQuizQuestion = () => {
    if (!selectedQuiz) return null;
    
    const question = selectedQuiz.questions[currentQuestion];
    const isSuperheroQuiz = selectedQuiz.id === 'q5';
    
    return (
      <View style={styles.questionContainer}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${((currentQuestion + 1) / selectedQuiz.questions.length) * 100}%`,
                  backgroundColor: isSuperheroQuiz ? BRAND_COLORS.secondary : BRAND_COLORS.primary
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1}/{selectedQuiz.questions.length}
          </Text>
        </View>
        
        <Text style={[
          styles.questionText,
          isSuperheroQuiz && styles.superheroQuestionText
        ]}>{question.question}</Text>
        
        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionButton,
                selectedOption === idx && styles.selectedOption,
                isAnswerChecked && idx === question.correctOption && styles.correctOption,
                isAnswerChecked && selectedOption === idx && idx !== question.correctOption && styles.wrongOption,
                isSuperheroQuiz && styles.superheroOptionButton
              ]}
              onPress={() => !isAnswerChecked && setSelectedOption(idx)}
              disabled={isAnswerChecked}
            >
              <Text style={[
                styles.optionText,
                selectedOption === idx && styles.selectedOptionText,
                isAnswerChecked && idx === question.correctOption && styles.correctOptionText,
                isAnswerChecked && selectedOption === idx && idx !== question.correctOption && styles.wrongOptionText,
                isSuperheroQuiz && styles.superheroOptionText
              ]}>
                {option}
              </Text>
              
              {isAnswerChecked && idx === question.correctOption && (
                <View style={styles.correctBadge}>
                  <AntDesign name="checkcircle" size={16} color={BRAND_COLORS.positive} />
                </View>
              )}
              
              {isAnswerChecked && selectedOption === idx && idx !== question.correctOption && (
                <View style={styles.wrongBadge}>
                  <AntDesign name="closecircle" size={16} color={BRAND_COLORS.negative} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {isAnswerChecked && (
          <View style={[
            styles.explanationContainer,
            isSuperheroQuiz && styles.superheroExplanationContainer
          ]}>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
        
        <View style={styles.actionButtons}>
          {!isAnswerChecked ? (
            <TouchableOpacity
              style={[
                styles.checkButton, 
                selectedOption === null && styles.disabledButton,
                isSuperheroQuiz && styles.superheroCheckButton
              ]}
              onPress={checkAnswer}
              disabled={selectedOption === null}
            >
              <Text style={[
                styles.checkButtonText,
                isSuperheroQuiz && { color: '#FFFFFF' }
              ]}>Check Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.nextButton,
                isSuperheroQuiz && styles.superheroNextButton
              ]} 
              onPress={nextQuestion}
            >
              <Text style={[
                styles.nextButtonText,
                isSuperheroQuiz && { color: '#FFFFFF' }
              ]}>
                {currentQuestion < selectedQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  
  const renderQuizResults = () => {
    if (!selectedQuiz) return null;
    
    const totalQuestions = selectedQuiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const isPassed = percentage >= 60; // Consider 60% as passing score
    const isSuperheroQuiz = selectedQuiz.id === 'q5';
    
    return (
      <View style={styles.resultsContainer}>
        {showConfetti && <Confetti />}
        
        <View style={[
          styles.resultsBadge,
          isSuperheroQuiz && styles.superheroResultsBadge
        ]}>
          <FontAwesome5 
            name={isSuperheroQuiz && isPassed ? "mask" : isPassed ? "award" : "book-reader"} 
            size={50} 
            color={isPassed ? (isSuperheroQuiz ? BRAND_COLORS.secondary : BRAND_COLORS.primary) : BRAND_COLORS.lightGray} 
          />
        </View>
        
        <Text style={styles.resultsTitle}>
          {isSuperheroQuiz && isPassed 
            ? 'You\'re a Money Superhero!' 
            : (isPassed ? 'Congratulations!' : 'Good effort!')}
        </Text>
        
        <Text style={styles.resultsScore}>
          Your score: {score}/{totalQuestions} ({percentage}%)
        </Text>
        
        {isPassed && (
          <View style={[
            styles.xpReward,
            isSuperheroQuiz && { backgroundColor: BRAND_COLORS.secondary }
          ]}>
            <Text style={[
              styles.xpRewardText,
              isSuperheroQuiz && { color: '#FFFFFF' }
            ]}>
              You earned +{selectedQuiz.xpReward} XP!
            </Text>
          </View>
        )}
        
        {isSuperheroQuiz && isPassed && (
          <View style={styles.superheroMessage}>
            <Text style={styles.superheroMessageText}>
              You've unlocked your money superpowers! You now have the knowledge to battle financial villains and save the day!
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={[
            styles.closeButton,
            isSuperheroQuiz && styles.superheroCloseButton
          ]} 
          onPress={closeQuiz}
        >
          <Text style={[
            styles.closeButtonText,
            isSuperheroQuiz && { color: '#FFFFFF' }
          ]}>
            Return to Quizzes
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with XP display */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Quizzes</Text>
        <View style={styles.xpContainer}>
          <FontAwesome5 name="star" size={18} color={BRAND_COLORS.primary} />
          <Text style={styles.xpText}>{childData?.xp || 0} XP</Text>
        </View>
      </View>
      
      {/* List of available quizzes */}
      <FlatList
        data={quizzes}
        renderItem={renderQuizItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.quizList}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Quiz Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={quizModalVisible}
        onRequestClose={closeQuiz}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={[
            styles.modalHeader,
            selectedQuiz?.id === 'q5' && styles.superheroModalHeader
          ]}>
            <TouchableOpacity onPress={closeQuiz} style={styles.closeModalButton}>
              <Ionicons name="close" size={24} color={selectedQuiz?.id === 'q5' ? '#FFFFFF' : '#555'} />
            </TouchableOpacity>
            <Text style={[
              styles.modalTitle,
              selectedQuiz?.id === 'q5' && { color: '#FFFFFF' }
            ]}>{selectedQuiz?.title}</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            {!quizCompleted ? renderQuizQuestion() : renderQuizResults()}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  xpText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: '#333333',
  },
  quizList: {
    padding: 16,
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  completedQuizCard: {
    borderLeftWidth: 4,
    borderLeftColor: BRAND_COLORS.positive,
  },
  superheroQuizCard: {
    borderWidth: 2,
    borderColor: BRAND_COLORS.secondary,
    backgroundColor: '#F8F8FF',
  },
  superheroTag: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: BRAND_COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  superheroTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  quizCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quizDifficulty: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  quizXp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BRAND_COLORS.teal,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  quizCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizCategoryContainer: {
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  quizCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
  },
  quizTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizTime: {
    fontSize: 12,
    color: '#555555',
    marginLeft: 4,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  completedText: {
    fontSize: 12,
    color: BRAND_COLORS.positive,
    marginLeft: 4,
    fontWeight: '500',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  superheroModalHeader: {
    backgroundColor: BRAND_COLORS.secondary,
    borderBottomColor: BRAND_COLORS.secondary,
  },
  closeModalButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  
  // Question styles
  questionContainer: {
    flex: 1,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  superheroQuestionText: {
    color: BRAND_COLORS.secondary,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  superheroOptionButton: {
    borderColor: '#DDDDFF',
    backgroundColor: '#F8F8FF',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderColor: BRAND_COLORS.secondary,
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: BRAND_COLORS.positive,
  },
  wrongOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: BRAND_COLORS.negative,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  superheroOptionText: {
    color: '#333366',
  },
  selectedOptionText: {
    color: BRAND_COLORS.secondary,
    fontWeight: '500',
  },
  correctOptionText: {
    color: BRAND_COLORS.positive,
    fontWeight: '500',
  },
  wrongOptionText: {
    color: BRAND_COLORS.negative,
    fontWeight: '500',
  },
  correctBadge: {
    marginLeft: 8,
  },
  wrongBadge: {
    marginLeft: 8,
  },
  explanationContainer: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  superheroExplanationContainer: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 3,
    borderLeftColor: BRAND_COLORS.secondary,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#555555',
  },
  actionButtons: {
    marginBottom: 30,
  },
  checkButton: {
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  superheroCheckButton: {
    backgroundColor: BRAND_COLORS.secondary,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  checkButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  superheroNextButton: {
    backgroundColor: BRAND_COLORS.secondary,
  },
  nextButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Results styles
  resultsContainer: {
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  resultsBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  superheroResultsBadge: {
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
    borderColor: BRAND_COLORS.secondary,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  resultsScore: {
    fontSize: 18,
    color: '#555555',
    marginBottom: 24,
  },
  xpReward: {
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 30,
  },
  xpRewardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  superheroMessage: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#DDDDFF',
  },
  superheroMessageText: {
    fontSize: 14,
    color: '#333366',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: BRAND_COLORS.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  superheroCloseButton: {
    backgroundColor: BRAND_COLORS.secondary,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Confetti styles
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
}); 