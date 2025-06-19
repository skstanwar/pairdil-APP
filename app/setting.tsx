import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { DigitalActivity } from '@/Hook/DigitalActivity';

export default function DigitalActivityView() {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const result = await DigitalActivity();
    setData(result);
    console.log('📊 Digital activity:', result);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📱 Digital Activity</Text>

      <Button title="🔄 Refresh Data" onPress={fetchData} />

      {data && (
        <View style={styles.box}>
          <Text style={styles.label}>📅 Date:</Text>
          <Text style={styles.value}>{data.date}</Text>

          <Text style={styles.label}>🕒 Screen Time:</Text>
          <Text style={styles.value}>{data.totalScreenTimeMinutes} minutes</Text>

          <Text style={styles.label}>🔥 Top 3 Apps:</Text>
          {data.topUsedApps.map((app: any, index: number) => (
            <Text key={index} style={styles.value}>
              {index + 1}. {app.packageName} — {app.usageMinutes} mins
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginLeft: 10,
  },
});
