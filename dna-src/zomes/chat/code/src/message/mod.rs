use core::cell::RefMut;
use hdk::{
    self,
    entry_definition::ValidatingEntryType,
    error::{ZomeApiError, ZomeApiResult},
    holochain_core_types::{
        cas::content::Address, dna::entry_types::Sharing, entry::Entry, error::HolochainError,
        json::JsonString,
    },
    AGENT_ADDRESS,
};

use crate::cache::{self, Cache};

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct Message {
    pub timestamp: u32,
    pub text: String,
    pub thread_id: Address,
}

pub fn post_message_to_thread(mut cache: RefMut<Cache>, thread_addr: &Address, text: String) -> ZomeApiResult<Address> {
    let message_entry = Entry::App("message".into(), Message { text, timestamp: 0, thread_id: thread_addr.to_owned() }.into());
    let message_addr = (*cache).commit_entry(&message_entry)?;
    (*cache).link_entries_bidir(&message_addr, thread_addr, "message_thread", "messages")?;
    (*cache).link_entries(&message_addr, &AGENT_ADDRESS, "creator")?;
    Ok(message_addr)
}

pub fn get_message_creator(cache: RefMut<Cache>, message_addr: &Address) -> ZomeApiResult<Address> {
    hdk::debug(hdk::get_links(message_addr, "creator")).ok();
    (*cache).get_links(message_addr, "creator")?
        .addresses()
        .first()
        .map(|result| result.to_owned())
        .ok_or(ZomeApiError::Internal(
            "Message does not have creator".into(),
        ))
}

pub fn get_text(cache: RefMut<Cache>, message_addr: &Address) -> ZomeApiResult<String> {
    Ok(cache::get_as_type::<Message>(cache, message_addr)?.text)
}

pub fn get_thread_id(cache: RefMut<Cache>, message_addr: &Address) -> ZomeApiResult<Address> {
    Ok(cache::get_as_type::<Message>(cache, message_addr)?.thread_id)
}

pub fn def() -> ValidatingEntryType {
    entry!(
        name: "message",
        description: "A generic message entry",
        sharing: Sharing::Public,
        native_type: Message,

        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },

        validation: |_message: Message, _ctx: hdk::ValidationData| {
            Ok(())
        },

        links: [
            to!(
                "%agent_id",
                tag: "creator",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_base: Address, _target: Address, _ctx: hdk::ValidationData| {
                    Ok(())
                }
            ),
            to!(// delete this later. This is just because test users are anchors and don't have a real agent_address
                "anchor",
                tag: "creator",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_base: Address, _target: Address, _ctx: hdk::ValidationData| {
                    Ok(())
                }
            ),
            to!(
                "thread",
                tag: "message_thread",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_base: Address, _target: Address, _ctx: hdk::ValidationData| {
                    Ok(())
                }
            )
        ]
    )
}
