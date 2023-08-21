import React = require('react');
import { Button, StyleSheet, View } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config'

async function provisionUser(): Promise<any> {
  const url = `https://api.v2.validic.com/organizations/${Config.ORG_ID}/users?token=${Config.TOKEN}`

  // const uid = existing_uid || create_uid();
  const uid = 'sample-uid-1'

  // use library to get real timezone/country in prod
  // react-native-device-info?
  const timezone = 'America/Los_Angeles'
  const country_code = 'US'

  const response = await axios.post(url, {
    uid,
    location: {
      timezone,
      country_code,
    },
  })

  console.log(response)
}

const App = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Button
        title="print to console"
        onPress={() => { console.log(Config.ORG_ID) }}
      />
      <Button
        title="provision"
        onPress={() => {
          provisionUser()
          .catch((e) => {
            console.log(e)
          })
        }}
      />
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

export default App;
