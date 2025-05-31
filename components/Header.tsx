import AppLogo from "@/components/AppLogo";
import { useThemeColor } from "@/hooks/useThemeColor";
import AntDesign from '@expo/vector-icons/AntDesign';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface HeaderProps {
    title?: string;
    subTitle?: string;
    showBackButton?: boolean;
    showLogo?: boolean;
    onBackButtonPress?: () => void;
    headerEndComponent?: () => React.ReactNode;
    showEditButton?: boolean;
    onEditButtonPress?: () => void;
}

export default function Header({
    title = "Study App",
    subTitle = "",
    showBackButton: backVisible = false,
    showLogo = false,
    onBackButtonPress = () => { },
    headerEndComponent = () => null,
}: HeaderProps) {
    const backgroundColor = useThemeColor({ light: '#1E88E5', dark: '#121212' }, 'background');
    const tintColor = useThemeColor({ light: '#FFFFFF', dark: '#BB86FC' }, 'text');
    return (
        <View style={[{ backgroundColor: backgroundColor }, styles.header]}>
            <View style={styles.contentContainer}>
                {backVisible && (
                    <TouchableOpacity onPress={onBackButtonPress} style={styles.iconButton}>
                        <AntDesign name="arrowleft" size={24} color={tintColor} />
                    </TouchableOpacity>
                )}
                <View style={styles.centerContainer}>
                    {showLogo && (
                        <View style={{ marginRight: 15 }}>
                            <AppLogo size={30} />
                        </View>
                    )}
                    <View>
                        <Text style={[styles.title, { color: tintColor }]}>
                            {title}
                        </Text>
                        {subTitle ? (
                            <Text style={[styles.subTitle, { color: tintColor }]}>
                                {subTitle}
                            </Text>
                        ) : null}
                    </View>
                </View>
                {headerEndComponent()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        minHeight: 90,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        paddingTop: 40,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
        justifyContent: "space-between",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "space-between",
    },
    centerContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    iconButton: {
        padding: 8,
        marginRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    subTitle: {
        fontSize: 12,
        textAlign: "center",
    },
});