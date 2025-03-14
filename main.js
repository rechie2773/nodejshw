const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let posts = [
    {
        "id": "1",
        "title": "a title",
        "views": 100
    },
    {
        "id": "2",
        "title": "another title",
        "views": 200
    },
    {
        "id": "3",
        "title": "another haha",
        "views": 200
    }
];
//ds sinh vien
let students = [];

function genID(length) {
    let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        let rd = Math.floor(Math.random() * source.length);
        result += source.charAt(rd);
    }
    return result;
}

function genMSSV() {
    let mssv = "";
    for (let i = 0; i < 11; i++) {
        mssv += Math.floor(Math.random() * 10);
    }
    return mssv;
}
class Student {
    constructor(hoTen, lop) {
        this.id = genID(16);
        this.mssv = genMSSV();
        this.hoTen = hoTen;
        this.lop = lop;
    }
}
app.get('/students', (req, res) => {
    let filteredStudents = students.filter(s => !s.isDelete);

    if (req.query.hoTen) {
        filteredStudents = filteredStudents.filter(s => s.hoTen.includes(req.query.hoTen));
    }
    if (req.query.lop) {
        filteredStudents = filteredStudents.filter(s => s.lop.includes(req.query.lop));
    }

    res.status(200).send(filteredStudents);
});
app.get('/students/:id', (req, res) => {
    let id = req.params.id;
    let student = students.find(s => s.id === id);
    if (student) {
        res.status(200).send(student);
    } else {
        res.status(404).send({ message: "ID khong ton tai" });
    }
});
app.post('/students', (req, res) => {
    let { hoTen, lop } = req.body;
    if (!hoTen || !lop) {
        return res.status(400).send({ message: "Ho va ten khong duoc de trong" });
    }
    
    let newStudent = new Student(hoTen, lop);
    students.push(newStudent);
    res.status(201).send(newStudent);
});
app.put('/students/:id', (req, res) => {
    let id = req.params.id;
    let student = students.find(s => s.id === id);
    if (student) {
        student.hoTen = req.body.hoTen || student.hoTen;
        student.lop = req.body.lop || student.lop;
        res.status(200).send(student);
    } else {
        res.status(404).send({ message: "ID khong ton tai" });
    }
});
app.delete('/students/:id', (req, res) => {
    let id = req.params.id;
    let student = students.find(s => s.id === id);
    if (student) {
        student.isDelete = true;
        res.status(200).send({ message: "da xoa sinh vien", student });
    } else {
        res.status(404).send({ message: "ID khong ton tai" });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
