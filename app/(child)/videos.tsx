import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getChildById } from '@/app/mock-data';

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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Check if running on web
const isWeb = Platform.OS === 'web';

// Define local video interface
interface LocalVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: any; // This will be a require() result, which is compatible with AVPlaybackSource
  thumbnailUrl: string;
  duration: string;
  likes: number;
  views: number;
  tags: string[];
  forAgeGroups: number[];
}

// Local videos from assets/videos folder
const LOCAL_VIDEOS: LocalVideo[] = [
  {
    id: 'local1',
    title: 'Financial Education Video 1',
    description: 'Learn about managing your finances',
    videoUrl: require('../../assets/videos/video1.mp4'),
    thumbnailUrl: "",
    duration: "3:20",
    likes: 1254,
    views: 4865,
    tags: ["finance", "education", "money"],
    forAgeGroups: [12, 13, 14, 15, 16, 17]
  },
  {
    id: 'local2',
    title: 'Financial Education Video 2',
    description: 'Tips for saving money wisely',
    videoUrl: require('../../assets/videos/video2.mp4'),
    thumbnailUrl: "",
    duration: "2:45",
    likes: 984,
    views: 3672,
    tags: ["finance", "saving", "tips"],
    forAgeGroups: [12, 13, 14, 15, 16, 17]
  }
];

export default function VideosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [videos] = useState<LocalVideo[]>(LOCAL_VIDEOS);
  const childData = getChildById(MOCK_CHILD_ID);
  
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  // References for the FlatList and videos
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<{[key: string]: any}>({});

  // Function to pause all videos
  const pauseAllVideos = useCallback(() => {
    if (!isWeb) {
      Object.keys(videoRefs.current).forEach(key => {
        const ref = videoRefs.current[key];
        if (ref && typeof ref.pauseAsync === 'function') {
          ref.pauseAsync().catch((err: Error) => console.log('Pause error:', err));
        }
      });
    }
  }, []);

  // Detect when screen loses focus and pause videos
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      
      return () => {
        setIsScreenFocused(false);
        pauseAllVideos();
      };
    }, [pauseAllVideos])
  );

  // Reset StatusBar on unmount
  useEffect(() => {
    return () => {
      // Restore status bar when leaving the screen
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
    };
  }, []);

  // Function to handle video visibility changes
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && isScreenFocused) {
      const visibleVideo = viewableItems[0];
      const index = visibleVideo.index || 0;
      setActiveVideoIndex(index);
      
      // Don't try to control playback using refs on web platform
      if (!isWeb) {
        // Play the visible video and pause others
        Object.keys(videoRefs.current).forEach(key => {
          const ref = videoRefs.current[key];
          if (ref && typeof ref.playAsync === 'function' && typeof ref.pauseAsync === 'function') {
            if (key === videos[index].id) {
              ref.playAsync().catch((err: Error) => console.log('Play error:', err));
            } else {
              ref.pauseAsync().catch((err: Error) => console.log('Pause error:', err));
            }
          }
        });
      }
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80
  };

  // Toggle mute/unmute for all videos
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // Don't try to control mute using refs on web platform
    if (!isWeb) {
      // Apply mute state to all videos
      Object.keys(videoRefs.current).forEach(key => {
        const ref = videoRefs.current[key];
        if (ref && typeof ref.setIsMutedAsync === 'function') {
          ref.setIsMutedAsync(!isMuted).catch((err: Error) => console.log('Mute error:', err));
        }
      });
    }
  };
  
  // Format numbers for UI display (e.g., 1.2K, 5.7M)
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Render a video item in the FlatList
  const renderItem = ({ item, index }: { item: LocalVideo, index: number }) => {
    return (
      <View style={[styles.videoContainer, { height: SCREEN_HEIGHT }]}>
        {/* Video player */}
        <Video
          ref={(ref) => {
            if (ref) {
              videoRefs.current[item.id] = ref;
            }
          }}
          style={styles.video}
          source={item.videoUrl}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted={isMuted}
          shouldPlay={index === activeVideoIndex && isScreenFocused}
          useNativeControls={false}
        />
        
        {/* Video content overlay */}
        <View style={[styles.contentOverlay, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
          {/* Video information - right aligned */}
          <View style={styles.videoInfo}>
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, idx) => (
                <View key={idx} style={styles.tagContainer}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
          
          {/* Right side action buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <AntDesign name="heart" size={28} color="#FFFFFF" />
              <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="message-circle" size={28} color="#FFFFFF" />
              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social" size={28} color="#FFFFFF" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Mute/unmute button */}
        <TouchableOpacity 
          style={[styles.muteButton, { bottom: insets.bottom + 40 }]} 
          onPress={toggleMute}
        >
          <Ionicons name={isMuted ? "volume-mute" : "volume-medium"} size={22} color="#FFFFFF" />
        </TouchableOpacity>
        
        {/* Progress bar */}
        <View style={[styles.progressBarContainer, { bottom: insets.bottom }]}>
          <View style={[styles.progressBar, { width: `${Math.random() * 100}%` }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Video feed */}
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        windowSize={3}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        removeClippedSubviews={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    position: 'relative',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  contentOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 80,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  videoDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 8,
    opacity: 0.8,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tagContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  muteButton: {
    position: 'absolute',
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  progressBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: BRAND_COLORS.primary,
  }
}); 