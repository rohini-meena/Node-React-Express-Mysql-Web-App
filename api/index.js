var Express = require('express')
var bodyParser = require('body-parser');

var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Only in dev:
var cors = require('cors');
const { response } = require('express');
app.use(cors());

//MYSQL
var mysQL = require('mysql');
var connection = mysQL.createConnection({
    host: '[[DB NAME]]',
    user: '[[DB USERNAME]]',
    password : '[[DB PASSWORD]]',
    database: '[[DB NAME]]'
});

//File Uploads
var fileUpload = require('express-fileupload');
var fileSystem = require('fs');
app.use(fileUpload()); //init file upload system
app.use('/Photos', Express.static(__dirname + '/Photos')); // stored location of Employee Photos

//Listening port: Can check in postman
app.listen(49146, ()=>{
    connection.connect(function(err){
        if (err) throw err;
        console.log("Connected to DB");
    })
});

app.get("/", (request, response) => {
    response.send("Hello Rohini!!!!");
});

/********
 * Department DB Opertaions
 */

// Get Department Records
app.get("/api/department", (req, res)=>{
    var query = `Select * from department;`;
    connection.query(query, function(err, rows, fields) {
        if (err) {
            res.send("Failed to retrive");
        }
        res.send(rows);
    })
});


// Insert Records in DB
app.post("/api/department", (req, res)=>{
    var query = `insert into department (DepartmentName) values (?)`;
    var values = [
        req.body['DepartmentName']
    ];
    connection.query(query, values, function(err, rows, fields) {
        if (err) {
            res.send("Insert Failed");
        }
        res.json('Added a new record into DB');
    })
});

//Update Department from DB
app.put("/api/department", (req, res)=>{
    var query = `update department set DepartmentName = ? where DepartmentID = ?`;
    var values = [        
        req.body['DepartmentName'],
        req.body['DepartmentID'],
    ];
    connection.query(query, values, function(err, rows, fields) {
        if (err) {
            res.send("Updation Failed");
        }
        res.json('Updated the DB row successfully');
    })
});

//Delete the record from DB
app.delete("/api/department/:id", (req, res)=>{
    var query = `delete from department where DepartmentID = ?`;
    var values = [        
        parseInt(req.params.id)
    ];
    connection.query(query, values, function(err, rows, fields) {
        if (err) {
            res.send("Deletion Failed");
        }
        res.json('Deleted the DB row successfully');
    })
});


/********
 * Employee DB Opertaions
 */

// Get Employee Records
app.get("/api/employee", (req, res)=>{
    var query = `Select * from employee;`;
    connection.query(query, function(err, rows, fields) {
        if (err) {
            res.send("Failed to retrive");
        }
        res.send(rows);
    })
});


// Insert Records in DB
app.post("/api/employee", (req, res)=>{
    var query = `insert into employee (EmployeeName, Department, DateofJoining, ProfilePic) values (?, ?, ?, ?)`;
    var values = [
        req.body['EmployeeName'],
        req.body['Department'],
        req.body['DateofJoining'],
        req.body['ProfilePic']
    ];
    connection.query(query, values, function(err, rows, fields) {
        if (err) {
            res.send("Insert Failed");
        }
        res.json('Added a new record into Employee Table');
    })
});

//Update Employee from DB
app.put("/api/employee", (req, res)=>{
    var query = `update employee set EmployeeName = ?, DateofJoining = ? where EmployeeID = ?`;
    var values = [        
        req.body['EmployeeName'],
        req.body['DateofJoining'],
        req.body['EmployeeID'],
    ];
    connection.query(query, values, function(err, rows, fields) {
        if (err) {
            res.send("Updation Failed");
        }
        res.json('Updated the DB row successfully');
    })
});

//Delete the record from DB
app.delete("/api/employee/:id", (req, res)=>{
    var query = `delete from employee where EmployeeID = ?`;
    var values = [        
        parseInt(req.params.id)
    ];
    connection.query(query, values, function(err, rows, fields) {
        if (err) {
            res.send("Deletion Failed");
        }
        res.json('Deleted the DB row successfully');
    })
});

//File Upload of Employee:
app.post('/api/employee/save-file', (req, res)=>{

    fileSystem.writeFile("./Photos/"+req.files.file.name,
    req.files.file.data, function(err){
        if (err) {
            throw err;
            console.log("File Uploaded");
        } 
        res.json(req.files.file.name);
    });
});