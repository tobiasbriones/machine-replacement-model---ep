/*
 * Copyright (C) 2019-2020 Tobias Briones. All rights reserved.
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

export const INITIAL_DECISION_YEAR = 1;
export const Decision = Object.freeze({
  KEEP: 'K',
  REPLACE: 'R',
  KEEP_OR_REPLACE: 'K or R'
});

export class MachineReplacementModel {
  #decisionYears;
  #initialAge;
  #maxAge;
  #price;
  #data;

  constructor(
    decisionYears = 0,
    initialAge = 0,
    maxAge = 0,
    price = 0,
    data = []
  ) {
    this.#decisionYears = decisionYears;
    this.#initialAge = initialAge;
    this.#maxAge = maxAge;
    this.#price = price;
    this.#data = data;

    validateModel(this);
  }

  get decisionYears() {
    return this.#decisionYears;
  }

  get initialAge() {
    return this.#initialAge;
  }

  get maxAge() {
    return this.#maxAge;
  }

  get price() {
    return this.#price;
  }

  get data() {
    return this.#data;
  }
}

export class MachineReplacementSolver {
  #model;
  #stages;
  #solutionsTree;

  constructor() {
    this.#model = new MachineReplacementModel();
    this.#solutionsTree = [];
    this.#stages = [];
  }

  get stages() {
    return this.#stages;
  }

  get solutionsTree() {
    return this.#solutionsTree;
  }

  solve(model) {
    this.#init(model);

    this.#createDecisionTree();
    this.#solveStages();
  };

  #init(model) {
    this.#model = model;
    this.#stages = [];
    this.#solutionsTree = [];
    const { decisionYears } = model;

    for (let i = 0; i < decisionYears; i++) {
      this.#solutionsTree[i] = [];
      this.#stages[i] = [];
    }
  }

  #createDecisionTree() {
    const initialNode = new TreeNode(this.#model.initialAge, INITIAL_DECISION_YEAR);
    const sortDecisionYearByAge = solutionsTree => {
      solutionsTree.forEach(element => element.sort(
        (a, b) => (a.machineAge > b.machineAge) ? 1 : -1)
      );
    };

    this.#fillPath(initialNode, INITIAL_DECISION_YEAR);
    sortDecisionYearByAge(this.#solutionsTree);
  };

  #containsNode(position, compare) {
    return this.#solutionsTree[position].some(
      e => e.decisionYear === compare.decisionYear
        && e.machineAge === compare.machineAge
    );
  };

  #solveStages() {
    const years = this.#model.decisionYears;

    for (let i = years - 1; i >= 0; i--) {
      const stage = this.#stages[i];
      const nextStage = (i < years - 1) ? this.#stages[i + 1] : null;

      this.#solveStage(stage, nextStage, i);
    }
  }

  #solveStage(stage, nextStage, i) {
    const maxMachineAge = this.#model.maxAge;
    const values = this.#solutionsTree[i];
    const lastStage = nextStage === null;
    const hasToReplaceMachine = k => k === -1;
    const getNextStageMaxByAge = age => nextStage.find(row => row.t === age).max;
    const getK = t => {
      const data = this.#model.data;

      if (t === maxMachineAge) {
        return -1;
      }
      if (lastStage) {
        return data[t].income +
          data[t + 1].sellingRevenue -
          data[t].operationCost;
      }
      const nextMax = getNextStageMaxByAge(t + 1);
      return data[t].income - data[t].operationCost + nextMax;
    };
    const getR = t => {
      const data = this.#model.data;

      if (lastStage) {
        return data[0].income +
          data[t].sellingRevenue +
          data[1].sellingRevenue -
          data[0].operationCost -
          this.#model.price;
      }
      const nextMax = getNextStageMaxByAge(1);
      return data[0].income +
        data[t].sellingRevenue -
        data[0].operationCost -
        this.#model.price +
        nextMax;
    };
    const getDecision = (k, r) => {
      if (hasToReplaceMachine(k)) {
        return Decision.REPLACE;
      }
      return (r < k) ? Decision.KEEP : ((k < r) ? Decision.REPLACE : Decision.KEEP_OR_REPLACE);
    };

    for (let j = 0; j < values.length; j++) {
      const t = values[j].machineAge;
      const k = getK(t);
      const r = getR(t);
      const max = Math.max(k, r);
      const decision = getDecision(k, r);
      stage[j] = {
        t: t,
        k: k,
        r: r,
        max: max,
        decision: decision
      };
    }
  };

  #fillPath(node, decisionYear) {
    // Basic step
    if (decisionYear > this.#model.decisionYears) {
      return;
    }
    const kNode = new TreeNode(node.machineAge + 1, decisionYear + 1);
    const rNode = new TreeNode(1, decisionYear + 1);

    // Decision year starts at 1 (subtract 1)
    if (!this.#containsNode(decisionYear - 1, node)) {
      this.#solutionsTree[decisionYear - 1].push(node);
    }

    // Recursive step
    if (kNode.machineAge <= this.#model.maxAge) {
      this.#fillPath(kNode, decisionYear + 1);
      node.k = kNode;
    }
    this.#fillPath(rNode, decisionYear + 1);
    node.r = rNode;
  };
}

class TreeNode {
  constructor(
    machineAge = 0,
    decisionYear = 0,
    k = null,
    r = null
  ) {
    this.machineAge = machineAge;
    this.decisionYear = decisionYear;
    this.k = k;
    this.r = r;
  }
}

function validateModel(model) {
  const { decisionYears, initialAge, maxAge, price } = model;
  const validateNonNegative = (value, name) => {
    if (value < 0) {
      const msg = `${ name } is a non-negative integer: ${ value }`;
      throw new Error(msg);
    }
  };

  validateNonNegative(decisionYears, 'decisionYears');
  validateNonNegative(initialAge, 'initialAge');
  validateNonNegative(maxAge, 'maxAge');
  validateNonNegative(price, 'price');
}
