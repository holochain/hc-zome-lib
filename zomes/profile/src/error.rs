use hdk::prelude::*;

#[derive(thiserror::Error, Debug)]
pub enum ProfileError {
    #[error(transparent)]
    Serialization(#[from] SerializedBytesError),
    #[error(transparent)]
    EntryError(#[from] EntryError),
    #[error(transparent)]
    Wasm(#[from] WasmError),
    #[error(transparent)]
    TimestampError(#[from] TimestampError),
    #[error("Agent has not created a profile yet")]
    AgentNotRegisteredProfile,
}

pub type ProfileResult<T> = Result<T, ProfileError>;

impl From<ProfileError> for WasmError {
    fn from(c: ProfileError) -> Self {
        WasmError::Guest(c.to_string())
    }
}
