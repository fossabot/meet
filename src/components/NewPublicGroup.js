import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import PublicConferenceIcon from '@material-ui/icons/Group';

import Persona from 'kpop/es/Persona';

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0, // See https://bugzilla.mozilla.org/show_bug.cgi?id=1043520
  },
  inputField: {
  },
  form: {
    overflow: 'auto',
    flex: 1,
    maxWidth: 600,
  },
});

class NewPublicGroup extends React.PureComponent {
  state = {
    query: '',
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleActionClick = () => {
    const { query } = this.state;
    const { onActionClick } = this.props;

    onActionClick('view-public-group', {id: query, scope: 'group'});
  }

  render() {
    const { query } = this.state;
    const {
      classes,
      className: classNameProp,
    } = this.props;

    const className = classNames(
      classes.root,
      classNameProp,
    );

    const valid = query.trim().length > 0;

    return (
      <div className={className}>
        <Divider/>
        <List disablePadding onClick={this.handleContactClick} className={classes.form}>
          <ListItem>
            <TextField
              autoFocus
              className={classes.inputField}
              label="Enter a public group"
              value={query}
              fullWidth
              onChange={this.handleChange('query')}
            /> <Persona user={{displayName: query}} forceIcon icon={<PublicConferenceIcon/>}/>
          </ListItem>
          <ListItem>
            <Button variant="raised" color="primary" disabled={!valid} onClick={this.handleActionClick}>Create</Button>
          </ListItem>
        </List>
      </div>
    );
  }
}

NewPublicGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,

  onActionClick: PropTypes.func.isRequired,
};

export default connect()(withStyles(styles)(NewPublicGroup));
