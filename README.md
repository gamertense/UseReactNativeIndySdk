# Installation

```
yarn
```

# Running on Simulator/Emulator

The app currently works only on Android, because of missing native Indy library for iOS. If you want to try it on iOS you would need to add Indy.framework as a dependency to the iOS project.

## Android

```
yarn android
```

You shoud see following screen when app starts:

<img src="./docs/screenshot-app.png" alt="App" width="300"/>

You have to click on buttons in the right order, otherwise, you'll get an error (if you try to close wallet that has not been open yet, for example). Check the console for the result of every step.

After clicking `DID Wallet` button, you would see the following:

<img src="./docs/screenshot-app-did-wallet.png" alt="did and verkey" width="300"/>

## Troubleshoot

- `SSL peer shut down incorrectly`

  Restart the computer

- `Unsupported Modules Detected` pop-up error message on Android Studio or `java.lang.OutOfMemoryError` when installing on device/emulator.

  Run `cd android && ./gradlew clean` and then

  1. close the project
  2. close Android Studio IDE
  3. delete the .idea directory
  4. open Android Studio IDE and import the project

  > Reference: [Stackoverflow](https://stackoverflow.com/questions/30142056/error-unfortunately-you-cant-have-non-gradle-java-modules-and-android-gradle)
