var mysql = require('mysql');
var connection = require('./dbsettings.js');

module.exports = {
    Init: function () {
        connection.query('CREATE TABLE IF NOT EXISTS `logs` (`uuid` int(11) NOT NULL,`text` varchar(1024) NOT NULL,`type` int(11) NOT NULL,`time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=latin1;', function () { });
        connection.query('ALTER TABLE `logs` ADD PRIMARY KEY (`id`);', function () { });
        connection.query('ALTER TABLE `logs` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;', function () { });
    },
    Insert: function (text, type = 0) {
        connection.query("INSERT INTO logs(text,type) VALUES (?,?)", [text, type], function () { });
}