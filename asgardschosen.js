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

            const CITY_TILE_OFFSET = "-1,1";
            const TERRAIN_TILE_CORNER_OFFSET = {
                "0": "-1,1",
                "90": "-1,1",
                "180": "1,-1",
                "270": "-1,-1"
            }

            let game_map = {
                "1,-1": {
                    "location": "terrain_bog",
                    "rotation": 0
                },
                "-1,-1": {
                    "location": "terrain_hill",
                    "rotation": 180
                },
                "1,1": {
                    "location": "terrain_forest",
                    "rotation": 0
                },
                "5,-1": {
                    "location": "terrain_bog",
                    "rotation": 270
                },
                "3,-5": {
                    "location": "terrain_forest",
                    "rotation": 270
                },
                "-1,-3": {
                    "location": "terrain_forest",
                    "rotation": 0
                },
                "-1,1": {
                    "location": "terrain_forest",
                    "rotation": 180
                },
                "0,0": {
                    "location": "city_0"
                },
                "-2,2": {
                    "location": "city_1"
                },
                "-4,0": {
                    "location": "city_2"
                },
                "4,2": {
                    "location": "city_3"
                },
                "2,-2": {
                    "location": "city_4"
                },
                "4,-2": {
                    "location": "city_5"
                },
                "0,-4": {
                    "location": "city_6"
                },
            }

            // iterate through game map and place each tile on board
            for (const [key, value] of Object.entries(game_map)) {
                console.log(`territory coords: ${key}`)
                const X = parseInt(key.split(",")[0]);
                const Y = parseInt(key.split(",")[1]);
                const territory = value["location"].split("_")[0];
                const terrain_type = value["location"].split("_")[1];
                console.log(`terrain: ${territory}`);
                console.log(`type: ${terrain_type}`);
                console.log(`x-coord: ${X}`);
                console.log(`y-coord: ${Y}`);

                if (territory === "terrain") {
                    const ROTATION_DEGREES = value["rotation"];
                    const X_OFFSET = parseInt(TERRAIN_TILE_CORNER_OFFSET[ROTATION_DEGREES].split(',')[0]);
                    const Y_OFFSET = parseInt(TERRAIN_TILE_CORNER_OFFSET[ROTATION_DEGREES].split(',')[1]);
                    console.log(`rotation deg: ${ROTATION_DEGREES}`);
                    console.log(`x offset: ${X_OFFSET}`);
                    console.log(`y offset: ${Y_OFFSET}`);

                    const DISPLAY_X = X + X_OFFSET;
                    const DISPLAY_Y = Y + Y_OFFSET;
                    console.log(`display x: ${DISPLAY_X}`);
                    console.log(`display y: ${DISPLAY_Y}`);

                    document.getElementsByClassName('scrollmap_scrollable')[0].insertAdjacentHTML('beforeend', `
                        <div id="tile_${key}" class="tile_container">
                            <div class="tile"></div>
                            <div class="terrain left-terrain"></div>
                            <div class="terrain right-terrain"></div>
                            <div class="terrain-circle"></div>
                        </div>
                    `);

                    let tile = document.getElementById(`tile_${key}`);
                    tile.style.transform = `rotate(${ROTATION_DEGREES}deg)`;
                    tile.style.left = `${Math.floor(DISPLAY_X / 2) * 100}px`;
                    tile.style.top = `${Math.floor(DISPLAY_Y / 2) * -100}px`;
                }
                if (territory === "city") {
                    console.log(`its city number: ${terrain_type}`);

                    const DISPLAY_X = X;
                    const DISPLAY_Y = Y;

                    document.getElementsByClassName('scrollmap_scrollable')[0].insertAdjacentHTML('beforeend', `
                        <div id="city_${terrain_type}" class="city_container">
                            <div class="city_image"></div>
                            <div class="city-circle"></div>
                        </div>
                    `);

                    let tile = document.getElementById(`city_${terrain_type}`);
                    tile.style.left = `${Math.floor(DISPLAY_X / 2) * 100 - 28}px`;
                    tile.style.top = `${Math.floor(DISPLAY_Y / 2) * -100 - 28}px`;
                }
            }

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
