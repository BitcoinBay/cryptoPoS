/*
 * Cashier
 *
 * Cashier-facing Point of Sale page
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import openSocket from 'socket.io-client';

import QRAddress21 from '../../components/QRAddress21';
import './style.scss';

const socket = openSocket('http://localhost:3000');
const api_key = '897a2b25ccd5730323919dee1201a832e5d2bb9835e6ded08dd4897f7669e8f7'
const XPubKey = "tpubDCoP9xnjhwkwC8pT7DVSPFDgbYb2uq2UAdY2DQmk2YtBpiEY8XGtT26P6NgYyc38fiuTF9x3MAtKmuUR2HPd7qKQmAYD5NTpfVy5SzZntWN";
const defaultWebURL = 'https://www.meetup.com/The-Bitcoin-Bay';

export default class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fiatType: 'CAD',
      amountC: 0,
      amountF: 0,
      url: '',
      price: 0,
    };
  }

  componentDidMount() {
    socket.on('event', msg => this.update(msg));
  }

  update(data) {
    console.log(data);
    this.setState({
      fiatType: data[0],
      price: data[1],
      amountF: data[2],
      amountC: data[3],
      url: data[4],
    }, () => console.log(this.state));
  }

  render() {
    return (
      <article>
        <Helmet>
          <title>Customer POS Page</title>
          <meta name="description" content="CashierPOS Page" />
        </Helmet>
        { this.state.url === ''
          ? <QRAddress21 value={defaultWebURL} />
          : (
            <div>
              <QRAddress21 value={this.state.url} />
            </div>
          )
        }
        <p>
          {this.state.fiatType}
        </p>
        <p>
          {this.state.price}
        </p>
        <p>
          {this.state.amountC}
        </p>
        <p>
          {this.state.amountF}
        </p>
      </article>
    );
  }
}
