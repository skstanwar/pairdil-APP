import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { API_URL } from '@/Config/Env'
import { saveUserData } from '@/Hook/Userdata';
export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/user/login`, { email, password });
      saveUserData(res.data)
      router.replace('/');
      // Navigate to home or dashboard here
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Login</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Button mode="contained" onPress={handleLogin} loading={loading}>
        Login
      </Button>

      {/* ➕ Register Button */}
      <Button mode="text" onPress={() => router.push('/auth/register')} style={styles.registerBtn}>
        Don't have an account? Register
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, justifyContent: 'center' },
  input: { marginBottom: 12 },
  error: { color: 'red', marginBottom: 10 },
  registerBtn: { marginTop: 10 },
});
