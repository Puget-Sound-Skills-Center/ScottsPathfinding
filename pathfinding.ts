/**
 * Scott's Pathfinding
 */
//% color=#AA278D icon="\uf554"
namespace ScottsPathfinding {

    interface FollowData {
        enemy: Sprite
        target: Sprite
        speed: number
        repathTime: number
    }

    let followers: FollowData[] = []

    //% block="enemy %enemy follow %target speed %speed repath every %repath ms"
    //% group="Following"
    export function followSprite(enemy: Sprite, target: Sprite, speed: number, repath: number) {
        followers.push({
            enemy: enemy,
            target: target,
            speed: speed,
            repathTime: repath
        })
    }

    //% block="stop following %enemy"
    //% group="Following"
    export function stopFollowing(enemy: Sprite) {
        followers = followers.filter(f => f.enemy !== enemy)
    }

    game.onUpdate(function () {
        for (let follower of followers) {
            let enemy = follower.enemy
            let target = follower.target
            if (!enemy || !target) continue

            let dx = target.x - enemy.x
            let dy = target.y - enemy.y
            let distance = Math.sqrt(dx * dx + dy * dy)

            if (distance > 0) {
                enemy.vx = dx / distance * follower.speed
                enemy.vy = dy / distance * follower.speed
            }
        }
    })

    //% block="move %sprite to tile column %col row %row speed %speed"
    //% group="Movement"
    export function moveToTile(sprite: Sprite, col: number, row: number, speed: number) {
        let location = tiles.getTileLocation(col, row)
        let dx = location.x - sprite.x
        let dy = location.y - sprite.y
        let d = Math.sqrt(dx * dx + dy * dy)

        if (d > 0) {
            sprite.vx = dx / d * speed
            sprite.vy = dy / d * speed
        }
    }
}
