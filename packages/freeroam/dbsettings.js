"use strict";
// init variable defining and config value imports for mysql
var mysql = require('mysql');
 
// Define your connection settings here
module.exports.connection = {
    Connect: function (callback) {
        this.Handle = mysql.createConnection({
            host: '158.69.238.64',
            user: 'db12002',
            password: 'K6kdaJaU8n',
            database: 'db12002'
        });
        this.connect(function (err) {
            if (err) { // if there was an error
                console.error("Error: " + err.message + ' | ' + "Error connecting to the database!");
            } else { // otherwise we have connected
                console.log("Database connected successfully!")
            }
        })
    }
}

    connection: connection = mysql.createConnection({
        host: '158.69.238.64',
        user: 'db12002',
        password: 'K6kdaJaU8n',
        database: 'db12002'
    })
};

 
//Testing if the connection is sound for use
connection.connect(function(err) {
    if(err) { // if there was an error
      console.error("Error: " + err.message + ' | ' + "Error connecting to the database!");
    } else { // otherwise we have connected
      console.log("Database connected successfully!")
    }
  });
 
// Variable assignment for SQL table injection and construction
 
// PlayerInfo Table Creation
let createPlayers = `CREATE TABLE IF NOT EXISTS PlayerInfo(
                          uuid int primary key auto_increment,
                          playername varchar(255) not null,
                          serverrank varchar (255) not null default 'player',
                          wallet int(10) not null default 100,
                          bankbalance int(20) not null default 0,
                          kills int(20) not null default 0,
                          deaths int(20) not null default 0,
                          inventory varchar(255) not null,
                          licenses varchar(255) not null,
                          weapons varchar(255) not null,
                          ownedvehicles varchar(255) not null
                      )
                      ENGINE=InnoDB DEFAULT CHARSET=utf8`;
 
// Jobs Table | This is a placeholder for developers who want to add in jobs                     
let createJobs = `CREATE TABLE IF NOT EXISTS Jobs(
                    jobid int primary key auto_increment,
                    title varchar(255) not null,
                    payrate int(10) not null default 0,
                    rank varchar(255) not null,
                    whitelist tinyint(1) not null default 0
                    )
                    ENGINE=InnoDB DEFAULT CHARSET=utf8`;
 
// Create Player Table SQL Table Injection
function createPlayerTable() {
    connection.query(createPlayers, function (err, results, fields) {
        if (!err)
            console.log(results.message + "Successfully injected SQL table(s)");
        else console.error("Error: " + err.message + ' | ' + "SQL injection failed");
    })
};


 
// Closing the connection as a failsafe to prevent possible redundant or rogue connections
connection.end(function(err) {
    if (!err) {
      console.log("MySQL session closed successfully");
    } else console.error("Error: " + err.message + ' | ' + "SQL session failed to terminate");
})

//
module.exports.init = createPlayerTable;