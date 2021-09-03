import { Annotation } from "./annotation.js";

class AnnotationManager {
    constructor(){
        this.annotations = [];
        this.onomyVocabulary = [];
    }

    PopulateFromJSON(json){
    
        if (json.length == 0){
            console.warn("JSON contains no annotations.");
        }

        if ('undefined' == typeof(json.items)) {  // Version 1
            for(let object of json){
                this.RegisterAnnotation(object);
            }
        } else {  // Version 2
            for (let object of json.items[0].items) {
                this.RegisterAnnotation(object, JSON.parse(JSON.stringify(json.items[0])));
            }
        }

    }

    RegisterAnnotation(jsonObject, canvasObject){
        //console.log("Registering new annotation with ID " + jsonObject.id);
        let anno = new Annotation(jsonObject, canvasObject);
        this.annotations.push(anno);
    }

    RemoveAnnotation(id){
        this.annotations = this.annotations.filter((obj) => {
            if ('undefined' == typeof(obj.items)) { // Version 1
                return id !== obj.id;
            } else { // Version 2
                return id !== obj.items[0].items[0].items[0].id;
            }
        });
    }

    /**
     * Update the given annotation in the stored array
     */
    UpdateAnnotation(annotation, oldID){
        //console.log("Updating annotation ID " + oldID + " to " + annotation.metadata.id);
        this.RemoveAnnotation(oldID);
        //this.RegisterAnnotation(annotation);
        this.PopulateFromJSON(annotation);
    }

    AnnotationsAtTime(time){

        // TODO: Reenable with some kind of force parameter

        // // If the last time requested is asked for again, just give back the cached result
        // if(timeMS == this.lastTimeRequested){
        //     //console.log("Using cache");
        //     return this.cached;
        // }
        // this.lastTimeRequested = timeMS;

        // Filter all loaded annotations that fit within the range query.
        let filtered = this.annotations.filter(function(item){
            return item.beginTime <= time && time <= item.endTime;
        });

        this.cached = filtered;

        return filtered;
    }

    GetOnomyVocabulary() {
        return this.onomyVocabulary;
    }

    UpdateOnomyVocabulary(vocabulary) {
        this.onomyVocabulary = vocabulary;
    }

}

export { AnnotationManager };