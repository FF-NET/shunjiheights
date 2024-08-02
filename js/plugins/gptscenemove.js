(function() {
    var _Game_Player_centerX = Game_Player.prototype.centerX;
    Game_Player.prototype.centerX = function() {
        return this._realX;
    };

    var _Game_Player_centerY = Game_Player.prototype.centerY;
    Game_Player.prototype.centerY = function() {
        return this._realY;
    };
})();
