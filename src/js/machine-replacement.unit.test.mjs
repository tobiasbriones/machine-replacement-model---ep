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

import { assert, expectToThrowError, it } from './tools/test.mjs';
import { MachineReplacementModel, MachineReplacementSolver } from './machine-replacement.mjs';
import {
  getSampleData,
  getSampleModel,
  getSampleModelSolutionStages,
  getSampleModelSolutionTree
} from './machine-replacement-samples.mjs';

export const machineReplacementTest = { run };

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
}
