/**
 * Use this file to import what you need from the bundled npm modules.
 */

// Must import from node_modules folder or it won't see the shimmed jquery instance
// Removed from here because they weren't being loaded in the right order - JPB
// import '../node_modules/select2/dist/js/select2.js';
// import "../node_modules/select2/dist/css/select2.css";

import "qtip2";
//require("../node_modules/qtip2/dist/jquery.qtip.min.js");
//import "../node_modules/qtip2/dist/jquery.qtip.min.css";

import "clip-path-polygon";

//let screenfull = require('screenfull');
//import screenfull from "screenfull";

// CDN resources
// Font-Awesome
//$("head").append($("<script src='https://use.fontawesome.com/a703e2e5bf.js'></script>"));