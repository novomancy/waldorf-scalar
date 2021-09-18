import { ServerInterface } from "./server-interface.js";
import { AnnotationManager } from "./annotation-manager.js";
import { TickBar } from "./components/tick-bar.js";
import { PolygonOverlay } from "./components/polygon-overlay.js";
import { preferences } from "../utils/preference-manager.js";
import { AnnotationGUI } from "./components/annotation-gui.js";
import { InfoContainer } from "./components/info-container.js";
import { IndexContainer } from "./components/index-container.js";
import { SessionManager } from "./session-manager.js";
import { MessageOverlay } from "./components/message-overlay.js";
import { Annotation } from "./annotation.js";
let sha1 = require('sha1');

class VideoAnnotator {
    constructor(args){
        console.log("[VideoAnnotator] Creating VideoAnnotator...");

        //Parse arguments
        //This is actually required
        if(typeof args.player === 'undefined'){
            console.log('Called for a new VideoAnnotator without passing a player!');
            return false;
        }
        this.player = args.player;  // Bring in the argument from the constructor
        

        //These config options are required for saving annotations to a server
        this.serverURL = typeof args.serverURL === 'undefined' ? '' : args.serverURL;
        this.tagsURL = typeof args.tagsURL === 'undefined' ? '' : args.tagsURL;
        this.apiKey = typeof args.apiKey === 'undefined' ? '' : args.apiKey;

        //If apiKey is set and cmsUsername and cmsEmail are passed, we'll auto login later
        this.cmsUsername = typeof args.cmsUsername === 'undefined' ? '' : args.cmsUsername;
        this.cmsEmail = typeof args.cmsEmail === 'undefined' ? '' : args.cmsEmail;

        //This config option is required for using a static annotation file
        this.localURL = typeof args.localURL === 'undefined' ? '' : args.localURL;

        //Optional params
        //Removes the editing interface
        this.kioskMode = typeof args.kioskMode === 'undefined' ? '' : args.kioskMode;
        //Shows the 'open manifest' button if kioskMode is off
        this.showManifest = typeof args.showManifest === 'undefined' ? false : args.showManifest;        
        //Allows passing in a function that overrides the default annotation renderer
        this.renderer = typeof args.renderer === 'undefined' ? false : args.renderer;
        //Allows passing in a function that overrides the default annotation renderer
        this.unrenderer = typeof args.unrenderer === 'undefined' ? false : args.unrenderer;
        //Determines whether or not the annotation container is cleared every time it updates
        this.clearContainer = typeof args.clearContainer === 'undefined' ? true : args.clearContainer;
        //Determines whether or not to create a navigable index of annotations
        this.displayIndex = typeof args.displayIndex === 'undefined' ? false : args.displayIndex;   
        
        //Determine the language of the annotation
        this.onomyLanguage = typeof args.onomyLanguage === 'undefined' ? '' : args.onomyLanguage;

        this.onomyVocabulary = [];
        //localURL implies kiosk mode
        if(this.localURL != '') this.kioskMode = true;

        //additional data from annotations collected from scalar to be added in API 2.0 
        this.contentLabel = "";
        this.artURL = "";
        this.annotationPageURL = "";

        this.Wrap();
        this.PopulateControls();

        //may need to move this below the this.server block later?
        this.messageOverlay = new MessageOverlay(this);
        this.annotationManager = new AnnotationManager();
        this.sessionManager = new SessionManager(this);

        //load onomy vocabulary, if it exists
        if(this.tagsURL!=''){
            $.ajax(this.gui.GetTagsQuery()).done((vocabulary)=>{
                //console.log("OnomyVocabulary is loaded");
                let parsedVocabulary = this.gui.OnomyVocabularyProcess(vocabulary, this.onomyLanguage);
                this.annotationManager.UpdateOnomyVocabulary(parsedVocabulary);
                this.onomyVocabulary = parsedVocabulary;
            });
        }

        //localURL takes precendence - if it is anything but '' then do not load from server
        if(this.localURL == ''){
            this.server = new ServerInterface(this);
            this.server.SetBaseURL(this.serverURL);

            // Load annotations from server based on the player's video URL
            this.server.FetchAnnotations('location', this.player.videoElement.currentSrc)
            .done((json)=>{
                if ('undefined' == typeof(json.items)) {  // Version 1
                    //json.shift()  // Assume first node is a content node
                    for (var j = json.length-1; j >= 0; j--) {
                        if(json[j].type != "Annotation"){
                            var annotation_info = json[j];
                            this.contentLabel = annotation_info["dcterms:title"];
                            this.artURL = annotation_info["art:url"];
                            console.log(annotation_info["dcterms:title"]);
                            json.splice(j,1);
                        } else {
                            for (var k = 0; k < json[j].target.selector.length; k++) {
                                if ('FragmentSelector' != json[j].target.selector[k].type) continue;
                                json[j].target.selector[k].value = json[j].target.selector[k].value.replace('#t=npt:','t=');
                            }
                        }
                    }
                } else {  // Version 2
                    this.contentLabel = json.label.en[0];
                    this.artURL = json.items[0].content.id;
                    if(typeof json.items[0].items[0] != 'undefined'){
                        this.annotationPageURL = json.items[0].items[0].items[0].id;
                    } else {
                        this.annotationPageURL = '';
                    }
                }

                this.annotationManager.PopulateFromJSON(json);
                this.AnnotationsLoaded();
            });

            //auto-login if not in kiosk mode, and we have the cms variables and API key
            if(!this.kioskMode){
                if(this.apiKey && this.cmsEmail && this.cmsUsername){
                    this.server.LogOut();
                    this.server.LogIn(this.cmsUsername, sha1(this.cmsEmail)).done(() => {
                        console.log("[Main] CMS login success");
                    }).fail(() => {
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
            }).done((data) => {
                console.log(`Fetched ${data.length} annotations from local cache.`);
                var json = data;
                if ('undefined' == typeof(json.items)) {  // Version 1
                    //json.shift()  // Assume first node is a content node
                    for (var j = json.length-1; j >= 0; j--) {
                        if(json[j].type != "Annotation"){
                            var annotation_info = json[j];
                            this.contentLabel = annotation_info["dcterms:title"];
                            this.artURL = annotation_info["art:url"];
                            console.log(annotation_info["dcterms:title"]);
                            json.splice(j,1);
                        } else {
                            for (var k = 0; k < json[j].target.selector.length; k++) {
                                if ('FragmentSelector' != json[j].target.selector[k].type) continue;
                                json[j].target.selector[k].value = json[j].target.selector[k].value.replace('#t=npt:','t=');
                            }
                        }
                    }
                } else {  // Version 2
                    this.contentLabel = json.label.en[0];
                    this.artURL = json.items[0].content.id;
                }
                this.annotationManager.PopulateFromJSON(data);
                this.AnnotationsLoaded();
            }).fail((response) => {
                console.log(response);
                console.error(`Error fetching annotations from local cache"\n${response.responseJSON.detail}.`);
                this.annotator.messageOverlay.ShowError(`Could not retrieve annotations!<br>(${response.responseJSON.detail})`);
            });
        }

        this.player.$container.on("OnTimeUpdate", (event, time) => {
            this.OnTimeUpdate(time);
        });

        this.$container.on("OnPolyClicked", (event, annotation) => {
            // Edit a poly when clicked, but only if the editor isn't already open
            if(!this.gui.open){
                this.$addAnnotationButton.button("disable");
                this.gui.BeginEditing(annotation);
            }
        });

        this.$container.on("OnPolygonClicked", (event, annotation) => {
            console.log("OnPolygonClicked event captured");
        });

        this.$container.on("OnAnimationClicked", (event, annotation) => {
            console.log("OnAnimationClicked event captured");
        });

        this.gui.$container.on("OnGUIClosed", (event) => {
            this.$addAnnotationButton.button("enable");
        });

        this.url = this.player.videoElement.currentSrc;

        console.log("[VideoAnnotator] Annotator created for video.");
    }


    readConfig() {
        const config = require("../annotator-config.json"); 
        this.apiKey = config.api_key;
    }
    /**
     * Creates the divs that surround the video player.
     */
    Wrap(){
        // Wrap the video player with this container. Can't use .wrap due to duplication issues    
        var videoContainer = $(this.player.$container).parent();
        var waldorfContainer = $("<div class='waldorf-container'></div>");
        waldorfContainer.insertBefore($(this.player.$container));
        waldorfContainer.append(this.player.$container);
        this.$container = videoContainer.parent();

        // Set the container to the width of the video player
        this.$container.width(this.player.$container.width());

        // Allow the video player container to grow
        //this.player.$container.width("100%");
        //this.player.$container.height("100%");

        // Copy the video styles to the container
        // console.log(this.player.originalStyles);
        this.$container.css(this.player.originalStyles);
    }

    PopulateControls(){
        // Create the tick bar
        this.tickBar = new TickBar(this);

        // Create the polygon overlay
        this.polyOverlay = new PolygonOverlay(this);

        if(!this.kioskMode && this.showManifest){
            this.$debugControls = $("<div class='waldorf-debug-controls'></div>").appendTo(this.$container);
            var $showAllAnnotationsButton = this.$debugControls.append('<button>Open Annotation Manifest in New Window</button>');
            $showAllAnnotationsButton.click(() => {
                let url = this.player.videoElement.currentSrc;
                this.server.FetchAnnotations("location", url).done((json) => {
                    let win = window.open();
                    if(win === null) {
                        console.error("Couldn't show annotation manifest; please allow pop-ups.");
                        this.messageOverlay.ShowError("Couldn't show annotation manifest; please allow pop-ups.");
                    }
                    else {
                        win.document.open();
                        win.document.write(`<title>Annotation Manifest for ${url}</title>`);
                        win.document.write("<pre>");
                        win.document.write(JSON.stringify(json, null, 2).escapeHTML());

                        win.document.write("</pre>");
                        win.document.close();
                    }
                });
                
            });
        }

        // Wrap all the buttons with the list tag
        //this.$debugControls.wrapInner("<ul></ul>");
        // Wrap each button with the list element tag
        //this.$debugControls.find("button").wrap("<li></li>");

        // Create the info container
        this.infoContainer = new InfoContainer(this);

        if(this.displayIndex) this.indexContainer = new IndexContainer(this);

        // Inject the annotation edit button into the toolbar
        if(!this.kioskMode){
            this.$addAnnotationButton = $("<button>Add New Annotation</button>").button({
                icon: "fa fa-plus",
                showLabel: false
            }).click(() => {
                this.$addAnnotationButton.button("disable");
                this.gui.BeginEditing();
            });
            this.player.controlBar.RegisterElement(this.$addAnnotationButton, 3, 'flex-end');

            // Inject the annotation upload button into the toolbar
            this.$uploadAnnotationButton = $("<button type='file'>Import Annotation From File</button>").button({
                icon: "fa fa-upload",
                showLabel: false
            }).click(() => {
                this.LoadFromFile();
            });
            this.player.controlBar.RegisterElement(this.$uploadAnnotationButton, 2, 'flex-end');
        }
        this.gui = new AnnotationGUI(this);

    }

    AnnotationsLoaded(){
        //Send annotation loaded event
        this.$container.trigger("OnAnnotationsLoaded", this.annotationManager);
    }

    OnTimeUpdate(time){
        this.annotationsNow = this.annotationManager.AnnotationsAtTime(time);

        if(this.annotationsNow.equals(this.lastAnnotationSet)){  
            this.SetAnnotationTimePosition(time);
            return;
        } 
        this.lastAnnotationSet = this.annotationsNow;

        this.UpdateViews();
    }

    SetAnnotationTimePosition(time){
        //console.log("time: " + time);
        //Check safari and multiple geometric annotation
        if (this.IsSafari() && this.annotationsNow.length > 1) {
            let msg = "Multiple geometric annotations are detected.<br>";
            msg += "Safari doesn't support multiple geometric annotations.<br>";
            msg += "Chrome or Firefox are recommended.";
            this.messageOverlay.ShowMessage(msg, 2.0);
            return; //no animation for safari browser with multiple geometric annotation
        }

        for (let i = 0; i < this.annotationsNow.length; i++ ) {
            let annotation_id = this.annotationsNow[i].id;
            if (this.polyOverlay.svgElementsHash[annotation_id]) {
                this.polyOverlay.svgElementsHash[annotation_id].animate.beginElement();
                let time_diff = time - this.annotationsNow[i].beginTime;
                let current_time = this.polyOverlay.svgElementsHash[annotation_id].svgElement.getCurrentTime();
                //console.log("\t i:" + i + " (" + annotation_id + "), svg current_time:" + current_time + ", animate time_diff: " + time_diff);
                this.polyOverlay.svgElementsHash[annotation_id].svgElement.setCurrentTime(current_time + time_diff);
                this.polyOverlay.svgElementsHash[annotation_id].animate.endElement();
            }
        }
        
    }

    UpdateViews(){
        //console.log("annotator.js:267 UpdateViews");
        this.annotationsNow = this.annotationManager.AnnotationsAtTime(this.player.videoElement.currentTime);

        // Update the info container
        this.infoContainer.Rebuild(this.annotationsNow, this.clearContainer);

        this.$container.trigger("OnNewAnnotationSet", [this.annotationsNow]);
        this.SetAnnotationTimePosition(this.player.videoElement.currentTime);
    }

    GetAnnotations(){
        let ordered = this.annotationManager.annotations.slice();
        let orderByStart = function(a, b){
            let aTime = a.beginTime;
            let bTime = b.beginTime;
            return ((aTime < bTime) ? -1 : ((aTime > bTime) ? 1 : 0));
        }
        ordered.sort(orderByStart);
        return ordered;
    }

    RegisterNewAnnotation(annotation){
        //console.log(annotation);
        //this.annotationManager.RegisterAnnotation(annotation);
        this.annotationManager.PopulateFromJSON(annotation);

        // Throw event for listening objects (e.g. tick-bar)
        this.$container.trigger("OnAnnotationRegistered", [annotation]);

        // Update dependent views
        this.UpdateViews();
    }

    UpdateAnnotation(annotation, oldID){
        this.annotationManager.UpdateAnnotation(annotation, oldID);

        // Throw event for listening objects (e.g. tick-bar)
        this.$container.trigger("OnAnnotationRemoved", [oldID]);
        this.$container.trigger("OnAnnotationRegistered", [annotation]);

        // Update dependent views
        this.UpdateViews();
    }

    DeregisterAnnotation(annotation){
        var id = '';
        if ('undefined' == typeof(annotation.items)) { // Ver 1
            id = annotation.id;
        } else { // Ver 2
            id = annotation.items[0].items[0].items[0].id;
        }
        
        this.annotationManager.RemoveAnnotation(id);
        //this.annotationsNow = this.annotationManager.AnnotationsAtTime(this.player.videoElement.currentTime);

        // Throw event for listening objects (e.g. tick-bar)
        this.$container.trigger("OnAnnotationRemoved", [id]);

        // Update dependent views
        this.UpdateViews();

    }

    LoadFromFile() {
        // Create the dialog
        let $container = $("<div class='waldorf-session-modal' title='Import Annotation'></div>"); // Outermost HTML
        let $headText = $("<p class='validateTips'>Annotations must be W3C OA compliant in JSON format.</p>").appendTo($container);
        let $errorText = $("<p class='validateTips modal-error-text'></p>").appendTo($container);
        $errorText.hide();
        let $form = $("<form></form>").appendTo($container);

        let $importField;

        $("<label for='importFile'>Select File</label>").appendTo($form);
        $importField = $("<input type='file' name='importFile' class='file ui-widget-content ui-corner-all'>").appendTo($form);
        
        $form.wrapInner("<fieldset />");

        let error = (message) => {
            console.error(message);
            $errorText.html(message);
            $errorText.show();
        }

        let self = this;
        $importField.on('change', () => {
            let files = $importField.get(0).files;
            let fr = new FileReader();

            fr.onload = ((localFile) => {
                // If the JSON is malformed, show an error and stop here.
                try {
                    JSON.parse(localFile.target.result);
                } 
                catch (e) {
                    error("JSON file is malformed!");
                    return;
                }

                let localJson = JSON.parse(localFile.target.result);
                if(typeof(localJson.target)!="undefined"){
                    let annotation = new Annotation(localJson);
                    if(this.ValidateAnnotation(annotation)){
                        // Open the GUI and populate it with this annotation's data.
                        this.gui.BeginEditing(annotation, true);
                        this.gui.CommitAnnotationToServer(function(){return;});
                    }
                    else {
                        error("JSON is invalid!");
                    }
                } else {
                    for(var i=0; i<localJson.length; i++){
                        let annotation = new Annotation(localJson[i]);
                        if(this.ValidateAnnotation(annotation)){
                            // Open the GUI and populate it with this annotation's data.
                            this.gui.BeginEditing(annotation, true);
                            this.gui.CommitAnnotationToServer((annotation) => {
                                this.RegisterNewAnnotation(annotation);
                                this.gui.Close();
                            });
                        }
                        else {
                            error("JSON is invalid!");
                        }
                    }
                }
                $dialog.dialog("close");
            });
            fr.readAsText(files[0]);
        });

        let $dialog = $container.dialog({
            autoOpen: true,
            draggable: false,
            modal: true,
            buttons: {
                Cancel: () => {
                    $dialog.dialog("close");
                }
            },
            close: () => {
                $dialog.find("form")[ 0 ].reset();
                $dialog.find("input").removeClass( "ui-state-error" );
                //this.OnModalClose();
            }
        });
    }

    ValidateAnnotation(annotation) {
        // TODO: Validate annotation here. Return false if any
        // required properties are not present.

        return true;
    }

    // checking whether the browser is safari or not
    IsSafari() {
        //ref: https://stackoverflow.com/questions/49872111/detect-safari-and-stop-script
        let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        return isSafari;
    }


}

export { VideoAnnotator };