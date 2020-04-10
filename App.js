/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, ToastAndroid } from 'react-native'

import indy from 'rn-indy-sdk'

import { Colors } from 'react-native/Libraries/NewAppScreen'

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
              <Button title="Open wallet" onPress={openWallet} />
            </View>
            <View style={styles.sectionContainer}>
              <Button title="DID wallet" onPress={DIDWallet} />
            </View>
            <View style={styles.sectionContainer}>
              <Button title="Close wallet" onPress={closeWallet} />
            </View>
            <View style={styles.sectionContainer}>
              <Button title="Delete wallet" onPress={deleteWallet} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

let walletHandle

async function createWallet() {
  console.log('createWallet onPress')
  try {
    const result = await indy.createWallet({ id: 'wallet-1234' }, { key: 'key' })
    console.log('result', result)
    ToastAndroid.showWithGravityAndOffset(`The result is ${result}`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
  } catch (e) {
    console.warn(e)
  }
}

async function openWallet() {
  try {
    console.log('openWallet onPress')
    const result = await indy.openWallet({ id: 'wallet-1234' }, { key: 'key' })
    walletHandle = result
    console.log('result', result)
    ToastAndroid.showWithGravityAndOffset(`The result is ${result}`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
  } catch (e) {
    console.warn(e)
  }
}

async function closeWallet() {
  console.log('closeWallet onPress')
  try {
    const result = await indy.closeWallet(walletHandle)
    console.log('result', result)
    ToastAndroid.showWithGravityAndOffset(`The result is ${result}`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
  } catch (e) {
    console.warn(e)
  }
}

async function deleteWallet() {
  console.log('deleteWallet onPress')
  try {
    const result = await indy.deleteWallet({ id: 'wallet-1234' }, { key: 'key' })
    console.log('result', result)
    ToastAndroid.showWithGravityAndOffset(`The result is ${result}`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
  } catch (e) {
    console.warn(e)
  }
}

async function DIDWallet() {
  console.log('getDIDWallet onPress')
  try {
    const result = await indy.createAndStoreMyDid(walletHandle, {})
    console.log('result', result)
    ToastAndroid.showWithGravityAndOffset(`The result is ${result}`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
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
