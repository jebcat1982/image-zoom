goog.provide('nx.Index');

goog.require('goog.array');

goog.require('nx.Ctx');
goog.require('nx.Canvas');
goog.require('nx.Event');
goog.require('nx.EventBus');


/**
 * @constructor
 */
nx.Index = function () {
    var ctx = nx.Ctx.getInstance();

    var contest = null;

    if (!contest) { // mock it

        var mockContest = {
            "url": "/img/big_img.jpg",
            "cols": 2592,
            "rows": 1458
            // "cols": 5760,
            // "rows": 3840
        };
        contest = mockContest;
    }

    nx.Index.CANVAS_PREF.imageUrl = contest['url'];
    nx.Index.CANVAS_PREF.imageFull.width = contest['cols'];
    nx.Index.CANVAS_PREF.imageFull.height = contest['rows'];
    nx.EventBus.handleEvents(ctx);

    var img = new Image();
    img.onload = function () {
        nx.Index.CANVAS_PREF.imageFull = {width: this.width, height: this.height};
        ctx.fireEvent(nx.Event.Entered);
    };
    img.src = nx.Index.CANVAS_PREF.imageUrl;
};

nx.Index.CANVAS_PREF = {
    loupe: 141,
    ratio: 0,
    imageFull: {width: null, height: null},
    imageSmall: null,
    imageUrl: null,
    aspectRatio: 16 / 9
    //imageFull:{ width:2208, height:1668 },
    //imageFull:{ width:2592, height:1458 },// 1728x1728
};

nx.Index.setPrefsRatio = function (ratio) {
    var imgW = nx.Index.CANVAS_PREF.imageFull.width;
    var imgH = nx.Index.CANVAS_PREF.imageFull.height;
    nx.Index.CANVAS_PREF.ratio = ratio;

    var pageWidth = jq(document).width();
    var aspectWeight = pageWidth / nx.Index.CANVAS_PREF.aspectRatio;
    nx.Index.CANVAS_PREF.ratio = imgW / pageWidth;
    nx.Index.CANVAS_PREF.imageSmall = {width: pageWidth, height: aspectWeight};
};
/////////////////////////

jq = jQuery.noConflict();

nx.Index();


