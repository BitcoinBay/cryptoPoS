import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode-react';

export default class Bip21 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { value } = this.props;

    return(
      <div>
        <QRCode value={ value } />
        <p>{ value }</p>
      </div>
    );
  }
};
