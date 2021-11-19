const express = require("express");
const app = express();
const {
        putTable, 
        getTable,
        putLastName, 
        getLastName
    } = require('./db/dbWrapper');
const port = 3000;

//trd libraraies
const BigNumber = require('bignumber.js');

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));


app.post('/', (req, res) => {
    const {
        elemensCount,
        experimentsCount
    } = req.body;
    
    
    const matrix = createMatrixPrabability(elemensCount, experimentsCount);
    

    //calcualte mean value
    const meanValues = [];
    matrix.map(arr => {
        let counter = BigNumber(1);
        arr.map(num => {
            counter = counter.multipliedBy(num);
        });
        meanValues.push(BigNumber(counter));
    });

    let counter = BigNumber(1);
    meanValues.map(num => {
        counter = counter.multipliedBy(num);
    });

    const meanProbability = counter.toExponential(5);

    //put in db
    const numPattern = /(\d+)/;
    getLastName().then(lastName => {
        const lastNumber = Number.parseInt(numPattern.exec(lastName)[0]);
        const newName = `result${lastNumber + 1}`;
        putLastName(newName);
        putTable(newName, meanProbability.counter, matrix);
    });

    res.json(JSON.stringify(meanProbability));
});

app.listen(port, () => console.log(`server have started on port ${port}`));

function createMatrixPrabability(elemensCount, experimentsCount) {
    const matrix = [];

    for(let i = 0; i < experimentsCount; i++) {
        const array = [];
        for(let j = 0; j < elemensCount; j++) {
           const prabability = Math.random();
           array.push(prabability);
        }  
        matrix.push(array);
    }

    return matrix;
}
