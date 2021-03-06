/** @jsx React.DOM */

var React = require("react");
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);

var TradeForm = require("./TradeForm");
var TradeList = require("./TradeList");
var GraphPrice = require('./GraphPriceTechan');

var Trades = React.createClass({
  mixins: [FluxMixin],

  getInitialState: function () {
    return {
      showGraph: false
    };
  },

  onToggleGraph: function() {
      this.setState({ showGraph: !this.state.showGraph });
  },

  render: function() {
    this.props.user.user.own = false;
    return (
      <div>
        {!this.props.market.error && this.state.showGraph &&
          <GraphPrice market={this.props.market} height={320} full={false} />}
        {!this.props.market.error &&
          <TradeForm market={this.props.market} trades={this.props.trades} user={this.props.user} />}
        {!this.props.market.error &&
          <TradeList market={this.props.market} trades={this.props.trades} user={this.props.user} />}
      </div>
    );
  }

});

module.exports = Trades;
