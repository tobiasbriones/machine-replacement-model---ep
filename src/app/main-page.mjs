/*
 * Copyright (c) 2019-2022 Tobias Briones. All rights reserved.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Example Project: Machine Replacement Model.
 *
 * This source code is licensed under the GNU General Public License v3.0 or
 * later License found in the LICENSE file in the root directory of this source
 * tree or at https://opensource.org/licenses/GPL-3.0.
 */

import { getSampleModel } from '../model/machine-replacement-samples.mjs';
import {
  Decision,
  MachineReplacementModel,
  MachineReplacementSolver
} from '../model/machine-replacement.mjs';
import { clear, deepCopyOf, getSpanEl } from './tools/gui-utils.mjs';

const yearsNextButtonId = 'yearsSubmitButton';
const solveButtonId = 'solveButton';
const yearsInputId = 'yearsInput';
const timeInputId = 'timeInput';
const initialAgeInputId = 'initialAgeInput';
const machinePriceInputId = 'machinePriceInput';

/**
 * Manages the application based on pure HTML and JS DOM APIs.
 *
 * @author Tobias Briones
 */
export class MainPage {
  #solver;
  #sampleModel;
  #view;
  #solutionsTreeView;
  #stagesView;
  #chainResultView;

  constructor() {
    this.#solver = new MachineReplacementSolver();
    this.#sampleModel = getSampleModel();
    this.#view = null;
    this.#solutionsTreeView = null;
    this.#solutionsTreeView = null;
    this.#stagesView = null;
    this.#chainResultView = null;
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
    this.#solutionsTreeView = this.#view.querySelector('.solutions-tree');
    this.#stagesView = this.#view.querySelector('.stages');
    this.#chainResultView = this.#view.querySelector('.chains-container');

    this.#bindEvents();
    this.#setSampleModelInitialValues();
  }

  #bindEvents() {
    this.#on(yearsNextButtonId, 'click')
        .call(this.#onYearsNextButtonClick);
    this.#on(solveButtonId, 'click')
        .call(this.#onSolve);
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

    if (model !== null) {
      this.#solve(model);
    }
  }

  #getModel() {
    const decisionYears = this.decisionYears;
    const maxAge = this.maxAge;
    const initialAge = this.initialAge;
    const machinePrice = this.machinePrice;
    const containsNull = (...elements) => elements.find(e => e === null) === null;
    const isInputSet = () => {
      return !containsNull(
        decisionYears,
        maxAge,
        initialAge,
        machinePrice
      );
    };
    let model = null;

    if (isInputSet()) {
      model = this.#getModelProvidedInputIsSet();
    }
    return model;
  }

  #getModelProvidedInputIsSet() {
    let model;

    try {
      model = new MachineReplacementModel(
        this.decisionYears,
        this.initialAge,
        this.maxAge,
        this.machinePrice,
        this.#getData()
      );
    }
    catch (error) {
      alert(error);
      model = null;
    }
    return model;
  }

  #getData() {
    const data = [];
    const maxAge = this.maxAge;
    const newRow = (income, operationCost, sellingRevenue) => {
      return {
        income: income,
        operationCost: operationCost,
        sellingRevenue: sellingRevenue
      };
    };

    for (let t = 0; t <= maxAge; t++) {
      const income = this.#getInputValueAt(0, t);
      const operationCost = this.#getInputValueAt(1, t);
      const sellingRevenue = this.#getInputValueAt(2, t);

      if (income
        === null
        || operationCost
        === null
        || sellingRevenue
        === null) {
        return [];
      }
      data[t] = newRow(income, operationCost, sellingRevenue);
    }
    return data;
  }

  #getInputValueAt(x, y) {
    const view = this.#view;
    const inputValue = view.querySelector(`#input_${ x }_${ y }`).value;
    const input = parseInt(inputValue);
    const validate = input => {
      const isValid = !isNaN(input);

      if (!isValid) {
        const msg = 'Check your input. All the tabular inputs are integer numbers!';
        alert(msg);
      }
      return isValid;
    };
    return validate(input) ? input : null;
  }

  #setFromYearsToTabularData() {
    const solveButton = this.#getViewById(solveButtonId);

    this.#setInputTableEl(this.decisionYears, this.time);
    this.#setSampleModelData();
    solveButton.classList.remove('invisible');
  }

  #setInputTableEl(n, t) {
    const inputTable = this.#view.querySelector('#inputTable');

    clear(inputTable);
    inputTable.appendChild(getInputTableEl(t));
  }

  #setSolution() {
    const tree = this.#solver.solutionsTree;
    const stages = this.#solver.stages;
    const model = this.#getModel();
    const solution = {
      treeEl: getSolutionTreeEl(tree, model),
      stagesEl: getSolutionStagesEl(stages),
      resultChainsEl: getResultChainsEl(stages, this.initialAge)
    };
    this.#setSolutionToView(solution);
  }

  #setSolutionToView(solution) {
    this.#clearSolutionView();
    this.#solutionsTreeView.appendChild(solution.treeEl);
    this.#stagesView.appendChild(solution.stagesEl);
    this.#chainResultView.appendChild(solution.resultChainsEl);
    document.getElementById('solutionPanel')
            .classList
            .remove('gone');
  }

  #setSampleModelInitialValues() {
    this.#getViewById(yearsInputId).value = this.#sampleModel.decisionYears;
    this.#getViewById(timeInputId).value = this.#sampleModel.maxAge;
    this.#getViewById(initialAgeInputId).value = this.#sampleModel.initialAge;
    this.#getViewById(machinePriceInputId).value = this.#sampleModel.price;
  }

  #setSampleModelData() {
    const data = this.#sampleModel.data;

    this.#generateDataTable(data);
  }

  #solve(model) {
    this.#solver.solve(model);
    this.#setSolution();
  }

  #generateDataTable(data) {
    const maxAge = this.maxAge;
    const addRow = (t, row) => {
      const view = this.#view;
      view.querySelector(`#input_${ 0 }_${ t }`).value = row.income;
      view.querySelector(`#input_${ 1 }_${ t }`).value = row.operationCost;
      view.querySelector(`#input_${ 2 }_${ t }`).value = row.sellingRevenue;
    };

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

  #clearSolutionView() {
    clear(this.#solutionsTreeView);
    clear(this.#stagesView);
    clear(this.#chainResultView);
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

function getInputTableEl(time) {
  return (
    () => {
      const el = document.createElement('table');
      const tHeadEl = getTheadEl();
      const tBodyEl = getTbodyEl(time);

      el.classList.add('table');
      el.appendChild(tHeadEl);
      el.appendChild(tBodyEl);
      return el;
    }
  )();

  function getTheadEl() {
    const el = document.createElement('thead');
    const trEl = document.createElement('tr');

    trEl.appendChild(getThEl('Time t (years)'));
    trEl.appendChild(getThEl('Income ($)'));
    trEl.appendChild(getThEl('Operation cost ($)'));
    trEl.appendChild(getThEl('Selling revenue ($)'));
    el.appendChild(trEl);
    return el;
  }

  function getThEl(text) {
    const el = document.createElement('th');

    el.setAttribute('scope', 'col');
    el.innerText = text;
    return el;
  }

  function getTbodyEl(t) {
    const el = document.createElement('tbody');

    for (let y = 0; y <= t; y++) {
      const trEl = document.createElement('tr');
      const thEl = document.createElement('th');

      thEl.setAttribute('scope', 'row');
      thEl.innerText = y.toString();
      trEl.appendChild(thEl);
      setRowEl(trEl, y);
      el.appendChild(trEl);
    }
    return el;
  }

  function setRowEl(rowEl, y) {
    for (let x = 0; x < 3; x++) {
      const id = `input_${ x }_${ y }`;
      const tdEl = document.createElement('td');
      const divEl = document.createElement('div');
      const inputEl = document.createElement('input');

      divEl.classList.add('form-group');
      inputEl.id = id;
      inputEl.classList.add('form-control');
      inputEl.value = '0px';
      inputEl.type = 'number';
      divEl.appendChild(inputEl);
      tdEl.appendChild(divEl);
      rowEl.appendChild(tdEl);
    }
  }
}

/**
 * Returns and computes the rendered element with the solutions tree.
 *
 * It uses the DOM APIs to build the tree.
 *
 * @param tree solutions tree
 * @param model machine replacement model
 * @returns {HTMLDivElement} the rendered element with the solutions tree
 */
function getSolutionTreeEl(tree, model) {
  return (
    () => {
      const el = document.createElement('div');
      const { maxAge } = model;

      for (let y = maxAge; y > 0; y--) {
        const rowEl = getRowEl();

        setRowEl(rowEl, y);
        el.appendChild(rowEl);
      }
      appendXAxisRowEl(el);
      return el;
    }
  )();

  function getRowEl() {
    const el = document.createElement('div');
    const { decisionYears } = model;

    el.style.width = `${ decisionYears * 192 }px`;
    return el;
  }

  function setRowEl(rowEl, machineAge) {
    const rowLabelEl = getRowLabelEl(machineAge);

    rowEl.appendChild(rowLabelEl);
    appendTreeNodes(rowEl, machineAge);
  }

  function getRowLabelEl(machineAge) {
    const el = document.createElement('div');

    el.classList.add('label');
    el.innerText = machineAge;
    return el;
  }

  function appendXAxisRowEl(el) {
    const rowEl = getRowEl();

    appendXAxisLabelNodes(rowEl);
    el.appendChild(rowEl);
  }

  function appendTreeNodes(rowEl, machineAge) {
    const { decisionYears } = model;

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
    const { decisionYears } = model;

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
    let index = -1;

    for (let k = 0; k < decisionColumn.length; k++) {
      if (decisionColumn[k].machineAge === machineAge) {
        index = k;
        break;
      }
    }
    return (index !== -1) ? decisionColumn[index] : null;
  }
}

/**
 * Returns and computes the rendered element containing the problem development.
 *
 * It uses the DOM APIs to build the element.
 *
 * @param stages problem solution stages
 * @returns {HTMLDivElement} the rendered element containing the problem development
 */
function getSolutionStagesEl(stages) {
  return (
    () => {
      const appendTitle = (el, stageNumber) => el.appendChild(getStageTitleEl(stageNumber));
      const appendTable = (el, stage) => el.appendChild(getTableEL(stage));
      const el = document.createElement('div');

      for (let i = stages.length; i > 0; i--) {
        const stage = stages[i - 1];

        appendTitle(el, i);
        appendTable(el, stage);
      }
      return el;
    }
  )();

  function getStageTitleEl(stageNumber) {
    const el = document.createElement('p');

    el.innerText = `STAGE ${ stageNumber.toString() }`;
    return el;
  }

  function getTableEL(stage) {
    const el = document.createElement('table');
    const theadEl = document.createElement('thead');
    const trEl = document.createElement('tr');
    const tbodyEl = document.createElement('tbody');

    el.classList.add('table');
    trEl.appendChild(getThEl('t'));
    trEl.appendChild(getThEl('K'));
    trEl.appendChild(getThEl('R'));
    trEl.appendChild(getThEl('max'));
    trEl.appendChild(getThEl('Decision'));
    theadEl.appendChild(trEl);
    el.appendChild(theadEl);

    for (const row of stage) {
      tbodyEl.appendChild(getTrEl(row));
    }
    el.appendChild(tbodyEl);
    return el;
  }

  function getThEl(value) {
    const el = document.createElement('th');

    el.setAttribute('scope', 'col');
    el.innerText = value;
    return el;
  }

  function getTrEl(row) {
    const el = document.createElement('tr');
    const thEl = document.createElement('th');

    thEl.setAttribute('scope', 'row');
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

/**
 * Returns and computes the rendered element representing the problem's
 * solution as a chain of options (K, R) with all the possible branches if
 * there is a (K or R) solution (one if K and the other if R).
 *
 * It uses the DOM APIs and recursion to build the element.
 *
 * @param stages problem solution stages
 * @param initialAge machine initial age
 * @returns {HTMLDivElement} the rendered element representing the problem's
 * solution
 */
function getResultChainsEl(stages, initialAge) {
  return (
    () => {
      const chains = [];

      collectDecisionChains(chains, 0, initialAge);
      return getChainsEl(chains);
    }
  )();

  function getChainsEl(chains) {
    const el = getChainsParentElement();

    collectSingleChainElements(el, chains);
    return el;
  }

  function getChainsParentElement() {
    return document.createElement('div');
  }

  function getSingleChainParentEl() {
    const el = document.createElement('div');

    el.classList.add('chain');
    return el;
  }

  function getRow(i, t) {
    return stages[i].find(stage => stage.t === t);
  }

  function getSingleChainFinalChild() {
    const el = document.createElement('div');

    el.classList.add('end');
    el.innerText = 'SELL';
    return el;
  }

  function collectDecisionChains(chains, start, time) {
    if (start >= stages.length) {
      return;
    }
    const decision = getRow(start, time).decision;
    let age = time;

    switch (decision) {
      case Decision.KEEP:
        age += 1;
        break;

      case Decision.REPLACE:
        age = 1;
        break;

      case Decision.KEEP_OR_REPLACE:
        const newChainK = [];
        const newChainR = [];

        collectDecisionChains(newChainK, start + 1, age + 1);
        collectDecisionChains(newChainR, start + 1, 1);
        chains.push(
          {
            k: newChainK,
            r: newChainR
          }
        );
        return;
    }
    chains.push(decision);
    collectDecisionChains(chains, start + 1, age);
  }

  function collectSingleChainElements(parentEl, chains) {
    const initialChainEl = getSingleChainParentEl();

    appendSingleChainElements(parentEl, initialChainEl, chains);
  }

  function appendSingleChainElements(parentEl, singleChainParentEl, chains) {
    let isSingleChainParentElDone = false;

    const isChainValue = chainItem => typeof chainItem === 'string';
    const getChainValueEl = chainValue => getSpanEl(chainValue);
    const appendSingleChainFinalChild = el => el.appendChild(getSingleChainFinalChild());
    const appendSingleChainChild = (el, chainValue) => el.appendChild(getChainValueEl(chainValue));
    const appendSingleChain = (parentEl, singleChainEl) => parentEl.appendChild(singleChainEl);
    const appendChainRecursive = (parentEl, singleChainParentEl, chainValue, chains) => {
      appendSingleChainChild(singleChainParentEl, chainValue);
      appendSingleChainElements(parentEl, singleChainParentEl, chains);
    };
    const appendComposedChainRecursive = (parentEl, singleChainParentEl, chainItem) => {
      const newSingleChainEl = deepCopyOf(singleChainParentEl);

      appendChainRecursive(
        parentEl,
        singleChainParentEl,
        Decision.KEEP,
        chainItem.k
      );
      appendChainRecursive(
        parentEl,
        newSingleChainEl,
        Decision.REPLACE,
        chainItem.r
      );
    };

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
  }
}
