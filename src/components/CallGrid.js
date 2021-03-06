import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

import renderIf from 'render-if';

import posed from 'react-pose';

import AudioVideo from './AudioVideo';
import FloatingAudioVideo from './FloatingAudioVideo';

const DragableFloatingAudioVideo = posed(FloatingAudioVideo)({
  draggable: true,
});

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
  },
  videocall: {
    display: 'grid',
    background: `linear-gradient(${theme.callBackground.top}, ${theme.callBackground.bottom} 100%)`,
    color: theme.palette.primary.contrastText,
    overflow: 'hidden',
    flex: 1,
    gridTemplateColumns: 'repeat(auto-fit, minmax(100%, 1fr) ) ;',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(50%, 1fr) ) ;',
    },
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(30%, 1fr) ) ;',
    },
  },
  call: {
    flex: '1',
    justifyContent: 'center',
    background: `linear-gradient(${theme.callBackground.top}, ${theme.callBackground.bottom} 100%)`,
    color: theme.palette.primary.contrastText,
  },
  overlay: {
    alignContent: 'start',
    justifyContent: 'space-evenly',
    gridTemplateColumns: 'unset',
    minHeight: 0,
    minWidth: 0,
    overflowY: 'auto',
    paddingTop: theme.spacing.unit,
    paddingBottom: 130 + theme.spacing.unit, // Avoids overlap with floating own video.
  },
  standby: {
    flex: '1',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
  },
  container: {
    position: 'relative',
    maxWidth: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 10px white',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  rounded: {
    width: '12vh',
    height: '12vh',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
    minWidth: 60,
    minHeight: 60,
    maxWidth: '12vh',
    maxHeight: '12vh',
  },
  floatingLocal: {
    position: 'absolute',
    right: theme.spacing.unit * 2,
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
      mode,
      variant,
      cover,
      labels,
      localStream,
      remoteStreamsKey,
      remoteStreams,
      maxVideoStreams,
      ...other
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
        const s = stream[remoteStreamsKey];
        streams.push({
          ...stream,
          stream: s, // Use as stream whatever the key says.
        });
        return true;
      });
    }

    let renderMode = mode;
    if (remoteStreams.length > maxVideoStreams) {
      // Force audio mode when too many streams.
      renderMode = 'call';
    }

    const conference = remoteStreams.length > 1;
    const overlay = variant === 'overlay';

    return (
      <div className={className} {...other}>
        {renderIf(renderMode === 'videocall')(() => (
          <div className={classNames(
            classes.videocall,
            {
              [classes.overlay]: overlay,
            }
          )}>
            {streams.map((stream) =>
              <div
                key={stream.id}
                className={classNames(
                  classes.container,
                  {
                    [classes.rounded]: overlay,
                  }
                )}
              >
                <AudioVideo
                  className={classes.video}
                  id={stream.id}
                  muted={stream.muted}
                  mirrored={stream.mirrored}
                  cover={cover}
                  stream={stream.stream}
                  conference={conference}
                  round={!!overlay}
                  user={labels ? stream.user : undefined}
                  calling={stream.calling}
                >
                </AudioVideo>
              </div>
            )}
          </div>
        ))}
        {renderIf(renderMode === 'call')(() => (
          <Grid className={classNames(
            classes.call,
          )} container alignItems="center" direction="row" justify="center">
            {streams.map((stream) =>
              <AudioVideo
                key={stream.id}
                audio
                id={stream.id}
                muted={stream.muted}
                cover={cover}
                stream={stream.stream}
                conference={conference}
                user={stream.user}
                calling={stream.calling}
              >
              </AudioVideo>
            )}
          </Grid>
        ))}
        {renderIf(renderMode === 'standby')(() => (
          <Grid className={classes.standby} container alignItems="center" direction="row" justify="center">
            <Grid item>
              <Typography color="inherit" variant="headline">Suspended</Typography>
            </Grid>
          </Grid>
        ))}
        <Slide direction="up" in={remoteStreams.length > 0 && !!localStream} mountOnEnter unmountOnExit>
          <DragableFloatingAudioVideo className={classes.floatingLocal} stream={localStream} mirrored muted/>
        </Slide>
      </div>
    );
  }
}

CallGrid.defaultProps = {
  localStream: null,

  remoteStreamsKey: 'stream',
  maxVideoStreams: 20,
  variant: 'full',

  labels: true,
};

CallGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,

  mode: PropTypes.oneOf(['videocall', 'call', 'standby']).isRequired,
  variant: PropTypes.oneOf(['full', 'overlay']).isRequired,

  cover: PropTypes.bool,
  labels: PropTypes.bool,

  localStream: PropTypes.object,
  remoteStreamsKey: PropTypes.string.isRequired,
  remoteStreams: PropTypes.array.isRequired,

  maxVideoStreams: PropTypes.number.isRequired,
};

export default withStyles(styles)(CallGrid);
