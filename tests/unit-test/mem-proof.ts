import test from 'tape-promise/tape.js'
import { runScenario, Scenario } from '@holochain/tryorama'
import { installAgentsOnConductor, installMemProofHapp, Memproof } from '../common/tryo-helper.js'

test('testing mem-proofs', async (t) => {
	await runScenario(
		async (scenario: Scenario) => {
			let conductor = await scenario.addConductor()
			let conductor_jch = await scenario.addConductor()

			const jcHapp1 = await installMemProofHapp(conductor_jch)
			const jcHapp2 = await installMemProofHapp(conductor_jch)

			const [alice_happ, bob_happ] = await installAgentsOnConductor({
				conductor: conductor,
				number_of_agents: 2,
				membraneProofGenerator: jcHapp1,
			})

			const [alice] = alice_happ.cells
			const [bob] = bob_happ.cells
			await scenario.shareAllAgents()
			// now try and install carol with a membrane proof from a different joining code authority
			try {
				const [carol_happ] = await installAgentsOnConductor({
					conductor: conductor,
					number_of_agents: 1,
					membraneProofGenerator: jcHapp2,
					holo_agent_override: jcHapp1.agentPubKey,
				})
				t.fail()
			} catch (e) {
				t.true(e.message.includes('Joining code invalid: unexpected author'))
			}

			// now install david with a membrane proof that has a mismatched signature
			const corruptMemproofSignature = (memproof: Memproof) => {
				const sig: any = Array.from(memproof.signed_action.signature)
				sig[sig.length - 1] ^= 1
				const signature = Buffer.from(sig)
				return {
					...memproof,
					signed_action: {
						...memproof.signed_action,
						signature,
					},
				}
			}
			try {
				await installAgentsOnConductor({
					conductor: conductor,
					number_of_agents: 1,
					membraneProofGenerator: jcHapp1,
					memProofMutator: corruptMemproofSignature,
				})
				t.fail()
			} catch (e) {
				t.true(e.message.includes('Joining code invalid: incorrect signature'))
			}
		},
		true,
		{ timeout: 300000 }
	)
})
