/* global MMO_Core */
const fs = require("fs");
const EventEmitter = require("events");

/*****************************
      PUBLIC FUNCTIONS
*****************************/

exports.modules = {};

exports.socketConnection = null;
exports.serverEvent = new EventEmitter();

exports.initialize = function(socketConnection) {
    exports.socketConnection = socketConnection;

        // 사용자 체크 이벤트 추가
        socketConnection.on('connection', function(socket) {
            socket.on('check_user', function(username, callback) {
                // 해당 사용자가 이미 접속되어 있는지 확인
                const isUserConnected = Object.values(socketConnection.sockets.sockets).some(s => s.username === username);
                
                // 결과를 클라이언트로 반환
                callback(!isUserConnected);
            });
    
            // 로그인 성공 시 username을 소켓에 저장
            socket.on('login_success', function(data) {
                socket.username = data.username;  // 사용자의 username을 소켓에 저장
            });
    
            // 로그인 실패 시 처리 로직 추가 가능
        });

    // We load all the modules in the socket server
    exports.loadModules("", false).then(() => {
        console.log(`[I] Socket.IO server started on port ${MMO_Core.database.SERVER_CONFIG.port}...`);
    }).catch((e) => {
        console.log(e);
    });
};

exports.loadModules = function(path, isSub) {
    if (isSub && exports.modules[path].subs === undefined) {
        exports.modules[path].subs = {};
    }

    const modulePath = (isSub) ? exports.modules[path].subs : exports.modules;
    const correctedPath = `${__dirname}/../modules/${path}`;

    return new Promise((resolve, reject) => {
        fs.readdir(correctedPath, function(err, files) {
            if (err) {
                return reject(err);
            }

            files = files.filter((fileName) => {
                if (fileName.includes(".js")) {
                    return fileName;
                }
            });

            files.forEach((file) => {
                const stats = fs.statSync(`${correctedPath}/${file}`);
                const moduleName = file.split(".")[0];

                if (!stats.isDirectory()) {
                    modulePath[moduleName] = require(`${correctedPath}/${file}`);

                    if (Object.keys(files).length === Object.keys(modulePath).length) {
                        console.log(`[I] Loaded ${Object.keys(modulePath).length} modules.`);
                        resolve(true);

                        for (const key in modulePath) {
                            if (typeof (modulePath[key]) === "function") {
                                continue;
                            }

                            modulePath[key].initialize();
                            console.log(`[I] Module ${key} initialized.`);
                        }
                    }
                }
            });
        });
    });
};

// Return all connected sockets to the world or specific room (map-* OR party-*)
exports.getConnectedSockets = function(roomName) {
    return new Promise(resolve => {
        const sockets = [];
        const ns = exports.socketConnection.of("/");

        for (const id in ns.connected) {
            if (roomName) {
                const index = ns.connected[id].rooms.indexOf(roomName);
                if (index !== -1) {
                    sockets.push(ns.connected[id]);
                }
            } else {
                sockets.push(ns.connected[id]);
            }
        }

        return resolve(sockets);
    });
};

// Send a socket to the entire server
exports.emitToAll = (name, payload) => {
    exports.socketConnection.emit(name, payload);
};
