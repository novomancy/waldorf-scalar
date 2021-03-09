class PolygonOverlay {
    constructor(annotator){
        this.annotator = annotator;
        this.polyElements = [];
        this.svgElements = [];
        this.animateElements = [];
        this.baseZ = 2147483649;
        this.lastAnnotations = [];
        this.svgElementsHash = {};

        
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

            let annotationPolyPoints = annotations[i].getPoly();
            if (annotationPolyPoints == null) {
                // Ignore this annotation if it has no polygon
                continue;
            }

            let svgPolyPoints = annotations[i].getSVGPolyPoints();
        
            let duration = annotations[i].endTime - annotations[i].beginTime;

            // Create the poly object
            let $svg;
            if (this.svgElements.length == 0) {
                $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                $svg.setAttribute('width', '100%');
                $svg.setAttribute('height', '100%');
                $svg.setAttribute('viewBox', '0 0 100 100');
                $svg.setAttribute('preserveAspectRatio', 'none');
                this.$videoOverlay.append($svg);
                this.svgElements.push($svg);
            } else {
                $svg = this.svgElements[0];
            }
            

            let $polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            $polygon.setAttribute('points', svgPolyPoints[0]);
            $polygon.setAttribute('fill', 'rgba(0, 118, 255, 0.55)');
            $svg.appendChild($polygon);

            let $animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            $animate.setAttribute('attributeName', 'points');
            $animate.setAttribute('fill', 'freeze');
            $animate.setAttribute('from', svgPolyPoints[0]);
            $animate.setAttribute('to', svgPolyPoints[1]);
            $animate.setAttribute('begin', 'indefinite');
            $animate.setAttribute('dur', duration + "s");
            $polygon.appendChild($animate);

            let $svgHash = {
                svgElement: $svg,
                polygon: $polygon,
                animate: $animate,
                beginTime: annotations[i].beginTime
            };

            this.svgElementsHash[annotations[i].id] = $svgHash;

            // Create the poly object
            // let $poly = $("<div class='waldorf-overlay-poly'></div>").appendTo(this.$videoOverlay);
            
            // $poly.clipPath(annotationPolyPoints, {
            //     isPercentage: true,
            //     svgDefId: 'annotatorPolySvg'
            // });
            // $poly.click(() => {
            //     this.annotator.$container.trigger("OnPolyClicked", annotations[i]);
            // });
            // this.AddTooltip($poly, annotations[i]);
            // this.polyElements.push($poly);

            
            this.polyElements.push($polygon);
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
            //this.polyElements[i].data("qtip").destroy(true);
            this.animateElements[i].remove();
            this.polyElements[i].remove();
        }
        
        // Clear all the polygons from the DOM
        for(let i = 0; i < this.svgElements.length; i++){
            this.svgElements[i].remove();
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