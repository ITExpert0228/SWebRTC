"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_redux_1 = require("react-redux");
const RTT = tslib_1.__importStar(require("realtime-text"));
const Actions = tslib_1.__importStar(require("@andyet/simplewebrtc/actions"));
const Selectors_1 = require("@andyet/simplewebrtc/Selectors");
const axios = require('axios');
/**
 * @description
 *
 * @public
 *
 */
class ChatAnalyzeEx extends React.Component {
    constructor(props) {
        super(props);
        this.rttBuffer = new RTT.InputBuffer();
        this.state = {
            chatState: 'active',
            message: '',
            analyzeLink: ''
        };
        // this.displayData = '';
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
            // axios.post('/api/msg', { message })
            // .then(res => {
            //     console.log(res);
            //     this.props.onChat({
            //         body: res.data
            //     });
            // })
            this.props.onChat({
                body: message
            });
        }
    }
    commitHistory() {
        // this.viewable = true;
        //     this.displayData = "http://google.com";
        //     return;
        const groups = this.props.groups || [];
        console.log(groups);
        axios.post('/api/msg', { groups })
        .then(res => {
            console.log(res.data);
            this.viewable = true;
            this.state.analyzeLink = res.data.url;
            this.setState({ message: '', chatState: 'active' });
        })
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
            React.createElement("div",{id:"chatInputArea", style:{borderBottom:"1px solid #ccc"}},
                React.createElement("p",{style: {color:"#555", display:"block", padding:"5px 10px 0", margin: "5px auto"}},"View Server Analyze:"),
                React.createElement("button",{style: {color:"white", display:"block", padding:"5px 10px", background:"#00b0eb", borderRadius:"4px", border:"1px solid transparent", width:"90%", margin: "5px auto"},onClick:this.commitHistory.bind(this)},"Send Request"),
                this.state.analyzeLink!=''?React.createElement("a", {href: this.state.analyzeLink, target: "_blank"}, "View Analyze Data"):React.createElement("span",{})
                // React.createElement("input",{type:'checkbox'}),
                // React.createElement("span",{style: {fontSize:"12px"}},"Send as I type"),
                // React.createElement("br",{})
            ));
    }
}
function mapStateToProps(state, props) {
    
    if (!props.room) {
        return {
            ...props,
            groups: []
        };
    }

    return {
        ...props,
        groups: Selectors_1.getGroupedChatsForRoom(state, props.room, props.maxGroupDuration) || []
    };
}
function mapDispatchToProps(dispatch, props) {
    return {
        onChat: (opts) => dispatch(Actions.sendChat(props.room, opts)),
        onChatState: (state) => dispatch(Actions.sendChatState(props.room, state)),
        onRtt: (data) => dispatch(Actions.sendRTT(props.room, data))
    };
}

exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ChatAnalyzeEx);
