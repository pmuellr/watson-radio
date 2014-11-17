// Licensed under the Apache License. See footer for details.

function TwitterGetTweets($scope, search) {
  var url     = "/api/v1/tweets.json?q=" + encodeURIComponent(search)
  var options = {
    dataType: "json",
  }

  $scope.message = "loading tweets"

  $.ajax(url, options).
    done(gotTweets).
    fail(gotTweetsError)

  //-------------------------------------
  function gotTweets(data, textStatus, jqXHR) {
    var text = []
    data.data.forEach(function(status) {
      text.push(status.text)
    })

    text = text.join("\n\n")

    $scope.inAng("gotTweets", function(){
      $scope.tweets = data.data

      if (data.data.length == 0)
        $scope.message = "no tweets found"
      else {
        $scope.message = null
        UserModelGetUserModel($scope, text)
      }
    })
  }

  //-------------------------------------
  function gotTweetsError(jqXHR, textStatus, error) {
    var message = "error getting tweets: " + textStatus + ": " + error

    $scope.inAng("gotTweetsError", function(){
      $scope.message = message
    })
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
