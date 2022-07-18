import { Codec } from '@holo-host/cryptolib';
import {
  AgentHapp,
    Conductor,
  Dna
} from '@holochain/tryorama';
import path from 'path';
import { inspect } from 'util';
import { fileURLToPath } from 'url';
import * as msgpack from '@msgpack/msgpack';
import { InstallAgentsArgs, Memproof } from './types';

const __filename = fileURLToPath(import.meta.url);

const dnaPath = {
  path: path.join(path.dirname(__filename), '../hc-zomes.dna')
};

const jcFactoryDna = {
  path: path.join(path.dirname(__filename), '../dnas/joining-code-factory.dna')
}

export const installMemProofHapp = async (
	conductor: Conductor,
	scenario_uid?: string,
): Promise<AgentHapp> => {
	const holo_agent_override = await conductor.adminWs().generateAgentPubKey()
	const [memProofHapp] = await conductor.installAgentsHapps({
		agentsDnas: [{
			dnas: [{ 
				source: jcFactoryDna
			}],
			agentPubKey: holo_agent_override
    }],
	  uid: scenario_uid,
		installedAppId: `holo_agent_override`
	})
  return memProofHapp
}

export const installAgentHapps = async ({
  conductor,
  scenario_uid,
  number_of_agents,
  not_editable_profile,
  memProofHapp = undefined,
  memProofHandler = (m) => m,
}: InstallAgentsArgs): Promise<AgentHapp[]> => {
  let agents: AgentHapp[] = []
  console.log('number_of_agents : ', number_of_agents)
  for (let i = 0; i < number_of_agents; i++) {
	  const agentPubKey = await conductor.adminWs().generateAgentPubKey()
	  console.log(`Generated agent #${i+1} pubkey: ${Codec.AgentId.encode(agentPubKey)}`)
	  
    let membraneProof;

    // Without memproof assignment below, tests default to all the dnas being tested with read only mem-proof
    if (!!memProofHapp) {
    	const membrane_proof: Memproof = await memProofHapp.cells[0].callZome({
    		zome_name: 'code-generator',
    		fn_name: 'make_proof',
    		payload: {
    			role: "ROLE",
    			record_locator: "RECORD_LOCATOR",
    			registered_agent: Codec.AgentId.encode(agentPubKey)
    		}
    	});
    	const mutated = memProofHandler(membrane_proof)
    	membraneProof = Array.from(msgpack.encode(mutated))
    }

    const dnaOptions: Dna = {
      source: dnaPath,
      membraneProof,
      properties: { 
        skip_proof: !memProofHapp, 
        holo_agent_override: memProofHapp?.agentPubKey,
        not_editable_profile
      }
    }
    try {
      const [newAgentHapp] = await conductor.installAgentsHapps({
        agentsDnas: [{
          dnas: [dnaOptions],
          agentPubKey
        }],
        uid: scenario_uid
      })
      console.log(`Registered new happ for Agent #${i+1} : ${inspect(newAgentHapp)}`)
      agents.push(newAgentHapp)
    } catch (e) {
      console.error('Error installing agent happs', inspect(e))
      throw e
    }
  }
  return agents
}
