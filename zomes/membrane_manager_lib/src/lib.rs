use hdk::prelude::*;

#[hdk_extern]
fn init(_: ()) -> ExternResult<InitCallbackResult> {
    Ok(InitCallbackResult::Pass)
}

#[hdk_extern]
fn genesis_self_check(data: GenesisSelfCheckData) -> ExternResult<ValidateCallbackResult> {
    if hc_joining_code::skip_proof_sb(&data.dna_info.properties) {
        return Ok(ValidateCallbackResult::Valid);
    }
    let holo_agent_key = hc_joining_code::holo_agent(&data.dna_info.properties)?;
    hc_joining_code::validate_joining_code(holo_agent_key, data.agent_key, data.membrane_proof)
}

#[hdk_extern]
fn validate(op: Op) -> ExternResult<ValidateCallbackResult> {
    match op {
        Op::StoreEntry {
            entry: Entry::Agent(_),
            action:
                SignedHashed {
                    hashed:
                        HoloHashed {
                            content: action, ..
                        },
                    ..
                },
        } => {
            if !hc_joining_code::skip_proof() {
                let action = action.prev_action();
                match must_get_valid_record(action.clone()) {
                    Ok(element_pkg) => match element_pkg.signed_action().action() {
                        Action::AgentValidationPkg(pkg) => {
                            return hc_joining_code::validate_joining_code(
                                hc_joining_code::holo_agent(&zome_info()?.properties)?,
                                pkg.author.clone(),
                                pkg.membrane_proof.clone(),
                            )
                        }
                        _ => {
                            return Ok(ValidateCallbackResult::Invalid(
                                "No Agent Validation Pkg found".to_string(),
                            ))
                        }
                    },
                    Err(e) => {
                        debug!("Error on get when validating agent entry: {:?}; treating as unresolved dependency",e);
                        return Ok(ValidateCallbackResult::UnresolvedDependencies(vec![
                            (action.clone()).into(),
                        ]));
                    }
                }
            }
            Ok(ValidateCallbackResult::Valid)
        }

        _ => Ok(ValidateCallbackResult::Valid),
    }
}
