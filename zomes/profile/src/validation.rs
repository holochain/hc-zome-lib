use crate::entries::*;
use hdk::prelude::*;

pub fn __validate_entry(
    entry: Entry,
    author: &AgentPubKey,
) -> ExternResult<ValidateCallbackResult> {
    match entry {
        Entry::App(_) => match entry.try_into() {
            Ok(Profile {
                agent_address,
                nickname: _,
                avatar_url: _,
                uniqueness: _,
            }) => {
                if &agent_address.0 == author {
                    Ok(ValidateCallbackResult::Valid)
                } else {
                    Ok(ValidateCallbackResult::Invalid(
                        "Profile for {:?} is created by invalid agent {:?}".to_string(),
                    ))
                }
            }
            _ => Ok(ValidateCallbackResult::Valid),
        },
        _ => Ok(ValidateCallbackResult::Valid),
    }
}
