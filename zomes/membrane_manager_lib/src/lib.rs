use hdk::prelude::*;

entry_defs![Path::entry_def()];

#[hdk_extern]
fn init(_: ()) -> ExternResult<InitCallbackResult> {
    Ok(InitCallbackResult::Pass)
}

#[hdk_extern]
fn genesis_self_check(data: GenesisSelfCheckData) -> ExternResult<ValidateCallbackResult> {
    if hc_joining_code::skip_proof_sb(&data.dna_def.properties) {
        return Ok(ValidateCallbackResult::Valid);
    }
    let holo_agent_key = hc_joining_code::holo_agent(&data.dna_def.properties)?;
    hc_joining_code::validate_joining_code(holo_agent_key, data.agent_key, data.membrane_proof)
}

#[hdk_extern]
fn validate(op: Op) -> ExternResult<ValidateCallbackResult> {
    match op {
        Op::StoreEntry {
            entry: Entry::Agent(_),
            header:
                SignedHashed {
                    hashed:
                        HoloHashed {
                            content: header, ..
                        },
                    ..
                },
        } => {
            if !hc_joining_code::skip_proof() {
                let header = header.prev_header();
                match must_get_valid_element(header.clone()) {
                    Ok(element_pkg) => match element_pkg.signed_header().header() {
                        Header::AgentValidationPkg(pkg) => {
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
                            (header.clone()).into(),
                        ]));
                    }
                }
            }
            Ok(ValidateCallbackResult::Valid)
        }

        _ => Ok(ValidateCallbackResult::Valid),
    }
}
