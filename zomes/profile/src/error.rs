use hdk3::prelude::*;

#[derive(thiserror::Error, Debug)]
pub enum ProfileError {
    #[error(transparent)]
    Serialization(#[from] SerializedBytesError),
    #[error(transparent)]
    EntryError(#[from] EntryError),
    #[error(transparent)]
    Wasm(#[from] WasmError),
    #[error(transparent)]
    HdkError(#[from] HdkError),
    #[error("Agent has not created a profile yet")]
    AgentNotRegisteredProfile,
}

pub type ProfileResult<T> = Result<T, ProfileError>;
