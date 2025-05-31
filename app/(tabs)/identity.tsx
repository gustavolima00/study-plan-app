import Header from '@/components/Header';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserFacingError } from '@/errors/UserFacingError';
import { UserInfo } from '@/models/auth';
import { apiClient } from '@/services/apiClient';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userInfo = await apiClient.getUserInfo();
      setUser(userInfo);
    } catch (e) {
      if (e instanceof UserFacingError) {
        Alert.alert(e.title, e.description);
      } else {
        console.error(e);
      }
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])
  const logoutAndRedirect = async () => {
    try {
      await apiClient.logout()
      router.replace('/login');
    } catch (e) {
      if (e instanceof UserFacingError) {
        Alert.alert(e.title, e.description);
      } else {
        console.error(e)
      }

    }
  }

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: () => logoutAndRedirect()
        }
      ]
    );
  };

  return (
    <View>
      <Header
        title={'Account info'}
      />
      <ThemedScrollView >
        <ThemedView style={{ height: 50 }} />
        <ThemedView style={styles.profileContainer}>
          {/* Profile Header */}
          <ThemedView style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://picsum.photos/200/300' }}
              style={styles.avatar}
              contentFit="cover"
              transition={1000}
            />
            <ThemedText type="title" style={styles.userName}>
              {user?.name || user?.preferred_username || 'Usuário'}
            </ThemedText>
            <ThemedText style={styles.userEmail}>
              {user?.email || 'email@exemplo.com'}
            </ThemedText>
          </ThemedView>

          {/* User Info Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Informações Pessoais
            </ThemedText>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Nome completo:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user?.name || 'Não informado'}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>E-mail:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user?.email || 'Não informado'}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>E-mail verificado:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user?.email_verified ? 'Sim' : 'Não'}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Settings Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Configurações
            </ThemedText>

            <TouchableOpacity style={styles.settingItem}>
              <MaterialIcons name="security" size={24} color="#808080" />
              <ThemedText style={styles.settingText}>Privacidade e Segurança</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <MaterialIcons name="help" size={24} color="#808080" />
              <ThemedText style={styles.settingText}>Ajuda e Suporte</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <MaterialIcons name="logout" size={24} color="#fff" />
            <ThemedText style={styles.logoutButtonText}>
              {isLoading ? 'Saindo...' : 'Sair da Conta'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  profileContainer: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});