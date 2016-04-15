var Player = function() {
    var entity = new Entity("player");
    entity.addComponent(new Sprite(0, 0, 0.25, 1));
    entity.addComponent(new Transform2D(new Vec2(GAME.width / 2, GAME.height / 2), new Vec2(40, 40), new Vec2(0, 0)));
    entity.addComponent(new AABBCollisionBox(new Vec2(40, 40)));
    entity.addComponent(new Health(3));
    entity.addComponent(new Points());

    entity.components.transform2D.maxVelocity = new Vec2(75, 75);
    entity.components.transform2D.angle = degToRad(180);
    entity.components.AABBCollisionBox.coolDownTime = 75;

    entity.onUpdate = function() {
        var transform = this.components.transform2D;
        var collisionBox = this.components.AABBCollisionBox;

        //poll global input handler and respond as necessary
        if (GAME.inputHandler.isKeyDown(KEYCODES.w)) {
            transform.velocity = new Vec2(0, transform.maxVelocity.y);
            transform.angle = degToRad(180);
        }
        else if (GAME.inputHandler.isKeyDown(KEYCODES.a)) {
            transform.velocity = new Vec2(-transform.maxVelocity.x, 0);
            transform.angle = degToRad(-90);
        }
        else if (GAME.inputHandler.isKeyDown(KEYCODES.s)) {
            transform.velocity = new Vec2(0, -transform.maxVelocity.y);
            transform.angle = 0;
        }
        else if (GAME.inputHandler.isKeyDown(KEYCODES.d)) {
            transform.velocity = new Vec2(transform.maxVelocity.x, 0);
            transform.angle = degToRad(90);
        }

        if (transform.position.x + transform.dimensions.x < 0) {
            transform.position.x = GAME.width;
        }
        else if (transform.position.x > GAME.width) {
            transform.position.x = -transform.dimensions.x;
        }

        if (transform.position.y > GAME.height) {
            transform.position.y = -transform.dimensions.y;
        }
        else if (transform.position.y + transform.dimensions.y < 0) {
            transform.position.y = GAME.height;
        }

        if (!collisionBox.active) {
            collisionBox.coolDownTimer++;

            if (collisionBox.coolDownTimer % 2 === 0) {
                this.removeComponent(Sprite);
            }
            else {
                if (!this.hasComponent(Sprite)) {
                    this.addComponent(new Sprite(0, 0, 0.25, 1));
                }
            }

            if (collisionBox.coolDownTimer > collisionBox.coolDownTime) {
                collisionBox.coolDownTimer = 0;
                collisionBox.active = true;
                if (!this.hasComponent(Sprite)) {
                    this.addComponent(new Sprite(0, 0, 0.25, 1));
                }
            }
        }
    };
    
    entity.onCollision = function(e) {
        if (e.tag === "food") {
            this.components.points.value++;
            GAME.soundManager.playSound("point");
        }
        else if (e.tag === "enemy") {
            if (this.components.AABBCollisionBox.active) {
                this.components.health.value--;
                this.components.AABBCollisionBox.active = false;
                GAME.soundManager.playSound("hit");
            }
        }
    };
    
    return entity;
}