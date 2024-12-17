import * as RadixDialog from '@radix-ui/react-dialog';
import { motion, type Variants } from 'framer-motion';
import React, { memo, type ReactNode } from 'react';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';
import { IconButton } from './IconButton';

export { Close as DialogClose, Root as DialogRoot } from '@radix-ui/react-dialog';

const transition = {
  duration: 0.3,
  ease: cubicEasingFn,
};

export const dialogBackdropVariants = {
  closed: {
    opacity: 0,
    transition,
  },
  open: {
    opacity: 1,
    transition,
  },
} satisfies Variants;

export const dialogVariants = {
  closed: {
    x: '-50%',
    y: '-40%',
    scale: 0.98,
    opacity: 0,
    transition,
  },
  open: {
    x: '-50%',
    y: '-50%',
    scale: 1,
    opacity: 1,
    transition,
  },
} satisfies Variants;

interface DialogButtonProps {
  type: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  onClick?: (event: React.UIEvent) => void;
}

export const DialogButton = memo(({ type, children, onClick }: DialogButtonProps) => {
  return (
    <button
      className={classNames(
        'inline-flex h-[38px] items-center justify-center rounded-md px-5 text-sm font-medium focus:outline-none transition-all',
        {
          // Primary Button with Purple Gradient
          'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500':
            type === 'primary',
          // Secondary Button with Dark Gray and Purple Border
          'bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-2 focus:ring-purple-500':
            type === 'secondary',
          // Danger Button with Red and Purple Focus
          'bg-red-800 text-white hover:bg-red-900 focus:ring-2 focus:ring-red-500':
            type === 'danger',
        },
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

export const DialogTitle = memo(({ className, children, ...props }: RadixDialog.DialogTitleProps) => {
  return (
    <RadixDialog.Title
      className={classNames(
        'px-6 py-4 flex items-center justify-between border-b border-purple-600 text-xl font-semibold leading-6 text-purple-100',
        className,
      )}
      {...props}
    >
      {children}
    </RadixDialog.Title>
  );
});

export const DialogDescription = memo(({ className, children, ...props }: RadixDialog.DialogDescriptionProps) => {
  return (
    <RadixDialog.Description
      className={classNames('px-6 py-4 text-purple-300 text-md', className)}
      {...props}
    >
      {children}
    </RadixDialog.Description>
  );
});

interface DialogProps {
  children: ReactNode | ReactNode[];
  className?: string;
  onBackdrop?: (event: React.UIEvent) => void;
  onClose?: (event: React.UIEvent) => void;
}

export const Dialog = memo(({ className, children, onBackdrop, onClose }: DialogProps) => {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay onClick={onBackdrop} asChild>
        <motion.div
          className="bg-purple-900/80 fixed inset-0 z-50"
          initial="closed"
          animate="open"
          exit="closed"
          variants={dialogBackdropVariants}
        />
      </RadixDialog.Overlay>
      <RadixDialog.Content asChild>
        <motion.div
          className={classNames(
            'fixed top-[50%] left-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[480px] translate-x-[-50%] translate-y-[-50%] border border-purple-700 rounded-lg bg-purple-900/90 shadow-lg shadow-purple-700 focus:outline-none overflow-hidden',
            className,
          )}
          initial="closed"
          animate="open"
          exit="closed"
          variants={dialogVariants}
        >
          {children}
          <RadixDialog.Close asChild onClick={onClose}>
            <IconButton icon="i-ph:x" className="absolute top-[15px] right-[15px] text-purple-300 hover:text-purple-100" />
          </RadixDialog.Close>
        </motion.div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
});
