/**
 * @author Candice
 * @date 2018/6/7 15:13
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HelloComponent from '../components/HelloComponent';
import {increment as incrementCount} from '../../redux/modules/counter'

class TestContainer extends Component {
  render() {
    console.log('render');
    const {count} = this.props;

    return (
      <div>
        <HelloComponent/>
        <span>count:{count}</span>
        <button onClick={this.props.incrementCount}>incrementCount</button>
      </div>
    );
  }
}

TestContainer.propTypes = {
  count: PropTypes.number,
  incrementCount:PropTypes.func,

};
const mapStateToProps = state => ({
  count: state.counter.count,
});
const mapDispatchToProps = dispatch => ({
  incrementCount: bindActionCreators(incrementCount, dispatch),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestContainer));
