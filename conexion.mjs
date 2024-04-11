import mysql from 'mysql';

const conexion = mysql.createConnection({
    host: "localhost",
    port: 8889,
    database: "CRUD_Medicamentos",
    user: "root", 
    password: "root",
    connectTimeout: 10000
});

conexion.connect(function(err) {
    if (err) {
        throw err;
    } else {
        console.log("Conexión establecida . . .")
    }
});

export default conexion;
