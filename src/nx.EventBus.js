goog.provide('nx.EventBus');

goog.require('goog.pubsub.PubSub');

nx.EventBus = function (ctx) {
    this.ctx_ = ctx;
    this.pubsub_ = new goog.pubsub.PubSub();
};

nx.EventBus.prototype.on = function (event, eventHandlerFn) {
    this.pubsub_.subscribe(event, eventHandlerFn);
};

nx.EventBus.prototype.fire = function (event, valueObj) {
    this.pubsub_.publish(event, valueObj);
};

nx.EventBus.handleEvents = function (ctx) {

    var eventBus = ctx.getEventBus();

    var doResizeCanvas = function (shallRepaint) {
        nx.Index.setPrefsRatio();
        ctx.fireEvent(nx.Event.RepaintCanvas);
    };

    jq(window)['resize'](function (x, y) {
        doResizeCanvas();
    });

    eventBus.on(nx.Event.RepaintCanvas, function () {
        new nx.Canvas(ctx);
    });

    eventBus.on(nx.Event.CanvasStart, function () {
        doResizeCanvas();
    });

    eventBus.on(nx.Event.Entered, function () {
        ctx.fireEvent(nx.Event.CanvasStart);
    });

};