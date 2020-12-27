//jshint esversion:6

const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const https = require('https');
const PaytmChecksum = require('./paytm/PaytmChecksum');
var oid;
var value;
var custId;

var paytmParams = {};

exports.paytmTransactionToken = functions.https.onRequest((request, response) => {

    if(request.method=='POST'){
	oid=req.body.orderId;
   	value=req.body.value;
   	custId=req.body.custId;
        paytmParams.body = {
            "requestType"   : "Payment",
            "mid"           : "NCBcgC49229523932873",
            "websiteName"   : "WEBSTAGING",
            "orderId"       : oid,
            "callbackUrl"   : "https://merchant.com/callback",
            "txnAmount"     : {
                "value"     : value,
                "currency"  : "INR",
            },
            "userInfo"      : {
                "custId"    : custId,
            },
        };
        
        /*
    * Generate checksum by parameters we have in body
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "Vzb@afDkQZ6en%Eq").then(function(checksum){
    
        paytmParams.head = {
            "signature"	: checksum
        };
    
        var post_data = JSON.stringify(paytmParams);
    
        var options = {
    
            /* for Staging */
            //hostname: 'securegw-stage.paytm.in',
    
            /* for Production */
             hostname: 'securegw.paytm.in',
    
            port: 443,
            path: '/theia/api/v1/initiateTransaction?mid=NCBcgC49229523932873&orderId='+oid,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };
    
        var respon = "";
        var post_req = https.request(options, function(post_res) {
            post_res.on('data', function (chunk) {
                respon += chunk;
            });
    
            post_res.on('end', function(){
                console.log('Response: ', respon);
                response.send(respon);
            });
        });
    
        post_req.write(post_data);
        post_req.end();
    });
    }else{
        response.send("Wrong method!!");
    }
 });
