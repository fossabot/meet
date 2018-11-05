import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import PublicConferenceIcon from '@material-ui/icons/Group';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import IconButton from '@material-ui/core/IconButton';
import AddCallIcon from 'mdi-material-ui/PhonePlus';

import Moment from 'react-moment';

import Swipeout from 'rc-swipeout';
import 'rc-swipeout/assets/index.css';

import Persona from 'kpop/es/Persona';

import ContactLabel from './ContactLabel';
import { removeRecentEntry } from '../actions/recents';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0, // See https://bugzilla.mozilla.org/show_bug.cgi?id=1043520
    userSelect: 'none',
  },
  entries: {
    overflow: 'auto',
    flex: 1,
  },
  timecontainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  time: {
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  actions: {
    top: 'auto',
    bottom: theme.spacing.unit / 2,
    transform: 'none',
  },
  centered: {
    textAlign: 'center',
  },
  deleteSwiper: {
    backgroundColor: 'red',
    color: 'white',
    minWidth: 95,
  },
});

class Recents extends React.PureComponent {
  handleEntryClick = (entry, mode) => () => {
    const { onEntryClick } = this.props;

    onEntryClick(entry, entry.kind, mode);
  }

  handleEntryDelete = (entry) => () => {
    const { removeRecents } = this.props;

    removeRecents(entry.rid);
  }

  handleCallClick = () => {
    const { onCallClick } = this.props;

    onCallClick();
  }

  render() {
    const {
      classes,
      className: classNameProp,
      recents,
    } = this.props;

    const className = classNames(
      classes.root,
      classNameProp,
    );

    const items = recents;

    const noRecents = items.length === 0 ? (
      <React.Fragment>
        <ListItem>
          <ListItemText>
            <Typography variant="caption" align="center">
              Your call history is empty.
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem className={classes.centered}>
          <ListItemText>
            <IconButton color="primary" onClick={this.handleCallClick}>
              <AddCallIcon/>
            </IconButton>
            <Typography>Call</Typography>
          </ListItemText>
        </ListItem>
      </React.Fragment>
    ) : null;

    return (
      <div className={className}>
        <div className={classes.entries}>
          <List disablePadding>
            {items.map((entry) =>
              <Swipeout
                key={entry.rid}
                right={[
                  {
                    text: <Typography color="inherit" variant="button">delete</Typography>,
                    onPress: this.handleEntryDelete(entry),
                    className: classes.deleteSwiper,
                  },
                ]}
              >
                <ListItem button onClick={this.handleEntryClick(entry)}>
                  <RecentsEntryPersona entry={entry}/>
                  <ListItemText primary={<ContactLabel contact={entry} id={entry.id}/>} secondary={entry.jobTitle} />
                  <div className={classes.timecontainer}>
                    <Tooltip
                      enterDelay={500}
                      placement="left"
                      title={<Moment>{entry.date}</Moment>}
                    >
                      <Typography variant="caption" className={classes.time}>
                        <Moment fromNow >{entry.date}</Moment>
                      </Typography>
                    </Tooltip>
                  </div>
                  <ListItemSecondaryAction className={classes.actions}>
                    <IconButton aria-label="Video call" onClick={this.handleEntryClick(entry, 'videocall')}>
                      <VideocamIcon />
                    </IconButton>
                    <IconButton aria-label="Audio call" onClick={this.handleEntryClick(entry, 'call')}>
                      <CallIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Swipeout>
            )}
            {noRecents}
          </List>
        </div>
      </div>
    );
  }
}

Recents.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,

  recents: PropTypes.array.isRequired,
  table: PropTypes.object.isRequired,

  onEntryClick: PropTypes.func.isRequired,
  onCallClick: PropTypes.func.isRequired,
  removeRecents: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const { sorted, table } = state.recents;

  const recents = sorted.map(rid => {
    return {
      rid,
      ...table[rid],
    };
  });

  return {
    recents,
    table,
  };
};

const RecentsEntryPersona = ({ entry }) => {
  switch (entry.kind) {
    case 'group':
      return <Persona user={mapGroupEntryToUserShape(entry)} forceIcon icon={<PublicConferenceIcon/>}/>;

    default:
      return <Persona user={mapContactEntryToUserShape(entry)}/>;
  }
};

RecentsEntryPersona.propTypes = {
  entry: PropTypes.object.isRequired,
};

export const mapContactEntryToUserShape = entry => {
  return {
    guid: entry.mail ? entry.mail : entry.id,
    ...entry,
  };
};

export const mapGroupEntryToUserShape = entry => {
  return {
    displayName: entry.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeRecents: (rid) => {
      return dispatch(removeRecentEntry(rid));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Recents));
