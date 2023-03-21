import Matter from 'matter-js'
import { MatterCollisionEvents } from './lib/matter-collision-events'

import * as mttr from './lib/matter'
import * as utils from './lib/utils'
import * as interactions from './lib/interaction'

MatterCollisionEvents.install(Matter)

const {Engine, Render, Runner} = Matter || {}

export default (_el) => {

  const el = typeof _el === 'string' ? document.querySelector(_el) : _el

  const bb = el.getBoundingClientRect()

  const w = bb.width || 300
  const h = bb.height || 200

  var engine = Engine.create()
  engine.gravity.y = 0.4

  var render = Render.create({
      element: el,
      engine: engine,
      options:{
        width:w,
        height:h,
        wireframes: false,
        background: 'black'
      }
  })

  Render.run(render)
  var runner = Runner.create()
  Runner.run(runner, engine)

  mttr.init(render, runner)

  return {...mttr, ...interactions, ...utils}
}


