import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import { API_URL } from '@/Config/Env'

export default function QRCodeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [generatedID, setGeneratedID] = useState<string | null>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    setScanning(false);
     const userData = await AsyncStorage.getItem('USER_DATA').then(data => JSON.parse(data));
     const token = userData.token;
     console.log(result.data)
    try {
      const res = await axios.post(
        `${API_URL}/api/pair/paircodeverify`,
        { code: result.data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res)
    } catch (error) {
      console.error('QR verification error:', error);
      Alert.alert('Error', 'Invalid QR code');
    }
  };

  const handleGenerateQRCode = async () => {
    const userData = await AsyncStorage.getItem('USER_DATA').then(data => JSON.parse(data));
    const token = userData.token;
    try {
      const res = await axios.get(`${API_URL}/api/pair/paircodegenerator`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.publicID) {
        setGeneratedID(res.data.publicID);
      }
    } catch (error) {
      console.error('QR generate error:', error);
      Alert.alert('Error', 'Could not generate QR code');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code Page</Text>

      <Button title="Scan QR Code" onPress={() => setScanning(true)} />
      <Button title="Generate QR Code" onPress={handleGenerateQRCode} />

      {scanning && permission?.granted && (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
      )}

      {generatedID && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrText}>Generated QR Code:</Text>
          <QRCode value={generatedID} size={200} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  camera: { width: '100%', height: 300 },
  qrContainer: { alignItems: 'center', marginTop: 20 },
  qrText: { fontSize: 16, marginBottom: 10 },
});
