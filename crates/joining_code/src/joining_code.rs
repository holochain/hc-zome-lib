use hdk::prelude::*;
use self::holo_hash::AgentPubKeyB64;

/// This is the current structure of the payload the holo signs
#[hdk_entry(id = "joining_code_payload")]
#[derive(Clone)]
pub struct JoiningCodePayload {
    pub role: String,
    pub record_locator: String,
    pub registered_agent: AgentPubKeyB64,
}

pub fn joining_code_value(mem_proof: &Element) -> String {
    mem_proof.header_address().to_string()
}
