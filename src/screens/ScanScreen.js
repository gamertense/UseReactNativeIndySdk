import React from 'react'

import { StyleSheet, Text } from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner'

const ScanScreen = ({ navigation }) => {
  const onSuccess = (e) => {
    const url = e.data
    console.log('QR code data: ', url)
  }

  return (
    <QRCodeScanner
      onRead={onSuccess}
      //   flashMode={QRCodeScanner.Constants.FlashMode.torch}
      topContent={<Text style={styles.centerText}>Scan QR code</Text>}
    />
  )
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
})

export default ScanScreen
