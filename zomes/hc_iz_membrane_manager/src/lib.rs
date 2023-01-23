use hdi::prelude::*;
mod props;
mod validation;

pub use props::*;
pub use validation::*;

#[hdk_extern]
fn genesis_self_check(data: GenesisSelfCheckData) -> ExternResult<ValidateCallbackResult> {
    if props::skip_proof_sb(&data.dna_info.properties) {
        return Ok(ValidateCallbackResult::Valid);
    }
    info!("dna_info {:?}", &data.dna_info);
    let holo_agent_key = props::holo_agent(&data.dna_info.properties)?;
    validate_joining_code(holo_agent_key, data.agent_key, data.membrane_proof)
}

#[hdk_extern]
fn validate(op: Op) -> ExternResult<ValidateCallbackResult> {
    match op {
        Op::StoreEntry(StoreEntry {
            entry: Entry::Agent(_),
            action:
                SignedHashed {
                    hashed:
                        HoloHashed {
                            content: action, ..
                        },
                    ..
                },
        }) => {
            if !props::skip_proof() {
                let action = action.prev_action();
                match must_get_valid_record(action.clone()) {
                    Ok(element_pkg) => match element_pkg.signed_action().action() {
                        Action::AgentValidationPkg(pkg) => {
                            return validate_joining_code(
                                props::holo_agent(&dna_info()?.properties)?,
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
                    Err(_e) => {
                        // trace!("Error on get when validating agent entry: {:?}; treating as unresolved dependency",e);
                        return Ok(ValidateCallbackResult::UnresolvedDependencies(
                            UnresolvedDependencies::Hashes(vec![action.clone().into()]),
                        ));
                    }
                }
            }
            Ok(ValidateCallbackResult::Valid)
        }

        _ => Ok(ValidateCallbackResult::Valid),
    }
}
