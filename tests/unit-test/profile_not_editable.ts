import { CONFIG, wait } from '../common_config'
import { installAgents } from '../installAgents'

module.exports = (orchestrator) => {
	orchestrator.registerScenario('test profile zomes', async (s, t) => {
		// spawn the conductor process
		const [conductor] = await s.players([CONFIG])
		let [alice_happ, bobbo_happ] = await installAgents(
			conductor,
			['alice', 'bobbo'],
			false
		)
		const [alice] = alice_happ.cells
		const [bobbo] = bobbo_happ.cells

		// Create a profile
		const profile_input = {
			nickname: 'Alice',
			avatar_url: 'https://alice.img',
		}
		let profile_hash

		try {
			profile_hash = await alice.call(
				'profile',
				'update_my_profile',
				profile_input
			)
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
			profile_hash = await alice.call(
				'profile',
				'update_my_profile',
				updated_profile_input_2
			)
			t.fail()
		} catch (e) {
			console.error('Error: ', e)
			t.ok(e)
		}
	})
}
