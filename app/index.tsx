import {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import {loadUserData} from '@/Hook/Userdata';
import { Menu, Provider } from 'react-native-paper';
export default function IndexScreen() {
    const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = await loadUserData();
      if (user?.token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        router.replace('/auth/login'); // redirect if not logged in
      }
    };

    checkLoginStatus();
  }, []);

  if (!isLoggedIn) {
    return null; // Or a loading spinner
  }

  return (
    <Provider>
      <View style={styles.container}>
        {/* Header with profile icon and menu */}
        <View style={styles.header}>
          <Text style={styles.title}>Pairdil</Text>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Pressable onPress={openMenu}>
                <MaterialIcons name="account-circle" size={32} color="#333" />
              </Pressable>
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                router.push('/user/profile');
              }}
              title="Profile"
            />
            
            <Menu.Item
              onPress={() => {
                closeMenu();
                router.push('/services');
              }}
              title="Services"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                router.push('/qr-code');
              }}
              title="QR Code"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                router.push('/about');
              }}
              title="About"
            />
          </Menu>
        </View>

        {/* Main Content */}
        <View style={styles.body}>
          <Text style={styles.welcome}>Welcome to the app! 🎉</Text>
        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    color: '#333',
  },
});