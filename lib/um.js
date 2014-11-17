// Licensed under the Apache License. See footer for details.

var URL   = require("url")
var path  = require("path")

var request = require("request")

var utils = require("./utils")

//------------------------------------------------------------------------------
var um = exports

um.init           = init
um.getUserModel   = getUserModel

//------------------------------------------------------------------------------
UM_URL  = null
UM_USER = null
UM_PASS = null

//------------------------------------------------------------------------------
function init(config, cb) {
  utils.log("initializing User Modeling")

  UM_URL  = config.um.url + "api/v2/profile"
  UM_USER = config.um.user
  UM_PASS = config.um.pass

  cb()
}

//------------------------------------------------------------------------------
function getUserModel(content, cb) {
  if (!UM_URL) {
    cb(Error("User-Modeling not initialized correctly"))
  }

  content = content.body.data

  var body = {
    contentItems : [{
      userid :      "dummy",
      id :          "dummyUUID",
      sourceid :    "freetext",
      contenttype : "text/plain",
      language :    "en",
      content:      content
    }]
  }

  var options = {
    url:  UM_URL,
    json: true,
    auth: {user: UM_USER, pass: UM_PASS },
    body: body,
  }

  // utils.log("issuing request: " + utils.JL(options))
  request.post(options, gotUserModel)

  //-----------------------------------
  function gotUserModel(err, response, body) {
    // utils.log("um.gotUserModel:")
    // utils.log(utils.JL(body))

    if (err) {
      utils.log("error getting user model: " + err)
      return cb(err)
    }

    cb(null, body)
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
