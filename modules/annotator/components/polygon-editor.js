
/**
 * Manages the creating or editing of a single polygon on the video.
 * Consists of a toolbar, an overlay, and the polygon inside the overlay.
 *
 * Click to place or remove a draggable point. Points should be
 * put down in clockwise order.
 */
class PolygonEditor {
    constructor(annotator){
        this.annotator = annotator;
        this.baseZ = 2147483649;
        this.$breadcrumbs = [];
        this.$vertices = { 'start': [], 'stop': [] };   //arrays of vertices for start/stop polys
        this.$polygons = { 'start': null, 'stop': null };   //DOM nodes for the actual polygons
        // this.$tempBreadCrumbs = [];
        this.$startStop = null;

        // Create the video overlay
        this.$clickSurface = $("<div class='waldorf-edit-overlay waldorf-vp-click-surface'></div>").appendTo(this.annotator.player.$container);
        //this.$clickSurface.css("z-index", this.baseZ);
        this.$clickSurface.click((event) => {
            this.OnSurfaceClick(event);
        });

        // Initialize the polygon DOM nodes
        this.$polygons.start = $("<div class='waldorf-start-poly'></div>").appendTo(this.$clickSurface);
        this.$polygons.start.css("z-index", this.baseZ + 1);
        this.$polygons.stop = $("<div class='waldorf-stop-poly'></div>").appendTo(this.$clickSurface);
        this.$polygons.stop.css("z-index", this.baseZ + 1);

        this.ResizeOverlay();
        this.annotator.player.$container.on("OnFullscreenChange", (event, setFullscreen) => this.ResizeOverlay());

        // Create the toolbar up top
        // this.$bar = $("<div class='waldorf-vp-post'></div>").appendTo(this.annotator.player.$container);
        // this.$postToolbar = $("<div class='flex-toolbar'></div>").appendTo(this.$bar);
        // Invisible expanding divider
        //-3//this.$postToolbar.append($("<div><p style='color:white'>Edit Polygon</p></div>").css("flex-grow", 1).css("order", 0));


        // Make "Collect Polygon state" button
        // this.$capPolyButton = $("<button>Capture Polygon</button>").button({
        //     icon: "fa fa-camera-retro",
        //     showLabel: false
        // }).click(() => {
        //     //this.SetVisible(false);
        //     //this.GetPoints();

        //     // Build polygon selector
        //     // let points = this.GetPoints();
        //     // if(points.length > 0) {
        //     //     let pointsStr = points.map(item => { return `${item[0]},${item[1]}` }).join(" ");
        //     //     let polygonSelector = {
        //     //         "type": "SvgSelector",
        //     //         "value": `<svg:svg viewBox='0 0 100 100' preserveAspectRatio='none'><polygon points='${pointsStr}' /></svg:svg>` // http://stackoverflow.com/a/24898728
        //     //     }
        //     //     tmpSelectors.push(polygonSelector);
        //     // }
        //     // console.log("tmpSelectors");
        //     // console.log(tmpSelectors);
        //     this.annotator.AddPolygonSet(this.annotator.annotation.getPoly());

        // });
        // this.$capPolyButton.css("margin-right", "15px");
        // this.$capPolyButton.attr('title', "Capture polygon");
        //-3//this.RegisterElement(this.$capPolyButton, this.$postToolbar, 1, 'flex-end');

        // Create undo button
        // this.$undoButton = $("<button>Remove Last Point</button>").button({
        //     icon: "fa fa-undo",
        //     showLabel: false
        // });
        // this.$undoButton.css("margin-right", "15px");
        // this.$undoButton.attr('title', "Remove last point");
        // this.$undoButton.click(() => {
        //     this.RemoveLastBreadcrumb();
        // });
        //-3//this.RegisterElement(this.$undoButton, this.$postToolbar, 1, 'flex-end');

        // Create the confirm button
        // this.$confirmButton = $("<button>Finish polygon</button>").button({
        //     icon: "fa fa-check",
        //     showLabel: false
        // });
        // this.$confirmButton.attr('title', "Finish polygon");
        // this.$confirmButton.addClass("waldorf-confirm-button");
        // this.$confirmButton.click(() => {
        //     this.originalJSON = this.GetJSON();
        //     this.Done();
        //     this.annotator.$container.trigger("OnPolygonEditingEnded");
        // });
        // //-3//this.RegisterElement(this.$confirmButton, this.$postToolbar, 3, 'flex-end');

        // // Create the cancel button
        // this.$cancelButton = $("<button>Stop polygon editing</button>").button({
        //     icon: "fa fa-remove",
        //     showLabel: false
        // });
        // this.$cancelButton.addClass("waldorf-cancel-button");
        // this.$cancelButton.attr('title', "Stop polygon editing");
        // this.$cancelButton.click(() => {
        //     //Restore the original state
        //     this.Restore();
        //     this.Done();
        //     this.annotator.$container.trigger("OnPolygonEditingEnded");
        // });
        // //-3//this.RegisterElement(this.$cancelButton, this.$postToolbar, 2, 'flex-end');

        // $(window).resize(() => this.ResizeOverlay());


        /* 
        * new UI
        */
        this.$editDialog = $("<div id='edit-dialog' class='waldorf-edit-overlay waldorf-vp-click-surface'></div>").appendTo(this.annotator.player.$container);
        this.$editDialog.draggable();
        this.$editDialog.css('z-index', this.baseZ + 100);
        this.$editDialog.click((event) => {
            this.OnSurfaceClick(event);
        });

        this.$space = $("<div>&nbsp;</div><hr>");
        this.RegisterElement(this.$space, this.$editDialog, 1, 'flex-end');

        // Create undo button
        this.$undoButton = $("<button>Remove Last Point</button>").button({
            icon: "fa fa-undo",
            showLabel: false
        });
        this.$undoButton.css("margin", "0px 5px 4px 5px");
        this.$undoButton.attr('title', "Remove last point");
        this.$undoButton.css('z-index', this.baseZ + 105);
        this.$undoButton.click(() => {
            this.RemoveLastBreadcrumb();
        });
        this.RegisterElement(this.$undoButton, this.$editDialog, 1, 'flex-end');

        // Make "Collect Polygon state" button
        this.$capPolyButton = $("<button>Capture Polygon</button>").button({
            icon: "fa fa-camera-retro",
            showLabel: false
        }).click(() => {
            this.AddPolygonSet();
        });
        this.$capPolyButton.css("margin", "0px 5px 4px 5px");
        this.$capPolyButton.attr('title', "Capture Polygon");
        this.$capPolyButton.css('z-index', this.baseZ + 105);
        this.RegisterElement(this.$capPolyButton, this.$editDialog, 1, 'flex-end');

        // Create the cancel button
        this.$cancelButton = $("<button>Stop polygon editing</button>").button({
            icon: "fa fa-remove",
            showLabel: false
        });
        this.$cancelButton.css("margin", "0px 5px 4px 5px");
        this.$cancelButton.addClass("waldorf-cancel-button");
        this.$cancelButton.attr('title', "Stop Polygon Editing");
        this.$cancelButton.click(() => {
            //Restore the original state
            //this.Restore();
            this.RemoveAllBreadcrumbs();
            this.annotator.$container.trigger("OnPolygonEditingEnded");
            this.Done();
        });
        this.RegisterElement(this.$cancelButton, this.$editDialog, 2, 'flex-end');

        $(window).resize(() => this.ResizeOverlay());

        this.Done();
    }

    OnSurfaceClick(event){
        if ($(event.currentTarget).attr("id") == "edit-dialog" || this.$startStop != "start") {
            return;
        }

        // Add a breadcrumb on click, but only for the start polygon. End vertices can only be dragged
        let target = $(event.currentTarget);
        let x = event.pageX - target.offset().left;
        let y = event.pageY - target.offset().top;
        
        let xPercent = (x / target.width()) * 100;
        let yPercent = (y / target.height()) * 100;
        
        this.AddBreadcrumb(xPercent, yPercent);
        
        //this.newPolyPoints.push([xPercent.toFixed(3), yPercent.toFixed(3)]);
        this.UpdatePolyClipping();
    }

    /**
     * Creates a new breadcrumb at the given (x, y) point on the
     * clickSurface, where x and y are percentages from 0 to 100.
     */
    AddBreadcrumb(xPercent, yPercent){
        let $breadcrumb = $("<div class='breadcrumb'></div>");
        $breadcrumb.appendTo(this.$clickSurface);
        $breadcrumb.css("position", "absolute");

        // Percentage representations of breadcrumb width and height
        let offPercentX = ($breadcrumb.outerWidth() / this.$clickSurface.width()) * 100;
        let offPercentY = ($breadcrumb.outerHeight() / this.$clickSurface.height()) * 100;
        // Percentage representations of breadcrumb width and height
        $breadcrumb.css("left", (xPercent - (offPercentX / 2)).toString() + "%");
        $breadcrumb.css("top", (yPercent - (offPercentY / 2)).toString() + "%");
        //$breadcrumb.css("z-index", this.baseZ - 50);

        
        $breadcrumb.draggable({ 
            //containment: "parent",
            drag: () => {
                // Recalculate percentages (mangled by jQuery UI draggable code)
                // See http://stackoverflow.com/a/23673462
                var l = ( 100 * parseFloat($breadcrumb.css("left")) / parseFloat($breadcrumb.parent().css("width")) )+ "%" ;
                var t = ( 100 * parseFloat($breadcrumb.css("top")) / parseFloat($breadcrumb.parent().css("height")) )+ "%" ;
                $breadcrumb.css("left" , l);
                $breadcrumb.css("top" , t);
                this.UpdatePolyClipping();
            }
        });
        if(this.$startStop=="start"){
            //breadcrumbs can only be added or removed in the first polygon
            $breadcrumb.click((event) => {
                // Remove the breadcrumb on click
                event.stopPropagation();
                $breadcrumb.remove();
                this.$breadcrumbs.splice(this.$breadcrumbs.indexOf($breadcrumb), 1);
                this.UpdatePolyClipping();
                this.UpdateBreadcrumbColoring();
            });
        }
        
        this.$breadcrumbs.push($breadcrumb);

        //this.UpdatePolyClipping();
        this.UpdateBreadcrumbColoring();
    }

    /**
     * Removes the last-placed breadcrumb from the list
     * and updates the view.
     */
    RemoveLastBreadcrumb(){
        let $removed = this.$breadcrumbs.pop();
        $removed.remove();
        this.UpdatePolyClipping();
        this.UpdateBreadcrumbColoring();
    }

    RemoveAllBreadcrumbs(){
        console.log("Removing all breadcrumbs");
        while(this.$breadcrumbs.length > 0){
            this.RemoveLastBreadcrumb();
        }
    }

    /**
     * Gets the center of the breadcrumb as an (x, y) pair
     * representing the percentage distance from the top and left
     * of the click surface (0% - 100%).
     */
    GetCenterPercentage($breadcrumb){
        let topPercent = ($breadcrumb.position().top / $breadcrumb.parent().height()) * 100;
        let leftPercent = ($breadcrumb.position().left / $breadcrumb.parent().width()) * 100;

        // Percentage values for the dimensions of the breadcrumb relative to the click surface
        let offPercentX = ($breadcrumb.outerWidth() / $breadcrumb.parent().width()) * 100;
        let offPercentY = ($breadcrumb.outerHeight() / $breadcrumb.parent().height()) * 100;

        return {
            x: leftPercent + (offPercentX / 2.0),
            y: topPercent + (offPercentY / 2.0)
        }
    }

    Reset(){
        
        // Remove all breadcrumbs
        for(let $breadcrumb of this.$breadcrumbs){
            $breadcrumb.remove();
        }
        this.$breadcrumbs = [];

        // Remove the poly if it already exists
        // if(this.$poly != null){
        //     this.$poly.remove();
        // }
    }

    ResetPolygons() {
        console.log("resetting polygons");
        if (this.$polygons.start) {
            console.log("reset start poly");
            this.$polygons.start.makeVisible(false);
            this.$polygons.start.css("clip-path", "");
        }
        if (this.$polygons.stop) {
            this.$polygons.stop.makeVisible(false);
            this.$polygons.stop.css("clip-path", "");
        }

        this.$vertices = { 'start': [], 'stop': [] };
        this.UpdatePolyClipping();
        this.RemoveAllBreadcrumbs();
    }

    Restore(){
        this.InitPoly(this.originalJSON);
    }

    InitPoly(points = null){
        this.Reset();

        // If JSON was specified, generate breadcrumbs from it.
        if(points != null){
            // Put down the breadcrumbs
            for(let point of points){
                this.AddBreadcrumb(point[0], point[1]);
            }
        }

        this.UpdatePolyClipping();

        this.originalJSON = points;
    }

    DrawPolygons() {
        this.RemoveAllBreadcrumbs();
        if (this.$vertices.start != []) {
            //let startPolygon = this.$vertices.start; //.map(item => { return `${item[0]},${item[1]}` }).join(" ");;
            
            // Create the poly objects
            // this.$polygons.start = $("<div class='waldorf-start-poly'></div>").appendTo(this.$clickSurface);
            // this.$polygons.start.css("z-index", this.baseZ + 1000);

            if(this.$vertices.start.length < 3){
                this.$polygons.start.makeVisible(false);
                this.$polygons.start.clipPath([], {
                    svgDefId: 'annotatorStartPolySvg'
                });
            } else {
                this.$polygons.start.makeVisible(true);
                this.$polygons.start.clipPath(this.$vertices.start, {
                    isPercentage: true,
                    svgDefId: 'annotatorStartPolySvg'
                });
                if(this.$startStop=="start"){
                    this.$vertices.start.map((point) => {
                        this.AddBreadcrumb(point[0], point[1]);
                    });
                }
            }
        }
        if (this.$vertices.stop != []) {
            if(this.$vertices.stop.length < 3){
                this.$polygons.stop.clipPath([], {
                    svgDefId: 'annotatorStopPolySvg'
                });
            } else {
                this.$polygons.stop.makeVisible(true);
                this.$polygons.stop.clipPath(this.$vertices.stop, {
                    isPercentage: true,
                    svgDefId: 'annotatorStopPolySvg'
                });
                if(this.$startStop=="stop"){
                    this.$vertices.stop.map((point) => {
                        this.AddBreadcrumb(point[0], point[1]);
                    });
                }
            }
        }
    }

    UpdatePolyClipping(){
        if(this.$startStop==null) return;
        let svgId = this.$startStop == "start" ? "annotatorStartPolySvg" : "annotatorStopPolySvg";
        if(this.$breadcrumbs.length < 3){
            this.$polygons[this.$startStop].makeVisible(false);
            this.$polygons[this.$startStop].clipPath([], {
                svgDefId: svgId
            });
        } else {
            let points = this.$breadcrumbs.map(($crumb) => {
                let pos = this.GetCenterPercentage($crumb);
                return [pos.x, pos.y];
            });
            this.$polygons[this.$startStop].makeVisible(true);
            this.$polygons[this.$startStop].clipPath(points, {
                isPercentage: true,
                svgDefId: svgId
            });
        }
    }

    UpdateBreadcrumbColoring(){
        for(let i = 0; i < this.$breadcrumbs.length; i++){
            let $crumb = this.$breadcrumbs[i];
            // Recolor each breadcrumb
            let color = "#000000";

            if (i == this.$breadcrumbs.length - 1) {
                color = "#FF0000";
            }
            else if (i == 0){
                color = "#00FF00";
            }
            this.$breadcrumbs[i].css("border-color", color);
        }
    }

    /**
     * Gets an array of percentages representing the x and y percentages of each
     * point in the polygon.
     */
    GetJSON(){
        // Extract the coordinates from the crumbs and put them in the array
        let points = [];
        for(let crumb of this.$breadcrumbs){
            let point = this.GetCenterPercentage(crumb);
            points.push([point.x.toString(), point.y.toString()]);
        }

        return JSON.stringify(points);
    }

    /**
     * Gets an array of percentages representing the x and y percentages of each
     * point in the polygon.
     */
    GetPoints() {
        let points = [];
        for(let crumb of this.$breadcrumbs){
            let point = this.GetCenterPercentage(crumb);
            points.push([point.x, point.y]);
        }
        return points;
    }

    /**
     * Determines if all start vertices match stop vertices
     * returns true if the vertices don't match exactly
     */
    IsAnimated() {
        let comp = this.$vertices.start;
        let startString = JSON.stringify(comp);
        comp = this.$vertices.stop;
        let stopString = JSON.stringify(comp);
        return JSON.stringify(startString) != JSON.stringify(stopString);
    }

    BeginEditing(startStop){
        this.$startStop = startStop;
        //startStop is either 'start' or 'stop', depending on which polygon is being edited
        this.$clickSurface.makeVisible(true);
        this.$editDialog.makeVisible(true);
        this.$polygons.start.makeVisible(false);
        this.$polygons.stop.makeVisible(false);
        //-3//this.$bar.makeVisible(true);
        this.DrawPolygons();
        this.UpdatePolyClipping();
    }

    Done(){
        this.$clickSurface.makeVisible(false);
        this.$editDialog.makeVisible(false);
        this.$polygons.start.makeVisible(false);
        this.$polygons.stop.makeVisible(false);
        //-3//this.$bar.makeVisible(false);
    }

    ResizeOverlay(){
        // Resize video overlay to fit actual video dimensions
        let videoDims = this.annotator.player.GetVideoDimensions();
        this.$clickSurface.css('width', videoDims.width);
        this.$clickSurface.css('height', videoDims.height);

        let heightDiff = (this.annotator.player.$video.height() - videoDims.height) / 2;
        this.$clickSurface.css('top', heightDiff);

        let widthDiff = (this.annotator.player.$video.width() - videoDims.width) / 2;
        this.$clickSurface.css('left', widthDiff);

        this.$polygons.start.width(videoDims.width);
        this.$polygons.start.height(videoDims.height);
        this.$polygons.start.css("top", heightDiff);
        this.$polygons.start.css("left", widthDiff);
        this.$polygons.start.css("position", "absolute");
        this.$polygons.start.makeVisible(false);

        this.$polygons.stop.width(videoDims.width);
        this.$polygons.stop.height(videoDims.height);
        this.$polygons.stop.css("top", heightDiff);
        this.$polygons.stop.css("left", widthDiff);
        this.$polygons.stop.css("position", "absolute");
        this.$polygons.stop.makeVisible(false);

    }

    RegisterElement($element, $container, order, justification = 'flex-start'){
        $element.css('order', order);
        $element.css('align-self', justification);
        // Sets grow [shrink] [basis]
        //$element.css('flex', '0 0 auto');
        $container.append($element);
    }

    ShowJustPolygon(){
        this.DrawPolygons();
    }

    AddPolygonSet() {
        //This is saving a set of breadcrumbs into the vertices for a polygon
        this.$vertices[this.$startStop] = this.GetPoints();
        if(this.$startStop=="start" && this.$vertices.stop.length != this.$vertices.start.length){
            this.$vertices.stop = this.GetPoints();
        }
        this.RemoveAllBreadcrumbs();
        this.annotator.messageOverlay.ShowMessage("Captured "+this.$startStop+" polygon.");

        // if (this.$vertices.length > 1) {
        //     this.$polygons = [];
        //     this.$tempBreadCrumbs = [];
        // }

        // if (!this.$polygons.length) {
        //     this.$polygons.start = this.GetPoints();
        //     this.$tempBreadCrumbs[0] = [this.$breadcrumbs];
        //     var msg = "Successfully captured first polygon.";
        // } else {
        //     this.$polygons.stop = this.GetPoints();
        //     this.$tempBreadCrumbs[1] = [this.$breadcrumbs];
        //     var msg = "Successfully captured second polygon.";
        // } 

        this.annotator.$container.trigger("OnPolygonEditingEnded");
        this.Done();
        this.ShowJustPolygon();


    }

}

export { PolygonEditor };