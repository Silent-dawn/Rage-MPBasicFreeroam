var mysql = require('mysql');
var connection = require('./dbsettings.js');

// Connecting to the database for work
connection.connect(function (err) {
    if (err) { // if there was an error
        console.error("Error: " + err.message + ' | ' + "Error connecting to the database!");
    } else { // otherwise we have connected
        console.log("Database connected successfully!")
    }
});

// SQL Table Injection of PlayerInfo Table (IF THE TABLE DOESNT EXIST)
connection.query(createPlayers, function (err, results, fields) {
    if (!err) {
        console.log(results.message + "Successfully injected SQL table(s)");
    } else console.error("Error: " + err.message + ' | ' + "SQL injection failed");
});

//If playername exists check
function playerRecordExists(player) {
    var playername = player.name
    connection.query("SELECT 1 FROM playername WHERE playername = '" + playername + "' ORDER BY playername LIMIT 1", function (err, results, fields) {
        if (err) {
            console.error("Error: " + err.message + ' | ' + "Player Check Failed");
            socket.write("fail internal error" + "\r\n");
        }
        if (results.length > 0) {
            console.log('Player exists in the database');
        } 
    });
}
//Player Join Identity Assignment
var PlayersOnline = [];

var Player = function (uuid, name) {
    this.uuid = uuid;
    this.name = name;
    this.ID = FindEmptySlot();
}

function FindEmptySlot() {
    for (var i = 0; i < global.MAX_PLAYERS; i++) {
        if (!IsPlayerLogged(i)) return i;
    }
}

module.exports.CreatePlayerClass = function (uuid, name) {
    var playa = new Player(uuid, name);
    PlayersOnline[playa.ID] = playa;

    return playa.ID;
}

module.exports.DeletePlayerClass = function (id) {
    delete PlayersOnline[id];
}

module.exports.GetPlayerIDByuuid = function (uuid) {
    for (var i = 0; i < global.MAX_PLAYERS; i++) {
        if (IsPlayerLogged(i)) {
            if (PlayersOnline[i].uuid == uuid) return i;
        }
    }
}

function IsPlayerLogged(id) {
    return (typeof PlayersOnline[id] !== 'undefined');
}

module.exports.IsPlayerLogged = IsPlayerLogged;

// PlayerJoin Module
module.exports =
    {
        "playerJoin": player => {
            player.admin = 0;
            console.log(player);
            Logs.Insert("Player " + player.name + " (" + player.ip + ") connected on server");
            player.dimension = 999;
            player.outputChatBox("Welcome to the server, " + player.name + " !");
            DB.Handle.query("SELECT null FROM PlayerInfo WHERE playername = ?", player.name, function (e, result) {
                if (result.length) {
                    player.notify("~r~Please login with command /login [Password]");
                } else player.notify("~r~Please register with command /register [Password]");

            });
        }
    }

//Player Spawn Logic
function playerSpawn(player) {


}
mp.events.add("playerSpawn", playerSpawn);

//Registration On Spawn Event
function spawnReg(spawned, id, )











let skins = require('./configs/skins.json').Skins;
let spawnPoints = require('./configs/spawn_points.json').SpawnPoints;

/* !!! REMOVE AFTER FIX (TRIGGERED FROM SERVER) !!! */
mp.events.add('playerEnteredVehicle', (player) => {
    if (player.vehicle && player.seat === 0 || player.seat === 255)
        player.call('playerEnteredVehicle');
});
/* */

mp.events.add('playerExitVehicle', (player) => {
    player.call('playerExitVehicle');
});

mp.events.add('playerJoin', (player) => {
    player.customData = {};

    mp.players.forEach(_player => {
        if (_player != player)
            _player.call('playerJoinedServer', [player.id, player.name]);
    });

    player.spawn(spawnPoints[Math.floor(Math.random() * spawnPoints.length)]);

    player.model = skins[Math.floor(Math.random() * skins.length)];
    player.health = 100;
    player.armour = 100;
});

mp.events.add('playerQuit', (player) => {
    if (player.customData.vehicle)
        player.customData.vehicle.destroy();

    mp.players.forEach(_player => {
        if (_player != player)
            _player.call('playerLeavedServer', [player.id, player.name]);
    });
});

mp.events.add('playerDeath', (player) => {
    player.spawn(spawnPoints[Math.floor(Math.random() * spawnPoints.length)]);

    // player.model = skins[Math.floor(Math.random() * skins.length)];
    player.health = 100;
    player.armour = 100;
});

mp.events.add('playerChat', (player, message) => {
    mp.players.broadcast(`<b>${player.name}[${player.id}]:</b> ${message}`);
});

// Getting data from client.
mp.events.add('clientData', function() {
    let player = arguments[0];
    /*
        @@ args[0] - data name.
        @@ args[n] - data value (if it is needed).
    */
    let args = JSON.parse(arguments[1]);

    switch (args[0]) {
    // Suicide.
    case 'kill':
        player.health = 0;

        break;
    // Change skin.
    case 'skin':
        player.model = args[1];

        break;
    // Creating new vehicle for player.
    case 'vehicle':
        // If player has vehicle - change model.
        if (player.customData.vehicle) {
            let pos = player.position;
            pos.x += 2;
            player.customData.vehicle.position = pos;
            player.customData.vehicle.model = mp.joaat(args[1]);
        // Else - create new vehicle.
        } else {
            let pos = player.position;
            pos.x += 2;
            player.customData.vehicle = mp.vehicles.new(mp.joaat(args[1]), pos);
        }
        // Hide vehicle buttons (bugfix).
        player.call('hideVehicleButtons');

        break;
        // Weapon.
    case 'weapon':
        player.giveWeapon(mp.joaat(args[1]), 1000);

        break;
    // Repair the vehicle.
    case 'fix':
        if (player.vehicle)
            player.vehicle.repair();

        break;
    // Flip the vehicle.
    case 'flip':
        if (player.vehicle) {
            let rotation = player.vehicle.rotation;
            rotation.y = 0;
            player.vehicle.rotation = rotation;
        }

        break;
    // Vehicle color or neon.
    case 'server_color':
        if (player.vehicle) {
            if (args[1] == 'color') {
                let colorPrimary = JSON.parse(args[2]);
                let colorSecondary = JSON.parse(args[3]);
                player.vehicle.setColourRGB(colorPrimary.r, colorPrimary.g, colorPrimary.b, colorSecondary.r, colorSecondary.g, colorSecondary.b);
            }

            if (args[1] == 'neon') {
                let color = JSON.parse(args[2]);
                player.vehicle.setNeonColour(color.r, color.g, color.b);
            }
        }

        break;
    }
});
