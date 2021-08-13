/// A wrapper for W3C Open Annotation JSON objects.
class Annotation {

    constructor(json = null){
        let version = "v1";

        // ver1
        if (version == "v1") {
            this["@context"] = "http://www.w3.org/ns/anno.jsonld";
            
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
            };
            this["type"] = "Annotation";  
            this["motivation"] = "highlighting";
            this["body"] = [];
            this["target"] = {};
            this["annotation_version"] = "v1";
        } else {
            // ver2 docs/webannotation_spec/sample_2.0.json
            this["@context"] = ["http://www.w3.org/ns/anno.jsonld",
                            "http://iiif.io/api/presentation/3/context.json"];
            this["service"] = {
                "client_id": "scalar",
                "client_ver": "2.5.12",
                "items": {
                    "native": false,
                    "id": "__CHECK_CONFIG_FILE__ID__",
                    "api_key": "__CHECK_CONFIG_FILE__API_KEY__",
                    "action": "TOBEFILLED",
                    "format": "json"
                }
            };
            this["type"] = "Manifest";
            this["items"] = []; 
            this["annotation_version"] = "v2";
        }

        //delete this.beginTime;
        //delete this.endTime;
        //delete this.tags;
        this.readConfig(version);

        if(json) {
            // Merge the json into this class.
            Object.assign(this, json);

            // Compute read only easy access properties
            this.recalculate();
        }

    }

    readConfig(version) {
        const config = require("../annotator-config.json");
        if (version == "v1") {
            // ver1
            this["request"]["client_id"] = config.client_id;
            this["request"]["client_ver"] = config.client_ver;
            this["request"]["items"]["id"] = config.id;
            this["request"]["items"]["api_key"] = config.api_key;
        } else {
            // ver2
            this["service"]["client_id"] = config.client_id;
            this["service"]["client_ver"] = config.client_ver;
            this["service"]["items"]["id"] = config.id;
            this["service"]["items"]["api_key"] = config.api_key;
        }
    }



    /// Compute read only easy access properties
    recalculate() {
        let timeSlice = this.target.selector.filter(item => item.type === "FragmentSelector")[0].value;
        timeSlice = timeSlice.replace("t=", "");

        /// Start time in seconds
        this.beginTime = parseFloat(timeSlice.split(",")[0]);

        /// End time in seconds
        this.endTime = parseFloat(timeSlice.split(",")[1]);

        /// Extract tags from annotation
        this.tags = this.body.filter(item => item.purpose === "tagging").map(item => item.value);
    }

    getPoly() {
        let pointsSelector = this.target.selector.filter(item => item.type === "SvgSelector");

        if(pointsSelector.length == 0) return null;

        // Parse the points array from the annotation
        let pointsSvg = pointsSelector[0].value;
        let regExString = new RegExp("(?:points=')(.*?)(?:')", "ig"); //set ig flag for global search and case insensitive
        
        let pointsRE = regExString.exec(pointsSvg)[1];
        let pointsData = pointsRE.trim().split(" ").map(item => item.split(","));

        return pointsData;
    }

    getSVGPolyPoints() {
        let pointsSelector = this.target.selector.filter(item => item.type === "SvgSelector");

        if(pointsSelector.length == 0) return null;

        // Parse the points array from the annotation
        let pointsSvg = pointsSelector[0].value;
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(pointsSvg, "text/xml");
        return [xmlDoc.getElementsByTagName("animate")[0].getAttribute("from"), 
        xmlDoc.getElementsByTagName("animate")[0].getAttribute("to")];
    }

}



export { Annotation };