
import { runScenario, Scenario } from '@holochain/tryorama'
import test from 'tape-promise/tape.js'
import { installAgentHapps } from '../installAgents.js'
import { Profile } from '../types.js'
// import { wait } from '../common_config'

test('test editable profile zomes', async (t) => {
	await runScenario(async (scenario: Scenario) => {
    console.log('before...')
		let conductor = await scenario.addConductor()
    console.log('after...')

    const [alicePlayer, bobboPlayer] = await installAgentHapps({
			conductor,
			number_of_agents: 2,
      scenario_uid: scenario.uid,
		})
		const [alice] = alicePlayer.cells
    const [bobbo] = bobboPlayer.cells

    // Create a channel
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

    //  await wait(5000)

    let a_check_a_profile: Profile = await alice.callZome({
      zome_name: 'profile',
      fn_name: 'get_my_profile',
      payload: null
    })
    console.log('Alice checks her profile:', a_check_a_profile)
    t.ok(a_check_a_profile)
    t.equal(profile_input.nickname, a_check_a_profile.nickname)
    t.equal(profile_input.avatar_url, a_check_a_profile.avatar_url)

    let bobbo_check_alice_profile: Profile = await bobbo.callZome({
      zome_name:'profile',
      fn_name: 'get_profile',
      payload: a_check_a_profile.agent_address,
    })
    console.log("Bobbo checks alice's profile:", bobbo_check_alice_profile)
    t.ok(bobbo_check_alice_profile)
    t.equal(profile_input.nickname, bobbo_check_alice_profile.nickname)
    t.equal(profile_input.avatar_url, bobbo_check_alice_profile.avatar_url)

    // await wait(1000)

    const updated_profile_input_1 = {
    nickname: 'Alicia',
    avatar_url: 'https://alicia.img',
    }
    profile_hash = await alice.callZome({
      zome_name: 'profile',
      fn_name: 'get_my_profile',
      payload: updated_profile_input_1
    })
    console.log('PROFILE_Hash:', profile_hash)
    t.ok(profile_hash)

    // await wait(1000)
    
    a_check_a_profile = await alice.callZome({
      zome_name: 'profile',
      fn_name: 'get_my_profile',
      payload: null
    })
    console.log('Alice checks her updated profile:', a_check_a_profile)
    t.ok(a_check_a_profile)
    t.equal(updated_profile_input_1.nickname, a_check_a_profile.nickname)
    t.equal(updated_profile_input_1.avatar_url, a_check_a_profile.avatar_url)

    bobbo_check_alice_profile = await bobbo.callZome({
      zome_name: 'profile',
      fn_name: 'get_my_profile',
      payload: a_check_a_profile.agent_address
    })
    console.log(
    "Bobbo checks alice's updated profile:",
    bobbo_check_alice_profile
    )
    t.ok(bobbo_check_alice_profile)
    t.equal(updated_profile_input_1.nickname, bobbo_check_alice_profile.nickname)
    t.equal(
    updated_profile_input_1.avatar_url,
    bobbo_check_alice_profile.avatar_url
    )

    // await wait(1000)

    const updated_profile_input_2 = {
    nickname: 'Alexandria',
    avatar_url: 'https://alexandria.img',
    }
    profile_hash = await alice.callZome({
      zome_name: 'profile',
      fn_name: 'get_my_profile',
      payload: updated_profile_input_2
    })
    console.log('PROFILE_Hash:', profile_hash)
    t.ok(profile_hash)

    // await wait(1000)

    a_check_a_profile = await alice.callZome({
      zome_name: 'profile',
      fn_name: 'get_my_profile',
      payload: null
    })
    console.log('Alice checks her updated profile:', a_check_a_profile)
    t.ok(a_check_a_profile)
    t.equal(updated_profile_input_2.nickname, a_check_a_profile.nickname)
    t.equal(updated_profile_input_2.avatar_url, a_check_a_profile.avatar_url)

    bobbo_check_alice_profile = await bobbo.callZome({
      zome_name: 'profile',
      fn_name: 'get_my_profile',
      payload: a_check_a_profile.agent_address
    })
    console.log(
    "Bobbo checks alice's updated profile:",
    bobbo_check_alice_profile
    )
    t.ok(bobbo_check_alice_profile)
    t.equal(updated_profile_input_2.nickname, bobbo_check_alice_profile.nickname)
    t.equal(
    updated_profile_input_2.avatar_url,
    bobbo_check_alice_profile.avatar_url
    )
  })
})
