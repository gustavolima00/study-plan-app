import { apiClient } from '@/services/apiClient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

const IndexScreen: React.FC = () => {
    const loadAuthenticatedState = async () => {
        try {
            const isAuthenticated = await apiClient.isAuthenticated()
            if (isAuthenticated) {
                router.replace('/(tabs)');
            } else {
                router.replace('/login');
            }
        } catch (e) {
            if (e instanceof Error) {
                Alert.alert("error", e.message);
            } else {
                console.error(e)
            }
            router.replace('/login');
        }
    }

    useEffect(() => {
        loadAuthenticatedState()
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.text}>Carregando...</Text>
                <Text style={styles.subtext}>Por favor, aguarde</Text>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 24,
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginTop: 16,
    },
    subtext: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 8,
    },
});

export default IndexScreen;