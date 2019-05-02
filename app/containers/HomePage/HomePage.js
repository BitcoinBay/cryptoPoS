/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import ReposList from 'components/ReposList';
import './style.scss';

let SLPSDK = require("slp-sdk");
let SLP = new SLPSDK();

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
       tokens: []
    };
  }

  componentDidMount() {
    const { username, onSubmitForm } = this.props;
    if (username && username.trim().length > 0) {
      onSubmitForm();
    }

    (async () => {
      try {
        let list = await SLP.Utils.list();
        let fin = [];
        console.log(list[1]);
        list.forEach(token => {
          let path = "https://explorer.bitcoin.com/bch/tx/" + token.id;
          fin.push(
            <li>
              <a href={path} target="_blank">
                {token.name !== "" ? token.name : token.id}
              </a>
              <ul>
                {token.symbol} <br />
                {token.circulatingSupply} <br />
                {token.blockCreated} <br />
              </ul>
            </li>
          );
        });
        this.setState({
          tokens: fin
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }

  render() {
    const {
      loading, error, repos, username, onChangeUsername, onSubmitForm
    } = this.props;
    const reposListProps = {
      loading,
      error,
      repos
    };

    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <div className="home-page">
          <section className="centered">
            <h2>Start your next react project in seconds</h2>
            <p>
              A minimal <i>React-Redux</i> boilerplate with all the best practices
            </p>
          </section>
          <section>
            <h2>Try me!</h2>
            <ul>SLP Tokens</ul>
            <ul>{this.state.tokens}</ul>
            <form onSubmit={onSubmitForm}>
              <label htmlFor="username">
                Show Github repositories by
                <span className="at-prefix">@</span>
                <input
                  id="username"
                  type="text"
                  placeholder="BitcoinBay"
                  value={username}
                  onChange={onChangeUsername}
                />
              </label>
            </form>
            <ReposList {...reposListProps} />
          </section>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func
};
