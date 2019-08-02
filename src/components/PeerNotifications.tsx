import { Peer } from '@andyet/simplewebrtc';
import { Component } from 'react';

// Usage
/*
<PeerNotifications
    peers={peers}
    onPeerEnter={() => playSound(peerEnter)}
    onPeerExit={() => playSound(peerExit)}
/>
*/

interface Props {
  peers: Peer[];
  onPeerEnter: () => void;
  onPeerExit: () => void;
  onPeerEmpty: () => void;
  onPeerPause: () => void;
}

export default class PeerNotifications extends Component<Props> {
  public componentDidUpdate(prevProps: Props) {
    if (this.props.peers.length > prevProps.peers.length) {
      this.props.onPeerEnter();
    } else if (this.props.peers.length < prevProps.peers.length) {
      console.log('exit-----------', prevProps.peers.length, this.props.peers.length);
      if (this.props.peers.length == 0) {
        this.props.onPeerEmpty();
        this.props.onPeerPause();
      } else
        this.props.onPeerExit();
    }
  }

  public render() {
    return null;
  }
}
