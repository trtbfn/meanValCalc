const fs = require('fs');
const path = require('path');
const db = require('level')('my-db');

const writeFile = async (filePath, data) => {
  try {
    await fs.promises
      .writeFile(filePath, data);
  } catch(err) {
    console.error(err.message);
  }
};

const readFile = async filePath => {
  try{
    return await fs.promises
      .readFile(filePath, 'utf-8');
  } catch(err) {
    console.error(err.message);
  }
};

const establishInitialState = async () => {
  const answer = await readFile(path.join(__dirname, 'assets.json'))
  const parsedAnswer = JSON.parse(answer);
    if(!parsedAnswer.isInitilized) {
      try {
        await db.put('savedProbabilities', JSON.stringify([]));
        await writeFile(
          path.join(__dirname, 'assets.json'),
          JSON.stringify({
            isInitilized: true
          })
        );
      } catch(err) {
        console.error(err.message);
      }
    }  
}

const saveProb = async probabilityObj => {
  try {
    const savedProbabilities = await db.get('savedProbabilities');
    const parsedSavedProbabilites = JSON.parse(savedProbabilities);
    parsedSavedProbabilites.push(probabilityObj);
    await db.put('savedProbabilities', JSON.stringify(parsedSavedProbabilites));
  } catch(err) {
    console.error(err.message);
  }
};

const getSavedProbs = async () => {
  try {
    const probs = await db.get('savedProbabilities');
    return JSON.parse(probs);
  } catch(err) {
    console.error(err);
  }
};

module.exports = {
  establishInitialState,
  saveProb,
  getSavedProbs
}

