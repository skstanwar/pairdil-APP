import { Platform, Alert } from 'react-native';
import UsageStats from 'react-native-usage-stats';

const requestUsagePermission = async () => {
  if (Platform.OS === 'android') {
    const isGranted = await UsageStats.checkPermission();
    if (!isGranted) {
      Alert.alert(
        'Permission Required',
        'Please enable Usage Access for this app in settings.',
        [
          { text: 'Open Settings', onPress: () => UsageStats.openUsageAccessSettings() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  }
};

const getTopUsedAppsToday = async () => {
  const now = new Date();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const stats = await UsageStats.getUsageStats(startOfDay.getTime(), now.getTime());

  const filtered = stats
    .filter(app => app.packageName !== 'android' && app.totalTimeInForeground > 0)
    .sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground)
    .slice(0, 3)
    .map(app => ({
      packageName: app.packageName,
      usageMinutes: Math.round(app.totalTimeInForeground / (1000 * 60))
    }));

  return filtered;
};

const getTotalScreenTime = async () => {
  const now = new Date();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const stats = await UsageStats.getUsageStats(startOfDay.getTime(), now.getTime());

  const totalTime = stats.reduce((sum, app) => sum + (app.totalTimeInForeground || 0), 0);

  return Math.round(totalTime / (1000 * 60)); // in minutes
};

export const DigitalActivity = async () => {
  await requestUsagePermission();

  const topApps = await getTopUsedAppsToday();
  const screenTime = await getTotalScreenTime();

  return {
    date: new Date().toISOString().split('T')[0],
    totalScreenTimeMinutes: screenTime,
    topUsedApps: topApps
  };
};
