/*:
 * @plugindesc Adds a white fade-in and fade-out effect when the player enters the map for the first time, and moves the player to a specific location.
 * @author YourName
 */

(function() {
    window.isFirstLogin = true; // 처음 로그인인지 확인하는 플래그를 전역 변수로 설정

    var _Scene_Map_prototype_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        if (isFirstLogin) {
            // 초기화 시점에서 화면을 하얗게 덮음
            $gameScreen.startTint([255, 255, 255, 255], 0);  // 즉시 흰색으로 덮음
        }
        _Scene_Map_prototype_initialize.call(this);
    };

    var _Scene_Map_prototype_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_prototype_start.call(this);

        if (isFirstLogin) {
            isFirstLogin = false; // 첫 로그인이 완료된 후 플래그를 false로 설정

            // 1초 대기 후 플레이어를 특정 맵의 15, 15 위치로 이동하고 페이드아웃
            setTimeout(() => {
                // 플레이어를 특정 맵의 15, 15 위치로 이동
                const mapId = 3; // 이동할 맵 ID를 설정합니다. 여기서는 1로 설정하였습니다.
                const x = 15;
                const y = 15;
                $gamePlayer.reserveTransfer(mapId, x, y, $gamePlayer.direction(), 0);
                
                // 60프레임 동안 흰색에서 원래 화면으로 페이드아웃
                $gameScreen.startTint([0, 0, 0, 0], 60);
            }, 1000); // 1초(1000ms) 대기 후 실행
        }
    };

})();
