import { API_URL } from '@/Config/env';
import { socket } from '@/Hook/socker.connect';
import { loadUserData } from '@/Hook/Userdata';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
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
    //  console.log(result.data)
    try {
      const res = await axios.post(
        `${API_URL}/api/pair/paircodeverify`,
        { code: result.data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        console.log('✅ Code verified');
  
        // Step 2: Get updated profile
        const profileRes = await axios.get(`${API_URL}/api/user/getprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log("newdata", profileRes.data)
        const existingData = JSON.parse(await AsyncStorage.getItem('USER_DATA')) || {};
  
        // Step 3: Update USER_DATA with new user object
        const updatedData = {
          ...existingData,
          user: profileRes.data || existingData.user,
        };


        //  send notification to the partner's device
        (async () => {
          try {
            const userData = await loadUserData();
            const userId = userData?.user?._id;
            const partnerId = userData?.user?.partnerId;
        
            if (userId) {
              socket.emit('sendpairid', { userId,partnerId });
              console.log('✅ Sent sendpairid with userId:', userId);
            } else {
              console.warn('⚠️ userId not found in user data');
            }
          } catch (err) {
            console.error('❌ Failed to emit sendpairid:', err);
          }
        })();
        
        await AsyncStorage.setItem('USER_DATA', JSON.stringify(updatedData));
        console.log('✅ USER_DATA updated:', updatedData);
  
        return updatedData;
      } else {
        console.warn('❌ Invalid status code:', res.status);
      }
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
          autoFocus="on"
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
