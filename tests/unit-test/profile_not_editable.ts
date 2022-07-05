
import { runScenario, Scenario } from '@holochain/tryorama'
import { installAgentHapps } from '../installAgents.js'
import test from 'tape-promise/tape.js'
// import { wait } from '../common_config'

test('test non-editable profile zomes', async (t) => {
	await runScenario(async (scenario: Scenario) => {
		let conductor = await scenario.addConductor()

		const [alicePlayer] = await installAgentHapps({
			conductor,
			number_of_agents: 1,
      scenario_uid: scenario.uid,
		})
		const [alice] = alicePlayer.cells

    const profile_input = {
			nickname: 'Alice',
			avatar_url: 'https://alice.img',
		}
		let profile_hash

		try {
			profile_hash = await alice.callZome({
        zome_name: 'profile',
        fn_name: 'update_my_profile',
        payload: profile_input,
      })
			console.log('PROFILE_Hash:', profile_hash)
			t.ok(profile_hash)
		} catch (e) {
			console.error('Error: ', e)
			t.fail()
		}

		const updated_profile_input_2 = {
			nickname: 'Alexandria',
			avatar_url: 'https://alexandria.img',
		}
		try {
			// Should not be able to update profile
			profile_hash = await alice.callZome({
        zome_name: 'profile',
        fn_name: 'update_my_profile',
        payload: updated_profile_input_2,
			})
			t.fail()
		} catch (e) {
			console.error('Error: ', e)
			t.ok(e)
		}
  })
})
