// Licensed under the Apache License. See footer for details.

function UserModelGetUserModel($scope, text) {
  var url     = "/api/v1/user-model.json"
  var options = {
    contentType: "application/json",
    dataType:    "json",
    type:        "POST",
    data:        JSON.stringify({data: text})
  }

  $scope.message = "loading scores"

  // console.log("getting user model: " + JSON.stringify(options))
  $.ajax(url, options).
    done(gotUserModel).
    fail(gotUserModelError)

  //-------------------------------------
  function gotUserModel(data, textStatus, jqXHR) {
    scores = []
    getChildScores(scores, data.data.tree)

    scores.sort(function(a,b){
      var cmp = b.score - a.score
      if (cmp != 0) return cmp

      return (a.name < b.name) ? -1 : 1
    })

    $scope.inAng("gotUserModel", function(){
      if (scores.length == 0)
        $scope.message = "no scores available"
      else
        $scope.message = null

      $scope.scores = scores

      if (scores.length > 0) {
        var umChar = scores[0].name
        var tag = UserModel2Tracks8(umChar)
        TracksGetTracks($scope, tag, umChar)
      }
    })
  }

  //-------------------------------------
  function gotUserModelError(jqXHR, textStatus, error) {
    var message = "error getting user-model: " + textStatus + ": " + error

    $scope.inAng("gotUserModelError", function(){
      $scope.message = message
    })
  }

  //-------------------------------------
  function getChildScores(scores, child) {
    if (null == child) return

    if (null == child.children) {
      scores.push({name: child.name, score: child.percentage})
      return
    }

    child.children.forEach(function(ch){
      getChildScores(scores, ch)
    })
  }
}

//------------------------------------------------------------------------------

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
