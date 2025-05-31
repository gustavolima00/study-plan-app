import Header from '@/components/Header';
import { Stopwatch } from '@/components/Stopwatch';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.pageContainer}>
      <Header />
      <ThemedView style={styles.container}>
        <Stopwatch />
      </ThemedView>
    </View>
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
});