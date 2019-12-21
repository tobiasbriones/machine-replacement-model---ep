/*
 * This file is part of example.math.or.model.web.machine_replacement = Machine Replacement Model.
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

/*
 * Copyright (c) 2019 Tobias Briones
 */

/**
 * Implements a solver for the model to be used in the application.
 */
function Solver() {
    
    var decisionYears = -1;
    var initialMachineAge = -1;
    var maxMachineAge = -1;
    var newMachinePrice = -1;
    var data = null;
    var decisionYearArray = null;
    var stages = null;
    
    const containsNode = (position, compare) => {
        return decisionYearArray[position].some(
            e => e.decisionYear == compare.decisionYear
                && e.machineAge == compare.machineAge);
    }
    
    const newTreeNode = (machineAge, decisionYear) => {
        return {
            machineAge: machineAge,
            decisionYear: decisionYear,
            k: null,
            r: null
        };
    }
    
    const newStage = (t) => {
        return {
            t: t,
            
        };
    }
    
    const fillPath = (node, decisionYear) => {
        // Basic step
        if(decisionYear > decisionYears) {
            return;
        }
        const kNode = newTreeNode(node.machineAge + 1, decisionYear + 1);
        const rNode = newTreeNode(1, decisionYear + 1);
        
        // Decision year starts at 1 (substract 1)
        if(!containsNode(decisionYear - 1, node)) {
            decisionYearArray[decisionYear - 1].push(node);
        }
        
        // Recursive step
        if(kNode.machineAge <= maxMachineAge) {
            fillPath(kNode, decisionYear + 1);
            node.k = kNode;
        }
        fillPath(rNode, decisionYear + 1);
        node.r = rNode;
    }
    
    const createDecisionTree = () => {
        // It starts from position 1
        const initialNode = newTreeNode(initialMachineAge, 1);
        
        /*console.log(`Solving tree for: 
                    initial age ${initialMachineAge},
                    decision years: ${decisionYears},
                    maximum age: ${maxMachineAge}`);*/
        
        fillPath(initialNode, 1);
        
        // Sort each decision year by age
        decisionYearArray.forEach(element => element.sort((a, b) => (a.machineAge > b.machineAge) ? 1 : -1));
    }
    
    const solveStage = (stage, nextStage, i) => {
        const values = decisionYearArray[i];
        const lastStage = nextStage == null;
        const getNextStageMaxByAge = age => nextStage.find(row => row.t == age).max;
        const getK = t => {
            if(t == maxMachineAge) return -1;
            if(lastStage) {
                return data[t].income + data[t + 1].sellingRevenue - data[t].operationCost;
            }
            const nextMax = getNextStageMaxByAge(t + 1);
            return data[t].income - data[t].operationCost + nextMax;
        }
        const getR = t => {
            if(lastStage) {
                return data[0].income + data[t].sellingRevenue + data[1].sellingRevenue - data[0].operationCost - newMachinePrice;
            }
            const nextMax = getNextStageMaxByAge(1);
            return data[0].income + data[t].sellingRevenue - data[0].operationCost - newMachinePrice + nextMax;
        }
        const getDecision = (k, r) => {
            // If k = -1 then the machine is old to replace
            if(k == -1) {
                return 'R';
            }
            return (r < k) ? 'K' : ((k < r) ? 'R' : 'K or R');
        }
        /*console.log('Solving stage ' + i)
        console.log(values)
        console.log(data)
        console.log(nextStage)*/
        for(let j = 0; j < values.length; j++) {
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
    }
    
    this.solve = (years, initialAge, maxAge, machinePrice, _data) => {
        decisionYears = years;
        initialMachineAge = initialAge;
        maxMachineAge = maxAge;
        newMachinePrice = machinePrice;
        data = _data;
        decisionYearArray = [];
        stages = [];
        
        // Initialize
        for(let i = 0; i < decisionYears; i++) {
            decisionYearArray[i] = [];
            stages[i] = [];
        }
        
        // Decision tree
        createDecisionTree();
        
        // Solve stages
        for(let i = decisionYears - 1; i >= 0; i--) {
            const stage = stages[i];
            const nextStage = (i < decisionYears - 1) ? stages[i + 1] : null;
            
            solveStage(stage, nextStage, i);
        }
    }
    
    this.solutionsTree = () => {
        return decisionYearArray;
    }
    
    this.stages = () => {
        return stages;
    }
}
