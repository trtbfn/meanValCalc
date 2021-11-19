const level = require('level');
const db = level('my-db');

async function putTable(name, meanProbability, allProbablilites) {
    const jsonObj = JSON.stringify(
        {meanProbability, allProbablilites}
    );
    
    await db.put(name, jsonObj);
}

async function getTable(name) {
    const data = await db.get(name);
    console.log(data);
}

//key word 'last'
async function putLastName(name) {
    await db.put('last', name);
}

async function getLastName() {
    return await db.get('last');
}

module.exports = {
    putTable,
    getTable,
    getLastName,
    putLastName
};

