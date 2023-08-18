import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

async function provisionUser() {
  const url = `https://api.v2.validic.com/organizations/${process.env.ORD_ID}/users?token=${process.env.TOKEN}`;

  // const uid = existing_uid || create_uid();
  const uid = "sample-uid-1"

  // use react-native-device-info in production
  const timezone = "America/Los_Angeles";
  const country_code = "US";

  const response = await axios.post(url, {
    "uid": uid,
    "location": {
      "timezone": timezone,
      "country_code": country_code,
    }
  });

  const data = response.data;
}

const App = () => {
  return (
    <View style={styles.container}>
      <Button 
        title="print to console"
        onPress={() => console.log("hello")}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;