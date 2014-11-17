// Licensed under the Apache License. See footer for details.

// config = {
//   "name":     "watson-radio",
//   "port":     "????",
//   "url":      "http://localhost:????",
//   "twitter": {
//     "key":    "????",
//     "secret": "????"
//   },
//   "tracks8": {
//     "key":    "????"
//   },
//   "um": {
//     "url":    "????",
//     "user":   "????",
//     "pass":   "????"
//   }
// }

var path = require("path")

var cfenv = require("cfenv")

var utils = require("./utils")

//------------------------------------------------------------------------------
var config = exports

config.getConfig = getConfig

//------------------------------------------------------------------------------
var EnvVarTwitterKey    = "TWITTER_CONSUMER_KEY"
var EnvVarTwitterSecret = "TWITTER_CONSUMER_SECRET"
var EnvVar8TracksKey    = "TRACKS8_API_KEY"
var EnvVars = [EnvVarTwitterKey, EnvVarTwitterSecret, EnvVar8TracksKey]

//------------------------------------------------------------------------------
var vcapModule = path.join(__dirname, "..", "vcap.json")
var envModule  = path.join(__dirname, "..", "env.json")

var vcap = null
try { vcap = require(vcapModule) } catch (e) { }

// set env vars based on env.json
var env = null
try {
  env = require(envModule)

  EnvVars.forEach(function(envVar){
    if (env[envVar]) process.env[envVar] = env[envVar]
  })
} catch (e) { }

//------------------------------------------------------------------------------
if (vcap == null) {
  appEnv = cfenv.getAppEnv()
}
else {
  appEnv = cfenv.getAppEnv({vcap: vcap})
}

utils.PROGRAM = appEnv.name

//------------------------------------------------------------------------------
if (appEnv.isLocal) {
  if (null == env) {
    utils.log("expecting an env.json file; missing or invalid")
  }

  if (null == vcap) {
    utils.log("expecting a vcap.json file; missing or invalid")
  }
}

//------------------------------------------------------------------------------
function getConfig() {
  var cfg = {
    name:    appEnv.name,
    port:    appEnv.port,
    bind:    appEnv.bind,
    url:     appEnv.url,
    twitter: getConfigTwitter(),   // { key:, secret: }
    tracks8: getConfig8Tracks(),   // { key: }
    um:      getConfigUserModel()  // { url: , user: , pass: }
  }

  logConfig(cfg)

  return cfg
}

//------------------------------------------------------------------------------
function logConfig(cfg) {
  var cfgShow = JSON.parse(JSON.stringify(cfg))

  setHiddenProperty(cfgShow.twitter, "key")
  setHiddenProperty(cfgShow.twitter, "secret")

  setHiddenProperty(cfgShow.tracks8, "key")

  setHiddenProperty(cfgShow.um, "user")
  setHiddenProperty(cfgShow.um, "pass")

  utils.log("config: " + JSON.stringify(cfgShow, null, 4))
}

//------------------------------------------------------------------------------
function setHiddenProperty(object, prop) {
  if (null == object) return
  if (null == object[prop]) return

  object[prop] = "<hidden>"
}

//------------------------------------------------------------------------------
function getConfigTwitter() {
  var config = {
    key:    null,
    secret: null
  }

  config.key    = process.env[EnvVarTwitterKey]
  config.secret = process.env[EnvVarTwitterSecret]

  if (null == config.key) {
    utils.log("expected environment variable to be set: " + EnvVarTwitterKey)
    return null
  }

  if (null == config.secret) {
    utils.log("expected environment variable to be set: " + EnvVarTwitterSecret)
    return null
  }

  return config
}

//------------------------------------------------------------------------------
function getConfig8Tracks() {
  var config = {
    key: null
  }

  config.key = process.env[EnvVar8TracksKey]

  if (null == config.key) {
    utils.log("expected environment variable to be set: " + EnvVar8TracksKey)
    return null
  }

  return config
}

//------------------------------------------------------------------------------
function getConfigUserModel() {
  var config = {
    url:  null,
    user: null,
    pass: null
  }

  var creds = appEnv.getServiceCreds(/.*watson.*/i)
  if (null == creds) {
    utils.log("expected bound service matching /.*watson.*/i, but wasn't found")
    return null
  }

  config.url  = creds.url
  config.user = creds.username
  config.pass = creds.password

  if (null == config.url) {
    utils.log("expected service matching /.*watson.*/i to have `url` in credentials, but wasn't found")
    return null
  }

  if (null == config.user) {
    utils.log("expected service matching /.*watson.*/i to have `username` in credentials, but wasn't found")
    return null
  }

  if (null == config.pass) {
    utils.log("expected service matching /.*watson.*/i to have `password` in credentials, but wasn't found")
    return null
  }

  return config
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
