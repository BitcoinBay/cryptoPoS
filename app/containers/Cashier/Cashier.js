/*
 * Cashier
 *
 * Cashier-facing Point of Sale page
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import QRCode from 'qrcode-react';

import './style.scss';
const api_key = '897a2b25ccd5730323919dee1201a832e5d2bb9835e6ded08dd4897f7669e8f7'

export default class Cashier extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.updatePrices = this.updatePrices.bind(this);
    this.state = {
      cryptoPrice: 0,
      fiatAmount: 0,
      cryptoAmount: 0,
      fiatType: 'CAD'
    }
  }

  handleClick = (value) => {
    if (typeof value !== number || value === 0) {
      return;
    }
    this.setState({ fiatAmount: value });
  }

  updatePrices = () => {
    axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BCH,BTC,ETH,LTC&tsyms=${this.state.fiatType}&api_key={${api_key}}`)
      .then((res) => {
        this.setState({ cryptoPrice: res.data.BCH})
      })
  }

  render() {
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
          <QRCode value="1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX"/>
          <button onClick={() => {this.updatePrices}}>Price</button>
          <p>{this.state.cryptoPrice}</p>
          <p>{this.state.fiatAmount}</p>
        </div>
      </div>
    );
  }
}
