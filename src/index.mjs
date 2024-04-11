import express, { json } from 'express';
import {query , validationResult} from  'express-validator';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import conexion from '../conexion.mjs';
import moment from 'moment';



const app = express();
app.use(express.json());

const logginMiddleware = (req,res,next)=>{
    console.log(`${req.method} - ${req.url}`);
    next();
};


const PORT = 3001;

const mockUsers = [{id:1 , username : "lara" , displayName : "teran"},
{id:2 , username : "sandoval" , displayName : "martinez"},
{id:3 , username : "medez" , displayName : "gomez"},
{id:4 , username : "rodrigez" , displayName : "maribel"},
{id:5 , username : "pedro" , displayName : "santiago"},
{id:6 , username : "mauricio" , displayName : "marcos"}];




app.get("/",(req,res)=>{
    res.status(200).send({msg : "Primer pantalla.Hola gente bonita"});
});

// Obtener la ruta del directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(join(__dirname,'..', 'public')));


// Ruta para enviar el archivo HTML y los datos de la base de datos cuando se accede a '/medicamentos'
app.get("/medicamentos", (req, res) => {
    res.sendFile(join(__dirname,'..', 'public', 'index.html'));
});

app.get("/obtenerMedicamentos", (req, res) => {
  
    const sql = "SELECT * FROM Medicamentos";
  
    // Ejecuta la consulta SQL
    conexion.query(sql, (error, results) => {
      if (error) {
        console.error('Error al obtener los medicamentos:', error);
        res.status(500).json({ error: 'Error al obtener los medicamentos' });
        return;
      }

    //   console.log(results , "datos de la tabla")
  
      res.json(results);
    });
  });


  app.put("/editarMedicamentos", (req, res) => {
    console.log(req.body , "req.body");

    const sql = `UPDATE Medicamentos SET NombreMedicamento = ?, FechaExpiracion = ?, CantidadTabletas = ?, Donado = ?, FechaDonacion = ? WHERE ID = ?`;
    const values = [req.body.nombre, req.body.fechaExpi, req.body.cant, req.body.donado === 'si' ? 1 : 0, req.body.fechaDon , req.body.id];

    conexion.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error al obtener los medicamentos:', error);
            res.status(500).json({ status: 'error', message: 'Error al obtener los medicamentos' });
            return;
        }

        console.log(results , "datos de la tabla");
  
        res.json({ status: true, data: results });
    });
});


app.post("/guardarMedicNew", (req, res) => {
    console.log(req.body , "req.body");

    const sql = `INSERT INTO Medicamentos (NombreMedicamento, FechaExpiracion, CantidadTabletas, Donado, FechaDonacion) VALUES (?, ?, ?, ?, ?)`;
    const values = [req.body.nombre, req.body.fechaExpi, req.body.cant, req.body.donado === 'si' ? 1 : 0, req.body.fechaDon];

    conexion.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error al obtener los medicamentos:', error);
            res.status(500).json({ status: 'error', message: 'Error al obtener los medicamentos' });
            return;
        }

        console.log(results , "datos de la tabla");
  
        res.json({ status: true, data: results });
    });
});


app.delete("/eliminarForId", (req, res) => {

    const sql = `DELETE FROM Medicamentos WHERE ID = ?`;
    const values = [req.body.id];

    
    conexion.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error al obtener los medicamentos:', error);
            res.status(500).json({ status: 'error', message: 'Error al obtener los medicamentos' });
            return;
        }

        console.log(results , "datos de la tabla");
  
        res.json({ status: true, data: results });
    });
});



app.get("/api/users" ,query("filter").isString().notEmpty(), (req,res) =>{
    console.log(req[ 'express-validator#contexts'])
    const result = validationResult(req);
    console.log(result);
    
    const {query : {filter , value}} = req;

    if(filter && value) return res.send(
        mockUsers.filter((user)=>user[filter].includes(value))
    );

    return res.send(mockUsers);
});

// app.use(logginMiddleware,(req,res,next)=>{
//     console.log("termino el login.");
//     next();
// });

const resolveIndexByuserId = (req,res,next)=>{
    const {params : {id}} = req;
    const parseId = parseInt(id);
    if(isNaN(parseId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
    if(findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
};


app.post("/api/users",(req,res)=>{
    const {body} = req;
    const newUser = {id:mockUsers[mockUsers.length - 1 ].id + 1 , ...body};
    mockUsers.push(newUser);


    return res.status(201).send(newUser);
})

app.get("/api/products" , (req,res)=>{
    res.send([{id : 1 , nameProduct : "cloro" , price : 15},
    {id : 2 , nameProduct : "jamon" , price : 5},
    {id : 3 , nameProduct : "galletas" , price : 10}])
})

app.get("/api/users/:id(\\d+)" ,resolveIndexByuserId, (req,res)=>{
    const {findUserIndex} = req;
    // const parseId = parseInt(req.params.id);
    // if(isNaN(parseId)) return res.status(400).send({msg:"Bad request. Invalid Id"});
    // const findUser = mockUsers.find((user) => user.id == parseId);
    // if(!findUser) return res.status(401);
    return res.send(mockUsers[findUserIndex]);
});

app.put("/api/users/:id(\\d+)" ,resolveIndexByuserId,(req , res) => {
    const {body , findUserIndex} = req;
    mockUsers[findUserIndex] = {id:findUserIndex , ...body};
    return res.sendStatus(200);
})


app.patch("/api/users/:id(\\d+)" ,resolveIndexByuserId, (req , res) => {
    const {body , findUserIndex} = req;
    // const parseId = parseInt(id);
    // if(isNaN(parseId)) return res.sendStatus(400);
    // const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
    // if(findUserIndex === -1) return res.sendStatus(404);
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex] , ...body};
    return res.sendStatus(200);
})


app.delete("/api/users/:id(\\d+)" ,resolveIndexByuserId, (req , res) => {
    const {findUserIndex} = req;
    // const parseId = parseInt(id);
    // if(isNaN(parseId)) return res.sendStatus(400);
    // const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
    // if(findUserIndex === -1) return res.sendStatus(404);
    mockUsers.splice(findUserIndex,1);
    return res.sendStatus(200);
})






app.listen(PORT , ()=>{
    console.log(`Running on Port ${PORT}`);
});

