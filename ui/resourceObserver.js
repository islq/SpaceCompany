(function(){

    var nextObserverId = 0;

    var observers = {};

    var coloringMaxCapacity = 'green';
    var coloringZeroOrNegative = 'red';

    function ResourceObserver(data) {
        this.type = data.type || RESOURCE_OBSERVER_TYPE.CURRENT_VALUE;
        this.resource = data.res;
        this.htmlId = data.htmlId;
        this.enableColoring = data.coloring || true;
        this.percentage = data.percent || false;
        this.value = data.value || null;
        this.id = nextObserverId++;
        observers[this.id] = this;
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    ResourceObserver.prototype.initialize = function() {

    };

    ResourceObserver.prototype.update = function(delta) {
        var element = $('#' + this.htmlId);
        if(element.length === 0) {
            return;
        }

        var resourceData = Game.resources.getResourceData(this.resource);
        if(!resourceData) {
            return;
        }

        switch (this.type) {
            case RESOURCE_OBSERVER_TYPE.CURRENT_VALUE: {
                element.text(Game.settings.format(resourceData.current));

                if(this.enableColoring) {
                    this.colorElementZero(element, resourceData.current);
                    this.colorElementMax(element, resourceData.current, resourceData.capacity);
                }

                break;
            }

            case RESOURCE_OBSERVER_TYPE.SPECIFIC_VALUE: {
                if(this.percentage === true) {
                    element.text(Game.settings.format(resourceData.current * this.value || 0));
                } else {
                    element.text(Game.settings.format(this.value || 0));
                }

                if(this.enableColoring) {
                    this.colorElementZero(element, this.value);
                    this.colorElementTarget(element, resourceData.current, this.value || 0);
                }

                break;
            }

            case RESOURCE_OBSERVER_TYPE.CAPACITY: {
                element.text(Game.settings.format(resourceData.capacity));

                if(this.enableColoring) {
                    this.colorElementZero(element, resourceData.capacity);
                }

                break;
            }

            case RESOURCE_OBSERVER_TYPE.PER_SECOND: {
                element.text(Game.settings.format(resourceData.perSecond));

                if(this.enableColoring) {
                    this.colorElementZero(element, resourceData.perSecond);
                }

                break;
            }

            case RESOURCE_OBSERVER_TYPE.LEGACY_VALUE: {
                var value = window[this.resource];
                element.text(Game.settings.format(value));

                if(this.enableColoring) {
                    this.colorElementZero(element, value);
                }

                break;
            }

            case RESOURCE_OBSERVER_TYPE.LEGACY_TARGET_VALUE: {
                var value = window[this.resource];

                element.text(Game.settings.format(this.value));

                if(this.enableColoring) {
                    this.colorElementTarget(element, value, this.value || 0);
                }

                break;
            }
        }
    };

    ResourceObserver.prototype.colorElementZero = function (element, value) {
        if(value <= 0) {
            element.addClass(coloringZeroOrNegative);
        } else {
            element.removeClass(coloringZeroOrNegative);
        }
    };

    ResourceObserver.prototype.colorElementMax = function(element, value, maxValue) {
        if(!isNaN(maxValue) && maxValue !== null && value === maxValue) {
            element.addClass(coloringMaxCapacity);
        } else {
            element.removeClass(coloringMaxCapacity);
        }
    };

    ResourceObserver.prototype.colorElementTarget = function (element, value, maxValue) {
        if(value <= maxValue) {
            element.addClass(coloringZeroOrNegative);
        } else {
            element.removeClass(coloringZeroOrNegative);
        }
    };

    ResourceObserver.prototype.delete = function() {
        delete observers[this.id];
    };

    // ---------------------------------------------------------------------------
    // registration
    // ---------------------------------------------------------------------------
    Game.ui.createResourceObserver = function(data) {
        return new ResourceObserver(data);
    };

    var instance = {};

    instance.initialize = function() {
    };

    instance.update = function(delta) {
        for(var id in observers) {
            var observer = observers[id];
            observer.update(delta);
        }
    };

    Game.uiComponents.push(instance);

}());