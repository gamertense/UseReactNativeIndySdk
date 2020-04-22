import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import sleepPromise from 'sleep-promise'
import { agencyConfig } from '../config/agency-pool'
import {
  createOneTimeInfo,
  init,
  createConnectionWithInvite,
  acceptInvitationVcx,
  getConnectionState,
  updateConnectionState,
  getCredentialOffers,
  createCredentialWithOffer,
  sendCredentialRequest,
  getCredentialState,
  updateCredentialState,
  proofGetRequests,
  proofRetrieveCredentials,
  proofCreateWithRequest,
  generateProof,
  sendProof,
} from '../util/RNCXs'

// TODO: Remove this when successfully install on physical device
import { inviteDetails } from '../mocks/mockInviteDetails'

const HomeScreen = () => {
  const [connectionHandle, setConnectionHandle] = useState(0)
  const [createConnectionDisabled, setCreateConnectionDisabled] = useState(true)

  const provisionAgentAndWallet = async () => {
    console.log('on press provisionAgentAndWallet()')
    try {
      const oneTimeRes = await createOneTimeInfo(agencyConfig)
      console.log('One time result: ', oneTimeRes)
      const initConfig = {
        ...agencyConfig,
        ...oneTimeRes,
      }
      const initResult = await init(initConfig)
      if (initResult) {
        setCreateConnectionDisabled(false)
      } else {
        console.log('Error! initResult should be true, please see the log.')
      }
    } catch (e) {
      console.warn(e)
    }
  }

  const makeConnection = async () => {
    try {
      const _connectionHandle = await createConnectionWithInvite(inviteDetails)
      await acceptInvitationVcx(_connectionHandle)

      let connectionState = await getConnectionState(_connectionHandle)
      // TODO: declare state type
      while (connectionState !== 4) {
        await sleepPromise(2000)
        await updateConnectionState(_connectionHandle)
        connectionState = await getConnectionState(_connectionHandle)
      }
      console.info('Connection to Alice was accepted!')
      setConnectionHandle(_connectionHandle)
    } catch (e) {
      console.warn(e)
    }
  }

  const credentialOfferDemo = async () => {
    const offers = JSON.parse(await getCredentialOffers(connectionHandle))
    console.info(`Alice found ${offers.length} credential offers.`)
    // Create a credential object from the credential offer
    const credentialHandle = await createCredentialWithOffer('credential', JSON.stringify(offers[0]))

    console.info('After receiving credential offer, send credential request')
    console.debug(`credentialHandle = ${credentialHandle}, connectionHandle = ${connectionHandle}`)
    await sendCredentialRequest(credentialHandle, connectionHandle, 0)

    console.info('Poll agency and accept credential offer from faber')
    let credentialState = await getCredentialState(credentialHandle)
    while (credentialState !== 4) {
      await sleepPromise(2000)
      await updateCredentialState(credentialHandle)
      credentialState = await getCredentialState(credentialHandle)
    }
  }

  const proofRequestDemo = async () => {
    try {
      const requests = await proofGetRequests(connectionHandle)
      console.log('Proof requests: ', requests)
      const proofHandle = await proofCreateWithRequest('proof', JSON.stringify(JSON.parse(requests)[0]))
      console.log('proofHandle = ', proofHandle)
      let credentials = await proofRetrieveCredentials(proofHandle)
      console.log('credentials', credentials)
      credentials = JSON.parse(credentials)

      // Use the first available credentials to satisfy the proof request
      for (let i = 0; i < Object.keys(credentials.attrs).length; i++) {
        const attr = Object.keys(credentials.attrs)[i]
        credentials.attrs[attr] = {
          credential: credentials.attrs[attr][0],
        }
      }

      console.log('Generating the proof...')
      await generateProof(proofHandle, JSON.stringify(credentials), '')
      console.log('Sending the proof...')
      await sendProof(proofHandle, connectionHandle)
    } catch (err) {
      console.error('proofRequestDemo', err)
    }
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
              <Button
                onPress={() => makeConnection(setConnectionHandle)}
                disabled={createConnectionDisabled}
                title="Make connection"
              />
            </View>

            <View style={styles.sectionContainer}>
              <Button
                onPress={() => credentialOfferDemo(connectionHandle)}
                title="Credential offer demo"
                disabled={connectionHandle === 0 ? true : false}
              />
            </View>

            <View style={styles.sectionContainer}>
              <Button
                onPress={() => proofRequestDemo(connectionHandle)}
                title="Proof request demo"
                disabled={connectionHandle === 0 ? true : false}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
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
