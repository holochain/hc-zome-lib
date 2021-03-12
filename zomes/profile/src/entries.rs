use hc_utils::*;
use hdk3::prelude::*;

#[hdk_entry(id = "profile", visibility = "public", required_validations = 2)]
#[derive(Debug, Clone)]
pub struct Profile {
    pub agent_address: WrappedAgentPubKey,
    pub nickname: Option<String>,
    pub avatar_url: Option<String>,
    pub uniqueness: AnyDhtHash,
}

#[derive(Serialize, Deserialize, SerializedBytes)]
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
