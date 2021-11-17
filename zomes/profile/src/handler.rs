extern crate serde;
use crate::entries::*;
use crate::error::{ProfileError, ProfileResult};
use hc_utils::*;
use hdk::prelude::*;

pub fn __update_my_profile(profile_input: ProfileInput) -> ProfileResult<Profile> {
    // Chcek if the profile Exist
    // Get your agent key
    debug!("Start updating your profile...");
    let agent_address = agent_info()?.agent_initial_pubkey;
    match is_registered() {
        Ok(old_data) => {
            let old_profile_header = hc_utils::get_header(hash_entry(&old_data)?).unwrap();
            let profile = Profile {
                agent_address: WrappedAgentPubKey(agent_address),
                nickname: profile_input.nickname,
                avatar_url: profile_input.avatar_url,
                uniqueness: old_profile_header.clone().into(),
            };
            update_entry(old_profile_header, &profile)?;
            Ok(profile)
        }
        Err(_) => {
            // Create new Profile
            let profile = Profile {
                agent_address: WrappedAgentPubKey(agent_address.clone()),
                nickname: profile_input.nickname,
                avatar_url: profile_input.avatar_url,
                uniqueness: agent_address.clone().into(),
            };
            create_entry(&profile)?;
            let profile_hash = hash_entry(&profile)?;
            create_link(agent_address.into(), profile_hash, ProfileTag::tag())?;
            Ok(profile)
        }
    }
}

/// search chain for most recently committed profile.  if none return the "default" unregistered profile.
pub fn __get_my_profile() -> ProfileResult<Profile> {
    let agent_address = agent_info()?.agent_initial_pubkey;
    //TODO: Hoping to use query here so that I dont have to expect holochain not to search the dht.
    __get_profile(agent_address)
}

pub fn __get_profile(agent_address: AgentPubKey) -> ProfileResult<Profile> {
    let default_profile = Profile {
        agent_address: WrappedAgentPubKey(agent_address.clone()),
        nickname: None,
        avatar_url: None,
        uniqueness: agent_address.clone().into(),
    };

    let latest_link_info =
        hc_utils::get_latest_link(agent_address.into(), Some(ProfileTag::tag())).unwrap();

    // If there is none we will send a default profile
    let latest_link_info = match latest_link_info {
        Some(l) => l,
        None => return Ok(default_profile),
    };

    match hc_utils::get_latest_entry(latest_link_info.target, Default::default()) {
        Ok(e) => Ok(e.try_into()?),
        _ => Ok(default_profile),
    }
}

fn is_registered() -> ProfileResult<Profile> {
    match __get_profile(agent_info()?.agent_initial_pubkey) {
        Ok(data) => match data.nickname {
            Some(_) => Ok(data),
            None => Err(ProfileError::AgentNotRegisteredProfile),
        },
        Err(_) => Err(ProfileError::AgentNotRegisteredProfile),
    }
}
