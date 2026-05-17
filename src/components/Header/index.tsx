// src/components/Header/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

interface HeaderProps {
  title: string;
  showMenu?: boolean;
}

export function Header({ title, showMenu = true }: HeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setMenuVisible(false);
    router.replace('/');
  };

  const handleProfile = () => {
    setMenuVisible(false);
    router.push('/perfil');
  };

  const handleHome = () => {
    setMenuVisible(false);
    router.push('/dashboard');
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showMenu && (
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={28} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={28} color={colors.gray[700]} />
              </TouchableOpacity>
            </View>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleHome}
            >
              <Ionicons
                name="home-outline"
                size={24}
                color={colors.primary}
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleProfile}
            >
              <Ionicons
                name="person-outline"
                size={24}
                color={colors.primary}
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>Perfil</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={24}
                color={colors.error}
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemTextDanger}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.headingMedium,
    color: colors.white,
  },
  menuButton: {
    padding: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: colors.white,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: spacing.xxl,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  menuTitle: {
    ...typography.headingSmall,
    color: colors.gray[900],
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginVertical: spacing.sm,
  },
  menuItemDanger: {
    backgroundColor: '#FEE2E2',
  },
  menuIcon: {
    marginRight: spacing.lg,
  },
  menuItemText: {
    ...typography.titleMedium,
    color: colors.gray[900],
  },
  menuItemTextDanger: {
    ...typography.titleMedium,
    color: colors.error,
  },
});
