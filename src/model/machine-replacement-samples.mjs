/*
 * Copyright (c) 2020 Tobias Briones. All rights reserved.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Example Project: Machine Replacement Model.
 *
 * This source code is licensed under the GNU General Public License v3.0 or
 * later License found in the LICENSE file in the root directory of this source
 * tree or at https://opensource.org/licenses/GPL-3.0.
 */

import { MachineReplacementModel } from './machine-replacement.mjs';

export function getSampleModel() {
  const decisionYears = 4;
  const initialAge = 3;
  const maxAge = 6;
  const price = 100_000;
  const data = getSampleData();
  return new MachineReplacementModel(
    decisionYears,
    initialAge,
    maxAge,
    price,
    data
  );
}

export function getSampleData() {
  return [
    newDataRow(20000, 200, -1),
    newDataRow(19000, 600, 80000),
    newDataRow(18500, 1200, 60000),
    newDataRow(17200, 1500, 50000),
    newDataRow(15500, 1700, 30000),
    newDataRow(14000, 1800, 10000),
    newDataRow(12200, 2200, 5000)
  ];
}

export function getAarfSampleModel() {
  const decisionYears = 10;
  const initialAge = 0;
  const maxAge = 10;
  const price = 8608000;
  const data = getAarfSampleData();
  return new MachineReplacementModel(
    decisionYears,
    initialAge,
    maxAge,
    price,
    data
  );
}

export function getAarfSampleData() {
  return [
    newDataRow(2330000, 240000, -1),
    newDataRow(2320000, 253000, 8177600),
    newDataRow(2210000, 257000, 7768720),
    newDataRow(2090000, 272000, 7380284),
    newDataRow(1895000, 274000, 7011269),
    newDataRow(1770000, 301000, 6310142),
    newDataRow(1720000, 311000, 5679127),
    newDataRow(1655000, 361000, 5111215),
    newDataRow(1590000, 396000, 4600093),
    newDataRow(1345000, 403000, 3910079),
    newDataRow(1029000, 415000, 3323567)
  ];
}

function newDataRow(income, operationCost, sellingRevenue) {
  return {
    income: income,
    operationCost: operationCost,
    sellingRevenue: sellingRevenue
  };
}

// For an actual use case, these sample models and their corresponding solutions
// might be stored in a file so they can be tested by opening and reading the
// file instead of placing the whole solutions in here for example

// --------------------------------------  SAMPLE SOLUTION  ------------------------------------- //

// Taha's book example solution:

export function getSampleModelSolutionTree() {
  return [
    [
      {
        'machineAge': 3,
        'decisionYear': 1,
        'k': {
          'machineAge': 4,
          'decisionYear': 2,
          'k': {
            'machineAge': 5,
            'decisionYear': 3,
            'k': {
              'machineAge': 6,
              'decisionYear': 4,
              'k': null,
              'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
            },
            'r': {
              'machineAge': 1,
              'decisionYear': 4,
              'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
              'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
            }
          },
          'r': {
            'machineAge': 1,
            'decisionYear': 3,
            'k': {
              'machineAge': 2,
              'decisionYear': 4,
              'k': { 'machineAge': 3, 'decisionYear': 5, 'k': null, 'r': null },
              'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
            },
            'r': {
              'machineAge': 1,
              'decisionYear': 4,
              'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
              'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
            }
          }
        },
        'r': {
          'machineAge': 1,
          'decisionYear': 2,
          'k': {
            'machineAge': 2,
            'decisionYear': 3,
            'k': {
              'machineAge': 3,
              'decisionYear': 4,
              'k': { 'machineAge': 4, 'decisionYear': 5, 'k': null, 'r': null },
              'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
            },
            'r': {
              'machineAge': 1,
              'decisionYear': 4,
              'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
              'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
            }
          },
          'r': {
            'machineAge': 1,
            'decisionYear': 3,
            'k': {
              'machineAge': 2,
              'decisionYear': 4,
              'k': { 'machineAge': 3, 'decisionYear': 5, 'k': null, 'r': null },
              'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
            },
            'r': {
              'machineAge': 1,
              'decisionYear': 4,
              'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
              'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
            }
          }
        }
      }
    ],
    [
      {
        'machineAge': 1,
        'decisionYear': 2,
        'k': {
          'machineAge': 2,
          'decisionYear': 3,
          'k': {
            'machineAge': 3,
            'decisionYear': 4,
            'k': { 'machineAge': 4, 'decisionYear': 5, 'k': null, 'r': null },
            'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
          },
          'r': {
            'machineAge': 1,
            'decisionYear': 4,
            'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
            'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
          }
        },
        'r': {
          'machineAge': 1,
          'decisionYear': 3,
          'k': {
            'machineAge': 2,
            'decisionYear': 4,
            'k': { 'machineAge': 3, 'decisionYear': 5, 'k': null, 'r': null },
            'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
          },
          'r': {
            'machineAge': 1,
            'decisionYear': 4,
            'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
            'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
          }
        }
      },
      {
        'machineAge': 4,
        'decisionYear': 2,
        'k': {
          'machineAge': 5,
          'decisionYear': 3,
          'k': {
            'machineAge': 6,
            'decisionYear': 4,
            'k': null,
            'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
          },
          'r': {
            'machineAge': 1,
            'decisionYear': 4,
            'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
            'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
          }
        },
        'r': {
          'machineAge': 1,
          'decisionYear': 3,
          'k': {
            'machineAge': 2,
            'decisionYear': 4,
            'k': { 'machineAge': 3, 'decisionYear': 5, 'k': null, 'r': null },
            'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
          },
          'r': {
            'machineAge': 1,
            'decisionYear': 4,
            'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
            'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
          }
        }
      }
    ],
    [
      {
        'machineAge': 1,
        'decisionYear': 3,
        'k': {
          'machineAge': 2,
          'decisionYear': 4,
          'k': { 'machineAge': 3, 'decisionYear': 5, 'k': null, 'r': null },
          'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
        },
        'r': {
          'machineAge': 1,
          'decisionYear': 4,
          'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
          'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
        }
      },
      {
        'machineAge': 2,
        'decisionYear': 3,
        'k': {
          'machineAge': 3,
          'decisionYear': 4,
          'k': { 'machineAge': 4, 'decisionYear': 5, 'k': null, 'r': null },
          'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
        },
        'r': {
          'machineAge': 1,
          'decisionYear': 4,
          'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
          'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
        }
      },
      {
        'machineAge': 5,
        'decisionYear': 3,
        'k': {
          'machineAge': 6,
          'decisionYear': 4,
          'k': null,
          'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
        },
        'r': {
          'machineAge': 1,
          'decisionYear': 4,
          'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
          'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
        }
      }
    ],
    [
      {
        'machineAge': 1,
        'decisionYear': 4,
        'k': { 'machineAge': 2, 'decisionYear': 5, 'k': null, 'r': null },
        'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
      },
      {
        'machineAge': 2,
        'decisionYear': 4,
        'k': { 'machineAge': 3, 'decisionYear': 5, 'k': null, 'r': null },
        'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
      },
      {
        'machineAge': 3,
        'decisionYear': 4,
        'k': { 'machineAge': 4, 'decisionYear': 5, 'k': null, 'r': null },
        'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
      },
      {
        'machineAge': 6,
        'decisionYear': 4,
        'k': null,
        'r': { 'machineAge': 1, 'decisionYear': 5, 'k': null, 'r': null }
      }
    ]
  ];
}

export function getSampleModelSolutionStages() {
  return [
    [{ 't': 3, 'k': 51200, 'r': 55300, 'max': 55300, 'decision': 'R' }],
    [
      { 't': 1, 'k': 85500, 'r': 85500, 'max': 85500, 'decision': 'K or R' },
      { 't': 4, 'k': 30800, 'r': 35500, 'max': 35500, 'decision': 'R' }
    ],
    [
      { 't': 1, 'k': 85700, 'r': 79600, 'max': 85700, 'decision': 'K' },
      { 't': 2, 'k': 67100, 'r': 59600, 'max': 67100, 'decision': 'K' },
      { 't': 5, 'k': 17000, 'r': 9600, 'max': 17000, 'decision': 'K' }
    ],
    [
      { 't': 1, 'k': 78400, 'r': 79800, 'max': 79800, 'decision': 'R' },
      { 't': 2, 'k': 67300, 'r': 59800, 'max': 67300, 'decision': 'K' },
      { 't': 3, 'k': 45700, 'r': 49800, 'max': 49800, 'decision': 'R' },
      { 't': 6, 'k': false, 'r': 4800, 'max': 4800, 'decision': 'R' }
    ]
  ];
}

// ----------------------------------------  AARF SAMPLE  --------------------------------------- //

// I didn't add the solution tree because it's huge and unnecessary for testing purposes

export function getAarfSampleModelSolutionStages() {
  return [
    [{ 't': 0, 'k': 25204000, 'r': 16595999, 'max': 25204000, 'decision': 'K' }],
    [{ 't': 1, 'k': 23112520, 'r': 23114000, 'max': 23114000, 'decision': 'R' }],
    [
      { 't': 1, 'k': 21452920, 'r': 21454400, 'max': 21454400, 'decision': 'R' },
      { 't': 2, 'k': 20950484, 'r': 21045520, 'max': 21045520, 'decision': 'R' }
    ],
    [
      { 't': 1, 'k': 19793320, 'r': 19794800, 'max': 19794800, 'decision': 'R' },
      { 't': 2, 'k': 19290884, 'r': 19385920, 'max': 19385920, 'decision': 'R' },
      { 't': 3, 'k': 18786869, 'r': 18997484, 'max': 18997484, 'decision': 'R' }
    ],
    [
      { 't': 1, 'k': 18133720, 'r': 18135200, 'max': 18135200, 'decision': 'R' },
      { 't': 2, 'k': 17631284, 'r': 17726320, 'max': 17726320, 'decision': 'R' },
      { 't': 3, 'k': 17127269, 'r': 17337884, 'max': 17337884, 'decision': 'R' },
      { 't': 4, 'k': 16229142, 'r': 16968869, 'max': 16968869, 'decision': 'R' }
    ],
    [
      { 't': 1, 'k': 16474120, 'r': 16475600, 'max': 16475600, 'decision': 'R' },
      { 't': 2, 'k': 15971684, 'r': 16066720, 'max': 16066720, 'decision': 'R' },
      { 't': 3, 'k': 15467669, 'r': 15678284, 'max': 15678284, 'decision': 'R' },
      { 't': 4, 'k': 14569542, 'r': 15309269, 'max': 15309269, 'decision': 'R' },
      { 't': 5, 'k': 13786527, 'r': 14608142, 'max': 14608142, 'decision': 'R' }
    ],
    [
      { 't': 1, 'k': 14814520, 'r': 14816000, 'max': 14816000, 'decision': 'R' },
      { 't': 2, 'k': 14312084, 'r': 14407120, 'max': 14407120, 'decision': 'R' },
      { 't': 3, 'k': 13808069, 'r': 14018684, 'max': 14018684, 'decision': 'R' },
      { 't': 4, 'k': 12909942, 'r': 13649669, 'max': 13649669, 'decision': 'R' },
      { 't': 5, 'k': 12126927, 'r': 12948542, 'max': 12948542, 'decision': 'R' },
      { 't': 6, 'k': 11499015, 'r': 12317527, 'max': 12317527, 'decision': 'R' }
    ],
    [
      { 't': 1, 'k': 13154920, 'r': 13156400, 'max': 13156400, 'decision': 'R' },
      { 't': 2, 'k': 12652484, 'r': 12747520, 'max': 12747520, 'decision': 'R' },
      { 't': 3, 'k': 12148469, 'r': 12359084, 'max': 12359084, 'decision': 'R' },
      { 't': 4, 'k': 11250342, 'r': 11990069, 'max': 11990069, 'decision': 'R' },
      { 't': 5, 'k': 10467327, 'r': 11288942, 'max': 11288942, 'decision': 'R' },
      { 't': 6, 'k': 9839415, 'r': 10657927, 'max': 10657927, 'decision': 'R' },
      { 't': 7, 'k': 9213293, 'r': 10090015, 'max': 10090015, 'decision': 'R' }
    ],
    [
      { 't': 1, 'k': 11495320, 'r': 11496800, 'max': 11496800, 'decision': 'R' },
      { 't': 2, 'k': 10992884, 'r': 11087920, 'max': 11087920, 'decision': 'R' },
      { 't': 3, 'k': 10488869, 'r': 10699484, 'max': 10699484, 'decision': 'R' },
      { 't': 4, 'k': 9590742, 'r': 10330469, 'max': 10330469, 'decision': 'R' },
      { 't': 5, 'k': 8807727, 'r': 9629342, 'max': 9629342, 'decision': 'R' },
      { 't': 6, 'k': 8179815, 'r': 8998327, 'max': 8998327, 'decision': 'R' },
      { 't': 7, 'k': 7553693, 'r': 8430415, 'max': 8430415, 'decision': 'R' },
      { 't': 8, 'k': 6763679, 'r': 7919293, 'max': 7919293, 'decision': 'R' }
    ],
    [
      { 't': 1, 'k': 9835720, 'r': 9837200, 'max': 9837200, 'decision': 'R' },
      { 't': 2, 'k': 9333284, 'r': 9428320, 'max': 9428320, 'decision': 'R' },
      { 't': 3, 'k': 8829269, 'r': 9039884, 'max': 9039884, 'decision': 'R' },
      { 't': 4, 'k': 7931142, 'r': 8670869, 'max': 8670869, 'decision': 'R' },
      { 't': 5, 'k': 7148127, 'r': 7969742, 'max': 7969742, 'decision': 'R' },
      { 't': 6, 'k': 6520215, 'r': 7338727, 'max': 7338727, 'decision': 'R' },
      { 't': 7, 'k': 5894093, 'r': 6770815, 'max': 6770815, 'decision': 'R' },
      { 't': 8, 'k': 5104079, 'r': 6259693, 'max': 6259693, 'decision': 'R' },
      { 't': 9, 'k': 4265567, 'r': 5569679, 'max': 5569679, 'decision': 'R' }
    ]
  ];
}
