(function() {
    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createExpBar(); // Exp 바 추가
    };

    Scene_Map.prototype.createExpBar = function() {
        this._expBar = new Sprite_ExpBar();
        this._spriteset.addChild(this._expBar); // 스프라이트셋에 Exp 바 추가
    };

    // Sprite_ExpBar 정의
    function Sprite_ExpBar() {
        this.initialize.apply(this, arguments);
    }

    Sprite_ExpBar.prototype = Object.create(Sprite.prototype);
    Sprite_ExpBar.prototype.constructor = Sprite_ExpBar;

    Sprite_ExpBar.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._actor = $gameActors.actor(2); // 두 번째 액터(Actor 2)로 설정
        this._segments = 5; // Exp 바를 5개의 칸으로 나눔
        this._segmentWidth = Math.floor(40 / 1 / this._segments); // 각 칸의 너비 설정 (전체 너비 기준)
        this.bitmap = new Bitmap(this._segmentWidth * this._segments, 6); // Exp 바를 그릴 비트맵 크기 설정
        this.update();
    };

    Sprite_ExpBar.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updatePosition();
        this.updateExp();
    };

    Sprite_ExpBar.prototype.updatePosition = function() {
        var screenX, screenY;

        // Actor 2가 파티의 첫 번째 멤버일 경우 (즉, 주인공일 경우)
        if ($gameParty.members()[0] === this._actor) {
            screenX = $gamePlayer.screenX();
            screenY = $gamePlayer.screenY();
        } else {
            // Actor 2가 파티의 첫 번째 멤버가 아닐 경우
            var followerIndex = $gameParty.members().indexOf(this._actor) - 1; // 팔로워 인덱스 조정
            screenX = $gamePlayer._followers.follower(followerIndex).screenX(); // Actor 2의 화면 X 좌표
            screenY = $gamePlayer._followers.follower(followerIndex).screenY(); // Actor 2의 화면 Y 좌표
        }

        this.x = screenX - this.width / 2; // Exp 바의 X 좌표를 Actor 2의 X 좌표에 맞춤
        this.y = screenY - 70; // Exp 바의 Y 좌표를 Actor 2의 머리 위로 설정
    };

    Sprite_ExpBar.prototype.updateExp = function() {
        this.bitmap.clear();
        if (this._actor) {
            var currentExp = this._actor.currentExp();
            var nextLevelExp = this._actor.nextLevelExp();
            var rate = currentExp / nextLevelExp; // 경험치 비율 계산
            var filledSegments = Math.floor(rate * this._segments); // 채워질 칸 수 계산
            this.drawBackground();
            this.drawSegments(filledSegments);
            this.drawBorder(); // 테두리 그리기
        }
    };

    Sprite_ExpBar.prototype.drawBackground = function() {
        var width = this.bitmap.width; // 배경의 너비
        var height = this.bitmap.height; // 배경의 높이
        var color = 'rgba(0, 0, 0, 0.5)'; // 반투명 검은색

        // Exp 바 배경 그리기
        this.bitmap.fillRect(0, 0, width, height, color);
    };

    Sprite_ExpBar.prototype.drawSegments = function(filledSegments) {
        var color = '#00ff00'; // 채워진 칸의 색상 (초록색)
        var emptyColor = '#404040'; // 빈 칸의 색상 (회색)

        for (var i = 0; i < this._segments; i++) {
            var x = i * this._segmentWidth + 1;
            if (i < filledSegments) {
                this.bitmap.fillRect(x, 1, this._segmentWidth - 2, this.bitmap.height - 2, color);
            } else {
                this.bitmap.fillRect(x, 1, this._segmentWidth - 2, this.bitmap.height - 2, emptyColor);
            }
        }
    };

    Sprite_ExpBar.prototype.drawBorder = function() {
        var context = this.bitmap._context;
        context.strokeStyle = '#000000'; // 검은색 테두리
        context.lineWidth = 1; // 테두리 두께
        context.strokeRect(0, 0, this.bitmap.width, this.bitmap.height); // 테두리 그리기
        this.bitmap._baseTexture.update(); // 텍스처 갱신
    };
})();
