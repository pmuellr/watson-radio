// Licensed under the Apache License. See footer for details.

// /api/v1
// /api/v1
// /api/v1

// /api/v1/tweets/.json
// /api/v1/user-model.json
// /api/v1/tracks.json

var search  = "PLT_Hulk"
var url     = "/api/v1/tweets.json?q=" + encodeURIComponent(search)
var options = {
  dataType: "json",
}

$.ajax(url, options).
  done(gotTweets).
  fail(gotTweetsError)

//-------------------------------------
function gotTweets(data, textStatus, jqXHR) {
  // console.log("gotTweets:")
  // console.log("  data:       " + JSON.stringify(data))
  // console.log("  textStatus: " + textStatus)

//        text:       status.text,
//        created_at: status.created_at,
//        user: {
//          name:     status.user.name,
//          icon:     status.user.profile_image_url_https
//        }

  // console.log(JSON.stringify(data, null, 4))

  var text = []
  data.data.forEach(function(status) {
    text.push(status.text)
  })

  text = text.join("\n\n")
  console.log("getting user model for")
  console.log(text)

  getUserModel(text)
}

//-------------------------------------
function gotTweetsError(jqXHR, textStatus, error) {
  console.log("gotTweetsError:")
  console.log("  textStatus: " + textStatus)
  console.log("  error:      " + error)
}

//------------------------------------------------------------------------------
function getUserModel(text) {
  var url     = "/api/v1/user-model.json"
  var options = {
    contentType: "application/json",
    dataType:    "json",
    type:        "POST",
    data:        JSON.stringify({data: text})
  }

  // console.log("getting user model: " + JSON.stringify(options))
  $.ajax(url, options).
    done(gotUserModel).
    fail(gotUserModelError)
}

//-------------------------------------
function gotUserModel(data, textStatus, jqXHR) {
  console.log("gotUserModel:")
  console.log("  data:       " + JSON.stringify(data))
  console.log("  textStatus: " + textStatus)
}

//-------------------------------------
function gotUserModelError(jqXHR, textStatus, error) {
  console.log("gotUserModelError:")
  console.log("  textStatus: " + textStatus)
  console.log("  error:      " + error)
}

//------------------------------------------------------------------------------
var search  = "4843418"
var url     = "/api/v1/tracks.json?q=" + encodeURIComponent(search)
var options = {
  dataType: "json",
}

$.ajax(url, options).
  done(gotTracks).
  fail(gotTracksError)

//-------------------------------------
function gotTracks(data, textStatus, jqXHR) {
  console.log("gotTracks:")
  console.log("  data:       " + JSON.stringify(data))
  console.log("  textStatus: " + textStatus)
}

//-------------------------------------
function gotTracksError(jqXHR, textStatus, error) {
  console.log("gotTracksError:")
  console.log("  textStatus: " + textStatus)
  console.log("  error:      " + error)
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
