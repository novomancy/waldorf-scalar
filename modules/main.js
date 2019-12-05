/*
Entry point for the whole project. Any jQuery extensions should
be registered here.
*/

// Import npm module dependencies
import "./vendor.js";

import "./utils/array-extensions.js";
import "./utils/jquery-extensions.js";
import "./utils/string-extensions.js";

import { preferences } from "./utils/preference-manager.js";
import { VerifyRequirements } from "./utils/requirements.js";
import { AnnotatorVideoPlayer } from "./video-player/video-player.js";


$.fn.annotate = function(args){ 

    // let serverURL = args.serverURL || '';
    // let tagsURL = args.tagsURL || '';
    // let apiKey = args.apiKey || '';
    // let kioskMode = args.kioskMode || false;
    // let localURL = args.localURL || '';
    // let renderer = function(...) || false;

    // Error out early if "this" is not a video
    if($(this).prop('tagName').toLowerCase() != "video"){
        console.error("Cannot wrap a non-video element!");
        return;
    }

    if(!VerifyRequirements()){
        return;
    }

    // preferences.GetJSON((data) => {
    //     //console.log(data);
    // });
    
    //Prep args to pass to annotator

    let annotatorArgs = args;
    new AnnotatorVideoPlayer($(this), args);

};