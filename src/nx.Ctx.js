goog.provide('nx.Ctx');

goog.require('nx.EventBus');

nx.Ctx = function () {
    this.eventBus_ = new nx.EventBus(this);
};
goog.addSingletonGetter(nx.Ctx);

nx.Ctx.prototype.getEventBus = function () {
    return this.eventBus_;
};

nx.Ctx.prototype.fireEvent = function (event, valueObj) {
    this.eventBus_.fire(event, valueObj);
};


