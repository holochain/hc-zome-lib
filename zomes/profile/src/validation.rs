use hdk::prelude::*;
use crate::entries::*;
use crate::error::ProfileResult;

pub fn __validate_profile(
    data: ValidateData,
) -> ProfileResult<ValidateCallbackResult> {
    if let element::ElementEntry::Present(entry) = data.element.entry() {
        let Profile {
            agent_address,
            nickname: _,
            avatar_url: _,
            uniqueness: _
        } = entry.try_into()?;

        if &agent_address.0 == data.element.header().author() {
            Ok(ValidateCallbackResult::Valid)
        } else {
            Ok(ValidateCallbackResult::Invalid(
                "Profile for {:?} is created by invalid agent {:?}".to_string(),
            ))
        }
    } else {
        Ok(ValidateCallbackResult::Invalid(
            "Unable to find entry".to_string(),
        ))
    }
}
