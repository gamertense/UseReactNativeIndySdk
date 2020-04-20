import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button } from 'react-native'
import sleepPromise from 'sleep-promise'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { agencyConfig } from '../config/agency-pool'
import { createOneTimeInfo, init } from '../util/RNCXs'

const HomeScreen = ({ navigation }) => {
  const [createConnectionDisabled, setCreateConnectionDisabled] = useState(false)

  async function createConnection() {
    console.log('on press createConnection()')
    navigation.navigate('Scan')
    //   try {
    //     const connectionHandle = await createConnectionWithInvite()
    //     await acceptInvitationVcx(connectionHandle)

    //     let connectionState = await getConnectionState(connectionHandle)
    //     // TODO: declare state type
    //     while (connectionState !== 4) {
    //       await sleepPromise(2000)
    //       await updateConnectionState(connectionHandle)
    //       connectionState = await getConnectionState(connectionHandle)
    //     }
    //     console.info('Connection to alice was Accepted!')
    //   } catch (e) {
    //     console.warn(e)
    //   }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.body}>
            <Text style={styles.sectionDescription}>Check console.log for test results</Text>
            <View style={styles.sectionContainer}>
              <Button
                title="Provision agent and wallet"
                onPress={() => provisionAgentAndWallet(setCreateConnectionDisabled)}
              />
            </View>

            <View style={styles.sectionContainer}>
              <Button disabled={createConnectionDisabled} title="Make connection" onPress={createConnection} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

async function provisionAgentAndWallet(setCreateConnectionDisabled) {
  console.log('on press provisionAgentAndWallet()')
  try {
    const oneTimeRes = await createOneTimeInfo(agencyConfig)
    console.log('One time result: ', oneTimeRes)
    const initConfig = {
      ...agencyConfig,
      ...oneTimeRes,
    }
    const initResult = await init(initConfig)
    if (initResult) setCreateConnectionDisabled(false)
    else console.log('Error! initResult should be true, please see the log.')
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

export default HomeScreen
