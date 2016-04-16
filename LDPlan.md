#Theme: Shapeshift

#Game Name: Shapeshift (typical)

##Genre: Shooter (Geom Wars-esque)

##Elevator: A top-down shooter based around primary shapes where the player can shapeshift to change playstyle/power up. Neon (hopefully) palette

###Requirements:
    - Overall
        - How 2 Neon?
        - ~~Shapes stuff for defining geometry + basic shapes~~
            - ~~Triangle~~
            - ~~Square~~
            - Pentagon
            - Circle?
            - Hexagon?
        - ~~Ability to grow and shrink shapes from an arbitrary centre point...would scaling work?~~
    - Player control
        - ~~direction change (rotation) very fast? (WASD)~~
        - ~~Small acceleration effect?~~
            - play with this (and deceleration)
    - Stages
        - background + enemy pool
        - Background should be a grid
            - (low priority) if time, figure out how to make a 3D net and wing it
    - Enemies
        - Triangle
            - Liner motion, bounces off stage walls
        - Square
            - Just hangs around (starter enemy)
        - Pentagon
            - Shoots in some pattern from its points
        - Circle?
            - Spawns and heads towards you (but does not follow you)
        - Hexagon?
            - Bomb? (destroys all enemies)
    - ShapeShift ability
        - Shapes:
            - Triangle
                - Shoot forward (spray pattern)
                - Best speed
            - Square/Rect
                - Shoot in front and behind
                - Moderate speed
            - Pentagon
                - Shoot out of all 5 of your points
                - Slow speed
            - Circle?
                - Shoot a shockwave of bullets all around?
                - "Definitely gonna get hit" speed
        - Player shifts up when multiplier reaches certain heights
            - (enemy difficulty and frequency increases with multiplier also)
        - Getting hit reduces multiplier by three quarters to ensure a downgrade
    - Stuff I need entities to be able to do:
        - ~~Make sure rotation affects velocity vectors it should~~
        - ~~acceleration~~ and deceleration
        - ~~Be represented by a Shape (new component)~~
            - ~~Therefore have to separate them in the EntityManager and assign new rendersettings etc on the fly~~
        - Change shape - either by staight up swapping or by shrinking one and growing the new?
            - Alternative: find the math way to transform the positions (+ widths) to achieve actual animations)
        - Shoot in any direction (probably not useful at engine level?)
    - Controls:
        - ~~WASD (ALSO ALLOW FOR FOREIGN KEYBOARDS): move~~
        - Space: Fire
        - B: Bomb??
    - Rules:
        - Wave patterns
        - Procedural?
            - Number of enemies increases with time/points/multiplier?
            - Waves contain a mix of all enemies, where those enemies' thresholds are below the time/points/multiplier
        - 3 Health Points, small invincibility after hit
        - Health is gained for x number of points or x multiplier milestone?
        - All bullets do the same damage, the player (and enemies) just shoot more of them in lieu of more damage