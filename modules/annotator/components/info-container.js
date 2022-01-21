import { GetFormattedTime } from "../../utils/time.js";
let sha1 = require('sha1');

class InfoContainer {
    constructor(annotator){
        this.annotator = annotator;
        let container = $(".waldorf-info");
        //if(container.length > 0){
        //    this.$container = container.first();
        //} else {
            this.$container = $("<div class='waldorf-info' aria-live='polite' aria-atomic='true'></div>").appendTo(this.annotator.$container);
        //}
    }

    Rebuild(annotations, clearContainer){
        if(clearContainer) this.$container.empty();
        if(this.annotator.unrenderer) this.annotator.unrenderer(this.annotator);

        // let plural = annotations.length == 1 ? "" : "s";
        // let totalAnnotations = this.annotator.annotationManager.annotations.length;
        // this.$container.html(`<p>Showing ${annotations.length} annotation${plural} (${totalAnnotations} total).</p>`);

        // Add each annotation to the readout
        let renderer = this.annotator.renderer === false ? this.MakeContainer : this.annotator.renderer;
        for (let i = 0; i < annotations.length; i++){
            this.$container.append(renderer(this.annotator, annotations[i], i));
        }
    }

    MakeContainer(annotator, annotation, index){
        let $panel = $("<p></p>").appendTo($("<div></div>").appendTo(annotator.$container));
        //let text = JSON.stringify(annotation.AsOpenAnnotation(), null, 2);

        // Add clickable header that brings up the edit interface.
        let $header = $(`<b>Annotation ${index + 1}:</b><br>`);
        if(annotator.kioskMode==false){
            $header = $(`<a href='' title='Edit Annotation'><b>Annotation ${index + 1}:</b><br></a>`);
            $header.click( (event) => {
                event.preventDefault();
                annotator.gui.BeginEditing(annotation);
            });
        }

        $panel.append($header);
        let $content = $("<p></p>");
        
        if ('undefined' == typeof(annotation.items)) { // Version 1
            var annotation_body = annotation.body.filter(item => item.purpose === "describing")[0];
            var annotation_creator = (annotation.creator != null) ? annotation.creator : {};
        } else { // Version 2
            var annotation_body = annotation.items[0].items[0].items[0].body.filter(item => item.purpose === "describing")[0];
            var annotation_creator = annotation.items[0].items[0].items[0].creator;
        }
        
        $content.append("<b>Text: </b> " + annotation_body.value);
        $content.append("<br>");
        $content.append("<b>Tags: </b> " + annotation.tags.join(", "));
        $content.append("<br>");
        $content.append("<b>Time: </b> " 
                + GetFormattedTime(annotation.beginTime) 
                + " - " 
                + GetFormattedTime(annotation.endTime));
        $content.append("<br>");

        $content.append("<b>Submitter:</b> "
                + (('undefined' != typeof(annotation_creator.nickname) && annotation_creator.nickname.length) ? annotation_creator.nickname : "<i>Not available</i>")
                );

        //$paragraph.append("<strong>Annotation " + (index + 1) + ":</strong><br><pre>" + text.escapeHTML() + "</pre>");

        $panel.append($content);
        return $panel;
    }

}

export { InfoContainer };