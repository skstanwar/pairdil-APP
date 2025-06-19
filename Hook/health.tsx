import {
    getGrantedPermissions,
    requestPermission,
    readRecords,
    HealthConnectSupportedPermissions,
    HealthConnectDataType
  } from 'react-native-health-connect';
  
  const permissions: HealthConnectSupportedPermissions[] = [
    { accessType: 'read', recordType: 'HeartRate' },
    { accessType: 'read', recordType: 'Steps' },
    { accessType: 'read', recordType: 'TotalCaloriesBurned' },
    { accessType: 'read', recordType: 'SleepSession' },
    { accessType: 'read', recordType: 'OxygenSaturation' },
    { accessType: 'read', recordType: 'BodyTemperature' }
  ];
  
  export const healthdata = async () => {
    try {
      const granted = await getGrantedPermissions();
  
      if (granted.length === 0) {
        console.log('⛔ No permissions granted, requesting...');
        await requestPermission(permissions);
      }
  
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
  
      // Fetch data safely and log each for debugging
      const heartRate = await readRecords(HealthConnectDataType.HeartRate, {
        timeRangeFilter: { operator: 'between', startTime: oneHourAgo, endTime: now }
      });
      console.log('❤️ HeartRate:', heartRate);
  
      const steps = await readRecords(HealthConnectDataType.Steps, {
        timeRangeFilter: { operator: 'between', startTime: oneHourAgo, endTime: now }
      });
      console.log('👟 Steps:', steps);
  
      const calories = await readRecords(HealthConnectDataType.TotalCaloriesBurned, {
        timeRangeFilter: { operator: 'between', startTime: oneHourAgo, endTime: now }
      });
      console.log('🔥 Calories:', calories);
  
      const sleep = await readRecords(HealthConnectDataType.SleepSession, {
        timeRangeFilter: { operator: 'between', startTime: twelveHoursAgo, endTime: now }
      });
      console.log('💤 Sleep:', sleep);
  
      const oxygen = await readRecords(HealthConnectDataType.OxygenSaturation, {
        timeRangeFilter: { operator: 'between', startTime: oneHourAgo, endTime: now }
      });
      console.log('🩸 Oxygen:', oxygen);
  
      const temp = await readRecords(HealthConnectDataType.BodyTemperature, {
        timeRangeFilter: { operator: 'between', startTime: oneHourAgo, endTime: now }
      });
      console.log('🌡️ Temperature:', temp);
  
      return {
        heartRate: heartRate?.[0]?.samples?.[0]?.beatsPerMinute ?? 0,
        steps: steps.reduce((sum, s) => sum + (s.count ?? 0), 0),
        caloriesBurned: calories.reduce((sum, c) => sum + (c.energy?.inKilocalories ?? 0), 0),
        sleepHours: sleep.reduce((sum, s) => {
          const duration = new Date(s.endTime).getTime() - new Date(s.startTime).getTime();
          return sum + duration / (1000 * 60 * 60); // convert ms to hours
        }, 0).toFixed(1),
        bloodOxygen: oxygen?.[0]?.percentage ?? 0,
        bodyTemp: temp?.[0]?.temperature?.inCelsius ?? 0
      };
    } catch (err) {
      console.error('❌ Health data error:', err);
      return {
        heartRate: 0,
        steps: 0,
        caloriesBurned: 0,
        sleepHours: 0,
        bloodOxygen: 0,
        bodyTemp: 0
      };
    }
  };
  