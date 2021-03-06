// Hack the Crisis audio conferencing app
// based on the twilio client quickstart sample

'use strict';

const http = require('http');
const express = require('express');
const { urlencoded } = require('body-parser');
const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

let app = express();
app.use(express.static(__dirname + '/public'));
app.use(urlencoded({ extended: false }));

require('dotenv').config();

// Generate a Twilio Client capability token
app.get('/token', (request, response) => {
  const capability = new ClientCapability({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN
  });

  capability.addScope(
    new ClientCapability.OutgoingClientScope({
      applicationSid: process.env.TWILIO_TWIML_APP_SID})
  );

  const token = capability.toJwt();

  // Include token in a JSON response
  response.send({
    token: token
  });
});

/*app.get('/test', (request, response) => {
  let students = process.env.STUDENTS.split(',');
  let number = students[request.query.studentId];
  const voiceResponse = new VoiceResponse();
  voiceResponse.dial({
    callerId: process.env.TWILIO_NUMBER,
  }, number);

  response.type('text/xml');
  response.send(voiceResponse.toString());
});*/

app.post('/voice', (request, response) => {
  let students = process.env.STUDENTS.split(',');
  let number = students[request.body.studentId];
  const voiceResponse = new VoiceResponse();
  voiceResponse.dial({
    callerId: process.env.TWILIO_NUMBER,
  }, number);

  response.type('text/xml');
  response.send(voiceResponse.toString());
});

let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Express Server listening on *:${port}`);
});

module.exports = app;

