const adj = 'adj'
const noun = 'noun'
const agentive = 'keeper, eater, stalker'
const title = 'master, lord, queen, mistress'

const a = `The ${noun} and the ${adj} ${noun}`
const b = `The ${noun} and ${adj} ${noun}`
const c = `The ${adj} ${noun}`
const d = `The ${adj} ${adj} ${noun}`

const e = `of the ${noun}`
const f = `of the ${adj} ${noun}`
const g = `of ${noun}`
const h = `of ${adj} ${noun}`

const i = ` the ${noun}` //epithet
const j = `The ${noun} and ${noun}` //tavern
const k = `The ${agentive | title} of the ${adj} ${noun}` //dominion
const l = `The ${agentive | title} of ${noun}` //dominion