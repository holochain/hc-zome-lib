mod entries;
mod handler;
use entries::*;
use hdk::prelude::*;
mod error;
mod validation;
use hc_utils::WrappedAgentPubKey;

entry_defs![Profile::entry_def()];

#[hdk_extern]
fn update_my_profile(profile_input: ProfileInput) -> ExternResult<Profile> {
    Ok(handler::__update_my_profile(profile_input)?)
}

#[hdk_extern]
fn get_my_profile(_: ()) -> ExternResult<Profile> {
    Ok(handler::__get_my_profile()?)
}

#[hdk_extern]
fn get_profile(agent_address: WrappedAgentPubKey) -> ExternResult<Profile> {
    Ok(handler::__get_profile(AgentPubKey::from(agent_address))?)
}

// #[hdk_extern]
// fn validate_create_entry_profile(entry: ValidateData) -> ExternResult<ValidateCallbackResult> {
//     Ok(validation::__validate_profile(entry)?)
// }

// #[hdk_extern]
// fn validate_update_entry_profile(entry: ValidateData) -> ExternResult<ValidateCallbackResult> {
//     Ok(validation::__validate_profile(entry)?)
// }

#[hdk_extern]
fn validate(op: Op) -> ExternResult<ValidateCallbackResult> {
    match op {
        Op::StoreEntry {
            entry: Entry::Agent(_),
            ..
        } => Ok(ValidateCallbackResult::Valid),
        Op::StoreEntry {
            entry,
            header:
                SignedHashed {
                    hashed:
                        HoloHashed {
                            content: header, ..
                        },
                    ..
                },
        } => validation::__validate_entry(entry, header.author()),
        Op::RegisterDelete { .. } => Ok(ValidateCallbackResult::Invalid(
            "Cannot update in Entry".to_string(),
        )),
        Op::RegisterUpdate {
            new_entry,
            update:
                SignedHashed {
                    hashed:
                        HoloHashed {
                            content: header, ..
                        },
                    ..
                },
            ..
        } => validation::__validate_entry(new_entry, &header.author),
        Op::RegisterDeleteLink { .. } => Ok(ValidateCallbackResult::Invalid(
            "Cannot update Link".to_string(),
        )),
        _ => Ok(ValidateCallbackResult::Valid),
    }
}
