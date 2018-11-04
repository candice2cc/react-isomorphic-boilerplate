/**
 * @author Candice
 * @date 2018/11/4 17:04
 */
import React from 'react';
import {
  FormattedMessage,
} from 'react-intl';

const IntlComponent = () => (
  <div>
    <h1>
      <FormattedMessage id="intl.hello" />
    </h1>
  </div>
);

export default IntlComponent;
