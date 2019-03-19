/*
 * Cashier
 *
 * Cashier-facing Point of Sale page
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import openSocket from 'socket.io-client';
import * as BITBOXCli from "bitbox-sdk";
const BITBOX = new BITBOXCli.default({ restURL: "https://trest.bitcoin.com/v2/" });

import Bip21 from '../../components/Bip21';
import './style.scss';

const socket = openSocket('http://localhost:3000');
const api_key = '897a2b25ccd5730323919dee1201a832e5d2bb9835e6ded08dd4897f7669e8f7'
const XPubKey = "tpubDCoP9xnjhwkwC8pT7DVSPFDgbYb2uq2UAdY2DQmk2YtBpiEY8XGtT26P6NgYyc38fiuTF9x3MAtKmuUR2HPd7qKQmAYD5NTpfVy5SzZntWN";

export default class Cashier extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.updatePrices = this.updatePrices.bind(this);
    this.calculateCryptoAmount = this.calculateCryptoAmount.bind(this);
    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.state = {
      cryptoPrice: 0,
      fiatAmount: 0,
      cryptoAmount: 0,
      fiatType: 'CAD'
    }
  }

  componentDidMount() {
    this.updatePrices();
  }

  calculateCryptoAmount() {
    let cryptoAmount = this.state.fiatAmount / this.state.cryptoPrice;
    if (this.state.cryptoPrice * cryptoAmount === this.state.fiatAmount) {
      this.setState({ cryptoAmount: cryptoAmount });
    }
  }

  handleClick(event) {
    let payAmount = parseFloat(event.target.value);
    if (typeof payAmount !== "number" || payAmount === 0) {
      this.setState({ fiatAmount: 0 });
    }
    this.setState({ fiatAmount: payAmount });
    this.calculateCryptoAmount();
  }

  sendSocketIO(msg) {
    console.log(msg);
    socket.emit('event', msg);
  }

  updatePrices() {
    axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BCH,BTC,ETH,LTC&tsyms=${this.state.fiatType}&api_key={${api_key}}`)
      .then((res) => {
        //console.log(res.data.BCH.CAD);
        this.setState({ cryptoPrice: res.data.BCH.CAD});
      });
  }

  render() {
    let options = {
      amount: this.state.cryptoAmount,
      label: '#BitcoinBay',
    };
    let XPubAddress = BITBOX.Address.fromXPub(XPubKey, "14");
    let payBip21 = BITBOX.BitcoinCash.encodeBIP21(XPubAddress, options);

    return (
      <div className="feature-page">
        <Helmet>
          <title>Cashier Page</title>
          <meta
            name="description"
            content="Feature page of React.js Boilerplate application"
          />
        </Helmet>
        <div>
          <Bip21 value={payBip21}/>
          <input type="text" onChange={(e) => {this.handleClick(e)}} defaultValue={1} />
          <button onClick={this.updatePrices}>Update Price</button>
          <button type="button" onClick={() => this.sendSocketIO([this.state.fiatType, this.state.cryptoPrice, this.state.fiatAmount, this.state.cryptoAmount, payBip21])}>
            Pay Now
          </button>
          <p>{this.state.cryptoPrice}</p>
          <p>{this.state.cryptoAmount}</p>
          <p>{this.state.fiatAmount}</p>
        </div>
      </div>
    );
  }
}
