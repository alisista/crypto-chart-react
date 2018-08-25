"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _chart = require("chart.js");

var _chart2 = _interopRequireDefault(_chart);

require("whatwg-fetch");

var _momentTimezone = require("moment-timezone");

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_momentTimezone2.default.locale('ja');

var Chart = function (_Component) {
  _inherits(Chart, _Component);

  function Chart(props) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, props));

    _this.state = {
      width: props.width,
      height: props.height,
      fsym: props.fsym || "ALIS",
      tsym: props.tsym || "JPY",
      span: props.span || "day"
    };
    _this.init = false;
    console.log(_this.state);
    return _this;
  }

  _createClass(Chart, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getData();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      var _this2 = this;

      var state = {};
      var changed = false;
      var resized = false;
      var _arr = ["fsym", "tsym", "span"];
      for (var _i = 0; _i < _arr.length; _i++) {
        var v = _arr[_i];
        if (this.props[v] !== props[v]) {
          state[v] = props[v];
          changed = true;
        }
      }
      var _arr2 = ["width", "height"];
      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var _v = _arr2[_i2];
        if (this.props[_v] !== props[_v]) {
          state[_v] = props[_v];
          resized = true;
        }
      }
      if (changed || resized) {
        this.setState(state, function () {
          if (_this2.init) {
            if (changed) {
              _this2.getData();
            } else {
              _this2.draw();
            }
          }
        });
      }
    }
  }, {
    key: "getData",
    value: function getData() {
      var _this3 = this;

      var fsym = this.state.fsym;
      var tsym = this.state.tsym;
      var span = this.state.span;
      var spans = {
        day: { limit: 288, aggregate: 5, unit: "minute" },
        week: { limit: 168, aggregate: 1, unit: "hour" },
        month: { limit: 240, aggregate: 6, unit: "hour" },
        "3month": { limit: 180, aggregate: 12, unit: "hour" },
        year: { limit: 365, aggregate: 1, unit: "day" },
        all: { limit: 400, aggregate: 7, unit: "day" }
      };
      var conf = spans[span];
      var url = "https://min-api.cryptocompare.com/data/histo" + conf.unit + "?fsym=" + fsym + "&tsym=" + tsym + "&limit=" + conf.limit + "&aggregate=" + conf.aggregate;
      fetch(url).then(function (res) {
        return res.json();
      }).then(function (json) {
        if (json.Type != undefined && json.Type !== 1) {
          _this3.setState({ data: json, span: span }, function () {
            _this3.draw();
          });
        } else {
          _this3.setState({ noData: true });
        }
      }).catch(function (e) {
        _this3.setState({ noData: true });
      });
    }
  }, {
    key: "draw",
    value: function draw() {
      var span = this.state.span;
      var data = this.state.data;
      var id = this.props.id || 'crypto-chart';
      var ctx = document.getElementById(this.props.id);
      var dd = [];
      var lbs = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data.Data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          dd.push(v.close);
          lbs.push(v.time * 1000);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      try {
        this.myChart.destroy();
      } catch (e) {}

      var tunit = "hour";
      if (["month", "week"].includes(span)) {
        tunit = "day";
      } else if (["year", "3month"].includes(span)) {
        tunit = "month";
      } else if (span === "all") {
        tunit = "year";
      }
      this.myChart = new _chart2.default(ctx, {
        type: "line",
        data: {
          labels: lbs,
          datasets: [{
            data: dd,
            borderColor: "#3e95cd"
          }]
        },
        options: {
          elements: {
            point: { radius: 0 }
          },
          legend: {
            display: false
          },
          title: {
            display: false
          },
          scales: {
            xAxes: [{
              type: "time",
              time: {
                unit: tunit,
                displayFormats: {
                  hour: "H\u6642",
                  day: "D\u65E5",
                  month: "M\u6708"
                }
              }
            }]
          }
        }
      });
      this.init = true;
    }
  }, {
    key: "render",
    value: function render() {
      var id = this.props.id || 'crypto-chart';
      var canvas = void 0;
      if (this.state.noData) {
        canvas = _react2.default.createElement(
          "div",
          { style: { height: "100%", width: "100%" } },
          _react2.default.createElement(
            "div",
            { style: { marginTop: this.state.height * 0.4 } },
            "$",
            this.state.fsym,
            "\u306E\u30C7\u30FC\u30BF\u306F\u3042\u308A\u307E\u305B\u3093\u3002"
          )
        );
      } else {
        canvas = _react2.default.createElement("canvas", { id: id, width: this.state.width, height: this.state.height });
      }
      return _react2.default.createElement(
        "div",
        { id: id + "-wrap", style: { display: 'inline-block', width: this.state.width, height: this.state.height } },
        canvas
      );
    }
  }]);

  return Chart;
}(_react.Component);

exports.default = Chart;