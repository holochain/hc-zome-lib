import { Orchestrator } from '@holochain/tryorama'

let orchestrator
orchestrator = new Orchestrator()
require('./profile')(orchestrator)
orchestrator.run()

orchestrator = new Orchestrator()
require('./profile_not_editable')(orchestrator)
orchestrator.run()
