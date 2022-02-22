(function () {

    var keys = {
        up: false,
        left: false,
        down: false,
        right: false,
        b: false,
        a: false
    };

    var constants = {
        WIDTH: 800,
        HEIGHT: 552,
        FPS: 50,
        MAX_X_WALKING_VELOCITY: 5,
        MAX_X_RUNNING_VELOCITY: 9,
        RUNNING_ACCELERATION: .7,
        WALKING_ACCELERATION: .7,
        GRAVITY: 1,
        FRICTION: .3,
        JUMPING_FORCE: 7,
        MIN_JUMP_FRAMES: 3, // Minimum number of frames that a jump will increase y velocity for
        MAX_JUMP_FRAMES: 5 // Maximum number of frames that y velocity can be increased for
    };

    var _ = {
        xPos: constants.WIDTH / 2,
        yPos: 0,
        xVel: 0,
        yVel: 0,

        // Current number of frames spent jumping
        currentJumpFrames: 0,

        // True if player is still holding jump button during a jump
        holdingJump: false,

        framesLeft: 0,

        spriteX: 0,
        spriteY: 0
    };

    _.initialize = function () {
        $("#frame").height(constants.HEIGHT);
        $(document).on('keyup keydown', _.onKeyEvent);
        $("#frame").append("<div id='blocky'></div>");
        _.$container = $("#blocky");

        setInterval(function () {
            _.update();
            _.render();
        }, 1000 / constants.FPS);
    };

    /**
     * Set the key matching e.keyCode in the keys field to be true if e.type == 'keydown'
     * or false if e.type != 'keydown'
     *
     * @param e the key event
     */
    _.onKeyEvent = function (e) {
        keys[({65: 'left', 83: 'down', 68: 'right', 75: 'b', 76: 'a'})[e.keyCode]] = (e.type == 'keydown');
    }

    _.update = function () {
        // Jump initiate
        if (_.yPos == 0 && keys.a && !_.holdingJump) {
            _.currentJumpFrames = 1;
            _.holdingJump = true;
        }

        // Increment jump frames
        if (_.currentJumpFrames > 0) {
            _.currentJumpFrames++;
        }

        // Player let go of jump
        if (_.yPos > 0 && !keys.a || _.currentJumpFrames == constants.MAX_JUMP_FRAMES) {
            _.holdingJump = false;
        }

        if ((0 < _.currentJumpFrames && _.currentJumpFrames < constants.MIN_JUMP_FRAMES) || _.holdingJump) {
            _.yVel += constants.JUMPING_FORCE;
        }

        // Apply friction
        if (_.yPos == 0) {
            _.xVel = (_.xVel > 0) ? Math.max(0, _.xVel - constants.FRICTION) : Math.min(0, _.xVel + constants.FRICTION);
        }
        // Apply gravity
        _.yVel -= constants.GRAVITY;

        if (keys.left && !(keys.down && _.yPos == 0)) {
            _.xVel = (keys.b) ? Math.max(_.xVel - constants.RUNNING_ACCELERATION, -constants.MAX_X_RUNNING_VELOCITY) :
                                Math.max(_.xVel - constants.WALKING_ACCELERATION, -constants.MAX_X_WALKING_VELOCITY);
        }
        if (keys.right && !(keys.down && _.yPos == 0)) {
            _.xVel = (keys.b) ? Math.min(_.xVel + constants.RUNNING_ACCELERATION, constants.MAX_X_RUNNING_VELOCITY) :
                                Math.min(_.xVel + constants.WALKING_ACCELERATION, constants.MAX_X_WALKING_VELOCITY);
        }

        // Update position
        _.xPos += _.xVel;
        _.yPos += _.yVel;


        // End jump
        if (_.yPos == 0) {
            _.currentJumpFrames = 0;
        }

        // Check boundaries
        if (_.yPos < 0) {
            _.yPos = _.yVel = 0;
        }
        if (_.xPos < 0) {
            _.xPos = _.xVel = 0;
        }
        if (_.xPos > constants.WIDTH) {
            _.xPos = constants.WIDTH;
            _.xVel = 0;
        }
    };

    /**
     * Set blocky's position and sprite based on current state
     */
    _.render = function () {
        _.$container.css({
            top: (constants.HEIGHT - _.yPos) - 180,
            left: _.xPos
        });

        // Change direction faced if necessary
        if (keys.left) {
            _.spriteY = 0;
        }
        if (keys.right) {
            _.spriteY = 1;
        }

        // Ducking
        if (keys.down) {
            _.spriteX = 4;
        } else if (_.yPos > 0) {
            // Jumping
            _.spriteX = (_.yVel > 0) ? 3 : 2;
        } else if (_.xVel != 0) {
            if ((_.xVel < 0 && keys.right) || (_.xVel > 0 && keys.left)) {
                // If facing the opposite direction of movement
                _.spriteX = 5;
            } else {
                // Running
                var decrement = (Math.abs(_.xVel) > constants.MAX_X_WALKING_VELOCITY) ? 2 : 1;
                if (_.framesLeft <= 0) {
                    _.framesLeft = 15;
                }

                if (_.framesLeft > 11) {
                    _.spriteX = 1;
                } else if (_.framesLeft > 7) {
                    _.spriteX = 0;
                } else if (_.framesLeft > 3) {
                    _.spriteX = 1;
                } else {
                    _.spriteX = 2;
                }
                _.framesLeft -= decrement;
            }
        } else {
            // Standing still
            _.spriteX = 0;
            _.framesLeft = 0;
        }

        _.$container.css('backgroundPosition', -(_.spriteX * 128) + "px " + -(_.spriteY * 128) + "px");
    };

    $(function () {
        _.initialize();
    });

})();