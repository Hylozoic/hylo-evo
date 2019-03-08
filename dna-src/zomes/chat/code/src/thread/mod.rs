use core::cell::RefCell;
use std::rc::Rc;
use crate::cache::{self, Cache};
use std::cell::RefMut;
use hdk::{
    self,
    entry_definition::ValidatingEntryType,
    error::ZomeApiResult,
    holochain_core_types::{
        cas::content::Address, dna::entry_types::Sharing, entry::Entry, error::HolochainError,
        json::JsonString,
    },
    AGENT_ADDRESS,
};
use crate::identity;


#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct Thread {
    pub participants: Vec<String>,
}

pub fn get_my_threads() -> ZomeApiResult<Vec<Address>> {
    hdk::debug(AGENT_ADDRESS.to_string())?;
    Ok(hdk::get_links(&AGENT_ADDRESS, "message_threads")?
        .addresses()
        .to_owned())
}

pub fn get_or_create_thread(cache: &Rc<RefCell<Cache>>, participant_ids: Vec<String>) -> ZomeApiResult<Address> {
    let mut participant_agent_ids = participant_ids
        .iter()
        .map(|hylo_id| {
            identity::agent_address_from_hylo_id(cache.borrow_mut(), hylo_id.to_owned()).unwrap().to_string()
        }).collect::<Vec<String>>().clone();

    participant_agent_ids.push(AGENT_ADDRESS.to_string()); // add this agent to the list

    let thread_entry = Entry::App(
        "thread".into(),
        Thread {
            participants: participant_agent_ids.clone(),
        }
        .into(),
    );
    let entry_addr = (*cache.borrow_mut()).commit_entry(&thread_entry)?;

    for participant_id in participant_agent_ids {
        (*cache.borrow_mut()).link_entries(&participant_id.into(), &entry_addr, "message_threads")?;
    }

    Ok(entry_addr)
}

pub fn get_thread_participants(cache: RefMut<Cache>, thread_addr: &Address) -> ZomeApiResult<Vec<Address>> {
    Ok(cache::get_as_type::<Thread>(cache, thread_addr)?
        .participants
        .iter()
        .map(|elem| elem.to_owned().into())
        .collect())
}

pub fn get_thread_messages(cache: RefMut<Cache>, thread_addr: &Address) -> ZomeApiResult<Vec<Address>> {
    Ok((*cache).get_links(thread_addr, "messages")?
        .addresses()
        .to_owned())
}

pub fn def() -> ValidatingEntryType {
    entry!(
        name: "thread",
        description: "A thread in which messages are posted",
        sharing: Sharing::Public,
        native_type: Thread,

        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },

        validation: |_thread: Thread, _ctx: hdk::ValidationData| {
            Ok(())
        },

        links: [
            from!(
                "%agent_id",
                tag: "message_threads",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_base: Address, _target: Address, _ctx: hdk::ValidationData| {
                    Ok(())
                }
            ),
            from!(// delete this later. This is just because test users are anchors and don't have a real agent_address
                "anchor",
                tag: "message_threads",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_base: Address, _target: Address, _ctx: hdk::ValidationData| {
                    Ok(())
                }
            ),
            to!(
                "message",
                tag: "messages",

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
