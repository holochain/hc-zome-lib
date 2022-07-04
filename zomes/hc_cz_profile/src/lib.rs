mod handler;
use hdk::prelude::holo_hash::AgentPubKeyB64;
use hdk::prelude::*;
mod error;

#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
pub struct ProfileInput {
    pub nickname: Option<String>,
    pub avatar_url: Option<String>,
}

#[hdk_extern]
fn update_my_profile(profile_input: ProfileInput) -> ExternResult<hc_iz_profile::Profile> {
    Ok(handler::__update_my_profile(profile_input)?)
}

#[hdk_extern]
fn get_my_profile(_: ()) -> ExternResult<hc_iz_profile::Profile> {
    Ok(handler::__get_my_profile()?)
}

#[hdk_extern]
fn get_profile(agent_address: AgentPubKeyB64) -> ExternResult<hc_iz_profile::Profile> {
    Ok(handler::__get_profile(AgentPubKey::from(agent_address))?)
}
