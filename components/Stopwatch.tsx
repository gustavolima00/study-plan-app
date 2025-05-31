import { stopwatchService } from '@/services/stopwatchService';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView, ThemedViewProps } from './ThemedView';

export type StopwatchProps = ThemedViewProps & {
  onFinishSession?: () => void
};

export function Stopwatch(props: StopwatchProps) {
  const {
    style,
    children,
    onFinishSession = () => { },
    ...otherProps
  } = props;

  const tickMS = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const lastUpdateRef = useRef(Date.now());
  const animationFrameRef = useRef<number>(0);

  // Load initial state
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const stopWatchInfo = await stopwatchService.getStopwatchInfo();
        setTime(stopWatchInfo.elapsedTime);
        setIsRunning(stopWatchInfo.isRunning);
        lastUpdateRef.current = Date.now() - stopWatchInfo.elapsedTime;
      } catch (error) {
        console.error("Failed to load stopwatch state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialState();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animation loop for smooth updates
  const updateTime = () => {
    const now = Date.now();
    const delta = now - lastUpdateRef.current;
    lastUpdateRef.current = now;
    setTime(prev => prev + delta);
    animationFrameRef.current = requestAnimationFrame(updateTime);
  };

  useEffect(() => {
    if (isRunning) {
      lastUpdateRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  // Optimized event handlers with minimal delay
  const handleStart = async () => {
    const at = Date.now();
    lastUpdateRef.current = at;
    setIsRunning(true);
    // Fire and forget - don't wait for API response
    stopwatchService.startNewSession(at, "test session").catch(console.error);
  };

  const handleResume = async () => {
    const at = Date.now();
    lastUpdateRef.current = at;
    setIsRunning(true);
    stopwatchService.recordEvent("resume", at).catch(console.error);
  };

  const handlePause = async () => {
    const at = Date.now();
    setIsRunning(false);
    stopwatchService.recordEvent("pause", at).catch(console.error);
  };

  const handleStop = async () => {
    const at = Date.now();
    setIsRunning(false);
    setTime(0);
    try {
      await stopwatchService.finishCurrentSession(at);
      onFinishSession();
    } catch (error) {
      console.error("Failed to finish session:", error);
    }
  };

  const formatTime = (timeInMs: number) => {
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 100);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
        .toString()
        .padStart(1, '0')}`;
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <ThemedView {...otherProps}>
      <ThemedText type="title">
        {formatTime(time)}
      </ThemedText>

      <View style={styles.buttonRow}>
        {!isRunning ? (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={() => {
              time === 0 ? handleStart() : handleResume();
            }}
          >
            <Entypo name="controller-play" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.pauseButton]}
            onPress={handlePause}
          >
            <AntDesign name="pause" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={handleStop}
          disabled={time === 0}
        >
          <Entypo name="controller-stop" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  stopwatchContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 30,
    fontVariant: ['tabular-nums'], // Monospaced numbers
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#4CAF50', // Green
  },
  pauseButton: {
    backgroundColor: '#FFC107', // Amber
  },
  stopButton: {
    backgroundColor: '#F44336', // Red
  },
  lapButton: {
    backgroundColor: '#2196F3', // Blue
  },
  lapsContainer: {
    width: '100%',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  lapsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lapText: {
    fontSize: 16,
  },
  lapTime: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
});