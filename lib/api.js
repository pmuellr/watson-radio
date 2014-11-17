// Licensed under the Apache License. See footer for details.

var async      = require("async")
var express    = require("express")
var bodyParser = require("body-parser")

var utils   = require("./utils")

var um      = require("./um")
var twitter = require("./twitter")
var tracks8 = require("./tracks8")

//------------------------------------------------------------------------------
var api = exports

api.init          = init
api.getMiddleware = getMiddleware

//------------------------------------------------------------------------------
function init(config, tcb) {
  var tasks = {
    initTwitter: function(cb) {twitter.init(config, cb)},
    initTracks8: function(cb) {tracks8.init(config, cb)},
    initUM:      function(cb) {     um.init(config, cb)}
  }

  async.parallel(tasks, tcb)
}

//------------------------------------------------------------------------------
function getMiddleware(config) {
  var app = express()

  // app.use(CORSify)

  // bodyParser.text()

  app.get(  "/tweets.json",       GetTweets)
  app.post( "/user-model.json",   bodyParser.json(), PostUserModel)
  app.get(  "/tracks.json",       GetTracks)

  return app
}

//------------------------------------------------------------------------------
function GetTweets(request, response) {
  var search = request.query.q
  search = search || "PLT_Hulk"

  twitter.getTweets(search, gotTweets)

  //-----------------------------------
  function gotTweets(err, data) {
    if (err) return sendResponseError(response, err)

    sendResponseOK(response, data)
  }
}

//------------------------------------------------------------------------------
function PostUserModel(request, response) {
  var body = request.body
  body = body || "I am extremely angry and mad."

  um.getUserModel({body:body}, gotUserModel)

  //-----------------------------------
  function gotUserModel(err, data) {
    if (err) return sendResponseError(response, err)

    sendResponseOK(response, data)
  }
}

//------------------------------------------------------------------------------
function GetTracks(request, response) {
  var search = request.query.q
  search = search || "4843418"

  tracks8.getTracks(search, gotTracks)

  //-----------------------------------
  function gotTracks(err, data) {
    if (err) return sendResponseError(response, err)

    sendResponseOK(response, data)
  }
}

//------------------------------------------------------------------------------
function sendResponseOK(response, data) {
  sendResponse(response, 200, {data: data})
}

//------------------------------------------------------------------------------
function sendResponseError(response, err) {
  sendResponse(response, err.statusCode, "" + err.message)
}

//------------------------------------------------------------------------------
function sendResponse(response, status, data) {
  if (data == null) data = ""

  response.header("cache-control", "no-cache")
  response.statusCode = status;
  response.send(data)
}

//------------------------------------------------------------------------------
function CORSify(request, response, next) {
  response.header("Access-Control-Allow-Origin:", "*")
  response.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
  next()
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
