//jshint esversion:6
const https = require('https');

const express = require("express");
const bodyParser=require("body-parser");
const PaytmChecksum = require('./paytm/PaytmChecksum');

var paytmParams = {};

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
var oid;
var value;
var custId;
app.get("/",function(req,res){
    res.send("<h1>Hello</h1>");
});
app.post("/",function(req,res){
   console.log("request",req.body);
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

    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
            res.send(response);
        });
    });

    post_req.write(post_data);
    post_req.end();
});
});
app.listen(3000,function(){
    console.log("Server started at port 3000");
});
