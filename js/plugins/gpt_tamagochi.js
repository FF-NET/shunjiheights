(function() {
    // Game_Actor 클래스 확장
    var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._sadness = 0;   // 슬픔 초기화
        this._reality = 0;   // 현실 초기화
        this._love = 0;      // 사랑 초기화
        this._courage = 0;   // 용기 초기화
        this._hope = 0;      // 희망 초기화
        this._diligence = 0; // 성실 초기화
        this._purity = 0;    // 순수 초기화
        this._karma = 0;     // 업보 초기화
    };

    // 슬픔, 현실, 사랑, 용기, 희망, 성실, 순수, 업보의 getter 및 setter
    Game_Actor.prototype.sadness = function() {
        return this._sadness;
    };

    Game_Actor.prototype.setSadness = function(value) {
        this._sadness = value.clamp(0, 999); // 0에서 999 사이로 제한
    };

    Game_Actor.prototype.reality = function() {
        return this._reality;
    };

    Game_Actor.prototype.setReality = function(value) {
        this._reality = value.clamp(0, 999); // 0에서 999 사이로 제한
    };

    Game_Actor.prototype.love = function() {
        return this._love;
    };

    Game_Actor.prototype.setLove = function(value) {
        this._love = value.clamp(0, 999); // 0에서 999 사이로 제한
    };

    Game_Actor.prototype.courage = function() {
        return this._courage;
    };

    Game_Actor.prototype.setCourage = function(value) {
        this._courage = value.clamp(0, 999); // 0에서 999 사이로 제한
    };

    Game_Actor.prototype.hope = function() {
        return this._hope;
    };

    Game_Actor.prototype.setHope = function(value) {
        this._hope = value.clamp(0, 999); // 0에서 999 사이로 제한
    };

    Game_Actor.prototype.diligence = function() {
        return this._diligence;
    };

    Game_Actor.prototype.setDiligence = function(value) {
        this._diligence = value.clamp(0, 999); // 0에서 999 사이로 제한
    };

    Game_Actor.prototype.purity = function() {
        return this._purity;
    };

    Game_Actor.prototype.setPurity = function(value) {
        this._purity = value.clamp(0, 999); // 0에서 999 사이로 제한
    };

    Game_Actor.prototype.karma = function() {
        return this._karma;
    };

    Game_Actor.prototype.setKarma = function(value) {
        this._karma = value.clamp(0, 999); // 0에서 999 사이로 제한
    };

    // 클램프 함수 (최소 및 최대 값을 설정)
    Number.prototype.clamp = function(min, max) {
        return Math.min(Math.max(this, min), max);
    };

    // 스탯 증가/감소 메서드
    Game_Actor.prototype.changeSadness = function(value) {
        this.setSadness(this._sadness + value);
    };

    Game_Actor.prototype.changeReality = function(value) {
        this.setReality(this._reality + value);
    };

    Game_Actor.prototype.changeLove = function(value) {
        this.setLove(this._love + value);
    };

    Game_Actor.prototype.changeCourage = function(value) {
        this.setCourage(this._courage + value);
    };

    Game_Actor.prototype.changeHope = function(value) {
        this.setHope(this._hope + value);
    };

    Game_Actor.prototype.changeDiligence = function(value) {
        this.setDiligence(this._diligence + value);
    };

    Game_Actor.prototype.changePurity = function(value) {
        this.setPurity(this._purity + value);
    };

    Game_Actor.prototype.changeKarma = function(value) {
        this.setKarma(this._karma + value);
    };

})();
