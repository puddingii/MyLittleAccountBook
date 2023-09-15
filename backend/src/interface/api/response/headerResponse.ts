import { TResponseType } from '@/interface/api/response';

export type TGetAccountBook = TResponseType<{ title: string; content?: string }>;
export type TPostAccountBook = TResponseType<{ accountBookId: number }>;
export type TPatchAccountBook = TResponseType<{}>;
