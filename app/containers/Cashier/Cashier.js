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

import QRAddress21 from '../../components/QRAddress21';
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
    this.toggleCryptoType = this.toggleCryptoType.bind(this);
    this.state = {
      jsonData: null,
      cryptoType: 'BCH',
      fiatType: 'CAD',
      fiatAmount: 0,
      cryptoAmount: 0,
      cryptoPrice: 0
    }
  }

  componentDidMount() {
    this.updatePrices();
    setInterval(() => {
      this.updatePrices();
    }, 600000);
  }

  calculateCryptoAmount() {
    let cryptoAmount = this.state.fiatAmount / this.state.cryptoPrice;
    if (this.state.cryptoPrice * cryptoAmount === this.state.fiatAmount) {
      this.setState({ cryptoAmount: cryptoAmount });
    }
  }

  handleClick(event) {
    let payAmount = parseFloat(event.target.value);
    console.log(payAmount);
    if (typeof payAmount !== "number" || payAmount === 0) {
      this.setState({ fiatAmount: 0 }, async() => {
        await this.calculateCryptoAmount();
      });
    }
    this.setState({ fiatAmount: payAmount }, async() => {
      await this.calculateCryptoAmount();
    });
  }

  sendSocketIO(msg) {
    console.log(msg);
    socket.emit('event', msg);
  }

  toggleCryptoType(e) {
    console.log(e.target.value);
    const jsonData = this.state.jsonData;
    switch(e.target.value) {
      case 'BTC':
        this.setState({ cryptoType: 'BTC', cryptoPrice: jsonData.BTC.CAD}, async() => {
          await this.calculateCryptoAmount();
        });
        break;
      case 'BCH':
        this.setState({ cryptoType: 'BCH', cryptoPrice: jsonData.BCH.CAD}, async() => {
          await this.calculateCryptoAmount();
        });
        break;
      case 'ETH':
        this.setState({ cryptoType: 'ETH', cryptoPrice: jsonData.ETH.CAD}, async() => {
          await this.calculateCryptoAmount();
        });
        break;
      default:
        console.log('nothing');
    }
  }

  updatePrices() {
    axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BCH,BTC,ETH&tsyms=USD,EUR,CAD&api_key={${api_key}}`)
      .then((res) => {
        this.setState({ jsonData: res.data }, async() => {
          console.log(this.state.jsonData);
        });
      });
  }

  render() {
    let options = {
      amount: this.state.cryptoAmount,
      label: '#BitcoinBay',
    };
    let XPubAddress = BITBOX.Address.fromXPub(XPubKey, "1");
    let payQRAddress21 = BITBOX.BitcoinCash.encodeBIP21(XPubAddress, options);

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
          <QRAddress21 value={payQRAddress21}/>
          <select value={this.state.cryptoType} onChange={this.toggleCryptoType}>
            <option value="BTC">BTC</option>
            <option value="BCH">BCH</option>
            <option value="ETH">ETH</option>
          </select>
          <select value={this.state.cryptoType} onChange={this.toggleCryptoType}>
            <option value="USD">USD</option>
            <option value="CAD">CAD</option>
            <option value="EUR">EUR</option>
          </select>
          <input type="text" onChange={(e) => {this.handleClick(e)}} defaultValue={1} />
          <button onClick={this.updatePrices}>Update Price</button>
          <button type="button" onClick={() => this.sendSocketIO([this.state.cryptoType, this.state.fiatType, this.state.cryptoAmount, this.state.fiatAmount, this.state.cryptoPrice, payQRAddress21])}>
            Pay Now
          </button>
          <p>$ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</p>
          <p>{this.state.cryptoAmount} {this.state.cryptoType}</p>
          <p>$ {this.state.fiatAmount} {this.state.fiatType}</p>
        </div>
      </div>
    );
  }
}
