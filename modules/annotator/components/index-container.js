import { GetFormattedTime } from "../../utils/time.js";
let sha1 = require('sha1');

class IndexContainer {
    constructor(annotator){
        console.log("creating annotation index");
        this.annotator = annotator;
        let container = $(".waldorf-index");
        if(container.length > 0){
            this.$container = container.first();
        } else {
            this.$container = $("<div class='waldorf-index' aria-live='polite' role='navigation'></div>").appendTo(this.annotator.$container);
        }
        this.annotationList = $("<ul class='waldorf-annotation-list' role='menubar'></ul>").appendTo(this.$container);
        // Attach event handlers
        this.annotator.$container.on("OnAnnotationsLoaded", 
            (event, annotationManager) => this.Rebuild(annotationManager));

    }

    Rebuild(annotationManager){
        // if(clearContainer) this.$container.empty();
        // if(this.annotator.unrenderer) this.annotator.unrenderer(this.annotator);

        // let plural = annotations.length == 1 ? "" : "s";
        // let totalAnnotations = this.annotator.annotationManager.annotations.length;
        // this.$container.html(`<p>Showing ${annotations.length} annotation${plural} (${totalAnnotations} total).</p>`);

        // Add each annotation to the readout
        for (let i = 0; i < annotationManager.annotations.length; i++){
            this.$container.append(this.MakeContainer(this.annotator, annotationManager.annotations[i], i));
        }
    }

    MakeContainer(annotator, annotation){
        //TODO: ARIA and general screen reader compatibility
        let $panel = $("<li role='presentation' data-creator="+annotation.creator.email+"></li>");
        //let text = JSON.stringify(annotation.AsOpenAnnotation(), null, 2);

        let headerText = GetFormattedTime(annotation.beginTime) + " - " + GetFormattedTime(annotation.endTime);
 
        // Add clickable header that brings up the edit interface.
        let $header = $("<a href='' title='Go to Annotation' role='menuitem'>"+headerText+"</a><br>");
        $header.click( (event) => {
            event.preventDefault();
            annotator.player.videoElement.src=annotator.url + "#t=" + annotation.beginTime +","+annotation.endTime;
            annotator.player.videoElement.play();
        });

        $panel.append($header);
        let $content = $("<p></p>");
                
        $content.append("<b>Text: </b> " + annotation.body.filter(item => item.purpose === "describing")[0].value);
        $content.append("<br>");
        $content.append("<b>Tags: </b> " + annotation.tags.join(", "));
        $content.append("<br>");

        $panel.append($content);
        $panel.appendTo(annotator.$annotationList);
        console.log($panel);
        return $panel;
    }

}

export { IndexContainer };