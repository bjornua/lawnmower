define(["vector", "game", "immutable"], function (Vector, Game, Immutable) {
    "use strict";

    var Session = Immutable.Record({
        moves: Immutable.Stack(),
        game: undefined
    });

    var possibleMoves = Immutable.fromJS({
        moveForward: function (game) {
            return game.moveForward();
        },
        turnRight: function (game) {
            return game.turnRight();
        },
        turnLeft: function (game) {
            return game.turnLeft();
        }
    });

    var makeMoves = function (sessions) {
        return sessions.map(function (session) {
            return possibleMoves.map(function (f, name) {
                return session.merge({
                    moves: session.moves.unshift(name),
                    game: f(session.game)
                });
            });
        }).flatten(1);

    };

    var sortBy = function (session) {
        return -session.game.score;
    };

    var bfs = function (game) {
        var games = Immutable.List.of(Session({
            game: game
        }));
        var prevGames = games;
        while (!games.get(0).game.isCompleted()) {
            games = makeMoves(games);
            games = games.sortBy(sortBy).take(20);
            if (Immutable.is(games, prevGames)) {
                break;
            }
        }
        console.log(String(games.get(0).moves.reverse()));
        console.log("Score", String(games.get(0).game.score));

    };


    return function (game) {
        bfs(game);
        return game;
    };
});