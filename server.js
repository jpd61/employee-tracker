const mysql = require('mysql2');
const inquirer = require ('inquirer');

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
        }
        query( sql, args=[] ) {
            return new Promise( ( resolve, reject ) => {
                this.connection.query( sql, args, ( err, rows ) => {
                    if ( err )
                        return reject( err );
                    resolve( rows );
                } );
            } );
        }
        close() {
            return new Promise( ( resolve, reject ) => {
                this.connection.end( err => {
                    if ( err )
                        return reject( err );
                    resolve();
                } );
            } );
        }
    }

const db = new Database({
    host: "localhost",
    port: 3456,
    user: "root",
    password: "root1234",
    database: "tracker"
});