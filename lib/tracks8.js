// Licensed under the Apache License. See footer for details.

var request = require("request")

var utils = require("./utils")

var Tracks8URL = "http://8tracks.com"

var Tracks8Key = null

//------------------------------------------------------------------------------
var tracks8 = exports

tracks8.init           = init
tracks8.getTracks      = getTracks

//------------------------------------------------------------------------------
function init(config, cb) {
  utils.log("initializing 8tracks")

  Tracks8Key = config.tracks8.key

  cb()
}

//------------------------------------------------------------------------------
function getTracks(search, cb) {
  var mix    = null
  var result = {}

  var options = {
    url:  Tracks8URL + "/mix_sets/tags:" + search + ":safe.json",
    qs:   { api_key: Tracks8Key, include: "mixes"},
    json: true
  }

  // utils.log("issuing request: " + utils.JL(options))
  request.get(options, gotMixes)

  //-----------------------------------
  function gotMixes(err, response, body) {
    if (err) {
      utils.log("error getting 8tracks mixes for " + search)
      return cb(err)
    }

    if ((!body.mixes) || (body.mixes.length == 0)) {
      utils.log("no getting 8tracks mixes for " + search)
      return cb(err)
    }

    var mixIndex = Math.floor(body.mixes.length * Math.random())

    mix = body.mixes[mixIndex]

    result.tag   = search
    result.name  = mix.name
    result.url   = Tracks8URL + mix.web_path
    result.image = mix.cover_urls.sq100

    options = {
      url:  Tracks8URL + "/sets/new.json",
      qs:   { api_key: Tracks8Key},
      json: true
    }

    request.get(options, gotToken)
  }

  //-----------------------------------
  function gotToken(err, response, body) {
    if (err) {
      utils.log("error getting 8tracks token for " + mix.id)
      return cb(err)
    }

    options = {
      url:  Tracks8URL + "/sets/" + body.play_token + "/play.json",
      qs:   { api_key: Tracks8Key, mix_id: mix.id},
      json: true
    }

    request.get(options, gotTracks)
  }

  //-----------------------------------
  function gotTracks(err, response, body) {
    if (err) {
      utils.log("error getting 8tracks tracks for " + mix.id)
      return cb(err)
    }

    result.audio = body.set.track.url

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
