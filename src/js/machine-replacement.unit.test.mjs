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

import { assert, it } from './tools/test.mjs';
import { MachineReplacementModel } from './machine-replacement.mjs';

export const machineReplacementTest = {
  run() {
    it('creates model', () => {
      const decisionYears = 4;
      const initialAge = 3;
      const maxAge = 6;
      const price = 100_000;
      const data = sampleData();
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
  }
};

export function sampleData() {
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
