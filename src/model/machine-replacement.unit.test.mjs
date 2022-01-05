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

import {
  getAarfSampleModel,
  getAarfSampleModelSolutionStages,
  getSampleModel,
  getSampleModelSolutionStages,
  getSampleModelSolutionTree
} from './machine-replacement-samples.mjs';
import {
  MachineReplacementModel,
  MachineReplacementSolver
} from './machine-replacement.mjs';
import { assert, expectToThrowError, it } from '../test.mjs';

export const machineReplacementTest = { run };

function run() {
  testModel();
  testSolver();
}

function testModel() {
  const sampleModel = getSampleModel();

  it('creates model', () => {
    const { decisionYears, initialAge, maxAge, price, data } = sampleModel;
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
    const { decisionYears, initialAge, maxAge, price, data } = sampleModel;

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
    expectToThrowError(() => new MachineReplacementModel(
      decisionYears,
      10,
      5,
      price,
      data
    ));
  });

  it('checks default model', () => {
    const decisionYear = 0;
    const initialAge = 0;
    const maxAge = 0;
    const price = 0;
    const actual = new MachineReplacementModel();

    assert(actual.decisionYears === decisionYear);
    assert(actual.initialAge === initialAge);
    assert(actual.maxAge === maxAge);
    assert(actual.price === price);
    assert(actual.data.length === 0);
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
  it('solves aarf sample model', () => {
    const model = getAarfSampleModel();
    const expectedStages = getAarfSampleModelSolutionStages();

    solver.solve(model);

    assert(JSON.stringify(solver.stages) === JSON.stringify(expectedStages));
  });
}
