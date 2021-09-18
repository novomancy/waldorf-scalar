import { GetFormattedTime, GetSecondsFromHMS } from "../../utils/time.js";
import { PolygonEditor } from "./polygon-editor.js";
import { Annotation } from "../annotation.js";
import { tsThisType } from "@babel/types";

class AnnotationGUI {

    constructor(annotator){
        this.annotator = annotator;

        this.Create();

        this.open = false;

        //Hide the container
        this.isVisible = false;
        this.$container.makeVisible(false);

        this.polyEditor = new PolygonEditor(this.annotator);

        this.annotator.$container.on("OnPolygonEditingEnded", () => {
            this.SetVisible(true);
            this.polyEditor.ShowJustPolygon();
        });

    }

    Create(){
        /*
         * //new UI
         * 
         */
        this.$container = $("<div id='create-dialog' class='ui-widget-content center'>").appendTo(this.annotator.player.$container);
        this.$container.draggable();
        this.$title = $("<div class='dialog-title'>Create Annotation</div>").appendTo(this.$container);

        // Make cancel button
        let $exitButton = $("<button>Exit Annotation Editing</button>").button({
            icons: {primary: 'fa fa-remove'},
            showLabel: false
        });
        $exitButton.css("float", "right");
        $exitButton.attr('title', "Exit annotation editing");
        $exitButton.addClass("waldorf-cancel-button");
        $exitButton.click(() => {
            this.polyEditor.ResetPolygons();
            this.Close();
        });
        this.RegisterElement($exitButton, this.$title, -1);

        this.$tabs = $("<div id='tabs'></div>").appendTo(this.$container);
    
        
        let $tabUI = $("<ul></ul>");
        let $startUI = $("<li><a href='#start_tab'>Start </a></li>");
        let $bodyUI = $("<li><a href='#body_tab'>Body </a></li>");
        let $stopUI = $("<li><a href='#stop_tab'>Stop </a></li>");
        this.RegisterElement($tabUI, this.$tabs, -1);
        this.RegisterElement($startUI, $tabUI, -1);
        this.RegisterElement($bodyUI, $tabUI, -1);
        this.RegisterElement($stopUI, $tabUI, -1);

        //Create tabs
        let $startTab = $("<div id='start_tab' class='ui-field-contain'></div>");
        this.RegisterElement($startTab, this.$tabs, -1);

        let $bodyTab = $("<div id='body_tab'></div>");
        this.RegisterElement($bodyTab, this.$tabs, -1);

        let $stopTab = $("<div id='stop_tab'></div>");
        this.RegisterElement($stopTab, this.$tabs, -1);

        //Add hidden fields for creator info
        this.$creatorNameField = $('<input type="hidden" name="creator-nickname" id="creator-nickname" value="">');
        this.$creatorNameField.appendTo($startTab);
        this.$creatorEmailField = $('<input type="hidden" name="creator-email" id="creator-email" value="">');
        this.$creatorEmailField.appendTo($startTab);

        //Begin filling start tab
        // Make "Start time" label and field
        this.$timeStartField = $('<input type="text" name="time-start" id="time-start" value="">');
        this.$timeStartField.width(72);
        this.$timeStartField.css("font-family", "Courier, monospace");
        this.$timeStartField.css("margin-right", "2px");
        this.$timeStartField.addClass("ui-widget ui-widget-content ui-corner-all");
        this.$timeStartField.attr('title', "Start time (hh:mm:ss.ss)");
        this.$timeStartField.on('keypress', function(event){
            if (event.keyCode == 46 || (event.keyCode >= 48 && event.keyCode <= 58)){ //0-9, period, and colon
                return true;
            }
            return false;
        });

        //add start marker button
        this.$startTimeMarker = $("<button style='padding:0; line-height:1.4'>Set Start</button> ").button({
            icon: "fa fa-map-marker",
            showLabel: false
        }).click(() => {
            this.$timeStartField[0].value = GetFormattedTime(this.annotator.player.videoElement.currentTime);
        });
        this.RegisterElement(this.$startTimeMarker, $startTab);   

        $("<label for='time-start'>Start Time: </label> ").appendTo($startTab);
        this.$timeStartField.appendTo($startTab);
        this.$startTimeJump =  $("<i class='fa fa-clock-o' style='cursor: pointer; padding:0; line-height:1.4; color: white;'></i><br><br>").click(() => {
            this.annotator.player.videoElement.currentTime = GetSecondsFromHMS(this.$timeStartField[0].value);
        });
        this.RegisterElement(this.$startTimeJump, $startTab);


        //Make "Edit polygon" button
        let $editPolyButton = $("<button style='padding:0; line-height:1.4'>Edit Polygon</button>").button({
            icon: "fa fa-pencil",
            showLabel: false
        }).click(() => {
            this.SetVisible(false);
            //console.log("annotation-gui:353 Create");
            this.polyEditor.BeginEditing('start');
        });
        $editPolyButton.attr('title', "Edit polygon");
        this.RegisterElement($editPolyButton, $startTab, -1);

        let $startTargetLabel = $("<label>Start Target</label> ");
        $startTargetLabel.css("color", "white");
        this.RegisterElement($startTargetLabel, $startTab, -1);

        // Add tags input field
        this.$tagsField = $('<select class="form-control" multiple="multiple"></select>');
        this.$tagsField.width("100%");
        this.$tagsField.css("margin-top", "-8px");
        this.RegisterElement(this.$tagsField, $bodyTab, -1);
        if(this.annotator.tagsURL==''){
            console.log("NoTagsUrl")
            this.$tagsField.select2({
                tags: true,
                placeholder: "Tags",
                data: [{id: 1, text:'Enter tags above.'},{id:2, text:"the second one"}],
                selectOnBlur: true,
                // Allow manually entered text in drop down.
                createTag: function (params) {
                    return {
                        id: params.term,
                        text: params.term
                        // newOption: true
                    }
                }
            });  
        } else {
            console.log("hasTagsURL")
            this.$tagsField.select2({
                tags: true,
                placeholder: "Tags",
                ajax: this.GetTagsQuery(),
                selectOnBlur: true,
                // Allow manually entered text in drop down.
                createTag: function (params) {
                    return {
                        id: params.term,
                        text: params.term
                        // newOption: true
                    }
                }
            });
        }
        // Add custom class for bringing the dropdown to the front (fullscreen fix)
        this.$tagsField.data('select2').$dropdown.addClass("select2-dropdown-annotator");

        // Make notes text field
        this.$textField = $('<textarea type="text" name="anno-text" id="anno-text" value="" placeholder="Notes">');
        this.$textField.css("margin-top", "2px");
        this.$textField.width("98.5%");
        this.$textField.addClass("ui-widget ui-widget-content ui-corner-all");
        this.$textField.attr('title', 'Annotation text');
        this.$textField.css("flex-grow", 2);
        this.RegisterElement(this.$textField, $bodyTab, -1);

        // Make "Stop time" label and field
        this.$timeEndField = $('<input type="text" name="time-stop" id="time-stop" value="">');
        this.$timeEndField.width(72);
        this.$timeEndField.css("font-family", "Courier, monospace");
        this.$timeEndField.css("margin-right", "2px");
        this.$timeEndField.addClass("ui-widget ui-widget-content ui-corner-all");
        this.$timeEndField.attr('title', "Start time (hh:mm:ss.ss)");
        this.$timeEndField.on('keypress', function(event){
            if (event.keyCode == 46 || (event.keyCode >= 48 && event.keyCode <= 58)){ //0-9, period, and colon
                return true;
            }
            return false;
        });

        //add end marker button
        this.$endTimeMarker = $("<button style='padding:0; line-height:1.4'>Set End</button>").button({
            icon: "fa fa-map-marker",
            showLabel: false
        }).click(() => {
            this.$timeEndField[0].value = GetFormattedTime(this.annotator.player.videoElement.currentTime);
        });
        
        this.RegisterElement(this.$endTimeMarker, $stopTab);
        $("<label for='stop_time'>Stop Time: </label> ").appendTo($stopTab);
        this.$timeEndField.appendTo($stopTab);

        this.$endTimeJump =  $("<i class='fa fa-clock-o' style='cursor: pointer; padding:0; line-height:1.4; color: white;'></i><br><br>").click(() => {
            this.annotator.player.videoElement.currentTime = GetSecondsFromHMS(this.$timeEndField[0].value);
        });
        this.RegisterElement(this.$endTimeJump, $stopTab);

        //Make "Edit polygon" button
        let $editStopPolyButton = $("<button style='padding:0; line-height:1.4'>Edit Polygon</button>").button({
            icon: "fa fa-pencil",
            showLabel: false
        }).click(() => {
            this.SetVisible(false);
            //console.log("annotation-gui:353 Create");
            this.polyEditor.BeginEditing('stop');
        });
        $editStopPolyButton.attr('title', "Edit polygon");
        this.RegisterElement($editStopPolyButton, $stopTab, -1);

        let $stopTargetLabel = $("<label>Stop Target</label> ");
        $stopTargetLabel.css("color", "white");
        this.RegisterElement($stopTargetLabel, $stopTab, -1);

        //stop point polygon is added
        this.$endPolygonSet = $("<button style='padding:0; line-height:1.4'>End Polygon Set</button>").button({
            icon: "fa fa-check-square-o",
            showLabel: false
        });
        //this.$endPolygonSet.css("visibility", "inherit");
        this.$endPolygonSet.css("visibility", "hidden");
        //this.$endPolygonSet.addClass("waldorf-confirm-button");
    
        //Add some error checking...
        this.$timeEndField.blur(() => {
            let e = $(this.$timeEndField).val();
            let s = $(this.$timeStartField).val();
            if(GetSecondsFromHMS(s+1) > GetSecondsFromHMS(e)){
                $(this.$timeEndField).val(GetFormattedTime(GetSecondsFromHMS(s)+.01));
            }
        });
        this.$timeStartField.blur(() => {
            let e = $(this.$timeEndField).val();
            let s = $(this.$timeStartField).val();
            if(GetSecondsFromHMS(s+1) > GetSecondsFromHMS(e)){
                $(this.$timeEndField).val(GetFormattedTime(GetSecondsFromHMS(s)+.01));
            }
        });

        this.RegisterElement(this.$endPolygonSet, $stopTab, -2); 

        let $buttonPanel = $("<div class='button_panel'></div>").appendTo(this.$container);

        // Make delete button. This should only appear if we're editing, not if it's a new annotation
        this.$deleteButton = $("<button id='delete_annotation_button'>Delete</button>").button({
            // icon: "fa fa-bomb",
            showLabel: true
        });
        // this.$deleteButton.hide();
        this.$deleteButton.attr('title', "Delete annotation");
        this.$deleteButton.click(() => {
            this.annotator.server.DeleteAnnotation(this.originalAnnotation, () => {
                this.annotator.DeregisterAnnotation(this.originalAnnotation);
                this.Close();
            });
        });
        this.RegisterElement(this.$deleteButton, $buttonPanel, -1);


        // Make cancel button
        let $cancelButton = $("<button>Cancel</button>").button({
            showLabel: true
        }).click(() => {
            this.polyEditor.ResetPolygons();
            this.Close();
        });
        $cancelButton.attr('title', "Exit annotation editing");
        //$cancel_button.addClass("waldorf-cancel-button");
        this.RegisterElement($cancelButton, $buttonPanel, -1);
        
        // Make save button
        let $saveButton = $("<button>Save</button>").button({
            showLabel: true
        }).click(() => {
            this.CommitAnnotationToServer((annotation, oldID) => {
                if(this.editMode){
                    this.annotator.UpdateAnnotation(annotation, oldID);
                } else {
                    this.annotator.RegisterNewAnnotation(annotation);
                }
                this.polyEditor.ResetPolygons();
                this.Close();
            });
        });
        $saveButton.attr('title', "Save annotation");
        this.RegisterElement($saveButton, $buttonPanel, -1);

        //https://stackoverflow.com/questions/13837304/jquery-ui-non-ajax-tab-loading-whole-website-into-itself
        $('base').remove();
        this.$tabs.tabs().addClass('ui-tabs-vertical');
        //let $script_section = $
        //this.$container.hide();
    }

    RegisterElement($element, $container, order, justification = 'flex-start'){
        $element.css('order', order);
        $element.css('align-self', justification);
        // Sets grow [shrink] [basis]
        //$element.css('flex', '0 0 auto');
        $container.append($element);
    }

    SetVisible(isVisible, duration = 0){

        //console.log(isVisible + " " + duration);
        if(isVisible){
            this.$container.fadeTo(duration, 1.0);
            this.$container.makeVisible(true);
        } else {
            this.$container.stop(true, true);
            this.$container.fadeTo(duration, 0.0);
            this.$container.makeVisible(false);
        }
        this.isVisible = isVisible;

    }

    ToggleOpen(){

        if(this.open){
            this.Close();
        } else {
            this.Open();
        }

    }

    Open(){
        this.SetVisible(true);
        this.open = true;
        this.polyEditor.Done();
        // Disable autofading when the gui is visible
        this.annotator.player.SetAutoFade(false);
    }

    Close(){
        this.SetVisible(false);
        this.open = false;
        this.polyEditor.Done();
        // Re-enable autofading when the gui is hidden
        this.annotator.player.SetAutoFade(true);
        this.$container.trigger("OnGUIClosed");
    }
    
    ToggleVisible(){
        this.SetVisible(!this.isVisible, 0);
    }

    BeginEditing(annotation = null, forceNew = false){
        // Open the GUI if it isn't already
        this.Open();
        
        // Populate data from the passed in annotation
        if (annotation || forceNew) {
            // Populate the fields from the annotation
            this.editMode = true;

            // Flip edit mode back to false if forceNew. We want to
            // populate from the entire passed in annotation, but treat
            // it as new.
            if(forceNew) this.editMode = false;

            this.originalAnnotation = annotation;

            console.log("Populated from an existing annotation");
            console.log(annotation);
            this.$timeStartField.val(GetFormattedTime(annotation.beginTime));
            this.$timeEndField.val(GetFormattedTime(annotation.endTime));
            if ('undefined' == typeof(annotation.items)) { // Version 1
                this.$textField.val(annotation.body.filter(item => item.purpose == "describing")[0].value);
                // Version 1 doesn't have a this.id context
            } else { // Version 2
                this.$textField.val(annotation.items[0].items[0].items[0].body.filter(item => item.purpose == "describing")[0].value);
                this.id = annotation.items[0].items[0].items[0].id;
            }
            // Reset the tags field
            this.$tagsField.val("").trigger("change");
            this.$tagsField.find("option").remove();

            for(let tag of annotation.tags){
                this.$tagsField.append("<option value='"+tag+"' selected>"+tag+"</option>");
                this.$tagsField.trigger("change");
            }

            //add creators, if they are specified
            if('undefined' != typeof annotation.creator){
                this.$creatorNameField.val(annotation.creator.nickname);
                this.$creatorEmailField.val(annotation.creator.email);
            }

            this.polyEditor.InitPoly(annotation.polyStart,annotation.polyEnd);

        }
        // Insert template data if no annotation is given
        else {
            // Populate fields if no annotation is given
            this.editMode = false;

            this.originalAnnotation = null;

            console.log("Populated with template data");
            this.$timeStartField.val(GetFormattedTime(this.annotator.player.videoElement.currentTime));
            this.$timeEndField.val(GetFormattedTime(this.annotator.player.videoElement.duration));
            this.$creatorNameField.val(localStorage.getItem('waldorf_user_name'));
            this.$creatorEmailField.val(localStorage.getItem('waldorf_user_email'));
            this.$textField.val("");
            // Reset the tags field
            this.$tagsField.val("").trigger("change");
            this.$tagsField.find("option").remove();

            this.polyEditor.InitPoly();
        }

        // Modify GUI based on edit mode
        if(this.editMode) {
            this.$title.text("Edit Annotation");
            this.$deleteButton.button("enable");
            this.$deleteButton.show();
        }
        else {
            this.$title.text("Create Annotation");
            this.$deleteButton.button("disable");
            this.$deleteButton.hide();
        }

    }

    CommitAnnotationToServer(callback){
        if(this.editMode){
            console.log("Sending edited annotation to server...");
            this.annotator.server.EditAnnotation(callback);
        }
        else{
            console.log("Sending new annotation to server...");
            this.annotator.server.PostAnnotation(callback);
        }
    }

    // Build an object from the data.
    GetAnnotationObject() {

        let annotation = new Annotation();
       
        if ('undefined' == typeof(annotation.items)) { // Version 1
            annotation["body"] = this.BuildAnnotationBodyV1();
            annotation["target"] = this.BuildAnnotationTarget(true);
            annotation["creator"] = this.BuildCreatorTemplate();
        } else { // Version 2
            annotation["label"] = {
                "en": [this.annotator.contentLabel]
            };
            annotation["items"] = this.BuildAnnotationItems();
        }
    
        // Recompute read-only access properties after all other properties have been set
        annotation.recalculate();

        // Clone the object so we don't modify anything by changing this object
        let clone = JSON.parse(JSON.stringify(annotation))
        return clone;
    }

    BuildAnnotationItems() {
        let buildTime = new Date().toISOString(); //"2020-08-16T12:00:00Z"
        let videoDuration = this.annotator.player.videoElement.duration;
        let videoWidth = this.annotator.player.videoElement.videoWidth;
        let videoHeight = this.annotator.player.videoElement.videoHeight;

        // let videoDimension = this.annotator.player.GetVideoDimensions()
        // videoWidth = videoDimension.width;
        // videoHeight = videoDimension.height;

        let items = [{
            "id": this.annotator.url, //TODO: scalar specific url - should be supplied to plugin 
            "type": "Canvas",
            "height": videoHeight,
            "width": videoWidth,
            "duration": videoDuration, 
            "content": {
                "id": this.annotator.url, 
                "type": "Video",
                "height": videoHeight,
                "width": videoWidth,
                "duration": videoDuration,
                "label": {
                    "en": this.annotator.contentLabel //"dcterms:title" from the annotation json file from scalar
                },
                "description": {
                    "en": ""
                }
            },
            "items": [{
                "id": this.annotator.url,  
                "type": "AnnotationPage",
                "generator": "http://github.com/anvc/scalar",
                "generated": buildTime, 
                "items": [{
                    "id": this.id, // URL to the annotation-page
                    "type": "Annotation",
                    "generator": "http://github.com/novomancy/waldorf-scalar", 
                    "motivation": "highlighting",
                    "creator": this.BuildCreatorTemplate(),  
                    "created": buildTime,  
                    "rights": "https://creativecommons.org/licenses/by/4.0/",
                    "body": this.BuildAnnotationBodyV2(),
                    "target": this.BuildAnnotationTarget(false)
                }],
                
            }]
    
        }];


        return items;
                
    }

    BuildCreatorTemplate() {
        return {
            "type": "Person",
            "nickname": this.$creatorNameField.val(),
            "email_sha1": this.$creatorEmailField.val()
        }
    }

    //Build with tags entries from onomy
    BuildAnnotationBodyV2() {
        let body = [];

        // Build text descriptor
        let bodyText = {
            "type" : "TextualBody",
            "value" : this.$textField.val(),
            "format" : "text/plain",
            "language" : "en",
            "purpose": "describing"
        };
        body.push(bodyText);

        // Build tag descriptors
        //let tags = this.$tagsField.select2("data").map((item) => { return item.text; });
        let selected_tags = this.$tagsField.select2("data").map((item) => { return {id: item.id, text: item.text}});
        let onomy_map = {};
        if(typeof this.annotator.annotationManager.onomyVocabulary.results != 'undefined'){
            onomy_map = this.annotator.annotationManager.onomyVocabulary.results.reduce(function(acc, curr) {acc[curr['id']] = curr; return acc;}, {});
        } 

        for(let tag of selected_tags){
            let onomy_ref = onomy_map[tag.id];
            let bodyTag = {}
            if (onomy_ref) {
                bodyTag = {
                    "type": "SpecificResource",
                    "purpose": "tagging",
                    "source": {
                      "id": onomy_ref.terms_id,
                      "format": "application/json",
                      "label": {
                        "en": onomy_ref.text
                      },
                      "description": {
                        "en": onomy_ref.comment
                      }
                    }
                  }
            } else {
                bodyTag = {
                    "type": "TextualBody",
                    "purpose": "tagging",
                    "value": tag.text
                }
            }
            body.push(bodyTag);
        }

        return body;
    }

    BuildAnnotationBodyV1() {
        let body = [];

        // Build text descriptor
        let bodyText = {
            "type" : "TextualBody",
            "value" : this.$textField.val(),
            "format" : "text/plain",
            "language" : "en",
            "purpose": "describing"
        };
        body.push(bodyText);

        // Build tag descriptors
        let tags = this.$tagsField.select2("data").map((item) => { return item.text; });
        for(let tagStr of tags){
            let bodyTag = {
                "type": "TextualBody",
                "purpose": "tagging",
                "value": tagStr
            }
            body.push(bodyTag);
        }

        return body;
    }

    //used both v1 and v2
    BuildAnnotationTarget(selectorsInArray) {

        if ('undefined' == typeof(selectorsInArray)) selectorsInArray = false;

        let target = {
            "id": this.annotator.url, // URL of the video
            "type": "Video"
        }

        let selectors = [];

        let safeEndTime = GetSecondsFromHMS(this.$timeStartField.val());
        if(GetSecondsFromHMS(this.$timeEndField.val()) > GetSecondsFromHMS(this.$timeStartField.val())){
            safeEndTime = GetSecondsFromHMS(this.$timeEndField.val());
        }
        let startTime = GetSecondsFromHMS(this.$timeStartField.val());

        // Build time selector
        let timeSelector = {
            "type": "FragmentSelector",
            "conformsTo": "http://www.w3.org/TR/media-frags/", // See media fragment specification
            "value": `t=${startTime},${safeEndTime}` // Time interval in seconds
        }

        //Build SvgSelector
        if (typeof this.polyEditor.$vertices.start != 'undefined' && this.polyEditor.$vertices.start.length > 0) {
            
            let pointsStr = this.polyEditor.$vertices.start.map(item => { return `${item[0]},${item[1]}` }).join(" ");
            let value = "<svg viewBox='0 0 100 100' preserveAspectRatio='none'>";
            value += "<polygon points='" + pointsStr + "' />";

            if (this.polyEditor.IsAnimated()) {
                let animeStr = this.polyEditor.$vertices.stop.map(item => { return `${item[0]},${item[1]}` }).join(" ");
                value += "<animate attributeName='points' from='" + pointsStr + "' to='" + animeStr + "'";
                value += " start='" + startTime + "' end='" + safeEndTime + "' />";
            }

            value += "</svg>";

            let polygonSelector = {
                "type": "SvgSelector",
                "conformsTo": "http://www.w3.org/TR/SVG/", //added for v2
                "value": `${value}` // http://stackoverflow.com/a/24898728
            }
            if (selectorsInArray) {
                selectors.push(polygonSelector);
            } else {
                timeSelector["refinedBy"] = polygonSelector;
            }
        }

        if (selectorsInArray) {
            selectors.push(timeSelector);   
            target["selector"] = selectors;
        } else {
            target["selector"] = timeSelector;
        }

        return target;
    }

    GetTagsQuery() {
        if (this.annotator.annotationManager != undefined && this.annotator.annotationManager.onomyVocabulary.length > 0) {
            return this.annotator.annotationManager.onomyVocabulary;
        }

        if(!this.annotator.tagsURL) return {results: []};

        return {
            url: this.annotator.tagsURL,
            dataType: 'json',
            delay: 250,
            cache: true,
            onomyLanguage: this.annotator.onomyLanguage,
            annotationManager: this.annotator.annotationManager,
            parseFunction: this.OnomyVocabularyProcess,
            processResults: function (data) {
                return this.ajaxOptions.parseFunction(data, this.ajaxOptions.onomyLanguage);
            }
        }
    }
    
    OnomyVocabularyProcess(data, onomyLanguage) {  
        // Parse the labels into the format expected by Select2
        // multilingual tags
        let multilingual_tags = [];
        let m_comments = {};
        let comments = {};
        let m_index = 1;

        let tags = [];
        let index = 1;
        
        for(let term of data["terms"]){
            //if onomyLanguage is defined collect multilingual tags
            let terms_id = term["rdfs:about"];
            let terms_comment = term["rdfs:comment"];
            if (onomyLanguage != '' && term['labels'] != undefined) {
                let t_label = "";
                let t_comment = "";

                //get labels
                for(let label of term["labels"]) {
                    let xml_lang = label["xml:lang"];
                    let m_label = label["rdfs:label"];
                    if (xml_lang == onomyLanguage && m_label && m_label.trim != "") {
                        t_label = m_label;
                    }
                }
                //get comments
                for (let label of term['comments']) {
                    let xml_lang = label["xml:lang"];
                    let m_comment = label["rdfs:comments"]; //TODO: change to comment after fixing Onomy
                    if (xml_lang == onomyLanguage && m_comment) {
                        t_comment = m_comment;
                    } 
                }
            
                // use the term comment value if comment is blank
                if (t_comment == undefined || t_comment.trim == "") {
                    t_comment = terms_comment
                }
                multilingual_tags.push({
                    id: m_index,
                    text: t_label,
                    terms_id: terms_id,
                    comment: t_comment
                });
                m_index++;
            }
                    
            tags.push({
                id: index,
                text: term["rdfs:label"],
                terms_id: term["rdfs:about"],
                comment: term["rdfs:comment"]
            });

            index++;
        }

        let return_tags = multilingual_tags
        if (return_tags.length == 0) {
            return_tags = tags
        }
        return {
            results: return_tags,
        };
    }



}

export { AnnotationGUI };