// Licensed under the Apache License. See footer for details.

var DefaultSearch = "Promoted_Worker"

var app = angular.module("watson-radio", ["ngResource"])

app.config(function($locationProvider) {
  $locationProvider.html5Mode({
    enabled:     true,
    requireBase: false
  })
})

app.controller("BodyController", BodyController)

$(onLoad)

//------------------------------------------------------------------------------
function onLoad() {
  $("#tweets-heading").click(function(){
    $("#tweets-body").collapse("toggle")
  })

  $("#scores-heading").click(function(){
    $("#scores-body").collapse("toggle")
  })
}

//------------------------------------------------------------------------------
function BodyController($scope, $rootScope, $timeout, $sce, $location) {
  $scope.timeout           = $timeout
  $scope.sce               = $sce
  $scope.loc               = $location

  $scope.helpShown         = false
  $scope.message           = null

  $scope.twitterSearchText = ""
  $scope.mix               = null

  clearSearch($scope)

  var q = $scope.loc.search().q
  if (!q) {
    // $scope.loc.search({q: getDefaultSearch()})
    TwitterSearchPerform($scope)
  }

  //-----------------------------------
  $rootScope.$on("$locationChangeSuccess", function(){
    LocationChanged($scope)
  })

  $scope.toggleHelp = function() {
    ToggleHelp($scope)
  }

  $scope.twitterSearchEntered = function() {
    TwitterSearchEntered($scope)
  }

  $scope.twitterSearchPerform = function(search) {
    TwitterSearchPerform($scope, search)
  }

  //-----------------------------------
  $scope.inAng = function(label, fn) {
    // console.log("@ ang block: " + label)
    $scope.timeout(function() {
      // console.log("-> ang block: " + label)
      fn()
      // console.log("<- ang block: " + label)
    },1)
  }
}

//------------------------------------------------------------------------------
function LocationChanged($scope) {
  var q = $scope.loc.search().q || getDefaultSearch()

  TwitterSearchPerform($scope, q)
}

//------------------------------------------------------------------------------
function ToggleHelp($scope) {
  $scope.helpShown = !$scope.helpShown
}

//------------------------------------------------------------------------------
function TwitterSearchEntered($scope) {
  clearSearch($scope)

  $scope.inAng("twitterSearchEntered", function(){
    $("#twitterSearchText").blur()
  })

  $scope.loc.search({q: $scope.twitterSearchText})
}

//------------------------------------------------------------------------------
function TwitterSearchPerform($scope, search) {
  search = search || getDefaultSearch()
  setDefaultSearch(search)

  clearSearch($scope)

  $scope.twitterSearchText = search

  TwitterGetTweets($scope, search)
}

//------------------------------------------------------------------------------
function clearSearch($scope) {
  $scope.tweets = []
  $scope.scores = []
}

//------------------------------------------------------------------------------
function getDefaultSearch() {
  if (!window.localStorage) return DefaultSearch

  return window.localStorage.umRadioDefaultSearch || DefaultSearch
}

//------------------------------------------------------------------------------
function setDefaultSearch(value) {
  if (!window.localStorage) return

  window.localStorage.umRadioDefaultSearch = value

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
