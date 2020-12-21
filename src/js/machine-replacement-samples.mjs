/*
 * Copyright (c) 2020 Tobias Briones. All rights reserved.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Example Project: Machine Replacement Model.
 *
 * Machine Replacement Model is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Machine Replacement Model is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Machine Replacement Model.  If not, see <https://www.gnu.org/licenses/>.
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

// --------------------------------------  SAMPLE SOLUTION  ------------------------------------- //

// For an actual use case, these sample models and their corresponding solutions
// might be stored in a file so they can be tested by opening and reading the
// file instead of placing the whole solutions in here

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
