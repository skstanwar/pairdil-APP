import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { loadUserData } from '@/Hook/Userdata';

type UserType = {
  name: string;
  email: string;
  gender: string;
  phone: string;
  statusMessage: string;
  partnerId: string;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadUserData();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchData();
  }, []);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Loading user profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/icon.png')} // replace with real or default image
        style={styles.profileImage}
      />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.label}>Name: <Text style={styles.value}>{user.name}</Text></Text>
      <Text style={styles.label}>Email: <Text style={styles.value}>{user.email}</Text></Text>
      <Text style={styles.label}>Gender: <Text style={styles.value}>{user.gender}</Text></Text>
      <Text style={styles.label}>Phone: <Text style={styles.value}>{user.phone}</Text></Text>
      <Text style={styles.label}>PartnerID: <Text style={styles.value}>{user.partnerId}</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}>{user.statusMessage || 'No status set'}</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  profileImage: {
    width: 100, height: 100, borderRadius: 50, marginBottom: 20,
  },
  name: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 10,
  },
  label: {
    fontSize: 16, marginTop: 8, fontWeight: '600',
  },
  value: {
    fontWeight: 'normal',
  },
});
