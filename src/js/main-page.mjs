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

import { MachineReplacementModel, MachineReplacementSolver } from './machine-replacement.mjs';

export function init() {
  const page = new MainPage();

  page.init();
}

const yearsNextButtonId = 'yearsSubmitButton';
const solveButtonId = 'solveButton';
const yearsInputId = 'yearsInput';
const timeInputId = 'timeInput';
const initialAgeInputId = 'initialAgeInput';
const machinePriceInputId = 'machinePriceInput';

/**
 * Definitions:
 *
 * - n := years
 * - t := time
 */
class MainPage {
  #solver = new MachineReplacementSolver();
  #view;

  constructor() {
    this.#view = null;
  }

  get decisionYears() {
    return this.#integerFromInput(yearsInputId);
  }

  get time() {
    return this.#integerFromInput(timeInputId);
  }

  get initialAge() {
    return this.#integerFromInput(initialAgeInputId);
  }

  get maxAge() {
    return this.#integerFromInput(timeInputId);
  }

  get machinePrice() {
    return this.#integerFromInput(machinePriceInputId);
  }

  init() {
    this.#view = document.body;

    this.#bindEvents();
  }

  #bindEvents() {
    this.#on(yearsNextButtonId, 'click').call(this.#onYearsNextButtonClick);
    this.#on(solveButtonId, 'click').call(this.#onSolve);
  }

  #onYearsNextButtonClick() {
    const validate = () => {
      const n = this.decisionYears;
      const t = this.time;
      const initialAge = this.initialAge;
      let isValid = true;

      if (n === null || t === null) {
        const msg = 'Years (n) and time (t) values are non-negative integer numbers';
        alert(msg);
        isValid = false;
      }
      else if (n < 0 || t < 0) {
        const msg = 'Years (n) and time (t) values are non-negative';
        alert(msg);
        isValid = false;
      }
      else if (initialAge > t) {
        const msg = 'Invalid initial age';
        alert(msg);
        isValid = false;
      }
      return isValid;
    };
    if (validate()) {
      this.#setFromYearsToTabularData();
    }
  }

  #onSolve() {
    const model = this.#getModel();
    const data = this.#getData();

    if (model == null) {
      alert('Values are integer numbers');
      return;
    }
    this.#solve(model, data);
  }

  #getModel() {
    const decisionYears = this.decisionYears;
    const maxAge = this.maxAge;
    const initialAge = this.initialAge;
    const machinePrice = this.machinePrice;
    const containsNull = (...elements) => elements.find(e => e === null) === null;
    const isInputValid = () => {
      return !containsNull(
        decisionYears,
        maxAge,
        initialAge,
        machinePrice
      );
    };
    return isInputValid() ?
      new MachineReplacementModel(
        decisionYears,
        initialAge,
        maxAge,
        machinePrice
      ) :
      null;
  }

  #getData() {
    const newRow = (income, operationCost, sellingRevenue) => {
      return {
        income: income,
        operationCost: operationCost,
        sellingRevenue: sellingRevenue
      };
    };
    const data = [];
    const maxAge = this.maxAge;

    for (let t = 0; t <= maxAge; t++) {
      const income = this.#getInputValueAt(0, t);
      const operationCost = this.#getInputValueAt(1, t);
      const sellingRevenue = this.#getInputValueAt(2, t);

      data[t] = newRow(income, operationCost, sellingRevenue);
    }
    return data;
  }

  #getInputValueAt(x, y) {
    const view = this.#view;
    const inputValue = view.querySelector(`#input_${ x }_${ y }`).value;
    const input = parseInt(inputValue);

    if (isNaN(input)) {
      const msg = 'Check your input. All the tabular inputs are integer numbers!';
      alert(msg);
      return null;
    }
    return input;
  }

  #setFromYearsToTabularData() {
    const data = sampleData();
    const solveButton = this.#getViewById(solveButtonId);

    this.#generateInputTable(this.decisionYears, this.time);
    this.#generateDataTable(data);
    solveButton.classList.remove('invisible');
  }

  #setSolution() {
    const tree = this.#solver.solutionsTree;
    const stages = this.#solver.stages;
    const model = this.#getModel();
    const solution = {
      treeHtml: getSolutionsTreeHtml(tree, model),
      stagesHtml: getSolutionsStagesHtml(stages),
      chainResultHtml: getResultChainsHtml(stages, this.initialAge)
    };
    this.#setSolutionToView(solution);
  }

  #setSolutionToView(solution) {
    const solutionsTreeView = this.#view.querySelector('.solutions-tree');
    const stagesView = this.#view.querySelector('.stages');
    const chainResultView = this.#view.querySelector('.chains-container');

    solutionsTreeView.innerHTML = solution.treeHtml;
    stagesView.innerHTML = solution.stagesHtml;
    chainResultView.innerHTML = solution.chainResultHtml;
    document.getElementById('solutionPanel').classList.remove('gone');
  }

  #solve(model, data) {
    this.#solver.solve(model, data);
    this.#setSolution();
  }

  #generateInputTable(n, t) {
    const inputTable = this.#view.querySelector('#inputTable');
    inputTable.innerHTML = getInputTableHtml(n, t);
  }

  #generateDataTable(data) {
    const addRow = (t, row) => {
      const view = this.#view;
      view.querySelector(`#input_${ 0 }_${ t }`).value = row.income;
      view.querySelector(`#input_${ 1 }_${ t }`).value = row.operationCost;
      view.querySelector(`#input_${ 2 }_${ t }`).value = row.sellingRevenue;
    };
    const maxAge = this.maxAge;

    for (let t = 0; t < data.length; t++) {
      if (t > maxAge) {
        break;
      }
      const row = data[t];

      addRow(t, row);
    }
  }

  #integerFromInput(inputId) {
    const inputValue = this.#getViewById(inputId).value;
    const value = parseInt(inputValue);
    return isNaN(value) ? null : value;
  }

  #getViewById(id) {
    return this.#view.querySelector(`#${ id }`);
  }

  #on(viewId, e) {
    const viewEl = this.#getViewById(viewId);
    return {
      call: (fn) => viewEl.addEventListener(e, () => fn.call(this))
    };
  }
}

function sampleData() {
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

function getInputTableHtml(n, t) {
  const getRowHtml = y => {
    let rowHtml = '';

    for (let x = 0; x < 3; x++) {
      const id = `input_${ x }_${ y }`;
      rowHtml += `
        <td>
          <div class="form-group">
              <input value="0" type="number" class="form-control" id="${ id }">
          </div>
        </td>
      `;
    }
    return rowHtml;
  };
  let html = '';

  html += `
    <table class="table">
      <thead>
        <tr>
          <th scope="col">
            Time t (years)
          </th>
          <th scope="col">
            Income ($)
          </th>
          <th scope="col">
            Operation cost ($)
          </th>
          <th scope="col">
            Selling revenue ($)
          </th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let y = 0; y <= t; y++) {
    html += `
      <tr>
        <th scope="row">${ y }</th>
    `;
    html += getRowHtml(y);
    html += `</tr>`;
  }
  html += `</tbody></table>`;
  return html;
}

function getSolutionsTreeHtml(tree, model) {
  const { decisionYears, maxAge } = model;
  let html = '<div>';

  // Add rows from up to down
  for (let i = maxAge; i > 0; i--) {
    html += `
        <div style="width:${ decisionYears * 192 }px;">
          <div class="label">
              ${ i }
          </div>
      `;

    // Fill row for each decision year
    for (let j = 0; j < decisionYears; j++) {
      const decisionColumn = tree[j];
      let nodeValue = null;

      // Check whether there is a node in here
      for (let k = 0; k < decisionColumn.length; k++) {
        if (decisionColumn[k].machineAge === i) {
          nodeValue = decisionColumn[k];
          break;
        }
      }
      if (nodeValue !== null) {
        const kNext = nodeValue.k !== null ? nodeValue.k.machineAge : '-';
        const rNext = nodeValue.r.machineAge;

        html += `
            <div class="item">
                <div>
                    ${ nodeValue.machineAge }
                </div>
                <span>
                    (K: ${ kNext }, R: ${ rNext })
                </span>
            </div>
          `;
      }
      else {
        html += `<div class="item invisible"></div>`;
      }
    }
    html += '</div>';
  }
  html += `
      <div style="width:${ decisionYears * 192 }px;">
        <div class="label"></div>
    `;

  // Fill row for each decision year
  for (let j = 1; j <= decisionYears; j++) {
    html += `
        <div class="item label">
            <div>
                ${ j }
            </div>
        </div>
        `;
  }
  html += '</div>';
  html += '</div>';
  return html;
}

function getSolutionsStagesHtml(stages) {
  let html = '';

  for (let i = stages.length; i > 0; i--) {
    const stage = stages[i - 1];
    html += `
        <p>STAGE ${ i }</p>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">t</th>
              <th scope="col">K</th>
              <th scope="col">R</th>
              <th scope="col">max</th>
              <th scope="col">Decision</th>
            </tr>
          </thead>
          <tbody>
      `;

    stage.forEach(row => {
      html += `
          <tr>
            <th scope="row">${ row.t }</th>
            <td>${ row.k }</td>
            <td>${ row.r }</td>
            <td>${ row.max }</td>
            <td>${ row.decision }</td>
          </tr>
        `;
    });
    html += '</tbody></table>';
  }
  return html;
}

function getResultChainsHtml(stages, initialAge) {
  const getRow = (i, t) => stages[i].find(stage => stage.t === t);
  const chains = [];
  const htmlChains = [];

  getDecision(0, initialAge, chains);
  getChainsHtml({ chainValue: null, htmlValue: '' }, chains, htmlChains);
  let html = '';

  //chainsHTML.pop(); // Don't need the last
  htmlChains.forEach(chain => {
    html += chain;
  });
  return html;

  function getDecision(start, t, chains) {
    if (start >= stages.length) {
      return;
    }
    const decision = getRow(start, t).decision;
    let age = t;

    switch (decision) {
      case 'K':
        age += 1;
        break;

      case 'R':
        age = 1;
        break;

      case 'K or R':
        const newChainK = [];
        const newChainR = [];

        getDecision(start + 1, age + 1, newChainK);
        getDecision(start + 1, 1, newChainR);
        chains.push(
          {
            k: newChainK,
            r: newChainR
          }
        );
        return;
    }
    chains.push(decision);
    getDecision(start + 1, age, chains);
  }

  function getChainsHtml(value, chains, htmlChains) {
    const getChainHtml = chain => `<span>${ chain }</span>`;
    const htmlStart = `<div class="chain">`;
    const htmlEnd = `<div class="end">SELL</div></div>`;
    const chainValue = value.chainValue;
    let chainHtml = value.htmlValue;

    if (chainHtml === '') {
      chainHtml = htmlStart;
    }
    if (chainValue !== null) {
      chainHtml += getChainHtml(chainValue);
    }
    chains.forEach(chain => {
      if (typeof chain === 'string') {
        chainHtml += getChainHtml(chain);
      }
      else {
        getChainsHtml(
          { chainValue: 'K', htmlValue: chainHtml },
          chain.k,
          htmlChains
        );
        getChainsHtml(
          { chainValue: 'R', htmlValue: chainHtml },
          chain.r,
          htmlChains
        );
      }
    });
    chainHtml += htmlEnd;
    htmlChains.push(chainHtml);
  }

}
