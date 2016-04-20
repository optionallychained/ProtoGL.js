var Enemy = function(type) {
    var entity = new Entity("enemy");

    var dimensions = new Vec2();
    var pos = new Vec2();
    var points = 0;
    var angle = 0;
    var col = new Vec4(0, 0, 0, 0);
    var mult = 0;

    var init = false;
    var dir = 0;
    var r = Math.random();

    var spawnDelay = randomBetween(0, 120);
    var framesAlive = 0;
    var spawned = false;

    //randomise based on type
    if (type === "square") {
        dir = r < 0.25 ? 0 : r < 0.5 ? 1 : r < 0.75 ? 2 : 3;

        dimensions.x = 15;
        dimensions.y = 15;
        pos.x = randomBetween(50, GAME.width - 50);
        pos.y = randomBetween(50, GAME.height - 50);
        points = 5;
        mult = 0.2;

        col = new Vec4(252, 130, 195, 0);
    }
    else if (type === "triangle") {
        dir = r < 0.25 ? 0 : r < 0.5 ? 1 : r < 0.75 ? 2 : 3;
        angle = dir === 0 ? 180 : dir === 1 ? 90 : dir === 2 ? 0 : -90;

        dimensions.x = 25;
        dimensions.y = 25;
        pos.x = randomBetween(50, GAME.width - 50);
        pos.y = randomBetween(50, GAME.height - 50);

        points = 25;
        mult = 0.5;

        col = new Vec4(225, 200, 41, 0);
    }
    else if (type === "pentagon") {
        dimensions.x = 35;
        dimensions.y = 35;
        pos.x = randomBetween(50, GAME.width - 50);
        pos.y = randomBetween(50, GAME.height - 50);

        points = 50;
        mult = 0.75;

        col = new Vec4(47, 181, 243, 0);

        entity.addComponent(new Gun(Math.POSITIVE_INFINITY, Math.POSITIVE_INFINITY, 625, [
            //bullet offsets
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
        ], [
            //starting angles
            -90, -90 + 55, -90 - 55
        ], [
            //bullet targets
            new Vec2(pos.x, pos.y),
            new Vec2(pos.x, pos.y),
            new Vec2(pos.x, pos.y),
        ]));
    };

    entity.addComponent(new Transform2D(pos, dimensions, new Vec2()));
    entity.addComponent(new Shape(type, dimensions, pos));
    entity.addComponent(new FlatColor(col));
    entity.addComponent(new Points(points));
    entity.addComponent(new Multiplier(mult));

    entity.components.transform2D.angle = degToRad(angle);

    entity.onUpdate = function() {
        if (framesAlive < spawnDelay) {
            framesAlive++;
            return;
        }

        var transform = this.components.transform2D;
        var color = this.components.flatColor.color;

        if (color.w < 1) {
            color.w += 0.02;
        }
        else {
            color.w = 1;
            if (!init) {
                init = true;

                //initialise the velocity of the entity, if applicable
                if (type === "triangle") {
                    var velMag = randomBetween(30, 75);
                    var xVel = dir === 1 ? velMag : dir === 3 ? -velMag : 0,
                        yVel = dir === 0 ? velMag : dir === 2 ? -velMag : 0;
                    transform.velocity.x = xVel;
                    transform.velocity.y = yVel;
                }
                else if (type === "square") {
                    transform.velocity.x = randomBetween(-25, 25);
                    transform.velocity.y = randomBetween(-25, 25);
                }

                this.addComponent(new AABBCollisionBox(dimensions));
            }

            if (transform.position.x - transform.dimensions.x / 2 < 0 || transform.position.x + transform.dimensions.x / 2 > GAME.width) {
                transform.position.x -= transform.lastMoveDelta.x || transform.lastMoveDelta;
                transform.velocity.x = -transform.velocity.x;

                transform.angle += degToRad(180);
            }

            if (transform.position.y - transform.dimensions.y / 2 < 0 || transform.position.y + transform.dimensions.y / 2 > GAME.height) {
                transform.position.y -= transform.lastMoveDelta.y || transform.lastMoveDelta;
                transform.velocity.y = -transform.velocity.y;

                transform.angle -= degToRad(180);
            }

            if (type === "pentagon") {
                this.components.transform2D.angle += degToRad(1);
                for (var i = 0; i < this.components.gun.startingAngles.length; i++) {
                    this.components.gun.startingAngles[i] += 1;
                }
                this.components.gun.shoot(this, this.components.gun);
            }
        }
    };

    entity.onCollision = function(e) {
        if (e.tag === "bullet:player") {
            GAME.removeEntity(this);
            GAME.soundManager.playSound("enemydie");
            GAME.addPoints(this.components.points.value);
            GAME.addMultiplier(this.components.multiplier.value);
        }
        if (e.tag === "player") {
            if (e.components.AABBCollisionBox.active) {
                GAME.removeEntity(this);
                GAME.soundManager.playSound("enemydie");
            }
        }
    };

    return entity;
};