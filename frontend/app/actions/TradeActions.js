var constants = require("../js/constants");
var utils = require("../js/utils");

var TradeActions = function(client) {

    this.loadTrades = function() {
        this.dispatch(constants.trade.LOAD_TRADES);

        var markets = this.flux.store("MarketStore").getState().markets;

        _client.loadTrades(this.flux, markets, function(trades) {
            this.dispatch(constants.trade.LOAD_TRADES_PROGRESS, trades);
        }.bind(this), function(trades) {
            this.dispatch(constants.trade.LOAD_TRADES_SUCCESS, trades);
        }.bind(this), function(error) {
            this.dispatch(constants.trade.LOAD_TRADES_FAIL, {error: error});
        }.bind(this));
    };

    this.addTrade = function(trade) {
        var id = utils.randomId();
        trade.id = id;
        trade.status = "new";

        _client.addTrade(trade, function() {
            this.dispatch(constants.trade.ADD_TRADE, trade);
        }.bind(this), function(error) {
            console.log(error);
        }.bind(this));
    };

    this.fillTrade = function(trade) {
        _client.fillTrade(trade, function() {
            this.dispatch(constants.trade.FILL_TRADE, trade);
        }.bind(this), function(error) {
            console.log(error);
        }.bind(this));
    };

    this.cancelTrade = function(trade) {
        _client.cancelTrade(trade, function() {
            this.dispatch(constants.trade.CANCEL_TRADE, trade);
        }.bind(this), function(error) {
            console.log(error);
        }.bind(this));
    };

    this.switchType = function(type) {
        this.dispatch(constants.trade.SWITCH_TYPE, type);
    };

    var _client = client;
};

module.exports = TradeActions;