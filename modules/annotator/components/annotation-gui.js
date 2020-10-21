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
        //this.$container = $("<div class='waldorf-vp-post'></div>").appendTo(this.annotator.player.$container);
        this.$postToolbar = $("<div class='flex-toolbar'></div>").appendTo(this.$container);
        this.$postToolbar.css("margin-bottom", "5px");
        this.$postToolbar2 = $("<div class='flex-toolbar'></div>").appendTo(this.$container);
        this.$postToolbar2.css("margin-bottom", "5px");
        this.$postToolbar3 = $("<div class='flex-toolbar'></div>").appendTo(this.$container);

        this.$postToolbar.append($("<div></div>").css("flex-grow", 1).css("order", 0));

        // Make title div
        let $titleDiv = $("<div></div>");
        this.$titleLabel = $("<p style='color:#ffffff; margin-right: 15px;'>Create Annotation</p>").appendTo($titleDiv);
        this.RegisterElement($titleDiv, this.$postToolbar, -10);
        
        // Make "Start time" label and field
        let $timeStartContainer = $('<div class="ui-field-contain"></div>');
        let $timeStartLabel = $('<label for="time-start">Start:</label>').appendTo($timeStartContainer);
        this.$timeStartField = $('<input type="text" name="time-start" id="time-start" value="">').appendTo($timeStartContainer);
        this.$timeStartField.width(50);
        this.$timeStartField.css("font-family", "Courier, monospace");
        this.$timeStartField.addClass("ui-widget ui-widget-content ui-corner-all");
        this.$timeStartField.attr('title', "Start time (hh:mm:ss.ss)");
        this.$timeStartField.on('keypress', function(event){
            if (event.keyCode == 46 || (event.keyCode >= 48 && event.keyCode <= 58)){ //0-9, period, and colon
                return true;
            }
            return false;
        });
        this.RegisterElement($timeStartContainer, this.$postToolbar, -5);

        //add marker button
        this.$timeStartButton = $("<button style='padding:0'>Set Start</button>").button({
            icon: "fa fa-map-marker",
            showLabel: false
        }).click(() => {
            this.$timeStartField[0].value = GetFormattedTime(this.annotator.player.videoElement.currentTime);
        });
        this.RegisterElement(this.$timeStartButton, this.$postToolbar, -4);   
        
        // Make "End time" label and field
        let $timeEndContainer = $('<div class="ui-field-contain"></div>');
        let $timeEndLabel = $('<label for="time-end">End:</label>').appendTo($timeEndContainer);
        this.$timeEndField = $('<input type="text" name="time-end" id="time-end" value="0">').appendTo($timeEndContainer);
        this.$timeEndField.width(50);
        this.$timeEndField.css("font-family", "Courier, monospace");
        this.$timeEndField.addClass("ui-widget ui-widget-content ui-corner-all");
        this.$timeEndField.attr('title', "End time (hh:mm:ss.ss)");
        this.$timeEndField.on('keypress', function(event){
            if (event.keyCode == 46 || (event.keyCode >= 48 && event.keyCode <= 58)){ //0-9, period, and colon
                return true;
            }
            return false;
        });

        this.RegisterElement($timeEndContainer, this.$postToolbar, -3);

        //add marker button
        this.$timeEndButton = $("<button style='padding:0'>Set End</button>").button({
            icon: "fa fa-map-marker",
            showLabel: false
        }).click(() => {
            this.$timeEndField[0].value = GetFormattedTime(this.annotator.player.videoElement.currentTime);
        });
        this.RegisterElement(this.$timeEndButton, this.$postToolbar, -2);         

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

        // Make "Edit polygon" button
        let $editPolyButton = $("<button>Edit Polygon</button>").button({
            icon: "fa fa-pencil",
            showLabel: false
        }).click(() => {
            this.SetVisible(false);
            this.polyEditor.BeginEditing();
        });
        $editPolyButton.attr('title', "Edit polygon");
        this.RegisterElement($editPolyButton, this.$postToolbar, -1);

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
        this.RegisterElement(this.$deleteButton, this.$postToolbar, 1, 'flex-end');

        // Make cancel button
        let $cancelButton = $("<button>Cancel Annotation Editing</button>").button({
            icons: {primary: 'fa fa-remove'},
            showLabel: false
        });
        $cancelButton.attr('title', "Cancel annotation editing");
        $cancelButton.addClass("waldorf-cancel-button");
        $cancelButton.click(() => {
            this.Close();
        });
        this.RegisterElement($cancelButton, this.$postToolbar, 2, 'flex-end');
        
        // Make "Submit Annotation" button
        let $submitButton = $("<button>Submit Annotation</button>").button({
            icons: {primary: 'fa fa-check'},
            showLabel: false
        });
        $submitButton.attr('title', "Save annotation to database");
        $submitButton.addClass("waldorf-confirm-button");
        $submitButton.click(() => {
            this.CommitAnnotationToServer((annotation, oldID) => {
                if(this.editMode){
                    this.annotator.UpdateAnnotation(annotation, oldID);
                } else {
                    this.annotator.RegisterNewAnnotation(annotation);
                }
                this.Close();
            });
        });
        this.RegisterElement($submitButton, this.$postToolbar, 3, 'flex-end');

        // Make tags field
        this.$tagsField = $('<select class="form-control" multiple="multiple"></select>');
        this.$tagsField.width("100%");
        this.RegisterElement(this.$tagsField, this.$postToolbar2, -1);
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
        
        // Make annotation text field
        this.$textField = $('<textarea type="text" name="anno-text" id="anno-text" value="" placeholder="Text">');
        this.$textField.width("100%");
        this.$textField.addClass("ui-widget ui-widget-content ui-corner-all");
        this.$textField.attr('title', 'Annotation text');
        this.$textField.css("flex-grow", 2);
        this.RegisterElement(this.$textField, this.$postToolbar3, -1);
        
        //new UI
        this.$container = $("<div id='draggable' class='ui-widget-content center'>").appendTo(this.annotator.player.$container);
        this.$title2 = $("<div class='dialog-title'>Create Annotation</div>").appendTo(this.$container);

        // Make cancel button
        let $exit_button = $("<button>Exit Annotation Editing</button>").button({
            icons: {primary: 'fa fa-remove'},
            showLabel: false
        });
        $exit_button.css("float", "right");
        $exit_button.attr('title', "Exit annotation editing");
        $exit_button.addClass("waldorf-cancel-button");
        $exit_button.click(() => {
            this.Close();
        });
        this.RegisterElement($exit_button, this.$title2, -1);

        this.$tabs = $("<div id='tabs'></div>").appendTo(this.$container);
        
        let $tab_ui = $("<ul></ul>");
        let $start_ui = $("<li><a href='#start_tab'>Start </a></li>");
        let $body_ui = $("<li><a href='#body_tab'>Body </a></li>");
        let $stop_ui = $("<li><a href='#stop_tab'>Stop </a></li>");
        this.RegisterElement($tab_ui, this.$tabs, -1);
        this.RegisterElement($start_ui, $tab_ui, -1);
        this.RegisterElement($body_ui, $tab_ui, -1);
        this.RegisterElement($stop_ui, $tab_ui, -1);

        let $start_tab = $("<div id='start_tab'>" + 
                            "<label for='start_time'>Start Time</label><br>" + 
                            "<input type='text' id='start_time'>" + 
                        "</div>");
        this.RegisterElement($start_tab, this.$tabs, -1);

        let $body_tab = $("<div id='body_tab'> " + 
                            "<label for='annotation_tags'>Tags</label>" + 
                            "<input type='text' id='annotation_tags'>" + 
                            "<br>" + 
                            "<label for='annotation_notes'>Notes</label>" + 
                            "<input type='text' id='annotation_notes'>" +
                        "</div>");
        this.RegisterElement($body_tab, this.$tabs, -1);

        let $stop_tab = $("<div id='stop_tab'>" + 
                            "<label for='stop_time'>Stop Time</label>" + 
                            "<br>" + 
                            "<input type='text' id='stop_time'>" + 
                        "</div>");
        this.RegisterElement($stop_tab, this.$tabs, -1);

        let $button_panel = $("<div class='button_panel'>" + 
                            //"<label>Start Target</label><br>" +
                            //"<img src='unknown' >" +
                            //"<br><br>" + 
                            //"<button id='cancel_btn' type='button'>Cancel</button>" + 
                            //"<button id='save_btn' type='button'>Save</button>" +
                            "</div>").appendTo(this.$container);



        let $start_target_label = $("<label>Start Target</label><br>");
        $start_target_label.css("color", "white");
        this.RegisterElement($start_target_label, $button_panel, -1);

        //Make "Edit polygon" button
        let $edit_poly_button = $("<button>Edit Polygon</button>").button({
             icon: "fa fa-pencil",
             showLabel: false
        }).click(() => {
             this.SetVisible(false);
             this.polyEditor.BeginEditing();
        });
        $edit_poly_button.attr('title', "Edit polygon");
        this.RegisterElement($edit_poly_button, $button_panel, -1);

        // Make cancel button
        let $cancel_button = $("<br><br><button>Cancel</button>").button({
            showLabel: true
        }).click(() => {
            this.Close();
        });
        $cancel_button.css("float", "right");
        $cancel_button.attr('title', "Exit annotation editing");
        //$cancel_button.addClass("waldorf-cancel-button");
        this.RegisterElement($cancel_button, $button_panel, -1);
        
        // Make save button
        let $save_button = $("<button>Save</button>").button({
            showLabel: true
        }).click(() => {
            alert("Saving the annotation");
        });
        $save_button.css("float", "left");
        this.RegisterElement($save_button, $button_panel, -1);

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
            this.$titleLabel.text("Edit Annotation");
            this.$deleteButton.button("enable");
        }
        else {
            this.$titleLabel.text("Create Annotation");
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

        // // Create and add the creator metadata if it's available
        // if(serverJSON.metadata.userName && serverJSON.metadata.userEmail){
        //     let creator = {
        //         //id: "Unspecified",
        //         "type": "Person",
        //         "nickname": serverJSON.metadata.userName,
        //         "email": serverJSON.metadata.userEmail
        //     };
        //     annotation["creator"] = creator;
        // }

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

        annotation["body"] = body;

        let target = {
            "id": this.annotator.url, // URL of the video
            "type": "Video"
        }

        let selectors = [];

        // Build polygon selector
        let points = this.polyEditor.GetPoints();
        if(points.length > 0) {
            let pointsStr = points.map(item => { return `${item[0]},${item[1]}` }).join(" ");
            let polygonSelector = {
                "type": "SvgSelector",
                "value": `<svg:svg viewBox='0 0 100 100' preserveAspectRatio='none'><polygon points='${pointsStr}' /></svg:svg>` // http://stackoverflow.com/a/24898728
            }
            selectors.push(polygonSelector);
        }

        let safeEndTime = GetSecondsFromHMS(this.$timeStartField.val());
        if(GetSecondsFromHMS(this.$timeEndField.val()) > GetSecondsFromHMS(this.$timeStartField.val())){
            safeEndTime = GetSecondsFromHMS(this.$timeEndField.val());
        }

        // Build time selector
        let timeSelector = {
            "type": "FragmentSelector",
            "conformsTo": "http://www.w3.org/TR/media-frags/", // See media fragment specification
            "value": `t=${GetSecondsFromHMS(this.$timeStartField.val())},${safeEndTime}` // Time interval in seconds
        }
        selectors.push(timeSelector);

        // Finalize target section
        target["selector"] = selectors;

        
        annotation["target"] = target;

        // Recompute read-only access properties after all other properties have been set
        annotation.recalculate();

        // Clone the object so we don't modify anything by changing this object
        let clone = JSON.parse(JSON.stringify(annotation))
        return clone;
    }

    GetTagsQuery(){
        return {
            url: this.annotator.tagsURL,
            dataType: 'json',
            delay: 250,
            cache: true,
            processResults: function (data) {
                // Parse the labels into the format expected by Select2
                let tags = [];
                let index = 1;
                for(let term of data["terms"]){
                    tags.push({
                        id: index,
                        text: term["rdfs:label"]
                    });
                    index++;
                }
                return {
                    results: tags
                };
            }
        }
    }
    




}

export { AnnotationGUI };