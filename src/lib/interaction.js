import Matter from 'matter-js'
import {
    render,
    engine,
    world,
    bodies,
    rect, 
    circle,
    setDebug
} from './matter'


const lastLocalCoords = {}

const injectLocalXY = (e) => {
    var rect = e.target.getBoundingClientRect()
    e.localX = e.clientX - rect.left
    e.localY = e.clientY - rect.top

    lastLocalCoords.x = e.localX
    lastLocalCoords.y = e.localY
}

export const mousePressed = (clb) => {
    document.querySelector('canvas').addEventListener('mousedown', e => {
        injectLocalXY(e)
        clb(e)
    })
}
export const mouseMoved = (clb) => {
    document.querySelector('canvas').addEventListener('mousemove', e => {
        injectLocalXY(e)
        clb(e)
    })
}
export const mouseReleased = (clb) => {
    document.querySelector('canvas').addEventListener('mouseup', e => {
        injectLocalXY(e)
        clb(e)
    })
}
export const mouseGlobalReleased = (clb) => {
    window.addEventListener('mouseup', e => {
        clb(e)
    })
}
export const dblClicked = (clb) => {
    document.querySelector('canvas').addEventListener('dblclick', e => {
        injectLocalXY(e)
        clb(e)
    })
}

export const keyPressed = (clb) => {
    window.addEventListener('keydown', e => {
        clb(e)
    })
}
export const keyReleased = (clb) => {
    window.addEventListener('keyup', e => {
        clb(e)
    })
}






export const editor = () => {
    let isPressed = false
    let isDragged = false
    const startPt = {x:0, y:0}
    const endPt = {x:0, y:0}
    const dim = {w:0, h:0}

    let shapeFunc = rect

    let currentShape = null
    let isStatic = false
    let isDebug = false

    keyReleased(e => {
        const k = e.key
        if(k == 's') isStatic=!isStatic

        if(k == '1') shapeFunc=rect
        if(k == '2') shapeFunc=circle
        if(k == 'd') {
            isDebug = !isDebug
            setDebug(isDebug)
        }

    })

    const mouse = Matter.Mouse.create(render.canvas)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            angularStiffness: 0,
            render: {
                visible: false
            }
        }
    })
    Matter.Composite.add(world, mouseConstraint)
    render.mouse = mouse;




    mousePressed(e => {
        isDragged=false
        currentShape = null
        startPt.x = e.localX
        startPt.y = e.localY

        const intercepts = Matter.Query.point(bodies(), startPt)
        if(intercepts.length > 0) return

        isPressed=true

        currentShape = shapeFunc(startPt.x, startPt.y, 1, {isStatic:true})
    })

    mouseMoved(e => {
        if(isPressed){
            endPt.x = e.localX
            endPt.y = e.localY
            dim.w = endPt.x - startPt.x
            dim.h = endPt.y - startPt.y

            currentShape.remove()

            if(shapeFunc.type === 'rect'){
                const mx = startPt.x + dim.w / 2
                const my = startPt.y + dim.h / 2
                currentShape = shapeFunc(mx, my, dim.w, dim.h, {isStatic:true})
            }

            if(shapeFunc.type === 'circle'){
                const mx = startPt.x + dim.w / 2
                const my = startPt.y + dim.h / 2
                const r = Math.sqrt( dim.w*dim.w + dim.h*dim.h ) / 2
                currentShape = shapeFunc(mx, my, r, {isStatic:true})
            }

            isDragged=true
        }
    })

    mouseGlobalReleased(e => {
        isPressed=false

        if(isDragged){
            currentShape.setStatic(isStatic)
        }else{
            if(currentShape) currentShape.remove()
        }

        isDragged=false
    })

    

}