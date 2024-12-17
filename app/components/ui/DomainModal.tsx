import { useState } from 'react';
import { classNames } from '~/utils/classNames';
import { toast } from 'react-toastify';

interface DomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipfsHash: string;
  onSubmit: (domain: string) => void;
}

const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
const LIGHTHOUSE_IP = '44.226.115.90';

export function DomainModal({ isOpen, onClose, ipfsHash, onSubmit }: DomainModalProps) {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'input' | 'instructions'>('input');

  const validateDomain = (value: string) => {
    if (!value) {
      setError('Domain name is required');
      return false;
    }
    if (!DOMAIN_REGEX.test(value)) {
      setError('Please enter a valid domain name (e.g., example.com)');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDomain(domain)) {
      setStep('instructions');
      onSubmit(domain);
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomain(value);
    if (error) {
      validateDomain(value);
    }
  };

  const handleClose = () => {
    setStep('input');
    setDomain('');
    setError('');
    onClose();
  };

  const handleCopyRecord = async (recordType: 'a' | 'txt') => {
    try {
      let textToCopy = '';
      if (recordType === 'a') {
        textToCopy = dnsRecords.a.value;
      } else {
        textToCopy = `${dnsRecords.txt.name} TXT "dnslink=/ipfs/${ipfsHash}"`;
      }
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Record copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy record');
    }
  };

  const dnsRecords = {
    a: {
      type: 'A',
      name: '@ (or your domain)',
      value: LIGHTHOUSE_IP,
    },
    txt: {
      type: 'TXT',
      name: `_dnslink.${domain}`,
      value: `dnslink=/ipfs/${ipfsHash}`,
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bolt-elements-background-depth-2 rounded-lg p-6 w-[600px] border border-bolt-elements-borderColor">
        {step === 'input' ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-bolt-elements-textPrimary">Add Custom Domain</h2>
            <p className="text-sm text-bolt-elements-textSecondary mb-6">
              Enter your domain name to connect it with your IPFS website using DNSLink.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="domain" className="block text-sm font-medium mb-2 text-bolt-elements-textSecondary">
                  Domain Name
                </label>
                <input
                  type="text"
                  id="domain"
                  value={domain}
                  onChange={handleDomainChange}
                  onBlur={() => validateDomain(domain)}
                  placeholder="example.com"
                  className={classNames(
                    'w-full px-4 py-2.5 rounded-md text-base',
                    'bg-bolt-elements-background-depth-3 border transition-colors',
                    'text-bolt-elements-textPrimary',
                    error
                      ? 'border-bolt-elements-icon-error focus:border-bolt-elements-icon-error'
                      : 'border-bolt-elements-borderColor focus:border-purple-500',
                    'focus:outline-none',
                    'placeholder:text-bolt-elements-textTertiary',
                  )}
                />
                {error && <p className="mt-2 text-sm text-bolt-elements-icon-error">{error}</p>}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className={classNames(
                    'px-5 py-2.5 rounded-md text-base font-medium',
                    'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary',
                    'bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor',
                    'transition-colors',
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!domain || !!error}
                  className={classNames(
                    'px-5 py-2.5 rounded-md text-base font-medium',
                    'bg-purple-600 text-white',
                    'hover:bg-purple-700',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-colors',
                  )}
                >
                  Next
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-bolt-elements-textPrimary">Set up DNS Records</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-bolt-elements-textSecondary mb-4">
                  To connect your domain <span className="text-bolt-elements-textPrimary font-medium">{domain}</span>{' '}
                  with your IPFS website, you need to add two DNS records:
                </p>
                <div className="space-y-4">
                  {/* A Record */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-bolt-elements-textSecondary">1. A Record</p>
                      <button
                        onClick={() => handleCopyRecord('a')}
                        className="text-sm text-purple-500 hover:text-purple-400 flex items-center gap-1"
                      >
                        <div className="i-ph:copy text-base" />
                        Copy Value
                      </button>
                    </div>
                    <div className="bg-bolt-elements-background-depth-3 rounded-md p-4 font-mono text-sm text-bolt-elements-textPrimary border border-bolt-elements-borderColor">
                      <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
                        <span>Type:</span>
                        <span>A</span>
                        <span>Name:</span>
                        <span>@ (or {domain})</span>
                        <span>Value:</span>
                        <span>{LIGHTHOUSE_IP}</span>
                      </div>
                    </div>
                  </div>

                  {/* TXT Record */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-bolt-elements-textSecondary">2. DNSLink TXT Record</p>
                      <button
                        onClick={() => handleCopyRecord('txt')}
                        className="text-sm text-purple-500 hover:text-purple-400 flex items-center gap-1"
                      >
                        <div className="i-ph:copy text-base" />
                        Copy Record
                      </button>
                    </div>
                    <div className="bg-bolt-elements-background-depth-3 rounded-md p-4 font-mono text-sm text-bolt-elements-textPrimary border border-bolt-elements-borderColor">
                      <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
                        <span>Type:</span>
                        <span>TXT</span>
                        <span>Name:</span>
                        <span className="break-all">_dnslink.{domain}</span>
                        <span>Value:</span>
                        <span className="break-all">dnslink=/ipfs/{ipfsHash}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-bolt-elements-textPrimary">Next steps:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-bolt-elements-textSecondary">
                  <li>Add both DNS records to your domain's DNS settings</li>
                  <li>Wait for DNS propagation (usually 5-30 minutes)</li>
                  <li>
                    Your website will be accessible at{' '}
                    <span className="text-bolt-elements-textPrimary font-medium">https://{domain}</span>
                  </li>
                </ol>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  className={classNames(
                    'px-5 py-2.5 rounded-md text-base font-medium',
                    'bg-purple-600 text-white',
                    'hover:bg-purple-700',
                    'transition-colors',
                  )}
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
