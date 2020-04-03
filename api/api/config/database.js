const firebase = require('firebase')
const firebaseAdmin = require('firebase-admin')
const { sdk, adminSdk } = require('./firebase')

exports.initDatabase = () => {
  firebase.initializeApp(sdk)
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(adminSdk),
    databaseURL: sdk.databaseURL
  })
}
