import AsyncStorage from '@react-native-async-storage/async-storage';
export const saveUserData = async (obj: object) => {
  try {
    const jsonValue = JSON.stringify(obj);
    await AsyncStorage.setItem('USER_DATA', jsonValue);
  } catch (e) {
    console.error('Error saving user data:', e);
  }
};

export const loadUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('USER_DATA');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading user data:', e);
    return null;
  }
};