import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { deployToIPFS } from '~/lib/ipfs/deploy';
import type { Message } from 'ai';
import { DomainModal } from '~/components/ui/DomainModal';

interface HeaderActionButtonsProps {
  messages?: Message[];
}

export function HeaderActionButtons({ messages = [] }: HeaderActionButtonsProps) {
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const { showChat } = useStore(chatStore);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [currentIpfsHash, setCurrentIpfsHash] = useState('');

  const canHideChat = showWorkbench || !showChat;

  const handleDeploy = async () => {
    const htmlMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === 'assistant' && msg.content.includes('<!DOCTYPE html>'));

    if (!htmlMessage) {
      toast.error('No HTML content found in the chat. Please generate a website first.');
      return;
    }

    try {
      setIsDeploying(true);

      const content = htmlMessage.content;
      const htmlMatch = content.match(/<!DOCTYPE html>[\s\S]*<\/html>/);

      if (!htmlMatch) {
        toast.error('Could not extract HTML content from the message.');
        return;
      }

      const htmlContent = htmlMatch[0];

      const result = await deployToIPFS(htmlContent, import.meta.env.VITE_LIGHTHOUSE_API_KEY);
      setCurrentIpfsHash(result.hash);

      toast.success(
        <div>
          Deployed to IPFS!
          <br />
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between gap-2 bg-bolt-elements-background-depth-3 rounded px-3 py-2">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-purple-200"
              >
                {result.url}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.url);
                  toast.success('IPFS URL copied to clipboard');
                }}
                className="text-sm text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowDomainModal(true)}
              className="px-3 py-2 text-sm rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Add Custom Domain
            </button>
          </div>
        </div>,
      );
    } catch (error) {
      toast.error('Failed to deploy to IPFS. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDomainSubmit = async (domain: string) => {
    try {
      // We'll just log for now since we're using DNSLink
      console.log('Domain submitted:', domain, 'IPFS hash:', currentIpfsHash);
    } catch (error) {
      toast.error('Failed to process domain. Please try again.');
      setShowDomainModal(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className={classNames(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
            'bg-gradient-to-r from-purple-600 to-purple-700 text-white',
            'hover:from-purple-700 hover:to-purple-800',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isDeploying ? (
            <>
              <div className="i-svg-spinners:90-ring-with-bg text-lg" />
              Deploying...
            </>
          ) : (
            <>
              <div className="i-ph:cloud-arrow-up text-lg" />
              Deploy to IPFS
            </>
          )}
        </button>

        <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden">
          <Button
            active={showChat}
            disabled={!canHideChat}
            onClick={() => {
              if (canHideChat) {
                chatStore.setKey('showChat', !showChat);
              }
            }}
          >
            <div className="i-bolt:chat text-sm" />
          </Button>
          <div className="w-[1px] bg-bolt-elements-borderColor" />
          <Button
            active={showWorkbench}
            onClick={() => {
              if (showWorkbench && !showChat) {
                chatStore.setKey('showChat', true);
              }

              workbenchStore.showWorkbench.set(!showWorkbench);
            }}
          >
            <div className="i-ph:code-bold" />
          </Button>
        </div>
      </div>

      <DomainModal
        isOpen={showDomainModal}
        onClose={() => setShowDomainModal(false)}
        ipfsHash={currentIpfsHash}
        onSubmit={handleDomainSubmit}
      />
    </>
  );
}

interface ButtonProps {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({ active, disabled, onClick, children }: ButtonProps) {
  return (
    <button
      className={classNames('flex items-center justify-center w-8 h-8 transition-colors', {
        'bg-bolt-elements-item-backgroundActive text-bolt-elements-item-contentActive': active,
        'hover:bg-bolt-elements-item-backgroundHover': !active && !disabled,
        'text-bolt-elements-item-contentDefault': !active,
        'opacity-50 cursor-not-allowed': disabled,
      })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
