import { Conductor, AgentApp, enableAndGetAgentApp } from '@holochain/tryorama'
import {
	AppBundle,
	AppRoleManifest,
	AppRoleDnaManifest,
} from '@holochain/client'
import { TEST_DNA_PATH, JC_DNA_PATH } from './const.js'
import { Dictionary } from 'lodash'
import { Codec } from '@holo-host/cryptolib'
import * as msgpack from '@msgpack/msgpack'

export const getTimestamp = () => Date.now() * 1000

type InstallAgentsOnConductorArgs = {
	conductor: Conductor
	number_of_agents: number
	membraneProofGenerator?: AgentApp
	signalHandler?: any
	holo_agent_override?: Uint8Array
	memProofMutator?: (memproof: Memproof) => Memproof
	not_editable_profile?: boolean
}

export type Memproof = {
	signed_action: {
		action: any
		signature: Buffer
	}
	entry: any
}

export const installMemProofHapp = async (c: Conductor) => {
	const bundle = createHappBundle('jcf', { jcf: { path: JC_DNA_PATH.path } })
	let appInfo = await c.installApp({ bundle })
	const adminWs = c.adminWs()
	const port = await c.attachAppInterface()
	const issued = await adminWs.issueAppAuthenticationToken({
		installed_app_id: appInfo.installed_app_id,
	});
	const appAgentWs = await c.connectAppWs(issued.token, port)
	let app = await enableAndGetAgentApp(adminWs, appAgentWs, appInfo)
	return app
}


export const installAgentsOnConductor = async ({
	conductor,
	number_of_agents,
	membraneProofGenerator = undefined,
	memProofMutator = (m) => m,
	not_editable_profile = false,
	holo_agent_override = undefined,
}: InstallAgentsOnConductorArgs): Promise<AgentApp[]> => {
	let agentsApps: any = []
	const bundle = createHappBundle('test', {
		'dna-test': {
			//@ts-ignore
			path: TEST_DNA_PATH.path,
			modifiers: {
				properties: {
					not_editable_profile,
					skip_proof: !membraneProofGenerator,
					holo_agent_override: holo_agent_override
						? Codec.AgentId.encode(holo_agent_override)
						: membraneProofGenerator
						? Codec.AgentId.encode(membraneProofGenerator?.agentPubKey)
						: undefined,
				},
			},
		},
	})

	for (let i = 0; i < number_of_agents; i++) {
		// Manually generates an agent
		const agentPubKey = await conductor.adminWs().generateAgentPubKey()

		// Generate a mem-proof for just created agent
		let membraneProof
		if (!!membraneProofGenerator) {
			const membrane_proof: Memproof = await membraneProofGenerator.cells[0].callZome({
				zome_name: 'code-generator',
				fn_name: 'make_proof',
				payload: {
					role: 'holofuel',
					record_locator: 'RECORD_LOCATOR',
					registered_agent: Codec.AgentId.encode(agentPubKey),
				},
			})
			const mutated = memProofMutator(membrane_proof)
			membraneProof = Array.from(msgpack.encode(mutated))
		}

		agentsApps.push({
			app: { bundle },
			agentPubKey,
			membraneProofs: membraneProof
				? { "dna-test": membraneProof }
				: undefined,
			// installedAppId: string, 	// option to add installed-app-id
			// networkSeed?: string;	// option to add network-seed
		})
	}
	try {
		let apps = await conductor.installAgentsApps({
		agentsApps,
		// networkSeed?: string;
		// installedAppId?: string;
	})
	await conductor.attachAppInterface()
	const adminWs = conductor.adminWs()
	const port = await conductor.attachAppInterface()
	let appInstance = []
	for (const agentApps of apps) {
		const issued1 = await adminWs.issueAppAuthenticationToken({
			installed_app_id: agentApps.installed_app_id,
		  });
		  const appAgentWs = await conductor.connectAppWs(issued1.token, port)		
		let app = await enableAndGetAgentApp(adminWs, appAgentWs, agentApps)
		appInstance.push({
			conductor,
			appAgentWs,
			...app,
		})
	}
	return appInstance	
} catch (e) {
		console.log('Error installing happ: ', e)
		throw e
	}
}

const createHappBundle = (
	name,
	dnas: Dictionary<string, AppRoleDnaManifest>
) => {
	const bundle: AppBundle = {
		manifest: {
			manifest_version: '1',
			name,
			roles: [],
			membrane_proofs_deferred: false,
		},
		resources: {},
	}

	for (let [role_name, roleManifest] of Object.entries(dnas)) {
		let x: AppRoleManifest = {
			name: role_name,
			dna: roleManifest as AppRoleDnaManifest,
		}
		bundle.manifest.roles.push(x)
	}

	return bundle
}
