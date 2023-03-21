import Matter from 'matter-js'

export let engine
export let world
export let render
export let runner

export const init = (_render, _runner) => {
    render = _render
    engine = render.engine
    world = engine.world
    runner = _runner

    render.w = render.options.width
    render.h = render.options.height
    render.cx = render.options.width/2
    render.cy = render.options.height/2

    var create = Matter.Body.create
    Matter.Body.create = function() {
        var body = create.apply(null, arguments)
        body.setVelocity = (op) => { 
            const bop = {x:0, y:0, ...op}
            Matter.Body.setVelocity(body, bop)
        }
        body.setAngular = (v) => { 
            Matter.Body.setAngularVelocity(body, v)
        }
        body.setPosition = (op) => { 
            const bop = {x:body.position.x, y:body.position.y, ...op}
            Matter.Body.setPosition(body, bop)
        }
        body.setRotation = (v) => { 
            Matter.Body.rotate(body, v)
        }
        body.setStatic = (v) => {
            Matter.Body.setStatic(body, v)
        }
        body.setColor = (v) => {
            body.render.fillStyle = v
        }

        body.remove = () => {
            Matter.World.remove(world, body)
        }

        return body
    }


}


const shapeOptDef = (o={}) => {
    const renderKeys = ['visible', 'opacity', 'strokeStyle', 'fillStyle', 'lineWidth', 'sprite']
    const fillStyle = render.options.defaultFill || '#fff'
    const renderOb = {fillStyle}
    renderKeys.forEach(k => {
        if(o.hasOwnProperty(k)) renderOb[k] = o[k]
    })
    return {
        render:renderOb,
        restitution:0.9, 
        friction:0.0001,
        ...o
    }
}

export const rect = (x=render.w/2,y=render.h/2,w=50,h=50,o) => {
    const opt = shapeOptDef(o)
    const b = Matter.Bodies.rectangle(x,y,w,h, opt)
    Matter.World.add(world, b)
    return b
}
rect.type = 'rect'

export const circle = (x=render.w/2,y=render.h/2,r=25,o) => {
    const opt = shapeOptDef(o)
    const b = Matter.Bodies.circle(x,y,r, opt)
    Matter.World.add(world, b)
    return b
}
circle.type = 'circle'

export const poly = (x=render.w/2,y=render.h/2,r=25,s=6, o) => {
    const opt = shapeOptDef(o)
    const b = Matter.Bodies.polygon(x,y,s,r, opt)
    Matter.World.add(world, b)
    return b
}
circle.type = 'poly'


export const loop = clb => {
    Matter.Events.on(runner, 'afterTick', (e) => {
        clb(e)
    })
}

export const bodies = () => world.bodies

export const walls = (sides, ops={}) => {
    const w = render.w
    const h = render.h
    const x = w/2
    const y = h/2
    if(sides.indexOf('t') >= 0) rect(x, -10, w, 20, { isStatic: true, label:'WT', ...ops })
    if(sides.indexOf('b') >= 0) rect(x, h+10, w, 20, { isStatic: true, label:'WB', ...ops })
    if(sides.indexOf('l') >= 0) rect(-10, y, 20, h, { isStatic: true, label:'WL', ...ops })
    if(sides.indexOf('r') >= 0) rect(w+10, y, 20, h, { isStatic: true, label:'WR', ...ops })
}

export const removeWalls = (sides) => {
    const arr = []
    const bodies = bodies()
    if(sides.indexOf('t') >= 0) arr.push(bodies.find(b => b.label === 'WT'))
    if(sides.indexOf('b') >= 0) arr.push(bodies.find(b => b.label === 'WB'))
    if(sides.indexOf('l') >= 0) arr.push(bodies.find(b => b.label === 'WL'))
    if(sides.indexOf('r') >= 0) arr.push(bodies.find(b => b.label === 'WR'))
    remove(arr)
}

export const setDebug = v => {
    render.options.showAngleIndicator = v
    render.options.showAxes = v
    render.options.showBounds = v
    render.options.showCollisions = v
    render.options.showDebug = v
    render.options.showPositions
    render.options.showSeparations
    render.options.showVelocity
    render.options.wireframes
}







export const onCollide = (clb) => {
    Matter.Events.on(engine, 'collisionStart', clb)
}
export const onCollideActive = (clb) => {
    Matter.Events.on(engine, 'collisionActive', clb)
}
export const onCollideEnd = (clb) => {
    Matter.Events.on(engine, 'collisionEnd', clb)
}






export const addConstraint = (bodyA, pointA, pointB, bodyB, ops={}) => {

    var constraint = Matter.Constraint.create({
        bodyA,
        pointA,
        
        bodyB,
        pointB,

        ...ops
        // stiffness: 0.001,
        // damping: 0.05
    })

    Matter.Composite.add(world, constraint)
}