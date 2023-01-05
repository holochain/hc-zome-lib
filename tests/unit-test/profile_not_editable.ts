import { runScenario, Scenario } from '@holochain/tryorama';
import { installAgentsOnConductor } from '../common/tryo-helper.js';
import test from 'tape-promise/tape.js';

test('test non-editable profile zomes', async (t) => {
	await runScenario(async (scenario: Scenario) => {
		let conductor = await scenario.addConductor();

		const [alicePlayer] = await installAgentsOnConductor({
			conductor,
			number_of_agents: 1,
			not_editable_profile: true,
		});
		const [alice] = alicePlayer.cells;

		let profile;

		try {
			const profile_input_1 = {
				nickname: 'Alice',
				avatar_url: 'https://alice.img',
			};
			console.log('\n ==================== Case 1');
			profile = await alice.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'update_my_profile',
				payload: profile_input_1,
			});
			console.log('Profile Hash:', profile);
			t.ok(profile);
		} catch (e) {
			console.error('Error: ', e);
			t.fail();
		}

		console.log('\n ==================== Case 2');
		const updated_profile_input_2 = {
			nickname: 'Alexandria',
			avatar_url: 'https://alexandria.img',
		};
		try {
			// Should not be able to update profile
			profile = await alice.callZome({
				zome_name: 'hc_cz_profile',
				fn_name: 'update_my_profile',
				payload: updated_profile_input_2,
			});
			console.error('Erroneously updated profile : ', profile);
			t.fail();
		} catch (e) {
			console.error('Error: ', e);
			t.ok(e);
		}
	});
});
