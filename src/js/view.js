module.exports = function (players, gestures, eventEmitter) {

    //handlers
    eventEmitter.on('activeButtonChange', onActiveButtonChange);

    var infoArea = document.createElement('div');
    infoArea.className = 'info-area';
    document.body.appendChild(infoArea);

    var containers = players
      .filter(function (player) {
          return player.isHuman();
      })
      .map(function (player, index) {
          var container = document.createElement('div');
          container.className = 'player-' + index;

          //player selection
          var userSelection = document.createElement('div');
          userSelection.className = 'user-selection';

          gestures.forEach(function (gesture) {
              var button = document.createElement('button');
              button.className = 'punch';
              button.innerText = gesture;
              container.appendChild(button);
              //handlers
              button.onclick = function () {
                  eventEmitter.emit('gestureChange', {player: player, gesture: gesture});
                  eventEmitter.emit('activeButtonChange', {container: container, button: button});
                  userSelection.innerText = gesture;
              };

          });

          container.appendChild(userSelection);

          return container;
      });

    //append button groups
    containers.forEach(function (container) {
        document.body.appendChild(container);
    });

    eventEmitter.on('countdown', function (count) {
        infoArea.innerText = count;
    });

    eventEmitter.on('score', function (winner) {
        setTimeout(function () {
            infoArea.innerText = winner ? winner.getName() + " Wins!!!" : 'TIE';
            setTimeout(function () {
                enableButtons();
            }, 500);
        }, 1000);
    });

    eventEmitter.on('countdownStart', function () {
        containers.forEach(function (container) {
            var buttons = Array.prototype.slice.call(container.childNodes);
            buttons.forEach(function (button) {
                button.disabled = true;
            });
        });
    });

    //TODO not DRY!!!
    function enableButtons() {
        containers.forEach(function (container) {
            var buttons = Array.prototype.slice.call(container.childNodes);
            buttons.forEach(function (button) {
                button.disabled = false;
            });
        });
    }

    function onActiveButtonChange(message) {
        var container = message.container;
        var buttons = Array.prototype.slice.call(container.childNodes);
        buttons.forEach(function (button) {
            if (button === message.button) {
                button.className = 'punch active';
            } else {
                button.className = 'punch';
            }
        });
    }
};
