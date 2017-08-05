import React from 'react';
import { List } from 'react-toolbox/lib/list';

import * as shapes from '../constants/Shapes';
import styles from '../../client/css/modules/search-result.scss';

class SearchResult extends React.Component {

  static propTypes = {
    children: shapes.children
  }

  render() {
    return <List className={styles.resultList} ripple>
      {this.props.children}
    </List>;
  }
}

export default SearchResult;
