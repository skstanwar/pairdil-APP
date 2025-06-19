import { API_URL, SOCKET_URL } from '@/Config/env';
import { loadUserData } from '@/Hook/Userdata';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { io } from 'socket.io-client';
export const socket = io(SOCKET_URL);

// After socket connects, load user data and emit register_user
socket.on('connect', async () => {
  try {
    const userData = await loadUserData();
    const userId = userData?.user?._id;

    if (userId) {
      socket.emit('register_user', { userId });
    //   console.log('✅ Sent register_user event with userId:', userId);
    } else {
      console.warn('⚠️ userId not found in user data');
    }
  } catch (error) {
    console.error('❌ Error loading user data:', error);
  }
});

// update the USER_DATA obj triggered by partner
socket.on("receivesendpairidshared", async (data) => {
    const userData = await AsyncStorage.getItem('USER_DATA').then(data => JSON.parse(data));
     const token = userData.token;
    const profileRes = await axios.get(`${API_URL}/api/user/getprofile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    //   console.log("woooooooooooow", profileRes.data)
      const existingData = JSON.parse(await AsyncStorage.getItem('USER_DATA')) || {};
      alert("paired")
      // Step 3: Update USER_DATA with new user object
      const updatedData = {
        ...existingData,
        user: profileRes.data || existingData.user,
      };
      await AsyncStorage.setItem('USER_DATA', JSON.stringify(updatedData));
        console.log('✅ USER_DATA updated:', updatedData);
})
