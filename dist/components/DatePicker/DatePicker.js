"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
var common_1 = require('@angular/common');
var DatePickerCalendar_1 = require("./DatePickerCalendar");
var InfiniteScroller_1 = require("../InfiniteScroller/InfiniteScroller");
var DetectionUtils_1 = require("../../utilities/DetectionUtils");
var DatePicker = (function () {
    function DatePicker(changeDetector) {
        this._minDate = new Date(1900, 0, 1);
        this._maxDate = new Date(2200, 0, 1);
        this.valueChange = new core_2.EventEmitter();
        this._inputDate = "";
        this.calendarDisplayed = false;
        this.calendarX = 1;
        this.calendarY = 1;
        this.calendarHeight = DetectionUtils_1.MobileDetection.isAny() || window.innerWidth <= 480 || window.outerWidth <= 480 ? "auto" : "300px";
        this.calendarMonths = [];
        this._preGenMonths = 2;
        this.changeDetector = changeDetector;
        var currentDate = this.selectedDate != null ? this.selectedDate : new Date();
        this.calendarMonths = [
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
            new Date(currentDate.getFullYear(), currentDate.getMonth())
        ];
        for (var i = 0; i < this._preGenMonths; i++) {
            var earliestDate = this.calendarMonths[0];
            var latestDate = this.calendarMonths[this.calendarMonths.length - 1];
            if (this.canPrevMonth)
                this.calendarMonths.unshift(new Date(earliestDate.getFullYear(), earliestDate.getMonth() - 1));
            if (this.canNextMonth)
                this.calendarMonths.push(new Date(latestDate.getFullYear(), latestDate.getMonth() + 1));
        }
    }
    Object.defineProperty(DatePicker.prototype, "minDate", {
        get: function () { return this._minDate; },
        set: function (value) {
            this._minDate = this.handleDateInput(value);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(DatePicker.prototype, "maxDate", {
        get: function () { return this._maxDate; },
        set: function (value) {
            this._maxDate = this.handleDateInput(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "value", {
        set: function (value) {
            this._selectedDate = this.handleDateInput(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "selectedDate", {
        get: function () { return this._selectedDate; },
        set: function (value) {
            this._selectedDate = value;
            this._inputDate = value.toLocaleDateString();
            this.valueChange.next(this.selectedDate);
            this.hideCalendar();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(DatePicker.prototype, "inputDate", {
        get: function () { return this._inputDate; },
        set: function (value) {
            this._inputDate = value;
            this._selectedDate = new Date(value);
        },
        enumerable: true,
        configurable: true
    });
    ;
    DatePicker.prototype.ngOnInit = function () {
        var _this = this;
        var currentDate = this.selectedDate != null ? this.selectedDate : new Date();
        setTimeout(function () {
            if (_this.calendarScroller == null)
                return;
            var scrollToMonth = _this.calendarMonths.findIndex(function (m) {
                return m.getFullYear() == currentDate.getFullYear()
                    && m.getMonth() == currentDate.getMonth();
            });
            _this.calendarScroller.container.scrollTop =
                _this.calendarScroller.itemQuery.toArray()[scrollToMonth].element.offsetTop - 20;
            _this.calendarScroller.scrollToIndex(scrollToMonth);
        }, 1);
    };
    DatePicker.prototype.handleDateInput = function (value) {
        if (value instanceof Date && !isNaN(value.valueOf()))
            return value;
        else
            return new Date(value);
    };
    DatePicker.prototype.toggleCalendar = function (event) {
        if (!this.calendarDisplayed)
            this.showCalendar(event);
        else
            this.hideCalendar();
    };
    DatePicker.prototype.showCalendar = function (event) {
        if (event != null) {
            var clickedRect = event.target ? event.target.parentElement.getBoundingClientRect() : event.srcElement.parentElement.getBoundingClientRect();
            this.calendarX = clickedRect.left;
            if (screen.height - clickedRect.bottom <= 500) {
                this.calendarY = (clickedRect.top);
            }
            else {
                this.calendarY = 0;
            }
        }
        this.ngOnInit();
        this.calendarDisplayed = true;
        this.changeDetector.markForCheck();
    };
    DatePicker.prototype.hideCalendar = function () {
        this.calendarDisplayed = false;
        this.changeDetector.markForCheck();
    };
    Object.defineProperty(DatePicker.prototype, "canPrevMonth", {
        get: function () {
            var currentDate = this.calendarMonths[0];
            var prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
            var compareDate = new Date(this._minDate.getFullYear(), this._minDate.getMonth());
            return prevDate >= compareDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "canNextMonth", {
        get: function () {
            var currentDate = this.calendarMonths[this.calendarMonths.length - 1];
            var nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
            var compareDate = new Date(this._maxDate.getFullYear(), this._maxDate.getMonth());
            return nextDate <= compareDate;
        },
        enumerable: true,
        configurable: true
    });
    DatePicker.prototype.disablePrev = function () {
        return this.calendarScroller ? this.calendarScroller.isTop() : false;
    };
    DatePicker.prototype.disableNext = function () {
        return this.calendarScroller ? this.calendarScroller.isBottom() : false;
    };
    DatePicker.prototype.scrollPrevMonth = function () {
        var _this = this;
        if (this.calendarScroller.topIndex == 0)
            this.addPrevMonth();
        setTimeout(function () {
            _this.calendarScroller.scrollToIndex(_this.calendarScroller.topIndex - 1);
        }, 10);
    };
    DatePicker.prototype.scrollNextMonth = function () {
        var _this = this;
        setTimeout(function () {
            _this.calendarScroller.scrollToIndex(_this.calendarScroller.topIndex + 1);
        }, 10);
    };
    DatePicker.prototype.addNextMonth = function () {
        if (!this.canNextMonth)
            return;
        var lastMonth = this.calendarMonths[this.calendarMonths.length - 1];
        var nextMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1);
        this.calendarMonths.push(nextMonth);
        this.changeDetector.markForCheck();
    };
    DatePicker.prototype.addPrevMonth = function () {
        if (!this.canPrevMonth)
            return;
        var firstMonth = this.calendarMonths[0];
        var prevMonth = new Date(firstMonth.getFullYear(), firstMonth.getMonth() - 1);
        this.calendarMonths.unshift(prevMonth);
        this.changeDetector.markForCheck();
    };
    __decorate([
        core_2.Input(), 
        __metadata('design:type', String)
    ], DatePicker.prototype, "label", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], DatePicker.prototype, "minDate", null);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], DatePicker.prototype, "maxDate", null);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Function)
    ], DatePicker.prototype, "dateFilter", void 0);
    __decorate([
        core_2.Output(), 
        __metadata('design:type', Object)
    ], DatePicker.prototype, "valueChange", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], DatePicker.prototype, "value", null);
    __decorate([
        core_2.ViewChild(InfiniteScroller_1.InfiniteScroller), 
        __metadata('design:type', InfiniteScroller_1.InfiniteScroller)
    ], DatePicker.prototype, "calendarScroller", void 0);
    DatePicker = __decorate([
        core_1.Component({
            selector: "date-picker",
            styles: ["\n      .date-picker-overlay {\n        background-color: transparent;\n        display: block;\n        position: fixed;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        left: 0;\n        z-index: 100; }\n        @media (max-width: 480px), screen and (max-device-width: 480px) {\n          .date-picker-overlay {\n            background-color: #55595c;\n            opacity: .75; } }\n\n      .fuel-ui-datepicker-input-group input:read-only, .fuel-ui-datepicker-input-group .form-control[readonly] {\n        background-color: #fff; }\n\n      .fuel-ui-datepicker-input-group .input-group-addon {\n        background-color: #fff; }\n\n      .date-picker-component {\n        border: 1px solid #eceeef;\n        z-index: 120;\n        background-color: #fff;\n        font-size: .75rem;\n        position: absolute;\n        width: 350px;\n        height: auto;\n        top: 0;\n        left: 0;\n        overflow: hidden;\n        border-radius: 0.3rem;\n        -webkit-transition: all 0.1s ease;\n        -moz-transition: all 0.1s ease;\n        transition: all 0.1s ease; }\n        @media (max-width: 480px), screen and (max-device-width: 480px) {\n          .date-picker-component {\n            width: 90%;\n            height: 90%;\n            position: fixed;\n            top: 5%;\n            left: 5%; } }\n        .date-picker-component .input-group {\n          z-index: 110; }\n        .date-picker-component .container {\n          height: 100%; }\n          @media (max-width: 480px), screen and (max-device-width: 480px) {\n            .date-picker-component .container .calendar-container {\n              height: 91%; } }\n          .date-picker-component .container header {\n            position: relative;\n            top: 0;\n            left: 0;\n            vertical-align: middle;\n            background-color: #fff; }\n            .date-picker-component .container header .days-of-week {\n              background-color: #0275d8;\n              color: #fff; }\n            .date-picker-component .container header table {\n              border-top: none !important; }\n              .date-picker-component .container header table th, .date-picker-component .container header table td {\n                text-align: center; }\n            .date-picker-component .container header button {\n              border: none;\n              border-radius: 0;\n              color: #0275d8;\n              background-color: #fff;\n              width: 15%; }\n              .date-picker-component .container header button:active {\n                background-color: #eceeef; }\n              .date-picker-component .container header button.button-disable {\n                color: #eceeef;\n                cursor: default; }\n            .date-picker-component .container header .date-range {\n              width: 70%; }\n              .date-picker-component .container header .date-range span {\n                background-color: #eceeef;\n                border-left: none;\n                border-right: none; }\n            .date-picker-component .container header .input-group-addon {\n              border: none;\n              background-color: #fff !important; }\n            .date-picker-component .container header input {\n              border: none;\n              display: inline-block;\n              margin: 1px auto 0 auto;\n              cursor: pointer; }\n            .date-picker-component .container header input:read-only, .date-picker-component .container header .form-control[readonly] {\n              background-color: #fff; }\n            .date-picker-component .container header input.target {\n              color: #0275d8; }\n              .date-picker-component .container header input.target::-webkit-input-placeholder {\n                color: #0275d8; }\n              .date-picker-component .container header input.target::-moz-placeholder {\n                color: #0275d8; }\n              .date-picker-component .container header input.target:-moz-placeholder {\n                color: #0275d8; }\n              .date-picker-component .container header input.target:-ms-input-placeholder {\n                color: #0275d8; }\n    "],
            template: "\n      <div class=\"input-group fuel-ui-datepicker-input-group\" (click)=\"toggleCalendar($event)\">\n        <input type=\"text\" class=\"form-control\"\n          [(ngModel)]=\"inputDate\" #dateField readonly\n              placeholder=\"{{label}}\" />\n        <span class=\"input-group-addon\" [class.input-group-addon-focus]=\"dateField.focus\">\n            <i class=\"fa fa-calendar\"></i>\n        </span>\n      </div>\n\n      <div class=\"date-picker-overlay\" aria-hidden=\"true\"\n          *ngIf=\"calendarDisplayed\" \n          (click)=\"hideCalendar()\">\n      </div>\n\n      <div class=\"date-picker-component\" *ngIf=\"calendarDisplayed\">\n          <div class=\"container p-a-0\">\n              <header>\n                  <button type=\"button\" class=\"btn btn-secondary pull-left\"\n                      (click)=\"scrollPrevMonth()\" [class.button-disable]=\"disablePrev()\">\n                      <i class=\"fa fa-chevron-left\"></i>\n                  </button>\n                  <div class=\"date-range pull-left input-group\">\n                      <input type=\"text\" class=\"form-control text-xs-center\" \n                          id=\"startDate\" [(ngModel)]=\"inputDate\" readonly />\n                  </div>\n                  <button type=\"button\" class=\"btn btn-secondary pull-right\"\n                      (click)=\"scrollNextMonth()\" [class.button-disable]=\"disableNext()\">\n                      <i class=\"fa fa-chevron-right\"></i>\n                  </button>\n                  <table class=\"table m-b-0 days-of-week\">\n                      <tbody>\n                      <tr>\n                          <th>S</th>\n                          <th>M</th>\n                          <th>T</th>\n                          <th>W</th>\n                          <th>T</th>\n                          <th>F</th>\n                          <th>S</th>\n                      </tr>\n                      </tbody>\n                  </table>\n              </header>\n              <div class=\"calendar-container m-a-0\">\n                  <infinite-scroller\n                      (next)=\"addNextMonth()\"\n                      (prev)=\"addPrevMonth()\"\n                      distance=\"100\"\n                      [height]=\"calendarHeight\"\n                      [hideScrollbar]=\"true\">\n                      <date-picker-calendar scroll-item\n                          *ngFor=\"let month of calendarMonths; let i=index\" \n                          [id]=\"i\"\n                          [minDate]=\"minDate\" [maxDate]=\"maxDate\"\n                          [dateFilter]=\"dateFilter\"\n                          [currentMonth]=\"month\" \n                          [(selectedDate)]=\"selectedDate\">\n                          {{i}}\n                      </date-picker-calendar>\n                  </infinite-scroller>\n              </div>\n          </div>\n      </div>\n    ",
            directives: [DatePickerCalendar_1.DatePickerCalendar, InfiniteScroller_1.INFINITE_SCROLLER_PROVIDERS, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], DatePicker);
    return DatePicker;
}());
exports.DatePicker = DatePicker;

//# sourceMappingURL=DatePicker.js.map