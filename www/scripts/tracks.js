// Licensed under the Apache License. See footer for details.

function TracksGetTracks($scope, search, umChar) {
  var url     = "/api/v1/tracks.json?q=" + encodeURIComponent(search)
  var options = {
    dataType: "json",
  }

  $scope.message = "loading 8tracks mix: " + search

  $.ajax(url, options).
    done(gotMix).
    fail(gotMixError)

  //-------------------------------------
  function gotMix(data, textStatus, jqXHR) {
    $scope.inAng("gotMix", function(){
      $scope.message    = null
      $scope.mix        = data.data
      $scope.mix.audio  = $scope.sce.trustAsResourceUrl($scope.mix.audio)
      $scope.mix.umChar = umChar
    })
  }

  //-------------------------------------
  function gotMixError(jqXHR, textStatus, error) {
    var message = "error getting 8tracks mix: " + textStatus + ": " + error

    $scope.inAng("gotMixError", function(){
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
