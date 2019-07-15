"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_redux_1 = require("react-redux");
const RTT = tslib_1.__importStar(require("realtime-text"));
const Actions = tslib_1.__importStar(require("@andyet/simplewebrtc/actions"));
const axios = require('axios');
/**
 * @description
 *
 * @public
 *
 */
class ChatInputEx extends React.Component {
    constructor(props) {
        super(props);
        this.rttBuffer = new RTT.InputBuffer();
        this.state = {
            chatState: 'active',
            message: ''
        };
    }
    componentDidUpdate(prev) {
        if (!prev.rtt && this.props.rtt) {
            this.props.onRtt(this.rttBuffer.start());
            this.rttBuffer.update(this.state.message);
        }
        if (prev.rtt && !this.props.rtt) {
            this.props.onRtt(this.rttBuffer.stop());
            clearInterval(this.rttInterval);
            this.rttInterval = null;
        }
    }
    startSendingRtt() {
        if (!this.rttInterval && this.props.rtt) {
            this.rttInterval = setInterval(this.rttSend.bind(this), 700);
            setTimeout(this.rttSend.bind(this), 100);
        }
    }
    rttUpdate(data = '') {
        this.rttBuffer.update(data);
        this.startSendingRtt();
    }
    rttSend() {
        if (!this.props.rtt) {
            return;
        }
        const diff = this.rttBuffer.diff();
        if (diff) {
            this.props.onRtt(diff);
        }
    }
    commitMessage() {
        if (this.props.disabled || this.state.message.length === 0) {
            return;
        }
        clearTimeout(this.pausedTimeout);
        this.pausedTimeout = null;
        clearInterval(this.rttInterval);
        this.rttInterval = null;
        const { message } = this.state;
        this.setState({ message: '', chatState: 'active' });
        this.rttBuffer.commit();
        if (this.props.onChat) {
            axios.post('/api/msg', { message })
            .then(res => {
                console.log(res);
                this.props.onChat({
                    body: res.data
                });
            })
            // this.props.onChat({
            //     body: message
            // });
        }
    }
    updateChatState(chatState) {
        if (this.pausedTimeout) {
            clearTimeout(this.pausedTimeout);
        }
        if (chatState === 'composing') {
            this.pausedTimeout = setTimeout(() => {
                this.updateChatState('paused');
            }, 10000);
        }
        else {
            this.pausedTimeout = null;
        }
        if (chatState !== this.state.chatState) {
            if (this.props.onChatState) {
                this.props.onChatState(chatState);
            }
        }
        this.setState({
            chatState
        });
    }
    render() {
        return (
            React.createElement("div",{},
                React.createElement("textarea", { id: this.props.id, value: this.state.message, placeholder: this.props.placeholder, disabled: this.props.disabled, onInput: event => {
                    const value = event.target.value;
                    this.rttUpdate(value);
                    if (value !== '') {
                        this.updateChatState('composing');
                    }
                    if (this.state.message !== '' && value === '') {
                        this.updateChatState('active');
                    }
                    this.setState({
                        message: value
                    });
                }, onChange: () => null, onKeyPress: event => {
                    if (0) {
                        event.preventDefault();
                        this.commitMessage();
                    }
                } }),
                React.createElement("button",{style: {color:"white", display:"block", padding:"5px 10px", background:"#00b0eb", borderRadius:"4px", border:"1px solid transparent", width:"80%", margin: "5px auto"},onClick:this.commitMessage.bind(this)},"Send Message"),
                React.createElement("input",{type:'checkbox'}),
                React.createElement("span",{style: {fontSize:"12px"}},"Send as I type"),
                React.createElement("br",{})
                

            ));
    }
}
function mapStateToProps(state, props) {
    return props;
}
function mapDispatchToProps(dispatch, props) {
    return {
        onChat: (opts) => dispatch(Actions.sendChat(props.room, opts)),
        onChatState: (state) => dispatch(Actions.sendChatState(props.room, state)),
        onRtt: (data) => dispatch(Actions.sendRTT(props.room, data))
    };
}
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ChatInputEx);
