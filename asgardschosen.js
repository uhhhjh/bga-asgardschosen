/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * AsgardsChosen implementation : © Kevin Espinoza kcesp1996@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * asgardschosen.js
 *
 * AsgardsChosen user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/expandablesection",
    "./modules/js/scrollmapWithZoom"
],
function (dojo, declare) {
    return declare("bgagame.asgardschosen", ebg.core.gamegui, {
        constructor: function(){
            console.log('asgardschosen constructor');
              
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;
            this.TERRAIN_TILE_CORNER_OFFSET = {
                0: "-1,1",
                90: "-1,1",
                180: "1,-1",
                270: "-1,-1"
            };
            this.LAND_TILE_TERRITORY_OFFSETS = {
                0: {
                    "left": "0,0",
                    "right": "2,0",
                    "enchantedland": "1,1"
                },
                90: {
                    "left": "0,0",
                    "right": "0,-2",
                    "enchantedland": "1,-1"
                },
                180: {
                    "left": "0,0",
                    "right": "-2,0",
                    "enchantedland": "-1,-1"
                },
                270: {
                    "left": "0,0",
                    "right": "0,2",
                    "enchantedland": "-1,1"
                }
            };
        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            console.log( "Starting game setup" );

            this.getGameAreaElement().insertAdjacentHTML('beforeend', `
                <div id="map_container" class="scrollmap_container">
                </div>
            `);

            this.scrollmap = new ebg.scrollmapWithZoom();
            this.scrollmap.zoom = 0.8;
            this.scrollmap.createCompletely( $('map_container') );

            const tile_map = {
                "1,-1": {
                    "type": "land",
                    "rotation": 0,
                    "id": 14
                },
                "-1,-1": {
                    "type": "land",
                    "rotation": 180,
                    "id": 1
                },
                "1,1": {
                    "type": "land",
                    "rotation": 0,
                    "id": 2
                },
                "5,-1": {
                    "type": "land",
                    "rotation": 270,
                    "id": 3
                },
                "3,-5": {
                    "type": "land",
                    "rotation": 270,
                    "id": 4
                },
                "-1,-3": {
                    "type": "land",
                    "rotation": 0,
                    "id": 5
                },
                "-1,1": {
                    "type": "land",
                    "rotation": 180,
                    "id": 6
                },
                "0,0": {
                    "type": "city",
                    "id": 7
                },
                "-2,2": {
                    "type": "city",
                    "id": 8
                },
                "-4,0": {
                    "type": "city",
                    "id": 9
                },
                "4,2": {
                    "type": "city",
                    "id": 10
                },
                "2,-2": {
                    "type": "city",
                    "id": 11
                },
                "4,-2": {
                    "type": "city",
                    "id": 12
                },
                "0,-4": {
                    "type": "city",
                    "id": 13
                },
            }

            Object.entries(tile_map).forEach(([coordinates, tile]) => {
                const [ X, Y ] = this.getCoordinatesFromString(coordinates);
                const TILE_TYPE = tile["type"];
                const TILE_ROTATION = tile["rotation"];
                const TILE_ID = tile["id"];

                if (TILE_TYPE === "land") {
                    this.placeLandTile(X, Y, TILE_ROTATION, TILE_ID);
                }
                if (TILE_TYPE === "city") {
                    this.placeCityTile(X, Y, TILE_ID);
                }
            });

            // Example to add a div on the game area
            document.getElementById('game_play_area').insertAdjacentHTML('beforeend', `
                <div id="player-tables"></div>
            `);
            
            // Setting up player boards
            Object.values(gamedatas.players).forEach(player => {
                // example of setting up players boards
                this.getPlayerPanelElement(player.id).insertAdjacentHTML('beforeend', `
                    <div id="player-counter-${player.id}">A player counter</div>
                `);

                // example of adding a div for each player
                document.getElementById('player-tables').insertAdjacentHTML('beforeend', `
                    <div id="player-table-${player.id}">
                        <strong>${player.name}</strong>
                        <div>Player zone content goes here</div>
                    </div>
                `);
            });
            
            // TODO: Set up your game interface here, according to "gamedatas"
            
 
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log( "Ending game setup" );
        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName, args );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Show some HTML block at this game state
                dojo.style( 'my_html_block_id', 'display', 'block' );
                
                break;
           */
           
           
            case 'dummy':
                break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
            case 'dummy':
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName, args );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
                 case 'playerTurn':    
                    const playableCardsIds = args.playableCardsIds; // returned by the argPlayerTurn

                    // Add test action buttons in the action status bar, simulating a card click:
                    playableCardsIds.forEach(
                        cardId => this.statusBar.addActionButton(_('Play card with id ${card_id}').replace('${card_id}', cardId), () => this.onCardClick(cardId))
                    ); 

                    this.statusBar.addActionButton(_('Pass'), () => this.bgaPerformAction("actPass"), { color: 'secondary' }); 
                    break;
                }
            }
        },

        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */

        placeLandTile: function (x, y, rotation_degrees, tile_id) {
            const [ X_OFFSET, Y_OFFSET ] = this.getCoordinatesFromString(this.TERRAIN_TILE_CORNER_OFFSET[rotation_degrees]);
            console.log(`rotation deg: ${rotation_degrees}`);
            console.log(`x offset: ${X_OFFSET}`);
            console.log(`y offset: ${Y_OFFSET}`);

            const DISPLAY_X = x + X_OFFSET;
            const DISPLAY_Y = y + Y_OFFSET;
            console.log(`display x: ${DISPLAY_X}`);
            console.log(`display y: ${DISPLAY_Y}`);

            const TERRITORY_OFFSET = this.LAND_TILE_TERRITORY_OFFSETS[rotation_degrees];
            const LEFT_TERRITORY_ID = this.constructTerritoryName(x, y, TERRITORY_OFFSET['left']);
            const RIGHT_TERRITORY_ID = this.constructTerritoryName(x, y, TERRITORY_OFFSET['right']);
            const ENCHANTEDLAND_TERRITORY_ID = this.constructTerritoryName(x, y, TERRITORY_OFFSET['enchantedland']);

            document.getElementsByClassName('scrollmap_scrollable')[0].insertAdjacentHTML('beforeend', `
                <div id="${tile_id}" class="tile_container">
                    <div class="tile"></div>
                    <div id="${LEFT_TERRITORY_ID}" class="terrain left-terrain"></div>
                    <div id="${RIGHT_TERRITORY_ID}" class="terrain right-terrain"></div>
                    <div id="${ENCHANTEDLAND_TERRITORY_ID}" class="terrain-circle"></div>
                </div>
            `);

            let tile = document.getElementById(tile_id);
            tile.style.transform = `rotate(${rotation_degrees}deg)`;
            tile.style.left = `${Math.floor(DISPLAY_X / 2) * 100}px`;
            tile.style.top = `${Math.floor(DISPLAY_Y / 2) * -100}px`;
        },

        placeCityTile: function (x, y, tile_id) {
            const TERRITORY_ID = `territory_${x}_${y}`;
            console.log(`place territory id: ${TERRITORY_ID}`);

            const DISPLAY_X = x;
            const DISPLAY_Y = y;

            document.getElementsByClassName('scrollmap_scrollable')[0].insertAdjacentHTML('beforeend', `
                <div id="${tile_id}" class="city_container">
                    <div class="city_image"></div>
                    <div id="${TERRITORY_ID}" class="city-circle"></div>
                </div>
            `);

            let tile = document.getElementById(tile_id);
            tile.style.left = `${Math.floor(DISPLAY_X / 2) * 100 - 28}px`;
            tile.style.top = `${Math.floor(DISPLAY_Y / 2) * -100 - 28}px`;
        },

        constructTerritoryName: function (x, y, offset) {
            const COORDINATE = this.getCoordinatesFromString(offset);
            const X_OFFSET = COORDINATE[0];
            const Y_OFFSET = COORDINATE[1];

            return `territory_${x + X_OFFSET}_${y + Y_OFFSET}`;
        },

        getCoordinatesFromString: function (coordinates_string) {
            const X = parseInt(coordinates_string.split(',')[0]);
            const Y = parseInt(coordinates_string.split(',')[1]);

            return [ X, Y ];
        },

        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */
        
        // Example:
        
        onCardClick: function( card_id )
        {
            console.log( 'onCardClick', card_id );

            this.bgaPerformAction("actPlayCard", { 
                card_id,
            }).then(() =>  {                
                // What to do after the server call if it succeeded
                // (most of the time, nothing, as the game will react to notifs / change of state instead)
            });        
        },    

        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your asgardschosen.game.php file.
        
        */
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );
            
            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  
        
        // TODO: from this point and below, you can write your game notifications handling methods
        
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
   });             
});
