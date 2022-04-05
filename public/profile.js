$(document).ready(async function() {
  let userData = await fetch('/profile' + location.search, {
    method: 'POST'
  });
  let userProfile = await userData.json();
  // console.log(userProfile)
  let description = await userProfile.response.description
  let profileImageUrl = await userProfile.response.profile_image_url;
  let name = await userProfile.response.name;
  // console.log(profileImageUrl)
  let profileUrlNormal = await userProfile.response.url;
  let updatedImageUrl = await profileImageUrl.substring(0, profileImageUrl.length - 11) + '.jpg';
  let handle = await userProfile.response.username;

  $('#profile-pic').attr('src', updatedImageUrl);
  $('#user-name').html(name);
  $('#user-handle').html('@' + handle);
  $('#user-description').html(description);
  $('#user-profile-url').click(() => {
    window.open('https://twitter.com/' + handle, '_blank');
  })
  // //  console.log(userId)
  // // let body = {userId: userId}
  let userId = await userProfile.response.id;
  let emotionsAverage = {
    sadness: 0,
    joy: 0,
    fear: 0,
    disgust: 0,
    anger: 0
  }
  let sentimentAverage = 0;

  let tweetData = await fetch('/get-tweets?userId=' + userId, {
    method: 'POST'
  })
  let tweets = await tweetData.json()

  // console.log(tweets)
  getAverage(tweets.response)

  function getAverage(tweets) {
    validEmotionTweets = 0;
    validSentimentTweets = 0;
    tweets.forEach((tweet) => {
      if (tweet.emotions) {
        emotionsAverage.sadness += tweet.emotions.sadness;
        emotionsAverage.joy += tweet.emotions.joy;
        emotionsAverage.fear += tweet.emotions.fear;
        emotionsAverage.disgust += tweet.emotions.disgust;
        emotionsAverage.anger += tweet.emotions.anger;
        validEmotionTweets++;
      }
      if (tweet.sentiment) {
        sentimentAverage += tweet.sentiment.score;
        validSentimentTweets++
      }
    })

    emotionsAverage.sadness = Math.floor((emotionsAverage.sadness / validEmotionTweets) * 100) + '%';
    emotionsAverage.joy = Math.floor((emotionsAverage.joy / validEmotionTweets) * 100) + '%';
    emotionsAverage.fear = Math.floor((emotionsAverage.fear / validEmotionTweets) * 100) + '%';
    emotionsAverage.disgust = Math.floor((emotionsAverage.disgust / validEmotionTweets) * 100) + '%';
    emotionsAverage.anger = Math.floor((emotionsAverage.anger / validEmotionTweets) * 100) + '%';
    sentimentAverage = Math.floor((sentimentAverage / validEmotionTweets) * 100);

    if (sentimentAverage < -50) {
      $('#general-vibe').html('General Vibe: Very Negative');
    }
    if (sentimentAverage >= -50 && sentimentAverage < -10) {
      $('#general-vibe').html('General Vibe: Negative');
    }
    if (sentimentAverage >= -10 && sentimentAverage < 10) {
      $('#general-vibe').html('General Vibe: Neutral');
    }
    if (sentimentAverage >= 10 && sentimentAverage < 50) {
      $('#general-vibe').html('General Vibe: Positive');
    }
    if (sentimentAverage >= 50) {
      $('#general-vibe').html('General Vibe: Very Positive');
    }

    $('#sadness-rating').html(emotionsAverage.sadness);
    $('#joy-rating').html(emotionsAverage.joy);
    $('#fear-rating').html(emotionsAverage.fear);
    $('#disgust-rating').html(emotionsAverage.disgust);
    $('#anger-rating').html(emotionsAverage.anger);

    $('#disclaimer').html(`Based on the past ${validEmotionTweets} English Tweets`)

  }




});


//get more profile picture / information load first

//add loading before fetch

//after fetch calculate average from data
