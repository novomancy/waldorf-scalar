/// A wrapper for JSON objects.
class Annotation {

    constructor(json = null, canvas = null) {

        let version = "v2";

        if (json) {
            if ('undefined' == typeof(json.items)) {
                version = "v1";
            } else {
                version = "v2";
            }
        }

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

            this.readConfig(version);

            if (json) {
                Object.assign(this, json);
            }
        } else {
            // ver2 docs/webannotation_spec/sample_2.0.json
            this["@context"] = ["http://www.w3.org/ns/anno.jsonld",
                            "http://iiif.io/api/presentation/3/context.json"];
            this["service"] = [{
                "client_id": "scalar",
                "client_ver": "2.5.12",
                "items": {
                    "native": false,
                    "id": "__CHECK_CONFIG_FILE__ID__",
                    "api_key": "__CHECK_CONFIG_FILE__API_KEY__",
                    "action": "TOBEFILLED",
                    "format": "json"
                }
            }];
            this["type"] = "Manifest";
            this["items"] = [];
            if (canvas) {
                this["items"].push( canvas );  // The "Canvas"
                this["items"][0].items = [ json ];  // The "AnnotationPage" + "Annotation"
            }
            this["annotation_version"] = "v2";

            this.readConfig(version);

        }

        if(json) {
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
            this["request"]["items"]["native"] = config.native;
            this["request"]["items"]["id"] = config.id;
            this["request"]["items"]["api_key"] = config.api_key;
        } else {
            // ver2
            this["service"][0]["client_id"] = config.client_id;
            this["service"][0]["client_ver"] = config.client_ver;
            this["service"][0]["items"]["native"] = config.native;
            this["service"][0]["items"]["id"] = config.id;
            this["service"][0]["items"]["api_key"] = config.api_key;
        }
    }

    /// Compute read only easy access properties
    recalculate() {

        console.log(this);

        if ('undefined' == typeof(this.items)) { // Version 1
            var timeSlice = this.target.selector.filter(function (item) {
                return item.type === "FragmentSelector";
              })[0].value;
        } else { // Version 2
            var timeSlice = this.items[0].items[0].items[0].target.selector.value;
        }
        timeSlice = timeSlice.replace('#t=npt:','t=');
        timeSlice = timeSlice.replace("t=", "");

        /// Start time in seconds
        this.beginTime = parseFloat(timeSlice.split(",")[0]);
        /// End time in seconds
        this.endTime = parseFloat(timeSlice.split(",")[1]);
        console.log('beginTime: ' + this.beginTime + ' endTime: ' + this.endTime);

        /// Extract tags from annotation
        if ('undefined' == typeof(this.items)) { // Version 1
            this.tags = this.body.filter(item => item.purpose === "tagging").map(item => item.value);
        } else { // Version 2
            this.tags = [];
            for (var j = 0; j < this.items[0].items[0].items[0].body.length; j++) {
                if (this.items[0].items[0].items[0].body[j].purpose != 'tagging') continue;
                if ('undefined' != typeof(this.items[0].items[0].items[0].body[j].value)) {  // Basic tag
                    this.tags.push(this.items[0].items[0].items[0].body[j].value);
                } else if ('undefined' != typeof(this.items[0].items[0].items[0].body[j].source)) {  // Onomy tag
                    this.tags.push(this.items[0].items[0].items[0].body[j].source.label['en']);  // TODO: english hard-coded here
                }
            }
        }
        console.log('Tags: ' + this.tags);

        // Start and end poly points
        this.polyStart = null;
        this.polyEnd = null;

        var pointsSelector = [];
        if ('undefined' == typeof(this.items)) { // Version 1
            pointsSelector = this.target.selector.filter(item => item.type === "SvgSelector");
        } else { // Version 2
            pointsSelector = ('undefined' != typeof(this.items[0].items[0].items[0].target.selector.refinedBy)) ? [this.items[0].items[0].items[0].target.selector.refinedBy] : [];
        }
        if (pointsSelector.length > 0) {
            let pointsSvg = pointsSelector[0].value;
            let regExString = new RegExp("(?:points=')(.*?)(?:')", "ig");
            var pointsRE = regExString.exec(pointsSvg)[1];
            var pointsData = pointsRE.trim().split(" ").map(item => item.split(","));
            this.polyStart = pointsData;

            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(pointsSvg, "text/xml");
            if (xmlDoc.getElementsByTagName("animate").length) {  // If there is no animation element, create an "animation" from the static points
                pointsRE = xmlDoc.getElementsByTagName("animate")[0].getAttribute("to");
                pointsData = pointsRE.trim().split(" ").map(item => item.split(","));
                this.polyEnd = pointsData;
            }
        }
    }

    getPoly() {
        var pointsSelector = [];
        if ('undefined' == typeof(this.items)) { // Version 1
            pointsSelector = this.target.selector.filter(item => item.type === "SvgSelector");
        } else { // Version 2
            pointsSelector = ('undefined' != typeof(this.items[0].items[0].items[0].target.selector.refinedBy)) ? [this.items[0].items[0].items[0].target.selector.refinedBy] : [];
        }

        if (pointsSelector.length == 0) return null;

        // Parse the points array from the annotation
        let pointsSvg = pointsSelector[0].value;
        let regExString = new RegExp("(?:points=')(.*?)(?:')", "ig"); //set ig flag for global search and case insensitive
        
        let pointsRE = regExString.exec(pointsSvg)[1];
        let pointsData = pointsRE.trim().split(" ").map(item => item.split(","));

        return pointsData;
    }

    getSVGPolyPoints() {
        var pointsSelector = [];
        if ('undefined' == typeof(this.items)) { // Version 1
            pointsSelector = this.target.selector.filter(item => item.type === "SvgSelector");
        } else { // Version 2
            pointsSelector = ('undefined' != typeof(this.items[0].items[0].items[0].target.selector.refinedBy)) ? [this.items[0].items[0].items[0].target.selector.refinedBy] : [];
        }

        if(pointsSelector.length == 0) return null;

        // Parse the points array from the annotation
        let pointsSvg = pointsSelector[0].value;
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(pointsSvg, "text/xml");

        if (!xmlDoc.getElementsByTagName("animate").length) {  // If there is no animation element, create an "animation" from the static points
            var points = this.getPoly();
            return [points, points];
        } else {
            return [xmlDoc.getElementsByTagName("animate")[0].getAttribute("from"), xmlDoc.getElementsByTagName("animate")[0].getAttribute("to")];
        }
    }

}



export { Annotation };