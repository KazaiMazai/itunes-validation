var express = require("express");
var request = require("request");
var router = express.Router();



// What to do when a validation post request is received.
router.get("/", function (req, res) {

    // Check for receipt data
    if (req.query.receipt !== null) {

        var r = req.query.receipt;
        var s = req.query.secret;
        var e = req.query.excluded || true;

        request(
            {
                method: "POST", uri: "https://sandbox.itunes.apple.com/verifyReceipt",
                body: JSON.stringify({"receipt-data": r, "password": s, "exclude-old-transactions": e})
            }, function (error, response, body) {

                if (response.statusCode === 200) {
                    res.status(response.statusCode).send(response.body);
                } else {
                    res.status(response.statusCode).send(response.status);
                }
            }
        );
    } else {
        res.status(400).send("Receipt data is missing.");
    }

});


module.exports = router;