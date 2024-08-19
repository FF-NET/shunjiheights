(function() {
    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createMapTitleWindow();
        this.createMinimap(); // 미니맵 생성
    };

    Scene_Map.prototype.createMapTitleWindow = function() {
        this._mapTitleWindow = new Window_MapTitle();
        this._mapTitleWindow.x = 10; // 맵 이름 윈도우의 X 위치 (화면 좌측 상단)
        this._mapTitleWindow.y = 10; // 맵 이름 윈도우의 Y 위치 (화면 상단)
        this.addChild(this._mapTitleWindow);
    };

    Scene_Map.prototype.createMinimap = function() {
        var minimapWidth = 100;  // 미니맵 너비 (원래 크기의 50%)
        var minimapHeight = 100; // 미니맵 높이 (원래 크기의 50%)
        var mapWidth = $dataMap.width;  // 맵의 실제 너비
        var mapHeight = $dataMap.height; // 맵의 실제 높이

        this._minimapSprite = new Sprite(new Bitmap(minimapWidth, minimapHeight));
        this._minimapSprite.bitmap.fillRect(0, 0, minimapWidth, minimapHeight, 'rgba(0, 0, 0, 0.5)'); // 미니맵 배경
        this._minimapSprite.x = 10; // 미니맵의 X 위치 (맵 이름 윈도우 아래)
        this._minimapSprite.y = this._mapTitleWindow.y + this._mapTitleWindow.height + 5; // 미니맵의 Y 위치 (맵 이름 윈도우 아래)
        this._minimapSprite.opacity = 128; // 기본 투명도를 50%로 설정

        this._spriteset.addChild(this._minimapSprite); // 미니맵을 Spriteset_Map에 추가

        this._playerMarker = new Sprite(new Bitmap(4, 4)); // 플레이어 위치를 표시할 마커 (크기 조정)
        this._playerMarker.bitmap.fillRect(0, 0, 4, 4, '#ffff00'); // 플레이어 마커 색상 설정 (노란색)
        this._spriteset.addChild(this._playerMarker); // 플레이어 마커도 Spriteset_Map에 추가

        this._npcMarkers = []; // NPC 마커들을 저장할 배열
        this._eventMarkers = []; // 일반 이벤트 마커들을 저장할 배열
        this._otherPlayerMarkers = []; // 다른 플레이어 마커들을 저장할 배열

        this._minimapScaleX = minimapWidth / mapWidth; // X축 비율 계산
        this._minimapScaleY = minimapHeight / mapHeight; // Y축 비율 계산

        this.drawMinimapTerrain(); // 지형을 그리는 함수 호출
        this.createMarkers(); // 마커 생성

        this.updateMinimap(); // 초기 업데이트
    };

    Scene_Map.prototype.drawMinimapTerrain = function() {
        var mapWidth = $dataMap.width;
        var mapHeight = $dataMap.height;
        var bitmap = this._minimapSprite.bitmap;

        for (var x = 0; x < mapWidth; x++) {
            for (var y = 0; y < mapHeight; y++) {
                var color = '#a0a0a0'; // 기본 색상 (이동 가능 영역)
                if (!$gameMap.isPassable(x, y, 2)) { // 플레이어가 해당 타일을 지나갈 수 없는 경우
                    color = '#505050'; // 더 짙은 색상으로 설정 (이동 불가 영역)
                }
                var miniX = x * this._minimapScaleX;
                var miniY = y * this._minimapScaleY;
                bitmap.fillRect(miniX, miniY, this._minimapScaleX, this._minimapScaleY, color);
            }
        }
    };

    Scene_Map.prototype.createMarkers = function() {
        // 모든 이벤트를 가져옴
        var events = $gameMap.events(); 

        for (var i = 0; i < events.length; i++) {
            var event = events[i];

            // 이벤트 이름이 {}로 감싸져 있는 경우 미니맵에 표시하지 않음
            if (event.event().name.match(/^\{.*\}$/)) {
                continue;
            }

            // 이벤트의 종류에 따라 마커 색상 설정
            if (event.event().name.match(/^\[.*\]$/)) {
                // 포탈 등의 이벤트는 파란색 마커로 표시
                var eventMarker = new Sprite(new Bitmap(4, 4));
                eventMarker.bitmap.fillRect(0, 0, 4, 4, '#0000ff'); // 파란색
                this._spriteset.addChild(eventMarker);
                this._eventMarkers.push(eventMarker);
            } else {
                // 일반 NPC는 초록색 마커로 표시
                var npcMarker = new Sprite(new Bitmap(4, 4));
                npcMarker.bitmap.fillRect(0, 0, 4, 4, '#00ff00'); // 초록색
                this._spriteset.addChild(npcMarker);
                this._npcMarkers.push(npcMarker);
            }
        }

        // MMO_Core_Players.Players에서 각 플레이어에 대한 마커 생성
        for (var id in MMO_Core_Players.Players) {
            if (MMO_Core_Players.Players.hasOwnProperty(id)) {
                var player = MMO_Core_Players.Players[id];

                // 주황색 마커 생성
                var otherPlayerMarker = new Sprite(new Bitmap(4, 4));
                otherPlayerMarker.bitmap.fillRect(0, 0, 4, 4, '#ffa500'); // 주황색
                this._spriteset.addChild(otherPlayerMarker);
                this._otherPlayerMarkers.push(otherPlayerMarker);
            }
        }
    };

    Scene_Map.prototype.updateMinimap = function() {
        var playerX = $gamePlayer.x; // 플레이어의 맵 내 X 위치
        var playerY = $gamePlayer.y; // 플레이어의 맵 내 Y 위치

        var minimapX = playerX * this._minimapScaleX; // 미니맵 내 X 위치
        var minimapY = playerY * this._minimapScaleY; // 미니맵 내 Y 위치

        this._playerMarker.x = minimapX + this._minimapSprite.x; // 미니맵 내의 플레이어 마커 X 좌표 설정
        this._playerMarker.y = minimapY + this._minimapSprite.y; // 미니맵 내의 플레이어 마커 Y 좌표 설정

        // 기존 NPC 및 이벤트 마커 위치 업데이트
        for (var i = 0; i < this._npcMarkers.length; i++) {
            var npc = $gameMap.events().filter(function(event) {
                return event.event().name && !event.event().name.match(/^\[.*\]$/) && !event.event().name.match(/^\{.*\}$/);
            })[i];
            if (npc) {
                var npcX = npc.x * this._minimapScaleX;
                var npcY = npc.y * this._minimapScaleY;

                this._npcMarkers[i].x = npcX + this._minimapSprite.x;
                this._npcMarkers[i].y = npcY + this._minimapSprite.y;
            }
        }

        for (var j = 0; j < this._eventMarkers.length; j++) {
            var event = $gameMap.events().filter(function(event) {
                return event.event().name && event.event().name.match(/^\[.*\]$/);
            })[j];
            if (event) {
                var eventX = event.x * this._minimapScaleX;
                var eventY = event.y * this._minimapScaleY;

                this._eventMarkers[j].x = eventX + this._minimapSprite.x;
                this._eventMarkers[j].y = eventY + this._minimapSprite.y;
            }
        }

        // 다른 플레이어들의 마커 위치 업데이트
        var index = 0;
        for (var id in MMO_Core_Players.Players) {
            if (MMO_Core_Players.Players.hasOwnProperty(id)) {
                var player = MMO_Core_Players.Players[id];
                var otherPlayerX = player.x * this._minimapScaleX;
                var otherPlayerY = player.y * this._minimapScaleY;

                if (this._otherPlayerMarkers[index]) {
                    var marker = this._otherPlayerMarkers[index];
                    marker.x = otherPlayerX + this._minimapSprite.x;
                    marker.y = otherPlayerY + this._minimapSprite.y;
                }
                index++;
            }
        }

        this.updateMinimapOpacity(); // 플레이어와 미니맵의 충돌을 체크하여 투명도 변경
    };

    Scene_Map.prototype.updateMinimapOpacity = function() {
        var playerScreenX = $gamePlayer.screenX();
        var playerScreenY = $gamePlayer.screenY();
        var minimapX = this._minimapSprite.x;
        var minimapY = this._minimapSprite.y;
        var minimapWidth = this._minimapSprite.width;
        var minimapHeight = this._minimapSprite.height;

        var targetOpacity = 128; // 기본 투명도 50%
        if (
            playerScreenX > minimapX - 10 &&
            playerScreenX < minimapX + minimapWidth + 10 &&
            playerScreenY > minimapY - 10 &&
            playerScreenY < minimapY + minimapHeight + 10
        ) {
            targetOpacity = 38; // 플레이어가 근처에 있으면 투명도 15%
        }

        var currentOpacity = this._minimapSprite.opacity;
        if (currentOpacity !== targetOpacity) {
            var opacityChangeSpeed = 8; // 투명도가 변화하는 속도
            if (currentOpacity < targetOpacity) {
                this._minimapSprite.opacity = Math.min(currentOpacity + opacityChangeSpeed, targetOpacity);
            } else {
                this._minimapSprite.opacity = Math.max(currentOpacity - opacityChangeSpeed, targetOpacity);
            }
        }
    };

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateMinimap(); // 플레이어가 움직일 때마다 미니맵 업데이트
    };

    Scene_Map.prototype.setMapTitle = function(title) {
        if (this._mapTitleWindow) {
            this._mapTitleWindow.setCustomTitle(title);
        }
    };

    function Window_MapTitle() {
        this.initialize.apply(this, arguments);
    }

    Window_MapTitle.prototype = Object.create(Window_Base.prototype);
    Window_MapTitle.prototype.constructor = Window_MapTitle;

    Window_MapTitle.prototype.initialize = function() {
        var width = 100; // 맵 이름을 표시할 창의 너비 (조정 가능)
        var height = 40; // 맵 이름을 표시할 창의 높이 (조정 가능)
        var x = 10; // 맵 이름을 화면 좌측 상단에 배치
        var y = 10; // 맵 이름을 화면 상단에 배치
        var rect = new Rectangle(x, y, width, height); 
        Window_Base.prototype.initialize.call(this, rect);
        this.opacity = 255; // 창의 배경을 불투명으로 설정 (필요에 따라 변경 가능)
        this.contents.fontFace = Window_Base.prototype.standardFontFace; // 기본 시스템 폰트 설정
        this.contents.fontSize = 12; // 텍스트의 폰트 크기를 설정
        this.contents.textColor = "#ffffff"; // 텍스트 색상 설정
        this._customTitle = null; // 기본적으로 커스텀 타이틀 없음
        this.refresh();
    };

    Window_MapTitle.prototype.setCustomTitle = function(title) {
        this._customTitle = title;
        this.refresh();
    };

    Window_MapTitle.prototype.refresh = function() {
        this.contents.clear();
        var title = this._customTitle || ($dataMapInfos[$gameMap.mapId()] ? $dataMapInfos[$gameMap.mapId()].name : "Unknown Map");
        this.contents.drawText(title, 0, 0, this.contents.width, this.contents.height, 'center');
    };

    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        if (this._mapTitleWindow) {
            this._mapTitleWindow.refresh();
        }
    };
})();
