//% color=#AA278D icon="\uf554"
namespace ScottsPathfinding {
    class FollowInfo {
        constructor(public enemy: Sprite, public target: Sprite, public speed: number) {}
    }
    let followers: FollowInfo[] = []

    //% block="enemy %enemy pathfind follow %target speed %speed"
    export function followSprite(enemy: Sprite, target: Sprite, speed: number) {
        stopFollowing(enemy)
        followers.push(new FollowInfo(enemy,target,speed))
    }

    //% block="stop following %enemy"
    export function stopFollowing(enemy: Sprite) {
        followers = followers.filter(f => f.enemy != enemy)
        enemy.vx = 0; enemy.vy = 0
    }

    game.onUpdateInterval(300, function() {
        for (let f of followers) moveOneStep(f)
    })

    function moveOneStep(f: FollowInfo) {
        let s = tiles.locationOfSprite(f.enemy)
        let g = tiles.locationOfSprite(f.target)
        if (!s || !g) return
        let next = findNextTile(s.column,s.row,g.column,g.row)
        if (!next) return
        let loc = tiles.getTileLocation(next.c,next.r)
        let dx = loc.x - f.enemy.x
        let dy = loc.y - f.enemy.y
        let d = Math.sqrt(dx*dx+dy*dy)
        if (d>0) {
            f.enemy.vx = dx/d*f.speed
            f.enemy.vy = dy/d*f.speed
        }
    }

    function findNextTile(sx:number,sy:number,gx:number,gy:number): any {
        let open:any[]=[{c:sx,r:sy,g:0,h:h(sx,sy,gx,gy),p:null}]
        let closed:string[]=[]
        while(open.length>0){
            let best=0
            for(let i=1;i<open.length;i++) if(open[i].g+open[i].h<open[best].g+open[best].h) best=i
            let cur=open.removeAt(best)
            if(cur.c==gx && cur.r==gy){
                while(cur.p && cur.p.p) cur=cur.p
                return cur
            }
            closed.push(cur.c+","+cur.r)
            let dirs=[[1,0],[-1,0],[0,1],[0,-1]]
            for(let d of dirs){
                let nc=cur.c+d[0], nr=cur.r+d[1]
                let key=nc+","+nr
                if(closed.indexOf(key)>=0) continue
                let tl=tiles.getTileLocation(nc,nr)
                if(tiles.tileAtLocationIsWall(tl)) continue
                let found=false
                for(let o of open) if(o.c==nc && o.r==nr) found=true
                if(!found) open.push({c:nc,r:nr,g:cur.g+1,h:h(nc,nr,gx,gy),p:cur})
            }
        }
        return null
    }

    function h(x1:number,y1:number,x2:number,y2:number){
        return Math.abs(x1-x2)+Math.abs(y1-y2)
    }
}
