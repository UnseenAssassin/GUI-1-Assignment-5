//File: app.js
//Gui Assignment: Scrabble with drag and drop
//Description: This file is responsible for the dragging and the dropping feature for the game.  It makes it possible for the tiles to be taken 
//from the tile holder and place the leters onto the board.  The only problem with the code is that the size of the tiles is not matching with the
//size of the board.  Otherwise, the code gives each of the letters its values and the blank space.  Finally it allows for the board to be cleared 
//so the user is able to get new letters and make new words.  

//Zuriel Pagan, UMass Lowell Computer Science, zuriel_pagan@student.uml.edu
//Copywright (c) 2024 by Zuriel.  All rights reserved.  May be freely copied or excerpted for educational purposes with credit to the author.

//updated by ZP on June 19th, 2024
//updated by ZP on June 23rd, 2024
//updated by ZP on June 27th, 2024
//updated by ZP on June 28th, 2024

//This function allows for the value distribution of points to all of the letters
$(function() 
{
    const letterDistribution = {
        'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3, 'H': 2,
        'I': 9, 'J': 1, 'K': 1, 'L': 4, 'M': 2, 'N': 6, 'O': 8, 'P': 2,
        'Q': 1, 'R': 6, 'S': 4, 'T': 6, 'U': 4, 'V': 2, 'W': 2, 'X': 1,
        'Y': 2, 'Z': 1, ' ': 2 
        // Adding blanks to the distribution
    };

    const letterValues = {
        'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4,
        'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3,
        'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8,
        'Y': 4, 'Z': 10, ' ': 0 
        // Blanks have no value
    };
    //Adds the bonus points ot the spaces
    const bonuses = [0,0,2,0,0,0,2,0,2,0,0,0,2,0,0]; 

    let score = 0;
    let tileRack = [];
    
    //This will create the tiles and randomly adds different alphabets to the tile rack when the user clicks on the button to get a new set of letters
    function createTiles() {
        const rack = $('#tile-rack');
        rack.empty();

        for (let i = tileRack.length; i < 7; i++) {
            const randomLetter = getRandomLetter();
            // Uses the createTile function to create tiles
            const tile = createTile(randomLetter); 
            tile.draggable({
                revert: "invalid"
            });
            tileRack.push(tile);
            rack.append(tile);
        }
    }
    //This allows for each letter that will be on the tile holder to have its equivalent background tile.  
    function createTile(letter) {
        const tile = $('<div class="tile"></div>').data('letter', letter);
        const letterUpperCase = letter.toUpperCase();
        const backgroundImage = `url('graphics/Scrabble_Tiles/Scrabble_Tile_${letterUpperCase}.jpg')`;
        tile.css('background-image', backgroundImage);
        return tile;
    }
    //This function will give random letters to the tile holder that the user will have to use
    function getRandomLetter() {
        const letters = Object.keys(letterDistribution);
        let letter = letters[Math.floor(Math.random() * letters.length)];
        while (letterDistribution[letter] === 0) {
            letter = letters[Math.floor(Math.random() * letters.length)];
        }
        letterDistribution[letter]--;
        return letter;
    }
    //This function will create the board and will have the ability to lock in the letter that the user wants to put onto the board
    function createBoard() {
        const board = $('#scrabble-board');
        board.empty();
    
        for (let i = 0; i < 15; i++) {
            const cell = $('<div></div>').addClass('scrabble-cell');
            if (bonuses[i] > 0) {
                cell.addClass('bonus');
            }
            cell.css({
                left: `${i * 70}px`,
                top: '0px'
            });
            cell.droppable({
                accept: ".tile",
                drop: function(event, ui) {
                    const droppedTile = ui.helper.clone();
                    const letter = ui.helper.data('letter');
                    droppedTile.removeClass('ui-draggable-dragging').css({
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        position: 'absolute'
                    });
                    //makes the tile drop onto the spot the user wants
                    $(this).css('background-image', `url('graphics/Scrabble_Tiles/Scrabble_Tile_${letter.toUpperCase()}.jpg')`);
                    $(this).append(droppedTile);
                    $(this).data('letter', letter);
                    $(this).droppable('disable'); // Disable further drops on this cell
                    calculateScore();
                }
            });
            board.append(cell);
        }
    }
    //This will calculate the score for the user depending on what letters were used and if the letter was on a double points spot or not
    function calculateScore() {
        score = 0;
        $('#scrabble-board .scrabble-cell').each(function(index) {
            const letter = $(this).data('letter');
            if (letter) {
                const letterScore = letterValues[letter];
                if (bonuses[index] > 0) {
                    score += letterScore * bonuses[index];
                } else {
                    score += letterScore;
                }
            }
        });
        $('#score').text(`Score: ${score}`);
    }
    
    //This will clear the board of all the tiles leaving it empty for a new game
    function clearBoard() {
        $('#scrabble-board .scrabble-cell').each(function() {
            const letter = $(this).data('letter');
            if (letter) {
                const tile = createTile(letter);
                tile.draggable({
                    revert: "invalid"
                });
                $('#tile-rack').append(tile);
            }
            $(this).css('background-image', 'none').data('letter', null).droppable('enable').empty();
        });
        tileRack = [];
        createTiles();
    }
    
    //This will help deal new tiles to the tile holder
    function dealNewTiles() {
        clearBoard();
    }

    $('#deal-button').click(dealNewTiles);
    $('#calculate-score').click(calculateScore);

    createTiles();
    createBoard();
});
