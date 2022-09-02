use hdi::prelude::*;

#[hdk_entry_helper]
#[derive(Clone)]
pub struct Profile {
    pub agent_address: AgentPubKey,
    pub nickname: Option<String>,
    pub avatar_url: Option<String>,
    pub uniqueness: AnyDhtHash,
}

#[hdk_entry_defs]
#[unit_enum(EntryTypesUnit)]
pub enum EntryTypes {
    #[entry_def()]
    Profile(Profile),
}

#[hdk_link_types]
pub enum LinkTypes {
    ProfileLink,
}

/// A easy way to create the profile info tag
pub struct ProfileTag;

impl ProfileTag {
    const TAG: &'static [u8; 7] = b"profile";
    /// Create the tag
    pub fn tag() -> LinkTag {
        LinkTag::new(*Self::TAG)
    }
}
