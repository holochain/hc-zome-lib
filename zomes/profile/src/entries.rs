use hc_utils::*;
use hdk::prelude::*;

#[hdk_entry_helper]
#[derive(Clone)]
pub struct Profile {
    pub agent_address: WrappedAgentPubKey,
    pub nickname: Option<String>,
    pub avatar_url: Option<String>,
    pub uniqueness: AnyDhtHash,
}

#[hdk_entry_defs]
#[unit_enum(EntryTypesUnit)]
pub enum EntryTypes {
    #[entry_def(visibility = "public", required_validations = 2)]
    Profile(Profile),
}

#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
pub struct ProfileInput {
    pub nickname: Option<String>,
    pub avatar_url: Option<String>,
}

/// A easy way to create the profile info tag
pub(crate) struct ProfileTag;

impl ProfileTag {
    const TAG: &'static [u8; 7] = b"profile";
    /// Create the tag
    pub(crate) fn tag() -> LinkTag {
        LinkTag::new(*Self::TAG)
    }
}
