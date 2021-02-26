class PolygonOverlay {
    constructor(annotator){
        this.annotator = annotator;
        this.polyElements = [];
        this.svgElements = [];
        this.animateElements = [];
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
            //console.log("polygon-overlay.js:44 Update(annotations) is called");
            let videoDims = this.getPlayerSize();
            //console.log("videoDims width:" + videoDims["width"] + ", height:" + videoDims["height"]);

            let annotationPolyPoints = annotations[i].getPoly();
            if (annotationPolyPoints == null) {
                // Ignore this annotation if it has no polygon
                continue;
            }

            let svgPolyPoints = annotations[i].getSVGPolyPoints();
            //console.log("svgPoints from:" + svgPoints[0]);
            //console.log("svgPoints to:" + svgPoints[1]);
            //console.log("beginTime: " + annotations[i].beginTime + ", endTime: " + annotations[i].endTime);

            let duration = annotations[i].endTime - annotations[i].beginTime;

            // Create the poly object
            //let $poly = $("<div class='waldorf-overlay-poly'></div>").appendTo(this.$videoOverlay);

            //let $svgPoly = $("<svg  width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio='none'></svg>").appendTo(this.$videoOverlay); 
            let $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            $svg.setAttribute('width', '100%');
            $svg.setAttribute('height', '100%');
            $svg.setAttribute('viewBox', '0 0 100 100');
            $svg.setAttribute('preserveAspectRatio', 'none');
            this.$videoOverlay.append($svg);

            //let $polygon = $("<polygon points='" + svgPolyPoints[0] + "' fill='rgba(0, 118, 255, 0.55)'> </polygon>").appendTo($svg); 
            let $polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            $polygon.setAttribute('points', svgPolyPoints[0]);
            $polygon.setAttribute('fill', 'rgba(0, 118, 255, 0.55)');
            $svg.appendChild($polygon);

            //let $animate1 =  $("<animate attributeName='points' fill='rgba(0, 118, 255, 0.55)' " + 
            //        " from='" + svgPolyPoints[0] + "' " + 
            //        " to='" + svgPolyPoints[1] + "' " + 
            //       // " startTime='" + annotations[i].beginTime + "'" +
            //       // " endTime='" + annotations[i].endTime + "'" +
            //        " begin='indefinite' dur='" + duration + "s' /> ").appendTo($polygon);

            let $animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            $animate.setAttribute('attributeName', 'points');
            $animate.setAttribute('fill', 'freeze');
            $animate.setAttribute('from', svgPolyPoints[0]);
            $animate.setAttribute('to', svgPolyPoints[1]);
            $animate.setAttribute('begin', 'indefinite');
            $animate.setAttribute('dur', duration + "s");
            $polygon.appendChild($animate);
            
            // $poly.clipPath(annotationPolyPoints, {
            //     isPercentage: true,
            //     svgDefId: 'annotatorPolySvg'
            // });
            // $poly.click(() => {
            //     this.annotator.$container.trigger("OnPolyClicked", annotations[i]);
            // });

            //let elements = document.getElementsByTagName("animate");
            //elements[0].beginElement()

            //start the polygon animation
            //console.log($svg.getCurrentTime());
            // $animate.beginElement();
            // $svg.setCurrentTime($svg.getCurrentTime()+4);
            // $animate.endElement();

            // this.AddTooltip($poly, annotations[i]);
            // this.polyElements.push($poly);
            // this.svgElements.push($svgPoly);
            this.svgElements.push($svg);
            this.animateElements.push($animate);
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
        
        // Clear all the polygons from the DOM
        for(let i = 0; i < this.svgElements.length; i++){
            this.svgElements[i].remove();
            this.animateElements[i].remove();
        }

        // Mark the array as empty
        this.polyElements = [];
        this.svgElements = [];
        this.animateElements = [];

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