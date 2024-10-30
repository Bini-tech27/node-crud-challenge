const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { createPersonSchema, updatePersonSchema } = require('./validation');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

let persons = [
    {
        id: '1',
        name: 'Sam',
        age: 26,  
        hobbies: []
    }
];

app.set('db', persons);

app.get('/person', (req, res) => {
    res.json(persons);
});


app.get('/person/:personId?', (req, res) => {
    const { personId } = req.params;
    if (personId) {
        const person = persons.find(p => p.id === personId);
        if (person) return res.json(person);
        return res.status(404).json({ message: "Person not found" });
    }
    res.json(persons);
});

app.post('/person', (req, res) => {
    const { error, value } = createPersonSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const newPerson = { id: uuidv4(), name: value.name, age: value.age, hobbies: value.hobbies };
    persons.push(newPerson);
    res.status(201).json(newPerson);
});


app.put('/person/:personId', (req, res) => {
    const { personId } = req.params;
    const personIndex = persons.findIndex(p => p.id === personId);

    if (personIndex === -1) {
        return res.status(404).json({ message: "Person not found" });
    }

    
    const { error, value } = updatePersonSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    persons[personIndex] = { id: personId, name: value.name, age: value.age, hobbies: value.hobbies };
    res.json(persons[personIndex]);
});

app.delete('/person/:personId', (req, res) => {
    const { personId } = req.params;
    const personIndex = persons.findIndex(p => p.id === personId);

    if (personIndex === -1) {
        return res.status(404).json({ message: "Person not found" });
    }

    persons.splice(personIndex, 1);
    res.status(204).end();
});

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
}

module.exports = app;
