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

const chainValueK = 'K';
const chainValueR = 'R';
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
  #solver;
  #view;

  constructor() {
    this.#solver = new MachineReplacementSolver();
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
      treeEl: getSolutionTreeEl(tree, model),
      stagesEl: getSolutionStagesEl(stages),
      chainResultHtml: getResultChainsHtml(stages, this.initialAge)
    };
    this.#setSolutionToView(solution);
  }

  #setSolutionToView(solution) {
    const solutionsTreeView = this.#view.querySelector('.solutions-tree');
    const stagesView = this.#view.querySelector('.stages');
    const chainResultView = this.#view.querySelector('.chains-container');

    solutionsTreeView.appendChild(solution.treeEl);
    stagesView.appendChild(solution.stagesEl);
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

function getSolutionTreeEl(tree, model) {
  const getRowEl = () => {
    const rowEl = document.createElement('div');

    rowEl.style.width = `${ decisionYears * 192 }px`;
    return rowEl;
  };

  const getRowLabelEl = machineAge => {
    const el = document.createElement('div');

    el.classList.add('label');
    el.innerText = machineAge;
    return el;
  };

  const appendXAxisRowEl = el => {
    const rowEl = getRowEl();

    appendXAxisLabelNodes(rowEl);
    el.appendChild(rowEl);
  };

  const { decisionYears, maxAge } = model;
  const el = document.createElement('div');

  for (let y = maxAge; y > 0; y--) {
    const rowEl = getRowEl();

    setRowEl(rowEl, y);
    el.appendChild(rowEl);
  }

  appendXAxisRowEl(el);
  return el;

  function setRowEl(rowEl, machineAge) {
    const rowLabelEl = getRowLabelEl(machineAge);

    rowEl.appendChild(rowLabelEl);
    appendTreeNodes(rowEl, machineAge);
  }

  function appendTreeNodes(rowEl, machineAge) {
    for (let x = 0; x < decisionYears; x++) {
      const decisionColumn = tree[x];
      const nodeValue = getNodeValue(machineAge, decisionColumn);

      if (nodeValue === null) {
        const invisibleItemEl = document.createElement('div');

        invisibleItemEl.classList.add('item');
        invisibleItemEl.classList.add('invisible');
        rowEl.appendChild(invisibleItemEl);
      }
      else {
        const kNext = nodeValue.k !== null ? nodeValue.k.machineAge : '-';
        const rNext = nodeValue.r.machineAge;
        const itemEl = document.createElement('div');
        const itemMachineAgeEl = document.createElement('div');
        const itemPairValueEl = document.createElement('span');

        itemMachineAgeEl.innerText = nodeValue.machineAge.toString();
        itemPairValueEl.innerText = `(K: ${ kNext }, R: ${ rNext })`;
        itemEl.classList.add('item');
        itemEl.appendChild(itemMachineAgeEl);
        itemEl.appendChild(itemPairValueEl);
        rowEl.appendChild(itemEl);
      }
    }
  }

  function appendXAxisLabelNodes(rowEl) {
    for (let x = 1; x <= decisionYears; x++) {
      const itemEl = document.createElement('div');
      const xAxisLabelEl = document.createElement('div');

      xAxisLabelEl.innerText = x.toString();
      itemEl.classList.add('item');
      itemEl.classList.add('label');
      itemEl.appendChild(xAxisLabelEl);
      rowEl.appendChild(itemEl);
    }
  }

  function getNodeValue(machineAge, decisionColumn) {
    let nodeValue = null;

    for (let k = 0; k < decisionColumn.length; k++) {
      if (decisionColumn[k].machineAge === machineAge) {
        nodeValue = decisionColumn[k];
        break;
      }
    }
    return nodeValue;
  }
}

function getSolutionStagesEl(stages) {
  const appendTitle = (el, stageNumber) => el.appendChild(getStageTitleEl(stageNumber));
  const appendTable = (el, stage) => el.appendChild(getTableEL(stage));
  const el = document.createElement('div');

  for (let i = stages.length; i > 0; i--) {
    const stage = stages[i - 1];

    appendTitle(el, i);
    appendTable(el, stage);
  }
  return el;

  function getStageTitleEl(stageNumber) {
    const el = document.createElement('p');

    el.innerText = `STAGE ${ stageNumber.toString() }`;
    return el;
  }

  function getTableEL(stage) {
    const el = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const tbody = document.createElement('tbody');

    el.classList.add('table');
    tr.appendChild(getThEl('t'));
    tr.appendChild(getThEl('K'));
    tr.appendChild(getThEl('R'));
    tr.appendChild(getThEl('max'));
    tr.appendChild(getThEl('Decision'));
    thead.appendChild(tr);
    el.appendChild(thead);

    for (const row of stage) {
      tbody.appendChild(getTrEl(row));
    }
    el.appendChild(tbody);
    return el;
  }

  function getThEl(value) {
    const el = document.createElement('th');

    el.attributes.scope = 'col';
    el.innerText = value;
    return el;
  }

  function getTrEl(row) {
    const el = document.createElement('tr');
    const thEl = document.createElement('th');

    thEl.attributes.scope = 'row';
    thEl.innerText = row.t.toString();
    el.appendChild(thEl);
    el.appendChild(getTdEl(row.k));
    el.appendChild(getTdEl(row.r));
    el.appendChild(getTdEl(row.max));
    el.appendChild(getTdEl(row.decision));
    return el;
  }

  function getTdEl(value) {
    const el = document.createElement('td');

    el.innerText = value.toString();
    return el;
  }
}

function getResultChainsHtml(stages, initialAge) {
  const getRow = (i, t) => stages[i].find(stage => stage.t === t);
  const chains = [];

  getDecision(0, initialAge, chains);
  const chainsElement = getChainsEl(chains);
  let html = chainsElement.innerHTML;

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

  function getChainsEl(chains) {
    const el = getChainsParentElement();

    collectSingleChainElements(el, chains);
    return el;

    function getChainsParentElement() {
      return document.querySelector('.chains-container');
    }
  }

  function collectSingleChainElements(parentEl, chains) {
    const initialChainEl = getSingleChainParentEl();

    appendSingleChainElements(parentEl, initialChainEl, chains);

    function getSingleChainParentEl() {
      const el = document.createElement('div');
      el.classList.add('chain');
      return el;
    }
  }

  function appendSingleChainElements(parentEl, singleChainParentEl, chains) {
    const isChainValue = chainItem => typeof chainItem === 'string';
    const getChainValueEl = chainValue => getSpanEl(chainValue);
    const appendSingleChainFinalChild = el => el.appendChild(getFinalChild());
    const appendSingleChainChild = (el, chainValue) => el.appendChild(getChainValueEl(chainValue));
    const appendSingleChain = (parentEl, singleChainEl) => parentEl.appendChild(singleChainEl);
    const appendChainRecursive = (parentEl, singleChainParentEl, chainValue, chains) => {
      appendSingleChainChild(singleChainParentEl, chainValue);
      appendSingleChainElements(parentEl, singleChainParentEl, chains);
    };
    const appendComposedChainRecursive = (parentEl, singleChainParentEl, chainItem) => {
      const newSingleChainEl = copyOf(singleChainParentEl);

      appendChainRecursive(parentEl, singleChainParentEl, chainValueK, chainItem.k);
      appendChainRecursive(parentEl, newSingleChainEl, chainValueR, chainItem.r);
    };
    let isSingleChainParentElDone = false;

    for (const chainItem of chains) {
      if (isChainValue(chainItem)) {
        appendSingleChainChild(singleChainParentEl, chainItem);
      }
      else {
        appendComposedChainRecursive(parentEl, singleChainParentEl, chainItem);
        isSingleChainParentElDone = true;
      }
    }
    if (!isSingleChainParentElDone) {
      appendSingleChainFinalChild(singleChainParentEl);
      appendSingleChain(parentEl, singleChainParentEl);
    }

    function copyOf(el) {
      return el.cloneNode(true);
    }

    function getSpanEl(text) {
      const el = document.createElement('span');
      el.innerText = text;
      return el;
    }

    function getFinalChild() {
      const el = document.createElement('div');
      el.classList.add('end');
      el.innerText = 'SELL';
      return el;
    }
  }
}
