mod entries;
mod handler;
use entries::*;
use hdk3::prelude::*;
mod error;
use error::ProfileResult;
use hc_utils::WrappedAgentPubKey;

entry_defs![Profile::entry_def()];

#[hdk_extern]
fn update_my_profile(profile_input: ProfileInput) -> ProfileResult<Profile> {
    handler::_update_my_profile(profile_input)
}

#[hdk_extern]
fn get_my_profile(_: ()) -> ProfileResult<Profile> {
    handler::_get_my_profile()
}

#[hdk_extern]
fn get_profile(agent_address: WrappedAgentPubKey) -> ProfileResult<Profile> {
    handler::_get_profile(AgentPubKey::from(agent_address))
}
