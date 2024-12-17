import { atom } from 'nanostores';
import type { Message } from 'ai';

export const messageStore = atom<Message[]>([]);
