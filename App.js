/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { createOneTimeInfo, init, createConnectionWithInvite } from './app/bridge/RNCXs'

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.body}>
            <Text style={styles.sectionDescription}>Check console.log for test results</Text>
            <View style={styles.sectionContainer}>
              <Button title="Create wallet" onPress={createWallet} />
            </View>
            <View style={styles.sectionContainer}>
              <Button title="Make connection" onPress={createConnection} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

async function createWallet() {
  console.log('createWallet() onPress')
  try {
    const agencyConfig = {
      agencyUrl: 'http://192.168.1.35:8080',
      agencyDID: 'VsKV7grR1BUE29mG2Fm2kX',
      agencyVerificationKey: 'Hezce2UWMZ3wUhVkh2LfKSs8nDzWwzs2Win7EzNN3YaR',
    }
    const oneTimeRes = await createOneTimeInfo(agencyConfig)
    console.log('One time result: ', oneTimeRes)
    const initConfig = {
      ...agencyConfig,
      ...oneTimeRes,
    }
    const initResult = await init(initConfig)
    console.log('initResult', initResult)
  } catch (e) {
    console.warn(e)
  }
}

async function createConnection() {
  console.log('createConnectionWithInvite() onPress')
  try {
    const res = await createConnectionWithInvite()
    console.log('connection status: ', res)
  } catch (e) {
    console.warn(e)
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
})

export default App
