require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const pos = require('pos')
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios')
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const {
  IamAuthenticator
} = require('ibm-watson/auth');
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2021-03-25',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY,
  }),
  serviceUrl: process.env.IBM_URL,
});
// const {TwitterApi} = require('twitter-api-v2');
//
// const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);



const app = express()

// const Emoji = require('./Emoji.js')

app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse application/json
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_DB);



app.get('/', (req,res)=>{
  res.sendFile('index.html')
})

app.get('/profile', (req,res)=>{
  // console.log(req.query)
  res.sendFile(__dirname + '/public/profile.html')
})

app.post('/profile', async function(req,res){
  let userName = req.query.handle;
  let response = await getUser(userName);
  res.send({response})
})

app.post('/get-tweets', async function(req,res){
  let userId = req.query.userId;
  console.log(userId)
  let response = await updateTweets(userId);
  res.send({response})
})

async function getUser(userName){
  let USER_NAME = userName;
  let token = process.env.TWITTER_BEARER_TOKEN
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  let user = await axios.get('https://api.twitter.com/2/users/by/username/' + USER_NAME  + '?user.fields=name,description,location,profile_image_url', config);
  let userData = user.data.data;
  // console.log(userData)

  return userData
}

// getUser('EitanWaxman')
//
// async function getFullUserProfile(userName){
// let USER_ID = await getUser(userName);
// let userProfile = await
//
// }

async function getTweets(userId) {
  let USER_ID = userId;
  let token = process.env.TWITTER_BEARER_TOKEN
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  let tweets = await axios.get('https://api.twitter.com/2/users/' + USER_ID + '/tweets', config);
  let tweetsData = tweets.data.data
  return tweetsData;
}

// getTweets('EitanWaxman')

async function ibmApi(tweet){
  let newTweet = null;
  const analyzeParams = {
    'text': tweet.text,
    'features': {
      'emotion': {
        'document': true
      },
      'sentiment':{
        'document': true
      }
    }
  };

try{
let analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams)
    // .then(analysisResults => {
      // console.log(analysisResults)
      let warning = analysisResults.result.warning;
      if (warning){
          newTweet = {...tweet, warning: warning}
      }
      else{
        let emotions = analysisResults.result.emotion.document.emotion;
        let sentiment = analysisResults.result.sentiment.document;
        newTweet = {...tweet, emotions: emotions, sentiment: sentiment}
      }
    // console.log(newTweet)
    return newTweet;
}
catch(err){
  newTweet = {...tweet, error: "could not process this tweet"}
    // console.log(newTweet)
  return newTweet;
}
}

async function updateTweets(userId) {

  let tweets = await getTweets(userId)
  let analyzedTweets = [];

for(let i = 0; i < tweets.length; i++){
let toPush = await ibmApi(tweets[i]);
analyzedTweets.push(toPush)
}
  // console.log(analyzedTweets)
  return analyzedTweets
}

// updateTweets('EitanWaxman')
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
