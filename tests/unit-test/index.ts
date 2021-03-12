import { Orchestrator } from '@holochain/tryorama'

const orchestrator = new Orchestrator()
require('./profile')(orchestrator)
orchestrator.run()
