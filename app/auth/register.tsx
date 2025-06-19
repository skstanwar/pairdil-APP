import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { API_URL } from '@/Config/env'

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: 'male',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/user/register`, form);
      console.log('Register success:', res.data);
      // Navigate to login page after successful registration
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Register</Text>

      <TextInput
        label="Name"
        value={form.name}
        onChangeText={(v) => setForm({ ...form, name: v })}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={form.email}
        onChangeText={(v) => setForm({ ...form, email: v })}
        style={styles.input}
      />
      <TextInput
        label="Phone"
        value={form.phone}
        onChangeText={(v) => setForm({ ...form, phone: v })}
        style={styles.input}
      />
      <TextInput
        label="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(v) => setForm({ ...form, password: v })}
        style={styles.input}
      />

      <RadioButton.Group
        onValueChange={(v) => setForm({ ...form, gender: v })}
        value={form.gender}
      >
        <View style={styles.radioRow}>
          <RadioButton value="male" />
          <Text>Male</Text>
          <RadioButton value="female" />
          <Text>Female</Text>
        </View>
      </RadioButton.Group>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" onPress={handleRegister} loading={loading}>
        Register
      </Button>

      {/* 🔁 Button to go to Login page */}
      <Button mode="text" onPress={() => router.push('/auth/login')} style={styles.loginBtn}>
        Already have an account? Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, justifyContent: 'center' },
  input: { marginBottom: 12 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  error: { color: 'red', marginBottom: 10 },
  loginBtn: { marginTop: 10 },
});
