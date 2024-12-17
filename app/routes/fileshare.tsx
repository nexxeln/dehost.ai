import { useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { classNames } from '~/utils/classNames';
import { Header } from '~/components/header/Header';
import lighthouse from '@lighthouse-web3/sdk';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FileShare() {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!text && !selectedFile) {
      return;
    }

    try {
      setUploading(true);
      const apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY;
      if (!apiKey) {
        toast.error('Lighthouse API key not found');
        return;
      }

      let response;
      if (text) {
        response = await lighthouse.uploadText(text, apiKey, 'text-upload');
        const ipfsUrl = `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
        toast.success(
          <div>
            Text uploaded to IPFS!
            <br />
            <a
              href={ipfsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-purple-200 underline"
            >
              View on IPFS
            </a>
          </div>,
        );
      } else if (selectedFile) {
        // Create a FormData instance
        const formData = new FormData();
        formData.append('files', selectedFile);

        // Get the file from FormData and create a buffer
        const file = formData.get('files') as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload the buffer
        response = await lighthouse.uploadBuffer(buffer, apiKey);
        const ipfsUrl = `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
        toast.success(
          <div>
            File uploaded to IPFS!
            <br />
            <a
              href={ipfsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-purple-200 underline"
            >
              View on IPFS
            </a>
          </div>,
        );
      }

      setText('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload to IPFS. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setText('');
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-[#E0E0FF] p-4">
        <div className="w-full max-w-xl">
          <div className="flex gap-4">
            {/* Text Input Section */}
            <div
              className={classNames(
                'flex-1',
                'shadow-[0_0_15px_rgba(138,79,255,0.2)]',
                'border border-[#D8BFD8]',
                'bg-bolt-elements-prompt-background',
                'backdrop-filter backdrop-blur-[8px]',
                'rounded-lg overflow-hidden',
              )}
            >
              <textarea
                className="w-full pl-4 pt-4 pr-4 min-h-[200px] focus:outline-none resize-none text-md 
                         text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setSelectedFile(null);
                }}
                placeholder="Enter your text here..."
                disabled={!!selectedFile || uploading}
              />
            </div>

            {/* File Upload Section */}
            <div className="flex flex-col justify-center gap-4">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                disabled={!!text || uploading}
              />
              <label
                htmlFor="file-upload"
                className={classNames(
                  'cursor-pointer',
                  'shadow-[0_0_15px_rgba(138,79,255,0.2)]',
                  'border border-[#D8BFD8]',
                  'bg-bolt-elements-prompt-background',
                  'backdrop-filter backdrop-blur-[8px]',
                  'rounded-lg p-4',
                  'flex flex-col items-center justify-center',
                  'min-h-[100px]',
                  text || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80',
                )}
              >
                <div className="i-ph:file text-3xl mb-2" />
                <span className="text-sm">{selectedFile ? selectedFile.name : 'Upload a file'}</span>
              </label>

              {/* Upload Button */}
              <IconButton
                className="bg-purple-400 hover:brightness-94 text-white p-2 w-full"
                disabled={(!text && !selectedFile) || uploading}
                onClick={handleUpload}
              >
                <div className="flex items-center justify-center gap-2">
                  {uploading ? (
                    <>
                      <div className="i-svg-spinners:90-ring-with-bg text-lg" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <div className="i-ph:arrow-up text-lg" />
                      <span>Upload</span>
                    </>
                  )}
                </div>
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        closeButton={({ closeToast }) => (
          <button className="Toastify__close-button" onClick={closeToast}>
            <div className="i-ph:x text-lg" />
          </button>
        )}
        icon={({ type }) => {
          switch (type) {
            case 'success':
              return <div className="i-ph:check-bold text-bolt-elements-icon-success text-2xl" />;
            case 'error':
              return <div className="i-ph:warning-circle-bold text-bolt-elements-icon-error text-2xl" />;
            default:
              return undefined;
          }
        }}
      />
    </>
  );
}
