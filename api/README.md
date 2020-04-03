[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

### Installation
Install project packages:
```
$ npm install
```
Create a .js file named `firebase.js` in `api/config/` with Firebase Admin SDK settings, like this:

``` 
api/config/firebase.js
```
```
exports.sdk = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
}

exports.adminSdk = {
  "type": "service_account",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": ""
}

```

Create a `.env` file at project root, example:
```
API_PORT = '127.0.0.1'
API_URL = 1337
```

### Run API
```
$ node index.js
```
