import { Codec } from '@holo-host/cryptolib'
import { AppBundle, AppRoleManifest, AppRoleDnaManifest } from '@holochain/client'
import { Conductor, Dna, AgentApp } from '@holochain/tryorama'
import path from 'path'
import { inspect } from 'util'
import { fileURLToPath } from 'url'
import * as msgpack from '@msgpack/msgpack'
import { InstallAgentsArgs, Memproof } from './types'
import { Dictionary } from 'lodash';

const __filename = fileURLToPath(import.meta.url)

const dnaPath = {
  path: path.join(path.dirname(__filename), '../hc-zomes.dna'),
}

const jcFactoryDna = {
  path: path.join(path.dirname(__filename), '../dnas/joining-code-factory.dna'),
}

export const installMemProofHapp = async (
  conductor: Conductor
): Promise<AgentApp> => {
  const holo_agent_override = await conductor.adminWs().generateAgentPubKey()
  const bundle = createHappBundle("jcf", {"jcf":jcFactoryDna})
  const [memProofHapp] = await conductor.installAgentsApps({
    agentsApps: [{
      app: { bundle },
      agentPubKey: holo_agent_override,
      installedAppId: `jcf`,
      // networkSeed?: string;
      // membraneProofs?: Record<string, MembraneProof>;
      // signalHandler?: AppSignalCb;
    }],
    // networkSeed?: string;
    // installedAppId?: string;
  })
  return memProofHapp
}

export const installAgentHapps = async ({
  conductor,
  number_of_agents,
  not_editable_profile,
  memProofHapp = undefined,
  memProofHandler = (m) => m,
}: InstallAgentsArgs): Promise<AgentApp[]> => {
  let agents: AgentApp[] = []
  console.log('number_of_agents : ', number_of_agents)
  for (let i = 0; i < number_of_agents; i++) {
    const agentPubKey = await conductor.adminWs().generateAgentPubKey()
    console.log(
      `Generated agent #${i + 1} pubkey: ${Codec.AgentId.encode(agentPubKey)}`
    )

    let membraneProof

    // Without memproof assignment below, tests default to all the dnas being tested with read only mem-proof
    if (!!memProofHapp) {
      const membrane_proof: Memproof = await memProofHapp.cells[0].callZome({
        zome_name: 'code-generator',
        fn_name: 'make_proof',
        payload: {
          role: 'ROLE',
          record_locator: 'RECORD_LOCATOR',
          registered_agent: Codec.AgentId.encode(agentPubKey),
        },
      })
      const mutated = memProofHandler(membrane_proof)
      membraneProof = Array.from(msgpack.encode(mutated))
    }

    try {
      const bundle = createHappBundle("test", {"test": {
        //@ts-ignore
        path: dnaPath.path, 
        modifiers: {properties: {
          "skip_proof": !memProofHapp,
          "holo_agent_override": memProofHapp?.agentPubKey,
          not_editable_profile,
        }
      }
      }})
      const [newAgentHapp] = await conductor.installAgentsApps({
        agentsApps: [{
          app: { bundle },
          agentPubKey,
          membraneProofs: membraneProof ? { "test": membraneProof } : undefined
          // installedAppId: string,
          // networkSeed?: string;
          // signalHandler?: AppSignalCb;
        }],
        // networkSeed?: string;
        // installedAppId?: string;
      })

      console.log(
        `Registered new happ for Agent #${i + 1} : ${inspect(newAgentHapp)}`
      )
      agents.push(newAgentHapp)
    } catch (e) {  
      console.error('Error installing agent happs', e)
      throw e
    }
  }
  return agents
}

const createHappBundle = ( name, dnas: Dictionary<string, AppRoleDnaManifest> ) => {
  const bundle: AppBundle	= {
    manifest: {
        manifest_version: "1",
        name,
        roles: []
    },
    "resources": {},
  };

  for ( let [role_name, roleManifest] of Object.entries(dnas) ) {
    // let roleManifest: AppRoleDnaManifest = {
    //   //@ts-ignore
    //   path: dna.path,
    //   properties: dna.properties
    // }
    let x: AppRoleManifest = {
      name: role_name,
      dna: roleManifest,
    }
    bundle.manifest.roles.push(x);
  }

  return bundle;
}
