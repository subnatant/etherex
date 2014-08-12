/* etherex.js -- EtherEx frontend
 *
 * Copyright (c) 2014 EtherEx
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

(function($) {

  EtherEx = {};

  EtherEx.btc = {
    "address": "...",
    "public": "..."
  };

  EtherEx.coinbase = "0x3f2af2a311132b3730328a7b30db1025cd8579c3";

  EtherEx.addresses = {
    namereg: ["0xf298931b974dfb01b13e44eae9e4428afa3ba7f4", "0x50441127ea5b9dfd835a9aba4e1dc9c1257b58ca"], // "8b01a7e2317fbb6d8096bb667d0604ce898aeaf8"
    trades: "0x54d1b757675b6f42d59ccc7c6d1c947536447f7d",
    markets: "0xad4665d4ffc60f0ea22a0f99dfc0988ce4b2c968"
  };

  EtherEx.init = [
    "0xac873234d24964d3ef3ded0aa77493b40e5e5cf5",
    "0x1e2130bab79f92547f446969328a8c95721a2e2c",
    "0x8b01a7e2317fbb6d8096bb667d0604ce898aeaf8",
    "0xffabe02d3ef93ee947dd534e032812a41a109555"
  ];

  EtherEx.markets = [
    {}, // Reserve markets[0] to ETH
    // {
    //   name: "XETH",
    //   address: "0xdebd115297dbabd326ec3b1615a428b9ae090b9f",
    //   minamount: Ethereum.BigInteger("10").pow(18),
    //   minprice: Ethereum.BigInteger("10").pow(8),
    // }
  ];

  EtherEx.units = {
    "Uether": Ethereum.BigInteger("1000000000000000000000000000000000000000000000000000000"),
    "Vether": Ethereum.BigInteger("1000000000000000000000000000000000000000000000000000"),
    "Dether": Ethereum.BigInteger("1000000000000000000000000000000000000000000000000"),
    "Nether": Ethereum.BigInteger("1000000000000000000000000000000000000000000000"),
    "Yether": Ethereum.BigInteger("1000000000000000000000000000000000000000000"),
    "Zether": Ethereum.BigInteger("1000000000000000000000000000000000000000"),
    "Eether": Ethereum.BigInteger("1000000000000000000000000000000000000"),
    "Pether": Ethereum.BigInteger("1000000000000000000000000000000000"),
    "Tether": Ethereum.BigInteger("1000000000000000000000000000000"),
    "Gether": Ethereum.BigInteger("1000000000000000000000000000"),
    "Mether": Ethereum.BigInteger("1000000000000000000000000"),
    "Kether": Ethereum.BigInteger("1000000000000000000000"),
    "ether" : Ethereum.BigInteger("1000000000000000000"),
    "finney": Ethereum.BigInteger("1000000000000000"),
    "szabo" : Ethereum.BigInteger("1000000000000"),
    "Gwei"  : Ethereum.BigInteger("1000000000"),
    "Mwei"  : Ethereum.BigInteger("1000000"),
    "Kwei"  : Ethereum.BigInteger("1000"),
    "wei"   : Ethereum.BigInteger("1")
  };

  EtherEx.formatBalance = function(_b) {
    if (_b > EtherEx.units[0] * 10000)
      return (_b / EtherEx.units[0]).toFixed(2) + " " + Object.keys(EtherEx.units)[0];
    for (i in EtherEx.units) {
      if (EtherEx.units[i] != 1 && _b >= EtherEx.units[i] * 100) {
        return ((_b / (EtherEx.units[i] / 1000)) / 1000).toFixed(2) + " " + i
      }
    }
    return parseFloat(_b).toFixed(2) + " wei";
  };

  EtherEx.loadMarkets = function() {
    var last = eth.stateAt(EtherEx.addresses.markets, String(18)).dec();
    for (var i = 100; i <= 100 + parseInt(last); i = i + 5) {
      var id = eth.stateAt(EtherEx.addresses.markets, String(i+4)).dec();
      EtherEx.markets[id] = {
        name: eth.stateAt(EtherEx.addresses.markets, String(i)).bin(),
        address: eth.stateAt(EtherEx.addresses.markets, String(i+3)),
        minamount: eth.stateAt(EtherEx.addresses.markets, String(i+1)).dec(),
        minprice: eth.stateAt(EtherEx.addresses.markets, String(i+2)).dec(),
      };
    };
    // console.log(EtherEx.markets);
  };

  EtherEx.getAddress = function(_a) {
    ret = "";
    for (var i in EtherEx.addresses.namereg) {
      ret = eth.stateAt(EtherEx.addresses.namereg[i], _a).substr(2);
      if (ret.length == 40)
        return ret;
    }
    return ret;
  };

  EtherEx.getName = function(_a) {
    ret = "";
    for (var i in EtherEx.addresses.namereg) {
      ret = eth.stateAt(EtherEx.addresses.namereg[i], "0x" + _a).bin().unpad();
      if (ret.length > 0)
        return ret;
    }
    return ret;
  };

  EtherEx.create = function() {
    eth.create(
      eth.key,
      $("#endowment").val(),
      $("#code").val(),
      $("#gas").val(),
      eth.gasPrice
    );
  };

  EtherEx.transact = function(to, gas, value, data) {
    // console.log(data);
    var adata = data.split(" ");
    var pdata = "";
    for (var i in adata)
      pdata += String(adata[i]).pad(32)
    eth.transact(
      eth.key,
      String(value),
      "0x" + to,
      pdata,
      String(gas),
      eth.gasPrice
    );
  };

  EtherEx.txdata = function(op, market) {
    var data = String(op).pad(32);
    data += String(Ethereum.BigInteger(document.getElementById("amount").value).multiply(Ethereum.BigInteger("10").pow(18))).pad(32);
    data += String(Ethereum.BigInteger(document.getElementById("price").value).multiply(Ethereum.BigInteger("10").pow(8))).pad(32);
    data += String(market).pad(32);
    return data;
  };

  EtherEx.sendETH = function() {
    eth.transact(
      eth.key,
      String(Ethereum.BigInteger($("#value").val()).multiply(Ethereum.BigInteger("10").pow(18))),
      "0x" + $("#to").val(),
      "",
      "500",
      eth.gasPrice
    );
  };

  EtherEx.sendXETH = function() {
    eth.transact(
      eth.key,
      "0",
      EtherEx.markets[1].address,
      ("0x" + document.getElementById("to").value).pad(32) + document.getElementById("value").value.pad(32),
      "1000",
      eth.gasPrice
    );
  };

  EtherEx.check = function () {
    var data = EtherEx.txdata(1, 1);
    document.getElementById("checkval").innerHTML = "<p>" + data.unbin().substr(2) + "</p>";

    var pdata = "";
    var adata = $("#data").val().split(" ");
    for (var d in adata)
      pdata += String(adata[d]).pad(32)
    document.getElementById("checkval").innerHTML += "<p>" + pdata.unbin().substr(2) + "</p>";
  };

  EtherEx.clear = function () {
    document.getElementById("checkval").innerHTML = "";
    document.getElementById("log").innerHTML = "";
  };

  EtherEx.buy = function() {
    var data = EtherEx.txdata(1, 1);

    eth.transact(
      eth.key,
      "0",
      EtherEx.coinbase,
      data,
      "10000",
      eth.gasPrice,
      EtherEx.updateBalances
    );
  };

  EtherEx.sell = function() {
    var data = EtherEx.txdata(2, 1);

    eth.transact(
      eth.key,
      String(Ethereum.BigInteger(document.getElementById("amount").value).multiply(Ethereum.BigInteger("10").pow(18))),
      EtherEx.coinbase,
      data,
      "10000",
      eth.gasPrice,
      EtherEx.updateBalances
    );
  };

  EtherEx.getOrderbook = function() {
    var startkey = 100;
    var lastkey = eth.stateAt(EtherEx.addresses.trades, "18").dec();

    document.getElementById("last").innerHTML = lastkey;
    // console.log(lastkey);

    var table = "<table><tr><th class='book'>Buy</th><th class='book'>Sell</th></tr>";

    var check = 0;
    var booklength = lastkey / 5;
    var length = startkey + parseInt(lastkey);

    for (var i = startkey; i < length; i = i + 5) {
      var value = eth.stateAt(EtherEx.addresses.trades, String(i)).dec();

      if (value) {
        var type = eth.stateAt(EtherEx.addresses.trades, String(i)).dec();
        var price = Ethereum.BigInteger(eth.stateAt(EtherEx.addresses.trades, String(i+1)).dec()) / Math.pow(10, 8);
        var market = eth.stateAt(EtherEx.addresses.trades, String(i+4)).dec();
        var strprice = price + " ETH/" + EtherEx.markets[market].name;
        var amount = eth.stateAt(EtherEx.addresses.trades, String(i+2)).dec();
        var stramount = EtherEx.formatBalance(amount) + "<br />@ ";
        var owner = eth.stateAt(EtherEx.addresses.trades, String(i+3)).substr(2);
        var strowner = '<br />by <span class="address">' + owner + '</span>';
        var cancel = (owner == eth.coinbase.substr(2)) ? '<br /><button class="cancel" data-id="' + i + '" id="trade-'+ i +'">cancel</button>' : '';
        // var buy = 

        if (price) {
          table += "<tr>\
                <td class='book'>" + ((type == 1) ? stramount + strprice + strowner + cancel : '') + "</td>\
                <td class='book'>" + ((type == 2) ? stramount + strprice + strowner + cancel : '') + "</td>\
            </tr>";
          document.getElementById("lastprice").innerHTML = price;
          // document.getElementById("price").value = price;
        };
        // if (amount) {
        //   document.getElementById("amount").value = amount;
        // };
      };
    };
    table += "</table>";
    document.getElementById('book').innerHTML = table;

    $(".cancel").on('click', function() {
      var tradeid = $(this).data('id');
      // $('#log').append(';'+tradeid+';');
      if (window.confirm("Cancel trade # " + tradeid + " ?")) {
        eth.transact(
          eth.key,
          "0",
          EtherEx.coinbase,
          String(6).pad(32) + String(tradeid).pad(32),
          "10000",
          eth.gasPrice,
          EtherEx.updateBalances
        );
      }
    });
  };

  EtherEx.showError = function(e) {
    var err = $('<a class="error" href="#"><i class="icon-cancel" title="Error - try reloading"></i></a>');
    err.on('click', function() {
      location.reload(true);
    })
    $("#page h2").eq(0).append(err);
    $('#log').append(String(e) + "<br />");
  };

  EtherEx.btcBalances = function(keys) {
    // document.getElementById("log").innerHTML = keys.length;
    $("#addressbook > table > tbody tr.btc").remove();

    for (var i = keys.length - 1; i >= 0; i--) {
      var key = keys[i];
      // console.log(key);
      // $("#log").append(i + "...");
      $.get("https://api.blockcypher.com/v1/btc/main/addrs/" + key.address, function (info) {
        // $("#log").append(i + ";");
        // console.log(info);
        var entry = $('<tr class="btc"><td><div><span class="address">' + key.address + "</span></div></td><td>" + info.final_balance / 100000000  + " BTC</td></tr>");
        $("#addressbook > table > tbody").append(entry);
      });
      // .fail( function() {
      //   var entry = $('<tr><td><div><span class="address">' + key.address + "</span></div></td><td>0 BTC</td></tr>");
      //   $("#addressbook > table > tbody").append(entry);
      // });
    };
  }

  EtherEx.transactions = function(addrs) {
    var confirmed = 0;
    var unconfirmed = 0;
    addrs.forEach(
      function(x) {
        confirmed -=- eth.balanceAt(x, -1).dec();
        unconfirmed -=- eth.balanceAt(x).dec();
      }
    );

    document.getElementById('eth').innerHTML = (unconfirmed > confirmed ? EtherEx.formatBalance(confirmed) + "<br /><sup>(" + EtherEx.formatBalance(unconfirmed - confirmed) + " unconfirmed)</sup>" : EtherEx.formatBalance(unconfirmed));

    var latest = eth.messages({latest: -1});

    var lh = $("#latest").html("");
    var s = latest.length - 1;

    for (i in latest)
    {
      var l = latest[s - i];
      var ours = (addrs.indexOf(l.from) != -1 || addrs.indexOf(l.to) != -1)
      if (l.to != "".pad(20).unbin() && ours)
      {
        var dest = wesent ? l.to : l.input.bin().substr(12, 20).unbin();
        // $("#log").append("<br />" + dest);
        var wegot = addrs.indexOf(dest) != -1;
        var wesent = addrs.indexOf(l.from) != -1;

        var sub = false;
        $(EtherEx.markets).each( function(i, market) {
          if (l.to == market.address) {
            var length = market.name.length - 4;
            sub = market.name.substr(0, length);
          }
        });

        lh.append('<li>' +
          '<span class="timestamp" title="' + new Date(l.timestamp * 1000).toLocaleString() + '">' + new Date(l.timestamp * 1000).toLocaleTimeString() + "</span>" +
          (wesent ? wegot ? '<span class="xfer"><span class="name">XFER' : '<span class="out"><span class="name">OUT' : '<span class="in"><span class="name">IN') + '</span>' +
          '<span class="value">' + (sub ? l.input.bin().substr(32, 32).dec() + ' ' + sub : (l.value ? EtherEx.formatBalance(l.value.dec()) : '')) + '</span>' +
          '' + (!wesent ? '<span class="from address"><span class="ind">&lt;</span>' + l.from + '</span>' : !wegot ? '<span class="to address"><span class="ind">&gt;</span>' + (sub ? dest : l.to) + '</span>' : "") + '</span>' +
          (l.age ? l.age < 6 ?
            '<span class="confirms">' + l.age + ' CONFIRMATIONS</span>' : "" :
            '<span class="unconfirmed">UNCONFIRMED</span>'
          ) +
        '</li>');
      }
    }
  };

  EtherEx.addrs = eth.keys.map(function (k) { return eth.secretToAddress(k); });

  EtherEx.updateBalances = function() {

    try {
      // Cleanup
      $(".error").remove();
      $("#addressbook > table > tbody tr").remove();

      EtherEx.loadMarkets();

      // document.getElementById("eth").innerHTML = EtherEx.formatBalance(eth.balanceAt(eth.coinbase).dec()); // Ethereum.BigInteger(eth.balanceAt(eth.coinbase).dec()).divide(Ethereum.BigInteger("10").pow(18));

      document.getElementById("xeth").innerHTML = eth.stateAt(EtherEx.markets[1].address, EtherEx.addrs[0]).dec();

      document.getElementById("tot").innerHTML = eth.balanceAt(EtherEx.coinbase).dec();

      for (var i = EtherEx.addrs.length - 1; i >= 0; i--) {
        var addr = EtherEx.addrs[i]; // eth.secretToAddress(eth.keys[i]);
        var bal = Ethereum.BigInteger(eth.balanceAt(addr).dec()).divide(Ethereum.BigInteger("10").pow(18));
        var entry = $('<tr><td><div><span class="address">' + addr.substr(2) + "</span></div></td><td>" + bal + " ETH</td></tr>");

        $("#addressbook > table > tbody").append(entry);

        try {
          for (var m = EtherEx.markets.length - 1; m >= 1; m--) {
            var subbal = eth.stateAt(EtherEx.markets[m].address, addr).dec();
            var length = EtherEx.markets[m].name.length - 4;
            var subentry = $('<tr><td class="sub">+ ' + '</td><td><span class="address">' + subbal + "</span> " + EtherEx.markets[m].name.substr(0, length) + "</td></tr>");

            $("#addressbook > table > tbody").append(subentry);
          };
        }
        catch (e) {
          EtherEx.showError(e);
        }
      };

      // BTC wallet
      // localStorage.removeItem("etherex_btckeys");
      // sessionStorage.removeItem("etherex_btckeys");
      var btckeys = sessionStorage.getItem("etherex_btckeys");
      // console.log(btckeys);
      if (typeof(btckeys) === "undefined" || btckeys == null) {
        // TODO Create multisigaddress - http://dev.blockcypher.com/#multisig
        var btckeys = [];
        $.post("https://api.blockcypher.com/v1/btc/main/addrs", function (key) {
          // console.log(key);
          btckeys.push(key);
          sessionStorage.setItem("etherex_btckeys", JSON.stringify(btckeys));
          EtherEx.btcBalances(btckeys);
        });
      }
      else {
        btckeys = JSON.parse(btckeys);
        EtherEx.btcBalances(btckeys);
      }

      EtherEx.getOrderbook();

      EtherEx.transactions(EtherEx.addrs);
    }
    catch (e) {
      EtherEx.showError(e);
    }
  };


  $(document).ready(function() {

    if (!ethBrowser) {
      window.eth.stateAt = window.eth.storageAt;
      window.eth.messages = function() { return {}; };

      EtherEx.loadMarkets();

      eth.watch(eth.coinbase, "", EtherEx.updateBalances);

      // for (var i = EtherEx.markets.length - 1; i >= 1; i--)
      //   eth.watch(EtherEx.markets[i].address, eth.coinbase, EtherEx.updateBalances);
    }
    else {
      var addrs = [];
      for (var i = eth.keys.length - 1; i >= 0; i--)
        addrs.push(eth.secretToAddress(eth.keys[i]));

      addrs.push(eth.coinbase);

      EtherEx.loadMarkets();

      for (var i = EtherEx.markets.length - 1; i >= 1; i--)
        addrs.push(EtherEx.markets[i].address);

      eth.watch({altered: addrs}).changed(EtherEx.updateBalances);
    }

    // var graph = new Rickshaw.Graph( {
    //   element: document.querySelector("#chart"),
    //   series: [{
    //     color: 'lightblue',
    //     data: [
    //       { x: 0, y: 40 },
    //       { x: 1, y: 49 },
    //       { x: 2, y: 38 },
    //       { x: 3, y: 30 },
    //       { x: 4, y: 32 } ]
    //   }]
    // });
    
    // graph.setRenderer('line');

    // var axes = new Rickshaw.Graph.Axis.Time( { graph: graph } );

    // graph.render();

    $("#tabs").tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );

    $("#check").on('click', function() {
      EtherEx.check();
    });

    $("#buy").on('click', function() {
      if (window.confirm("Buy " + $("#amount").val() + " ETH at " + $("#price").val() + " ETH/XETH ?")) {
        EtherEx.buy();
      }
    });

    $("#sell").on('click', function() {
      if (window.confirm("Sell " + $("#amount").val() + " ETH at " + $("#price").val() + " ETH/XETH ?")) {
        EtherEx.sell();
      }
    });

    $("#to,#tto").on('keyup', function(e) {
      this.addr = EtherEx.getAddress($(this).val());
      if (this.addr.length == 40)
        $(this).val(this.addr);

      this.namereg = EtherEx.getName($(this).val());
      if (this.namereg.length > 0) {
        $(this).css('color', 'rgba(0,0,0,.15)');
        $(this).next('span').html(this.namereg);
      }
      else {
        $(this).css('color', 'rgba(0,0,0)');
        $(this).next('span').html("");
      }
    });
    $("#to,#tto").on('focus', function() {
      $(this).css('color', 'rgba(0,0,0)');
      $(this).next('span').html("");
    });

    $("#toname").on('click', function() {
      $("#to").focus();
    });

    $("#addr").on('keyup', function(e) {
      this.namereg = EtherEx.getName($(this).val());
      if (this.namereg.length > 0)
        $("#addrResult").html(this.namereg);
      else
        $("#addrResult").html("");
    });

    $("#sendeth").on('click', function() {
      if ($("#to").val() == "") {
        alert("Please provide a recipient address.");
        return;
      }
      if (window.confirm("Send " + $("#value").val() + " ETH to " + $("#to").val() + " ?")) {
        EtherEx.sendETH();
      }
    });

    $("#sendxeth").on('click', function() {
      if ($("#to").val() == "") {
        alert("Please provide a recipient address.");
        return;
      }
      if (window.confirm("Send " + $("#value").val() + " XETH to " + $("#to").val() + " ?")) {
        EtherEx.sendXETH();
      }
    });

    $("#create").on('click', function() {
      if ($("#code").val() == "") {
        alert("Please provide the compiled contract code.");
        return;
      }
      if (window.confirm("Create contract with " + $("#gas").val() + " gas?")) {
        EtherEx.create();
      }
    });

    $("#transact").on('click', function() {
      if (window.confirm("Make transaction with " + $("#tgas").val() + " gas?")) {
        EtherEx.transact(
          $("#tto").val(),
          $("#tgas").val(),
          $('#tval').val(),
          $('#data').val()
          // EtherEx.coinbase.pad(32)
          // EtherEx.init[0].pad(32) + EtherEx.init[1].pad(32) + EtherEx.init[2].pad(32) + EtherEx.init[3].pad(32)
        );
      }
    });

    $("#refresh, #clear").on('click', function() {
      EtherEx.clear();
      EtherEx.updateBalances();
    });

    // EtherEx.updateBalances();
    $("#to").trigger('keyup');
  });

})(jQuery);