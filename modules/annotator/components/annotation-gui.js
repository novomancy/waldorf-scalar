import { GetFormattedTime, GetSecondsFromHMS } from "../../utils/time.js";
import { PolygonEditor } from "./polygon-editor.js";
import { Annotation } from "../annotation.js";

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

        let $startTab = $("<div id='start_tab' class='ui-field-contain'>" + 
                            "<label for='start_time'>Start Time</label><br>" + 
                        "</div>");
        this.RegisterElement($startTab, this.$tabs, -1);

        // Make "Start time" label and field
        this.$timeStartField = $('<input type="text" name="time-start" id="time-start" value="">').appendTo($startTab);
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
        this.$startTimeMarker = $("<button style='padding:0; line-height:1.4'>Set End</button>").button({
            icon: "fa fa-map-marker",
            showLabel: false
        }).click(() => {
            this.$timeStartField[0].value = GetFormattedTime(this.annotator.player.videoElement.currentTime);
        });
        this.RegisterElement(this.$startTimeMarker, $startTab, -2);     
        
        //start point polygon is added
        this.$startPolygonSet = $("<button style='padding:0; line-height:1.4'>Start Polygon Set</button>").button({
            icon: "fa fa-check-square-o",
            showLabel: false
        });
        //this.$startPolygonSet.css("visibility", "inherit");
        this.$startPolygonSet.css("visibility", "hidden");
        this.$startPolygonSet.addClass("waldorf-confirm-button");
        
        //this.RegisterElement(this.$startPolygonSet, $startTab, -2); 

        let $bodyTab = $("<div id='body_tab'></div>");
        this.RegisterElement($bodyTab, this.$tabs, -1);

        // Add tags input field
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
            createTag: function (params) {
                return {
                    id: params.term,
                    text: params.term,
                    newOption: true
                }
            }
        });
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

        let $stopTab = $("<div id='stop_tab'>" + 
                            "<label for='stop_time'>Stop Time</label><br>" + 
                        "</div>");
        this.RegisterElement($stopTab, this.$tabs, -1);

        // Make "Start time" label and field
        this.$timeEndField = $('<input type="text" name="time-start" id="time-start" value="">').appendTo($stopTab);
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

        //add start marker button
        this.$endTimeMarker = $("<button style='padding:0; line-height:1.4'>Set End</button>").button({
            icon: "fa fa-map-marker",
            showLabel: false
        }).click(() => {
            this.$timeEndField[0].value = GetFormattedTime(this.annotator.player.videoElement.currentTime);
        });
        this.RegisterElement(this.$endTimeMarker, $stopTab, -2);

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

        let $startTargetLabel = $("<label>Start Target</label><br>");
        $startTargetLabel.css("color", "white");
        this.RegisterElement($startTargetLabel, $buttonPanel, -1);

        //Make "Edit polygon" button
        let $editPolyButton = $("<button>Edit Polygon</button>").button({
             icon: "fa fa-pencil",
             showLabel: false
        }).click(() => {
             this.SetVisible(false);
             console.log("annotation-gui:353 Create");
             this.polyEditor.BeginEditing();
        });
        $editPolyButton.attr('title', "Edit polygon test2");
        this.RegisterElement($editPolyButton, $buttonPanel, -1);

        // Make delete button
        this.$deleteButton = $("<button>Delete Annotation</button>").button({
            icon: "fa fa-bomb",
            showLabel: false
        });
        this.$deleteButton.css("margin-right", "15px");
        this.$deleteButton.attr('title', "Delete annotation");
        this.$deleteButton.click(() => {
            this.annotator.server.DeleteAnnotation(this.originalAnnotation).done((response) => {
                this.annotator.DeregisterAnnotation(this.originalAnnotation);
                this.Close();
            });
        });
        this.RegisterElement(this.$deleteButton, $buttonPanel, -1);


        // Make cancel button
        let $cancelButton = $("<br><br><button>Cancel</button>").button({
            showLabel: true
        }).click(() => {
            this.polyEditor.ResetPolygons();
            this.Close();
        });
        $cancelButton.css("float", "right");
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
        $saveButton.css("float", "left");
        this.RegisterElement($saveButton, $buttonPanel, -1);

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
        console.log("annotation-gui: BeginEditing 447");
        console.log(this.polyEditor.$polygons);

        //console.log(annotation);

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
            this.$textField.val(annotation.body.filter(item => item.purpose == "describing")[0].value);
            // Reset the tags field
            this.$tagsField.val("").trigger("change");
            this.$tagsField.find("option").remove();

            for(let tag of annotation.tags){
                this.$tagsField.append("<option value='"+tag+"' selected>"+tag+"</option>");
                this.$tagsField.trigger("change");
            }

            this.polyEditor.InitPoly(annotation.getPoly());
            this.polyEditor.ShowJustPolygon();

        }
        // Insert template data if no annotation is given
        else {
            // Populate fields if no annotation is given
            this.editMode = false;

            this.originalAnnotation = null;

            console.log("Populated with template data");
            this.$timeStartField.val(GetFormattedTime(this.annotator.player.videoElement.currentTime));
            this.$timeEndField.val(GetFormattedTime(this.annotator.player.videoElement.duration));
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
        }
        else {
            this.$title.text("Create Annotation");
            this.$deleteButton.button("disable");
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

    // Build an Open Annotation object from the data.
    GetAnnotationObject(){

        let annotation = new Annotation(this.originalAnnotation);
        //console.log("this.originalAnnotation: " + JSON.stringify(this.originalAnnotation)); //prints null

        annotation["body"] = this.BuildAnnotationBodyV1();
        annotation["target"] = this.BuildAnnotationTarget();
        //annotation["items"] = this.BuildAnnotationItems();

        // Recompute read-only access properties after all other properties have been set
        annotation.recalculate();

        // Clone the object so we don't modify anything by changing this object
        let clone = JSON.parse(JSON.stringify(annotation))
        return clone;
    }

    BuildAnnotationItems() {

        let buildTime = new Date().toISOString(); //"2020-08-16T12:00:00Z"
        let items = [{
            "id": "", //TODO: "art:url" from annotation json file
            "type": "Canvas",
            "height": 480, //TODO:
            "width": 640, //TODO:
            "duration": 143, //TODO:
            "content": [{
                "id": "", //TODO: media file reference id - check the incoming annotation collection for id
                "type": "Video",
                "height": 480, //TODO:
                "width": 640, //TODO:
                "duration": 143, //TODO:
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
                    "id": "", //Annotation id - after successful data saving
                    "type": "Annotation",
                    "generator": "http://github.com/novomancy/waldorf-scalar", //TODO: config value
                    "motivation": "highlighting",
                    "creator": this.BuildCreatorTemplate(), //TODO: 
                    "created": buildTime,  
                    "rights": "https://creativecommons.org/licenses/by/4.0/",
                }],
                "body": this.BuildAnnotationBodyV2(), //TODO: 
                "target": this.BuildAnnotationTarget()
            }]
    
        }];


        return items;
                
    }

    //TODO:
    BuildCreatorTemplate() {
        return {
            "type": "Person",
            "nickname": "John Bell",
            "email_sha1": "REMOVED"
        }
    }

    //TODO: build with tags entries from onomy
    BuildAnnotationBodyV2() {
        return this.BuildAnnotationBodyV1();
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

    BuildAnnotationTarget() {
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

        //Build SvgSelector
        if (this.polyEditor.$polygons.length > 0) {
            let pointsStr = this.polyEditor.$polygons[0].map(item => { return `${item[0]},${item[1]}` }).join(" ");
            let animeStr = this.polyEditor.$polygons[1].map(item => { return `${item[0]},${item[1]}` }).join(" ");
            let value = "<svg viewBox='0 0 100 100' preserveAspectRatio='none'>";
            value += "<polygon points='" + pointsStr + "' />";
            value += "<animate attributeName='points' from='" + pointsStr + "' to='" + animeStr + "'";
            value += " start='" + startTime + "' end='" + safeEndTime + "' />";
            value += "</svg>";

            let polygonSelector = {
                "type": "SvgSelector",
                "conformsTo": "http://www.w3.org/TR/media-frags/", //added for v2
                "value": `${value}` // http://stackoverflow.com/a/24898728
            }
            selectors.push(polygonSelector);
        }


        // Build time selector
        let timeSelector = {
            "type": "FragmentSelector",
            "conformsTo": "http://www.w3.org/TR/media-frags/", // See media fragment specification
            "value": `t=${startTime},${safeEndTime}` // Time interval in seconds
        }
        selectors.push(timeSelector);

        // Finalize target section
        target["selector"] = selectors;

        return target;
    }

    GetTagsQuery(){
        console.log("this.annotator.onomyLanguage: " + this.annotator.onomyLanguage);
        return {
            url: this.annotator.tagsURL,
            dataType: 'json',
            delay: 250,
            cache: true,
            onomyLanguage: this.annotator.onomyLanguage,
            processResults: function (data) {
                // Parse the labels into the format expected by Select2
                // multilingual tags
                let multilingual_tags = [];
                //let m_comments = {};
                //let comments = {};
                let m_index = 1;

                let tags = [];
                let index = 1;
                //let root_comment = data["rdfs:comment"];
                for(let term of data["terms"]){
                    //if onomyLanguage is defined collect multilingual tags
                    //let terms_id = term["rdfs:about"];
                    if(this.ajaxOptions.onomyLanguage != '' && term['labels'] != undefined) {
                        for(let label of term["labels"]) {
                            let xml_lang = label["xml:lang"];
                            let m_label = label["rdfs:label"];
                            if (xml_lang == this.ajaxOptions.onomyLanguage && m_label && m_label.trim != "") {
                                multilingual_tags.push({
                                    id: m_index,
                                    text: m_label
                                });
                            }
                        }
                        // if (term['comments'] != undefined) {
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
                        m_index++;
                    }
                    
                    tags.push({
                        id: index,
                        text: term["rdfs:label"]
                    });

                    // let node_comment = term["rdfs:comment"];
                    // if (node_comment.trim == "") {
                    //     node_comment = root_comment;
                    // }

                    // comments[index] = node_comment;

                    index++;
                }

                let return_tags = multilingual_tags
                if (return_tags.length == 0) {
                    return_tags = tags
                }
                console.log("return_tags");
                console.log(return_tags);
                return {
                    //results: tags - use tags when the language is not defined
                    results: return_tags
                };
            }
        }
    }
    




}

export { AnnotationGUI };