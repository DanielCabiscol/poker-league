import {TPointsByPosition} from './interfaces';

export const pointsByPosition1 = {
  4: {1: 25, 2: 18, 3: 15, 4: 12},
  5: {1: 25, 2: 18, 3: 15, 4: 12, 5: 10},
  6: {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8},
  7: {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6},
  8: {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4},
  9: {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2},
  10: {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 0},
  11: {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 0, 11: 0},
  12: {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 0, 11: 0, 12: 0},
} as TPointsByPosition;

export const pointsByPosition2 = {
  4: {1: 18, 2: 15, 3: 10, 4: 7},
  5: {1: 20, 2: 16, 3: 11, 4: 9, 5: 4},
  6: {1: 21, 2: 17, 3: 12, 4: 10, 5: 7, 6: 3},
  7: {1: 23, 2: 18, 3: 13, 4: 11, 5: 8, 6: 4, 7: 2},
  8: {1: 25, 2: 19, 3: 14, 4: 12, 5: 9, 6: 5, 7: 4, 8: 2},
  9: {1: 26, 2: 20, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2},
  10: {1: 27, 2: 21, 3: 16, 4: 13, 5: 11, 6: 9, 7: 7, 8: 5, 9: 3, 10: 0},
  11: {1: 29, 2: 22, 3: 17, 4: 14, 5: 12, 6: 10, 7: 8, 8: 6, 9: 4, 10: 0, 11: 0},
  12: {1: 31, 2: 23, 3: 18, 4: 15, 5: 13, 6: 11, 7: 9, 8: 7, 9: 5, 10: 0, 11: 0, 12: 0},
} as TPointsByPosition;

export const pointsByPosition3 = {
  4: {1: 20, 2: 15, 3: 10, 4: 5},
  5: {1: 22, 2: 17, 3: 12, 4: 8, 5: 5},
  6: {1: 24, 2: 19, 3: 14, 4: 10, 5: 7, 6: 5},
  7: {1: 26, 2: 21, 3: 16, 4: 12, 5: 9, 6: 6, 7: 5},
  8: {1: 28, 2: 23, 3: 18, 4: 14, 5: 11, 6: 8, 7: 6, 8: 5},
  9: {1: 30, 2: 25, 3: 20, 4: 16, 5: 13, 6: 10, 7: 8, 8: 6, 9: 5},
  10: {1: 32, 2: 27, 3: 22, 4: 18, 5: 15, 6: 12, 7: 10, 8: 8, 9: 6, 10: 5},
  11: {1: 34, 2: 29, 3: 24, 4: 20, 5: 17, 6: 14, 7: 12, 8: 10, 9: 8, 10: 6, 11: 5},
  12: {1: 36, 2: 31, 3: 26, 4: 22, 5: 19, 6: 16, 7: 14, 8: 12, 9: 10, 10: 8, 11: 6, 12: 5},
} as TPointsByPosition;

export const pointSystem = {
  1: pointsByPosition1,
  2: pointsByPosition2,
  3: pointsByPosition3,
} as any;
