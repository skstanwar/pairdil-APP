import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Pairdil</Text>
      <Text style={styles.paragraph}>
        Pairdil is a modern mobile app designed to strengthen connections and simplify communication between loved ones. 
        Whether you're sharing your thoughts, tracking locations, or planning time together, Pairdil is built to support meaningful relationships.
      </Text>

      <Text style={styles.subtitle}>Key Features</Text>
      <Text style={styles.listItem}>• Live Chat and Video Calls</Text>
      <Text style={styles.listItem}>• Real-time Location Sharing</Text>
      <Text style={styles.listItem}>• Shared Movie & Music Rooms</Text>
      <Text style={styles.listItem}>• Status Updates & Profiles</Text>

      <Text style={styles.footer}>
        Made with ❤️ by the Pairdil Team.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#444',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginLeft: 10,
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
});
