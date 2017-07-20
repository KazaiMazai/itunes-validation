[![Build Status](https://travis-ci.org/stuartbreckenridge/itunes-validation.svg?branch=master)](https://travis-ci.org/stuartbreckenridge/itunes-validation)

Spin up a Node app so you can validate iOS app receipts with the App Store.

## Installation Examples

### Local

```bash
$ git clone https://github.com/stuartbreckenridge/itunes-validation.git
$ cd itunes-validation
$ npm install
$ npm start
```

### Heroku

1. Fork https://github.com/stuartbreckenridge/itunes-validation.git to your GitHub account
2. Create a New App in Heroku
3. Under Deployment Method select GitHub (connect to your GitHub account if necessary)
4. Find the repository in the Connect to GitHub section and click Connect
5. (Optional) Enable Automatic Deploys
6. Click Deploy Branch


## API

The app provides two endpoints:

- `GET /0.1/sandbox` (for sandbox receipt validation)
- `GET /0.1/production` (for production receipt validation)

|Parameter|Required|Description|
|---|---|---|
|receipt|Yes|Base 64 encoded receipt string.|
|secret|No|Only used for receipts that contain auto-renewable subscriptions. Your app’s shared secret (a hexadecimal string).|
|exclude|No|Only used for iOS7 style app receipts that contain auto-renewable or non-renewing subscriptions. If value is true, response includes only the latest renewal transaction for any subscriptions.|


## In App Usage

```swift
struct Receipt: Decodable {
    var receipt: [String:String]
    var status: Int
}

func obfuscatedValidationMethod() {
    let receiptURL = Bundle.main.appStoreReceiptURL
    let receiptData = NSData(contentsOf: receiptURL!)
    let base64Receipt = receiptData?.base64EncodedString(options: .endLineWithLineFeed)
    let queryItems = [URLQueryItem(name: "receipt", value: base64Receipt)]
    var valUrl = URLComponents(string: "<# https://appName.herokuapp.com #>/0.1/sandbox")
    valUrl?.queryItems = queryItems
    let request = URLRequest(url: valUrl!.url!)

    let session = URLSession.shared
    let task = session.dataTask(with: request) { (data, response, error) in
        guard let responseData = data else {
            return
        }
        let decoder = JSONDecoder()
        do {
            let decodedReceipt = try decoder.decode(Receipt.self, from: responseData)
            if decodedReceipt.status == 1 {
                // Do something with invalid receipt.
            }
        } catch {
            // Handle error.
        }
    }

    task.resume()
}
```
