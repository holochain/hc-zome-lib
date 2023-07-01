import { runScenario, Scenario } from '@holochain/tryorama'
import test from 'tape-promise/tape.js'
import { installAgentsOnConductor } from '../common/tryo-helper.js'
import { Profile } from '../types.js'

test('test editable profile zomes', async (t) => {
	await runScenario(async (scenario: Scenario) => {
		try {
			let conductor = await scenario.addConductor()

			const [alicePlayer, bobboPlayer] = await installAgentsOnConductor({
				conductor,
				number_of_agents: 2,
			})

			const [alice] = alicePlayer.cells
			const [bobbo] = bobboPlayer.cells

			const profile_input = {
				nickname: 'Alice',
				avatar_url: 'https://alice.img',
			}
			let profile

			console.log('\n ==================== Case 1')
			profile = await alice.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'update_my_profile',
				payload: profile_input,
			})
			console.log('Profile:', profile)
			t.ok(profile)

			console.log('\n ==================== Case 2')
			let a_check_a_profile: Profile = await alice.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'get_my_profile',
				payload: null,
			})
			console.log('Alice checks her profile:', a_check_a_profile)
			t.ok(a_check_a_profile)
			t.equal(profile_input.nickname, a_check_a_profile.nickname)
			t.equal(profile_input.avatar_url, a_check_a_profile.avatar_url)

			console.log('\n ==================== Case 3')
			let bobbo_check_alice_profile: Profile = await bobbo.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'get_profile',
				payload: a_check_a_profile.agent_address,
			})
			console.log("Bobbo checks alice's profile:", bobbo_check_alice_profile)
			t.ok(bobbo_check_alice_profile)
			t.equal(profile_input.nickname, bobbo_check_alice_profile.nickname)
			t.equal(profile_input.avatar_url, bobbo_check_alice_profile.avatar_url)

			console.log('\n ==================== Case 4')
			const updated_profile_input_1 = {
				nickname: 'Alicia',
				avatar_url: 'https://alicia.img',
			}
			profile = await alice.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'update_my_profile',
				payload: updated_profile_input_1,
			})
			console.log('Alice -> Alicia profile hash :', profile)
			t.ok(profile)

			console.log('\n ==================== Case 5')
			a_check_a_profile = await alice.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'get_my_profile',
				payload: null,
			})
			console.log('Alice checks her updated profile:', a_check_a_profile)
			t.ok(a_check_a_profile)
			t.equal(updated_profile_input_1.nickname, a_check_a_profile.nickname)
			t.equal(updated_profile_input_1.avatar_url, a_check_a_profile.avatar_url)

			console.log('\n ==================== Case 6')
			bobbo_check_alice_profile = await bobbo.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'get_profile',
				payload: a_check_a_profile.agent_address,
			})
			console.log("Bobbo checks alice's updated profile:", bobbo_check_alice_profile)
			t.ok(bobbo_check_alice_profile)
			t.equal(updated_profile_input_1.nickname, bobbo_check_alice_profile.nickname)
			t.equal(updated_profile_input_1.avatar_url, bobbo_check_alice_profile.avatar_url)

			console.log('\n ==================== Case 7')
			const updated_profile_input_2 = {
				nickname: 'Alexandria',
				avatar_url: 'https://alexandria.img',
			}
			profile = await alice.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'update_my_profile',
				payload: updated_profile_input_2,
			})
			console.log('Alice -> Alicia -> Alexandria profile hash :', profile)
			t.ok(profile)

			console.log('\n ==================== Case 8')
			a_check_a_profile = await alice.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'get_my_profile',
				payload: null,
			})
			console.log('Alice checks her updated profile:', a_check_a_profile)
			t.ok(a_check_a_profile)
			t.equal(updated_profile_input_2.nickname, a_check_a_profile.nickname)
			t.equal(updated_profile_input_2.avatar_url, a_check_a_profile.avatar_url)

			console.log('\n ==================== Case 9')
			bobbo_check_alice_profile = await bobbo.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'get_profile',
				payload: a_check_a_profile.agent_address,
			})
			console.log("Bobbo checks alice's updated profile:", bobbo_check_alice_profile)
			t.ok(bobbo_check_alice_profile)
			t.equal(updated_profile_input_2.nickname, bobbo_check_alice_profile.nickname)
			t.equal(updated_profile_input_2.avatar_url, bobbo_check_alice_profile.avatar_url)
		} catch (e) {
			console.error('Error: ', e)
			t.fail()
		}
	})
})
