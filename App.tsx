import React = require('react');
import { Button, StyleSheet, View } from 'react-native';
import ConnectWearableScreen from './components/ConnectWearableScreen'

const App = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <ConnectWearableScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default App
