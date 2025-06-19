import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, FlatList, Button, TouchableOpacity } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { loadUserData } from '@/Hook/Userdata';
import { Menu, Provider } from 'react-native-paper';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from '@/Hook/socker.connect';
export default function IndexScreen() {
  
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = await loadUserData();
      
      if (user?.token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        router.replace('/auth/login');
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    socket.on('receive_msg', ({ userId, msg }) => {
      setChatLog(prev => [...prev, `${userId}: ${msg}`]);
    });

    socket.on('receive_feeling', ({userId, feeling }) => {
      setChatLog(prev => [...prev, `${userId}💌 Feeling: ${feeling}`]);
    });

    socket.on('receive_location', ({userId, coordinates }) => {
      setChatLog(prev => [...prev, `${userId}📍 Location: (${coordinates})`]);
    });

    return () => {
      socket.off('receive_msg');
      socket.off('receive_feeling');
      socket.off('receive_location');
    };
  }, []);
const [name, setName] = useState('You');
const [partnerId, setpartnerId] = useState('NULL');

useEffect(() => {
  AsyncStorage.getItem('USER_DATA')
    .then(data => {
      const userData = JSON.parse(data || '{}');
      setName(userData?.user?.name || 'You');
      setpartnerId(userData?.user?.partnerId || 'NULL');
    });
}, []);
const userId = name;
  const sendMessage = () => {
    if (message.trim()) {
      
      socket.emit('send_message', { userId,partnerId, msg: message });
      setChatLog(prev => [...prev, `You: ${message}`]);
      setMessage('');
    }
  };

  const sendFeeling = (feeling: string) => {
    socket.emit('send_feeling', {userId,partnerId, feeling });
    setChatLog(prev => [...prev, `💌 Your Feeling: ${feeling}`]);
  };

  const shareLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Location permission denied');
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  const lat = location.coords.latitude;
  const lon = location.coords.longitude;

  socket.emit('send_location', {
    userId,
    partnerId, // or replace with the correct identifier
    coordinates: [lat, lon]
  });

  setChatLog(prev => [
    ...prev,
    `📍 You shared location: (${lat.toFixed(4)}, ${lon.toFixed(4)})`
  ]);
};


  if (!isLoggedIn) {
    return null;
  }

  return (
    <Provider>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pairdil</Text>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Pressable onPress={openMenu} style={{ backgroundColor: 'red', padding: 10 }}>
              <MaterialIcons name="account-circle" size={32} color="#000000" />
            </Pressable>
            }
          >
            <Menu.Item onPress={() => { closeMenu(); router.push('/user/profile'); }} title="Profile" />
            <Menu.Item onPress={() => { closeMenu(); router.push('/services'); }} title="Services" />
            <Menu.Item onPress={() => { closeMenu(); router.push('/qr-code'); }} title="QR Code" />
            <Menu.Item onPress={() => { closeMenu(); router.push('/about'); }} title="About" />
            <Menu.Item onPress={() => { closeMenu(); router.push('/setting'); }} title="Setting" />
          </Menu>
        </View>

        {/* Body: Chat Panel */}
        <View style={styles.body}>
          <FlatList
            data={chatLog}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
            contentContainerStyle={{ paddingBottom: 120 }}
          />

          {/* Attachment Buttons */}
          <View style={styles.attachments}>
            <TouchableOpacity style={styles.emojiBtn} onPress={() => sendFeeling('😊')}>
              <Text>😊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emojiBtn} onPress={() => sendFeeling('😢')}>
              <Text>😢</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emojiBtn} onPress={() => sendFeeling('❤️')}>
              <Text>❤️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emojiBtn} onPress={shareLocation}>
              <MaterialIcons name="location-on" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Input Panel */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  body: { flex: 1, paddingHorizontal: 10, paddingBottom: 60 },
  message: {
    fontSize: 16,
    marginVertical: 4,
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: { flex: 1, height: 40 },
  attachments: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  emojiBtn: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
