use crate::entries::*;
use hdi::prelude::*;

#[hdk_extern]
fn validate(op: Op) -> ExternResult<ValidateCallbackResult> {
    match op {
        Op::StoreEntry(StoreEntry {
            entry: Entry::Agent(_),
            ..
        }) => Ok(ValidateCallbackResult::Valid),
        Op::StoreEntry(StoreEntry {
            entry,
            action:
                SignedHashed {
                    hashed:
                        HoloHashed {
                            content: action, ..
                        },
                    ..
                },
        }) => validate_entry(entry, action.author()),
        Op::RegisterDelete(_) => Ok(ValidateCallbackResult::Invalid(
            "Invalid try to delete an Entry".to_string(),
        )),
        Op::RegisterUpdate(RegisterUpdate {
            new_entry,
            update:
                SignedHashed {
                    hashed:
                        HoloHashed {
                            content: action, ..
                        },
                    ..
                },
            ..
        }) => {
            if is_not_editable() {
                return Ok(ValidateCallbackResult::Invalid(
                    "Invalid try to Delete Entry".to_string(),
                ));
            } else {
                if new_entry.is_some() {
                    return validate_entry(new_entry.unwrap(), &action.author);
                }
                return Ok(ValidateCallbackResult::Valid);
            }
        }
        Op::RegisterDeleteLink(_) => Ok(ValidateCallbackResult::Invalid(
            "Invalid try to update Link".to_string(),
        )),
        _ => Ok(ValidateCallbackResult::Valid),
    }
}

#[derive(Debug, Serialize, Deserialize, SerializedBytes, Clone)]
struct Props {
    not_editable_profile: bool,
}

/// Checking properties for `not_editable_profile` flag
pub fn is_not_editable() -> bool {
    if let Ok(info) = dna_info() {
        return is_not_editable_sb(&info.properties);
    }
    false
}

/// Deserialize properties into the Props expected by this zome
pub fn is_not_editable_sb(encoded_props: &SerializedBytes) -> bool {
    let maybe_props = Props::try_from(encoded_props.to_owned());
    if let Ok(props) = maybe_props {
        return props.not_editable_profile;
    }
    false
}

pub fn validate_entry(entry: Entry, author: &AgentPubKey) -> ExternResult<ValidateCallbackResult> {
    match entry {
        Entry::App(_) => match entry.try_into() {
            Ok(Profile {
                agent_address,
                nickname: _,
                avatar_url: _,
                uniqueness: _,
            }) => {
                if &AgentPubKey::from(agent_address) == author {
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
