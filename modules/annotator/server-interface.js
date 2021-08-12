let sha1 = require('sha1');

class ServerInterface {
    constructor(annotator){
        this.annotator = annotator;
        //localStorage.removeItem('waldorf_auth_token');
    }

    SetBaseURL(url){
        this.baseURL = url;
    }

    make_base_auth(user, password) {
        var tok = user + ':' + password;
        var hash = btoa(tok);
        return 'Basic ' + hash;
    }

    make_write_auth(text){
        if(this.annotator.apiKey){
            return 'ApiKey ' + text;
        } else {
            return 'Token ' + text;
        }
    }

    LoggedIn(){
        if(this.annotator.apiKey){
            // Return true if an email has been entered
            let user_email = localStorage.getItem('waldorf_user_email');
            return user_email !== null;
        }
        else {
            // Return true if a token has been registered
            let auth_token = localStorage.getItem('waldorf_auth_token');
            return auth_token !== null;
        }
    }

    LogIn(username, password){
        // If API key is used, just store the email address
        if(this.annotator.apiKey){
            console.log("[Server Interface] Successfully logged in.");
            localStorage.setItem('waldorf_user_email', password);
            localStorage.setItem('waldorf_user_name', username);
            this.annotator.messageOverlay.ShowMessage("Logged in as "+username);
            return $.Deferred().resolve();
        }

        return $.ajax({
            url: this.baseURL + "/api/login",
            type: "POST",
            async: true,
            context: this,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', this.make_base_auth(username, password));
            }
        }).done((data) => {
            console.log("[Server Interface] Successfully logged in.");
            localStorage.setItem('waldorf_auth_token', data.auth_token);
        }).fail((response) => {
            console.error("[Server Interface] Could not log in.");
            this.annotator.messageOverlay.ShowError("Could not log in!");
        });
    }

    LogOut(){
        // If API key is used, just remove the email from local storage.
        if(this.annotator.apiKey){
            console.log("[Server Interface] Successfully logged out.");
            localStorage.removeItem('waldorf_user_email');
            localStorage.removeItem('waldorf_user_name');
            return $.Deferred().resolve();
        }

        return $.ajax({
            url: this.baseURL + "/api/logout",
            type: "DELETE",
            async: true,
            context: this,
            beforeSend: function (xhr) {
                let auth_token = localStorage.getItem('waldorf_auth_token') || "";
                console.log(`[Server Interface] token: ${auth_token}`);
                xhr.setRequestHeader('Authorization', this.make_write_auth(auth_token));
            }
        }).done((data) => {
            console.log("[Server Interface] Successfully logged out.");
            localStorage.removeItem('waldorf_auth_token');
        }).fail((response) => {
            console.error("[Server Interface] Could not log out.");
            localStorage.removeItem('waldorf_auth_token');
        });
    }

    FetchAnnotations(searchKey, searchParam) {
        //This is replaced by this.baseURL, which is defined in config
        //var book_url = 'http://scalar.usc.edu/dev/semantic-annotation-tool/';  // This will be defined in the Book's JS
        //https://scalar.usc.edu/dev/semantic-annotation-tool/rdf/file/media/Inception%20Corgi%20Flop.mp4?format=oac&prov=1&rec=2
        var ajax_url = this.baseURL + 'rdf/file/' + searchParam.replace(this.baseURL, '') + '?format=oac&prov=1&rec=2';
        //var ajax_url = this.baseURL + 'rdf/file/' + searchParam.replace(this.baseURL,'') + '?format=iiif&prov=1&rec=2';
        //console.log("ajax_url: " + ajax_url);
        return $.ajax({
            url: ajax_url,
            type: "GET",
            jsonp: "callback",
            dataType: "jsonp",
            async: true
        }).done(function (data) {
            console.log('[Server Interface] Fetched ' + data.length + ' annotations for ' + searchKey + ': "' + searchParam + '".');
        }).fail(function (response) {
            var returned_response = response.responseJSON.error.code[0].value + " : " + response.responseJSON.error.message[0].value ;
            console.error('[Server Interface] Error fetching annotations for ' + searchKey + ': "' + searchParam + '"\n ' + returned_response);
            _this2.annotator.messageOverlay.ShowError('Could not retrieve annotations!<br>(' + returned_response + ')');

        });  
    }

    PostAnnotation(callback){
        console.log("Posting annotation...");
        let annotation = this.annotator.gui.GetAnnotationObject();
        // console.log(annotation);
        console.log("annotation: " + JSON.stringify(annotation));

        let key;
        if (this.annotator.apiKey){
            key = this.annotator.apiKey;
            let email_storage = localStorage.getItem('waldorf_user_email');
            let name_storage = localStorage.getItem('waldorf_user_name');
            if (email_storage === null) {
                console.error("[Server Interface] You are not logged in!");
                this.annotator.messageOverlay.ShowError("You are not logged in!");
                return false;
            }
            if(name_storage == null) name_storage = email_storage;
        } else {
            key = localStorage.getItem('waldorf_auth_token');
            if (key === null) {
                console.error("[Server Interface] You are not logged in!");
                this.annotator.messageOverlay.ShowError("You are not logged in!");
                return false;
            }
        }

        if(this.annotator.apiKey){
            if(annotation["creator"] == null) annotation["creator"] = {};
            annotation["creator"]["email"] = localStorage.getItem('waldorf_user_email');
            annotation["creator"]["nickname"] = localStorage.getItem('waldorf_user_name');
        }

        //clean annotation
        if (annotation["annotation_version"] == "v1") {
            annotation["request"]["items"]["action"] = "add";
            delete annotation["items"];
        } else {
            annotation["service"]["items"]["action"] = "add";
            delete annotation["target"];
            delete annotation["body"];
        }
        delete annotation["annotation_version"];

        console.log("PostAnnotation payload: " + JSON.stringify(annotation));
        
        $.ajax({
            //url: this.baseURL + "/api/addAnnotation",
            url: this.baseURL + "api/add",
            type: "POST",
            dataType: 'json', // Necessary for Rails to see this data type correctly
            contentType: 'application/json',  // Necessary for Rails to see this data type correctly
            data: JSON.stringify(annotation),  // Stringify necessary for Rails to see this data type correctly
            async: true,
            context: this,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', this.make_write_auth(key));
            },
            success: (data) => {
                console.log("Successfully posted new annotation.");
                this.annotator.messageOverlay.ShowMessage("Successfully created new annotation.");
                annotation.id = data.id; // Append the ID given by the response
                if(callback) callback(annotation);
            },
            error: (response) => {
                var returned_response = response.responseJSON.error.code[0].value + " : " + response.responseJSON.error.message[0].value ;
                console.error(`Could not post new annotation! Message:\n ${returned_response}`);
                this.annotator.messageOverlay.ShowError(`Could not post new annotation!<br>(${returned_response})`);
            }
        });
    }

    EditAnnotation(callback){
        let annotation = this.annotator.gui.GetAnnotationObject();
        
        let key;
        if (this.annotator.apiKey){
            key = this.annotator.apiKey;
            let email_storage = localStorage.getItem('waldorf_user_email');
            let name_storage = localStorage.getItem('waldorf_user_name');
            if (email_storage === null) {
                console.error("[Server Interface] You are not logged in!");
                this.annotator.messageOverlay.ShowError("You are not logged in!");
                return false;
            }
            if(name_storage == null) name_storage = email_storage;
        } else {
            key = localStorage.getItem('waldorf_auth_token');
            if (key === null) {
                console.error("[Server Interface] You are not logged in!");
                this.annotator.messageOverlay.ShowError("You are not logged in!");
                return false;
            }
        }

        if(this.annotator.apiKey){
            if(annotation["creator"] == null) annotation["creator"] = {};
            annotation["creator"]["email"] = localStorage.getItem('waldorf_user_email');
            annotation["creator"]["nickname"] = localStorage.getItem('waldorf_user_name');
        }

        let oldID = annotation.id;

        console.log("Modifying annotation " + oldID);
        
        $.ajax({
            url: this.baseURL + "api/edit/",
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(annotation),
            async: true,
            context: this,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', this.make_write_auth(key));
            },
            success: (data) => {
                //console.log(annotation);
                annotation.id = data.id; // Append the ID given by the response
                //console.log("Successfully edited the annotation. (ID is now " + data.id + ")");

                this.annotator.messageOverlay.ShowMessage("Successfully edited the anotation.");
                if(callback) callback(annotation, oldID);
            },
            error: (response) => {
                //console.error(`Could not edit the annotation! Message:\n ${response.responseJSON.detail}`);
                //this.annotator.messageOverlay.ShowError(`Could not edit the annotation!<br>(${response.responseJSON.detail})`);
                var returned_response = "undefined error while editing the annotation";
                if (response.responseJSON) {
                    returned_response = response.responseJSON.error.code[0].value + " : " + response.responseJSON.error.message[0].value ;
                }
                console.error(`Could not edit the annotation! Message:\n ${returned_response}`);
                this.annotator.messageOverlay.ShowError(`Could not edit the annotation!<br>(${returned_response})`);
            }

        });
    }

    DeleteAnnotation(annotation){

        let key;
        if (this.annotator.apiKey){
            key = this.annotator.apiKey;
            let email_storage = localStorage.getItem('waldorf_user_email');
            let name_storage = localStorage.getItem('waldorf_user_name');
            if (email_storage === null) {
                console.error("[Server Interface] You are not logged in!");
                this.annotator.messageOverlay.ShowError("You are not logged in!");
                return false;
            }
            if(name_storage == null) name_storage = email_storage;
        } else {
            key = localStorage.getItem('waldorf_auth_token');
            if (key === null) {
                console.error("[Server Interface] You are not logged in!");
                this.annotator.messageOverlay.ShowError("You are not logged in!");
                return false;
            }
        }

        if(this.annotator.apiKey){
            if(annotation["creator"] == null) annotation["creator"] = {};
            annotation["creator"]["email"] = localStorage.getItem('waldorf_user_email');
            annotation["creator"]["nickname"] = localStorage.getItem('waldorf_user_name');

        }

        let del_url = this.baseURL + "api/delete";
        let del_data = {
                "scalar:urn": "urn:scalar:version:" + annotation.id,
                "native": "false",
                "action": "DELETE",
                "api_key": annotation.request.items.api_key,
                "id": annotation.request.items.id
            };
        

        return $.post(del_url, del_data, function(response){
            {
                console.log("Delete error response");
                console.log(response);
                console.log(response.responseText);
            }  
        }).done((response) => {
            console.log("Successfully deleted the annotation.");
            this.annotator.messageOverlay.ShowMessage("Successfully deleted the annotation.");
        }).fail((response) => {
            var returned_response = "undefined failure while deleting the annotation";
            if (response.responseJSON) {
                response.responseJSON.error.code[0].value + " : " + response.responseJSON.error.message[0].value ;
            }
            console.error(`Could not delete the annotation. Message:\n ${returned_response}`);
            this.annotator.messageOverlay.ShowError(`Could not delete the annotation!<br>(${returned_response})`);
        });
    }

}


export { ServerInterface };