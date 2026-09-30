import { productsPart1 } from './productsPart1';
import { productsPart2 } from './productsPart2';
import { productsPart3 } from './productsPart3';
import { IProduct } from '../types';

export const allProducts: IProduct[] = [
  ...productsPart1,
  ...productsPart2,
  ...productsPart3
];
