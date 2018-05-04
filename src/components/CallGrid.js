import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import CallIcon from 'material-ui-icons/Call';
import Slide from 'material-ui/transitions/Slide';

import renderIf from 'render-if';

import AudioVideo from './AudioVideo';
import FloatingAudioVideo from './FloatingAudioVideo';

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
  },
  videocall: {
    display: 'flex',
    flex: '1',
    background: '#666',
    overflow: 'hidden',
  },
  call: {
    flex: '1',
    justifyContent: 'center',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  callIcon: {
    fontSize: 46,
  },
  video: {
    flex: 1,
    objectFit: 'cover',
    objectPosition: 'center',
  },
  floatingLocal: {
    position: 'absolute',
    right: theme.spacing.unit * 4,
    bottom: theme.spacing.unit * 4,
    zIndex: 5,
    minHeight: 100,
    minWidth: 100,
    boxShadow: theme.shadows[6],
  },
});

class CallGrid extends React.PureComponent {
  render() {
    const {
      classes,
      className: classNameProp,
      audio,
      localStream,
      remoteStreams,
    } = this.props;

    const className = classNames(
      classes.root,
      classNameProp,
    );

    const streams = [];
    if (remoteStreams.length === 0 && localStream) {
      streams.push({
        id: '',
        stream: localStream,
        muted: true,
        mirrored: true,
      });
    } else {
      remoteStreams.map(stream => {
        streams.push(stream);
        return true;
      });
    }

    return (
      <div className={className}>
        {renderIf(!audio)(() => (
          <div className={classes.videocall}>
            {streams.map((stream) =>
              <AudioVideo
                className={classes.video}
                key={stream.id}
                muted={stream.muted}
                mirrored={stream.mirrored}
                stream={stream.stream}
              >
              </AudioVideo>
            )}
          </div>
        ))}
        {renderIf(audio)(() => (
          <Grid className={classes.call} container alignItems="center" direction="row" justify="center">
            {streams.map((stream) =>
              <AudioVideo
                key={stream.id}
                audio
                muted={stream.muted}
                stream={stream.stream}
              >
              </AudioVideo>
            )}
            <Grid item>
              <CallIcon className={classes.callIcon}/>
            </Grid>
          </Grid>
        ))}
        <Slide direction="up" in={remoteStreams.length > 0 && !!localStream} mountOnEnter unmountOnExit>
          <FloatingAudioVideo className={classes.floatingLocal} stream={localStream} mirrored muted/>
        </Slide>
      </div>
    );
  }
}

CallGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,

  audio: PropTypes.bool,
  localStream: PropTypes.object,
  remoteStreams: PropTypes.array.isRequired,
};

export default withStyles(styles, {withTheme: true})(CallGrid);
