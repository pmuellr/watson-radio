// Licensed under the Apache License. See footer for details.

var path    = require("path")
var async   = require("async")
var express = require("express")

var api      = require("./api")
var utils    = require("./utils")
var config   = require("./config")

var WWWDIR = path.join(__dirname, "..", "www")

//------------------------------------------------------------------------------
var server = exports

server.run = run

//------------------------------------------------------------------------------
function run(cfg) {
  var cfg = config.getConfig()

  api.init(cfg, _startServer)

  function _startServer(err, data) {
    startServer(err, cfg)
  }
}

//------------------------------------------------------------------------------
function startServer(err, cfg) {
  if (err) {
    utils.log("error initializing services: " + err.message)
  }

  var app  = express()

  app.use("/",       express.static(WWWDIR))
  app.use("/api/v1", api.getMiddleware())

  var bind = 0 // cfg.bind // ip address to bind to; set to zero to allow any

  utils.log("starting server on " + cfg.url)
  app.listen(cfg.port, bind, function() {
    utils.log("started  server on " + cfg.url)
  })
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
