// Licensed under the Apache License. See footer for details.

var URL   = require("url")
var https = require("https")

var request = require("request")

var utils = require("./utils")

var TwitterURL  = "https://api.twitter.com"
var BearerToken = null

//------------------------------------------------------------------------------
var twitter = exports

twitter.init           = init
twitter.getTweets      = getTweets

//------------------------------------------------------------------------------
function init(config, cb) {
  utils.log("initializing twitter")

  var options = {
    url:      TwitterURL + "/oauth2/token",
    formData: { grant_type: "client_credentials" },
    auth:     { user: config.twitter.key, pass: config.twitter.secret }
  }

  // utils.log("issuing request: " + utils.JL(options))
  request.post(options, gotToken)

  //-----------------------------------
  function gotToken(err, response, body) {
    // utils.log("twitter.gotToken:")
    // utils.log("   err:         " + utils.JL(err))
    // utils.log("   response:    " + utils.JL(response))

    if (err) {
      utils.log("error getting Twitter bearer token")
      return cb(err)
    }

    try {
      body = JSON.parse(body)
    }
    catch (err) {
      utils.log("error parsing Twitter bearer token")
      return cb(err)
    }

    // utils.log("   body:        " + utils.JL(body))
    BearerToken = body.access_token
    utils.log("obtained bearer token for Twitter")

    if (BearerToken == null) {
      utils.log("error extracting Twitter bearer token")
      return cb(Error("access_token not found in Twitter response body"))
    }

    cb(err)
  }
}

//------------------------------------------------------------------------------
function getTweets(search, cb) {
  if (!BearerToken) {
    cb(Error("Twitter not initialized correctly"))
  }

  // console.log("twitter.getTweets(" + search + ")")

  var options = {
    url:      TwitterURL + "/1.1/search/tweets.json",
    qs:       {q: search, count: 100, include_entities: false},
    headers:  {Authorization: "Bearer " + BearerToken}
  }

  // utils.log("issuing request: " + utils.JL(options))
  request.get(options, gotTweets)

  //-----------------------------------
  function gotTweets(err, response, body) {
    try {
      body = JSON.parse(body)
    }
    catch (e) {
      return cb(Error("error parsing JSON from twitter search"))
    }

    // utils.log("twitter search:")
    // utils.log(utils.JL(body))

    var result = []
    body.statuses.forEach(function(status){
      result.push({
        text:       status.text,
        created_at: status.created_at,
        user: {
          name:        status.user.name,
          screen_name: status.user.screen_name,
          icon:        status.user.profile_image_url_https
        }
      })
    })

    // utils.log("twitter.GotTweets:")
    // utils.log(utils.JL(result))

    cb(null, result)
  }
}

//------------------------------------------------------------------------------
// Copyright IBM Corp. 2014
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------
