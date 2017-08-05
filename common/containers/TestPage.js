import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import BackingItem from '../components/BackingItem';
import BackingList from '../components/BackingList';

class TestPage extends React.Component {

  static propTypes = {
    componentId: PropTypes.string.isRequired
  }

  render() {
    let { componentId } = this.props;

    const renderers = {
      backings: () => {
        const backings = [
          {
            id: 1,
            supporter: {
              firstName: 'Marcel',
              lastName: 'Zeilinger',
              avatarUrl: 'https://randomuser.me/api/portraits/med/men/10.jpg'
            },
            amount: 25,
            type: 'recurring',
            comment: 'Großer Fan deiner Arbeit!'
          }, {
            id: 2,
            supporter: {
              firstName: 'Klara',
              lastName: 'goldfaden',
              avatarUrl: 'https://randomuser.me/api/portraits/med/women/21.jpg'
            },
            amount: 500,
            type: 'recurring',
            comment: 'Keep it up, you randy bastard!'
          }
        ];
        const cm = {
          name: 'Silvester von Winchester',
          approvalDate: new Date()
        };
        const backingItems = backings.map(b => <BackingItem key={b.id} backing={b} />);
        return <BackingList onSupport={() => alert('supported')}
          changemaker={cm}
          RecurringBackings={backingItems}
          OneTimeBackings={[]}>
        </BackingList>;
      }
    }

    if (componentId in renderers) {
      return renderers[componentId]();
    }

    return <div>Components:
      <a href="/test/backings">Backings</a>
    </div>;
  }
}

export default connect((state, ownProps) => {
  return { componentId: ownProps.params.componentId };
})(TestPage);
