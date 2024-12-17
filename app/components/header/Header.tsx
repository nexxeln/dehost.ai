import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { messageStore } from '~/lib/stores/messages';

export function Header() {
  const chat = useStore(chatStore);
  const messages = useStore(messageStore);

  return (
    <header
      className={classNames(
        'flex items-center justify-between bg-[#161616] p-5 border-b h-[var(--header-height)] px-10',
        {
          'border-transparent': !chat.started,
          'border-bolt-elements-borderColor': chat.started,
        },
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 text-bolt-elements-textPrimary cursor-pointer ">
        <a href="/" className="text-3xl font-extrabold text-purple-400 flex items-center shadow-xl">
          DeHost
        </a>
      </div>

      {/* Chat Description */}
      <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
        <ClientOnly>{() => <ChatDescription />}</ClientOnly>
      </span>

      {/* Right-Aligned Buttons */}
      <div className="flex items-center gap-10 font-semibold">
        <a href="/fileshare" className="text-lg text-zinc-500 hover:text-zinc-400 flex items-center shadow-xl">
          File Share
        </a>
        <a href="/ens" className="text-lg text-zinc-500 hover:text-zinc-400 flex items-center shadow-xl">
          ENS Registration
        </a>
      </div>

      {/* Header Action Buttons */}
      {chat.started && (
        <ClientOnly>
          {() => (
            <div className="ml-8">
              <HeaderActionButtons messages={messages} />
            </div>
          )}
        </ClientOnly>
      )}
    </header>
  );
}
