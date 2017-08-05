import React, { PropTypes } from 'react';
import { Input } from 'react-toolbox/lib/input';

import styles from '../../client/css/modules/search.scss';
import theme from '../../client/css/theme/search.scss';

class Search extends React.Component {

  static propTypes = {
    hint: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    children: PropTypes.object,
    term: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    onHardConfirm: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onChange(newVal) {
    let { onSearch } = this.props;
    onSearch(newVal);
  }

  onKeyPress(re) {
    let e = re.nativeEvent;
    switch (e.which || e.key) {
      case 13:
      case 'Enter':
        this.props.onHardConfirm(this.props.term);
        break;
    }
  }

  render() {
    let { term } = this.props;
    return <Input id="search-term" className={styles.searchTerm}
      type="text"
      value={term}
      icon="search"
      maxLength={128} // validate max length to avoid long searches due to pasted input
      theme={theme}
      onChange={this.onChange}
      onKeyPress={this.onKeyPress}
      hint={this.props.hint} />;
  }
}

export const ResponsiveHint = () => {
		return <span>
			<span className={styles.hintMD}>Suche nach Namen oder Projekten, Bereichen ...</span>
			<span className={styles.hintXS}>Changemaker oder Projekt</span>
		</span>;
};

export default Search;
