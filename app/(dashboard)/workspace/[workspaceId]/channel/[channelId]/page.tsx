import React from "react";
import { ChannelHeader } from '../_components/message/ChannelHeader';
import { MessageList } from "../_components/MessageList";
import MessageInputForm from "../_components/message/MessageInputForm";

const ChannelPageMain = () => {
    return (
        <div className="flex h-screen min-h-0 w-full flex-col">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <ChannelHeader />
                <div className="min-h-0 flex-1 overflow-hidden">
                    <MessageList />
                </div>
            </div>

            <div className="shrink-0 border-t bg-background p-4">
                <MessageInputForm />
            </div>
        </div>
    )
};

export default ChannelPageMain;