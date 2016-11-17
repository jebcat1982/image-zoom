goog.provide('nx.Canvas');

var LOUPE_RADIUS = 1;
var FULL_IMAGE_BORDER_PADDING = 0;
var LOUPE_FINGER_PADDING = 0;
var PADDING_YYY = 0;
var LOUPE_HALF_BORDER = 1;

nx.Canvas = function (ctx) {
    this.ctx_ = ctx;
    var $this = this;

    var canvasWrapper = jq('#screen');
    canvasWrapper.html('<div id="canvas"><div id="coordinates"></div><img /><div id="xyVertical"></div><div id="xyHorizontal"></div><div id="loupeHandle"></div><div id="loupe"><div id="canvasFull"></div></div></div><div id="canvasOverlay"></div>');
    $this.xyVertical = jq('#xyVertical');
    $this.xyHorizontal = jq('#xyHorizontal');
    $this.loupeHandle = jq('#loupeHandle');

    $this.prefs = nx.Index.CANVAS_PREF;
    $this.halfloupe = $this.prefs.loupe / 2;

    $this.canvas = jq('#canvas');
    $this.canvasOverlay = jq('#canvasOverlay');
    $this.loupe = jq('#loupe');
    $this.canvasFull = jq('#canvasFull');
    $this.loupeGlass = jq('#loupe .glass');
    $this.coordinates = jq('#coordinates');
    $this.targetBtn = jq('#targetBtn');

    $this.target = {
        div: jq('#target'),
        activated: false,
        pos: null
    };

    var canWrapPos = canvasWrapper.position();

    canvasWrapper.css({
        height: $this.prefs.imageSmall.height + 'px',
        'position': 'absolute',
        'left': Math.round(canWrapPos.left) + 'px',
        'top': Math.round(canWrapPos.top) + 'px'
    });

    $this.canvasOverlay.css({
        width: $this.prefs.imageSmall.width + 'px',
        height: $this.prefs.imageSmall.height + 'px'
    });
    $this.canvas.css({
        width: $this.prefs.imageSmall.width + 'px',
        height: $this.prefs.imageSmall.height + 'px'
    });

    jq('#canvas img').attr({
        width: $this.prefs.imageSmall.width,
        height: $this.prefs.imageSmall.height,
        'src': $this.prefs.imageUrl
    });

    $this.loupe.css({
        width: ($this.prefs.loupe - 0) + 'px',
        height: ($this.prefs.loupe - 0) + 'px'
    });

    $this.canvasFull.css({
        'background-image': 'url(' + $this.prefs.imageUrl + ')',
        width: ($this.prefs.imageFull.width) + 'px',
        height: ($this.prefs.imageFull.height) + 'px'
    });

    if ($this.prefs.ratio > 3) {
        var cW = canvasWrapper.width();
        var sW = jq('#screen').width();
        canvasWrapper.css('left', Math.round((sW - cW) / 2));
    }

    $this.offset = {left: Math.round($this.canvas.offset().left), top: Math.round($this.canvas.offset().top)};

    $this.target.pos = [0, 0];
    $this.target.fullPos = [0, 0];

    $this.canvasOverlay['mousemove'](function (e) {
        $this.doMove(e);

    })['mouseleave'](function (e) {
        $this.doLeave(e);

    })['mouseenter'](function (e) {
        $this.doEnter(e);

    })['click'](function (e) {
        console.log('clicked', e);
    });
    jq['mousestopDelay'] = 100;
    $this.canvasOverlay['mousestop'](function (e) {
        $this.doStopped(e);
    });

};

nx.Canvas.prototype.doStopped = function (e) {
    this.target.activated = true;
};

nx.Canvas.prototype.doEnter = function (e) {
    this.loupe.stop(true, true).fadeIn('fast');
    this.target.activated = false;
};

nx.Canvas.prototype.doLeave = function (e) {
    this.loupe.stop(true, true).fadeOut('fast');
    this.target.activated = false;
};


nx.Canvas.prototype.doMove = function (e) {
    var $this = this;

    var R = $this.prefs.ratio;

    $this.XY = [(e.pageX - $this.offset.left), (e.pageY - PADDING_YYY - $this.offset.top)];
    if (!$this.isInsideCanvas()) {
        return;
    }
    $this.fullXY = [(R * $this.XY[0] ), (R * $this.XY[1])];

    if ($this.target.activated) {
        var activXY = $this.calculateActivated(e);

        $this.updateXyText($this.newFullXY);

        var isOutside = limit(activXY, $this.target.pos);
        if (isOutside) {
            $this.target.activated = false;
        }
        return;
    }

    $this.updateXyText($this.fullXY);

    if ($this.loupe.is(':not(:animated):hidden')) {
        /* Fixes a bug where the loupe div is not shown */
        $this.doEnter(e);
    }

    if ($this.XY[0] < FULL_IMAGE_BORDER_PADDING || $this.XY[1] < FULL_IMAGE_BORDER_PADDING || $this.XY[0] > $this.prefs.imageSmall.width - FULL_IMAGE_BORDER_PADDING || $this.XY[1] > $this.prefs.imageSmall.height - FULL_IMAGE_BORDER_PADDING) {
        /*	If we are out of the bondaries of the canvas screenshot, hide the loupe div */
        if (!$this.loupe.is(':animated')) {
            $this.doLeave(e);
        }
        return false;
    }

    var _loupePos = $this._loupePos = [$this.XY[0] - $this.halfloupe - LOUPE_HALF_BORDER, $this.XY[1] - $this.halfloupe - LOUPE_FINGER_PADDING - LOUPE_HALF_BORDER];
    var _loupeBG_Pos = [-($this.fullXY[0] - $this.halfloupe) - LOUPE_HALF_BORDER, -($this.fullXY[1] - $this.halfloupe) - LOUPE_HALF_BORDER];
    $this.loupe.css({
        left: _loupePos[0],
        top: _loupePos[1]
    });
    $this.xyVertical.css({
        left: $this.XY[0]
    });
    $this.xyHorizontal.css({
        top: $this.XY[1] /*- PADDING_YYY */
    });

    $this.canvasFull.css({
        left: _loupeBG_Pos[0] + 'px',
        top: _loupeBG_Pos[1] + 'px'
    });

    $this.target.pos = [$this.XY[0], $this.XY[1]];
    $this.target.fullPos = [$this.fullXY[0], $this.fullXY[1]];
};

nx.Canvas.prototype.isInsideCanvas = function () {
    return (
        (this.XY[0] > -1 && this.XY[1] > -1) &&
        (this.XY[0] < this.prefs.imageSmall.width && this.XY[1] < this.prefs.imageSmall.height)
    );
};

nx.Canvas.prototype.calculateActivated = function (e) {
    var $this = this;

    var R = $this.prefs.ratio;

    var activXY = [(e.pageX - $this.offset.left), (e.pageY - PADDING_YYY - $this.offset.top)];
    var deltaXY = [activXY[0] - $this.target.pos[0], activXY[1] - $this.target.pos[1]];
    $this.newFullXY = [$this.target.fullPos[0] + deltaXY[0], $this.target.fullPos[1] + deltaXY[1]];
    $this.newXY = [$this.newFullXY[0] / R, $this.newFullXY[1] / R];
    return activXY;
};


nx.Canvas.prototype.updateXyText = function (_fullXY) {
    var text = Math.round(_fullXY[0]) + ' - ' + Math.round(_fullXY[1]);
    this.coordinates.html(text);
};

function limit(xy, centerXY) {
    var dist = distance(xy, centerXY);
    if (dist <= LOUPE_RADIUS) {
        return false;
    } else {
        return {limit: true};
    }
};

function distance(dot1, dot2) {
    var x1 = dot1[0],
        y1 = dot1[1],
        x2 = dot2[0],
        y2 = dot2[1];
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};