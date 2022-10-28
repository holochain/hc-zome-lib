use hdi::prelude::*;

#[derive(Debug, Serialize, Deserialize, SerializedBytes, Clone)]
pub struct Props {
    pub skip_proof: bool,
    pub holo_agent_override: Option<AgentPubKey>,
    pub development_stage: Option<String>,
    pub t_and_c: Option<String>,
    pub t_and_c_agreement: Option<String>,
}

pub fn holo_agent(encoded_props: &SerializedBytes) -> ExternResult<AgentPubKey> {
    let maybe_props = Props::try_from(encoded_props.to_owned());
    if let Ok(props) = maybe_props.clone() {
        if let Some(a) = props.holo_agent_override {
            return Ok(AgentPubKey::try_from(a).unwrap());
        }
    }
    debug!("Props retrived: {:?}", maybe_props);
    Err(wasm_error!(WasmErrorInner::Guest(
        "Cannot fetch get a holo-agent-override".to_string()
    )))
}

pub fn skip_proof_sb(encoded_props: &SerializedBytes) -> bool {
    let maybe_props = Props::try_from(encoded_props.to_owned());
    if let Ok(props) = maybe_props {
        return props.skip_proof;
    }
    false
}

// This is useful for test cases where we don't want to provide a membrane proof
pub fn skip_proof() -> bool {
    if let Ok(info) = dna_info() {
        return skip_proof_sb(&info.properties);
    }
    false
}
