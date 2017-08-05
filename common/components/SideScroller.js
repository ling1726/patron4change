import React from 'react';
import * as shapes from '../constants/Shapes';

import styles from '../../client/css/modules/landing-page.scss';

class SideScroller extends React.Component {

  static propTypes = {
    children: shapes.children.isRequired
  }

  render() {
    let wrappedChildren = React.Children.map(this.props.children, child => {
      return <div className={styles.sideScrollerItem}>{child}</div>;
    });
    return <div className={styles.sideScroller}>
      {wrappedChildren}
    </div>;
  }
}

export default SideScroller;
