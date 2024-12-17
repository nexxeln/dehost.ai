import type { Message } from 'ai';
import React from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [] } = props;

  return (
    <div id={id} ref={ref} className={`${props.className} bg-opacity-50`}>
      {messages.length > 0
        ? messages.map((message, index) => {
          const { role, content } = message;
          const isUserMessage = role === 'user';
          const isFirst = index === 0;
          const isLast = index === messages.length - 1;

          return (
            <div
              key={index}
              className={classNames('flex gap-3 p-6 w-full rounded-[calc(0.75rem-1px)]', {
                'bg-gradient-to-r from-purple-500 to-purple-700 text-white opacity-85': isUserMessage || !isStreaming || (isStreaming && !isLast),
                'bg-gradient-to-b from-bolt-elements-messages-background from-100% to-transparent bg-opacity-20': isStreaming && isLast,
                'mt-4': !isFirst,
              })}
            >
              {isUserMessage && (
                <div className="flex items-center justify-center w-[34px] h-[34px] overflow-hidden bg-white text-gray-600 rounded-full shrink-0 self-start">
                  DH
                </div>
              )}
              <div className="grid grid-col-1 w-full">
                {isUserMessage ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
              </div>
            </div>
          );
        })
        : null}
      {isStreaming && (
        <div className="text-center w-full text-bolt-elements-textSecondary text-4xl mt-4">
          <i className="i-ph:circle-notch animate-spin"></i>



        </div>


      )}
    </div>
  );
});
