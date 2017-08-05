import React, { PropTypes } from 'react';
import { Button } from 'react-toolbox/lib/button';
import { List, ListSubHeader, ListDivider } from 'react-toolbox/lib/list';

import * as dateUtils from '../utils/dateUtils';
import * as shapes from '../constants/Shapes';
import styles from '../../client/css/modules/backing-list.scss';

const Empty = () => <div></div>;

// maximum amount of days in the past that a changemaker join date is considered recent
const MAX_RECENT_DAY_DIFF = 7;

class BackingList extends React.Component {

  static propTypes = {
    onSupport: PropTypes.func.isRequired,
    changemaker: shapes.changemaker.isRequired,
    RecurringBackings: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired,
    OneTimeBackings: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired
  }

  render() {
    let { changemaker } = this.props;

    let recipientName = changemaker.user.firstName;

    let noPatrons = 0 === this.props.RecurringBackings.length;
    let patronBlock;

    let supportBtn =
      <Button key="support-btn" primary raised className={styles.supportBtn}
        label="Diesen Changemaker unterstützen"
        icon="send" onClick={this.props.onSupport} />;

    if (noPatrons) {
      let approvalDate = new Date(changemaker.approvalDate);
      let days = dateUtils.daydiff(approvalDate, new Date());
      if (MAX_RECENT_DAY_DIFF >= days) {
        let day = 0 === days ? <span>heute</span> : <span>vor {days} Tagen</span>;
        patronBlock = <div className={styles.flexer}>
          <p key="happy-start" className={`${styles.noPatronMsg} ${styles.recentJoin}`}>
            {recipientName} startete {day}, werde der erste Patron!
          </p>
          {supportBtn}
        </div>;
      } else {
        patronBlock = <div className={styles.flexer}>
          <p key="unhappy-start" className={styles.noPatronMsg}>{recipientName} hat noch keine Patrons</p>
          {supportBtn}
        </div>;
      }
    } else {
      patronBlock = <div className={styles.flexer}>
        {supportBtn}
        <ListSubHeader key="patron-header" caption={`${recipientName}'s Patrons`} />
        {this.props.RecurringBackings}
      </div>;
    }

    let noSupporters = 0 === this.props.OneTimeBackings.length;

    let supporterBlock = <div className={styles.flexer}>
      <ListSubHeader key="one-time-header" id="one-time-payments" caption="einmalige Unterstützungen" />
      {this.props.OneTimeBackings}
    </div>;

    return <List className={styles.list} ripple>
      <div>
        {patronBlock}
        <ListDivider />
        {noSupporters ? Empty : supporterBlock}
      </div>
    </List>;
  }
}

export default BackingList;
