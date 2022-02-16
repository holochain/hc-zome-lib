use self::holo_hash::AgentPubKeyB64;
use crate::props::skip_proof;
use hdk::prelude::*;

/// check if the instance that is making the call is eligible
pub fn is_read_only_instance() -> bool {
    if skip_proof() {
        return false;
    }
    if let Ok(entries) = &query(ChainQueryFilter::new().header_type(HeaderType::AgentValidationPkg))
    {
        if let Header::AgentValidationPkg(h) = entries[0].header() {
            if let Some(mem_proof) = &h.membrane_proof {
                if is_read_only_proof(&mem_proof) {
                    return true;
                }
            }
        }
    };
    false
}

/// check to see if this is the valid read_only membrane proof
pub fn is_read_only_proof(mem_proof: &MembraneProof) -> bool {
    let b = mem_proof.bytes();
    b == &[0]
}

/// This is the current structure of the payload the holo signs
#[hdk_entry(id = "joining_code_payload")]
#[derive(Clone)]
pub struct JoiningCodePayload {
    pub role: String,
    pub record_locator: String,
    pub registered_agent: AgentPubKeyB64,
}

/// Validate joining code from the membrane_proof
pub fn validate_joining_code(
    progenitor_agent: AgentPubKey,
    author: AgentPubKey,
    membrane_proof: Option<MembraneProof>,
) -> ExternResult<ValidateCallbackResult> {
    match membrane_proof {
        Some(mem_proof) => {
            if is_read_only_proof(&mem_proof) {
                return Ok(ValidateCallbackResult::Valid);
            };
            let mem_proof = Element::try_from(mem_proof)?;

            trace!("Joining code provided: {:?}", mem_proof);

            let joining_code_author = mem_proof.header().author().clone();

            if joining_code_author != progenitor_agent {
                trace!("Joining code validation failed");
                return Ok(ValidateCallbackResult::Invalid(format!(
                    "Joining code invalid: unexpected author ({:?})",
                    joining_code_author
                )));
            }

            let e = mem_proof.entry();
            if let ElementEntry::Present(entry) = e {
                let signature = mem_proof.signature().clone();
                match verify_signature(progenitor_agent, signature, mem_proof.header()) {
                    Ok(verified) => {
                        if verified {
                            // check that the joining code has the correct author key in it
                            // once this is added to the registration flow, e.g.:
                            let joining_code = JoiningCodePayload::try_from(entry)?;
                            if AgentPubKey::try_from(joining_code.registered_agent).unwrap()
                                != author
                            {
                                return Ok(ValidateCallbackResult::Invalid(
                                    "Joining code invalid: incorrect registered agent key"
                                        .to_string(),
                                ));
                            }
                            trace!("Joining code validated");
                            Ok(ValidateCallbackResult::Valid)
                        } else {
                            trace!("Joining code validation failed: incorrect signature");
                            Ok(ValidateCallbackResult::Invalid(
                                "Joining code invalid: incorrect signature".to_string(),
                            ))
                        }
                    }
                    Err(e) => {
                        debug!("Error on get when verifying signature of agent entry: {:?}; treating as unresolved dependency",e);
                        Ok(ValidateCallbackResult::UnresolvedDependencies(vec![
                            (author).into(),
                        ]))
                    }
                }
            } else {
                Ok(ValidateCallbackResult::Invalid(
                    "Joining code invalid payload".to_string(),
                ))
            }
        }
        None => Ok(ValidateCallbackResult::Invalid(
            "No membrane proof found".to_string(),
        )),
    }
}
