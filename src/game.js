'use strict';

function Game(players, gestures) {

    return {
        play: function () {

            var winners = players.filter(isWinner);

            return winners[0];
        }
    };

    function isWinner(player, index) {

        var positions = players.map(getGesturePosition);

        var currentPosition = positions[players.indexOf(player)];

        return positions.every(function (position, nextIndex) {
            if (index === nextIndex) {
                return true;
            } else {
                return isGreater(currentPosition, position) === 1;
            }
        });
    }

    function isGreater(x, y) {

        if (x === y) {
            return 0;
        }

        if (sameParity(x, y)) {
            return x < y ? 1 : -1;
        } else {
            return x > y ? 1 : -1;
        }
    }

    function getGesturePosition(player) {
        return gestures.indexOf(player.getGesture()) + 1;
    }

    function sameParity(num1, num2) {
        return (num1 & 1) === (num2 & 1);
    }

}


function Player() {

    var gesture;

    return {

        setGesture: function (newGesture) {
            gesture = newGesture;
        },

        getGesture: function () {
            return gesture;
        }
    }
}
