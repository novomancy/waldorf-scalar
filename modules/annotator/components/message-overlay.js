
class MessageOverlay {
    constructor(annotator){
        this.annotator = annotator;

        this.$container = $("<div class='waldorf-message-overlay'></div>");
        this.$container.appendTo(this.annotator.player.$container);

        this.$text = $("<p role='alert' aria-live='assertive' aria-atomic='true'></p>").appendTo(this.$container);
        this.$container.fadeOut(0);

    }

    ShowError(message, duration = 3.0){
        this.$container.addClass("waldorf-message-overlay-error");

        this._ShowText(message, duration);
    }

    ShowMessage(message, duration = 5.0){
        this.$container.removeClass("waldorf-message-overlay-error");

        this._ShowText(message, duration);
    }

    _ShowText(message, duration = 5.0){
        this.$text.html(message);
        //this.$container.stop(true, true);
        this.$container.finish();
        this.$container.
            fadeIn(0).
            delay(duration * 1000).
            fadeOut(400);
    }

}

export { MessageOverlay };