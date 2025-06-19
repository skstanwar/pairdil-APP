import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { socket } from '@/Hook/socker.connect';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { healthdata } from '@/Hook/health';
export default function Services() {
  const [healthData, setHealthData] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);


  // 🧠 Simulate health data (replace this with real sensor values if needed)
  const generateHealthData = () => {
    return {
      heartRate: Math.floor(60 + Math.random() * 40),         // 60–100 bpm
      steps: Math.floor(1000 + Math.random() * 500),          // Steps
      sleepHours: +(6 + Math.random() * 2).toFixed(1),        // 6–8 hours
      caloriesBurned: Math.floor(200 + Math.random() * 100)   // 200–300 kcal
    };
  };
  // 🔁 Send health data every 10 seconds when ON
  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(() => {
        const health = generateHealthData();
        const userId = 'user123'; // Replace with real userId if needed
        
        socket.emit('send_health', { userId, health });
      }, 10000); // 10 sec
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isStreaming]);

  // 📥 Listen for incoming health data
  useEffect(() => {
    const handleHealth = ({ userId, health }) => {
      const timestamp = new Date().toLocaleTimeString();
      setHealthData(prev => [...prev, { ...health, time: timestamp }]);
    };

    socket.on('receive_health', handleHealth);

    return () => {
      socket.off('receive_health', handleHealth);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Live Health Monitor</Text>
      <Button
        title={isStreaming ? '🛑 Stop Health Stream' : '▶️ Start Health Stream'}
        onPress={() => setIsStreaming(!isStreaming)}
        color={isStreaming ? 'red' : 'green'}
      />

      {/* Charts */}
      <ChartSection title="Heart Rate" dataKey="heartRate" stroke="#ff1744" data={healthData} />
      <ChartSection title="Steps" dataKey="steps" stroke="#00c853" data={healthData} />
      <ChartSection title="Calories Burned" dataKey="caloriesBurned" stroke="#ff9100" data={healthData} />
    </ScrollView>
  );
}
interface ChartSectionProps {
  title: string;
  dataKey: string;
  stroke: string;
  data: any[]; // You can replace `any[]` with a proper health data type if needed
}

function ChartSection({
  title,
  dataKey,
  stroke,
  data
}: {
  title: string;
  dataKey: string;
  stroke: string;
  data: any[];
}) {
  return (
    <View style={styles.chartWrapper}>
      <Text style={styles.chartTitle}>{title}</Text>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} />
        </LineChart>
      </ResponsiveContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  chartWrapper: {
    height: 250,
    marginTop: 32
  },
  chartTitle: {
    fontSize: 16,
    marginBottom: 8
  }
});
