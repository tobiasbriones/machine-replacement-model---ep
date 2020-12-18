/*
 * Copyright (C) 2020 Tobias Briones. All rights reserved.
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

import { assert, expectToThrowError, it } from './tools/test.mjs';
import { MachineReplacementModel, MachineReplacementSolver } from './machine-replacement.mjs';

export const machineReplacementTest = { run };

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
  const newRow = (income, operationCost, sellingRevenue) => {
    return {
      income: income,
      operationCost: operationCost,
      sellingRevenue: sellingRevenue
    };
  };
  return [
    newRow(20000, 200, -1),
    newRow(19000, 600, 80000),
    newRow(18500, 1200, 60000),
    newRow(17200, 1500, 50000),
    newRow(15500, 1700, 30000),
    newRow(14000, 1800, 10000),
    newRow(12200, 2200, 5000)
  ];
}

function run() {
  testModel();
  testSolver();
}

function testModel() {
  const sampleData = getSampleData();

  it('creates model', () => {
    const decisionYears = 4;
    const initialAge = 3;
    const maxAge = 6;
    const price = 100_000;
    const data = sampleData;
    const actual = new MachineReplacementModel(
      decisionYears,
      initialAge,
      maxAge,
      price,
      data
    );

    assert(actual.decisionYears === decisionYears);
    assert(actual.initialAge === initialAge);
    assert(actual.maxAge === maxAge);
    assert(actual.price === price);
    assert(actual.data === data);
  });

  it('checks model validation', () => {
    const decisionYears = 4;
    const initialAge = 3;
    const maxAge = 6;
    const price = 100_000;
    const data = sampleData;

    expectToThrowError(() => new MachineReplacementModel(
      -1,
      initialAge,
      maxAge,
      price,
      data
    ));
    expectToThrowError(() => new MachineReplacementModel(
      decisionYears,
      -1,
      maxAge,
      price,
      data
    ));
    expectToThrowError(() => new MachineReplacementModel(
      decisionYears,
      initialAge,
      -1,
      price,
      data
    ));
    expectToThrowError(() => new MachineReplacementModel(
      decisionYears,
      initialAge,
      maxAge,
      -1,
      data
    ));
  });
}

function testSolver() {
  const solver = new MachineReplacementSolver();

  it('solves sample model', () => {
    const model = getSampleModel();
    const expectedTree = getSampleModelSolutionTree();
    const expectedStages = getSampleModelSolutionStages();

    solver.solve(model);

    assert(JSON.stringify(solver.solutionsTree) === JSON.stringify(expectedTree));
    assert(JSON.stringify(solver.stages) === JSON.stringify(expectedStages));
  });
}

// --------------------------------------  SAMPLE SOLUTION  ------------------------------------- //

// For an actual use case, these sample models and their corresponding solutions
// might be stored in a file so they can be tested by opening and reading the
// file instead of placing the whole solutions in here

function getSampleModelSolutionTree() {
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

function getSampleModelSolutionStages() {
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
      { 't': 6, 'k': -1, 'r': 4800, 'max': 4800, 'decision': 'R' }
    ]
  ];
}
