const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const {CloudantV1,IamAuthenticator} = require('@ibm-cloud/cloudant');
const { UuidsResult } = require('@ibm-cloud/cloudant/cloudant/v1');
const { randomUUID } = require('crypto');
const { v4: uuidv4 } = require('uuid');

var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sweetbalaji2000@gmail.com',
    pass: 'wikrslksniygqkol'
  }
});

var mailOptions = {
  from: 'sweetbalaji2000@gmail.com',
  to: 'sweetybalaji2000@gmail.com',
  subject: 'Sending Email using Node.js',
//   html: '<h1 style=color:"red">Hi Balaji</h1><p>From node js</p>'
  html: '<h1>This is an HTML email</h1><p>You can <strong>format</strong> your email content using HTML.</p><img src="cid:unique@nodemailer.com"/>',
  attachments: [{
        filename: 'balaji.jpg',
        path: './balaji.jpg',
        cid: 'unique@nodemailer.com' // same cid value as in the html img src
    }]
};




// // Generate a random UUID
// const randomUUID = uuidv4();

// console.log(randomUUID);

const authenticator = new IamAuthenticator({
    apikey: 'C2T7RRqkctLBqB4CNWaz6M8jHv0SRe9Uer27FRzmmbYF'
});

const service = new CloudantV1({
    authenticator: authenticator
});

const apiKey = 'C2T7RRqkctLBqB4CNWaz6M8jHv0SRe9Uer27FRzmmbYF';
const dbName = 'userdetails';

const designDocName = 'fulluserview';
const viewName = 'userdetails';

const key = '394db00836c890de934f433c4f582d85';

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();

app.use(cors())

service.setServiceUrl('https://9c0eaf66-8c91-4e69-a650-94da977498ae-bluemix.cloudantnosqldb.appdomain.cloud');


const docid = 'fae18749dd2bd37289b37aef4b37cb81';

app.use(express.static('frontend'))


// service.postAllDocs({
//     db: 'orders',
//     includeDocs: true,
//     startKey: 'abc',
//     limit: 10
//   }).then(response => {
//     console.log(response.result);
//   });

// Fetch all dbs in couch

app.get('/alldbs', function(request,response){
    service.getAllDbs().then(function(dbs){
    console.log("All dbs => ",dbs)
    response.send(dbs.result)
    })
})

// Fetch By specific id

app.get('/byid',jsonParser,function(req,res){
    let id = req.body.docId
    // console.log("req",req)
    console.log("id => ",req.body.docId)
    service.getDocument(
        {db: db_name,docId : id}).then(function (response){
        console.log("document => ",response)
        res.send(response)
    })
})

// Fetch By view

app.get('/view',function(req,res){
    service.postView({
        db:'userdetails',
        ddoc:'fulluserview',
        view: 'userdetails'
        // keys: ['394db00836c890de934f433c4f582d85','5973eddefffd7ef083f9204b08f43d74']
    }).then(response => {
        console.log(response.result.rows)
        var customers = {}
        response.result.rows.forEach((doc) => {
            customers[doc.value.name] = doc.value
            // console.log("dv",doc.value)
          })
          
        //   console.log("customers",customers)
        //   console.log(response.result.rows)
        //   console.log(Object.values(customers))
        //   res.send(response.result.rows)
          res.send(Object.values(customers))
    })
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
})

// Creating a new Doc

app.post('/save',jsonParser, function(req,res){
    let doc = req.body
    // let doc = {"name": "Ganesh",
    // "email": "ganesh123@gmail.com",
    // "phone": "74897483893",
    // "address": {
    //  "street": "Vidhyanagar A Block",
    //  "city": "Harihar",
    //  "state": "Karnataka",
    //  "zip": "849830"
    // }}
    
    service.putDocument({
        docId: uuidv4(),
        db:dbName,
        document:doc,
    }).then(response => {
        console.log(response)
        // res.send("success",response)
       res.send(response.result)
    })
})

//updating a document

app.put('/update',jsonParser,function(req,res) {
    let doc = req.body.user
    service.postDocument({
        db: dbName,
        document:doc
    }).then(response => {
        console.log(response)
        res.send(response.result)
    })
})

// Deleting a docuement

app.delete('/delete',jsonParser, function(req,res){
    let id = req.body._id;
    let rev = req.body._rev;
    service.deleteDocument({
        db:dbName,
        docId:id,
        rev: rev
    }).then(response =>{
        console.log(response)
        res.send(response.result)
    })
})




app.listen(3000,function(){
    console.log("Server started on port 3000")
})



