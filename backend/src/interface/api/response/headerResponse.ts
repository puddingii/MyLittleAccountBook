import { TResponseType } from '@/interface/api/response';

export type TPostAccountBook = TResponseType<{ accountBookId: number }>;
export type TPatchAccountBook = TResponseType<{}>;
