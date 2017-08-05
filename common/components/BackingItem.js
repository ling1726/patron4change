import React, { PropTypes } from 'react';
import { ListItem } from 'react-toolbox/lib/list';

class BackingItem extends React.Component {

  static propTypes = {
    backing: PropTypes.object.isRequired
  }

  render() {
    const { backing } = this.props;
    const typeTxt = 'recurring' === backing.type ? 'monatlich' : '';
    return <ListItem
      avatar={backing.supporter.avatarUrl}
      caption={`${backing.amount}€ ${typeTxt} von ${backing.supporter.firstName}`}
      legend={backing.comment}
    />;
  }
}

export default BackingItem;
