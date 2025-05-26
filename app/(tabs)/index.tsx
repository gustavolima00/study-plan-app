import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F8FAFC', dark: '#1E293B' }}
      headerImage={
        <Image
          source={{ uri: 'https://picsum.photos/200/300' }} // Replace with your image
          style={styles.headerImage}
          contentFit="cover"
        />
      }>
      <ThemedView style={styles.container}>
        {/* Welcome Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="title" style={styles.title}>
            Welcome to Our App
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            The perfect starting point for your mobile experience
          </ThemedText>
        </ThemedView>

        {/* Main Content Placeholder */}
        <ThemedView style={styles.placeholderContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/200/300' }}
            style={styles.placeholderImage}
            contentFit="contain"
          />
          <ThemedText style={styles.placeholderText}>
            Your content will appear here
          </ThemedText>
        </ThemedView>

        {/* CTA Section */}
        <ThemedView style={styles.ctaContainer}>
          <ThemedText type="subtitle" style={styles.ctaText}>
            Ready to get started?
          </ThemedText>
          <ThemedText style={styles.ctaSubtext}>
            Explore the app to discover all features
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerImage: {
    height: 250,
    width: '100%',
  },
  section: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    opacity: 0.7,
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 18,
    color: '#94A3B8',
    textAlign: 'center',
  },
  ctaContainer: {
    marginTop: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  ctaSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});