import { Conductor, AgentApp, enableAndGetAgentApp } from '@holochain/tryorama'
import {
	AppBundle,
	AppRoleManifest,
	AppRoleDnaManifest,
} from '@holochain/client'
import { TEST_DNA_PATH } from './const.js'
import { Dictionary } from 'lodash'

export const getTimestamp = () => Date.now() * 1000

type InstallAgentsOnConductorArgs = {
	conductor: Conductor
	number_of_agents: number
	membraneProofGenerator?: AgentApp
	signalHandler?: any
	holo_agent_override?: Uint8Array
	not_editable_profile?: boolean
}

export const installAgentsOnConductor = async ({
	conductor,
	number_of_agents,
	not_editable_profile = false,
}: InstallAgentsOnConductorArgs): Promise<AgentApp[]> => {
	let agentsApps: any = []
	const bundle = createHappBundle('test', {
		'dna-test': {
			//@ts-ignore
			path: TEST_DNA_PATH.path,
			modifiers: {
				properties: {
					skip_proof: true,
					not_editable_profile,
				},
			},
		},
	})
	for (let i = 0; i < number_of_agents; i++) {
		agentsApps.push({
			app: { bundle },
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
		const appAgentWs = await conductor.connectAppAgentWs(port, agentApps.installed_app_id)
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
