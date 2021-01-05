class PolygonOverlay {
    constructor(annotator){
        this.annotator = annotator;
        this.polyElements = [];
        this.baseZ = 2147483649;
        this.lastAnnotations = [];

        
        // Create the video overlay
        this.$videoOverlay = $("<div class='waldorf-video-overlay'></div>").appendTo(this.annotator.player.$container);
        this.ResizeOverlay();
        this.annotator.player.$container.on("OnFullscreenChange", (event, setFullscreen) => this.ResizeOverlay());

        this.annotator.$container.on("OnNewAnnotationSet", (event, annotations) => this.Update(annotations));
        this.videoDims = this.annotator.player.GetVideoDimensions();

        $(window).resize(() => this.ResizeOverlay());
    }

    Update(annotations){
        this.Clear();

        // let prevSet = new Set(this.lastAnnotations);
        // let newSet = new Set(annotations);

        // // in newSet and not in prevSet
        // let toAdd = new Set(
        //     [...newSet].filter(x => !prevSet.has(x)));

        // // in prevAnnotations and not in annotations
        // let toDestroy = new Set(
        //     [...prevSet].filter(x => !newSet.has(x)));

        // console.log(Array.from(toAdd));
        // console.log(Array.from(toDestroy));
        
        //Sort polygon order by size (ascending)
        // polygons.sort(function(a, b) {
        //     return this.GetArea(a) > this.GetArea(b);
        // })

        for (let i = 0; i < annotations.length; i++) {
            let videoDims = this.getPlayerSize();
            console.log("videoDims width:" + videoDims["width"] + ", height:" + videoDims["height"]);

            let annotationPolyPoints = annotations[i].getPoly();
            if (annotationPolyPoints == null) {
                // Ignore this annotation if it has no polygon
                continue;
            }

            let svgPoints = annotations[i].getSVGPoints();
            console.log("svgPoints from:" + svgPoints[0]);
            console.log("svgPoints to:" + svgPoints[1]);

            // Create the poly object
            let $poly = $("<div class='waldorf-overlay-poly'></div>").appendTo(this.$videoOverlay);

            let $svgPoly = $("<svg  width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio='none'> " + 
                "<polygon points='" + svgPoints[0] + "' fill='red'> " + 
                "<animate attributeName='points' fill='freeze' " + 
                    " from='" + svgPoints[0] + "' " + 
                    " to='" + svgPoints[1] + "' " + 
                    " begin='click' dur='10s' /> " + 
                "</polygon> " + 
                "</svg>").appendTo(this.$videoOverlay);

            
            $poly.clipPath(annotationPolyPoints, {
                isPercentage: true,
                svgDefId: 'annotatorPolySvg'
            });
            $poly.click(() => {
                this.annotator.$container.trigger("OnPolyClicked", annotations[i]);
            });



            this.AddTooltip($poly, annotations[i]);
            
            this.polyElements.push($poly);
        }

        //this.lastAnnotations = annotations;
    }

    AddTooltip($poly, annotation){
        $.fn.qtip.zindex = this.baseZ+ 1;
        $poly.qtip({
            content: {
                title: annotation.id,
                text: annotation.body.filter(item => item.purpose === "describing")[0].value
            },
            position: {
                my: 'bottom right',
                at: 'top left',
                target: 'mouse', // Follow the mouse
                adjust: {
                    mouse: true,
                    method: "shift shift" // horizontal, vertical
                },
                viewport: this.annotator.player.$container
            },
            hide: {
                delay: 0 // No hide delay by default
            },
            style: {
                classes: 'qtip-dark qtip-rounded annotator-qtip'
            }
        });
    }

    Clear(){
        // Clear all the polygons from the DOM
        for(let i = 0; i < this.polyElements.length; i++){
            this.polyElements[i].data("qtip").destroy(true);
            this.polyElements[i].remove();
        }
        
        // Mark the array as empty
        this.polyElements = [];
        
        // $('#mySvg').remove();
    }

    ResizeOverlay(){
        // Resize video overlay to fit actual video dimensions
        let videoDims = this.annotator.player.GetVideoDimensions();
        this.$videoOverlay.css('width', videoDims.width);
        this.$videoOverlay.css('height', videoDims.height);

        let heightDiff = (this.annotator.player.$video.height() - videoDims.height) / 2;
        this.$videoOverlay.css('top', heightDiff);

        let widthDiff = (this.annotator.player.$video.width() - videoDims.width) / 2;
        this.$videoOverlay.css('left', widthDiff);
    }

    getPlayerSize() {
        return this.annotator.player.GetVideoDimensions();
    }

}

export { PolygonOverlay };