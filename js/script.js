/*
 * This file is part of Machine Replacement Model.
 *
 * Machine Replacement Model is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Machine Replacement Model is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Machine Replacement Model.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * This script handles the application in general.
 * 
 * Machine Replacement Model <https://github.com/TobiasBriones/MachineReplacementModel>
 * Author: Tobias Briones <tobiasbrionesdev@gmail.com>
 * Copyright (C) 2019 Tobias Briones
 **/

const solver = new Solver();

// Input table
const generateInputTable = (n, t) => {
    var html = '';
    
    html += `<table class="table">
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
                <tbody>`;
    for(let y = 0; y <= t; y++) {
        html += `<tr>
                    <th scope="row">${y}</th>`;
        for(let x = 0; x < 3; x++) {
            const id = `input_${x},${y}`;
            html += `<td>
                        <div class="form-group">
                            <input value="0" type="number" class="form-control" id="${id}">
                        </div>
                    </td>`;
        }
        html += `</tr>`;
    }
    html += `</tbody>
            </table>`;
    document.getElementById('inputTable').innerHTML = html;
}

const getInputValueAt = (x, y) => {
    const inputValue = document.getElementById(`input_${x},${y}`).value;
    const input = parseInt(inputValue);
    
    if(isNaN(input)) {
        alert('All the inputs are integer numbers!');
        return;
    }
    return input;
}

const generateDataTable = (data) => {
    const maxAge = parseInt(document.getElementById('timeInput').value);
    for(let t = 0; t < data.length; t++) {
        if(t > maxAge) break;
        const row = data[t];
        document.getElementById(`input_${0},${t}`).value = row.income;
        document.getElementById(`input_${1},${t}`).value = row.operationCost;
        document.getElementById(`input_${2},${t}`).value = row.sellingRevenue;
    }
}

// Evenets
const onYearsInput = () => {
    const nInput = document.getElementById('yearsInput').value;
    const tInput = document.getElementById('timeInput').value;
    const initialAgeInput = document.getElementById('initialAgeInput').value;
    const n = parseInt(nInput);
    const t = parseInt(tInput);
    const initialAge = parseInt(initialAgeInput);
    
    if(isNaN(n) || isNaN(t)) {
        alert("Invalid number");
        return;
    }
    if(initialAge > t) {
        alert("Invalid initial age");
        return;
    }
    generateInputTable(n, t);
    document.getElementById('solveButton').classList.remove('invisible');
    
    // Generate sample data
    const newRow = (income, operationCost, sellingRevenue) => {
        return {
            income: income,
            operationCost: operationCost,
            sellingRevenue: sellingRevenue
        };
    }
    // const data1 = [
    //     newRow(21000, 210, -1),
    //     newRow(19500, 600, 60000),
    //     newRow(18500, 1300, 45000),
    //     newRow(17200, 1500, 42000),
    //     newRow(15500, 1750, 26000),
    //     newRow(14500, 1900, 10000),
    //     newRow(11200, 2100, 5000),
    // ];
    const data = [
        newRow(20000, 200, -1),
        newRow(19000, 600, 80000),
        newRow(18500, 1200, 60000),
        newRow(17200, 1500, 50000),
        newRow(15500, 1700, 30000),
        newRow(14000, 1800, 10000),
        newRow(12200, 2200, 5000),
    ];
    
    generateDataTable(data);
}

const onSolve = () => {
    const decisionYearsInput = document.getElementById('yearsInput').value;
    const maxAgeInput = document.getElementById('timeInput').value;
    const initialAgeInput = document.getElementById('initialAgeInput').value;
    const machinePriceInput = document.getElementById('machinePrice').value;
    const decisionYears = parseInt(decisionYearsInput);
    const maxAge = parseInt(maxAgeInput);
    const initialAge = parseInt(initialAgeInput);
    const machinePrice = parseInt(machinePriceInput);
    const getData = () => {
        const newRow = (income, operationCost, sellingRevenue) => {
            return {
                income: income,
                operationCost: operationCost,
                sellingRevenue: sellingRevenue
            };
        }
        const data = [];
        
        for(let t = 0; t <= maxAge; t++) {
            const income = getInputValueAt(0, t);
            const operationCost = getInputValueAt(1, t);
            const sellingRevenue = getInputValueAt(2, t);
            
            data[t] = newRow(income, operationCost, sellingRevenue);
        }
        return data;
    }
    const generateSolutionsTree = tree => {
        var html = '<div>';
        
        // Add rows from up to down
        for(let i = maxAge; i > 0; i--) {
            html += `<div style="width:${decisionYears * 192}px">
                        <div class="label">
                            ${i}
                        </div>`;
            
            // Fill row for each decision year
            for(let j = 0; j < decisionYears; j++) {
                const decisionColumn = tree[j];
                let nodeValue = null;
                
                // Check whether there is a node in here
                for(let k = 0; k < decisionColumn.length; k++) {
                    if(decisionColumn[k].machineAge == i) {
                        nodeValue = decisionColumn[k];
                        break;
                    }
                }
                if(nodeValue != null) {
                    const kNext = nodeValue.k != null ? nodeValue.k.machineAge : '-';
                    const rNext = nodeValue.r.machineAge;
                    
                    html += `<div class="item">
                                <div>
                                    ${nodeValue.machineAge}
                                </div>
                                <span>
                                    (K: ${kNext}, R: ${rNext})
                                </span>
                            </div>`;
                }
                else {
                    html += `<div class="item invisible"></div>`;
                }
            }
            html += '</div>';
        }
        html += `<div style="width:${decisionYears * 192}px">
                        <div class="label"></div>`;
        
        // Fill row for each decision year
        for(let j = 1; j <= decisionYears; j++) {
            html += `<div class="item label">
                        <div>
                            ${j}    
                        </div>
                    </div>`;
        }
        html += '</div>';
        html += '</div>';
        document.getElementsByClassName('solutions-tree')[0].innerHTML = html;
    }
    const generateSolutionsStages = stages => {
        var html = '';
        
        for(let i = stages.length; i > 0; i--) {
            const stage = stages[i - 1];
            html += `<p>STAGE ${i}</p>
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
                        <tbody>`;
            
            stage.forEach(row => {
                html += `<tr>
                            <th scope="row">${row.t}</th>
                            <td>${row.k}</td>
                            <td>${row.r}</td>
                            <td>${row.max}</td>
                            <td>${row.decision}</td>
                        </tr>`;
            });
            html += '</tbody></table>';
        }
        document.getElementsByClassName('stages')[0].innerHTML = html;
    }
    const generateResult = (stages, initialAge) => {
        const getRow = (i, t) => stages[i].find(stage => stage.t == t);
        const chains = [];
        const chainsHTML = [];
        const getDecision = (start, t, chains) => {
            if(start >= stages.length) return;
            const decision = getRow(start, t).decision;
            var age = t;
            
            switch(decision) {
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
                    chains.push({
                        k: newChainK,
                        r: newChainR
                    });
                    return;
            }
            chains.push(decision);
            getDecision(start + 1, age, chains);
        }
        const getChainsHTML = (chains, html, initial) => {
            const start = `<div class="chain">`;
            const end = `<div class="end">SELL</div></div>`;
            
            if(html == '') {
                html = start;
            }
            if(initial != null) {
                html += `<span>${initial}</span>`;
            }
            chains.forEach(e => {
                if(typeof e == 'string') {
                    html += `<span>${e}</span>`;
                }
                else {
                    getChainsHTML(e.k, html, 'K');
                    getChainsHTML(e.r, html, 'R');
                    return;
                }
            });
            html += end;
            chainsHTML.push(html);
        }
        getDecision(0, initialAge, chains);
        getChainsHTML(chains, '', null);
        var html = '';
        
        //chainsHTML.pop(); // Don't need the last
        chainsHTML.forEach(chain => html += chain);
        document.querySelector('.chains-container').innerHTML = html;
    }
    if(isNaN(decisionYears) || isNaN(initialAge) || isNaN(maxAge) || isNaN(machinePrice)) {
        alert('Values are integer numbers');
        return;
    }
    const data = getData();
    
    /*console.log(`Solving problem
                decision years: ${decisionYears}
                initial age: ${initialAge},
                maximum age: ${maxAge},
                machine price: ${machinePrice},
                data: \n${JSON.stringify(data)}`);*/
    solver.solve(decisionYears, initialAge, maxAge, machinePrice, data);
    
    // UI
    const tree = solver.solutionsTree();
    const stages = solver.stages();
    
    /*console.log(`Solutions tree \n${JSON.stringify(tree)}`);
    console.log(`Stages \n${JSON.stringify(stages)}`);*/
    generateSolutionsTree(tree);
    generateSolutionsStages(stages);
    generateResult(stages, initialAge);
    document.getElementById('solutionPanel').classList.remove('gone');
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('yearsSubmitButton').addEventListener('click', onYearsInput);
    document.getElementById('solveButton').addEventListener('click', onSolve);
});