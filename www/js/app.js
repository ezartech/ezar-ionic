// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ionicApp', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && 
       window.cordova.plugins && //wayne: added due to https://github.com/driftyco/ng-cordova/issues/1028
       window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    if (window.ezar) {
      ezar.initializeVideoOverlay(
        function() {
          ezar.getBackCamera().start();
        },
	  		function(err) {
	  			alert('unable to init ezar: ' + err);
	  		});	  
    }
  });
})

.controller("AppController", function($scope, $timeout) {
  
  $scope.snapshotTimestamp = Date.now();
  $scope.reverseCameraTimestamp = Date.now();

  $scope.snapshot = function() {
          //ignore ghost clicks, wait 1.5 sec between invocations
          if (Date.now() - $scope.snapshotTimestamp < 1500) return;
          $scope.snapshotTimestamp = Date.now();
          
          //get snapshot & revcamera buttons to hide/show
          var snapshotBtn = document.getElementById("snapshot");
          var revCameraBtn = document.getElementById("revcamera");
          
          var inclWebView = true;    // include/exclude webView content on top of cameraView
          var inclCameraBtns = true; // show/hide snapshot & revcamera btns

          if (inclWebView && !inclCameraBtns) {
              revCameraBtn.classList.add("hide");
              snapshotBtn.classList.add("hide");              
          }

          setTimeout(function() {
            ezar.snapshot(
              function() {
                  //perform screen capture
                  //show snapshot button
                  if (inclWebView && !inclCameraBtns) {
                    snapshotBtn.classList.remove("hide");        
                    revCameraBtn.classList.remove("hide");
                  }
              },null,
              {encodingType: ezar.ImageEncoding.PNG,
               includeWebView: inclWebView,
               saveToPhotoAlbum: true});   
          },200);   
    };

    $scope.reverseCamera = function() {
      //ignore ghost clicks, wait 1.5 sec between invocations
      if (Date.now() - $scope.reverseCameraTimestamp < 1500) return;
      $scope.reverseCameraTimestamp = Date.now();

      var camera = ezar.getActiveCamera();
      if (!camera) {
        return; //no camera running; do nothing
      }

      var newCamera = camera;
      if (camera.getPosition() == "BACK" && ezar.hasFrontCamera()) { 
            newCamera = ezar.getFrontCamera();
      } else  if (camera.getPosition() == "FRONT" && ezar.hasBackCamera()) { 
            newCamera = ezar.getBackCamera();
      }

      if (newCamera) {
        newCamera.start();
      }
    }
  });
