import * as React from 'react';
import * as RTT from 'realtime-text';
import * as Actions from '@andyet/simplewebrtc/actions';
declare type ChatState = 'active' | 'composing' | 'paused';
export interface ChatInputProps {
    room: string;
    id?: string;
    disabled?: boolean;
    rtt?: boolean;
    onChat?: (opts: Actions.ChatOptions) => void;
    onChatState?: (state: ChatState) => void;
    onRtt?: (data: RTT.RTTEvent) => void;
}
export interface ChatInputState {
    chatState: ChatState;
    message: string;
}
/**
 * @description
 *
 * @public
 *
 */
declare class ChatAnalyzeEx extends React.Component<ChatInputProps, ChatInputState> {
    state: ChatInputState;
    private rttBuffer;
    private pausedTimeout;
    private rttInterval;
    constructor(props: ChatInputProps);
    componentDidUpdate(prev: ChatInputProps): void;
    startSendingRtt(): void;
    rttUpdate(data?: string): void;
    rttSend(): void;
    commitMessage(): void;
    commitHistory(): void;
    updateChatState(chatState: ChatState): void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponentClass<typeof ChatAnalyzeEx, Pick<ChatInputProps, never> & ChatInputProps>;
export default _default;
