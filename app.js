const express = require('express'),
      BigNumber = require('bignumber.js'),
     {
        establishInitialState,
        saveProb,
        getSavedProbs
     } = require('./db/crad'),
     open = require('open');

const app = express(),
      port = 3000;

//trd libraraies

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));


const createMatrixPrabability = (elemensCount, experimentsCount) => {
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

const start = async () => {
    await establishInitialState();
    await app.listen(port, () => console.log(`server have started on port ${port}`));
    await open('http://localhost:3000');
}

app.post('/', (req, res) => {
    const {
        elemensCount,
        experimentsCount
    } = req.body;
    
    
    const matrix = createMatrixPrabability(elemensCount, experimentsCount);
    

    //calculate mean value
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

    saveProb({
        meanProbability, matrix
    });

    res.json(JSON.stringify(meanProbability));
});

app.get('/api/results', (req,res) => {
    getSavedProbs().then(probs => {
        res.json(JSON.stringify(probs.filter(prob => prob.meanProbability)));
    });
})

app.get('/api/results/:id', (req,res) => {
    getSavedProbs().then(probs => {
        res.json(JSON.stringify(probs[req.params.id - 1].matrix));
    });
});

start();






