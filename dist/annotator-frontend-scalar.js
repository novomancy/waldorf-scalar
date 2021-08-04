(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
    "client_id": "scalar",
    "client_ver": "2.5.12",
    "id": "user@example.com",
    "api_key": "abcd-hashkey-from-somewhere-else"
}
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationManager = void 0;

var _annotation = require("./annotation.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AnnotationManager = /*#__PURE__*/function () {
  function AnnotationManager() {
    _classCallCheck(this, AnnotationManager);

    this.annotations = [];
  }

  _createClass(AnnotationManager, [{
    key: "PopulateFromJSON",
    value: function PopulateFromJSON(json) {
      if (json.length == 0) {
        console.warn("JSON contains no annotations.");
      }

      this.annotations = [];

      var _iterator = _createForOfIteratorHelper(json),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var object = _step.value;
          this.RegisterAnnotation(object);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "RegisterAnnotation",
    value: function RegisterAnnotation(jsonObject) {
      //console.log("Registering new annotation with ID " + jsonObject.id);
      var anno = new _annotation.Annotation(jsonObject);
      this.annotations.push(anno);
    }
  }, {
    key: "RemoveAnnotation",
    value: function RemoveAnnotation(id) {
      //console.log("Removing: " + id);
      this.annotations = this.annotations.filter(function (obj) {
        return obj.id !== id;
      });
    }
    /**
     * Update the given annotation in the stored array
     */

  }, {
    key: "UpdateAnnotation",
    value: function UpdateAnnotation(annotation, oldID) {
      //console.log("Updating annotation ID " + oldID + " to " + annotation.metadata.id);
      this.RemoveAnnotation(oldID);
      this.RegisterAnnotation(annotation);
    }
  }, {
    key: "AnnotationsAtTime",
    value: function AnnotationsAtTime(time) {
      // TODO: Reenable with some kind of force parameter
      // // If the last time requested is asked for again, just give back the cached result
      // if(timeMS == this.lastTimeRequested){
      //     //console.log("Using cache");
      //     return this.cached;
      // }
      // this.lastTimeRequested = timeMS;
      // Filter all loaded annotations that fit within the range query.
      var filtered = this.annotations.filter(function (item) {
        return item.beginTime <= time && time <= item.endTime;
      });
      this.cached = filtered;
      return filtered;
    }
  }]);

  return AnnotationManager;
}();

exports.AnnotationManager = AnnotationManager;

},{"./annotation.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Annotation = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/// A wrapper for W3C Open Annotation JSON objects.
var Annotation = /*#__PURE__*/function () {
  function Annotation() {
    var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, Annotation);

    this["@context"] = "http://www.w3.org/ns/anno.jsonld"; // this["@context"] = ["http://www.w3.org/ns/anno.jsonld",
    //                 "http://iiif.io/api/presentation/3/context.json"];

    this["request"] = {
      "client_id": "scalar",
      "client_ver": "2.5.12",
      "items": {
        "native": false,
        "id": "__CHECK_CONFIG_FILE__ID__",
        "api_key": "__CHECK_CONFIG_FILE__API_KEY__",
        "action": "TOBEFILLED",
        "format": "json"
      }
    }; //TODO: ver2
    // this["service"] = {
    //     "client_id": "scalar",
    //     "client_ver": "2.5.12",
    //     "items": {
    //         "native": false,
    //         "id": "__CHECK_CONFIG_FILE__ID__",
    //         "api_key": "__CHECK_CONFIG_FILE__API_KEY__",
    //         "action": "TOBEFILLED",
    //         "format": "json"
    //     }
    // };
    //this["type"] = "Manifest"; //TODO: ver2

    this["type"] = "Annotation"; //TODO: ver1

    this["motivation"] = "highlighting";
    this["body"] = [];
    this["target"] = {}; //this["items"] = []; //TODO: ver2
    //delete this.beginTime;
    //delete this.endTime;
    //delete this.tags;

    this.readConfig();

    if (json) {
      // Merge the json into this class.
      Object.assign(this, json); // Compute read only easy access properties

      this.recalculate();
    }
  }

  _createClass(Annotation, [{
    key: "readConfig",
    value: function readConfig() {
      var config = require("../annotator-config.json"); //ver1


      this["request"]["client_id"] = config.client_id;
      this["request"]["client_ver"] = config.client_ver;
      this["request"]["items"]["id"] = config.id;
      this["request"]["items"]["api_key"] = config.api_key; //TODO: Ver2
      // this["service"]["client_id"] = config.client_id;
      // this["service"]["client_ver"] = config.client_ver;
      // this["service"]["items"]["id"] = config.id;
      // this["service"]["items"]["api_key"] = config.api_key;
    } /// Compute read only easy access properties

  }, {
    key: "recalculate",
    value: function recalculate() {
      var timeSlice = this.target.selector.filter(function (item) {
        return item.type === "FragmentSelector";
      })[0].value;
      timeSlice = timeSlice.replace("t=", ""); /// Start time in seconds

      this.beginTime = parseFloat(timeSlice.split(",")[0]); /// End time in seconds

      this.endTime = parseFloat(timeSlice.split(",")[1]); /// Extract tags from annotation

      this.tags = this.body.filter(function (item) {
        return item.purpose === "tagging";
      }).map(function (item) {
        return item.value;
      });
    }
  }, {
    key: "getPoly",
    value: function getPoly() {
      var pointsSelector = this.target.selector.filter(function (item) {
        return item.type === "SvgSelector";
      });
      if (pointsSelector.length == 0) return null; // Parse the points array from the annotation

      var pointsSvg = pointsSelector[0].value;
      var regExString = new RegExp("(?:points=')(.*?)(?:')", "ig"); //set ig flag for global search and case insensitive

      var pointsRE = regExString.exec(pointsSvg)[1];
      var pointsData = pointsRE.trim().split(" ").map(function (item) {
        return item.split(",");
      });
      return pointsData;
    }
  }, {
    key: "getSVGPolyPoints",
    value: function getSVGPolyPoints() {
      var pointsSelector = this.target.selector.filter(function (item) {
        return item.type === "SvgSelector";
      });
      if (pointsSelector.length == 0) return null; // Parse the points array from the annotation

      var pointsSvg = pointsSelector[0].value;
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(pointsSvg, "text/xml");
      return [xmlDoc.getElementsByTagName("animate")[0].getAttribute("from"), xmlDoc.getElementsByTagName("animate")[0].getAttribute("to")];
    }
  }]);

  return Annotation;
}();

exports.Annotation = Annotation;

},{"../annotator-config.json":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoAnnotator = void 0;

var _serverInterface = require("./server-interface.js");

var _annotationManager = require("./annotation-manager.js");

var _tickBar = require("./components/tick-bar.js");

var _polygonOverlay = require("./components/polygon-overlay.js");

var _preferenceManager = require("../utils/preference-manager.js");

var _annotationGui = require("./components/annotation-gui.js");

var _infoContainer = require("./components/info-container.js");

var _indexContainer = require("./components/index-container.js");

var _sessionManager = require("./session-manager.js");

var _messageOverlay = require("./components/message-overlay.js");

var _annotation2 = require("./annotation.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var sha1 = require('sha1');

var VideoAnnotator = /*#__PURE__*/function () {
  function VideoAnnotator(args) {
    var _this = this;

    _classCallCheck(this, VideoAnnotator);

    console.log("[VideoAnnotator] Creating VideoAnnotator..."); //Parse arguments
    //This is actually required

    if (typeof args.player === 'undefined') {
      console.log('Called for a new VideoAnnotator without passing a player!');
      return false;
    }

    this.player = args.player; //These config options are required for saving annotations to a server

    this.serverURL = typeof args.serverURL === 'undefined' ? '' : args.serverURL;
    this.tagsURL = typeof args.tagsURL === 'undefined' ? '' : args.tagsURL;
    this.apiKey = typeof args.apiKey === 'undefined' ? '' : args.apiKey; //If apiKey is set and cmsUsername and cmsEmail are passed, we'll auto login later

    this.cmsUsername = typeof args.cmsUsername === 'undefined' ? '' : args.cmsUsername;
    this.cmsEmail = typeof args.cmsEmail === 'undefined' ? '' : args.cmsEmail; //This config option is required for using a static annotation file

    this.localURL = typeof args.localURL === 'undefined' ? '' : args.localURL; //Optional params
    //Removes the editing interface

    this.kioskMode = typeof args.kioskMode === 'undefined' ? '' : args.kioskMode; //Shows the 'open manifest' button if kioskMode is off

    this.showManifest = typeof args.showManifest === 'undefined' ? false : args.showManifest; //Allows passing in a function that overrides the default annotation renderer

    this.renderer = typeof args.renderer === 'undefined' ? false : args.renderer; //Allows passing in a function that overrides the default annotation renderer

    this.unrenderer = typeof args.unrenderer === 'undefined' ? false : args.unrenderer; //Determines whether or not the annotation container is cleared every time it updates

    this.clearContainer = typeof args.clearContainer === 'undefined' ? true : args.clearContainer; //Determines whether or not to create a navigable index of annotations

    this.displayIndex = typeof args.displayIndex === 'undefined' ? false : args.displayIndex; //Determine the language of the annotation

    this.onomyLanguage = typeof args.onomyLanguage === 'undefined' ? '' : args.onomyLanguage; //localURL implies kiosk mode

    if (this.localURL != '') this.kioskMode = true;
    this.Wrap();
    this.PopulateControls(); //may need to move this below the this.server block later?

    this.messageOverlay = new _messageOverlay.MessageOverlay(this);
    this.annotationManager = new _annotationManager.AnnotationManager();
    this.sessionManager = new _sessionManager.SessionManager(this); //localURL takes precendence - if it is anything but '' then do not load from server

    if (this.localURL == '') {
      this.server = new _serverInterface.ServerInterface(this);
      this.server.SetBaseURL(this.serverURL); // Load annotations from server based on the player's video URL

      this.server.FetchAnnotations('location', this.player.videoElement.currentSrc).done(function (json) {
        //json.shift()  // Assume first node is a content node
        for (var j = json.length - 1; j >= 0; j--) {
          if (json[j].type != "Annotation") {
            json.splice(j, 1);
          } else {
            for (var k = 0; k < json[j].target.selector.length; k++) {
              if ('FragmentSelector' != json[j].target.selector[k].type) continue;
              json[j].target.selector[k].value = json[j].target.selector[k].value.replace('#t=npt:', 't=');
            }
          }
        }

        _this.annotationManager.PopulateFromJSON(json);

        _this.AnnotationsLoaded();
      }); //auto-login if not in kiosk mode, and we have the cms variables and API key

      if (!this.kioskMode) {
        if (this.apiKey && this.cmsEmail && this.cmsUsername) {
          this.server.LogOut();
          this.server.LogIn(this.cmsUsername, sha1(this.cmsEmail)).done(function () {
            console.log("[Main] CMS login success");
          }).fail(function () {
            console.log("[Main] CMS login failed");
          });
        }
      }
    } else {
      console.log('Loading local cache file: ' + this.localURL);
      $.ajax({
        url: this.localURL,
        type: "GET",
        dataType: "json",
        async: true
      }).done(function (data) {
        console.log("Fetched ".concat(data.length, " annotations from local cache."));
        var json = data;

        for (var j = json.length - 1; j >= 0; j--) {
          if (json[j].type != "Annotation") {
            json.splice(j, 1);
          } else {
            for (var k = 0; k < json[j].target.selector.length; k++) {
              if ('FragmentSelector' != json[j].target.selector[k].type) continue;
              json[j].target.selector[k].value = json[j].target.selector[k].value.replace('#t=npt:', 't=');
            }
          }
        }

        _this.annotationManager.PopulateFromJSON(data);

        _this.AnnotationsLoaded();
      }).fail(function (response) {
        console.log(response);
        console.error("Error fetching annotations from local cache\"\n".concat(response.responseJSON.detail, "."));

        _this.annotator.messageOverlay.ShowError("Could not retrieve annotations!<br>(".concat(response.responseJSON.detail, ")"));
      });
    }

    this.player.$container.on("OnTimeUpdate", function (event, time) {
      _this.OnTimeUpdate(time);
    });
    this.$container.on("OnPolyClicked", function (event, annotation) {
      // Edit a poly when clicked, but only if the editor isn't already open
      if (!_this.gui.open) {
        _this.$addAnnotationButton.button("disable");

        _this.gui.BeginEditing(annotation);
      }
    });
    this.$container.on("OnPolygonClicked", function (event, annotation) {
      console.log("OnPolygonClicked event captured");
    });
    this.$container.on("OnAnimationClicked", function (event, annotation) {
      console.log("OnAnimationClicked event captured");
    });
    this.gui.$container.on("OnGUIClosed", function (event) {
      _this.$addAnnotationButton.button("enable");
    });
    this.url = this.player.videoElement.currentSrc;
    console.log("[VideoAnnotator] Annotator created for video.");
  }

  _createClass(VideoAnnotator, [{
    key: "readConfig",
    value: function readConfig() {
      var config = require("../annotator-config.json");

      this.apiKey = config.api_key;
    }
    /**
     * Creates the divs that surround the video player.
     */

  }, {
    key: "Wrap",
    value: function Wrap() {
      // Wrap the video player with this container. Can't use .wrap due to duplication issues    
      var videoContainer = $(this.player.$container).parent();
      var waldorfContainer = $("<div class='waldorf-container'></div>");
      waldorfContainer.insertBefore($(this.player.$container));
      waldorfContainer.append(this.player.$container);
      this.$container = videoContainer.parent(); // Set the container to the width of the video player

      this.$container.width(this.player.$container.width()); // Allow the video player container to grow
      //this.player.$container.width("100%");
      //this.player.$container.height("100%");
      // Copy the video styles to the container
      // console.log(this.player.originalStyles);

      this.$container.css(this.player.originalStyles);
    }
  }, {
    key: "PopulateControls",
    value: function PopulateControls() {
      var _this2 = this;

      // Create the tick bar
      this.tickBar = new _tickBar.TickBar(this); // Create the polygon overlay

      this.polyOverlay = new _polygonOverlay.PolygonOverlay(this);

      if (!this.kioskMode && this.showManifest) {
        this.$debugControls = $("<div class='waldorf-debug-controls'></div>").appendTo(this.$container);
        var $showAllAnnotationsButton = this.$debugControls.append('<button>Open Annotation Manifest in New Window</button>');
        $showAllAnnotationsButton.click(function () {
          var url = _this2.player.videoElement.currentSrc;

          _this2.server.FetchAnnotations("location", url).done(function (json) {
            var win = window.open();

            if (win === null) {
              console.error("Couldn't show annotation manifest; please allow pop-ups.");

              _this2.messageOverlay.ShowError("Couldn't show annotation manifest; please allow pop-ups.");
            } else {
              win.document.open();
              win.document.write("<title>Annotation Manifest for ".concat(url, "</title>"));
              win.document.write("<pre>");
              win.document.write(JSON.stringify(json, null, 2).escapeHTML());
              win.document.write("</pre>");
              win.document.close();
            }
          });
        });
      } // Wrap all the buttons with the list tag
      //this.$debugControls.wrapInner("<ul></ul>");
      // Wrap each button with the list element tag
      //this.$debugControls.find("button").wrap("<li></li>");
      // Create the info container


      this.infoContainer = new _infoContainer.InfoContainer(this);
      if (this.displayIndex) this.indexContainer = new _indexContainer.IndexContainer(this); // Inject the annotation edit button into the toolbar

      if (!this.kioskMode) {
        this.$addAnnotationButton = $("<button>Add New Annotation</button>").button({
          icon: "fa fa-plus",
          showLabel: false
        }).click(function () {
          _this2.$addAnnotationButton.button("disable");

          _this2.gui.BeginEditing();
        });
        this.player.controlBar.RegisterElement(this.$addAnnotationButton, 3, 'flex-end'); // Inject the annotation upload button into the toolbar

        this.$uploadAnnotationButton = $("<button type='file'>Import Annotation From File</button>").button({
          icon: "fa fa-upload",
          showLabel: false
        }).click(function () {
          _this2.LoadFromFile();
        });
        this.player.controlBar.RegisterElement(this.$uploadAnnotationButton, 2, 'flex-end');
      }

      this.gui = new _annotationGui.AnnotationGUI(this);
    }
  }, {
    key: "AnnotationsLoaded",
    value: function AnnotationsLoaded() {
      //Send annotation loaded event
      this.$container.trigger("OnAnnotationsLoaded", this.annotationManager);
    }
  }, {
    key: "OnTimeUpdate",
    value: function OnTimeUpdate(time) {
      this.annotationsNow = this.annotationManager.AnnotationsAtTime(time);

      if (this.annotationsNow.equals(this.lastAnnotationSet)) {
        this.SetAnnotationTimePosition(time);
        return;
      }

      this.lastAnnotationSet = this.annotationsNow;
      this.UpdateViews();
    }
  }, {
    key: "SetAnnotationTimePosition",
    value: function SetAnnotationTimePosition(time) {
      //console.log("time: " + time);
      //Check safari and multiple geometric annotation
      if (this.IsSafari() && this.annotationsNow.length > 1) {
        var msg = "Multiple geometric annotations are detected.<br>";
        msg += "Safari doesn't support multiple geometric annotations.<br>";
        msg += "Chrome or Firefox are recommended.";
        this.messageOverlay.ShowMessage(msg, 2.0);
        return; //no animation for safari browser with multiple geometric annotation
      }

      for (var i = 0; i < this.annotationsNow.length; i++) {
        var annotation_id = this.annotationsNow[i].id;

        if (this.polyOverlay.svgElementsHash[annotation_id]) {
          this.polyOverlay.svgElementsHash[annotation_id].animate.beginElement();
          var time_diff = time - this.annotationsNow[i].beginTime;
          var current_time = this.polyOverlay.svgElementsHash[annotation_id].svgElement.getCurrentTime(); //console.log("\t i:" + i + " (" + annotation_id + "), svg current_time:" + current_time + ", animate time_diff: " + time_diff);

          this.polyOverlay.svgElementsHash[annotation_id].svgElement.setCurrentTime(current_time + time_diff);
          this.polyOverlay.svgElementsHash[annotation_id].animate.endElement();
        }
      }
    }
  }, {
    key: "UpdateViews",
    value: function UpdateViews() {
      //console.log("annotator.js:267 UpdateViews");
      this.annotationsNow = this.annotationManager.AnnotationsAtTime(this.player.videoElement.currentTime); // Update the info container

      this.infoContainer.Rebuild(this.annotationsNow, this.clearContainer);
      this.$container.trigger("OnNewAnnotationSet", [this.annotationsNow]);
      this.SetAnnotationTimePosition(this.player.videoElement.currentTime);
    }
  }, {
    key: "GetAnnotations",
    value: function GetAnnotations() {
      var ordered = this.annotationManager.annotations.slice();

      var orderByStart = function orderByStart(a, b) {
        var aTime = a.beginTime;
        var bTime = b.beginTime;
        return aTime < bTime ? -1 : aTime > bTime ? 1 : 0;
      };

      ordered.sort(orderByStart);
      return ordered;
    }
  }, {
    key: "RegisterNewAnnotation",
    value: function RegisterNewAnnotation(annotation) {
      //console.log(annotation);
      this.annotationManager.RegisterAnnotation(annotation); // Throw event for listening objects (e.g. tick-bar)

      this.$container.trigger("OnAnnotationRegistered", [annotation]); // Update dependent views

      this.UpdateViews();
    }
  }, {
    key: "UpdateAnnotation",
    value: function UpdateAnnotation(annotation, oldID) {
      this.annotationManager.UpdateAnnotation(annotation, oldID); // Throw event for listening objects (e.g. tick-bar)

      this.$container.trigger("OnAnnotationRemoved", [oldID]);
      this.$container.trigger("OnAnnotationRegistered", [annotation]); // Update dependent views

      this.UpdateViews();
    }
  }, {
    key: "DeregisterAnnotation",
    value: function DeregisterAnnotation(annotation) {
      this.annotationManager.RemoveAnnotation(annotation.id); //this.annotationsNow = this.annotationManager.AnnotationsAtTime(this.player.videoElement.currentTime);
      // Throw event for listening objects (e.g. tick-bar)

      this.$container.trigger("OnAnnotationRemoved", [annotation.id]); // Update dependent views

      this.UpdateViews();
    }
  }, {
    key: "LoadFromFile",
    value: function LoadFromFile() {
      var _this3 = this;

      // Create the dialog
      var $container = $("<div class='waldorf-session-modal' title='Import Annotation'></div>"); // Outermost HTML

      var $headText = $("<p class='validateTips'>Annotations must be W3C OA compliant in JSON format.</p>").appendTo($container);
      var $errorText = $("<p class='validateTips modal-error-text'></p>").appendTo($container);
      $errorText.hide();
      var $form = $("<form></form>").appendTo($container);
      var $importField;
      $("<label for='importFile'>Select File</label>").appendTo($form);
      $importField = $("<input type='file' name='importFile' class='file ui-widget-content ui-corner-all'>").appendTo($form);
      $form.wrapInner("<fieldset />");

      var error = function error(message) {
        console.error(message);
        $errorText.html(message);
        $errorText.show();
      };

      var self = this;
      $importField.on('change', function () {
        var files = $importField.get(0).files;
        var fr = new FileReader();

        fr.onload = function (localFile) {
          // If the JSON is malformed, show an error and stop here.
          try {
            JSON.parse(localFile.target.result);
          } catch (e) {
            error("JSON file is malformed!");
            return;
          }

          var localJson = JSON.parse(localFile.target.result);

          if (typeof localJson.target != "undefined") {
            var annotation = new _annotation2.Annotation(localJson);

            if (_this3.ValidateAnnotation(annotation)) {
              // Open the GUI and populate it with this annotation's data.
              _this3.gui.BeginEditing(annotation, true);

              _this3.gui.CommitAnnotationToServer(function () {
                return;
              });
            } else {
              error("JSON is invalid!");
            }
          } else {
            for (var i = 0; i < localJson.length; i++) {
              var _annotation = new _annotation2.Annotation(localJson[i]);

              if (_this3.ValidateAnnotation(_annotation)) {
                // Open the GUI and populate it with this annotation's data.
                _this3.gui.BeginEditing(_annotation, true);

                _this3.gui.CommitAnnotationToServer(function (annotation) {
                  _this3.RegisterNewAnnotation(annotation);

                  _this3.gui.Close();
                });
              } else {
                error("JSON is invalid!");
              }
            }
          }

          $dialog.dialog("close");
        };

        fr.readAsText(files[0]);
      });
      var $dialog = $container.dialog({
        autoOpen: true,
        draggable: false,
        modal: true,
        buttons: {
          Cancel: function Cancel() {
            $dialog.dialog("close");
          }
        },
        close: function close() {
          $dialog.find("form")[0].reset();
          $dialog.find("input").removeClass("ui-state-error"); //this.OnModalClose();
        }
      });
    }
  }, {
    key: "ValidateAnnotation",
    value: function ValidateAnnotation(annotation) {
      // TODO: Validate annotation here. Return false if any
      // required properties are not present.
      return true;
    } // checking whether the browser is safari or not

  }, {
    key: "IsSafari",
    value: function IsSafari() {
      //ref: https://stackoverflow.com/questions/49872111/detect-safari-and-stop-script
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      return isSafari;
    }
  }]);

  return VideoAnnotator;
}();

exports.VideoAnnotator = VideoAnnotator;

},{"../annotator-config.json":1,"../utils/preference-manager.js":18,"./annotation-manager.js":2,"./annotation.js":3,"./components/annotation-gui.js":5,"./components/index-container.js":6,"./components/info-container.js":7,"./components/message-overlay.js":8,"./components/polygon-overlay.js":10,"./components/tick-bar.js":11,"./server-interface.js":12,"./session-manager.js":13,"sha1":35}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationGUI = void 0;

var _time = require("../../utils/time.js");

var _polygonEditor = require("./polygon-editor.js");

var _annotation = require("../annotation.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AnnotationGUI = /*#__PURE__*/function () {
  function AnnotationGUI(annotator) {
    var _this = this;

    _classCallCheck(this, AnnotationGUI);

    this.annotator = annotator;
    this.Create();
    this.open = false; //Hide the container

    this.isVisible = false;
    this.$container.makeVisible(false);
    this.polyEditor = new _polygonEditor.PolygonEditor(this.annotator);
    this.annotator.$container.on("OnPolygonEditingEnded", function () {
      _this.SetVisible(true);

      _this.polyEditor.ShowJustPolygon();
    });
  }

  _createClass(AnnotationGUI, [{
    key: "Create",
    value: function Create() {
      var _this2 = this;

      /*
       * //new UI
       * 
       */
      this.$container = $("<div id='create-dialog' class='ui-widget-content center'>").appendTo(this.annotator.player.$container);
      this.$container.draggable();
      this.$title = $("<div class='dialog-title'>Create Annotation</div>").appendTo(this.$container); // Make cancel button

      var $exitButton = $("<button>Exit Annotation Editing</button>").button({
        icons: {
          primary: 'fa fa-remove'
        },
        showLabel: false
      });
      $exitButton.css("float", "right");
      $exitButton.attr('title', "Exit annotation editing");
      $exitButton.addClass("waldorf-cancel-button");
      $exitButton.click(function () {
        _this2.polyEditor.ResetPolygons();

        _this2.Close();
      });
      this.RegisterElement($exitButton, this.$title, -1);
      this.$tabs = $("<div id='tabs'></div>").appendTo(this.$container);
      var $tabUI = $("<ul></ul>");
      var $startUI = $("<li><a href='#start_tab'>Start </a></li>");
      var $bodyUI = $("<li><a href='#body_tab'>Body </a></li>");
      var $stopUI = $("<li><a href='#stop_tab'>Stop </a></li>");
      this.RegisterElement($tabUI, this.$tabs, -1);
      this.RegisterElement($startUI, $tabUI, -1);
      this.RegisterElement($bodyUI, $tabUI, -1);
      this.RegisterElement($stopUI, $tabUI, -1);
      var $startTab = $("<div id='start_tab' class='ui-field-contain'>" + "<label for='start_time'>Start Time</label><br>" + "</div>");
      this.RegisterElement($startTab, this.$tabs, -1); // Make "Start time" label and field

      this.$timeStartField = $('<input type="text" name="time-start" id="time-start" value="">').appendTo($startTab);
      this.$timeStartField.width(72);
      this.$timeStartField.css("font-family", "Courier, monospace");
      this.$timeStartField.css("margin-right", "2px");
      this.$timeStartField.addClass("ui-widget ui-widget-content ui-corner-all");
      this.$timeStartField.attr('title', "Start time (hh:mm:ss.ss)");
      this.$timeStartField.on('keypress', function (event) {
        if (event.keyCode == 46 || event.keyCode >= 48 && event.keyCode <= 58) {
          //0-9, period, and colon
          return true;
        }

        return false;
      }); //add start marker button

      this.$startTimeMarker = $("<button style='padding:0; line-height:1.4'>Set End</button>").button({
        icon: "fa fa-map-marker",
        showLabel: false
      }).click(function () {
        _this2.$timeStartField[0].value = (0, _time.GetFormattedTime)(_this2.annotator.player.videoElement.currentTime);
      });
      this.RegisterElement(this.$startTimeMarker, $startTab, -2); //start point polygon is added

      this.$startPolygonSet = $("<button style='padding:0; line-height:1.4'>Start Polygon Set</button>").button({
        icon: "fa fa-check-square-o",
        showLabel: false
      }); //this.$startPolygonSet.css("visibility", "inherit");

      this.$startPolygonSet.css("visibility", "hidden");
      this.$startPolygonSet.addClass("waldorf-confirm-button"); //this.RegisterElement(this.$startPolygonSet, $startTab, -2); 

      var $bodyTab = $("<div id='body_tab'></div>");
      this.RegisterElement($bodyTab, this.$tabs, -1); // Add tags input field

      this.$tagsField = $('<select class="form-control" multiple="multiple"></select>');
      this.$tagsField.width("100%");
      this.$tagsField.css("margin-top", "-8px");
      this.RegisterElement(this.$tagsField, $bodyTab, -1);
      this.$tagsField.select2({
        tags: true,
        placeholder: "Tags",
        ajax: this.GetTagsQuery(),
        selectOnBlur: true,
        // Allow manually entered text in drop down.
        createTag: function createTag(params) {
          return {
            id: params.term,
            text: params.term,
            newOption: true
          };
        }
      }); // Add custom class for bringing the dropdown to the front (fullscreen fix)

      this.$tagsField.data('select2').$dropdown.addClass("select2-dropdown-annotator"); // Make notes text field

      this.$textField = $('<textarea type="text" name="anno-text" id="anno-text" value="" placeholder="Notes">');
      this.$textField.css("margin-top", "2px");
      this.$textField.width("98.5%");
      this.$textField.addClass("ui-widget ui-widget-content ui-corner-all");
      this.$textField.attr('title', 'Annotation text');
      this.$textField.css("flex-grow", 2);
      this.RegisterElement(this.$textField, $bodyTab, -1);
      var $stopTab = $("<div id='stop_tab'>" + "<label for='stop_time'>Stop Time</label><br>" + "</div>");
      this.RegisterElement($stopTab, this.$tabs, -1); // Make "Start time" label and field

      this.$timeEndField = $('<input type="text" name="time-start" id="time-start" value="">').appendTo($stopTab);
      this.$timeEndField.width(72);
      this.$timeEndField.css("font-family", "Courier, monospace");
      this.$timeEndField.css("margin-right", "2px");
      this.$timeEndField.addClass("ui-widget ui-widget-content ui-corner-all");
      this.$timeEndField.attr('title', "Start time (hh:mm:ss.ss)");
      this.$timeEndField.on('keypress', function (event) {
        if (event.keyCode == 46 || event.keyCode >= 48 && event.keyCode <= 58) {
          //0-9, period, and colon
          return true;
        }

        return false;
      }); //add start marker button

      this.$endTimeMarker = $("<button style='padding:0; line-height:1.4'>Set End</button>").button({
        icon: "fa fa-map-marker",
        showLabel: false
      }).click(function () {
        _this2.$timeEndField[0].value = (0, _time.GetFormattedTime)(_this2.annotator.player.videoElement.currentTime);
      });
      this.RegisterElement(this.$endTimeMarker, $stopTab, -2); //stop point polygon is added

      this.$endPolygonSet = $("<button style='padding:0; line-height:1.4'>End Polygon Set</button>").button({
        icon: "fa fa-check-square-o",
        showLabel: false
      }); //this.$endPolygonSet.css("visibility", "inherit");

      this.$endPolygonSet.css("visibility", "hidden"); //this.$endPolygonSet.addClass("waldorf-confirm-button");
      //Add some error checking...

      this.$timeEndField.blur(function () {
        var e = $(_this2.$timeEndField).val();
        var s = $(_this2.$timeStartField).val();

        if ((0, _time.GetSecondsFromHMS)(s + 1) > (0, _time.GetSecondsFromHMS)(e)) {
          $(_this2.$timeEndField).val((0, _time.GetFormattedTime)((0, _time.GetSecondsFromHMS)(s) + .01));
        }
      });
      this.$timeStartField.blur(function () {
        var e = $(_this2.$timeEndField).val();
        var s = $(_this2.$timeStartField).val();

        if ((0, _time.GetSecondsFromHMS)(s + 1) > (0, _time.GetSecondsFromHMS)(e)) {
          $(_this2.$timeEndField).val((0, _time.GetFormattedTime)((0, _time.GetSecondsFromHMS)(s) + .01));
        }
      });
      this.RegisterElement(this.$endPolygonSet, $stopTab, -2);
      var $buttonPanel = $("<div class='button_panel'></div>").appendTo(this.$container);
      var $startTargetLabel = $("<label>Start Target</label><br>");
      $startTargetLabel.css("color", "white");
      this.RegisterElement($startTargetLabel, $buttonPanel, -1); //Make "Edit polygon" button

      var $editPolyButton = $("<button>Edit Polygon</button>").button({
        icon: "fa fa-pencil",
        showLabel: false
      }).click(function () {
        _this2.SetVisible(false);

        console.log("annotation-gui:353 Create");

        _this2.polyEditor.BeginEditing();
      });
      $editPolyButton.attr('title', "Edit polygon test2");
      this.RegisterElement($editPolyButton, $buttonPanel, -1); // Make delete button

      this.$deleteButton = $("<button>Delete Annotation</button>").button({
        icon: "fa fa-bomb",
        showLabel: false
      });
      this.$deleteButton.css("margin-right", "15px");
      this.$deleteButton.attr('title', "Delete annotation");
      this.$deleteButton.click(function () {
        _this2.annotator.server.DeleteAnnotation(_this2.originalAnnotation).done(function (response) {
          _this2.annotator.DeregisterAnnotation(_this2.originalAnnotation);

          _this2.Close();
        });
      });
      this.RegisterElement(this.$deleteButton, $buttonPanel, -1); // Make cancel button

      var $cancelButton = $("<br><br><button>Cancel</button>").button({
        showLabel: true
      }).click(function () {
        _this2.polyEditor.ResetPolygons();

        _this2.Close();
      });
      $cancelButton.css("float", "right");
      $cancelButton.attr('title', "Exit annotation editing"); //$cancel_button.addClass("waldorf-cancel-button");

      this.RegisterElement($cancelButton, $buttonPanel, -1); // Make save button

      var $saveButton = $("<button>Save</button>").button({
        showLabel: true
      }).click(function () {
        _this2.CommitAnnotationToServer(function (annotation, oldID) {
          if (_this2.editMode) {
            _this2.annotator.UpdateAnnotation(annotation, oldID);
          } else {
            _this2.annotator.RegisterNewAnnotation(annotation);
          }

          _this2.polyEditor.ResetPolygons();

          _this2.Close();
        });
      });
      $saveButton.css("float", "left");
      this.RegisterElement($saveButton, $buttonPanel, -1);
      this.$tabs.tabs().addClass('ui-tabs-vertical'); //let $script_section = $
      //this.$container.hide();
    }
  }, {
    key: "RegisterElement",
    value: function RegisterElement($element, $container, order) {
      var justification = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'flex-start';
      $element.css('order', order);
      $element.css('align-self', justification); // Sets grow [shrink] [basis]
      //$element.css('flex', '0 0 auto');

      $container.append($element);
    }
  }, {
    key: "SetVisible",
    value: function SetVisible(isVisible) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      //console.log(isVisible + " " + duration);
      if (isVisible) {
        this.$container.fadeTo(duration, 1.0);
        this.$container.makeVisible(true);
      } else {
        this.$container.stop(true, true);
        this.$container.fadeTo(duration, 0.0);
        this.$container.makeVisible(false);
      }

      this.isVisible = isVisible;
    }
  }, {
    key: "ToggleOpen",
    value: function ToggleOpen() {
      if (this.open) {
        this.Close();
      } else {
        this.Open();
      }
    }
  }, {
    key: "Open",
    value: function Open() {
      this.SetVisible(true);
      this.open = true;
      this.polyEditor.Done(); // Disable autofading when the gui is visible

      this.annotator.player.SetAutoFade(false);
    }
  }, {
    key: "Close",
    value: function Close() {
      this.SetVisible(false);
      this.open = false;
      this.polyEditor.Done(); // Re-enable autofading when the gui is hidden

      this.annotator.player.SetAutoFade(true);
      this.$container.trigger("OnGUIClosed");
    }
  }, {
    key: "ToggleVisible",
    value: function ToggleVisible() {
      this.SetVisible(!this.isVisible, 0);
    }
  }, {
    key: "BeginEditing",
    value: function BeginEditing() {
      var annotation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var forceNew = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // Open the GUI if it isn't already
      this.Open();
      console.log("annotation-gui: BeginEditing 447");
      console.log(this.polyEditor.$polygons); //console.log(annotation);
      // Populate data from the passed in annotation

      if (annotation || forceNew) {
        // Populate the fields from the annotation
        this.editMode = true; // Flip edit mode back to false if forceNew. We want to
        // populate from the entire passed in annotation, but treat
        // it as new.

        if (forceNew) this.editMode = false;
        this.originalAnnotation = annotation;
        console.log("Populated from an existing annotation");
        console.log(annotation);
        this.$timeStartField.val((0, _time.GetFormattedTime)(annotation.beginTime));
        this.$timeEndField.val((0, _time.GetFormattedTime)(annotation.endTime));
        this.$textField.val(annotation.body.filter(function (item) {
          return item.purpose == "describing";
        })[0].value); // Reset the tags field

        this.$tagsField.val("").trigger("change");
        this.$tagsField.find("option").remove();

        var _iterator = _createForOfIteratorHelper(annotation.tags),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var tag = _step.value;
            this.$tagsField.append("<option value='" + tag + "' selected>" + tag + "</option>");
            this.$tagsField.trigger("change");
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this.polyEditor.InitPoly(annotation.getPoly());
        this.polyEditor.ShowJustPolygon();
      } // Insert template data if no annotation is given
      else {
          // Populate fields if no annotation is given
          this.editMode = false;
          this.originalAnnotation = null;
          console.log("Populated with template data");
          this.$timeStartField.val((0, _time.GetFormattedTime)(this.annotator.player.videoElement.currentTime));
          this.$timeEndField.val((0, _time.GetFormattedTime)(this.annotator.player.videoElement.duration));
          this.$textField.val(""); // Reset the tags field

          this.$tagsField.val("").trigger("change");
          this.$tagsField.find("option").remove();
          this.polyEditor.InitPoly();
        } // Modify GUI based on edit mode


      if (this.editMode) {
        this.$title.text("Edit Annotation");
        this.$deleteButton.button("enable");
      } else {
        this.$title.text("Create Annotation");
        this.$deleteButton.button("disable");
      }
    }
  }, {
    key: "CommitAnnotationToServer",
    value: function CommitAnnotationToServer(callback) {
      if (this.editMode) {
        console.log("Sending edited annotation to server...");
        this.annotator.server.EditAnnotation(callback);
      } else {
        console.log("Sending new annotation to server...");
        this.annotator.server.PostAnnotation(callback);
      }
    } // Build an Open Annotation object from the data.

  }, {
    key: "GetAnnotationObject",
    value: function GetAnnotationObject() {
      var annotation = new _annotation.Annotation(this.originalAnnotation); //console.log("this.originalAnnotation: " + JSON.stringify(this.originalAnnotation)); //prints null

      annotation["body"] = this.BuildAnnotationBodyV1();
      annotation["target"] = this.BuildAnnotationTarget(); //annotation["items"] = this.BuildAnnotationItems();
      // Recompute read-only access properties after all other properties have been set

      annotation.recalculate(); // Clone the object so we don't modify anything by changing this object

      var clone = JSON.parse(JSON.stringify(annotation));
      return clone;
    }
  }, {
    key: "BuildAnnotationItems",
    value: function BuildAnnotationItems() {
      var buildTime = new Date().toISOString(); //"2020-08-16T12:00:00Z"

      var items = [{
        "id": "",
        //TODO: "art:url" from annotation json file
        "type": "Canvas",
        "height": 480,
        //TODO:
        "width": 640,
        //TODO:
        "duration": 143,
        //TODO:
        "content": [{
          "id": "",
          //TODO: media file reference id - check the incoming annotation collection for id
          "type": "Video",
          "height": 480,
          //TODO:
          "width": 640,
          //TODO:
          "duration": 143,
          //TODO:
          "label": {
            "en": "Inception Corgi Flop" //TODO: "dcterms:title" from the annotation json file

          },
          "description": {
            "en": ""
          }
        }],
        "items": [{
          "id": "",
          "type": "AnnotationPage",
          "generator": "http://github.com/anvc/scalar",
          "generated": buildTime,
          "items": [{
            "id": "",
            //Annotation id - after successful data saving
            "type": "Annotation",
            "generator": "http://github.com/novomancy/waldorf-scalar",
            //TODO: config value
            "motivation": "highlighting",
            "creator": this.BuildCreatorTemplate(),
            //TODO: 
            "created": buildTime,
            "rights": "https://creativecommons.org/licenses/by/4.0/"
          }],
          "body": this.BuildAnnotationBodyV2(),
          //TODO: 
          "target": this.BuildAnnotationTarget()
        }]
      }];
      return items;
    } //TODO:

  }, {
    key: "BuildCreatorTemplate",
    value: function BuildCreatorTemplate() {
      return {
        "type": "Person",
        "nickname": "John Bell",
        "email_sha1": "REMOVED"
      };
    } //TODO: build with tags entries from onomy

  }, {
    key: "BuildAnnotationBodyV2",
    value: function BuildAnnotationBodyV2() {
      return this.BuildAnnotationBodyV1();
    }
  }, {
    key: "BuildAnnotationBodyV1",
    value: function BuildAnnotationBodyV1() {
      var body = []; // Build text descriptor

      var bodyText = {
        "type": "TextualBody",
        "value": this.$textField.val(),
        "format": "text/plain",
        "language": "en",
        "purpose": "describing"
      };
      body.push(bodyText); // Build tag descriptors

      var tags = this.$tagsField.select2("data").map(function (item) {
        return item.text;
      });

      var _iterator2 = _createForOfIteratorHelper(tags),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var tagStr = _step2.value;
          var bodyTag = {
            "type": "TextualBody",
            "purpose": "tagging",
            "value": tagStr
          };
          body.push(bodyTag);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return body;
    }
  }, {
    key: "BuildAnnotationTarget",
    value: function BuildAnnotationTarget() {
      var target = {
        "id": this.annotator.url,
        // URL of the video
        "type": "Video"
      };
      var selectors = [];
      var safeEndTime = (0, _time.GetSecondsFromHMS)(this.$timeStartField.val());

      if ((0, _time.GetSecondsFromHMS)(this.$timeEndField.val()) > (0, _time.GetSecondsFromHMS)(this.$timeStartField.val())) {
        safeEndTime = (0, _time.GetSecondsFromHMS)(this.$timeEndField.val());
      }

      var startTime = (0, _time.GetSecondsFromHMS)(this.$timeStartField.val()); //Build SvgSelector

      if (this.polyEditor.$polygons.length > 0) {
        var pointsStr = this.polyEditor.$polygons[0].map(function (item) {
          return "".concat(item[0], ",").concat(item[1]);
        }).join(" ");
        var animeStr = this.polyEditor.$polygons[1].map(function (item) {
          return "".concat(item[0], ",").concat(item[1]);
        }).join(" ");
        var value = "<svg viewBox='0 0 100 100' preserveAspectRatio='none'>";
        value += "<polygon points='" + pointsStr + "' />";
        value += "<animate attributeName='points' from='" + pointsStr + "' to='" + animeStr + "'";
        value += " start='" + startTime + "' end='" + safeEndTime + "' />";
        value += "</svg>";
        var polygonSelector = {
          "type": "SvgSelector",
          "conformsTo": "http://www.w3.org/TR/media-frags/",
          //added for v2
          "value": "".concat(value) // http://stackoverflow.com/a/24898728

        };
        selectors.push(polygonSelector);
      } // Build time selector


      var timeSelector = {
        "type": "FragmentSelector",
        "conformsTo": "http://www.w3.org/TR/media-frags/",
        // See media fragment specification
        "value": "t=".concat(startTime, ",").concat(safeEndTime) // Time interval in seconds

      };
      selectors.push(timeSelector); // Finalize target section

      target["selector"] = selectors;
      return target;
    }
  }, {
    key: "GetTagsQuery",
    value: function GetTagsQuery() {
      console.log("this.annotator.onomyLanguage: " + this.annotator.onomyLanguage);
      return {
        url: this.annotator.tagsURL,
        dataType: 'json',
        delay: 250,
        cache: true,
        onomyLanguage: this.annotator.onomyLanguage,
        processResults: function processResults(data) {
          // Parse the labels into the format expected by Select2
          // multilingual tags
          var multilingual_tags = []; //let m_comments = {};
          //let comments = {};

          var m_index = 1;
          var tags = [];
          var index = 1; //let root_comment = data["rdfs:comment"];

          var _iterator3 = _createForOfIteratorHelper(data["terms"]),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var term = _step3.value;

              //if onomyLanguage is defined collect multilingual tags
              //let terms_id = term["rdfs:about"];
              if (this.ajaxOptions.onomyLanguage != '' && term['labels'] != undefined) {
                var _iterator4 = _createForOfIteratorHelper(term["labels"]),
                    _step4;

                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    var label = _step4.value;
                    var xml_lang = label["xml:lang"];
                    var m_label = label["rdfs:label"];

                    if (xml_lang == this.ajaxOptions.onomyLanguage && m_label && m_label.trim != "") {
                      multilingual_tags.push({
                        id: m_index,
                        text: m_label
                      });
                    }
                  } // if (term['comments'] != undefined) {
                  //     for (let label of term['comments']) {
                  //         let xml_lang = label["xml:lang"];
                  //         let m_comment = label["rdfs:comments"]; //TODO: change to comment after fixing Onomy
                  //         if (xml_lang == this.ajaxOptions.onomyLanguage && m_comment && m_comment.trim != "") {
                  //             m_comments[m_index] = m_comment;
                  //         } 
                  //     }
                  // }
                  // // push the root value if it is blank
                  // if (m_comments[m_index].comment == undefined || m_comments[m_index].comment.trim == "") {
                  //     m_comments[m_index] = root_comment
                  // }

                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }

                m_index++;
              }

              tags.push({
                id: index,
                text: term["rdfs:label"]
              }); // let node_comment = term["rdfs:comment"];
              // if (node_comment.trim == "") {
              //     node_comment = root_comment;
              // }
              // comments[index] = node_comment;

              index++;
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          var return_tags = multilingual_tags;

          if (return_tags.length == 0) {
            return_tags = tags;
          }

          console.log("return_tags");
          console.log(return_tags);
          return {
            //results: tags - use tags when the language is not defined
            results: return_tags
          };
        }
      };
    }
  }]);

  return AnnotationGUI;
}();

exports.AnnotationGUI = AnnotationGUI;

},{"../../utils/time.js":21,"../annotation.js":3,"./polygon-editor.js":9}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexContainer = void 0;

var _time = require("../../utils/time.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var sha1 = require('sha1');

var IndexContainer = /*#__PURE__*/function () {
  function IndexContainer(annotator) {
    var _this = this;

    _classCallCheck(this, IndexContainer);

    console.log("[Index Container] Creating annotation index");
    this.annotator = annotator;
    var container = $(".waldorf-index");

    if (container.length > 0) {
      this.$container = container.first();
    } else {
      this.$container = $("<div class='waldorf-index' aria-live='polite' role='navigation'></div>").appendTo(this.annotator.$container);
    }

    this.annotationList = $("<ul class='waldorf-annotation-list' role='menubar'></ul>").appendTo(this.$container); // Attach event handlers

    this.annotator.$container.on("OnAnnotationsLoaded", function (event, annotationManager) {
      return _this.Rebuild();
    });
    this.annotator.$container.on("OnAnnotationRegistered", function (event, annotation) {
      return _this.Rebuild();
    });
    this.annotator.$container.on("OnAnnotationRemoved", function (event, id) {
      return _this.Rebuild();
    });
  }

  _createClass(IndexContainer, [{
    key: "Rebuild",
    value: function Rebuild() {
      this.annotationList.empty(); // if(this.annotator.unrenderer) this.annotator.unrenderer(this.annotator);
      // let plural = annotations.length == 1 ? "" : "s";
      // let totalAnnotations = this.annotator.annotationManager.annotations.length;
      // this.$container.html(`<p>Showing ${annotations.length} annotation${plural} (${totalAnnotations} total).</p>`);
      // Add each annotation to the readout

      var ordered = this.annotator.GetAnnotations();

      for (var i = 0; i < ordered.length; i++) {
        this.annotationList.append(this.MakeContainer(this.annotator, ordered[i], i));
      }
    }
  }, {
    key: "MakeContainer",
    value: function MakeContainer(annotator, annotation) {
      //TODO: ARIA and general screen reader compatibility
      var $panel = $("<li role='presentation' data-creator=" + annotation.creator.email + " data-tags='" + annotation.tags.join(", ").replace("'", "%27") + "'></li>"); //let text = JSON.stringify(annotation.AsOpenAnnotation(), null, 2);

      var headerText = (0, _time.GetFormattedTime)(annotation.beginTime) + " - " + (0, _time.GetFormattedTime)(annotation.endTime); // Add clickable header that brings up the edit interface.

      var $header = $("<a href='' title='Go to Annotation' role='menuitem'>" + headerText + "</a><br>");
      $header.click(function (event) {
        event.preventDefault();
        annotator.player.videoElement.currentTime = annotation.beginTime; // if(annotator.player.videoElement.annotationTimeout) clearTimeout(annotator.player.videoElement.annotationTimeout);
        // annotator.player.videoElement.annotationTimeout = setTimeout(function(){
        //     annotator.player.videoElement.pause()}, (annotation.endTime-annotation.beginTime) * 1000
        // );
        //annotator.player.videoElement.src=annotator.url + "#t=" + annotation.beginTime +","+annotation.endTime;
        //annotator.player.videoElement.play();

        annotator.player.Play();
        annotator.player.endTime = annotation.endTime;

        if (annotation.beginTime + 1 > annotation.endTime) {
          annotator.player.Pause();
        }
      });
      $panel.append($header);
      var $content = $("<p></p>");
      $content.append("<b>Text: </b> " + annotation.body.filter(function (item) {
        return item.purpose === "describing";
      })[0].value);
      $content.append("<br>");
      $content.append("<b>Tags: </b> " + annotation.tags.join(", "));
      $content.append("<br>");
      $panel.append($content);
      $panel.appendTo(annotator.$annotationList); // console.log($panel);

      return $panel;
    }
  }]);

  return IndexContainer;
}();

exports.IndexContainer = IndexContainer;

},{"../../utils/time.js":21,"sha1":35}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfoContainer = void 0;

var _time = require("../../utils/time.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var sha1 = require('sha1');

var InfoContainer = /*#__PURE__*/function () {
  function InfoContainer(annotator) {
    _classCallCheck(this, InfoContainer);

    this.annotator = annotator;
    var container = $(".waldorf-info");

    if (container.length > 0) {
      this.$container = container.first();
    } else {
      this.$container = $("<div class='waldorf-info' aria-live='polite' aria-atomic='true'></div>").appendTo(this.annotator.$container);
    }
  }

  _createClass(InfoContainer, [{
    key: "Rebuild",
    value: function Rebuild(annotations, clearContainer) {
      if (clearContainer) this.$container.empty();
      if (this.annotator.unrenderer) this.annotator.unrenderer(this.annotator); // let plural = annotations.length == 1 ? "" : "s";
      // let totalAnnotations = this.annotator.annotationManager.annotations.length;
      // this.$container.html(`<p>Showing ${annotations.length} annotation${plural} (${totalAnnotations} total).</p>`);
      // Add each annotation to the readout

      var renderer = this.annotator.renderer === false ? this.MakeContainer : this.annotator.renderer;

      for (var i = 0; i < annotations.length; i++) {
        this.$container.append(renderer(this.annotator, annotations[i], i));
      }
    }
  }, {
    key: "MakeContainer",
    value: function MakeContainer(annotator, annotation, index) {
      var $panel = $("<p></p>").appendTo($("<div></div>").appendTo(annotator.$container)); //let text = JSON.stringify(annotation.AsOpenAnnotation(), null, 2);
      // Add clickable header that brings up the edit interface.

      var $header = $("<b>Annotation ".concat(index + 1, ":</b><br>"));

      if (annotator.kioskMode == false) {
        $header = $("<a href='' title='Edit Annotation'><b>Annotation ".concat(index + 1, ":</b><br></a>"));
        $header.click(function (event) {
          event.preventDefault();
          annotator.gui.BeginEditing(annotation);
        });
      }

      $panel.append($header);
      var $content = $("<p></p>");
      $content.append("<b>Text: </b> " + annotation.body.filter(function (item) {
        return item.purpose === "describing";
      })[0].value);
      $content.append("<br>");
      $content.append("<b>Tags: </b> " + annotation.tags.join(", "));
      $content.append("<br>");
      $content.append("<b>Time: </b> " + (0, _time.GetFormattedTime)(annotation.beginTime) + " - " + (0, _time.GetFormattedTime)(annotation.endTime));
      $content.append("<br>");
      $content.append("<b>Submitted by:</b><br />" + (annotation.creator != null ? annotation.creator.nickname + ' (' + annotation.creator.email + ')' : "unspecified")); //$paragraph.append("<strong>Annotation " + (index + 1) + ":</strong><br><pre>" + text.escapeHTML() + "</pre>");

      $panel.append($content);
      return $panel;
    }
  }]);

  return InfoContainer;
}();

exports.InfoContainer = InfoContainer;

},{"../../utils/time.js":21,"sha1":35}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageOverlay = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MessageOverlay = /*#__PURE__*/function () {
  function MessageOverlay(annotator) {
    _classCallCheck(this, MessageOverlay);

    this.annotator = annotator;
    this.$container = $("<div class='waldorf-message-overlay'></div>");
    this.$container.appendTo(this.annotator.player.$container);
    this.$text = $("<p role='alert' aria-live='assertive' aria-atomic='true'></p>").appendTo(this.$container);
    this.$container.fadeOut(0);
  }

  _createClass(MessageOverlay, [{
    key: "ShowError",
    value: function ShowError(message) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3.0;
      this.$container.addClass("waldorf-message-overlay-error");

      this._ShowText(message, duration);
    }
  }, {
    key: "ShowMessage",
    value: function ShowMessage(message) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5.0;
      this.$container.removeClass("waldorf-message-overlay-error");

      this._ShowText(message, duration);
    }
  }, {
    key: "_ShowText",
    value: function _ShowText(message) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5.0;
      this.$text.html(message); //this.$container.stop(true, true);

      this.$container.finish();
      this.$container.fadeIn(0).delay(duration * 1000).fadeOut(400);
    }
  }]);

  return MessageOverlay;
}();

exports.MessageOverlay = MessageOverlay;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolygonEditor = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Manages the creating or editing of a single polygon on the video.
 * Consists of a toolbar, an overlay, and the polygon inside the overlay.
 *
 * Click to place or remove a draggable point. Points should be
 * put down in clockwise order.
 */
var PolygonEditor = /*#__PURE__*/function () {
  function PolygonEditor(annotator) {
    var _this = this;

    _classCallCheck(this, PolygonEditor);

    this.annotator = annotator;
    this.baseZ = 2147483649;
    this.$breadcrumbs = [];
    this.$polygons = [];
    this.$tempBreadCrumbs = []; // Create the video overlay

    this.$clickSurface = $("<div class='waldorf-edit-overlay waldorf-vp-click-surface'></div>").appendTo(this.annotator.player.$container); //this.$clickSurface.css("z-index", this.baseZ);

    this.$clickSurface.click(function (event) {
      _this.OnSurfaceClick(event);
    }); // Create the poly object for start position polygon

    this.$startPoly = ""; // Create the poly object

    this.$poly = $("<div class='waldorf-edit-poly'></div>").appendTo(this.annotator.player.$container);
    this.$poly.css("z-index", this.baseZ + 1);
    this.ResizeOverlay();
    this.annotator.player.$container.on("OnFullscreenChange", function (event, setFullscreen) {
      return _this.ResizeOverlay();
    }); // Create the toolbar up top

    this.$bar = $("<div class='waldorf-vp-post'></div>").appendTo(this.annotator.player.$container);
    this.$postToolbar = $("<div class='flex-toolbar'></div>").appendTo(this.$bar); // Invisible expanding divider
    //-3//this.$postToolbar.append($("<div><p style='color:white'>Edit Polygon</p></div>").css("flex-grow", 1).css("order", 0));
    // Make "Collect Polygon state" button

    this.$capPolyButton = $("<button>Capture Polygon</button>").button({
      icon: "fa fa-camera-retro",
      showLabel: false
    }).click(function () {
      //console.log("Capturing the polygon");
      //this.SetVisible(false);
      //this.GetPoints();
      // Build polygon selector
      // let points = this.GetPoints();
      // if(points.length > 0) {
      //     let pointsStr = points.map(item => { return `${item[0]},${item[1]}` }).join(" ");
      //     let polygonSelector = {
      //         "type": "SvgSelector",
      //         "value": `<svg:svg viewBox='0 0 100 100' preserveAspectRatio='none'><polygon points='${pointsStr}' /></svg:svg>` // http://stackoverflow.com/a/24898728
      //     }
      //     tmpSelectors.push(polygonSelector);
      // }
      // console.log("tmpSelectors");
      // console.log(tmpSelectors);
      _this.annotator.AddPolygonSet(_this.annotator.annotation.getPoly());
    });
    this.$capPolyButton.css("margin-right", "15px");
    this.$capPolyButton.attr('title', "Capture polygon"); //-3//this.RegisterElement(this.$capPolyButton, this.$postToolbar, 1, 'flex-end');
    // Create undo button

    this.$undoButton = $("<button>Remove Last Point</button>").button({
      icon: "fa fa-undo",
      showLabel: false
    });
    this.$undoButton.css("margin-right", "15px");
    this.$undoButton.attr('title', "Remove last point");
    this.$undoButton.click(function () {
      _this.RemoveLastBreadcrumb();
    }); //-3//this.RegisterElement(this.$undoButton, this.$postToolbar, 1, 'flex-end');
    // Create the confirm button

    this.$confirmButton = $("<button>Finish polygon</button>").button({
      icon: "fa fa-check",
      showLabel: false
    });
    this.$confirmButton.attr('title', "Finish polygon");
    this.$confirmButton.addClass("waldorf-confirm-button");
    this.$confirmButton.click(function () {
      _this.originalJSON = _this.GetJSON();

      _this.Done();

      _this.annotator.$container.trigger("OnPolygonEditingEnded");
    }); //-3//this.RegisterElement(this.$confirmButton, this.$postToolbar, 3, 'flex-end');
    // Create the cancel button

    this.$cancelButton = $("<button>Cancel polygon editing</button>").button({
      icon: "fa fa-remove",
      showLabel: false
    });
    this.$cancelButton.addClass("waldorf-cancel-button");
    this.$cancelButton.attr('title', "Cancel polygon editing");
    this.$cancelButton.click(function () {
      //Restore the original state
      _this.Restore();

      _this.Done();

      _this.annotator.$container.trigger("OnPolygonEditingEnded");
    }); //-3//this.RegisterElement(this.$cancelButton, this.$postToolbar, 2, 'flex-end');

    $(window).resize(function () {
      return _this.ResizeOverlay();
    });
    /* 
    * new UI
    */

    this.$editDialog = $("<div id='edit-dialog' class='waldorf-edit-overlay waldorf-vp-click-surface'></div>").appendTo(this.annotator.player.$container);
    this.$editDialog.draggable();
    this.$editDialog.css('z-index', this.baseZ + 100);
    this.$editDialog.click(function (event) {
      _this.OnSurfaceClick(event);
    });
    this.$space = $("<div>&nbsp;</div><hr>");
    this.RegisterElement(this.$space, this.$editDialog, 1, 'flex-end'); // Create undo button

    this.$undoButton1 = $("<button>Remove Last Point</button>").button({
      icon: "fa fa-undo",
      showLabel: false
    });
    this.$undoButton1.css("margin", "0px 5px 4px 5px");
    this.$undoButton1.attr('title', "Remove last point");
    this.$undoButton1.css('z-index', this.baseZ + 105);
    this.$undoButton1.click(function () {
      _this.RemoveLastBreadcrumb();
    });
    this.RegisterElement(this.$undoButton1, this.$editDialog, 1, 'flex-end'); // Make "Collect Polygon state" button

    this.$capPolyButton1 = $("<button>Capture Polygon</button>").button({
      icon: "fa fa-camera-retro",
      showLabel: false
    }).click(function () {
      // console.log("Capturing the polygon");
      // //this.SetVisible(false);
      // //this.GetPoints();
      // let tmpSelectors = [];
      // // Build polygon selector
      // let points = this.GetPoints();
      // if(points.length > 0) {
      //     let pointsStr = points.map(item => { return `${item[0]},${item[1]}` }).join(" ");
      //     let polygonSelector = {
      //         "type": "SvgSelector",
      //         "value": `<svg:svg viewBox='0 0 100 100' preserveAspectRatio='none'><polygon points='${pointsStr}' /></svg:svg>` // http://stackoverflow.com/a/24898728
      //     }
      //     tmpSelectors.push(polygonSelector);
      // }
      // console.log("tmpSelectors");
      // console.log(tmpSelectors);
      _this.AddPolygonSet(); //this.annotator.AddPolygonSet(this.annotator.annotation.getPoly());

    });
    this.$capPolyButton1.css("margin", "0px 5px 4px 5px");
    this.$capPolyButton1.attr('title', "Capture Polygon");
    this.$capPolyButton1.css('z-index', this.baseZ + 105);
    this.RegisterElement(this.$capPolyButton1, this.$editDialog, 1, 'flex-end'); // Create the cancel button

    this.$cancelButton1 = $("<button>Cancel polygon editing</button>").button({
      icon: "fa fa-remove",
      showLabel: false
    });
    this.$cancelButton1.css("margin", "0px 5px 4px 5px");
    this.$cancelButton1.addClass("waldorf-cancel-button");
    this.$cancelButton1.attr('title', "Cancel Polygon Editing");
    this.$cancelButton1.click(function () {
      //Restore the original state
      _this.Restore();

      _this.Done();

      _this.annotator.$container.trigger("OnPolygonEditingEnded");
    });
    this.RegisterElement(this.$cancelButton1, this.$editDialog, 2, 'flex-end');
    $(window).resize(function () {
      return _this.ResizeOverlay();
    });
    this.Done();
  }

  _createClass(PolygonEditor, [{
    key: "OnSurfaceClick",
    value: function OnSurfaceClick(event) {
      if ($(event.currentTarget).attr("id") == "edit-dialog") {
        return;
      } // Add a breadcrumb on click


      var target = $(event.currentTarget);
      var x = event.pageX - target.offset().left;
      var y = event.pageY - target.offset().top;
      var xPercent = x / target.width() * 100;
      var yPercent = y / target.height() * 100;
      this.AddBreadcrumb(xPercent, yPercent); //this.newPolyPoints.push([xPercent.toFixed(3), yPercent.toFixed(3)]);

      this.UpdatePolyClipping();
    }
    /**
     * Creates a new breadcrumb at the given (x, y) point on the
     * clickSurface, where x and y are percentages from 0 to 100.
     */

  }, {
    key: "AddBreadcrumb",
    value: function AddBreadcrumb(xPercent, yPercent) {
      var _this2 = this;

      var $breadcrumb = $("<div class='breadcrumb'></div>");
      $breadcrumb.appendTo(this.$clickSurface);
      $breadcrumb.css("position", "absolute"); // Percentage representations of breadcrumb width and height

      var offPercentX = $breadcrumb.outerWidth() / this.$clickSurface.width() * 100;
      var offPercentY = $breadcrumb.outerHeight() / this.$clickSurface.height() * 100; // Percentage representations of breadcrumb width and height

      $breadcrumb.css("left", (xPercent - offPercentX / 2).toString() + "%");
      $breadcrumb.css("top", (yPercent - offPercentY / 2).toString() + "%"); //$breadcrumb.css("z-index", this.baseZ - 50);

      $breadcrumb.draggable({
        //containment: "parent",
        drag: function drag() {
          // Recalculate percentages (mangled by jQuery UI draggable code)
          // See http://stackoverflow.com/a/23673462
          var l = 100 * parseFloat($breadcrumb.css("left")) / parseFloat($breadcrumb.parent().css("width")) + "%";
          var t = 100 * parseFloat($breadcrumb.css("top")) / parseFloat($breadcrumb.parent().css("height")) + "%";
          $breadcrumb.css("left", l);
          $breadcrumb.css("top", t);

          _this2.UpdatePolyClipping();
        }
      });
      $breadcrumb.click(function (event) {
        // Remove the breadcrumb on click
        event.stopPropagation();
        $breadcrumb.remove();

        _this2.$breadcrumbs.splice(_this2.$breadcrumbs.indexOf($breadcrumb), 1);

        _this2.UpdatePolyClipping();

        _this2.UpdateBreadcrumbColoring();
      });
      this.$breadcrumbs.push($breadcrumb); //this.UpdatePolyClipping();

      this.UpdateBreadcrumbColoring();
    }
    /**
     * Removes the last-placed breadcrumb from the list
     * and updates the view.
     */

  }, {
    key: "RemoveLastBreadcrumb",
    value: function RemoveLastBreadcrumb() {
      var $removed = this.$breadcrumbs.pop();
      $removed.remove();
      this.UpdatePolyClipping();
      this.UpdateBreadcrumbColoring();
    }
    /**
     * Gets the center of the breadcrumb as an (x, y) pair
     * representing the percentage distance from the top and left
     * of the click surface (0% - 100%).
     */

  }, {
    key: "GetCenterPercentage",
    value: function GetCenterPercentage($breadcrumb) {
      var topPercent = $breadcrumb.position().top / $breadcrumb.parent().height() * 100;
      var leftPercent = $breadcrumb.position().left / $breadcrumb.parent().width() * 100; // Percentage values for the dimensions of the breadcrumb relative to the click surface

      var offPercentX = $breadcrumb.outerWidth() / $breadcrumb.parent().width() * 100;
      var offPercentY = $breadcrumb.outerHeight() / $breadcrumb.parent().height() * 100;
      return {
        x: leftPercent + offPercentX / 2.0,
        y: topPercent + offPercentY / 2.0
      };
    }
  }, {
    key: "Reset",
    value: function Reset() {
      // Remove all breadcrumbs
      var _iterator = _createForOfIteratorHelper(this.$breadcrumbs),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var $breadcrumb = _step.value;
          $breadcrumb.remove();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.$breadcrumbs = []; // Remove the poly if it already exists
      // if(this.$poly != null){
      //     this.$poly.remove();
      // }
    }
  }, {
    key: "ResetPolygons",
    value: function ResetPolygons() {
      if (this.$startPoly) {
        this.$startPoly.clipPath([], {
          svgDefId: 'annotatorPolyEditorSvgStart'
        });
      }

      this.$polygons = [];
    }
  }, {
    key: "Restore",
    value: function Restore() {
      this.InitPoly(this.originalJSON);
    }
  }, {
    key: "InitPoly",
    value: function InitPoly() {
      var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.Reset(); // If JSON was specified, generate breadcrumbs from it.

      if (points != null) {
        // Put down the breadcrumbs
        var _iterator2 = _createForOfIteratorHelper(points),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var point = _step2.value;
            this.AddBreadcrumb(point[0], point[1]);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      this.UpdatePolyClipping();
      this.originalJSON = points;
    }
  }, {
    key: "AddStartPolygon",
    value: function AddStartPolygon() {
      var _this3 = this;

      if (this.$polygons.length > 0) {
        var startPolygon = this.$polygons[0]; //.map(item => { return `${item[0]},${item[1]}` }).join(" ");;
        // Create the poly object

        this.$startPoly = $("<div class='waldorf-start-poly'></div>").appendTo(this.$clickSurface);
        this.$startPoly.css("z-index", this.baseZ + 1000);

        if (startPolygon.length < 3) {
          this.$startPoly.clipPath([], {
            svgDefId: 'annotatorPolyEditorSvgStart'
          });
          return;
        }

        this.$startPoly.clipPath(startPolygon, {
          isPercentage: true,
          svgDefId: 'annotatorStartPolySvg'
        });
        startPolygon.map(function (point) {
          _this3.AddBreadcrumb(point[0], point[1]);
        });
      }
    }
  }, {
    key: "UpdatePolyClipping",
    value: function UpdatePolyClipping() {
      var _this4 = this;

      if (this.$breadcrumbs.length < 3) {
        this.$poly.clipPath([], {
          svgDefId: 'annotatorPolyEditorSvg'
        });
        return;
      }

      var points = this.$breadcrumbs.map(function ($crumb) {
        var pos = _this4.GetCenterPercentage($crumb);

        return [pos.x, pos.y];
      });
      this.$poly.clipPath(points, {
        isPercentage: true,
        svgDefId: 'annotatorPolyEditorSvg'
      });
    }
  }, {
    key: "UpdateBreadcrumbColoring",
    value: function UpdateBreadcrumbColoring() {
      for (var i = 0; i < this.$breadcrumbs.length; i++) {
        var $crumb = this.$breadcrumbs[i]; // Recolor each breadcrumb

        var color = "#000000";

        if (i == this.$breadcrumbs.length - 1) {
          color = "#FF0000";
        } else if (i == 0) {
          color = "#00FF00";
        }

        this.$breadcrumbs[i].css("border-color", color);
      }
    }
    /**
     * Gets an array of percentages representing the x and y percentages of each
     * point in the polygon.
     */

  }, {
    key: "GetJSON",
    value: function GetJSON() {
      // Extract the coordinates from the crumbs and put them in the array
      var points = [];

      var _iterator3 = _createForOfIteratorHelper(this.$breadcrumbs),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var crumb = _step3.value;
          var point = this.GetCenterPercentage(crumb);
          points.push([point.x.toString(), point.y.toString()]);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return JSON.stringify(points);
    }
    /**
     * Gets an array of percentages representing the x and y percentages of each
     * point in the polygon.
     */

  }, {
    key: "GetPoints",
    value: function GetPoints() {
      var points = [];

      var _iterator4 = _createForOfIteratorHelper(this.$breadcrumbs),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var crumb = _step4.value;
          var point = this.GetCenterPercentage(crumb);
          points.push([point.x, point.y]);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return points;
    }
  }, {
    key: "BeginEditing",
    value: function BeginEditing() {
      this.$clickSurface.makeVisible(true);
      this.$editDialog.makeVisible(true);
      this.$poly.makeVisible(true); //-3//this.$bar.makeVisible(true);

      this.AddStartPolygon();
      this.UpdatePolyClipping();
    }
  }, {
    key: "Done",
    value: function Done() {
      this.$clickSurface.makeVisible(false);
      this.$editDialog.makeVisible(false);
      this.$poly.makeVisible(false); //-3//this.$bar.makeVisible(false);
    }
  }, {
    key: "ResizeOverlay",
    value: function ResizeOverlay() {
      // Resize video overlay to fit actual video dimensions
      var videoDims = this.annotator.player.GetVideoDimensions();
      this.$clickSurface.css('width', videoDims.width);
      this.$clickSurface.css('height', videoDims.height);
      var heightDiff = (this.annotator.player.$video.height() - videoDims.height) / 2;
      this.$clickSurface.css('top', heightDiff);
      var widthDiff = (this.annotator.player.$video.width() - videoDims.width) / 2;
      this.$clickSurface.css('left', widthDiff);
      this.$poly.width(videoDims.width);
      this.$poly.height(videoDims.height);
      this.$poly.css("top", heightDiff);
      this.$poly.css("left", widthDiff);
    }
  }, {
    key: "RegisterElement",
    value: function RegisterElement($element, $container, order) {
      var justification = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'flex-start';
      $element.css('order', order);
      $element.css('align-self', justification); // Sets grow [shrink] [basis]
      //$element.css('flex', '0 0 auto');

      $container.append($element);
    }
  }, {
    key: "ShowJustPolygon",
    value: function ShowJustPolygon() {
      this.$poly.makeVisible(true);
    }
  }, {
    key: "AddPolygonSet",
    value: function AddPolygonSet() {
      this.$polygons.push(this.GetPoints());
      this.$tempBreadCrumbs.push([this.$breadcrumbs]);
    }
  }]);

  return PolygonEditor;
}();

exports.PolygonEditor = PolygonEditor;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolygonOverlay = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PolygonOverlay = /*#__PURE__*/function () {
  function PolygonOverlay(annotator) {
    var _this = this;

    _classCallCheck(this, PolygonOverlay);

    this.annotator = annotator;
    this.polyElements = [];
    this.svgElements = [];
    this.animateElements = [];
    this.baseZ = 2147483649;
    this.lastAnnotations = [];
    this.svgElementsHash = {}; // Create the video overlay

    this.$videoOverlay = $("<div class='waldorf-video-overlay'></div>").appendTo(this.annotator.player.$container);
    this.ResizeOverlay();
    this.annotator.player.$container.on("OnFullscreenChange", function (event, setFullscreen) {
      return _this.ResizeOverlay();
    });
    this.annotator.$container.on("OnNewAnnotationSet", function (event, annotations) {
      return _this.Update(annotations);
    });
    this.videoDims = this.annotator.player.GetVideoDimensions();
    $(window).resize(function () {
      return _this.ResizeOverlay();
    });
  }

  _createClass(PolygonOverlay, [{
    key: "Update",
    value: function Update(annotations) {
      this.Clear(); // let prevSet = new Set(this.lastAnnotations);
      // let newSet = new Set(annotations);
      // // in newSet and not in prevSet
      // let toAdd = new Set(
      //     [...newSet].filter(x => !prevSet.has(x)));
      // // in prevAnnotations and not in annotations
      // let toDestroy = new Set(
      //     [...prevSet].filter(x => !newSet.has(x)));
      // console.log(Array.from(toAdd));
      // console.log(Array.from(toDestroy));
      //Sort polygon order by size (ascending)
      // polygons.sort(function(a, b) {
      //     return this.GetArea(a) > this.GetArea(b);
      // })

      for (var i = 0; i < annotations.length; i++) {
        var annotationPolyPoints = annotations[i].getPoly();

        if (annotationPolyPoints == null) {
          // Ignore this annotation if it has no polygon
          continue;
        }

        var svgPolyPoints = annotations[i].getSVGPolyPoints();
        var duration = annotations[i].endTime - annotations[i].beginTime; // Create the poly object

        var $svg = void 0;

        if (this.svgElements.length == 0) {
          $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          $svg.setAttribute('width', '100%');
          $svg.setAttribute('height', '100%');
          $svg.setAttribute('viewBox', '0 0 100 100');
          $svg.setAttribute('preserveAspectRatio', 'none'); //$svg.addEventListener("click", this.ClickEvent);

          this.$videoOverlay.append($svg);
          this.svgElements.push($svg);
        } else {
          $svg = this.svgElements[0];
        }

        var $polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        $polygon.setAttribute('points', svgPolyPoints[0]);
        $polygon.setAttribute('fill', 'rgba(0, 118, 255, 0.55)');
        $svg.appendChild($polygon);
        var $animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        $animate.setAttribute('attributeName', 'points');
        $animate.setAttribute('fill', 'freeze');
        $animate.setAttribute('from', svgPolyPoints[0]);
        $animate.setAttribute('to', svgPolyPoints[1]);
        $animate.setAttribute('begin', 'indefinite');
        $animate.setAttribute('dur', duration + "s");
        $polygon.appendChild($animate);
        var $svgHash = {
          svgElement: $svg,
          polygon: $polygon,
          animate: $animate,
          beginTime: annotations[i].beginTime
        };
        this.svgElementsHash[annotations[i].id] = $svgHash; // Create the poly object
        // let $poly = $("<div class='waldorf-overlay-poly'></div>").appendTo(this.$videoOverlay);
        // $poly.clipPath(annotationPolyPoints, {
        //     isPercentage: true,
        //     svgDefId: 'annotatorPolySvg'
        // });
        // $poly.click(() => {
        //     this.annotator.$container.trigger("OnPolyClicked", annotations[i]);
        // });
        // this.AddTooltip($poly, annotations[i]);
        // this.polyElements.push($poly);

        this.polyElements.push($polygon);
        this.animateElements.push($animate);
      } //this.lastAnnotations = annotations;

    }
  }, {
    key: "ClickEvent",
    value: function ClickEvent(event) {
      console.log("animate is clicked");
    }
  }, {
    key: "AddTooltip",
    value: function AddTooltip($poly, annotation) {
      $.fn.qtip.zindex = this.baseZ + 1;
      $poly.qtip({
        content: {
          title: annotation.id,
          text: annotation.body.filter(function (item) {
            return item.purpose === "describing";
          })[0].value
        },
        position: {
          my: 'bottom right',
          at: 'top left',
          target: 'mouse',
          // Follow the mouse
          adjust: {
            mouse: true,
            method: "shift shift" // horizontal, vertical

          },
          viewport: this.annotator.player.$container
        },
        hide: {
          delay: 0 // No hide delay by default

        },
        style: {
          classes: 'qtip-dark qtip-rounded annotator-qtip'
        }
      });
    }
  }, {
    key: "Clear",
    value: function Clear() {
      // Clear all  animate element from the DOM
      for (var ai = 0; ai < this.animateElements.length; ai++) {
        //this.polyElements[i].data("qtip").destroy(true);
        this.animateElements[ai].remove();
      } // Clear all polygons 


      for (var pi = 0; pi < this.polyElements.length; pi++) {
        this.polyElements[pi].remove();
      } // Clear all  svg elements from the DOM


      for (var si = 0; si < this.svgElements.length; si++) {
        this.svgElements[si].remove();
      } // Mark the array as empty


      this.animateElements = [];
      this.polyElements = [];
      this.svgElements = [];
      this.svgElementsHash = {};
    }
  }, {
    key: "ResizeOverlay",
    value: function ResizeOverlay() {
      // Resize video overlay to fit actual video dimensions
      var videoDims = this.annotator.player.GetVideoDimensions();
      this.$videoOverlay.css('width', videoDims.width);
      this.$videoOverlay.css('height', videoDims.height);
      var heightDiff = (this.annotator.player.$video.height() - videoDims.height) / 2;
      this.$videoOverlay.css('top', heightDiff);
      var widthDiff = (this.annotator.player.$video.width() - videoDims.width) / 2;
      this.$videoOverlay.css('left', widthDiff);
    }
  }, {
    key: "getPlayerSize",
    value: function getPlayerSize() {
      return this.annotator.player.GetVideoDimensions();
    }
  }]);

  return PolygonOverlay;
}();

exports.PolygonOverlay = PolygonOverlay;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TickBar = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TickBar = /*#__PURE__*/function () {
  function TickBar(annotator) {
    var _this = this;

    _classCallCheck(this, TickBar);

    this.annotator = annotator;
    this.ticks = []; // Create the element

    this.$tickBar = $("<div class='waldorf-tickbar'></div>");
    this.annotator.player.controlBar.$container.append(this.$tickBar); // Attach event handlers

    this.annotator.$container.on("OnAnnotationsLoaded", function (event, annotationManager) {
      return _this.LoadAnnotations(annotationManager);
    });
    this.annotator.$container.on("OnAnnotationRegistered", function (event, annotation) {
      return _this.LoadAnnotation(annotation);
    });
    this.annotator.$container.on("OnAnnotationRemoved", function (event, id) {
      return _this.RemoveAnnotation(id);
    });
  }

  _createClass(TickBar, [{
    key: "LoadAnnotations",
    value: function LoadAnnotations(annotationManager) {
      this.Clear();

      var _iterator = _createForOfIteratorHelper(annotationManager.annotations),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var annotation = _step.value;
          this.LoadAnnotation(annotation);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "LoadAnnotation",
    value: function LoadAnnotation(annotation) {
      var $tick = $("<div class='waldorf-tickbar-tick'></div>").appendTo(this.$tickBar); // Add the ID of the annotation to its corresponding tick so we can reference it later

      $tick.data("annotation-id", annotation.id);
      var beginTime = annotation.beginTime;
      var beginPercent = beginTime / this.annotator.player.videoElement.duration;
      $tick.css('left', (beginPercent * 100).toString() + "%");
      var endTime = annotation.endTime;
      var endPercent = endTime / this.annotator.player.videoElement.duration;
      $tick.css('width', ((endPercent - beginPercent) * 100).toString() + "%");
      this.ticks.push($tick);
    }
  }, {
    key: "RemoveAnnotation",
    value: function RemoveAnnotation(id) {
      //console.log("Removing tick " + id);
      // Remove the object from the document, and the array
      var newTicks = [];

      var _iterator2 = _createForOfIteratorHelper(this.ticks),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var $tick = _step2.value;

          if ($tick.data("annotation-id") == id) {
            console.log("Removed tick ".concat(id));
            $tick.remove();
          } else {
            newTicks.push($tick);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.ticks = newTicks;
    }
  }, {
    key: "Clear",
    value: function Clear() {
      var _iterator3 = _createForOfIteratorHelper(this.ticks),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var $tick = _step3.value;
          $tick.remove();
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      this.ticks = [];
    }
  }]);

  return TickBar;
}();

exports.TickBar = TickBar;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerInterface = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var sha1 = require('sha1');

var ServerInterface = /*#__PURE__*/function () {
  function ServerInterface(annotator) {
    _classCallCheck(this, ServerInterface);

    this.annotator = annotator; //localStorage.removeItem('waldorf_auth_token');
  }

  _createClass(ServerInterface, [{
    key: "SetBaseURL",
    value: function SetBaseURL(url) {
      this.baseURL = url;
    }
  }, {
    key: "make_base_auth",
    value: function make_base_auth(user, password) {
      var tok = user + ':' + password;
      var hash = btoa(tok);
      return 'Basic ' + hash;
    }
  }, {
    key: "make_write_auth",
    value: function make_write_auth(text) {
      if (this.annotator.apiKey) {
        return 'ApiKey ' + text;
      } else {
        return 'Token ' + text;
      }
    }
  }, {
    key: "LoggedIn",
    value: function LoggedIn() {
      if (this.annotator.apiKey) {
        // Return true if an email has been entered
        var user_email = localStorage.getItem('waldorf_user_email');
        return user_email !== null;
      } else {
        // Return true if a token has been registered
        var auth_token = localStorage.getItem('waldorf_auth_token');
        return auth_token !== null;
      }
    }
  }, {
    key: "LogIn",
    value: function LogIn(username, password) {
      var _this = this;

      // If API key is used, just store the email address
      if (this.annotator.apiKey) {
        console.log("[Server Interface] Successfully logged in.");
        localStorage.setItem('waldorf_user_email', password);
        localStorage.setItem('waldorf_user_name', username);
        this.annotator.messageOverlay.ShowMessage("Logged in as " + username);
        return $.Deferred().resolve();
      }

      return $.ajax({
        url: this.baseURL + "/api/login",
        type: "POST",
        async: true,
        context: this,
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('Authorization', this.make_base_auth(username, password));
        }
      }).done(function (data) {
        console.log("[Server Interface] Successfully logged in.");
        localStorage.setItem('waldorf_auth_token', data.auth_token);
      }).fail(function (response) {
        console.error("[Server Interface] Could not log in.");

        _this.annotator.messageOverlay.ShowError("Could not log in!");
      });
    }
  }, {
    key: "LogOut",
    value: function LogOut() {
      // If API key is used, just remove the email from local storage.
      if (this.annotator.apiKey) {
        console.log("[Server Interface] Successfully logged out.");
        localStorage.removeItem('waldorf_user_email');
        localStorage.removeItem('waldorf_user_name');
        return $.Deferred().resolve();
      }

      return $.ajax({
        url: this.baseURL + "/api/logout",
        type: "DELETE",
        async: true,
        context: this,
        beforeSend: function beforeSend(xhr) {
          var auth_token = localStorage.getItem('waldorf_auth_token') || "";
          console.log("[Server Interface] token: ".concat(auth_token));
          xhr.setRequestHeader('Authorization', this.make_write_auth(auth_token));
        }
      }).done(function (data) {
        console.log("[Server Interface] Successfully logged out.");
        localStorage.removeItem('waldorf_auth_token');
      }).fail(function (response) {
        console.error("[Server Interface] Could not log out.");
        localStorage.removeItem('waldorf_auth_token');
      });
    }
  }, {
    key: "FetchAnnotations",
    value: function FetchAnnotations(searchKey, searchParam) {
      //This is replaced by this.baseURL, which is defined in config
      //var book_url = 'http://scalar.usc.edu/dev/semantic-annotation-tool/';  // This will be defined in the Book's JS
      //https://scalar.usc.edu/dev/semantic-annotation-tool/rdf/file/media/Inception%20Corgi%20Flop.mp4?format=oac&prov=1&rec=2
      var ajax_url = this.baseURL + 'rdf/file/' + searchParam.replace(this.baseURL, '') + '?format=oac&prov=1&rec=2'; //var ajax_url = this.baseURL + 'rdf/file/' + searchParam.replace(this.baseURL,'') + '?format=iiif&prov=1&rec=2';
      //console.log("ajax_url: " + ajax_url);

      return $.ajax({
        url: ajax_url,
        type: "GET",
        jsonp: "callback",
        dataType: "jsonp",
        async: true
      }).done(function (data) {
        console.log('[Server Interface] Fetched ' + data.length + ' annotations for ' + searchKey + ': "' + searchParam + '".');
      }).fail(function (response) {
        var returned_response = response.responseJSON.error.code[0].value + " : " + response.responseJSON.error.message[0].value;
        console.error('[Server Interface] Error fetching annotations for ' + searchKey + ': "' + searchParam + '"\n ' + returned_response);

        _this2.annotator.messageOverlay.ShowError('Could not retrieve annotations!<br>(' + returned_response + ')');
      });
    }
  }, {
    key: "PostAnnotation",
    value: function PostAnnotation(callback) {
      var _this3 = this;

      console.log("Posting annotation...");
      var annotation = this.annotator.gui.GetAnnotationObject(); // console.log(annotation);

      console.log("annotation: " + JSON.stringify(annotation));
      var key;

      if (this.annotator.apiKey) {
        key = this.annotator.apiKey;
        var email_storage = localStorage.getItem('waldorf_user_email');
        var name_storage = localStorage.getItem('waldorf_user_name');

        if (email_storage === null) {
          console.error("[Server Interface] You are not logged in!");
          this.annotator.messageOverlay.ShowError("You are not logged in!");
          return false;
        }

        if (name_storage == null) name_storage = email_storage;
      } else {
        key = localStorage.getItem('waldorf_auth_token');

        if (key === null) {
          console.error("[Server Interface] You are not logged in!");
          this.annotator.messageOverlay.ShowError("You are not logged in!");
          return false;
        }
      }

      if (this.annotator.apiKey) {
        if (annotation["creator"] == null) annotation["creator"] = {};
        annotation["creator"]["email"] = localStorage.getItem('waldorf_user_email');
        annotation["creator"]["nickname"] = localStorage.getItem('waldorf_user_name');
      } //setaction in annotation payload


      annotation["request"]["items"]["action"] = "add"; //TODO: ver2

      console.log("PostAnnotation payload: " + JSON.stringify(annotation));
      $.ajax({
        //url: this.baseURL + "/api/addAnnotation",
        url: this.baseURL + "api/add",
        type: "POST",
        dataType: 'json',
        // Necessary for Rails to see this data type correctly
        contentType: 'application/json',
        // Necessary for Rails to see this data type correctly
        data: JSON.stringify(annotation),
        // Stringify necessary for Rails to see this data type correctly
        async: true,
        context: this,
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('Authorization', this.make_write_auth(key));
        },
        success: function success(data) {
          console.log("Successfully posted new annotation.");

          _this3.annotator.messageOverlay.ShowMessage("Successfully created new annotation.");

          annotation.id = data.id; // Append the ID given by the response

          if (callback) callback(annotation);
        },
        error: function error(response) {
          var returned_response = response.responseJSON.error.code[0].value + " : " + response.responseJSON.error.message[0].value;
          console.error("Could not post new annotation! Message:\n ".concat(returned_response));

          _this3.annotator.messageOverlay.ShowError("Could not post new annotation!<br>(".concat(returned_response, ")"));
        }
      });
    }
  }, {
    key: "EditAnnotation",
    value: function EditAnnotation(callback) {
      var _this4 = this;

      var annotation = this.annotator.gui.GetAnnotationObject();
      var key;

      if (this.annotator.apiKey) {
        key = this.annotator.apiKey;
        var email_storage = localStorage.getItem('waldorf_user_email');
        var name_storage = localStorage.getItem('waldorf_user_name');

        if (email_storage === null) {
          console.error("[Server Interface] You are not logged in!");
          this.annotator.messageOverlay.ShowError("You are not logged in!");
          return false;
        }

        if (name_storage == null) name_storage = email_storage;
      } else {
        key = localStorage.getItem('waldorf_auth_token');

        if (key === null) {
          console.error("[Server Interface] You are not logged in!");
          this.annotator.messageOverlay.ShowError("You are not logged in!");
          return false;
        }
      }

      if (this.annotator.apiKey) {
        if (annotation["creator"] == null) annotation["creator"] = {};
        annotation["creator"]["email"] = localStorage.getItem('waldorf_user_email');
        annotation["creator"]["nickname"] = localStorage.getItem('waldorf_user_name');
      }

      var oldID = annotation.id;
      console.log("Modifying annotation " + oldID);
      $.ajax({
        url: this.baseURL + "api/edit/",
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(annotation),
        async: true,
        context: this,
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('Authorization', this.make_write_auth(key));
        },
        success: function success(data) {
          //console.log(annotation);
          annotation.id = data.id; // Append the ID given by the response
          //console.log("Successfully edited the annotation. (ID is now " + data.id + ")");

          _this4.annotator.messageOverlay.ShowMessage("Successfully edited the anotation.");

          if (callback) callback(annotation, oldID);
        },
        error: function error(response) {
          //console.error(`Could not edit the annotation! Message:\n ${response.responseJSON.detail}`);
          //this.annotator.messageOverlay.ShowError(`Could not edit the annotation!<br>(${response.responseJSON.detail})`);
          var returned_response = "undefined error while editing the annotation";

          if (response.responseJSON) {
            returned_response = response.responseJSON.error.code[0].value + " : " + response.responseJSON.error.message[0].value;
          }

          console.error("Could not edit the annotation! Message:\n ".concat(returned_response));

          _this4.annotator.messageOverlay.ShowError("Could not edit the annotation!<br>(".concat(returned_response, ")"));
        }
      });
    }
  }, {
    key: "DeleteAnnotation",
    value: function DeleteAnnotation(annotation) {
      var _this5 = this;

      var key;

      if (this.annotator.apiKey) {
        key = this.annotator.apiKey;
        var email_storage = localStorage.getItem('waldorf_user_email');
        var name_storage = localStorage.getItem('waldorf_user_name');

        if (email_storage === null) {
          console.error("[Server Interface] You are not logged in!");
          this.annotator.messageOverlay.ShowError("You are not logged in!");
          return false;
        }

        if (name_storage == null) name_storage = email_storage;
      } else {
        key = localStorage.getItem('waldorf_auth_token');

        if (key === null) {
          console.error("[Server Interface] You are not logged in!");
          this.annotator.messageOverlay.ShowError("You are not logged in!");
          return false;
        }
      }

      if (this.annotator.apiKey) {
        if (annotation["creator"] == null) annotation["creator"] = {};
        annotation["creator"]["email"] = localStorage.getItem('waldorf_user_email');
        annotation["creator"]["nickname"] = localStorage.getItem('waldorf_user_name');
      }

      var del_url = this.baseURL + "api/delete";
      var del_data = {
        "scalar:urn": "urn:scalar:version:" + annotation.id,
        "native": "false",
        "action": "DELETE",
        "api_key": annotation.request.items.api_key,
        "id": annotation.request.items.id
      };
      return $.post(del_url, del_data, function (response) {
        {
          console.log("Delete error response");
          console.log(response);
          console.log(response.responseText);
        }
      }).done(function (response) {
        console.log("Successfully deleted the annotation.");

        _this5.annotator.messageOverlay.ShowMessage("Successfully deleted the annotation.");
      }).fail(function (response) {
        var returned_response = "undefined failure while deleting the annotation";

        if (response.responseJSON) {
          response.responseJSON.error.code[0].value + " : " + response.responseJSON.error.message[0].value;
        }

        console.error("Could not delete the annotation. Message:\n ".concat(returned_response));

        _this5.annotator.messageOverlay.ShowError("Could not delete the annotation!<br>(".concat(returned_response, ")"));
      });
    }
  }]);

  return ServerInterface;
}();

exports.ServerInterface = ServerInterface;

},{"sha1":35}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionManager = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var sha1 = require('sha1');
/**
 * Manages the user session for communicating with the backend.
 */


var SessionManager = /*#__PURE__*/function () {
  function SessionManager(annotator) {
    var _this = this;

    _classCallCheck(this, SessionManager);

    console.log("[Session Manager] Creating SessionManager...");
    this.annotator = annotator;
    this.modalOpen = false; // Inject the button for logging in/out into the toolbar

    if (!annotator.kioskMode && annotator.cmsEmail == '') {
      this.$userButton = $("<button>Session</button>").button({
        icon: "fa fa-user",
        showLabel: false
      }).click(function () {
        _this.PresentModal();
      });
      this.annotator.player.controlBar.RegisterElement(this.$userButton, 1, 'flex-end');
    } //this.$dialog.dialog("open");


    console.log("[Session Manager] SessionManager created.");
  }

  _createClass(SessionManager, [{
    key: "ShowLoginModal",
    value: function ShowLoginModal() {
      var _this2 = this;

      // Create the dialog
      var $container = $("<div class='waldorf-session-modal' title='Log In'></div>"); // Outermost HTML

      var $headText = $("<p class='validateTips'>All fields are required.</p>").appendTo($container);
      var $form = $("<form></form>").appendTo($container);
      var $nicknameField;
      var $usernameField;
      var $passwordField;

      if (this.annotator.apiKey) {
        $("<label for='username'>Name</label>").appendTo($form);
        $nicknameField = $("<input type='text' name='username' value='' class='text ui-widget-content ui-corner-all'>").appendTo($form);
        $("<label for='username'>Email Address</label>").appendTo($form);
        $usernameField = $("<input type='text' name='email' value='' class='text ui-widget-content ui-corner-all'>").appendTo($form);
      } else {
        $("<label for='username'>Username</label>").appendTo($form);
        $usernameField = $("<input type='text' name='username' value='' class='text ui-widget-content ui-corner-all'>").appendTo($form);
        $("<label for='password'>Password</label>").appendTo($form);
        $passwordField = $("<input type='password' name='password' value='' class='text ui-widget-content ui-corner-all'>").appendTo($form);
      }

      $form.wrapInner("<fieldset />");

      var login = function login() {
        if (_this2.annotator.apiKey) {
          var nickName = $nicknameField.val();
          var userName = sha1($usernameField.val());

          _this2.annotator.server.LogIn(nickName, userName).done(function () {
            console.log("API key login success");
            $dialog.dialog("close");
          }).fail(function () {
            $headText.html("<p>Invalid email address.</p>");
            $headText.css("color", "red");
          });
        } else {
          var userPass = sha1($passwordField.val());

          _this2.annotator.server.LogIn($usernameField.val(), userPass).done(function () {
            $dialog.dialog("close");
          }).fail(function () {
            $headText.html("<p>Invalid username or password.</p>");
            $headText.css("color", "red");
          });
        }
      };

      var $dialog = $container.dialog({
        autoOpen: true,
        draggable: false,
        modal: true,
        buttons: {
          "Log In": login,
          Cancel: function Cancel() {
            $dialog.dialog("close");
          }
        },
        close: function close() {
          $dialog.find("form")[0].reset();
          $dialog.find("input").removeClass("ui-state-error");

          _this2.OnModalClose();
        }
      });
    }
  }, {
    key: "ShowLogoutModal",
    value: function ShowLogoutModal() {
      var _this3 = this;

      var $container = $("<div title='Log Out'></div>");
      var $headText = $container.html("<p class='validateTips'>Are you sure you want to log out?</p>");
      var $dialog = $container.dialog({
        autoOpen: true,
        draggable: false,
        modal: true,
        buttons: {
          "Log Out": function LogOut() {
            _this3.annotator.server.LogOut().done(function () {
              $dialog.dialog("close");
            });
          },
          Cancel: function Cancel() {
            $dialog.dialog("close");
          }
        },
        close: function close() {
          _this3.OnModalClose();
        }
      });
    }
  }, {
    key: "PresentModal",
    value: function PresentModal() {
      // Early out if the modal is already open
      if (this.modalOpen) return; // Turn off fullscreen if it's on

      this.annotator.player.SetFullscreen(false);

      if (this.annotator.server.LoggedIn()) {
        this.ShowLogoutModal();
      } else {
        this.ShowLoginModal();
      }

      this.OnModalOpen();
    }
  }, {
    key: "OnModalOpen",
    value: function OnModalOpen() {
      this.$userButton.button("disable");
      this.modalOpen = true;
    }
  }, {
    key: "OnModalClose",
    value: function OnModalClose() {
      this.$userButton.button("enable");
      this.modalOpen = false;
    }
  }]);

  return SessionManager;
}();

exports.SessionManager = SessionManager;

},{"sha1":35}],14:[function(require,module,exports){
module.exports={
    "configFile": "annotator-config.json"
}
},{}],15:[function(require,module,exports){
"use strict";

require("./vendor.js");

require("./utils/array-extensions.js");

require("./utils/jquery-extensions.js");

require("./utils/string-extensions.js");

var _preferenceManager = require("./utils/preference-manager.js");

var _requirements = require("./utils/requirements.js");

var _videoPlayer = require("./video-player/video-player.js");

/*
Entry point for the whole project. Any jQuery extensions should
be registered here.
*/
// Import npm module dependencies
$.fn.annotate = function (args) {
  // let serverURL = args.serverURL || '';
  // let tagsURL = args.tagsURL || '';
  // let apiKey = args.apiKey || '';
  // let kioskMode = args.kioskMode || false;
  // let localURL = args.localURL || '';
  // let renderer = function(...) || false;
  // Error out early if "this" is not a video
  if ($(this).prop('tagName').toLowerCase() != "video") {
    console.error("Cannot wrap a non-video element!");
    return;
  }

  if (!(0, _requirements.VerifyRequirements)()) {
    return;
  } // preferences.GetJSON((data) => {
  //     //console.log(data);
  // });


  new _videoPlayer.AnnotatorVideoPlayer($(this), args);
};

},{"./utils/array-extensions.js":16,"./utils/jquery-extensions.js":17,"./utils/preference-manager.js":18,"./utils/requirements.js":19,"./utils/string-extensions.js":20,"./vendor.js":22,"./video-player/video-player.js":25}],16:[function(require,module,exports){
"use strict";

// From http://stackoverflow.com/a/14853974/7138792
// Warn if overriding existing method
if (Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, \
    there's a framework conflict or you've got double inclusions in your code."); // attach the .equals method to Array's prototype to call it on any array

Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array) return false; // compare lengths - can save a lot of time 

  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }

  return true;
}; // Hide method from for-in loops


Object.defineProperty(Array.prototype, "equals", {
  enumerable: false
});

},{}],17:[function(require,module,exports){
"use strict";

/**
 * Sets the visibility of the element while disabling interaction.
 * Doesn't mess with jQuery's positioning calculations like show()
 * and hide().
 */
$.fn.makeVisible = function (show) {
  if (show) {
    $(this).css({
      "visibility": "visible",
      "pointer-events": ""
    });
  } else {
    $(this).css({
      "visibility": "hidden",
      "pointer-events": "none"
    });
  }
};
/*
Copyright 2014 Mike Dunn
http://upshots.org/
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

https://github.com/moagrius/copycss

*/


$.fn.getStyles = function (only, except) {
  // the map to return with requested styles and values as KVP
  var product = {}; // the style object from the DOM element we need to iterate through

  var style; // recycle the name of the style attribute

  var name; // if it's a limited list, no need to run through the entire style object

  if (only && only instanceof Array) {
    for (var i = 0, l = only.length; i < l; i++) {
      // since we have the name already, just return via built-in .css method
      name = only[i];
      product[name] = this.css(name);
    }
  } else {
    // prevent from empty selector
    if (this.length) {
      // otherwise, we need to get everything
      var dom = this.get(0); // standards

      if (window.getComputedStyle) {
        // convenience methods to turn css case ('background-image') to camel ('backgroundImage')
        var pattern = /\-([a-z])/g;

        var uc = function uc(a, b) {
          return b.toUpperCase();
        };

        var camelize = function camelize(string) {
          return string.replace(pattern, uc);
        }; // make sure we're getting a good reference


        if (style = window.getComputedStyle(dom, null)) {
          var camel, value; // opera doesn't give back style.length - use truthy since a 0 length may as well be skipped anyways

          if (style.length) {
            for (var i = 0, l = style.length; i < l; i++) {
              name = style[i];
              camel = camelize(name);
              value = style.getPropertyValue(name);
              product[camel] = value;
            }
          } else {
            // opera
            for (name in style) {
              camel = camelize(name);
              value = style.getPropertyValue(name) || style[name];
              product[camel] = value;
            }
          }
        }
      } // IE - first try currentStyle, then normal style object - don't bother with runtimeStyle
      else if (style = dom.currentStyle) {
          for (name in style) {
            product[name] = style[name];
          }
        } else if (style = dom.style) {
          for (name in style) {
            if (typeof style[name] != 'function') {
              product[name] = style[name];
            }
          }
        }
    }
  } // remove any styles specified...
  // be careful on blacklist - sometimes vendor-specific values aren't obvious but will be visible...  e.g., excepting 'color' will still let '-webkit-text-fill-color' through, which will in fact color the text


  if (except && except instanceof Array) {
    for (var i = 0, l = except.length; i < l; i++) {
      name = except[i];
      delete product[name];
    }
  } // one way out so we can process blacklist in one spot


  return product;
}; // sugar - source is the selector, dom element or jQuery instance to copy from - only and except are optional


$.fn.copyCSS = function (source, only, except) {
  var styles = source.getStyles(only, except);
  this.css(styles);
  return this;
};

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preferences = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Bring in build config options
var metaconfig = require("../config.json");

var PreferenceManager = /*#__PURE__*/function () {
  function PreferenceManager() {
    _classCallCheck(this, PreferenceManager);
  }

  _createClass(PreferenceManager, [{
    key: "GetJSON",
    value: function GetJSON(callback) {
      var _this = this;

      //let loc = window.location.pathname;
      //let dir = loc.substring(0, loc.lastIndexOf('/'));
      var dir = "./dist/"; //console.log(dir + metaconfig.configFile);

      if (this.cachedJSON != null) {
        callback(this.cached);
      } else {
        $.ajax({
          dataType: "json",
          url: dir + metaconfig.configFile,
          success: function success(data) {
            _this.cachedJSON = data;
            callback(_this.cachedJSON);
          }
        });
      }
    }
  }]);

  return PreferenceManager;
}();

var preferences = new PreferenceManager();
exports.preferences = preferences;

},{"../config.json":14}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyRequirements = VerifyRequirements;

/**
 * Returns false if running on an unsupported platform or missing jQuery, otherwise true.
 * 
 */
function VerifyRequirements() {
  // Stop running if we're on an unsupported platform (mobile for now)
  // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  //     console.error("Platform is unsupported!");
  //     //let unsupportedDiv = document.createElement("div");
  //     //unsupportedDiv.appendChild(document.createTextNode("Your platform is unsupported!"));
  //     //document.body.appendChild(unsupportedDiv);
  //     return false;
  // }
  // Check if we don't have jQuery loaded
  if (!window.jQuery) {
    console.error("JQuery must be present!"); //let unsupportedDiv = document.createElement("div");
    //unsupportedDiv.appendChild(document.createTextNode("Your platform is unsupported!"));
    //document.body.appendChild(unsupportedDiv);

    return false;
  }

  return true;
}

},{}],20:[function(require,module,exports){
"use strict";

/**
 * Escapes the string so it can embed directly in an HTML document.
 */
// http://stackoverflow.com/a/12034334
Object.defineProperty(String.prototype, 'escapeHTML', {
  value: function value() {
    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    return String(this).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  }
});

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetFormattedTime = GetFormattedTime;
exports.GetSecondsFromHMS = GetSecondsFromHMS;

// http://stackoverflow.com/a/34841026
function GetFormattedTime(timeInSeconds) {
  if (isNaN(timeInSeconds)) return 0;
  var time = timeInSeconds | 0; //Truncate to integer

  var hours = Math.floor(time / 3600) % 24;
  var minutes = Math.floor(time / 60) % 60;
  var seconds = time % 60;
  var formatted = [hours, minutes, seconds].map(function (v) {
    return v < 10 ? "0" + v : v;
  }).filter(function (v, i) {
    return v !== "00" || i > 0;
  }).join(":");

  if (formatted.charAt(0) == "0") {
    formatted = formatted.substr(1);
  }

  var ms = (timeInSeconds % 1).toFixed(2);
  formatted += ms.toString().substr(1);
  return formatted;
} // From http://stackoverflow.com/a/9640417/7138792


function GetSecondsFromHMS(hms) {
  var parts = hms.split('.');
  var ms = "0";
  if (parts.length > 1) ms = '.' + parts[1];
  var p = parts[0].split(':'),
      s = 0,
      m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }

  s += parseFloat(ms);
  return s;
}

},{}],22:[function(require,module,exports){
"use strict";

require("qtip2");

require("clip-path-polygon");

},{"clip-path-polygon":30,"qtip2":33}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SeekbarTooltip = void 0;

var _time = require("../utils/time.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SeekbarTooltip = /*#__PURE__*/function () {
  function SeekbarTooltip($parent, player) {
    var _this = this;

    _classCallCheck(this, SeekbarTooltip);

    this.$parent = $parent;
    this.player = player;
    this.$tooltip = $("<div class='waldorf-seekbar-tooltip'></div>").appendTo($parent);
    this.text = "Test";
    this.$content = $("<p>" + this.text + "</p>").appendTo(this.$tooltip);
    this.hoverOffset = -10;
    this.padding = 5;
    this.Hide();
    this.$parent.mousemove(function (event) {
      _this.Show(); //Add and update tooltip on mouse movement to show where the mouse is hovering.


      var mouseX = event.pageX - player.$container.offset().left;

      var percent = mouseX / _this.$parent.width();

      var timeAtCursor = percent * player.videoElement.duration;

      _this.Move(mouseX, 0);

      _this.SetContent((0, _time.GetFormattedTime)(timeAtCursor));
    });
    this.$parent.mouseout(function () {
      _this.Hide();
    });
  }

  _createClass(SeekbarTooltip, [{
    key: "Move",
    value: function Move(x, y) {
      // Get initial positions
      var left = x - this.GetWidth() / 2;
      var top = y - this.GetHeight() + this.hoverOffset; // Offset if necessary (keep on-screen)

      if (left - this.padding < 0) {
        left = this.padding;
      }

      if (left + this.padding + this.GetWidth() > this.$parent.width()) {
        left = this.$parent.width() - this.GetWidth() - this.padding;
      } // Apply positions


      this.$tooltip.css({
        top: top,
        left: left
      });
    }
  }, {
    key: "GetWidth",
    value: function GetWidth() {
      return this.$tooltip.width();
    }
  }, {
    key: "GetHeight",
    value: function GetHeight() {
      return this.$tooltip.height();
    }
  }, {
    key: "Show",
    value: function Show() {
      this.$tooltip.makeVisible(true);
    }
  }, {
    key: "Hide",
    value: function Hide() {
      this.$tooltip.makeVisible(false);
    }
  }, {
    key: "SetContent",
    value: function SetContent(text) {
      //console.log(text);
      this.$content.text(text);
    }
  }]);

  return SeekbarTooltip;
}();

exports.SeekbarTooltip = SeekbarTooltip;

},{"../utils/time.js":21}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoPlayerBar = void 0;

var _time = require("../utils/time.js");

var _seekbarTooltip = require("./seekbar-tooltip.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VideoPlayerBar = /*#__PURE__*/function () {
  function VideoPlayerBar(player) {
    var _this = this;

    _classCallCheck(this, VideoPlayerBar);

    this.player = player;
    this.$container = $("<div class='waldorf-player-toolbar flex-toolbar'></div>").appendTo(player.$container);
    this.PopulateElements();
    this.scrubbingTimeSlider = false;
    this.videoPlayingBeforeTimeScrub = false; // Hook up to events from video player

    this.player.$container.on("OnVisibilityChange", function (event, isVisible, duration) {
      return _this.SetVisible(isVisible, duration);
    });
    this.player.$container.on("OnPlayStateChange", function (event, playing) {
      return _this.OnPlayStateChange(playing);
    });
    this.player.$container.on("OnTimeUpdate", function (event, time) {
      return _this.OnTimeUpdate(time);
    });
    this.player.$container.on("OnMuteStateChange", function (event, muted) {
      return _this.OnMuteStateChange(muted);
    });
    this.player.$container.on("OnVolumeChange", function (event, volume) {
      return _this.OnVolumeChange(volume);
    });
  }

  _createClass(VideoPlayerBar, [{
    key: "PopulateElements",
    value: function PopulateElements() {
      var _this2 = this;

      this.$seekBar = $("<div id='seek-bar'><div id='seek-handle' class='ui-slider-handle'></div></div>");
      var $seekSlider = this.$seekBar.slider({
        min: 0.0,
        max: 1.0,
        step: 0.001
      });
      $seekSlider.on("slide", function () {
        return _this2.UpdateVideoTime();
      });
      $seekSlider.on("slidestart", function () {
        return _this2.TimeDragStarted();
      });
      $seekSlider.on("slidestop", function () {
        _this2.TimeDragFinished();

        _this2.UpdateVideoTime();
      });
      this.$container.append(this.$seekBar);
      this.seekbarTooltip = new _seekbarTooltip.SeekbarTooltip(this.$seekBar, this.player);
      this.$seekProgress = $("<div id='seek-fill'></div>");
      this.$container.append(this.$seekProgress); //Jump Back button

      this.$jumpBackButton = $("<button>Jump Back</button>").button({
        icon: "fa fa-fast-backward",
        showLabel: false
      }).click(function () {
        return _this2.player.JumpBackward();
      });
      this.RegisterElement(this.$jumpBackButton, -8); //Nudge Back button

      this.$nudgeBackButton = $("<button>Nudge Back</button>").button({
        icon: "fa fa-step-backward",
        showLabel: false
      }).click(function () {
        return _this2.player.StepBackward();
      });
      this.RegisterElement(this.$nudgeBackButton, -7); // Play button

      this.$playButton = $("<button>Play</button>").button({
        icon: "fa fa-play",
        showLabel: false
      }).click(function () {
        return _this2.player.TogglePlayState();
      });
      this.RegisterElement(this.$playButton, -6); //Nudge button

      this.$nudgeButton = $("<button>Nudge</button>").button({
        icon: "fa fa-step-forward",
        showLabel: false
      }).click(function () {
        return _this2.player.StepForward();
      });
      this.RegisterElement(this.$nudgeButton, -5); //Jump button

      this.$jumpButton = $("<button>Nudge</button>").button({
        icon: "fa fa-fast-forward",
        showLabel: false
      }).click(function () {
        return _this2.player.JumpForward();
      });
      this.RegisterElement(this.$jumpButton, -4); // Time text

      var zero = (0, _time.GetFormattedTime)(0.000);
      this.$timeText = $("<p>${zero}/${zero}</p>");
      this.RegisterElement(this.$timeText, -3); // Mute button

      this.$muteButton = $("<button>Mute</button>").button({
        icon: "fa fa-volume-up",
        showLabel: false
      }).click(function () {
        return _this2.player.ToggleMuteState();
      });
      this.RegisterElement(this.$muteButton, -2); // Volume bar

      this.$volumeBar = $("<div id='volume-bar'><div id='volume-handle' class='ui-slider-handle'></div></div>");
      this.$volumeBar.slider({
        range: "min",
        max: 1.0,
        value: 1.0,
        step: 0.05
      }).on("slide", function (event, ui) {
        return _this2.player.SetVolume(ui.value);
      });
      this.RegisterElement(this.$volumeBar, -1); // Fullscreen button

      this.$fullScreenButton = $("<button>Fullscreen</button>").button({
        icon: "fa fa-arrows-alt",
        showLabel: false
      }).click(function () {
        return _this2.player.ToggleFullscreen();
      });
      this.RegisterElement(this.$fullScreenButton, 999, 'flex-end'); // Create empty element between left floating and right floating toolbar items to space them out properly

      this.$container.append($("<div></div>").css("flex-grow", 1).css("order", 0)); //Initialize controls

      this.OnTimeUpdate();
      this.$volumeBar.slider("value", this.player.videoElement.volume);
    }
  }, {
    key: "RegisterElement",
    value: function RegisterElement($element, order) {
      var justification = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flex-start';
      $element.css('order', order);
      $element.css('align-self', justification); // Sets grow [shrink] [basis]
      //$element.css('flex', '0 0 auto');

      this.$container.append($element);
    }
  }, {
    key: "SetVisible",
    value: function SetVisible(isVisible, duration) {
      var _this3 = this;

      //console.log(isVisible + " " + duration);
      this.$container.stop(true, true);

      if (isVisible) {
        this.$container.fadeTo(duration, 1.0, function () {
          _this3.$container.makeVisible(true);
        });
      } else {
        this.$container.fadeTo(duration, 0.0, function () {
          _this3.$container.makeVisible(false);
        });
      }
    }
  }, {
    key: "UpdateVideoTime",
    value: function UpdateVideoTime() {
      // Calculate the new time
      var time = this.player.videoElement.duration * this.$seekBar.slider("value");
      this.player.endTime = false;
      this.player.videoElement.currentTime = time;
    }
  }, {
    key: "TimeDragStarted",
    value: function TimeDragStarted() {
      this.videoPlayingBeforeTimeScrub = !this.player.videoElement.paused;
      this.player.videoElement.pause();
    }
  }, {
    key: "TimeDragFinished",
    value: function TimeDragFinished() {
      // Start playing the video again if it was playing before the scrub started
      if (this.videoPlayingBeforeTimeScrub) {
        this.player.videoElement.play();
      }
    } ///
    /// ----- Event Listeners -----
    /// The following update the visual state of the bar
    /// upon changes to the video player. These are hooked
    /// up in the constructor.
    ///

  }, {
    key: "OnPlayStateChange",
    value: function OnPlayStateChange(playing) {
      this.$playButton.button("option", {
        icon: playing ? "fa fa-pause" : "fa fa-play"
      });
    }
  }, {
    key: "OnTimeUpdate",
    value: function OnTimeUpdate(time) {
      //console.log("video-player-bar.js:185 OnTimeUpdate is called");
      var duration = this.player.videoElement.duration; // Update the time text

      this.$timeText.text((0, _time.GetFormattedTime)(time) + "/" + (0, _time.GetFormattedTime)(duration));
      var progress = time / duration;
      this.$seekProgress.width((progress * 100).toString() + "%");
    }
  }, {
    key: "OnVolumeChange",
    value: function OnVolumeChange(volume) {
      this.$volumeBar.slider("value", volume);
    }
  }, {
    key: "OnMuteStateChange",
    value: function OnMuteStateChange(muted) {
      this.$muteButton.button("option", {
        icon: muted ? "fa fa-volume-up" : "fa fa-volume-off"
      });
    }
  }]);

  return VideoPlayerBar;
}();

exports.VideoPlayerBar = VideoPlayerBar;

},{"../utils/time.js":21,"./seekbar-tooltip.js":23}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotatorVideoPlayer = void 0;

var _videoPlayerBar = require("./video-player-bar.js");

var _annotator = require("../annotator/annotator.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//import * as screenfull from "screenfull";
//import 'jquery-ui/dist/jquery-ui.js';
var screenfull = require('screenfull');

var AnnotatorVideoPlayer = /*#__PURE__*/function () {
  function AnnotatorVideoPlayer($video, annotatorArgs) {
    var _this = this;

    _classCallCheck(this, AnnotatorVideoPlayer);

    console.log("[AnnotatorVideoPlayer] Creating AnnotatorVideoPlayer for video...");
    this.$video = $video;
    this.videoElement = this.$video.get(0); // Store the original styling of the video element before we alter it

    this.originalStyles = this.$video.getStyles(null, ["height", "WebkitTextFillColor", "color"]); //["width", "top", "left", "margin", "padding"]

    this.Wrap();
    this.PopulateControls();
    this.SetVisible(true); // Hook up events

    this.HookUpEvents(); // Play / pause the video when clicked.

    this.$video.on("click", function () {
      return _this.TogglePlayState();
    });
    this.allowAutoFade = true; /// Inactivity timer for the mouse.

    this.mouseTimer = null; /// Set to true if the time slider is currently being dragged by the user.

    this.draggingTimeSlider = false; /// Seconds before the UI fades due to mouse inactivity.

    this.idleSecondsBeforeFade = 3;
    this.fadeDuration = 300;
    this.endTime = false;
    this.$container.mousemove(function () {
      return _this.OnMouseMove();
    });
    this.SetAutoFade(true); // If screenfull is enabled, create the event to handle it.

    if (screenfull !== 'undefined') {
      screenfull.onchange(function () {
        _this.OnFullscreenChange();

        _this.$container.trigger("OnFullscreenChange");
      });
    }

    this.videoElement.ontimeupdate = function () {
      _this.OnTimeUpdate(_this.videoElement.currentTime);
    };

    this.$container.on("OnVideoReady", function () {
      if (annotatorArgs.annotator == null) {
        console.log("[AnnotatorVideoPlayer] Player sent OnVideoReady, attempting to wrap with annotator..."); // Add annotator once video has loaded

        console.log("[AnnotatorVideoPlayer] Wrapping video with annotator...");
        annotatorArgs.player = _this;
        annotatorArgs.annotator = new _annotator.VideoAnnotator(annotatorArgs);
        if (typeof annotatorArgs.callback == "function") annotatorArgs.callback(annotatorArgs.annotator);
      }
    });

    this.videoElement.onloadedmetadata = function () {
      _this.$container.trigger("OnVideoReady");
    };

    if (this.videoElement.duration != null) {
      // If the metadata is already prepared, throw the event since
      // onloadedmetadata won't be fired
      this.$container.trigger("OnVideoReady");
    }

    console.log("[AnnotatorVideoPlayer] AnnotatorVideoPlayer created for video.");
  }

  _createClass(AnnotatorVideoPlayer, [{
    key: "Wrap",
    value: function Wrap() {
      // Remove the default controls from the video
      this.videoElement.removeAttribute("controls"); // Wrap the video element with the container

      this.$container = this.$video.wrap("<div class='waldorf-video-player'></div>").parent(); // Resize container to fit the dimensions of the video

      this.$container.width(this.$video.width());
      this.$container.height(this.$video.height());
    }
  }, {
    key: "PopulateControls",
    value: function PopulateControls() {
      this.controlBar = new _videoPlayerBar.VideoPlayerBar(this);
    }
  }, {
    key: "SetVisible",
    value: function SetVisible(isVisible) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.$container.trigger("OnVisibilityChange", [isVisible, duration]);
    }
  }, {
    key: "HookUpEvents",
    value: function HookUpEvents() {}
  }, {
    key: "TogglePlayState",
    value: function TogglePlayState() {
      if (this.videoElement.paused) {
        this.Play();
      } else {
        this.Pause();
      }
    }
  }, {
    key: "StepForward",
    value: function StepForward() {
      var newTime = this.videoElement.currentTime + 0.1;
      this.videoElement.currentTime = newTime > this.videoElement.duration ? this.videoElement.duration : newTime;
    }
  }, {
    key: "JumpForward",
    value: function JumpForward() {
      var newTime = this.videoElement.currentTime + 1;
      this.videoElement.currentTime = newTime > this.videoElement.duration ? this.videoElement.duration : newTime;
    }
  }, {
    key: "StepBackward",
    value: function StepBackward() {
      var newTime = this.videoElement.currentTime - 0.1;
      this.videoElement.currentTime = newTime < 0 ? 0 : newTime;
    }
  }, {
    key: "JumpBackward",
    value: function JumpBackward() {
      var newTime = this.videoElement.currentTime - 1;
      this.videoElement.currentTime = newTime < 0 ? 0 : newTime;
    }
  }, {
    key: "Play",
    value: function Play() {
      this.videoElement.play();
      if (this.endTime) this.endTime = false;
      this.SetAutoFade(true);
      this.$container.trigger("OnPlayStateChange", !this.videoElement.paused);
    }
  }, {
    key: "Pause",
    value: function Pause() {
      if (this.endTime) this.endTime = false;
      this.videoElement.pause();
      this.SetAutoFade(false);
      this.$container.trigger("OnPlayStateChange", !this.videoElement.paused);
    }
  }, {
    key: "ToggleMuteState",
    value: function ToggleMuteState() {
      var muted = this.videoElement.muted;
      this.videoElement.muted = !muted;
      this.$container.trigger("OnMuteStateChange", muted);
    }
  }, {
    key: "SetVolume",
    value: function SetVolume(volume) {
      this.videoElement.volume = volume;
      this.$container.trigger("OnVolumeChange", volume);
    }
  }, {
    key: "ToggleFullscreen",
    value: function ToggleFullscreen() {
      if (screenfull === 'undefined' || !screenfull.enabled) {
        return;
      }

      screenfull.toggle(this.$container[0]);
    }
  }, {
    key: "OnFullscreenChange",
    value: function OnFullscreenChange() {
      if (screenfull.isFullscreen) {
        this.$container.addClass("waldorf-fullscreen");
      } else {
        this.$container.removeClass("waldorf-fullscreen");
      }
    }
  }, {
    key: "SetFullscreen",
    value: function SetFullscreen(fullscreen) {
      if (screenfull === 'undefined' || !screenfull.enabled) {
        return;
      }

      if (fullscreen) {
        screenfull.request(this.$container[0]);
      } else {
        screenfull.exit();
      }
    }
    /**
     * Called when the mouse moves in the video container.
     */

  }, {
    key: "OnMouseMove",
    value: function OnMouseMove() {
      // Reset the timer
      clearTimeout(this.mouseTimer);
      this.mouseTimer = 0; // Restart fading if allowed to

      if (this.allowAutoFade) {
        this.RestartFading();
      }
    }
  }, {
    key: "OnTimeUpdate",
    value: function OnTimeUpdate(time) {
      if (this.endTime && this.endTime <= this.videoElement.currentTime) {
        this.Pause();
        this.endTime = false;
      }

      this.$container.trigger("OnTimeUpdate", time);
    }
  }, {
    key: "RestartFading",
    value: function RestartFading() {
      var _this2 = this;

      // Restore visibility
      this.SetVisible(true, this.fadeDuration); // Start the timer over again

      this.mouseTimer = setTimeout(function () {
        _this2.SetVisible(false, _this2.fadeDuration);
      }, this.idleSecondsBeforeFade * 1000);
    }
  }, {
    key: "SetAutoFade",
    value: function SetAutoFade(allow) {
      this.allowAutoFade = allow; // Reset the mouse timer

      clearTimeout(this.mouseTimer);
      this.mouseTimer = 0; // Make elements visible

      this.SetVisible(true); // Restart the fading behavior if desired

      if (allow) {
        this.RestartFading();
      }
    } // IsPlaying(){
    //     // http://stackoverflow.com/a/31133401
    //     return !!(this.videoElement.currentTime > 0 && !this.videoElement.paused && 
    //               !this.videoElement.ended && this.videoElement.readyState > 2);
    // }
    // From https://gist.github.com/Nateowami/7a947e93f09c45a1097e783dc00560e1

  }, {
    key: "GetVideoDimensions",
    value: function GetVideoDimensions() {
      var video = this.videoElement; // Ratio of the video's intrisic dimensions

      var videoRatio = video.videoWidth / video.videoHeight; // The width and height of the video element

      var width = video.offsetWidth;
      var height = video.offsetHeight; // The ratio of the element's width to its height

      var elementRatio = width / height; // If the video element is short and wide

      if (elementRatio > videoRatio) width = height * videoRatio; // It must be tall and thin, or exactly equal to the original ratio
      else height = width / videoRatio;
      return {
        width: width,
        height: height
      };
    }
  }]);

  return AnnotatorVideoPlayer;
}();

exports.AnnotatorVideoPlayer = AnnotatorVideoPlayer;

},{"../annotator/annotator.js":4,"./video-player-bar.js":24,"screenfull":34}],26:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],27:[function(require,module,exports){

},{}],28:[function(require,module,exports){
(function (Buffer){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this,require("buffer").Buffer)

},{"base64-js":26,"buffer":28,"ieee754":32}],29:[function(require,module,exports){
var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;

},{}],30:[function(require,module,exports){
/*!
 * jQuery clip-path-polygon Plugin v0.1.14 (2019-11-16)
 * jQuery plugin that makes easy to use clip-path on whatever tag under different browsers
 * https://github.com/andrusieczko/clip-path-polygon
 * 
 * Copyright 2019 Karol Andrusieczko
 * Released under MIT license
 */

var globalVariable = window || root;
var jQuery = jQuery || globalVariable.jQuery || require("jquery");

(function($) {
  var id = 0;

  var ClipPath = function(jQuery, $el, points, options) {
    this.$ = jQuery;
    this.$el = $el;
    this.points = points;
    this.svgDefId = 'clipPathPolygonGenId' + id++;

    this.processOptions(options);
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = ClipPath;
    }
    exports.ClipPath = ClipPath;
  } else {
    globalVariable.ClipPath = ClipPath;
  }

  ClipPath.prototype = {

    $: null,
    $el: null,
    points: null,

    isForWebkit: true,
    isForSvg: true,
    svgDefId: null,
    isPercentage: false,

    create: function() {
      this._createClipPath(this.points);
    },

    _createClipPath: function(points) {
      this._createSvgDefs();
      if (this.isForSvg) {
        this._createSvgBasedClipPath(points);
      }
      if (this.isForWebkit) {
        this._createWebkitClipPath(points);
      }
    },

    _createWebkitClipPath: function(points) {
      var clipPath = "polygon(" + this._translatePoints(points, true, this.isPercentage) + ")";
      this.$el.css('-webkit-clip-path', clipPath);
    },

    _createSvgBasedClipPath: function(points) {
      this.$('#' + this.svgDefId + '').find('polygon').attr('points', this._translatePoints(points, false, this.isPercentage));
      this.$el.css('clip-path', 'url(#' + this.svgDefId + ')');
    },


    _translatePoints: function(points, withUnit, isPercentage) {
      var result = [];
      for (var i in points) {
        var x = this._handlePxs(points[i][0], withUnit, isPercentage);
        var y = this._handlePxs(points[i][1], withUnit, isPercentage);
        result.push(x + ' ' + y);
      }
      return result.join(', ');
    },

    _handlePxs: function(number, withUnit, isPercentage) {
      if (number === 0) {
        return number;
      }
      if (!withUnit) {
        if (isPercentage) {
          return number / 100;
        }
        return number;
      }

      return number + (isPercentage ? "%" : "px");
    },

    _createSvgElement: function(elementName) {
      return this.$(document.createElementNS('http://www.w3.org/2000/svg', elementName));
    },

    _createSvgDefs: function() {
      if (this.$('#' + this.svgDefId + '').length === 0) {
        var $svg = this._createSvgElement('svg').attr('width', 0).attr('height', 0).css({
          'position': 'absolute',
          'visibility': 'hidden',
          'width': 0,
          'height': 0
        });
        var $defs = this._createSvgElement('defs');
        $svg.append($defs);
        var $clippath = this._createSvgElement('clipPath').attr('id', this.svgDefId);
        if (this.isPercentage) {
          $clippath.get(0).setAttribute('clipPathUnits', 'objectBoundingBox');
        }
        $defs.append($clippath);
        var $polygon = this._createSvgElement('polygon');
        $clippath.append($polygon);
        this.$('body').append($svg);
      }
    },

    processOptions: function(options) {
      this.isForWebkit = (options && typeof(options.isForWebkit) !== "undefined") ? options.isForWebkit : this.isForWebkit;
      this.isForSvg = (options && typeof(options.isForSvg) !== "undefined") ? options.isForSvg : this.isForSvg;
      this.isPercentage = (options && options.isPercentage || this.isPercentage);
      this.svgDefId = (options && options.svgDefId) || this.svgDefId;
    }
  };
  
  $.fn.clipPath = function(points, options) {
    return this.each(function() {
      var $el = $(this);
      var clipPath = new ClipPath($, $el, points, options);
      clipPath.create();
    });
  };

}).call(this, jQuery);

},{"jquery":27}],31:[function(require,module,exports){
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();

},{}],32:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],33:[function(require,module,exports){
/*
 * qTip2 - Pretty powerful tooltips - v3.0.3
 * http://qtip2.com
 *
 * Copyright (c) 2016 
 * Released under the MIT licenses
 * http://jquery.org/license
 *
 * Date: Wed May 11 2016 10:31 GMT+0100+0100
 * Plugins: tips modal viewport svg imagemap ie6
 * Styles: core basic css3
 */
/*global window: false, jQuery: false, console: false, define: false */

/* Cache window, document, undefined */
(function( window, document, undefined ) {

// Uses AMD or browser globals to create a jQuery plugin.
(function( factory ) {
	"use strict";
	if(typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	}
	else if(jQuery && !jQuery.fn.qtip) {
		factory(jQuery);
	}
}
(function($) {
	"use strict"; // Enable ECMAScript "strict" operation for this function. See more: http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
;// Munge the primitives - Paul Irish tip
var TRUE = true,
FALSE = false,
NULL = null,

// Common variables
X = 'x', Y = 'y',
WIDTH = 'width',
HEIGHT = 'height',

// Positioning sides
TOP = 'top',
LEFT = 'left',
BOTTOM = 'bottom',
RIGHT = 'right',
CENTER = 'center',

// Position adjustment types
FLIP = 'flip',
FLIPINVERT = 'flipinvert',
SHIFT = 'shift',

// Shortcut vars
QTIP, PROTOTYPE, CORNER, CHECKS,
PLUGINS = {},
NAMESPACE = 'qtip',
ATTR_HAS = 'data-hasqtip',
ATTR_ID = 'data-qtip-id',
WIDGET = ['ui-widget', 'ui-tooltip'],
SELECTOR = '.'+NAMESPACE,
INACTIVE_EVENTS = 'click dblclick mousedown mouseup mousemove mouseleave mouseenter'.split(' '),

CLASS_FIXED = NAMESPACE+'-fixed',
CLASS_DEFAULT = NAMESPACE + '-default',
CLASS_FOCUS = NAMESPACE + '-focus',
CLASS_HOVER = NAMESPACE + '-hover',
CLASS_DISABLED = NAMESPACE+'-disabled',

replaceSuffix = '_replacedByqTip',
oldtitle = 'oldtitle',
trackingBound,

// Browser detection
BROWSER = {
	/*
	 * IE version detection
	 *
	 * Adapted from: http://ajaxian.com/archives/attack-of-the-ie-conditional-comment
	 * Credit to James Padolsey for the original implemntation!
	 */
	ie: (function() {
		/* eslint-disable no-empty */
		var v, i;
		for (
			v = 4, i = document.createElement('div');
			(i.innerHTML = '<!--[if gt IE ' + v + ']><i></i><![endif]-->') && i.getElementsByTagName('i')[0];
			v+=1
		) {}
		return v > 4 ? v : NaN;
		/* eslint-enable no-empty */
	})(),

	/*
	 * iOS version detection
	 */
	iOS: parseFloat(
		('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
		.replace('undefined', '3_2').replace('_', '.').replace('_', '')
	) || FALSE
};
;function QTip(target, options, id, attr) {
	// Elements and ID
	this.id = id;
	this.target = target;
	this.tooltip = NULL;
	this.elements = { target: target };

	// Internal constructs
	this._id = NAMESPACE + '-' + id;
	this.timers = { img: {} };
	this.options = options;
	this.plugins = {};

	// Cache object
	this.cache = {
		event: {},
		target: $(),
		disabled: FALSE,
		attr: attr,
		onTooltip: FALSE,
		lastClass: ''
	};

	// Set the initial flags
	this.rendered = this.destroyed = this.disabled = this.waiting =
		this.hiddenDuringWait = this.positioning = this.triggering = FALSE;
}
PROTOTYPE = QTip.prototype;

PROTOTYPE._when = function(deferreds) {
	return $.when.apply($, deferreds);
};

PROTOTYPE.render = function(show) {
	if(this.rendered || this.destroyed) { return this; } // If tooltip has already been rendered, exit

	var self = this,
		options = this.options,
		cache = this.cache,
		elements = this.elements,
		text = options.content.text,
		title = options.content.title,
		button = options.content.button,
		posOptions = options.position,
		deferreds = [];

	// Add ARIA attributes to target
	$.attr(this.target[0], 'aria-describedby', this._id);

	// Create public position object that tracks current position corners
	cache.posClass = this._createPosClass(
		(this.position = { my: posOptions.my, at: posOptions.at }).my
	);

	// Create tooltip element
	this.tooltip = elements.tooltip = $('<div/>', {
		'id': this._id,
		'class': [ NAMESPACE, CLASS_DEFAULT, options.style.classes, cache.posClass ].join(' '),
		'width': options.style.width || '',
		'height': options.style.height || '',
		'tracking': posOptions.target === 'mouse' && posOptions.adjust.mouse,

		/* ARIA specific attributes */
		'role': 'alert',
		'aria-live': 'polite',
		'aria-atomic': FALSE,
		'aria-describedby': this._id + '-content',
		'aria-hidden': TRUE
	})
	.toggleClass(CLASS_DISABLED, this.disabled)
	.attr(ATTR_ID, this.id)
	.data(NAMESPACE, this)
	.appendTo(posOptions.container)
	.append(
		// Create content element
		elements.content = $('<div />', {
			'class': NAMESPACE + '-content',
			'id': this._id + '-content',
			'aria-atomic': TRUE
		})
	);

	// Set rendered flag and prevent redundant reposition calls for now
	this.rendered = -1;
	this.positioning = TRUE;

	// Create title...
	if(title) {
		this._createTitle();

		// Update title only if its not a callback (called in toggle if so)
		if(!$.isFunction(title)) {
			deferreds.push( this._updateTitle(title, FALSE) );
		}
	}

	// Create button
	if(button) { this._createButton(); }

	// Set proper rendered flag and update content if not a callback function (called in toggle)
	if(!$.isFunction(text)) {
		deferreds.push( this._updateContent(text, FALSE) );
	}
	this.rendered = TRUE;

	// Setup widget classes
	this._setWidget();

	// Initialize 'render' plugins
	$.each(PLUGINS, function(name) {
		var instance;
		if(this.initialize === 'render' && (instance = this(self))) {
			self.plugins[name] = instance;
		}
	});

	// Unassign initial events and assign proper events
	this._unassignEvents();
	this._assignEvents();

	// When deferreds have completed
	this._when(deferreds).then(function() {
		// tooltiprender event
		self._trigger('render');

		// Reset flags
		self.positioning = FALSE;

		// Show tooltip if not hidden during wait period
		if(!self.hiddenDuringWait && (options.show.ready || show)) {
			self.toggle(TRUE, cache.event, FALSE);
		}
		self.hiddenDuringWait = FALSE;
	});

	// Expose API
	QTIP.api[this.id] = this;

	return this;
};

PROTOTYPE.destroy = function(immediate) {
	// Set flag the signify destroy is taking place to plugins
	// and ensure it only gets destroyed once!
	if(this.destroyed) { return this.target; }

	function process() {
		if(this.destroyed) { return; }
		this.destroyed = TRUE;

		var target = this.target,
			title = target.attr(oldtitle),
			timer;

		// Destroy tooltip if rendered
		if(this.rendered) {
			this.tooltip.stop(1,0).find('*').remove().end().remove();
		}

		// Destroy all plugins
		$.each(this.plugins, function() {
			this.destroy && this.destroy();
		});

		// Clear timers
		for (timer in this.timers) {
			if (this.timers.hasOwnProperty(timer)) {
				clearTimeout(this.timers[timer]);
			}
		}

		// Remove api object and ARIA attributes
		target.removeData(NAMESPACE)
			.removeAttr(ATTR_ID)
			.removeAttr(ATTR_HAS)
			.removeAttr('aria-describedby');

		// Reset old title attribute if removed
		if(this.options.suppress && title) {
			target.attr('title', title).removeAttr(oldtitle);
		}

		// Remove qTip events associated with this API
		this._unassignEvents();

		// Remove ID from used id objects, and delete object references
		// for better garbage collection and leak protection
		this.options = this.elements = this.cache = this.timers =
			this.plugins = this.mouse = NULL;

		// Delete epoxsed API object
		delete QTIP.api[this.id];
	}

	// If an immediate destroy is needed
	if((immediate !== TRUE || this.triggering === 'hide') && this.rendered) {
		this.tooltip.one('tooltiphidden', $.proxy(process, this));
		!this.triggering && this.hide();
	}

	// If we're not in the process of hiding... process
	else { process.call(this); }

	return this.target;
};
;function invalidOpt(a) {
	return a === NULL || $.type(a) !== 'object';
}

function invalidContent(c) {
	return !($.isFunction(c) || 
            c && c.attr || 
            c.length || 
            $.type(c) === 'object' && (c.jquery || c.then));
}

// Option object sanitizer
function sanitizeOptions(opts) {
	var content, text, ajax, once;

	if(invalidOpt(opts)) { return FALSE; }

	if(invalidOpt(opts.metadata)) {
		opts.metadata = { type: opts.metadata };
	}

	if('content' in opts) {
		content = opts.content;

		if(invalidOpt(content) || content.jquery || content.done) {
			text = invalidContent(content) ? FALSE : content;
			content = opts.content = {
				text: text
			};
		}
		else { text = content.text; }

		// DEPRECATED - Old content.ajax plugin functionality
		// Converts it into the proper Deferred syntax
		if('ajax' in content) {
			ajax = content.ajax;
			once = ajax && ajax.once !== FALSE;
			delete content.ajax;

			content.text = function(event, api) {
				var loading = text || $(this).attr(api.options.content.attr) || 'Loading...',

				deferred = $.ajax(
					$.extend({}, ajax, { context: api })
				)
				.then(ajax.success, NULL, ajax.error)
				.then(function(newContent) {
					if(newContent && once) { api.set('content.text', newContent); }
					return newContent;
				},
				function(xhr, status, error) {
					if(api.destroyed || xhr.status === 0) { return; }
					api.set('content.text', status + ': ' + error);
				});

				return !once ? (api.set('content.text', loading), deferred) : loading;
			};
		}

		if('title' in content) {
			if($.isPlainObject(content.title)) {
				content.button = content.title.button;
				content.title = content.title.text;
			}

			if(invalidContent(content.title || FALSE)) {
				content.title = FALSE;
			}
		}
	}

	if('position' in opts && invalidOpt(opts.position)) {
		opts.position = { my: opts.position, at: opts.position };
	}

	if('show' in opts && invalidOpt(opts.show)) {
		opts.show = opts.show.jquery ? { target: opts.show } :
			opts.show === TRUE ? { ready: TRUE } : { event: opts.show };
	}

	if('hide' in opts && invalidOpt(opts.hide)) {
		opts.hide = opts.hide.jquery ? { target: opts.hide } : { event: opts.hide };
	}

	if('style' in opts && invalidOpt(opts.style)) {
		opts.style = { classes: opts.style };
	}

	// Sanitize plugin options
	$.each(PLUGINS, function() {
		this.sanitize && this.sanitize(opts);
	});

	return opts;
}

// Setup builtin .set() option checks
CHECKS = PROTOTYPE.checks = {
	builtin: {
		// Core checks
		'^id$': function(obj, o, v, prev) {
			var id = v === TRUE ? QTIP.nextid : v,
				newId = NAMESPACE + '-' + id;

			if(id !== FALSE && id.length > 0 && !$('#'+newId).length) {
				this._id = newId;

				if(this.rendered) {
					this.tooltip[0].id = this._id;
					this.elements.content[0].id = this._id + '-content';
					this.elements.title[0].id = this._id + '-title';
				}
			}
			else { obj[o] = prev; }
		},
		'^prerender': function(obj, o, v) {
			v && !this.rendered && this.render(this.options.show.ready);
		},

		// Content checks
		'^content.text$': function(obj, o, v) {
			this._updateContent(v);
		},
		'^content.attr$': function(obj, o, v, prev) {
			if(this.options.content.text === this.target.attr(prev)) {
				this._updateContent( this.target.attr(v) );
			}
		},
		'^content.title$': function(obj, o, v) {
			// Remove title if content is null
			if(!v) { return this._removeTitle(); }

			// If title isn't already created, create it now and update
			v && !this.elements.title && this._createTitle();
			this._updateTitle(v);
		},
		'^content.button$': function(obj, o, v) {
			this._updateButton(v);
		},
		'^content.title.(text|button)$': function(obj, o, v) {
			this.set('content.'+o, v); // Backwards title.text/button compat
		},

		// Position checks
		'^position.(my|at)$': function(obj, o, v){
			if('string' === typeof v) {
				this.position[o] = obj[o] = new CORNER(v, o === 'at');
			}
		},
		'^position.container$': function(obj, o, v){
			this.rendered && this.tooltip.appendTo(v);
		},

		// Show checks
		'^show.ready$': function(obj, o, v) {
			v && (!this.rendered && this.render(TRUE) || this.toggle(TRUE));
		},

		// Style checks
		'^style.classes$': function(obj, o, v, p) {
			this.rendered && this.tooltip.removeClass(p).addClass(v);
		},
		'^style.(width|height)': function(obj, o, v) {
			this.rendered && this.tooltip.css(o, v);
		},
		'^style.widget|content.title': function() {
			this.rendered && this._setWidget();
		},
		'^style.def': function(obj, o, v) {
			this.rendered && this.tooltip.toggleClass(CLASS_DEFAULT, !!v);
		},

		// Events check
		'^events.(render|show|move|hide|focus|blur)$': function(obj, o, v) {
			this.rendered && this.tooltip[($.isFunction(v) ? '' : 'un') + 'bind']('tooltip'+o, v);
		},

		// Properties which require event reassignment
		'^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)': function() {
			if(!this.rendered) { return; }

			// Set tracking flag
			var posOptions = this.options.position;
			this.tooltip.attr('tracking', posOptions.target === 'mouse' && posOptions.adjust.mouse);

			// Reassign events
			this._unassignEvents();
			this._assignEvents();
		}
	}
};

// Dot notation converter
function convertNotation(options, notation) {
	var i = 0, obj, option = options,

	// Split notation into array
	levels = notation.split('.');

	// Loop through
	while(option = option[ levels[i++] ]) {
		if(i < levels.length) { obj = option; }
	}

	return [obj || options, levels.pop()];
}

PROTOTYPE.get = function(notation) {
	if(this.destroyed) { return this; }

	var o = convertNotation(this.options, notation.toLowerCase()),
		result = o[0][ o[1] ];

	return result.precedance ? result.string() : result;
};

function setCallback(notation, args) {
	var category, rule, match;

	for(category in this.checks) {
		if (!this.checks.hasOwnProperty(category)) { continue; }

		for(rule in this.checks[category]) {
			if (!this.checks[category].hasOwnProperty(rule)) { continue; }

			if(match = (new RegExp(rule, 'i')).exec(notation)) {
				args.push(match);

				if(category === 'builtin' || this.plugins[category]) {
					this.checks[category][rule].apply(
						this.plugins[category] || this, args
					);
				}
			}
		}
	}
}

var rmove = /^position\.(my|at|adjust|target|container|viewport)|style|content|show\.ready/i,
	rrender = /^prerender|show\.ready/i;

PROTOTYPE.set = function(option, value) {
	if(this.destroyed) { return this; }

	var rendered = this.rendered,
		reposition = FALSE,
		options = this.options,
		name;

	// Convert singular option/value pair into object form
	if('string' === typeof option) {
		name = option; option = {}; option[name] = value;
	}
	else { option = $.extend({}, option); }

	// Set all of the defined options to their new values
	$.each(option, function(notation, val) {
		if(rendered && rrender.test(notation)) {
			delete option[notation]; return;
		}

		// Set new obj value
		var obj = convertNotation(options, notation.toLowerCase()), previous;
		previous = obj[0][ obj[1] ];
		obj[0][ obj[1] ] = val && val.nodeType ? $(val) : val;

		// Also check if we need to reposition
		reposition = rmove.test(notation) || reposition;

		// Set the new params for the callback
		option[notation] = [obj[0], obj[1], val, previous];
	});

	// Re-sanitize options
	sanitizeOptions(options);

	/*
	 * Execute any valid callbacks for the set options
	 * Also set positioning flag so we don't get loads of redundant repositioning calls.
	 */
	this.positioning = TRUE;
	$.each(option, $.proxy(setCallback, this));
	this.positioning = FALSE;

	// Update position if needed
	if(this.rendered && this.tooltip[0].offsetWidth > 0 && reposition) {
		this.reposition( options.position.target === 'mouse' ? NULL : this.cache.event );
	}

	return this;
};
;PROTOTYPE._update = function(content, element) {
	var self = this,
		cache = this.cache;

	// Make sure tooltip is rendered and content is defined. If not return
	if(!this.rendered || !content) { return FALSE; }

	// Use function to parse content
	if($.isFunction(content)) {
		content = content.call(this.elements.target, cache.event, this) || '';
	}

	// Handle deferred content
	if($.isFunction(content.then)) {
		cache.waiting = TRUE;
		return content.then(function(c) {
			cache.waiting = FALSE;
			return self._update(c, element);
		}, NULL, function(e) {
			return self._update(e, element);
		});
	}

	// If content is null... return false
	if(content === FALSE || !content && content !== '') { return FALSE; }

	// Append new content if its a DOM array and show it if hidden
	if(content.jquery && content.length > 0) {
		element.empty().append(
			content.css({ display: 'block', visibility: 'visible' })
		);
	}

	// Content is a regular string, insert the new content
	else { element.html(content); }

	// Wait for content to be loaded, and reposition
	return this._waitForContent(element).then(function(images) {
		if(self.rendered && self.tooltip[0].offsetWidth > 0) {
			self.reposition(cache.event, !images.length);
		}
	});
};

PROTOTYPE._waitForContent = function(element) {
	var cache = this.cache;

	// Set flag
	cache.waiting = TRUE;

	// If imagesLoaded is included, ensure images have loaded and return promise
	return ( $.fn.imagesLoaded ? element.imagesLoaded() : new $.Deferred().resolve([]) )
		.done(function() { cache.waiting = FALSE; })
		.promise();
};

PROTOTYPE._updateContent = function(content, reposition) {
	this._update(content, this.elements.content, reposition);
};

PROTOTYPE._updateTitle = function(content, reposition) {
	if(this._update(content, this.elements.title, reposition) === FALSE) {
		this._removeTitle(FALSE);
	}
};

PROTOTYPE._createTitle = function()
{
	var elements = this.elements,
		id = this._id+'-title';

	// Destroy previous title element, if present
	if(elements.titlebar) { this._removeTitle(); }

	// Create title bar and title elements
	elements.titlebar = $('<div />', {
		'class': NAMESPACE + '-titlebar ' + (this.options.style.widget ? createWidgetClass('header') : '')
	})
	.append(
		elements.title = $('<div />', {
			'id': id,
			'class': NAMESPACE + '-title',
			'aria-atomic': TRUE
		})
	)
	.insertBefore(elements.content)

	// Button-specific events
	.delegate('.qtip-close', 'mousedown keydown mouseup keyup mouseout', function(event) {
		$(this).toggleClass('ui-state-active ui-state-focus', event.type.substr(-4) === 'down');
	})
	.delegate('.qtip-close', 'mouseover mouseout', function(event){
		$(this).toggleClass('ui-state-hover', event.type === 'mouseover');
	});

	// Create button if enabled
	if(this.options.content.button) { this._createButton(); }
};

PROTOTYPE._removeTitle = function(reposition)
{
	var elements = this.elements;

	if(elements.title) {
		elements.titlebar.remove();
		elements.titlebar = elements.title = elements.button = NULL;

		// Reposition if enabled
		if(reposition !== FALSE) { this.reposition(); }
	}
};
;PROTOTYPE._createPosClass = function(my) {
	return NAMESPACE + '-pos-' + (my || this.options.position.my).abbrev();
};

PROTOTYPE.reposition = function(event, effect) {
	if(!this.rendered || this.positioning || this.destroyed) { return this; }

	// Set positioning flag
	this.positioning = TRUE;

	var cache = this.cache,
		tooltip = this.tooltip,
		posOptions = this.options.position,
		target = posOptions.target,
		my = posOptions.my,
		at = posOptions.at,
		viewport = posOptions.viewport,
		container = posOptions.container,
		adjust = posOptions.adjust,
		method = adjust.method.split(' '),
		tooltipWidth = tooltip.outerWidth(FALSE),
		tooltipHeight = tooltip.outerHeight(FALSE),
		targetWidth = 0,
		targetHeight = 0,
		type = tooltip.css('position'),
		position = { left: 0, top: 0 },
		visible = tooltip[0].offsetWidth > 0,
		isScroll = event && event.type === 'scroll',
		win = $(window),
		doc = container[0].ownerDocument,
		mouse = this.mouse,
		pluginCalculations, offset, adjusted, newClass;

	// Check if absolute position was passed
	if($.isArray(target) && target.length === 2) {
		// Force left top and set position
		at = { x: LEFT, y: TOP };
		position = { left: target[0], top: target[1] };
	}

	// Check if mouse was the target
	else if(target === 'mouse') {
		// Force left top to allow flipping
		at = { x: LEFT, y: TOP };

		// Use the mouse origin that caused the show event, if distance hiding is enabled
		if((!adjust.mouse || this.options.hide.distance) && cache.origin && cache.origin.pageX) {
			event =  cache.origin;
		}

		// Use cached event for resize/scroll events
		else if(!event || event && (event.type === 'resize' || event.type === 'scroll')) {
			event = cache.event;
		}

		// Otherwise, use the cached mouse coordinates if available
		else if(mouse && mouse.pageX) {
			event = mouse;
		}

		// Calculate body and container offset and take them into account below
		if(type !== 'static') { position = container.offset(); }
		if(doc.body.offsetWidth !== (window.innerWidth || doc.documentElement.clientWidth)) {
			offset = $(document.body).offset();
		}

		// Use event coordinates for position
		position = {
			left: event.pageX - position.left + (offset && offset.left || 0),
			top: event.pageY - position.top + (offset && offset.top || 0)
		};

		// Scroll events are a pain, some browsers
		if(adjust.mouse && isScroll && mouse) {
			position.left -= (mouse.scrollX || 0) - win.scrollLeft();
			position.top -= (mouse.scrollY || 0) - win.scrollTop();
		}
	}

	// Target wasn't mouse or absolute...
	else {
		// Check if event targetting is being used
		if(target === 'event') {
			if(event && event.target && event.type !== 'scroll' && event.type !== 'resize') {
				cache.target = $(event.target);
			}
			else if(!event.target) {
				cache.target = this.elements.target;
			}
		}
		else if(target !== 'event'){
			cache.target = $(target.jquery ? target : this.elements.target);
		}
		target = cache.target;

		// Parse the target into a jQuery object and make sure there's an element present
		target = $(target).eq(0);
		if(target.length === 0) { return this; }

		// Check if window or document is the target
		else if(target[0] === document || target[0] === window) {
			targetWidth = BROWSER.iOS ? window.innerWidth : target.width();
			targetHeight = BROWSER.iOS ? window.innerHeight : target.height();

			if(target[0] === window) {
				position = {
					top: (viewport || target).scrollTop(),
					left: (viewport || target).scrollLeft()
				};
			}
		}

		// Check if the target is an <AREA> element
		else if(PLUGINS.imagemap && target.is('area')) {
			pluginCalculations = PLUGINS.imagemap(this, target, at, PLUGINS.viewport ? method : FALSE);
		}

		// Check if the target is an SVG element
		else if(PLUGINS.svg && target && target[0].ownerSVGElement) {
			pluginCalculations = PLUGINS.svg(this, target, at, PLUGINS.viewport ? method : FALSE);
		}

		// Otherwise use regular jQuery methods
		else {
			targetWidth = target.outerWidth(FALSE);
			targetHeight = target.outerHeight(FALSE);
			position = target.offset();
		}

		// Parse returned plugin values into proper variables
		if(pluginCalculations) {
			targetWidth = pluginCalculations.width;
			targetHeight = pluginCalculations.height;
			offset = pluginCalculations.offset;
			position = pluginCalculations.position;
		}

		// Adjust position to take into account offset parents
		position = this.reposition.offset(target, position, container);

		// Adjust for position.fixed tooltips (and also iOS scroll bug in v3.2-4.0 & v4.3-4.3.2)
		if(BROWSER.iOS > 3.1 && BROWSER.iOS < 4.1 ||
			BROWSER.iOS >= 4.3 && BROWSER.iOS < 4.33 ||
			!BROWSER.iOS && type === 'fixed'
		){
			position.left -= win.scrollLeft();
			position.top -= win.scrollTop();
		}

		// Adjust position relative to target
		if(!pluginCalculations || pluginCalculations && pluginCalculations.adjustable !== FALSE) {
			position.left += at.x === RIGHT ? targetWidth : at.x === CENTER ? targetWidth / 2 : 0;
			position.top += at.y === BOTTOM ? targetHeight : at.y === CENTER ? targetHeight / 2 : 0;
		}
	}

	// Adjust position relative to tooltip
	position.left += adjust.x + (my.x === RIGHT ? -tooltipWidth : my.x === CENTER ? -tooltipWidth / 2 : 0);
	position.top += adjust.y + (my.y === BOTTOM ? -tooltipHeight : my.y === CENTER ? -tooltipHeight / 2 : 0);

	// Use viewport adjustment plugin if enabled
	if(PLUGINS.viewport) {
		adjusted = position.adjusted = PLUGINS.viewport(
			this, position, posOptions, targetWidth, targetHeight, tooltipWidth, tooltipHeight
		);

		// Apply offsets supplied by positioning plugin (if used)
		if(offset && adjusted.left) { position.left += offset.left; }
		if(offset && adjusted.top) {  position.top += offset.top; }

		// Apply any new 'my' position
		if(adjusted.my) { this.position.my = adjusted.my; }
	}

	// Viewport adjustment is disabled, set values to zero
	else { position.adjusted = { left: 0, top: 0 }; }

	// Set tooltip position class if it's changed
	if(cache.posClass !== (newClass = this._createPosClass(this.position.my))) {
		cache.posClass = newClass;
		tooltip.removeClass(cache.posClass).addClass(newClass);
	}

	// tooltipmove event
	if(!this._trigger('move', [position, viewport.elem || viewport], event)) { return this; }
	delete position.adjusted;

	// If effect is disabled, target it mouse, no animation is defined or positioning gives NaN out, set CSS directly
	if(effect === FALSE || !visible || isNaN(position.left) || isNaN(position.top) || target === 'mouse' || !$.isFunction(posOptions.effect)) {
		tooltip.css(position);
	}

	// Use custom function if provided
	else if($.isFunction(posOptions.effect)) {
		posOptions.effect.call(tooltip, this, $.extend({}, position));
		tooltip.queue(function(next) {
			// Reset attributes to avoid cross-browser rendering bugs
			$(this).css({ opacity: '', height: '' });
			if(BROWSER.ie) { this.style.removeAttribute('filter'); }

			next();
		});
	}

	// Set positioning flag
	this.positioning = FALSE;

	return this;
};

// Custom (more correct for qTip!) offset calculator
PROTOTYPE.reposition.offset = function(elem, pos, container) {
	if(!container[0]) { return pos; }

	var ownerDocument = $(elem[0].ownerDocument),
		quirks = !!BROWSER.ie && document.compatMode !== 'CSS1Compat',
		parent = container[0],
		scrolled, position, parentOffset, overflow;

	function scroll(e, i) {
		pos.left += i * e.scrollLeft();
		pos.top += i * e.scrollTop();
	}

	// Compensate for non-static containers offset
	do {
		if((position = $.css(parent, 'position')) !== 'static') {
			if(position === 'fixed') {
				parentOffset = parent.getBoundingClientRect();
				scroll(ownerDocument, -1);
			}
			else {
				parentOffset = $(parent).position();
				parentOffset.left += parseFloat($.css(parent, 'borderLeftWidth')) || 0;
				parentOffset.top += parseFloat($.css(parent, 'borderTopWidth')) || 0;
			}

			pos.left -= parentOffset.left + (parseFloat($.css(parent, 'marginLeft')) || 0);
			pos.top -= parentOffset.top + (parseFloat($.css(parent, 'marginTop')) || 0);

			// If this is the first parent element with an overflow of "scroll" or "auto", store it
			if(!scrolled && (overflow = $.css(parent, 'overflow')) !== 'hidden' && overflow !== 'visible') { scrolled = $(parent); }
		}
	}
	while(parent = parent.offsetParent);

	// Compensate for containers scroll if it also has an offsetParent (or in IE quirks mode)
	if(scrolled && (scrolled[0] !== ownerDocument[0] || quirks)) {
		scroll(scrolled, 1);
	}

	return pos;
};

// Corner class
var C = (CORNER = PROTOTYPE.reposition.Corner = function(corner, forceY) {
	corner = ('' + corner).replace(/([A-Z])/, ' $1').replace(/middle/gi, CENTER).toLowerCase();
	this.x = (corner.match(/left|right/i) || corner.match(/center/) || ['inherit'])[0].toLowerCase();
	this.y = (corner.match(/top|bottom|center/i) || ['inherit'])[0].toLowerCase();
	this.forceY = !!forceY;

	var f = corner.charAt(0);
	this.precedance = f === 't' || f === 'b' ? Y : X;
}).prototype;

C.invert = function(z, center) {
	this[z] = this[z] === LEFT ? RIGHT : this[z] === RIGHT ? LEFT : center || this[z];
};

C.string = function(join) {
	var x = this.x, y = this.y;

	var result = x !== y ?
		x === 'center' || y !== 'center' && (this.precedance === Y || this.forceY) ? 
			[y,x] : 
			[x,y] :
		[x];

	return join !== false ? result.join(' ') : result;
};

C.abbrev = function() {
	var result = this.string(false);
	return result[0].charAt(0) + (result[1] && result[1].charAt(0) || '');
};

C.clone = function() {
	return new CORNER( this.string(), this.forceY );
};

;
PROTOTYPE.toggle = function(state, event) {
	var cache = this.cache,
		options = this.options,
		tooltip = this.tooltip;

	// Try to prevent flickering when tooltip overlaps show element
	if(event) {
		if((/over|enter/).test(event.type) && cache.event && (/out|leave/).test(cache.event.type) &&
			options.show.target.add(event.target).length === options.show.target.length &&
			tooltip.has(event.relatedTarget).length) {
			return this;
		}

		// Cache event
		cache.event = $.event.fix(event);
	}

	// If we're currently waiting and we've just hidden... stop it
	this.waiting && !state && (this.hiddenDuringWait = TRUE);

	// Render the tooltip if showing and it isn't already
	if(!this.rendered) { return state ? this.render(1) : this; }
	else if(this.destroyed || this.disabled) { return this; }

	var type = state ? 'show' : 'hide',
		opts = this.options[type],
		posOptions = this.options.position,
		contentOptions = this.options.content,
		width = this.tooltip.css('width'),
		visible = this.tooltip.is(':visible'),
		animate = state || opts.target.length === 1,
		sameTarget = !event || opts.target.length < 2 || cache.target[0] === event.target,
		identicalState, allow, after;

	// Detect state if valid one isn't provided
	if((typeof state).search('boolean|number')) { state = !visible; }

	// Check if the tooltip is in an identical state to the new would-be state
	identicalState = !tooltip.is(':animated') && visible === state && sameTarget;

	// Fire tooltip(show/hide) event and check if destroyed
	allow = !identicalState ? !!this._trigger(type, [90]) : NULL;

	// Check to make sure the tooltip wasn't destroyed in the callback
	if(this.destroyed) { return this; }

	// If the user didn't stop the method prematurely and we're showing the tooltip, focus it
	if(allow !== FALSE && state) { this.focus(event); }

	// If the state hasn't changed or the user stopped it, return early
	if(!allow || identicalState) { return this; }

	// Set ARIA hidden attribute
	$.attr(tooltip[0], 'aria-hidden', !!!state);

	// Execute state specific properties
	if(state) {
		// Store show origin coordinates
		this.mouse && (cache.origin = $.event.fix(this.mouse));

		// Update tooltip content & title if it's a dynamic function
		if($.isFunction(contentOptions.text)) { this._updateContent(contentOptions.text, FALSE); }
		if($.isFunction(contentOptions.title)) { this._updateTitle(contentOptions.title, FALSE); }

		// Cache mousemove events for positioning purposes (if not already tracking)
		if(!trackingBound && posOptions.target === 'mouse' && posOptions.adjust.mouse) {
			$(document).bind('mousemove.'+NAMESPACE, this._storeMouse);
			trackingBound = TRUE;
		}

		// Update the tooltip position (set width first to prevent viewport/max-width issues)
		if(!width) { tooltip.css('width', tooltip.outerWidth(FALSE)); }
		this.reposition(event, arguments[2]);
		if(!width) { tooltip.css('width', ''); }

		// Hide other tooltips if tooltip is solo
		if(!!opts.solo) {
			(typeof opts.solo === 'string' ? $(opts.solo) : $(SELECTOR, opts.solo))
				.not(tooltip).not(opts.target).qtip('hide', new $.Event('tooltipsolo'));
		}
	}
	else {
		// Clear show timer if we're hiding
		clearTimeout(this.timers.show);

		// Remove cached origin on hide
		delete cache.origin;

		// Remove mouse tracking event if not needed (all tracking qTips are hidden)
		if(trackingBound && !$(SELECTOR+'[tracking="true"]:visible', opts.solo).not(tooltip).length) {
			$(document).unbind('mousemove.'+NAMESPACE);
			trackingBound = FALSE;
		}

		// Blur the tooltip
		this.blur(event);
	}

	// Define post-animation, state specific properties
	after = $.proxy(function() {
		if(state) {
			// Prevent antialias from disappearing in IE by removing filter
			if(BROWSER.ie) { tooltip[0].style.removeAttribute('filter'); }

			// Remove overflow setting to prevent tip bugs
			tooltip.css('overflow', '');

			// Autofocus elements if enabled
			if('string' === typeof opts.autofocus) {
				$(this.options.show.autofocus, tooltip).focus();
			}

			// If set, hide tooltip when inactive for delay period
			this.options.show.target.trigger('qtip-'+this.id+'-inactive');
		}
		else {
			// Reset CSS states
			tooltip.css({
				display: '',
				visibility: '',
				opacity: '',
				left: '',
				top: ''
			});
		}

		// tooltipvisible/tooltiphidden events
		this._trigger(state ? 'visible' : 'hidden');
	}, this);

	// If no effect type is supplied, use a simple toggle
	if(opts.effect === FALSE || animate === FALSE) {
		tooltip[ type ]();
		after();
	}

	// Use custom function if provided
	else if($.isFunction(opts.effect)) {
		tooltip.stop(1, 1);
		opts.effect.call(tooltip, this);
		tooltip.queue('fx', function(n) {
			after(); n();
		});
	}

	// Use basic fade function by default
	else { tooltip.fadeTo(90, state ? 1 : 0, after); }

	// If inactive hide method is set, active it
	if(state) { opts.target.trigger('qtip-'+this.id+'-inactive'); }

	return this;
};

PROTOTYPE.show = function(event) { return this.toggle(TRUE, event); };

PROTOTYPE.hide = function(event) { return this.toggle(FALSE, event); };
;PROTOTYPE.focus = function(event) {
	if(!this.rendered || this.destroyed) { return this; }

	var qtips = $(SELECTOR),
		tooltip = this.tooltip,
		curIndex = parseInt(tooltip[0].style.zIndex, 10),
		newIndex = QTIP.zindex + qtips.length;

	// Only update the z-index if it has changed and tooltip is not already focused
	if(!tooltip.hasClass(CLASS_FOCUS)) {
		// tooltipfocus event
		if(this._trigger('focus', [newIndex], event)) {
			// Only update z-index's if they've changed
			if(curIndex !== newIndex) {
				// Reduce our z-index's and keep them properly ordered
				qtips.each(function() {
					if(this.style.zIndex > curIndex) {
						this.style.zIndex = this.style.zIndex - 1;
					}
				});

				// Fire blur event for focused tooltip
				qtips.filter('.' + CLASS_FOCUS).qtip('blur', event);
			}

			// Set the new z-index
			tooltip.addClass(CLASS_FOCUS)[0].style.zIndex = newIndex;
		}
	}

	return this;
};

PROTOTYPE.blur = function(event) {
	if(!this.rendered || this.destroyed) { return this; }

	// Set focused status to FALSE
	this.tooltip.removeClass(CLASS_FOCUS);

	// tooltipblur event
	this._trigger('blur', [ this.tooltip.css('zIndex') ], event);

	return this;
};
;PROTOTYPE.disable = function(state) {
	if(this.destroyed) { return this; }

	// If 'toggle' is passed, toggle the current state
	if(state === 'toggle') {
		state = !(this.rendered ? this.tooltip.hasClass(CLASS_DISABLED) : this.disabled);
	}

	// Disable if no state passed
	else if('boolean' !== typeof state) {
		state = TRUE;
	}

	if(this.rendered) {
		this.tooltip.toggleClass(CLASS_DISABLED, state)
			.attr('aria-disabled', state);
	}

	this.disabled = !!state;

	return this;
};

PROTOTYPE.enable = function() { return this.disable(FALSE); };
;PROTOTYPE._createButton = function()
{
	var self = this,
		elements = this.elements,
		tooltip = elements.tooltip,
		button = this.options.content.button,
		isString = typeof button === 'string',
		close = isString ? button : 'Close tooltip';

	if(elements.button) { elements.button.remove(); }

	// Use custom button if one was supplied by user, else use default
	if(button.jquery) {
		elements.button = button;
	}
	else {
		elements.button = $('<a />', {
			'class': 'qtip-close ' + (this.options.style.widget ? '' : NAMESPACE+'-icon'),
			'title': close,
			'aria-label': close
		})
		.prepend(
			$('<span />', {
				'class': 'ui-icon ui-icon-close',
				'html': '&times;'
			})
		);
	}

	// Create button and setup attributes
	elements.button.appendTo(elements.titlebar || tooltip)
		.attr('role', 'button')
		.click(function(event) {
			if(!tooltip.hasClass(CLASS_DISABLED)) { self.hide(event); }
			return FALSE;
		});
};

PROTOTYPE._updateButton = function(button)
{
	// Make sure tooltip is rendered and if not, return
	if(!this.rendered) { return FALSE; }

	var elem = this.elements.button;
	if(button) { this._createButton(); }
	else { elem.remove(); }
};
;// Widget class creator
function createWidgetClass(cls) {
	return WIDGET.concat('').join(cls ? '-'+cls+' ' : ' ');
}

// Widget class setter method
PROTOTYPE._setWidget = function()
{
	var on = this.options.style.widget,
		elements = this.elements,
		tooltip = elements.tooltip,
		disabled = tooltip.hasClass(CLASS_DISABLED);

	tooltip.removeClass(CLASS_DISABLED);
	CLASS_DISABLED = on ? 'ui-state-disabled' : 'qtip-disabled';
	tooltip.toggleClass(CLASS_DISABLED, disabled);

	tooltip.toggleClass('ui-helper-reset '+createWidgetClass(), on).toggleClass(CLASS_DEFAULT, this.options.style.def && !on);

	if(elements.content) {
		elements.content.toggleClass( createWidgetClass('content'), on);
	}
	if(elements.titlebar) {
		elements.titlebar.toggleClass( createWidgetClass('header'), on);
	}
	if(elements.button) {
		elements.button.toggleClass(NAMESPACE+'-icon', !on);
	}
};
;function delay(callback, duration) {
	// If tooltip has displayed, start hide timer
	if(duration > 0) {
		return setTimeout(
			$.proxy(callback, this), duration
		);
	}
	else{ callback.call(this); }
}

function showMethod(event) {
	if(this.tooltip.hasClass(CLASS_DISABLED)) { return; }

	// Clear hide timers
	clearTimeout(this.timers.show);
	clearTimeout(this.timers.hide);

	// Start show timer
	this.timers.show = delay.call(this,
		function() { this.toggle(TRUE, event); },
		this.options.show.delay
	);
}

function hideMethod(event) {
	if(this.tooltip.hasClass(CLASS_DISABLED) || this.destroyed) { return; }

	// Check if new target was actually the tooltip element
	var relatedTarget = $(event.relatedTarget),
		ontoTooltip = relatedTarget.closest(SELECTOR)[0] === this.tooltip[0],
		ontoTarget = relatedTarget[0] === this.options.show.target[0];

	// Clear timers and stop animation queue
	clearTimeout(this.timers.show);
	clearTimeout(this.timers.hide);

	// Prevent hiding if tooltip is fixed and event target is the tooltip.
	// Or if mouse positioning is enabled and cursor momentarily overlaps
	if(this !== relatedTarget[0] &&
		(this.options.position.target === 'mouse' && ontoTooltip) ||
		this.options.hide.fixed && (
			(/mouse(out|leave|move)/).test(event.type) && (ontoTooltip || ontoTarget))
		)
	{
		/* eslint-disable no-empty */
		try {
			event.preventDefault();
			event.stopImmediatePropagation();
		} catch(e) {}
		/* eslint-enable no-empty */

		return;
	}

	// If tooltip has displayed, start hide timer
	this.timers.hide = delay.call(this,
		function() { this.toggle(FALSE, event); },
		this.options.hide.delay,
		this
	);
}

function inactiveMethod(event) {
	if(this.tooltip.hasClass(CLASS_DISABLED) || !this.options.hide.inactive) { return; }

	// Clear timer
	clearTimeout(this.timers.inactive);

	this.timers.inactive = delay.call(this,
		function(){ this.hide(event); },
		this.options.hide.inactive
	);
}

function repositionMethod(event) {
	if(this.rendered && this.tooltip[0].offsetWidth > 0) { this.reposition(event); }
}

// Store mouse coordinates
PROTOTYPE._storeMouse = function(event) {
	(this.mouse = $.event.fix(event)).type = 'mousemove';
	return this;
};

// Bind events
PROTOTYPE._bind = function(targets, events, method, suffix, context) {
	if(!targets || !method || !events.length) { return; }
	var ns = '.' + this._id + (suffix ? '-'+suffix : '');
	$(targets).bind(
		(events.split ? events : events.join(ns + ' ')) + ns,
		$.proxy(method, context || this)
	);
	return this;
};
PROTOTYPE._unbind = function(targets, suffix) {
	targets && $(targets).unbind('.' + this._id + (suffix ? '-'+suffix : ''));
	return this;
};

// Global delegation helper
function delegate(selector, events, method) {
	$(document.body).delegate(selector,
		(events.split ? events : events.join('.'+NAMESPACE + ' ')) + '.'+NAMESPACE,
		function() {
			var api = QTIP.api[ $.attr(this, ATTR_ID) ];
			api && !api.disabled && method.apply(api, arguments);
		}
	);
}
// Event trigger
PROTOTYPE._trigger = function(type, args, event) {
	var callback = new $.Event('tooltip'+type);
	callback.originalEvent = event && $.extend({}, event) || this.cache.event || NULL;

	this.triggering = type;
	this.tooltip.trigger(callback, [this].concat(args || []));
	this.triggering = FALSE;

	return !callback.isDefaultPrevented();
};

PROTOTYPE._bindEvents = function(showEvents, hideEvents, showTargets, hideTargets, showCallback, hideCallback) {
	// Get tasrgets that lye within both
	var similarTargets = showTargets.filter( hideTargets ).add( hideTargets.filter(showTargets) ),
		toggleEvents = [];

	// If hide and show targets are the same...
	if(similarTargets.length) {

		// Filter identical show/hide events
		$.each(hideEvents, function(i, type) {
			var showIndex = $.inArray(type, showEvents);

			// Both events are identical, remove from both hide and show events
			// and append to toggleEvents
			showIndex > -1 && toggleEvents.push( showEvents.splice( showIndex, 1 )[0] );
		});

		// Toggle events are special case of identical show/hide events, which happen in sequence
		if(toggleEvents.length) {
			// Bind toggle events to the similar targets
			this._bind(similarTargets, toggleEvents, function(event) {
				var state = this.rendered ? this.tooltip[0].offsetWidth > 0 : false;
				(state ? hideCallback : showCallback).call(this, event);
			});

			// Remove the similar targets from the regular show/hide bindings
			showTargets = showTargets.not(similarTargets);
			hideTargets = hideTargets.not(similarTargets);
		}
	}

	// Apply show/hide/toggle events
	this._bind(showTargets, showEvents, showCallback);
	this._bind(hideTargets, hideEvents, hideCallback);
};

PROTOTYPE._assignInitialEvents = function(event) {
	var options = this.options,
		showTarget = options.show.target,
		hideTarget = options.hide.target,
		showEvents = options.show.event ? $.trim('' + options.show.event).split(' ') : [],
		hideEvents = options.hide.event ? $.trim('' + options.hide.event).split(' ') : [];

	// Catch remove/removeqtip events on target element to destroy redundant tooltips
	this._bind(this.elements.target, ['remove', 'removeqtip'], function() {
		this.destroy(true);
	}, 'destroy');

	/*
	 * Make sure hoverIntent functions properly by using mouseleave as a hide event if
	 * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
	 */
	if(/mouse(over|enter)/i.test(options.show.event) && !/mouse(out|leave)/i.test(options.hide.event)) {
		hideEvents.push('mouseleave');
	}

	/*
	 * Also make sure initial mouse targetting works correctly by caching mousemove coords
	 * on show targets before the tooltip has rendered. Also set onTarget when triggered to
	 * keep mouse tracking working.
	 */
	this._bind(showTarget, 'mousemove', function(moveEvent) {
		this._storeMouse(moveEvent);
		this.cache.onTarget = TRUE;
	});

	// Define hoverIntent function
	function hoverIntent(hoverEvent) {
		// Only continue if tooltip isn't disabled
		if(this.disabled || this.destroyed) { return FALSE; }

		// Cache the event data
		this.cache.event = hoverEvent && $.event.fix(hoverEvent);
		this.cache.target = hoverEvent && $(hoverEvent.target);

		// Start the event sequence
		clearTimeout(this.timers.show);
		this.timers.show = delay.call(this,
			function() { this.render(typeof hoverEvent === 'object' || options.show.ready); },
			options.prerender ? 0 : options.show.delay
		);
	}

	// Filter and bind events
	this._bindEvents(showEvents, hideEvents, showTarget, hideTarget, hoverIntent, function() {
		if(!this.timers) { return FALSE; }
		clearTimeout(this.timers.show);
	});

	// Prerendering is enabled, create tooltip now
	if(options.show.ready || options.prerender) { hoverIntent.call(this, event); }
};

// Event assignment method
PROTOTYPE._assignEvents = function() {
	var self = this,
		options = this.options,
		posOptions = options.position,

		tooltip = this.tooltip,
		showTarget = options.show.target,
		hideTarget = options.hide.target,
		containerTarget = posOptions.container,
		viewportTarget = posOptions.viewport,
		documentTarget = $(document),
		windowTarget = $(window),

		showEvents = options.show.event ? $.trim('' + options.show.event).split(' ') : [],
		hideEvents = options.hide.event ? $.trim('' + options.hide.event).split(' ') : [];


	// Assign passed event callbacks
	$.each(options.events, function(name, callback) {
		self._bind(tooltip, name === 'toggle' ? ['tooltipshow','tooltiphide'] : ['tooltip'+name], callback, null, tooltip);
	});

	// Hide tooltips when leaving current window/frame (but not select/option elements)
	if(/mouse(out|leave)/i.test(options.hide.event) && options.hide.leave === 'window') {
		this._bind(documentTarget, ['mouseout', 'blur'], function(event) {
			if(!/select|option/.test(event.target.nodeName) && !event.relatedTarget) {
				this.hide(event);
			}
		});
	}

	// Enable hide.fixed by adding appropriate class
	if(options.hide.fixed) {
		hideTarget = hideTarget.add( tooltip.addClass(CLASS_FIXED) );
	}

	/*
	 * Make sure hoverIntent functions properly by using mouseleave to clear show timer if
	 * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
	 */
	else if(/mouse(over|enter)/i.test(options.show.event)) {
		this._bind(hideTarget, 'mouseleave', function() {
			clearTimeout(this.timers.show);
		});
	}

	// Hide tooltip on document mousedown if unfocus events are enabled
	if(('' + options.hide.event).indexOf('unfocus') > -1) {
		this._bind(containerTarget.closest('html'), ['mousedown', 'touchstart'], function(event) {
			var elem = $(event.target),
				enabled = this.rendered && !this.tooltip.hasClass(CLASS_DISABLED) && this.tooltip[0].offsetWidth > 0,
				isAncestor = elem.parents(SELECTOR).filter(this.tooltip[0]).length > 0;

			if(elem[0] !== this.target[0] && elem[0] !== this.tooltip[0] && !isAncestor &&
				!this.target.has(elem[0]).length && enabled
			) {
				this.hide(event);
			}
		});
	}

	// Check if the tooltip hides when inactive
	if('number' === typeof options.hide.inactive) {
		// Bind inactive method to show target(s) as a custom event
		this._bind(showTarget, 'qtip-'+this.id+'-inactive', inactiveMethod, 'inactive');

		// Define events which reset the 'inactive' event handler
		this._bind(hideTarget.add(tooltip), QTIP.inactiveEvents, inactiveMethod);
	}

	// Filter and bind events
	this._bindEvents(showEvents, hideEvents, showTarget, hideTarget, showMethod, hideMethod);

	// Mouse movement bindings
	this._bind(showTarget.add(tooltip), 'mousemove', function(event) {
		// Check if the tooltip hides when mouse is moved a certain distance
		if('number' === typeof options.hide.distance) {
			var origin = this.cache.origin || {},
				limit = this.options.hide.distance,
				abs = Math.abs;

			// Check if the movement has gone beyond the limit, and hide it if so
			if(abs(event.pageX - origin.pageX) >= limit || abs(event.pageY - origin.pageY) >= limit) {
				this.hide(event);
			}
		}

		// Cache mousemove coords on show targets
		this._storeMouse(event);
	});

	// Mouse positioning events
	if(posOptions.target === 'mouse') {
		// If mouse adjustment is on...
		if(posOptions.adjust.mouse) {
			// Apply a mouseleave event so we don't get problems with overlapping
			if(options.hide.event) {
				// Track if we're on the target or not
				this._bind(showTarget, ['mouseenter', 'mouseleave'], function(event) {
					if(!this.cache) {return FALSE; }
					this.cache.onTarget = event.type === 'mouseenter';
				});
			}

			// Update tooltip position on mousemove
			this._bind(documentTarget, 'mousemove', function(event) {
				// Update the tooltip position only if the tooltip is visible and adjustment is enabled
				if(this.rendered && this.cache.onTarget && !this.tooltip.hasClass(CLASS_DISABLED) && this.tooltip[0].offsetWidth > 0) {
					this.reposition(event);
				}
			});
		}
	}

	// Adjust positions of the tooltip on window resize if enabled
	if(posOptions.adjust.resize || viewportTarget.length) {
		this._bind( $.event.special.resize ? viewportTarget : windowTarget, 'resize', repositionMethod );
	}

	// Adjust tooltip position on scroll of the window or viewport element if present
	if(posOptions.adjust.scroll) {
		this._bind( windowTarget.add(posOptions.container), 'scroll', repositionMethod );
	}
};

// Un-assignment method
PROTOTYPE._unassignEvents = function() {
	var options = this.options,
		showTargets = options.show.target,
		hideTargets = options.hide.target,
		targets = $.grep([
			this.elements.target[0],
			this.rendered && this.tooltip[0],
			options.position.container[0],
			options.position.viewport[0],
			options.position.container.closest('html')[0], // unfocus
			window,
			document
		], function(i) {
			return typeof i === 'object';
		});

	// Add show and hide targets if they're valid
	if(showTargets && showTargets.toArray) {
		targets = targets.concat(showTargets.toArray());
	}
	if(hideTargets && hideTargets.toArray) {
		targets = targets.concat(hideTargets.toArray());
	}

	// Unbind the events
	this._unbind(targets)
		._unbind(targets, 'destroy')
		._unbind(targets, 'inactive');
};

// Apply common event handlers using delegate (avoids excessive .bind calls!)
$(function() {
	delegate(SELECTOR, ['mouseenter', 'mouseleave'], function(event) {
		var state = event.type === 'mouseenter',
			tooltip = $(event.currentTarget),
			target = $(event.relatedTarget || event.target),
			options = this.options;

		// On mouseenter...
		if(state) {
			// Focus the tooltip on mouseenter (z-index stacking)
			this.focus(event);

			// Clear hide timer on tooltip hover to prevent it from closing
			tooltip.hasClass(CLASS_FIXED) && !tooltip.hasClass(CLASS_DISABLED) && clearTimeout(this.timers.hide);
		}

		// On mouseleave...
		else {
			// When mouse tracking is enabled, hide when we leave the tooltip and not onto the show target (if a hide event is set)
			if(options.position.target === 'mouse' && options.position.adjust.mouse &&
				options.hide.event && options.show.target && !target.closest(options.show.target[0]).length) {
				this.hide(event);
			}
		}

		// Add hover class
		tooltip.toggleClass(CLASS_HOVER, state);
	});

	// Define events which reset the 'inactive' event handler
	delegate('['+ATTR_ID+']', INACTIVE_EVENTS, inactiveMethod);
});
;// Initialization method
function init(elem, id, opts) {
	var obj, posOptions, attr, config, title,

	// Setup element references
	docBody = $(document.body),

	// Use document body instead of document element if needed
	newTarget = elem[0] === document ? docBody : elem,

	// Grab metadata from element if plugin is present
	metadata = elem.metadata ? elem.metadata(opts.metadata) : NULL,

	// If metadata type if HTML5, grab 'name' from the object instead, or use the regular data object otherwise
	metadata5 = opts.metadata.type === 'html5' && metadata ? metadata[opts.metadata.name] : NULL,

	// Grab data from metadata.name (or data-qtipopts as fallback) using .data() method,
	html5 = elem.data(opts.metadata.name || 'qtipopts');

	// If we don't get an object returned attempt to parse it manualyl without parseJSON
	/* eslint-disable no-empty */
	try { html5 = typeof html5 === 'string' ? $.parseJSON(html5) : html5; }
	catch(e) {}
	/* eslint-enable no-empty */

	// Merge in and sanitize metadata
	config = $.extend(TRUE, {}, QTIP.defaults, opts,
		typeof html5 === 'object' ? sanitizeOptions(html5) : NULL,
		sanitizeOptions(metadata5 || metadata));

	// Re-grab our positioning options now we've merged our metadata and set id to passed value
	posOptions = config.position;
	config.id = id;

	// Setup missing content if none is detected
	if('boolean' === typeof config.content.text) {
		attr = elem.attr(config.content.attr);

		// Grab from supplied attribute if available
		if(config.content.attr !== FALSE && attr) { config.content.text = attr; }

		// No valid content was found, abort render
		else { return FALSE; }
	}

	// Setup target options
	if(!posOptions.container.length) { posOptions.container = docBody; }
	if(posOptions.target === FALSE) { posOptions.target = newTarget; }
	if(config.show.target === FALSE) { config.show.target = newTarget; }
	if(config.show.solo === TRUE) { config.show.solo = posOptions.container.closest('body'); }
	if(config.hide.target === FALSE) { config.hide.target = newTarget; }
	if(config.position.viewport === TRUE) { config.position.viewport = posOptions.container; }

	// Ensure we only use a single container
	posOptions.container = posOptions.container.eq(0);

	// Convert position corner values into x and y strings
	posOptions.at = new CORNER(posOptions.at, TRUE);
	posOptions.my = new CORNER(posOptions.my);

	// Destroy previous tooltip if overwrite is enabled, or skip element if not
	if(elem.data(NAMESPACE)) {
		if(config.overwrite) {
			elem.qtip('destroy', true);
		}
		else if(config.overwrite === FALSE) {
			return FALSE;
		}
	}

	// Add has-qtip attribute
	elem.attr(ATTR_HAS, id);

	// Remove title attribute and store it if present
	if(config.suppress && (title = elem.attr('title'))) {
		// Final attr call fixes event delegatiom and IE default tooltip showing problem
		elem.removeAttr('title').attr(oldtitle, title).attr('title', '');
	}

	// Initialize the tooltip and add API reference
	obj = new QTip(elem, config, id, !!attr);
	elem.data(NAMESPACE, obj);

	return obj;
}

// jQuery $.fn extension method
QTIP = $.fn.qtip = function(options, notation, newValue)
{
	var command = ('' + options).toLowerCase(), // Parse command
		returned = NULL,
		args = $.makeArray(arguments).slice(1),
		event = args[args.length - 1],
		opts = this[0] ? $.data(this[0], NAMESPACE) : NULL;

	// Check for API request
	if(!arguments.length && opts || command === 'api') {
		return opts;
	}

	// Execute API command if present
	else if('string' === typeof options) {
		this.each(function() {
			var api = $.data(this, NAMESPACE);
			if(!api) { return TRUE; }

			// Cache the event if possible
			if(event && event.timeStamp) { api.cache.event = event; }

			// Check for specific API commands
			if(notation && (command === 'option' || command === 'options')) {
				if(newValue !== undefined || $.isPlainObject(notation)) {
					api.set(notation, newValue);
				}
				else {
					returned = api.get(notation);
					return FALSE;
				}
			}

			// Execute API command
			else if(api[command]) {
				api[command].apply(api, args);
			}
		});

		return returned !== NULL ? returned : this;
	}

	// No API commands. validate provided options and setup qTips
	else if('object' === typeof options || !arguments.length) {
		// Sanitize options first
		opts = sanitizeOptions($.extend(TRUE, {}, options));

		return this.each(function(i) {
			var api, id;

			// Find next available ID, or use custom ID if provided
			id = $.isArray(opts.id) ? opts.id[i] : opts.id;
			id = !id || id === FALSE || id.length < 1 || QTIP.api[id] ? QTIP.nextid++ : id;

			// Initialize the qTip and re-grab newly sanitized options
			api = init($(this), id, opts);
			if(api === FALSE) { return TRUE; }
			else { QTIP.api[id] = api; }

			// Initialize plugins
			$.each(PLUGINS, function() {
				if(this.initialize === 'initialize') { this(api); }
			});

			// Assign initial pre-render events
			api._assignInitialEvents(event);
		});
	}
};

// Expose class
$.qtip = QTip;

// Populated in render method
QTIP.api = {};
;$.each({
	/* Allow other plugins to successfully retrieve the title of an element with a qTip applied */
	attr: function(attr, val) {
		if(this.length) {
			var self = this[0],
				title = 'title',
				api = $.data(self, 'qtip');

			if(attr === title && api && api.options && 'object' === typeof api && 'object' === typeof api.options && api.options.suppress) {
				if(arguments.length < 2) {
					return $.attr(self, oldtitle);
				}

				// If qTip is rendered and title was originally used as content, update it
				if(api && api.options.content.attr === title && api.cache.attr) {
					api.set('content.text', val);
				}

				// Use the regular attr method to set, then cache the result
				return this.attr(oldtitle, val);
			}
		}

		return $.fn['attr'+replaceSuffix].apply(this, arguments);
	},

	/* Allow clone to correctly retrieve cached title attributes */
	clone: function(keepData) {
		// Clone our element using the real clone method
		var elems = $.fn['clone'+replaceSuffix].apply(this, arguments);

		// Grab all elements with an oldtitle set, and change it to regular title attribute, if keepData is false
		if(!keepData) {
			elems.filter('['+oldtitle+']').attr('title', function() {
				return $.attr(this, oldtitle);
			})
			.removeAttr(oldtitle);
		}

		return elems;
	}
}, function(name, func) {
	if(!func || $.fn[name+replaceSuffix]) { return TRUE; }

	var old = $.fn[name+replaceSuffix] = $.fn[name];
	$.fn[name] = function() {
		return func.apply(this, arguments) || old.apply(this, arguments);
	};
});

/* Fire off 'removeqtip' handler in $.cleanData if jQuery UI not present (it already does similar).
 * This snippet is taken directly from jQuery UI source code found here:
 *     http://code.jquery.com/ui/jquery-ui-git.js
 */
if(!$.ui) {
	$['cleanData'+replaceSuffix] = $.cleanData;
	$.cleanData = function( elems ) {
		for(var i = 0, elem; (elem = $( elems[i] )).length; i++) {
			if(elem.attr(ATTR_HAS)) {
				/* eslint-disable no-empty */
				try { elem.triggerHandler('removeqtip'); }
				catch( e ) {}
				/* eslint-enable no-empty */
			}
		}
		$['cleanData'+replaceSuffix].apply(this, arguments);
	};
}
;// qTip version
QTIP.version = '3.0.3';

// Base ID for all qTips
QTIP.nextid = 0;

// Inactive events array
QTIP.inactiveEvents = INACTIVE_EVENTS;

// Base z-index for all qTips
QTIP.zindex = 15000;

// Define configuration defaults
QTIP.defaults = {
	prerender: FALSE,
	id: FALSE,
	overwrite: TRUE,
	suppress: TRUE,
	content: {
		text: TRUE,
		attr: 'title',
		title: FALSE,
		button: FALSE
	},
	position: {
		my: 'top left',
		at: 'bottom right',
		target: FALSE,
		container: FALSE,
		viewport: FALSE,
		adjust: {
			x: 0, y: 0,
			mouse: TRUE,
			scroll: TRUE,
			resize: TRUE,
			method: 'flipinvert flipinvert'
		},
		effect: function(api, pos) {
			$(this).animate(pos, {
				duration: 200,
				queue: FALSE
			});
		}
	},
	show: {
		target: FALSE,
		event: 'mouseenter',
		effect: TRUE,
		delay: 90,
		solo: FALSE,
		ready: FALSE,
		autofocus: FALSE
	},
	hide: {
		target: FALSE,
		event: 'mouseleave',
		effect: TRUE,
		delay: 0,
		fixed: FALSE,
		inactive: FALSE,
		leave: 'window',
		distance: FALSE
	},
	style: {
		classes: '',
		widget: FALSE,
		width: FALSE,
		height: FALSE,
		def: TRUE
	},
	events: {
		render: NULL,
		move: NULL,
		show: NULL,
		hide: NULL,
		toggle: NULL,
		visible: NULL,
		hidden: NULL,
		focus: NULL,
		blur: NULL
	}
};
;var TIP,
createVML,
SCALE,
PIXEL_RATIO,
BACKING_STORE_RATIO,

// Common CSS strings
MARGIN = 'margin',
BORDER = 'border',
COLOR = 'color',
BG_COLOR = 'background-color',
TRANSPARENT = 'transparent',
IMPORTANT = ' !important',

// Check if the browser supports <canvas/> elements
HASCANVAS = !!document.createElement('canvas').getContext,

// Invalid colour values used in parseColours()
INVALID = /rgba?\(0, 0, 0(, 0)?\)|transparent|#123456/i;

// Camel-case method, taken from jQuery source
// http://code.jquery.com/jquery-1.8.0.js
function camel(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/*
 * Modified from Modernizr's testPropsAll()
 * http://modernizr.com/downloads/modernizr-latest.js
 */
var cssProps = {}, cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'];
function vendorCss(elem, prop) {
	var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
		props = (prop + ' ' + cssPrefixes.join(ucProp + ' ') + ucProp).split(' '),
		cur, val, i = 0;

	// If the property has already been mapped...
	if(cssProps[prop]) { return elem.css(cssProps[prop]); }

	while(cur = props[i++]) {
		if((val = elem.css(cur)) !== undefined) {
			cssProps[prop] = cur;
			return val;
		}
	}
}

// Parse a given elements CSS property into an int
function intCss(elem, prop) {
	return Math.ceil(parseFloat(vendorCss(elem, prop)));
}


// VML creation (for IE only)
if(!HASCANVAS) {
	createVML = function(tag, props, style) {
		return '<qtipvml:'+tag+' xmlns="urn:schemas-microsoft.com:vml" class="qtip-vml" '+(props||'')+
			' style="behavior: url(#default#VML); '+(style||'')+ '" />';
	};
}

// Canvas only definitions
else {
	PIXEL_RATIO = window.devicePixelRatio || 1;
	BACKING_STORE_RATIO = (function() {
		var context = document.createElement('canvas').getContext('2d');
		return context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio ||
				context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || 1;
	})();
	SCALE = PIXEL_RATIO / BACKING_STORE_RATIO;
}


function Tip(qtip, options) {
	this._ns = 'tip';
	this.options = options;
	this.offset = options.offset;
	this.size = [ options.width, options.height ];

	// Initialize
	this.qtip = qtip;
	this.init(qtip);
}

$.extend(Tip.prototype, {
	init: function(qtip) {
		var context, tip;

		// Create tip element and prepend to the tooltip
		tip = this.element = qtip.elements.tip = $('<div />', { 'class': NAMESPACE+'-tip' }).prependTo(qtip.tooltip);

		// Create tip drawing element(s)
		if(HASCANVAS) {
			// save() as soon as we create the canvas element so FF2 doesn't bork on our first restore()!
			context = $('<canvas />').appendTo(this.element)[0].getContext('2d');

			// Setup constant parameters
			context.lineJoin = 'miter';
			context.miterLimit = 100000;
			context.save();
		}
		else {
			context = createVML('shape', 'coordorigin="0,0"', 'position:absolute;');
			this.element.html(context + context);

			// Prevent mousing down on the tip since it causes problems with .live() handling in IE due to VML
			qtip._bind( $('*', tip).add(tip), ['click', 'mousedown'], function(event) { event.stopPropagation(); }, this._ns);
		}

		// Bind update events
		qtip._bind(qtip.tooltip, 'tooltipmove', this.reposition, this._ns, this);

		// Create it
		this.create();
	},

	_swapDimensions: function() {
		this.size[0] = this.options.height;
		this.size[1] = this.options.width;
	},
	_resetDimensions: function() {
		this.size[0] = this.options.width;
		this.size[1] = this.options.height;
	},

	_useTitle: function(corner) {
		var titlebar = this.qtip.elements.titlebar;
		return titlebar && (
			corner.y === TOP || corner.y === CENTER && this.element.position().top + this.size[1] / 2 + this.options.offset < titlebar.outerHeight(TRUE)
		);
	},

	_parseCorner: function(corner) {
		var my = this.qtip.options.position.my;

		// Detect corner and mimic properties
		if(corner === FALSE || my === FALSE) {
			corner = FALSE;
		}
		else if(corner === TRUE) {
			corner = new CORNER( my.string() );
		}
		else if(!corner.string) {
			corner = new CORNER(corner);
			corner.fixed = TRUE;
		}

		return corner;
	},

	_parseWidth: function(corner, side, use) {
		var elements = this.qtip.elements,
			prop = BORDER + camel(side) + 'Width';

		return (use ? intCss(use, prop) : 
			intCss(elements.content, prop) ||
			intCss(this._useTitle(corner) && elements.titlebar || elements.content, prop) ||
			intCss(elements.tooltip, prop)
		) || 0;
	},

	_parseRadius: function(corner) {
		var elements = this.qtip.elements,
			prop = BORDER + camel(corner.y) + camel(corner.x) + 'Radius';

		return BROWSER.ie < 9 ? 0 :
			intCss(this._useTitle(corner) && elements.titlebar || elements.content, prop) ||
			intCss(elements.tooltip, prop) || 0;
	},

	_invalidColour: function(elem, prop, compare) {
		var val = elem.css(prop);
		return !val || compare && val === elem.css(compare) || INVALID.test(val) ? FALSE : val;
	},

	_parseColours: function(corner) {
		var elements = this.qtip.elements,
			tip = this.element.css('cssText', ''),
			borderSide = BORDER + camel(corner[ corner.precedance ]) + camel(COLOR),
			colorElem = this._useTitle(corner) && elements.titlebar || elements.content,
			css = this._invalidColour, color = [];

		// Attempt to detect the background colour from various elements, left-to-right precedance
		color[0] = css(tip, BG_COLOR) || css(colorElem, BG_COLOR) || css(elements.content, BG_COLOR) ||
			css(elements.tooltip, BG_COLOR) || tip.css(BG_COLOR);

		// Attempt to detect the correct border side colour from various elements, left-to-right precedance
		color[1] = css(tip, borderSide, COLOR) || css(colorElem, borderSide, COLOR) ||
			css(elements.content, borderSide, COLOR) || css(elements.tooltip, borderSide, COLOR) || elements.tooltip.css(borderSide);

		// Reset background and border colours
		$('*', tip).add(tip).css('cssText', BG_COLOR+':'+TRANSPARENT+IMPORTANT+';'+BORDER+':0'+IMPORTANT+';');

		return color;
	},

	_calculateSize: function(corner) {
		var y = corner.precedance === Y,
			width = this.options.width,
			height = this.options.height,
			isCenter = corner.abbrev() === 'c',
			base = (y ? width: height) * (isCenter ? 0.5 : 1),
			pow = Math.pow,
			round = Math.round,
			bigHyp, ratio, result,

		smallHyp = Math.sqrt( pow(base, 2) + pow(height, 2) ),
		hyp = [
			this.border / base * smallHyp,
			this.border / height * smallHyp
		];

		hyp[2] = Math.sqrt( pow(hyp[0], 2) - pow(this.border, 2) );
		hyp[3] = Math.sqrt( pow(hyp[1], 2) - pow(this.border, 2) );

		bigHyp = smallHyp + hyp[2] + hyp[3] + (isCenter ? 0 : hyp[0]);
		ratio = bigHyp / smallHyp;

		result = [ round(ratio * width), round(ratio * height) ];
		return y ? result : result.reverse();
	},

	// Tip coordinates calculator
	_calculateTip: function(corner, size, scale) {
		scale = scale || 1;
		size = size || this.size;

		var width = size[0] * scale,
			height = size[1] * scale,
			width2 = Math.ceil(width / 2), height2 = Math.ceil(height / 2),

		// Define tip coordinates in terms of height and width values
		tips = {
			br:	[0,0,		width,height,	width,0],
			bl:	[0,0,		width,0,		0,height],
			tr:	[0,height,	width,0,		width,height],
			tl:	[0,0,		0,height,		width,height],
			tc:	[0,height,	width2,0,		width,height],
			bc:	[0,0,		width,0,		width2,height],
			rc:	[0,0,		width,height2,	0,height],
			lc:	[width,0,	width,height,	0,height2]
		};

		// Set common side shapes
		tips.lt = tips.br; tips.rt = tips.bl;
		tips.lb = tips.tr; tips.rb = tips.tl;

		return tips[ corner.abbrev() ];
	},

	// Tip coordinates drawer (canvas)
	_drawCoords: function(context, coords) {
		context.beginPath();
		context.moveTo(coords[0], coords[1]);
		context.lineTo(coords[2], coords[3]);
		context.lineTo(coords[4], coords[5]);
		context.closePath();
	},

	create: function() {
		// Determine tip corner
		var c = this.corner = (HASCANVAS || BROWSER.ie) && this._parseCorner(this.options.corner);

		// If we have a tip corner...
		this.enabled = !!this.corner && this.corner.abbrev() !== 'c';
		if(this.enabled) {
			// Cache it
			this.qtip.cache.corner = c.clone();

			// Create it
			this.update();
		}

		// Toggle tip element
		this.element.toggle(this.enabled);

		return this.corner;
	},

	update: function(corner, position) {
		if(!this.enabled) { return this; }

		var elements = this.qtip.elements,
			tip = this.element,
			inner = tip.children(),
			options = this.options,
			curSize = this.size,
			mimic = options.mimic,
			round = Math.round,
			color, precedance, context,
			coords, bigCoords, translate, newSize, border;

		// Re-determine tip if not already set
		if(!corner) { corner = this.qtip.cache.corner || this.corner; }

		// Use corner property if we detect an invalid mimic value
		if(mimic === FALSE) { mimic = corner; }

		// Otherwise inherit mimic properties from the corner object as necessary
		else {
			mimic = new CORNER(mimic);
			mimic.precedance = corner.precedance;

			if(mimic.x === 'inherit') { mimic.x = corner.x; }
			else if(mimic.y === 'inherit') { mimic.y = corner.y; }
			else if(mimic.x === mimic.y) {
				mimic[ corner.precedance ] = corner[ corner.precedance ];
			}
		}
		precedance = mimic.precedance;

		// Ensure the tip width.height are relative to the tip position
		if(corner.precedance === X) { this._swapDimensions(); }
		else { this._resetDimensions(); }

		// Update our colours
		color = this.color = this._parseColours(corner);

		// Detect border width, taking into account colours
		if(color[1] !== TRANSPARENT) {
			// Grab border width
			border = this.border = this._parseWidth(corner, corner[corner.precedance]);

			// If border width isn't zero, use border color as fill if it's not invalid (1.0 style tips)
			if(options.border && border < 1 && !INVALID.test(color[1])) { color[0] = color[1]; }

			// Set border width (use detected border width if options.border is true)
			this.border = border = options.border !== TRUE ? options.border : border;
		}

		// Border colour was invalid, set border to zero
		else { this.border = border = 0; }

		// Determine tip size
		newSize = this.size = this._calculateSize(corner);
		tip.css({
			width: newSize[0],
			height: newSize[1],
			lineHeight: newSize[1]+'px'
		});

		// Calculate tip translation
		if(corner.precedance === Y) {
			translate = [
				round(mimic.x === LEFT ? border : mimic.x === RIGHT ? newSize[0] - curSize[0] - border : (newSize[0] - curSize[0]) / 2),
				round(mimic.y === TOP ? newSize[1] - curSize[1] : 0)
			];
		}
		else {
			translate = [
				round(mimic.x === LEFT ? newSize[0] - curSize[0] : 0),
				round(mimic.y === TOP ? border : mimic.y === BOTTOM ? newSize[1] - curSize[1] - border : (newSize[1] - curSize[1]) / 2)
			];
		}

		// Canvas drawing implementation
		if(HASCANVAS) {
			// Grab canvas context and clear/save it
			context = inner[0].getContext('2d');
			context.restore(); context.save();
			context.clearRect(0,0,6000,6000);

			// Calculate coordinates
			coords = this._calculateTip(mimic, curSize, SCALE);
			bigCoords = this._calculateTip(mimic, this.size, SCALE);

			// Set the canvas size using calculated size
			inner.attr(WIDTH, newSize[0] * SCALE).attr(HEIGHT, newSize[1] * SCALE);
			inner.css(WIDTH, newSize[0]).css(HEIGHT, newSize[1]);

			// Draw the outer-stroke tip
			this._drawCoords(context, bigCoords);
			context.fillStyle = color[1];
			context.fill();

			// Draw the actual tip
			context.translate(translate[0] * SCALE, translate[1] * SCALE);
			this._drawCoords(context, coords);
			context.fillStyle = color[0];
			context.fill();
		}

		// VML (IE Proprietary implementation)
		else {
			// Calculate coordinates
			coords = this._calculateTip(mimic);

			// Setup coordinates string
			coords = 'm' + coords[0] + ',' + coords[1] + ' l' + coords[2] +
				',' + coords[3] + ' ' + coords[4] + ',' + coords[5] + ' xe';

			// Setup VML-specific offset for pixel-perfection
			translate[2] = border && /^(r|b)/i.test(corner.string()) ?
				BROWSER.ie === 8 ? 2 : 1 : 0;

			// Set initial CSS
			inner.css({
				coordsize: newSize[0]+border + ' ' + newSize[1]+border,
				antialias: ''+(mimic.string().indexOf(CENTER) > -1),
				left: translate[0] - translate[2] * Number(precedance === X),
				top: translate[1] - translate[2] * Number(precedance === Y),
				width: newSize[0] + border,
				height: newSize[1] + border
			})
			.each(function(i) {
				var $this = $(this);

				// Set shape specific attributes
				$this[ $this.prop ? 'prop' : 'attr' ]({
					coordsize: newSize[0]+border + ' ' + newSize[1]+border,
					path: coords,
					fillcolor: color[0],
					filled: !!i,
					stroked: !i
				})
				.toggle(!!(border || i));

				// Check if border is enabled and add stroke element
				!i && $this.html( createVML(
					'stroke', 'weight="'+border*2+'px" color="'+color[1]+'" miterlimit="1000" joinstyle="miter"'
				) );
			});
		}

		// Opera bug #357 - Incorrect tip position
		// https://github.com/Craga89/qTip2/issues/367
		window.opera && setTimeout(function() {
			elements.tip.css({
				display: 'inline-block',
				visibility: 'visible'
			});
		}, 1);

		// Position if needed
		if(position !== FALSE) { this.calculate(corner, newSize); }
	},

	calculate: function(corner, size) {
		if(!this.enabled) { return FALSE; }

		var self = this,
			elements = this.qtip.elements,
			tip = this.element,
			userOffset = this.options.offset,
			position = {},
			precedance, corners;

		// Inherit corner if not provided
		corner = corner || this.corner;
		precedance = corner.precedance;

		// Determine which tip dimension to use for adjustment
		size = size || this._calculateSize(corner);

		// Setup corners and offset array
		corners = [ corner.x, corner.y ];
		if(precedance === X) { corners.reverse(); }

		// Calculate tip position
		$.each(corners, function(i, side) {
			var b, bc, br;

			if(side === CENTER) {
				b = precedance === Y ? LEFT : TOP;
				position[ b ] = '50%';
				position[MARGIN+'-' + b] = -Math.round(size[ precedance === Y ? 0 : 1 ] / 2) + userOffset;
			}
			else {
				b = self._parseWidth(corner, side, elements.tooltip);
				bc = self._parseWidth(corner, side, elements.content);
				br = self._parseRadius(corner);

				position[ side ] = Math.max(-self.border, i ? bc : userOffset + (br > b ? br : -b));
			}
		});

		// Adjust for tip size
		position[ corner[precedance] ] -= size[ precedance === X ? 0 : 1 ];

		// Set and return new position
		tip.css({ margin: '', top: '', bottom: '', left: '', right: '' }).css(position);
		return position;
	},

	reposition: function(event, api, pos) {
		if(!this.enabled) { return; }

		var cache = api.cache,
			newCorner = this.corner.clone(),
			adjust = pos.adjusted,
			method = api.options.position.adjust.method.split(' '),
			horizontal = method[0],
			vertical = method[1] || method[0],
			shift = { left: FALSE, top: FALSE, x: 0, y: 0 },
			offset, css = {}, props;

		function shiftflip(direction, precedance, popposite, side, opposite) {
			// Horizontal - Shift or flip method
			if(direction === SHIFT && newCorner.precedance === precedance && adjust[side] && newCorner[popposite] !== CENTER) {
				newCorner.precedance = newCorner.precedance === X ? Y : X;
			}
			else if(direction !== SHIFT && adjust[side]){
				newCorner[precedance] = newCorner[precedance] === CENTER ?
					adjust[side] > 0 ? side : opposite :
					newCorner[precedance] === side ? opposite : side;
			}
		}

		function shiftonly(xy, side, opposite) {
			if(newCorner[xy] === CENTER) {
				css[MARGIN+'-'+side] = shift[xy] = offset[MARGIN+'-'+side] - adjust[side];
			}
			else {
				props = offset[opposite] !== undefined ?
					[ adjust[side], -offset[side] ] : [ -adjust[side], offset[side] ];

				if( (shift[xy] = Math.max(props[0], props[1])) > props[0] ) {
					pos[side] -= adjust[side];
					shift[side] = FALSE;
				}

				css[ offset[opposite] !== undefined ? opposite : side ] = shift[xy];
			}
		}

		// If our tip position isn't fixed e.g. doesn't adjust with viewport...
		if(this.corner.fixed !== TRUE) {
			// Perform shift/flip adjustments
			shiftflip(horizontal, X, Y, LEFT, RIGHT);
			shiftflip(vertical, Y, X, TOP, BOTTOM);

			// Update and redraw the tip if needed (check cached details of last drawn tip)
			if(newCorner.string() !== cache.corner.string() || cache.cornerTop !== adjust.top || cache.cornerLeft !== adjust.left) {
				this.update(newCorner, FALSE);
			}
		}

		// Setup tip offset properties
		offset = this.calculate(newCorner);

		// Readjust offset object to make it left/top
		if(offset.right !== undefined) { offset.left = -offset.right; }
		if(offset.bottom !== undefined) { offset.top = -offset.bottom; }
		offset.user = this.offset;

		// Perform shift adjustments
		shift.left = horizontal === SHIFT && !!adjust.left;
		if(shift.left) {
			shiftonly(X, LEFT, RIGHT);
		}
		shift.top = vertical === SHIFT && !!adjust.top;
		if(shift.top) {
			shiftonly(Y, TOP, BOTTOM);
		}

		/*
		* If the tip is adjusted in both dimensions, or in a
		* direction that would cause it to be anywhere but the
		* outer border, hide it!
		*/
		this.element.css(css).toggle(
			!(shift.x && shift.y || newCorner.x === CENTER && shift.y || newCorner.y === CENTER && shift.x)
		);

		// Adjust position to accomodate tip dimensions
		pos.left -= offset.left.charAt ? offset.user :
			horizontal !== SHIFT || shift.top || !shift.left && !shift.top ? offset.left + this.border : 0;
		pos.top -= offset.top.charAt ? offset.user :
			vertical !== SHIFT || shift.left || !shift.left && !shift.top ? offset.top + this.border : 0;

		// Cache details
		cache.cornerLeft = adjust.left; cache.cornerTop = adjust.top;
		cache.corner = newCorner.clone();
	},

	destroy: function() {
		// Unbind events
		this.qtip._unbind(this.qtip.tooltip, this._ns);

		// Remove the tip element(s)
		if(this.qtip.elements.tip) {
			this.qtip.elements.tip.find('*')
				.remove().end().remove();
		}
	}
});

TIP = PLUGINS.tip = function(api) {
	return new Tip(api, api.options.style.tip);
};

// Initialize tip on render
TIP.initialize = 'render';

// Setup plugin sanitization options
TIP.sanitize = function(options) {
	if(options.style && 'tip' in options.style) {
		var opts = options.style.tip;
		if(typeof opts !== 'object') { opts = options.style.tip = { corner: opts }; }
		if(!(/string|boolean/i).test(typeof opts.corner)) { opts.corner = TRUE; }
	}
};

// Add new option checks for the plugin
CHECKS.tip = {
	'^position.my|style.tip.(corner|mimic|border)$': function() {
		// Make sure a tip can be drawn
		this.create();

		// Reposition the tooltip
		this.qtip.reposition();
	},
	'^style.tip.(height|width)$': function(obj) {
		// Re-set dimensions and redraw the tip
		this.size = [ obj.width, obj.height ];
		this.update();

		// Reposition the tooltip
		this.qtip.reposition();
	},
	'^content.title|style.(classes|widget)$': function() {
		this.update();
	}
};

// Extend original qTip defaults
$.extend(TRUE, QTIP.defaults, {
	style: {
		tip: {
			corner: TRUE,
			mimic: FALSE,
			width: 6,
			height: 6,
			border: TRUE,
			offset: 0
		}
	}
});
;var MODAL, OVERLAY,
	MODALCLASS = 'qtip-modal',
	MODALSELECTOR = '.'+MODALCLASS;

OVERLAY = function()
{
	var self = this,
		focusableElems = {},
		current,
		prevState,
		elem;

	// Modified code from jQuery UI 1.10.0 source
	// http://code.jquery.com/ui/1.10.0/jquery-ui.js
	function focusable(element) {
		// Use the defined focusable checker when possible
		if($.expr[':'].focusable) { return $.expr[':'].focusable; }

		var isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex')),
			nodeName = element.nodeName && element.nodeName.toLowerCase(),
			map, mapName, img;

		if('area' === nodeName) {
			map = element.parentNode;
			mapName = map.name;
			if(!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
				return false;
			}
			img = $('img[usemap=#' + mapName + ']')[0];
			return !!img && img.is(':visible');
		}

		return /input|select|textarea|button|object/.test( nodeName ) ?
			!element.disabled :
			'a' === nodeName ?
				element.href || isTabIndexNotNaN :
				isTabIndexNotNaN
		;
	}

	// Focus inputs using cached focusable elements (see update())
	function focusInputs(blurElems) {
		// Blurring body element in IE causes window.open windows to unfocus!
		if(focusableElems.length < 1 && blurElems.length) { blurElems.not('body').blur(); }

		// Focus the inputs
		else { focusableElems.first().focus(); }
	}

	// Steal focus from elements outside tooltip
	function stealFocus(event) {
		if(!elem.is(':visible')) { return; }

		var target = $(event.target),
			tooltip = current.tooltip,
			container = target.closest(SELECTOR),
			targetOnTop;

		// Determine if input container target is above this
		targetOnTop = container.length < 1 ? FALSE :
			parseInt(container[0].style.zIndex, 10) > parseInt(tooltip[0].style.zIndex, 10);

		// If we're showing a modal, but focus has landed on an input below
		// this modal, divert focus to the first visible input in this modal
		// or if we can't find one... the tooltip itself
		if(!targetOnTop && target.closest(SELECTOR)[0] !== tooltip[0]) {
			focusInputs(target);
		}
	}

	$.extend(self, {
		init: function() {
			// Create document overlay
			elem = self.elem = $('<div />', {
				id: 'qtip-overlay',
				html: '<div></div>',
				mousedown: function() { return FALSE; }
			})
			.hide();

			// Make sure we can't focus anything outside the tooltip
			$(document.body).bind('focusin'+MODALSELECTOR, stealFocus);

			// Apply keyboard "Escape key" close handler
			$(document).bind('keydown'+MODALSELECTOR, function(event) {
				if(current && current.options.show.modal.escape && event.keyCode === 27) {
					current.hide(event);
				}
			});

			// Apply click handler for blur option
			elem.bind('click'+MODALSELECTOR, function(event) {
				if(current && current.options.show.modal.blur) {
					current.hide(event);
				}
			});

			return self;
		},

		update: function(api) {
			// Update current API reference
			current = api;

			// Update focusable elements if enabled
			if(api.options.show.modal.stealfocus !== FALSE) {
				focusableElems = api.tooltip.find('*').filter(function() {
					return focusable(this);
				});
			}
			else { focusableElems = []; }
		},

		toggle: function(api, state, duration) {
			var tooltip = api.tooltip,
				options = api.options.show.modal,
				effect = options.effect,
				type = state ? 'show': 'hide',
				visible = elem.is(':visible'),
				visibleModals = $(MODALSELECTOR).filter(':visible:not(:animated)').not(tooltip);

			// Set active tooltip API reference
			self.update(api);

			// If the modal can steal the focus...
			// Blur the current item and focus anything in the modal we an
			if(state && options.stealfocus !== FALSE) {
				focusInputs( $(':focus') );
			}

			// Toggle backdrop cursor style on show
			elem.toggleClass('blurs', options.blur);

			// Append to body on show
			if(state) {
				elem.appendTo(document.body);
			}

			// Prevent modal from conflicting with show.solo, and don't hide backdrop is other modals are visible
			if(elem.is(':animated') && visible === state && prevState !== FALSE || !state && visibleModals.length) {
				return self;
			}

			// Stop all animations
			elem.stop(TRUE, FALSE);

			// Use custom function if provided
			if($.isFunction(effect)) {
				effect.call(elem, state);
			}

			// If no effect type is supplied, use a simple toggle
			else if(effect === FALSE) {
				elem[ type ]();
			}

			// Use basic fade function
			else {
				elem.fadeTo( parseInt(duration, 10) || 90, state ? 1 : 0, function() {
					if(!state) { elem.hide(); }
				});
			}

			// Reset position and detach from body on hide
			if(!state) {
				elem.queue(function(next) {
					elem.css({ left: '', top: '' });
					if(!$(MODALSELECTOR).length) { elem.detach(); }
					next();
				});
			}

			// Cache the state
			prevState = state;

			// If the tooltip is destroyed, set reference to null
			if(current.destroyed) { current = NULL; }

			return self;
		}
	});

	self.init();
};
OVERLAY = new OVERLAY();

function Modal(api, options) {
	this.options = options;
	this._ns = '-modal';

	this.qtip = api;
	this.init(api);
}

$.extend(Modal.prototype, {
	init: function(qtip) {
		var tooltip = qtip.tooltip;

		// If modal is disabled... return
		if(!this.options.on) { return this; }

		// Set overlay reference
		qtip.elements.overlay = OVERLAY.elem;

		// Add unique attribute so we can grab modal tooltips easily via a SELECTOR, and set z-index
		tooltip.addClass(MODALCLASS).css('z-index', QTIP.modal_zindex + $(MODALSELECTOR).length);

		// Apply our show/hide/focus modal events
		qtip._bind(tooltip, ['tooltipshow', 'tooltiphide'], function(event, api, duration) {
			var oEvent = event.originalEvent;

			// Make sure mouseout doesn't trigger a hide when showing the modal and mousing onto backdrop
			if(event.target === tooltip[0]) {
				if(oEvent && event.type === 'tooltiphide' && /mouse(leave|enter)/.test(oEvent.type) && $(oEvent.relatedTarget).closest(OVERLAY.elem[0]).length) {
					/* eslint-disable no-empty */
					try { event.preventDefault(); }
					catch(e) {}
					/* eslint-enable no-empty */
				}
				else if(!oEvent || oEvent && oEvent.type !== 'tooltipsolo') {
					this.toggle(event, event.type === 'tooltipshow', duration);
				}
			}
		}, this._ns, this);

		// Adjust modal z-index on tooltip focus
		qtip._bind(tooltip, 'tooltipfocus', function(event, api) {
			// If focus was cancelled before it reached us, don't do anything
			if(event.isDefaultPrevented() || event.target !== tooltip[0]) { return; }

			var qtips = $(MODALSELECTOR),

			// Keep the modal's lower than other, regular qtips
			newIndex = QTIP.modal_zindex + qtips.length,
			curIndex = parseInt(tooltip[0].style.zIndex, 10);

			// Set overlay z-index
			OVERLAY.elem[0].style.zIndex = newIndex - 1;

			// Reduce modal z-index's and keep them properly ordered
			qtips.each(function() {
				if(this.style.zIndex > curIndex) {
					this.style.zIndex -= 1;
				}
			});

			// Fire blur event for focused tooltip
			qtips.filter('.' + CLASS_FOCUS).qtip('blur', event.originalEvent);

			// Set the new z-index
			tooltip.addClass(CLASS_FOCUS)[0].style.zIndex = newIndex;

			// Set current
			OVERLAY.update(api);

			// Prevent default handling
			/* eslint-disable no-empty */
			try { event.preventDefault(); }
			catch(e) {}
			/* eslint-enable no-empty */
		}, this._ns, this);

		// Focus any other visible modals when this one hides
		qtip._bind(tooltip, 'tooltiphide', function(event) {
			if(event.target === tooltip[0]) {
				$(MODALSELECTOR).filter(':visible').not(tooltip).last().qtip('focus', event);
			}
		}, this._ns, this);
	},

	toggle: function(event, state, duration) {
		// Make sure default event hasn't been prevented
		if(event && event.isDefaultPrevented()) { return this; }

		// Toggle it
		OVERLAY.toggle(this.qtip, !!state, duration);
	},

	destroy: function() {
		// Remove modal class
		this.qtip.tooltip.removeClass(MODALCLASS);

		// Remove bound events
		this.qtip._unbind(this.qtip.tooltip, this._ns);

		// Delete element reference
		OVERLAY.toggle(this.qtip, FALSE);
		delete this.qtip.elements.overlay;
	}
});


MODAL = PLUGINS.modal = function(api) {
	return new Modal(api, api.options.show.modal);
};

// Setup sanitiztion rules
MODAL.sanitize = function(opts) {
	if(opts.show) {
		if(typeof opts.show.modal !== 'object') { opts.show.modal = { on: !!opts.show.modal }; }
		else if(typeof opts.show.modal.on === 'undefined') { opts.show.modal.on = TRUE; }
	}
};

// Base z-index for all modal tooltips (use qTip core z-index as a base)
/* eslint-disable camelcase */
QTIP.modal_zindex = QTIP.zindex - 200;
/* eslint-enable camelcase */

// Plugin needs to be initialized on render
MODAL.initialize = 'render';

// Setup option set checks
CHECKS.modal = {
	'^show.modal.(on|blur)$': function() {
		// Initialise
		this.destroy();
		this.init();

		// Show the modal if not visible already and tooltip is visible
		this.qtip.elems.overlay.toggle(
			this.qtip.tooltip[0].offsetWidth > 0
		);
	}
};

// Extend original api defaults
$.extend(TRUE, QTIP.defaults, {
	show: {
		modal: {
			on: FALSE,
			effect: TRUE,
			blur: TRUE,
			stealfocus: TRUE,
			escape: TRUE
		}
	}
});
;PLUGINS.viewport = function(api, position, posOptions, targetWidth, targetHeight, elemWidth, elemHeight)
{
	var target = posOptions.target,
		tooltip = api.elements.tooltip,
		my = posOptions.my,
		at = posOptions.at,
		adjust = posOptions.adjust,
		method = adjust.method.split(' '),
		methodX = method[0],
		methodY = method[1] || method[0],
		viewport = posOptions.viewport,
		container = posOptions.container,
		adjusted = { left: 0, top: 0 },
		fixed, newMy, containerOffset, containerStatic,
		viewportWidth, viewportHeight, viewportScroll, viewportOffset;

	// If viewport is not a jQuery element, or it's the window/document, or no adjustment method is used... return
	if(!viewport.jquery || target[0] === window || target[0] === document.body || adjust.method === 'none') {
		return adjusted;
	}

	// Cach container details
	containerOffset = container.offset() || adjusted;
	containerStatic = container.css('position') === 'static';

	// Cache our viewport details
	fixed = tooltip.css('position') === 'fixed';
	viewportWidth = viewport[0] === window ? viewport.width() : viewport.outerWidth(FALSE);
	viewportHeight = viewport[0] === window ? viewport.height() : viewport.outerHeight(FALSE);
	viewportScroll = { left: fixed ? 0 : viewport.scrollLeft(), top: fixed ? 0 : viewport.scrollTop() };
	viewportOffset = viewport.offset() || adjusted;

	// Generic calculation method
	function calculate(side, otherSide, type, adjustment, side1, side2, lengthName, targetLength, elemLength) {
		var initialPos = position[side1],
			mySide = my[side],
			atSide = at[side],
			isShift = type === SHIFT,
			myLength = mySide === side1 ? elemLength : mySide === side2 ? -elemLength : -elemLength / 2,
			atLength = atSide === side1 ? targetLength : atSide === side2 ? -targetLength : -targetLength / 2,
			sideOffset = viewportScroll[side1] + viewportOffset[side1] - (containerStatic ? 0 : containerOffset[side1]),
			overflow1 = sideOffset - initialPos,
			overflow2 = initialPos + elemLength - (lengthName === WIDTH ? viewportWidth : viewportHeight) - sideOffset,
			offset = myLength - (my.precedance === side || mySide === my[otherSide] ? atLength : 0) - (atSide === CENTER ? targetLength / 2 : 0);

		// shift
		if(isShift) {
			offset = (mySide === side1 ? 1 : -1) * myLength;

			// Adjust position but keep it within viewport dimensions
			position[side1] += overflow1 > 0 ? overflow1 : overflow2 > 0 ? -overflow2 : 0;
			position[side1] = Math.max(
				-containerOffset[side1] + viewportOffset[side1],
				initialPos - offset,
				Math.min(
					Math.max(
						-containerOffset[side1] + viewportOffset[side1] + (lengthName === WIDTH ? viewportWidth : viewportHeight),
						initialPos + offset
					),
					position[side1],

					// Make sure we don't adjust complete off the element when using 'center'
					mySide === 'center' ? initialPos - myLength : 1E9
				)
			);

		}

		// flip/flipinvert
		else {
			// Update adjustment amount depending on if using flipinvert or flip
			adjustment *= type === FLIPINVERT ? 2 : 0;

			// Check for overflow on the left/top
			if(overflow1 > 0 && (mySide !== side1 || overflow2 > 0)) {
				position[side1] -= offset + adjustment;
				newMy.invert(side, side1);
			}

			// Check for overflow on the bottom/right
			else if(overflow2 > 0 && (mySide !== side2 || overflow1 > 0)  ) {
				position[side1] -= (mySide === CENTER ? -offset : offset) + adjustment;
				newMy.invert(side, side2);
			}

			// Make sure we haven't made things worse with the adjustment and reset if so
			if(position[side1] < viewportScroll[side1] && -position[side1] > overflow2) {
				position[side1] = initialPos; newMy = my.clone();
			}
		}

		return position[side1] - initialPos;
	}

	// Set newMy if using flip or flipinvert methods
	if(methodX !== 'shift' || methodY !== 'shift') { newMy = my.clone(); }

	// Adjust position based onviewport and adjustment options
	adjusted = {
		left: methodX !== 'none' ? calculate( X, Y, methodX, adjust.x, LEFT, RIGHT, WIDTH, targetWidth, elemWidth ) : 0,
		top: methodY !== 'none' ? calculate( Y, X, methodY, adjust.y, TOP, BOTTOM, HEIGHT, targetHeight, elemHeight ) : 0,
		my: newMy
	};

	return adjusted;
};
;PLUGINS.polys = {
	// POLY area coordinate calculator
	//	Special thanks to Ed Cradock for helping out with this.
	//	Uses a binary search algorithm to find suitable coordinates.
	polygon: function(baseCoords, corner) {
		var result = {
			width: 0, height: 0,
			position: {
				top: 1e10, right: 0,
				bottom: 0, left: 1e10
			},
			adjustable: FALSE
		},
		i = 0, next,
		coords = [],
		compareX = 1, compareY = 1,
		realX = 0, realY = 0,
		newWidth, newHeight;

		// First pass, sanitize coords and determine outer edges
		i = baseCoords.length; 
		while(i--) {
			next = [ parseInt(baseCoords[--i], 10), parseInt(baseCoords[i+1], 10) ];

			if(next[0] > result.position.right){ result.position.right = next[0]; }
			if(next[0] < result.position.left){ result.position.left = next[0]; }
			if(next[1] > result.position.bottom){ result.position.bottom = next[1]; }
			if(next[1] < result.position.top){ result.position.top = next[1]; }

			coords.push(next);
		}

		// Calculate height and width from outer edges
		newWidth = result.width = Math.abs(result.position.right - result.position.left);
		newHeight = result.height = Math.abs(result.position.bottom - result.position.top);

		// If it's the center corner...
		if(corner.abbrev() === 'c') {
			result.position = {
				left: result.position.left + result.width / 2,
				top: result.position.top + result.height / 2
			};
		}
		else {
			// Second pass, use a binary search algorithm to locate most suitable coordinate
			while(newWidth > 0 && newHeight > 0 && compareX > 0 && compareY > 0)
			{
				newWidth = Math.floor(newWidth / 2);
				newHeight = Math.floor(newHeight / 2);

				if(corner.x === LEFT){ compareX = newWidth; }
				else if(corner.x === RIGHT){ compareX = result.width - newWidth; }
				else{ compareX += Math.floor(newWidth / 2); }

				if(corner.y === TOP){ compareY = newHeight; }
				else if(corner.y === BOTTOM){ compareY = result.height - newHeight; }
				else{ compareY += Math.floor(newHeight / 2); }

				i = coords.length;
				while(i--)
				{
					if(coords.length < 2){ break; }

					realX = coords[i][0] - result.position.left;
					realY = coords[i][1] - result.position.top;

					if(
						corner.x === LEFT && realX >= compareX ||
						corner.x === RIGHT && realX <= compareX ||
						corner.x === CENTER && (realX < compareX || realX > result.width - compareX) ||
						corner.y === TOP && realY >= compareY ||
						corner.y === BOTTOM && realY <= compareY ||
						corner.y === CENTER && (realY < compareY || realY > result.height - compareY)) {
						coords.splice(i, 1);
					}
				}
			}
			result.position = { left: coords[0][0], top: coords[0][1] };
		}

		return result;
	},

	rect: function(ax, ay, bx, by) {
		return {
			width: Math.abs(bx - ax),
			height: Math.abs(by - ay),
			position: {
				left: Math.min(ax, bx),
				top: Math.min(ay, by)
			}
		};
	},

	_angles: {
		tc: 3 / 2, tr: 7 / 4, tl: 5 / 4,
		bc: 1 / 2, br: 1 / 4, bl: 3 / 4,
		rc: 2, lc: 1, c: 0
	},
	ellipse: function(cx, cy, rx, ry, corner) {
		var c = PLUGINS.polys._angles[ corner.abbrev() ],
			rxc = c === 0 ? 0 : rx * Math.cos( c * Math.PI ),
			rys = ry * Math.sin( c * Math.PI );

		return {
			width: rx * 2 - Math.abs(rxc),
			height: ry * 2 - Math.abs(rys),
			position: {
				left: cx + rxc,
				top: cy + rys
			},
			adjustable: FALSE
		};
	},
	circle: function(cx, cy, r, corner) {
		return PLUGINS.polys.ellipse(cx, cy, r, r, corner);
	}
};
;PLUGINS.svg = function(api, svg, corner)
{
	var elem = svg[0],
		root = $(elem.ownerSVGElement),
		ownerDocument = elem.ownerDocument,
		strokeWidth2 = (parseInt(svg.css('stroke-width'), 10) || 0) / 2,
		frameOffset, mtx, transformed,
		len, next, i, points,
		result, position;

	// Ascend the parentNode chain until we find an element with getBBox()
	while(!elem.getBBox) { elem = elem.parentNode; }
	if(!elem.getBBox || !elem.parentNode) { return FALSE; }

	// Determine which shape calculation to use
	switch(elem.nodeName) {
		case 'ellipse':
		case 'circle':
			result = PLUGINS.polys.ellipse(
				elem.cx.baseVal.value,
				elem.cy.baseVal.value,
				(elem.rx || elem.r).baseVal.value + strokeWidth2,
				(elem.ry || elem.r).baseVal.value + strokeWidth2,
				corner
			);
		break;

		case 'line':
		case 'polygon':
		case 'polyline':
			// Determine points object (line has none, so mimic using array)
			points = elem.points || [
				{ x: elem.x1.baseVal.value, y: elem.y1.baseVal.value },
				{ x: elem.x2.baseVal.value, y: elem.y2.baseVal.value }
			];

			for(result = [], i = -1, len = points.numberOfItems || points.length; ++i < len;) {
				next = points.getItem ? points.getItem(i) : points[i];
				result.push.apply(result, [next.x, next.y]);
			}

			result = PLUGINS.polys.polygon(result, corner);
		break;

		// Unknown shape or rectangle? Use bounding box
		default:
			result = elem.getBBox();
			result = {
				width: result.width,
				height: result.height,
				position: {
					left: result.x,
					top: result.y
				}
			};
		break;
	}

	// Shortcut assignments
	position = result.position;
	root = root[0];

	// Convert position into a pixel value
	if(root.createSVGPoint) {
		mtx = elem.getScreenCTM();
		points = root.createSVGPoint();

		points.x = position.left;
		points.y = position.top;
		transformed = points.matrixTransform( mtx );
		position.left = transformed.x;
		position.top = transformed.y;
	}

	// Check the element is not in a child document, and if so, adjust for frame elements offset
	if(ownerDocument !== document && api.position.target !== 'mouse') {
		frameOffset = $((ownerDocument.defaultView || ownerDocument.parentWindow).frameElement).offset();
		if(frameOffset) {
			position.left += frameOffset.left;
			position.top += frameOffset.top;
		}
	}

	// Adjust by scroll offset of owner document
	ownerDocument = $(ownerDocument);
	position.left += ownerDocument.scrollLeft();
	position.top += ownerDocument.scrollTop();

	return result;
};
;PLUGINS.imagemap = function(api, area, corner)
{
	if(!area.jquery) { area = $(area); }

	var shape = (area.attr('shape') || 'rect').toLowerCase().replace('poly', 'polygon'),
		image = $('img[usemap="#'+area.parent('map').attr('name')+'"]'),
		coordsString = $.trim(area.attr('coords')),
		coordsArray = coordsString.replace(/,$/, '').split(','),
		imageOffset, coords, i, result, len;

	// If we can't find the image using the map...
	if(!image.length) { return FALSE; }

	// Pass coordinates string if polygon
	if(shape === 'polygon') {
		result = PLUGINS.polys.polygon(coordsArray, corner);
	}

	// Otherwise parse the coordinates and pass them as arguments
	else if(PLUGINS.polys[shape]) {
		for(i = -1, len = coordsArray.length, coords = []; ++i < len;) {
			coords.push( parseInt(coordsArray[i], 10) );
		}

		result = PLUGINS.polys[shape].apply(
			this, coords.concat(corner)
		);
	}

	// If no shapre calculation method was found, return false
	else { return FALSE; }

	// Make sure we account for padding and borders on the image
	imageOffset = image.offset();
	imageOffset.left += Math.ceil((image.outerWidth(FALSE) - image.width()) / 2);
	imageOffset.top += Math.ceil((image.outerHeight(FALSE) - image.height()) / 2);

	// Add image position to offset coordinates
	result.position.left += imageOffset.left;
	result.position.top += imageOffset.top;

	return result;
};
;var IE6,

/*
 * BGIFrame adaption (http://plugins.jquery.com/project/bgiframe)
 * Special thanks to Brandon Aaron
 */
BGIFRAME = '<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:\'\';" ' +
	' style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=0); ' +
		'-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";"></iframe>';

function Ie6(api) {
	this._ns = 'ie6';

	this.qtip = api;
	this.init(api);
}

$.extend(Ie6.prototype, {
	_scroll : function() {
		var overlay = this.qtip.elements.overlay;
		overlay && (overlay[0].style.top = $(window).scrollTop() + 'px');
	},

	init: function(qtip) {
		var tooltip = qtip.tooltip;

		// Create the BGIFrame element if needed
		if($('select, object').length < 1) {
			this.bgiframe = qtip.elements.bgiframe = $(BGIFRAME).appendTo(tooltip);

			// Update BGIFrame on tooltip move
			qtip._bind(tooltip, 'tooltipmove', this.adjustBGIFrame, this._ns, this);
		}

		// redraw() container for width/height calculations
		this.redrawContainer = $('<div/>', { id: NAMESPACE+'-rcontainer' })
			.appendTo(document.body);

		// Fixup modal plugin if present too
		if( qtip.elements.overlay && qtip.elements.overlay.addClass('qtipmodal-ie6fix') ) {
			qtip._bind(window, ['scroll', 'resize'], this._scroll, this._ns, this);
			qtip._bind(tooltip, ['tooltipshow'], this._scroll, this._ns, this);
		}

		// Set dimensions
		this.redraw();
	},

	adjustBGIFrame: function() {
		var tooltip = this.qtip.tooltip,
			dimensions = {
				height: tooltip.outerHeight(FALSE),
				width: tooltip.outerWidth(FALSE)
			},
			plugin = this.qtip.plugins.tip,
			tip = this.qtip.elements.tip,
			tipAdjust, offset;

		// Adjust border offset
		offset = parseInt(tooltip.css('borderLeftWidth'), 10) || 0;
		offset = { left: -offset, top: -offset };

		// Adjust for tips plugin
		if(plugin && tip) {
			tipAdjust = plugin.corner.precedance === 'x' ? [WIDTH, LEFT] : [HEIGHT, TOP];
			offset[ tipAdjust[1] ] -= tip[ tipAdjust[0] ]();
		}

		// Update bgiframe
		this.bgiframe.css(offset).css(dimensions);
	},

	// Max/min width simulator function
	redraw: function() {
		if(this.qtip.rendered < 1 || this.drawing) { return this; }

		var tooltip = this.qtip.tooltip,
			style = this.qtip.options.style,
			container = this.qtip.options.position.container,
			perc, width, max, min;

		// Set drawing flag
		this.qtip.drawing = 1;

		// If tooltip has a set height/width, just set it... like a boss!
		if(style.height) { tooltip.css(HEIGHT, style.height); }
		if(style.width) { tooltip.css(WIDTH, style.width); }

		// Simulate max/min width if not set width present...
		else {
			// Reset width and add fluid class
			tooltip.css(WIDTH, '').appendTo(this.redrawContainer);

			// Grab our tooltip width (add 1 if odd so we don't get wrapping problems.. huzzah!)
			width = tooltip.width();
			if(width % 2 < 1) { width += 1; }

			// Grab our max/min properties
			max = tooltip.css('maxWidth') || '';
			min = tooltip.css('minWidth') || '';

			// Parse into proper pixel values
			perc = (max + min).indexOf('%') > -1 ? container.width() / 100 : 0;
			max = (max.indexOf('%') > -1 ? perc : 1 * parseInt(max, 10)) || width;
			min = (min.indexOf('%') > -1 ? perc : 1 * parseInt(min, 10)) || 0;

			// Determine new dimension size based on max/min/current values
			width = max + min ? Math.min(Math.max(width, min), max) : width;

			// Set the newly calculated width and remvoe fluid class
			tooltip.css(WIDTH, Math.round(width)).appendTo(container);
		}

		// Set drawing flag
		this.drawing = 0;

		return this;
	},

	destroy: function() {
		// Remove iframe
		this.bgiframe && this.bgiframe.remove();

		// Remove bound events
		this.qtip._unbind([window, this.qtip.tooltip], this._ns);
	}
});

IE6 = PLUGINS.ie6 = function(api) {
	// Proceed only if the browser is IE6
	return BROWSER.ie === 6 ? new Ie6(api) : FALSE;
};

IE6.initialize = 'render';

CHECKS.ie6 = {
	'^content|style$': function() {
		this.redraw();
	}
};
;}));
}( window, document ));

},{}],34:[function(require,module,exports){
/*!
* screenfull
* v5.0.2 - 2020-02-13
* (c) Sindre Sorhus; MIT License
*/
(function () {
	'use strict';

	var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
	var isCommonjs = typeof module !== 'undefined' && module.exports;

	var fn = (function () {
		var val;

		var fnMap = [
			[
				'requestFullscreen',
				'exitFullscreen',
				'fullscreenElement',
				'fullscreenEnabled',
				'fullscreenchange',
				'fullscreenerror'
			],
			// New WebKit
			[
				'webkitRequestFullscreen',
				'webkitExitFullscreen',
				'webkitFullscreenElement',
				'webkitFullscreenEnabled',
				'webkitfullscreenchange',
				'webkitfullscreenerror'

			],
			// Old WebKit
			[
				'webkitRequestFullScreen',
				'webkitCancelFullScreen',
				'webkitCurrentFullScreenElement',
				'webkitCancelFullScreen',
				'webkitfullscreenchange',
				'webkitfullscreenerror'

			],
			[
				'mozRequestFullScreen',
				'mozCancelFullScreen',
				'mozFullScreenElement',
				'mozFullScreenEnabled',
				'mozfullscreenchange',
				'mozfullscreenerror'
			],
			[
				'msRequestFullscreen',
				'msExitFullscreen',
				'msFullscreenElement',
				'msFullscreenEnabled',
				'MSFullscreenChange',
				'MSFullscreenError'
			]
		];

		var i = 0;
		var l = fnMap.length;
		var ret = {};

		for (; i < l; i++) {
			val = fnMap[i];
			if (val && val[1] in document) {
				for (i = 0; i < val.length; i++) {
					ret[fnMap[0][i]] = val[i];
				}
				return ret;
			}
		}

		return false;
	})();

	var eventNameMap = {
		change: fn.fullscreenchange,
		error: fn.fullscreenerror
	};

	var screenfull = {
		request: function (element) {
			return new Promise(function (resolve, reject) {
				var onFullScreenEntered = function () {
					this.off('change', onFullScreenEntered);
					resolve();
				}.bind(this);

				this.on('change', onFullScreenEntered);

				element = element || document.documentElement;

				var returnPromise = element[fn.requestFullscreen]();

				if (returnPromise instanceof Promise) {
					returnPromise.then(onFullScreenEntered).catch(reject);
				}
			}.bind(this));
		},
		exit: function () {
			return new Promise(function (resolve, reject) {
				if (!this.isFullscreen) {
					resolve();
					return;
				}

				var onFullScreenExit = function () {
					this.off('change', onFullScreenExit);
					resolve();
				}.bind(this);

				this.on('change', onFullScreenExit);

				var returnPromise = document[fn.exitFullscreen]();

				if (returnPromise instanceof Promise) {
					returnPromise.then(onFullScreenExit).catch(reject);
				}
			}.bind(this));
		},
		toggle: function (element) {
			return this.isFullscreen ? this.exit() : this.request(element);
		},
		onchange: function (callback) {
			this.on('change', callback);
		},
		onerror: function (callback) {
			this.on('error', callback);
		},
		on: function (event, callback) {
			var eventName = eventNameMap[event];
			if (eventName) {
				document.addEventListener(eventName, callback, false);
			}
		},
		off: function (event, callback) {
			var eventName = eventNameMap[event];
			if (eventName) {
				document.removeEventListener(eventName, callback, false);
			}
		},
		raw: fn
	};

	if (!fn) {
		if (isCommonjs) {
			module.exports = {isEnabled: false};
		} else {
			window.screenfull = {isEnabled: false};
		}

		return;
	}

	Object.defineProperties(screenfull, {
		isFullscreen: {
			get: function () {
				return Boolean(document[fn.fullscreenElement]);
			}
		},
		element: {
			enumerable: true,
			get: function () {
				return document[fn.fullscreenElement];
			}
		},
		isEnabled: {
			enumerable: true,
			get: function () {
				// Coerce to boolean in case of old WebKit
				return Boolean(document[fn.fullscreenEnabled]);
			}
		}
	});

	if (isCommonjs) {
		module.exports = screenfull;
	} else {
		window.screenfull = screenfull;
	}
})();

},{}],35:[function(require,module,exports){
(function (Buffer){
(function() {
  var crypt = require('crypt'),
      utf8 = require('charenc').utf8,
      bin = require('charenc').bin,

  // The core
  sha1 = function (message) {
    // Convert to byte array
    if (message.constructor == String)
      message = utf8.stringToBytes(message);
    else if (typeof Buffer !== 'undefined' && typeof Buffer.isBuffer == 'function' && Buffer.isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();

    // otherwise assume byte array

    var m  = crypt.bytesToWords(message),
        l  = message.length * 8,
        w  = [],
        H0 =  1732584193,
        H1 = -271733879,
        H2 = -1732584194,
        H3 =  271733878,
        H4 = -1009589776;

    // Padding
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >>> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {
      var a = H0,
          b = H1,
          c = H2,
          d = H3,
          e = H4;

      for (var j = 0; j < 80; j++) {

        if (j < 16)
          w[j] = m[i + j];
        else {
          var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
          w[j] = (n << 1) | (n >>> 31);
        }

        var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
                j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                         (H1 ^ H2 ^ H3) - 899497514);

        H4 = H3;
        H3 = H2;
        H2 = (H1 << 30) | (H1 >>> 2);
        H1 = H0;
        H0 = t;
      }

      H0 += a;
      H1 += b;
      H2 += c;
      H3 += d;
      H4 += e;
    }

    return [H0, H1, H2, H3, H4];
  },

  // Public API
  api = function (message, options) {
    var digestbytes = crypt.wordsToBytes(sha1(message));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

  api._blocksize = 16;
  api._digestsize = 20;

  module.exports = api;
})();

}).call(this,require("buffer").Buffer)

},{"buffer":28,"charenc":29,"crypt":31}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL2Fubm90YXRvci1jb25maWcuanNvbiIsIm1vZHVsZXMvYW5ub3RhdG9yL2Fubm90YXRpb24tbWFuYWdlci5qcyIsIm1vZHVsZXMvYW5ub3RhdG9yL2Fubm90YXRpb24uanMiLCJtb2R1bGVzL2Fubm90YXRvci9hbm5vdGF0b3IuanMiLCJtb2R1bGVzL2Fubm90YXRvci9jb21wb25lbnRzL2Fubm90YXRpb24tZ3VpLmpzIiwibW9kdWxlcy9hbm5vdGF0b3IvY29tcG9uZW50cy9pbmRleC1jb250YWluZXIuanMiLCJtb2R1bGVzL2Fubm90YXRvci9jb21wb25lbnRzL2luZm8tY29udGFpbmVyLmpzIiwibW9kdWxlcy9hbm5vdGF0b3IvY29tcG9uZW50cy9tZXNzYWdlLW92ZXJsYXkuanMiLCJtb2R1bGVzL2Fubm90YXRvci9jb21wb25lbnRzL3BvbHlnb24tZWRpdG9yLmpzIiwibW9kdWxlcy9hbm5vdGF0b3IvY29tcG9uZW50cy9wb2x5Z29uLW92ZXJsYXkuanMiLCJtb2R1bGVzL2Fubm90YXRvci9jb21wb25lbnRzL3RpY2stYmFyLmpzIiwibW9kdWxlcy9hbm5vdGF0b3Ivc2VydmVyLWludGVyZmFjZS5qcyIsIm1vZHVsZXMvYW5ub3RhdG9yL3Nlc3Npb24tbWFuYWdlci5qcyIsIm1vZHVsZXMvY29uZmlnLmpzb24iLCJtb2R1bGVzL21haW4uanMiLCJtb2R1bGVzL3V0aWxzL2FycmF5LWV4dGVuc2lvbnMuanMiLCJtb2R1bGVzL3V0aWxzL2pxdWVyeS1leHRlbnNpb25zLmpzIiwibW9kdWxlcy91dGlscy9wcmVmZXJlbmNlLW1hbmFnZXIuanMiLCJtb2R1bGVzL3V0aWxzL3JlcXVpcmVtZW50cy5qcyIsIm1vZHVsZXMvdXRpbHMvc3RyaW5nLWV4dGVuc2lvbnMuanMiLCJtb2R1bGVzL3V0aWxzL3RpbWUuanMiLCJtb2R1bGVzL3ZlbmRvci5qcyIsIm1vZHVsZXMvdmlkZW8tcGxheWVyL3NlZWtiYXItdG9vbHRpcC5qcyIsIm1vZHVsZXMvdmlkZW8tcGxheWVyL3ZpZGVvLXBsYXllci1iYXIuanMiLCJtb2R1bGVzL3ZpZGVvLXBsYXllci92aWRlby1wbGF5ZXIuanMiLCJub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY2hhcmVuYy9jaGFyZW5jLmpzIiwibm9kZV9tb2R1bGVzL2NsaXAtcGF0aC1wb2x5Z29uL2pzL2NsaXAtcGF0aC1wb2x5Z29uLmpzIiwibm9kZV9tb2R1bGVzL2NyeXB0L2NyeXB0LmpzIiwibm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcXRpcDIvZGlzdC9qcXVlcnkucXRpcC5qcyIsIm5vZGVfbW9kdWxlcy9zY3JlZW5mdWxsL2Rpc3Qvc2NyZWVuZnVsbC5qcyIsIm5vZGVfbW9kdWxlcy9zaGExL3NoYTEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ0xBOzs7Ozs7Ozs7Ozs7OztJQUVNLGlCO0FBQ0YsK0JBQWE7QUFBQTs7QUFDVCxTQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDSDs7OztxQ0FFZ0IsSSxFQUFLO0FBQ2xCLFVBQUksSUFBSSxDQUFDLE1BQUwsSUFBZSxDQUFuQixFQUFxQjtBQUNqQixRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsK0JBQWI7QUFDSDs7QUFFRCxXQUFLLFdBQUwsR0FBbUIsRUFBbkI7O0FBTGtCLGlEQU1BLElBTkE7QUFBQTs7QUFBQTtBQU1sQiw0REFBdUI7QUFBQSxjQUFmLE1BQWU7QUFDbkIsZUFBSyxrQkFBTCxDQUF3QixNQUF4QjtBQUNIO0FBUmlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVckI7Ozt1Q0FFa0IsVSxFQUFXO0FBQzFC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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SkE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy81R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJjbGllbnRfaWRcIjogXCJzY2FsYXJcIixcbiAgICBcImNsaWVudF92ZXJcIjogXCIyLjUuMTJcIixcbiAgICBcImlkXCI6IFwidXNlckBleGFtcGxlLmNvbVwiLFxuICAgIFwiYXBpX2tleVwiOiBcImFiY2QtaGFzaGtleS1mcm9tLXNvbWV3aGVyZS1lbHNlXCJcbn0iLCJpbXBvcnQgeyBBbm5vdGF0aW9uIH0gZnJvbSBcIi4vYW5ub3RhdGlvbi5qc1wiO1xuXG5jbGFzcyBBbm5vdGF0aW9uTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5hbm5vdGF0aW9ucyA9IFtdO1xuICAgIH1cblxuICAgIFBvcHVsYXRlRnJvbUpTT04oanNvbil7XG4gICAgICAgIGlmIChqc29uLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkpTT04gY29udGFpbnMgbm8gYW5ub3RhdGlvbnMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hbm5vdGF0aW9ucyA9IFtdO1xuICAgICAgICBmb3IobGV0IG9iamVjdCBvZiBqc29uKXtcbiAgICAgICAgICAgIHRoaXMuUmVnaXN0ZXJBbm5vdGF0aW9uKG9iamVjdCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIFJlZ2lzdGVyQW5ub3RhdGlvbihqc29uT2JqZWN0KXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIlJlZ2lzdGVyaW5nIG5ldyBhbm5vdGF0aW9uIHdpdGggSUQgXCIgKyBqc29uT2JqZWN0LmlkKTtcbiAgICAgICAgbGV0IGFubm8gPSBuZXcgQW5ub3RhdGlvbihqc29uT2JqZWN0KTtcbiAgICAgICAgdGhpcy5hbm5vdGF0aW9ucy5wdXNoKGFubm8pO1xuICAgIH1cblxuICAgIFJlbW92ZUFubm90YXRpb24oaWQpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiUmVtb3Zpbmc6IFwiICsgaWQpO1xuICAgICAgICB0aGlzLmFubm90YXRpb25zID0gdGhpcy5hbm5vdGF0aW9ucy5maWx0ZXIoKG9iaikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5pZCAhPT0gaWQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgZ2l2ZW4gYW5ub3RhdGlvbiBpbiB0aGUgc3RvcmVkIGFycmF5XG4gICAgICovXG4gICAgVXBkYXRlQW5ub3RhdGlvbihhbm5vdGF0aW9uLCBvbGRJRCl7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJVcGRhdGluZyBhbm5vdGF0aW9uIElEIFwiICsgb2xkSUQgKyBcIiB0byBcIiArIGFubm90YXRpb24ubWV0YWRhdGEuaWQpO1xuICAgICAgICB0aGlzLlJlbW92ZUFubm90YXRpb24ob2xkSUQpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyQW5ub3RhdGlvbihhbm5vdGF0aW9uKTtcbiAgICB9XG5cbiAgICBBbm5vdGF0aW9uc0F0VGltZSh0aW1lKXtcblxuICAgICAgICAvLyBUT0RPOiBSZWVuYWJsZSB3aXRoIHNvbWUga2luZCBvZiBmb3JjZSBwYXJhbWV0ZXJcblxuICAgICAgICAvLyAvLyBJZiB0aGUgbGFzdCB0aW1lIHJlcXVlc3RlZCBpcyBhc2tlZCBmb3IgYWdhaW4sIGp1c3QgZ2l2ZSBiYWNrIHRoZSBjYWNoZWQgcmVzdWx0XG4gICAgICAgIC8vIGlmKHRpbWVNUyA9PSB0aGlzLmxhc3RUaW1lUmVxdWVzdGVkKXtcbiAgICAgICAgLy8gICAgIC8vY29uc29sZS5sb2coXCJVc2luZyBjYWNoZVwiKTtcbiAgICAgICAgLy8gICAgIHJldHVybiB0aGlzLmNhY2hlZDtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB0aGlzLmxhc3RUaW1lUmVxdWVzdGVkID0gdGltZU1TO1xuXG4gICAgICAgIC8vIEZpbHRlciBhbGwgbG9hZGVkIGFubm90YXRpb25zIHRoYXQgZml0IHdpdGhpbiB0aGUgcmFuZ2UgcXVlcnkuXG4gICAgICAgIGxldCBmaWx0ZXJlZCA9IHRoaXMuYW5ub3RhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uYmVnaW5UaW1lIDw9IHRpbWUgJiYgdGltZSA8PSBpdGVtLmVuZFRpbWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2FjaGVkID0gZmlsdGVyZWQ7XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBBbm5vdGF0aW9uTWFuYWdlciB9OyIsIi8vLyBBIHdyYXBwZXIgZm9yIFczQyBPcGVuIEFubm90YXRpb24gSlNPTiBvYmplY3RzLlxuY2xhc3MgQW5ub3RhdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3Rvcihqc29uID0gbnVsbCl7XG4gICAgICAgIHRoaXNbXCJAY29udGV4dFwiXSA9IFwiaHR0cDovL3d3dy53My5vcmcvbnMvYW5uby5qc29ubGRcIjtcbiAgICAgICAgLy8gdGhpc1tcIkBjb250ZXh0XCJdID0gW1wiaHR0cDovL3d3dy53My5vcmcvbnMvYW5uby5qc29ubGRcIixcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIFwiaHR0cDovL2lpaWYuaW8vYXBpL3ByZXNlbnRhdGlvbi8zL2NvbnRleHQuanNvblwiXTtcbiAgICAgICAgXG4gICAgICAgIHRoaXNbXCJyZXF1ZXN0XCJdID0ge1xuICAgICAgICAgICAgXCJjbGllbnRfaWRcIjogXCJzY2FsYXJcIixcbiAgICAgICAgICAgIFwiY2xpZW50X3ZlclwiOiBcIjIuNS4xMlwiLFxuICAgICAgICAgICAgXCJpdGVtc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJuYXRpdmVcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBcIl9fQ0hFQ0tfQ09ORklHX0ZJTEVfX0lEX19cIixcbiAgICAgICAgICAgICAgICBcImFwaV9rZXlcIjogXCJfX0NIRUNLX0NPTkZJR19GSUxFX19BUElfS0VZX19cIixcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiOiBcIlRPQkVGSUxMRURcIixcbiAgICAgICAgICAgICAgICBcImZvcm1hdFwiOiBcImpzb25cIlxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vVE9ETzogdmVyMlxuICAgICAgICAvLyB0aGlzW1wic2VydmljZVwiXSA9IHtcbiAgICAgICAgLy8gICAgIFwiY2xpZW50X2lkXCI6IFwic2NhbGFyXCIsXG4gICAgICAgIC8vICAgICBcImNsaWVudF92ZXJcIjogXCIyLjUuMTJcIixcbiAgICAgICAgLy8gICAgIFwiaXRlbXNcIjoge1xuICAgICAgICAvLyAgICAgICAgIFwibmF0aXZlXCI6IGZhbHNlLFxuICAgICAgICAvLyAgICAgICAgIFwiaWRcIjogXCJfX0NIRUNLX0NPTkZJR19GSUxFX19JRF9fXCIsXG4gICAgICAgIC8vICAgICAgICAgXCJhcGlfa2V5XCI6IFwiX19DSEVDS19DT05GSUdfRklMRV9fQVBJX0tFWV9fXCIsXG4gICAgICAgIC8vICAgICAgICAgXCJhY3Rpb25cIjogXCJUT0JFRklMTEVEXCIsXG4gICAgICAgIC8vICAgICAgICAgXCJmb3JtYXRcIjogXCJqc29uXCJcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy90aGlzW1widHlwZVwiXSA9IFwiTWFuaWZlc3RcIjsgLy9UT0RPOiB2ZXIyXG4gICAgICAgIHRoaXNbXCJ0eXBlXCJdID0gXCJBbm5vdGF0aW9uXCI7IC8vVE9ETzogdmVyMVxuICAgICAgICB0aGlzW1wibW90aXZhdGlvblwiXSA9IFwiaGlnaGxpZ2h0aW5nXCI7XG5cbiAgICAgICAgdGhpc1tcImJvZHlcIl0gPSBbXTtcbiAgICAgICAgdGhpc1tcInRhcmdldFwiXSA9IHt9O1xuICAgICAgICAvL3RoaXNbXCJpdGVtc1wiXSA9IFtdOyAvL1RPRE86IHZlcjJcblxuICAgICAgICAvL2RlbGV0ZSB0aGlzLmJlZ2luVGltZTtcbiAgICAgICAgLy9kZWxldGUgdGhpcy5lbmRUaW1lO1xuICAgICAgICAvL2RlbGV0ZSB0aGlzLnRhZ3M7XG4gICAgICAgIHRoaXMucmVhZENvbmZpZygpO1xuXG4gICAgICAgIGlmKGpzb24pIHtcbiAgICAgICAgICAgIC8vIE1lcmdlIHRoZSBqc29uIGludG8gdGhpcyBjbGFzcy5cbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywganNvbik7XG5cbiAgICAgICAgICAgIC8vIENvbXB1dGUgcmVhZCBvbmx5IGVhc3kgYWNjZXNzIHByb3BlcnRpZXNcbiAgICAgICAgICAgIHRoaXMucmVjYWxjdWxhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmVhZENvbmZpZygpIHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4uL2Fubm90YXRvci1jb25maWcuanNvblwiKTtcbiAgICAgICAgLy92ZXIxXG4gICAgICAgIHRoaXNbXCJyZXF1ZXN0XCJdW1wiY2xpZW50X2lkXCJdID0gY29uZmlnLmNsaWVudF9pZDtcbiAgICAgICAgdGhpc1tcInJlcXVlc3RcIl1bXCJjbGllbnRfdmVyXCJdID0gY29uZmlnLmNsaWVudF92ZXI7XG4gICAgICAgIHRoaXNbXCJyZXF1ZXN0XCJdW1wiaXRlbXNcIl1bXCJpZFwiXSA9IGNvbmZpZy5pZDtcbiAgICAgICAgdGhpc1tcInJlcXVlc3RcIl1bXCJpdGVtc1wiXVtcImFwaV9rZXlcIl0gPSBjb25maWcuYXBpX2tleTtcblxuICAgICAgICAvL1RPRE86IFZlcjJcbiAgICAgICAgLy8gdGhpc1tcInNlcnZpY2VcIl1bXCJjbGllbnRfaWRcIl0gPSBjb25maWcuY2xpZW50X2lkO1xuICAgICAgICAvLyB0aGlzW1wic2VydmljZVwiXVtcImNsaWVudF92ZXJcIl0gPSBjb25maWcuY2xpZW50X3ZlcjtcbiAgICAgICAgLy8gdGhpc1tcInNlcnZpY2VcIl1bXCJpdGVtc1wiXVtcImlkXCJdID0gY29uZmlnLmlkO1xuICAgICAgICAvLyB0aGlzW1wic2VydmljZVwiXVtcIml0ZW1zXCJdW1wiYXBpX2tleVwiXSA9IGNvbmZpZy5hcGlfa2V5O1xuICAgIH1cblxuICAgIC8vLyBDb21wdXRlIHJlYWQgb25seSBlYXN5IGFjY2VzcyBwcm9wZXJ0aWVzXG4gICAgcmVjYWxjdWxhdGUoKSB7XG4gICAgICAgIGxldCB0aW1lU2xpY2UgPSB0aGlzLnRhcmdldC5zZWxlY3Rvci5maWx0ZXIoaXRlbSA9PiBpdGVtLnR5cGUgPT09IFwiRnJhZ21lbnRTZWxlY3RvclwiKVswXS52YWx1ZTtcbiAgICAgICAgdGltZVNsaWNlID0gdGltZVNsaWNlLnJlcGxhY2UoXCJ0PVwiLCBcIlwiKTtcblxuICAgICAgICAvLy8gU3RhcnQgdGltZSBpbiBzZWNvbmRzXG4gICAgICAgIHRoaXMuYmVnaW5UaW1lID0gcGFyc2VGbG9hdCh0aW1lU2xpY2Uuc3BsaXQoXCIsXCIpWzBdKTtcblxuICAgICAgICAvLy8gRW5kIHRpbWUgaW4gc2Vjb25kc1xuICAgICAgICB0aGlzLmVuZFRpbWUgPSBwYXJzZUZsb2F0KHRpbWVTbGljZS5zcGxpdChcIixcIilbMV0pO1xuXG4gICAgICAgIC8vLyBFeHRyYWN0IHRhZ3MgZnJvbSBhbm5vdGF0aW9uXG4gICAgICAgIHRoaXMudGFncyA9IHRoaXMuYm9keS5maWx0ZXIoaXRlbSA9PiBpdGVtLnB1cnBvc2UgPT09IFwidGFnZ2luZ1wiKS5tYXAoaXRlbSA9PiBpdGVtLnZhbHVlKTtcbiAgICB9XG5cbiAgICBnZXRQb2x5KCkge1xuICAgICAgICBsZXQgcG9pbnRzU2VsZWN0b3IgPSB0aGlzLnRhcmdldC5zZWxlY3Rvci5maWx0ZXIoaXRlbSA9PiBpdGVtLnR5cGUgPT09IFwiU3ZnU2VsZWN0b3JcIik7XG5cbiAgICAgICAgaWYocG9pbnRzU2VsZWN0b3IubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xuXG4gICAgICAgIC8vIFBhcnNlIHRoZSBwb2ludHMgYXJyYXkgZnJvbSB0aGUgYW5ub3RhdGlvblxuICAgICAgICBsZXQgcG9pbnRzU3ZnID0gcG9pbnRzU2VsZWN0b3JbMF0udmFsdWU7XG4gICAgICAgIGxldCByZWdFeFN0cmluZyA9IG5ldyBSZWdFeHAoXCIoPzpwb2ludHM9JykoLio/KSg/OicpXCIsIFwiaWdcIik7IC8vc2V0IGlnIGZsYWcgZm9yIGdsb2JhbCBzZWFyY2ggYW5kIGNhc2UgaW5zZW5zaXRpdmVcbiAgICAgICAgXG4gICAgICAgIGxldCBwb2ludHNSRSA9IHJlZ0V4U3RyaW5nLmV4ZWMocG9pbnRzU3ZnKVsxXTtcbiAgICAgICAgbGV0IHBvaW50c0RhdGEgPSBwb2ludHNSRS50cmltKCkuc3BsaXQoXCIgXCIpLm1hcChpdGVtID0+IGl0ZW0uc3BsaXQoXCIsXCIpKTtcblxuICAgICAgICByZXR1cm4gcG9pbnRzRGF0YTtcbiAgICB9XG5cbiAgICBnZXRTVkdQb2x5UG9pbnRzKCkge1xuICAgICAgICBsZXQgcG9pbnRzU2VsZWN0b3IgPSB0aGlzLnRhcmdldC5zZWxlY3Rvci5maWx0ZXIoaXRlbSA9PiBpdGVtLnR5cGUgPT09IFwiU3ZnU2VsZWN0b3JcIik7XG5cbiAgICAgICAgaWYocG9pbnRzU2VsZWN0b3IubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xuXG4gICAgICAgIC8vIFBhcnNlIHRoZSBwb2ludHMgYXJyYXkgZnJvbSB0aGUgYW5ub3RhdGlvblxuICAgICAgICBsZXQgcG9pbnRzU3ZnID0gcG9pbnRzU2VsZWN0b3JbMF0udmFsdWU7XG4gICAgICAgIGxldCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgICAgIGxldCB4bWxEb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHBvaW50c1N2ZywgXCJ0ZXh0L3htbFwiKTtcbiAgICAgICAgcmV0dXJuIFt4bWxEb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhbmltYXRlXCIpWzBdLmdldEF0dHJpYnV0ZShcImZyb21cIiksIFxuICAgICAgICB4bWxEb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhbmltYXRlXCIpWzBdLmdldEF0dHJpYnV0ZShcInRvXCIpXTtcbiAgICB9XG5cbn1cblxuXG5cbmV4cG9ydCB7IEFubm90YXRpb24gfTsiLCJpbXBvcnQgeyBTZXJ2ZXJJbnRlcmZhY2UgfSBmcm9tIFwiLi9zZXJ2ZXItaW50ZXJmYWNlLmpzXCI7XG5pbXBvcnQgeyBBbm5vdGF0aW9uTWFuYWdlciB9IGZyb20gXCIuL2Fubm90YXRpb24tbWFuYWdlci5qc1wiO1xuaW1wb3J0IHsgVGlja0JhciB9IGZyb20gXCIuL2NvbXBvbmVudHMvdGljay1iYXIuanNcIjtcbmltcG9ydCB7IFBvbHlnb25PdmVybGF5IH0gZnJvbSBcIi4vY29tcG9uZW50cy9wb2x5Z29uLW92ZXJsYXkuanNcIjtcbmltcG9ydCB7IHByZWZlcmVuY2VzIH0gZnJvbSBcIi4uL3V0aWxzL3ByZWZlcmVuY2UtbWFuYWdlci5qc1wiO1xuaW1wb3J0IHsgQW5ub3RhdGlvbkdVSSB9IGZyb20gXCIuL2NvbXBvbmVudHMvYW5ub3RhdGlvbi1ndWkuanNcIjtcbmltcG9ydCB7IEluZm9Db250YWluZXIgfSBmcm9tIFwiLi9jb21wb25lbnRzL2luZm8tY29udGFpbmVyLmpzXCI7XG5pbXBvcnQgeyBJbmRleENvbnRhaW5lciB9IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXgtY29udGFpbmVyLmpzXCI7XG5pbXBvcnQgeyBTZXNzaW9uTWFuYWdlciB9IGZyb20gXCIuL3Nlc3Npb24tbWFuYWdlci5qc1wiO1xuaW1wb3J0IHsgTWVzc2FnZU92ZXJsYXkgfSBmcm9tIFwiLi9jb21wb25lbnRzL21lc3NhZ2Utb3ZlcmxheS5qc1wiO1xuaW1wb3J0IHsgQW5ub3RhdGlvbiB9IGZyb20gXCIuL2Fubm90YXRpb24uanNcIjtcbmxldCBzaGExID0gcmVxdWlyZSgnc2hhMScpO1xuXG5jbGFzcyBWaWRlb0Fubm90YXRvciB7XG4gICAgY29uc3RydWN0b3IoYXJncyl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1ZpZGVvQW5ub3RhdG9yXSBDcmVhdGluZyBWaWRlb0Fubm90YXRvci4uLlwiKTtcblxuICAgICAgICAvL1BhcnNlIGFyZ3VtZW50c1xuICAgICAgICAvL1RoaXMgaXMgYWN0dWFsbHkgcmVxdWlyZWRcbiAgICAgICAgaWYodHlwZW9mIGFyZ3MucGxheWVyID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FsbGVkIGZvciBhIG5ldyBWaWRlb0Fubm90YXRvciB3aXRob3V0IHBhc3NpbmcgYSBwbGF5ZXIhJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wbGF5ZXIgPSAgYXJncy5wbGF5ZXI7XG4gICAgICAgIFxuXG4gICAgICAgIC8vVGhlc2UgY29uZmlnIG9wdGlvbnMgYXJlIHJlcXVpcmVkIGZvciBzYXZpbmcgYW5ub3RhdGlvbnMgdG8gYSBzZXJ2ZXJcbiAgICAgICAgdGhpcy5zZXJ2ZXJVUkwgPSB0eXBlb2YgYXJncy5zZXJ2ZXJVUkwgPT09ICd1bmRlZmluZWQnID8gJycgOiBhcmdzLnNlcnZlclVSTDtcbiAgICAgICAgdGhpcy50YWdzVVJMID0gdHlwZW9mIGFyZ3MudGFnc1VSTCA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IGFyZ3MudGFnc1VSTDtcbiAgICAgICAgdGhpcy5hcGlLZXkgPSB0eXBlb2YgYXJncy5hcGlLZXkgPT09ICd1bmRlZmluZWQnID8gJycgOiBhcmdzLmFwaUtleTtcblxuICAgICAgICAvL0lmIGFwaUtleSBpcyBzZXQgYW5kIGNtc1VzZXJuYW1lIGFuZCBjbXNFbWFpbCBhcmUgcGFzc2VkLCB3ZSdsbCBhdXRvIGxvZ2luIGxhdGVyXG4gICAgICAgIHRoaXMuY21zVXNlcm5hbWUgPSB0eXBlb2YgYXJncy5jbXNVc2VybmFtZSA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IGFyZ3MuY21zVXNlcm5hbWU7XG4gICAgICAgIHRoaXMuY21zRW1haWwgPSB0eXBlb2YgYXJncy5jbXNFbWFpbCA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IGFyZ3MuY21zRW1haWw7XG5cbiAgICAgICAgLy9UaGlzIGNvbmZpZyBvcHRpb24gaXMgcmVxdWlyZWQgZm9yIHVzaW5nIGEgc3RhdGljIGFubm90YXRpb24gZmlsZVxuICAgICAgICB0aGlzLmxvY2FsVVJMID0gdHlwZW9mIGFyZ3MubG9jYWxVUkwgPT09ICd1bmRlZmluZWQnID8gJycgOiBhcmdzLmxvY2FsVVJMO1xuXG4gICAgICAgIC8vT3B0aW9uYWwgcGFyYW1zXG4gICAgICAgIC8vUmVtb3ZlcyB0aGUgZWRpdGluZyBpbnRlcmZhY2VcbiAgICAgICAgdGhpcy5raW9za01vZGUgPSB0eXBlb2YgYXJncy5raW9za01vZGUgPT09ICd1bmRlZmluZWQnID8gJycgOiBhcmdzLmtpb3NrTW9kZTtcbiAgICAgICAgLy9TaG93cyB0aGUgJ29wZW4gbWFuaWZlc3QnIGJ1dHRvbiBpZiBraW9za01vZGUgaXMgb2ZmXG4gICAgICAgIHRoaXMuc2hvd01hbmlmZXN0ID0gdHlwZW9mIGFyZ3Muc2hvd01hbmlmZXN0ID09PSAndW5kZWZpbmVkJyA/IGZhbHNlIDogYXJncy5zaG93TWFuaWZlc3Q7ICAgICAgICBcbiAgICAgICAgLy9BbGxvd3MgcGFzc2luZyBpbiBhIGZ1bmN0aW9uIHRoYXQgb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IGFubm90YXRpb24gcmVuZGVyZXJcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IHR5cGVvZiBhcmdzLnJlbmRlcmVyID09PSAndW5kZWZpbmVkJyA/IGZhbHNlIDogYXJncy5yZW5kZXJlcjtcbiAgICAgICAgLy9BbGxvd3MgcGFzc2luZyBpbiBhIGZ1bmN0aW9uIHRoYXQgb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IGFubm90YXRpb24gcmVuZGVyZXJcbiAgICAgICAgdGhpcy51bnJlbmRlcmVyID0gdHlwZW9mIGFyZ3MudW5yZW5kZXJlciA9PT0gJ3VuZGVmaW5lZCcgPyBmYWxzZSA6IGFyZ3MudW5yZW5kZXJlcjtcbiAgICAgICAgLy9EZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBhbm5vdGF0aW9uIGNvbnRhaW5lciBpcyBjbGVhcmVkIGV2ZXJ5IHRpbWUgaXQgdXBkYXRlc1xuICAgICAgICB0aGlzLmNsZWFyQ29udGFpbmVyID0gdHlwZW9mIGFyZ3MuY2xlYXJDb250YWluZXIgPT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IGFyZ3MuY2xlYXJDb250YWluZXI7XG4gICAgICAgIC8vRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0byBjcmVhdGUgYSBuYXZpZ2FibGUgaW5kZXggb2YgYW5ub3RhdGlvbnNcbiAgICAgICAgdGhpcy5kaXNwbGF5SW5kZXggPSB0eXBlb2YgYXJncy5kaXNwbGF5SW5kZXggPT09ICd1bmRlZmluZWQnID8gZmFsc2UgOiBhcmdzLmRpc3BsYXlJbmRleDsgICBcbiAgICAgICAgXG4gICAgICAgIC8vRGV0ZXJtaW5lIHRoZSBsYW5ndWFnZSBvZiB0aGUgYW5ub3RhdGlvblxuICAgICAgICB0aGlzLm9ub215TGFuZ3VhZ2UgPSB0eXBlb2YgYXJncy5vbm9teUxhbmd1YWdlID09PSAndW5kZWZpbmVkJyA/ICcnIDogYXJncy5vbm9teUxhbmd1YWdlO1xuXG5cblxuICAgICAgICAvL2xvY2FsVVJMIGltcGxpZXMga2lvc2sgbW9kZVxuICAgICAgICBpZih0aGlzLmxvY2FsVVJMICE9ICcnKSB0aGlzLmtpb3NrTW9kZSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5XcmFwKCk7XG4gICAgICAgIHRoaXMuUG9wdWxhdGVDb250cm9scygpO1xuXG4gICAgICAgIC8vbWF5IG5lZWQgdG8gbW92ZSB0aGlzIGJlbG93IHRoZSB0aGlzLnNlcnZlciBibG9jayBsYXRlcj9cbiAgICAgICAgdGhpcy5tZXNzYWdlT3ZlcmxheSA9IG5ldyBNZXNzYWdlT3ZlcmxheSh0aGlzKTtcbiAgICAgICAgdGhpcy5hbm5vdGF0aW9uTWFuYWdlciA9IG5ldyBBbm5vdGF0aW9uTWFuYWdlcigpO1xuICAgICAgICB0aGlzLnNlc3Npb25NYW5hZ2VyID0gbmV3IFNlc3Npb25NYW5hZ2VyKHRoaXMpO1xuXG4gICAgICAgIC8vbG9jYWxVUkwgdGFrZXMgcHJlY2VuZGVuY2UgLSBpZiBpdCBpcyBhbnl0aGluZyBidXQgJycgdGhlbiBkbyBub3QgbG9hZCBmcm9tIHNlcnZlclxuICAgICAgICBpZih0aGlzLmxvY2FsVVJMID09ICcnKXtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyID0gbmV3IFNlcnZlckludGVyZmFjZSh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLlNldEJhc2VVUkwodGhpcy5zZXJ2ZXJVUkwpO1xuXG4gICAgICAgICAgICAvLyBMb2FkIGFubm90YXRpb25zIGZyb20gc2VydmVyIGJhc2VkIG9uIHRoZSBwbGF5ZXIncyB2aWRlbyBVUkxcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLkZldGNoQW5ub3RhdGlvbnMoJ2xvY2F0aW9uJywgdGhpcy5wbGF5ZXIudmlkZW9FbGVtZW50LmN1cnJlbnRTcmMpXG4gICAgICAgICAgICAuZG9uZSgoanNvbik9PntcbiAgICAgICAgICAgIFx0Ly9qc29uLnNoaWZ0KCkgIC8vIEFzc3VtZSBmaXJzdCBub2RlIGlzIGEgY29udGVudCBub2RlXG4gICAgICAgICAgICBcdGZvciAodmFyIGogPSBqc29uLmxlbmd0aC0xOyBqID49IDA7IGotLSkge1xuICAgICAgICAgICAgICAgICAgICBpZihqc29uW2pdLnR5cGUgIT0gXCJBbm5vdGF0aW9uXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5zcGxpY2UoaiwxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFx0XHQgICAgZm9yICh2YXIgayA9IDA7IGsgPCBqc29uW2pdLnRhcmdldC5zZWxlY3Rvci5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgXHRcdFx0ICAgIGlmICgnRnJhZ21lbnRTZWxlY3RvcicgIT0ganNvbltqXS50YXJnZXQuc2VsZWN0b3Jba10udHlwZSkgY29udGludWU7XG4gICAgICAgICAgICBcdFx0XHQgICAganNvbltqXS50YXJnZXQuc2VsZWN0b3Jba10udmFsdWUgPSBqc29uW2pdLnRhcmdldC5zZWxlY3RvcltrXS52YWx1ZS5yZXBsYWNlKCcjdD1ucHQ6JywndD0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXHR9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFubm90YXRpb25NYW5hZ2VyLlBvcHVsYXRlRnJvbUpTT04oanNvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5Bbm5vdGF0aW9uc0xvYWRlZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vYXV0by1sb2dpbiBpZiBub3QgaW4ga2lvc2sgbW9kZSwgYW5kIHdlIGhhdmUgdGhlIGNtcyB2YXJpYWJsZXMgYW5kIEFQSSBrZXlcbiAgICAgICAgICAgIGlmKCF0aGlzLmtpb3NrTW9kZSl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5hcGlLZXkgJiYgdGhpcy5jbXNFbWFpbCAmJiB0aGlzLmNtc1VzZXJuYW1lKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuTG9nT3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLkxvZ0luKHRoaXMuY21zVXNlcm5hbWUsIHNoYTEodGhpcy5jbXNFbWFpbCkpLmRvbmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTWFpbl0gQ01TIGxvZ2luIHN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pLmZhaWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTWFpbl0gQ01TIGxvZ2luIGZhaWxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyBsb2NhbCBjYWNoZSBmaWxlOiAnICsgdGhpcy5sb2NhbFVSTCk7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogdGhpcy5sb2NhbFVSTCxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxuICAgICAgICAgICAgfSkuZG9uZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBGZXRjaGVkICR7ZGF0YS5sZW5ndGh9IGFubm90YXRpb25zIGZyb20gbG9jYWwgY2FjaGUuYCk7XG4gICAgICAgICAgICAgICAgdmFyIGpzb24gPSBkYXRhO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBqc29uLmxlbmd0aC0xOyBqID49IDA7IGotLSkge1xuICAgICAgICAgICAgICAgICAgICBpZihqc29uW2pdLnR5cGUgIT0gXCJBbm5vdGF0aW9uXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5zcGxpY2UoaiwxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFx0XHQgICAgZm9yICh2YXIgayA9IDA7IGsgPCBqc29uW2pdLnRhcmdldC5zZWxlY3Rvci5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgXHRcdFx0ICAgIGlmICgnRnJhZ21lbnRTZWxlY3RvcicgIT0ganNvbltqXS50YXJnZXQuc2VsZWN0b3Jba10udHlwZSkgY29udGludWU7XG4gICAgICAgICAgICBcdFx0XHQgICAganNvbltqXS50YXJnZXQuc2VsZWN0b3Jba10udmFsdWUgPSBqc29uW2pdLnRhcmdldC5zZWxlY3RvcltrXS52YWx1ZS5yZXBsYWNlKCcjdD1ucHQ6JywndD0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXHR9XG4gICAgICAgICAgICAgICAgdGhpcy5hbm5vdGF0aW9uTWFuYWdlci5Qb3B1bGF0ZUZyb21KU09OKGRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMuQW5ub3RhdGlvbnNMb2FkZWQoKTtcbiAgICAgICAgICAgIH0pLmZhaWwoKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nIGFubm90YXRpb25zIGZyb20gbG9jYWwgY2FjaGVcIlxcbiR7cmVzcG9uc2UucmVzcG9uc2VKU09OLmRldGFpbH0uYCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hbm5vdGF0b3IubWVzc2FnZU92ZXJsYXkuU2hvd0Vycm9yKGBDb3VsZCBub3QgcmV0cmlldmUgYW5ub3RhdGlvbnMhPGJyPigke3Jlc3BvbnNlLnJlc3BvbnNlSlNPTi5kZXRhaWx9KWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBsYXllci4kY29udGFpbmVyLm9uKFwiT25UaW1lVXBkYXRlXCIsIChldmVudCwgdGltZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5PblRpbWVVcGRhdGUodGltZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5vbihcIk9uUG9seUNsaWNrZWRcIiwgKGV2ZW50LCBhbm5vdGF0aW9uKSA9PiB7XG4gICAgICAgICAgICAvLyBFZGl0IGEgcG9seSB3aGVuIGNsaWNrZWQsIGJ1dCBvbmx5IGlmIHRoZSBlZGl0b3IgaXNuJ3QgYWxyZWFkeSBvcGVuXG4gICAgICAgICAgICBpZighdGhpcy5ndWkub3Blbil7XG4gICAgICAgICAgICAgICAgdGhpcy4kYWRkQW5ub3RhdGlvbkJ1dHRvbi5idXR0b24oXCJkaXNhYmxlXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ3VpLkJlZ2luRWRpdGluZyhhbm5vdGF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kY29udGFpbmVyLm9uKFwiT25Qb2x5Z29uQ2xpY2tlZFwiLCAoZXZlbnQsIGFubm90YXRpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT25Qb2x5Z29uQ2xpY2tlZCBldmVudCBjYXB0dXJlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kY29udGFpbmVyLm9uKFwiT25BbmltYXRpb25DbGlja2VkXCIsIChldmVudCwgYW5ub3RhdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJPbkFuaW1hdGlvbkNsaWNrZWQgZXZlbnQgY2FwdHVyZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ3VpLiRjb250YWluZXIub24oXCJPbkdVSUNsb3NlZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuJGFkZEFubm90YXRpb25CdXR0b24uYnV0dG9uKFwiZW5hYmxlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnVybCA9IHRoaXMucGxheWVyLnZpZGVvRWxlbWVudC5jdXJyZW50U3JjO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1ZpZGVvQW5ub3RhdG9yXSBBbm5vdGF0b3IgY3JlYXRlZCBmb3IgdmlkZW8uXCIpO1xuICAgIH1cblxuXG4gICAgcmVhZENvbmZpZygpIHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4uL2Fubm90YXRvci1jb25maWcuanNvblwiKTsgXG4gICAgICAgIHRoaXMuYXBpS2V5ID0gY29uZmlnLmFwaV9rZXk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgdGhlIGRpdnMgdGhhdCBzdXJyb3VuZCB0aGUgdmlkZW8gcGxheWVyLlxuICAgICAqL1xuICAgIFdyYXAoKXtcbiAgICAgICAgLy8gV3JhcCB0aGUgdmlkZW8gcGxheWVyIHdpdGggdGhpcyBjb250YWluZXIuIENhbid0IHVzZSAud3JhcCBkdWUgdG8gZHVwbGljYXRpb24gaXNzdWVzICAgIFxuICAgICAgICB2YXIgdmlkZW9Db250YWluZXIgPSAkKHRoaXMucGxheWVyLiRjb250YWluZXIpLnBhcmVudCgpO1xuICAgICAgICB2YXIgd2FsZG9yZkNvbnRhaW5lciA9ICQoXCI8ZGl2IGNsYXNzPSd3YWxkb3JmLWNvbnRhaW5lcic+PC9kaXY+XCIpO1xuICAgICAgICB3YWxkb3JmQ29udGFpbmVyLmluc2VydEJlZm9yZSgkKHRoaXMucGxheWVyLiRjb250YWluZXIpKTtcbiAgICAgICAgd2FsZG9yZkNvbnRhaW5lci5hcHBlbmQodGhpcy5wbGF5ZXIuJGNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lciA9IHZpZGVvQ29udGFpbmVyLnBhcmVudCgpO1xuXG4gICAgICAgIC8vIFNldCB0aGUgY29udGFpbmVyIHRvIHRoZSB3aWR0aCBvZiB0aGUgdmlkZW8gcGxheWVyXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci53aWR0aCh0aGlzLnBsYXllci4kY29udGFpbmVyLndpZHRoKCkpO1xuXG4gICAgICAgIC8vIEFsbG93IHRoZSB2aWRlbyBwbGF5ZXIgY29udGFpbmVyIHRvIGdyb3dcbiAgICAgICAgLy90aGlzLnBsYXllci4kY29udGFpbmVyLndpZHRoKFwiMTAwJVwiKTtcbiAgICAgICAgLy90aGlzLnBsYXllci4kY29udGFpbmVyLmhlaWdodChcIjEwMCVcIik7XG5cbiAgICAgICAgLy8gQ29weSB0aGUgdmlkZW8gc3R5bGVzIHRvIHRoZSBjb250YWluZXJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5wbGF5ZXIub3JpZ2luYWxTdHlsZXMpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIuY3NzKHRoaXMucGxheWVyLm9yaWdpbmFsU3R5bGVzKTtcbiAgICB9XG5cbiAgICBQb3B1bGF0ZUNvbnRyb2xzKCl7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgdGljayBiYXJcbiAgICAgICAgdGhpcy50aWNrQmFyID0gbmV3IFRpY2tCYXIodGhpcyk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBwb2x5Z29uIG92ZXJsYXlcbiAgICAgICAgdGhpcy5wb2x5T3ZlcmxheSA9IG5ldyBQb2x5Z29uT3ZlcmxheSh0aGlzKTtcblxuICAgICAgICBpZighdGhpcy5raW9za01vZGUgJiYgdGhpcy5zaG93TWFuaWZlc3Qpe1xuICAgICAgICAgICAgdGhpcy4kZGVidWdDb250cm9scyA9ICQoXCI8ZGl2IGNsYXNzPSd3YWxkb3JmLWRlYnVnLWNvbnRyb2xzJz48L2Rpdj5cIikuYXBwZW5kVG8odGhpcy4kY29udGFpbmVyKTtcbiAgICAgICAgICAgIHZhciAkc2hvd0FsbEFubm90YXRpb25zQnV0dG9uID0gdGhpcy4kZGVidWdDb250cm9scy5hcHBlbmQoJzxidXR0b24+T3BlbiBBbm5vdGF0aW9uIE1hbmlmZXN0IGluIE5ldyBXaW5kb3c8L2J1dHRvbj4nKTtcbiAgICAgICAgICAgICRzaG93QWxsQW5ub3RhdGlvbnNCdXR0b24uY2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB1cmwgPSB0aGlzLnBsYXllci52aWRlb0VsZW1lbnQuY3VycmVudFNyYztcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5GZXRjaEFubm90YXRpb25zKFwibG9jYXRpb25cIiwgdXJsKS5kb25lKChqc29uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB3aW4gPSB3aW5kb3cub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICBpZih3aW4gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZG4ndCBzaG93IGFubm90YXRpb24gbWFuaWZlc3Q7IHBsZWFzZSBhbGxvdyBwb3AtdXBzLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZU92ZXJsYXkuU2hvd0Vycm9yKFwiQ291bGRuJ3Qgc2hvdyBhbm5vdGF0aW9uIG1hbmlmZXN0OyBwbGVhc2UgYWxsb3cgcG9wLXVwcy5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW4uZG9jdW1lbnQub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luLmRvY3VtZW50LndyaXRlKGA8dGl0bGU+QW5ub3RhdGlvbiBNYW5pZmVzdCBmb3IgJHt1cmx9PC90aXRsZT5gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbi5kb2N1bWVudC53cml0ZShcIjxwcmU+XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luLmRvY3VtZW50LndyaXRlKEpTT04uc3RyaW5naWZ5KGpzb24sIG51bGwsIDIpLmVzY2FwZUhUTUwoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbi5kb2N1bWVudC53cml0ZShcIjwvcHJlPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbi5kb2N1bWVudC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdyYXAgYWxsIHRoZSBidXR0b25zIHdpdGggdGhlIGxpc3QgdGFnXG4gICAgICAgIC8vdGhpcy4kZGVidWdDb250cm9scy53cmFwSW5uZXIoXCI8dWw+PC91bD5cIik7XG4gICAgICAgIC8vIFdyYXAgZWFjaCBidXR0b24gd2l0aCB0aGUgbGlzdCBlbGVtZW50IHRhZ1xuICAgICAgICAvL3RoaXMuJGRlYnVnQ29udHJvbHMuZmluZChcImJ1dHRvblwiKS53cmFwKFwiPGxpPjwvbGk+XCIpO1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgaW5mbyBjb250YWluZXJcbiAgICAgICAgdGhpcy5pbmZvQ29udGFpbmVyID0gbmV3IEluZm9Db250YWluZXIodGhpcyk7XG5cbiAgICAgICAgaWYodGhpcy5kaXNwbGF5SW5kZXgpIHRoaXMuaW5kZXhDb250YWluZXIgPSBuZXcgSW5kZXhDb250YWluZXIodGhpcyk7XG5cbiAgICAgICAgLy8gSW5qZWN0IHRoZSBhbm5vdGF0aW9uIGVkaXQgYnV0dG9uIGludG8gdGhlIHRvb2xiYXJcbiAgICAgICAgaWYoIXRoaXMua2lvc2tNb2RlKXtcbiAgICAgICAgICAgIHRoaXMuJGFkZEFubm90YXRpb25CdXR0b24gPSAkKFwiPGJ1dHRvbj5BZGQgTmV3IEFubm90YXRpb248L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgICAgICBpY29uOiBcImZhIGZhLXBsdXNcIixcbiAgICAgICAgICAgICAgICBzaG93TGFiZWw6IGZhbHNlXG4gICAgICAgICAgICB9KS5jbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy4kYWRkQW5ub3RhdGlvbkJ1dHRvbi5idXR0b24oXCJkaXNhYmxlXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ3VpLkJlZ2luRWRpdGluZygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBsYXllci5jb250cm9sQmFyLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiRhZGRBbm5vdGF0aW9uQnV0dG9uLCAzLCAnZmxleC1lbmQnKTtcblxuICAgICAgICAgICAgLy8gSW5qZWN0IHRoZSBhbm5vdGF0aW9uIHVwbG9hZCBidXR0b24gaW50byB0aGUgdG9vbGJhclxuICAgICAgICAgICAgdGhpcy4kdXBsb2FkQW5ub3RhdGlvbkJ1dHRvbiA9ICQoXCI8YnV0dG9uIHR5cGU9J2ZpbGUnPkltcG9ydCBBbm5vdGF0aW9uIEZyb20gRmlsZTwvYnV0dG9uPlwiKS5idXR0b24oe1xuICAgICAgICAgICAgICAgIGljb246IFwiZmEgZmEtdXBsb2FkXCIsXG4gICAgICAgICAgICAgICAgc2hvd0xhYmVsOiBmYWxzZVxuICAgICAgICAgICAgfSkuY2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuTG9hZEZyb21GaWxlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmNvbnRyb2xCYXIuUmVnaXN0ZXJFbGVtZW50KHRoaXMuJHVwbG9hZEFubm90YXRpb25CdXR0b24sIDIsICdmbGV4LWVuZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3VpID0gbmV3IEFubm90YXRpb25HVUkodGhpcyk7XG5cbiAgICB9XG5cbiAgICBBbm5vdGF0aW9uc0xvYWRlZCgpe1xuICAgICAgICAvL1NlbmQgYW5ub3RhdGlvbiBsb2FkZWQgZXZlbnRcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLnRyaWdnZXIoXCJPbkFubm90YXRpb25zTG9hZGVkXCIsIHRoaXMuYW5ub3RhdGlvbk1hbmFnZXIpO1xuICAgIH1cblxuICAgIE9uVGltZVVwZGF0ZSh0aW1lKXtcbiAgICAgICAgdGhpcy5hbm5vdGF0aW9uc05vdyA9IHRoaXMuYW5ub3RhdGlvbk1hbmFnZXIuQW5ub3RhdGlvbnNBdFRpbWUodGltZSk7XG5cbiAgICAgICAgaWYodGhpcy5hbm5vdGF0aW9uc05vdy5lcXVhbHModGhpcy5sYXN0QW5ub3RhdGlvblNldCkpeyAgXG4gICAgICAgICAgICB0aGlzLlNldEFubm90YXRpb25UaW1lUG9zaXRpb24odGltZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gXG4gICAgICAgIHRoaXMubGFzdEFubm90YXRpb25TZXQgPSB0aGlzLmFubm90YXRpb25zTm93O1xuXG4gICAgICAgIHRoaXMuVXBkYXRlVmlld3MoKTtcbiAgICB9XG5cbiAgICBTZXRBbm5vdGF0aW9uVGltZVBvc2l0aW9uKHRpbWUpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwidGltZTogXCIgKyB0aW1lKTtcbiAgICAgICAgLy9DaGVjayBzYWZhcmkgYW5kIG11bHRpcGxlIGdlb21ldHJpYyBhbm5vdGF0aW9uXG4gICAgICAgIGlmICh0aGlzLklzU2FmYXJpKCkgJiYgdGhpcy5hbm5vdGF0aW9uc05vdy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBsZXQgbXNnID0gXCJNdWx0aXBsZSBnZW9tZXRyaWMgYW5ub3RhdGlvbnMgYXJlIGRldGVjdGVkLjxicj5cIjtcbiAgICAgICAgICAgIG1zZyArPSBcIlNhZmFyaSBkb2Vzbid0IHN1cHBvcnQgbXVsdGlwbGUgZ2VvbWV0cmljIGFubm90YXRpb25zLjxicj5cIjtcbiAgICAgICAgICAgIG1zZyArPSBcIkNocm9tZSBvciBGaXJlZm94IGFyZSByZWNvbW1lbmRlZC5cIjtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZU92ZXJsYXkuU2hvd01lc3NhZ2UobXNnLCAyLjApO1xuICAgICAgICAgICAgcmV0dXJuOyAvL25vIGFuaW1hdGlvbiBmb3Igc2FmYXJpIGJyb3dzZXIgd2l0aCBtdWx0aXBsZSBnZW9tZXRyaWMgYW5ub3RhdGlvblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFubm90YXRpb25zTm93Lmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgbGV0IGFubm90YXRpb25faWQgPSB0aGlzLmFubm90YXRpb25zTm93W2ldLmlkO1xuICAgICAgICAgICAgaWYgKHRoaXMucG9seU92ZXJsYXkuc3ZnRWxlbWVudHNIYXNoW2Fubm90YXRpb25faWRdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb2x5T3ZlcmxheS5zdmdFbGVtZW50c0hhc2hbYW5ub3RhdGlvbl9pZF0uYW5pbWF0ZS5iZWdpbkVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICBsZXQgdGltZV9kaWZmID0gdGltZSAtIHRoaXMuYW5ub3RhdGlvbnNOb3dbaV0uYmVnaW5UaW1lO1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50X3RpbWUgPSB0aGlzLnBvbHlPdmVybGF5LnN2Z0VsZW1lbnRzSGFzaFthbm5vdGF0aW9uX2lkXS5zdmdFbGVtZW50LmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlxcdCBpOlwiICsgaSArIFwiIChcIiArIGFubm90YXRpb25faWQgKyBcIiksIHN2ZyBjdXJyZW50X3RpbWU6XCIgKyBjdXJyZW50X3RpbWUgKyBcIiwgYW5pbWF0ZSB0aW1lX2RpZmY6IFwiICsgdGltZV9kaWZmKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBvbHlPdmVybGF5LnN2Z0VsZW1lbnRzSGFzaFthbm5vdGF0aW9uX2lkXS5zdmdFbGVtZW50LnNldEN1cnJlbnRUaW1lKGN1cnJlbnRfdGltZSArIHRpbWVfZGlmZik7XG4gICAgICAgICAgICAgICAgdGhpcy5wb2x5T3ZlcmxheS5zdmdFbGVtZW50c0hhc2hbYW5ub3RhdGlvbl9pZF0uYW5pbWF0ZS5lbmRFbGVtZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG4gICAgVXBkYXRlVmlld3MoKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImFubm90YXRvci5qczoyNjcgVXBkYXRlVmlld3NcIik7XG4gICAgICAgIHRoaXMuYW5ub3RhdGlvbnNOb3cgPSB0aGlzLmFubm90YXRpb25NYW5hZ2VyLkFubm90YXRpb25zQXRUaW1lKHRoaXMucGxheWVyLnZpZGVvRWxlbWVudC5jdXJyZW50VGltZSk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBpbmZvIGNvbnRhaW5lclxuICAgICAgICB0aGlzLmluZm9Db250YWluZXIuUmVidWlsZCh0aGlzLmFubm90YXRpb25zTm93LCB0aGlzLmNsZWFyQ29udGFpbmVyKTtcblxuICAgICAgICB0aGlzLiRjb250YWluZXIudHJpZ2dlcihcIk9uTmV3QW5ub3RhdGlvblNldFwiLCBbdGhpcy5hbm5vdGF0aW9uc05vd10pO1xuICAgICAgICB0aGlzLlNldEFubm90YXRpb25UaW1lUG9zaXRpb24odGhpcy5wbGF5ZXIudmlkZW9FbGVtZW50LmN1cnJlbnRUaW1lKTtcbiAgICB9XG5cbiAgICBHZXRBbm5vdGF0aW9ucygpe1xuICAgICAgICBsZXQgb3JkZXJlZCA9IHRoaXMuYW5ub3RhdGlvbk1hbmFnZXIuYW5ub3RhdGlvbnMuc2xpY2UoKTtcbiAgICAgICAgbGV0IG9yZGVyQnlTdGFydCA9IGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgICAgICAgbGV0IGFUaW1lID0gYS5iZWdpblRpbWU7XG4gICAgICAgICAgICBsZXQgYlRpbWUgPSBiLmJlZ2luVGltZTtcbiAgICAgICAgICAgIHJldHVybiAoKGFUaW1lIDwgYlRpbWUpID8gLTEgOiAoKGFUaW1lID4gYlRpbWUpID8gMSA6IDApKTtcbiAgICAgICAgfVxuICAgICAgICBvcmRlcmVkLnNvcnQob3JkZXJCeVN0YXJ0KTtcbiAgICAgICAgcmV0dXJuIG9yZGVyZWQ7XG4gICAgfVxuXG4gICAgUmVnaXN0ZXJOZXdBbm5vdGF0aW9uKGFubm90YXRpb24pe1xuICAgICAgICAvL2NvbnNvbGUubG9nKGFubm90YXRpb24pO1xuICAgICAgICB0aGlzLmFubm90YXRpb25NYW5hZ2VyLlJlZ2lzdGVyQW5ub3RhdGlvbihhbm5vdGF0aW9uKTtcblxuICAgICAgICAvLyBUaHJvdyBldmVudCBmb3IgbGlzdGVuaW5nIG9iamVjdHMgKGUuZy4gdGljay1iYXIpXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci50cmlnZ2VyKFwiT25Bbm5vdGF0aW9uUmVnaXN0ZXJlZFwiLCBbYW5ub3RhdGlvbl0pO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBkZXBlbmRlbnQgdmlld3NcbiAgICAgICAgdGhpcy5VcGRhdGVWaWV3cygpO1xuICAgIH1cblxuICAgIFVwZGF0ZUFubm90YXRpb24oYW5ub3RhdGlvbiwgb2xkSUQpe1xuICAgICAgICB0aGlzLmFubm90YXRpb25NYW5hZ2VyLlVwZGF0ZUFubm90YXRpb24oYW5ub3RhdGlvbiwgb2xkSUQpO1xuXG4gICAgICAgIC8vIFRocm93IGV2ZW50IGZvciBsaXN0ZW5pbmcgb2JqZWN0cyAoZS5nLiB0aWNrLWJhcilcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLnRyaWdnZXIoXCJPbkFubm90YXRpb25SZW1vdmVkXCIsIFtvbGRJRF0pO1xuICAgICAgICB0aGlzLiRjb250YWluZXIudHJpZ2dlcihcIk9uQW5ub3RhdGlvblJlZ2lzdGVyZWRcIiwgW2Fubm90YXRpb25dKTtcblxuICAgICAgICAvLyBVcGRhdGUgZGVwZW5kZW50IHZpZXdzXG4gICAgICAgIHRoaXMuVXBkYXRlVmlld3MoKTtcbiAgICB9XG5cbiAgICBEZXJlZ2lzdGVyQW5ub3RhdGlvbihhbm5vdGF0aW9uKXtcbiAgICAgICAgdGhpcy5hbm5vdGF0aW9uTWFuYWdlci5SZW1vdmVBbm5vdGF0aW9uKGFubm90YXRpb24uaWQpO1xuICAgICAgICAvL3RoaXMuYW5ub3RhdGlvbnNOb3cgPSB0aGlzLmFubm90YXRpb25NYW5hZ2VyLkFubm90YXRpb25zQXRUaW1lKHRoaXMucGxheWVyLnZpZGVvRWxlbWVudC5jdXJyZW50VGltZSk7XG5cbiAgICAgICAgLy8gVGhyb3cgZXZlbnQgZm9yIGxpc3RlbmluZyBvYmplY3RzIChlLmcuIHRpY2stYmFyKVxuICAgICAgICB0aGlzLiRjb250YWluZXIudHJpZ2dlcihcIk9uQW5ub3RhdGlvblJlbW92ZWRcIiwgW2Fubm90YXRpb24uaWRdKTtcblxuICAgICAgICAvLyBVcGRhdGUgZGVwZW5kZW50IHZpZXdzXG4gICAgICAgIHRoaXMuVXBkYXRlVmlld3MoKTtcblxuICAgIH1cblxuICAgIExvYWRGcm9tRmlsZSgpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBkaWFsb2dcbiAgICAgICAgbGV0ICRjb250YWluZXIgPSAkKFwiPGRpdiBjbGFzcz0nd2FsZG9yZi1zZXNzaW9uLW1vZGFsJyB0aXRsZT0nSW1wb3J0IEFubm90YXRpb24nPjwvZGl2PlwiKTsgLy8gT3V0ZXJtb3N0IEhUTUxcbiAgICAgICAgbGV0ICRoZWFkVGV4dCA9ICQoXCI8cCBjbGFzcz0ndmFsaWRhdGVUaXBzJz5Bbm5vdGF0aW9ucyBtdXN0IGJlIFczQyBPQSBjb21wbGlhbnQgaW4gSlNPTiBmb3JtYXQuPC9wPlwiKS5hcHBlbmRUbygkY29udGFpbmVyKTtcbiAgICAgICAgbGV0ICRlcnJvclRleHQgPSAkKFwiPHAgY2xhc3M9J3ZhbGlkYXRlVGlwcyBtb2RhbC1lcnJvci10ZXh0Jz48L3A+XCIpLmFwcGVuZFRvKCRjb250YWluZXIpO1xuICAgICAgICAkZXJyb3JUZXh0LmhpZGUoKTtcbiAgICAgICAgbGV0ICRmb3JtID0gJChcIjxmb3JtPjwvZm9ybT5cIikuYXBwZW5kVG8oJGNvbnRhaW5lcik7XG5cbiAgICAgICAgbGV0ICRpbXBvcnRGaWVsZDtcblxuICAgICAgICAkKFwiPGxhYmVsIGZvcj0naW1wb3J0RmlsZSc+U2VsZWN0IEZpbGU8L2xhYmVsPlwiKS5hcHBlbmRUbygkZm9ybSk7XG4gICAgICAgICRpbXBvcnRGaWVsZCA9ICQoXCI8aW5wdXQgdHlwZT0nZmlsZScgbmFtZT0naW1wb3J0RmlsZScgY2xhc3M9J2ZpbGUgdWktd2lkZ2V0LWNvbnRlbnQgdWktY29ybmVyLWFsbCc+XCIpLmFwcGVuZFRvKCRmb3JtKTtcbiAgICAgICAgXG4gICAgICAgICRmb3JtLndyYXBJbm5lcihcIjxmaWVsZHNldCAvPlwiKTtcblxuICAgICAgICBsZXQgZXJyb3IgPSAobWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgICRlcnJvclRleHQuaHRtbChtZXNzYWdlKTtcbiAgICAgICAgICAgICRlcnJvclRleHQuc2hvdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAkaW1wb3J0RmllbGQub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBmaWxlcyA9ICRpbXBvcnRGaWVsZC5nZXQoMCkuZmlsZXM7XG4gICAgICAgICAgICBsZXQgZnIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICAgICAgICBmci5vbmxvYWQgPSAoKGxvY2FsRmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBKU09OIGlzIG1hbGZvcm1lZCwgc2hvdyBhbiBlcnJvciBhbmQgc3RvcCBoZXJlLlxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIEpTT04ucGFyc2UobG9jYWxGaWxlLnRhcmdldC5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IoXCJKU09OIGZpbGUgaXMgbWFsZm9ybWVkIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBsb2NhbEpzb24gPSBKU09OLnBhcnNlKGxvY2FsRmlsZS50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YobG9jYWxKc29uLnRhcmdldCkhPVwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5ub3RhdGlvbiA9IG5ldyBBbm5vdGF0aW9uKGxvY2FsSnNvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuVmFsaWRhdGVBbm5vdGF0aW9uKGFubm90YXRpb24pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZW4gdGhlIEdVSSBhbmQgcG9wdWxhdGUgaXQgd2l0aCB0aGlzIGFubm90YXRpb24ncyBkYXRhLlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ndWkuQmVnaW5FZGl0aW5nKGFubm90YXRpb24sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ndWkuQ29tbWl0QW5ub3RhdGlvblRvU2VydmVyKGZ1bmN0aW9uKCl7cmV0dXJuO30pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IoXCJKU09OIGlzIGludmFsaWQhXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8bG9jYWxKc29uLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhbm5vdGF0aW9uID0gbmV3IEFubm90YXRpb24obG9jYWxKc29uW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuVmFsaWRhdGVBbm5vdGF0aW9uKGFubm90YXRpb24pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVuIHRoZSBHVUkgYW5kIHBvcHVsYXRlIGl0IHdpdGggdGhpcyBhbm5vdGF0aW9uJ3MgZGF0YS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmd1aS5CZWdpbkVkaXRpbmcoYW5ub3RhdGlvbiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ndWkuQ29tbWl0QW5ub3RhdGlvblRvU2VydmVyKChhbm5vdGF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUmVnaXN0ZXJOZXdBbm5vdGF0aW9uKGFubm90YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmd1aS5DbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IoXCJKU09OIGlzIGludmFsaWQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRkaWFsb2cuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZyLnJlYWRBc1RleHQoZmlsZXNbMF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgJGRpYWxvZyA9ICRjb250YWluZXIuZGlhbG9nKHtcbiAgICAgICAgICAgIGF1dG9PcGVuOiB0cnVlLFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkZGlhbG9nLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICRkaWFsb2cuZmluZChcImZvcm1cIilbIDAgXS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICRkaWFsb2cuZmluZChcImlucHV0XCIpLnJlbW92ZUNsYXNzKCBcInVpLXN0YXRlLWVycm9yXCIgKTtcbiAgICAgICAgICAgICAgICAvL3RoaXMuT25Nb2RhbENsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIFZhbGlkYXRlQW5ub3RhdGlvbihhbm5vdGF0aW9uKSB7XG4gICAgICAgIC8vIFRPRE86IFZhbGlkYXRlIGFubm90YXRpb24gaGVyZS4gUmV0dXJuIGZhbHNlIGlmIGFueVxuICAgICAgICAvLyByZXF1aXJlZCBwcm9wZXJ0aWVzIGFyZSBub3QgcHJlc2VudC5cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjaGVja2luZyB3aGV0aGVyIHRoZSBicm93c2VyIGlzIHNhZmFyaSBvciBub3RcbiAgICBJc1NhZmFyaSgpIHtcbiAgICAgICAgLy9yZWY6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5ODcyMTExL2RldGVjdC1zYWZhcmktYW5kLXN0b3Atc2NyaXB0XG4gICAgICAgIGxldCBpc1NhZmFyaSA9IC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICAgIHJldHVybiBpc1NhZmFyaTtcbiAgICB9XG5cblxufVxuXG5leHBvcnQgeyBWaWRlb0Fubm90YXRvciB9OyIsImltcG9ydCB7IEdldEZvcm1hdHRlZFRpbWUsIEdldFNlY29uZHNGcm9tSE1TIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3RpbWUuanNcIjtcbmltcG9ydCB7IFBvbHlnb25FZGl0b3IgfSBmcm9tIFwiLi9wb2x5Z29uLWVkaXRvci5qc1wiO1xuaW1wb3J0IHsgQW5ub3RhdGlvbiB9IGZyb20gXCIuLi9hbm5vdGF0aW9uLmpzXCI7XG5cbmNsYXNzIEFubm90YXRpb25HVUkge1xuXG4gICAgY29uc3RydWN0b3IoYW5ub3RhdG9yKXtcbiAgICAgICAgdGhpcy5hbm5vdGF0b3IgPSBhbm5vdGF0b3I7XG5cbiAgICAgICAgdGhpcy5DcmVhdGUoKTtcblxuICAgICAgICB0aGlzLm9wZW4gPSBmYWxzZTtcblxuICAgICAgICAvL0hpZGUgdGhlIGNvbnRhaW5lclxuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLiRjb250YWluZXIubWFrZVZpc2libGUoZmFsc2UpO1xuXG4gICAgICAgIHRoaXMucG9seUVkaXRvciA9IG5ldyBQb2x5Z29uRWRpdG9yKHRoaXMuYW5ub3RhdG9yKTtcblxuICAgICAgICB0aGlzLmFubm90YXRvci4kY29udGFpbmVyLm9uKFwiT25Qb2x5Z29uRWRpdGluZ0VuZGVkXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuU2V0VmlzaWJsZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMucG9seUVkaXRvci5TaG93SnVzdFBvbHlnb24oKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBDcmVhdGUoKXtcbiAgICAgICAgLypcbiAgICAgICAgICogLy9uZXcgVUlcbiAgICAgICAgICogXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiRjb250YWluZXIgPSAkKFwiPGRpdiBpZD0nY3JlYXRlLWRpYWxvZycgY2xhc3M9J3VpLXdpZGdldC1jb250ZW50IGNlbnRlcic+XCIpLmFwcGVuZFRvKHRoaXMuYW5ub3RhdG9yLnBsYXllci4kY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmRyYWdnYWJsZSgpO1xuICAgICAgICB0aGlzLiR0aXRsZSA9ICQoXCI8ZGl2IGNsYXNzPSdkaWFsb2ctdGl0bGUnPkNyZWF0ZSBBbm5vdGF0aW9uPC9kaXY+XCIpLmFwcGVuZFRvKHRoaXMuJGNvbnRhaW5lcik7XG5cbiAgICAgICAgLy8gTWFrZSBjYW5jZWwgYnV0dG9uXG4gICAgICAgIGxldCAkZXhpdEJ1dHRvbiA9ICQoXCI8YnV0dG9uPkV4aXQgQW5ub3RhdGlvbiBFZGl0aW5nPC9idXR0b24+XCIpLmJ1dHRvbih7XG4gICAgICAgICAgICBpY29uczoge3ByaW1hcnk6ICdmYSBmYS1yZW1vdmUnfSxcbiAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgICRleGl0QnV0dG9uLmNzcyhcImZsb2F0XCIsIFwicmlnaHRcIik7XG4gICAgICAgICRleGl0QnV0dG9uLmF0dHIoJ3RpdGxlJywgXCJFeGl0IGFubm90YXRpb24gZWRpdGluZ1wiKTtcbiAgICAgICAgJGV4aXRCdXR0b24uYWRkQ2xhc3MoXCJ3YWxkb3JmLWNhbmNlbC1idXR0b25cIik7XG4gICAgICAgICRleGl0QnV0dG9uLmNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9seUVkaXRvci5SZXNldFBvbHlnb25zKCk7XG4gICAgICAgICAgICB0aGlzLkNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCgkZXhpdEJ1dHRvbiwgdGhpcy4kdGl0bGUsIC0xKTtcblxuICAgICAgICB0aGlzLiR0YWJzID0gJChcIjxkaXYgaWQ9J3RhYnMnPjwvZGl2PlwiKS5hcHBlbmRUbyh0aGlzLiRjb250YWluZXIpO1xuICAgIFxuICAgICAgICBcbiAgICAgICAgbGV0ICR0YWJVSSA9ICQoXCI8dWw+PC91bD5cIik7XG4gICAgICAgIGxldCAkc3RhcnRVSSA9ICQoXCI8bGk+PGEgaHJlZj0nI3N0YXJ0X3RhYic+U3RhcnQgPC9hPjwvbGk+XCIpO1xuICAgICAgICBsZXQgJGJvZHlVSSA9ICQoXCI8bGk+PGEgaHJlZj0nI2JvZHlfdGFiJz5Cb2R5IDwvYT48L2xpPlwiKTtcbiAgICAgICAgbGV0ICRzdG9wVUkgPSAkKFwiPGxpPjxhIGhyZWY9JyNzdG9wX3RhYic+U3RvcCA8L2E+PC9saT5cIik7XG4gICAgICAgIHRoaXMuUmVnaXN0ZXJFbGVtZW50KCR0YWJVSSwgdGhpcy4kdGFicywgLTEpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCgkc3RhcnRVSSwgJHRhYlVJLCAtMSk7XG4gICAgICAgIHRoaXMuUmVnaXN0ZXJFbGVtZW50KCRib2R5VUksICR0YWJVSSwgLTEpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCgkc3RvcFVJLCAkdGFiVUksIC0xKTtcblxuICAgICAgICBsZXQgJHN0YXJ0VGFiID0gJChcIjxkaXYgaWQ9J3N0YXJ0X3RhYicgY2xhc3M9J3VpLWZpZWxkLWNvbnRhaW4nPlwiICsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8bGFiZWwgZm9yPSdzdGFydF90aW1lJz5TdGFydCBUaW1lPC9sYWJlbD48YnI+XCIgKyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9kaXY+XCIpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCgkc3RhcnRUYWIsIHRoaXMuJHRhYnMsIC0xKTtcblxuICAgICAgICAvLyBNYWtlIFwiU3RhcnQgdGltZVwiIGxhYmVsIGFuZCBmaWVsZFxuICAgICAgICB0aGlzLiR0aW1lU3RhcnRGaWVsZCA9ICQoJzxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJ0aW1lLXN0YXJ0XCIgaWQ9XCJ0aW1lLXN0YXJ0XCIgdmFsdWU9XCJcIj4nKS5hcHBlbmRUbygkc3RhcnRUYWIpO1xuICAgICAgICB0aGlzLiR0aW1lU3RhcnRGaWVsZC53aWR0aCg3Mik7XG4gICAgICAgIHRoaXMuJHRpbWVTdGFydEZpZWxkLmNzcyhcImZvbnQtZmFtaWx5XCIsIFwiQ291cmllciwgbW9ub3NwYWNlXCIpO1xuICAgICAgICB0aGlzLiR0aW1lU3RhcnRGaWVsZC5jc3MoXCJtYXJnaW4tcmlnaHRcIiwgXCIycHhcIik7XG4gICAgICAgIHRoaXMuJHRpbWVTdGFydEZpZWxkLmFkZENsYXNzKFwidWktd2lkZ2V0IHVpLXdpZGdldC1jb250ZW50IHVpLWNvcm5lci1hbGxcIik7XG4gICAgICAgIHRoaXMuJHRpbWVTdGFydEZpZWxkLmF0dHIoJ3RpdGxlJywgXCJTdGFydCB0aW1lIChoaDptbTpzcy5zcylcIik7XG4gICAgICAgIHRoaXMuJHRpbWVTdGFydEZpZWxkLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDQ2IHx8IChldmVudC5rZXlDb2RlID49IDQ4ICYmIGV2ZW50LmtleUNvZGUgPD0gNTgpKXsgLy8wLTksIHBlcmlvZCwgYW5kIGNvbG9uXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vYWRkIHN0YXJ0IG1hcmtlciBidXR0b25cbiAgICAgICAgdGhpcy4kc3RhcnRUaW1lTWFya2VyID0gJChcIjxidXR0b24gc3R5bGU9J3BhZGRpbmc6MDsgbGluZS1oZWlnaHQ6MS40Jz5TZXQgRW5kPC9idXR0b24+XCIpLmJ1dHRvbih7XG4gICAgICAgICAgICBpY29uOiBcImZhIGZhLW1hcC1tYXJrZXJcIixcbiAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgfSkuY2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kdGltZVN0YXJ0RmllbGRbMF0udmFsdWUgPSBHZXRGb3JtYXR0ZWRUaW1lKHRoaXMuYW5ub3RhdG9yLnBsYXllci52aWRlb0VsZW1lbnQuY3VycmVudFRpbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5SZWdpc3RlckVsZW1lbnQodGhpcy4kc3RhcnRUaW1lTWFya2VyLCAkc3RhcnRUYWIsIC0yKTsgICAgIFxuICAgICAgICBcbiAgICAgICAgLy9zdGFydCBwb2ludCBwb2x5Z29uIGlzIGFkZGVkXG4gICAgICAgIHRoaXMuJHN0YXJ0UG9seWdvblNldCA9ICQoXCI8YnV0dG9uIHN0eWxlPSdwYWRkaW5nOjA7IGxpbmUtaGVpZ2h0OjEuNCc+U3RhcnQgUG9seWdvbiBTZXQ8L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtY2hlY2stc3F1YXJlLW9cIixcbiAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIC8vdGhpcy4kc3RhcnRQb2x5Z29uU2V0LmNzcyhcInZpc2liaWxpdHlcIiwgXCJpbmhlcml0XCIpO1xuICAgICAgICB0aGlzLiRzdGFydFBvbHlnb25TZXQuY3NzKFwidmlzaWJpbGl0eVwiLCBcImhpZGRlblwiKTtcbiAgICAgICAgdGhpcy4kc3RhcnRQb2x5Z29uU2V0LmFkZENsYXNzKFwid2FsZG9yZi1jb25maXJtLWJ1dHRvblwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vdGhpcy5SZWdpc3RlckVsZW1lbnQodGhpcy4kc3RhcnRQb2x5Z29uU2V0LCAkc3RhcnRUYWIsIC0yKTsgXG5cbiAgICAgICAgbGV0ICRib2R5VGFiID0gJChcIjxkaXYgaWQ9J2JvZHlfdGFiJz48L2Rpdj5cIik7XG4gICAgICAgIHRoaXMuUmVnaXN0ZXJFbGVtZW50KCRib2R5VGFiLCB0aGlzLiR0YWJzLCAtMSk7XG5cbiAgICAgICAgLy8gQWRkIHRhZ3MgaW5wdXQgZmllbGRcbiAgICAgICAgdGhpcy4kdGFnc0ZpZWxkID0gJCgnPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbFwiIG11bHRpcGxlPVwibXVsdGlwbGVcIj48L3NlbGVjdD4nKTtcbiAgICAgICAgdGhpcy4kdGFnc0ZpZWxkLndpZHRoKFwiMTAwJVwiKTtcbiAgICAgICAgdGhpcy4kdGFnc0ZpZWxkLmNzcyhcIm1hcmdpbi10b3BcIiwgXCItOHB4XCIpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiR0YWdzRmllbGQsICRib2R5VGFiLCAtMSk7XG4gICAgICAgIHRoaXMuJHRhZ3NGaWVsZC5zZWxlY3QyKHtcbiAgICAgICAgICAgIHRhZ3M6IHRydWUsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJUYWdzXCIsXG4gICAgICAgICAgICBhamF4OiB0aGlzLkdldFRhZ3NRdWVyeSgpLFxuICAgICAgICAgICAgc2VsZWN0T25CbHVyOiB0cnVlLFxuICAgICAgICAgICAgLy8gQWxsb3cgbWFudWFsbHkgZW50ZXJlZCB0ZXh0IGluIGRyb3AgZG93bi5cbiAgICAgICAgICAgIGNyZWF0ZVRhZzogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBwYXJhbXMudGVybSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogcGFyYW1zLnRlcm0sXG4gICAgICAgICAgICAgICAgICAgIG5ld09wdGlvbjogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEFkZCBjdXN0b20gY2xhc3MgZm9yIGJyaW5naW5nIHRoZSBkcm9wZG93biB0byB0aGUgZnJvbnQgKGZ1bGxzY3JlZW4gZml4KVxuICAgICAgICB0aGlzLiR0YWdzRmllbGQuZGF0YSgnc2VsZWN0MicpLiRkcm9wZG93bi5hZGRDbGFzcyhcInNlbGVjdDItZHJvcGRvd24tYW5ub3RhdG9yXCIpO1xuXG4gICAgICAgIC8vIE1ha2Ugbm90ZXMgdGV4dCBmaWVsZFxuICAgICAgICB0aGlzLiR0ZXh0RmllbGQgPSAkKCc8dGV4dGFyZWEgdHlwZT1cInRleHRcIiBuYW1lPVwiYW5uby10ZXh0XCIgaWQ9XCJhbm5vLXRleHRcIiB2YWx1ZT1cIlwiIHBsYWNlaG9sZGVyPVwiTm90ZXNcIj4nKTtcbiAgICAgICAgdGhpcy4kdGV4dEZpZWxkLmNzcyhcIm1hcmdpbi10b3BcIiwgXCIycHhcIik7XG4gICAgICAgIHRoaXMuJHRleHRGaWVsZC53aWR0aChcIjk4LjUlXCIpO1xuICAgICAgICB0aGlzLiR0ZXh0RmllbGQuYWRkQ2xhc3MoXCJ1aS13aWRnZXQgdWktd2lkZ2V0LWNvbnRlbnQgdWktY29ybmVyLWFsbFwiKTtcbiAgICAgICAgdGhpcy4kdGV4dEZpZWxkLmF0dHIoJ3RpdGxlJywgJ0Fubm90YXRpb24gdGV4dCcpO1xuICAgICAgICB0aGlzLiR0ZXh0RmllbGQuY3NzKFwiZmxleC1ncm93XCIsIDIpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiR0ZXh0RmllbGQsICRib2R5VGFiLCAtMSk7XG5cbiAgICAgICAgbGV0ICRzdG9wVGFiID0gJChcIjxkaXYgaWQ9J3N0b3BfdGFiJz5cIiArIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPGxhYmVsIGZvcj0nc3RvcF90aW1lJz5TdG9wIFRpbWU8L2xhYmVsPjxicj5cIiArIFxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8L2Rpdj5cIik7XG4gICAgICAgIHRoaXMuUmVnaXN0ZXJFbGVtZW50KCRzdG9wVGFiLCB0aGlzLiR0YWJzLCAtMSk7XG5cbiAgICAgICAgLy8gTWFrZSBcIlN0YXJ0IHRpbWVcIiBsYWJlbCBhbmQgZmllbGRcbiAgICAgICAgdGhpcy4kdGltZUVuZEZpZWxkID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInRpbWUtc3RhcnRcIiBpZD1cInRpbWUtc3RhcnRcIiB2YWx1ZT1cIlwiPicpLmFwcGVuZFRvKCRzdG9wVGFiKTtcbiAgICAgICAgdGhpcy4kdGltZUVuZEZpZWxkLndpZHRoKDcyKTtcbiAgICAgICAgdGhpcy4kdGltZUVuZEZpZWxkLmNzcyhcImZvbnQtZmFtaWx5XCIsIFwiQ291cmllciwgbW9ub3NwYWNlXCIpO1xuICAgICAgICB0aGlzLiR0aW1lRW5kRmllbGQuY3NzKFwibWFyZ2luLXJpZ2h0XCIsIFwiMnB4XCIpO1xuICAgICAgICB0aGlzLiR0aW1lRW5kRmllbGQuYWRkQ2xhc3MoXCJ1aS13aWRnZXQgdWktd2lkZ2V0LWNvbnRlbnQgdWktY29ybmVyLWFsbFwiKTtcbiAgICAgICAgdGhpcy4kdGltZUVuZEZpZWxkLmF0dHIoJ3RpdGxlJywgXCJTdGFydCB0aW1lIChoaDptbTpzcy5zcylcIik7XG4gICAgICAgIHRoaXMuJHRpbWVFbmRGaWVsZC5vbigna2V5cHJlc3MnLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSA0NiB8fCAoZXZlbnQua2V5Q29kZSA+PSA0OCAmJiBldmVudC5rZXlDb2RlIDw9IDU4KSl7IC8vMC05LCBwZXJpb2QsIGFuZCBjb2xvblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2FkZCBzdGFydCBtYXJrZXIgYnV0dG9uXG4gICAgICAgIHRoaXMuJGVuZFRpbWVNYXJrZXIgPSAkKFwiPGJ1dHRvbiBzdHlsZT0ncGFkZGluZzowOyBsaW5lLWhlaWdodDoxLjQnPlNldCBFbmQ8L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtbWFwLW1hcmtlclwiLFxuICAgICAgICAgICAgc2hvd0xhYmVsOiBmYWxzZVxuICAgICAgICB9KS5jbGljaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiR0aW1lRW5kRmllbGRbMF0udmFsdWUgPSBHZXRGb3JtYXR0ZWRUaW1lKHRoaXMuYW5ub3RhdG9yLnBsYXllci52aWRlb0VsZW1lbnQuY3VycmVudFRpbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5SZWdpc3RlckVsZW1lbnQodGhpcy4kZW5kVGltZU1hcmtlciwgJHN0b3BUYWIsIC0yKTtcblxuICAgICAgICAvL3N0b3AgcG9pbnQgcG9seWdvbiBpcyBhZGRlZFxuICAgICAgICB0aGlzLiRlbmRQb2x5Z29uU2V0ID0gJChcIjxidXR0b24gc3R5bGU9J3BhZGRpbmc6MDsgbGluZS1oZWlnaHQ6MS40Jz5FbmQgUG9seWdvbiBTZXQ8L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtY2hlY2stc3F1YXJlLW9cIixcbiAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIC8vdGhpcy4kZW5kUG9seWdvblNldC5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwiaW5oZXJpdFwiKTtcbiAgICAgICAgdGhpcy4kZW5kUG9seWdvblNldC5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwiaGlkZGVuXCIpO1xuICAgICAgICAvL3RoaXMuJGVuZFBvbHlnb25TZXQuYWRkQ2xhc3MoXCJ3YWxkb3JmLWNvbmZpcm0tYnV0dG9uXCIpO1xuICAgIFxuICAgICAgICAvL0FkZCBzb21lIGVycm9yIGNoZWNraW5nLi4uXG4gICAgICAgIHRoaXMuJHRpbWVFbmRGaWVsZC5ibHVyKCgpID0+IHtcbiAgICAgICAgICAgIGxldCBlID0gJCh0aGlzLiR0aW1lRW5kRmllbGQpLnZhbCgpO1xuICAgICAgICAgICAgbGV0IHMgPSAkKHRoaXMuJHRpbWVTdGFydEZpZWxkKS52YWwoKTtcbiAgICAgICAgICAgIGlmKEdldFNlY29uZHNGcm9tSE1TKHMrMSkgPiBHZXRTZWNvbmRzRnJvbUhNUyhlKSl7XG4gICAgICAgICAgICAgICAgJCh0aGlzLiR0aW1lRW5kRmllbGQpLnZhbChHZXRGb3JtYXR0ZWRUaW1lKEdldFNlY29uZHNGcm9tSE1TKHMpKy4wMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kdGltZVN0YXJ0RmllbGQuYmx1cigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZSA9ICQodGhpcy4kdGltZUVuZEZpZWxkKS52YWwoKTtcbiAgICAgICAgICAgIGxldCBzID0gJCh0aGlzLiR0aW1lU3RhcnRGaWVsZCkudmFsKCk7XG4gICAgICAgICAgICBpZihHZXRTZWNvbmRzRnJvbUhNUyhzKzEpID4gR2V0U2Vjb25kc0Zyb21ITVMoZSkpe1xuICAgICAgICAgICAgICAgICQodGhpcy4kdGltZUVuZEZpZWxkKS52YWwoR2V0Rm9ybWF0dGVkVGltZShHZXRTZWNvbmRzRnJvbUhNUyhzKSsuMDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5SZWdpc3RlckVsZW1lbnQodGhpcy4kZW5kUG9seWdvblNldCwgJHN0b3BUYWIsIC0yKTsgXG5cbiAgICAgICAgbGV0ICRidXR0b25QYW5lbCA9ICQoXCI8ZGl2IGNsYXNzPSdidXR0b25fcGFuZWwnPjwvZGl2PlwiKS5hcHBlbmRUbyh0aGlzLiRjb250YWluZXIpO1xuXG4gICAgICAgIGxldCAkc3RhcnRUYXJnZXRMYWJlbCA9ICQoXCI8bGFiZWw+U3RhcnQgVGFyZ2V0PC9sYWJlbD48YnI+XCIpO1xuICAgICAgICAkc3RhcnRUYXJnZXRMYWJlbC5jc3MoXCJjb2xvclwiLCBcIndoaXRlXCIpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCgkc3RhcnRUYXJnZXRMYWJlbCwgJGJ1dHRvblBhbmVsLCAtMSk7XG5cbiAgICAgICAgLy9NYWtlIFwiRWRpdCBwb2x5Z29uXCIgYnV0dG9uXG4gICAgICAgIGxldCAkZWRpdFBvbHlCdXR0b24gPSAkKFwiPGJ1dHRvbj5FZGl0IFBvbHlnb248L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgICBpY29uOiBcImZhIGZhLXBlbmNpbFwiLFxuICAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgfSkuY2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgIHRoaXMuU2V0VmlzaWJsZShmYWxzZSk7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJhbm5vdGF0aW9uLWd1aTozNTMgQ3JlYXRlXCIpO1xuICAgICAgICAgICAgIHRoaXMucG9seUVkaXRvci5CZWdpbkVkaXRpbmcoKTtcbiAgICAgICAgfSk7XG4gICAgICAgICRlZGl0UG9seUJ1dHRvbi5hdHRyKCd0aXRsZScsIFwiRWRpdCBwb2x5Z29uIHRlc3QyXCIpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCgkZWRpdFBvbHlCdXR0b24sICRidXR0b25QYW5lbCwgLTEpO1xuXG4gICAgICAgIC8vIE1ha2UgZGVsZXRlIGJ1dHRvblxuICAgICAgICB0aGlzLiRkZWxldGVCdXR0b24gPSAkKFwiPGJ1dHRvbj5EZWxldGUgQW5ub3RhdGlvbjwvYnV0dG9uPlwiKS5idXR0b24oe1xuICAgICAgICAgICAgaWNvbjogXCJmYSBmYS1ib21iXCIsXG4gICAgICAgICAgICBzaG93TGFiZWw6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiRkZWxldGVCdXR0b24uY3NzKFwibWFyZ2luLXJpZ2h0XCIsIFwiMTVweFwiKTtcbiAgICAgICAgdGhpcy4kZGVsZXRlQnV0dG9uLmF0dHIoJ3RpdGxlJywgXCJEZWxldGUgYW5ub3RhdGlvblwiKTtcbiAgICAgICAgdGhpcy4kZGVsZXRlQnV0dG9uLmNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYW5ub3RhdG9yLnNlcnZlci5EZWxldGVBbm5vdGF0aW9uKHRoaXMub3JpZ2luYWxBbm5vdGF0aW9uKS5kb25lKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5ub3RhdG9yLkRlcmVnaXN0ZXJBbm5vdGF0aW9uKHRoaXMub3JpZ2luYWxBbm5vdGF0aW9uKTtcbiAgICAgICAgICAgICAgICB0aGlzLkNsb3NlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuUmVnaXN0ZXJFbGVtZW50KHRoaXMuJGRlbGV0ZUJ1dHRvbiwgJGJ1dHRvblBhbmVsLCAtMSk7XG5cblxuICAgICAgICAvLyBNYWtlIGNhbmNlbCBidXR0b25cbiAgICAgICAgbGV0ICRjYW5jZWxCdXR0b24gPSAkKFwiPGJyPjxicj48YnV0dG9uPkNhbmNlbDwvYnV0dG9uPlwiKS5idXR0b24oe1xuICAgICAgICAgICAgc2hvd0xhYmVsOiB0cnVlXG4gICAgICAgIH0pLmNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9seUVkaXRvci5SZXNldFBvbHlnb25zKCk7XG4gICAgICAgICAgICB0aGlzLkNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkY2FuY2VsQnV0dG9uLmNzcyhcImZsb2F0XCIsIFwicmlnaHRcIik7XG4gICAgICAgICRjYW5jZWxCdXR0b24uYXR0cigndGl0bGUnLCBcIkV4aXQgYW5ub3RhdGlvbiBlZGl0aW5nXCIpO1xuICAgICAgICAvLyRjYW5jZWxfYnV0dG9uLmFkZENsYXNzKFwid2FsZG9yZi1jYW5jZWwtYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCgkY2FuY2VsQnV0dG9uLCAkYnV0dG9uUGFuZWwsIC0xKTtcbiAgICAgICAgXG4gICAgICAgIC8vIE1ha2Ugc2F2ZSBidXR0b25cbiAgICAgICAgbGV0ICRzYXZlQnV0dG9uID0gJChcIjxidXR0b24+U2F2ZTwvYnV0dG9uPlwiKS5idXR0b24oe1xuICAgICAgICAgICAgc2hvd0xhYmVsOiB0cnVlXG4gICAgICAgIH0pLmNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuQ29tbWl0QW5ub3RhdGlvblRvU2VydmVyKChhbm5vdGF0aW9uLCBvbGRJRCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuZWRpdE1vZGUpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFubm90YXRvci5VcGRhdGVBbm5vdGF0aW9uKGFubm90YXRpb24sIG9sZElEKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFubm90YXRvci5SZWdpc3Rlck5ld0Fubm90YXRpb24oYW5ub3RhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucG9seUVkaXRvci5SZXNldFBvbHlnb25zKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5DbG9zZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkc2F2ZUJ1dHRvbi5jc3MoXCJmbG9hdFwiLCBcImxlZnRcIik7XG4gICAgICAgIHRoaXMuUmVnaXN0ZXJFbGVtZW50KCRzYXZlQnV0dG9uLCAkYnV0dG9uUGFuZWwsIC0xKTtcblxuICAgICAgICB0aGlzLiR0YWJzLnRhYnMoKS5hZGRDbGFzcygndWktdGFicy12ZXJ0aWNhbCcpO1xuICAgICAgICAvL2xldCAkc2NyaXB0X3NlY3Rpb24gPSAkXG4gICAgICAgIC8vdGhpcy4kY29udGFpbmVyLmhpZGUoKTtcbiAgICB9XG5cbiAgICBSZWdpc3RlckVsZW1lbnQoJGVsZW1lbnQsICRjb250YWluZXIsIG9yZGVyLCBqdXN0aWZpY2F0aW9uID0gJ2ZsZXgtc3RhcnQnKXtcbiAgICAgICAgJGVsZW1lbnQuY3NzKCdvcmRlcicsIG9yZGVyKTtcbiAgICAgICAgJGVsZW1lbnQuY3NzKCdhbGlnbi1zZWxmJywganVzdGlmaWNhdGlvbik7XG4gICAgICAgIC8vIFNldHMgZ3JvdyBbc2hyaW5rXSBbYmFzaXNdXG4gICAgICAgIC8vJGVsZW1lbnQuY3NzKCdmbGV4JywgJzAgMCBhdXRvJyk7XG4gICAgICAgICRjb250YWluZXIuYXBwZW5kKCRlbGVtZW50KTtcbiAgICB9XG5cbiAgICBTZXRWaXNpYmxlKGlzVmlzaWJsZSwgZHVyYXRpb24gPSAwKXtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmlzaWJsZSArIFwiIFwiICsgZHVyYXRpb24pO1xuICAgICAgICBpZihpc1Zpc2libGUpe1xuICAgICAgICAgICAgdGhpcy4kY29udGFpbmVyLmZhZGVUbyhkdXJhdGlvbiwgMS4wKTtcbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci5tYWtlVmlzaWJsZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci5zdG9wKHRydWUsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy4kY29udGFpbmVyLmZhZGVUbyhkdXJhdGlvbiwgMC4wKTtcbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci5tYWtlVmlzaWJsZShmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc1Zpc2libGUgPSBpc1Zpc2libGU7XG5cbiAgICB9XG5cbiAgICBUb2dnbGVPcGVuKCl7XG5cbiAgICAgICAgaWYodGhpcy5vcGVuKXtcbiAgICAgICAgICAgIHRoaXMuQ2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuT3BlbigpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBPcGVuKCl7XG4gICAgICAgIHRoaXMuU2V0VmlzaWJsZSh0cnVlKTtcbiAgICAgICAgdGhpcy5vcGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wb2x5RWRpdG9yLkRvbmUoKTtcbiAgICAgICAgLy8gRGlzYWJsZSBhdXRvZmFkaW5nIHdoZW4gdGhlIGd1aSBpcyB2aXNpYmxlXG4gICAgICAgIHRoaXMuYW5ub3RhdG9yLnBsYXllci5TZXRBdXRvRmFkZShmYWxzZSk7XG4gICAgfVxuXG4gICAgQ2xvc2UoKXtcbiAgICAgICAgdGhpcy5TZXRWaXNpYmxlKGZhbHNlKTtcbiAgICAgICAgdGhpcy5vcGVuID0gZmFsc2U7XG4gICAgICAgIHRoaXMucG9seUVkaXRvci5Eb25lKCk7XG4gICAgICAgIC8vIFJlLWVuYWJsZSBhdXRvZmFkaW5nIHdoZW4gdGhlIGd1aSBpcyBoaWRkZW5cbiAgICAgICAgdGhpcy5hbm5vdGF0b3IucGxheWVyLlNldEF1dG9GYWRlKHRydWUpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIudHJpZ2dlcihcIk9uR1VJQ2xvc2VkXCIpO1xuICAgIH1cbiAgICBcbiAgICBUb2dnbGVWaXNpYmxlKCl7XG4gICAgICAgIHRoaXMuU2V0VmlzaWJsZSghdGhpcy5pc1Zpc2libGUsIDApO1xuICAgIH1cblxuICAgIEJlZ2luRWRpdGluZyhhbm5vdGF0aW9uID0gbnVsbCwgZm9yY2VOZXcgPSBmYWxzZSl7XG4gICAgICAgIC8vIE9wZW4gdGhlIEdVSSBpZiBpdCBpc24ndCBhbHJlYWR5XG4gICAgICAgIHRoaXMuT3BlbigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImFubm90YXRpb24tZ3VpOiBCZWdpbkVkaXRpbmcgNDQ3XCIpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBvbHlFZGl0b3IuJHBvbHlnb25zKTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKGFubm90YXRpb24pO1xuXG4gICAgICAgIC8vIFBvcHVsYXRlIGRhdGEgZnJvbSB0aGUgcGFzc2VkIGluIGFubm90YXRpb25cbiAgICAgICAgaWYgKGFubm90YXRpb24gfHwgZm9yY2VOZXcpIHtcbiAgICAgICAgICAgIC8vIFBvcHVsYXRlIHRoZSBmaWVsZHMgZnJvbSB0aGUgYW5ub3RhdGlvblxuICAgICAgICAgICAgdGhpcy5lZGl0TW9kZSA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIEZsaXAgZWRpdCBtb2RlIGJhY2sgdG8gZmFsc2UgaWYgZm9yY2VOZXcuIFdlIHdhbnQgdG9cbiAgICAgICAgICAgIC8vIHBvcHVsYXRlIGZyb20gdGhlIGVudGlyZSBwYXNzZWQgaW4gYW5ub3RhdGlvbiwgYnV0IHRyZWF0XG4gICAgICAgICAgICAvLyBpdCBhcyBuZXcuXG4gICAgICAgICAgICBpZihmb3JjZU5ldykgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsQW5ub3RhdGlvbiA9IGFubm90YXRpb247XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUG9wdWxhdGVkIGZyb20gYW4gZXhpc3RpbmcgYW5ub3RhdGlvblwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFubm90YXRpb24pO1xuICAgICAgICAgICAgdGhpcy4kdGltZVN0YXJ0RmllbGQudmFsKEdldEZvcm1hdHRlZFRpbWUoYW5ub3RhdGlvbi5iZWdpblRpbWUpKTtcbiAgICAgICAgICAgIHRoaXMuJHRpbWVFbmRGaWVsZC52YWwoR2V0Rm9ybWF0dGVkVGltZShhbm5vdGF0aW9uLmVuZFRpbWUpKTtcbiAgICAgICAgICAgIHRoaXMuJHRleHRGaWVsZC52YWwoYW5ub3RhdGlvbi5ib2R5LmZpbHRlcihpdGVtID0+IGl0ZW0ucHVycG9zZSA9PSBcImRlc2NyaWJpbmdcIilbMF0udmFsdWUpO1xuICAgICAgICAgICAgLy8gUmVzZXQgdGhlIHRhZ3MgZmllbGRcbiAgICAgICAgICAgIHRoaXMuJHRhZ3NGaWVsZC52YWwoXCJcIikudHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgICAgICAgICAgIHRoaXMuJHRhZ3NGaWVsZC5maW5kKFwib3B0aW9uXCIpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBmb3IobGV0IHRhZyBvZiBhbm5vdGF0aW9uLnRhZ3Mpe1xuICAgICAgICAgICAgICAgIHRoaXMuJHRhZ3NGaWVsZC5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIit0YWcrXCInIHNlbGVjdGVkPlwiK3RhZytcIjwvb3B0aW9uPlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLiR0YWdzRmllbGQudHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wb2x5RWRpdG9yLkluaXRQb2x5KGFubm90YXRpb24uZ2V0UG9seSgpKTtcbiAgICAgICAgICAgIHRoaXMucG9seUVkaXRvci5TaG93SnVzdFBvbHlnb24oKTtcblxuICAgICAgICB9XG4gICAgICAgIC8vIEluc2VydCB0ZW1wbGF0ZSBkYXRhIGlmIG5vIGFubm90YXRpb24gaXMgZ2l2ZW5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBQb3B1bGF0ZSBmaWVsZHMgaWYgbm8gYW5ub3RhdGlvbiBpcyBnaXZlblxuICAgICAgICAgICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsQW5ub3RhdGlvbiA9IG51bGw7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUG9wdWxhdGVkIHdpdGggdGVtcGxhdGUgZGF0YVwiKTtcbiAgICAgICAgICAgIHRoaXMuJHRpbWVTdGFydEZpZWxkLnZhbChHZXRGb3JtYXR0ZWRUaW1lKHRoaXMuYW5ub3RhdG9yLnBsYXllci52aWRlb0VsZW1lbnQuY3VycmVudFRpbWUpKTtcbiAgICAgICAgICAgIHRoaXMuJHRpbWVFbmRGaWVsZC52YWwoR2V0Rm9ybWF0dGVkVGltZSh0aGlzLmFubm90YXRvci5wbGF5ZXIudmlkZW9FbGVtZW50LmR1cmF0aW9uKSk7XG4gICAgICAgICAgICB0aGlzLiR0ZXh0RmllbGQudmFsKFwiXCIpO1xuICAgICAgICAgICAgLy8gUmVzZXQgdGhlIHRhZ3MgZmllbGRcbiAgICAgICAgICAgIHRoaXMuJHRhZ3NGaWVsZC52YWwoXCJcIikudHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgICAgICAgICAgIHRoaXMuJHRhZ3NGaWVsZC5maW5kKFwib3B0aW9uXCIpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnBvbHlFZGl0b3IuSW5pdFBvbHkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1vZGlmeSBHVUkgYmFzZWQgb24gZWRpdCBtb2RlXG4gICAgICAgIGlmKHRoaXMuZWRpdE1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuJHRpdGxlLnRleHQoXCJFZGl0IEFubm90YXRpb25cIik7XG4gICAgICAgICAgICB0aGlzLiRkZWxldGVCdXR0b24uYnV0dG9uKFwiZW5hYmxlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kdGl0bGUudGV4dChcIkNyZWF0ZSBBbm5vdGF0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy4kZGVsZXRlQnV0dG9uLmJ1dHRvbihcImRpc2FibGVcIik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIENvbW1pdEFubm90YXRpb25Ub1NlcnZlcihjYWxsYmFjayl7XG4gICAgICAgIGlmKHRoaXMuZWRpdE1vZGUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGVkaXRlZCBhbm5vdGF0aW9uIHRvIHNlcnZlci4uLlwiKTtcbiAgICAgICAgICAgIHRoaXMuYW5ub3RhdG9yLnNlcnZlci5FZGl0QW5ub3RhdGlvbihjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBuZXcgYW5ub3RhdGlvbiB0byBzZXJ2ZXIuLi5cIik7XG4gICAgICAgICAgICB0aGlzLmFubm90YXRvci5zZXJ2ZXIuUG9zdEFubm90YXRpb24oY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQnVpbGQgYW4gT3BlbiBBbm5vdGF0aW9uIG9iamVjdCBmcm9tIHRoZSBkYXRhLlxuICAgIEdldEFubm90YXRpb25PYmplY3QoKXtcblxuICAgICAgICBsZXQgYW5ub3RhdGlvbiA9IG5ldyBBbm5vdGF0aW9uKHRoaXMub3JpZ2luYWxBbm5vdGF0aW9uKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInRoaXMub3JpZ2luYWxBbm5vdGF0aW9uOiBcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMub3JpZ2luYWxBbm5vdGF0aW9uKSk7IC8vcHJpbnRzIG51bGxcblxuICAgICAgICBhbm5vdGF0aW9uW1wiYm9keVwiXSA9IHRoaXMuQnVpbGRBbm5vdGF0aW9uQm9keVYxKCk7XG4gICAgICAgIGFubm90YXRpb25bXCJ0YXJnZXRcIl0gPSB0aGlzLkJ1aWxkQW5ub3RhdGlvblRhcmdldCgpO1xuICAgICAgICAvL2Fubm90YXRpb25bXCJpdGVtc1wiXSA9IHRoaXMuQnVpbGRBbm5vdGF0aW9uSXRlbXMoKTtcblxuICAgICAgICAvLyBSZWNvbXB1dGUgcmVhZC1vbmx5IGFjY2VzcyBwcm9wZXJ0aWVzIGFmdGVyIGFsbCBvdGhlciBwcm9wZXJ0aWVzIGhhdmUgYmVlbiBzZXRcbiAgICAgICAgYW5ub3RhdGlvbi5yZWNhbGN1bGF0ZSgpO1xuXG4gICAgICAgIC8vIENsb25lIHRoZSBvYmplY3Qgc28gd2UgZG9uJ3QgbW9kaWZ5IGFueXRoaW5nIGJ5IGNoYW5naW5nIHRoaXMgb2JqZWN0XG4gICAgICAgIGxldCBjbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYW5ub3RhdGlvbikpXG4gICAgICAgIHJldHVybiBjbG9uZTtcbiAgICB9XG5cbiAgICBCdWlsZEFubm90YXRpb25JdGVtcygpIHtcblxuICAgICAgICBsZXQgYnVpbGRUaW1lID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpOyAvL1wiMjAyMC0wOC0xNlQxMjowMDowMFpcIlxuICAgICAgICBsZXQgaXRlbXMgPSBbe1xuICAgICAgICAgICAgXCJpZFwiOiBcIlwiLCAvL1RPRE86IFwiYXJ0OnVybFwiIGZyb20gYW5ub3RhdGlvbiBqc29uIGZpbGVcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIkNhbnZhc1wiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogNDgwLCAvL1RPRE86XG4gICAgICAgICAgICBcIndpZHRoXCI6IDY0MCwgLy9UT0RPOlxuICAgICAgICAgICAgXCJkdXJhdGlvblwiOiAxNDMsIC8vVE9ETzpcbiAgICAgICAgICAgIFwiY29udGVudFwiOiBbe1xuICAgICAgICAgICAgICAgIFwiaWRcIjogXCJcIiwgLy9UT0RPOiBtZWRpYSBmaWxlIHJlZmVyZW5jZSBpZCAtIGNoZWNrIHRoZSBpbmNvbWluZyBhbm5vdGF0aW9uIGNvbGxlY3Rpb24gZm9yIGlkXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiVmlkZW9cIixcbiAgICAgICAgICAgICAgICBcImhlaWdodFwiOiA0ODAsIC8vVE9ETzpcbiAgICAgICAgICAgICAgICBcIndpZHRoXCI6IDY0MCwgLy9UT0RPOlxuICAgICAgICAgICAgICAgIFwiZHVyYXRpb25cIjogMTQzLCAvL1RPRE86XG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiZW5cIjogXCJJbmNlcHRpb24gQ29yZ2kgRmxvcFwiIC8vVE9ETzogXCJkY3Rlcm1zOnRpdGxlXCIgZnJvbSB0aGUgYW5ub3RhdGlvbiBqc29uIGZpbGVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICBcImVuXCI6IFwiXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIFwiaXRlbXNcIjogW3tcbiAgICAgICAgICAgICAgICBcImlkXCI6IFwiXCIsICBcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJBbm5vdGF0aW9uUGFnZVwiLFxuICAgICAgICAgICAgICAgIFwiZ2VuZXJhdG9yXCI6IFwiaHR0cDovL2dpdGh1Yi5jb20vYW52Yy9zY2FsYXJcIixcbiAgICAgICAgICAgICAgICBcImdlbmVyYXRlZFwiOiBidWlsZFRpbWUsIFxuICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIlwiLCAvL0Fubm90YXRpb24gaWQgLSBhZnRlciBzdWNjZXNzZnVsIGRhdGEgc2F2aW5nXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkFubm90YXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJnZW5lcmF0b3JcIjogXCJodHRwOi8vZ2l0aHViLmNvbS9ub3ZvbWFuY3kvd2FsZG9yZi1zY2FsYXJcIiwgLy9UT0RPOiBjb25maWcgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgXCJtb3RpdmF0aW9uXCI6IFwiaGlnaGxpZ2h0aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY3JlYXRvclwiOiB0aGlzLkJ1aWxkQ3JlYXRvclRlbXBsYXRlKCksIC8vVE9ETzogXG4gICAgICAgICAgICAgICAgICAgIFwiY3JlYXRlZFwiOiBidWlsZFRpbWUsICBcbiAgICAgICAgICAgICAgICAgICAgXCJyaWdodHNcIjogXCJodHRwczovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvNC4wL1wiLFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIFwiYm9keVwiOiB0aGlzLkJ1aWxkQW5ub3RhdGlvbkJvZHlWMigpLCAvL1RPRE86IFxuICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHRoaXMuQnVpbGRBbm5vdGF0aW9uVGFyZ2V0KClcbiAgICAgICAgICAgIH1dXG4gICAgXG4gICAgICAgIH1dO1xuXG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIC8vVE9ETzpcbiAgICBCdWlsZENyZWF0b3JUZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIlBlcnNvblwiLFxuICAgICAgICAgICAgXCJuaWNrbmFtZVwiOiBcIkpvaG4gQmVsbFwiLFxuICAgICAgICAgICAgXCJlbWFpbF9zaGExXCI6IFwiUkVNT1ZFRFwiXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL1RPRE86IGJ1aWxkIHdpdGggdGFncyBlbnRyaWVzIGZyb20gb25vbXlcbiAgICBCdWlsZEFubm90YXRpb25Cb2R5VjIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkJ1aWxkQW5ub3RhdGlvbkJvZHlWMSgpO1xuICAgIH1cblxuICAgIEJ1aWxkQW5ub3RhdGlvbkJvZHlWMSgpIHtcbiAgICAgICAgbGV0IGJvZHkgPSBbXTtcblxuICAgICAgICAvLyBCdWlsZCB0ZXh0IGRlc2NyaXB0b3JcbiAgICAgICAgbGV0IGJvZHlUZXh0ID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCIgOiBcIlRleHR1YWxCb2R5XCIsXG4gICAgICAgICAgICBcInZhbHVlXCIgOiB0aGlzLiR0ZXh0RmllbGQudmFsKCksXG4gICAgICAgICAgICBcImZvcm1hdFwiIDogXCJ0ZXh0L3BsYWluXCIsXG4gICAgICAgICAgICBcImxhbmd1YWdlXCIgOiBcImVuXCIsXG4gICAgICAgICAgICBcInB1cnBvc2VcIjogXCJkZXNjcmliaW5nXCJcbiAgICAgICAgfTtcbiAgICAgICAgYm9keS5wdXNoKGJvZHlUZXh0KTtcblxuICAgICAgICAvLyBCdWlsZCB0YWcgZGVzY3JpcHRvcnNcbiAgICAgICAgbGV0IHRhZ3MgPSB0aGlzLiR0YWdzRmllbGQuc2VsZWN0MihcImRhdGFcIikubWFwKChpdGVtKSA9PiB7IHJldHVybiBpdGVtLnRleHQ7IH0pO1xuICAgICAgICBmb3IobGV0IHRhZ1N0ciBvZiB0YWdzKXtcbiAgICAgICAgICAgIGxldCBib2R5VGFnID0ge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIlRleHR1YWxCb2R5XCIsXG4gICAgICAgICAgICAgICAgXCJwdXJwb3NlXCI6IFwidGFnZ2luZ1wiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogdGFnU3RyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBib2R5LnB1c2goYm9keVRhZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICBCdWlsZEFubm90YXRpb25UYXJnZXQoKSB7XG4gICAgICAgIGxldCB0YXJnZXQgPSB7XG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuYW5ub3RhdG9yLnVybCwgLy8gVVJMIG9mIHRoZSB2aWRlb1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiVmlkZW9cIlxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlbGVjdG9ycyA9IFtdO1xuXG4gICAgICAgIGxldCBzYWZlRW5kVGltZSA9IEdldFNlY29uZHNGcm9tSE1TKHRoaXMuJHRpbWVTdGFydEZpZWxkLnZhbCgpKTtcbiAgICAgICAgaWYoR2V0U2Vjb25kc0Zyb21ITVModGhpcy4kdGltZUVuZEZpZWxkLnZhbCgpKSA+IEdldFNlY29uZHNGcm9tSE1TKHRoaXMuJHRpbWVTdGFydEZpZWxkLnZhbCgpKSl7XG4gICAgICAgICAgICBzYWZlRW5kVGltZSA9IEdldFNlY29uZHNGcm9tSE1TKHRoaXMuJHRpbWVFbmRGaWVsZC52YWwoKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0YXJ0VGltZSA9IEdldFNlY29uZHNGcm9tSE1TKHRoaXMuJHRpbWVTdGFydEZpZWxkLnZhbCgpKTtcblxuICAgICAgICAvL0J1aWxkIFN2Z1NlbGVjdG9yXG4gICAgICAgIGlmICh0aGlzLnBvbHlFZGl0b3IuJHBvbHlnb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBwb2ludHNTdHIgPSB0aGlzLnBvbHlFZGl0b3IuJHBvbHlnb25zWzBdLm1hcChpdGVtID0+IHsgcmV0dXJuIGAke2l0ZW1bMF19LCR7aXRlbVsxXX1gIH0pLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgbGV0IGFuaW1lU3RyID0gdGhpcy5wb2x5RWRpdG9yLiRwb2x5Z29uc1sxXS5tYXAoaXRlbSA9PiB7IHJldHVybiBgJHtpdGVtWzBdfSwke2l0ZW1bMV19YCB9KS5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IFwiPHN2ZyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgcHJlc2VydmVBc3BlY3RSYXRpbz0nbm9uZSc+XCI7XG4gICAgICAgICAgICB2YWx1ZSArPSBcIjxwb2x5Z29uIHBvaW50cz0nXCIgKyBwb2ludHNTdHIgKyBcIicgLz5cIjtcbiAgICAgICAgICAgIHZhbHVlICs9IFwiPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ncG9pbnRzJyBmcm9tPSdcIiArIHBvaW50c1N0ciArIFwiJyB0bz0nXCIgKyBhbmltZVN0ciArIFwiJ1wiO1xuICAgICAgICAgICAgdmFsdWUgKz0gXCIgc3RhcnQ9J1wiICsgc3RhcnRUaW1lICsgXCInIGVuZD0nXCIgKyBzYWZlRW5kVGltZSArIFwiJyAvPlwiO1xuICAgICAgICAgICAgdmFsdWUgKz0gXCI8L3N2Zz5cIjtcblxuICAgICAgICAgICAgbGV0IHBvbHlnb25TZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJTdmdTZWxlY3RvclwiLFxuICAgICAgICAgICAgICAgIFwiY29uZm9ybXNUb1wiOiBcImh0dHA6Ly93d3cudzMub3JnL1RSL21lZGlhLWZyYWdzL1wiLCAvL2FkZGVkIGZvciB2MlxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogYCR7dmFsdWV9YCAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDg5ODcyOFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZWN0b3JzLnB1c2gocG9seWdvblNlbGVjdG9yKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gQnVpbGQgdGltZSBzZWxlY3RvclxuICAgICAgICBsZXQgdGltZVNlbGVjdG9yID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiRnJhZ21lbnRTZWxlY3RvclwiLFxuICAgICAgICAgICAgXCJjb25mb3Jtc1RvXCI6IFwiaHR0cDovL3d3dy53My5vcmcvVFIvbWVkaWEtZnJhZ3MvXCIsIC8vIFNlZSBtZWRpYSBmcmFnbWVudCBzcGVjaWZpY2F0aW9uXG4gICAgICAgICAgICBcInZhbHVlXCI6IGB0PSR7c3RhcnRUaW1lfSwke3NhZmVFbmRUaW1lfWAgLy8gVGltZSBpbnRlcnZhbCBpbiBzZWNvbmRzXG4gICAgICAgIH1cbiAgICAgICAgc2VsZWN0b3JzLnB1c2godGltZVNlbGVjdG9yKTtcblxuICAgICAgICAvLyBGaW5hbGl6ZSB0YXJnZXQgc2VjdGlvblxuICAgICAgICB0YXJnZXRbXCJzZWxlY3RvclwiXSA9IHNlbGVjdG9ycztcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIEdldFRhZ3NRdWVyeSgpe1xuICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuYW5ub3RhdG9yLm9ub215TGFuZ3VhZ2U6IFwiICsgdGhpcy5hbm5vdGF0b3Iub25vbXlMYW5ndWFnZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1cmw6IHRoaXMuYW5ub3RhdG9yLnRhZ3NVUkwsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGVsYXk6IDI1MCxcbiAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxuICAgICAgICAgICAgb25vbXlMYW5ndWFnZTogdGhpcy5hbm5vdGF0b3Iub25vbXlMYW5ndWFnZSxcbiAgICAgICAgICAgIHByb2Nlc3NSZXN1bHRzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIFBhcnNlIHRoZSBsYWJlbHMgaW50byB0aGUgZm9ybWF0IGV4cGVjdGVkIGJ5IFNlbGVjdDJcbiAgICAgICAgICAgICAgICAvLyBtdWx0aWxpbmd1YWwgdGFnc1xuICAgICAgICAgICAgICAgIGxldCBtdWx0aWxpbmd1YWxfdGFncyA9IFtdO1xuICAgICAgICAgICAgICAgIC8vbGV0IG1fY29tbWVudHMgPSB7fTtcbiAgICAgICAgICAgICAgICAvL2xldCBjb21tZW50cyA9IHt9O1xuICAgICAgICAgICAgICAgIGxldCBtX2luZGV4ID0gMTtcblxuICAgICAgICAgICAgICAgIGxldCB0YWdzID0gW107XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gMTtcbiAgICAgICAgICAgICAgICAvL2xldCByb290X2NvbW1lbnQgPSBkYXRhW1wicmRmczpjb21tZW50XCJdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgdGVybSBvZiBkYXRhW1widGVybXNcIl0pe1xuICAgICAgICAgICAgICAgICAgICAvL2lmIG9ub215TGFuZ3VhZ2UgaXMgZGVmaW5lZCBjb2xsZWN0IG11bHRpbGluZ3VhbCB0YWdzXG4gICAgICAgICAgICAgICAgICAgIC8vbGV0IHRlcm1zX2lkID0gdGVybVtcInJkZnM6YWJvdXRcIl07XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYWpheE9wdGlvbnMub25vbXlMYW5ndWFnZSAhPSAnJyAmJiB0ZXJtWydsYWJlbHMnXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgbGFiZWwgb2YgdGVybVtcImxhYmVsc1wiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB4bWxfbGFuZyA9IGxhYmVsW1wieG1sOmxhbmdcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1fbGFiZWwgPSBsYWJlbFtcInJkZnM6bGFiZWxcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHhtbF9sYW5nID09IHRoaXMuYWpheE9wdGlvbnMub25vbXlMYW5ndWFnZSAmJiBtX2xhYmVsICYmIG1fbGFiZWwudHJpbSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpbGluZ3VhbF90YWdzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IG1faW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBtX2xhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmICh0ZXJtWydjb21tZW50cyddICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGZvciAobGV0IGxhYmVsIG9mIHRlcm1bJ2NvbW1lbnRzJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgbGV0IHhtbF9sYW5nID0gbGFiZWxbXCJ4bWw6bGFuZ1wiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgbGV0IG1fY29tbWVudCA9IGxhYmVsW1wicmRmczpjb21tZW50c1wiXTsgLy9UT0RPOiBjaGFuZ2UgdG8gY29tbWVudCBhZnRlciBmaXhpbmcgT25vbXlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYgKHhtbF9sYW5nID09IHRoaXMuYWpheE9wdGlvbnMub25vbXlMYW5ndWFnZSAmJiBtX2NvbW1lbnQgJiYgbV9jb21tZW50LnRyaW0gIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgbV9jb21tZW50c1ttX2luZGV4XSA9IG1fY29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIHB1c2ggdGhlIHJvb3QgdmFsdWUgaWYgaXQgaXMgYmxhbmtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChtX2NvbW1lbnRzW21faW5kZXhdLmNvbW1lbnQgPT0gdW5kZWZpbmVkIHx8IG1fY29tbWVudHNbbV9pbmRleF0uY29tbWVudC50cmltID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBtX2NvbW1lbnRzW21faW5kZXhdID0gcm9vdF9jb21tZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtX2luZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRhZ3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0ZXJtW1wicmRmczpsYWJlbFwiXVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBsZXQgbm9kZV9jb21tZW50ID0gdGVybVtcInJkZnM6Y29tbWVudFwiXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKG5vZGVfY29tbWVudC50cmltID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIG5vZGVfY29tbWVudCA9IHJvb3RfY29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbW1lbnRzW2luZGV4XSA9IG5vZGVfY29tbWVudDtcblxuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCByZXR1cm5fdGFncyA9IG11bHRpbGluZ3VhbF90YWdzXG4gICAgICAgICAgICAgICAgaWYgKHJldHVybl90YWdzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybl90YWdzID0gdGFnc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJldHVybl90YWdzXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJldHVybl90YWdzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAvL3Jlc3VsdHM6IHRhZ3MgLSB1c2UgdGFncyB3aGVuIHRoZSBsYW5ndWFnZSBpcyBub3QgZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzOiByZXR1cm5fdGFnc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG5cblxuXG5cbn1cblxuZXhwb3J0IHsgQW5ub3RhdGlvbkdVSSB9OyIsImltcG9ydCB7IEdldEZvcm1hdHRlZFRpbWUgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdGltZS5qc1wiO1xubGV0IHNoYTEgPSByZXF1aXJlKCdzaGExJyk7XG5cbmNsYXNzIEluZGV4Q29udGFpbmVyIHtcbiAgICBjb25zdHJ1Y3Rvcihhbm5vdGF0b3Ipe1xuICAgICAgICBjb25zb2xlLmxvZyhcIltJbmRleCBDb250YWluZXJdIENyZWF0aW5nIGFubm90YXRpb24gaW5kZXhcIik7XG4gICAgICAgIHRoaXMuYW5ub3RhdG9yID0gYW5ub3RhdG9yO1xuICAgICAgICBsZXQgY29udGFpbmVyID0gJChcIi53YWxkb3JmLWluZGV4XCIpO1xuICAgICAgICBpZihjb250YWluZXIubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICB0aGlzLiRjb250YWluZXIgPSBjb250YWluZXIuZmlyc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lciA9ICQoXCI8ZGl2IGNsYXNzPSd3YWxkb3JmLWluZGV4JyBhcmlhLWxpdmU9J3BvbGl0ZScgcm9sZT0nbmF2aWdhdGlvbic+PC9kaXY+XCIpLmFwcGVuZFRvKHRoaXMuYW5ub3RhdG9yLiRjb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5ub3RhdGlvbkxpc3QgPSAkKFwiPHVsIGNsYXNzPSd3YWxkb3JmLWFubm90YXRpb24tbGlzdCcgcm9sZT0nbWVudWJhcic+PC91bD5cIikuYXBwZW5kVG8odGhpcy4kY29udGFpbmVyKTtcbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIHRoaXMuYW5ub3RhdG9yLiRjb250YWluZXIub24oXCJPbkFubm90YXRpb25zTG9hZGVkXCIsIFxuICAgICAgICAgICAgKGV2ZW50LCBhbm5vdGF0aW9uTWFuYWdlcikgPT4gdGhpcy5SZWJ1aWxkKCkpO1xuICAgICAgICB0aGlzLmFubm90YXRvci4kY29udGFpbmVyLm9uKFwiT25Bbm5vdGF0aW9uUmVnaXN0ZXJlZFwiLFxuICAgICAgICAgICAgKGV2ZW50LCBhbm5vdGF0aW9uKSA9PiB0aGlzLlJlYnVpbGQoKSk7XG4gICAgICAgIHRoaXMuYW5ub3RhdG9yLiRjb250YWluZXIub24oXCJPbkFubm90YXRpb25SZW1vdmVkXCIsXG4gICAgICAgICAgICAoZXZlbnQsIGlkKSA9PiB0aGlzLlJlYnVpbGQoKSk7ICAgICAgICAgICAgXG5cbiAgICB9XG5cbiAgICBSZWJ1aWxkKCl7XG4gICAgICAgIHRoaXMuYW5ub3RhdGlvbkxpc3QuZW1wdHkoKTtcbiAgICAgICAgLy8gaWYodGhpcy5hbm5vdGF0b3IudW5yZW5kZXJlcikgdGhpcy5hbm5vdGF0b3IudW5yZW5kZXJlcih0aGlzLmFubm90YXRvcik7XG5cbiAgICAgICAgLy8gbGV0IHBsdXJhbCA9IGFubm90YXRpb25zLmxlbmd0aCA9PSAxID8gXCJcIiA6IFwic1wiO1xuICAgICAgICAvLyBsZXQgdG90YWxBbm5vdGF0aW9ucyA9IHRoaXMuYW5ub3RhdG9yLmFubm90YXRpb25NYW5hZ2VyLmFubm90YXRpb25zLmxlbmd0aDtcbiAgICAgICAgLy8gdGhpcy4kY29udGFpbmVyLmh0bWwoYDxwPlNob3dpbmcgJHthbm5vdGF0aW9ucy5sZW5ndGh9IGFubm90YXRpb24ke3BsdXJhbH0gKCR7dG90YWxBbm5vdGF0aW9uc30gdG90YWwpLjwvcD5gKTtcblxuICAgICAgICAvLyBBZGQgZWFjaCBhbm5vdGF0aW9uIHRvIHRoZSByZWFkb3V0XG4gICAgICAgIGxldCBvcmRlcmVkID0gdGhpcy5hbm5vdGF0b3IuR2V0QW5ub3RhdGlvbnMoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmRlcmVkLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuYW5ub3RhdGlvbkxpc3QuYXBwZW5kKHRoaXMuTWFrZUNvbnRhaW5lcih0aGlzLmFubm90YXRvciwgb3JkZXJlZFtpXSwgaSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgTWFrZUNvbnRhaW5lcihhbm5vdGF0b3IsIGFubm90YXRpb24pe1xuICAgICAgICAvL1RPRE86IEFSSUEgYW5kIGdlbmVyYWwgc2NyZWVuIHJlYWRlciBjb21wYXRpYmlsaXR5XG4gICAgICAgIGxldCAkcGFuZWwgPSAkKFwiPGxpIHJvbGU9J3ByZXNlbnRhdGlvbicgZGF0YS1jcmVhdG9yPVwiK2Fubm90YXRpb24uY3JlYXRvci5lbWFpbCtcIiBkYXRhLXRhZ3M9J1wiK2Fubm90YXRpb24udGFncy5qb2luKFwiLCBcIikucmVwbGFjZShcIidcIiwgXCIlMjdcIikrXCInPjwvbGk+XCIpO1xuICAgICAgICAvL2xldCB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoYW5ub3RhdGlvbi5Bc09wZW5Bbm5vdGF0aW9uKCksIG51bGwsIDIpO1xuXG4gICAgICAgIGxldCBoZWFkZXJUZXh0ID0gR2V0Rm9ybWF0dGVkVGltZShhbm5vdGF0aW9uLmJlZ2luVGltZSkgKyBcIiAtIFwiICsgR2V0Rm9ybWF0dGVkVGltZShhbm5vdGF0aW9uLmVuZFRpbWUpO1xuIFxuICAgICAgICAvLyBBZGQgY2xpY2thYmxlIGhlYWRlciB0aGF0IGJyaW5ncyB1cCB0aGUgZWRpdCBpbnRlcmZhY2UuXG4gICAgICAgIGxldCAkaGVhZGVyID0gJChcIjxhIGhyZWY9JycgdGl0bGU9J0dvIHRvIEFubm90YXRpb24nIHJvbGU9J21lbnVpdGVtJz5cIitoZWFkZXJUZXh0K1wiPC9hPjxicj5cIik7XG4gICAgICAgICRoZWFkZXIuY2xpY2soIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGFubm90YXRvci5wbGF5ZXIudmlkZW9FbGVtZW50LmN1cnJlbnRUaW1lID0gYW5ub3RhdGlvbi5iZWdpblRpbWU7XG4gICAgICAgICAgICAvLyBpZihhbm5vdGF0b3IucGxheWVyLnZpZGVvRWxlbWVudC5hbm5vdGF0aW9uVGltZW91dCkgY2xlYXJUaW1lb3V0KGFubm90YXRvci5wbGF5ZXIudmlkZW9FbGVtZW50LmFubm90YXRpb25UaW1lb3V0KTtcbiAgICAgICAgICAgIC8vIGFubm90YXRvci5wbGF5ZXIudmlkZW9FbGVtZW50LmFubm90YXRpb25UaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy8gICAgIGFubm90YXRvci5wbGF5ZXIudmlkZW9FbGVtZW50LnBhdXNlKCl9LCAoYW5ub3RhdGlvbi5lbmRUaW1lLWFubm90YXRpb24uYmVnaW5UaW1lKSAqIDEwMDBcbiAgICAgICAgICAgIC8vICk7XG4gICAgICAgICAgICAvL2Fubm90YXRvci5wbGF5ZXIudmlkZW9FbGVtZW50LnNyYz1hbm5vdGF0b3IudXJsICsgXCIjdD1cIiArIGFubm90YXRpb24uYmVnaW5UaW1lICtcIixcIithbm5vdGF0aW9uLmVuZFRpbWU7XG4gICAgICAgICAgICAvL2Fubm90YXRvci5wbGF5ZXIudmlkZW9FbGVtZW50LnBsYXkoKTtcbiAgICAgICAgICAgIGFubm90YXRvci5wbGF5ZXIuUGxheSgpO1xuICAgICAgICAgICAgYW5ub3RhdG9yLnBsYXllci5lbmRUaW1lID0gYW5ub3RhdGlvbi5lbmRUaW1lO1xuICAgICAgICAgICAgaWYoYW5ub3RhdGlvbi5iZWdpblRpbWUrMSA+IGFubm90YXRpb24uZW5kVGltZSl7XG4gICAgICAgICAgICAgICAgYW5ub3RhdG9yLnBsYXllci5QYXVzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkcGFuZWwuYXBwZW5kKCRoZWFkZXIpO1xuICAgICAgICBsZXQgJGNvbnRlbnQgPSAkKFwiPHA+PC9wPlwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgJGNvbnRlbnQuYXBwZW5kKFwiPGI+VGV4dDogPC9iPiBcIiArIGFubm90YXRpb24uYm9keS5maWx0ZXIoaXRlbSA9PiBpdGVtLnB1cnBvc2UgPT09IFwiZGVzY3JpYmluZ1wiKVswXS52YWx1ZSk7XG4gICAgICAgICRjb250ZW50LmFwcGVuZChcIjxicj5cIik7XG4gICAgICAgICRjb250ZW50LmFwcGVuZChcIjxiPlRhZ3M6IDwvYj4gXCIgKyBhbm5vdGF0aW9uLnRhZ3Muam9pbihcIiwgXCIpKTtcbiAgICAgICAgJGNvbnRlbnQuYXBwZW5kKFwiPGJyPlwiKTtcblxuICAgICAgICAkcGFuZWwuYXBwZW5kKCRjb250ZW50KTtcbiAgICAgICAgJHBhbmVsLmFwcGVuZFRvKGFubm90YXRvci4kYW5ub3RhdGlvbkxpc3QpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygkcGFuZWwpO1xuICAgICAgICByZXR1cm4gJHBhbmVsO1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBJbmRleENvbnRhaW5lciB9OyIsImltcG9ydCB7IEdldEZvcm1hdHRlZFRpbWUgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdGltZS5qc1wiO1xubGV0IHNoYTEgPSByZXF1aXJlKCdzaGExJyk7XG5cbmNsYXNzIEluZm9Db250YWluZXIge1xuICAgIGNvbnN0cnVjdG9yKGFubm90YXRvcil7XG4gICAgICAgIHRoaXMuYW5ub3RhdG9yID0gYW5ub3RhdG9yO1xuICAgICAgICBsZXQgY29udGFpbmVyID0gJChcIi53YWxkb3JmLWluZm9cIik7XG4gICAgICAgIGlmKGNvbnRhaW5lci5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lciA9IGNvbnRhaW5lci5maXJzdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kY29udGFpbmVyID0gJChcIjxkaXYgY2xhc3M9J3dhbGRvcmYtaW5mbycgYXJpYS1saXZlPSdwb2xpdGUnIGFyaWEtYXRvbWljPSd0cnVlJz48L2Rpdj5cIikuYXBwZW5kVG8odGhpcy5hbm5vdGF0b3IuJGNvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBSZWJ1aWxkKGFubm90YXRpb25zLCBjbGVhckNvbnRhaW5lcil7XG4gICAgICAgIGlmKGNsZWFyQ29udGFpbmVyKSB0aGlzLiRjb250YWluZXIuZW1wdHkoKTtcbiAgICAgICAgaWYodGhpcy5hbm5vdGF0b3IudW5yZW5kZXJlcikgdGhpcy5hbm5vdGF0b3IudW5yZW5kZXJlcih0aGlzLmFubm90YXRvcik7XG5cbiAgICAgICAgLy8gbGV0IHBsdXJhbCA9IGFubm90YXRpb25zLmxlbmd0aCA9PSAxID8gXCJcIiA6IFwic1wiO1xuICAgICAgICAvLyBsZXQgdG90YWxBbm5vdGF0aW9ucyA9IHRoaXMuYW5ub3RhdG9yLmFubm90YXRpb25NYW5hZ2VyLmFubm90YXRpb25zLmxlbmd0aDtcbiAgICAgICAgLy8gdGhpcy4kY29udGFpbmVyLmh0bWwoYDxwPlNob3dpbmcgJHthbm5vdGF0aW9ucy5sZW5ndGh9IGFubm90YXRpb24ke3BsdXJhbH0gKCR7dG90YWxBbm5vdGF0aW9uc30gdG90YWwpLjwvcD5gKTtcblxuICAgICAgICAvLyBBZGQgZWFjaCBhbm5vdGF0aW9uIHRvIHRoZSByZWFkb3V0XG4gICAgICAgIGxldCByZW5kZXJlciA9IHRoaXMuYW5ub3RhdG9yLnJlbmRlcmVyID09PSBmYWxzZSA/IHRoaXMuTWFrZUNvbnRhaW5lciA6IHRoaXMuYW5ub3RhdG9yLnJlbmRlcmVyO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFubm90YXRpb25zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmQocmVuZGVyZXIodGhpcy5hbm5vdGF0b3IsIGFubm90YXRpb25zW2ldLCBpKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNYWtlQ29udGFpbmVyKGFubm90YXRvciwgYW5ub3RhdGlvbiwgaW5kZXgpe1xuICAgICAgICBsZXQgJHBhbmVsID0gJChcIjxwPjwvcD5cIikuYXBwZW5kVG8oJChcIjxkaXY+PC9kaXY+XCIpLmFwcGVuZFRvKGFubm90YXRvci4kY29udGFpbmVyKSk7XG4gICAgICAgIC8vbGV0IHRleHQgPSBKU09OLnN0cmluZ2lmeShhbm5vdGF0aW9uLkFzT3BlbkFubm90YXRpb24oKSwgbnVsbCwgMik7XG5cbiAgICAgICAgLy8gQWRkIGNsaWNrYWJsZSBoZWFkZXIgdGhhdCBicmluZ3MgdXAgdGhlIGVkaXQgaW50ZXJmYWNlLlxuICAgICAgICBsZXQgJGhlYWRlciA9ICQoYDxiPkFubm90YXRpb24gJHtpbmRleCArIDF9OjwvYj48YnI+YCk7XG4gICAgICAgIGlmKGFubm90YXRvci5raW9za01vZGU9PWZhbHNlKXtcbiAgICAgICAgICAgICRoZWFkZXIgPSAkKGA8YSBocmVmPScnIHRpdGxlPSdFZGl0IEFubm90YXRpb24nPjxiPkFubm90YXRpb24gJHtpbmRleCArIDF9OjwvYj48YnI+PC9hPmApO1xuICAgICAgICAgICAgJGhlYWRlci5jbGljayggKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBhbm5vdGF0b3IuZ3VpLkJlZ2luRWRpdGluZyhhbm5vdGF0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJHBhbmVsLmFwcGVuZCgkaGVhZGVyKTtcbiAgICAgICAgbGV0ICRjb250ZW50ID0gJChcIjxwPjwvcD5cIik7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgJGNvbnRlbnQuYXBwZW5kKFwiPGI+VGV4dDogPC9iPiBcIiArIGFubm90YXRpb24uYm9keS5maWx0ZXIoaXRlbSA9PiBpdGVtLnB1cnBvc2UgPT09IFwiZGVzY3JpYmluZ1wiKVswXS52YWx1ZSk7XG4gICAgICAgICRjb250ZW50LmFwcGVuZChcIjxicj5cIik7XG4gICAgICAgICRjb250ZW50LmFwcGVuZChcIjxiPlRhZ3M6IDwvYj4gXCIgKyBhbm5vdGF0aW9uLnRhZ3Muam9pbihcIiwgXCIpKTtcbiAgICAgICAgJGNvbnRlbnQuYXBwZW5kKFwiPGJyPlwiKTtcbiAgICAgICAgJGNvbnRlbnQuYXBwZW5kKFwiPGI+VGltZTogPC9iPiBcIiBcbiAgICAgICAgICAgICAgICArIEdldEZvcm1hdHRlZFRpbWUoYW5ub3RhdGlvbi5iZWdpblRpbWUpIFxuICAgICAgICAgICAgICAgICsgXCIgLSBcIiBcbiAgICAgICAgICAgICAgICArIEdldEZvcm1hdHRlZFRpbWUoYW5ub3RhdGlvbi5lbmRUaW1lKSk7XG4gICAgICAgICRjb250ZW50LmFwcGVuZChcIjxicj5cIik7XG5cbiAgICAgICAgJGNvbnRlbnQuYXBwZW5kKFwiPGI+U3VibWl0dGVkIGJ5OjwvYj48YnIgLz5cIlxuICAgICAgICAgICAgICAgICsgKGFubm90YXRpb24uY3JlYXRvciAhPSBudWxsID8gYW5ub3RhdGlvbi5jcmVhdG9yLm5pY2tuYW1lICsgJyAoJyArIGFubm90YXRpb24uY3JlYXRvci5lbWFpbCArICcpJyA6IFwidW5zcGVjaWZpZWRcIilcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgIC8vJHBhcmFncmFwaC5hcHBlbmQoXCI8c3Ryb25nPkFubm90YXRpb24gXCIgKyAoaW5kZXggKyAxKSArIFwiOjwvc3Ryb25nPjxicj48cHJlPlwiICsgdGV4dC5lc2NhcGVIVE1MKCkgKyBcIjwvcHJlPlwiKTtcblxuICAgICAgICAkcGFuZWwuYXBwZW5kKCRjb250ZW50KTtcbiAgICAgICAgcmV0dXJuICRwYW5lbDtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgSW5mb0NvbnRhaW5lciB9OyIsIlxuY2xhc3MgTWVzc2FnZU92ZXJsYXkge1xuICAgIGNvbnN0cnVjdG9yKGFubm90YXRvcil7XG4gICAgICAgIHRoaXMuYW5ub3RhdG9yID0gYW5ub3RhdG9yO1xuXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lciA9ICQoXCI8ZGl2IGNsYXNzPSd3YWxkb3JmLW1lc3NhZ2Utb3ZlcmxheSc+PC9kaXY+XCIpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIuYXBwZW5kVG8odGhpcy5hbm5vdGF0b3IucGxheWVyLiRjb250YWluZXIpO1xuXG4gICAgICAgIHRoaXMuJHRleHQgPSAkKFwiPHAgcm9sZT0nYWxlcnQnIGFyaWEtbGl2ZT0nYXNzZXJ0aXZlJyBhcmlhLWF0b21pYz0ndHJ1ZSc+PC9wPlwiKS5hcHBlbmRUbyh0aGlzLiRjb250YWluZXIpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIuZmFkZU91dCgwKTtcblxuICAgIH1cblxuICAgIFNob3dFcnJvcihtZXNzYWdlLCBkdXJhdGlvbiA9IDMuMCl7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hZGRDbGFzcyhcIndhbGRvcmYtbWVzc2FnZS1vdmVybGF5LWVycm9yXCIpO1xuXG4gICAgICAgIHRoaXMuX1Nob3dUZXh0KG1lc3NhZ2UsIGR1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBTaG93TWVzc2FnZShtZXNzYWdlLCBkdXJhdGlvbiA9IDUuMCl7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5yZW1vdmVDbGFzcyhcIndhbGRvcmYtbWVzc2FnZS1vdmVybGF5LWVycm9yXCIpO1xuXG4gICAgICAgIHRoaXMuX1Nob3dUZXh0KG1lc3NhZ2UsIGR1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBfU2hvd1RleHQobWVzc2FnZSwgZHVyYXRpb24gPSA1LjApe1xuICAgICAgICB0aGlzLiR0ZXh0Lmh0bWwobWVzc2FnZSk7XG4gICAgICAgIC8vdGhpcy4kY29udGFpbmVyLnN0b3AodHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5maW5pc2goKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLlxuICAgICAgICAgICAgZmFkZUluKDApLlxuICAgICAgICAgICAgZGVsYXkoZHVyYXRpb24gKiAxMDAwKS5cbiAgICAgICAgICAgIGZhZGVPdXQoNDAwKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgTWVzc2FnZU92ZXJsYXkgfTsiLCJcbi8qKlxuICogTWFuYWdlcyB0aGUgY3JlYXRpbmcgb3IgZWRpdGluZyBvZiBhIHNpbmdsZSBwb2x5Z29uIG9uIHRoZSB2aWRlby5cbiAqIENvbnNpc3RzIG9mIGEgdG9vbGJhciwgYW4gb3ZlcmxheSwgYW5kIHRoZSBwb2x5Z29uIGluc2lkZSB0aGUgb3ZlcmxheS5cbiAqXG4gKiBDbGljayB0byBwbGFjZSBvciByZW1vdmUgYSBkcmFnZ2FibGUgcG9pbnQuIFBvaW50cyBzaG91bGQgYmVcbiAqIHB1dCBkb3duIGluIGNsb2Nrd2lzZSBvcmRlci5cbiAqL1xuY2xhc3MgUG9seWdvbkVkaXRvciB7XG4gICAgY29uc3RydWN0b3IoYW5ub3RhdG9yKXtcbiAgICAgICAgdGhpcy5hbm5vdGF0b3IgPSBhbm5vdGF0b3I7XG4gICAgICAgIHRoaXMuYmFzZVogPSAyMTQ3NDgzNjQ5O1xuICAgICAgICB0aGlzLiRicmVhZGNydW1icyA9IFtdO1xuICAgICAgICB0aGlzLiRwb2x5Z29ucyA9IFtdO1xuICAgICAgICB0aGlzLiR0ZW1wQnJlYWRDcnVtYnMgPSBbXTtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIHZpZGVvIG92ZXJsYXlcbiAgICAgICAgdGhpcy4kY2xpY2tTdXJmYWNlID0gJChcIjxkaXYgY2xhc3M9J3dhbGRvcmYtZWRpdC1vdmVybGF5IHdhbGRvcmYtdnAtY2xpY2stc3VyZmFjZSc+PC9kaXY+XCIpLmFwcGVuZFRvKHRoaXMuYW5ub3RhdG9yLnBsYXllci4kY29udGFpbmVyKTtcbiAgICAgICAgLy90aGlzLiRjbGlja1N1cmZhY2UuY3NzKFwiei1pbmRleFwiLCB0aGlzLmJhc2VaKTtcbiAgICAgICAgdGhpcy4kY2xpY2tTdXJmYWNlLmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5PblN1cmZhY2VDbGljayhldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgcG9seSBvYmplY3QgZm9yIHN0YXJ0IHBvc2l0aW9uIHBvbHlnb25cbiAgICAgICAgdGhpcy4kc3RhcnRQb2x5ID0gXCJcIjtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgcG9seSBvYmplY3RcbiAgICAgICAgdGhpcy4kcG9seSA9ICQoXCI8ZGl2IGNsYXNzPSd3YWxkb3JmLWVkaXQtcG9seSc+PC9kaXY+XCIpLmFwcGVuZFRvKHRoaXMuYW5ub3RhdG9yLnBsYXllci4kY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy4kcG9seS5jc3MoXCJ6LWluZGV4XCIsIHRoaXMuYmFzZVogKyAxKTtcblxuICAgICAgICB0aGlzLlJlc2l6ZU92ZXJsYXkoKTtcbiAgICAgICAgdGhpcy5hbm5vdGF0b3IucGxheWVyLiRjb250YWluZXIub24oXCJPbkZ1bGxzY3JlZW5DaGFuZ2VcIiwgKGV2ZW50LCBzZXRGdWxsc2NyZWVuKSA9PiB0aGlzLlJlc2l6ZU92ZXJsYXkoKSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSB0b29sYmFyIHVwIHRvcFxuICAgICAgICB0aGlzLiRiYXIgPSAkKFwiPGRpdiBjbGFzcz0nd2FsZG9yZi12cC1wb3N0Jz48L2Rpdj5cIikuYXBwZW5kVG8odGhpcy5hbm5vdGF0b3IucGxheWVyLiRjb250YWluZXIpO1xuICAgICAgICB0aGlzLiRwb3N0VG9vbGJhciA9ICQoXCI8ZGl2IGNsYXNzPSdmbGV4LXRvb2xiYXInPjwvZGl2PlwiKS5hcHBlbmRUbyh0aGlzLiRiYXIpO1xuICAgICAgICAvLyBJbnZpc2libGUgZXhwYW5kaW5nIGRpdmlkZXJcbiAgICAgICAgLy8tMy8vdGhpcy4kcG9zdFRvb2xiYXIuYXBwZW5kKCQoXCI8ZGl2PjxwIHN0eWxlPSdjb2xvcjp3aGl0ZSc+RWRpdCBQb2x5Z29uPC9wPjwvZGl2PlwiKS5jc3MoXCJmbGV4LWdyb3dcIiwgMSkuY3NzKFwib3JkZXJcIiwgMCkpO1xuXG5cbiAgICAgICAgLy8gTWFrZSBcIkNvbGxlY3QgUG9seWdvbiBzdGF0ZVwiIGJ1dHRvblxuICAgICAgICB0aGlzLiRjYXBQb2x5QnV0dG9uID0gJChcIjxidXR0b24+Q2FwdHVyZSBQb2x5Z29uPC9idXR0b24+XCIpLmJ1dHRvbih7XG4gICAgICAgICAgICBpY29uOiBcImZhIGZhLWNhbWVyYS1yZXRyb1wiLFxuICAgICAgICAgICAgc2hvd0xhYmVsOiBmYWxzZVxuICAgICAgICB9KS5jbGljaygoKSA9PiB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2FwdHVyaW5nIHRoZSBwb2x5Z29uXCIpO1xuICAgICAgICAgICAgLy90aGlzLlNldFZpc2libGUoZmFsc2UpO1xuICAgICAgICAgICAgLy90aGlzLkdldFBvaW50cygpO1xuXG4gICAgICAgICAgICAvLyBCdWlsZCBwb2x5Z29uIHNlbGVjdG9yXG4gICAgICAgICAgICAvLyBsZXQgcG9pbnRzID0gdGhpcy5HZXRQb2ludHMoKTtcbiAgICAgICAgICAgIC8vIGlmKHBvaW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyAgICAgbGV0IHBvaW50c1N0ciA9IHBvaW50cy5tYXAoaXRlbSA9PiB7IHJldHVybiBgJHtpdGVtWzBdfSwke2l0ZW1bMV19YCB9KS5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgIC8vICAgICBsZXQgcG9seWdvblNlbGVjdG9yID0ge1xuICAgICAgICAgICAgLy8gICAgICAgICBcInR5cGVcIjogXCJTdmdTZWxlY3RvclwiLFxuICAgICAgICAgICAgLy8gICAgICAgICBcInZhbHVlXCI6IGA8c3ZnOnN2ZyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgcHJlc2VydmVBc3BlY3RSYXRpbz0nbm9uZSc+PHBvbHlnb24gcG9pbnRzPScke3BvaW50c1N0cn0nIC8+PC9zdmc6c3ZnPmAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjQ4OTg3MjhcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyAgICAgdG1wU2VsZWN0b3JzLnB1c2gocG9seWdvblNlbGVjdG9yKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidG1wU2VsZWN0b3JzXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codG1wU2VsZWN0b3JzKTtcbiAgICAgICAgICAgIHRoaXMuYW5ub3RhdG9yLkFkZFBvbHlnb25TZXQodGhpcy5hbm5vdGF0b3IuYW5ub3RhdGlvbi5nZXRQb2x5KCkpO1xuXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiRjYXBQb2x5QnV0dG9uLmNzcyhcIm1hcmdpbi1yaWdodFwiLCBcIjE1cHhcIik7XG4gICAgICAgIHRoaXMuJGNhcFBvbHlCdXR0b24uYXR0cigndGl0bGUnLCBcIkNhcHR1cmUgcG9seWdvblwiKTtcbiAgICAgICAgLy8tMy8vdGhpcy5SZWdpc3RlckVsZW1lbnQodGhpcy4kY2FwUG9seUJ1dHRvbiwgdGhpcy4kcG9zdFRvb2xiYXIsIDEsICdmbGV4LWVuZCcpO1xuXG4gICAgICAgIC8vIENyZWF0ZSB1bmRvIGJ1dHRvblxuICAgICAgICB0aGlzLiR1bmRvQnV0dG9uID0gJChcIjxidXR0b24+UmVtb3ZlIExhc3QgUG9pbnQ8L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtdW5kb1wiLFxuICAgICAgICAgICAgc2hvd0xhYmVsOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kdW5kb0J1dHRvbi5jc3MoXCJtYXJnaW4tcmlnaHRcIiwgXCIxNXB4XCIpO1xuICAgICAgICB0aGlzLiR1bmRvQnV0dG9uLmF0dHIoJ3RpdGxlJywgXCJSZW1vdmUgbGFzdCBwb2ludFwiKTtcbiAgICAgICAgdGhpcy4kdW5kb0J1dHRvbi5jbGljaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLlJlbW92ZUxhc3RCcmVhZGNydW1iKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLy0zLy90aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiR1bmRvQnV0dG9uLCB0aGlzLiRwb3N0VG9vbGJhciwgMSwgJ2ZsZXgtZW5kJyk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBjb25maXJtIGJ1dHRvblxuICAgICAgICB0aGlzLiRjb25maXJtQnV0dG9uID0gJChcIjxidXR0b24+RmluaXNoIHBvbHlnb248L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtY2hlY2tcIixcbiAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuJGNvbmZpcm1CdXR0b24uYXR0cigndGl0bGUnLCBcIkZpbmlzaCBwb2x5Z29uXCIpO1xuICAgICAgICB0aGlzLiRjb25maXJtQnV0dG9uLmFkZENsYXNzKFwid2FsZG9yZi1jb25maXJtLWJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy4kY29uZmlybUJ1dHRvbi5jbGljaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsSlNPTiA9IHRoaXMuR2V0SlNPTigpO1xuICAgICAgICAgICAgdGhpcy5Eb25lKCk7XG4gICAgICAgICAgICB0aGlzLmFubm90YXRvci4kY29udGFpbmVyLnRyaWdnZXIoXCJPblBvbHlnb25FZGl0aW5nRW5kZWRcIik7XG4gICAgICAgIH0pO1xuICAgICAgICAvLy0zLy90aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiRjb25maXJtQnV0dG9uLCB0aGlzLiRwb3N0VG9vbGJhciwgMywgJ2ZsZXgtZW5kJyk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBjYW5jZWwgYnV0dG9uXG4gICAgICAgIHRoaXMuJGNhbmNlbEJ1dHRvbiA9ICQoXCI8YnV0dG9uPkNhbmNlbCBwb2x5Z29uIGVkaXRpbmc8L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtcmVtb3ZlXCIsXG4gICAgICAgICAgICBzaG93TGFiZWw6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiRjYW5jZWxCdXR0b24uYWRkQ2xhc3MoXCJ3YWxkb3JmLWNhbmNlbC1idXR0b25cIik7XG4gICAgICAgIHRoaXMuJGNhbmNlbEJ1dHRvbi5hdHRyKCd0aXRsZScsIFwiQ2FuY2VsIHBvbHlnb24gZWRpdGluZ1wiKTtcbiAgICAgICAgdGhpcy4kY2FuY2VsQnV0dG9uLmNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIC8vUmVzdG9yZSB0aGUgb3JpZ2luYWwgc3RhdGVcbiAgICAgICAgICAgIHRoaXMuUmVzdG9yZSgpO1xuICAgICAgICAgICAgdGhpcy5Eb25lKCk7XG4gICAgICAgICAgICB0aGlzLmFubm90YXRvci4kY29udGFpbmVyLnRyaWdnZXIoXCJPblBvbHlnb25FZGl0aW5nRW5kZWRcIik7XG4gICAgICAgIH0pO1xuICAgICAgICAvLy0zLy90aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiRjYW5jZWxCdXR0b24sIHRoaXMuJHBvc3RUb29sYmFyLCAyLCAnZmxleC1lbmQnKTtcblxuICAgICAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHRoaXMuUmVzaXplT3ZlcmxheSgpKTtcblxuXG4gICAgICAgIC8qIFxuICAgICAgICAqIG5ldyBVSVxuICAgICAgICAqL1xuICAgICAgICB0aGlzLiRlZGl0RGlhbG9nID0gJChcIjxkaXYgaWQ9J2VkaXQtZGlhbG9nJyBjbGFzcz0nd2FsZG9yZi1lZGl0LW92ZXJsYXkgd2FsZG9yZi12cC1jbGljay1zdXJmYWNlJz48L2Rpdj5cIikuYXBwZW5kVG8odGhpcy5hbm5vdGF0b3IucGxheWVyLiRjb250YWluZXIpO1xuICAgICAgICB0aGlzLiRlZGl0RGlhbG9nLmRyYWdnYWJsZSgpO1xuICAgICAgICB0aGlzLiRlZGl0RGlhbG9nLmNzcygnei1pbmRleCcsIHRoaXMuYmFzZVogKyAxMDApO1xuICAgICAgICB0aGlzLiRlZGl0RGlhbG9nLmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5PblN1cmZhY2VDbGljayhldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJHNwYWNlID0gJChcIjxkaXY+Jm5ic3A7PC9kaXY+PGhyPlwiKTtcbiAgICAgICAgdGhpcy5SZWdpc3RlckVsZW1lbnQodGhpcy4kc3BhY2UsIHRoaXMuJGVkaXREaWFsb2csIDEsICdmbGV4LWVuZCcpO1xuXG4gICAgICAgIC8vIENyZWF0ZSB1bmRvIGJ1dHRvblxuICAgICAgICB0aGlzLiR1bmRvQnV0dG9uMSA9ICQoXCI8YnV0dG9uPlJlbW92ZSBMYXN0IFBvaW50PC9idXR0b24+XCIpLmJ1dHRvbih7XG4gICAgICAgICAgICBpY29uOiBcImZhIGZhLXVuZG9cIixcbiAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuJHVuZG9CdXR0b24xLmNzcyhcIm1hcmdpblwiLCBcIjBweCA1cHggNHB4IDVweFwiKTtcbiAgICAgICAgdGhpcy4kdW5kb0J1dHRvbjEuYXR0cigndGl0bGUnLCBcIlJlbW92ZSBsYXN0IHBvaW50XCIpO1xuICAgICAgICB0aGlzLiR1bmRvQnV0dG9uMS5jc3MoJ3otaW5kZXgnLCB0aGlzLmJhc2VaICsgMTA1KTtcbiAgICAgICAgdGhpcy4kdW5kb0J1dHRvbjEuY2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5SZW1vdmVMYXN0QnJlYWRjcnVtYigpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5SZWdpc3RlckVsZW1lbnQodGhpcy4kdW5kb0J1dHRvbjEsIHRoaXMuJGVkaXREaWFsb2csIDEsICdmbGV4LWVuZCcpO1xuXG4gICAgICAgIC8vIE1ha2UgXCJDb2xsZWN0IFBvbHlnb24gc3RhdGVcIiBidXR0b25cbiAgICAgICAgdGhpcy4kY2FwUG9seUJ1dHRvbjEgPSAkKFwiPGJ1dHRvbj5DYXB0dXJlIFBvbHlnb248L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtY2FtZXJhLXJldHJvXCIsXG4gICAgICAgICAgICBzaG93TGFiZWw6IGZhbHNlXG4gICAgICAgIH0pLmNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2FwdHVyaW5nIHRoZSBwb2x5Z29uXCIpO1xuICAgICAgICAgICAgLy8gLy90aGlzLlNldFZpc2libGUoZmFsc2UpO1xuICAgICAgICAgICAgLy8gLy90aGlzLkdldFBvaW50cygpO1xuXG4gICAgICAgICAgICAvLyBsZXQgdG1wU2VsZWN0b3JzID0gW107XG5cbiAgICAgICAgICAgIC8vIC8vIEJ1aWxkIHBvbHlnb24gc2VsZWN0b3JcbiAgICAgICAgICAgIC8vIGxldCBwb2ludHMgPSB0aGlzLkdldFBvaW50cygpO1xuICAgICAgICAgICAgLy8gaWYocG9pbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vICAgICBsZXQgcG9pbnRzU3RyID0gcG9pbnRzLm1hcChpdGVtID0+IHsgcmV0dXJuIGAke2l0ZW1bMF19LCR7aXRlbVsxXX1gIH0pLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgLy8gICAgIGxldCBwb2x5Z29uU2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIFwidHlwZVwiOiBcIlN2Z1NlbGVjdG9yXCIsXG4gICAgICAgICAgICAvLyAgICAgICAgIFwidmFsdWVcIjogYDxzdmc6c3ZnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJz48cG9seWdvbiBwb2ludHM9JyR7cG9pbnRzU3RyfScgLz48L3N2Zzpzdmc+YCAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDg5ODcyOFxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgICB0bXBTZWxlY3RvcnMucHVzaChwb2x5Z29uU2VsZWN0b3IpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0bXBTZWxlY3RvcnNcIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0bXBTZWxlY3RvcnMpO1xuICAgICAgICAgICAgdGhpcy5BZGRQb2x5Z29uU2V0KCk7XG4gICAgICAgICAgICAvL3RoaXMuYW5ub3RhdG9yLkFkZFBvbHlnb25TZXQodGhpcy5hbm5vdGF0b3IuYW5ub3RhdGlvbi5nZXRQb2x5KCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kY2FwUG9seUJ1dHRvbjEuY3NzKFwibWFyZ2luXCIsIFwiMHB4IDVweCA0cHggNXB4XCIpO1xuICAgICAgICB0aGlzLiRjYXBQb2x5QnV0dG9uMS5hdHRyKCd0aXRsZScsIFwiQ2FwdHVyZSBQb2x5Z29uXCIpO1xuICAgICAgICB0aGlzLiRjYXBQb2x5QnV0dG9uMS5jc3MoJ3otaW5kZXgnLCB0aGlzLmJhc2VaICsgMTA1KTtcbiAgICAgICAgdGhpcy5SZWdpc3RlckVsZW1lbnQodGhpcy4kY2FwUG9seUJ1dHRvbjEsIHRoaXMuJGVkaXREaWFsb2csIDEsICdmbGV4LWVuZCcpO1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgY2FuY2VsIGJ1dHRvblxuICAgICAgICB0aGlzLiRjYW5jZWxCdXR0b24xID0gJChcIjxidXR0b24+Q2FuY2VsIHBvbHlnb24gZWRpdGluZzwvYnV0dG9uPlwiKS5idXR0b24oe1xuICAgICAgICAgICAgaWNvbjogXCJmYSBmYS1yZW1vdmVcIixcbiAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuJGNhbmNlbEJ1dHRvbjEuY3NzKFwibWFyZ2luXCIsIFwiMHB4IDVweCA0cHggNXB4XCIpO1xuICAgICAgICB0aGlzLiRjYW5jZWxCdXR0b24xLmFkZENsYXNzKFwid2FsZG9yZi1jYW5jZWwtYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLiRjYW5jZWxCdXR0b24xLmF0dHIoJ3RpdGxlJywgXCJDYW5jZWwgUG9seWdvbiBFZGl0aW5nXCIpO1xuICAgICAgICB0aGlzLiRjYW5jZWxCdXR0b24xLmNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIC8vUmVzdG9yZSB0aGUgb3JpZ2luYWwgc3RhdGVcbiAgICAgICAgICAgIHRoaXMuUmVzdG9yZSgpO1xuICAgICAgICAgICAgdGhpcy5Eb25lKCk7XG4gICAgICAgICAgICB0aGlzLmFubm90YXRvci4kY29udGFpbmVyLnRyaWdnZXIoXCJPblBvbHlnb25FZGl0aW5nRW5kZWRcIik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiRjYW5jZWxCdXR0b24xLCB0aGlzLiRlZGl0RGlhbG9nLCAyLCAnZmxleC1lbmQnKTtcblxuICAgICAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHRoaXMuUmVzaXplT3ZlcmxheSgpKTtcblxuICAgICAgICB0aGlzLkRvbmUoKTtcbiAgICB9XG5cbiAgICBPblN1cmZhY2VDbGljayhldmVudCl7XG4gICAgICAgIGlmICgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmF0dHIoXCJpZFwiKSA9PSBcImVkaXQtZGlhbG9nXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBhIGJyZWFkY3J1bWIgb24gY2xpY2tcbiAgICAgICAgbGV0IHRhcmdldCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGxldCB4ID0gZXZlbnQucGFnZVggLSB0YXJnZXQub2Zmc2V0KCkubGVmdDtcbiAgICAgICAgbGV0IHkgPSBldmVudC5wYWdlWSAtIHRhcmdldC5vZmZzZXQoKS50b3A7XG4gICAgICAgIFxuICAgICAgICBsZXQgeFBlcmNlbnQgPSAoeCAvIHRhcmdldC53aWR0aCgpKSAqIDEwMDtcbiAgICAgICAgbGV0IHlQZXJjZW50ID0gKHkgLyB0YXJnZXQuaGVpZ2h0KCkpICogMTAwO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5BZGRCcmVhZGNydW1iKHhQZXJjZW50LCB5UGVyY2VudCk7XG4gICAgICAgIFxuICAgICAgICAvL3RoaXMubmV3UG9seVBvaW50cy5wdXNoKFt4UGVyY2VudC50b0ZpeGVkKDMpLCB5UGVyY2VudC50b0ZpeGVkKDMpXSk7XG4gICAgICAgIHRoaXMuVXBkYXRlUG9seUNsaXBwaW5nKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBicmVhZGNydW1iIGF0IHRoZSBnaXZlbiAoeCwgeSkgcG9pbnQgb24gdGhlXG4gICAgICogY2xpY2tTdXJmYWNlLCB3aGVyZSB4IGFuZCB5IGFyZSBwZXJjZW50YWdlcyBmcm9tIDAgdG8gMTAwLlxuICAgICAqL1xuICAgIEFkZEJyZWFkY3J1bWIoeFBlcmNlbnQsIHlQZXJjZW50KXtcbiAgICAgICAgbGV0ICRicmVhZGNydW1iID0gJChcIjxkaXYgY2xhc3M9J2JyZWFkY3J1bWInPjwvZGl2PlwiKTtcbiAgICAgICAgJGJyZWFkY3J1bWIuYXBwZW5kVG8odGhpcy4kY2xpY2tTdXJmYWNlKTtcbiAgICAgICAgJGJyZWFkY3J1bWIuY3NzKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKTtcblxuICAgICAgICAvLyBQZXJjZW50YWdlIHJlcHJlc2VudGF0aW9ucyBvZiBicmVhZGNydW1iIHdpZHRoIGFuZCBoZWlnaHRcbiAgICAgICAgbGV0IG9mZlBlcmNlbnRYID0gKCRicmVhZGNydW1iLm91dGVyV2lkdGgoKSAvIHRoaXMuJGNsaWNrU3VyZmFjZS53aWR0aCgpKSAqIDEwMDtcbiAgICAgICAgbGV0IG9mZlBlcmNlbnRZID0gKCRicmVhZGNydW1iLm91dGVySGVpZ2h0KCkgLyB0aGlzLiRjbGlja1N1cmZhY2UuaGVpZ2h0KCkpICogMTAwO1xuICAgICAgICAvLyBQZXJjZW50YWdlIHJlcHJlc2VudGF0aW9ucyBvZiBicmVhZGNydW1iIHdpZHRoIGFuZCBoZWlnaHRcbiAgICAgICAgJGJyZWFkY3J1bWIuY3NzKFwibGVmdFwiLCAoeFBlcmNlbnQgLSAob2ZmUGVyY2VudFggLyAyKSkudG9TdHJpbmcoKSArIFwiJVwiKTtcbiAgICAgICAgJGJyZWFkY3J1bWIuY3NzKFwidG9wXCIsICh5UGVyY2VudCAtIChvZmZQZXJjZW50WSAvIDIpKS50b1N0cmluZygpICsgXCIlXCIpO1xuICAgICAgICAvLyRicmVhZGNydW1iLmNzcyhcInotaW5kZXhcIiwgdGhpcy5iYXNlWiAtIDUwKTtcblxuICAgICAgICBcbiAgICAgICAgJGJyZWFkY3J1bWIuZHJhZ2dhYmxlKHsgXG4gICAgICAgICAgICAvL2NvbnRhaW5tZW50OiBcInBhcmVudFwiLFxuICAgICAgICAgICAgZHJhZzogKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFJlY2FsY3VsYXRlIHBlcmNlbnRhZ2VzIChtYW5nbGVkIGJ5IGpRdWVyeSBVSSBkcmFnZ2FibGUgY29kZSlcbiAgICAgICAgICAgICAgICAvLyBTZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjM2NzM0NjJcbiAgICAgICAgICAgICAgICB2YXIgbCA9ICggMTAwICogcGFyc2VGbG9hdCgkYnJlYWRjcnVtYi5jc3MoXCJsZWZ0XCIpKSAvIHBhcnNlRmxvYXQoJGJyZWFkY3J1bWIucGFyZW50KCkuY3NzKFwid2lkdGhcIikpICkrIFwiJVwiIDtcbiAgICAgICAgICAgICAgICB2YXIgdCA9ICggMTAwICogcGFyc2VGbG9hdCgkYnJlYWRjcnVtYi5jc3MoXCJ0b3BcIikpIC8gcGFyc2VGbG9hdCgkYnJlYWRjcnVtYi5wYXJlbnQoKS5jc3MoXCJoZWlnaHRcIikpICkrIFwiJVwiIDtcbiAgICAgICAgICAgICAgICAkYnJlYWRjcnVtYi5jc3MoXCJsZWZ0XCIgLCBsKTtcbiAgICAgICAgICAgICAgICAkYnJlYWRjcnVtYi5jc3MoXCJ0b3BcIiAsIHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuVXBkYXRlUG9seUNsaXBwaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkYnJlYWRjcnVtYi5jbGljaygoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgYnJlYWRjcnVtYiBvbiBjbGlja1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAkYnJlYWRjcnVtYi5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMuJGJyZWFkY3J1bWJzLnNwbGljZSh0aGlzLiRicmVhZGNydW1icy5pbmRleE9mKCRicmVhZGNydW1iKSwgMSk7XG4gICAgICAgICAgICB0aGlzLlVwZGF0ZVBvbHlDbGlwcGluZygpO1xuICAgICAgICAgICAgdGhpcy5VcGRhdGVCcmVhZGNydW1iQ29sb3JpbmcoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRicmVhZGNydW1icy5wdXNoKCRicmVhZGNydW1iKTtcblxuICAgICAgICAvL3RoaXMuVXBkYXRlUG9seUNsaXBwaW5nKCk7XG4gICAgICAgIHRoaXMuVXBkYXRlQnJlYWRjcnVtYkNvbG9yaW5nKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgbGFzdC1wbGFjZWQgYnJlYWRjcnVtYiBmcm9tIHRoZSBsaXN0XG4gICAgICogYW5kIHVwZGF0ZXMgdGhlIHZpZXcuXG4gICAgICovXG4gICAgUmVtb3ZlTGFzdEJyZWFkY3J1bWIoKXtcbiAgICAgICAgbGV0ICRyZW1vdmVkID0gdGhpcy4kYnJlYWRjcnVtYnMucG9wKCk7XG4gICAgICAgICRyZW1vdmVkLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLlVwZGF0ZVBvbHlDbGlwcGluZygpO1xuICAgICAgICB0aGlzLlVwZGF0ZUJyZWFkY3J1bWJDb2xvcmluZygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNlbnRlciBvZiB0aGUgYnJlYWRjcnVtYiBhcyBhbiAoeCwgeSkgcGFpclxuICAgICAqIHJlcHJlc2VudGluZyB0aGUgcGVyY2VudGFnZSBkaXN0YW5jZSBmcm9tIHRoZSB0b3AgYW5kIGxlZnRcbiAgICAgKiBvZiB0aGUgY2xpY2sgc3VyZmFjZSAoMCUgLSAxMDAlKS5cbiAgICAgKi9cbiAgICBHZXRDZW50ZXJQZXJjZW50YWdlKCRicmVhZGNydW1iKXtcbiAgICAgICAgbGV0IHRvcFBlcmNlbnQgPSAoJGJyZWFkY3J1bWIucG9zaXRpb24oKS50b3AgLyAkYnJlYWRjcnVtYi5wYXJlbnQoKS5oZWlnaHQoKSkgKiAxMDA7XG4gICAgICAgIGxldCBsZWZ0UGVyY2VudCA9ICgkYnJlYWRjcnVtYi5wb3NpdGlvbigpLmxlZnQgLyAkYnJlYWRjcnVtYi5wYXJlbnQoKS53aWR0aCgpKSAqIDEwMDtcblxuICAgICAgICAvLyBQZXJjZW50YWdlIHZhbHVlcyBmb3IgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGJyZWFkY3J1bWIgcmVsYXRpdmUgdG8gdGhlIGNsaWNrIHN1cmZhY2VcbiAgICAgICAgbGV0IG9mZlBlcmNlbnRYID0gKCRicmVhZGNydW1iLm91dGVyV2lkdGgoKSAvICRicmVhZGNydW1iLnBhcmVudCgpLndpZHRoKCkpICogMTAwO1xuICAgICAgICBsZXQgb2ZmUGVyY2VudFkgPSAoJGJyZWFkY3J1bWIub3V0ZXJIZWlnaHQoKSAvICRicmVhZGNydW1iLnBhcmVudCgpLmhlaWdodCgpKSAqIDEwMDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogbGVmdFBlcmNlbnQgKyAob2ZmUGVyY2VudFggLyAyLjApLFxuICAgICAgICAgICAgeTogdG9wUGVyY2VudCArIChvZmZQZXJjZW50WSAvIDIuMClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFJlc2V0KCl7XG4gICAgICAgIFxuICAgICAgICAvLyBSZW1vdmUgYWxsIGJyZWFkY3J1bWJzXG4gICAgICAgIGZvcihsZXQgJGJyZWFkY3J1bWIgb2YgdGhpcy4kYnJlYWRjcnVtYnMpe1xuICAgICAgICAgICAgJGJyZWFkY3J1bWIucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kYnJlYWRjcnVtYnMgPSBbXTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIHBvbHkgaWYgaXQgYWxyZWFkeSBleGlzdHNcbiAgICAgICAgLy8gaWYodGhpcy4kcG9seSAhPSBudWxsKXtcbiAgICAgICAgLy8gICAgIHRoaXMuJHBvbHkucmVtb3ZlKCk7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBSZXNldFBvbHlnb25zKCkge1xuICAgICAgICBpZiAodGhpcy4kc3RhcnRQb2x5KSB7XG4gICAgICAgICAgICB0aGlzLiRzdGFydFBvbHkuY2xpcFBhdGgoW10sIHtcbiAgICAgICAgICAgICAgICBzdmdEZWZJZDogJ2Fubm90YXRvclBvbHlFZGl0b3JTdmdTdGFydCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJHBvbHlnb25zID0gW107XG4gICAgfVxuXG4gICAgUmVzdG9yZSgpe1xuICAgICAgICB0aGlzLkluaXRQb2x5KHRoaXMub3JpZ2luYWxKU09OKTtcbiAgICB9XG5cbiAgICBJbml0UG9seShwb2ludHMgPSBudWxsKXtcbiAgICAgICAgdGhpcy5SZXNldCgpO1xuXG4gICAgICAgIC8vIElmIEpTT04gd2FzIHNwZWNpZmllZCwgZ2VuZXJhdGUgYnJlYWRjcnVtYnMgZnJvbSBpdC5cbiAgICAgICAgaWYocG9pbnRzICE9IG51bGwpe1xuICAgICAgICAgICAgLy8gUHV0IGRvd24gdGhlIGJyZWFkY3J1bWJzXG4gICAgICAgICAgICBmb3IobGV0IHBvaW50IG9mIHBvaW50cyl7XG4gICAgICAgICAgICAgICAgdGhpcy5BZGRCcmVhZGNydW1iKHBvaW50WzBdLCBwb2ludFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLlVwZGF0ZVBvbHlDbGlwcGluZygpO1xuXG4gICAgICAgIHRoaXMub3JpZ2luYWxKU09OID0gcG9pbnRzO1xuICAgIH1cblxuICAgIEFkZFN0YXJ0UG9seWdvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuJHBvbHlnb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBzdGFydFBvbHlnb24gPSB0aGlzLiRwb2x5Z29uc1swXTsgLy8ubWFwKGl0ZW0gPT4geyByZXR1cm4gYCR7aXRlbVswXX0sJHtpdGVtWzFdfWAgfSkuam9pbihcIiBcIik7O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIHBvbHkgb2JqZWN0XG4gICAgICAgICAgICB0aGlzLiRzdGFydFBvbHkgPSAkKFwiPGRpdiBjbGFzcz0nd2FsZG9yZi1zdGFydC1wb2x5Jz48L2Rpdj5cIikuYXBwZW5kVG8odGhpcy4kY2xpY2tTdXJmYWNlKTtcbiAgICAgICAgICAgIHRoaXMuJHN0YXJ0UG9seS5jc3MoXCJ6LWluZGV4XCIsIHRoaXMuYmFzZVogKyAxMDAwKTtcblxuICAgICAgICAgICAgaWYoc3RhcnRQb2x5Z29uLmxlbmd0aCA8IDMpe1xuICAgICAgICAgICAgICAgIHRoaXMuJHN0YXJ0UG9seS5jbGlwUGF0aChbXSwge1xuICAgICAgICAgICAgICAgICAgICBzdmdEZWZJZDogJ2Fubm90YXRvclBvbHlFZGl0b3JTdmdTdGFydCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuJHN0YXJ0UG9seS5jbGlwUGF0aChzdGFydFBvbHlnb24sIHtcbiAgICAgICAgICAgICAgICBpc1BlcmNlbnRhZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc3ZnRGVmSWQ6ICdhbm5vdGF0b3JTdGFydFBvbHlTdmcnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3RhcnRQb2x5Z29uLm1hcCgocG9pbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLkFkZEJyZWFkY3J1bWIocG9pbnRbMF0sIHBvaW50WzFdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgVXBkYXRlUG9seUNsaXBwaW5nKCl7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLiRicmVhZGNydW1icy5sZW5ndGggPCAzKXtcbiAgICAgICAgICAgIHRoaXMuJHBvbHkuY2xpcFBhdGgoW10sIHtcbiAgICAgICAgICAgICAgICBzdmdEZWZJZDogJ2Fubm90YXRvclBvbHlFZGl0b3JTdmcnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwb2ludHMgPSB0aGlzLiRicmVhZGNydW1icy5tYXAoKCRjcnVtYikgPT4ge1xuICAgICAgICAgICAgbGV0IHBvcyA9IHRoaXMuR2V0Q2VudGVyUGVyY2VudGFnZSgkY3J1bWIpO1xuICAgICAgICAgICAgcmV0dXJuIFtwb3MueCwgcG9zLnldO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRwb2x5LmNsaXBQYXRoKHBvaW50cywge1xuICAgICAgICAgICAgaXNQZXJjZW50YWdlOiB0cnVlLFxuICAgICAgICAgICAgc3ZnRGVmSWQ6ICdhbm5vdGF0b3JQb2x5RWRpdG9yU3ZnJ1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIFVwZGF0ZUJyZWFkY3J1bWJDb2xvcmluZygpe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy4kYnJlYWRjcnVtYnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgbGV0ICRjcnVtYiA9IHRoaXMuJGJyZWFkY3J1bWJzW2ldO1xuICAgICAgICAgICAgLy8gUmVjb2xvciBlYWNoIGJyZWFkY3J1bWJcbiAgICAgICAgICAgIGxldCBjb2xvciA9IFwiIzAwMDAwMFwiO1xuXG4gICAgICAgICAgICBpZiAoaSA9PSB0aGlzLiRicmVhZGNydW1icy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgY29sb3IgPSBcIiNGRjAwMDBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGkgPT0gMCl7XG4gICAgICAgICAgICAgICAgY29sb3IgPSBcIiMwMEZGMDBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuJGJyZWFkY3J1bWJzW2ldLmNzcyhcImJvcmRlci1jb2xvclwiLCBjb2xvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFuIGFycmF5IG9mIHBlcmNlbnRhZ2VzIHJlcHJlc2VudGluZyB0aGUgeCBhbmQgeSBwZXJjZW50YWdlcyBvZiBlYWNoXG4gICAgICogcG9pbnQgaW4gdGhlIHBvbHlnb24uXG4gICAgICovXG4gICAgR2V0SlNPTigpe1xuICAgICAgICAvLyBFeHRyYWN0IHRoZSBjb29yZGluYXRlcyBmcm9tIHRoZSBjcnVtYnMgYW5kIHB1dCB0aGVtIGluIHRoZSBhcnJheVxuICAgICAgICBsZXQgcG9pbnRzID0gW107XG4gICAgICAgIGZvcihsZXQgY3J1bWIgb2YgdGhpcy4kYnJlYWRjcnVtYnMpe1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5HZXRDZW50ZXJQZXJjZW50YWdlKGNydW1iKTtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFtwb2ludC54LnRvU3RyaW5nKCksIHBvaW50LnkudG9TdHJpbmcoKV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBvaW50cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhbiBhcnJheSBvZiBwZXJjZW50YWdlcyByZXByZXNlbnRpbmcgdGhlIHggYW5kIHkgcGVyY2VudGFnZXMgb2YgZWFjaFxuICAgICAqIHBvaW50IGluIHRoZSBwb2x5Z29uLlxuICAgICAqL1xuICAgIEdldFBvaW50cygpIHtcbiAgICAgICAgbGV0IHBvaW50cyA9IFtdO1xuICAgICAgICBmb3IobGV0IGNydW1iIG9mIHRoaXMuJGJyZWFkY3J1bWJzKXtcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHRoaXMuR2V0Q2VudGVyUGVyY2VudGFnZShjcnVtYik7XG4gICAgICAgICAgICBwb2ludHMucHVzaChbcG9pbnQueCwgcG9pbnQueV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuXG4gICAgQmVnaW5FZGl0aW5nKCl7XG4gICAgICAgIHRoaXMuJGNsaWNrU3VyZmFjZS5tYWtlVmlzaWJsZSh0cnVlKTtcbiAgICAgICAgdGhpcy4kZWRpdERpYWxvZy5tYWtlVmlzaWJsZSh0cnVlKTtcbiAgICAgICAgdGhpcy4kcG9seS5tYWtlVmlzaWJsZSh0cnVlKTtcbiAgICAgICAgLy8tMy8vdGhpcy4kYmFyLm1ha2VWaXNpYmxlKHRydWUpO1xuICAgICAgICB0aGlzLkFkZFN0YXJ0UG9seWdvbigpO1xuICAgICAgICB0aGlzLlVwZGF0ZVBvbHlDbGlwcGluZygpO1xuICAgIH1cblxuICAgIERvbmUoKXtcbiAgICAgICAgdGhpcy4kY2xpY2tTdXJmYWNlLm1ha2VWaXNpYmxlKGZhbHNlKTtcbiAgICAgICAgdGhpcy4kZWRpdERpYWxvZy5tYWtlVmlzaWJsZShmYWxzZSk7XG4gICAgICAgIHRoaXMuJHBvbHkubWFrZVZpc2libGUoZmFsc2UpO1xuICAgICAgICAvLy0zLy90aGlzLiRiYXIubWFrZVZpc2libGUoZmFsc2UpO1xuICAgIH1cblxuICAgIFJlc2l6ZU92ZXJsYXkoKXtcbiAgICAgICAgLy8gUmVzaXplIHZpZGVvIG92ZXJsYXkgdG8gZml0IGFjdHVhbCB2aWRlbyBkaW1lbnNpb25zXG4gICAgICAgIGxldCB2aWRlb0RpbXMgPSB0aGlzLmFubm90YXRvci5wbGF5ZXIuR2V0VmlkZW9EaW1lbnNpb25zKCk7XG4gICAgICAgIHRoaXMuJGNsaWNrU3VyZmFjZS5jc3MoJ3dpZHRoJywgdmlkZW9EaW1zLndpZHRoKTtcbiAgICAgICAgdGhpcy4kY2xpY2tTdXJmYWNlLmNzcygnaGVpZ2h0JywgdmlkZW9EaW1zLmhlaWdodCk7XG5cbiAgICAgICAgbGV0IGhlaWdodERpZmYgPSAodGhpcy5hbm5vdGF0b3IucGxheWVyLiR2aWRlby5oZWlnaHQoKSAtIHZpZGVvRGltcy5oZWlnaHQpIC8gMjtcbiAgICAgICAgdGhpcy4kY2xpY2tTdXJmYWNlLmNzcygndG9wJywgaGVpZ2h0RGlmZik7XG5cbiAgICAgICAgbGV0IHdpZHRoRGlmZiA9ICh0aGlzLmFubm90YXRvci5wbGF5ZXIuJHZpZGVvLndpZHRoKCkgLSB2aWRlb0RpbXMud2lkdGgpIC8gMjtcbiAgICAgICAgdGhpcy4kY2xpY2tTdXJmYWNlLmNzcygnbGVmdCcsIHdpZHRoRGlmZik7XG5cbiAgICAgICAgdGhpcy4kcG9seS53aWR0aCh2aWRlb0RpbXMud2lkdGgpO1xuICAgICAgICB0aGlzLiRwb2x5LmhlaWdodCh2aWRlb0RpbXMuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy4kcG9seS5jc3MoXCJ0b3BcIiwgaGVpZ2h0RGlmZik7XG4gICAgICAgIHRoaXMuJHBvbHkuY3NzKFwibGVmdFwiLCB3aWR0aERpZmYpO1xuICAgIH1cblxuICAgIFJlZ2lzdGVyRWxlbWVudCgkZWxlbWVudCwgJGNvbnRhaW5lciwgb3JkZXIsIGp1c3RpZmljYXRpb24gPSAnZmxleC1zdGFydCcpe1xuICAgICAgICAkZWxlbWVudC5jc3MoJ29yZGVyJywgb3JkZXIpO1xuICAgICAgICAkZWxlbWVudC5jc3MoJ2FsaWduLXNlbGYnLCBqdXN0aWZpY2F0aW9uKTtcbiAgICAgICAgLy8gU2V0cyBncm93IFtzaHJpbmtdIFtiYXNpc11cbiAgICAgICAgLy8kZWxlbWVudC5jc3MoJ2ZsZXgnLCAnMCAwIGF1dG8nKTtcbiAgICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJGVsZW1lbnQpO1xuICAgIH1cblxuICAgIFNob3dKdXN0UG9seWdvbigpe1xuICAgICAgICB0aGlzLiRwb2x5Lm1ha2VWaXNpYmxlKHRydWUpO1xuICAgIH1cblxuICAgIEFkZFBvbHlnb25TZXQoKSB7XG4gICAgICAgIHRoaXMuJHBvbHlnb25zLnB1c2godGhpcy5HZXRQb2ludHMoKSk7XG4gICAgICAgIHRoaXMuJHRlbXBCcmVhZENydW1icy5wdXNoKFt0aGlzLiRicmVhZGNydW1ic10pO1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBQb2x5Z29uRWRpdG9yIH07IiwiY2xhc3MgUG9seWdvbk92ZXJsYXkge1xuICAgIGNvbnN0cnVjdG9yKGFubm90YXRvcil7XG4gICAgICAgIHRoaXMuYW5ub3RhdG9yID0gYW5ub3RhdG9yO1xuICAgICAgICB0aGlzLnBvbHlFbGVtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMuYW5pbWF0ZUVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMuYmFzZVogPSAyMTQ3NDgzNjQ5O1xuICAgICAgICB0aGlzLmxhc3RBbm5vdGF0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLnN2Z0VsZW1lbnRzSGFzaCA9IHt9O1xuXG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgdGhlIHZpZGVvIG92ZXJsYXlcbiAgICAgICAgdGhpcy4kdmlkZW9PdmVybGF5ID0gJChcIjxkaXYgY2xhc3M9J3dhbGRvcmYtdmlkZW8tb3ZlcmxheSc+PC9kaXY+XCIpLmFwcGVuZFRvKHRoaXMuYW5ub3RhdG9yLnBsYXllci4kY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5SZXNpemVPdmVybGF5KCk7XG4gICAgICAgIHRoaXMuYW5ub3RhdG9yLnBsYXllci4kY29udGFpbmVyLm9uKFwiT25GdWxsc2NyZWVuQ2hhbmdlXCIsIChldmVudCwgc2V0RnVsbHNjcmVlbikgPT4gdGhpcy5SZXNpemVPdmVybGF5KCkpO1xuXG4gICAgICAgIHRoaXMuYW5ub3RhdG9yLiRjb250YWluZXIub24oXCJPbk5ld0Fubm90YXRpb25TZXRcIiwgKGV2ZW50LCBhbm5vdGF0aW9ucykgPT4gdGhpcy5VcGRhdGUoYW5ub3RhdGlvbnMpKTtcbiAgICAgICAgdGhpcy52aWRlb0RpbXMgPSB0aGlzLmFubm90YXRvci5wbGF5ZXIuR2V0VmlkZW9EaW1lbnNpb25zKCk7XG5cbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSgoKSA9PiB0aGlzLlJlc2l6ZU92ZXJsYXkoKSk7XG4gICAgfVxuXG4gICAgVXBkYXRlKGFubm90YXRpb25zKXtcbiAgICAgICAgdGhpcy5DbGVhcigpO1xuXG4gICAgICAgIC8vIGxldCBwcmV2U2V0ID0gbmV3IFNldCh0aGlzLmxhc3RBbm5vdGF0aW9ucyk7XG4gICAgICAgIC8vIGxldCBuZXdTZXQgPSBuZXcgU2V0KGFubm90YXRpb25zKTtcblxuICAgICAgICAvLyAvLyBpbiBuZXdTZXQgYW5kIG5vdCBpbiBwcmV2U2V0XG4gICAgICAgIC8vIGxldCB0b0FkZCA9IG5ldyBTZXQoXG4gICAgICAgIC8vICAgICBbLi4ubmV3U2V0XS5maWx0ZXIoeCA9PiAhcHJldlNldC5oYXMoeCkpKTtcblxuICAgICAgICAvLyAvLyBpbiBwcmV2QW5ub3RhdGlvbnMgYW5kIG5vdCBpbiBhbm5vdGF0aW9uc1xuICAgICAgICAvLyBsZXQgdG9EZXN0cm95ID0gbmV3IFNldChcbiAgICAgICAgLy8gICAgIFsuLi5wcmV2U2V0XS5maWx0ZXIoeCA9PiAhbmV3U2V0Lmhhcyh4KSkpO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKEFycmF5LmZyb20odG9BZGQpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coQXJyYXkuZnJvbSh0b0Rlc3Ryb3kpKTtcbiAgICAgICAgXG4gICAgICAgIC8vU29ydCBwb2x5Z29uIG9yZGVyIGJ5IHNpemUgKGFzY2VuZGluZylcbiAgICAgICAgLy8gcG9seWdvbnMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gdGhpcy5HZXRBcmVhKGEpID4gdGhpcy5HZXRBcmVhKGIpO1xuICAgICAgICAvLyB9KVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5ub3RhdGlvbnMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgbGV0IGFubm90YXRpb25Qb2x5UG9pbnRzID0gYW5ub3RhdGlvbnNbaV0uZ2V0UG9seSgpO1xuICAgICAgICAgICAgaWYgKGFubm90YXRpb25Qb2x5UG9pbnRzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBJZ25vcmUgdGhpcyBhbm5vdGF0aW9uIGlmIGl0IGhhcyBubyBwb2x5Z29uXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzdmdQb2x5UG9pbnRzID0gYW5ub3RhdGlvbnNbaV0uZ2V0U1ZHUG9seVBvaW50cygpO1xuICAgICAgICBcbiAgICAgICAgICAgIGxldCBkdXJhdGlvbiA9IGFubm90YXRpb25zW2ldLmVuZFRpbWUgLSBhbm5vdGF0aW9uc1tpXS5iZWdpblRpbWU7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgcG9seSBvYmplY3RcbiAgICAgICAgICAgIGxldCAkc3ZnO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3ZnRWxlbWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAkc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIik7XG4gICAgICAgICAgICAgICAgJHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEwMCUnKTtcbiAgICAgICAgICAgICAgICAkc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAgICAgICAgICAgICAkc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMTAwIDEwMCcpO1xuICAgICAgICAgICAgICAgICRzdmcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ25vbmUnKTtcblxuICAgICAgICAgICAgICAgIC8vJHN2Zy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5DbGlja0V2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLiR2aWRlb092ZXJsYXkuYXBwZW5kKCRzdmcpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3ZnRWxlbWVudHMucHVzaCgkc3ZnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHN2ZyA9IHRoaXMuc3ZnRWxlbWVudHNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgbGV0ICRwb2x5Z29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwb2x5Z29uJyk7XG4gICAgICAgICAgICAkcG9seWdvbi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIHN2Z1BvbHlQb2ludHNbMF0pO1xuICAgICAgICAgICAgJHBvbHlnb24uc2V0QXR0cmlidXRlKCdmaWxsJywgJ3JnYmEoMCwgMTE4LCAyNTUsIDAuNTUpJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzdmcuYXBwZW5kQ2hpbGQoJHBvbHlnb24pO1xuXG4gICAgICAgICAgICBsZXQgJGFuaW1hdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2FuaW1hdGUnKTtcbiAgICAgICAgICAgICRhbmltYXRlLnNldEF0dHJpYnV0ZSgnYXR0cmlidXRlTmFtZScsICdwb2ludHMnKTtcbiAgICAgICAgICAgICRhbmltYXRlLnNldEF0dHJpYnV0ZSgnZmlsbCcsICdmcmVlemUnKTtcbiAgICAgICAgICAgICRhbmltYXRlLnNldEF0dHJpYnV0ZSgnZnJvbScsIHN2Z1BvbHlQb2ludHNbMF0pO1xuICAgICAgICAgICAgJGFuaW1hdGUuc2V0QXR0cmlidXRlKCd0bycsIHN2Z1BvbHlQb2ludHNbMV0pO1xuICAgICAgICAgICAgJGFuaW1hdGUuc2V0QXR0cmlidXRlKCdiZWdpbicsICdpbmRlZmluaXRlJyk7XG4gICAgICAgICAgICAkYW5pbWF0ZS5zZXRBdHRyaWJ1dGUoJ2R1cicsIGR1cmF0aW9uICsgXCJzXCIpO1xuICAgICAgICAgICAgJHBvbHlnb24uYXBwZW5kQ2hpbGQoJGFuaW1hdGUpO1xuXG4gICAgICAgICAgICBsZXQgJHN2Z0hhc2ggPSB7XG4gICAgICAgICAgICAgICAgc3ZnRWxlbWVudDogJHN2ZyxcbiAgICAgICAgICAgICAgICBwb2x5Z29uOiAkcG9seWdvbixcbiAgICAgICAgICAgICAgICBhbmltYXRlOiAkYW5pbWF0ZSxcbiAgICAgICAgICAgICAgICBiZWdpblRpbWU6IGFubm90YXRpb25zW2ldLmJlZ2luVGltZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5zdmdFbGVtZW50c0hhc2hbYW5ub3RhdGlvbnNbaV0uaWRdID0gJHN2Z0hhc2g7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgcG9seSBvYmplY3RcbiAgICAgICAgICAgIC8vIGxldCAkcG9seSA9ICQoXCI8ZGl2IGNsYXNzPSd3YWxkb3JmLW92ZXJsYXktcG9seSc+PC9kaXY+XCIpLmFwcGVuZFRvKHRoaXMuJHZpZGVvT3ZlcmxheSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vICRwb2x5LmNsaXBQYXRoKGFubm90YXRpb25Qb2x5UG9pbnRzLCB7XG4gICAgICAgICAgICAvLyAgICAgaXNQZXJjZW50YWdlOiB0cnVlLFxuICAgICAgICAgICAgLy8gICAgIHN2Z0RlZklkOiAnYW5ub3RhdG9yUG9seVN2ZydcbiAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgLy8gJHBvbHkuY2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgLy8gICAgIHRoaXMuYW5ub3RhdG9yLiRjb250YWluZXIudHJpZ2dlcihcIk9uUG9seUNsaWNrZWRcIiwgYW5ub3RhdGlvbnNbaV0pO1xuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAvLyB0aGlzLkFkZFRvb2x0aXAoJHBvbHksIGFubm90YXRpb25zW2ldKTtcbiAgICAgICAgICAgIC8vIHRoaXMucG9seUVsZW1lbnRzLnB1c2goJHBvbHkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnBvbHlFbGVtZW50cy5wdXNoKCRwb2x5Z29uKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0ZUVsZW1lbnRzLnB1c2goJGFuaW1hdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy90aGlzLmxhc3RBbm5vdGF0aW9ucyA9IGFubm90YXRpb25zO1xuICAgIH1cblxuICAgIENsaWNrRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJhbmltYXRlIGlzIGNsaWNrZWRcIik7XG4gICAgfVxuXG4gICAgQWRkVG9vbHRpcCgkcG9seSwgYW5ub3RhdGlvbil7XG4gICAgICAgICQuZm4ucXRpcC56aW5kZXggPSB0aGlzLmJhc2VaKyAxO1xuICAgICAgICAkcG9seS5xdGlwKHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogYW5ub3RhdGlvbi5pZCxcbiAgICAgICAgICAgICAgICB0ZXh0OiBhbm5vdGF0aW9uLmJvZHkuZmlsdGVyKGl0ZW0gPT4gaXRlbS5wdXJwb3NlID09PSBcImRlc2NyaWJpbmdcIilbMF0udmFsdWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIG15OiAnYm90dG9tIHJpZ2h0JyxcbiAgICAgICAgICAgICAgICBhdDogJ3RvcCBsZWZ0JyxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdtb3VzZScsIC8vIEZvbGxvdyB0aGUgbW91c2VcbiAgICAgICAgICAgICAgICBhZGp1c3Q6IHtcbiAgICAgICAgICAgICAgICAgICAgbW91c2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJzaGlmdCBzaGlmdFwiIC8vIGhvcml6b250YWwsIHZlcnRpY2FsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2aWV3cG9ydDogdGhpcy5hbm5vdGF0b3IucGxheWVyLiRjb250YWluZXJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaWRlOiB7XG4gICAgICAgICAgICAgICAgZGVsYXk6IDAgLy8gTm8gaGlkZSBkZWxheSBieSBkZWZhdWx0XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBjbGFzc2VzOiAncXRpcC1kYXJrIHF0aXAtcm91bmRlZCBhbm5vdGF0b3ItcXRpcCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgQ2xlYXIoKXtcbiAgICAgICAgLy8gQ2xlYXIgYWxsICBhbmltYXRlIGVsZW1lbnQgZnJvbSB0aGUgRE9NXG4gICAgICAgIGZvcihsZXQgYWkgPSAwOyBhaSA8IHRoaXMuYW5pbWF0ZUVsZW1lbnRzLmxlbmd0aDsgYWkrKyl7XG4gICAgICAgICAgICAvL3RoaXMucG9seUVsZW1lbnRzW2ldLmRhdGEoXCJxdGlwXCIpLmRlc3Ryb3kodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGVFbGVtZW50c1thaV0ucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGVhciBhbGwgcG9seWdvbnMgXG4gICAgICAgIGZvcihsZXQgcGkgPSAwOyBwaSA8IHRoaXMucG9seUVsZW1lbnRzLmxlbmd0aDsgcGkrKykge1xuICAgICAgICAgICAgdGhpcy5wb2x5RWxlbWVudHNbcGldLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBDbGVhciBhbGwgIHN2ZyBlbGVtZW50cyBmcm9tIHRoZSBET01cbiAgICAgICAgZm9yKGxldCBzaSA9IDA7IHNpIDwgdGhpcy5zdmdFbGVtZW50cy5sZW5ndGg7IHNpKyspe1xuICAgICAgICAgICAgdGhpcy5zdmdFbGVtZW50c1tzaV0ucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIE1hcmsgdGhlIGFycmF5IGFzIGVtcHR5XG4gICAgICAgIHRoaXMuYW5pbWF0ZUVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMucG9seUVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMuc3ZnRWxlbWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5zdmdFbGVtZW50c0hhc2ggPSB7fTtcblxuICAgIH1cblxuICAgIFJlc2l6ZU92ZXJsYXkoKXtcbiAgICAgICAgLy8gUmVzaXplIHZpZGVvIG92ZXJsYXkgdG8gZml0IGFjdHVhbCB2aWRlbyBkaW1lbnNpb25zXG4gICAgICAgIGxldCB2aWRlb0RpbXMgPSB0aGlzLmFubm90YXRvci5wbGF5ZXIuR2V0VmlkZW9EaW1lbnNpb25zKCk7XG4gICAgICAgIHRoaXMuJHZpZGVvT3ZlcmxheS5jc3MoJ3dpZHRoJywgdmlkZW9EaW1zLndpZHRoKTtcbiAgICAgICAgdGhpcy4kdmlkZW9PdmVybGF5LmNzcygnaGVpZ2h0JywgdmlkZW9EaW1zLmhlaWdodCk7XG5cbiAgICAgICAgbGV0IGhlaWdodERpZmYgPSAodGhpcy5hbm5vdGF0b3IucGxheWVyLiR2aWRlby5oZWlnaHQoKSAtIHZpZGVvRGltcy5oZWlnaHQpIC8gMjtcbiAgICAgICAgdGhpcy4kdmlkZW9PdmVybGF5LmNzcygndG9wJywgaGVpZ2h0RGlmZik7XG5cbiAgICAgICAgbGV0IHdpZHRoRGlmZiA9ICh0aGlzLmFubm90YXRvci5wbGF5ZXIuJHZpZGVvLndpZHRoKCkgLSB2aWRlb0RpbXMud2lkdGgpIC8gMjtcbiAgICAgICAgdGhpcy4kdmlkZW9PdmVybGF5LmNzcygnbGVmdCcsIHdpZHRoRGlmZik7XG4gICAgfVxuXG4gICAgZ2V0UGxheWVyU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5ub3RhdG9yLnBsYXllci5HZXRWaWRlb0RpbWVuc2lvbnMoKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgUG9seWdvbk92ZXJsYXkgfTsiLCJcbmNsYXNzIFRpY2tCYXIge1xuICAgIGNvbnN0cnVjdG9yKGFubm90YXRvcil7XG4gICAgICAgIHRoaXMuYW5ub3RhdG9yID0gYW5ub3RhdG9yO1xuXG4gICAgICAgIHRoaXMudGlja3MgPSBbXTtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIGVsZW1lbnRcbiAgICAgICAgdGhpcy4kdGlja0JhciA9ICQoXCI8ZGl2IGNsYXNzPSd3YWxkb3JmLXRpY2tiYXInPjwvZGl2PlwiKTtcbiAgICAgICAgdGhpcy5hbm5vdGF0b3IucGxheWVyLmNvbnRyb2xCYXIuJGNvbnRhaW5lci5hcHBlbmQodGhpcy4kdGlja0Jhcik7XG5cbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIHRoaXMuYW5ub3RhdG9yLiRjb250YWluZXIub24oXCJPbkFubm90YXRpb25zTG9hZGVkXCIsIFxuICAgICAgICAgICAgKGV2ZW50LCBhbm5vdGF0aW9uTWFuYWdlcikgPT4gdGhpcy5Mb2FkQW5ub3RhdGlvbnMoYW5ub3RhdGlvbk1hbmFnZXIpKTtcblxuICAgICAgICB0aGlzLmFubm90YXRvci4kY29udGFpbmVyLm9uKFwiT25Bbm5vdGF0aW9uUmVnaXN0ZXJlZFwiLFxuICAgICAgICAgICAgKGV2ZW50LCBhbm5vdGF0aW9uKSA9PiB0aGlzLkxvYWRBbm5vdGF0aW9uKGFubm90YXRpb24pKTtcblxuICAgICAgICB0aGlzLmFubm90YXRvci4kY29udGFpbmVyLm9uKFwiT25Bbm5vdGF0aW9uUmVtb3ZlZFwiLFxuICAgICAgICAgICAgKGV2ZW50LCBpZCkgPT4gdGhpcy5SZW1vdmVBbm5vdGF0aW9uKGlkKSk7XG4gICAgICAgICAgICBcbiAgICB9XG5cbiAgICBMb2FkQW5ub3RhdGlvbnMoYW5ub3RhdGlvbk1hbmFnZXIpe1xuICAgICAgICB0aGlzLkNsZWFyKCk7XG5cbiAgICAgICAgZm9yKGxldCBhbm5vdGF0aW9uIG9mIGFubm90YXRpb25NYW5hZ2VyLmFubm90YXRpb25zKXtcbiAgICAgICAgICAgIHRoaXMuTG9hZEFubm90YXRpb24oYW5ub3RhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBMb2FkQW5ub3RhdGlvbihhbm5vdGF0aW9uKXtcbiAgICAgICAgbGV0ICR0aWNrID0gJChcIjxkaXYgY2xhc3M9J3dhbGRvcmYtdGlja2Jhci10aWNrJz48L2Rpdj5cIikuYXBwZW5kVG8odGhpcy4kdGlja0Jhcik7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBJRCBvZiB0aGUgYW5ub3RhdGlvbiB0byBpdHMgY29ycmVzcG9uZGluZyB0aWNrIHNvIHdlIGNhbiByZWZlcmVuY2UgaXQgbGF0ZXJcbiAgICAgICAgJHRpY2suZGF0YShcImFubm90YXRpb24taWRcIiwgYW5ub3RhdGlvbi5pZCk7XG5cbiAgICAgICAgbGV0IGJlZ2luVGltZSA9IGFubm90YXRpb24uYmVnaW5UaW1lO1xuICAgICAgICBsZXQgYmVnaW5QZXJjZW50ID0gYmVnaW5UaW1lIC8gdGhpcy5hbm5vdGF0b3IucGxheWVyLnZpZGVvRWxlbWVudC5kdXJhdGlvbjtcbiAgICAgICAgJHRpY2suY3NzKCdsZWZ0JywgKGJlZ2luUGVyY2VudCAqIDEwMCkudG9TdHJpbmcoKSArIFwiJVwiKTtcblxuICAgICAgICBsZXQgZW5kVGltZSA9IGFubm90YXRpb24uZW5kVGltZTtcbiAgICAgICAgbGV0IGVuZFBlcmNlbnQgPSBlbmRUaW1lIC8gdGhpcy5hbm5vdGF0b3IucGxheWVyLnZpZGVvRWxlbWVudC5kdXJhdGlvbjtcbiAgICAgICAgJHRpY2suY3NzKCd3aWR0aCcsICgoZW5kUGVyY2VudCAtIGJlZ2luUGVyY2VudCkgKiAxMDApLnRvU3RyaW5nKCkgKyBcIiVcIik7XG5cbiAgICAgICAgdGhpcy50aWNrcy5wdXNoKCR0aWNrKTtcbiAgICB9XG5cbiAgICBSZW1vdmVBbm5vdGF0aW9uKGlkKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIlJlbW92aW5nIHRpY2sgXCIgKyBpZCk7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgb2JqZWN0IGZyb20gdGhlIGRvY3VtZW50LCBhbmQgdGhlIGFycmF5XG4gICAgICAgIGxldCBuZXdUaWNrcyA9IFtdO1xuICAgICAgICBmb3IobGV0ICR0aWNrIG9mIHRoaXMudGlja3Mpe1xuICAgICAgICAgICAgaWYoJHRpY2suZGF0YShcImFubm90YXRpb24taWRcIikgPT0gaWQpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZW1vdmVkIHRpY2sgJHtpZH1gKTtcbiAgICAgICAgICAgICAgICAkdGljay5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3VGlja3MucHVzaCgkdGljayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aWNrcyA9IG5ld1RpY2tzO1xuICAgIH1cblxuICAgIENsZWFyKCl7XG4gICAgICAgIGZvcihsZXQgJHRpY2sgb2YgdGhpcy50aWNrcyl7XG4gICAgICAgICAgICAkdGljay5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGlja3MgPSBbXTtcbiAgICB9XG5cbn1cblxuXG5leHBvcnQgeyBUaWNrQmFyIH07IiwibGV0IHNoYTEgPSByZXF1aXJlKCdzaGExJyk7XG5cbmNsYXNzIFNlcnZlckludGVyZmFjZSB7XG4gICAgY29uc3RydWN0b3IoYW5ub3RhdG9yKXtcbiAgICAgICAgdGhpcy5hbm5vdGF0b3IgPSBhbm5vdGF0b3I7XG4gICAgICAgIC8vbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3dhbGRvcmZfYXV0aF90b2tlbicpO1xuICAgIH1cblxuICAgIFNldEJhc2VVUkwodXJsKXtcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gdXJsO1xuICAgIH1cblxuICAgIG1ha2VfYmFzZV9hdXRoKHVzZXIsIHBhc3N3b3JkKSB7XG4gICAgICAgIHZhciB0b2sgPSB1c2VyICsgJzonICsgcGFzc3dvcmQ7XG4gICAgICAgIHZhciBoYXNoID0gYnRvYSh0b2spO1xuICAgICAgICByZXR1cm4gJ0Jhc2ljICcgKyBoYXNoO1xuICAgIH1cblxuICAgIG1ha2Vfd3JpdGVfYXV0aCh0ZXh0KXtcbiAgICAgICAgaWYodGhpcy5hbm5vdGF0b3IuYXBpS2V5KXtcbiAgICAgICAgICAgIHJldHVybiAnQXBpS2V5ICcgKyB0ZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdUb2tlbiAnICsgdGV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIExvZ2dlZEluKCl7XG4gICAgICAgIGlmKHRoaXMuYW5ub3RhdG9yLmFwaUtleSl7XG4gICAgICAgICAgICAvLyBSZXR1cm4gdHJ1ZSBpZiBhbiBlbWFpbCBoYXMgYmVlbiBlbnRlcmVkXG4gICAgICAgICAgICBsZXQgdXNlcl9lbWFpbCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3YWxkb3JmX3VzZXJfZW1haWwnKTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyX2VtYWlsICE9PSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUmV0dXJuIHRydWUgaWYgYSB0b2tlbiBoYXMgYmVlbiByZWdpc3RlcmVkXG4gICAgICAgICAgICBsZXQgYXV0aF90b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3YWxkb3JmX2F1dGhfdG9rZW4nKTtcbiAgICAgICAgICAgIHJldHVybiBhdXRoX3Rva2VuICE9PSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgTG9nSW4odXNlcm5hbWUsIHBhc3N3b3JkKXtcbiAgICAgICAgLy8gSWYgQVBJIGtleSBpcyB1c2VkLCBqdXN0IHN0b3JlIHRoZSBlbWFpbCBhZGRyZXNzXG4gICAgICAgIGlmKHRoaXMuYW5ub3RhdG9yLmFwaUtleSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTZXJ2ZXIgSW50ZXJmYWNlXSBTdWNjZXNzZnVsbHkgbG9nZ2VkIGluLlwiKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd3YWxkb3JmX3VzZXJfZW1haWwnLCBwYXNzd29yZCk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnd2FsZG9yZl91c2VyX25hbWUnLCB1c2VybmFtZSk7XG4gICAgICAgICAgICB0aGlzLmFubm90YXRvci5tZXNzYWdlT3ZlcmxheS5TaG93TWVzc2FnZShcIkxvZ2dlZCBpbiBhcyBcIit1c2VybmFtZSk7XG4gICAgICAgICAgICByZXR1cm4gJC5EZWZlcnJlZCgpLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB0aGlzLmJhc2VVUkwgKyBcIi9hcGkvbG9naW5cIixcbiAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICBjb250ZXh0OiB0aGlzLFxuICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgdGhpcy5tYWtlX2Jhc2VfYXV0aCh1c2VybmFtZSwgcGFzc3dvcmQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZG9uZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbU2VydmVyIEludGVyZmFjZV0gU3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbi5cIik7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnd2FsZG9yZl9hdXRoX3Rva2VuJywgZGF0YS5hdXRoX3Rva2VuKTtcbiAgICAgICAgfSkuZmFpbCgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbU2VydmVyIEludGVyZmFjZV0gQ291bGQgbm90IGxvZyBpbi5cIik7XG4gICAgICAgICAgICB0aGlzLmFubm90YXRvci5tZXNzYWdlT3ZlcmxheS5TaG93RXJyb3IoXCJDb3VsZCBub3QgbG9nIGluIVwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgTG9nT3V0KCl7XG4gICAgICAgIC8vIElmIEFQSSBrZXkgaXMgdXNlZCwganVzdCByZW1vdmUgdGhlIGVtYWlsIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgaWYodGhpcy5hbm5vdGF0b3IuYXBpS2V5KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1NlcnZlciBJbnRlcmZhY2VdIFN1Y2Nlc3NmdWxseSBsb2dnZWQgb3V0LlwiKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd3YWxkb3JmX3VzZXJfZW1haWwnKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd3YWxkb3JmX3VzZXJfbmFtZScpO1xuICAgICAgICAgICAgcmV0dXJuICQuRGVmZXJyZWQoKS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpcy5iYXNlVVJMICsgXCIvYXBpL2xvZ291dFwiLFxuICAgICAgICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXV0aF90b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3YWxkb3JmX2F1dGhfdG9rZW4nKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbU2VydmVyIEludGVyZmFjZV0gdG9rZW46ICR7YXV0aF90b2tlbn1gKTtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIHRoaXMubWFrZV93cml0ZV9hdXRoKGF1dGhfdG9rZW4pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZG9uZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbU2VydmVyIEludGVyZmFjZV0gU3VjY2Vzc2Z1bGx5IGxvZ2dlZCBvdXQuXCIpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3dhbGRvcmZfYXV0aF90b2tlbicpO1xuICAgICAgICB9KS5mYWlsKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltTZXJ2ZXIgSW50ZXJmYWNlXSBDb3VsZCBub3QgbG9nIG91dC5cIik7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnd2FsZG9yZl9hdXRoX3Rva2VuJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEZldGNoQW5ub3RhdGlvbnMoc2VhcmNoS2V5LCBzZWFyY2hQYXJhbSkge1xuICAgICAgICAvL1RoaXMgaXMgcmVwbGFjZWQgYnkgdGhpcy5iYXNlVVJMLCB3aGljaCBpcyBkZWZpbmVkIGluIGNvbmZpZ1xuICAgICAgICAvL3ZhciBib29rX3VybCA9ICdodHRwOi8vc2NhbGFyLnVzYy5lZHUvZGV2L3NlbWFudGljLWFubm90YXRpb24tdG9vbC8nOyAgLy8gVGhpcyB3aWxsIGJlIGRlZmluZWQgaW4gdGhlIEJvb2sncyBKU1xuICAgICAgICAvL2h0dHBzOi8vc2NhbGFyLnVzYy5lZHUvZGV2L3NlbWFudGljLWFubm90YXRpb24tdG9vbC9yZGYvZmlsZS9tZWRpYS9JbmNlcHRpb24lMjBDb3JnaSUyMEZsb3AubXA0P2Zvcm1hdD1vYWMmcHJvdj0xJnJlYz0yXG4gICAgICAgIHZhciBhamF4X3VybCA9IHRoaXMuYmFzZVVSTCArICdyZGYvZmlsZS8nICsgc2VhcmNoUGFyYW0ucmVwbGFjZSh0aGlzLmJhc2VVUkwsICcnKSArICc/Zm9ybWF0PW9hYyZwcm92PTEmcmVjPTInO1xuICAgICAgICAvL3ZhciBhamF4X3VybCA9IHRoaXMuYmFzZVVSTCArICdyZGYvZmlsZS8nICsgc2VhcmNoUGFyYW0ucmVwbGFjZSh0aGlzLmJhc2VVUkwsJycpICsgJz9mb3JtYXQ9aWlpZiZwcm92PTEmcmVjPTInO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWpheF91cmw6IFwiICsgYWpheF91cmwpO1xuICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYWpheF91cmwsXG4gICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAganNvbnA6IFwiY2FsbGJhY2tcIixcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25wXCIsXG4gICAgICAgICAgICBhc3luYzogdHJ1ZVxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW1NlcnZlciBJbnRlcmZhY2VdIEZldGNoZWQgJyArIGRhdGEubGVuZ3RoICsgJyBhbm5vdGF0aW9ucyBmb3IgJyArIHNlYXJjaEtleSArICc6IFwiJyArIHNlYXJjaFBhcmFtICsgJ1wiLicpO1xuICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIHJldHVybmVkX3Jlc3BvbnNlID0gcmVzcG9uc2UucmVzcG9uc2VKU09OLmVycm9yLmNvZGVbMF0udmFsdWUgKyBcIiA6IFwiICsgcmVzcG9uc2UucmVzcG9uc2VKU09OLmVycm9yLm1lc3NhZ2VbMF0udmFsdWUgO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1NlcnZlciBJbnRlcmZhY2VdIEVycm9yIGZldGNoaW5nIGFubm90YXRpb25zIGZvciAnICsgc2VhcmNoS2V5ICsgJzogXCInICsgc2VhcmNoUGFyYW0gKyAnXCJcXG4gJyArIHJldHVybmVkX3Jlc3BvbnNlKTtcbiAgICAgICAgICAgIF90aGlzMi5hbm5vdGF0b3IubWVzc2FnZU92ZXJsYXkuU2hvd0Vycm9yKCdDb3VsZCBub3QgcmV0cmlldmUgYW5ub3RhdGlvbnMhPGJyPignICsgcmV0dXJuZWRfcmVzcG9uc2UgKyAnKScpO1xuXG4gICAgICAgIH0pOyAgXG4gICAgfVxuXG4gICAgUG9zdEFubm90YXRpb24oY2FsbGJhY2spe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3RpbmcgYW5ub3RhdGlvbi4uLlwiKTtcbiAgICAgICAgbGV0IGFubm90YXRpb24gPSB0aGlzLmFubm90YXRvci5ndWkuR2V0QW5ub3RhdGlvbk9iamVjdCgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhhbm5vdGF0aW9uKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJhbm5vdGF0aW9uOiBcIiArIEpTT04uc3RyaW5naWZ5KGFubm90YXRpb24pKTtcblxuICAgICAgICBsZXQga2V5O1xuICAgICAgICBpZiAodGhpcy5hbm5vdGF0b3IuYXBpS2V5KXtcbiAgICAgICAgICAgIGtleSA9IHRoaXMuYW5ub3RhdG9yLmFwaUtleTtcbiAgICAgICAgICAgIGxldCBlbWFpbF9zdG9yYWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dhbGRvcmZfdXNlcl9lbWFpbCcpO1xuICAgICAgICAgICAgbGV0IG5hbWVfc3RvcmFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3YWxkb3JmX3VzZXJfbmFtZScpO1xuICAgICAgICAgICAgaWYgKGVtYWlsX3N0b3JhZ2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW1NlcnZlciBJbnRlcmZhY2VdIFlvdSBhcmUgbm90IGxvZ2dlZCBpbiFcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hbm5vdGF0b3IubWVzc2FnZU92ZXJsYXkuU2hvd0Vycm9yKFwiWW91IGFyZSBub3QgbG9nZ2VkIGluIVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihuYW1lX3N0b3JhZ2UgPT0gbnVsbCkgbmFtZV9zdG9yYWdlID0gZW1haWxfc3RvcmFnZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3YWxkb3JmX2F1dGhfdG9rZW4nKTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW1NlcnZlciBJbnRlcmZhY2VdIFlvdSBhcmUgbm90IGxvZ2dlZCBpbiFcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hbm5vdGF0b3IubWVzc2FnZU92ZXJsYXkuU2hvd0Vycm9yKFwiWW91IGFyZSBub3QgbG9nZ2VkIGluIVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmFubm90YXRvci5hcGlLZXkpe1xuICAgICAgICAgICAgaWYoYW5ub3RhdGlvbltcImNyZWF0b3JcIl0gPT0gbnVsbCkgYW5ub3RhdGlvbltcImNyZWF0b3JcIl0gPSB7fTtcbiAgICAgICAgICAgIGFubm90YXRpb25bXCJjcmVhdG9yXCJdW1wiZW1haWxcIl0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2FsZG9yZl91c2VyX2VtYWlsJyk7XG4gICAgICAgICAgICBhbm5vdGF0aW9uW1wiY3JlYXRvclwiXVtcIm5pY2tuYW1lXCJdID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dhbGRvcmZfdXNlcl9uYW1lJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL3NldGFjdGlvbiBpbiBhbm5vdGF0aW9uIHBheWxvYWRcbiAgICAgICAgYW5ub3RhdGlvbltcInJlcXVlc3RcIl1bXCJpdGVtc1wiXVtcImFjdGlvblwiXSA9IFwiYWRkXCI7IC8vVE9ETzogdmVyMlxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUG9zdEFubm90YXRpb24gcGF5bG9hZDogXCIgKyBKU09OLnN0cmluZ2lmeShhbm5vdGF0aW9uKSk7XG4gICAgICAgIFxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgLy91cmw6IHRoaXMuYmFzZVVSTCArIFwiL2FwaS9hZGRBbm5vdGF0aW9uXCIsXG4gICAgICAgICAgICB1cmw6IHRoaXMuYmFzZVVSTCArIFwiYXBpL2FkZFwiLFxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCAvLyBOZWNlc3NhcnkgZm9yIFJhaWxzIHRvIHNlZSB0aGlzIGRhdGEgdHlwZSBjb3JyZWN0bHlcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsICAvLyBOZWNlc3NhcnkgZm9yIFJhaWxzIHRvIHNlZSB0aGlzIGRhdGEgdHlwZSBjb3JyZWN0bHlcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGFubm90YXRpb24pLCAgLy8gU3RyaW5naWZ5IG5lY2Vzc2FyeSBmb3IgUmFpbHMgdG8gc2VlIHRoaXMgZGF0YSB0eXBlIGNvcnJlY3RseVxuICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICBjb250ZXh0OiB0aGlzLFxuICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgdGhpcy5tYWtlX3dyaXRlX2F1dGgoa2V5KSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3NmdWxseSBwb3N0ZWQgbmV3IGFubm90YXRpb24uXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5ub3RhdG9yLm1lc3NhZ2VPdmVybGF5LlNob3dNZXNzYWdlKFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWQgbmV3IGFubm90YXRpb24uXCIpO1xuICAgICAgICAgICAgICAgIGFubm90YXRpb24uaWQgPSBkYXRhLmlkOyAvLyBBcHBlbmQgdGhlIElEIGdpdmVuIGJ5IHRoZSByZXNwb25zZVxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrKSBjYWxsYmFjayhhbm5vdGF0aW9uKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHJldHVybmVkX3Jlc3BvbnNlID0gcmVzcG9uc2UucmVzcG9uc2VKU09OLmVycm9yLmNvZGVbMF0udmFsdWUgKyBcIiA6IFwiICsgcmVzcG9uc2UucmVzcG9uc2VKU09OLmVycm9yLm1lc3NhZ2VbMF0udmFsdWUgO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYENvdWxkIG5vdCBwb3N0IG5ldyBhbm5vdGF0aW9uISBNZXNzYWdlOlxcbiAke3JldHVybmVkX3Jlc3BvbnNlfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5ub3RhdG9yLm1lc3NhZ2VPdmVybGF5LlNob3dFcnJvcihgQ291bGQgbm90IHBvc3QgbmV3IGFubm90YXRpb24hPGJyPigke3JldHVybmVkX3Jlc3BvbnNlfSlgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBFZGl0QW5ub3RhdGlvbihjYWxsYmFjayl7XG4gICAgICAgIGxldCBhbm5vdGF0aW9uID0gdGhpcy5hbm5vdGF0b3IuZ3VpLkdldEFubm90YXRpb25PYmplY3QoKTtcbiAgICAgICAgXG4gICAgICAgIGxldCBrZXk7XG4gICAgICAgIGlmICh0aGlzLmFubm90YXRvci5hcGlLZXkpe1xuICAgICAgICAgICAga2V5ID0gdGhpcy5hbm5vdGF0b3IuYXBpS2V5O1xuICAgICAgICAgICAgbGV0IGVtYWlsX3N0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2FsZG9yZl91c2VyX2VtYWlsJyk7XG4gICAgICAgICAgICBsZXQgbmFtZV9zdG9yYWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dhbGRvcmZfdXNlcl9uYW1lJyk7XG4gICAgICAgICAgICBpZiAoZW1haWxfc3RvcmFnZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbU2VydmVyIEludGVyZmFjZV0gWW91IGFyZSBub3QgbG9nZ2VkIGluIVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFubm90YXRvci5tZXNzYWdlT3ZlcmxheS5TaG93RXJyb3IoXCJZb3UgYXJlIG5vdCBsb2dnZWQgaW4hXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKG5hbWVfc3RvcmFnZSA9PSBudWxsKSBuYW1lX3N0b3JhZ2UgPSBlbWFpbF9zdG9yYWdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAga2V5ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dhbGRvcmZfYXV0aF90b2tlbicpO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbU2VydmVyIEludGVyZmFjZV0gWW91IGFyZSBub3QgbG9nZ2VkIGluIVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFubm90YXRvci5tZXNzYWdlT3ZlcmxheS5TaG93RXJyb3IoXCJZb3UgYXJlIG5vdCBsb2dnZWQgaW4hXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuYW5ub3RhdG9yLmFwaUtleSl7XG4gICAgICAgICAgICBpZihhbm5vdGF0aW9uW1wiY3JlYXRvclwiXSA9PSBudWxsKSBhbm5vdGF0aW9uW1wiY3JlYXRvclwiXSA9IHt9O1xuICAgICAgICAgICAgYW5ub3RhdGlvbltcImNyZWF0b3JcIl1bXCJlbWFpbFwiXSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3YWxkb3JmX3VzZXJfZW1haWwnKTtcbiAgICAgICAgICAgIGFubm90YXRpb25bXCJjcmVhdG9yXCJdW1wibmlja25hbWVcIl0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2FsZG9yZl91c2VyX25hbWUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvbGRJRCA9IGFubm90YXRpb24uaWQ7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJNb2RpZnlpbmcgYW5ub3RhdGlvbiBcIiArIG9sZElEKTtcbiAgICAgICAgXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaXMuYmFzZVVSTCArIFwiYXBpL2VkaXQvXCIsXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoYW5ub3RhdGlvbiksXG4gICAgICAgICAgICBhc3luYzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMsXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCB0aGlzLm1ha2Vfd3JpdGVfYXV0aChrZXkpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coYW5ub3RhdGlvbik7XG4gICAgICAgICAgICAgICAgYW5ub3RhdGlvbi5pZCA9IGRhdGEuaWQ7IC8vIEFwcGVuZCB0aGUgSUQgZ2l2ZW4gYnkgdGhlIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlN1Y2Nlc3NmdWxseSBlZGl0ZWQgdGhlIGFubm90YXRpb24uIChJRCBpcyBub3cgXCIgKyBkYXRhLmlkICsgXCIpXCIpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hbm5vdGF0b3IubWVzc2FnZU92ZXJsYXkuU2hvd01lc3NhZ2UoXCJTdWNjZXNzZnVsbHkgZWRpdGVkIHRoZSBhbm90YXRpb24uXCIpO1xuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrKSBjYWxsYmFjayhhbm5vdGF0aW9uLCBvbGRJRCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5lcnJvcihgQ291bGQgbm90IGVkaXQgdGhlIGFubm90YXRpb24hIE1lc3NhZ2U6XFxuICR7cmVzcG9uc2UucmVzcG9uc2VKU09OLmRldGFpbH1gKTtcbiAgICAgICAgICAgICAgICAvL3RoaXMuYW5ub3RhdG9yLm1lc3NhZ2VPdmVybGF5LlNob3dFcnJvcihgQ291bGQgbm90IGVkaXQgdGhlIGFubm90YXRpb24hPGJyPigke3Jlc3BvbnNlLnJlc3BvbnNlSlNPTi5kZXRhaWx9KWApO1xuICAgICAgICAgICAgICAgIHZhciByZXR1cm5lZF9yZXNwb25zZSA9IFwidW5kZWZpbmVkIGVycm9yIHdoaWxlIGVkaXRpbmcgdGhlIGFubm90YXRpb25cIjtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UucmVzcG9uc2VKU09OKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybmVkX3Jlc3BvbnNlID0gcmVzcG9uc2UucmVzcG9uc2VKU09OLmVycm9yLmNvZGVbMF0udmFsdWUgKyBcIiA6IFwiICsgcmVzcG9uc2UucmVzcG9uc2VKU09OLmVycm9yLm1lc3NhZ2VbMF0udmFsdWUgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBDb3VsZCBub3QgZWRpdCB0aGUgYW5ub3RhdGlvbiEgTWVzc2FnZTpcXG4gJHtyZXR1cm5lZF9yZXNwb25zZX1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFubm90YXRvci5tZXNzYWdlT3ZlcmxheS5TaG93RXJyb3IoYENvdWxkIG5vdCBlZGl0IHRoZSBhbm5vdGF0aW9uITxicj4oJHtyZXR1cm5lZF9yZXNwb25zZX0pYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgRGVsZXRlQW5ub3RhdGlvbihhbm5vdGF0aW9uKXtcblxuICAgICAgICBsZXQga2V5O1xuICAgICAgICBpZiAodGhpcy5hbm5vdGF0b3IuYXBpS2V5KXtcbiAgICAgICAgICAgIGtleSA9IHRoaXMuYW5ub3RhdG9yLmFwaUtleTtcbiAgICAgICAgICAgIGxldCBlbWFpbF9zdG9yYWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dhbGRvcmZfdXNlcl9lbWFpbCcpO1xuICAgICAgICAgICAgbGV0IG5hbWVfc3RvcmFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3YWxkb3JmX3VzZXJfbmFtZScpO1xuICAgICAgICAgICAgaWYgKGVtYWlsX3N0b3JhZ2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW1NlcnZlciBJbnRlcmZhY2VdIFlvdSBhcmUgbm90IGxvZ2dlZCBpbiFcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hbm5vdGF0b3IubWVzc2FnZU92ZXJsYXkuU2hvd0Vycm9yKFwiWW91IGFyZSBub3QgbG9nZ2VkIGluIVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihuYW1lX3N0b3JhZ2UgPT0gbnVsbCkgbmFtZV9zdG9yYWdlID0gZW1haWxfc3RvcmFnZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3YWxkb3JmX2F1dGhfdG9rZW4nKTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW1NlcnZlciBJbnRlcmZhY2VdIFlvdSBhcmUgbm90IGxvZ2dlZCBpbiFcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hbm5vdGF0b3IubWVzc2FnZU92ZXJsYXkuU2hvd0Vycm9yKFwiWW91IGFyZSBub3QgbG9nZ2VkIGluIVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmFubm90YXRvci5hcGlLZXkpe1xuICAgICAgICAgICAgaWYoYW5ub3RhdGlvbltcImNyZWF0b3JcIl0gPT0gbnVsbCkgYW5ub3RhdGlvbltcImNyZWF0b3JcIl0gPSB7fTtcbiAgICAgICAgICAgIGFubm90YXRpb25bXCJjcmVhdG9yXCJdW1wiZW1haWxcIl0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2FsZG9yZl91c2VyX2VtYWlsJyk7XG4gICAgICAgICAgICBhbm5vdGF0aW9uW1wiY3JlYXRvclwiXVtcIm5pY2tuYW1lXCJdID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dhbGRvcmZfdXNlcl9uYW1lJyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkZWxfdXJsID0gdGhpcy5iYXNlVVJMICsgXCJhcGkvZGVsZXRlXCI7XG4gICAgICAgIGxldCBkZWxfZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBcInNjYWxhcjp1cm5cIjogXCJ1cm46c2NhbGFyOnZlcnNpb246XCIgKyBhbm5vdGF0aW9uLmlkLFxuICAgICAgICAgICAgICAgIFwibmF0aXZlXCI6IFwiZmFsc2VcIixcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiOiBcIkRFTEVURVwiLFxuICAgICAgICAgICAgICAgIFwiYXBpX2tleVwiOiBhbm5vdGF0aW9uLnJlcXVlc3QuaXRlbXMuYXBpX2tleSxcbiAgICAgICAgICAgICAgICBcImlkXCI6IGFubm90YXRpb24ucmVxdWVzdC5pdGVtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgXG5cbiAgICAgICAgcmV0dXJuICQucG9zdChkZWxfdXJsLCBkZWxfZGF0YSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRlIGVycm9yIHJlc3BvbnNlXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSAgXG4gICAgICAgIH0pLmRvbmUoKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkIHRoZSBhbm5vdGF0aW9uLlwiKTtcbiAgICAgICAgICAgIHRoaXMuYW5ub3RhdG9yLm1lc3NhZ2VPdmVybGF5LlNob3dNZXNzYWdlKFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWQgdGhlIGFubm90YXRpb24uXCIpO1xuICAgICAgICB9KS5mYWlsKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgdmFyIHJldHVybmVkX3Jlc3BvbnNlID0gXCJ1bmRlZmluZWQgZmFpbHVyZSB3aGlsZSBkZWxldGluZyB0aGUgYW5ub3RhdGlvblwiO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnJlc3BvbnNlSlNPTikge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3BvbnNlSlNPTi5lcnJvci5jb2RlWzBdLnZhbHVlICsgXCIgOiBcIiArIHJlc3BvbnNlLnJlc3BvbnNlSlNPTi5lcnJvci5tZXNzYWdlWzBdLnZhbHVlIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYENvdWxkIG5vdCBkZWxldGUgdGhlIGFubm90YXRpb24uIE1lc3NhZ2U6XFxuICR7cmV0dXJuZWRfcmVzcG9uc2V9YCk7XG4gICAgICAgICAgICB0aGlzLmFubm90YXRvci5tZXNzYWdlT3ZlcmxheS5TaG93RXJyb3IoYENvdWxkIG5vdCBkZWxldGUgdGhlIGFubm90YXRpb24hPGJyPigke3JldHVybmVkX3Jlc3BvbnNlfSlgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cblxuZXhwb3J0IHsgU2VydmVySW50ZXJmYWNlIH07IiwibGV0IHNoYTEgPSByZXF1aXJlKCdzaGExJyk7XG5cbi8qKlxuICogTWFuYWdlcyB0aGUgdXNlciBzZXNzaW9uIGZvciBjb21tdW5pY2F0aW5nIHdpdGggdGhlIGJhY2tlbmQuXG4gKi9cbmNsYXNzIFNlc3Npb25NYW5hZ2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKGFubm90YXRvcil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nlc3Npb24gTWFuYWdlcl0gQ3JlYXRpbmcgU2Vzc2lvbk1hbmFnZXIuLi5cIik7XG4gICAgICAgIHRoaXMuYW5ub3RhdG9yID0gYW5ub3RhdG9yO1xuICAgICAgICB0aGlzLm1vZGFsT3BlbiA9IGZhbHNlO1xuXG4gICAgICAgIC8vIEluamVjdCB0aGUgYnV0dG9uIGZvciBsb2dnaW5nIGluL291dCBpbnRvIHRoZSB0b29sYmFyXG4gICAgICAgIGlmKCFhbm5vdGF0b3Iua2lvc2tNb2RlICYmIGFubm90YXRvci5jbXNFbWFpbCA9PSAnJyl7XG4gICAgICAgICAgICB0aGlzLiR1c2VyQnV0dG9uID0gJChcIjxidXR0b24+U2Vzc2lvbjwvYnV0dG9uPlwiKS5idXR0b24oe1xuICAgICAgICAgICAgICAgIGljb246IFwiZmEgZmEtdXNlclwiLFxuICAgICAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgICAgIH0pLmNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLlByZXNlbnRNb2RhbCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFubm90YXRvci5wbGF5ZXIuY29udHJvbEJhci5SZWdpc3RlckVsZW1lbnQodGhpcy4kdXNlckJ1dHRvbiwgMSwgJ2ZsZXgtZW5kJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy90aGlzLiRkaWFsb2cuZGlhbG9nKFwib3BlblwiKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcIltTZXNzaW9uIE1hbmFnZXJdIFNlc3Npb25NYW5hZ2VyIGNyZWF0ZWQuXCIpO1xuXG4gICAgfVxuXG4gICAgU2hvd0xvZ2luTW9kYWwoKXtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIGRpYWxvZ1xuICAgICAgICBsZXQgJGNvbnRhaW5lciA9ICQoXCI8ZGl2IGNsYXNzPSd3YWxkb3JmLXNlc3Npb24tbW9kYWwnIHRpdGxlPSdMb2cgSW4nPjwvZGl2PlwiKTsgLy8gT3V0ZXJtb3N0IEhUTUxcbiAgICAgICAgbGV0ICRoZWFkVGV4dCA9ICQoXCI8cCBjbGFzcz0ndmFsaWRhdGVUaXBzJz5BbGwgZmllbGRzIGFyZSByZXF1aXJlZC48L3A+XCIpLmFwcGVuZFRvKCRjb250YWluZXIpO1xuICAgICAgICBsZXQgJGZvcm0gPSAkKFwiPGZvcm0+PC9mb3JtPlwiKS5hcHBlbmRUbygkY29udGFpbmVyKTtcblxuICAgICAgICBsZXQgJG5pY2tuYW1lRmllbGQ7XG4gICAgICAgIGxldCAkdXNlcm5hbWVGaWVsZDtcbiAgICAgICAgbGV0ICRwYXNzd29yZEZpZWxkO1xuXG4gICAgICAgIGlmICh0aGlzLmFubm90YXRvci5hcGlLZXkpe1xuICAgICAgICAgICAgJChcIjxsYWJlbCBmb3I9J3VzZXJuYW1lJz5OYW1lPC9sYWJlbD5cIikuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgJG5pY2tuYW1lRmllbGQgPSAkKFwiPGlucHV0IHR5cGU9J3RleHQnIG5hbWU9J3VzZXJuYW1lJyB2YWx1ZT0nJyBjbGFzcz0ndGV4dCB1aS13aWRnZXQtY29udGVudCB1aS1jb3JuZXItYWxsJz5cIikuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgJChcIjxsYWJlbCBmb3I9J3VzZXJuYW1lJz5FbWFpbCBBZGRyZXNzPC9sYWJlbD5cIikuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgJHVzZXJuYW1lRmllbGQgPSAkKFwiPGlucHV0IHR5cGU9J3RleHQnIG5hbWU9J2VtYWlsJyB2YWx1ZT0nJyBjbGFzcz0ndGV4dCB1aS13aWRnZXQtY29udGVudCB1aS1jb3JuZXItYWxsJz5cIikuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJChcIjxsYWJlbCBmb3I9J3VzZXJuYW1lJz5Vc2VybmFtZTwvbGFiZWw+XCIpLmFwcGVuZFRvKCRmb3JtKTtcbiAgICAgICAgICAgICR1c2VybmFtZUZpZWxkID0gJChcIjxpbnB1dCB0eXBlPSd0ZXh0JyBuYW1lPSd1c2VybmFtZScgdmFsdWU9JycgY2xhc3M9J3RleHQgdWktd2lkZ2V0LWNvbnRlbnQgdWktY29ybmVyLWFsbCc+XCIpLmFwcGVuZFRvKCRmb3JtKTtcbiAgICAgICAgICAgICQoXCI8bGFiZWwgZm9yPSdwYXNzd29yZCc+UGFzc3dvcmQ8L2xhYmVsPlwiKS5hcHBlbmRUbygkZm9ybSk7XG4gICAgICAgICAgICAkcGFzc3dvcmRGaWVsZCA9ICQoXCI8aW5wdXQgdHlwZT0ncGFzc3dvcmQnIG5hbWU9J3Bhc3N3b3JkJyB2YWx1ZT0nJyBjbGFzcz0ndGV4dCB1aS13aWRnZXQtY29udGVudCB1aS1jb3JuZXItYWxsJz5cIikuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkZm9ybS53cmFwSW5uZXIoXCI8ZmllbGRzZXQgLz5cIik7XG5cbiAgICAgICAgbGV0IGxvZ2luID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5hbm5vdGF0b3IuYXBpS2V5KXtcbiAgICAgICAgICAgICAgICBsZXQgbmlja05hbWUgPSAkbmlja25hbWVGaWVsZC52YWwoKTtcbiAgICAgICAgICAgICAgICBsZXQgdXNlck5hbWUgPSBzaGExKCR1c2VybmFtZUZpZWxkLnZhbCgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFubm90YXRvci5zZXJ2ZXIuTG9nSW4obmlja05hbWUsIHVzZXJOYW1lKS5kb25lKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBUEkga2V5IGxvZ2luIHN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgICRkaWFsb2cuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgICAgICAgICAgfSkuZmFpbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRoZWFkVGV4dC5odG1sKFwiPHA+SW52YWxpZCBlbWFpbCBhZGRyZXNzLjwvcD5cIik7XG4gICAgICAgICAgICAgICAgICAgICRoZWFkVGV4dC5jc3MoXCJjb2xvclwiLCBcInJlZFwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCB1c2VyUGFzcyA9IHNoYTEoJHBhc3N3b3JkRmllbGQudmFsKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5ub3RhdG9yLnNlcnZlci5Mb2dJbigkdXNlcm5hbWVGaWVsZC52YWwoKSwgdXNlclBhc3MpLmRvbmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkZGlhbG9nLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICAgICAgICAgIH0pLmZhaWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkaGVhZFRleHQuaHRtbChcIjxwPkludmFsaWQgdXNlcm5hbWUgb3IgcGFzc3dvcmQuPC9wPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRUZXh0LmNzcyhcImNvbG9yXCIsIFwicmVkXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgJGRpYWxvZyA9ICRjb250YWluZXIuZGlhbG9nKHtcbiAgICAgICAgICAgIGF1dG9PcGVuOiB0cnVlLFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgICAgIFwiTG9nIEluXCI6IGxvZ2luLFxuICAgICAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkZGlhbG9nLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICRkaWFsb2cuZmluZChcImZvcm1cIilbIDAgXS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICRkaWFsb2cuZmluZChcImlucHV0XCIpLnJlbW92ZUNsYXNzKCBcInVpLXN0YXRlLWVycm9yXCIgKTtcbiAgICAgICAgICAgICAgICB0aGlzLk9uTW9kYWxDbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBTaG93TG9nb3V0TW9kYWwoKXtcbiAgICAgICAgbGV0ICRjb250YWluZXIgPSAkKFwiPGRpdiB0aXRsZT0nTG9nIE91dCc+PC9kaXY+XCIpO1xuICAgICAgICBsZXQgJGhlYWRUZXh0ID0gJGNvbnRhaW5lci5odG1sKFwiPHAgY2xhc3M9J3ZhbGlkYXRlVGlwcyc+QXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxvZyBvdXQ/PC9wPlwiKTtcbiAgICAgICAgbGV0ICRkaWFsb2cgPSAkY29udGFpbmVyLmRpYWxvZyh7XG4gICAgICAgICAgICBhdXRvT3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgICAgICBcIkxvZyBPdXRcIjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFubm90YXRvci5zZXJ2ZXIuTG9nT3V0KCkuZG9uZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZGlhbG9nLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkZGlhbG9nLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuT25Nb2RhbENsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIFByZXNlbnRNb2RhbCgpe1xuICAgICAgICAvLyBFYXJseSBvdXQgaWYgdGhlIG1vZGFsIGlzIGFscmVhZHkgb3BlblxuICAgICAgICBpZih0aGlzLm1vZGFsT3BlbikgcmV0dXJuO1xuXG4gICAgICAgIC8vIFR1cm4gb2ZmIGZ1bGxzY3JlZW4gaWYgaXQncyBvblxuICAgICAgICB0aGlzLmFubm90YXRvci5wbGF5ZXIuU2V0RnVsbHNjcmVlbihmYWxzZSk7XG5cbiAgICAgICAgaWYodGhpcy5hbm5vdGF0b3Iuc2VydmVyLkxvZ2dlZEluKCkpe1xuICAgICAgICAgICAgdGhpcy5TaG93TG9nb3V0TW9kYWwoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuU2hvd0xvZ2luTW9kYWwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuT25Nb2RhbE9wZW4oKTtcbiAgICB9XG5cbiAgICBPbk1vZGFsT3Blbigpe1xuICAgICAgICB0aGlzLiR1c2VyQnV0dG9uLmJ1dHRvbihcImRpc2FibGVcIik7XG4gICAgICAgIHRoaXMubW9kYWxPcGVuID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBPbk1vZGFsQ2xvc2UoKXtcbiAgICAgICAgdGhpcy4kdXNlckJ1dHRvbi5idXR0b24oXCJlbmFibGVcIik7XG4gICAgICAgIHRoaXMubW9kYWxPcGVuID0gZmFsc2U7XG4gICAgfVxuXG59XG5cbmV4cG9ydCB7IFNlc3Npb25NYW5hZ2VyIH07IiwibW9kdWxlLmV4cG9ydHM9e1xuICAgIFwiY29uZmlnRmlsZVwiOiBcImFubm90YXRvci1jb25maWcuanNvblwiXG59IiwiLypcbkVudHJ5IHBvaW50IGZvciB0aGUgd2hvbGUgcHJvamVjdC4gQW55IGpRdWVyeSBleHRlbnNpb25zIHNob3VsZFxuYmUgcmVnaXN0ZXJlZCBoZXJlLlxuKi9cblxuLy8gSW1wb3J0IG5wbSBtb2R1bGUgZGVwZW5kZW5jaWVzXG5pbXBvcnQgXCIuL3ZlbmRvci5qc1wiO1xuXG5pbXBvcnQgXCIuL3V0aWxzL2FycmF5LWV4dGVuc2lvbnMuanNcIjtcbmltcG9ydCBcIi4vdXRpbHMvanF1ZXJ5LWV4dGVuc2lvbnMuanNcIjtcbmltcG9ydCBcIi4vdXRpbHMvc3RyaW5nLWV4dGVuc2lvbnMuanNcIjtcblxuaW1wb3J0IHsgcHJlZmVyZW5jZXMgfSBmcm9tIFwiLi91dGlscy9wcmVmZXJlbmNlLW1hbmFnZXIuanNcIjtcbmltcG9ydCB7IFZlcmlmeVJlcXVpcmVtZW50cyB9IGZyb20gXCIuL3V0aWxzL3JlcXVpcmVtZW50cy5qc1wiO1xuaW1wb3J0IHsgQW5ub3RhdG9yVmlkZW9QbGF5ZXIgfSBmcm9tIFwiLi92aWRlby1wbGF5ZXIvdmlkZW8tcGxheWVyLmpzXCI7XG5cblxuJC5mbi5hbm5vdGF0ZSA9IGZ1bmN0aW9uKGFyZ3MpeyBcblxuICAgIC8vIGxldCBzZXJ2ZXJVUkwgPSBhcmdzLnNlcnZlclVSTCB8fCAnJztcbiAgICAvLyBsZXQgdGFnc1VSTCA9IGFyZ3MudGFnc1VSTCB8fCAnJztcbiAgICAvLyBsZXQgYXBpS2V5ID0gYXJncy5hcGlLZXkgfHwgJyc7XG4gICAgLy8gbGV0IGtpb3NrTW9kZSA9IGFyZ3Mua2lvc2tNb2RlIHx8IGZhbHNlO1xuICAgIC8vIGxldCBsb2NhbFVSTCA9IGFyZ3MubG9jYWxVUkwgfHwgJyc7XG4gICAgLy8gbGV0IHJlbmRlcmVyID0gZnVuY3Rpb24oLi4uKSB8fCBmYWxzZTtcblxuICAgIC8vIEVycm9yIG91dCBlYXJseSBpZiBcInRoaXNcIiBpcyBub3QgYSB2aWRlb1xuICAgIGlmKCQodGhpcykucHJvcCgndGFnTmFtZScpLnRvTG93ZXJDYXNlKCkgIT0gXCJ2aWRlb1wiKXtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCB3cmFwIGEgbm9uLXZpZGVvIGVsZW1lbnQhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIVZlcmlmeVJlcXVpcmVtZW50cygpKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHByZWZlcmVuY2VzLkdldEpTT04oKGRhdGEpID0+IHtcbiAgICAvLyAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcbiAgICAvLyB9KTtcbiAgICBcbiAgICBuZXcgQW5ub3RhdG9yVmlkZW9QbGF5ZXIoJCh0aGlzKSwgYXJncyk7XG5cbn07IiwiLy8gRnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNDg1Mzk3NC83MTM4NzkyXG5cbi8vIFdhcm4gaWYgb3ZlcnJpZGluZyBleGlzdGluZyBtZXRob2RcbmlmKEFycmF5LnByb3RvdHlwZS5lcXVhbHMpXG4gICAgY29uc29sZS53YXJuKFwiT3ZlcnJpZGluZyBleGlzdGluZyBBcnJheS5wcm90b3R5cGUuZXF1YWxzLiBQb3NzaWJsZSBjYXVzZXM6IE5ldyBBUEkgZGVmaW5lcyB0aGUgbWV0aG9kLCBcXFxuICAgIHRoZXJlJ3MgYSBmcmFtZXdvcmsgY29uZmxpY3Qgb3IgeW91J3ZlIGdvdCBkb3VibGUgaW5jbHVzaW9ucyBpbiB5b3VyIGNvZGUuXCIpO1xuICAgIFxuLy8gYXR0YWNoIHRoZSAuZXF1YWxzIG1ldGhvZCB0byBBcnJheSdzIHByb3RvdHlwZSB0byBjYWxsIGl0IG9uIGFueSBhcnJheVxuQXJyYXkucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIChhcnJheSkge1xuICAgIC8vIGlmIHRoZSBvdGhlciBhcnJheSBpcyBhIGZhbHN5IHZhbHVlLCByZXR1cm5cbiAgICBpZiAoIWFycmF5KVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBjb21wYXJlIGxlbmd0aHMgLSBjYW4gc2F2ZSBhIGxvdCBvZiB0aW1lIFxuICAgIGlmICh0aGlzLmxlbmd0aCAhPSBhcnJheS5sZW5ndGgpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsPXRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIHdlIGhhdmUgbmVzdGVkIGFycmF5c1xuICAgICAgICBpZiAodGhpc1tpXSBpbnN0YW5jZW9mIEFycmF5ICYmIGFycmF5W2ldIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIC8vIHJlY3Vyc2UgaW50byB0aGUgbmVzdGVkIGFycmF5c1xuICAgICAgICAgICAgaWYgKCF0aGlzW2ldLmVxdWFscyhhcnJheVtpXSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICBcbiAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgIGVsc2UgaWYgKHRoaXNbaV0gIT0gYXJyYXlbaV0pIHsgXG4gICAgICAgICAgICAvLyBXYXJuaW5nIC0gdHdvIGRpZmZlcmVudCBvYmplY3QgaW5zdGFuY2VzIHdpbGwgbmV2ZXIgYmUgZXF1YWw6IHt4OjIwfSAhPSB7eDoyMH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICBcbiAgICAgICAgfSAgICAgICAgICAgXG4gICAgfSAgICAgICBcbiAgICByZXR1cm4gdHJ1ZTtcbn1cbi8vIEhpZGUgbWV0aG9kIGZyb20gZm9yLWluIGxvb3BzXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCBcImVxdWFsc1wiLCB7ZW51bWVyYWJsZTogZmFsc2V9KTsiLCIvKipcbiAqIFNldHMgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGVsZW1lbnQgd2hpbGUgZGlzYWJsaW5nIGludGVyYWN0aW9uLlxuICogRG9lc24ndCBtZXNzIHdpdGggalF1ZXJ5J3MgcG9zaXRpb25pbmcgY2FsY3VsYXRpb25zIGxpa2Ugc2hvdygpXG4gKiBhbmQgaGlkZSgpLlxuICovXG4kLmZuLm1ha2VWaXNpYmxlID0gZnVuY3Rpb24oc2hvdykge1xuICAgIGlmKHNob3cpe1xuICAgICAgICAkKHRoaXMpLmNzcyh7XG4gICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJ2aXNpYmxlXCIsXG4gICAgICAgICAgICBcInBvaW50ZXItZXZlbnRzXCI6IFwiXCJcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzKS5jc3Moe1xuICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICBcInBvaW50ZXItZXZlbnRzXCI6IFwibm9uZVwiXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbn1cblxuLypcbkNvcHlyaWdodCAyMDE0IE1pa2UgRHVublxuaHR0cDovL3Vwc2hvdHMub3JnL1xuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5hIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcblwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xud2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG5wZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbnRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5pbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5FWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbk1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG5OT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG5MSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5PRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbldJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5odHRwczovL2dpdGh1Yi5jb20vbW9hZ3JpdXMvY29weWNzc1xuXG4qL1xuXHRcbiQuZm4uZ2V0U3R5bGVzID0gZnVuY3Rpb24ob25seSwgZXhjZXB0KSB7XG4gICAgXG4gICAgLy8gdGhlIG1hcCB0byByZXR1cm4gd2l0aCByZXF1ZXN0ZWQgc3R5bGVzIGFuZCB2YWx1ZXMgYXMgS1ZQXG4gICAgdmFyIHByb2R1Y3QgPSB7fTtcbiAgICBcbiAgICAvLyB0aGUgc3R5bGUgb2JqZWN0IGZyb20gdGhlIERPTSBlbGVtZW50IHdlIG5lZWQgdG8gaXRlcmF0ZSB0aHJvdWdoXG4gICAgdmFyIHN0eWxlO1xuICAgIFxuICAgIC8vIHJlY3ljbGUgdGhlIG5hbWUgb2YgdGhlIHN0eWxlIGF0dHJpYnV0ZVxuICAgIHZhciBuYW1lO1xuICAgIFxuICAgIC8vIGlmIGl0J3MgYSBsaW1pdGVkIGxpc3QsIG5vIG5lZWQgdG8gcnVuIHRocm91Z2ggdGhlIGVudGlyZSBzdHlsZSBvYmplY3RcbiAgICBpZiAob25seSAmJiBvbmx5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gb25seS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIC8vIHNpbmNlIHdlIGhhdmUgdGhlIG5hbWUgYWxyZWFkeSwganVzdCByZXR1cm4gdmlhIGJ1aWx0LWluIC5jc3MgbWV0aG9kXG4gICAgICAgICAgICBuYW1lID0gb25seVtpXTtcbiAgICAgICAgICAgIHByb2R1Y3RbbmFtZV0gPSB0aGlzLmNzcyhuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAvLyBwcmV2ZW50IGZyb20gZW1wdHkgc2VsZWN0b3JcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgd2UgbmVlZCB0byBnZXQgZXZlcnl0aGluZ1xuICAgICAgICAgICAgdmFyIGRvbSA9IHRoaXMuZ2V0KDApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBzdGFuZGFyZHNcbiAgICAgICAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbnZlbmllbmNlIG1ldGhvZHMgdG8gdHVybiBjc3MgY2FzZSAoJ2JhY2tncm91bmQtaW1hZ2UnKSB0byBjYW1lbCAoJ2JhY2tncm91bmRJbWFnZScpXG4gICAgICAgICAgICAgICAgdmFyIHBhdHRlcm4gPSAvXFwtKFthLXpdKS9nO1xuICAgICAgICAgICAgICAgIHZhciB1YyA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIH07XHRcdFx0XG4gICAgICAgICAgICAgICAgdmFyIGNhbWVsaXplID0gZnVuY3Rpb24oc3RyaW5nKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHBhdHRlcm4sIHVjKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSdyZSBnZXR0aW5nIGEgZ29vZCByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb20sIG51bGwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYW1lbCwgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9wZXJhIGRvZXNuJ3QgZ2l2ZSBiYWNrIHN0eWxlLmxlbmd0aCAtIHVzZSB0cnV0aHkgc2luY2UgYSAwIGxlbmd0aCBtYXkgYXMgd2VsbCBiZSBza2lwcGVkIGFueXdheXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0eWxlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdHlsZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0gc3R5bGVbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FtZWwgPSBjYW1lbGl6ZShuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdFtjYW1lbF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9wZXJhXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKG5hbWUgaW4gc3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW1lbCA9IGNhbWVsaXplKG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKSB8fCBzdHlsZVtuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0W2NhbWVsXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSUUgLSBmaXJzdCB0cnkgY3VycmVudFN0eWxlLCB0aGVuIG5vcm1hbCBzdHlsZSBvYmplY3QgLSBkb24ndCBib3RoZXIgd2l0aCBydW50aW1lU3R5bGVcbiAgICAgICAgICAgIGVsc2UgaWYgKHN0eWxlID0gZG9tLmN1cnJlbnRTdHlsZSkge1xuICAgICAgICAgICAgICAgIGZvciAobmFtZSBpbiBzdHlsZSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0W25hbWVdID0gc3R5bGVbbmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc3R5bGUgPSBkb20uc3R5bGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKG5hbWUgaW4gc3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVtuYW1lXSAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0W25hbWVdID0gc3R5bGVbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gcmVtb3ZlIGFueSBzdHlsZXMgc3BlY2lmaWVkLi4uXG4gICAgLy8gYmUgY2FyZWZ1bCBvbiBibGFja2xpc3QgLSBzb21ldGltZXMgdmVuZG9yLXNwZWNpZmljIHZhbHVlcyBhcmVuJ3Qgb2J2aW91cyBidXQgd2lsbCBiZSB2aXNpYmxlLi4uICBlLmcuLCBleGNlcHRpbmcgJ2NvbG9yJyB3aWxsIHN0aWxsIGxldCAnLXdlYmtpdC10ZXh0LWZpbGwtY29sb3InIHRocm91Z2gsIHdoaWNoIHdpbGwgaW4gZmFjdCBjb2xvciB0aGUgdGV4dFxuICAgIGlmIChleGNlcHQgJiYgZXhjZXB0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBleGNlcHQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBuYW1lID0gZXhjZXB0W2ldO1xuICAgICAgICAgICAgZGVsZXRlIHByb2R1Y3RbbmFtZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gb25lIHdheSBvdXQgc28gd2UgY2FuIHByb2Nlc3MgYmxhY2tsaXN0IGluIG9uZSBzcG90XG4gICAgcmV0dXJuIHByb2R1Y3Q7XG5cbn07XG5cbi8vIHN1Z2FyIC0gc291cmNlIGlzIHRoZSBzZWxlY3RvciwgZG9tIGVsZW1lbnQgb3IgalF1ZXJ5IGluc3RhbmNlIHRvIGNvcHkgZnJvbSAtIG9ubHkgYW5kIGV4Y2VwdCBhcmUgb3B0aW9uYWxcbiQuZm4uY29weUNTUyA9IGZ1bmN0aW9uKHNvdXJjZSwgb25seSwgZXhjZXB0KSB7XG4gICAgdmFyIHN0eWxlcyA9IHNvdXJjZS5nZXRTdHlsZXMob25seSwgZXhjZXB0KTtcbiAgICB0aGlzLmNzcyhzdHlsZXMpO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xufTsiLCIvLyBCcmluZyBpbiBidWlsZCBjb25maWcgb3B0aW9uc1xubGV0IG1ldGFjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnLmpzb25cIik7XG5cbmNsYXNzIFByZWZlcmVuY2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIEdldEpTT04oY2FsbGJhY2spe1xuXG4gICAgICAgIC8vbGV0IGxvYyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgICAgLy9sZXQgZGlyID0gbG9jLnN1YnN0cmluZygwLCBsb2MubGFzdEluZGV4T2YoJy8nKSk7XG4gICAgICAgIFxuICAgICAgICBsZXQgZGlyID0gXCIuL2Rpc3QvXCI7XG4gICAgICAgIC8vY29uc29sZS5sb2coZGlyICsgbWV0YWNvbmZpZy5jb25maWdGaWxlKTtcblxuICAgICAgICBpZih0aGlzLmNhY2hlZEpTT04gIT0gbnVsbCl7XG4gICAgICAgICAgICBjYWxsYmFjayh0aGlzLmNhY2hlZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgIHVybDogZGlyICsgbWV0YWNvbmZpZy5jb25maWdGaWxlLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhKT0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlZEpTT04gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0aGlzLmNhY2hlZEpTT04pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGxldCBwcmVmZXJlbmNlcyA9IG5ldyBQcmVmZXJlbmNlTWFuYWdlcigpOyIsIi8qKlxuICogUmV0dXJucyBmYWxzZSBpZiBydW5uaW5nIG9uIGFuIHVuc3VwcG9ydGVkIHBsYXRmb3JtIG9yIG1pc3NpbmcgalF1ZXJ5LCBvdGhlcndpc2UgdHJ1ZS5cbiAqIFxuICovXG5leHBvcnQgZnVuY3Rpb24gVmVyaWZ5UmVxdWlyZW1lbnRzKCkge1xuICAgIFxuICAgIC8vIFN0b3AgcnVubmluZyBpZiB3ZSdyZSBvbiBhbiB1bnN1cHBvcnRlZCBwbGF0Zm9ybSAobW9iaWxlIGZvciBub3cpXG4gICAgLy8gaWYoIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSApIHtcbiAgICAvLyAgICAgY29uc29sZS5lcnJvcihcIlBsYXRmb3JtIGlzIHVuc3VwcG9ydGVkIVwiKTtcbiAgICAvLyAgICAgLy9sZXQgdW5zdXBwb3J0ZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIC8vICAgICAvL3Vuc3VwcG9ydGVkRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiWW91ciBwbGF0Zm9ybSBpcyB1bnN1cHBvcnRlZCFcIikpO1xuICAgIC8vICAgICAvL2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodW5zdXBwb3J0ZWREaXYpO1xuICAgIC8vICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gfVxuXG4gICAgLy8gQ2hlY2sgaWYgd2UgZG9uJ3QgaGF2ZSBqUXVlcnkgbG9hZGVkXG4gICAgaWYoIXdpbmRvdy5qUXVlcnkpe1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSlF1ZXJ5IG11c3QgYmUgcHJlc2VudCFcIik7XG4gICAgICAgIC8vbGV0IHVuc3VwcG9ydGVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgLy91bnN1cHBvcnRlZERpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIllvdXIgcGxhdGZvcm0gaXMgdW5zdXBwb3J0ZWQhXCIpKTtcbiAgICAgICAgLy9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHVuc3VwcG9ydGVkRGl2KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICAgIFxufSIsIlxuLyoqXG4gKiBFc2NhcGVzIHRoZSBzdHJpbmcgc28gaXQgY2FuIGVtYmVkIGRpcmVjdGx5IGluIGFuIEhUTUwgZG9jdW1lbnQuXG4gKi9cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEyMDM0MzM0XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU3RyaW5nLnByb3RvdHlwZSwgJ2VzY2FwZUhUTUwnLCB7XG4gICAgdmFsdWUoKSB7XG4gICAgICAgIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgICAgICAgICAnJic6ICcmYW1wOycsICc8JzogJyZsdDsnLCAnPic6ICcmZ3Q7JywgJ1wiJzogJyZxdW90OycsXG4gICAgICAgICAgICBcIidcIjogJyYjMzk7JywgJy8nOiAnJiN4MkY7JywgJ2AnOiAnJiN4NjA7JywgJz0nOiAnJiN4M0Q7J1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMpLnJlcGxhY2UoL1smPD5cIidgPVxcL10vZywgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIHJldHVybiBlbnRpdHlNYXBbc107XG4gICAgICAgIH0pO1xuICAgIH1cbn0pOyIsIi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0ODQxMDI2XG5mdW5jdGlvbiBHZXRGb3JtYXR0ZWRUaW1lKHRpbWVJblNlY29uZHMpe1xuICAgIGlmKGlzTmFOKHRpbWVJblNlY29uZHMpKSByZXR1cm4gMDtcbiAgICBsZXQgdGltZSA9IHRpbWVJblNlY29uZHMgfCAwOyAvL1RydW5jYXRlIHRvIGludGVnZXJcbiAgICBsZXQgaG91cnMgICA9IE1hdGguZmxvb3IodGltZSAvIDM2MDApICUgMjRcbiAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGltZSAvIDYwKSAlIDYwXG4gICAgbGV0IHNlY29uZHMgPSB0aW1lICUgNjBcbiAgICBsZXQgZm9ybWF0dGVkID0gW2hvdXJzLG1pbnV0ZXMsc2Vjb25kc11cbiAgICAgICAgLm1hcCh2ID0+IHYgPCAxMCA/IFwiMFwiICsgdiA6IHYpXG4gICAgICAgIC5maWx0ZXIoKHYsaSkgPT4gdiAhPT0gXCIwMFwiIHx8IGkgPiAwKVxuICAgICAgICAuam9pbihcIjpcIilcblxuICAgIGlmIChmb3JtYXR0ZWQuY2hhckF0KDApID09IFwiMFwiKSB7XG4gICAgICAgIGZvcm1hdHRlZCA9IGZvcm1hdHRlZC5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgbGV0IG1zID0gKHRpbWVJblNlY29uZHMgJSAxKS50b0ZpeGVkKDIpO1xuICAgIGZvcm1hdHRlZCArPSBtcy50b1N0cmluZygpLnN1YnN0cigxKTtcblxuICAgIHJldHVybiBmb3JtYXR0ZWQ7XG59XG5cbi8vIEZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTY0MDQxNy83MTM4NzkyXG5mdW5jdGlvbiBHZXRTZWNvbmRzRnJvbUhNUyhobXMpe1xuICAgIGxldCBwYXJ0cyA9IGhtcy5zcGxpdCgnLicpO1xuICAgIGxldCBtcyA9IFwiMFwiO1xuICAgIGlmKHBhcnRzLmxlbmd0aCA+IDEpIG1zID0gJy4nK3BhcnRzWzFdO1xuXG4gICAgbGV0IHAgPSBwYXJ0c1swXS5zcGxpdCgnOicpLFxuICAgICAgICBzID0gMCwgbSA9IDE7XG5cbiAgICB3aGlsZSAocC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHMgKz0gbSAqIHBhcnNlSW50KHAucG9wKCksIDEwKTtcbiAgICAgICAgbSAqPSA2MDtcbiAgICB9XG5cbiAgICBzICs9IHBhcnNlRmxvYXQobXMpO1xuICAgIHJldHVybiBzO1xufVxuXG5leHBvcnQgeyBHZXRGb3JtYXR0ZWRUaW1lLCBHZXRTZWNvbmRzRnJvbUhNUyB9OyIsIi8qKlxuICogVXNlIHRoaXMgZmlsZSB0byBpbXBvcnQgd2hhdCB5b3UgbmVlZCBmcm9tIHRoZSBidW5kbGVkIG5wbSBtb2R1bGVzLlxuICovXG5cbi8vIE11c3QgaW1wb3J0IGZyb20gbm9kZV9tb2R1bGVzIGZvbGRlciBvciBpdCB3b24ndCBzZWUgdGhlIHNoaW1tZWQganF1ZXJ5IGluc3RhbmNlXG4vLyBSZW1vdmVkIGZyb20gaGVyZSBiZWNhdXNlIHRoZXkgd2VyZW4ndCBiZWluZyBsb2FkZWQgaW4gdGhlIHJpZ2h0IG9yZGVyIC0gSlBCXG4vLyBpbXBvcnQgJy4uL25vZGVfbW9kdWxlcy9zZWxlY3QyL2Rpc3QvanMvc2VsZWN0Mi5qcyc7XG4vLyBpbXBvcnQgXCIuLi9ub2RlX21vZHVsZXMvc2VsZWN0Mi9kaXN0L2Nzcy9zZWxlY3QyLmNzc1wiO1xuXG5pbXBvcnQgXCJxdGlwMlwiO1xuLy9yZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL3F0aXAyL2Rpc3QvanF1ZXJ5LnF0aXAubWluLmpzXCIpO1xuLy9pbXBvcnQgXCIuLi9ub2RlX21vZHVsZXMvcXRpcDIvZGlzdC9qcXVlcnkucXRpcC5taW4uY3NzXCI7XG5cbmltcG9ydCBcImNsaXAtcGF0aC1wb2x5Z29uXCI7XG5cbi8vbGV0IHNjcmVlbmZ1bGwgPSByZXF1aXJlKCdzY3JlZW5mdWxsJyk7XG4vL2ltcG9ydCBzY3JlZW5mdWxsIGZyb20gXCJzY3JlZW5mdWxsXCI7XG5cbi8vIENETiByZXNvdXJjZXNcbi8vIEZvbnQtQXdlc29tZVxuLy8kKFwiaGVhZFwiKS5hcHBlbmQoJChcIjxzY3JpcHQgc3JjPSdodHRwczovL3VzZS5mb250YXdlc29tZS5jb20vYTcwM2UyZTViZi5qcyc+PC9zY3JpcHQ+XCIpKTsiLCJpbXBvcnQgeyBHZXRGb3JtYXR0ZWRUaW1lIH0gZnJvbSBcIi4uL3V0aWxzL3RpbWUuanNcIjtcblxuY2xhc3MgU2Vla2JhclRvb2x0aXAge1xuICAgIGNvbnN0cnVjdG9yKCRwYXJlbnQsIHBsYXllcil7XG4gICAgICAgIHRoaXMuJHBhcmVudCA9ICRwYXJlbnQ7XG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuXG4gICAgICAgIHRoaXMuJHRvb2x0aXAgPSAkKFwiPGRpdiBjbGFzcz0nd2FsZG9yZi1zZWVrYmFyLXRvb2x0aXAnPjwvZGl2PlwiKS5hcHBlbmRUbygkcGFyZW50KTtcbiAgICAgICAgdGhpcy50ZXh0ID0gXCJUZXN0XCI7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQgPSAkKFwiPHA+XCIgKyB0aGlzLnRleHQgKyBcIjwvcD5cIikuYXBwZW5kVG8odGhpcy4kdG9vbHRpcCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmhvdmVyT2Zmc2V0ID0gLTEwO1xuICAgICAgICB0aGlzLnBhZGRpbmcgPSA1O1xuICAgICAgICBcbiAgICAgICAgdGhpcy5IaWRlKCk7XG5cbiAgICAgICAgdGhpcy4kcGFyZW50Lm1vdXNlbW92ZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuU2hvdygpO1xuXG4gICAgICAgICAgICAvL0FkZCBhbmQgdXBkYXRlIHRvb2x0aXAgb24gbW91c2UgbW92ZW1lbnQgdG8gc2hvdyB3aGVyZSB0aGUgbW91c2UgaXMgaG92ZXJpbmcuXG4gICAgICAgICAgICBsZXQgbW91c2VYID0gZXZlbnQucGFnZVggLSBwbGF5ZXIuJGNvbnRhaW5lci5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICAgICAgbGV0IHBlcmNlbnQgPSBtb3VzZVggLyB0aGlzLiRwYXJlbnQud2lkdGgoKTtcbiAgICAgICAgICAgIGxldCB0aW1lQXRDdXJzb3IgPSBwZXJjZW50ICogcGxheWVyLnZpZGVvRWxlbWVudC5kdXJhdGlvbjtcbiAgICAgICAgICAgIHRoaXMuTW92ZShtb3VzZVgsIDApO1xuICAgICAgICAgICAgdGhpcy5TZXRDb250ZW50KEdldEZvcm1hdHRlZFRpbWUodGltZUF0Q3Vyc29yKSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kcGFyZW50Lm1vdXNlb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuSGlkZSgpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIE1vdmUoeCwgeSkge1xuXG4gICAgICAgIC8vIEdldCBpbml0aWFsIHBvc2l0aW9uc1xuICAgICAgICBsZXQgbGVmdCA9IHggLSAodGhpcy5HZXRXaWR0aCgpIC8gMik7XG4gICAgICAgIGxldCB0b3AgPSB5IC0gKHRoaXMuR2V0SGVpZ2h0KCkpICsgdGhpcy5ob3Zlck9mZnNldDtcbiAgICAgICAgXG4gICAgICAgIC8vIE9mZnNldCBpZiBuZWNlc3NhcnkgKGtlZXAgb24tc2NyZWVuKVxuICAgICAgICBpZiAobGVmdCAtIHRoaXMucGFkZGluZyA8IDApIHtcbiAgICAgICAgICAgIGxlZnQgPSB0aGlzLnBhZGRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICggKGxlZnQgKyB0aGlzLnBhZGRpbmcgKyB0aGlzLkdldFdpZHRoKCkpID4gdGhpcy4kcGFyZW50LndpZHRoKCkgKSB7XG4gICAgICAgICAgICBsZWZ0ID0gdGhpcy4kcGFyZW50LndpZHRoKCkgLSB0aGlzLkdldFdpZHRoKCkgLSB0aGlzLnBhZGRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIEFwcGx5IHBvc2l0aW9uc1xuICAgICAgICB0aGlzLiR0b29sdGlwLmNzcyh7XG4gICAgICAgICAgICB0b3A6IHRvcCxcbiAgICAgICAgICAgIGxlZnQ6IGxlZnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgR2V0V2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiR0b29sdGlwLndpZHRoKCk7XG4gICAgfVxuXG4gICAgR2V0SGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kdG9vbHRpcC5oZWlnaHQoKTtcbiAgICB9XG5cbiAgICBTaG93KCkge1xuICAgICAgICB0aGlzLiR0b29sdGlwLm1ha2VWaXNpYmxlKHRydWUpO1xuICAgIH1cblxuICAgIEhpZGUoKSB7XG4gICAgICAgIHRoaXMuJHRvb2x0aXAubWFrZVZpc2libGUoZmFsc2UpO1xuICAgIH1cblxuICAgIFNldENvbnRlbnQodGV4dCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRleHQpO1xuICAgICAgICB0aGlzLiRjb250ZW50LnRleHQodGV4dCk7XG4gICAgfVxuXG5cblxufVxuXG5leHBvcnQgeyBTZWVrYmFyVG9vbHRpcCB9OyIsImltcG9ydCB7IEdldEZvcm1hdHRlZFRpbWUgfSBmcm9tIFwiLi4vdXRpbHMvdGltZS5qc1wiO1xuaW1wb3J0IHsgU2Vla2JhclRvb2x0aXAgfSBmcm9tIFwiLi9zZWVrYmFyLXRvb2x0aXAuanNcIjtcblxuY2xhc3MgVmlkZW9QbGF5ZXJCYXIge1xuXG4gICAgY29uc3RydWN0b3IocGxheWVyKXtcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7IFxuICAgICAgICB0aGlzLiRjb250YWluZXIgPSAkKFwiPGRpdiBjbGFzcz0nd2FsZG9yZi1wbGF5ZXItdG9vbGJhciBmbGV4LXRvb2xiYXInPjwvZGl2PlwiKS5hcHBlbmRUbyhwbGF5ZXIuJGNvbnRhaW5lcik7XG5cbiAgICAgICAgdGhpcy5Qb3B1bGF0ZUVsZW1lbnRzKCk7XG5cbiAgICAgICAgdGhpcy5zY3J1YmJpbmdUaW1lU2xpZGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMudmlkZW9QbGF5aW5nQmVmb3JlVGltZVNjcnViID0gZmFsc2U7XG5cbiAgICAgICAgLy8gSG9vayB1cCB0byBldmVudHMgZnJvbSB2aWRlbyBwbGF5ZXJcbiAgICAgICAgdGhpcy5wbGF5ZXIuJGNvbnRhaW5lci5vbihcIk9uVmlzaWJpbGl0eUNoYW5nZVwiLCBcbiAgICAgICAgICAgIChldmVudCwgaXNWaXNpYmxlLCBkdXJhdGlvbikgPT4gdGhpcy5TZXRWaXNpYmxlKGlzVmlzaWJsZSwgZHVyYXRpb24pXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXIuJGNvbnRhaW5lci5vbihcIk9uUGxheVN0YXRlQ2hhbmdlXCIsIFxuICAgICAgICAgICAgKGV2ZW50LCBwbGF5aW5nKSA9PiB0aGlzLk9uUGxheVN0YXRlQ2hhbmdlKHBsYXlpbmcpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXIuJGNvbnRhaW5lci5vbihcIk9uVGltZVVwZGF0ZVwiLCBcbiAgICAgICAgICAgIChldmVudCwgdGltZSkgPT4gdGhpcy5PblRpbWVVcGRhdGUodGltZSlcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnBsYXllci4kY29udGFpbmVyLm9uKFwiT25NdXRlU3RhdGVDaGFuZ2VcIiwgXG4gICAgICAgICAgICAoZXZlbnQsIG11dGVkKSA9PiB0aGlzLk9uTXV0ZVN0YXRlQ2hhbmdlKG11dGVkKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMucGxheWVyLiRjb250YWluZXIub24oXCJPblZvbHVtZUNoYW5nZVwiLCBcbiAgICAgICAgICAgIChldmVudCwgdm9sdW1lKSA9PiB0aGlzLk9uVm9sdW1lQ2hhbmdlKHZvbHVtZSlcbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgUG9wdWxhdGVFbGVtZW50cygpe1xuXG4gICAgICAgIHRoaXMuJHNlZWtCYXIgPSAkKFwiPGRpdiBpZD0nc2Vlay1iYXInPjxkaXYgaWQ9J3NlZWstaGFuZGxlJyBjbGFzcz0ndWktc2xpZGVyLWhhbmRsZSc+PC9kaXY+PC9kaXY+XCIpO1xuICAgICAgICBsZXQgJHNlZWtTbGlkZXIgPSB0aGlzLiRzZWVrQmFyLnNsaWRlcih7XG4gICAgICAgICAgICBtaW46IDAuMCxcbiAgICAgICAgICAgIG1heDogMS4wLFxuICAgICAgICAgICAgc3RlcDogMC4wMDFcbiAgICAgICAgfSk7XG4gICAgICAgICRzZWVrU2xpZGVyLm9uKFwic2xpZGVcIiwgKCkgPT4gdGhpcy5VcGRhdGVWaWRlb1RpbWUoKSk7XG4gICAgICAgICRzZWVrU2xpZGVyLm9uKFwic2xpZGVzdGFydFwiLCAoKSA9PiB0aGlzLlRpbWVEcmFnU3RhcnRlZCgpKTtcbiAgICAgICAgJHNlZWtTbGlkZXIub24oXCJzbGlkZXN0b3BcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5UaW1lRHJhZ0ZpbmlzaGVkKCk7XG4gICAgICAgICAgICB0aGlzLlVwZGF0ZVZpZGVvVGltZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmFwcGVuZCh0aGlzLiRzZWVrQmFyKTtcbiAgICAgICAgdGhpcy5zZWVrYmFyVG9vbHRpcCA9IG5ldyBTZWVrYmFyVG9vbHRpcCh0aGlzLiRzZWVrQmFyLCB0aGlzLnBsYXllcik7XG5cbiAgICAgICAgdGhpcy4kc2Vla1Byb2dyZXNzID0gJChcIjxkaXYgaWQ9J3NlZWstZmlsbCc+PC9kaXY+XCIpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIuYXBwZW5kKHRoaXMuJHNlZWtQcm9ncmVzcyk7XG5cbiAgICAgICAgLy9KdW1wIEJhY2sgYnV0dG9uXG4gICAgICAgIHRoaXMuJGp1bXBCYWNrQnV0dG9uID0gJChcIjxidXR0b24+SnVtcCBCYWNrPC9idXR0b24+XCIpLmJ1dHRvbih7XG4gICAgICAgICAgICBpY29uOiBcImZhIGZhLWZhc3QtYmFja3dhcmRcIixcbiAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgfSkuY2xpY2soKCkgPT4gdGhpcy5wbGF5ZXIuSnVtcEJhY2t3YXJkKCkpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiRqdW1wQmFja0J1dHRvbiwgLTgpOyAgIFxuICAgICAgICBcbiAgICAgICAgLy9OdWRnZSBCYWNrIGJ1dHRvblxuICAgICAgICB0aGlzLiRudWRnZUJhY2tCdXR0b24gPSAkKFwiPGJ1dHRvbj5OdWRnZSBCYWNrPC9idXR0b24+XCIpLmJ1dHRvbih7XG4gICAgICAgICAgICBpY29uOiBcImZhIGZhLXN0ZXAtYmFja3dhcmRcIixcbiAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2VcbiAgICAgICAgfSkuY2xpY2soKCkgPT4gdGhpcy5wbGF5ZXIuU3RlcEJhY2t3YXJkKCkpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiRudWRnZUJhY2tCdXR0b24sIC03KTtcblxuICAgICAgICAvLyBQbGF5IGJ1dHRvblxuICAgICAgICB0aGlzLiRwbGF5QnV0dG9uID0gJChcIjxidXR0b24+UGxheTwvYnV0dG9uPlwiKS5idXR0b24oe1xuICAgICAgICAgICAgaWNvbjogXCJmYSBmYS1wbGF5XCIsXG4gICAgICAgICAgICBzaG93TGFiZWw6IGZhbHNlXG4gICAgICAgIH0pLmNsaWNrKCgpID0+IHRoaXMucGxheWVyLlRvZ2dsZVBsYXlTdGF0ZSgpKTtcbiAgICAgICAgdGhpcy5SZWdpc3RlckVsZW1lbnQodGhpcy4kcGxheUJ1dHRvbiwgLTYpO1xuXG4gICAgICAgIC8vTnVkZ2UgYnV0dG9uXG4gICAgICAgIHRoaXMuJG51ZGdlQnV0dG9uID0gJChcIjxidXR0b24+TnVkZ2U8L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtc3RlcC1mb3J3YXJkXCIsXG4gICAgICAgICAgICBzaG93TGFiZWw6IGZhbHNlXG4gICAgICAgIH0pLmNsaWNrKCgpID0+IHRoaXMucGxheWVyLlN0ZXBGb3J3YXJkKCkpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiRudWRnZUJ1dHRvbiwgLTUpOyAgIFxuICAgICAgICBcbiAgICAgICAgLy9KdW1wIGJ1dHRvblxuICAgICAgICB0aGlzLiRqdW1wQnV0dG9uID0gJChcIjxidXR0b24+TnVkZ2U8L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtZmFzdC1mb3J3YXJkXCIsXG4gICAgICAgICAgICBzaG93TGFiZWw6IGZhbHNlXG4gICAgICAgIH0pLmNsaWNrKCgpID0+IHRoaXMucGxheWVyLkp1bXBGb3J3YXJkKCkpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiRqdW1wQnV0dG9uLCAtNCk7ICAgICAgICAgIFxuXG4gICAgICAgIC8vIFRpbWUgdGV4dFxuICAgICAgICBsZXQgemVybyA9IEdldEZvcm1hdHRlZFRpbWUoMC4wMDApO1xuICAgICAgICB0aGlzLiR0aW1lVGV4dCA9ICQoXCI8cD4ke3plcm99LyR7emVyb308L3A+XCIpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiR0aW1lVGV4dCwgLTMpO1xuXG4gICAgICAgIC8vIE11dGUgYnV0dG9uXG4gICAgICAgIHRoaXMuJG11dGVCdXR0b24gPSAkKFwiPGJ1dHRvbj5NdXRlPC9idXR0b24+XCIpLmJ1dHRvbih7XG4gICAgICAgICAgICBpY29uOiBcImZhIGZhLXZvbHVtZS11cFwiLFxuICAgICAgICAgICAgc2hvd0xhYmVsOiBmYWxzZSxcbiAgICAgICAgfSkuY2xpY2soKCkgPT4gdGhpcy5wbGF5ZXIuVG9nZ2xlTXV0ZVN0YXRlKCkpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiRtdXRlQnV0dG9uLCAtMik7XG5cbiAgICAgICAgLy8gVm9sdW1lIGJhclxuICAgICAgICB0aGlzLiR2b2x1bWVCYXIgPSAkKFwiPGRpdiBpZD0ndm9sdW1lLWJhcic+PGRpdiBpZD0ndm9sdW1lLWhhbmRsZScgY2xhc3M9J3VpLXNsaWRlci1oYW5kbGUnPjwvZGl2PjwvZGl2PlwiKTtcbiAgICAgICAgdGhpcy4kdm9sdW1lQmFyLnNsaWRlcih7XG4gICAgICAgICAgICByYW5nZTogXCJtaW5cIixcbiAgICAgICAgICAgIG1heDogMS4wLFxuICAgICAgICAgICAgdmFsdWU6IDEuMCxcbiAgICAgICAgICAgIHN0ZXA6IDAuMDVcbiAgICAgICAgfSkub24oXCJzbGlkZVwiLCAoZXZlbnQsIHVpKSA9PiB0aGlzLnBsYXllci5TZXRWb2x1bWUodWkudmFsdWUpKTtcbiAgICAgICAgdGhpcy5SZWdpc3RlckVsZW1lbnQodGhpcy4kdm9sdW1lQmFyLCAtMSk7XG5cbiAgICAgICAgLy8gRnVsbHNjcmVlbiBidXR0b25cbiAgICAgICAgdGhpcy4kZnVsbFNjcmVlbkJ1dHRvbiA9ICQoXCI8YnV0dG9uPkZ1bGxzY3JlZW48L2J1dHRvbj5cIikuYnV0dG9uKHtcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtYXJyb3dzLWFsdFwiLFxuICAgICAgICAgICAgc2hvd0xhYmVsOiBmYWxzZVxuICAgICAgICB9KS5jbGljaygoKSA9PiB0aGlzLnBsYXllci5Ub2dnbGVGdWxsc2NyZWVuKCkpO1xuICAgICAgICB0aGlzLlJlZ2lzdGVyRWxlbWVudCh0aGlzLiRmdWxsU2NyZWVuQnV0dG9uLCA5OTksICdmbGV4LWVuZCcpO1xuICAgICAgICBcbiAgICAgICAgLy8gQ3JlYXRlIGVtcHR5IGVsZW1lbnQgYmV0d2VlbiBsZWZ0IGZsb2F0aW5nIGFuZCByaWdodCBmbG9hdGluZyB0b29sYmFyIGl0ZW1zIHRvIHNwYWNlIHRoZW0gb3V0IHByb3Blcmx5XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmQoJChcIjxkaXY+PC9kaXY+XCIpLmNzcyhcImZsZXgtZ3Jvd1wiLCAxKS5jc3MoXCJvcmRlclwiLCAwKSk7XG5cbiAgICAgICAgLy9Jbml0aWFsaXplIGNvbnRyb2xzXG4gICAgICAgIHRoaXMuT25UaW1lVXBkYXRlKCk7XG4gICAgICAgIHRoaXMuJHZvbHVtZUJhci5zbGlkZXIoXCJ2YWx1ZVwiLCB0aGlzLnBsYXllci52aWRlb0VsZW1lbnQudm9sdW1lKTtcbiAgICB9XG5cbiAgICBSZWdpc3RlckVsZW1lbnQoJGVsZW1lbnQsIG9yZGVyLCBqdXN0aWZpY2F0aW9uID0gJ2ZsZXgtc3RhcnQnKXtcbiAgICAgICAgJGVsZW1lbnQuY3NzKCdvcmRlcicsIG9yZGVyKTtcbiAgICAgICAgJGVsZW1lbnQuY3NzKCdhbGlnbi1zZWxmJywganVzdGlmaWNhdGlvbik7XG4gICAgICAgIC8vIFNldHMgZ3JvdyBbc2hyaW5rXSBbYmFzaXNdXG4gICAgICAgIC8vJGVsZW1lbnQuY3NzKCdmbGV4JywgJzAgMCBhdXRvJyk7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmQoJGVsZW1lbnQpO1xuICAgIH1cblxuICAgIFNldFZpc2libGUoaXNWaXNpYmxlLCBkdXJhdGlvbil7XG4gICAgICAgIC8vY29uc29sZS5sb2coaXNWaXNpYmxlICsgXCIgXCIgKyBkdXJhdGlvbik7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5zdG9wKHRydWUsIHRydWUpO1xuICAgICAgICBpZihpc1Zpc2libGUpe1xuICAgICAgICAgICAgdGhpcy4kY29udGFpbmVyLmZhZGVUbyhkdXJhdGlvbiwgMS4wLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy4kY29udGFpbmVyLm1ha2VWaXNpYmxlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRjb250YWluZXIuZmFkZVRvKGR1cmF0aW9uLCAwLjAsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLiRjb250YWluZXIubWFrZVZpc2libGUoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBVcGRhdGVWaWRlb1RpbWUoKXtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBuZXcgdGltZVxuICAgICAgICBsZXQgdGltZSA9IHRoaXMucGxheWVyLnZpZGVvRWxlbWVudC5kdXJhdGlvbiAqIHRoaXMuJHNlZWtCYXIuc2xpZGVyKFwidmFsdWVcIik7XG4gICAgICAgIHRoaXMucGxheWVyLmVuZFRpbWUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wbGF5ZXIudmlkZW9FbGVtZW50LmN1cnJlbnRUaW1lID0gdGltZTtcbiAgICB9XG5cbiAgICBUaW1lRHJhZ1N0YXJ0ZWQoKXtcbiAgICAgICAgdGhpcy52aWRlb1BsYXlpbmdCZWZvcmVUaW1lU2NydWIgPSAhdGhpcy5wbGF5ZXIudmlkZW9FbGVtZW50LnBhdXNlZDtcbiAgICAgICAgdGhpcy5wbGF5ZXIudmlkZW9FbGVtZW50LnBhdXNlKCk7XG4gICAgfVxuXG4gICAgVGltZURyYWdGaW5pc2hlZCgpe1xuICAgICAgICAvLyBTdGFydCBwbGF5aW5nIHRoZSB2aWRlbyBhZ2FpbiBpZiBpdCB3YXMgcGxheWluZyBiZWZvcmUgdGhlIHNjcnViIHN0YXJ0ZWRcbiAgICAgICAgaWYgKHRoaXMudmlkZW9QbGF5aW5nQmVmb3JlVGltZVNjcnViKXtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnZpZGVvRWxlbWVudC5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLy9cbiAgICAvLy8gLS0tLS0gRXZlbnQgTGlzdGVuZXJzIC0tLS0tXG4gICAgLy8vIFRoZSBmb2xsb3dpbmcgdXBkYXRlIHRoZSB2aXN1YWwgc3RhdGUgb2YgdGhlIGJhclxuICAgIC8vLyB1cG9uIGNoYW5nZXMgdG8gdGhlIHZpZGVvIHBsYXllci4gVGhlc2UgYXJlIGhvb2tlZFxuICAgIC8vLyB1cCBpbiB0aGUgY29uc3RydWN0b3IuXG4gICAgLy8vXG5cbiAgICBPblBsYXlTdGF0ZUNoYW5nZShwbGF5aW5nKXtcbiAgICAgICAgdGhpcy4kcGxheUJ1dHRvbi5idXR0b24oXCJvcHRpb25cIiwge1xuICAgICAgICAgICAgaWNvbjogcGxheWluZyA/IFwiZmEgZmEtcGF1c2VcIiA6IFwiZmEgZmEtcGxheVwiXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIE9uVGltZVVwZGF0ZSh0aW1lKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInZpZGVvLXBsYXllci1iYXIuanM6MTg1IE9uVGltZVVwZGF0ZSBpcyBjYWxsZWRcIik7XG4gICAgICAgIGxldCBkdXJhdGlvbiA9IHRoaXMucGxheWVyLnZpZGVvRWxlbWVudC5kdXJhdGlvbjtcblxuICAgICAgICAvLyBVcGRhdGUgdGhlIHRpbWUgdGV4dFxuICAgICAgICB0aGlzLiR0aW1lVGV4dC50ZXh0KEdldEZvcm1hdHRlZFRpbWUodGltZSkgKyBcIi9cIiArIEdldEZvcm1hdHRlZFRpbWUoZHVyYXRpb24pKTtcblxuICAgICAgICBsZXQgcHJvZ3Jlc3MgPSB0aW1lIC8gZHVyYXRpb247XG4gICAgICAgIHRoaXMuJHNlZWtQcm9ncmVzcy53aWR0aCgocHJvZ3Jlc3MgKiAxMDApLnRvU3RyaW5nKCkgKyBcIiVcIik7XG4gICAgfVxuXG4gICAgT25Wb2x1bWVDaGFuZ2Uodm9sdW1lKXtcbiAgICAgICAgdGhpcy4kdm9sdW1lQmFyLnNsaWRlcihcInZhbHVlXCIsIHZvbHVtZSk7XG4gICAgfVxuXG4gICAgT25NdXRlU3RhdGVDaGFuZ2UobXV0ZWQpe1xuICAgICAgICB0aGlzLiRtdXRlQnV0dG9uLmJ1dHRvbihcIm9wdGlvblwiLCB7XG4gICAgICAgICAgICBpY29uOiBtdXRlZCA/IFwiZmEgZmEtdm9sdW1lLXVwXCIgOiBcImZhIGZhLXZvbHVtZS1vZmZcIlxuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgVmlkZW9QbGF5ZXJCYXIgfSIsImltcG9ydCB7IFZpZGVvUGxheWVyQmFyIH0gZnJvbSBcIi4vdmlkZW8tcGxheWVyLWJhci5qc1wiO1xuaW1wb3J0IHsgVmlkZW9Bbm5vdGF0b3IgfSBmcm9tIFwiLi4vYW5ub3RhdG9yL2Fubm90YXRvci5qc1wiO1xuLy9pbXBvcnQgKiBhcyBzY3JlZW5mdWxsIGZyb20gXCJzY3JlZW5mdWxsXCI7XG5cbi8vaW1wb3J0ICdqcXVlcnktdWkvZGlzdC9qcXVlcnktdWkuanMnO1xubGV0IHNjcmVlbmZ1bGwgPSByZXF1aXJlKCdzY3JlZW5mdWxsJyk7XG5cbmNsYXNzIEFubm90YXRvclZpZGVvUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcigkdmlkZW8sIGFubm90YXRvckFyZ3Mpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbm5vdGF0b3JWaWRlb1BsYXllcl0gQ3JlYXRpbmcgQW5ub3RhdG9yVmlkZW9QbGF5ZXIgZm9yIHZpZGVvLi4uXCIpO1xuICAgICAgICB0aGlzLiR2aWRlbyA9ICR2aWRlbztcbiAgICAgICAgdGhpcy52aWRlb0VsZW1lbnQgPSB0aGlzLiR2aWRlby5nZXQoMCk7XG5cbiAgICAgICAgLy8gU3RvcmUgdGhlIG9yaWdpbmFsIHN0eWxpbmcgb2YgdGhlIHZpZGVvIGVsZW1lbnQgYmVmb3JlIHdlIGFsdGVyIGl0XG4gICAgICAgIHRoaXMub3JpZ2luYWxTdHlsZXMgPSB0aGlzLiR2aWRlby5nZXRTdHlsZXMobnVsbCwgW1wiaGVpZ2h0XCIsIFwiV2Via2l0VGV4dEZpbGxDb2xvclwiLCBcImNvbG9yXCJdKTsgLy9bXCJ3aWR0aFwiLCBcInRvcFwiLCBcImxlZnRcIiwgXCJtYXJnaW5cIiwgXCJwYWRkaW5nXCJdXG5cbiAgICAgICAgdGhpcy5XcmFwKCk7XG4gICAgICAgIHRoaXMuUG9wdWxhdGVDb250cm9scygpO1xuICAgICAgICB0aGlzLlNldFZpc2libGUodHJ1ZSk7XG5cbiAgICAgICAgLy8gSG9vayB1cCBldmVudHNcbiAgICAgICAgdGhpcy5Ib29rVXBFdmVudHMoKTtcblxuICAgICAgICAvLyBQbGF5IC8gcGF1c2UgdGhlIHZpZGVvIHdoZW4gY2xpY2tlZC5cbiAgICAgICAgdGhpcy4kdmlkZW8ub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLlRvZ2dsZVBsYXlTdGF0ZSgpKTtcblxuICAgICAgICB0aGlzLmFsbG93QXV0b0ZhZGUgPSB0cnVlO1xuICAgICAgICAvLy8gSW5hY3Rpdml0eSB0aW1lciBmb3IgdGhlIG1vdXNlLlxuICAgICAgICB0aGlzLm1vdXNlVGltZXIgPSBudWxsO1xuICAgICAgICAvLy8gU2V0IHRvIHRydWUgaWYgdGhlIHRpbWUgc2xpZGVyIGlzIGN1cnJlbnRseSBiZWluZyBkcmFnZ2VkIGJ5IHRoZSB1c2VyLlxuICAgICAgICB0aGlzLmRyYWdnaW5nVGltZVNsaWRlciA9IGZhbHNlO1xuICAgICAgICAvLy8gU2Vjb25kcyBiZWZvcmUgdGhlIFVJIGZhZGVzIGR1ZSB0byBtb3VzZSBpbmFjdGl2aXR5LlxuICAgICAgICB0aGlzLmlkbGVTZWNvbmRzQmVmb3JlRmFkZSA9IDM7XG4gICAgICAgIHRoaXMuZmFkZUR1cmF0aW9uID0gMzAwO1xuICAgICAgICB0aGlzLmVuZFRpbWUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLiRjb250YWluZXIubW91c2Vtb3ZlKCgpID0+IHRoaXMuT25Nb3VzZU1vdmUoKSk7XG4gICAgICAgIHRoaXMuU2V0QXV0b0ZhZGUodHJ1ZSk7XG5cbiAgICAgICAgLy8gSWYgc2NyZWVuZnVsbCBpcyBlbmFibGVkLCBjcmVhdGUgdGhlIGV2ZW50IHRvIGhhbmRsZSBpdC5cbiAgICAgICAgaWYoc2NyZWVuZnVsbCAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgc2NyZWVuZnVsbC5vbmNoYW5nZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkZ1bGxzY3JlZW5DaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRjb250YWluZXIudHJpZ2dlcihcIk9uRnVsbHNjcmVlbkNoYW5nZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52aWRlb0VsZW1lbnQub250aW1ldXBkYXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5PblRpbWVVcGRhdGUodGhpcy52aWRlb0VsZW1lbnQuY3VycmVudFRpbWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5vbihcIk9uVmlkZW9SZWFkeVwiLCAoKSA9PiB7XG4gICAgICAgICAgICBpZihhbm5vdGF0b3JBcmdzLmFubm90YXRvcj09bnVsbCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQW5ub3RhdG9yVmlkZW9QbGF5ZXJdIFBsYXllciBzZW50IE9uVmlkZW9SZWFkeSwgYXR0ZW1wdGluZyB0byB3cmFwIHdpdGggYW5ub3RhdG9yLi4uXCIpO1xuICAgICAgICAgICAgICAgIC8vIEFkZCBhbm5vdGF0b3Igb25jZSB2aWRlbyBoYXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQW5ub3RhdG9yVmlkZW9QbGF5ZXJdIFdyYXBwaW5nIHZpZGVvIHdpdGggYW5ub3RhdG9yLi4uXCIpO1xuICAgICAgICAgICAgICAgIGFubm90YXRvckFyZ3MucGxheWVyID0gdGhpcztcbiAgICAgICAgICAgICAgICBhbm5vdGF0b3JBcmdzLmFubm90YXRvciA9IG5ldyBWaWRlb0Fubm90YXRvcihhbm5vdGF0b3JBcmdzKTtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgYW5ub3RhdG9yQXJncy5jYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIGFubm90YXRvckFyZ3MuY2FsbGJhY2soYW5ub3RhdG9yQXJncy5hbm5vdGF0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnZpZGVvRWxlbWVudC5vbmxvYWRlZG1ldGFkYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kY29udGFpbmVyLnRyaWdnZXIoXCJPblZpZGVvUmVhZHlcIik7XG4gICAgICAgIH07XG4gICAgICAgIGlmKHRoaXMudmlkZW9FbGVtZW50LmR1cmF0aW9uICE9IG51bGwpe1xuICAgICAgICAgICAgLy8gSWYgdGhlIG1ldGFkYXRhIGlzIGFscmVhZHkgcHJlcGFyZWQsIHRocm93IHRoZSBldmVudCBzaW5jZVxuICAgICAgICAgICAgLy8gb25sb2FkZWRtZXRhZGF0YSB3b24ndCBiZSBmaXJlZFxuICAgICAgICAgICAgdGhpcy4kY29udGFpbmVyLnRyaWdnZXIoXCJPblZpZGVvUmVhZHlcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0Fubm90YXRvclZpZGVvUGxheWVyXSBBbm5vdGF0b3JWaWRlb1BsYXllciBjcmVhdGVkIGZvciB2aWRlby5cIik7XG4gICAgICAgIFxuICAgIH1cblxuICAgIFdyYXAoKXtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBkZWZhdWx0IGNvbnRyb2xzIGZyb20gdGhlIHZpZGVvXG4gICAgICAgIHRoaXMudmlkZW9FbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImNvbnRyb2xzXCIpO1xuXG4gICAgICAgIC8vIFdyYXAgdGhlIHZpZGVvIGVsZW1lbnQgd2l0aCB0aGUgY29udGFpbmVyXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lciA9IHRoaXMuJHZpZGVvLndyYXAoXCI8ZGl2IGNsYXNzPSd3YWxkb3JmLXZpZGVvLXBsYXllcic+PC9kaXY+XCIpLnBhcmVudCgpO1xuICAgICAgICAvLyBSZXNpemUgY29udGFpbmVyIHRvIGZpdCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgdmlkZW9cbiAgICAgICAgdGhpcy4kY29udGFpbmVyLndpZHRoKHRoaXMuJHZpZGVvLndpZHRoKCkpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIuaGVpZ2h0KHRoaXMuJHZpZGVvLmhlaWdodCgpKTtcbiAgICB9XG5cbiAgICBQb3B1bGF0ZUNvbnRyb2xzKCl7XG4gICAgICAgIHRoaXMuY29udHJvbEJhciA9IG5ldyBWaWRlb1BsYXllckJhcih0aGlzKTtcbiAgICB9XG5cbiAgICBTZXRWaXNpYmxlKGlzVmlzaWJsZSwgZHVyYXRpb24gPSAwKXtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLnRyaWdnZXIoXCJPblZpc2liaWxpdHlDaGFuZ2VcIiwgW2lzVmlzaWJsZSwgZHVyYXRpb25dKTtcbiAgICB9XG5cbiAgICBIb29rVXBFdmVudHMoKXtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgVG9nZ2xlUGxheVN0YXRlKCl7XG4gICAgICAgIGlmKHRoaXMudmlkZW9FbGVtZW50LnBhdXNlZCl7XG4gICAgICAgICAgICB0aGlzLlBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuUGF1c2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFN0ZXBGb3J3YXJkKCl7XG4gICAgICAgIHZhciBuZXdUaW1lID0gdGhpcy52aWRlb0VsZW1lbnQuY3VycmVudFRpbWUgKyAwLjE7XG4gICAgICAgIHRoaXMudmlkZW9FbGVtZW50LmN1cnJlbnRUaW1lID0gbmV3VGltZSA+IHRoaXMudmlkZW9FbGVtZW50LmR1cmF0aW9uID8gdGhpcy52aWRlb0VsZW1lbnQuZHVyYXRpb24gOiBuZXdUaW1lO1xuICAgIH1cblxuICAgIEp1bXBGb3J3YXJkKCl7XG4gICAgICAgIHZhciBuZXdUaW1lID0gdGhpcy52aWRlb0VsZW1lbnQuY3VycmVudFRpbWUgKyAxO1xuICAgICAgICB0aGlzLnZpZGVvRWxlbWVudC5jdXJyZW50VGltZSA9IG5ld1RpbWUgPiB0aGlzLnZpZGVvRWxlbWVudC5kdXJhdGlvbiA/IHRoaXMudmlkZW9FbGVtZW50LmR1cmF0aW9uIDogbmV3VGltZTtcbiAgICB9ICBcbiAgICBcbiAgICBTdGVwQmFja3dhcmQoKXtcbiAgICAgICAgdmFyIG5ld1RpbWUgPSB0aGlzLnZpZGVvRWxlbWVudC5jdXJyZW50VGltZSAtIDAuMTtcbiAgICAgICAgdGhpcy52aWRlb0VsZW1lbnQuY3VycmVudFRpbWUgPSBuZXdUaW1lIDwgMCA/IDAgOiBuZXdUaW1lO1xuICAgIH1cblxuICAgIEp1bXBCYWNrd2FyZCgpe1xuICAgICAgICB2YXIgbmV3VGltZSA9IHRoaXMudmlkZW9FbGVtZW50LmN1cnJlbnRUaW1lIC0gMTtcbiAgICAgICAgdGhpcy52aWRlb0VsZW1lbnQuY3VycmVudFRpbWUgPSBuZXdUaW1lIDwgMCA/IDAgOiBuZXdUaW1lO1xuICAgIH0gICAgIFxuXG4gICAgUGxheSgpe1xuICAgICAgICB0aGlzLnZpZGVvRWxlbWVudC5wbGF5KCk7XG4gICAgICAgIGlmKHRoaXMuZW5kVGltZSkgdGhpcy5lbmRUaW1lID0gZmFsc2U7XG4gICAgICAgIHRoaXMuU2V0QXV0b0ZhZGUodHJ1ZSk7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci50cmlnZ2VyKFwiT25QbGF5U3RhdGVDaGFuZ2VcIiwgIXRoaXMudmlkZW9FbGVtZW50LnBhdXNlZCk7XG4gICAgfVxuXG4gICAgUGF1c2UoKXtcbiAgICAgICAgaWYodGhpcy5lbmRUaW1lKSB0aGlzLmVuZFRpbWUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy52aWRlb0VsZW1lbnQucGF1c2UoKTtcbiAgICAgICAgdGhpcy5TZXRBdXRvRmFkZShmYWxzZSk7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci50cmlnZ2VyKFwiT25QbGF5U3RhdGVDaGFuZ2VcIiwgIXRoaXMudmlkZW9FbGVtZW50LnBhdXNlZCk7XG4gICAgfVxuXG4gICAgVG9nZ2xlTXV0ZVN0YXRlKCl7XG4gICAgICAgIGxldCBtdXRlZCA9IHRoaXMudmlkZW9FbGVtZW50Lm11dGVkO1xuICAgICAgICB0aGlzLnZpZGVvRWxlbWVudC5tdXRlZCA9ICFtdXRlZDtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLnRyaWdnZXIoXCJPbk11dGVTdGF0ZUNoYW5nZVwiLCBtdXRlZCk7XG4gICAgfVxuXG4gICAgU2V0Vm9sdW1lKHZvbHVtZSl7XG4gICAgICAgIHRoaXMudmlkZW9FbGVtZW50LnZvbHVtZSA9IHZvbHVtZTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLnRyaWdnZXIoXCJPblZvbHVtZUNoYW5nZVwiLCB2b2x1bWUpO1xuICAgIH1cblxuICAgIFRvZ2dsZUZ1bGxzY3JlZW4oKXtcbiAgICAgICAgaWYgKHNjcmVlbmZ1bGwgPT09ICd1bmRlZmluZWQnIHx8ICFzY3JlZW5mdWxsLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzY3JlZW5mdWxsLnRvZ2dsZSh0aGlzLiRjb250YWluZXJbMF0pO1xuICAgIH1cblxuICAgIE9uRnVsbHNjcmVlbkNoYW5nZSgpe1xuICAgICAgICBpZihzY3JlZW5mdWxsLmlzRnVsbHNjcmVlbil7XG4gICAgICAgICAgICB0aGlzLiRjb250YWluZXIuYWRkQ2xhc3MoXCJ3YWxkb3JmLWZ1bGxzY3JlZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci5yZW1vdmVDbGFzcyhcIndhbGRvcmYtZnVsbHNjcmVlblwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFNldEZ1bGxzY3JlZW4oZnVsbHNjcmVlbil7XG4gICAgICAgIGlmIChzY3JlZW5mdWxsID09PSAndW5kZWZpbmVkJyB8fCAhc2NyZWVuZnVsbC5lbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZihmdWxsc2NyZWVuKXtcbiAgICAgICAgICAgIHNjcmVlbmZ1bGwucmVxdWVzdCh0aGlzLiRjb250YWluZXJbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2NyZWVuZnVsbC5leGl0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgbW91c2UgbW92ZXMgaW4gdGhlIHZpZGVvIGNvbnRhaW5lci5cbiAgICAgKi9cbiAgICBPbk1vdXNlTW92ZSgpe1xuICAgICAgICAvLyBSZXNldCB0aGUgdGltZXJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMubW91c2VUaW1lcik7XG4gICAgICAgIHRoaXMubW91c2VUaW1lciA9IDA7XG5cbiAgICAgICAgLy8gUmVzdGFydCBmYWRpbmcgaWYgYWxsb3dlZCB0b1xuICAgICAgICBpZih0aGlzLmFsbG93QXV0b0ZhZGUpe1xuICAgICAgICAgICAgIHRoaXMuUmVzdGFydEZhZGluZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgT25UaW1lVXBkYXRlKHRpbWUpe1xuICAgICAgICBpZih0aGlzLmVuZFRpbWUgJiYgdGhpcy5lbmRUaW1lIDw9IHRoaXMudmlkZW9FbGVtZW50LmN1cnJlbnRUaW1lKXtcbiAgICAgICAgICAgIHRoaXMuUGF1c2UoKTsgICBcbiAgICAgICAgICAgIHRoaXMuZW5kVGltZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci50cmlnZ2VyKFwiT25UaW1lVXBkYXRlXCIsIHRpbWUpO1xuICAgIH1cblxuICAgIFJlc3RhcnRGYWRpbmcoKXtcbiAgICAgICAgLy8gUmVzdG9yZSB2aXNpYmlsaXR5XG4gICAgICAgIHRoaXMuU2V0VmlzaWJsZSh0cnVlLCB0aGlzLmZhZGVEdXJhdGlvbik7XG5cbiAgICAgICAgLy8gU3RhcnQgdGhlIHRpbWVyIG92ZXIgYWdhaW5cbiAgICAgICAgdGhpcy5tb3VzZVRpbWVyID0gc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgdGhpcy5TZXRWaXNpYmxlKGZhbHNlLCB0aGlzLmZhZGVEdXJhdGlvbik7XG4gICAgICAgIH0sIHRoaXMuaWRsZVNlY29uZHNCZWZvcmVGYWRlICogMTAwMCk7XG4gICAgfVxuXG4gICAgU2V0QXV0b0ZhZGUoYWxsb3cpIHtcbiAgICAgICAgdGhpcy5hbGxvd0F1dG9GYWRlID0gYWxsb3c7XG4gICAgICAgIFxuICAgICAgICAvLyBSZXNldCB0aGUgbW91c2UgdGltZXJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMubW91c2VUaW1lcik7XG4gICAgICAgIHRoaXMubW91c2VUaW1lciA9IDA7XG5cbiAgICAgICAgLy8gTWFrZSBlbGVtZW50cyB2aXNpYmxlXG4gICAgICAgIHRoaXMuU2V0VmlzaWJsZSh0cnVlKTtcblxuICAgICAgICAvLyBSZXN0YXJ0IHRoZSBmYWRpbmcgYmVoYXZpb3IgaWYgZGVzaXJlZFxuICAgICAgICBpZihhbGxvdyl7XG4gICAgICAgICAgICB0aGlzLlJlc3RhcnRGYWRpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbiAgICAvLyBJc1BsYXlpbmcoKXtcbiAgICAvLyAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzExMzM0MDFcbiAgICAvLyAgICAgcmV0dXJuICEhKHRoaXMudmlkZW9FbGVtZW50LmN1cnJlbnRUaW1lID4gMCAmJiAhdGhpcy52aWRlb0VsZW1lbnQucGF1c2VkICYmIFxuICAgIC8vICAgICAgICAgICAgICAgIXRoaXMudmlkZW9FbGVtZW50LmVuZGVkICYmIHRoaXMudmlkZW9FbGVtZW50LnJlYWR5U3RhdGUgPiAyKTtcbiAgICAvLyB9XG5cbiAgICAvLyBGcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL05hdGVvd2FtaS83YTk0N2U5M2YwOWM0NWExMDk3ZTc4M2RjMDA1NjBlMVxuICAgIEdldFZpZGVvRGltZW5zaW9ucygpIHtcbiAgICAgICAgbGV0IHZpZGVvID0gdGhpcy52aWRlb0VsZW1lbnQ7XG4gICAgICAgIC8vIFJhdGlvIG9mIHRoZSB2aWRlbydzIGludHJpc2ljIGRpbWVuc2lvbnNcbiAgICAgICAgbGV0IHZpZGVvUmF0aW8gPSB2aWRlby52aWRlb1dpZHRoIC8gdmlkZW8udmlkZW9IZWlnaHQ7XG4gICAgICAgIC8vIFRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB2aWRlbyBlbGVtZW50XG4gICAgICAgIGxldCB3aWR0aCA9IHZpZGVvLm9mZnNldFdpZHRoO1xuICAgICAgICBsZXQgaGVpZ2h0ID0gdmlkZW8ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAvLyBUaGUgcmF0aW8gb2YgdGhlIGVsZW1lbnQncyB3aWR0aCB0byBpdHMgaGVpZ2h0XG4gICAgICAgIGxldCBlbGVtZW50UmF0aW8gPSB3aWR0aCAvIGhlaWdodDtcbiAgICAgICAgLy8gSWYgdGhlIHZpZGVvIGVsZW1lbnQgaXMgc2hvcnQgYW5kIHdpZGVcbiAgICAgICAgaWYoZWxlbWVudFJhdGlvID4gdmlkZW9SYXRpbykgd2lkdGggPSBoZWlnaHQgKiB2aWRlb1JhdGlvO1xuICAgICAgICAvLyBJdCBtdXN0IGJlIHRhbGwgYW5kIHRoaW4sIG9yIGV4YWN0bHkgZXF1YWwgdG8gdGhlIG9yaWdpbmFsIHJhdGlvXG4gICAgICAgIGVsc2UgaGVpZ2h0ID0gd2lkdGggLyB2aWRlb1JhdGlvO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodFxuICAgICAgICB9O1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBBbm5vdGF0b3JWaWRlb1BsYXllciB9OyIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5leHBvcnRzLnRvQnl0ZUFycmF5ID0gdG9CeXRlQXJyYXlcbmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXlcblxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcblxudmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbmZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG59XG5cbi8vIFN1cHBvcnQgZGVjb2RpbmcgVVJMLXNhZmUgYmFzZTY0IHN0cmluZ3MsIGFzIE5vZGUuanMgZG9lcy5cbi8vIFNlZTogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0I1VSTF9hcHBsaWNhdGlvbnNcbnJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxucmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG5cbmZ1bmN0aW9uIGdldExlbnMgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyBUcmltIG9mZiBleHRyYSBieXRlcyBhZnRlciBwbGFjZWhvbGRlciBieXRlcyBhcmUgZm91bmRcbiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYmVhdGdhbW1pdC9iYXNlNjQtanMvaXNzdWVzLzQyXG4gIHZhciB2YWxpZExlbiA9IGI2NC5pbmRleE9mKCc9JylcbiAgaWYgKHZhbGlkTGVuID09PSAtMSkgdmFsaWRMZW4gPSBsZW5cblxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gdmFsaWRMZW4gPT09IGxlblxuICAgID8gMFxuICAgIDogNCAtICh2YWxpZExlbiAlIDQpXG5cbiAgcmV0dXJuIFt2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuXVxufVxuXG4vLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKGI2NCkge1xuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiBfYnl0ZUxlbmd0aCAoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSB7XG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuXG4gIHZhciBhcnIgPSBuZXcgQXJyKF9ieXRlTGVuZ3RoKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikpXG5cbiAgdmFyIGN1ckJ5dGUgPSAwXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICB2YXIgbGVuID0gcGxhY2VIb2xkZXJzTGVuID4gMFxuICAgID8gdmFsaWRMZW4gLSA0XG4gICAgOiB2YWxpZExlblxuXG4gIHZhciBpXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfFxuICAgICAgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDIpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAxKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID1cbiAgICAgICgodWludDhbaV0gPDwgMTYpICYgMHhGRjAwMDApICtcbiAgICAgICgodWludDhbaSArIDFdIDw8IDgpICYgMHhGRjAwKSArXG4gICAgICAodWludDhbaSArIDJdICYgMHhGRilcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayhcbiAgICAgIHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aClcbiAgICApKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXSArXG4gICAgICAnPT0nXG4gICAgKVxuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDEwXSArXG4gICAgICBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl0gK1xuICAgICAgJz0nXG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCIiLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxudmFyIEtfTUFYX0xFTkdUSCA9IDB4N2ZmZmZmZmZcbmV4cG9ydHMua01heExlbmd0aCA9IEtfTUFYX0xFTkdUSFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBQcmludCB3YXJuaW5nIGFuZCByZWNvbW1lbmQgdXNpbmcgYGJ1ZmZlcmAgdjQueCB3aGljaCBoYXMgYW4gT2JqZWN0XG4gKiAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBXZSByZXBvcnQgdGhhdCB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBpZiB0aGUgYXJlIG5vdCBzdWJjbGFzc2FibGVcbiAqIHVzaW5nIF9fcHJvdG9fXy4gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWBcbiAqIChTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOCkuIElFIDEwIGxhY2tzIHN1cHBvcnRcbiAqIGZvciBfX3Byb3RvX18gYW5kIGhhcyBhIGJ1Z2d5IHR5cGVkIGFycmF5IGltcGxlbWVudGF0aW9uLlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICBjb25zb2xlLmVycm9yKFxuICAgICdUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgJyArXG4gICAgJ2BidWZmZXJgIHY1LnguIFVzZSBgYnVmZmVyYCB2NC54IGlmIHlvdSByZXF1aXJlIG9sZCBicm93c2VyIHN1cHBvcnQuJ1xuICApXG59XG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgLy8gQ2FuIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkP1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5fX3Byb3RvX18gPSB7IF9fcHJvdG9fXzogVWludDhBcnJheS5wcm90b3R5cGUsIGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfSB9XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDJcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAncGFyZW50Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0aGlzKSkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB0aGlzLmJ1ZmZlclxuICB9XG59KVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwgJ29mZnNldCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGhpcykpIHJldHVybiB1bmRlZmluZWRcbiAgICByZXR1cm4gdGhpcy5ieXRlT2Zmc2V0XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIFwiJyArIGxlbmd0aCArICdcIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gXCJzaXplXCInKVxuICB9XG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIHZhciBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnVGhlIFwic3RyaW5nXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4gUmVjZWl2ZWQgdHlwZSBudW1iZXInXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZShhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20oYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG5pZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgIT0gbnVsbCAmJlxuICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSlcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbmZ1bmN0aW9uIGZyb20gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2UodmFsdWUpXG4gIH1cblxuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHRocm93IFR5cGVFcnJvcihcbiAgICAgICdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCAnICtcbiAgICAgICdvciBBcnJheS1saWtlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB2YWx1ZSlcbiAgICApXG4gIH1cblxuICBpZiAoaXNJbnN0YW5jZSh2YWx1ZSwgQXJyYXlCdWZmZXIpIHx8XG4gICAgICAodmFsdWUgJiYgaXNJbnN0YW5jZSh2YWx1ZS5idWZmZXIsIEFycmF5QnVmZmVyKSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwidmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBvZiB0eXBlIG51bWJlci4gUmVjZWl2ZWQgdHlwZSBudW1iZXInXG4gICAgKVxuICB9XG5cbiAgdmFyIHZhbHVlT2YgPSB2YWx1ZS52YWx1ZU9mICYmIHZhbHVlLnZhbHVlT2YoKVxuICBpZiAodmFsdWVPZiAhPSBudWxsICYmIHZhbHVlT2YgIT09IHZhbHVlKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlT2YsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIHZhciBiID0gZnJvbU9iamVjdCh2YWx1ZSlcbiAgaWYgKGIpIHJldHVybiBiXG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1ByaW1pdGl2ZSAhPSBudWxsICYmXG4gICAgICB0eXBlb2YgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbShcbiAgICAgIHZhbHVlW1N5bWJvbC50b1ByaW1pdGl2ZV0oJ3N0cmluZycpLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGhcbiAgICApXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCAnICtcbiAgICAnb3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArICh0eXBlb2YgdmFsdWUpXG4gIClcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbSh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG4vLyBOb3RlOiBDaGFuZ2UgcHJvdG90eXBlICphZnRlciogQnVmZmVyLmZyb20gaXMgZGVmaW5lZCB0byB3b3JrYXJvdW5kIENocm9tZSBidWc6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzE0OFxuQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIFwiJyArIHNpemUgKyAnXCIgaXMgaW52YWxpZCBmb3Igb3B0aW9uIFwic2l6ZVwiJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2Moc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlIChzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gYnVmLndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICBidWYgPSBidWYuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlIChhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgYnVmW2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJvZmZzZXRcIiBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcImxlbmd0aFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICB2YXIgYnVmXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBidWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbilcblxuICAgIGlmIChidWYubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gYnVmXG4gICAgfVxuXG4gICAgb2JqLmNvcHkoYnVmLCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIGJ1ZlxuICB9XG5cbiAgaWYgKG9iai5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgbnVtYmVySXNOYU4ob2JqLmxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIoMClcbiAgICB9XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqKVxuICB9XG5cbiAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBBcnJheS5pc0FycmF5KG9iai5kYXRhKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iai5kYXRhKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBLX01BWF9MRU5HVEhgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0gS19NQVhfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIEtfTUFYX0xFTkdUSC50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5mdW5jdGlvbiBTbG93QnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKCtsZW5ndGggIT0gbGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG4gICAgbGVuZ3RoID0gMFxuICB9XG4gIHJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aClcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuIGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlciA9PT0gdHJ1ZSAmJlxuICAgIGIgIT09IEJ1ZmZlci5wcm90b3R5cGUgLy8gc28gQnVmZmVyLmlzQnVmZmVyKEJ1ZmZlci5wcm90b3R5cGUpIHdpbGwgYmUgZmFsc2Vcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmIChpc0luc3RhbmNlKGEsIFVpbnQ4QXJyYXkpKSBhID0gQnVmZmVyLmZyb20oYSwgYS5vZmZzZXQsIGEuYnl0ZUxlbmd0aClcbiAgaWYgKGlzSW5zdGFuY2UoYiwgVWludDhBcnJheSkpIGIgPSBCdWZmZXIuZnJvbShiLCBiLm9mZnNldCwgYi5ieXRlTGVuZ3RoKVxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJidWYxXCIsIFwiYnVmMlwiIGFyZ3VtZW50cyBtdXN0IGJlIG9uZSBvZiB0eXBlIEJ1ZmZlciBvciBVaW50OEFycmF5J1xuICAgIClcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmIChpc0luc3RhbmNlKGJ1ZiwgVWludDhBcnJheSkpIHtcbiAgICAgIGJ1ZiA9IEJ1ZmZlci5mcm9tKGJ1ZilcbiAgICB9XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgaXNJbnN0YW5jZShzdHJpbmcsIEFycmF5QnVmZmVyKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwic3RyaW5nXCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgb3IgQXJyYXlCdWZmZXIuICcgK1xuICAgICAgJ1JlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBzdHJpbmdcbiAgICApXG4gIH1cblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbXVzdE1hdGNoID0gKGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSA9PT0gdHJ1ZSlcbiAgaWYgKCFtdXN0TWF0Y2ggJiYgbGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB7XG4gICAgICAgICAgcmV0dXJuIG11c3RNYXRjaCA/IC0xIDogdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgfVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoaXMgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCAoYW5kIHRoZSBgaXMtYnVmZmVyYCBucG0gcGFja2FnZSlcbi8vIHRvIGRldGVjdCBhIEJ1ZmZlciBpbnN0YW5jZS4gSXQncyBub3QgcG9zc2libGUgdG8gdXNlIGBpbnN0YW5jZW9mIEJ1ZmZlcmBcbi8vIHJlbGlhYmx5IGluIGEgYnJvd3NlcmlmeSBjb250ZXh0IGJlY2F1c2UgdGhlcmUgY291bGQgYmUgbXVsdGlwbGUgZGlmZmVyZW50XG4vLyBjb3BpZXMgb2YgdGhlICdidWZmZXInIHBhY2thZ2UgaW4gdXNlLiBUaGlzIG1ldGhvZCB3b3JrcyBldmVuIGZvciBCdWZmZXJcbi8vIGluc3RhbmNlcyB0aGF0IHdlcmUgY3JlYXRlZCBmcm9tIGFub3RoZXIgY29weSBvZiB0aGUgYGJ1ZmZlcmAgcGFja2FnZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE1NFxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0xvY2FsZVN0cmluZyA9IEJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmdcblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5yZXBsYWNlKC8oLnsyfSkvZywgJyQxICcpLnRyaW0oKVxuICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmIChpc0luc3RhbmNlKHRhcmdldCwgVWludDhBcnJheSkpIHtcbiAgICB0YXJnZXQgPSBCdWZmZXIuZnJvbSh0YXJnZXQsIHRhcmdldC5vZmZzZXQsIHRhcmdldC5ieXRlTGVuZ3RoKVxuICB9XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcInRhcmdldFwiIGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXkuICcgK1xuICAgICAgJ1JlY2VpdmVkIHR5cGUgJyArICh0eXBlb2YgdGFyZ2V0KVxuICAgIClcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKG51bWJlcklzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKG51bWJlcklzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoID4+PiAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQnVmZmVyLndyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldFssIGxlbmd0aF0pIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQnXG4gICAgKVxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBsYXRpbjFTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgKGJ5dGVzW2kgKyAxXSAqIDI1NikpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSAtIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgKDggKiBieXRlTGVuZ3RoKSAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IHNob3VsZCBiZSBhIEJ1ZmZlcicpXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gVXNlIGJ1aWx0LWluIHdoZW4gYXZhaWxhYmxlLCBtaXNzaW5nIGZyb20gSUUxMVxuICAgIHRoaXMuY29weVdpdGhpbih0YXJnZXRTdGFydCwgc3RhcnQsIGVuZClcbiAgfSBlbHNlIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAodmFyIGkgPSBsZW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKChlbmNvZGluZyA9PT0gJ3V0ZjgnICYmIGNvZGUgPCAxMjgpIHx8XG4gICAgICAgICAgZW5jb2RpbmcgPT09ICdsYXRpbjEnKSB7XG4gICAgICAgIC8vIEZhc3QgcGF0aDogSWYgYHZhbGAgZml0cyBpbnRvIGEgc2luZ2xlIGJ5dGUsIHVzZSB0aGF0IG51bWVyaWMgdmFsdWUuXG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgdmFsdWUgXCInICsgdmFsICtcbiAgICAgICAgJ1wiIGlzIGludmFsaWQgZm9yIGFyZ3VtZW50IFwidmFsdWVcIicpXG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgKytpKSB7XG4gICAgICB0aGlzW2kgKyBzdGFydF0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teKy8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgdGFrZXMgZXF1YWwgc2lnbnMgYXMgZW5kIG9mIHRoZSBCYXNlNjQgZW5jb2RpbmdcbiAgc3RyID0gc3RyLnNwbGl0KCc9JylbMF1cbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG4vLyBBcnJheUJ1ZmZlciBvciBVaW50OEFycmF5IG9iamVjdHMgZnJvbSBvdGhlciBjb250ZXh0cyAoaS5lLiBpZnJhbWVzKSBkbyBub3QgcGFzc1xuLy8gdGhlIGBpbnN0YW5jZW9mYCBjaGVjayBidXQgdGhleSBzaG91bGQgYmUgdHJlYXRlZCBhcyBvZiB0aGF0IHR5cGUuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNjZcbmZ1bmN0aW9uIGlzSW5zdGFuY2UgKG9iaiwgdHlwZSkge1xuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgdHlwZSB8fFxuICAgIChvYmogIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IgIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IubmFtZSAhPSBudWxsICYmXG4gICAgICBvYmouY29uc3RydWN0b3IubmFtZSA9PT0gdHlwZS5uYW1lKVxufVxuZnVuY3Rpb24gbnVtYmVySXNOYU4gKG9iaikge1xuICAvLyBGb3IgSUUxMSBzdXBwb3J0XG4gIHJldHVybiBvYmogIT09IG9iaiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuIiwidmFyIGNoYXJlbmMgPSB7XG4gIC8vIFVURi04IGVuY29kaW5nXG4gIHV0Zjg6IHtcbiAgICAvLyBDb252ZXJ0IGEgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIHN0cmluZ1RvQnl0ZXM6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgcmV0dXJuIGNoYXJlbmMuYmluLnN0cmluZ1RvQnl0ZXModW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpKTtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBzdHJpbmdcbiAgICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoY2hhcmVuYy5iaW4uYnl0ZXNUb1N0cmluZyhieXRlcykpKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gQmluYXJ5IGVuY29kaW5nXG4gIGJpbjoge1xuICAgIC8vIENvbnZlcnQgYSBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgc3RyaW5nVG9CeXRlczogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKylcbiAgICAgICAgYnl0ZXMucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIHN0cmluZ1xuICAgIGJ5dGVzVG9TdHJpbmc6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBzdHIgPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKylcbiAgICAgICAgc3RyLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSkpO1xuICAgICAgcmV0dXJuIHN0ci5qb2luKCcnKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2hhcmVuYztcbiIsIi8qIVxuICogalF1ZXJ5IGNsaXAtcGF0aC1wb2x5Z29uIFBsdWdpbiB2MC4xLjE0ICgyMDE5LTExLTE2KVxuICogalF1ZXJ5IHBsdWdpbiB0aGF0IG1ha2VzIGVhc3kgdG8gdXNlIGNsaXAtcGF0aCBvbiB3aGF0ZXZlciB0YWcgdW5kZXIgZGlmZmVyZW50IGJyb3dzZXJzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5kcnVzaWVjemtvL2NsaXAtcGF0aC1wb2x5Z29uXG4gKiBcbiAqIENvcHlyaWdodCAyMDE5IEthcm9sIEFuZHJ1c2llY3prb1xuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqL1xuXG52YXIgZ2xvYmFsVmFyaWFibGUgPSB3aW5kb3cgfHwgcm9vdDtcbnZhciBqUXVlcnkgPSBqUXVlcnkgfHwgZ2xvYmFsVmFyaWFibGUualF1ZXJ5IHx8IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbihmdW5jdGlvbigkKSB7XG4gIHZhciBpZCA9IDA7XG5cbiAgdmFyIENsaXBQYXRoID0gZnVuY3Rpb24oalF1ZXJ5LCAkZWwsIHBvaW50cywgb3B0aW9ucykge1xuICAgIHRoaXMuJCA9IGpRdWVyeTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICB0aGlzLnBvaW50cyA9IHBvaW50cztcbiAgICB0aGlzLnN2Z0RlZklkID0gJ2NsaXBQYXRoUG9seWdvbkdlbklkJyArIGlkKys7XG5cbiAgICB0aGlzLnByb2Nlc3NPcHRpb25zKG9wdGlvbnMpO1xuICB9O1xuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IENsaXBQYXRoO1xuICAgIH1cbiAgICBleHBvcnRzLkNsaXBQYXRoID0gQ2xpcFBhdGg7XG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsVmFyaWFibGUuQ2xpcFBhdGggPSBDbGlwUGF0aDtcbiAgfVxuXG4gIENsaXBQYXRoLnByb3RvdHlwZSA9IHtcblxuICAgICQ6IG51bGwsXG4gICAgJGVsOiBudWxsLFxuICAgIHBvaW50czogbnVsbCxcblxuICAgIGlzRm9yV2Via2l0OiB0cnVlLFxuICAgIGlzRm9yU3ZnOiB0cnVlLFxuICAgIHN2Z0RlZklkOiBudWxsLFxuICAgIGlzUGVyY2VudGFnZTogZmFsc2UsXG5cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fY3JlYXRlQ2xpcFBhdGgodGhpcy5wb2ludHMpO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ2xpcFBhdGg6IGZ1bmN0aW9uKHBvaW50cykge1xuICAgICAgdGhpcy5fY3JlYXRlU3ZnRGVmcygpO1xuICAgICAgaWYgKHRoaXMuaXNGb3JTdmcpIHtcbiAgICAgICAgdGhpcy5fY3JlYXRlU3ZnQmFzZWRDbGlwUGF0aChwb2ludHMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaXNGb3JXZWJraXQpIHtcbiAgICAgICAgdGhpcy5fY3JlYXRlV2Via2l0Q2xpcFBhdGgocG9pbnRzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NyZWF0ZVdlYmtpdENsaXBQYXRoOiBmdW5jdGlvbihwb2ludHMpIHtcbiAgICAgIHZhciBjbGlwUGF0aCA9IFwicG9seWdvbihcIiArIHRoaXMuX3RyYW5zbGF0ZVBvaW50cyhwb2ludHMsIHRydWUsIHRoaXMuaXNQZXJjZW50YWdlKSArIFwiKVwiO1xuICAgICAgdGhpcy4kZWwuY3NzKCctd2Via2l0LWNsaXAtcGF0aCcsIGNsaXBQYXRoKTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZVN2Z0Jhc2VkQ2xpcFBhdGg6IGZ1bmN0aW9uKHBvaW50cykge1xuICAgICAgdGhpcy4kKCcjJyArIHRoaXMuc3ZnRGVmSWQgKyAnJykuZmluZCgncG9seWdvbicpLmF0dHIoJ3BvaW50cycsIHRoaXMuX3RyYW5zbGF0ZVBvaW50cyhwb2ludHMsIGZhbHNlLCB0aGlzLmlzUGVyY2VudGFnZSkpO1xuICAgICAgdGhpcy4kZWwuY3NzKCdjbGlwLXBhdGgnLCAndXJsKCMnICsgdGhpcy5zdmdEZWZJZCArICcpJyk7XG4gICAgfSxcblxuXG4gICAgX3RyYW5zbGF0ZVBvaW50czogZnVuY3Rpb24ocG9pbnRzLCB3aXRoVW5pdCwgaXNQZXJjZW50YWdlKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICBmb3IgKHZhciBpIGluIHBvaW50cykge1xuICAgICAgICB2YXIgeCA9IHRoaXMuX2hhbmRsZVB4cyhwb2ludHNbaV1bMF0sIHdpdGhVbml0LCBpc1BlcmNlbnRhZ2UpO1xuICAgICAgICB2YXIgeSA9IHRoaXMuX2hhbmRsZVB4cyhwb2ludHNbaV1bMV0sIHdpdGhVbml0LCBpc1BlcmNlbnRhZ2UpO1xuICAgICAgICByZXN1bHQucHVzaCh4ICsgJyAnICsgeSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJywgJyk7XG4gICAgfSxcblxuICAgIF9oYW5kbGVQeHM6IGZ1bmN0aW9uKG51bWJlciwgd2l0aFVuaXQsIGlzUGVyY2VudGFnZSkge1xuICAgICAgaWYgKG51bWJlciA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgICAgfVxuICAgICAgaWYgKCF3aXRoVW5pdCkge1xuICAgICAgICBpZiAoaXNQZXJjZW50YWdlKSB7XG4gICAgICAgICAgcmV0dXJuIG51bWJlciAvIDEwMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVtYmVyICsgKGlzUGVyY2VudGFnZSA/IFwiJVwiIDogXCJweFwiKTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZVN2Z0VsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnROYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy4kKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBlbGVtZW50TmFtZSkpO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlU3ZnRGVmczogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy4kKCcjJyArIHRoaXMuc3ZnRGVmSWQgKyAnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciAkc3ZnID0gdGhpcy5fY3JlYXRlU3ZnRWxlbWVudCgnc3ZnJykuYXR0cignd2lkdGgnLCAwKS5hdHRyKCdoZWlnaHQnLCAwKS5jc3Moe1xuICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgJ3Zpc2liaWxpdHknOiAnaGlkZGVuJyxcbiAgICAgICAgICAnd2lkdGgnOiAwLFxuICAgICAgICAgICdoZWlnaHQnOiAwXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgJGRlZnMgPSB0aGlzLl9jcmVhdGVTdmdFbGVtZW50KCdkZWZzJyk7XG4gICAgICAgICRzdmcuYXBwZW5kKCRkZWZzKTtcbiAgICAgICAgdmFyICRjbGlwcGF0aCA9IHRoaXMuX2NyZWF0ZVN2Z0VsZW1lbnQoJ2NsaXBQYXRoJykuYXR0cignaWQnLCB0aGlzLnN2Z0RlZklkKTtcbiAgICAgICAgaWYgKHRoaXMuaXNQZXJjZW50YWdlKSB7XG4gICAgICAgICAgJGNsaXBwYXRoLmdldCgwKS5zZXRBdHRyaWJ1dGUoJ2NsaXBQYXRoVW5pdHMnLCAnb2JqZWN0Qm91bmRpbmdCb3gnKTtcbiAgICAgICAgfVxuICAgICAgICAkZGVmcy5hcHBlbmQoJGNsaXBwYXRoKTtcbiAgICAgICAgdmFyICRwb2x5Z29uID0gdGhpcy5fY3JlYXRlU3ZnRWxlbWVudCgncG9seWdvbicpO1xuICAgICAgICAkY2xpcHBhdGguYXBwZW5kKCRwb2x5Z29uKTtcbiAgICAgICAgdGhpcy4kKCdib2R5JykuYXBwZW5kKCRzdmcpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBwcm9jZXNzT3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdGhpcy5pc0ZvcldlYmtpdCA9IChvcHRpb25zICYmIHR5cGVvZihvcHRpb25zLmlzRm9yV2Via2l0KSAhPT0gXCJ1bmRlZmluZWRcIikgPyBvcHRpb25zLmlzRm9yV2Via2l0IDogdGhpcy5pc0ZvcldlYmtpdDtcbiAgICAgIHRoaXMuaXNGb3JTdmcgPSAob3B0aW9ucyAmJiB0eXBlb2Yob3B0aW9ucy5pc0ZvclN2ZykgIT09IFwidW5kZWZpbmVkXCIpID8gb3B0aW9ucy5pc0ZvclN2ZyA6IHRoaXMuaXNGb3JTdmc7XG4gICAgICB0aGlzLmlzUGVyY2VudGFnZSA9IChvcHRpb25zICYmIG9wdGlvbnMuaXNQZXJjZW50YWdlIHx8IHRoaXMuaXNQZXJjZW50YWdlKTtcbiAgICAgIHRoaXMuc3ZnRGVmSWQgPSAob3B0aW9ucyAmJiBvcHRpb25zLnN2Z0RlZklkKSB8fCB0aGlzLnN2Z0RlZklkO1xuICAgIH1cbiAgfTtcbiAgXG4gICQuZm4uY2xpcFBhdGggPSBmdW5jdGlvbihwb2ludHMsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRlbCA9ICQodGhpcyk7XG4gICAgICB2YXIgY2xpcFBhdGggPSBuZXcgQ2xpcFBhdGgoJCwgJGVsLCBwb2ludHMsIG9wdGlvbnMpO1xuICAgICAgY2xpcFBhdGguY3JlYXRlKCk7XG4gICAgfSk7XG4gIH07XG5cbn0pLmNhbGwodGhpcywgalF1ZXJ5KTtcbiIsIihmdW5jdGlvbigpIHtcbiAgdmFyIGJhc2U2NG1hcFxuICAgICAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLycsXG5cbiAgY3J5cHQgPSB7XG4gICAgLy8gQml0LXdpc2Ugcm90YXRpb24gbGVmdFxuICAgIHJvdGw6IGZ1bmN0aW9uKG4sIGIpIHtcbiAgICAgIHJldHVybiAobiA8PCBiKSB8IChuID4+PiAoMzIgLSBiKSk7XG4gICAgfSxcblxuICAgIC8vIEJpdC13aXNlIHJvdGF0aW9uIHJpZ2h0XG4gICAgcm90cjogZnVuY3Rpb24obiwgYikge1xuICAgICAgcmV0dXJuIChuIDw8ICgzMiAtIGIpKSB8IChuID4+PiBiKTtcbiAgICB9LFxuXG4gICAgLy8gU3dhcCBiaWctZW5kaWFuIHRvIGxpdHRsZS1lbmRpYW4gYW5kIHZpY2UgdmVyc2FcbiAgICBlbmRpYW46IGZ1bmN0aW9uKG4pIHtcbiAgICAgIC8vIElmIG51bWJlciBnaXZlbiwgc3dhcCBlbmRpYW5cbiAgICAgIGlmIChuLmNvbnN0cnVjdG9yID09IE51bWJlcikge1xuICAgICAgICByZXR1cm4gY3J5cHQucm90bChuLCA4KSAmIDB4MDBGRjAwRkYgfCBjcnlwdC5yb3RsKG4sIDI0KSAmIDB4RkYwMEZGMDA7XG4gICAgICB9XG5cbiAgICAgIC8vIEVsc2UsIGFzc3VtZSBhcnJheSBhbmQgc3dhcCBhbGwgaXRlbXNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbi5sZW5ndGg7IGkrKylcbiAgICAgICAgbltpXSA9IGNyeXB0LmVuZGlhbihuW2ldKTtcbiAgICAgIHJldHVybiBuO1xuICAgIH0sXG5cbiAgICAvLyBHZW5lcmF0ZSBhbiBhcnJheSBvZiBhbnkgbGVuZ3RoIG9mIHJhbmRvbSBieXRlc1xuICAgIHJhbmRvbUJ5dGVzOiBmdW5jdGlvbihuKSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdOyBuID4gMDsgbi0tKVxuICAgICAgICBieXRlcy5wdXNoKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NikpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBiaWctZW5kaWFuIDMyLWJpdCB3b3Jkc1xuICAgIGJ5dGVzVG9Xb3JkczogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIHdvcmRzID0gW10sIGkgPSAwLCBiID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrLCBiICs9IDgpXG4gICAgICAgIHdvcmRzW2IgPj4+IDVdIHw9IGJ5dGVzW2ldIDw8ICgyNCAtIGIgJSAzMik7XG4gICAgICByZXR1cm4gd29yZHM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYmlnLWVuZGlhbiAzMi1iaXQgd29yZHMgdG8gYSBieXRlIGFycmF5XG4gICAgd29yZHNUb0J5dGVzOiBmdW5jdGlvbih3b3Jkcykge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgYiA9IDA7IGIgPCB3b3Jkcy5sZW5ndGggKiAzMjsgYiArPSA4KVxuICAgICAgICBieXRlcy5wdXNoKCh3b3Jkc1tiID4+PiA1XSA+Pj4gKDI0IC0gYiAlIDMyKSkgJiAweEZGKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBoZXggc3RyaW5nXG4gICAgYnl0ZXNUb0hleDogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIGhleCA9IFtdLCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhleC5wdXNoKChieXRlc1tpXSA+Pj4gNCkudG9TdHJpbmcoMTYpKTtcbiAgICAgICAgaGV4LnB1c2goKGJ5dGVzW2ldICYgMHhGKS50b1N0cmluZygxNikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhleC5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGhleCBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgaGV4VG9CeXRlczogZnVuY3Rpb24oaGV4KSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBjID0gMDsgYyA8IGhleC5sZW5ndGg7IGMgKz0gMilcbiAgICAgICAgYnl0ZXMucHVzaChwYXJzZUludChoZXguc3Vic3RyKGMsIDIpLCAxNikpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIGJhc2UtNjQgc3RyaW5nXG4gICAgYnl0ZXNUb0Jhc2U2NDogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIGJhc2U2NCA9IFtdLCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIHZhciB0cmlwbGV0ID0gKGJ5dGVzW2ldIDw8IDE2KSB8IChieXRlc1tpICsgMV0gPDwgOCkgfCBieXRlc1tpICsgMl07XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgNDsgaisrKVxuICAgICAgICAgIGlmIChpICogOCArIGogKiA2IDw9IGJ5dGVzLmxlbmd0aCAqIDgpXG4gICAgICAgICAgICBiYXNlNjQucHVzaChiYXNlNjRtYXAuY2hhckF0KCh0cmlwbGV0ID4+PiA2ICogKDMgLSBqKSkgJiAweDNGKSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYmFzZTY0LnB1c2goJz0nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBiYXNlNjQuam9pbignJyk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBiYXNlLTY0IHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBiYXNlNjRUb0J5dGVzOiBmdW5jdGlvbihiYXNlNjQpIHtcbiAgICAgIC8vIFJlbW92ZSBub24tYmFzZS02NCBjaGFyYWN0ZXJzXG4gICAgICBiYXNlNjQgPSBiYXNlNjQucmVwbGFjZSgvW15BLVowLTkrXFwvXS9pZywgJycpO1xuXG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBpID0gMCwgaW1vZDQgPSAwOyBpIDwgYmFzZTY0Lmxlbmd0aDtcbiAgICAgICAgICBpbW9kNCA9ICsraSAlIDQpIHtcbiAgICAgICAgaWYgKGltb2Q0ID09IDApIGNvbnRpbnVlO1xuICAgICAgICBieXRlcy5wdXNoKCgoYmFzZTY0bWFwLmluZGV4T2YoYmFzZTY0LmNoYXJBdChpIC0gMSkpXG4gICAgICAgICAgICAmIChNYXRoLnBvdygyLCAtMiAqIGltb2Q0ICsgOCkgLSAxKSkgPDwgKGltb2Q0ICogMikpXG4gICAgICAgICAgICB8IChiYXNlNjRtYXAuaW5kZXhPZihiYXNlNjQuY2hhckF0KGkpKSA+Pj4gKDYgLSBpbW9kNCAqIDIpKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfVxuICB9O1xuXG4gIG1vZHVsZS5leHBvcnRzID0gY3J5cHQ7XG59KSgpO1xuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiLypcbiAqIHFUaXAyIC0gUHJldHR5IHBvd2VyZnVsIHRvb2x0aXBzIC0gdjMuMC4zXG4gKiBodHRwOi8vcXRpcDIuY29tXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE2IFxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlc1xuICogaHR0cDovL2pxdWVyeS5vcmcvbGljZW5zZVxuICpcbiAqIERhdGU6IFdlZCBNYXkgMTEgMjAxNiAxMDozMSBHTVQrMDEwMCswMTAwXG4gKiBQbHVnaW5zOiB0aXBzIG1vZGFsIHZpZXdwb3J0IHN2ZyBpbWFnZW1hcCBpZTZcbiAqIFN0eWxlczogY29yZSBiYXNpYyBjc3MzXG4gKi9cbi8qZ2xvYmFsIHdpbmRvdzogZmFsc2UsIGpRdWVyeTogZmFsc2UsIGNvbnNvbGU6IGZhbHNlLCBkZWZpbmU6IGZhbHNlICovXG5cbi8qIENhY2hlIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCAqL1xuKGZ1bmN0aW9uKCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQgKSB7XG5cbi8vIFVzZXMgQU1EIG9yIGJyb3dzZXIgZ2xvYmFscyB0byBjcmVhdGUgYSBqUXVlcnkgcGx1Z2luLlxuKGZ1bmN0aW9uKCBmYWN0b3J5ICkge1xuXHRcInVzZSBzdHJpY3RcIjtcblx0aWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuXHR9XG5cdGVsc2UgaWYoalF1ZXJ5ICYmICFqUXVlcnkuZm4ucXRpcCkge1xuXHRcdGZhY3RvcnkoalF1ZXJ5KTtcblx0fVxufVxuKGZ1bmN0aW9uKCQpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7IC8vIEVuYWJsZSBFQ01BU2NyaXB0IFwic3RyaWN0XCIgb3BlcmF0aW9uIGZvciB0aGlzIGZ1bmN0aW9uLiBTZWUgbW9yZTogaHR0cDovL2Vqb2huLm9yZy9ibG9nL2VjbWFzY3JpcHQtNS1zdHJpY3QtbW9kZS1qc29uLWFuZC1tb3JlL1xuOy8vIE11bmdlIHRoZSBwcmltaXRpdmVzIC0gUGF1bCBJcmlzaCB0aXBcbnZhciBUUlVFID0gdHJ1ZSxcbkZBTFNFID0gZmFsc2UsXG5OVUxMID0gbnVsbCxcblxuLy8gQ29tbW9uIHZhcmlhYmxlc1xuWCA9ICd4JywgWSA9ICd5JyxcbldJRFRIID0gJ3dpZHRoJyxcbkhFSUdIVCA9ICdoZWlnaHQnLFxuXG4vLyBQb3NpdGlvbmluZyBzaWRlc1xuVE9QID0gJ3RvcCcsXG5MRUZUID0gJ2xlZnQnLFxuQk9UVE9NID0gJ2JvdHRvbScsXG5SSUdIVCA9ICdyaWdodCcsXG5DRU5URVIgPSAnY2VudGVyJyxcblxuLy8gUG9zaXRpb24gYWRqdXN0bWVudCB0eXBlc1xuRkxJUCA9ICdmbGlwJyxcbkZMSVBJTlZFUlQgPSAnZmxpcGludmVydCcsXG5TSElGVCA9ICdzaGlmdCcsXG5cbi8vIFNob3J0Y3V0IHZhcnNcblFUSVAsIFBST1RPVFlQRSwgQ09STkVSLCBDSEVDS1MsXG5QTFVHSU5TID0ge30sXG5OQU1FU1BBQ0UgPSAncXRpcCcsXG5BVFRSX0hBUyA9ICdkYXRhLWhhc3F0aXAnLFxuQVRUUl9JRCA9ICdkYXRhLXF0aXAtaWQnLFxuV0lER0VUID0gWyd1aS13aWRnZXQnLCAndWktdG9vbHRpcCddLFxuU0VMRUNUT1IgPSAnLicrTkFNRVNQQUNFLFxuSU5BQ1RJVkVfRVZFTlRTID0gJ2NsaWNrIGRibGNsaWNrIG1vdXNlZG93biBtb3VzZXVwIG1vdXNlbW92ZSBtb3VzZWxlYXZlIG1vdXNlZW50ZXInLnNwbGl0KCcgJyksXG5cbkNMQVNTX0ZJWEVEID0gTkFNRVNQQUNFKyctZml4ZWQnLFxuQ0xBU1NfREVGQVVMVCA9IE5BTUVTUEFDRSArICctZGVmYXVsdCcsXG5DTEFTU19GT0NVUyA9IE5BTUVTUEFDRSArICctZm9jdXMnLFxuQ0xBU1NfSE9WRVIgPSBOQU1FU1BBQ0UgKyAnLWhvdmVyJyxcbkNMQVNTX0RJU0FCTEVEID0gTkFNRVNQQUNFKyctZGlzYWJsZWQnLFxuXG5yZXBsYWNlU3VmZml4ID0gJ19yZXBsYWNlZEJ5cVRpcCcsXG5vbGR0aXRsZSA9ICdvbGR0aXRsZScsXG50cmFja2luZ0JvdW5kLFxuXG4vLyBCcm93c2VyIGRldGVjdGlvblxuQlJPV1NFUiA9IHtcblx0Lypcblx0ICogSUUgdmVyc2lvbiBkZXRlY3Rpb25cblx0ICpcblx0ICogQWRhcHRlZCBmcm9tOiBodHRwOi8vYWpheGlhbi5jb20vYXJjaGl2ZXMvYXR0YWNrLW9mLXRoZS1pZS1jb25kaXRpb25hbC1jb21tZW50XG5cdCAqIENyZWRpdCB0byBKYW1lcyBQYWRvbHNleSBmb3IgdGhlIG9yaWdpbmFsIGltcGxlbW50YXRpb24hXG5cdCAqL1xuXHRpZTogKGZ1bmN0aW9uKCkge1xuXHRcdC8qIGVzbGludC1kaXNhYmxlIG5vLWVtcHR5ICovXG5cdFx0dmFyIHYsIGk7XG5cdFx0Zm9yIChcblx0XHRcdHYgPSA0LCBpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHQoaS5pbm5lckhUTUwgPSAnPCEtLVtpZiBndCBJRSAnICsgdiArICddPjxpPjwvaT48IVtlbmRpZl0tLT4nKSAmJiBpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpJylbMF07XG5cdFx0XHR2Kz0xXG5cdFx0KSB7fVxuXHRcdHJldHVybiB2ID4gNCA/IHYgOiBOYU47XG5cdFx0LyogZXNsaW50LWVuYWJsZSBuby1lbXB0eSAqL1xuXHR9KSgpLFxuXG5cdC8qXG5cdCAqIGlPUyB2ZXJzaW9uIGRldGVjdGlvblxuXHQgKi9cblx0aU9TOiBwYXJzZUZsb2F0KFxuXHRcdCgnJyArICgvQ1BVLipPUyAoWzAtOV9dezEsNX0pfChDUFUgbGlrZSkuKkFwcGxlV2ViS2l0LipNb2JpbGUvaS5leGVjKG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IFswLCcnXSlbMV0pXG5cdFx0LnJlcGxhY2UoJ3VuZGVmaW5lZCcsICczXzInKS5yZXBsYWNlKCdfJywgJy4nKS5yZXBsYWNlKCdfJywgJycpXG5cdCkgfHwgRkFMU0Vcbn07XG47ZnVuY3Rpb24gUVRpcCh0YXJnZXQsIG9wdGlvbnMsIGlkLCBhdHRyKSB7XG5cdC8vIEVsZW1lbnRzIGFuZCBJRFxuXHR0aGlzLmlkID0gaWQ7XG5cdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuXHR0aGlzLnRvb2x0aXAgPSBOVUxMO1xuXHR0aGlzLmVsZW1lbnRzID0geyB0YXJnZXQ6IHRhcmdldCB9O1xuXG5cdC8vIEludGVybmFsIGNvbnN0cnVjdHNcblx0dGhpcy5faWQgPSBOQU1FU1BBQ0UgKyAnLScgKyBpZDtcblx0dGhpcy50aW1lcnMgPSB7IGltZzoge30gfTtcblx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0dGhpcy5wbHVnaW5zID0ge307XG5cblx0Ly8gQ2FjaGUgb2JqZWN0XG5cdHRoaXMuY2FjaGUgPSB7XG5cdFx0ZXZlbnQ6IHt9LFxuXHRcdHRhcmdldDogJCgpLFxuXHRcdGRpc2FibGVkOiBGQUxTRSxcblx0XHRhdHRyOiBhdHRyLFxuXHRcdG9uVG9vbHRpcDogRkFMU0UsXG5cdFx0bGFzdENsYXNzOiAnJ1xuXHR9O1xuXG5cdC8vIFNldCB0aGUgaW5pdGlhbCBmbGFnc1xuXHR0aGlzLnJlbmRlcmVkID0gdGhpcy5kZXN0cm95ZWQgPSB0aGlzLmRpc2FibGVkID0gdGhpcy53YWl0aW5nID1cblx0XHR0aGlzLmhpZGRlbkR1cmluZ1dhaXQgPSB0aGlzLnBvc2l0aW9uaW5nID0gdGhpcy50cmlnZ2VyaW5nID0gRkFMU0U7XG59XG5QUk9UT1RZUEUgPSBRVGlwLnByb3RvdHlwZTtcblxuUFJPVE9UWVBFLl93aGVuID0gZnVuY3Rpb24oZGVmZXJyZWRzKSB7XG5cdHJldHVybiAkLndoZW4uYXBwbHkoJCwgZGVmZXJyZWRzKTtcbn07XG5cblBST1RPVFlQRS5yZW5kZXIgPSBmdW5jdGlvbihzaG93KSB7XG5cdGlmKHRoaXMucmVuZGVyZWQgfHwgdGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIHRoaXM7IH0gLy8gSWYgdG9vbHRpcCBoYXMgYWxyZWFkeSBiZWVuIHJlbmRlcmVkLCBleGl0XG5cblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG5cdFx0Y2FjaGUgPSB0aGlzLmNhY2hlLFxuXHRcdGVsZW1lbnRzID0gdGhpcy5lbGVtZW50cyxcblx0XHR0ZXh0ID0gb3B0aW9ucy5jb250ZW50LnRleHQsXG5cdFx0dGl0bGUgPSBvcHRpb25zLmNvbnRlbnQudGl0bGUsXG5cdFx0YnV0dG9uID0gb3B0aW9ucy5jb250ZW50LmJ1dHRvbixcblx0XHRwb3NPcHRpb25zID0gb3B0aW9ucy5wb3NpdGlvbixcblx0XHRkZWZlcnJlZHMgPSBbXTtcblxuXHQvLyBBZGQgQVJJQSBhdHRyaWJ1dGVzIHRvIHRhcmdldFxuXHQkLmF0dHIodGhpcy50YXJnZXRbMF0sICdhcmlhLWRlc2NyaWJlZGJ5JywgdGhpcy5faWQpO1xuXG5cdC8vIENyZWF0ZSBwdWJsaWMgcG9zaXRpb24gb2JqZWN0IHRoYXQgdHJhY2tzIGN1cnJlbnQgcG9zaXRpb24gY29ybmVyc1xuXHRjYWNoZS5wb3NDbGFzcyA9IHRoaXMuX2NyZWF0ZVBvc0NsYXNzKFxuXHRcdCh0aGlzLnBvc2l0aW9uID0geyBteTogcG9zT3B0aW9ucy5teSwgYXQ6IHBvc09wdGlvbnMuYXQgfSkubXlcblx0KTtcblxuXHQvLyBDcmVhdGUgdG9vbHRpcCBlbGVtZW50XG5cdHRoaXMudG9vbHRpcCA9IGVsZW1lbnRzLnRvb2x0aXAgPSAkKCc8ZGl2Lz4nLCB7XG5cdFx0J2lkJzogdGhpcy5faWQsXG5cdFx0J2NsYXNzJzogWyBOQU1FU1BBQ0UsIENMQVNTX0RFRkFVTFQsIG9wdGlvbnMuc3R5bGUuY2xhc3NlcywgY2FjaGUucG9zQ2xhc3MgXS5qb2luKCcgJyksXG5cdFx0J3dpZHRoJzogb3B0aW9ucy5zdHlsZS53aWR0aCB8fCAnJyxcblx0XHQnaGVpZ2h0Jzogb3B0aW9ucy5zdHlsZS5oZWlnaHQgfHwgJycsXG5cdFx0J3RyYWNraW5nJzogcG9zT3B0aW9ucy50YXJnZXQgPT09ICdtb3VzZScgJiYgcG9zT3B0aW9ucy5hZGp1c3QubW91c2UsXG5cblx0XHQvKiBBUklBIHNwZWNpZmljIGF0dHJpYnV0ZXMgKi9cblx0XHQncm9sZSc6ICdhbGVydCcsXG5cdFx0J2FyaWEtbGl2ZSc6ICdwb2xpdGUnLFxuXHRcdCdhcmlhLWF0b21pYyc6IEZBTFNFLFxuXHRcdCdhcmlhLWRlc2NyaWJlZGJ5JzogdGhpcy5faWQgKyAnLWNvbnRlbnQnLFxuXHRcdCdhcmlhLWhpZGRlbic6IFRSVUVcblx0fSlcblx0LnRvZ2dsZUNsYXNzKENMQVNTX0RJU0FCTEVELCB0aGlzLmRpc2FibGVkKVxuXHQuYXR0cihBVFRSX0lELCB0aGlzLmlkKVxuXHQuZGF0YShOQU1FU1BBQ0UsIHRoaXMpXG5cdC5hcHBlbmRUbyhwb3NPcHRpb25zLmNvbnRhaW5lcilcblx0LmFwcGVuZChcblx0XHQvLyBDcmVhdGUgY29udGVudCBlbGVtZW50XG5cdFx0ZWxlbWVudHMuY29udGVudCA9ICQoJzxkaXYgLz4nLCB7XG5cdFx0XHQnY2xhc3MnOiBOQU1FU1BBQ0UgKyAnLWNvbnRlbnQnLFxuXHRcdFx0J2lkJzogdGhpcy5faWQgKyAnLWNvbnRlbnQnLFxuXHRcdFx0J2FyaWEtYXRvbWljJzogVFJVRVxuXHRcdH0pXG5cdCk7XG5cblx0Ly8gU2V0IHJlbmRlcmVkIGZsYWcgYW5kIHByZXZlbnQgcmVkdW5kYW50IHJlcG9zaXRpb24gY2FsbHMgZm9yIG5vd1xuXHR0aGlzLnJlbmRlcmVkID0gLTE7XG5cdHRoaXMucG9zaXRpb25pbmcgPSBUUlVFO1xuXG5cdC8vIENyZWF0ZSB0aXRsZS4uLlxuXHRpZih0aXRsZSkge1xuXHRcdHRoaXMuX2NyZWF0ZVRpdGxlKCk7XG5cblx0XHQvLyBVcGRhdGUgdGl0bGUgb25seSBpZiBpdHMgbm90IGEgY2FsbGJhY2sgKGNhbGxlZCBpbiB0b2dnbGUgaWYgc28pXG5cdFx0aWYoISQuaXNGdW5jdGlvbih0aXRsZSkpIHtcblx0XHRcdGRlZmVycmVkcy5wdXNoKCB0aGlzLl91cGRhdGVUaXRsZSh0aXRsZSwgRkFMU0UpICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ3JlYXRlIGJ1dHRvblxuXHRpZihidXR0b24pIHsgdGhpcy5fY3JlYXRlQnV0dG9uKCk7IH1cblxuXHQvLyBTZXQgcHJvcGVyIHJlbmRlcmVkIGZsYWcgYW5kIHVwZGF0ZSBjb250ZW50IGlmIG5vdCBhIGNhbGxiYWNrIGZ1bmN0aW9uIChjYWxsZWQgaW4gdG9nZ2xlKVxuXHRpZighJC5pc0Z1bmN0aW9uKHRleHQpKSB7XG5cdFx0ZGVmZXJyZWRzLnB1c2goIHRoaXMuX3VwZGF0ZUNvbnRlbnQodGV4dCwgRkFMU0UpICk7XG5cdH1cblx0dGhpcy5yZW5kZXJlZCA9IFRSVUU7XG5cblx0Ly8gU2V0dXAgd2lkZ2V0IGNsYXNzZXNcblx0dGhpcy5fc2V0V2lkZ2V0KCk7XG5cblx0Ly8gSW5pdGlhbGl6ZSAncmVuZGVyJyBwbHVnaW5zXG5cdCQuZWFjaChQTFVHSU5TLCBmdW5jdGlvbihuYW1lKSB7XG5cdFx0dmFyIGluc3RhbmNlO1xuXHRcdGlmKHRoaXMuaW5pdGlhbGl6ZSA9PT0gJ3JlbmRlcicgJiYgKGluc3RhbmNlID0gdGhpcyhzZWxmKSkpIHtcblx0XHRcdHNlbGYucGx1Z2luc1tuYW1lXSA9IGluc3RhbmNlO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gVW5hc3NpZ24gaW5pdGlhbCBldmVudHMgYW5kIGFzc2lnbiBwcm9wZXIgZXZlbnRzXG5cdHRoaXMuX3VuYXNzaWduRXZlbnRzKCk7XG5cdHRoaXMuX2Fzc2lnbkV2ZW50cygpO1xuXG5cdC8vIFdoZW4gZGVmZXJyZWRzIGhhdmUgY29tcGxldGVkXG5cdHRoaXMuX3doZW4oZGVmZXJyZWRzKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdC8vIHRvb2x0aXByZW5kZXIgZXZlbnRcblx0XHRzZWxmLl90cmlnZ2VyKCdyZW5kZXInKTtcblxuXHRcdC8vIFJlc2V0IGZsYWdzXG5cdFx0c2VsZi5wb3NpdGlvbmluZyA9IEZBTFNFO1xuXG5cdFx0Ly8gU2hvdyB0b29sdGlwIGlmIG5vdCBoaWRkZW4gZHVyaW5nIHdhaXQgcGVyaW9kXG5cdFx0aWYoIXNlbGYuaGlkZGVuRHVyaW5nV2FpdCAmJiAob3B0aW9ucy5zaG93LnJlYWR5IHx8IHNob3cpKSB7XG5cdFx0XHRzZWxmLnRvZ2dsZShUUlVFLCBjYWNoZS5ldmVudCwgRkFMU0UpO1xuXHRcdH1cblx0XHRzZWxmLmhpZGRlbkR1cmluZ1dhaXQgPSBGQUxTRTtcblx0fSk7XG5cblx0Ly8gRXhwb3NlIEFQSVxuXHRRVElQLmFwaVt0aGlzLmlkXSA9IHRoaXM7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5QUk9UT1RZUEUuZGVzdHJveSA9IGZ1bmN0aW9uKGltbWVkaWF0ZSkge1xuXHQvLyBTZXQgZmxhZyB0aGUgc2lnbmlmeSBkZXN0cm95IGlzIHRha2luZyBwbGFjZSB0byBwbHVnaW5zXG5cdC8vIGFuZCBlbnN1cmUgaXQgb25seSBnZXRzIGRlc3Ryb3llZCBvbmNlIVxuXHRpZih0aGlzLmRlc3Ryb3llZCkgeyByZXR1cm4gdGhpcy50YXJnZXQ7IH1cblxuXHRmdW5jdGlvbiBwcm9jZXNzKCkge1xuXHRcdGlmKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybjsgfVxuXHRcdHRoaXMuZGVzdHJveWVkID0gVFJVRTtcblxuXHRcdHZhciB0YXJnZXQgPSB0aGlzLnRhcmdldCxcblx0XHRcdHRpdGxlID0gdGFyZ2V0LmF0dHIob2xkdGl0bGUpLFxuXHRcdFx0dGltZXI7XG5cblx0XHQvLyBEZXN0cm95IHRvb2x0aXAgaWYgcmVuZGVyZWRcblx0XHRpZih0aGlzLnJlbmRlcmVkKSB7XG5cdFx0XHR0aGlzLnRvb2x0aXAuc3RvcCgxLDApLmZpbmQoJyonKS5yZW1vdmUoKS5lbmQoKS5yZW1vdmUoKTtcblx0XHR9XG5cblx0XHQvLyBEZXN0cm95IGFsbCBwbHVnaW5zXG5cdFx0JC5lYWNoKHRoaXMucGx1Z2lucywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmRlc3Ryb3kgJiYgdGhpcy5kZXN0cm95KCk7XG5cdFx0fSk7XG5cblx0XHQvLyBDbGVhciB0aW1lcnNcblx0XHRmb3IgKHRpbWVyIGluIHRoaXMudGltZXJzKSB7XG5cdFx0XHRpZiAodGhpcy50aW1lcnMuaGFzT3duUHJvcGVydHkodGltZXIpKSB7XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVyc1t0aW1lcl0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFJlbW92ZSBhcGkgb2JqZWN0IGFuZCBBUklBIGF0dHJpYnV0ZXNcblx0XHR0YXJnZXQucmVtb3ZlRGF0YShOQU1FU1BBQ0UpXG5cdFx0XHQucmVtb3ZlQXR0cihBVFRSX0lEKVxuXHRcdFx0LnJlbW92ZUF0dHIoQVRUUl9IQVMpXG5cdFx0XHQucmVtb3ZlQXR0cignYXJpYS1kZXNjcmliZWRieScpO1xuXG5cdFx0Ly8gUmVzZXQgb2xkIHRpdGxlIGF0dHJpYnV0ZSBpZiByZW1vdmVkXG5cdFx0aWYodGhpcy5vcHRpb25zLnN1cHByZXNzICYmIHRpdGxlKSB7XG5cdFx0XHR0YXJnZXQuYXR0cigndGl0bGUnLCB0aXRsZSkucmVtb3ZlQXR0cihvbGR0aXRsZSk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVtb3ZlIHFUaXAgZXZlbnRzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIEFQSVxuXHRcdHRoaXMuX3VuYXNzaWduRXZlbnRzKCk7XG5cblx0XHQvLyBSZW1vdmUgSUQgZnJvbSB1c2VkIGlkIG9iamVjdHMsIGFuZCBkZWxldGUgb2JqZWN0IHJlZmVyZW5jZXNcblx0XHQvLyBmb3IgYmV0dGVyIGdhcmJhZ2UgY29sbGVjdGlvbiBhbmQgbGVhayBwcm90ZWN0aW9uXG5cdFx0dGhpcy5vcHRpb25zID0gdGhpcy5lbGVtZW50cyA9IHRoaXMuY2FjaGUgPSB0aGlzLnRpbWVycyA9XG5cdFx0XHR0aGlzLnBsdWdpbnMgPSB0aGlzLm1vdXNlID0gTlVMTDtcblxuXHRcdC8vIERlbGV0ZSBlcG94c2VkIEFQSSBvYmplY3Rcblx0XHRkZWxldGUgUVRJUC5hcGlbdGhpcy5pZF07XG5cdH1cblxuXHQvLyBJZiBhbiBpbW1lZGlhdGUgZGVzdHJveSBpcyBuZWVkZWRcblx0aWYoKGltbWVkaWF0ZSAhPT0gVFJVRSB8fCB0aGlzLnRyaWdnZXJpbmcgPT09ICdoaWRlJykgJiYgdGhpcy5yZW5kZXJlZCkge1xuXHRcdHRoaXMudG9vbHRpcC5vbmUoJ3Rvb2x0aXBoaWRkZW4nLCAkLnByb3h5KHByb2Nlc3MsIHRoaXMpKTtcblx0XHQhdGhpcy50cmlnZ2VyaW5nICYmIHRoaXMuaGlkZSgpO1xuXHR9XG5cblx0Ly8gSWYgd2UncmUgbm90IGluIHRoZSBwcm9jZXNzIG9mIGhpZGluZy4uLiBwcm9jZXNzXG5cdGVsc2UgeyBwcm9jZXNzLmNhbGwodGhpcyk7IH1cblxuXHRyZXR1cm4gdGhpcy50YXJnZXQ7XG59O1xuO2Z1bmN0aW9uIGludmFsaWRPcHQoYSkge1xuXHRyZXR1cm4gYSA9PT0gTlVMTCB8fCAkLnR5cGUoYSkgIT09ICdvYmplY3QnO1xufVxuXG5mdW5jdGlvbiBpbnZhbGlkQ29udGVudChjKSB7XG5cdHJldHVybiAhKCQuaXNGdW5jdGlvbihjKSB8fCBcbiAgICAgICAgICAgIGMgJiYgYy5hdHRyIHx8IFxuICAgICAgICAgICAgYy5sZW5ndGggfHwgXG4gICAgICAgICAgICAkLnR5cGUoYykgPT09ICdvYmplY3QnICYmIChjLmpxdWVyeSB8fCBjLnRoZW4pKTtcbn1cblxuLy8gT3B0aW9uIG9iamVjdCBzYW5pdGl6ZXJcbmZ1bmN0aW9uIHNhbml0aXplT3B0aW9ucyhvcHRzKSB7XG5cdHZhciBjb250ZW50LCB0ZXh0LCBhamF4LCBvbmNlO1xuXG5cdGlmKGludmFsaWRPcHQob3B0cykpIHsgcmV0dXJuIEZBTFNFOyB9XG5cblx0aWYoaW52YWxpZE9wdChvcHRzLm1ldGFkYXRhKSkge1xuXHRcdG9wdHMubWV0YWRhdGEgPSB7IHR5cGU6IG9wdHMubWV0YWRhdGEgfTtcblx0fVxuXG5cdGlmKCdjb250ZW50JyBpbiBvcHRzKSB7XG5cdFx0Y29udGVudCA9IG9wdHMuY29udGVudDtcblxuXHRcdGlmKGludmFsaWRPcHQoY29udGVudCkgfHwgY29udGVudC5qcXVlcnkgfHwgY29udGVudC5kb25lKSB7XG5cdFx0XHR0ZXh0ID0gaW52YWxpZENvbnRlbnQoY29udGVudCkgPyBGQUxTRSA6IGNvbnRlbnQ7XG5cdFx0XHRjb250ZW50ID0gb3B0cy5jb250ZW50ID0ge1xuXHRcdFx0XHR0ZXh0OiB0ZXh0XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRlbHNlIHsgdGV4dCA9IGNvbnRlbnQudGV4dDsgfVxuXG5cdFx0Ly8gREVQUkVDQVRFRCAtIE9sZCBjb250ZW50LmFqYXggcGx1Z2luIGZ1bmN0aW9uYWxpdHlcblx0XHQvLyBDb252ZXJ0cyBpdCBpbnRvIHRoZSBwcm9wZXIgRGVmZXJyZWQgc3ludGF4XG5cdFx0aWYoJ2FqYXgnIGluIGNvbnRlbnQpIHtcblx0XHRcdGFqYXggPSBjb250ZW50LmFqYXg7XG5cdFx0XHRvbmNlID0gYWpheCAmJiBhamF4Lm9uY2UgIT09IEZBTFNFO1xuXHRcdFx0ZGVsZXRlIGNvbnRlbnQuYWpheDtcblxuXHRcdFx0Y29udGVudC50ZXh0ID0gZnVuY3Rpb24oZXZlbnQsIGFwaSkge1xuXHRcdFx0XHR2YXIgbG9hZGluZyA9IHRleHQgfHwgJCh0aGlzKS5hdHRyKGFwaS5vcHRpb25zLmNvbnRlbnQuYXR0cikgfHwgJ0xvYWRpbmcuLi4nLFxuXG5cdFx0XHRcdGRlZmVycmVkID0gJC5hamF4KFxuXHRcdFx0XHRcdCQuZXh0ZW5kKHt9LCBhamF4LCB7IGNvbnRleHQ6IGFwaSB9KVxuXHRcdFx0XHQpXG5cdFx0XHRcdC50aGVuKGFqYXguc3VjY2VzcywgTlVMTCwgYWpheC5lcnJvcilcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24obmV3Q29udGVudCkge1xuXHRcdFx0XHRcdGlmKG5ld0NvbnRlbnQgJiYgb25jZSkgeyBhcGkuc2V0KCdjb250ZW50LnRleHQnLCBuZXdDb250ZW50KTsgfVxuXHRcdFx0XHRcdHJldHVybiBuZXdDb250ZW50O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcblx0XHRcdFx0XHRpZihhcGkuZGVzdHJveWVkIHx8IHhoci5zdGF0dXMgPT09IDApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdFx0YXBpLnNldCgnY29udGVudC50ZXh0Jywgc3RhdHVzICsgJzogJyArIGVycm9yKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuICFvbmNlID8gKGFwaS5zZXQoJ2NvbnRlbnQudGV4dCcsIGxvYWRpbmcpLCBkZWZlcnJlZCkgOiBsb2FkaW5nO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZigndGl0bGUnIGluIGNvbnRlbnQpIHtcblx0XHRcdGlmKCQuaXNQbGFpbk9iamVjdChjb250ZW50LnRpdGxlKSkge1xuXHRcdFx0XHRjb250ZW50LmJ1dHRvbiA9IGNvbnRlbnQudGl0bGUuYnV0dG9uO1xuXHRcdFx0XHRjb250ZW50LnRpdGxlID0gY29udGVudC50aXRsZS50ZXh0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZihpbnZhbGlkQ29udGVudChjb250ZW50LnRpdGxlIHx8IEZBTFNFKSkge1xuXHRcdFx0XHRjb250ZW50LnRpdGxlID0gRkFMU0U7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYoJ3Bvc2l0aW9uJyBpbiBvcHRzICYmIGludmFsaWRPcHQob3B0cy5wb3NpdGlvbikpIHtcblx0XHRvcHRzLnBvc2l0aW9uID0geyBteTogb3B0cy5wb3NpdGlvbiwgYXQ6IG9wdHMucG9zaXRpb24gfTtcblx0fVxuXG5cdGlmKCdzaG93JyBpbiBvcHRzICYmIGludmFsaWRPcHQob3B0cy5zaG93KSkge1xuXHRcdG9wdHMuc2hvdyA9IG9wdHMuc2hvdy5qcXVlcnkgPyB7IHRhcmdldDogb3B0cy5zaG93IH0gOlxuXHRcdFx0b3B0cy5zaG93ID09PSBUUlVFID8geyByZWFkeTogVFJVRSB9IDogeyBldmVudDogb3B0cy5zaG93IH07XG5cdH1cblxuXHRpZignaGlkZScgaW4gb3B0cyAmJiBpbnZhbGlkT3B0KG9wdHMuaGlkZSkpIHtcblx0XHRvcHRzLmhpZGUgPSBvcHRzLmhpZGUuanF1ZXJ5ID8geyB0YXJnZXQ6IG9wdHMuaGlkZSB9IDogeyBldmVudDogb3B0cy5oaWRlIH07XG5cdH1cblxuXHRpZignc3R5bGUnIGluIG9wdHMgJiYgaW52YWxpZE9wdChvcHRzLnN0eWxlKSkge1xuXHRcdG9wdHMuc3R5bGUgPSB7IGNsYXNzZXM6IG9wdHMuc3R5bGUgfTtcblx0fVxuXG5cdC8vIFNhbml0aXplIHBsdWdpbiBvcHRpb25zXG5cdCQuZWFjaChQTFVHSU5TLCBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNhbml0aXplICYmIHRoaXMuc2FuaXRpemUob3B0cyk7XG5cdH0pO1xuXG5cdHJldHVybiBvcHRzO1xufVxuXG4vLyBTZXR1cCBidWlsdGluIC5zZXQoKSBvcHRpb24gY2hlY2tzXG5DSEVDS1MgPSBQUk9UT1RZUEUuY2hlY2tzID0ge1xuXHRidWlsdGluOiB7XG5cdFx0Ly8gQ29yZSBjaGVja3Ncblx0XHQnXmlkJCc6IGZ1bmN0aW9uKG9iaiwgbywgdiwgcHJldikge1xuXHRcdFx0dmFyIGlkID0gdiA9PT0gVFJVRSA/IFFUSVAubmV4dGlkIDogdixcblx0XHRcdFx0bmV3SWQgPSBOQU1FU1BBQ0UgKyAnLScgKyBpZDtcblxuXHRcdFx0aWYoaWQgIT09IEZBTFNFICYmIGlkLmxlbmd0aCA+IDAgJiYgISQoJyMnK25ld0lkKS5sZW5ndGgpIHtcblx0XHRcdFx0dGhpcy5faWQgPSBuZXdJZDtcblxuXHRcdFx0XHRpZih0aGlzLnJlbmRlcmVkKSB7XG5cdFx0XHRcdFx0dGhpcy50b29sdGlwWzBdLmlkID0gdGhpcy5faWQ7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50cy5jb250ZW50WzBdLmlkID0gdGhpcy5faWQgKyAnLWNvbnRlbnQnO1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudHMudGl0bGVbMF0uaWQgPSB0aGlzLl9pZCArICctdGl0bGUnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgb2JqW29dID0gcHJldjsgfVxuXHRcdH0sXG5cdFx0J15wcmVyZW5kZXInOiBmdW5jdGlvbihvYmosIG8sIHYpIHtcblx0XHRcdHYgJiYgIXRoaXMucmVuZGVyZWQgJiYgdGhpcy5yZW5kZXIodGhpcy5vcHRpb25zLnNob3cucmVhZHkpO1xuXHRcdH0sXG5cblx0XHQvLyBDb250ZW50IGNoZWNrc1xuXHRcdCdeY29udGVudC50ZXh0JCc6IGZ1bmN0aW9uKG9iaiwgbywgdikge1xuXHRcdFx0dGhpcy5fdXBkYXRlQ29udGVudCh2KTtcblx0XHR9LFxuXHRcdCdeY29udGVudC5hdHRyJCc6IGZ1bmN0aW9uKG9iaiwgbywgdiwgcHJldikge1xuXHRcdFx0aWYodGhpcy5vcHRpb25zLmNvbnRlbnQudGV4dCA9PT0gdGhpcy50YXJnZXQuYXR0cihwcmV2KSkge1xuXHRcdFx0XHR0aGlzLl91cGRhdGVDb250ZW50KCB0aGlzLnRhcmdldC5hdHRyKHYpICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQnXmNvbnRlbnQudGl0bGUkJzogZnVuY3Rpb24ob2JqLCBvLCB2KSB7XG5cdFx0XHQvLyBSZW1vdmUgdGl0bGUgaWYgY29udGVudCBpcyBudWxsXG5cdFx0XHRpZighdikgeyByZXR1cm4gdGhpcy5fcmVtb3ZlVGl0bGUoKTsgfVxuXG5cdFx0XHQvLyBJZiB0aXRsZSBpc24ndCBhbHJlYWR5IGNyZWF0ZWQsIGNyZWF0ZSBpdCBub3cgYW5kIHVwZGF0ZVxuXHRcdFx0diAmJiAhdGhpcy5lbGVtZW50cy50aXRsZSAmJiB0aGlzLl9jcmVhdGVUaXRsZSgpO1xuXHRcdFx0dGhpcy5fdXBkYXRlVGl0bGUodik7XG5cdFx0fSxcblx0XHQnXmNvbnRlbnQuYnV0dG9uJCc6IGZ1bmN0aW9uKG9iaiwgbywgdikge1xuXHRcdFx0dGhpcy5fdXBkYXRlQnV0dG9uKHYpO1xuXHRcdH0sXG5cdFx0J15jb250ZW50LnRpdGxlLih0ZXh0fGJ1dHRvbikkJzogZnVuY3Rpb24ob2JqLCBvLCB2KSB7XG5cdFx0XHR0aGlzLnNldCgnY29udGVudC4nK28sIHYpOyAvLyBCYWNrd2FyZHMgdGl0bGUudGV4dC9idXR0b24gY29tcGF0XG5cdFx0fSxcblxuXHRcdC8vIFBvc2l0aW9uIGNoZWNrc1xuXHRcdCdecG9zaXRpb24uKG15fGF0KSQnOiBmdW5jdGlvbihvYmosIG8sIHYpe1xuXHRcdFx0aWYoJ3N0cmluZycgPT09IHR5cGVvZiB2KSB7XG5cdFx0XHRcdHRoaXMucG9zaXRpb25bb10gPSBvYmpbb10gPSBuZXcgQ09STkVSKHYsIG8gPT09ICdhdCcpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0J15wb3NpdGlvbi5jb250YWluZXIkJzogZnVuY3Rpb24ob2JqLCBvLCB2KXtcblx0XHRcdHRoaXMucmVuZGVyZWQgJiYgdGhpcy50b29sdGlwLmFwcGVuZFRvKHYpO1xuXHRcdH0sXG5cblx0XHQvLyBTaG93IGNoZWNrc1xuXHRcdCdec2hvdy5yZWFkeSQnOiBmdW5jdGlvbihvYmosIG8sIHYpIHtcblx0XHRcdHYgJiYgKCF0aGlzLnJlbmRlcmVkICYmIHRoaXMucmVuZGVyKFRSVUUpIHx8IHRoaXMudG9nZ2xlKFRSVUUpKTtcblx0XHR9LFxuXG5cdFx0Ly8gU3R5bGUgY2hlY2tzXG5cdFx0J15zdHlsZS5jbGFzc2VzJCc6IGZ1bmN0aW9uKG9iaiwgbywgdiwgcCkge1xuXHRcdFx0dGhpcy5yZW5kZXJlZCAmJiB0aGlzLnRvb2x0aXAucmVtb3ZlQ2xhc3MocCkuYWRkQ2xhc3Modik7XG5cdFx0fSxcblx0XHQnXnN0eWxlLih3aWR0aHxoZWlnaHQpJzogZnVuY3Rpb24ob2JqLCBvLCB2KSB7XG5cdFx0XHR0aGlzLnJlbmRlcmVkICYmIHRoaXMudG9vbHRpcC5jc3Mobywgdik7XG5cdFx0fSxcblx0XHQnXnN0eWxlLndpZGdldHxjb250ZW50LnRpdGxlJzogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnJlbmRlcmVkICYmIHRoaXMuX3NldFdpZGdldCgpO1xuXHRcdH0sXG5cdFx0J15zdHlsZS5kZWYnOiBmdW5jdGlvbihvYmosIG8sIHYpIHtcblx0XHRcdHRoaXMucmVuZGVyZWQgJiYgdGhpcy50b29sdGlwLnRvZ2dsZUNsYXNzKENMQVNTX0RFRkFVTFQsICEhdik7XG5cdFx0fSxcblxuXHRcdC8vIEV2ZW50cyBjaGVja1xuXHRcdCdeZXZlbnRzLihyZW5kZXJ8c2hvd3xtb3ZlfGhpZGV8Zm9jdXN8Ymx1cikkJzogZnVuY3Rpb24ob2JqLCBvLCB2KSB7XG5cdFx0XHR0aGlzLnJlbmRlcmVkICYmIHRoaXMudG9vbHRpcFsoJC5pc0Z1bmN0aW9uKHYpID8gJycgOiAndW4nKSArICdiaW5kJ10oJ3Rvb2x0aXAnK28sIHYpO1xuXHRcdH0sXG5cblx0XHQvLyBQcm9wZXJ0aWVzIHdoaWNoIHJlcXVpcmUgZXZlbnQgcmVhc3NpZ25tZW50XG5cdFx0J14oc2hvd3xoaWRlfHBvc2l0aW9uKS4oZXZlbnR8dGFyZ2V0fGZpeGVkfGluYWN0aXZlfGxlYXZlfGRpc3RhbmNlfHZpZXdwb3J0fGFkanVzdCknOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKCF0aGlzLnJlbmRlcmVkKSB7IHJldHVybjsgfVxuXG5cdFx0XHQvLyBTZXQgdHJhY2tpbmcgZmxhZ1xuXHRcdFx0dmFyIHBvc09wdGlvbnMgPSB0aGlzLm9wdGlvbnMucG9zaXRpb247XG5cdFx0XHR0aGlzLnRvb2x0aXAuYXR0cigndHJhY2tpbmcnLCBwb3NPcHRpb25zLnRhcmdldCA9PT0gJ21vdXNlJyAmJiBwb3NPcHRpb25zLmFkanVzdC5tb3VzZSk7XG5cblx0XHRcdC8vIFJlYXNzaWduIGV2ZW50c1xuXHRcdFx0dGhpcy5fdW5hc3NpZ25FdmVudHMoKTtcblx0XHRcdHRoaXMuX2Fzc2lnbkV2ZW50cygpO1xuXHRcdH1cblx0fVxufTtcblxuLy8gRG90IG5vdGF0aW9uIGNvbnZlcnRlclxuZnVuY3Rpb24gY29udmVydE5vdGF0aW9uKG9wdGlvbnMsIG5vdGF0aW9uKSB7XG5cdHZhciBpID0gMCwgb2JqLCBvcHRpb24gPSBvcHRpb25zLFxuXG5cdC8vIFNwbGl0IG5vdGF0aW9uIGludG8gYXJyYXlcblx0bGV2ZWxzID0gbm90YXRpb24uc3BsaXQoJy4nKTtcblxuXHQvLyBMb29wIHRocm91Z2hcblx0d2hpbGUob3B0aW9uID0gb3B0aW9uWyBsZXZlbHNbaSsrXSBdKSB7XG5cdFx0aWYoaSA8IGxldmVscy5sZW5ndGgpIHsgb2JqID0gb3B0aW9uOyB9XG5cdH1cblxuXHRyZXR1cm4gW29iaiB8fCBvcHRpb25zLCBsZXZlbHMucG9wKCldO1xufVxuXG5QUk9UT1RZUEUuZ2V0ID0gZnVuY3Rpb24obm90YXRpb24pIHtcblx0aWYodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIHRoaXM7IH1cblxuXHR2YXIgbyA9IGNvbnZlcnROb3RhdGlvbih0aGlzLm9wdGlvbnMsIG5vdGF0aW9uLnRvTG93ZXJDYXNlKCkpLFxuXHRcdHJlc3VsdCA9IG9bMF1bIG9bMV0gXTtcblxuXHRyZXR1cm4gcmVzdWx0LnByZWNlZGFuY2UgPyByZXN1bHQuc3RyaW5nKCkgOiByZXN1bHQ7XG59O1xuXG5mdW5jdGlvbiBzZXRDYWxsYmFjayhub3RhdGlvbiwgYXJncykge1xuXHR2YXIgY2F0ZWdvcnksIHJ1bGUsIG1hdGNoO1xuXG5cdGZvcihjYXRlZ29yeSBpbiB0aGlzLmNoZWNrcykge1xuXHRcdGlmICghdGhpcy5jaGVja3MuaGFzT3duUHJvcGVydHkoY2F0ZWdvcnkpKSB7IGNvbnRpbnVlOyB9XG5cblx0XHRmb3IocnVsZSBpbiB0aGlzLmNoZWNrc1tjYXRlZ29yeV0pIHtcblx0XHRcdGlmICghdGhpcy5jaGVja3NbY2F0ZWdvcnldLmhhc093blByb3BlcnR5KHJ1bGUpKSB7IGNvbnRpbnVlOyB9XG5cblx0XHRcdGlmKG1hdGNoID0gKG5ldyBSZWdFeHAocnVsZSwgJ2knKSkuZXhlYyhub3RhdGlvbikpIHtcblx0XHRcdFx0YXJncy5wdXNoKG1hdGNoKTtcblxuXHRcdFx0XHRpZihjYXRlZ29yeSA9PT0gJ2J1aWx0aW4nIHx8IHRoaXMucGx1Z2luc1tjYXRlZ29yeV0pIHtcblx0XHRcdFx0XHR0aGlzLmNoZWNrc1tjYXRlZ29yeV1bcnVsZV0uYXBwbHkoXG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbnNbY2F0ZWdvcnldIHx8IHRoaXMsIGFyZ3Ncblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbnZhciBybW92ZSA9IC9ecG9zaXRpb25cXC4obXl8YXR8YWRqdXN0fHRhcmdldHxjb250YWluZXJ8dmlld3BvcnQpfHN0eWxlfGNvbnRlbnR8c2hvd1xcLnJlYWR5L2ksXG5cdHJyZW5kZXIgPSAvXnByZXJlbmRlcnxzaG93XFwucmVhZHkvaTtcblxuUFJPVE9UWVBFLnNldCA9IGZ1bmN0aW9uKG9wdGlvbiwgdmFsdWUpIHtcblx0aWYodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIHRoaXM7IH1cblxuXHR2YXIgcmVuZGVyZWQgPSB0aGlzLnJlbmRlcmVkLFxuXHRcdHJlcG9zaXRpb24gPSBGQUxTRSxcblx0XHRvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuXHRcdG5hbWU7XG5cblx0Ly8gQ29udmVydCBzaW5ndWxhciBvcHRpb24vdmFsdWUgcGFpciBpbnRvIG9iamVjdCBmb3JtXG5cdGlmKCdzdHJpbmcnID09PSB0eXBlb2Ygb3B0aW9uKSB7XG5cdFx0bmFtZSA9IG9wdGlvbjsgb3B0aW9uID0ge307IG9wdGlvbltuYW1lXSA9IHZhbHVlO1xuXHR9XG5cdGVsc2UgeyBvcHRpb24gPSAkLmV4dGVuZCh7fSwgb3B0aW9uKTsgfVxuXG5cdC8vIFNldCBhbGwgb2YgdGhlIGRlZmluZWQgb3B0aW9ucyB0byB0aGVpciBuZXcgdmFsdWVzXG5cdCQuZWFjaChvcHRpb24sIGZ1bmN0aW9uKG5vdGF0aW9uLCB2YWwpIHtcblx0XHRpZihyZW5kZXJlZCAmJiBycmVuZGVyLnRlc3Qobm90YXRpb24pKSB7XG5cdFx0XHRkZWxldGUgb3B0aW9uW25vdGF0aW9uXTsgcmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFNldCBuZXcgb2JqIHZhbHVlXG5cdFx0dmFyIG9iaiA9IGNvbnZlcnROb3RhdGlvbihvcHRpb25zLCBub3RhdGlvbi50b0xvd2VyQ2FzZSgpKSwgcHJldmlvdXM7XG5cdFx0cHJldmlvdXMgPSBvYmpbMF1bIG9ialsxXSBdO1xuXHRcdG9ialswXVsgb2JqWzFdIF0gPSB2YWwgJiYgdmFsLm5vZGVUeXBlID8gJCh2YWwpIDogdmFsO1xuXG5cdFx0Ly8gQWxzbyBjaGVjayBpZiB3ZSBuZWVkIHRvIHJlcG9zaXRpb25cblx0XHRyZXBvc2l0aW9uID0gcm1vdmUudGVzdChub3RhdGlvbikgfHwgcmVwb3NpdGlvbjtcblxuXHRcdC8vIFNldCB0aGUgbmV3IHBhcmFtcyBmb3IgdGhlIGNhbGxiYWNrXG5cdFx0b3B0aW9uW25vdGF0aW9uXSA9IFtvYmpbMF0sIG9ialsxXSwgdmFsLCBwcmV2aW91c107XG5cdH0pO1xuXG5cdC8vIFJlLXNhbml0aXplIG9wdGlvbnNcblx0c2FuaXRpemVPcHRpb25zKG9wdGlvbnMpO1xuXG5cdC8qXG5cdCAqIEV4ZWN1dGUgYW55IHZhbGlkIGNhbGxiYWNrcyBmb3IgdGhlIHNldCBvcHRpb25zXG5cdCAqIEFsc28gc2V0IHBvc2l0aW9uaW5nIGZsYWcgc28gd2UgZG9uJ3QgZ2V0IGxvYWRzIG9mIHJlZHVuZGFudCByZXBvc2l0aW9uaW5nIGNhbGxzLlxuXHQgKi9cblx0dGhpcy5wb3NpdGlvbmluZyA9IFRSVUU7XG5cdCQuZWFjaChvcHRpb24sICQucHJveHkoc2V0Q2FsbGJhY2ssIHRoaXMpKTtcblx0dGhpcy5wb3NpdGlvbmluZyA9IEZBTFNFO1xuXG5cdC8vIFVwZGF0ZSBwb3NpdGlvbiBpZiBuZWVkZWRcblx0aWYodGhpcy5yZW5kZXJlZCAmJiB0aGlzLnRvb2x0aXBbMF0ub2Zmc2V0V2lkdGggPiAwICYmIHJlcG9zaXRpb24pIHtcblx0XHR0aGlzLnJlcG9zaXRpb24oIG9wdGlvbnMucG9zaXRpb24udGFyZ2V0ID09PSAnbW91c2UnID8gTlVMTCA6IHRoaXMuY2FjaGUuZXZlbnQgKTtcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcbjtQUk9UT1RZUEUuX3VwZGF0ZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGVsZW1lbnQpIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdGNhY2hlID0gdGhpcy5jYWNoZTtcblxuXHQvLyBNYWtlIHN1cmUgdG9vbHRpcCBpcyByZW5kZXJlZCBhbmQgY29udGVudCBpcyBkZWZpbmVkLiBJZiBub3QgcmV0dXJuXG5cdGlmKCF0aGlzLnJlbmRlcmVkIHx8ICFjb250ZW50KSB7IHJldHVybiBGQUxTRTsgfVxuXG5cdC8vIFVzZSBmdW5jdGlvbiB0byBwYXJzZSBjb250ZW50XG5cdGlmKCQuaXNGdW5jdGlvbihjb250ZW50KSkge1xuXHRcdGNvbnRlbnQgPSBjb250ZW50LmNhbGwodGhpcy5lbGVtZW50cy50YXJnZXQsIGNhY2hlLmV2ZW50LCB0aGlzKSB8fCAnJztcblx0fVxuXG5cdC8vIEhhbmRsZSBkZWZlcnJlZCBjb250ZW50XG5cdGlmKCQuaXNGdW5jdGlvbihjb250ZW50LnRoZW4pKSB7XG5cdFx0Y2FjaGUud2FpdGluZyA9IFRSVUU7XG5cdFx0cmV0dXJuIGNvbnRlbnQudGhlbihmdW5jdGlvbihjKSB7XG5cdFx0XHRjYWNoZS53YWl0aW5nID0gRkFMU0U7XG5cdFx0XHRyZXR1cm4gc2VsZi5fdXBkYXRlKGMsIGVsZW1lbnQpO1xuXHRcdH0sIE5VTEwsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdHJldHVybiBzZWxmLl91cGRhdGUoZSwgZWxlbWVudCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBJZiBjb250ZW50IGlzIG51bGwuLi4gcmV0dXJuIGZhbHNlXG5cdGlmKGNvbnRlbnQgPT09IEZBTFNFIHx8ICFjb250ZW50ICYmIGNvbnRlbnQgIT09ICcnKSB7IHJldHVybiBGQUxTRTsgfVxuXG5cdC8vIEFwcGVuZCBuZXcgY29udGVudCBpZiBpdHMgYSBET00gYXJyYXkgYW5kIHNob3cgaXQgaWYgaGlkZGVuXG5cdGlmKGNvbnRlbnQuanF1ZXJ5ICYmIGNvbnRlbnQubGVuZ3RoID4gMCkge1xuXHRcdGVsZW1lbnQuZW1wdHkoKS5hcHBlbmQoXG5cdFx0XHRjb250ZW50LmNzcyh7IGRpc3BsYXk6ICdibG9jaycsIHZpc2liaWxpdHk6ICd2aXNpYmxlJyB9KVxuXHRcdCk7XG5cdH1cblxuXHQvLyBDb250ZW50IGlzIGEgcmVndWxhciBzdHJpbmcsIGluc2VydCB0aGUgbmV3IGNvbnRlbnRcblx0ZWxzZSB7IGVsZW1lbnQuaHRtbChjb250ZW50KTsgfVxuXG5cdC8vIFdhaXQgZm9yIGNvbnRlbnQgdG8gYmUgbG9hZGVkLCBhbmQgcmVwb3NpdGlvblxuXHRyZXR1cm4gdGhpcy5fd2FpdEZvckNvbnRlbnQoZWxlbWVudCkudGhlbihmdW5jdGlvbihpbWFnZXMpIHtcblx0XHRpZihzZWxmLnJlbmRlcmVkICYmIHNlbGYudG9vbHRpcFswXS5vZmZzZXRXaWR0aCA+IDApIHtcblx0XHRcdHNlbGYucmVwb3NpdGlvbihjYWNoZS5ldmVudCwgIWltYWdlcy5sZW5ndGgpO1xuXHRcdH1cblx0fSk7XG59O1xuXG5QUk9UT1RZUEUuX3dhaXRGb3JDb250ZW50ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuXHR2YXIgY2FjaGUgPSB0aGlzLmNhY2hlO1xuXG5cdC8vIFNldCBmbGFnXG5cdGNhY2hlLndhaXRpbmcgPSBUUlVFO1xuXG5cdC8vIElmIGltYWdlc0xvYWRlZCBpcyBpbmNsdWRlZCwgZW5zdXJlIGltYWdlcyBoYXZlIGxvYWRlZCBhbmQgcmV0dXJuIHByb21pc2Vcblx0cmV0dXJuICggJC5mbi5pbWFnZXNMb2FkZWQgPyBlbGVtZW50LmltYWdlc0xvYWRlZCgpIDogbmV3ICQuRGVmZXJyZWQoKS5yZXNvbHZlKFtdKSApXG5cdFx0LmRvbmUoZnVuY3Rpb24oKSB7IGNhY2hlLndhaXRpbmcgPSBGQUxTRTsgfSlcblx0XHQucHJvbWlzZSgpO1xufTtcblxuUFJPVE9UWVBFLl91cGRhdGVDb250ZW50ID0gZnVuY3Rpb24oY29udGVudCwgcmVwb3NpdGlvbikge1xuXHR0aGlzLl91cGRhdGUoY29udGVudCwgdGhpcy5lbGVtZW50cy5jb250ZW50LCByZXBvc2l0aW9uKTtcbn07XG5cblBST1RPVFlQRS5fdXBkYXRlVGl0bGUgPSBmdW5jdGlvbihjb250ZW50LCByZXBvc2l0aW9uKSB7XG5cdGlmKHRoaXMuX3VwZGF0ZShjb250ZW50LCB0aGlzLmVsZW1lbnRzLnRpdGxlLCByZXBvc2l0aW9uKSA9PT0gRkFMU0UpIHtcblx0XHR0aGlzLl9yZW1vdmVUaXRsZShGQUxTRSk7XG5cdH1cbn07XG5cblBST1RPVFlQRS5fY3JlYXRlVGl0bGUgPSBmdW5jdGlvbigpXG57XG5cdHZhciBlbGVtZW50cyA9IHRoaXMuZWxlbWVudHMsXG5cdFx0aWQgPSB0aGlzLl9pZCsnLXRpdGxlJztcblxuXHQvLyBEZXN0cm95IHByZXZpb3VzIHRpdGxlIGVsZW1lbnQsIGlmIHByZXNlbnRcblx0aWYoZWxlbWVudHMudGl0bGViYXIpIHsgdGhpcy5fcmVtb3ZlVGl0bGUoKTsgfVxuXG5cdC8vIENyZWF0ZSB0aXRsZSBiYXIgYW5kIHRpdGxlIGVsZW1lbnRzXG5cdGVsZW1lbnRzLnRpdGxlYmFyID0gJCgnPGRpdiAvPicsIHtcblx0XHQnY2xhc3MnOiBOQU1FU1BBQ0UgKyAnLXRpdGxlYmFyICcgKyAodGhpcy5vcHRpb25zLnN0eWxlLndpZGdldCA/IGNyZWF0ZVdpZGdldENsYXNzKCdoZWFkZXInKSA6ICcnKVxuXHR9KVxuXHQuYXBwZW5kKFxuXHRcdGVsZW1lbnRzLnRpdGxlID0gJCgnPGRpdiAvPicsIHtcblx0XHRcdCdpZCc6IGlkLFxuXHRcdFx0J2NsYXNzJzogTkFNRVNQQUNFICsgJy10aXRsZScsXG5cdFx0XHQnYXJpYS1hdG9taWMnOiBUUlVFXG5cdFx0fSlcblx0KVxuXHQuaW5zZXJ0QmVmb3JlKGVsZW1lbnRzLmNvbnRlbnQpXG5cblx0Ly8gQnV0dG9uLXNwZWNpZmljIGV2ZW50c1xuXHQuZGVsZWdhdGUoJy5xdGlwLWNsb3NlJywgJ21vdXNlZG93biBrZXlkb3duIG1vdXNldXAga2V5dXAgbW91c2VvdXQnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ3VpLXN0YXRlLWFjdGl2ZSB1aS1zdGF0ZS1mb2N1cycsIGV2ZW50LnR5cGUuc3Vic3RyKC00KSA9PT0gJ2Rvd24nKTtcblx0fSlcblx0LmRlbGVnYXRlKCcucXRpcC1jbG9zZScsICdtb3VzZW92ZXIgbW91c2VvdXQnLCBmdW5jdGlvbihldmVudCl7XG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygndWktc3RhdGUtaG92ZXInLCBldmVudC50eXBlID09PSAnbW91c2VvdmVyJyk7XG5cdH0pO1xuXG5cdC8vIENyZWF0ZSBidXR0b24gaWYgZW5hYmxlZFxuXHRpZih0aGlzLm9wdGlvbnMuY29udGVudC5idXR0b24pIHsgdGhpcy5fY3JlYXRlQnV0dG9uKCk7IH1cbn07XG5cblBST1RPVFlQRS5fcmVtb3ZlVGl0bGUgPSBmdW5jdGlvbihyZXBvc2l0aW9uKVxue1xuXHR2YXIgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuXG5cdGlmKGVsZW1lbnRzLnRpdGxlKSB7XG5cdFx0ZWxlbWVudHMudGl0bGViYXIucmVtb3ZlKCk7XG5cdFx0ZWxlbWVudHMudGl0bGViYXIgPSBlbGVtZW50cy50aXRsZSA9IGVsZW1lbnRzLmJ1dHRvbiA9IE5VTEw7XG5cblx0XHQvLyBSZXBvc2l0aW9uIGlmIGVuYWJsZWRcblx0XHRpZihyZXBvc2l0aW9uICE9PSBGQUxTRSkgeyB0aGlzLnJlcG9zaXRpb24oKTsgfVxuXHR9XG59O1xuO1BST1RPVFlQRS5fY3JlYXRlUG9zQ2xhc3MgPSBmdW5jdGlvbihteSkge1xuXHRyZXR1cm4gTkFNRVNQQUNFICsgJy1wb3MtJyArIChteSB8fCB0aGlzLm9wdGlvbnMucG9zaXRpb24ubXkpLmFiYnJldigpO1xufTtcblxuUFJPVE9UWVBFLnJlcG9zaXRpb24gPSBmdW5jdGlvbihldmVudCwgZWZmZWN0KSB7XG5cdGlmKCF0aGlzLnJlbmRlcmVkIHx8IHRoaXMucG9zaXRpb25pbmcgfHwgdGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIHRoaXM7IH1cblxuXHQvLyBTZXQgcG9zaXRpb25pbmcgZmxhZ1xuXHR0aGlzLnBvc2l0aW9uaW5nID0gVFJVRTtcblxuXHR2YXIgY2FjaGUgPSB0aGlzLmNhY2hlLFxuXHRcdHRvb2x0aXAgPSB0aGlzLnRvb2x0aXAsXG5cdFx0cG9zT3B0aW9ucyA9IHRoaXMub3B0aW9ucy5wb3NpdGlvbixcblx0XHR0YXJnZXQgPSBwb3NPcHRpb25zLnRhcmdldCxcblx0XHRteSA9IHBvc09wdGlvbnMubXksXG5cdFx0YXQgPSBwb3NPcHRpb25zLmF0LFxuXHRcdHZpZXdwb3J0ID0gcG9zT3B0aW9ucy52aWV3cG9ydCxcblx0XHRjb250YWluZXIgPSBwb3NPcHRpb25zLmNvbnRhaW5lcixcblx0XHRhZGp1c3QgPSBwb3NPcHRpb25zLmFkanVzdCxcblx0XHRtZXRob2QgPSBhZGp1c3QubWV0aG9kLnNwbGl0KCcgJyksXG5cdFx0dG9vbHRpcFdpZHRoID0gdG9vbHRpcC5vdXRlcldpZHRoKEZBTFNFKSxcblx0XHR0b29sdGlwSGVpZ2h0ID0gdG9vbHRpcC5vdXRlckhlaWdodChGQUxTRSksXG5cdFx0dGFyZ2V0V2lkdGggPSAwLFxuXHRcdHRhcmdldEhlaWdodCA9IDAsXG5cdFx0dHlwZSA9IHRvb2x0aXAuY3NzKCdwb3NpdGlvbicpLFxuXHRcdHBvc2l0aW9uID0geyBsZWZ0OiAwLCB0b3A6IDAgfSxcblx0XHR2aXNpYmxlID0gdG9vbHRpcFswXS5vZmZzZXRXaWR0aCA+IDAsXG5cdFx0aXNTY3JvbGwgPSBldmVudCAmJiBldmVudC50eXBlID09PSAnc2Nyb2xsJyxcblx0XHR3aW4gPSAkKHdpbmRvdyksXG5cdFx0ZG9jID0gY29udGFpbmVyWzBdLm93bmVyRG9jdW1lbnQsXG5cdFx0bW91c2UgPSB0aGlzLm1vdXNlLFxuXHRcdHBsdWdpbkNhbGN1bGF0aW9ucywgb2Zmc2V0LCBhZGp1c3RlZCwgbmV3Q2xhc3M7XG5cblx0Ly8gQ2hlY2sgaWYgYWJzb2x1dGUgcG9zaXRpb24gd2FzIHBhc3NlZFxuXHRpZigkLmlzQXJyYXkodGFyZ2V0KSAmJiB0YXJnZXQubGVuZ3RoID09PSAyKSB7XG5cdFx0Ly8gRm9yY2UgbGVmdCB0b3AgYW5kIHNldCBwb3NpdGlvblxuXHRcdGF0ID0geyB4OiBMRUZULCB5OiBUT1AgfTtcblx0XHRwb3NpdGlvbiA9IHsgbGVmdDogdGFyZ2V0WzBdLCB0b3A6IHRhcmdldFsxXSB9O1xuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgbW91c2Ugd2FzIHRoZSB0YXJnZXRcblx0ZWxzZSBpZih0YXJnZXQgPT09ICdtb3VzZScpIHtcblx0XHQvLyBGb3JjZSBsZWZ0IHRvcCB0byBhbGxvdyBmbGlwcGluZ1xuXHRcdGF0ID0geyB4OiBMRUZULCB5OiBUT1AgfTtcblxuXHRcdC8vIFVzZSB0aGUgbW91c2Ugb3JpZ2luIHRoYXQgY2F1c2VkIHRoZSBzaG93IGV2ZW50LCBpZiBkaXN0YW5jZSBoaWRpbmcgaXMgZW5hYmxlZFxuXHRcdGlmKCghYWRqdXN0Lm1vdXNlIHx8IHRoaXMub3B0aW9ucy5oaWRlLmRpc3RhbmNlKSAmJiBjYWNoZS5vcmlnaW4gJiYgY2FjaGUub3JpZ2luLnBhZ2VYKSB7XG5cdFx0XHRldmVudCA9ICBjYWNoZS5vcmlnaW47XG5cdFx0fVxuXG5cdFx0Ly8gVXNlIGNhY2hlZCBldmVudCBmb3IgcmVzaXplL3Njcm9sbCBldmVudHNcblx0XHRlbHNlIGlmKCFldmVudCB8fCBldmVudCAmJiAoZXZlbnQudHlwZSA9PT0gJ3Jlc2l6ZScgfHwgZXZlbnQudHlwZSA9PT0gJ3Njcm9sbCcpKSB7XG5cdFx0XHRldmVudCA9IGNhY2hlLmV2ZW50O1xuXHRcdH1cblxuXHRcdC8vIE90aGVyd2lzZSwgdXNlIHRoZSBjYWNoZWQgbW91c2UgY29vcmRpbmF0ZXMgaWYgYXZhaWxhYmxlXG5cdFx0ZWxzZSBpZihtb3VzZSAmJiBtb3VzZS5wYWdlWCkge1xuXHRcdFx0ZXZlbnQgPSBtb3VzZTtcblx0XHR9XG5cblx0XHQvLyBDYWxjdWxhdGUgYm9keSBhbmQgY29udGFpbmVyIG9mZnNldCBhbmQgdGFrZSB0aGVtIGludG8gYWNjb3VudCBiZWxvd1xuXHRcdGlmKHR5cGUgIT09ICdzdGF0aWMnKSB7IHBvc2l0aW9uID0gY29udGFpbmVyLm9mZnNldCgpOyB9XG5cdFx0aWYoZG9jLmJvZHkub2Zmc2V0V2lkdGggIT09ICh3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSkge1xuXHRcdFx0b2Zmc2V0ID0gJChkb2N1bWVudC5ib2R5KS5vZmZzZXQoKTtcblx0XHR9XG5cblx0XHQvLyBVc2UgZXZlbnQgY29vcmRpbmF0ZXMgZm9yIHBvc2l0aW9uXG5cdFx0cG9zaXRpb24gPSB7XG5cdFx0XHRsZWZ0OiBldmVudC5wYWdlWCAtIHBvc2l0aW9uLmxlZnQgKyAob2Zmc2V0ICYmIG9mZnNldC5sZWZ0IHx8IDApLFxuXHRcdFx0dG9wOiBldmVudC5wYWdlWSAtIHBvc2l0aW9uLnRvcCArIChvZmZzZXQgJiYgb2Zmc2V0LnRvcCB8fCAwKVxuXHRcdH07XG5cblx0XHQvLyBTY3JvbGwgZXZlbnRzIGFyZSBhIHBhaW4sIHNvbWUgYnJvd3NlcnNcblx0XHRpZihhZGp1c3QubW91c2UgJiYgaXNTY3JvbGwgJiYgbW91c2UpIHtcblx0XHRcdHBvc2l0aW9uLmxlZnQgLT0gKG1vdXNlLnNjcm9sbFggfHwgMCkgLSB3aW4uc2Nyb2xsTGVmdCgpO1xuXHRcdFx0cG9zaXRpb24udG9wIC09IChtb3VzZS5zY3JvbGxZIHx8IDApIC0gd2luLnNjcm9sbFRvcCgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRhcmdldCB3YXNuJ3QgbW91c2Ugb3IgYWJzb2x1dGUuLi5cblx0ZWxzZSB7XG5cdFx0Ly8gQ2hlY2sgaWYgZXZlbnQgdGFyZ2V0dGluZyBpcyBiZWluZyB1c2VkXG5cdFx0aWYodGFyZ2V0ID09PSAnZXZlbnQnKSB7XG5cdFx0XHRpZihldmVudCAmJiBldmVudC50YXJnZXQgJiYgZXZlbnQudHlwZSAhPT0gJ3Njcm9sbCcgJiYgZXZlbnQudHlwZSAhPT0gJ3Jlc2l6ZScpIHtcblx0XHRcdFx0Y2FjaGUudGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZighZXZlbnQudGFyZ2V0KSB7XG5cdFx0XHRcdGNhY2hlLnRhcmdldCA9IHRoaXMuZWxlbWVudHMudGFyZ2V0O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmKHRhcmdldCAhPT0gJ2V2ZW50Jyl7XG5cdFx0XHRjYWNoZS50YXJnZXQgPSAkKHRhcmdldC5qcXVlcnkgPyB0YXJnZXQgOiB0aGlzLmVsZW1lbnRzLnRhcmdldCk7XG5cdFx0fVxuXHRcdHRhcmdldCA9IGNhY2hlLnRhcmdldDtcblxuXHRcdC8vIFBhcnNlIHRoZSB0YXJnZXQgaW50byBhIGpRdWVyeSBvYmplY3QgYW5kIG1ha2Ugc3VyZSB0aGVyZSdzIGFuIGVsZW1lbnQgcHJlc2VudFxuXHRcdHRhcmdldCA9ICQodGFyZ2V0KS5lcSgwKTtcblx0XHRpZih0YXJnZXQubGVuZ3RoID09PSAwKSB7IHJldHVybiB0aGlzOyB9XG5cblx0XHQvLyBDaGVjayBpZiB3aW5kb3cgb3IgZG9jdW1lbnQgaXMgdGhlIHRhcmdldFxuXHRcdGVsc2UgaWYodGFyZ2V0WzBdID09PSBkb2N1bWVudCB8fCB0YXJnZXRbMF0gPT09IHdpbmRvdykge1xuXHRcdFx0dGFyZ2V0V2lkdGggPSBCUk9XU0VSLmlPUyA/IHdpbmRvdy5pbm5lcldpZHRoIDogdGFyZ2V0LndpZHRoKCk7XG5cdFx0XHR0YXJnZXRIZWlnaHQgPSBCUk9XU0VSLmlPUyA/IHdpbmRvdy5pbm5lckhlaWdodCA6IHRhcmdldC5oZWlnaHQoKTtcblxuXHRcdFx0aWYodGFyZ2V0WzBdID09PSB3aW5kb3cpIHtcblx0XHRcdFx0cG9zaXRpb24gPSB7XG5cdFx0XHRcdFx0dG9wOiAodmlld3BvcnQgfHwgdGFyZ2V0KS5zY3JvbGxUb3AoKSxcblx0XHRcdFx0XHRsZWZ0OiAodmlld3BvcnQgfHwgdGFyZ2V0KS5zY3JvbGxMZWZ0KClcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiB0aGUgdGFyZ2V0IGlzIGFuIDxBUkVBPiBlbGVtZW50XG5cdFx0ZWxzZSBpZihQTFVHSU5TLmltYWdlbWFwICYmIHRhcmdldC5pcygnYXJlYScpKSB7XG5cdFx0XHRwbHVnaW5DYWxjdWxhdGlvbnMgPSBQTFVHSU5TLmltYWdlbWFwKHRoaXMsIHRhcmdldCwgYXQsIFBMVUdJTlMudmlld3BvcnQgPyBtZXRob2QgOiBGQUxTRSk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHRhcmdldCBpcyBhbiBTVkcgZWxlbWVudFxuXHRcdGVsc2UgaWYoUExVR0lOUy5zdmcgJiYgdGFyZ2V0ICYmIHRhcmdldFswXS5vd25lclNWR0VsZW1lbnQpIHtcblx0XHRcdHBsdWdpbkNhbGN1bGF0aW9ucyA9IFBMVUdJTlMuc3ZnKHRoaXMsIHRhcmdldCwgYXQsIFBMVUdJTlMudmlld3BvcnQgPyBtZXRob2QgOiBGQUxTRSk7XG5cdFx0fVxuXG5cdFx0Ly8gT3RoZXJ3aXNlIHVzZSByZWd1bGFyIGpRdWVyeSBtZXRob2RzXG5cdFx0ZWxzZSB7XG5cdFx0XHR0YXJnZXRXaWR0aCA9IHRhcmdldC5vdXRlcldpZHRoKEZBTFNFKTtcblx0XHRcdHRhcmdldEhlaWdodCA9IHRhcmdldC5vdXRlckhlaWdodChGQUxTRSk7XG5cdFx0XHRwb3NpdGlvbiA9IHRhcmdldC5vZmZzZXQoKTtcblx0XHR9XG5cblx0XHQvLyBQYXJzZSByZXR1cm5lZCBwbHVnaW4gdmFsdWVzIGludG8gcHJvcGVyIHZhcmlhYmxlc1xuXHRcdGlmKHBsdWdpbkNhbGN1bGF0aW9ucykge1xuXHRcdFx0dGFyZ2V0V2lkdGggPSBwbHVnaW5DYWxjdWxhdGlvbnMud2lkdGg7XG5cdFx0XHR0YXJnZXRIZWlnaHQgPSBwbHVnaW5DYWxjdWxhdGlvbnMuaGVpZ2h0O1xuXHRcdFx0b2Zmc2V0ID0gcGx1Z2luQ2FsY3VsYXRpb25zLm9mZnNldDtcblx0XHRcdHBvc2l0aW9uID0gcGx1Z2luQ2FsY3VsYXRpb25zLnBvc2l0aW9uO1xuXHRcdH1cblxuXHRcdC8vIEFkanVzdCBwb3NpdGlvbiB0byB0YWtlIGludG8gYWNjb3VudCBvZmZzZXQgcGFyZW50c1xuXHRcdHBvc2l0aW9uID0gdGhpcy5yZXBvc2l0aW9uLm9mZnNldCh0YXJnZXQsIHBvc2l0aW9uLCBjb250YWluZXIpO1xuXG5cdFx0Ly8gQWRqdXN0IGZvciBwb3NpdGlvbi5maXhlZCB0b29sdGlwcyAoYW5kIGFsc28gaU9TIHNjcm9sbCBidWcgaW4gdjMuMi00LjAgJiB2NC4zLTQuMy4yKVxuXHRcdGlmKEJST1dTRVIuaU9TID4gMy4xICYmIEJST1dTRVIuaU9TIDwgNC4xIHx8XG5cdFx0XHRCUk9XU0VSLmlPUyA+PSA0LjMgJiYgQlJPV1NFUi5pT1MgPCA0LjMzIHx8XG5cdFx0XHQhQlJPV1NFUi5pT1MgJiYgdHlwZSA9PT0gJ2ZpeGVkJ1xuXHRcdCl7XG5cdFx0XHRwb3NpdGlvbi5sZWZ0IC09IHdpbi5zY3JvbGxMZWZ0KCk7XG5cdFx0XHRwb3NpdGlvbi50b3AgLT0gd2luLnNjcm9sbFRvcCgpO1xuXHRcdH1cblxuXHRcdC8vIEFkanVzdCBwb3NpdGlvbiByZWxhdGl2ZSB0byB0YXJnZXRcblx0XHRpZighcGx1Z2luQ2FsY3VsYXRpb25zIHx8IHBsdWdpbkNhbGN1bGF0aW9ucyAmJiBwbHVnaW5DYWxjdWxhdGlvbnMuYWRqdXN0YWJsZSAhPT0gRkFMU0UpIHtcblx0XHRcdHBvc2l0aW9uLmxlZnQgKz0gYXQueCA9PT0gUklHSFQgPyB0YXJnZXRXaWR0aCA6IGF0LnggPT09IENFTlRFUiA/IHRhcmdldFdpZHRoIC8gMiA6IDA7XG5cdFx0XHRwb3NpdGlvbi50b3AgKz0gYXQueSA9PT0gQk9UVE9NID8gdGFyZ2V0SGVpZ2h0IDogYXQueSA9PT0gQ0VOVEVSID8gdGFyZ2V0SGVpZ2h0IC8gMiA6IDA7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQWRqdXN0IHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRvb2x0aXBcblx0cG9zaXRpb24ubGVmdCArPSBhZGp1c3QueCArIChteS54ID09PSBSSUdIVCA/IC10b29sdGlwV2lkdGggOiBteS54ID09PSBDRU5URVIgPyAtdG9vbHRpcFdpZHRoIC8gMiA6IDApO1xuXHRwb3NpdGlvbi50b3AgKz0gYWRqdXN0LnkgKyAobXkueSA9PT0gQk9UVE9NID8gLXRvb2x0aXBIZWlnaHQgOiBteS55ID09PSBDRU5URVIgPyAtdG9vbHRpcEhlaWdodCAvIDIgOiAwKTtcblxuXHQvLyBVc2Ugdmlld3BvcnQgYWRqdXN0bWVudCBwbHVnaW4gaWYgZW5hYmxlZFxuXHRpZihQTFVHSU5TLnZpZXdwb3J0KSB7XG5cdFx0YWRqdXN0ZWQgPSBwb3NpdGlvbi5hZGp1c3RlZCA9IFBMVUdJTlMudmlld3BvcnQoXG5cdFx0XHR0aGlzLCBwb3NpdGlvbiwgcG9zT3B0aW9ucywgdGFyZ2V0V2lkdGgsIHRhcmdldEhlaWdodCwgdG9vbHRpcFdpZHRoLCB0b29sdGlwSGVpZ2h0XG5cdFx0KTtcblxuXHRcdC8vIEFwcGx5IG9mZnNldHMgc3VwcGxpZWQgYnkgcG9zaXRpb25pbmcgcGx1Z2luIChpZiB1c2VkKVxuXHRcdGlmKG9mZnNldCAmJiBhZGp1c3RlZC5sZWZ0KSB7IHBvc2l0aW9uLmxlZnQgKz0gb2Zmc2V0LmxlZnQ7IH1cblx0XHRpZihvZmZzZXQgJiYgYWRqdXN0ZWQudG9wKSB7ICBwb3NpdGlvbi50b3AgKz0gb2Zmc2V0LnRvcDsgfVxuXG5cdFx0Ly8gQXBwbHkgYW55IG5ldyAnbXknIHBvc2l0aW9uXG5cdFx0aWYoYWRqdXN0ZWQubXkpIHsgdGhpcy5wb3NpdGlvbi5teSA9IGFkanVzdGVkLm15OyB9XG5cdH1cblxuXHQvLyBWaWV3cG9ydCBhZGp1c3RtZW50IGlzIGRpc2FibGVkLCBzZXQgdmFsdWVzIHRvIHplcm9cblx0ZWxzZSB7IHBvc2l0aW9uLmFkanVzdGVkID0geyBsZWZ0OiAwLCB0b3A6IDAgfTsgfVxuXG5cdC8vIFNldCB0b29sdGlwIHBvc2l0aW9uIGNsYXNzIGlmIGl0J3MgY2hhbmdlZFxuXHRpZihjYWNoZS5wb3NDbGFzcyAhPT0gKG5ld0NsYXNzID0gdGhpcy5fY3JlYXRlUG9zQ2xhc3ModGhpcy5wb3NpdGlvbi5teSkpKSB7XG5cdFx0Y2FjaGUucG9zQ2xhc3MgPSBuZXdDbGFzcztcblx0XHR0b29sdGlwLnJlbW92ZUNsYXNzKGNhY2hlLnBvc0NsYXNzKS5hZGRDbGFzcyhuZXdDbGFzcyk7XG5cdH1cblxuXHQvLyB0b29sdGlwbW92ZSBldmVudFxuXHRpZighdGhpcy5fdHJpZ2dlcignbW92ZScsIFtwb3NpdGlvbiwgdmlld3BvcnQuZWxlbSB8fCB2aWV3cG9ydF0sIGV2ZW50KSkgeyByZXR1cm4gdGhpczsgfVxuXHRkZWxldGUgcG9zaXRpb24uYWRqdXN0ZWQ7XG5cblx0Ly8gSWYgZWZmZWN0IGlzIGRpc2FibGVkLCB0YXJnZXQgaXQgbW91c2UsIG5vIGFuaW1hdGlvbiBpcyBkZWZpbmVkIG9yIHBvc2l0aW9uaW5nIGdpdmVzIE5hTiBvdXQsIHNldCBDU1MgZGlyZWN0bHlcblx0aWYoZWZmZWN0ID09PSBGQUxTRSB8fCAhdmlzaWJsZSB8fCBpc05hTihwb3NpdGlvbi5sZWZ0KSB8fCBpc05hTihwb3NpdGlvbi50b3ApIHx8IHRhcmdldCA9PT0gJ21vdXNlJyB8fCAhJC5pc0Z1bmN0aW9uKHBvc09wdGlvbnMuZWZmZWN0KSkge1xuXHRcdHRvb2x0aXAuY3NzKHBvc2l0aW9uKTtcblx0fVxuXG5cdC8vIFVzZSBjdXN0b20gZnVuY3Rpb24gaWYgcHJvdmlkZWRcblx0ZWxzZSBpZigkLmlzRnVuY3Rpb24ocG9zT3B0aW9ucy5lZmZlY3QpKSB7XG5cdFx0cG9zT3B0aW9ucy5lZmZlY3QuY2FsbCh0b29sdGlwLCB0aGlzLCAkLmV4dGVuZCh7fSwgcG9zaXRpb24pKTtcblx0XHR0b29sdGlwLnF1ZXVlKGZ1bmN0aW9uKG5leHQpIHtcblx0XHRcdC8vIFJlc2V0IGF0dHJpYnV0ZXMgdG8gYXZvaWQgY3Jvc3MtYnJvd3NlciByZW5kZXJpbmcgYnVnc1xuXHRcdFx0JCh0aGlzKS5jc3MoeyBvcGFjaXR5OiAnJywgaGVpZ2h0OiAnJyB9KTtcblx0XHRcdGlmKEJST1dTRVIuaWUpIHsgdGhpcy5zdHlsZS5yZW1vdmVBdHRyaWJ1dGUoJ2ZpbHRlcicpOyB9XG5cblx0XHRcdG5leHQoKTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIFNldCBwb3NpdGlvbmluZyBmbGFnXG5cdHRoaXMucG9zaXRpb25pbmcgPSBGQUxTRTtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8vIEN1c3RvbSAobW9yZSBjb3JyZWN0IGZvciBxVGlwISkgb2Zmc2V0IGNhbGN1bGF0b3JcblBST1RPVFlQRS5yZXBvc2l0aW9uLm9mZnNldCA9IGZ1bmN0aW9uKGVsZW0sIHBvcywgY29udGFpbmVyKSB7XG5cdGlmKCFjb250YWluZXJbMF0pIHsgcmV0dXJuIHBvczsgfVxuXG5cdHZhciBvd25lckRvY3VtZW50ID0gJChlbGVtWzBdLm93bmVyRG9jdW1lbnQpLFxuXHRcdHF1aXJrcyA9ICEhQlJPV1NFUi5pZSAmJiBkb2N1bWVudC5jb21wYXRNb2RlICE9PSAnQ1NTMUNvbXBhdCcsXG5cdFx0cGFyZW50ID0gY29udGFpbmVyWzBdLFxuXHRcdHNjcm9sbGVkLCBwb3NpdGlvbiwgcGFyZW50T2Zmc2V0LCBvdmVyZmxvdztcblxuXHRmdW5jdGlvbiBzY3JvbGwoZSwgaSkge1xuXHRcdHBvcy5sZWZ0ICs9IGkgKiBlLnNjcm9sbExlZnQoKTtcblx0XHRwb3MudG9wICs9IGkgKiBlLnNjcm9sbFRvcCgpO1xuXHR9XG5cblx0Ly8gQ29tcGVuc2F0ZSBmb3Igbm9uLXN0YXRpYyBjb250YWluZXJzIG9mZnNldFxuXHRkbyB7XG5cdFx0aWYoKHBvc2l0aW9uID0gJC5jc3MocGFyZW50LCAncG9zaXRpb24nKSkgIT09ICdzdGF0aWMnKSB7XG5cdFx0XHRpZihwb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuXHRcdFx0XHRwYXJlbnRPZmZzZXQgPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdHNjcm9sbChvd25lckRvY3VtZW50LCAtMSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cGFyZW50T2Zmc2V0ID0gJChwYXJlbnQpLnBvc2l0aW9uKCk7XG5cdFx0XHRcdHBhcmVudE9mZnNldC5sZWZ0ICs9IHBhcnNlRmxvYXQoJC5jc3MocGFyZW50LCAnYm9yZGVyTGVmdFdpZHRoJykpIHx8IDA7XG5cdFx0XHRcdHBhcmVudE9mZnNldC50b3AgKz0gcGFyc2VGbG9hdCgkLmNzcyhwYXJlbnQsICdib3JkZXJUb3BXaWR0aCcpKSB8fCAwO1xuXHRcdFx0fVxuXG5cdFx0XHRwb3MubGVmdCAtPSBwYXJlbnRPZmZzZXQubGVmdCArIChwYXJzZUZsb2F0KCQuY3NzKHBhcmVudCwgJ21hcmdpbkxlZnQnKSkgfHwgMCk7XG5cdFx0XHRwb3MudG9wIC09IHBhcmVudE9mZnNldC50b3AgKyAocGFyc2VGbG9hdCgkLmNzcyhwYXJlbnQsICdtYXJnaW5Ub3AnKSkgfHwgMCk7XG5cblx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IHBhcmVudCBlbGVtZW50IHdpdGggYW4gb3ZlcmZsb3cgb2YgXCJzY3JvbGxcIiBvciBcImF1dG9cIiwgc3RvcmUgaXRcblx0XHRcdGlmKCFzY3JvbGxlZCAmJiAob3ZlcmZsb3cgPSAkLmNzcyhwYXJlbnQsICdvdmVyZmxvdycpKSAhPT0gJ2hpZGRlbicgJiYgb3ZlcmZsb3cgIT09ICd2aXNpYmxlJykgeyBzY3JvbGxlZCA9ICQocGFyZW50KTsgfVxuXHRcdH1cblx0fVxuXHR3aGlsZShwYXJlbnQgPSBwYXJlbnQub2Zmc2V0UGFyZW50KTtcblxuXHQvLyBDb21wZW5zYXRlIGZvciBjb250YWluZXJzIHNjcm9sbCBpZiBpdCBhbHNvIGhhcyBhbiBvZmZzZXRQYXJlbnQgKG9yIGluIElFIHF1aXJrcyBtb2RlKVxuXHRpZihzY3JvbGxlZCAmJiAoc2Nyb2xsZWRbMF0gIT09IG93bmVyRG9jdW1lbnRbMF0gfHwgcXVpcmtzKSkge1xuXHRcdHNjcm9sbChzY3JvbGxlZCwgMSk7XG5cdH1cblxuXHRyZXR1cm4gcG9zO1xufTtcblxuLy8gQ29ybmVyIGNsYXNzXG52YXIgQyA9IChDT1JORVIgPSBQUk9UT1RZUEUucmVwb3NpdGlvbi5Db3JuZXIgPSBmdW5jdGlvbihjb3JuZXIsIGZvcmNlWSkge1xuXHRjb3JuZXIgPSAoJycgKyBjb3JuZXIpLnJlcGxhY2UoLyhbQS1aXSkvLCAnICQxJykucmVwbGFjZSgvbWlkZGxlL2dpLCBDRU5URVIpLnRvTG93ZXJDYXNlKCk7XG5cdHRoaXMueCA9IChjb3JuZXIubWF0Y2goL2xlZnR8cmlnaHQvaSkgfHwgY29ybmVyLm1hdGNoKC9jZW50ZXIvKSB8fCBbJ2luaGVyaXQnXSlbMF0udG9Mb3dlckNhc2UoKTtcblx0dGhpcy55ID0gKGNvcm5lci5tYXRjaCgvdG9wfGJvdHRvbXxjZW50ZXIvaSkgfHwgWydpbmhlcml0J10pWzBdLnRvTG93ZXJDYXNlKCk7XG5cdHRoaXMuZm9yY2VZID0gISFmb3JjZVk7XG5cblx0dmFyIGYgPSBjb3JuZXIuY2hhckF0KDApO1xuXHR0aGlzLnByZWNlZGFuY2UgPSBmID09PSAndCcgfHwgZiA9PT0gJ2InID8gWSA6IFg7XG59KS5wcm90b3R5cGU7XG5cbkMuaW52ZXJ0ID0gZnVuY3Rpb24oeiwgY2VudGVyKSB7XG5cdHRoaXNbel0gPSB0aGlzW3pdID09PSBMRUZUID8gUklHSFQgOiB0aGlzW3pdID09PSBSSUdIVCA/IExFRlQgOiBjZW50ZXIgfHwgdGhpc1t6XTtcbn07XG5cbkMuc3RyaW5nID0gZnVuY3Rpb24oam9pbikge1xuXHR2YXIgeCA9IHRoaXMueCwgeSA9IHRoaXMueTtcblxuXHR2YXIgcmVzdWx0ID0geCAhPT0geSA/XG5cdFx0eCA9PT0gJ2NlbnRlcicgfHwgeSAhPT0gJ2NlbnRlcicgJiYgKHRoaXMucHJlY2VkYW5jZSA9PT0gWSB8fCB0aGlzLmZvcmNlWSkgPyBcblx0XHRcdFt5LHhdIDogXG5cdFx0XHRbeCx5XSA6XG5cdFx0W3hdO1xuXG5cdHJldHVybiBqb2luICE9PSBmYWxzZSA/IHJlc3VsdC5qb2luKCcgJykgOiByZXN1bHQ7XG59O1xuXG5DLmFiYnJldiA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVzdWx0ID0gdGhpcy5zdHJpbmcoZmFsc2UpO1xuXHRyZXR1cm4gcmVzdWx0WzBdLmNoYXJBdCgwKSArIChyZXN1bHRbMV0gJiYgcmVzdWx0WzFdLmNoYXJBdCgwKSB8fCAnJyk7XG59O1xuXG5DLmNsb25lID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZXcgQ09STkVSKCB0aGlzLnN0cmluZygpLCB0aGlzLmZvcmNlWSApO1xufTtcblxuO1xuUFJPVE9UWVBFLnRvZ2dsZSA9IGZ1bmN0aW9uKHN0YXRlLCBldmVudCkge1xuXHR2YXIgY2FjaGUgPSB0aGlzLmNhY2hlLFxuXHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG5cdFx0dG9vbHRpcCA9IHRoaXMudG9vbHRpcDtcblxuXHQvLyBUcnkgdG8gcHJldmVudCBmbGlja2VyaW5nIHdoZW4gdG9vbHRpcCBvdmVybGFwcyBzaG93IGVsZW1lbnRcblx0aWYoZXZlbnQpIHtcblx0XHRpZigoL292ZXJ8ZW50ZXIvKS50ZXN0KGV2ZW50LnR5cGUpICYmIGNhY2hlLmV2ZW50ICYmICgvb3V0fGxlYXZlLykudGVzdChjYWNoZS5ldmVudC50eXBlKSAmJlxuXHRcdFx0b3B0aW9ucy5zaG93LnRhcmdldC5hZGQoZXZlbnQudGFyZ2V0KS5sZW5ndGggPT09IG9wdGlvbnMuc2hvdy50YXJnZXQubGVuZ3RoICYmXG5cdFx0XHR0b29sdGlwLmhhcyhldmVudC5yZWxhdGVkVGFyZ2V0KS5sZW5ndGgpIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdC8vIENhY2hlIGV2ZW50XG5cdFx0Y2FjaGUuZXZlbnQgPSAkLmV2ZW50LmZpeChldmVudCk7XG5cdH1cblxuXHQvLyBJZiB3ZSdyZSBjdXJyZW50bHkgd2FpdGluZyBhbmQgd2UndmUganVzdCBoaWRkZW4uLi4gc3RvcCBpdFxuXHR0aGlzLndhaXRpbmcgJiYgIXN0YXRlICYmICh0aGlzLmhpZGRlbkR1cmluZ1dhaXQgPSBUUlVFKTtcblxuXHQvLyBSZW5kZXIgdGhlIHRvb2x0aXAgaWYgc2hvd2luZyBhbmQgaXQgaXNuJ3QgYWxyZWFkeVxuXHRpZighdGhpcy5yZW5kZXJlZCkgeyByZXR1cm4gc3RhdGUgPyB0aGlzLnJlbmRlcigxKSA6IHRoaXM7IH1cblx0ZWxzZSBpZih0aGlzLmRlc3Ryb3llZCB8fCB0aGlzLmRpc2FibGVkKSB7IHJldHVybiB0aGlzOyB9XG5cblx0dmFyIHR5cGUgPSBzdGF0ZSA/ICdzaG93JyA6ICdoaWRlJyxcblx0XHRvcHRzID0gdGhpcy5vcHRpb25zW3R5cGVdLFxuXHRcdHBvc09wdGlvbnMgPSB0aGlzLm9wdGlvbnMucG9zaXRpb24sXG5cdFx0Y29udGVudE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMuY29udGVudCxcblx0XHR3aWR0aCA9IHRoaXMudG9vbHRpcC5jc3MoJ3dpZHRoJyksXG5cdFx0dmlzaWJsZSA9IHRoaXMudG9vbHRpcC5pcygnOnZpc2libGUnKSxcblx0XHRhbmltYXRlID0gc3RhdGUgfHwgb3B0cy50YXJnZXQubGVuZ3RoID09PSAxLFxuXHRcdHNhbWVUYXJnZXQgPSAhZXZlbnQgfHwgb3B0cy50YXJnZXQubGVuZ3RoIDwgMiB8fCBjYWNoZS50YXJnZXRbMF0gPT09IGV2ZW50LnRhcmdldCxcblx0XHRpZGVudGljYWxTdGF0ZSwgYWxsb3csIGFmdGVyO1xuXG5cdC8vIERldGVjdCBzdGF0ZSBpZiB2YWxpZCBvbmUgaXNuJ3QgcHJvdmlkZWRcblx0aWYoKHR5cGVvZiBzdGF0ZSkuc2VhcmNoKCdib29sZWFufG51bWJlcicpKSB7IHN0YXRlID0gIXZpc2libGU7IH1cblxuXHQvLyBDaGVjayBpZiB0aGUgdG9vbHRpcCBpcyBpbiBhbiBpZGVudGljYWwgc3RhdGUgdG8gdGhlIG5ldyB3b3VsZC1iZSBzdGF0ZVxuXHRpZGVudGljYWxTdGF0ZSA9ICF0b29sdGlwLmlzKCc6YW5pbWF0ZWQnKSAmJiB2aXNpYmxlID09PSBzdGF0ZSAmJiBzYW1lVGFyZ2V0O1xuXG5cdC8vIEZpcmUgdG9vbHRpcChzaG93L2hpZGUpIGV2ZW50IGFuZCBjaGVjayBpZiBkZXN0cm95ZWRcblx0YWxsb3cgPSAhaWRlbnRpY2FsU3RhdGUgPyAhIXRoaXMuX3RyaWdnZXIodHlwZSwgWzkwXSkgOiBOVUxMO1xuXG5cdC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgdG9vbHRpcCB3YXNuJ3QgZGVzdHJveWVkIGluIHRoZSBjYWxsYmFja1xuXHRpZih0aGlzLmRlc3Ryb3llZCkgeyByZXR1cm4gdGhpczsgfVxuXG5cdC8vIElmIHRoZSB1c2VyIGRpZG4ndCBzdG9wIHRoZSBtZXRob2QgcHJlbWF0dXJlbHkgYW5kIHdlJ3JlIHNob3dpbmcgdGhlIHRvb2x0aXAsIGZvY3VzIGl0XG5cdGlmKGFsbG93ICE9PSBGQUxTRSAmJiBzdGF0ZSkgeyB0aGlzLmZvY3VzKGV2ZW50KTsgfVxuXG5cdC8vIElmIHRoZSBzdGF0ZSBoYXNuJ3QgY2hhbmdlZCBvciB0aGUgdXNlciBzdG9wcGVkIGl0LCByZXR1cm4gZWFybHlcblx0aWYoIWFsbG93IHx8IGlkZW50aWNhbFN0YXRlKSB7IHJldHVybiB0aGlzOyB9XG5cblx0Ly8gU2V0IEFSSUEgaGlkZGVuIGF0dHJpYnV0ZVxuXHQkLmF0dHIodG9vbHRpcFswXSwgJ2FyaWEtaGlkZGVuJywgISEhc3RhdGUpO1xuXG5cdC8vIEV4ZWN1dGUgc3RhdGUgc3BlY2lmaWMgcHJvcGVydGllc1xuXHRpZihzdGF0ZSkge1xuXHRcdC8vIFN0b3JlIHNob3cgb3JpZ2luIGNvb3JkaW5hdGVzXG5cdFx0dGhpcy5tb3VzZSAmJiAoY2FjaGUub3JpZ2luID0gJC5ldmVudC5maXgodGhpcy5tb3VzZSkpO1xuXG5cdFx0Ly8gVXBkYXRlIHRvb2x0aXAgY29udGVudCAmIHRpdGxlIGlmIGl0J3MgYSBkeW5hbWljIGZ1bmN0aW9uXG5cdFx0aWYoJC5pc0Z1bmN0aW9uKGNvbnRlbnRPcHRpb25zLnRleHQpKSB7IHRoaXMuX3VwZGF0ZUNvbnRlbnQoY29udGVudE9wdGlvbnMudGV4dCwgRkFMU0UpOyB9XG5cdFx0aWYoJC5pc0Z1bmN0aW9uKGNvbnRlbnRPcHRpb25zLnRpdGxlKSkgeyB0aGlzLl91cGRhdGVUaXRsZShjb250ZW50T3B0aW9ucy50aXRsZSwgRkFMU0UpOyB9XG5cblx0XHQvLyBDYWNoZSBtb3VzZW1vdmUgZXZlbnRzIGZvciBwb3NpdGlvbmluZyBwdXJwb3NlcyAoaWYgbm90IGFscmVhZHkgdHJhY2tpbmcpXG5cdFx0aWYoIXRyYWNraW5nQm91bmQgJiYgcG9zT3B0aW9ucy50YXJnZXQgPT09ICdtb3VzZScgJiYgcG9zT3B0aW9ucy5hZGp1c3QubW91c2UpIHtcblx0XHRcdCQoZG9jdW1lbnQpLmJpbmQoJ21vdXNlbW92ZS4nK05BTUVTUEFDRSwgdGhpcy5fc3RvcmVNb3VzZSk7XG5cdFx0XHR0cmFja2luZ0JvdW5kID0gVFJVRTtcblx0XHR9XG5cblx0XHQvLyBVcGRhdGUgdGhlIHRvb2x0aXAgcG9zaXRpb24gKHNldCB3aWR0aCBmaXJzdCB0byBwcmV2ZW50IHZpZXdwb3J0L21heC13aWR0aCBpc3N1ZXMpXG5cdFx0aWYoIXdpZHRoKSB7IHRvb2x0aXAuY3NzKCd3aWR0aCcsIHRvb2x0aXAub3V0ZXJXaWR0aChGQUxTRSkpOyB9XG5cdFx0dGhpcy5yZXBvc2l0aW9uKGV2ZW50LCBhcmd1bWVudHNbMl0pO1xuXHRcdGlmKCF3aWR0aCkgeyB0b29sdGlwLmNzcygnd2lkdGgnLCAnJyk7IH1cblxuXHRcdC8vIEhpZGUgb3RoZXIgdG9vbHRpcHMgaWYgdG9vbHRpcCBpcyBzb2xvXG5cdFx0aWYoISFvcHRzLnNvbG8pIHtcblx0XHRcdCh0eXBlb2Ygb3B0cy5zb2xvID09PSAnc3RyaW5nJyA/ICQob3B0cy5zb2xvKSA6ICQoU0VMRUNUT1IsIG9wdHMuc29sbykpXG5cdFx0XHRcdC5ub3QodG9vbHRpcCkubm90KG9wdHMudGFyZ2V0KS5xdGlwKCdoaWRlJywgbmV3ICQuRXZlbnQoJ3Rvb2x0aXBzb2xvJykpO1xuXHRcdH1cblx0fVxuXHRlbHNlIHtcblx0XHQvLyBDbGVhciBzaG93IHRpbWVyIGlmIHdlJ3JlIGhpZGluZ1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVycy5zaG93KTtcblxuXHRcdC8vIFJlbW92ZSBjYWNoZWQgb3JpZ2luIG9uIGhpZGVcblx0XHRkZWxldGUgY2FjaGUub3JpZ2luO1xuXG5cdFx0Ly8gUmVtb3ZlIG1vdXNlIHRyYWNraW5nIGV2ZW50IGlmIG5vdCBuZWVkZWQgKGFsbCB0cmFja2luZyBxVGlwcyBhcmUgaGlkZGVuKVxuXHRcdGlmKHRyYWNraW5nQm91bmQgJiYgISQoU0VMRUNUT1IrJ1t0cmFja2luZz1cInRydWVcIl06dmlzaWJsZScsIG9wdHMuc29sbykubm90KHRvb2x0aXApLmxlbmd0aCkge1xuXHRcdFx0JChkb2N1bWVudCkudW5iaW5kKCdtb3VzZW1vdmUuJytOQU1FU1BBQ0UpO1xuXHRcdFx0dHJhY2tpbmdCb3VuZCA9IEZBTFNFO1xuXHRcdH1cblxuXHRcdC8vIEJsdXIgdGhlIHRvb2x0aXBcblx0XHR0aGlzLmJsdXIoZXZlbnQpO1xuXHR9XG5cblx0Ly8gRGVmaW5lIHBvc3QtYW5pbWF0aW9uLCBzdGF0ZSBzcGVjaWZpYyBwcm9wZXJ0aWVzXG5cdGFmdGVyID0gJC5wcm94eShmdW5jdGlvbigpIHtcblx0XHRpZihzdGF0ZSkge1xuXHRcdFx0Ly8gUHJldmVudCBhbnRpYWxpYXMgZnJvbSBkaXNhcHBlYXJpbmcgaW4gSUUgYnkgcmVtb3ZpbmcgZmlsdGVyXG5cdFx0XHRpZihCUk9XU0VSLmllKSB7IHRvb2x0aXBbMF0uc3R5bGUucmVtb3ZlQXR0cmlidXRlKCdmaWx0ZXInKTsgfVxuXG5cdFx0XHQvLyBSZW1vdmUgb3ZlcmZsb3cgc2V0dGluZyB0byBwcmV2ZW50IHRpcCBidWdzXG5cdFx0XHR0b29sdGlwLmNzcygnb3ZlcmZsb3cnLCAnJyk7XG5cblx0XHRcdC8vIEF1dG9mb2N1cyBlbGVtZW50cyBpZiBlbmFibGVkXG5cdFx0XHRpZignc3RyaW5nJyA9PT0gdHlwZW9mIG9wdHMuYXV0b2ZvY3VzKSB7XG5cdFx0XHRcdCQodGhpcy5vcHRpb25zLnNob3cuYXV0b2ZvY3VzLCB0b29sdGlwKS5mb2N1cygpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBzZXQsIGhpZGUgdG9vbHRpcCB3aGVuIGluYWN0aXZlIGZvciBkZWxheSBwZXJpb2Rcblx0XHRcdHRoaXMub3B0aW9ucy5zaG93LnRhcmdldC50cmlnZ2VyKCdxdGlwLScrdGhpcy5pZCsnLWluYWN0aXZlJyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gUmVzZXQgQ1NTIHN0YXRlc1xuXHRcdFx0dG9vbHRpcC5jc3Moe1xuXHRcdFx0XHRkaXNwbGF5OiAnJyxcblx0XHRcdFx0dmlzaWJpbGl0eTogJycsXG5cdFx0XHRcdG9wYWNpdHk6ICcnLFxuXHRcdFx0XHRsZWZ0OiAnJyxcblx0XHRcdFx0dG9wOiAnJ1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gdG9vbHRpcHZpc2libGUvdG9vbHRpcGhpZGRlbiBldmVudHNcblx0XHR0aGlzLl90cmlnZ2VyKHN0YXRlID8gJ3Zpc2libGUnIDogJ2hpZGRlbicpO1xuXHR9LCB0aGlzKTtcblxuXHQvLyBJZiBubyBlZmZlY3QgdHlwZSBpcyBzdXBwbGllZCwgdXNlIGEgc2ltcGxlIHRvZ2dsZVxuXHRpZihvcHRzLmVmZmVjdCA9PT0gRkFMU0UgfHwgYW5pbWF0ZSA9PT0gRkFMU0UpIHtcblx0XHR0b29sdGlwWyB0eXBlIF0oKTtcblx0XHRhZnRlcigpO1xuXHR9XG5cblx0Ly8gVXNlIGN1c3RvbSBmdW5jdGlvbiBpZiBwcm92aWRlZFxuXHRlbHNlIGlmKCQuaXNGdW5jdGlvbihvcHRzLmVmZmVjdCkpIHtcblx0XHR0b29sdGlwLnN0b3AoMSwgMSk7XG5cdFx0b3B0cy5lZmZlY3QuY2FsbCh0b29sdGlwLCB0aGlzKTtcblx0XHR0b29sdGlwLnF1ZXVlKCdmeCcsIGZ1bmN0aW9uKG4pIHtcblx0XHRcdGFmdGVyKCk7IG4oKTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIFVzZSBiYXNpYyBmYWRlIGZ1bmN0aW9uIGJ5IGRlZmF1bHRcblx0ZWxzZSB7IHRvb2x0aXAuZmFkZVRvKDkwLCBzdGF0ZSA/IDEgOiAwLCBhZnRlcik7IH1cblxuXHQvLyBJZiBpbmFjdGl2ZSBoaWRlIG1ldGhvZCBpcyBzZXQsIGFjdGl2ZSBpdFxuXHRpZihzdGF0ZSkgeyBvcHRzLnRhcmdldC50cmlnZ2VyKCdxdGlwLScrdGhpcy5pZCsnLWluYWN0aXZlJyk7IH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cblBST1RPVFlQRS5zaG93ID0gZnVuY3Rpb24oZXZlbnQpIHsgcmV0dXJuIHRoaXMudG9nZ2xlKFRSVUUsIGV2ZW50KTsgfTtcblxuUFJPVE9UWVBFLmhpZGUgPSBmdW5jdGlvbihldmVudCkgeyByZXR1cm4gdGhpcy50b2dnbGUoRkFMU0UsIGV2ZW50KTsgfTtcbjtQUk9UT1RZUEUuZm9jdXMgPSBmdW5jdGlvbihldmVudCkge1xuXHRpZighdGhpcy5yZW5kZXJlZCB8fCB0aGlzLmRlc3Ryb3llZCkgeyByZXR1cm4gdGhpczsgfVxuXG5cdHZhciBxdGlwcyA9ICQoU0VMRUNUT1IpLFxuXHRcdHRvb2x0aXAgPSB0aGlzLnRvb2x0aXAsXG5cdFx0Y3VySW5kZXggPSBwYXJzZUludCh0b29sdGlwWzBdLnN0eWxlLnpJbmRleCwgMTApLFxuXHRcdG5ld0luZGV4ID0gUVRJUC56aW5kZXggKyBxdGlwcy5sZW5ndGg7XG5cblx0Ly8gT25seSB1cGRhdGUgdGhlIHotaW5kZXggaWYgaXQgaGFzIGNoYW5nZWQgYW5kIHRvb2x0aXAgaXMgbm90IGFscmVhZHkgZm9jdXNlZFxuXHRpZighdG9vbHRpcC5oYXNDbGFzcyhDTEFTU19GT0NVUykpIHtcblx0XHQvLyB0b29sdGlwZm9jdXMgZXZlbnRcblx0XHRpZih0aGlzLl90cmlnZ2VyKCdmb2N1cycsIFtuZXdJbmRleF0sIGV2ZW50KSkge1xuXHRcdFx0Ly8gT25seSB1cGRhdGUgei1pbmRleCdzIGlmIHRoZXkndmUgY2hhbmdlZFxuXHRcdFx0aWYoY3VySW5kZXggIT09IG5ld0luZGV4KSB7XG5cdFx0XHRcdC8vIFJlZHVjZSBvdXIgei1pbmRleCdzIGFuZCBrZWVwIHRoZW0gcHJvcGVybHkgb3JkZXJlZFxuXHRcdFx0XHRxdGlwcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmKHRoaXMuc3R5bGUuekluZGV4ID4gY3VySW5kZXgpIHtcblx0XHRcdFx0XHRcdHRoaXMuc3R5bGUuekluZGV4ID0gdGhpcy5zdHlsZS56SW5kZXggLSAxO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gRmlyZSBibHVyIGV2ZW50IGZvciBmb2N1c2VkIHRvb2x0aXBcblx0XHRcdFx0cXRpcHMuZmlsdGVyKCcuJyArIENMQVNTX0ZPQ1VTKS5xdGlwKCdibHVyJywgZXZlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTZXQgdGhlIG5ldyB6LWluZGV4XG5cdFx0XHR0b29sdGlwLmFkZENsYXNzKENMQVNTX0ZPQ1VTKVswXS5zdHlsZS56SW5kZXggPSBuZXdJbmRleDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cblBST1RPVFlQRS5ibHVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0aWYoIXRoaXMucmVuZGVyZWQgfHwgdGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIHRoaXM7IH1cblxuXHQvLyBTZXQgZm9jdXNlZCBzdGF0dXMgdG8gRkFMU0Vcblx0dGhpcy50b29sdGlwLnJlbW92ZUNsYXNzKENMQVNTX0ZPQ1VTKTtcblxuXHQvLyB0b29sdGlwYmx1ciBldmVudFxuXHR0aGlzLl90cmlnZ2VyKCdibHVyJywgWyB0aGlzLnRvb2x0aXAuY3NzKCd6SW5kZXgnKSBdLCBldmVudCk7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuO1BST1RPVFlQRS5kaXNhYmxlID0gZnVuY3Rpb24oc3RhdGUpIHtcblx0aWYodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIHRoaXM7IH1cblxuXHQvLyBJZiAndG9nZ2xlJyBpcyBwYXNzZWQsIHRvZ2dsZSB0aGUgY3VycmVudCBzdGF0ZVxuXHRpZihzdGF0ZSA9PT0gJ3RvZ2dsZScpIHtcblx0XHRzdGF0ZSA9ICEodGhpcy5yZW5kZXJlZCA/IHRoaXMudG9vbHRpcC5oYXNDbGFzcyhDTEFTU19ESVNBQkxFRCkgOiB0aGlzLmRpc2FibGVkKTtcblx0fVxuXG5cdC8vIERpc2FibGUgaWYgbm8gc3RhdGUgcGFzc2VkXG5cdGVsc2UgaWYoJ2Jvb2xlYW4nICE9PSB0eXBlb2Ygc3RhdGUpIHtcblx0XHRzdGF0ZSA9IFRSVUU7XG5cdH1cblxuXHRpZih0aGlzLnJlbmRlcmVkKSB7XG5cdFx0dGhpcy50b29sdGlwLnRvZ2dsZUNsYXNzKENMQVNTX0RJU0FCTEVELCBzdGF0ZSlcblx0XHRcdC5hdHRyKCdhcmlhLWRpc2FibGVkJywgc3RhdGUpO1xuXHR9XG5cblx0dGhpcy5kaXNhYmxlZCA9ICEhc3RhdGU7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5QUk9UT1RZUEUuZW5hYmxlID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmRpc2FibGUoRkFMU0UpOyB9O1xuO1BST1RPVFlQRS5fY3JlYXRlQnV0dG9uID0gZnVuY3Rpb24oKVxue1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0ZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzLFxuXHRcdHRvb2x0aXAgPSBlbGVtZW50cy50b29sdGlwLFxuXHRcdGJ1dHRvbiA9IHRoaXMub3B0aW9ucy5jb250ZW50LmJ1dHRvbixcblx0XHRpc1N0cmluZyA9IHR5cGVvZiBidXR0b24gPT09ICdzdHJpbmcnLFxuXHRcdGNsb3NlID0gaXNTdHJpbmcgPyBidXR0b24gOiAnQ2xvc2UgdG9vbHRpcCc7XG5cblx0aWYoZWxlbWVudHMuYnV0dG9uKSB7IGVsZW1lbnRzLmJ1dHRvbi5yZW1vdmUoKTsgfVxuXG5cdC8vIFVzZSBjdXN0b20gYnV0dG9uIGlmIG9uZSB3YXMgc3VwcGxpZWQgYnkgdXNlciwgZWxzZSB1c2UgZGVmYXVsdFxuXHRpZihidXR0b24uanF1ZXJ5KSB7XG5cdFx0ZWxlbWVudHMuYnV0dG9uID0gYnV0dG9uO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGVsZW1lbnRzLmJ1dHRvbiA9ICQoJzxhIC8+Jywge1xuXHRcdFx0J2NsYXNzJzogJ3F0aXAtY2xvc2UgJyArICh0aGlzLm9wdGlvbnMuc3R5bGUud2lkZ2V0ID8gJycgOiBOQU1FU1BBQ0UrJy1pY29uJyksXG5cdFx0XHQndGl0bGUnOiBjbG9zZSxcblx0XHRcdCdhcmlhLWxhYmVsJzogY2xvc2Vcblx0XHR9KVxuXHRcdC5wcmVwZW5kKFxuXHRcdFx0JCgnPHNwYW4gLz4nLCB7XG5cdFx0XHRcdCdjbGFzcyc6ICd1aS1pY29uIHVpLWljb24tY2xvc2UnLFxuXHRcdFx0XHQnaHRtbCc6ICcmdGltZXM7J1xuXHRcdFx0fSlcblx0XHQpO1xuXHR9XG5cblx0Ly8gQ3JlYXRlIGJ1dHRvbiBhbmQgc2V0dXAgYXR0cmlidXRlc1xuXHRlbGVtZW50cy5idXR0b24uYXBwZW5kVG8oZWxlbWVudHMudGl0bGViYXIgfHwgdG9vbHRpcClcblx0XHQuYXR0cigncm9sZScsICdidXR0b24nKVxuXHRcdC5jbGljayhmdW5jdGlvbihldmVudCkge1xuXHRcdFx0aWYoIXRvb2x0aXAuaGFzQ2xhc3MoQ0xBU1NfRElTQUJMRUQpKSB7IHNlbGYuaGlkZShldmVudCk7IH1cblx0XHRcdHJldHVybiBGQUxTRTtcblx0XHR9KTtcbn07XG5cblBST1RPVFlQRS5fdXBkYXRlQnV0dG9uID0gZnVuY3Rpb24oYnV0dG9uKVxue1xuXHQvLyBNYWtlIHN1cmUgdG9vbHRpcCBpcyByZW5kZXJlZCBhbmQgaWYgbm90LCByZXR1cm5cblx0aWYoIXRoaXMucmVuZGVyZWQpIHsgcmV0dXJuIEZBTFNFOyB9XG5cblx0dmFyIGVsZW0gPSB0aGlzLmVsZW1lbnRzLmJ1dHRvbjtcblx0aWYoYnV0dG9uKSB7IHRoaXMuX2NyZWF0ZUJ1dHRvbigpOyB9XG5cdGVsc2UgeyBlbGVtLnJlbW92ZSgpOyB9XG59O1xuOy8vIFdpZGdldCBjbGFzcyBjcmVhdG9yXG5mdW5jdGlvbiBjcmVhdGVXaWRnZXRDbGFzcyhjbHMpIHtcblx0cmV0dXJuIFdJREdFVC5jb25jYXQoJycpLmpvaW4oY2xzID8gJy0nK2NscysnICcgOiAnICcpO1xufVxuXG4vLyBXaWRnZXQgY2xhc3Mgc2V0dGVyIG1ldGhvZFxuUFJPVE9UWVBFLl9zZXRXaWRnZXQgPSBmdW5jdGlvbigpXG57XG5cdHZhciBvbiA9IHRoaXMub3B0aW9ucy5zdHlsZS53aWRnZXQsXG5cdFx0ZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzLFxuXHRcdHRvb2x0aXAgPSBlbGVtZW50cy50b29sdGlwLFxuXHRcdGRpc2FibGVkID0gdG9vbHRpcC5oYXNDbGFzcyhDTEFTU19ESVNBQkxFRCk7XG5cblx0dG9vbHRpcC5yZW1vdmVDbGFzcyhDTEFTU19ESVNBQkxFRCk7XG5cdENMQVNTX0RJU0FCTEVEID0gb24gPyAndWktc3RhdGUtZGlzYWJsZWQnIDogJ3F0aXAtZGlzYWJsZWQnO1xuXHR0b29sdGlwLnRvZ2dsZUNsYXNzKENMQVNTX0RJU0FCTEVELCBkaXNhYmxlZCk7XG5cblx0dG9vbHRpcC50b2dnbGVDbGFzcygndWktaGVscGVyLXJlc2V0ICcrY3JlYXRlV2lkZ2V0Q2xhc3MoKSwgb24pLnRvZ2dsZUNsYXNzKENMQVNTX0RFRkFVTFQsIHRoaXMub3B0aW9ucy5zdHlsZS5kZWYgJiYgIW9uKTtcblxuXHRpZihlbGVtZW50cy5jb250ZW50KSB7XG5cdFx0ZWxlbWVudHMuY29udGVudC50b2dnbGVDbGFzcyggY3JlYXRlV2lkZ2V0Q2xhc3MoJ2NvbnRlbnQnKSwgb24pO1xuXHR9XG5cdGlmKGVsZW1lbnRzLnRpdGxlYmFyKSB7XG5cdFx0ZWxlbWVudHMudGl0bGViYXIudG9nZ2xlQ2xhc3MoIGNyZWF0ZVdpZGdldENsYXNzKCdoZWFkZXInKSwgb24pO1xuXHR9XG5cdGlmKGVsZW1lbnRzLmJ1dHRvbikge1xuXHRcdGVsZW1lbnRzLmJ1dHRvbi50b2dnbGVDbGFzcyhOQU1FU1BBQ0UrJy1pY29uJywgIW9uKTtcblx0fVxufTtcbjtmdW5jdGlvbiBkZWxheShjYWxsYmFjaywgZHVyYXRpb24pIHtcblx0Ly8gSWYgdG9vbHRpcCBoYXMgZGlzcGxheWVkLCBzdGFydCBoaWRlIHRpbWVyXG5cdGlmKGR1cmF0aW9uID4gMCkge1xuXHRcdHJldHVybiBzZXRUaW1lb3V0KFxuXHRcdFx0JC5wcm94eShjYWxsYmFjaywgdGhpcyksIGR1cmF0aW9uXG5cdFx0KTtcblx0fVxuXHRlbHNleyBjYWxsYmFjay5jYWxsKHRoaXMpOyB9XG59XG5cbmZ1bmN0aW9uIHNob3dNZXRob2QoZXZlbnQpIHtcblx0aWYodGhpcy50b29sdGlwLmhhc0NsYXNzKENMQVNTX0RJU0FCTEVEKSkgeyByZXR1cm47IH1cblxuXHQvLyBDbGVhciBoaWRlIHRpbWVyc1xuXHRjbGVhclRpbWVvdXQodGhpcy50aW1lcnMuc2hvdyk7XG5cdGNsZWFyVGltZW91dCh0aGlzLnRpbWVycy5oaWRlKTtcblxuXHQvLyBTdGFydCBzaG93IHRpbWVyXG5cdHRoaXMudGltZXJzLnNob3cgPSBkZWxheS5jYWxsKHRoaXMsXG5cdFx0ZnVuY3Rpb24oKSB7IHRoaXMudG9nZ2xlKFRSVUUsIGV2ZW50KTsgfSxcblx0XHR0aGlzLm9wdGlvbnMuc2hvdy5kZWxheVxuXHQpO1xufVxuXG5mdW5jdGlvbiBoaWRlTWV0aG9kKGV2ZW50KSB7XG5cdGlmKHRoaXMudG9vbHRpcC5oYXNDbGFzcyhDTEFTU19ESVNBQkxFRCkgfHwgdGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cblx0Ly8gQ2hlY2sgaWYgbmV3IHRhcmdldCB3YXMgYWN0dWFsbHkgdGhlIHRvb2x0aXAgZWxlbWVudFxuXHR2YXIgcmVsYXRlZFRhcmdldCA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCksXG5cdFx0b250b1Rvb2x0aXAgPSByZWxhdGVkVGFyZ2V0LmNsb3Nlc3QoU0VMRUNUT1IpWzBdID09PSB0aGlzLnRvb2x0aXBbMF0sXG5cdFx0b250b1RhcmdldCA9IHJlbGF0ZWRUYXJnZXRbMF0gPT09IHRoaXMub3B0aW9ucy5zaG93LnRhcmdldFswXTtcblxuXHQvLyBDbGVhciB0aW1lcnMgYW5kIHN0b3AgYW5pbWF0aW9uIHF1ZXVlXG5cdGNsZWFyVGltZW91dCh0aGlzLnRpbWVycy5zaG93KTtcblx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJzLmhpZGUpO1xuXG5cdC8vIFByZXZlbnQgaGlkaW5nIGlmIHRvb2x0aXAgaXMgZml4ZWQgYW5kIGV2ZW50IHRhcmdldCBpcyB0aGUgdG9vbHRpcC5cblx0Ly8gT3IgaWYgbW91c2UgcG9zaXRpb25pbmcgaXMgZW5hYmxlZCBhbmQgY3Vyc29yIG1vbWVudGFyaWx5IG92ZXJsYXBzXG5cdGlmKHRoaXMgIT09IHJlbGF0ZWRUYXJnZXRbMF0gJiZcblx0XHQodGhpcy5vcHRpb25zLnBvc2l0aW9uLnRhcmdldCA9PT0gJ21vdXNlJyAmJiBvbnRvVG9vbHRpcCkgfHxcblx0XHR0aGlzLm9wdGlvbnMuaGlkZS5maXhlZCAmJiAoXG5cdFx0XHQoL21vdXNlKG91dHxsZWF2ZXxtb3ZlKS8pLnRlc3QoZXZlbnQudHlwZSkgJiYgKG9udG9Ub29sdGlwIHx8IG9udG9UYXJnZXQpKVxuXHRcdClcblx0e1xuXHRcdC8qIGVzbGludC1kaXNhYmxlIG5vLWVtcHR5ICovXG5cdFx0dHJ5IHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHR9IGNhdGNoKGUpIHt9XG5cdFx0LyogZXNsaW50LWVuYWJsZSBuby1lbXB0eSAqL1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSWYgdG9vbHRpcCBoYXMgZGlzcGxheWVkLCBzdGFydCBoaWRlIHRpbWVyXG5cdHRoaXMudGltZXJzLmhpZGUgPSBkZWxheS5jYWxsKHRoaXMsXG5cdFx0ZnVuY3Rpb24oKSB7IHRoaXMudG9nZ2xlKEZBTFNFLCBldmVudCk7IH0sXG5cdFx0dGhpcy5vcHRpb25zLmhpZGUuZGVsYXksXG5cdFx0dGhpc1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpbmFjdGl2ZU1ldGhvZChldmVudCkge1xuXHRpZih0aGlzLnRvb2x0aXAuaGFzQ2xhc3MoQ0xBU1NfRElTQUJMRUQpIHx8ICF0aGlzLm9wdGlvbnMuaGlkZS5pbmFjdGl2ZSkgeyByZXR1cm47IH1cblxuXHQvLyBDbGVhciB0aW1lclxuXHRjbGVhclRpbWVvdXQodGhpcy50aW1lcnMuaW5hY3RpdmUpO1xuXG5cdHRoaXMudGltZXJzLmluYWN0aXZlID0gZGVsYXkuY2FsbCh0aGlzLFxuXHRcdGZ1bmN0aW9uKCl7IHRoaXMuaGlkZShldmVudCk7IH0sXG5cdFx0dGhpcy5vcHRpb25zLmhpZGUuaW5hY3RpdmVcblx0KTtcbn1cblxuZnVuY3Rpb24gcmVwb3NpdGlvbk1ldGhvZChldmVudCkge1xuXHRpZih0aGlzLnJlbmRlcmVkICYmIHRoaXMudG9vbHRpcFswXS5vZmZzZXRXaWR0aCA+IDApIHsgdGhpcy5yZXBvc2l0aW9uKGV2ZW50KTsgfVxufVxuXG4vLyBTdG9yZSBtb3VzZSBjb29yZGluYXRlc1xuUFJPVE9UWVBFLl9zdG9yZU1vdXNlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0KHRoaXMubW91c2UgPSAkLmV2ZW50LmZpeChldmVudCkpLnR5cGUgPSAnbW91c2Vtb3ZlJztcblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vLyBCaW5kIGV2ZW50c1xuUFJPVE9UWVBFLl9iaW5kID0gZnVuY3Rpb24odGFyZ2V0cywgZXZlbnRzLCBtZXRob2QsIHN1ZmZpeCwgY29udGV4dCkge1xuXHRpZighdGFyZ2V0cyB8fCAhbWV0aG9kIHx8ICFldmVudHMubGVuZ3RoKSB7IHJldHVybjsgfVxuXHR2YXIgbnMgPSAnLicgKyB0aGlzLl9pZCArIChzdWZmaXggPyAnLScrc3VmZml4IDogJycpO1xuXHQkKHRhcmdldHMpLmJpbmQoXG5cdFx0KGV2ZW50cy5zcGxpdCA/IGV2ZW50cyA6IGV2ZW50cy5qb2luKG5zICsgJyAnKSkgKyBucyxcblx0XHQkLnByb3h5KG1ldGhvZCwgY29udGV4dCB8fCB0aGlzKVxuXHQpO1xuXHRyZXR1cm4gdGhpcztcbn07XG5QUk9UT1RZUEUuX3VuYmluZCA9IGZ1bmN0aW9uKHRhcmdldHMsIHN1ZmZpeCkge1xuXHR0YXJnZXRzICYmICQodGFyZ2V0cykudW5iaW5kKCcuJyArIHRoaXMuX2lkICsgKHN1ZmZpeCA/ICctJytzdWZmaXggOiAnJykpO1xuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8vIEdsb2JhbCBkZWxlZ2F0aW9uIGhlbHBlclxuZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGV2ZW50cywgbWV0aG9kKSB7XG5cdCQoZG9jdW1lbnQuYm9keSkuZGVsZWdhdGUoc2VsZWN0b3IsXG5cdFx0KGV2ZW50cy5zcGxpdCA/IGV2ZW50cyA6IGV2ZW50cy5qb2luKCcuJytOQU1FU1BBQ0UgKyAnICcpKSArICcuJytOQU1FU1BBQ0UsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYXBpID0gUVRJUC5hcGlbICQuYXR0cih0aGlzLCBBVFRSX0lEKSBdO1xuXHRcdFx0YXBpICYmICFhcGkuZGlzYWJsZWQgJiYgbWV0aG9kLmFwcGx5KGFwaSwgYXJndW1lbnRzKTtcblx0XHR9XG5cdCk7XG59XG4vLyBFdmVudCB0cmlnZ2VyXG5QUk9UT1RZUEUuX3RyaWdnZXIgPSBmdW5jdGlvbih0eXBlLCBhcmdzLCBldmVudCkge1xuXHR2YXIgY2FsbGJhY2sgPSBuZXcgJC5FdmVudCgndG9vbHRpcCcrdHlwZSk7XG5cdGNhbGxiYWNrLm9yaWdpbmFsRXZlbnQgPSBldmVudCAmJiAkLmV4dGVuZCh7fSwgZXZlbnQpIHx8IHRoaXMuY2FjaGUuZXZlbnQgfHwgTlVMTDtcblxuXHR0aGlzLnRyaWdnZXJpbmcgPSB0eXBlO1xuXHR0aGlzLnRvb2x0aXAudHJpZ2dlcihjYWxsYmFjaywgW3RoaXNdLmNvbmNhdChhcmdzIHx8IFtdKSk7XG5cdHRoaXMudHJpZ2dlcmluZyA9IEZBTFNFO1xuXG5cdHJldHVybiAhY2FsbGJhY2suaXNEZWZhdWx0UHJldmVudGVkKCk7XG59O1xuXG5QUk9UT1RZUEUuX2JpbmRFdmVudHMgPSBmdW5jdGlvbihzaG93RXZlbnRzLCBoaWRlRXZlbnRzLCBzaG93VGFyZ2V0cywgaGlkZVRhcmdldHMsIHNob3dDYWxsYmFjaywgaGlkZUNhbGxiYWNrKSB7XG5cdC8vIEdldCB0YXNyZ2V0cyB0aGF0IGx5ZSB3aXRoaW4gYm90aFxuXHR2YXIgc2ltaWxhclRhcmdldHMgPSBzaG93VGFyZ2V0cy5maWx0ZXIoIGhpZGVUYXJnZXRzICkuYWRkKCBoaWRlVGFyZ2V0cy5maWx0ZXIoc2hvd1RhcmdldHMpICksXG5cdFx0dG9nZ2xlRXZlbnRzID0gW107XG5cblx0Ly8gSWYgaGlkZSBhbmQgc2hvdyB0YXJnZXRzIGFyZSB0aGUgc2FtZS4uLlxuXHRpZihzaW1pbGFyVGFyZ2V0cy5sZW5ndGgpIHtcblxuXHRcdC8vIEZpbHRlciBpZGVudGljYWwgc2hvdy9oaWRlIGV2ZW50c1xuXHRcdCQuZWFjaChoaWRlRXZlbnRzLCBmdW5jdGlvbihpLCB0eXBlKSB7XG5cdFx0XHR2YXIgc2hvd0luZGV4ID0gJC5pbkFycmF5KHR5cGUsIHNob3dFdmVudHMpO1xuXG5cdFx0XHQvLyBCb3RoIGV2ZW50cyBhcmUgaWRlbnRpY2FsLCByZW1vdmUgZnJvbSBib3RoIGhpZGUgYW5kIHNob3cgZXZlbnRzXG5cdFx0XHQvLyBhbmQgYXBwZW5kIHRvIHRvZ2dsZUV2ZW50c1xuXHRcdFx0c2hvd0luZGV4ID4gLTEgJiYgdG9nZ2xlRXZlbnRzLnB1c2goIHNob3dFdmVudHMuc3BsaWNlKCBzaG93SW5kZXgsIDEgKVswXSApO1xuXHRcdH0pO1xuXG5cdFx0Ly8gVG9nZ2xlIGV2ZW50cyBhcmUgc3BlY2lhbCBjYXNlIG9mIGlkZW50aWNhbCBzaG93L2hpZGUgZXZlbnRzLCB3aGljaCBoYXBwZW4gaW4gc2VxdWVuY2Vcblx0XHRpZih0b2dnbGVFdmVudHMubGVuZ3RoKSB7XG5cdFx0XHQvLyBCaW5kIHRvZ2dsZSBldmVudHMgdG8gdGhlIHNpbWlsYXIgdGFyZ2V0c1xuXHRcdFx0dGhpcy5fYmluZChzaW1pbGFyVGFyZ2V0cywgdG9nZ2xlRXZlbnRzLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHR2YXIgc3RhdGUgPSB0aGlzLnJlbmRlcmVkID8gdGhpcy50b29sdGlwWzBdLm9mZnNldFdpZHRoID4gMCA6IGZhbHNlO1xuXHRcdFx0XHQoc3RhdGUgPyBoaWRlQ2FsbGJhY2sgOiBzaG93Q2FsbGJhY2spLmNhbGwodGhpcywgZXZlbnQpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFJlbW92ZSB0aGUgc2ltaWxhciB0YXJnZXRzIGZyb20gdGhlIHJlZ3VsYXIgc2hvdy9oaWRlIGJpbmRpbmdzXG5cdFx0XHRzaG93VGFyZ2V0cyA9IHNob3dUYXJnZXRzLm5vdChzaW1pbGFyVGFyZ2V0cyk7XG5cdFx0XHRoaWRlVGFyZ2V0cyA9IGhpZGVUYXJnZXRzLm5vdChzaW1pbGFyVGFyZ2V0cyk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQXBwbHkgc2hvdy9oaWRlL3RvZ2dsZSBldmVudHNcblx0dGhpcy5fYmluZChzaG93VGFyZ2V0cywgc2hvd0V2ZW50cywgc2hvd0NhbGxiYWNrKTtcblx0dGhpcy5fYmluZChoaWRlVGFyZ2V0cywgaGlkZUV2ZW50cywgaGlkZUNhbGxiYWNrKTtcbn07XG5cblBST1RPVFlQRS5fYXNzaWduSW5pdGlhbEV2ZW50cyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuXHRcdHNob3dUYXJnZXQgPSBvcHRpb25zLnNob3cudGFyZ2V0LFxuXHRcdGhpZGVUYXJnZXQgPSBvcHRpb25zLmhpZGUudGFyZ2V0LFxuXHRcdHNob3dFdmVudHMgPSBvcHRpb25zLnNob3cuZXZlbnQgPyAkLnRyaW0oJycgKyBvcHRpb25zLnNob3cuZXZlbnQpLnNwbGl0KCcgJykgOiBbXSxcblx0XHRoaWRlRXZlbnRzID0gb3B0aW9ucy5oaWRlLmV2ZW50ID8gJC50cmltKCcnICsgb3B0aW9ucy5oaWRlLmV2ZW50KS5zcGxpdCgnICcpIDogW107XG5cblx0Ly8gQ2F0Y2ggcmVtb3ZlL3JlbW92ZXF0aXAgZXZlbnRzIG9uIHRhcmdldCBlbGVtZW50IHRvIGRlc3Ryb3kgcmVkdW5kYW50IHRvb2x0aXBzXG5cdHRoaXMuX2JpbmQodGhpcy5lbGVtZW50cy50YXJnZXQsIFsncmVtb3ZlJywgJ3JlbW92ZXF0aXAnXSwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5kZXN0cm95KHRydWUpO1xuXHR9LCAnZGVzdHJveScpO1xuXG5cdC8qXG5cdCAqIE1ha2Ugc3VyZSBob3ZlckludGVudCBmdW5jdGlvbnMgcHJvcGVybHkgYnkgdXNpbmcgbW91c2VsZWF2ZSBhcyBhIGhpZGUgZXZlbnQgaWZcblx0ICogbW91c2VlbnRlci9tb3VzZW91dCBpcyB1c2VkIGZvciBzaG93LmV2ZW50LCBldmVuIGlmIGl0IGlzbid0IGluIHRoZSB1c2VycyBvcHRpb25zLlxuXHQgKi9cblx0aWYoL21vdXNlKG92ZXJ8ZW50ZXIpL2kudGVzdChvcHRpb25zLnNob3cuZXZlbnQpICYmICEvbW91c2Uob3V0fGxlYXZlKS9pLnRlc3Qob3B0aW9ucy5oaWRlLmV2ZW50KSkge1xuXHRcdGhpZGVFdmVudHMucHVzaCgnbW91c2VsZWF2ZScpO1xuXHR9XG5cblx0Lypcblx0ICogQWxzbyBtYWtlIHN1cmUgaW5pdGlhbCBtb3VzZSB0YXJnZXR0aW5nIHdvcmtzIGNvcnJlY3RseSBieSBjYWNoaW5nIG1vdXNlbW92ZSBjb29yZHNcblx0ICogb24gc2hvdyB0YXJnZXRzIGJlZm9yZSB0aGUgdG9vbHRpcCBoYXMgcmVuZGVyZWQuIEFsc28gc2V0IG9uVGFyZ2V0IHdoZW4gdHJpZ2dlcmVkIHRvXG5cdCAqIGtlZXAgbW91c2UgdHJhY2tpbmcgd29ya2luZy5cblx0ICovXG5cdHRoaXMuX2JpbmQoc2hvd1RhcmdldCwgJ21vdXNlbW92ZScsIGZ1bmN0aW9uKG1vdmVFdmVudCkge1xuXHRcdHRoaXMuX3N0b3JlTW91c2UobW92ZUV2ZW50KTtcblx0XHR0aGlzLmNhY2hlLm9uVGFyZ2V0ID0gVFJVRTtcblx0fSk7XG5cblx0Ly8gRGVmaW5lIGhvdmVySW50ZW50IGZ1bmN0aW9uXG5cdGZ1bmN0aW9uIGhvdmVySW50ZW50KGhvdmVyRXZlbnQpIHtcblx0XHQvLyBPbmx5IGNvbnRpbnVlIGlmIHRvb2x0aXAgaXNuJ3QgZGlzYWJsZWRcblx0XHRpZih0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGVzdHJveWVkKSB7IHJldHVybiBGQUxTRTsgfVxuXG5cdFx0Ly8gQ2FjaGUgdGhlIGV2ZW50IGRhdGFcblx0XHR0aGlzLmNhY2hlLmV2ZW50ID0gaG92ZXJFdmVudCAmJiAkLmV2ZW50LmZpeChob3ZlckV2ZW50KTtcblx0XHR0aGlzLmNhY2hlLnRhcmdldCA9IGhvdmVyRXZlbnQgJiYgJChob3ZlckV2ZW50LnRhcmdldCk7XG5cblx0XHQvLyBTdGFydCB0aGUgZXZlbnQgc2VxdWVuY2Vcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcnMuc2hvdyk7XG5cdFx0dGhpcy50aW1lcnMuc2hvdyA9IGRlbGF5LmNhbGwodGhpcyxcblx0XHRcdGZ1bmN0aW9uKCkgeyB0aGlzLnJlbmRlcih0eXBlb2YgaG92ZXJFdmVudCA9PT0gJ29iamVjdCcgfHwgb3B0aW9ucy5zaG93LnJlYWR5KTsgfSxcblx0XHRcdG9wdGlvbnMucHJlcmVuZGVyID8gMCA6IG9wdGlvbnMuc2hvdy5kZWxheVxuXHRcdCk7XG5cdH1cblxuXHQvLyBGaWx0ZXIgYW5kIGJpbmQgZXZlbnRzXG5cdHRoaXMuX2JpbmRFdmVudHMoc2hvd0V2ZW50cywgaGlkZUV2ZW50cywgc2hvd1RhcmdldCwgaGlkZVRhcmdldCwgaG92ZXJJbnRlbnQsIGZ1bmN0aW9uKCkge1xuXHRcdGlmKCF0aGlzLnRpbWVycykgeyByZXR1cm4gRkFMU0U7IH1cblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcnMuc2hvdyk7XG5cdH0pO1xuXG5cdC8vIFByZXJlbmRlcmluZyBpcyBlbmFibGVkLCBjcmVhdGUgdG9vbHRpcCBub3dcblx0aWYob3B0aW9ucy5zaG93LnJlYWR5IHx8IG9wdGlvbnMucHJlcmVuZGVyKSB7IGhvdmVySW50ZW50LmNhbGwodGhpcywgZXZlbnQpOyB9XG59O1xuXG4vLyBFdmVudCBhc3NpZ25tZW50IG1ldGhvZFxuUFJPVE9UWVBFLl9hc3NpZ25FdmVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG5cdFx0cG9zT3B0aW9ucyA9IG9wdGlvbnMucG9zaXRpb24sXG5cblx0XHR0b29sdGlwID0gdGhpcy50b29sdGlwLFxuXHRcdHNob3dUYXJnZXQgPSBvcHRpb25zLnNob3cudGFyZ2V0LFxuXHRcdGhpZGVUYXJnZXQgPSBvcHRpb25zLmhpZGUudGFyZ2V0LFxuXHRcdGNvbnRhaW5lclRhcmdldCA9IHBvc09wdGlvbnMuY29udGFpbmVyLFxuXHRcdHZpZXdwb3J0VGFyZ2V0ID0gcG9zT3B0aW9ucy52aWV3cG9ydCxcblx0XHRkb2N1bWVudFRhcmdldCA9ICQoZG9jdW1lbnQpLFxuXHRcdHdpbmRvd1RhcmdldCA9ICQod2luZG93KSxcblxuXHRcdHNob3dFdmVudHMgPSBvcHRpb25zLnNob3cuZXZlbnQgPyAkLnRyaW0oJycgKyBvcHRpb25zLnNob3cuZXZlbnQpLnNwbGl0KCcgJykgOiBbXSxcblx0XHRoaWRlRXZlbnRzID0gb3B0aW9ucy5oaWRlLmV2ZW50ID8gJC50cmltKCcnICsgb3B0aW9ucy5oaWRlLmV2ZW50KS5zcGxpdCgnICcpIDogW107XG5cblxuXHQvLyBBc3NpZ24gcGFzc2VkIGV2ZW50IGNhbGxiYWNrc1xuXHQkLmVhY2gob3B0aW9ucy5ldmVudHMsIGZ1bmN0aW9uKG5hbWUsIGNhbGxiYWNrKSB7XG5cdFx0c2VsZi5fYmluZCh0b29sdGlwLCBuYW1lID09PSAndG9nZ2xlJyA/IFsndG9vbHRpcHNob3cnLCd0b29sdGlwaGlkZSddIDogWyd0b29sdGlwJytuYW1lXSwgY2FsbGJhY2ssIG51bGwsIHRvb2x0aXApO1xuXHR9KTtcblxuXHQvLyBIaWRlIHRvb2x0aXBzIHdoZW4gbGVhdmluZyBjdXJyZW50IHdpbmRvdy9mcmFtZSAoYnV0IG5vdCBzZWxlY3Qvb3B0aW9uIGVsZW1lbnRzKVxuXHRpZigvbW91c2Uob3V0fGxlYXZlKS9pLnRlc3Qob3B0aW9ucy5oaWRlLmV2ZW50KSAmJiBvcHRpb25zLmhpZGUubGVhdmUgPT09ICd3aW5kb3cnKSB7XG5cdFx0dGhpcy5fYmluZChkb2N1bWVudFRhcmdldCwgWydtb3VzZW91dCcsICdibHVyJ10sIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRpZighL3NlbGVjdHxvcHRpb24vLnRlc3QoZXZlbnQudGFyZ2V0Lm5vZGVOYW1lKSAmJiAhZXZlbnQucmVsYXRlZFRhcmdldCkge1xuXHRcdFx0XHR0aGlzLmhpZGUoZXZlbnQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gRW5hYmxlIGhpZGUuZml4ZWQgYnkgYWRkaW5nIGFwcHJvcHJpYXRlIGNsYXNzXG5cdGlmKG9wdGlvbnMuaGlkZS5maXhlZCkge1xuXHRcdGhpZGVUYXJnZXQgPSBoaWRlVGFyZ2V0LmFkZCggdG9vbHRpcC5hZGRDbGFzcyhDTEFTU19GSVhFRCkgKTtcblx0fVxuXG5cdC8qXG5cdCAqIE1ha2Ugc3VyZSBob3ZlckludGVudCBmdW5jdGlvbnMgcHJvcGVybHkgYnkgdXNpbmcgbW91c2VsZWF2ZSB0byBjbGVhciBzaG93IHRpbWVyIGlmXG5cdCAqIG1vdXNlZW50ZXIvbW91c2VvdXQgaXMgdXNlZCBmb3Igc2hvdy5ldmVudCwgZXZlbiBpZiBpdCBpc24ndCBpbiB0aGUgdXNlcnMgb3B0aW9ucy5cblx0ICovXG5cdGVsc2UgaWYoL21vdXNlKG92ZXJ8ZW50ZXIpL2kudGVzdChvcHRpb25zLnNob3cuZXZlbnQpKSB7XG5cdFx0dGhpcy5fYmluZChoaWRlVGFyZ2V0LCAnbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJzLnNob3cpO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gSGlkZSB0b29sdGlwIG9uIGRvY3VtZW50IG1vdXNlZG93biBpZiB1bmZvY3VzIGV2ZW50cyBhcmUgZW5hYmxlZFxuXHRpZigoJycgKyBvcHRpb25zLmhpZGUuZXZlbnQpLmluZGV4T2YoJ3VuZm9jdXMnKSA+IC0xKSB7XG5cdFx0dGhpcy5fYmluZChjb250YWluZXJUYXJnZXQuY2xvc2VzdCgnaHRtbCcpLCBbJ21vdXNlZG93bicsICd0b3VjaHN0YXJ0J10sIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHR2YXIgZWxlbSA9ICQoZXZlbnQudGFyZ2V0KSxcblx0XHRcdFx0ZW5hYmxlZCA9IHRoaXMucmVuZGVyZWQgJiYgIXRoaXMudG9vbHRpcC5oYXNDbGFzcyhDTEFTU19ESVNBQkxFRCkgJiYgdGhpcy50b29sdGlwWzBdLm9mZnNldFdpZHRoID4gMCxcblx0XHRcdFx0aXNBbmNlc3RvciA9IGVsZW0ucGFyZW50cyhTRUxFQ1RPUikuZmlsdGVyKHRoaXMudG9vbHRpcFswXSkubGVuZ3RoID4gMDtcblxuXHRcdFx0aWYoZWxlbVswXSAhPT0gdGhpcy50YXJnZXRbMF0gJiYgZWxlbVswXSAhPT0gdGhpcy50b29sdGlwWzBdICYmICFpc0FuY2VzdG9yICYmXG5cdFx0XHRcdCF0aGlzLnRhcmdldC5oYXMoZWxlbVswXSkubGVuZ3RoICYmIGVuYWJsZWRcblx0XHRcdCkge1xuXHRcdFx0XHR0aGlzLmhpZGUoZXZlbnQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgdGhlIHRvb2x0aXAgaGlkZXMgd2hlbiBpbmFjdGl2ZVxuXHRpZignbnVtYmVyJyA9PT0gdHlwZW9mIG9wdGlvbnMuaGlkZS5pbmFjdGl2ZSkge1xuXHRcdC8vIEJpbmQgaW5hY3RpdmUgbWV0aG9kIHRvIHNob3cgdGFyZ2V0KHMpIGFzIGEgY3VzdG9tIGV2ZW50XG5cdFx0dGhpcy5fYmluZChzaG93VGFyZ2V0LCAncXRpcC0nK3RoaXMuaWQrJy1pbmFjdGl2ZScsIGluYWN0aXZlTWV0aG9kLCAnaW5hY3RpdmUnKTtcblxuXHRcdC8vIERlZmluZSBldmVudHMgd2hpY2ggcmVzZXQgdGhlICdpbmFjdGl2ZScgZXZlbnQgaGFuZGxlclxuXHRcdHRoaXMuX2JpbmQoaGlkZVRhcmdldC5hZGQodG9vbHRpcCksIFFUSVAuaW5hY3RpdmVFdmVudHMsIGluYWN0aXZlTWV0aG9kKTtcblx0fVxuXG5cdC8vIEZpbHRlciBhbmQgYmluZCBldmVudHNcblx0dGhpcy5fYmluZEV2ZW50cyhzaG93RXZlbnRzLCBoaWRlRXZlbnRzLCBzaG93VGFyZ2V0LCBoaWRlVGFyZ2V0LCBzaG93TWV0aG9kLCBoaWRlTWV0aG9kKTtcblxuXHQvLyBNb3VzZSBtb3ZlbWVudCBiaW5kaW5nc1xuXHR0aGlzLl9iaW5kKHNob3dUYXJnZXQuYWRkKHRvb2x0aXApLCAnbW91c2Vtb3ZlJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHQvLyBDaGVjayBpZiB0aGUgdG9vbHRpcCBoaWRlcyB3aGVuIG1vdXNlIGlzIG1vdmVkIGEgY2VydGFpbiBkaXN0YW5jZVxuXHRcdGlmKCdudW1iZXInID09PSB0eXBlb2Ygb3B0aW9ucy5oaWRlLmRpc3RhbmNlKSB7XG5cdFx0XHR2YXIgb3JpZ2luID0gdGhpcy5jYWNoZS5vcmlnaW4gfHwge30sXG5cdFx0XHRcdGxpbWl0ID0gdGhpcy5vcHRpb25zLmhpZGUuZGlzdGFuY2UsXG5cdFx0XHRcdGFicyA9IE1hdGguYWJzO1xuXG5cdFx0XHQvLyBDaGVjayBpZiB0aGUgbW92ZW1lbnQgaGFzIGdvbmUgYmV5b25kIHRoZSBsaW1pdCwgYW5kIGhpZGUgaXQgaWYgc29cblx0XHRcdGlmKGFicyhldmVudC5wYWdlWCAtIG9yaWdpbi5wYWdlWCkgPj0gbGltaXQgfHwgYWJzKGV2ZW50LnBhZ2VZIC0gb3JpZ2luLnBhZ2VZKSA+PSBsaW1pdCkge1xuXHRcdFx0XHR0aGlzLmhpZGUoZXZlbnQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhY2hlIG1vdXNlbW92ZSBjb29yZHMgb24gc2hvdyB0YXJnZXRzXG5cdFx0dGhpcy5fc3RvcmVNb3VzZShldmVudCk7XG5cdH0pO1xuXG5cdC8vIE1vdXNlIHBvc2l0aW9uaW5nIGV2ZW50c1xuXHRpZihwb3NPcHRpb25zLnRhcmdldCA9PT0gJ21vdXNlJykge1xuXHRcdC8vIElmIG1vdXNlIGFkanVzdG1lbnQgaXMgb24uLi5cblx0XHRpZihwb3NPcHRpb25zLmFkanVzdC5tb3VzZSkge1xuXHRcdFx0Ly8gQXBwbHkgYSBtb3VzZWxlYXZlIGV2ZW50IHNvIHdlIGRvbid0IGdldCBwcm9ibGVtcyB3aXRoIG92ZXJsYXBwaW5nXG5cdFx0XHRpZihvcHRpb25zLmhpZGUuZXZlbnQpIHtcblx0XHRcdFx0Ly8gVHJhY2sgaWYgd2UncmUgb24gdGhlIHRhcmdldCBvciBub3Rcblx0XHRcdFx0dGhpcy5fYmluZChzaG93VGFyZ2V0LCBbJ21vdXNlZW50ZXInLCAnbW91c2VsZWF2ZSddLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmKCF0aGlzLmNhY2hlKSB7cmV0dXJuIEZBTFNFOyB9XG5cdFx0XHRcdFx0dGhpcy5jYWNoZS5vblRhcmdldCA9IGV2ZW50LnR5cGUgPT09ICdtb3VzZWVudGVyJztcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFVwZGF0ZSB0b29sdGlwIHBvc2l0aW9uIG9uIG1vdXNlbW92ZVxuXHRcdFx0dGhpcy5fYmluZChkb2N1bWVudFRhcmdldCwgJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdC8vIFVwZGF0ZSB0aGUgdG9vbHRpcCBwb3NpdGlvbiBvbmx5IGlmIHRoZSB0b29sdGlwIGlzIHZpc2libGUgYW5kIGFkanVzdG1lbnQgaXMgZW5hYmxlZFxuXHRcdFx0XHRpZih0aGlzLnJlbmRlcmVkICYmIHRoaXMuY2FjaGUub25UYXJnZXQgJiYgIXRoaXMudG9vbHRpcC5oYXNDbGFzcyhDTEFTU19ESVNBQkxFRCkgJiYgdGhpcy50b29sdGlwWzBdLm9mZnNldFdpZHRoID4gMCkge1xuXHRcdFx0XHRcdHRoaXMucmVwb3NpdGlvbihldmVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8vIEFkanVzdCBwb3NpdGlvbnMgb2YgdGhlIHRvb2x0aXAgb24gd2luZG93IHJlc2l6ZSBpZiBlbmFibGVkXG5cdGlmKHBvc09wdGlvbnMuYWRqdXN0LnJlc2l6ZSB8fCB2aWV3cG9ydFRhcmdldC5sZW5ndGgpIHtcblx0XHR0aGlzLl9iaW5kKCAkLmV2ZW50LnNwZWNpYWwucmVzaXplID8gdmlld3BvcnRUYXJnZXQgOiB3aW5kb3dUYXJnZXQsICdyZXNpemUnLCByZXBvc2l0aW9uTWV0aG9kICk7XG5cdH1cblxuXHQvLyBBZGp1c3QgdG9vbHRpcCBwb3NpdGlvbiBvbiBzY3JvbGwgb2YgdGhlIHdpbmRvdyBvciB2aWV3cG9ydCBlbGVtZW50IGlmIHByZXNlbnRcblx0aWYocG9zT3B0aW9ucy5hZGp1c3Quc2Nyb2xsKSB7XG5cdFx0dGhpcy5fYmluZCggd2luZG93VGFyZ2V0LmFkZChwb3NPcHRpb25zLmNvbnRhaW5lciksICdzY3JvbGwnLCByZXBvc2l0aW9uTWV0aG9kICk7XG5cdH1cbn07XG5cbi8vIFVuLWFzc2lnbm1lbnQgbWV0aG9kXG5QUk9UT1RZUEUuX3VuYXNzaWduRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuXHRcdHNob3dUYXJnZXRzID0gb3B0aW9ucy5zaG93LnRhcmdldCxcblx0XHRoaWRlVGFyZ2V0cyA9IG9wdGlvbnMuaGlkZS50YXJnZXQsXG5cdFx0dGFyZ2V0cyA9ICQuZ3JlcChbXG5cdFx0XHR0aGlzLmVsZW1lbnRzLnRhcmdldFswXSxcblx0XHRcdHRoaXMucmVuZGVyZWQgJiYgdGhpcy50b29sdGlwWzBdLFxuXHRcdFx0b3B0aW9ucy5wb3NpdGlvbi5jb250YWluZXJbMF0sXG5cdFx0XHRvcHRpb25zLnBvc2l0aW9uLnZpZXdwb3J0WzBdLFxuXHRcdFx0b3B0aW9ucy5wb3NpdGlvbi5jb250YWluZXIuY2xvc2VzdCgnaHRtbCcpWzBdLCAvLyB1bmZvY3VzXG5cdFx0XHR3aW5kb3csXG5cdFx0XHRkb2N1bWVudFxuXHRcdF0sIGZ1bmN0aW9uKGkpIHtcblx0XHRcdHJldHVybiB0eXBlb2YgaSA9PT0gJ29iamVjdCc7XG5cdFx0fSk7XG5cblx0Ly8gQWRkIHNob3cgYW5kIGhpZGUgdGFyZ2V0cyBpZiB0aGV5J3JlIHZhbGlkXG5cdGlmKHNob3dUYXJnZXRzICYmIHNob3dUYXJnZXRzLnRvQXJyYXkpIHtcblx0XHR0YXJnZXRzID0gdGFyZ2V0cy5jb25jYXQoc2hvd1RhcmdldHMudG9BcnJheSgpKTtcblx0fVxuXHRpZihoaWRlVGFyZ2V0cyAmJiBoaWRlVGFyZ2V0cy50b0FycmF5KSB7XG5cdFx0dGFyZ2V0cyA9IHRhcmdldHMuY29uY2F0KGhpZGVUYXJnZXRzLnRvQXJyYXkoKSk7XG5cdH1cblxuXHQvLyBVbmJpbmQgdGhlIGV2ZW50c1xuXHR0aGlzLl91bmJpbmQodGFyZ2V0cylcblx0XHQuX3VuYmluZCh0YXJnZXRzLCAnZGVzdHJveScpXG5cdFx0Ll91bmJpbmQodGFyZ2V0cywgJ2luYWN0aXZlJyk7XG59O1xuXG4vLyBBcHBseSBjb21tb24gZXZlbnQgaGFuZGxlcnMgdXNpbmcgZGVsZWdhdGUgKGF2b2lkcyBleGNlc3NpdmUgLmJpbmQgY2FsbHMhKVxuJChmdW5jdGlvbigpIHtcblx0ZGVsZWdhdGUoU0VMRUNUT1IsIFsnbW91c2VlbnRlcicsICdtb3VzZWxlYXZlJ10sIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHN0YXRlID0gZXZlbnQudHlwZSA9PT0gJ21vdXNlZW50ZXInLFxuXHRcdFx0dG9vbHRpcCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCksXG5cdFx0XHR0YXJnZXQgPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQgfHwgZXZlbnQudGFyZ2V0KSxcblx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cblx0XHQvLyBPbiBtb3VzZWVudGVyLi4uXG5cdFx0aWYoc3RhdGUpIHtcblx0XHRcdC8vIEZvY3VzIHRoZSB0b29sdGlwIG9uIG1vdXNlZW50ZXIgKHotaW5kZXggc3RhY2tpbmcpXG5cdFx0XHR0aGlzLmZvY3VzKGV2ZW50KTtcblxuXHRcdFx0Ly8gQ2xlYXIgaGlkZSB0aW1lciBvbiB0b29sdGlwIGhvdmVyIHRvIHByZXZlbnQgaXQgZnJvbSBjbG9zaW5nXG5cdFx0XHR0b29sdGlwLmhhc0NsYXNzKENMQVNTX0ZJWEVEKSAmJiAhdG9vbHRpcC5oYXNDbGFzcyhDTEFTU19ESVNBQkxFRCkgJiYgY2xlYXJUaW1lb3V0KHRoaXMudGltZXJzLmhpZGUpO1xuXHRcdH1cblxuXHRcdC8vIE9uIG1vdXNlbGVhdmUuLi5cblx0XHRlbHNlIHtcblx0XHRcdC8vIFdoZW4gbW91c2UgdHJhY2tpbmcgaXMgZW5hYmxlZCwgaGlkZSB3aGVuIHdlIGxlYXZlIHRoZSB0b29sdGlwIGFuZCBub3Qgb250byB0aGUgc2hvdyB0YXJnZXQgKGlmIGEgaGlkZSBldmVudCBpcyBzZXQpXG5cdFx0XHRpZihvcHRpb25zLnBvc2l0aW9uLnRhcmdldCA9PT0gJ21vdXNlJyAmJiBvcHRpb25zLnBvc2l0aW9uLmFkanVzdC5tb3VzZSAmJlxuXHRcdFx0XHRvcHRpb25zLmhpZGUuZXZlbnQgJiYgb3B0aW9ucy5zaG93LnRhcmdldCAmJiAhdGFyZ2V0LmNsb3Nlc3Qob3B0aW9ucy5zaG93LnRhcmdldFswXSkubGVuZ3RoKSB7XG5cdFx0XHRcdHRoaXMuaGlkZShldmVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIGhvdmVyIGNsYXNzXG5cdFx0dG9vbHRpcC50b2dnbGVDbGFzcyhDTEFTU19IT1ZFUiwgc3RhdGUpO1xuXHR9KTtcblxuXHQvLyBEZWZpbmUgZXZlbnRzIHdoaWNoIHJlc2V0IHRoZSAnaW5hY3RpdmUnIGV2ZW50IGhhbmRsZXJcblx0ZGVsZWdhdGUoJ1snK0FUVFJfSUQrJ10nLCBJTkFDVElWRV9FVkVOVFMsIGluYWN0aXZlTWV0aG9kKTtcbn0pO1xuOy8vIEluaXRpYWxpemF0aW9uIG1ldGhvZFxuZnVuY3Rpb24gaW5pdChlbGVtLCBpZCwgb3B0cykge1xuXHR2YXIgb2JqLCBwb3NPcHRpb25zLCBhdHRyLCBjb25maWcsIHRpdGxlLFxuXG5cdC8vIFNldHVwIGVsZW1lbnQgcmVmZXJlbmNlc1xuXHRkb2NCb2R5ID0gJChkb2N1bWVudC5ib2R5KSxcblxuXHQvLyBVc2UgZG9jdW1lbnQgYm9keSBpbnN0ZWFkIG9mIGRvY3VtZW50IGVsZW1lbnQgaWYgbmVlZGVkXG5cdG5ld1RhcmdldCA9IGVsZW1bMF0gPT09IGRvY3VtZW50ID8gZG9jQm9keSA6IGVsZW0sXG5cblx0Ly8gR3JhYiBtZXRhZGF0YSBmcm9tIGVsZW1lbnQgaWYgcGx1Z2luIGlzIHByZXNlbnRcblx0bWV0YWRhdGEgPSBlbGVtLm1ldGFkYXRhID8gZWxlbS5tZXRhZGF0YShvcHRzLm1ldGFkYXRhKSA6IE5VTEwsXG5cblx0Ly8gSWYgbWV0YWRhdGEgdHlwZSBpZiBIVE1MNSwgZ3JhYiAnbmFtZScgZnJvbSB0aGUgb2JqZWN0IGluc3RlYWQsIG9yIHVzZSB0aGUgcmVndWxhciBkYXRhIG9iamVjdCBvdGhlcndpc2Vcblx0bWV0YWRhdGE1ID0gb3B0cy5tZXRhZGF0YS50eXBlID09PSAnaHRtbDUnICYmIG1ldGFkYXRhID8gbWV0YWRhdGFbb3B0cy5tZXRhZGF0YS5uYW1lXSA6IE5VTEwsXG5cblx0Ly8gR3JhYiBkYXRhIGZyb20gbWV0YWRhdGEubmFtZSAob3IgZGF0YS1xdGlwb3B0cyBhcyBmYWxsYmFjaykgdXNpbmcgLmRhdGEoKSBtZXRob2QsXG5cdGh0bWw1ID0gZWxlbS5kYXRhKG9wdHMubWV0YWRhdGEubmFtZSB8fCAncXRpcG9wdHMnKTtcblxuXHQvLyBJZiB3ZSBkb24ndCBnZXQgYW4gb2JqZWN0IHJldHVybmVkIGF0dGVtcHQgdG8gcGFyc2UgaXQgbWFudWFseWwgd2l0aG91dCBwYXJzZUpTT05cblx0LyogZXNsaW50LWRpc2FibGUgbm8tZW1wdHkgKi9cblx0dHJ5IHsgaHRtbDUgPSB0eXBlb2YgaHRtbDUgPT09ICdzdHJpbmcnID8gJC5wYXJzZUpTT04oaHRtbDUpIDogaHRtbDU7IH1cblx0Y2F0Y2goZSkge31cblx0LyogZXNsaW50LWVuYWJsZSBuby1lbXB0eSAqL1xuXG5cdC8vIE1lcmdlIGluIGFuZCBzYW5pdGl6ZSBtZXRhZGF0YVxuXHRjb25maWcgPSAkLmV4dGVuZChUUlVFLCB7fSwgUVRJUC5kZWZhdWx0cywgb3B0cyxcblx0XHR0eXBlb2YgaHRtbDUgPT09ICdvYmplY3QnID8gc2FuaXRpemVPcHRpb25zKGh0bWw1KSA6IE5VTEwsXG5cdFx0c2FuaXRpemVPcHRpb25zKG1ldGFkYXRhNSB8fCBtZXRhZGF0YSkpO1xuXG5cdC8vIFJlLWdyYWIgb3VyIHBvc2l0aW9uaW5nIG9wdGlvbnMgbm93IHdlJ3ZlIG1lcmdlZCBvdXIgbWV0YWRhdGEgYW5kIHNldCBpZCB0byBwYXNzZWQgdmFsdWVcblx0cG9zT3B0aW9ucyA9IGNvbmZpZy5wb3NpdGlvbjtcblx0Y29uZmlnLmlkID0gaWQ7XG5cblx0Ly8gU2V0dXAgbWlzc2luZyBjb250ZW50IGlmIG5vbmUgaXMgZGV0ZWN0ZWRcblx0aWYoJ2Jvb2xlYW4nID09PSB0eXBlb2YgY29uZmlnLmNvbnRlbnQudGV4dCkge1xuXHRcdGF0dHIgPSBlbGVtLmF0dHIoY29uZmlnLmNvbnRlbnQuYXR0cik7XG5cblx0XHQvLyBHcmFiIGZyb20gc3VwcGxpZWQgYXR0cmlidXRlIGlmIGF2YWlsYWJsZVxuXHRcdGlmKGNvbmZpZy5jb250ZW50LmF0dHIgIT09IEZBTFNFICYmIGF0dHIpIHsgY29uZmlnLmNvbnRlbnQudGV4dCA9IGF0dHI7IH1cblxuXHRcdC8vIE5vIHZhbGlkIGNvbnRlbnQgd2FzIGZvdW5kLCBhYm9ydCByZW5kZXJcblx0XHRlbHNlIHsgcmV0dXJuIEZBTFNFOyB9XG5cdH1cblxuXHQvLyBTZXR1cCB0YXJnZXQgb3B0aW9uc1xuXHRpZighcG9zT3B0aW9ucy5jb250YWluZXIubGVuZ3RoKSB7IHBvc09wdGlvbnMuY29udGFpbmVyID0gZG9jQm9keTsgfVxuXHRpZihwb3NPcHRpb25zLnRhcmdldCA9PT0gRkFMU0UpIHsgcG9zT3B0aW9ucy50YXJnZXQgPSBuZXdUYXJnZXQ7IH1cblx0aWYoY29uZmlnLnNob3cudGFyZ2V0ID09PSBGQUxTRSkgeyBjb25maWcuc2hvdy50YXJnZXQgPSBuZXdUYXJnZXQ7IH1cblx0aWYoY29uZmlnLnNob3cuc29sbyA9PT0gVFJVRSkgeyBjb25maWcuc2hvdy5zb2xvID0gcG9zT3B0aW9ucy5jb250YWluZXIuY2xvc2VzdCgnYm9keScpOyB9XG5cdGlmKGNvbmZpZy5oaWRlLnRhcmdldCA9PT0gRkFMU0UpIHsgY29uZmlnLmhpZGUudGFyZ2V0ID0gbmV3VGFyZ2V0OyB9XG5cdGlmKGNvbmZpZy5wb3NpdGlvbi52aWV3cG9ydCA9PT0gVFJVRSkgeyBjb25maWcucG9zaXRpb24udmlld3BvcnQgPSBwb3NPcHRpb25zLmNvbnRhaW5lcjsgfVxuXG5cdC8vIEVuc3VyZSB3ZSBvbmx5IHVzZSBhIHNpbmdsZSBjb250YWluZXJcblx0cG9zT3B0aW9ucy5jb250YWluZXIgPSBwb3NPcHRpb25zLmNvbnRhaW5lci5lcSgwKTtcblxuXHQvLyBDb252ZXJ0IHBvc2l0aW9uIGNvcm5lciB2YWx1ZXMgaW50byB4IGFuZCB5IHN0cmluZ3Ncblx0cG9zT3B0aW9ucy5hdCA9IG5ldyBDT1JORVIocG9zT3B0aW9ucy5hdCwgVFJVRSk7XG5cdHBvc09wdGlvbnMubXkgPSBuZXcgQ09STkVSKHBvc09wdGlvbnMubXkpO1xuXG5cdC8vIERlc3Ryb3kgcHJldmlvdXMgdG9vbHRpcCBpZiBvdmVyd3JpdGUgaXMgZW5hYmxlZCwgb3Igc2tpcCBlbGVtZW50IGlmIG5vdFxuXHRpZihlbGVtLmRhdGEoTkFNRVNQQUNFKSkge1xuXHRcdGlmKGNvbmZpZy5vdmVyd3JpdGUpIHtcblx0XHRcdGVsZW0ucXRpcCgnZGVzdHJveScsIHRydWUpO1xuXHRcdH1cblx0XHRlbHNlIGlmKGNvbmZpZy5vdmVyd3JpdGUgPT09IEZBTFNFKSB7XG5cdFx0XHRyZXR1cm4gRkFMU0U7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQWRkIGhhcy1xdGlwIGF0dHJpYnV0ZVxuXHRlbGVtLmF0dHIoQVRUUl9IQVMsIGlkKTtcblxuXHQvLyBSZW1vdmUgdGl0bGUgYXR0cmlidXRlIGFuZCBzdG9yZSBpdCBpZiBwcmVzZW50XG5cdGlmKGNvbmZpZy5zdXBwcmVzcyAmJiAodGl0bGUgPSBlbGVtLmF0dHIoJ3RpdGxlJykpKSB7XG5cdFx0Ly8gRmluYWwgYXR0ciBjYWxsIGZpeGVzIGV2ZW50IGRlbGVnYXRpb20gYW5kIElFIGRlZmF1bHQgdG9vbHRpcCBzaG93aW5nIHByb2JsZW1cblx0XHRlbGVtLnJlbW92ZUF0dHIoJ3RpdGxlJykuYXR0cihvbGR0aXRsZSwgdGl0bGUpLmF0dHIoJ3RpdGxlJywgJycpO1xuXHR9XG5cblx0Ly8gSW5pdGlhbGl6ZSB0aGUgdG9vbHRpcCBhbmQgYWRkIEFQSSByZWZlcmVuY2Vcblx0b2JqID0gbmV3IFFUaXAoZWxlbSwgY29uZmlnLCBpZCwgISFhdHRyKTtcblx0ZWxlbS5kYXRhKE5BTUVTUEFDRSwgb2JqKTtcblxuXHRyZXR1cm4gb2JqO1xufVxuXG4vLyBqUXVlcnkgJC5mbiBleHRlbnNpb24gbWV0aG9kXG5RVElQID0gJC5mbi5xdGlwID0gZnVuY3Rpb24ob3B0aW9ucywgbm90YXRpb24sIG5ld1ZhbHVlKVxue1xuXHR2YXIgY29tbWFuZCA9ICgnJyArIG9wdGlvbnMpLnRvTG93ZXJDYXNlKCksIC8vIFBhcnNlIGNvbW1hbmRcblx0XHRyZXR1cm5lZCA9IE5VTEwsXG5cdFx0YXJncyA9ICQubWFrZUFycmF5KGFyZ3VtZW50cykuc2xpY2UoMSksXG5cdFx0ZXZlbnQgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0sXG5cdFx0b3B0cyA9IHRoaXNbMF0gPyAkLmRhdGEodGhpc1swXSwgTkFNRVNQQUNFKSA6IE5VTEw7XG5cblx0Ly8gQ2hlY2sgZm9yIEFQSSByZXF1ZXN0XG5cdGlmKCFhcmd1bWVudHMubGVuZ3RoICYmIG9wdHMgfHwgY29tbWFuZCA9PT0gJ2FwaScpIHtcblx0XHRyZXR1cm4gb3B0cztcblx0fVxuXG5cdC8vIEV4ZWN1dGUgQVBJIGNvbW1hbmQgaWYgcHJlc2VudFxuXHRlbHNlIGlmKCdzdHJpbmcnID09PSB0eXBlb2Ygb3B0aW9ucykge1xuXHRcdHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhcGkgPSAkLmRhdGEodGhpcywgTkFNRVNQQUNFKTtcblx0XHRcdGlmKCFhcGkpIHsgcmV0dXJuIFRSVUU7IH1cblxuXHRcdFx0Ly8gQ2FjaGUgdGhlIGV2ZW50IGlmIHBvc3NpYmxlXG5cdFx0XHRpZihldmVudCAmJiBldmVudC50aW1lU3RhbXApIHsgYXBpLmNhY2hlLmV2ZW50ID0gZXZlbnQ7IH1cblxuXHRcdFx0Ly8gQ2hlY2sgZm9yIHNwZWNpZmljIEFQSSBjb21tYW5kc1xuXHRcdFx0aWYobm90YXRpb24gJiYgKGNvbW1hbmQgPT09ICdvcHRpb24nIHx8IGNvbW1hbmQgPT09ICdvcHRpb25zJykpIHtcblx0XHRcdFx0aWYobmV3VmFsdWUgIT09IHVuZGVmaW5lZCB8fCAkLmlzUGxhaW5PYmplY3Qobm90YXRpb24pKSB7XG5cdFx0XHRcdFx0YXBpLnNldChub3RhdGlvbiwgbmV3VmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybmVkID0gYXBpLmdldChub3RhdGlvbik7XG5cdFx0XHRcdFx0cmV0dXJuIEZBTFNFO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEV4ZWN1dGUgQVBJIGNvbW1hbmRcblx0XHRcdGVsc2UgaWYoYXBpW2NvbW1hbmRdKSB7XG5cdFx0XHRcdGFwaVtjb21tYW5kXS5hcHBseShhcGksIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHJldHVybmVkICE9PSBOVUxMID8gcmV0dXJuZWQgOiB0aGlzO1xuXHR9XG5cblx0Ly8gTm8gQVBJIGNvbW1hbmRzLiB2YWxpZGF0ZSBwcm92aWRlZCBvcHRpb25zIGFuZCBzZXR1cCBxVGlwc1xuXHRlbHNlIGlmKCdvYmplY3QnID09PSB0eXBlb2Ygb3B0aW9ucyB8fCAhYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdC8vIFNhbml0aXplIG9wdGlvbnMgZmlyc3Rcblx0XHRvcHRzID0gc2FuaXRpemVPcHRpb25zKCQuZXh0ZW5kKFRSVUUsIHt9LCBvcHRpb25zKSk7XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGkpIHtcblx0XHRcdHZhciBhcGksIGlkO1xuXG5cdFx0XHQvLyBGaW5kIG5leHQgYXZhaWxhYmxlIElELCBvciB1c2UgY3VzdG9tIElEIGlmIHByb3ZpZGVkXG5cdFx0XHRpZCA9ICQuaXNBcnJheShvcHRzLmlkKSA/IG9wdHMuaWRbaV0gOiBvcHRzLmlkO1xuXHRcdFx0aWQgPSAhaWQgfHwgaWQgPT09IEZBTFNFIHx8IGlkLmxlbmd0aCA8IDEgfHwgUVRJUC5hcGlbaWRdID8gUVRJUC5uZXh0aWQrKyA6IGlkO1xuXG5cdFx0XHQvLyBJbml0aWFsaXplIHRoZSBxVGlwIGFuZCByZS1ncmFiIG5ld2x5IHNhbml0aXplZCBvcHRpb25zXG5cdFx0XHRhcGkgPSBpbml0KCQodGhpcyksIGlkLCBvcHRzKTtcblx0XHRcdGlmKGFwaSA9PT0gRkFMU0UpIHsgcmV0dXJuIFRSVUU7IH1cblx0XHRcdGVsc2UgeyBRVElQLmFwaVtpZF0gPSBhcGk7IH1cblxuXHRcdFx0Ly8gSW5pdGlhbGl6ZSBwbHVnaW5zXG5cdFx0XHQkLmVhY2goUExVR0lOUywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmKHRoaXMuaW5pdGlhbGl6ZSA9PT0gJ2luaXRpYWxpemUnKSB7IHRoaXMoYXBpKTsgfVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEFzc2lnbiBpbml0aWFsIHByZS1yZW5kZXIgZXZlbnRzXG5cdFx0XHRhcGkuX2Fzc2lnbkluaXRpYWxFdmVudHMoZXZlbnQpO1xuXHRcdH0pO1xuXHR9XG59O1xuXG4vLyBFeHBvc2UgY2xhc3NcbiQucXRpcCA9IFFUaXA7XG5cbi8vIFBvcHVsYXRlZCBpbiByZW5kZXIgbWV0aG9kXG5RVElQLmFwaSA9IHt9O1xuOyQuZWFjaCh7XG5cdC8qIEFsbG93IG90aGVyIHBsdWdpbnMgdG8gc3VjY2Vzc2Z1bGx5IHJldHJpZXZlIHRoZSB0aXRsZSBvZiBhbiBlbGVtZW50IHdpdGggYSBxVGlwIGFwcGxpZWQgKi9cblx0YXR0cjogZnVuY3Rpb24oYXR0ciwgdmFsKSB7XG5cdFx0aWYodGhpcy5sZW5ndGgpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpc1swXSxcblx0XHRcdFx0dGl0bGUgPSAndGl0bGUnLFxuXHRcdFx0XHRhcGkgPSAkLmRhdGEoc2VsZiwgJ3F0aXAnKTtcblxuXHRcdFx0aWYoYXR0ciA9PT0gdGl0bGUgJiYgYXBpICYmIGFwaS5vcHRpb25zICYmICdvYmplY3QnID09PSB0eXBlb2YgYXBpICYmICdvYmplY3QnID09PSB0eXBlb2YgYXBpLm9wdGlvbnMgJiYgYXBpLm9wdGlvbnMuc3VwcHJlc3MpIHtcblx0XHRcdFx0aWYoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcblx0XHRcdFx0XHRyZXR1cm4gJC5hdHRyKHNlbGYsIG9sZHRpdGxlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIHFUaXAgaXMgcmVuZGVyZWQgYW5kIHRpdGxlIHdhcyBvcmlnaW5hbGx5IHVzZWQgYXMgY29udGVudCwgdXBkYXRlIGl0XG5cdFx0XHRcdGlmKGFwaSAmJiBhcGkub3B0aW9ucy5jb250ZW50LmF0dHIgPT09IHRpdGxlICYmIGFwaS5jYWNoZS5hdHRyKSB7XG5cdFx0XHRcdFx0YXBpLnNldCgnY29udGVudC50ZXh0JywgdmFsKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFVzZSB0aGUgcmVndWxhciBhdHRyIG1ldGhvZCB0byBzZXQsIHRoZW4gY2FjaGUgdGhlIHJlc3VsdFxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hdHRyKG9sZHRpdGxlLCB2YWwpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAkLmZuWydhdHRyJytyZXBsYWNlU3VmZml4XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR9LFxuXG5cdC8qIEFsbG93IGNsb25lIHRvIGNvcnJlY3RseSByZXRyaWV2ZSBjYWNoZWQgdGl0bGUgYXR0cmlidXRlcyAqL1xuXHRjbG9uZTogZnVuY3Rpb24oa2VlcERhdGEpIHtcblx0XHQvLyBDbG9uZSBvdXIgZWxlbWVudCB1c2luZyB0aGUgcmVhbCBjbG9uZSBtZXRob2Rcblx0XHR2YXIgZWxlbXMgPSAkLmZuWydjbG9uZScrcmVwbGFjZVN1ZmZpeF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuXHRcdC8vIEdyYWIgYWxsIGVsZW1lbnRzIHdpdGggYW4gb2xkdGl0bGUgc2V0LCBhbmQgY2hhbmdlIGl0IHRvIHJlZ3VsYXIgdGl0bGUgYXR0cmlidXRlLCBpZiBrZWVwRGF0YSBpcyBmYWxzZVxuXHRcdGlmKCFrZWVwRGF0YSkge1xuXHRcdFx0ZWxlbXMuZmlsdGVyKCdbJytvbGR0aXRsZSsnXScpLmF0dHIoJ3RpdGxlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiAkLmF0dHIodGhpcywgb2xkdGl0bGUpO1xuXHRcdFx0fSlcblx0XHRcdC5yZW1vdmVBdHRyKG9sZHRpdGxlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZWxlbXM7XG5cdH1cbn0sIGZ1bmN0aW9uKG5hbWUsIGZ1bmMpIHtcblx0aWYoIWZ1bmMgfHwgJC5mbltuYW1lK3JlcGxhY2VTdWZmaXhdKSB7IHJldHVybiBUUlVFOyB9XG5cblx0dmFyIG9sZCA9ICQuZm5bbmFtZStyZXBsYWNlU3VmZml4XSA9ICQuZm5bbmFtZV07XG5cdCQuZm5bbmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG9sZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR9O1xufSk7XG5cbi8qIEZpcmUgb2ZmICdyZW1vdmVxdGlwJyBoYW5kbGVyIGluICQuY2xlYW5EYXRhIGlmIGpRdWVyeSBVSSBub3QgcHJlc2VudCAoaXQgYWxyZWFkeSBkb2VzIHNpbWlsYXIpLlxuICogVGhpcyBzbmlwcGV0IGlzIHRha2VuIGRpcmVjdGx5IGZyb20galF1ZXJ5IFVJIHNvdXJjZSBjb2RlIGZvdW5kIGhlcmU6XG4gKiAgICAgaHR0cDovL2NvZGUuanF1ZXJ5LmNvbS91aS9qcXVlcnktdWktZ2l0LmpzXG4gKi9cbmlmKCEkLnVpKSB7XG5cdCRbJ2NsZWFuRGF0YScrcmVwbGFjZVN1ZmZpeF0gPSAkLmNsZWFuRGF0YTtcblx0JC5jbGVhbkRhdGEgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG5cdFx0Zm9yKHZhciBpID0gMCwgZWxlbTsgKGVsZW0gPSAkKCBlbGVtc1tpXSApKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYoZWxlbS5hdHRyKEFUVFJfSEFTKSkge1xuXHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBuby1lbXB0eSAqL1xuXHRcdFx0XHR0cnkgeyBlbGVtLnRyaWdnZXJIYW5kbGVyKCdyZW1vdmVxdGlwJyk7IH1cblx0XHRcdFx0Y2F0Y2goIGUgKSB7fVxuXHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG5vLWVtcHR5ICovXG5cdFx0XHR9XG5cdFx0fVxuXHRcdCRbJ2NsZWFuRGF0YScrcmVwbGFjZVN1ZmZpeF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0fTtcbn1cbjsvLyBxVGlwIHZlcnNpb25cblFUSVAudmVyc2lvbiA9ICczLjAuMyc7XG5cbi8vIEJhc2UgSUQgZm9yIGFsbCBxVGlwc1xuUVRJUC5uZXh0aWQgPSAwO1xuXG4vLyBJbmFjdGl2ZSBldmVudHMgYXJyYXlcblFUSVAuaW5hY3RpdmVFdmVudHMgPSBJTkFDVElWRV9FVkVOVFM7XG5cbi8vIEJhc2Ugei1pbmRleCBmb3IgYWxsIHFUaXBzXG5RVElQLnppbmRleCA9IDE1MDAwO1xuXG4vLyBEZWZpbmUgY29uZmlndXJhdGlvbiBkZWZhdWx0c1xuUVRJUC5kZWZhdWx0cyA9IHtcblx0cHJlcmVuZGVyOiBGQUxTRSxcblx0aWQ6IEZBTFNFLFxuXHRvdmVyd3JpdGU6IFRSVUUsXG5cdHN1cHByZXNzOiBUUlVFLFxuXHRjb250ZW50OiB7XG5cdFx0dGV4dDogVFJVRSxcblx0XHRhdHRyOiAndGl0bGUnLFxuXHRcdHRpdGxlOiBGQUxTRSxcblx0XHRidXR0b246IEZBTFNFXG5cdH0sXG5cdHBvc2l0aW9uOiB7XG5cdFx0bXk6ICd0b3AgbGVmdCcsXG5cdFx0YXQ6ICdib3R0b20gcmlnaHQnLFxuXHRcdHRhcmdldDogRkFMU0UsXG5cdFx0Y29udGFpbmVyOiBGQUxTRSxcblx0XHR2aWV3cG9ydDogRkFMU0UsXG5cdFx0YWRqdXN0OiB7XG5cdFx0XHR4OiAwLCB5OiAwLFxuXHRcdFx0bW91c2U6IFRSVUUsXG5cdFx0XHRzY3JvbGw6IFRSVUUsXG5cdFx0XHRyZXNpemU6IFRSVUUsXG5cdFx0XHRtZXRob2Q6ICdmbGlwaW52ZXJ0IGZsaXBpbnZlcnQnXG5cdFx0fSxcblx0XHRlZmZlY3Q6IGZ1bmN0aW9uKGFwaSwgcG9zKSB7XG5cdFx0XHQkKHRoaXMpLmFuaW1hdGUocG9zLCB7XG5cdFx0XHRcdGR1cmF0aW9uOiAyMDAsXG5cdFx0XHRcdHF1ZXVlOiBGQUxTRVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXHRzaG93OiB7XG5cdFx0dGFyZ2V0OiBGQUxTRSxcblx0XHRldmVudDogJ21vdXNlZW50ZXInLFxuXHRcdGVmZmVjdDogVFJVRSxcblx0XHRkZWxheTogOTAsXG5cdFx0c29sbzogRkFMU0UsXG5cdFx0cmVhZHk6IEZBTFNFLFxuXHRcdGF1dG9mb2N1czogRkFMU0Vcblx0fSxcblx0aGlkZToge1xuXHRcdHRhcmdldDogRkFMU0UsXG5cdFx0ZXZlbnQ6ICdtb3VzZWxlYXZlJyxcblx0XHRlZmZlY3Q6IFRSVUUsXG5cdFx0ZGVsYXk6IDAsXG5cdFx0Zml4ZWQ6IEZBTFNFLFxuXHRcdGluYWN0aXZlOiBGQUxTRSxcblx0XHRsZWF2ZTogJ3dpbmRvdycsXG5cdFx0ZGlzdGFuY2U6IEZBTFNFXG5cdH0sXG5cdHN0eWxlOiB7XG5cdFx0Y2xhc3NlczogJycsXG5cdFx0d2lkZ2V0OiBGQUxTRSxcblx0XHR3aWR0aDogRkFMU0UsXG5cdFx0aGVpZ2h0OiBGQUxTRSxcblx0XHRkZWY6IFRSVUVcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0cmVuZGVyOiBOVUxMLFxuXHRcdG1vdmU6IE5VTEwsXG5cdFx0c2hvdzogTlVMTCxcblx0XHRoaWRlOiBOVUxMLFxuXHRcdHRvZ2dsZTogTlVMTCxcblx0XHR2aXNpYmxlOiBOVUxMLFxuXHRcdGhpZGRlbjogTlVMTCxcblx0XHRmb2N1czogTlVMTCxcblx0XHRibHVyOiBOVUxMXG5cdH1cbn07XG47dmFyIFRJUCxcbmNyZWF0ZVZNTCxcblNDQUxFLFxuUElYRUxfUkFUSU8sXG5CQUNLSU5HX1NUT1JFX1JBVElPLFxuXG4vLyBDb21tb24gQ1NTIHN0cmluZ3Ncbk1BUkdJTiA9ICdtYXJnaW4nLFxuQk9SREVSID0gJ2JvcmRlcicsXG5DT0xPUiA9ICdjb2xvcicsXG5CR19DT0xPUiA9ICdiYWNrZ3JvdW5kLWNvbG9yJyxcblRSQU5TUEFSRU5UID0gJ3RyYW5zcGFyZW50JyxcbklNUE9SVEFOVCA9ICcgIWltcG9ydGFudCcsXG5cbi8vIENoZWNrIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIDxjYW52YXMvPiBlbGVtZW50c1xuSEFTQ0FOVkFTID0gISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0LFxuXG4vLyBJbnZhbGlkIGNvbG91ciB2YWx1ZXMgdXNlZCBpbiBwYXJzZUNvbG91cnMoKVxuSU5WQUxJRCA9IC9yZ2JhP1xcKDAsIDAsIDAoLCAwKT9cXCl8dHJhbnNwYXJlbnR8IzEyMzQ1Ni9pO1xuXG4vLyBDYW1lbC1jYXNlIG1ldGhvZCwgdGFrZW4gZnJvbSBqUXVlcnkgc291cmNlXG4vLyBodHRwOi8vY29kZS5qcXVlcnkuY29tL2pxdWVyeS0xLjguMC5qc1xuZnVuY3Rpb24gY2FtZWwocykgeyByZXR1cm4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSk7IH1cblxuLypcbiAqIE1vZGlmaWVkIGZyb20gTW9kZXJuaXpyJ3MgdGVzdFByb3BzQWxsKClcbiAqIGh0dHA6Ly9tb2Rlcm5penIuY29tL2Rvd25sb2Fkcy9tb2Rlcm5penItbGF0ZXN0LmpzXG4gKi9cbnZhciBjc3NQcm9wcyA9IHt9LCBjc3NQcmVmaXhlcyA9IFsnV2Via2l0JywgJ08nLCAnTW96JywgJ21zJ107XG5mdW5jdGlvbiB2ZW5kb3JDc3MoZWxlbSwgcHJvcCkge1xuXHR2YXIgdWNQcm9wID0gcHJvcC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3Auc2xpY2UoMSksXG5cdFx0cHJvcHMgPSAocHJvcCArICcgJyArIGNzc1ByZWZpeGVzLmpvaW4odWNQcm9wICsgJyAnKSArIHVjUHJvcCkuc3BsaXQoJyAnKSxcblx0XHRjdXIsIHZhbCwgaSA9IDA7XG5cblx0Ly8gSWYgdGhlIHByb3BlcnR5IGhhcyBhbHJlYWR5IGJlZW4gbWFwcGVkLi4uXG5cdGlmKGNzc1Byb3BzW3Byb3BdKSB7IHJldHVybiBlbGVtLmNzcyhjc3NQcm9wc1twcm9wXSk7IH1cblxuXHR3aGlsZShjdXIgPSBwcm9wc1tpKytdKSB7XG5cdFx0aWYoKHZhbCA9IGVsZW0uY3NzKGN1cikpICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGNzc1Byb3BzW3Byb3BdID0gY3VyO1xuXHRcdFx0cmV0dXJuIHZhbDtcblx0XHR9XG5cdH1cbn1cblxuLy8gUGFyc2UgYSBnaXZlbiBlbGVtZW50cyBDU1MgcHJvcGVydHkgaW50byBhbiBpbnRcbmZ1bmN0aW9uIGludENzcyhlbGVtLCBwcm9wKSB7XG5cdHJldHVybiBNYXRoLmNlaWwocGFyc2VGbG9hdCh2ZW5kb3JDc3MoZWxlbSwgcHJvcCkpKTtcbn1cblxuXG4vLyBWTUwgY3JlYXRpb24gKGZvciBJRSBvbmx5KVxuaWYoIUhBU0NBTlZBUykge1xuXHRjcmVhdGVWTUwgPSBmdW5jdGlvbih0YWcsIHByb3BzLCBzdHlsZSkge1xuXHRcdHJldHVybiAnPHF0aXB2bWw6Jyt0YWcrJyB4bWxucz1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC5jb206dm1sXCIgY2xhc3M9XCJxdGlwLXZtbFwiICcrKHByb3BzfHwnJykrXG5cdFx0XHQnIHN0eWxlPVwiYmVoYXZpb3I6IHVybCgjZGVmYXVsdCNWTUwpOyAnKyhzdHlsZXx8JycpKyAnXCIgLz4nO1xuXHR9O1xufVxuXG4vLyBDYW52YXMgb25seSBkZWZpbml0aW9uc1xuZWxzZSB7XG5cdFBJWEVMX1JBVElPID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcblx0QkFDS0lOR19TVE9SRV9SQVRJTyA9IChmdW5jdGlvbigpIHtcblx0XHR2YXIgY29udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLmdldENvbnRleHQoJzJkJyk7XG5cdFx0cmV0dXJuIGNvbnRleHQuYmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fCBjb250ZXh0LndlYmtpdEJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgY29udGV4dC5tb3pCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG5cdFx0XHRcdGNvbnRleHQubXNCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8IGNvbnRleHQub0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgMTtcblx0fSkoKTtcblx0U0NBTEUgPSBQSVhFTF9SQVRJTyAvIEJBQ0tJTkdfU1RPUkVfUkFUSU87XG59XG5cblxuZnVuY3Rpb24gVGlwKHF0aXAsIG9wdGlvbnMpIHtcblx0dGhpcy5fbnMgPSAndGlwJztcblx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0dGhpcy5vZmZzZXQgPSBvcHRpb25zLm9mZnNldDtcblx0dGhpcy5zaXplID0gWyBvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodCBdO1xuXG5cdC8vIEluaXRpYWxpemVcblx0dGhpcy5xdGlwID0gcXRpcDtcblx0dGhpcy5pbml0KHF0aXApO1xufVxuXG4kLmV4dGVuZChUaXAucHJvdG90eXBlLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKHF0aXApIHtcblx0XHR2YXIgY29udGV4dCwgdGlwO1xuXG5cdFx0Ly8gQ3JlYXRlIHRpcCBlbGVtZW50IGFuZCBwcmVwZW5kIHRvIHRoZSB0b29sdGlwXG5cdFx0dGlwID0gdGhpcy5lbGVtZW50ID0gcXRpcC5lbGVtZW50cy50aXAgPSAkKCc8ZGl2IC8+JywgeyAnY2xhc3MnOiBOQU1FU1BBQ0UrJy10aXAnIH0pLnByZXBlbmRUbyhxdGlwLnRvb2x0aXApO1xuXG5cdFx0Ly8gQ3JlYXRlIHRpcCBkcmF3aW5nIGVsZW1lbnQocylcblx0XHRpZihIQVNDQU5WQVMpIHtcblx0XHRcdC8vIHNhdmUoKSBhcyBzb29uIGFzIHdlIGNyZWF0ZSB0aGUgY2FudmFzIGVsZW1lbnQgc28gRkYyIGRvZXNuJ3QgYm9yayBvbiBvdXIgZmlyc3QgcmVzdG9yZSgpIVxuXHRcdFx0Y29udGV4dCA9ICQoJzxjYW52YXMgLz4nKS5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpWzBdLmdldENvbnRleHQoJzJkJyk7XG5cblx0XHRcdC8vIFNldHVwIGNvbnN0YW50IHBhcmFtZXRlcnNcblx0XHRcdGNvbnRleHQubGluZUpvaW4gPSAnbWl0ZXInO1xuXHRcdFx0Y29udGV4dC5taXRlckxpbWl0ID0gMTAwMDAwO1xuXHRcdFx0Y29udGV4dC5zYXZlKCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Y29udGV4dCA9IGNyZWF0ZVZNTCgnc2hhcGUnLCAnY29vcmRvcmlnaW49XCIwLDBcIicsICdwb3NpdGlvbjphYnNvbHV0ZTsnKTtcblx0XHRcdHRoaXMuZWxlbWVudC5odG1sKGNvbnRleHQgKyBjb250ZXh0KTtcblxuXHRcdFx0Ly8gUHJldmVudCBtb3VzaW5nIGRvd24gb24gdGhlIHRpcCBzaW5jZSBpdCBjYXVzZXMgcHJvYmxlbXMgd2l0aCAubGl2ZSgpIGhhbmRsaW5nIGluIElFIGR1ZSB0byBWTUxcblx0XHRcdHF0aXAuX2JpbmQoICQoJyonLCB0aXApLmFkZCh0aXApLCBbJ2NsaWNrJywgJ21vdXNlZG93biddLCBmdW5jdGlvbihldmVudCkgeyBldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgfSwgdGhpcy5fbnMpO1xuXHRcdH1cblxuXHRcdC8vIEJpbmQgdXBkYXRlIGV2ZW50c1xuXHRcdHF0aXAuX2JpbmQocXRpcC50b29sdGlwLCAndG9vbHRpcG1vdmUnLCB0aGlzLnJlcG9zaXRpb24sIHRoaXMuX25zLCB0aGlzKTtcblxuXHRcdC8vIENyZWF0ZSBpdFxuXHRcdHRoaXMuY3JlYXRlKCk7XG5cdH0sXG5cblx0X3N3YXBEaW1lbnNpb25zOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNpemVbMF0gPSB0aGlzLm9wdGlvbnMuaGVpZ2h0O1xuXHRcdHRoaXMuc2l6ZVsxXSA9IHRoaXMub3B0aW9ucy53aWR0aDtcblx0fSxcblx0X3Jlc2V0RGltZW5zaW9uczogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zaXplWzBdID0gdGhpcy5vcHRpb25zLndpZHRoO1xuXHRcdHRoaXMuc2l6ZVsxXSA9IHRoaXMub3B0aW9ucy5oZWlnaHQ7XG5cdH0sXG5cblx0X3VzZVRpdGxlOiBmdW5jdGlvbihjb3JuZXIpIHtcblx0XHR2YXIgdGl0bGViYXIgPSB0aGlzLnF0aXAuZWxlbWVudHMudGl0bGViYXI7XG5cdFx0cmV0dXJuIHRpdGxlYmFyICYmIChcblx0XHRcdGNvcm5lci55ID09PSBUT1AgfHwgY29ybmVyLnkgPT09IENFTlRFUiAmJiB0aGlzLmVsZW1lbnQucG9zaXRpb24oKS50b3AgKyB0aGlzLnNpemVbMV0gLyAyICsgdGhpcy5vcHRpb25zLm9mZnNldCA8IHRpdGxlYmFyLm91dGVySGVpZ2h0KFRSVUUpXG5cdFx0KTtcblx0fSxcblxuXHRfcGFyc2VDb3JuZXI6IGZ1bmN0aW9uKGNvcm5lcikge1xuXHRcdHZhciBteSA9IHRoaXMucXRpcC5vcHRpb25zLnBvc2l0aW9uLm15O1xuXG5cdFx0Ly8gRGV0ZWN0IGNvcm5lciBhbmQgbWltaWMgcHJvcGVydGllc1xuXHRcdGlmKGNvcm5lciA9PT0gRkFMU0UgfHwgbXkgPT09IEZBTFNFKSB7XG5cdFx0XHRjb3JuZXIgPSBGQUxTRTtcblx0XHR9XG5cdFx0ZWxzZSBpZihjb3JuZXIgPT09IFRSVUUpIHtcblx0XHRcdGNvcm5lciA9IG5ldyBDT1JORVIoIG15LnN0cmluZygpICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYoIWNvcm5lci5zdHJpbmcpIHtcblx0XHRcdGNvcm5lciA9IG5ldyBDT1JORVIoY29ybmVyKTtcblx0XHRcdGNvcm5lci5maXhlZCA9IFRSVUU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvcm5lcjtcblx0fSxcblxuXHRfcGFyc2VXaWR0aDogZnVuY3Rpb24oY29ybmVyLCBzaWRlLCB1c2UpIHtcblx0XHR2YXIgZWxlbWVudHMgPSB0aGlzLnF0aXAuZWxlbWVudHMsXG5cdFx0XHRwcm9wID0gQk9SREVSICsgY2FtZWwoc2lkZSkgKyAnV2lkdGgnO1xuXG5cdFx0cmV0dXJuICh1c2UgPyBpbnRDc3ModXNlLCBwcm9wKSA6IFxuXHRcdFx0aW50Q3NzKGVsZW1lbnRzLmNvbnRlbnQsIHByb3ApIHx8XG5cdFx0XHRpbnRDc3ModGhpcy5fdXNlVGl0bGUoY29ybmVyKSAmJiBlbGVtZW50cy50aXRsZWJhciB8fCBlbGVtZW50cy5jb250ZW50LCBwcm9wKSB8fFxuXHRcdFx0aW50Q3NzKGVsZW1lbnRzLnRvb2x0aXAsIHByb3ApXG5cdFx0KSB8fCAwO1xuXHR9LFxuXG5cdF9wYXJzZVJhZGl1czogZnVuY3Rpb24oY29ybmVyKSB7XG5cdFx0dmFyIGVsZW1lbnRzID0gdGhpcy5xdGlwLmVsZW1lbnRzLFxuXHRcdFx0cHJvcCA9IEJPUkRFUiArIGNhbWVsKGNvcm5lci55KSArIGNhbWVsKGNvcm5lci54KSArICdSYWRpdXMnO1xuXG5cdFx0cmV0dXJuIEJST1dTRVIuaWUgPCA5ID8gMCA6XG5cdFx0XHRpbnRDc3ModGhpcy5fdXNlVGl0bGUoY29ybmVyKSAmJiBlbGVtZW50cy50aXRsZWJhciB8fCBlbGVtZW50cy5jb250ZW50LCBwcm9wKSB8fFxuXHRcdFx0aW50Q3NzKGVsZW1lbnRzLnRvb2x0aXAsIHByb3ApIHx8IDA7XG5cdH0sXG5cblx0X2ludmFsaWRDb2xvdXI6IGZ1bmN0aW9uKGVsZW0sIHByb3AsIGNvbXBhcmUpIHtcblx0XHR2YXIgdmFsID0gZWxlbS5jc3MocHJvcCk7XG5cdFx0cmV0dXJuICF2YWwgfHwgY29tcGFyZSAmJiB2YWwgPT09IGVsZW0uY3NzKGNvbXBhcmUpIHx8IElOVkFMSUQudGVzdCh2YWwpID8gRkFMU0UgOiB2YWw7XG5cdH0sXG5cblx0X3BhcnNlQ29sb3VyczogZnVuY3Rpb24oY29ybmVyKSB7XG5cdFx0dmFyIGVsZW1lbnRzID0gdGhpcy5xdGlwLmVsZW1lbnRzLFxuXHRcdFx0dGlwID0gdGhpcy5lbGVtZW50LmNzcygnY3NzVGV4dCcsICcnKSxcblx0XHRcdGJvcmRlclNpZGUgPSBCT1JERVIgKyBjYW1lbChjb3JuZXJbIGNvcm5lci5wcmVjZWRhbmNlIF0pICsgY2FtZWwoQ09MT1IpLFxuXHRcdFx0Y29sb3JFbGVtID0gdGhpcy5fdXNlVGl0bGUoY29ybmVyKSAmJiBlbGVtZW50cy50aXRsZWJhciB8fCBlbGVtZW50cy5jb250ZW50LFxuXHRcdFx0Y3NzID0gdGhpcy5faW52YWxpZENvbG91ciwgY29sb3IgPSBbXTtcblxuXHRcdC8vIEF0dGVtcHQgdG8gZGV0ZWN0IHRoZSBiYWNrZ3JvdW5kIGNvbG91ciBmcm9tIHZhcmlvdXMgZWxlbWVudHMsIGxlZnQtdG8tcmlnaHQgcHJlY2VkYW5jZVxuXHRcdGNvbG9yWzBdID0gY3NzKHRpcCwgQkdfQ09MT1IpIHx8IGNzcyhjb2xvckVsZW0sIEJHX0NPTE9SKSB8fCBjc3MoZWxlbWVudHMuY29udGVudCwgQkdfQ09MT1IpIHx8XG5cdFx0XHRjc3MoZWxlbWVudHMudG9vbHRpcCwgQkdfQ09MT1IpIHx8IHRpcC5jc3MoQkdfQ09MT1IpO1xuXG5cdFx0Ly8gQXR0ZW1wdCB0byBkZXRlY3QgdGhlIGNvcnJlY3QgYm9yZGVyIHNpZGUgY29sb3VyIGZyb20gdmFyaW91cyBlbGVtZW50cywgbGVmdC10by1yaWdodCBwcmVjZWRhbmNlXG5cdFx0Y29sb3JbMV0gPSBjc3ModGlwLCBib3JkZXJTaWRlLCBDT0xPUikgfHwgY3NzKGNvbG9yRWxlbSwgYm9yZGVyU2lkZSwgQ09MT1IpIHx8XG5cdFx0XHRjc3MoZWxlbWVudHMuY29udGVudCwgYm9yZGVyU2lkZSwgQ09MT1IpIHx8IGNzcyhlbGVtZW50cy50b29sdGlwLCBib3JkZXJTaWRlLCBDT0xPUikgfHwgZWxlbWVudHMudG9vbHRpcC5jc3MoYm9yZGVyU2lkZSk7XG5cblx0XHQvLyBSZXNldCBiYWNrZ3JvdW5kIGFuZCBib3JkZXIgY29sb3Vyc1xuXHRcdCQoJyonLCB0aXApLmFkZCh0aXApLmNzcygnY3NzVGV4dCcsIEJHX0NPTE9SKyc6JytUUkFOU1BBUkVOVCtJTVBPUlRBTlQrJzsnK0JPUkRFUisnOjAnK0lNUE9SVEFOVCsnOycpO1xuXG5cdFx0cmV0dXJuIGNvbG9yO1xuXHR9LFxuXG5cdF9jYWxjdWxhdGVTaXplOiBmdW5jdGlvbihjb3JuZXIpIHtcblx0XHR2YXIgeSA9IGNvcm5lci5wcmVjZWRhbmNlID09PSBZLFxuXHRcdFx0d2lkdGggPSB0aGlzLm9wdGlvbnMud2lkdGgsXG5cdFx0XHRoZWlnaHQgPSB0aGlzLm9wdGlvbnMuaGVpZ2h0LFxuXHRcdFx0aXNDZW50ZXIgPSBjb3JuZXIuYWJicmV2KCkgPT09ICdjJyxcblx0XHRcdGJhc2UgPSAoeSA/IHdpZHRoOiBoZWlnaHQpICogKGlzQ2VudGVyID8gMC41IDogMSksXG5cdFx0XHRwb3cgPSBNYXRoLnBvdyxcblx0XHRcdHJvdW5kID0gTWF0aC5yb3VuZCxcblx0XHRcdGJpZ0h5cCwgcmF0aW8sIHJlc3VsdCxcblxuXHRcdHNtYWxsSHlwID0gTWF0aC5zcXJ0KCBwb3coYmFzZSwgMikgKyBwb3coaGVpZ2h0LCAyKSApLFxuXHRcdGh5cCA9IFtcblx0XHRcdHRoaXMuYm9yZGVyIC8gYmFzZSAqIHNtYWxsSHlwLFxuXHRcdFx0dGhpcy5ib3JkZXIgLyBoZWlnaHQgKiBzbWFsbEh5cFxuXHRcdF07XG5cblx0XHRoeXBbMl0gPSBNYXRoLnNxcnQoIHBvdyhoeXBbMF0sIDIpIC0gcG93KHRoaXMuYm9yZGVyLCAyKSApO1xuXHRcdGh5cFszXSA9IE1hdGguc3FydCggcG93KGh5cFsxXSwgMikgLSBwb3codGhpcy5ib3JkZXIsIDIpICk7XG5cblx0XHRiaWdIeXAgPSBzbWFsbEh5cCArIGh5cFsyXSArIGh5cFszXSArIChpc0NlbnRlciA/IDAgOiBoeXBbMF0pO1xuXHRcdHJhdGlvID0gYmlnSHlwIC8gc21hbGxIeXA7XG5cblx0XHRyZXN1bHQgPSBbIHJvdW5kKHJhdGlvICogd2lkdGgpLCByb3VuZChyYXRpbyAqIGhlaWdodCkgXTtcblx0XHRyZXR1cm4geSA/IHJlc3VsdCA6IHJlc3VsdC5yZXZlcnNlKCk7XG5cdH0sXG5cblx0Ly8gVGlwIGNvb3JkaW5hdGVzIGNhbGN1bGF0b3Jcblx0X2NhbGN1bGF0ZVRpcDogZnVuY3Rpb24oY29ybmVyLCBzaXplLCBzY2FsZSkge1xuXHRcdHNjYWxlID0gc2NhbGUgfHwgMTtcblx0XHRzaXplID0gc2l6ZSB8fCB0aGlzLnNpemU7XG5cblx0XHR2YXIgd2lkdGggPSBzaXplWzBdICogc2NhbGUsXG5cdFx0XHRoZWlnaHQgPSBzaXplWzFdICogc2NhbGUsXG5cdFx0XHR3aWR0aDIgPSBNYXRoLmNlaWwod2lkdGggLyAyKSwgaGVpZ2h0MiA9IE1hdGguY2VpbChoZWlnaHQgLyAyKSxcblxuXHRcdC8vIERlZmluZSB0aXAgY29vcmRpbmF0ZXMgaW4gdGVybXMgb2YgaGVpZ2h0IGFuZCB3aWR0aCB2YWx1ZXNcblx0XHR0aXBzID0ge1xuXHRcdFx0YnI6XHRbMCwwLFx0XHR3aWR0aCxoZWlnaHQsXHR3aWR0aCwwXSxcblx0XHRcdGJsOlx0WzAsMCxcdFx0d2lkdGgsMCxcdFx0MCxoZWlnaHRdLFxuXHRcdFx0dHI6XHRbMCxoZWlnaHQsXHR3aWR0aCwwLFx0XHR3aWR0aCxoZWlnaHRdLFxuXHRcdFx0dGw6XHRbMCwwLFx0XHQwLGhlaWdodCxcdFx0d2lkdGgsaGVpZ2h0XSxcblx0XHRcdHRjOlx0WzAsaGVpZ2h0LFx0d2lkdGgyLDAsXHRcdHdpZHRoLGhlaWdodF0sXG5cdFx0XHRiYzpcdFswLDAsXHRcdHdpZHRoLDAsXHRcdHdpZHRoMixoZWlnaHRdLFxuXHRcdFx0cmM6XHRbMCwwLFx0XHR3aWR0aCxoZWlnaHQyLFx0MCxoZWlnaHRdLFxuXHRcdFx0bGM6XHRbd2lkdGgsMCxcdHdpZHRoLGhlaWdodCxcdDAsaGVpZ2h0Ml1cblx0XHR9O1xuXG5cdFx0Ly8gU2V0IGNvbW1vbiBzaWRlIHNoYXBlc1xuXHRcdHRpcHMubHQgPSB0aXBzLmJyOyB0aXBzLnJ0ID0gdGlwcy5ibDtcblx0XHR0aXBzLmxiID0gdGlwcy50cjsgdGlwcy5yYiA9IHRpcHMudGw7XG5cblx0XHRyZXR1cm4gdGlwc1sgY29ybmVyLmFiYnJldigpIF07XG5cdH0sXG5cblx0Ly8gVGlwIGNvb3JkaW5hdGVzIGRyYXdlciAoY2FudmFzKVxuXHRfZHJhd0Nvb3JkczogZnVuY3Rpb24oY29udGV4dCwgY29vcmRzKSB7XG5cdFx0Y29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRjb250ZXh0Lm1vdmVUbyhjb29yZHNbMF0sIGNvb3Jkc1sxXSk7XG5cdFx0Y29udGV4dC5saW5lVG8oY29vcmRzWzJdLCBjb29yZHNbM10pO1xuXHRcdGNvbnRleHQubGluZVRvKGNvb3Jkc1s0XSwgY29vcmRzWzVdKTtcblx0XHRjb250ZXh0LmNsb3NlUGF0aCgpO1xuXHR9LFxuXG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0Ly8gRGV0ZXJtaW5lIHRpcCBjb3JuZXJcblx0XHR2YXIgYyA9IHRoaXMuY29ybmVyID0gKEhBU0NBTlZBUyB8fCBCUk9XU0VSLmllKSAmJiB0aGlzLl9wYXJzZUNvcm5lcih0aGlzLm9wdGlvbnMuY29ybmVyKTtcblxuXHRcdC8vIElmIHdlIGhhdmUgYSB0aXAgY29ybmVyLi4uXG5cdFx0dGhpcy5lbmFibGVkID0gISF0aGlzLmNvcm5lciAmJiB0aGlzLmNvcm5lci5hYmJyZXYoKSAhPT0gJ2MnO1xuXHRcdGlmKHRoaXMuZW5hYmxlZCkge1xuXHRcdFx0Ly8gQ2FjaGUgaXRcblx0XHRcdHRoaXMucXRpcC5jYWNoZS5jb3JuZXIgPSBjLmNsb25lKCk7XG5cblx0XHRcdC8vIENyZWF0ZSBpdFxuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9XG5cblx0XHQvLyBUb2dnbGUgdGlwIGVsZW1lbnRcblx0XHR0aGlzLmVsZW1lbnQudG9nZ2xlKHRoaXMuZW5hYmxlZCk7XG5cblx0XHRyZXR1cm4gdGhpcy5jb3JuZXI7XG5cdH0sXG5cblx0dXBkYXRlOiBmdW5jdGlvbihjb3JuZXIsIHBvc2l0aW9uKSB7XG5cdFx0aWYoIXRoaXMuZW5hYmxlZCkgeyByZXR1cm4gdGhpczsgfVxuXG5cdFx0dmFyIGVsZW1lbnRzID0gdGhpcy5xdGlwLmVsZW1lbnRzLFxuXHRcdFx0dGlwID0gdGhpcy5lbGVtZW50LFxuXHRcdFx0aW5uZXIgPSB0aXAuY2hpbGRyZW4oKSxcblx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG5cdFx0XHRjdXJTaXplID0gdGhpcy5zaXplLFxuXHRcdFx0bWltaWMgPSBvcHRpb25zLm1pbWljLFxuXHRcdFx0cm91bmQgPSBNYXRoLnJvdW5kLFxuXHRcdFx0Y29sb3IsIHByZWNlZGFuY2UsIGNvbnRleHQsXG5cdFx0XHRjb29yZHMsIGJpZ0Nvb3JkcywgdHJhbnNsYXRlLCBuZXdTaXplLCBib3JkZXI7XG5cblx0XHQvLyBSZS1kZXRlcm1pbmUgdGlwIGlmIG5vdCBhbHJlYWR5IHNldFxuXHRcdGlmKCFjb3JuZXIpIHsgY29ybmVyID0gdGhpcy5xdGlwLmNhY2hlLmNvcm5lciB8fCB0aGlzLmNvcm5lcjsgfVxuXG5cdFx0Ly8gVXNlIGNvcm5lciBwcm9wZXJ0eSBpZiB3ZSBkZXRlY3QgYW4gaW52YWxpZCBtaW1pYyB2YWx1ZVxuXHRcdGlmKG1pbWljID09PSBGQUxTRSkgeyBtaW1pYyA9IGNvcm5lcjsgfVxuXG5cdFx0Ly8gT3RoZXJ3aXNlIGluaGVyaXQgbWltaWMgcHJvcGVydGllcyBmcm9tIHRoZSBjb3JuZXIgb2JqZWN0IGFzIG5lY2Vzc2FyeVxuXHRcdGVsc2Uge1xuXHRcdFx0bWltaWMgPSBuZXcgQ09STkVSKG1pbWljKTtcblx0XHRcdG1pbWljLnByZWNlZGFuY2UgPSBjb3JuZXIucHJlY2VkYW5jZTtcblxuXHRcdFx0aWYobWltaWMueCA9PT0gJ2luaGVyaXQnKSB7IG1pbWljLnggPSBjb3JuZXIueDsgfVxuXHRcdFx0ZWxzZSBpZihtaW1pYy55ID09PSAnaW5oZXJpdCcpIHsgbWltaWMueSA9IGNvcm5lci55OyB9XG5cdFx0XHRlbHNlIGlmKG1pbWljLnggPT09IG1pbWljLnkpIHtcblx0XHRcdFx0bWltaWNbIGNvcm5lci5wcmVjZWRhbmNlIF0gPSBjb3JuZXJbIGNvcm5lci5wcmVjZWRhbmNlIF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHByZWNlZGFuY2UgPSBtaW1pYy5wcmVjZWRhbmNlO1xuXG5cdFx0Ly8gRW5zdXJlIHRoZSB0aXAgd2lkdGguaGVpZ2h0IGFyZSByZWxhdGl2ZSB0byB0aGUgdGlwIHBvc2l0aW9uXG5cdFx0aWYoY29ybmVyLnByZWNlZGFuY2UgPT09IFgpIHsgdGhpcy5fc3dhcERpbWVuc2lvbnMoKTsgfVxuXHRcdGVsc2UgeyB0aGlzLl9yZXNldERpbWVuc2lvbnMoKTsgfVxuXG5cdFx0Ly8gVXBkYXRlIG91ciBjb2xvdXJzXG5cdFx0Y29sb3IgPSB0aGlzLmNvbG9yID0gdGhpcy5fcGFyc2VDb2xvdXJzKGNvcm5lcik7XG5cblx0XHQvLyBEZXRlY3QgYm9yZGVyIHdpZHRoLCB0YWtpbmcgaW50byBhY2NvdW50IGNvbG91cnNcblx0XHRpZihjb2xvclsxXSAhPT0gVFJBTlNQQVJFTlQpIHtcblx0XHRcdC8vIEdyYWIgYm9yZGVyIHdpZHRoXG5cdFx0XHRib3JkZXIgPSB0aGlzLmJvcmRlciA9IHRoaXMuX3BhcnNlV2lkdGgoY29ybmVyLCBjb3JuZXJbY29ybmVyLnByZWNlZGFuY2VdKTtcblxuXHRcdFx0Ly8gSWYgYm9yZGVyIHdpZHRoIGlzbid0IHplcm8sIHVzZSBib3JkZXIgY29sb3IgYXMgZmlsbCBpZiBpdCdzIG5vdCBpbnZhbGlkICgxLjAgc3R5bGUgdGlwcylcblx0XHRcdGlmKG9wdGlvbnMuYm9yZGVyICYmIGJvcmRlciA8IDEgJiYgIUlOVkFMSUQudGVzdChjb2xvclsxXSkpIHsgY29sb3JbMF0gPSBjb2xvclsxXTsgfVxuXG5cdFx0XHQvLyBTZXQgYm9yZGVyIHdpZHRoICh1c2UgZGV0ZWN0ZWQgYm9yZGVyIHdpZHRoIGlmIG9wdGlvbnMuYm9yZGVyIGlzIHRydWUpXG5cdFx0XHR0aGlzLmJvcmRlciA9IGJvcmRlciA9IG9wdGlvbnMuYm9yZGVyICE9PSBUUlVFID8gb3B0aW9ucy5ib3JkZXIgOiBib3JkZXI7XG5cdFx0fVxuXG5cdFx0Ly8gQm9yZGVyIGNvbG91ciB3YXMgaW52YWxpZCwgc2V0IGJvcmRlciB0byB6ZXJvXG5cdFx0ZWxzZSB7IHRoaXMuYm9yZGVyID0gYm9yZGVyID0gMDsgfVxuXG5cdFx0Ly8gRGV0ZXJtaW5lIHRpcCBzaXplXG5cdFx0bmV3U2l6ZSA9IHRoaXMuc2l6ZSA9IHRoaXMuX2NhbGN1bGF0ZVNpemUoY29ybmVyKTtcblx0XHR0aXAuY3NzKHtcblx0XHRcdHdpZHRoOiBuZXdTaXplWzBdLFxuXHRcdFx0aGVpZ2h0OiBuZXdTaXplWzFdLFxuXHRcdFx0bGluZUhlaWdodDogbmV3U2l6ZVsxXSsncHgnXG5cdFx0fSk7XG5cblx0XHQvLyBDYWxjdWxhdGUgdGlwIHRyYW5zbGF0aW9uXG5cdFx0aWYoY29ybmVyLnByZWNlZGFuY2UgPT09IFkpIHtcblx0XHRcdHRyYW5zbGF0ZSA9IFtcblx0XHRcdFx0cm91bmQobWltaWMueCA9PT0gTEVGVCA/IGJvcmRlciA6IG1pbWljLnggPT09IFJJR0hUID8gbmV3U2l6ZVswXSAtIGN1clNpemVbMF0gLSBib3JkZXIgOiAobmV3U2l6ZVswXSAtIGN1clNpemVbMF0pIC8gMiksXG5cdFx0XHRcdHJvdW5kKG1pbWljLnkgPT09IFRPUCA/IG5ld1NpemVbMV0gLSBjdXJTaXplWzFdIDogMClcblx0XHRcdF07XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dHJhbnNsYXRlID0gW1xuXHRcdFx0XHRyb3VuZChtaW1pYy54ID09PSBMRUZUID8gbmV3U2l6ZVswXSAtIGN1clNpemVbMF0gOiAwKSxcblx0XHRcdFx0cm91bmQobWltaWMueSA9PT0gVE9QID8gYm9yZGVyIDogbWltaWMueSA9PT0gQk9UVE9NID8gbmV3U2l6ZVsxXSAtIGN1clNpemVbMV0gLSBib3JkZXIgOiAobmV3U2l6ZVsxXSAtIGN1clNpemVbMV0pIC8gMilcblx0XHRcdF07XG5cdFx0fVxuXG5cdFx0Ly8gQ2FudmFzIGRyYXdpbmcgaW1wbGVtZW50YXRpb25cblx0XHRpZihIQVNDQU5WQVMpIHtcblx0XHRcdC8vIEdyYWIgY2FudmFzIGNvbnRleHQgYW5kIGNsZWFyL3NhdmUgaXRcblx0XHRcdGNvbnRleHQgPSBpbm5lclswXS5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0Y29udGV4dC5yZXN0b3JlKCk7IGNvbnRleHQuc2F2ZSgpO1xuXHRcdFx0Y29udGV4dC5jbGVhclJlY3QoMCwwLDYwMDAsNjAwMCk7XG5cblx0XHRcdC8vIENhbGN1bGF0ZSBjb29yZGluYXRlc1xuXHRcdFx0Y29vcmRzID0gdGhpcy5fY2FsY3VsYXRlVGlwKG1pbWljLCBjdXJTaXplLCBTQ0FMRSk7XG5cdFx0XHRiaWdDb29yZHMgPSB0aGlzLl9jYWxjdWxhdGVUaXAobWltaWMsIHRoaXMuc2l6ZSwgU0NBTEUpO1xuXG5cdFx0XHQvLyBTZXQgdGhlIGNhbnZhcyBzaXplIHVzaW5nIGNhbGN1bGF0ZWQgc2l6ZVxuXHRcdFx0aW5uZXIuYXR0cihXSURUSCwgbmV3U2l6ZVswXSAqIFNDQUxFKS5hdHRyKEhFSUdIVCwgbmV3U2l6ZVsxXSAqIFNDQUxFKTtcblx0XHRcdGlubmVyLmNzcyhXSURUSCwgbmV3U2l6ZVswXSkuY3NzKEhFSUdIVCwgbmV3U2l6ZVsxXSk7XG5cblx0XHRcdC8vIERyYXcgdGhlIG91dGVyLXN0cm9rZSB0aXBcblx0XHRcdHRoaXMuX2RyYXdDb29yZHMoY29udGV4dCwgYmlnQ29vcmRzKTtcblx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JbMV07XG5cdFx0XHRjb250ZXh0LmZpbGwoKTtcblxuXHRcdFx0Ly8gRHJhdyB0aGUgYWN0dWFsIHRpcFxuXHRcdFx0Y29udGV4dC50cmFuc2xhdGUodHJhbnNsYXRlWzBdICogU0NBTEUsIHRyYW5zbGF0ZVsxXSAqIFNDQUxFKTtcblx0XHRcdHRoaXMuX2RyYXdDb29yZHMoY29udGV4dCwgY29vcmRzKTtcblx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JbMF07XG5cdFx0XHRjb250ZXh0LmZpbGwoKTtcblx0XHR9XG5cblx0XHQvLyBWTUwgKElFIFByb3ByaWV0YXJ5IGltcGxlbWVudGF0aW9uKVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gQ2FsY3VsYXRlIGNvb3JkaW5hdGVzXG5cdFx0XHRjb29yZHMgPSB0aGlzLl9jYWxjdWxhdGVUaXAobWltaWMpO1xuXG5cdFx0XHQvLyBTZXR1cCBjb29yZGluYXRlcyBzdHJpbmdcblx0XHRcdGNvb3JkcyA9ICdtJyArIGNvb3Jkc1swXSArICcsJyArIGNvb3Jkc1sxXSArICcgbCcgKyBjb29yZHNbMl0gK1xuXHRcdFx0XHQnLCcgKyBjb29yZHNbM10gKyAnICcgKyBjb29yZHNbNF0gKyAnLCcgKyBjb29yZHNbNV0gKyAnIHhlJztcblxuXHRcdFx0Ly8gU2V0dXAgVk1MLXNwZWNpZmljIG9mZnNldCBmb3IgcGl4ZWwtcGVyZmVjdGlvblxuXHRcdFx0dHJhbnNsYXRlWzJdID0gYm9yZGVyICYmIC9eKHJ8YikvaS50ZXN0KGNvcm5lci5zdHJpbmcoKSkgP1xuXHRcdFx0XHRCUk9XU0VSLmllID09PSA4ID8gMiA6IDEgOiAwO1xuXG5cdFx0XHQvLyBTZXQgaW5pdGlhbCBDU1Ncblx0XHRcdGlubmVyLmNzcyh7XG5cdFx0XHRcdGNvb3Jkc2l6ZTogbmV3U2l6ZVswXStib3JkZXIgKyAnICcgKyBuZXdTaXplWzFdK2JvcmRlcixcblx0XHRcdFx0YW50aWFsaWFzOiAnJysobWltaWMuc3RyaW5nKCkuaW5kZXhPZihDRU5URVIpID4gLTEpLFxuXHRcdFx0XHRsZWZ0OiB0cmFuc2xhdGVbMF0gLSB0cmFuc2xhdGVbMl0gKiBOdW1iZXIocHJlY2VkYW5jZSA9PT0gWCksXG5cdFx0XHRcdHRvcDogdHJhbnNsYXRlWzFdIC0gdHJhbnNsYXRlWzJdICogTnVtYmVyKHByZWNlZGFuY2UgPT09IFkpLFxuXHRcdFx0XHR3aWR0aDogbmV3U2l6ZVswXSArIGJvcmRlcixcblx0XHRcdFx0aGVpZ2h0OiBuZXdTaXplWzFdICsgYm9yZGVyXG5cdFx0XHR9KVxuXHRcdFx0LmVhY2goZnVuY3Rpb24oaSkge1xuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG5cdFx0XHRcdC8vIFNldCBzaGFwZSBzcGVjaWZpYyBhdHRyaWJ1dGVzXG5cdFx0XHRcdCR0aGlzWyAkdGhpcy5wcm9wID8gJ3Byb3AnIDogJ2F0dHInIF0oe1xuXHRcdFx0XHRcdGNvb3Jkc2l6ZTogbmV3U2l6ZVswXStib3JkZXIgKyAnICcgKyBuZXdTaXplWzFdK2JvcmRlcixcblx0XHRcdFx0XHRwYXRoOiBjb29yZHMsXG5cdFx0XHRcdFx0ZmlsbGNvbG9yOiBjb2xvclswXSxcblx0XHRcdFx0XHRmaWxsZWQ6ICEhaSxcblx0XHRcdFx0XHRzdHJva2VkOiAhaVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudG9nZ2xlKCEhKGJvcmRlciB8fCBpKSk7XG5cblx0XHRcdFx0Ly8gQ2hlY2sgaWYgYm9yZGVyIGlzIGVuYWJsZWQgYW5kIGFkZCBzdHJva2UgZWxlbWVudFxuXHRcdFx0XHQhaSAmJiAkdGhpcy5odG1sKCBjcmVhdGVWTUwoXG5cdFx0XHRcdFx0J3N0cm9rZScsICd3ZWlnaHQ9XCInK2JvcmRlcioyKydweFwiIGNvbG9yPVwiJytjb2xvclsxXSsnXCIgbWl0ZXJsaW1pdD1cIjEwMDBcIiBqb2luc3R5bGU9XCJtaXRlclwiJ1xuXHRcdFx0XHQpICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBPcGVyYSBidWcgIzM1NyAtIEluY29ycmVjdCB0aXAgcG9zaXRpb25cblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vQ3JhZ2E4OS9xVGlwMi9pc3N1ZXMvMzY3XG5cdFx0d2luZG93Lm9wZXJhICYmIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRlbGVtZW50cy50aXAuY3NzKHtcblx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG5cdFx0XHRcdHZpc2liaWxpdHk6ICd2aXNpYmxlJ1xuXHRcdFx0fSk7XG5cdFx0fSwgMSk7XG5cblx0XHQvLyBQb3NpdGlvbiBpZiBuZWVkZWRcblx0XHRpZihwb3NpdGlvbiAhPT0gRkFMU0UpIHsgdGhpcy5jYWxjdWxhdGUoY29ybmVyLCBuZXdTaXplKTsgfVxuXHR9LFxuXG5cdGNhbGN1bGF0ZTogZnVuY3Rpb24oY29ybmVyLCBzaXplKSB7XG5cdFx0aWYoIXRoaXMuZW5hYmxlZCkgeyByZXR1cm4gRkFMU0U7IH1cblxuXHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdGVsZW1lbnRzID0gdGhpcy5xdGlwLmVsZW1lbnRzLFxuXHRcdFx0dGlwID0gdGhpcy5lbGVtZW50LFxuXHRcdFx0dXNlck9mZnNldCA9IHRoaXMub3B0aW9ucy5vZmZzZXQsXG5cdFx0XHRwb3NpdGlvbiA9IHt9LFxuXHRcdFx0cHJlY2VkYW5jZSwgY29ybmVycztcblxuXHRcdC8vIEluaGVyaXQgY29ybmVyIGlmIG5vdCBwcm92aWRlZFxuXHRcdGNvcm5lciA9IGNvcm5lciB8fCB0aGlzLmNvcm5lcjtcblx0XHRwcmVjZWRhbmNlID0gY29ybmVyLnByZWNlZGFuY2U7XG5cblx0XHQvLyBEZXRlcm1pbmUgd2hpY2ggdGlwIGRpbWVuc2lvbiB0byB1c2UgZm9yIGFkanVzdG1lbnRcblx0XHRzaXplID0gc2l6ZSB8fCB0aGlzLl9jYWxjdWxhdGVTaXplKGNvcm5lcik7XG5cblx0XHQvLyBTZXR1cCBjb3JuZXJzIGFuZCBvZmZzZXQgYXJyYXlcblx0XHRjb3JuZXJzID0gWyBjb3JuZXIueCwgY29ybmVyLnkgXTtcblx0XHRpZihwcmVjZWRhbmNlID09PSBYKSB7IGNvcm5lcnMucmV2ZXJzZSgpOyB9XG5cblx0XHQvLyBDYWxjdWxhdGUgdGlwIHBvc2l0aW9uXG5cdFx0JC5lYWNoKGNvcm5lcnMsIGZ1bmN0aW9uKGksIHNpZGUpIHtcblx0XHRcdHZhciBiLCBiYywgYnI7XG5cblx0XHRcdGlmKHNpZGUgPT09IENFTlRFUikge1xuXHRcdFx0XHRiID0gcHJlY2VkYW5jZSA9PT0gWSA/IExFRlQgOiBUT1A7XG5cdFx0XHRcdHBvc2l0aW9uWyBiIF0gPSAnNTAlJztcblx0XHRcdFx0cG9zaXRpb25bTUFSR0lOKyctJyArIGJdID0gLU1hdGgucm91bmQoc2l6ZVsgcHJlY2VkYW5jZSA9PT0gWSA/IDAgOiAxIF0gLyAyKSArIHVzZXJPZmZzZXQ7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YiA9IHNlbGYuX3BhcnNlV2lkdGgoY29ybmVyLCBzaWRlLCBlbGVtZW50cy50b29sdGlwKTtcblx0XHRcdFx0YmMgPSBzZWxmLl9wYXJzZVdpZHRoKGNvcm5lciwgc2lkZSwgZWxlbWVudHMuY29udGVudCk7XG5cdFx0XHRcdGJyID0gc2VsZi5fcGFyc2VSYWRpdXMoY29ybmVyKTtcblxuXHRcdFx0XHRwb3NpdGlvblsgc2lkZSBdID0gTWF0aC5tYXgoLXNlbGYuYm9yZGVyLCBpID8gYmMgOiB1c2VyT2Zmc2V0ICsgKGJyID4gYiA/IGJyIDogLWIpKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIEFkanVzdCBmb3IgdGlwIHNpemVcblx0XHRwb3NpdGlvblsgY29ybmVyW3ByZWNlZGFuY2VdIF0gLT0gc2l6ZVsgcHJlY2VkYW5jZSA9PT0gWCA/IDAgOiAxIF07XG5cblx0XHQvLyBTZXQgYW5kIHJldHVybiBuZXcgcG9zaXRpb25cblx0XHR0aXAuY3NzKHsgbWFyZ2luOiAnJywgdG9wOiAnJywgYm90dG9tOiAnJywgbGVmdDogJycsIHJpZ2h0OiAnJyB9KS5jc3MocG9zaXRpb24pO1xuXHRcdHJldHVybiBwb3NpdGlvbjtcblx0fSxcblxuXHRyZXBvc2l0aW9uOiBmdW5jdGlvbihldmVudCwgYXBpLCBwb3MpIHtcblx0XHRpZighdGhpcy5lbmFibGVkKSB7IHJldHVybjsgfVxuXG5cdFx0dmFyIGNhY2hlID0gYXBpLmNhY2hlLFxuXHRcdFx0bmV3Q29ybmVyID0gdGhpcy5jb3JuZXIuY2xvbmUoKSxcblx0XHRcdGFkanVzdCA9IHBvcy5hZGp1c3RlZCxcblx0XHRcdG1ldGhvZCA9IGFwaS5vcHRpb25zLnBvc2l0aW9uLmFkanVzdC5tZXRob2Quc3BsaXQoJyAnKSxcblx0XHRcdGhvcml6b250YWwgPSBtZXRob2RbMF0sXG5cdFx0XHR2ZXJ0aWNhbCA9IG1ldGhvZFsxXSB8fCBtZXRob2RbMF0sXG5cdFx0XHRzaGlmdCA9IHsgbGVmdDogRkFMU0UsIHRvcDogRkFMU0UsIHg6IDAsIHk6IDAgfSxcblx0XHRcdG9mZnNldCwgY3NzID0ge30sIHByb3BzO1xuXG5cdFx0ZnVuY3Rpb24gc2hpZnRmbGlwKGRpcmVjdGlvbiwgcHJlY2VkYW5jZSwgcG9wcG9zaXRlLCBzaWRlLCBvcHBvc2l0ZSkge1xuXHRcdFx0Ly8gSG9yaXpvbnRhbCAtIFNoaWZ0IG9yIGZsaXAgbWV0aG9kXG5cdFx0XHRpZihkaXJlY3Rpb24gPT09IFNISUZUICYmIG5ld0Nvcm5lci5wcmVjZWRhbmNlID09PSBwcmVjZWRhbmNlICYmIGFkanVzdFtzaWRlXSAmJiBuZXdDb3JuZXJbcG9wcG9zaXRlXSAhPT0gQ0VOVEVSKSB7XG5cdFx0XHRcdG5ld0Nvcm5lci5wcmVjZWRhbmNlID0gbmV3Q29ybmVyLnByZWNlZGFuY2UgPT09IFggPyBZIDogWDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoZGlyZWN0aW9uICE9PSBTSElGVCAmJiBhZGp1c3Rbc2lkZV0pe1xuXHRcdFx0XHRuZXdDb3JuZXJbcHJlY2VkYW5jZV0gPSBuZXdDb3JuZXJbcHJlY2VkYW5jZV0gPT09IENFTlRFUiA/XG5cdFx0XHRcdFx0YWRqdXN0W3NpZGVdID4gMCA/IHNpZGUgOiBvcHBvc2l0ZSA6XG5cdFx0XHRcdFx0bmV3Q29ybmVyW3ByZWNlZGFuY2VdID09PSBzaWRlID8gb3Bwb3NpdGUgOiBzaWRlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNoaWZ0b25seSh4eSwgc2lkZSwgb3Bwb3NpdGUpIHtcblx0XHRcdGlmKG5ld0Nvcm5lclt4eV0gPT09IENFTlRFUikge1xuXHRcdFx0XHRjc3NbTUFSR0lOKyctJytzaWRlXSA9IHNoaWZ0W3h5XSA9IG9mZnNldFtNQVJHSU4rJy0nK3NpZGVdIC0gYWRqdXN0W3NpZGVdO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHByb3BzID0gb2Zmc2V0W29wcG9zaXRlXSAhPT0gdW5kZWZpbmVkID9cblx0XHRcdFx0XHRbIGFkanVzdFtzaWRlXSwgLW9mZnNldFtzaWRlXSBdIDogWyAtYWRqdXN0W3NpZGVdLCBvZmZzZXRbc2lkZV0gXTtcblxuXHRcdFx0XHRpZiggKHNoaWZ0W3h5XSA9IE1hdGgubWF4KHByb3BzWzBdLCBwcm9wc1sxXSkpID4gcHJvcHNbMF0gKSB7XG5cdFx0XHRcdFx0cG9zW3NpZGVdIC09IGFkanVzdFtzaWRlXTtcblx0XHRcdFx0XHRzaGlmdFtzaWRlXSA9IEZBTFNFO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y3NzWyBvZmZzZXRbb3Bwb3NpdGVdICE9PSB1bmRlZmluZWQgPyBvcHBvc2l0ZSA6IHNpZGUgXSA9IHNoaWZ0W3h5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJZiBvdXIgdGlwIHBvc2l0aW9uIGlzbid0IGZpeGVkIGUuZy4gZG9lc24ndCBhZGp1c3Qgd2l0aCB2aWV3cG9ydC4uLlxuXHRcdGlmKHRoaXMuY29ybmVyLmZpeGVkICE9PSBUUlVFKSB7XG5cdFx0XHQvLyBQZXJmb3JtIHNoaWZ0L2ZsaXAgYWRqdXN0bWVudHNcblx0XHRcdHNoaWZ0ZmxpcChob3Jpem9udGFsLCBYLCBZLCBMRUZULCBSSUdIVCk7XG5cdFx0XHRzaGlmdGZsaXAodmVydGljYWwsIFksIFgsIFRPUCwgQk9UVE9NKTtcblxuXHRcdFx0Ly8gVXBkYXRlIGFuZCByZWRyYXcgdGhlIHRpcCBpZiBuZWVkZWQgKGNoZWNrIGNhY2hlZCBkZXRhaWxzIG9mIGxhc3QgZHJhd24gdGlwKVxuXHRcdFx0aWYobmV3Q29ybmVyLnN0cmluZygpICE9PSBjYWNoZS5jb3JuZXIuc3RyaW5nKCkgfHwgY2FjaGUuY29ybmVyVG9wICE9PSBhZGp1c3QudG9wIHx8IGNhY2hlLmNvcm5lckxlZnQgIT09IGFkanVzdC5sZWZ0KSB7XG5cdFx0XHRcdHRoaXMudXBkYXRlKG5ld0Nvcm5lciwgRkFMU0UpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldHVwIHRpcCBvZmZzZXQgcHJvcGVydGllc1xuXHRcdG9mZnNldCA9IHRoaXMuY2FsY3VsYXRlKG5ld0Nvcm5lcik7XG5cblx0XHQvLyBSZWFkanVzdCBvZmZzZXQgb2JqZWN0IHRvIG1ha2UgaXQgbGVmdC90b3Bcblx0XHRpZihvZmZzZXQucmlnaHQgIT09IHVuZGVmaW5lZCkgeyBvZmZzZXQubGVmdCA9IC1vZmZzZXQucmlnaHQ7IH1cblx0XHRpZihvZmZzZXQuYm90dG9tICE9PSB1bmRlZmluZWQpIHsgb2Zmc2V0LnRvcCA9IC1vZmZzZXQuYm90dG9tOyB9XG5cdFx0b2Zmc2V0LnVzZXIgPSB0aGlzLm9mZnNldDtcblxuXHRcdC8vIFBlcmZvcm0gc2hpZnQgYWRqdXN0bWVudHNcblx0XHRzaGlmdC5sZWZ0ID0gaG9yaXpvbnRhbCA9PT0gU0hJRlQgJiYgISFhZGp1c3QubGVmdDtcblx0XHRpZihzaGlmdC5sZWZ0KSB7XG5cdFx0XHRzaGlmdG9ubHkoWCwgTEVGVCwgUklHSFQpO1xuXHRcdH1cblx0XHRzaGlmdC50b3AgPSB2ZXJ0aWNhbCA9PT0gU0hJRlQgJiYgISFhZGp1c3QudG9wO1xuXHRcdGlmKHNoaWZ0LnRvcCkge1xuXHRcdFx0c2hpZnRvbmx5KFksIFRPUCwgQk9UVE9NKTtcblx0XHR9XG5cblx0XHQvKlxuXHRcdCogSWYgdGhlIHRpcCBpcyBhZGp1c3RlZCBpbiBib3RoIGRpbWVuc2lvbnMsIG9yIGluIGFcblx0XHQqIGRpcmVjdGlvbiB0aGF0IHdvdWxkIGNhdXNlIGl0IHRvIGJlIGFueXdoZXJlIGJ1dCB0aGVcblx0XHQqIG91dGVyIGJvcmRlciwgaGlkZSBpdCFcblx0XHQqL1xuXHRcdHRoaXMuZWxlbWVudC5jc3MoY3NzKS50b2dnbGUoXG5cdFx0XHQhKHNoaWZ0LnggJiYgc2hpZnQueSB8fCBuZXdDb3JuZXIueCA9PT0gQ0VOVEVSICYmIHNoaWZ0LnkgfHwgbmV3Q29ybmVyLnkgPT09IENFTlRFUiAmJiBzaGlmdC54KVxuXHRcdCk7XG5cblx0XHQvLyBBZGp1c3QgcG9zaXRpb24gdG8gYWNjb21vZGF0ZSB0aXAgZGltZW5zaW9uc1xuXHRcdHBvcy5sZWZ0IC09IG9mZnNldC5sZWZ0LmNoYXJBdCA/IG9mZnNldC51c2VyIDpcblx0XHRcdGhvcml6b250YWwgIT09IFNISUZUIHx8IHNoaWZ0LnRvcCB8fCAhc2hpZnQubGVmdCAmJiAhc2hpZnQudG9wID8gb2Zmc2V0LmxlZnQgKyB0aGlzLmJvcmRlciA6IDA7XG5cdFx0cG9zLnRvcCAtPSBvZmZzZXQudG9wLmNoYXJBdCA/IG9mZnNldC51c2VyIDpcblx0XHRcdHZlcnRpY2FsICE9PSBTSElGVCB8fCBzaGlmdC5sZWZ0IHx8ICFzaGlmdC5sZWZ0ICYmICFzaGlmdC50b3AgPyBvZmZzZXQudG9wICsgdGhpcy5ib3JkZXIgOiAwO1xuXG5cdFx0Ly8gQ2FjaGUgZGV0YWlsc1xuXHRcdGNhY2hlLmNvcm5lckxlZnQgPSBhZGp1c3QubGVmdDsgY2FjaGUuY29ybmVyVG9wID0gYWRqdXN0LnRvcDtcblx0XHRjYWNoZS5jb3JuZXIgPSBuZXdDb3JuZXIuY2xvbmUoKTtcblx0fSxcblxuXHRkZXN0cm95OiBmdW5jdGlvbigpIHtcblx0XHQvLyBVbmJpbmQgZXZlbnRzXG5cdFx0dGhpcy5xdGlwLl91bmJpbmQodGhpcy5xdGlwLnRvb2x0aXAsIHRoaXMuX25zKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgdGlwIGVsZW1lbnQocylcblx0XHRpZih0aGlzLnF0aXAuZWxlbWVudHMudGlwKSB7XG5cdFx0XHR0aGlzLnF0aXAuZWxlbWVudHMudGlwLmZpbmQoJyonKVxuXHRcdFx0XHQucmVtb3ZlKCkuZW5kKCkucmVtb3ZlKCk7XG5cdFx0fVxuXHR9XG59KTtcblxuVElQID0gUExVR0lOUy50aXAgPSBmdW5jdGlvbihhcGkpIHtcblx0cmV0dXJuIG5ldyBUaXAoYXBpLCBhcGkub3B0aW9ucy5zdHlsZS50aXApO1xufTtcblxuLy8gSW5pdGlhbGl6ZSB0aXAgb24gcmVuZGVyXG5USVAuaW5pdGlhbGl6ZSA9ICdyZW5kZXInO1xuXG4vLyBTZXR1cCBwbHVnaW4gc2FuaXRpemF0aW9uIG9wdGlvbnNcblRJUC5zYW5pdGl6ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0aWYob3B0aW9ucy5zdHlsZSAmJiAndGlwJyBpbiBvcHRpb25zLnN0eWxlKSB7XG5cdFx0dmFyIG9wdHMgPSBvcHRpb25zLnN0eWxlLnRpcDtcblx0XHRpZih0eXBlb2Ygb3B0cyAhPT0gJ29iamVjdCcpIHsgb3B0cyA9IG9wdGlvbnMuc3R5bGUudGlwID0geyBjb3JuZXI6IG9wdHMgfTsgfVxuXHRcdGlmKCEoL3N0cmluZ3xib29sZWFuL2kpLnRlc3QodHlwZW9mIG9wdHMuY29ybmVyKSkgeyBvcHRzLmNvcm5lciA9IFRSVUU7IH1cblx0fVxufTtcblxuLy8gQWRkIG5ldyBvcHRpb24gY2hlY2tzIGZvciB0aGUgcGx1Z2luXG5DSEVDS1MudGlwID0ge1xuXHQnXnBvc2l0aW9uLm15fHN0eWxlLnRpcC4oY29ybmVyfG1pbWljfGJvcmRlcikkJzogZnVuY3Rpb24oKSB7XG5cdFx0Ly8gTWFrZSBzdXJlIGEgdGlwIGNhbiBiZSBkcmF3blxuXHRcdHRoaXMuY3JlYXRlKCk7XG5cblx0XHQvLyBSZXBvc2l0aW9uIHRoZSB0b29sdGlwXG5cdFx0dGhpcy5xdGlwLnJlcG9zaXRpb24oKTtcblx0fSxcblx0J15zdHlsZS50aXAuKGhlaWdodHx3aWR0aCkkJzogZnVuY3Rpb24ob2JqKSB7XG5cdFx0Ly8gUmUtc2V0IGRpbWVuc2lvbnMgYW5kIHJlZHJhdyB0aGUgdGlwXG5cdFx0dGhpcy5zaXplID0gWyBvYmoud2lkdGgsIG9iai5oZWlnaHQgXTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0Ly8gUmVwb3NpdGlvbiB0aGUgdG9vbHRpcFxuXHRcdHRoaXMucXRpcC5yZXBvc2l0aW9uKCk7XG5cdH0sXG5cdCdeY29udGVudC50aXRsZXxzdHlsZS4oY2xhc3Nlc3x3aWRnZXQpJCc6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cdH1cbn07XG5cbi8vIEV4dGVuZCBvcmlnaW5hbCBxVGlwIGRlZmF1bHRzXG4kLmV4dGVuZChUUlVFLCBRVElQLmRlZmF1bHRzLCB7XG5cdHN0eWxlOiB7XG5cdFx0dGlwOiB7XG5cdFx0XHRjb3JuZXI6IFRSVUUsXG5cdFx0XHRtaW1pYzogRkFMU0UsXG5cdFx0XHR3aWR0aDogNixcblx0XHRcdGhlaWdodDogNixcblx0XHRcdGJvcmRlcjogVFJVRSxcblx0XHRcdG9mZnNldDogMFxuXHRcdH1cblx0fVxufSk7XG47dmFyIE1PREFMLCBPVkVSTEFZLFxuXHRNT0RBTENMQVNTID0gJ3F0aXAtbW9kYWwnLFxuXHRNT0RBTFNFTEVDVE9SID0gJy4nK01PREFMQ0xBU1M7XG5cbk9WRVJMQVkgPSBmdW5jdGlvbigpXG57XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHRmb2N1c2FibGVFbGVtcyA9IHt9LFxuXHRcdGN1cnJlbnQsXG5cdFx0cHJldlN0YXRlLFxuXHRcdGVsZW07XG5cblx0Ly8gTW9kaWZpZWQgY29kZSBmcm9tIGpRdWVyeSBVSSAxLjEwLjAgc291cmNlXG5cdC8vIGh0dHA6Ly9jb2RlLmpxdWVyeS5jb20vdWkvMS4xMC4wL2pxdWVyeS11aS5qc1xuXHRmdW5jdGlvbiBmb2N1c2FibGUoZWxlbWVudCkge1xuXHRcdC8vIFVzZSB0aGUgZGVmaW5lZCBmb2N1c2FibGUgY2hlY2tlciB3aGVuIHBvc3NpYmxlXG5cdFx0aWYoJC5leHByWyc6J10uZm9jdXNhYmxlKSB7IHJldHVybiAkLmV4cHJbJzonXS5mb2N1c2FibGU7IH1cblxuXHRcdHZhciBpc1RhYkluZGV4Tm90TmFOID0gIWlzTmFOKCQuYXR0cihlbGVtZW50LCAndGFiaW5kZXgnKSksXG5cdFx0XHRub2RlTmFtZSA9IGVsZW1lbnQubm9kZU5hbWUgJiYgZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0bWFwLCBtYXBOYW1lLCBpbWc7XG5cblx0XHRpZignYXJlYScgPT09IG5vZGVOYW1lKSB7XG5cdFx0XHRtYXAgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHRtYXBOYW1lID0gbWFwLm5hbWU7XG5cdFx0XHRpZighZWxlbWVudC5ocmVmIHx8ICFtYXBOYW1lIHx8IG1hcC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnbWFwJykge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpbWcgPSAkKCdpbWdbdXNlbWFwPSMnICsgbWFwTmFtZSArICddJylbMF07XG5cdFx0XHRyZXR1cm4gISFpbWcgJiYgaW1nLmlzKCc6dmlzaWJsZScpO1xuXHRcdH1cblxuXHRcdHJldHVybiAvaW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbnxvYmplY3QvLnRlc3QoIG5vZGVOYW1lICkgP1xuXHRcdFx0IWVsZW1lbnQuZGlzYWJsZWQgOlxuXHRcdFx0J2EnID09PSBub2RlTmFtZSA/XG5cdFx0XHRcdGVsZW1lbnQuaHJlZiB8fCBpc1RhYkluZGV4Tm90TmFOIDpcblx0XHRcdFx0aXNUYWJJbmRleE5vdE5hTlxuXHRcdDtcblx0fVxuXG5cdC8vIEZvY3VzIGlucHV0cyB1c2luZyBjYWNoZWQgZm9jdXNhYmxlIGVsZW1lbnRzIChzZWUgdXBkYXRlKCkpXG5cdGZ1bmN0aW9uIGZvY3VzSW5wdXRzKGJsdXJFbGVtcykge1xuXHRcdC8vIEJsdXJyaW5nIGJvZHkgZWxlbWVudCBpbiBJRSBjYXVzZXMgd2luZG93Lm9wZW4gd2luZG93cyB0byB1bmZvY3VzIVxuXHRcdGlmKGZvY3VzYWJsZUVsZW1zLmxlbmd0aCA8IDEgJiYgYmx1ckVsZW1zLmxlbmd0aCkgeyBibHVyRWxlbXMubm90KCdib2R5JykuYmx1cigpOyB9XG5cblx0XHQvLyBGb2N1cyB0aGUgaW5wdXRzXG5cdFx0ZWxzZSB7IGZvY3VzYWJsZUVsZW1zLmZpcnN0KCkuZm9jdXMoKTsgfVxuXHR9XG5cblx0Ly8gU3RlYWwgZm9jdXMgZnJvbSBlbGVtZW50cyBvdXRzaWRlIHRvb2x0aXBcblx0ZnVuY3Rpb24gc3RlYWxGb2N1cyhldmVudCkge1xuXHRcdGlmKCFlbGVtLmlzKCc6dmlzaWJsZScpKSB7IHJldHVybjsgfVxuXG5cdFx0dmFyIHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KSxcblx0XHRcdHRvb2x0aXAgPSBjdXJyZW50LnRvb2x0aXAsXG5cdFx0XHRjb250YWluZXIgPSB0YXJnZXQuY2xvc2VzdChTRUxFQ1RPUiksXG5cdFx0XHR0YXJnZXRPblRvcDtcblxuXHRcdC8vIERldGVybWluZSBpZiBpbnB1dCBjb250YWluZXIgdGFyZ2V0IGlzIGFib3ZlIHRoaXNcblx0XHR0YXJnZXRPblRvcCA9IGNvbnRhaW5lci5sZW5ndGggPCAxID8gRkFMU0UgOlxuXHRcdFx0cGFyc2VJbnQoY29udGFpbmVyWzBdLnN0eWxlLnpJbmRleCwgMTApID4gcGFyc2VJbnQodG9vbHRpcFswXS5zdHlsZS56SW5kZXgsIDEwKTtcblxuXHRcdC8vIElmIHdlJ3JlIHNob3dpbmcgYSBtb2RhbCwgYnV0IGZvY3VzIGhhcyBsYW5kZWQgb24gYW4gaW5wdXQgYmVsb3dcblx0XHQvLyB0aGlzIG1vZGFsLCBkaXZlcnQgZm9jdXMgdG8gdGhlIGZpcnN0IHZpc2libGUgaW5wdXQgaW4gdGhpcyBtb2RhbFxuXHRcdC8vIG9yIGlmIHdlIGNhbid0IGZpbmQgb25lLi4uIHRoZSB0b29sdGlwIGl0c2VsZlxuXHRcdGlmKCF0YXJnZXRPblRvcCAmJiB0YXJnZXQuY2xvc2VzdChTRUxFQ1RPUilbMF0gIT09IHRvb2x0aXBbMF0pIHtcblx0XHRcdGZvY3VzSW5wdXRzKHRhcmdldCk7XG5cdFx0fVxuXHR9XG5cblx0JC5leHRlbmQoc2VsZiwge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gQ3JlYXRlIGRvY3VtZW50IG92ZXJsYXlcblx0XHRcdGVsZW0gPSBzZWxmLmVsZW0gPSAkKCc8ZGl2IC8+Jywge1xuXHRcdFx0XHRpZDogJ3F0aXAtb3ZlcmxheScsXG5cdFx0XHRcdGh0bWw6ICc8ZGl2PjwvZGl2PicsXG5cdFx0XHRcdG1vdXNlZG93bjogZnVuY3Rpb24oKSB7IHJldHVybiBGQUxTRTsgfVxuXHRcdFx0fSlcblx0XHRcdC5oaWRlKCk7XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBjYW4ndCBmb2N1cyBhbnl0aGluZyBvdXRzaWRlIHRoZSB0b29sdGlwXG5cdFx0XHQkKGRvY3VtZW50LmJvZHkpLmJpbmQoJ2ZvY3VzaW4nK01PREFMU0VMRUNUT1IsIHN0ZWFsRm9jdXMpO1xuXG5cdFx0XHQvLyBBcHBseSBrZXlib2FyZCBcIkVzY2FwZSBrZXlcIiBjbG9zZSBoYW5kbGVyXG5cdFx0XHQkKGRvY3VtZW50KS5iaW5kKCdrZXlkb3duJytNT0RBTFNFTEVDVE9SLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRpZihjdXJyZW50ICYmIGN1cnJlbnQub3B0aW9ucy5zaG93Lm1vZGFsLmVzY2FwZSAmJiBldmVudC5rZXlDb2RlID09PSAyNykge1xuXHRcdFx0XHRcdGN1cnJlbnQuaGlkZShldmVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBBcHBseSBjbGljayBoYW5kbGVyIGZvciBibHVyIG9wdGlvblxuXHRcdFx0ZWxlbS5iaW5kKCdjbGljaycrTU9EQUxTRUxFQ1RPUiwgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYoY3VycmVudCAmJiBjdXJyZW50Lm9wdGlvbnMuc2hvdy5tb2RhbC5ibHVyKSB7XG5cdFx0XHRcdFx0Y3VycmVudC5oaWRlKGV2ZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBzZWxmO1xuXHRcdH0sXG5cblx0XHR1cGRhdGU6IGZ1bmN0aW9uKGFwaSkge1xuXHRcdFx0Ly8gVXBkYXRlIGN1cnJlbnQgQVBJIHJlZmVyZW5jZVxuXHRcdFx0Y3VycmVudCA9IGFwaTtcblxuXHRcdFx0Ly8gVXBkYXRlIGZvY3VzYWJsZSBlbGVtZW50cyBpZiBlbmFibGVkXG5cdFx0XHRpZihhcGkub3B0aW9ucy5zaG93Lm1vZGFsLnN0ZWFsZm9jdXMgIT09IEZBTFNFKSB7XG5cdFx0XHRcdGZvY3VzYWJsZUVsZW1zID0gYXBpLnRvb2x0aXAuZmluZCgnKicpLmZpbHRlcihmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gZm9jdXNhYmxlKHRoaXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgeyBmb2N1c2FibGVFbGVtcyA9IFtdOyB9XG5cdFx0fSxcblxuXHRcdHRvZ2dsZTogZnVuY3Rpb24oYXBpLCBzdGF0ZSwgZHVyYXRpb24pIHtcblx0XHRcdHZhciB0b29sdGlwID0gYXBpLnRvb2x0aXAsXG5cdFx0XHRcdG9wdGlvbnMgPSBhcGkub3B0aW9ucy5zaG93Lm1vZGFsLFxuXHRcdFx0XHRlZmZlY3QgPSBvcHRpb25zLmVmZmVjdCxcblx0XHRcdFx0dHlwZSA9IHN0YXRlID8gJ3Nob3cnOiAnaGlkZScsXG5cdFx0XHRcdHZpc2libGUgPSBlbGVtLmlzKCc6dmlzaWJsZScpLFxuXHRcdFx0XHR2aXNpYmxlTW9kYWxzID0gJChNT0RBTFNFTEVDVE9SKS5maWx0ZXIoJzp2aXNpYmxlOm5vdCg6YW5pbWF0ZWQpJykubm90KHRvb2x0aXApO1xuXG5cdFx0XHQvLyBTZXQgYWN0aXZlIHRvb2x0aXAgQVBJIHJlZmVyZW5jZVxuXHRcdFx0c2VsZi51cGRhdGUoYXBpKTtcblxuXHRcdFx0Ly8gSWYgdGhlIG1vZGFsIGNhbiBzdGVhbCB0aGUgZm9jdXMuLi5cblx0XHRcdC8vIEJsdXIgdGhlIGN1cnJlbnQgaXRlbSBhbmQgZm9jdXMgYW55dGhpbmcgaW4gdGhlIG1vZGFsIHdlIGFuXG5cdFx0XHRpZihzdGF0ZSAmJiBvcHRpb25zLnN0ZWFsZm9jdXMgIT09IEZBTFNFKSB7XG5cdFx0XHRcdGZvY3VzSW5wdXRzKCAkKCc6Zm9jdXMnKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUb2dnbGUgYmFja2Ryb3AgY3Vyc29yIHN0eWxlIG9uIHNob3dcblx0XHRcdGVsZW0udG9nZ2xlQ2xhc3MoJ2JsdXJzJywgb3B0aW9ucy5ibHVyKTtcblxuXHRcdFx0Ly8gQXBwZW5kIHRvIGJvZHkgb24gc2hvd1xuXHRcdFx0aWYoc3RhdGUpIHtcblx0XHRcdFx0ZWxlbS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCBtb2RhbCBmcm9tIGNvbmZsaWN0aW5nIHdpdGggc2hvdy5zb2xvLCBhbmQgZG9uJ3QgaGlkZSBiYWNrZHJvcCBpcyBvdGhlciBtb2RhbHMgYXJlIHZpc2libGVcblx0XHRcdGlmKGVsZW0uaXMoJzphbmltYXRlZCcpICYmIHZpc2libGUgPT09IHN0YXRlICYmIHByZXZTdGF0ZSAhPT0gRkFMU0UgfHwgIXN0YXRlICYmIHZpc2libGVNb2RhbHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBzZWxmO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdG9wIGFsbCBhbmltYXRpb25zXG5cdFx0XHRlbGVtLnN0b3AoVFJVRSwgRkFMU0UpO1xuXG5cdFx0XHQvLyBVc2UgY3VzdG9tIGZ1bmN0aW9uIGlmIHByb3ZpZGVkXG5cdFx0XHRpZigkLmlzRnVuY3Rpb24oZWZmZWN0KSkge1xuXHRcdFx0XHRlZmZlY3QuY2FsbChlbGVtLCBzdGF0ZSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIG5vIGVmZmVjdCB0eXBlIGlzIHN1cHBsaWVkLCB1c2UgYSBzaW1wbGUgdG9nZ2xlXG5cdFx0XHRlbHNlIGlmKGVmZmVjdCA9PT0gRkFMU0UpIHtcblx0XHRcdFx0ZWxlbVsgdHlwZSBdKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFVzZSBiYXNpYyBmYWRlIGZ1bmN0aW9uXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZWxlbS5mYWRlVG8oIHBhcnNlSW50KGR1cmF0aW9uLCAxMCkgfHwgOTAsIHN0YXRlID8gMSA6IDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmKCFzdGF0ZSkgeyBlbGVtLmhpZGUoKTsgfVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVzZXQgcG9zaXRpb24gYW5kIGRldGFjaCBmcm9tIGJvZHkgb24gaGlkZVxuXHRcdFx0aWYoIXN0YXRlKSB7XG5cdFx0XHRcdGVsZW0ucXVldWUoZnVuY3Rpb24obmV4dCkge1xuXHRcdFx0XHRcdGVsZW0uY3NzKHsgbGVmdDogJycsIHRvcDogJycgfSk7XG5cdFx0XHRcdFx0aWYoISQoTU9EQUxTRUxFQ1RPUikubGVuZ3RoKSB7IGVsZW0uZGV0YWNoKCk7IH1cblx0XHRcdFx0XHRuZXh0KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDYWNoZSB0aGUgc3RhdGVcblx0XHRcdHByZXZTdGF0ZSA9IHN0YXRlO1xuXG5cdFx0XHQvLyBJZiB0aGUgdG9vbHRpcCBpcyBkZXN0cm95ZWQsIHNldCByZWZlcmVuY2UgdG8gbnVsbFxuXHRcdFx0aWYoY3VycmVudC5kZXN0cm95ZWQpIHsgY3VycmVudCA9IE5VTEw7IH1cblxuXHRcdFx0cmV0dXJuIHNlbGY7XG5cdFx0fVxuXHR9KTtcblxuXHRzZWxmLmluaXQoKTtcbn07XG5PVkVSTEFZID0gbmV3IE9WRVJMQVkoKTtcblxuZnVuY3Rpb24gTW9kYWwoYXBpLCBvcHRpb25zKSB7XG5cdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdHRoaXMuX25zID0gJy1tb2RhbCc7XG5cblx0dGhpcy5xdGlwID0gYXBpO1xuXHR0aGlzLmluaXQoYXBpKTtcbn1cblxuJC5leHRlbmQoTW9kYWwucHJvdG90eXBlLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKHF0aXApIHtcblx0XHR2YXIgdG9vbHRpcCA9IHF0aXAudG9vbHRpcDtcblxuXHRcdC8vIElmIG1vZGFsIGlzIGRpc2FibGVkLi4uIHJldHVyblxuXHRcdGlmKCF0aGlzLm9wdGlvbnMub24pIHsgcmV0dXJuIHRoaXM7IH1cblxuXHRcdC8vIFNldCBvdmVybGF5IHJlZmVyZW5jZVxuXHRcdHF0aXAuZWxlbWVudHMub3ZlcmxheSA9IE9WRVJMQVkuZWxlbTtcblxuXHRcdC8vIEFkZCB1bmlxdWUgYXR0cmlidXRlIHNvIHdlIGNhbiBncmFiIG1vZGFsIHRvb2x0aXBzIGVhc2lseSB2aWEgYSBTRUxFQ1RPUiwgYW5kIHNldCB6LWluZGV4XG5cdFx0dG9vbHRpcC5hZGRDbGFzcyhNT0RBTENMQVNTKS5jc3MoJ3otaW5kZXgnLCBRVElQLm1vZGFsX3ppbmRleCArICQoTU9EQUxTRUxFQ1RPUikubGVuZ3RoKTtcblxuXHRcdC8vIEFwcGx5IG91ciBzaG93L2hpZGUvZm9jdXMgbW9kYWwgZXZlbnRzXG5cdFx0cXRpcC5fYmluZCh0b29sdGlwLCBbJ3Rvb2x0aXBzaG93JywgJ3Rvb2x0aXBoaWRlJ10sIGZ1bmN0aW9uKGV2ZW50LCBhcGksIGR1cmF0aW9uKSB7XG5cdFx0XHR2YXIgb0V2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudDtcblxuXHRcdFx0Ly8gTWFrZSBzdXJlIG1vdXNlb3V0IGRvZXNuJ3QgdHJpZ2dlciBhIGhpZGUgd2hlbiBzaG93aW5nIHRoZSBtb2RhbCBhbmQgbW91c2luZyBvbnRvIGJhY2tkcm9wXG5cdFx0XHRpZihldmVudC50YXJnZXQgPT09IHRvb2x0aXBbMF0pIHtcblx0XHRcdFx0aWYob0V2ZW50ICYmIGV2ZW50LnR5cGUgPT09ICd0b29sdGlwaGlkZScgJiYgL21vdXNlKGxlYXZlfGVudGVyKS8udGVzdChvRXZlbnQudHlwZSkgJiYgJChvRXZlbnQucmVsYXRlZFRhcmdldCkuY2xvc2VzdChPVkVSTEFZLmVsZW1bMF0pLmxlbmd0aCkge1xuXHRcdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG5vLWVtcHR5ICovXG5cdFx0XHRcdFx0dHJ5IHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgfVxuXHRcdFx0XHRcdGNhdGNoKGUpIHt9XG5cdFx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBuby1lbXB0eSAqL1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoIW9FdmVudCB8fCBvRXZlbnQgJiYgb0V2ZW50LnR5cGUgIT09ICd0b29sdGlwc29sbycpIHtcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZShldmVudCwgZXZlbnQudHlwZSA9PT0gJ3Rvb2x0aXBzaG93JywgZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwgdGhpcy5fbnMsIHRoaXMpO1xuXG5cdFx0Ly8gQWRqdXN0IG1vZGFsIHotaW5kZXggb24gdG9vbHRpcCBmb2N1c1xuXHRcdHF0aXAuX2JpbmQodG9vbHRpcCwgJ3Rvb2x0aXBmb2N1cycsIGZ1bmN0aW9uKGV2ZW50LCBhcGkpIHtcblx0XHRcdC8vIElmIGZvY3VzIHdhcyBjYW5jZWxsZWQgYmVmb3JlIGl0IHJlYWNoZWQgdXMsIGRvbid0IGRvIGFueXRoaW5nXG5cdFx0XHRpZihldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCBldmVudC50YXJnZXQgIT09IHRvb2x0aXBbMF0pIHsgcmV0dXJuOyB9XG5cblx0XHRcdHZhciBxdGlwcyA9ICQoTU9EQUxTRUxFQ1RPUiksXG5cblx0XHRcdC8vIEtlZXAgdGhlIG1vZGFsJ3MgbG93ZXIgdGhhbiBvdGhlciwgcmVndWxhciBxdGlwc1xuXHRcdFx0bmV3SW5kZXggPSBRVElQLm1vZGFsX3ppbmRleCArIHF0aXBzLmxlbmd0aCxcblx0XHRcdGN1ckluZGV4ID0gcGFyc2VJbnQodG9vbHRpcFswXS5zdHlsZS56SW5kZXgsIDEwKTtcblxuXHRcdFx0Ly8gU2V0IG92ZXJsYXkgei1pbmRleFxuXHRcdFx0T1ZFUkxBWS5lbGVtWzBdLnN0eWxlLnpJbmRleCA9IG5ld0luZGV4IC0gMTtcblxuXHRcdFx0Ly8gUmVkdWNlIG1vZGFsIHotaW5kZXgncyBhbmQga2VlcCB0aGVtIHByb3Blcmx5IG9yZGVyZWRcblx0XHRcdHF0aXBzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmKHRoaXMuc3R5bGUuekluZGV4ID4gY3VySW5kZXgpIHtcblx0XHRcdFx0XHR0aGlzLnN0eWxlLnpJbmRleCAtPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gRmlyZSBibHVyIGV2ZW50IGZvciBmb2N1c2VkIHRvb2x0aXBcblx0XHRcdHF0aXBzLmZpbHRlcignLicgKyBDTEFTU19GT0NVUykucXRpcCgnYmx1cicsIGV2ZW50Lm9yaWdpbmFsRXZlbnQpO1xuXG5cdFx0XHQvLyBTZXQgdGhlIG5ldyB6LWluZGV4XG5cdFx0XHR0b29sdGlwLmFkZENsYXNzKENMQVNTX0ZPQ1VTKVswXS5zdHlsZS56SW5kZXggPSBuZXdJbmRleDtcblxuXHRcdFx0Ly8gU2V0IGN1cnJlbnRcblx0XHRcdE9WRVJMQVkudXBkYXRlKGFwaSk7XG5cblx0XHRcdC8vIFByZXZlbnQgZGVmYXVsdCBoYW5kbGluZ1xuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgbm8tZW1wdHkgKi9cblx0XHRcdHRyeSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IH1cblx0XHRcdGNhdGNoKGUpIHt9XG5cdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG5vLWVtcHR5ICovXG5cdFx0fSwgdGhpcy5fbnMsIHRoaXMpO1xuXG5cdFx0Ly8gRm9jdXMgYW55IG90aGVyIHZpc2libGUgbW9kYWxzIHdoZW4gdGhpcyBvbmUgaGlkZXNcblx0XHRxdGlwLl9iaW5kKHRvb2x0aXAsICd0b29sdGlwaGlkZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRpZihldmVudC50YXJnZXQgPT09IHRvb2x0aXBbMF0pIHtcblx0XHRcdFx0JChNT0RBTFNFTEVDVE9SKS5maWx0ZXIoJzp2aXNpYmxlJykubm90KHRvb2x0aXApLmxhc3QoKS5xdGlwKCdmb2N1cycsIGV2ZW50KTtcblx0XHRcdH1cblx0XHR9LCB0aGlzLl9ucywgdGhpcyk7XG5cdH0sXG5cblx0dG9nZ2xlOiBmdW5jdGlvbihldmVudCwgc3RhdGUsIGR1cmF0aW9uKSB7XG5cdFx0Ly8gTWFrZSBzdXJlIGRlZmF1bHQgZXZlbnQgaGFzbid0IGJlZW4gcHJldmVudGVkXG5cdFx0aWYoZXZlbnQgJiYgZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHsgcmV0dXJuIHRoaXM7IH1cblxuXHRcdC8vIFRvZ2dsZSBpdFxuXHRcdE9WRVJMQVkudG9nZ2xlKHRoaXMucXRpcCwgISFzdGF0ZSwgZHVyYXRpb24pO1xuXHR9LFxuXG5cdGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXHRcdC8vIFJlbW92ZSBtb2RhbCBjbGFzc1xuXHRcdHRoaXMucXRpcC50b29sdGlwLnJlbW92ZUNsYXNzKE1PREFMQ0xBU1MpO1xuXG5cdFx0Ly8gUmVtb3ZlIGJvdW5kIGV2ZW50c1xuXHRcdHRoaXMucXRpcC5fdW5iaW5kKHRoaXMucXRpcC50b29sdGlwLCB0aGlzLl9ucyk7XG5cblx0XHQvLyBEZWxldGUgZWxlbWVudCByZWZlcmVuY2Vcblx0XHRPVkVSTEFZLnRvZ2dsZSh0aGlzLnF0aXAsIEZBTFNFKTtcblx0XHRkZWxldGUgdGhpcy5xdGlwLmVsZW1lbnRzLm92ZXJsYXk7XG5cdH1cbn0pO1xuXG5cbk1PREFMID0gUExVR0lOUy5tb2RhbCA9IGZ1bmN0aW9uKGFwaSkge1xuXHRyZXR1cm4gbmV3IE1vZGFsKGFwaSwgYXBpLm9wdGlvbnMuc2hvdy5tb2RhbCk7XG59O1xuXG4vLyBTZXR1cCBzYW5pdGl6dGlvbiBydWxlc1xuTU9EQUwuc2FuaXRpemUgPSBmdW5jdGlvbihvcHRzKSB7XG5cdGlmKG9wdHMuc2hvdykge1xuXHRcdGlmKHR5cGVvZiBvcHRzLnNob3cubW9kYWwgIT09ICdvYmplY3QnKSB7IG9wdHMuc2hvdy5tb2RhbCA9IHsgb246ICEhb3B0cy5zaG93Lm1vZGFsIH07IH1cblx0XHRlbHNlIGlmKHR5cGVvZiBvcHRzLnNob3cubW9kYWwub24gPT09ICd1bmRlZmluZWQnKSB7IG9wdHMuc2hvdy5tb2RhbC5vbiA9IFRSVUU7IH1cblx0fVxufTtcblxuLy8gQmFzZSB6LWluZGV4IGZvciBhbGwgbW9kYWwgdG9vbHRpcHMgKHVzZSBxVGlwIGNvcmUgei1pbmRleCBhcyBhIGJhc2UpXG4vKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cblFUSVAubW9kYWxfemluZGV4ID0gUVRJUC56aW5kZXggLSAyMDA7XG4vKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSAqL1xuXG4vLyBQbHVnaW4gbmVlZHMgdG8gYmUgaW5pdGlhbGl6ZWQgb24gcmVuZGVyXG5NT0RBTC5pbml0aWFsaXplID0gJ3JlbmRlcic7XG5cbi8vIFNldHVwIG9wdGlvbiBzZXQgY2hlY2tzXG5DSEVDS1MubW9kYWwgPSB7XG5cdCdec2hvdy5tb2RhbC4ob258Ymx1cikkJzogZnVuY3Rpb24oKSB7XG5cdFx0Ly8gSW5pdGlhbGlzZVxuXHRcdHRoaXMuZGVzdHJveSgpO1xuXHRcdHRoaXMuaW5pdCgpO1xuXG5cdFx0Ly8gU2hvdyB0aGUgbW9kYWwgaWYgbm90IHZpc2libGUgYWxyZWFkeSBhbmQgdG9vbHRpcCBpcyB2aXNpYmxlXG5cdFx0dGhpcy5xdGlwLmVsZW1zLm92ZXJsYXkudG9nZ2xlKFxuXHRcdFx0dGhpcy5xdGlwLnRvb2x0aXBbMF0ub2Zmc2V0V2lkdGggPiAwXG5cdFx0KTtcblx0fVxufTtcblxuLy8gRXh0ZW5kIG9yaWdpbmFsIGFwaSBkZWZhdWx0c1xuJC5leHRlbmQoVFJVRSwgUVRJUC5kZWZhdWx0cywge1xuXHRzaG93OiB7XG5cdFx0bW9kYWw6IHtcblx0XHRcdG9uOiBGQUxTRSxcblx0XHRcdGVmZmVjdDogVFJVRSxcblx0XHRcdGJsdXI6IFRSVUUsXG5cdFx0XHRzdGVhbGZvY3VzOiBUUlVFLFxuXHRcdFx0ZXNjYXBlOiBUUlVFXG5cdFx0fVxuXHR9XG59KTtcbjtQTFVHSU5TLnZpZXdwb3J0ID0gZnVuY3Rpb24oYXBpLCBwb3NpdGlvbiwgcG9zT3B0aW9ucywgdGFyZ2V0V2lkdGgsIHRhcmdldEhlaWdodCwgZWxlbVdpZHRoLCBlbGVtSGVpZ2h0KVxue1xuXHR2YXIgdGFyZ2V0ID0gcG9zT3B0aW9ucy50YXJnZXQsXG5cdFx0dG9vbHRpcCA9IGFwaS5lbGVtZW50cy50b29sdGlwLFxuXHRcdG15ID0gcG9zT3B0aW9ucy5teSxcblx0XHRhdCA9IHBvc09wdGlvbnMuYXQsXG5cdFx0YWRqdXN0ID0gcG9zT3B0aW9ucy5hZGp1c3QsXG5cdFx0bWV0aG9kID0gYWRqdXN0Lm1ldGhvZC5zcGxpdCgnICcpLFxuXHRcdG1ldGhvZFggPSBtZXRob2RbMF0sXG5cdFx0bWV0aG9kWSA9IG1ldGhvZFsxXSB8fCBtZXRob2RbMF0sXG5cdFx0dmlld3BvcnQgPSBwb3NPcHRpb25zLnZpZXdwb3J0LFxuXHRcdGNvbnRhaW5lciA9IHBvc09wdGlvbnMuY29udGFpbmVyLFxuXHRcdGFkanVzdGVkID0geyBsZWZ0OiAwLCB0b3A6IDAgfSxcblx0XHRmaXhlZCwgbmV3TXksIGNvbnRhaW5lck9mZnNldCwgY29udGFpbmVyU3RhdGljLFxuXHRcdHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCB2aWV3cG9ydFNjcm9sbCwgdmlld3BvcnRPZmZzZXQ7XG5cblx0Ly8gSWYgdmlld3BvcnQgaXMgbm90IGEgalF1ZXJ5IGVsZW1lbnQsIG9yIGl0J3MgdGhlIHdpbmRvdy9kb2N1bWVudCwgb3Igbm8gYWRqdXN0bWVudCBtZXRob2QgaXMgdXNlZC4uLiByZXR1cm5cblx0aWYoIXZpZXdwb3J0LmpxdWVyeSB8fCB0YXJnZXRbMF0gPT09IHdpbmRvdyB8fCB0YXJnZXRbMF0gPT09IGRvY3VtZW50LmJvZHkgfHwgYWRqdXN0Lm1ldGhvZCA9PT0gJ25vbmUnKSB7XG5cdFx0cmV0dXJuIGFkanVzdGVkO1xuXHR9XG5cblx0Ly8gQ2FjaCBjb250YWluZXIgZGV0YWlsc1xuXHRjb250YWluZXJPZmZzZXQgPSBjb250YWluZXIub2Zmc2V0KCkgfHwgYWRqdXN0ZWQ7XG5cdGNvbnRhaW5lclN0YXRpYyA9IGNvbnRhaW5lci5jc3MoJ3Bvc2l0aW9uJykgPT09ICdzdGF0aWMnO1xuXG5cdC8vIENhY2hlIG91ciB2aWV3cG9ydCBkZXRhaWxzXG5cdGZpeGVkID0gdG9vbHRpcC5jc3MoJ3Bvc2l0aW9uJykgPT09ICdmaXhlZCc7XG5cdHZpZXdwb3J0V2lkdGggPSB2aWV3cG9ydFswXSA9PT0gd2luZG93ID8gdmlld3BvcnQud2lkdGgoKSA6IHZpZXdwb3J0Lm91dGVyV2lkdGgoRkFMU0UpO1xuXHR2aWV3cG9ydEhlaWdodCA9IHZpZXdwb3J0WzBdID09PSB3aW5kb3cgPyB2aWV3cG9ydC5oZWlnaHQoKSA6IHZpZXdwb3J0Lm91dGVySGVpZ2h0KEZBTFNFKTtcblx0dmlld3BvcnRTY3JvbGwgPSB7IGxlZnQ6IGZpeGVkID8gMCA6IHZpZXdwb3J0LnNjcm9sbExlZnQoKSwgdG9wOiBmaXhlZCA/IDAgOiB2aWV3cG9ydC5zY3JvbGxUb3AoKSB9O1xuXHR2aWV3cG9ydE9mZnNldCA9IHZpZXdwb3J0Lm9mZnNldCgpIHx8IGFkanVzdGVkO1xuXG5cdC8vIEdlbmVyaWMgY2FsY3VsYXRpb24gbWV0aG9kXG5cdGZ1bmN0aW9uIGNhbGN1bGF0ZShzaWRlLCBvdGhlclNpZGUsIHR5cGUsIGFkanVzdG1lbnQsIHNpZGUxLCBzaWRlMiwgbGVuZ3RoTmFtZSwgdGFyZ2V0TGVuZ3RoLCBlbGVtTGVuZ3RoKSB7XG5cdFx0dmFyIGluaXRpYWxQb3MgPSBwb3NpdGlvbltzaWRlMV0sXG5cdFx0XHRteVNpZGUgPSBteVtzaWRlXSxcblx0XHRcdGF0U2lkZSA9IGF0W3NpZGVdLFxuXHRcdFx0aXNTaGlmdCA9IHR5cGUgPT09IFNISUZULFxuXHRcdFx0bXlMZW5ndGggPSBteVNpZGUgPT09IHNpZGUxID8gZWxlbUxlbmd0aCA6IG15U2lkZSA9PT0gc2lkZTIgPyAtZWxlbUxlbmd0aCA6IC1lbGVtTGVuZ3RoIC8gMixcblx0XHRcdGF0TGVuZ3RoID0gYXRTaWRlID09PSBzaWRlMSA/IHRhcmdldExlbmd0aCA6IGF0U2lkZSA9PT0gc2lkZTIgPyAtdGFyZ2V0TGVuZ3RoIDogLXRhcmdldExlbmd0aCAvIDIsXG5cdFx0XHRzaWRlT2Zmc2V0ID0gdmlld3BvcnRTY3JvbGxbc2lkZTFdICsgdmlld3BvcnRPZmZzZXRbc2lkZTFdIC0gKGNvbnRhaW5lclN0YXRpYyA/IDAgOiBjb250YWluZXJPZmZzZXRbc2lkZTFdKSxcblx0XHRcdG92ZXJmbG93MSA9IHNpZGVPZmZzZXQgLSBpbml0aWFsUG9zLFxuXHRcdFx0b3ZlcmZsb3cyID0gaW5pdGlhbFBvcyArIGVsZW1MZW5ndGggLSAobGVuZ3RoTmFtZSA9PT0gV0lEVEggPyB2aWV3cG9ydFdpZHRoIDogdmlld3BvcnRIZWlnaHQpIC0gc2lkZU9mZnNldCxcblx0XHRcdG9mZnNldCA9IG15TGVuZ3RoIC0gKG15LnByZWNlZGFuY2UgPT09IHNpZGUgfHwgbXlTaWRlID09PSBteVtvdGhlclNpZGVdID8gYXRMZW5ndGggOiAwKSAtIChhdFNpZGUgPT09IENFTlRFUiA/IHRhcmdldExlbmd0aCAvIDIgOiAwKTtcblxuXHRcdC8vIHNoaWZ0XG5cdFx0aWYoaXNTaGlmdCkge1xuXHRcdFx0b2Zmc2V0ID0gKG15U2lkZSA9PT0gc2lkZTEgPyAxIDogLTEpICogbXlMZW5ndGg7XG5cblx0XHRcdC8vIEFkanVzdCBwb3NpdGlvbiBidXQga2VlcCBpdCB3aXRoaW4gdmlld3BvcnQgZGltZW5zaW9uc1xuXHRcdFx0cG9zaXRpb25bc2lkZTFdICs9IG92ZXJmbG93MSA+IDAgPyBvdmVyZmxvdzEgOiBvdmVyZmxvdzIgPiAwID8gLW92ZXJmbG93MiA6IDA7XG5cdFx0XHRwb3NpdGlvbltzaWRlMV0gPSBNYXRoLm1heChcblx0XHRcdFx0LWNvbnRhaW5lck9mZnNldFtzaWRlMV0gKyB2aWV3cG9ydE9mZnNldFtzaWRlMV0sXG5cdFx0XHRcdGluaXRpYWxQb3MgLSBvZmZzZXQsXG5cdFx0XHRcdE1hdGgubWluKFxuXHRcdFx0XHRcdE1hdGgubWF4KFxuXHRcdFx0XHRcdFx0LWNvbnRhaW5lck9mZnNldFtzaWRlMV0gKyB2aWV3cG9ydE9mZnNldFtzaWRlMV0gKyAobGVuZ3RoTmFtZSA9PT0gV0lEVEggPyB2aWV3cG9ydFdpZHRoIDogdmlld3BvcnRIZWlnaHQpLFxuXHRcdFx0XHRcdFx0aW5pdGlhbFBvcyArIG9mZnNldFxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0cG9zaXRpb25bc2lkZTFdLFxuXG5cdFx0XHRcdFx0Ly8gTWFrZSBzdXJlIHdlIGRvbid0IGFkanVzdCBjb21wbGV0ZSBvZmYgdGhlIGVsZW1lbnQgd2hlbiB1c2luZyAnY2VudGVyJ1xuXHRcdFx0XHRcdG15U2lkZSA9PT0gJ2NlbnRlcicgPyBpbml0aWFsUG9zIC0gbXlMZW5ndGggOiAxRTlcblx0XHRcdFx0KVxuXHRcdFx0KTtcblxuXHRcdH1cblxuXHRcdC8vIGZsaXAvZmxpcGludmVydFxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gVXBkYXRlIGFkanVzdG1lbnQgYW1vdW50IGRlcGVuZGluZyBvbiBpZiB1c2luZyBmbGlwaW52ZXJ0IG9yIGZsaXBcblx0XHRcdGFkanVzdG1lbnQgKj0gdHlwZSA9PT0gRkxJUElOVkVSVCA/IDIgOiAwO1xuXG5cdFx0XHQvLyBDaGVjayBmb3Igb3ZlcmZsb3cgb24gdGhlIGxlZnQvdG9wXG5cdFx0XHRpZihvdmVyZmxvdzEgPiAwICYmIChteVNpZGUgIT09IHNpZGUxIHx8IG92ZXJmbG93MiA+IDApKSB7XG5cdFx0XHRcdHBvc2l0aW9uW3NpZGUxXSAtPSBvZmZzZXQgKyBhZGp1c3RtZW50O1xuXHRcdFx0XHRuZXdNeS5pbnZlcnQoc2lkZSwgc2lkZTEpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDaGVjayBmb3Igb3ZlcmZsb3cgb24gdGhlIGJvdHRvbS9yaWdodFxuXHRcdFx0ZWxzZSBpZihvdmVyZmxvdzIgPiAwICYmIChteVNpZGUgIT09IHNpZGUyIHx8IG92ZXJmbG93MSA+IDApICApIHtcblx0XHRcdFx0cG9zaXRpb25bc2lkZTFdIC09IChteVNpZGUgPT09IENFTlRFUiA/IC1vZmZzZXQgOiBvZmZzZXQpICsgYWRqdXN0bWVudDtcblx0XHRcdFx0bmV3TXkuaW52ZXJ0KHNpZGUsIHNpZGUyKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTWFrZSBzdXJlIHdlIGhhdmVuJ3QgbWFkZSB0aGluZ3Mgd29yc2Ugd2l0aCB0aGUgYWRqdXN0bWVudCBhbmQgcmVzZXQgaWYgc29cblx0XHRcdGlmKHBvc2l0aW9uW3NpZGUxXSA8IHZpZXdwb3J0U2Nyb2xsW3NpZGUxXSAmJiAtcG9zaXRpb25bc2lkZTFdID4gb3ZlcmZsb3cyKSB7XG5cdFx0XHRcdHBvc2l0aW9uW3NpZGUxXSA9IGluaXRpYWxQb3M7IG5ld015ID0gbXkuY2xvbmUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcG9zaXRpb25bc2lkZTFdIC0gaW5pdGlhbFBvcztcblx0fVxuXG5cdC8vIFNldCBuZXdNeSBpZiB1c2luZyBmbGlwIG9yIGZsaXBpbnZlcnQgbWV0aG9kc1xuXHRpZihtZXRob2RYICE9PSAnc2hpZnQnIHx8IG1ldGhvZFkgIT09ICdzaGlmdCcpIHsgbmV3TXkgPSBteS5jbG9uZSgpOyB9XG5cblx0Ly8gQWRqdXN0IHBvc2l0aW9uIGJhc2VkIG9udmlld3BvcnQgYW5kIGFkanVzdG1lbnQgb3B0aW9uc1xuXHRhZGp1c3RlZCA9IHtcblx0XHRsZWZ0OiBtZXRob2RYICE9PSAnbm9uZScgPyBjYWxjdWxhdGUoIFgsIFksIG1ldGhvZFgsIGFkanVzdC54LCBMRUZULCBSSUdIVCwgV0lEVEgsIHRhcmdldFdpZHRoLCBlbGVtV2lkdGggKSA6IDAsXG5cdFx0dG9wOiBtZXRob2RZICE9PSAnbm9uZScgPyBjYWxjdWxhdGUoIFksIFgsIG1ldGhvZFksIGFkanVzdC55LCBUT1AsIEJPVFRPTSwgSEVJR0hULCB0YXJnZXRIZWlnaHQsIGVsZW1IZWlnaHQgKSA6IDAsXG5cdFx0bXk6IG5ld015XG5cdH07XG5cblx0cmV0dXJuIGFkanVzdGVkO1xufTtcbjtQTFVHSU5TLnBvbHlzID0ge1xuXHQvLyBQT0xZIGFyZWEgY29vcmRpbmF0ZSBjYWxjdWxhdG9yXG5cdC8vXHRTcGVjaWFsIHRoYW5rcyB0byBFZCBDcmFkb2NrIGZvciBoZWxwaW5nIG91dCB3aXRoIHRoaXMuXG5cdC8vXHRVc2VzIGEgYmluYXJ5IHNlYXJjaCBhbGdvcml0aG0gdG8gZmluZCBzdWl0YWJsZSBjb29yZGluYXRlcy5cblx0cG9seWdvbjogZnVuY3Rpb24oYmFzZUNvb3JkcywgY29ybmVyKSB7XG5cdFx0dmFyIHJlc3VsdCA9IHtcblx0XHRcdHdpZHRoOiAwLCBoZWlnaHQ6IDAsXG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR0b3A6IDFlMTAsIHJpZ2h0OiAwLFxuXHRcdFx0XHRib3R0b206IDAsIGxlZnQ6IDFlMTBcblx0XHRcdH0sXG5cdFx0XHRhZGp1c3RhYmxlOiBGQUxTRVxuXHRcdH0sXG5cdFx0aSA9IDAsIG5leHQsXG5cdFx0Y29vcmRzID0gW10sXG5cdFx0Y29tcGFyZVggPSAxLCBjb21wYXJlWSA9IDEsXG5cdFx0cmVhbFggPSAwLCByZWFsWSA9IDAsXG5cdFx0bmV3V2lkdGgsIG5ld0hlaWdodDtcblxuXHRcdC8vIEZpcnN0IHBhc3MsIHNhbml0aXplIGNvb3JkcyBhbmQgZGV0ZXJtaW5lIG91dGVyIGVkZ2VzXG5cdFx0aSA9IGJhc2VDb29yZHMubGVuZ3RoOyBcblx0XHR3aGlsZShpLS0pIHtcblx0XHRcdG5leHQgPSBbIHBhcnNlSW50KGJhc2VDb29yZHNbLS1pXSwgMTApLCBwYXJzZUludChiYXNlQ29vcmRzW2krMV0sIDEwKSBdO1xuXG5cdFx0XHRpZihuZXh0WzBdID4gcmVzdWx0LnBvc2l0aW9uLnJpZ2h0KXsgcmVzdWx0LnBvc2l0aW9uLnJpZ2h0ID0gbmV4dFswXTsgfVxuXHRcdFx0aWYobmV4dFswXSA8IHJlc3VsdC5wb3NpdGlvbi5sZWZ0KXsgcmVzdWx0LnBvc2l0aW9uLmxlZnQgPSBuZXh0WzBdOyB9XG5cdFx0XHRpZihuZXh0WzFdID4gcmVzdWx0LnBvc2l0aW9uLmJvdHRvbSl7IHJlc3VsdC5wb3NpdGlvbi5ib3R0b20gPSBuZXh0WzFdOyB9XG5cdFx0XHRpZihuZXh0WzFdIDwgcmVzdWx0LnBvc2l0aW9uLnRvcCl7IHJlc3VsdC5wb3NpdGlvbi50b3AgPSBuZXh0WzFdOyB9XG5cblx0XHRcdGNvb3Jkcy5wdXNoKG5leHQpO1xuXHRcdH1cblxuXHRcdC8vIENhbGN1bGF0ZSBoZWlnaHQgYW5kIHdpZHRoIGZyb20gb3V0ZXIgZWRnZXNcblx0XHRuZXdXaWR0aCA9IHJlc3VsdC53aWR0aCA9IE1hdGguYWJzKHJlc3VsdC5wb3NpdGlvbi5yaWdodCAtIHJlc3VsdC5wb3NpdGlvbi5sZWZ0KTtcblx0XHRuZXdIZWlnaHQgPSByZXN1bHQuaGVpZ2h0ID0gTWF0aC5hYnMocmVzdWx0LnBvc2l0aW9uLmJvdHRvbSAtIHJlc3VsdC5wb3NpdGlvbi50b3ApO1xuXG5cdFx0Ly8gSWYgaXQncyB0aGUgY2VudGVyIGNvcm5lci4uLlxuXHRcdGlmKGNvcm5lci5hYmJyZXYoKSA9PT0gJ2MnKSB7XG5cdFx0XHRyZXN1bHQucG9zaXRpb24gPSB7XG5cdFx0XHRcdGxlZnQ6IHJlc3VsdC5wb3NpdGlvbi5sZWZ0ICsgcmVzdWx0LndpZHRoIC8gMixcblx0XHRcdFx0dG9wOiByZXN1bHQucG9zaXRpb24udG9wICsgcmVzdWx0LmhlaWdodCAvIDJcblx0XHRcdH07XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gU2Vjb25kIHBhc3MsIHVzZSBhIGJpbmFyeSBzZWFyY2ggYWxnb3JpdGhtIHRvIGxvY2F0ZSBtb3N0IHN1aXRhYmxlIGNvb3JkaW5hdGVcblx0XHRcdHdoaWxlKG5ld1dpZHRoID4gMCAmJiBuZXdIZWlnaHQgPiAwICYmIGNvbXBhcmVYID4gMCAmJiBjb21wYXJlWSA+IDApXG5cdFx0XHR7XG5cdFx0XHRcdG5ld1dpZHRoID0gTWF0aC5mbG9vcihuZXdXaWR0aCAvIDIpO1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBNYXRoLmZsb29yKG5ld0hlaWdodCAvIDIpO1xuXG5cdFx0XHRcdGlmKGNvcm5lci54ID09PSBMRUZUKXsgY29tcGFyZVggPSBuZXdXaWR0aDsgfVxuXHRcdFx0XHRlbHNlIGlmKGNvcm5lci54ID09PSBSSUdIVCl7IGNvbXBhcmVYID0gcmVzdWx0LndpZHRoIC0gbmV3V2lkdGg7IH1cblx0XHRcdFx0ZWxzZXsgY29tcGFyZVggKz0gTWF0aC5mbG9vcihuZXdXaWR0aCAvIDIpOyB9XG5cblx0XHRcdFx0aWYoY29ybmVyLnkgPT09IFRPUCl7IGNvbXBhcmVZID0gbmV3SGVpZ2h0OyB9XG5cdFx0XHRcdGVsc2UgaWYoY29ybmVyLnkgPT09IEJPVFRPTSl7IGNvbXBhcmVZID0gcmVzdWx0LmhlaWdodCAtIG5ld0hlaWdodDsgfVxuXHRcdFx0XHRlbHNleyBjb21wYXJlWSArPSBNYXRoLmZsb29yKG5ld0hlaWdodCAvIDIpOyB9XG5cblx0XHRcdFx0aSA9IGNvb3Jkcy5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlKGktLSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmKGNvb3Jkcy5sZW5ndGggPCAyKXsgYnJlYWs7IH1cblxuXHRcdFx0XHRcdHJlYWxYID0gY29vcmRzW2ldWzBdIC0gcmVzdWx0LnBvc2l0aW9uLmxlZnQ7XG5cdFx0XHRcdFx0cmVhbFkgPSBjb29yZHNbaV1bMV0gLSByZXN1bHQucG9zaXRpb24udG9wO1xuXG5cdFx0XHRcdFx0aWYoXG5cdFx0XHRcdFx0XHRjb3JuZXIueCA9PT0gTEVGVCAmJiByZWFsWCA+PSBjb21wYXJlWCB8fFxuXHRcdFx0XHRcdFx0Y29ybmVyLnggPT09IFJJR0hUICYmIHJlYWxYIDw9IGNvbXBhcmVYIHx8XG5cdFx0XHRcdFx0XHRjb3JuZXIueCA9PT0gQ0VOVEVSICYmIChyZWFsWCA8IGNvbXBhcmVYIHx8IHJlYWxYID4gcmVzdWx0LndpZHRoIC0gY29tcGFyZVgpIHx8XG5cdFx0XHRcdFx0XHRjb3JuZXIueSA9PT0gVE9QICYmIHJlYWxZID49IGNvbXBhcmVZIHx8XG5cdFx0XHRcdFx0XHRjb3JuZXIueSA9PT0gQk9UVE9NICYmIHJlYWxZIDw9IGNvbXBhcmVZIHx8XG5cdFx0XHRcdFx0XHRjb3JuZXIueSA9PT0gQ0VOVEVSICYmIChyZWFsWSA8IGNvbXBhcmVZIHx8IHJlYWxZID4gcmVzdWx0LmhlaWdodCAtIGNvbXBhcmVZKSkge1xuXHRcdFx0XHRcdFx0Y29vcmRzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJlc3VsdC5wb3NpdGlvbiA9IHsgbGVmdDogY29vcmRzWzBdWzBdLCB0b3A6IGNvb3Jkc1swXVsxXSB9O1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cblx0cmVjdDogZnVuY3Rpb24oYXgsIGF5LCBieCwgYnkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0d2lkdGg6IE1hdGguYWJzKGJ4IC0gYXgpLFxuXHRcdFx0aGVpZ2h0OiBNYXRoLmFicyhieSAtIGF5KSxcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdGxlZnQ6IE1hdGgubWluKGF4LCBieCksXG5cdFx0XHRcdHRvcDogTWF0aC5taW4oYXksIGJ5KVxuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0X2FuZ2xlczoge1xuXHRcdHRjOiAzIC8gMiwgdHI6IDcgLyA0LCB0bDogNSAvIDQsXG5cdFx0YmM6IDEgLyAyLCBicjogMSAvIDQsIGJsOiAzIC8gNCxcblx0XHRyYzogMiwgbGM6IDEsIGM6IDBcblx0fSxcblx0ZWxsaXBzZTogZnVuY3Rpb24oY3gsIGN5LCByeCwgcnksIGNvcm5lcikge1xuXHRcdHZhciBjID0gUExVR0lOUy5wb2x5cy5fYW5nbGVzWyBjb3JuZXIuYWJicmV2KCkgXSxcblx0XHRcdHJ4YyA9IGMgPT09IDAgPyAwIDogcnggKiBNYXRoLmNvcyggYyAqIE1hdGguUEkgKSxcblx0XHRcdHJ5cyA9IHJ5ICogTWF0aC5zaW4oIGMgKiBNYXRoLlBJICk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0d2lkdGg6IHJ4ICogMiAtIE1hdGguYWJzKHJ4YyksXG5cdFx0XHRoZWlnaHQ6IHJ5ICogMiAtIE1hdGguYWJzKHJ5cyksXG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHRsZWZ0OiBjeCArIHJ4Yyxcblx0XHRcdFx0dG9wOiBjeSArIHJ5c1xuXHRcdFx0fSxcblx0XHRcdGFkanVzdGFibGU6IEZBTFNFXG5cdFx0fTtcblx0fSxcblx0Y2lyY2xlOiBmdW5jdGlvbihjeCwgY3ksIHIsIGNvcm5lcikge1xuXHRcdHJldHVybiBQTFVHSU5TLnBvbHlzLmVsbGlwc2UoY3gsIGN5LCByLCByLCBjb3JuZXIpO1xuXHR9XG59O1xuO1BMVUdJTlMuc3ZnID0gZnVuY3Rpb24oYXBpLCBzdmcsIGNvcm5lcilcbntcblx0dmFyIGVsZW0gPSBzdmdbMF0sXG5cdFx0cm9vdCA9ICQoZWxlbS5vd25lclNWR0VsZW1lbnQpLFxuXHRcdG93bmVyRG9jdW1lbnQgPSBlbGVtLm93bmVyRG9jdW1lbnQsXG5cdFx0c3Ryb2tlV2lkdGgyID0gKHBhcnNlSW50KHN2Zy5jc3MoJ3N0cm9rZS13aWR0aCcpLCAxMCkgfHwgMCkgLyAyLFxuXHRcdGZyYW1lT2Zmc2V0LCBtdHgsIHRyYW5zZm9ybWVkLFxuXHRcdGxlbiwgbmV4dCwgaSwgcG9pbnRzLFxuXHRcdHJlc3VsdCwgcG9zaXRpb247XG5cblx0Ly8gQXNjZW5kIHRoZSBwYXJlbnROb2RlIGNoYWluIHVudGlsIHdlIGZpbmQgYW4gZWxlbWVudCB3aXRoIGdldEJCb3goKVxuXHR3aGlsZSghZWxlbS5nZXRCQm94KSB7IGVsZW0gPSBlbGVtLnBhcmVudE5vZGU7IH1cblx0aWYoIWVsZW0uZ2V0QkJveCB8fCAhZWxlbS5wYXJlbnROb2RlKSB7IHJldHVybiBGQUxTRTsgfVxuXG5cdC8vIERldGVybWluZSB3aGljaCBzaGFwZSBjYWxjdWxhdGlvbiB0byB1c2Vcblx0c3dpdGNoKGVsZW0ubm9kZU5hbWUpIHtcblx0XHRjYXNlICdlbGxpcHNlJzpcblx0XHRjYXNlICdjaXJjbGUnOlxuXHRcdFx0cmVzdWx0ID0gUExVR0lOUy5wb2x5cy5lbGxpcHNlKFxuXHRcdFx0XHRlbGVtLmN4LmJhc2VWYWwudmFsdWUsXG5cdFx0XHRcdGVsZW0uY3kuYmFzZVZhbC52YWx1ZSxcblx0XHRcdFx0KGVsZW0ucnggfHwgZWxlbS5yKS5iYXNlVmFsLnZhbHVlICsgc3Ryb2tlV2lkdGgyLFxuXHRcdFx0XHQoZWxlbS5yeSB8fCBlbGVtLnIpLmJhc2VWYWwudmFsdWUgKyBzdHJva2VXaWR0aDIsXG5cdFx0XHRcdGNvcm5lclxuXHRcdFx0KTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgJ2xpbmUnOlxuXHRcdGNhc2UgJ3BvbHlnb24nOlxuXHRcdGNhc2UgJ3BvbHlsaW5lJzpcblx0XHRcdC8vIERldGVybWluZSBwb2ludHMgb2JqZWN0IChsaW5lIGhhcyBub25lLCBzbyBtaW1pYyB1c2luZyBhcnJheSlcblx0XHRcdHBvaW50cyA9IGVsZW0ucG9pbnRzIHx8IFtcblx0XHRcdFx0eyB4OiBlbGVtLngxLmJhc2VWYWwudmFsdWUsIHk6IGVsZW0ueTEuYmFzZVZhbC52YWx1ZSB9LFxuXHRcdFx0XHR7IHg6IGVsZW0ueDIuYmFzZVZhbC52YWx1ZSwgeTogZWxlbS55Mi5iYXNlVmFsLnZhbHVlIH1cblx0XHRcdF07XG5cblx0XHRcdGZvcihyZXN1bHQgPSBbXSwgaSA9IC0xLCBsZW4gPSBwb2ludHMubnVtYmVyT2ZJdGVtcyB8fCBwb2ludHMubGVuZ3RoOyArK2kgPCBsZW47KSB7XG5cdFx0XHRcdG5leHQgPSBwb2ludHMuZ2V0SXRlbSA/IHBvaW50cy5nZXRJdGVtKGkpIDogcG9pbnRzW2ldO1xuXHRcdFx0XHRyZXN1bHQucHVzaC5hcHBseShyZXN1bHQsIFtuZXh0LngsIG5leHQueV0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXN1bHQgPSBQTFVHSU5TLnBvbHlzLnBvbHlnb24ocmVzdWx0LCBjb3JuZXIpO1xuXHRcdGJyZWFrO1xuXG5cdFx0Ly8gVW5rbm93biBzaGFwZSBvciByZWN0YW5nbGU/IFVzZSBib3VuZGluZyBib3hcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmVzdWx0ID0gZWxlbS5nZXRCQm94KCk7XG5cdFx0XHRyZXN1bHQgPSB7XG5cdFx0XHRcdHdpZHRoOiByZXN1bHQud2lkdGgsXG5cdFx0XHRcdGhlaWdodDogcmVzdWx0LmhlaWdodCxcblx0XHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0XHRsZWZ0OiByZXN1bHQueCxcblx0XHRcdFx0XHR0b3A6IHJlc3VsdC55XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0YnJlYWs7XG5cdH1cblxuXHQvLyBTaG9ydGN1dCBhc3NpZ25tZW50c1xuXHRwb3NpdGlvbiA9IHJlc3VsdC5wb3NpdGlvbjtcblx0cm9vdCA9IHJvb3RbMF07XG5cblx0Ly8gQ29udmVydCBwb3NpdGlvbiBpbnRvIGEgcGl4ZWwgdmFsdWVcblx0aWYocm9vdC5jcmVhdGVTVkdQb2ludCkge1xuXHRcdG10eCA9IGVsZW0uZ2V0U2NyZWVuQ1RNKCk7XG5cdFx0cG9pbnRzID0gcm9vdC5jcmVhdGVTVkdQb2ludCgpO1xuXG5cdFx0cG9pbnRzLnggPSBwb3NpdGlvbi5sZWZ0O1xuXHRcdHBvaW50cy55ID0gcG9zaXRpb24udG9wO1xuXHRcdHRyYW5zZm9ybWVkID0gcG9pbnRzLm1hdHJpeFRyYW5zZm9ybSggbXR4ICk7XG5cdFx0cG9zaXRpb24ubGVmdCA9IHRyYW5zZm9ybWVkLng7XG5cdFx0cG9zaXRpb24udG9wID0gdHJhbnNmb3JtZWQueTtcblx0fVxuXG5cdC8vIENoZWNrIHRoZSBlbGVtZW50IGlzIG5vdCBpbiBhIGNoaWxkIGRvY3VtZW50LCBhbmQgaWYgc28sIGFkanVzdCBmb3IgZnJhbWUgZWxlbWVudHMgb2Zmc2V0XG5cdGlmKG93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50ICYmIGFwaS5wb3NpdGlvbi50YXJnZXQgIT09ICdtb3VzZScpIHtcblx0XHRmcmFtZU9mZnNldCA9ICQoKG93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcgfHwgb3duZXJEb2N1bWVudC5wYXJlbnRXaW5kb3cpLmZyYW1lRWxlbWVudCkub2Zmc2V0KCk7XG5cdFx0aWYoZnJhbWVPZmZzZXQpIHtcblx0XHRcdHBvc2l0aW9uLmxlZnQgKz0gZnJhbWVPZmZzZXQubGVmdDtcblx0XHRcdHBvc2l0aW9uLnRvcCArPSBmcmFtZU9mZnNldC50b3A7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQWRqdXN0IGJ5IHNjcm9sbCBvZmZzZXQgb2Ygb3duZXIgZG9jdW1lbnRcblx0b3duZXJEb2N1bWVudCA9ICQob3duZXJEb2N1bWVudCk7XG5cdHBvc2l0aW9uLmxlZnQgKz0gb3duZXJEb2N1bWVudC5zY3JvbGxMZWZ0KCk7XG5cdHBvc2l0aW9uLnRvcCArPSBvd25lckRvY3VtZW50LnNjcm9sbFRvcCgpO1xuXG5cdHJldHVybiByZXN1bHQ7XG59O1xuO1BMVUdJTlMuaW1hZ2VtYXAgPSBmdW5jdGlvbihhcGksIGFyZWEsIGNvcm5lcilcbntcblx0aWYoIWFyZWEuanF1ZXJ5KSB7IGFyZWEgPSAkKGFyZWEpOyB9XG5cblx0dmFyIHNoYXBlID0gKGFyZWEuYXR0cignc2hhcGUnKSB8fCAncmVjdCcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgncG9seScsICdwb2x5Z29uJyksXG5cdFx0aW1hZ2UgPSAkKCdpbWdbdXNlbWFwPVwiIycrYXJlYS5wYXJlbnQoJ21hcCcpLmF0dHIoJ25hbWUnKSsnXCJdJyksXG5cdFx0Y29vcmRzU3RyaW5nID0gJC50cmltKGFyZWEuYXR0cignY29vcmRzJykpLFxuXHRcdGNvb3Jkc0FycmF5ID0gY29vcmRzU3RyaW5nLnJlcGxhY2UoLywkLywgJycpLnNwbGl0KCcsJyksXG5cdFx0aW1hZ2VPZmZzZXQsIGNvb3JkcywgaSwgcmVzdWx0LCBsZW47XG5cblx0Ly8gSWYgd2UgY2FuJ3QgZmluZCB0aGUgaW1hZ2UgdXNpbmcgdGhlIG1hcC4uLlxuXHRpZighaW1hZ2UubGVuZ3RoKSB7IHJldHVybiBGQUxTRTsgfVxuXG5cdC8vIFBhc3MgY29vcmRpbmF0ZXMgc3RyaW5nIGlmIHBvbHlnb25cblx0aWYoc2hhcGUgPT09ICdwb2x5Z29uJykge1xuXHRcdHJlc3VsdCA9IFBMVUdJTlMucG9seXMucG9seWdvbihjb29yZHNBcnJheSwgY29ybmVyKTtcblx0fVxuXG5cdC8vIE90aGVyd2lzZSBwYXJzZSB0aGUgY29vcmRpbmF0ZXMgYW5kIHBhc3MgdGhlbSBhcyBhcmd1bWVudHNcblx0ZWxzZSBpZihQTFVHSU5TLnBvbHlzW3NoYXBlXSkge1xuXHRcdGZvcihpID0gLTEsIGxlbiA9IGNvb3Jkc0FycmF5Lmxlbmd0aCwgY29vcmRzID0gW107ICsraSA8IGxlbjspIHtcblx0XHRcdGNvb3Jkcy5wdXNoKCBwYXJzZUludChjb29yZHNBcnJheVtpXSwgMTApICk7XG5cdFx0fVxuXG5cdFx0cmVzdWx0ID0gUExVR0lOUy5wb2x5c1tzaGFwZV0uYXBwbHkoXG5cdFx0XHR0aGlzLCBjb29yZHMuY29uY2F0KGNvcm5lcilcblx0XHQpO1xuXHR9XG5cblx0Ly8gSWYgbm8gc2hhcHJlIGNhbGN1bGF0aW9uIG1ldGhvZCB3YXMgZm91bmQsIHJldHVybiBmYWxzZVxuXHRlbHNlIHsgcmV0dXJuIEZBTFNFOyB9XG5cblx0Ly8gTWFrZSBzdXJlIHdlIGFjY291bnQgZm9yIHBhZGRpbmcgYW5kIGJvcmRlcnMgb24gdGhlIGltYWdlXG5cdGltYWdlT2Zmc2V0ID0gaW1hZ2Uub2Zmc2V0KCk7XG5cdGltYWdlT2Zmc2V0LmxlZnQgKz0gTWF0aC5jZWlsKChpbWFnZS5vdXRlcldpZHRoKEZBTFNFKSAtIGltYWdlLndpZHRoKCkpIC8gMik7XG5cdGltYWdlT2Zmc2V0LnRvcCArPSBNYXRoLmNlaWwoKGltYWdlLm91dGVySGVpZ2h0KEZBTFNFKSAtIGltYWdlLmhlaWdodCgpKSAvIDIpO1xuXG5cdC8vIEFkZCBpbWFnZSBwb3NpdGlvbiB0byBvZmZzZXQgY29vcmRpbmF0ZXNcblx0cmVzdWx0LnBvc2l0aW9uLmxlZnQgKz0gaW1hZ2VPZmZzZXQubGVmdDtcblx0cmVzdWx0LnBvc2l0aW9uLnRvcCArPSBpbWFnZU9mZnNldC50b3A7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn07XG47dmFyIElFNixcblxuLypcbiAqIEJHSUZyYW1lIGFkYXB0aW9uIChodHRwOi8vcGx1Z2lucy5qcXVlcnkuY29tL3Byb2plY3QvYmdpZnJhbWUpXG4gKiBTcGVjaWFsIHRoYW5rcyB0byBCcmFuZG9uIEFhcm9uXG4gKi9cbkJHSUZSQU1FID0gJzxpZnJhbWUgY2xhc3M9XCJxdGlwLWJnaWZyYW1lXCIgZnJhbWVib3JkZXI9XCIwXCIgdGFiaW5kZXg9XCItMVwiIHNyYz1cImphdmFzY3JpcHQ6XFwnXFwnO1wiICcgK1xuXHQnIHN0eWxlPVwiZGlzcGxheTpibG9jazsgcG9zaXRpb246YWJzb2x1dGU7IHotaW5kZXg6LTE7IGZpbHRlcjphbHBoYShvcGFjaXR5PTApOyAnICtcblx0XHQnLW1zLWZpbHRlcjpcInByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5BbHBoYShPcGFjaXR5PTApXCI7XCI+PC9pZnJhbWU+JztcblxuZnVuY3Rpb24gSWU2KGFwaSkge1xuXHR0aGlzLl9ucyA9ICdpZTYnO1xuXG5cdHRoaXMucXRpcCA9IGFwaTtcblx0dGhpcy5pbml0KGFwaSk7XG59XG5cbiQuZXh0ZW5kKEllNi5wcm90b3R5cGUsIHtcblx0X3Njcm9sbCA6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBvdmVybGF5ID0gdGhpcy5xdGlwLmVsZW1lbnRzLm92ZXJsYXk7XG5cdFx0b3ZlcmxheSAmJiAob3ZlcmxheVswXS5zdHlsZS50b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAncHgnKTtcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbihxdGlwKSB7XG5cdFx0dmFyIHRvb2x0aXAgPSBxdGlwLnRvb2x0aXA7XG5cblx0XHQvLyBDcmVhdGUgdGhlIEJHSUZyYW1lIGVsZW1lbnQgaWYgbmVlZGVkXG5cdFx0aWYoJCgnc2VsZWN0LCBvYmplY3QnKS5sZW5ndGggPCAxKSB7XG5cdFx0XHR0aGlzLmJnaWZyYW1lID0gcXRpcC5lbGVtZW50cy5iZ2lmcmFtZSA9ICQoQkdJRlJBTUUpLmFwcGVuZFRvKHRvb2x0aXApO1xuXG5cdFx0XHQvLyBVcGRhdGUgQkdJRnJhbWUgb24gdG9vbHRpcCBtb3ZlXG5cdFx0XHRxdGlwLl9iaW5kKHRvb2x0aXAsICd0b29sdGlwbW92ZScsIHRoaXMuYWRqdXN0QkdJRnJhbWUsIHRoaXMuX25zLCB0aGlzKTtcblx0XHR9XG5cblx0XHQvLyByZWRyYXcoKSBjb250YWluZXIgZm9yIHdpZHRoL2hlaWdodCBjYWxjdWxhdGlvbnNcblx0XHR0aGlzLnJlZHJhd0NvbnRhaW5lciA9ICQoJzxkaXYvPicsIHsgaWQ6IE5BTUVTUEFDRSsnLXJjb250YWluZXInIH0pXG5cdFx0XHQuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG5cblx0XHQvLyBGaXh1cCBtb2RhbCBwbHVnaW4gaWYgcHJlc2VudCB0b29cblx0XHRpZiggcXRpcC5lbGVtZW50cy5vdmVybGF5ICYmIHF0aXAuZWxlbWVudHMub3ZlcmxheS5hZGRDbGFzcygncXRpcG1vZGFsLWllNmZpeCcpICkge1xuXHRcdFx0cXRpcC5fYmluZCh3aW5kb3csIFsnc2Nyb2xsJywgJ3Jlc2l6ZSddLCB0aGlzLl9zY3JvbGwsIHRoaXMuX25zLCB0aGlzKTtcblx0XHRcdHF0aXAuX2JpbmQodG9vbHRpcCwgWyd0b29sdGlwc2hvdyddLCB0aGlzLl9zY3JvbGwsIHRoaXMuX25zLCB0aGlzKTtcblx0XHR9XG5cblx0XHQvLyBTZXQgZGltZW5zaW9uc1xuXHRcdHRoaXMucmVkcmF3KCk7XG5cdH0sXG5cblx0YWRqdXN0QkdJRnJhbWU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0b29sdGlwID0gdGhpcy5xdGlwLnRvb2x0aXAsXG5cdFx0XHRkaW1lbnNpb25zID0ge1xuXHRcdFx0XHRoZWlnaHQ6IHRvb2x0aXAub3V0ZXJIZWlnaHQoRkFMU0UpLFxuXHRcdFx0XHR3aWR0aDogdG9vbHRpcC5vdXRlcldpZHRoKEZBTFNFKVxuXHRcdFx0fSxcblx0XHRcdHBsdWdpbiA9IHRoaXMucXRpcC5wbHVnaW5zLnRpcCxcblx0XHRcdHRpcCA9IHRoaXMucXRpcC5lbGVtZW50cy50aXAsXG5cdFx0XHR0aXBBZGp1c3QsIG9mZnNldDtcblxuXHRcdC8vIEFkanVzdCBib3JkZXIgb2Zmc2V0XG5cdFx0b2Zmc2V0ID0gcGFyc2VJbnQodG9vbHRpcC5jc3MoJ2JvcmRlckxlZnRXaWR0aCcpLCAxMCkgfHwgMDtcblx0XHRvZmZzZXQgPSB7IGxlZnQ6IC1vZmZzZXQsIHRvcDogLW9mZnNldCB9O1xuXG5cdFx0Ly8gQWRqdXN0IGZvciB0aXBzIHBsdWdpblxuXHRcdGlmKHBsdWdpbiAmJiB0aXApIHtcblx0XHRcdHRpcEFkanVzdCA9IHBsdWdpbi5jb3JuZXIucHJlY2VkYW5jZSA9PT0gJ3gnID8gW1dJRFRILCBMRUZUXSA6IFtIRUlHSFQsIFRPUF07XG5cdFx0XHRvZmZzZXRbIHRpcEFkanVzdFsxXSBdIC09IHRpcFsgdGlwQWRqdXN0WzBdIF0oKTtcblx0XHR9XG5cblx0XHQvLyBVcGRhdGUgYmdpZnJhbWVcblx0XHR0aGlzLmJnaWZyYW1lLmNzcyhvZmZzZXQpLmNzcyhkaW1lbnNpb25zKTtcblx0fSxcblxuXHQvLyBNYXgvbWluIHdpZHRoIHNpbXVsYXRvciBmdW5jdGlvblxuXHRyZWRyYXc6IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHRoaXMucXRpcC5yZW5kZXJlZCA8IDEgfHwgdGhpcy5kcmF3aW5nKSB7IHJldHVybiB0aGlzOyB9XG5cblx0XHR2YXIgdG9vbHRpcCA9IHRoaXMucXRpcC50b29sdGlwLFxuXHRcdFx0c3R5bGUgPSB0aGlzLnF0aXAub3B0aW9ucy5zdHlsZSxcblx0XHRcdGNvbnRhaW5lciA9IHRoaXMucXRpcC5vcHRpb25zLnBvc2l0aW9uLmNvbnRhaW5lcixcblx0XHRcdHBlcmMsIHdpZHRoLCBtYXgsIG1pbjtcblxuXHRcdC8vIFNldCBkcmF3aW5nIGZsYWdcblx0XHR0aGlzLnF0aXAuZHJhd2luZyA9IDE7XG5cblx0XHQvLyBJZiB0b29sdGlwIGhhcyBhIHNldCBoZWlnaHQvd2lkdGgsIGp1c3Qgc2V0IGl0Li4uIGxpa2UgYSBib3NzIVxuXHRcdGlmKHN0eWxlLmhlaWdodCkgeyB0b29sdGlwLmNzcyhIRUlHSFQsIHN0eWxlLmhlaWdodCk7IH1cblx0XHRpZihzdHlsZS53aWR0aCkgeyB0b29sdGlwLmNzcyhXSURUSCwgc3R5bGUud2lkdGgpOyB9XG5cblx0XHQvLyBTaW11bGF0ZSBtYXgvbWluIHdpZHRoIGlmIG5vdCBzZXQgd2lkdGggcHJlc2VudC4uLlxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gUmVzZXQgd2lkdGggYW5kIGFkZCBmbHVpZCBjbGFzc1xuXHRcdFx0dG9vbHRpcC5jc3MoV0lEVEgsICcnKS5hcHBlbmRUbyh0aGlzLnJlZHJhd0NvbnRhaW5lcik7XG5cblx0XHRcdC8vIEdyYWIgb3VyIHRvb2x0aXAgd2lkdGggKGFkZCAxIGlmIG9kZCBzbyB3ZSBkb24ndCBnZXQgd3JhcHBpbmcgcHJvYmxlbXMuLiBodXp6YWghKVxuXHRcdFx0d2lkdGggPSB0b29sdGlwLndpZHRoKCk7XG5cdFx0XHRpZih3aWR0aCAlIDIgPCAxKSB7IHdpZHRoICs9IDE7IH1cblxuXHRcdFx0Ly8gR3JhYiBvdXIgbWF4L21pbiBwcm9wZXJ0aWVzXG5cdFx0XHRtYXggPSB0b29sdGlwLmNzcygnbWF4V2lkdGgnKSB8fCAnJztcblx0XHRcdG1pbiA9IHRvb2x0aXAuY3NzKCdtaW5XaWR0aCcpIHx8ICcnO1xuXG5cdFx0XHQvLyBQYXJzZSBpbnRvIHByb3BlciBwaXhlbCB2YWx1ZXNcblx0XHRcdHBlcmMgPSAobWF4ICsgbWluKS5pbmRleE9mKCclJykgPiAtMSA/IGNvbnRhaW5lci53aWR0aCgpIC8gMTAwIDogMDtcblx0XHRcdG1heCA9IChtYXguaW5kZXhPZignJScpID4gLTEgPyBwZXJjIDogMSAqIHBhcnNlSW50KG1heCwgMTApKSB8fCB3aWR0aDtcblx0XHRcdG1pbiA9IChtaW4uaW5kZXhPZignJScpID4gLTEgPyBwZXJjIDogMSAqIHBhcnNlSW50KG1pbiwgMTApKSB8fCAwO1xuXG5cdFx0XHQvLyBEZXRlcm1pbmUgbmV3IGRpbWVuc2lvbiBzaXplIGJhc2VkIG9uIG1heC9taW4vY3VycmVudCB2YWx1ZXNcblx0XHRcdHdpZHRoID0gbWF4ICsgbWluID8gTWF0aC5taW4oTWF0aC5tYXgod2lkdGgsIG1pbiksIG1heCkgOiB3aWR0aDtcblxuXHRcdFx0Ly8gU2V0IHRoZSBuZXdseSBjYWxjdWxhdGVkIHdpZHRoIGFuZCByZW12b2UgZmx1aWQgY2xhc3Ncblx0XHRcdHRvb2x0aXAuY3NzKFdJRFRILCBNYXRoLnJvdW5kKHdpZHRoKSkuYXBwZW5kVG8oY29udGFpbmVyKTtcblx0XHR9XG5cblx0XHQvLyBTZXQgZHJhd2luZyBmbGFnXG5cdFx0dGhpcy5kcmF3aW5nID0gMDtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXHRcdC8vIFJlbW92ZSBpZnJhbWVcblx0XHR0aGlzLmJnaWZyYW1lICYmIHRoaXMuYmdpZnJhbWUucmVtb3ZlKCk7XG5cblx0XHQvLyBSZW1vdmUgYm91bmQgZXZlbnRzXG5cdFx0dGhpcy5xdGlwLl91bmJpbmQoW3dpbmRvdywgdGhpcy5xdGlwLnRvb2x0aXBdLCB0aGlzLl9ucyk7XG5cdH1cbn0pO1xuXG5JRTYgPSBQTFVHSU5TLmllNiA9IGZ1bmN0aW9uKGFwaSkge1xuXHQvLyBQcm9jZWVkIG9ubHkgaWYgdGhlIGJyb3dzZXIgaXMgSUU2XG5cdHJldHVybiBCUk9XU0VSLmllID09PSA2ID8gbmV3IEllNihhcGkpIDogRkFMU0U7XG59O1xuXG5JRTYuaW5pdGlhbGl6ZSA9ICdyZW5kZXInO1xuXG5DSEVDS1MuaWU2ID0ge1xuXHQnXmNvbnRlbnR8c3R5bGUkJzogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yZWRyYXcoKTtcblx0fVxufTtcbjt9KSk7XG59KCB3aW5kb3csIGRvY3VtZW50ICkpO1xuIiwiLyohXG4qIHNjcmVlbmZ1bGxcbiogdjUuMC4yIC0gMjAyMC0wMi0xM1xuKiAoYykgU2luZHJlIFNvcmh1czsgTUlUIExpY2Vuc2VcbiovXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGRvY3VtZW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cuZG9jdW1lbnQgOiB7fTtcblx0dmFyIGlzQ29tbW9uanMgPSB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cztcblxuXHR2YXIgZm4gPSAoZnVuY3Rpb24gKCkge1xuXHRcdHZhciB2YWw7XG5cblx0XHR2YXIgZm5NYXAgPSBbXG5cdFx0XHRbXG5cdFx0XHRcdCdyZXF1ZXN0RnVsbHNjcmVlbicsXG5cdFx0XHRcdCdleGl0RnVsbHNjcmVlbicsXG5cdFx0XHRcdCdmdWxsc2NyZWVuRWxlbWVudCcsXG5cdFx0XHRcdCdmdWxsc2NyZWVuRW5hYmxlZCcsXG5cdFx0XHRcdCdmdWxsc2NyZWVuY2hhbmdlJyxcblx0XHRcdFx0J2Z1bGxzY3JlZW5lcnJvcidcblx0XHRcdF0sXG5cdFx0XHQvLyBOZXcgV2ViS2l0XG5cdFx0XHRbXG5cdFx0XHRcdCd3ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbicsXG5cdFx0XHRcdCd3ZWJraXRFeGl0RnVsbHNjcmVlbicsXG5cdFx0XHRcdCd3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCcsXG5cdFx0XHRcdCd3ZWJraXRGdWxsc2NyZWVuRW5hYmxlZCcsXG5cdFx0XHRcdCd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJyxcblx0XHRcdFx0J3dlYmtpdGZ1bGxzY3JlZW5lcnJvcidcblxuXHRcdFx0XSxcblx0XHRcdC8vIE9sZCBXZWJLaXRcblx0XHRcdFtcblx0XHRcdFx0J3dlYmtpdFJlcXVlc3RGdWxsU2NyZWVuJyxcblx0XHRcdFx0J3dlYmtpdENhbmNlbEZ1bGxTY3JlZW4nLFxuXHRcdFx0XHQnd2Via2l0Q3VycmVudEZ1bGxTY3JlZW5FbGVtZW50Jyxcblx0XHRcdFx0J3dlYmtpdENhbmNlbEZ1bGxTY3JlZW4nLFxuXHRcdFx0XHQnd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsXG5cdFx0XHRcdCd3ZWJraXRmdWxsc2NyZWVuZXJyb3InXG5cblx0XHRcdF0sXG5cdFx0XHRbXG5cdFx0XHRcdCdtb3pSZXF1ZXN0RnVsbFNjcmVlbicsXG5cdFx0XHRcdCdtb3pDYW5jZWxGdWxsU2NyZWVuJyxcblx0XHRcdFx0J21vekZ1bGxTY3JlZW5FbGVtZW50Jyxcblx0XHRcdFx0J21vekZ1bGxTY3JlZW5FbmFibGVkJyxcblx0XHRcdFx0J21vemZ1bGxzY3JlZW5jaGFuZ2UnLFxuXHRcdFx0XHQnbW96ZnVsbHNjcmVlbmVycm9yJ1xuXHRcdFx0XSxcblx0XHRcdFtcblx0XHRcdFx0J21zUmVxdWVzdEZ1bGxzY3JlZW4nLFxuXHRcdFx0XHQnbXNFeGl0RnVsbHNjcmVlbicsXG5cdFx0XHRcdCdtc0Z1bGxzY3JlZW5FbGVtZW50Jyxcblx0XHRcdFx0J21zRnVsbHNjcmVlbkVuYWJsZWQnLFxuXHRcdFx0XHQnTVNGdWxsc2NyZWVuQ2hhbmdlJyxcblx0XHRcdFx0J01TRnVsbHNjcmVlbkVycm9yJ1xuXHRcdFx0XVxuXHRcdF07XG5cblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIGwgPSBmbk1hcC5sZW5ndGg7XG5cdFx0dmFyIHJldCA9IHt9O1xuXG5cdFx0Zm9yICg7IGkgPCBsOyBpKyspIHtcblx0XHRcdHZhbCA9IGZuTWFwW2ldO1xuXHRcdFx0aWYgKHZhbCAmJiB2YWxbMV0gaW4gZG9jdW1lbnQpIHtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHJldFtmbk1hcFswXVtpXV0gPSB2YWxbaV07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0pKCk7XG5cblx0dmFyIGV2ZW50TmFtZU1hcCA9IHtcblx0XHRjaGFuZ2U6IGZuLmZ1bGxzY3JlZW5jaGFuZ2UsXG5cdFx0ZXJyb3I6IGZuLmZ1bGxzY3JlZW5lcnJvclxuXHR9O1xuXG5cdHZhciBzY3JlZW5mdWxsID0ge1xuXHRcdHJlcXVlc3Q6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHR2YXIgb25GdWxsU2NyZWVuRW50ZXJlZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0aGlzLm9mZignY2hhbmdlJywgb25GdWxsU2NyZWVuRW50ZXJlZCk7XG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHR9LmJpbmQodGhpcyk7XG5cblx0XHRcdFx0dGhpcy5vbignY2hhbmdlJywgb25GdWxsU2NyZWVuRW50ZXJlZCk7XG5cblx0XHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG5cdFx0XHRcdHZhciByZXR1cm5Qcm9taXNlID0gZWxlbWVudFtmbi5yZXF1ZXN0RnVsbHNjcmVlbl0oKTtcblxuXHRcdFx0XHRpZiAocmV0dXJuUHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRcdFx0XHRyZXR1cm5Qcm9taXNlLnRoZW4ob25GdWxsU2NyZWVuRW50ZXJlZCkuY2F0Y2gocmVqZWN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR9LFxuXHRcdGV4aXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdGlmICghdGhpcy5pc0Z1bGxzY3JlZW4pIHtcblx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIG9uRnVsbFNjcmVlbkV4aXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dGhpcy5vZmYoJ2NoYW5nZScsIG9uRnVsbFNjcmVlbkV4aXQpO1xuXHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0fS5iaW5kKHRoaXMpO1xuXG5cdFx0XHRcdHRoaXMub24oJ2NoYW5nZScsIG9uRnVsbFNjcmVlbkV4aXQpO1xuXG5cdFx0XHRcdHZhciByZXR1cm5Qcm9taXNlID0gZG9jdW1lbnRbZm4uZXhpdEZ1bGxzY3JlZW5dKCk7XG5cblx0XHRcdFx0aWYgKHJldHVyblByb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHRcdFx0cmV0dXJuUHJvbWlzZS50aGVuKG9uRnVsbFNjcmVlbkV4aXQpLmNhdGNoKHJlamVjdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0fSxcblx0XHR0b2dnbGU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pc0Z1bGxzY3JlZW4gPyB0aGlzLmV4aXQoKSA6IHRoaXMucmVxdWVzdChlbGVtZW50KTtcblx0XHR9LFxuXHRcdG9uY2hhbmdlOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0XHRcdHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcblx0XHR9LFxuXHRcdG9uZXJyb3I6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0dGhpcy5vbignZXJyb3InLCBjYWxsYmFjayk7XG5cdFx0fSxcblx0XHRvbjogZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIGV2ZW50TmFtZSA9IGV2ZW50TmFtZU1hcFtldmVudF07XG5cdFx0XHRpZiAoZXZlbnROYW1lKSB7XG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0b2ZmOiBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgZXZlbnROYW1lID0gZXZlbnROYW1lTWFwW2V2ZW50XTtcblx0XHRcdGlmIChldmVudE5hbWUpIHtcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyYXc6IGZuXG5cdH07XG5cblx0aWYgKCFmbikge1xuXHRcdGlmIChpc0NvbW1vbmpzKSB7XG5cdFx0XHRtb2R1bGUuZXhwb3J0cyA9IHtpc0VuYWJsZWQ6IGZhbHNlfTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luZG93LnNjcmVlbmZ1bGwgPSB7aXNFbmFibGVkOiBmYWxzZX07XG5cdFx0fVxuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoc2NyZWVuZnVsbCwge1xuXHRcdGlzRnVsbHNjcmVlbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBCb29sZWFuKGRvY3VtZW50W2ZuLmZ1bGxzY3JlZW5FbGVtZW50XSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRlbGVtZW50OiB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBkb2N1bWVudFtmbi5mdWxsc2NyZWVuRWxlbWVudF07XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpc0VuYWJsZWQ6IHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Ly8gQ29lcmNlIHRvIGJvb2xlYW4gaW4gY2FzZSBvZiBvbGQgV2ViS2l0XG5cdFx0XHRcdHJldHVybiBCb29sZWFuKGRvY3VtZW50W2ZuLmZ1bGxzY3JlZW5FbmFibGVkXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRpZiAoaXNDb21tb25qcykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gc2NyZWVuZnVsbDtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuc2NyZWVuZnVsbCA9IHNjcmVlbmZ1bGw7XG5cdH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBjcnlwdCA9IHJlcXVpcmUoJ2NyeXB0JyksXG4gICAgICB1dGY4ID0gcmVxdWlyZSgnY2hhcmVuYycpLnV0ZjgsXG4gICAgICBiaW4gPSByZXF1aXJlKCdjaGFyZW5jJykuYmluLFxuXG4gIC8vIFRoZSBjb3JlXG4gIHNoYTEgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIC8vIENvbnZlcnQgdG8gYnl0ZSBhcnJheVxuICAgIGlmIChtZXNzYWdlLmNvbnN0cnVjdG9yID09IFN0cmluZylcbiAgICAgIG1lc3NhZ2UgPSB1dGY4LnN0cmluZ1RvQnl0ZXMobWVzc2FnZSk7XG4gICAgZWxzZSBpZiAodHlwZW9mIEJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIEJ1ZmZlci5pc0J1ZmZlciA9PSAnZnVuY3Rpb24nICYmIEJ1ZmZlci5pc0J1ZmZlcihtZXNzYWdlKSlcbiAgICAgIG1lc3NhZ2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtZXNzYWdlLCAwKTtcbiAgICBlbHNlIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlKSlcbiAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlLnRvU3RyaW5nKCk7XG5cbiAgICAvLyBvdGhlcndpc2UgYXNzdW1lIGJ5dGUgYXJyYXlcblxuICAgIHZhciBtICA9IGNyeXB0LmJ5dGVzVG9Xb3JkcyhtZXNzYWdlKSxcbiAgICAgICAgbCAgPSBtZXNzYWdlLmxlbmd0aCAqIDgsXG4gICAgICAgIHcgID0gW10sXG4gICAgICAgIEgwID0gIDE3MzI1ODQxOTMsXG4gICAgICAgIEgxID0gLTI3MTczMzg3OSxcbiAgICAgICAgSDIgPSAtMTczMjU4NDE5NCxcbiAgICAgICAgSDMgPSAgMjcxNzMzODc4LFxuICAgICAgICBINCA9IC0xMDA5NTg5Nzc2O1xuXG4gICAgLy8gUGFkZGluZ1xuICAgIG1bbCA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIGwgJSAzMik7XG4gICAgbVsoKGwgKyA2NCA+Pj4gOSkgPDwgNCkgKyAxNV0gPSBsO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSArPSAxNikge1xuICAgICAgdmFyIGEgPSBIMCxcbiAgICAgICAgICBiID0gSDEsXG4gICAgICAgICAgYyA9IEgyLFxuICAgICAgICAgIGQgPSBIMyxcbiAgICAgICAgICBlID0gSDQ7XG5cbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgODA7IGorKykge1xuXG4gICAgICAgIGlmIChqIDwgMTYpXG4gICAgICAgICAgd1tqXSA9IG1baSArIGpdO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgbiA9IHdbaiAtIDNdIF4gd1tqIC0gOF0gXiB3W2ogLSAxNF0gXiB3W2ogLSAxNl07XG4gICAgICAgICAgd1tqXSA9IChuIDw8IDEpIHwgKG4gPj4+IDMxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0ID0gKChIMCA8PCA1KSB8IChIMCA+Pj4gMjcpKSArIEg0ICsgKHdbal0gPj4+IDApICsgKFxuICAgICAgICAgICAgICAgIGogPCAyMCA/IChIMSAmIEgyIHwgfkgxICYgSDMpICsgMTUxODUwMDI0OSA6XG4gICAgICAgICAgICAgICAgaiA8IDQwID8gKEgxIF4gSDIgXiBIMykgKyAxODU5Nzc1MzkzIDpcbiAgICAgICAgICAgICAgICBqIDwgNjAgPyAoSDEgJiBIMiB8IEgxICYgSDMgfCBIMiAmIEgzKSAtIDE4OTQwMDc1ODggOlxuICAgICAgICAgICAgICAgICAgICAgICAgIChIMSBeIEgyIF4gSDMpIC0gODk5NDk3NTE0KTtcblxuICAgICAgICBINCA9IEgzO1xuICAgICAgICBIMyA9IEgyO1xuICAgICAgICBIMiA9IChIMSA8PCAzMCkgfCAoSDEgPj4+IDIpO1xuICAgICAgICBIMSA9IEgwO1xuICAgICAgICBIMCA9IHQ7XG4gICAgICB9XG5cbiAgICAgIEgwICs9IGE7XG4gICAgICBIMSArPSBiO1xuICAgICAgSDIgKz0gYztcbiAgICAgIEgzICs9IGQ7XG4gICAgICBINCArPSBlO1xuICAgIH1cblxuICAgIHJldHVybiBbSDAsIEgxLCBIMiwgSDMsIEg0XTtcbiAgfSxcblxuICAvLyBQdWJsaWMgQVBJXG4gIGFwaSA9IGZ1bmN0aW9uIChtZXNzYWdlLCBvcHRpb25zKSB7XG4gICAgdmFyIGRpZ2VzdGJ5dGVzID0gY3J5cHQud29yZHNUb0J5dGVzKHNoYTEobWVzc2FnZSkpO1xuICAgIHJldHVybiBvcHRpb25zICYmIG9wdGlvbnMuYXNCeXRlcyA/IGRpZ2VzdGJ5dGVzIDpcbiAgICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLmFzU3RyaW5nID8gYmluLmJ5dGVzVG9TdHJpbmcoZGlnZXN0Ynl0ZXMpIDpcbiAgICAgICAgY3J5cHQuYnl0ZXNUb0hleChkaWdlc3RieXRlcyk7XG4gIH07XG5cbiAgYXBpLl9ibG9ja3NpemUgPSAxNjtcbiAgYXBpLl9kaWdlc3RzaXplID0gMjA7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBhcGk7XG59KSgpO1xuIl19
