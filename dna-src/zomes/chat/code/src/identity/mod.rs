use crate::cache::Cache;
use core::cell::RefMut;
use crate::anchor;
use crate::cache;
use hdk::{
    self,
    entry_definition::ValidatingEntryType,
    error::{ZomeApiError, ZomeApiResult},
    holochain_core_types::{
        cas::content::{Address, AddressableContent},
        dna::entry_types::Sharing,
        entry::Entry,
        error::HolochainError,
        json::JsonString,
    },
    AGENT_ADDRESS,
};

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct Identity {
    pub name: String,
    pub avatar_url: String,
    pub hylo_id: String,
}

pub fn get_identity(cache: RefMut<Cache>, agent_id: &Address) -> ZomeApiResult<Identity> {
    cache::get_links_and_load_type(cache, agent_id, "registered")?
        .first()
        .map(|result| result.to_owned().entry)
        .ok_or(ZomeApiError::Internal(
            "Agent has not been registered".into(),
        ))
}

pub fn register_user(name: String, avatar_url: String, hylo_id: String) -> ZomeApiResult<Address> {
    // don't reregister everyone if it has been done already
    let n_registered = get_people()?.len();
    if n_registered > 0 {
        return Ok(Address::new())
    }

    let identity_entry = Entry::App("identity".into(), Identity { name, avatar_url, hylo_id: hylo_id.clone() }.into());

    let ident_addr = hdk::commit_entry(&identity_entry)?;
    hdk::link_entries(&AGENT_ADDRESS, &ident_addr, "registered")?;

    let anchor_entry = Entry::App(
        "anchor".into(),
        anchor::Anchor {
            name: "people".into(),
        }
        .into(),
    );
    let anchor_addr = hdk::commit_entry(&anchor_entry)?;
    hdk::link_entries(&anchor_addr, &AGENT_ADDRESS, "registered")?;

    let id_anchor_entry = Entry::App(
        "anchor".into(),
        anchor::Anchor {
            name: hylo_id,
        }
        .into(),
    );
    let id_anchor_addr = hdk::commit_entry(&id_anchor_entry)?;  
    hdk::link_entries(&id_anchor_addr, &AGENT_ADDRESS, "belongs_to")?;

    register_test_identities()?;

    Ok(ident_addr.to_string().into())
}

pub fn get_people() -> ZomeApiResult<Vec<Address>> {
    let anchor_entry = Entry::App(
        "anchor".into(),
        anchor::Anchor {
            name: "people".into(),
        }
        .into(),
    );
    Ok(hdk::get_links(&anchor_entry.address(), "registered")?
        .addresses()
        .to_owned())
}

pub fn agent_address_from_hylo_id(cache: RefMut<Cache>, id: String) -> ZomeApiResult<Address> {
    let id_anchor_entry = Entry::App(
        "anchor".into(),
        anchor::Anchor {
            name: id,
        }
        .into(),
    );
    (*cache).get_links(&id_anchor_entry.address(), "belongs_to")?
        .addresses()
        .first()
        .map(|result| result.to_owned())
        .ok_or(ZomeApiError::Internal(
            "hylo ID has no associated agent hash".into(),
        ))
}

// for demo only. Adds a bunch of test identities
pub fn register_test_identities() -> ZomeApiResult<()> {
    for (name, avatar_url) in vec![
    ("John", "http://www.johnlennon.com/wp-content/uploads/2018/02/Walls_Bridges_1974_Gruen_JohnLennon-home-slider-min.jpg"),
    ("Paul", "https://vignette.wikia.nocookie.net/beatles/images/d/d9/853de2b8224c681079a3a66111bd97ec.jpg"),
    ("George", "http://www.gstatic.com/tv/thumb/persons/71317/71317_v9_ba.jpg"),
    ("Ringo", "http://townsquare.media/site/295/files/2012/11/ringo-Keystone-hutton-archives-getty.jpg?w=980&q=75")] {
        register_test_user(name.into(), avatar_url.into())?;
    }
    Ok(())
}

fn register_test_user(name: String, avatar_url: String) -> ZomeApiResult<Address> {
    let dummy_agent = Entry::App(
        "anchor".into(),
        anchor::Anchor {
            name: name.clone().into(),
        }
        .into(),
    );
    let dummy_agent_addr = hdk::commit_entry(&dummy_agent)?;

    let identity_entry = Entry::App("identity".into(), Identity { name: name.clone(), avatar_url, hylo_id: name.clone() }.into());
    let ident_addr = hdk::commit_entry(&identity_entry)?;
    hdk::link_entries(&dummy_agent_addr, &ident_addr, "registered")?;

    let anchor_entry = Entry::App(
        "anchor".into(),
        anchor::Anchor {
            name: "people".into(),
        }
        .into(),
    );
    let anchor_addr = hdk::commit_entry(&anchor_entry)?;
    hdk::link_entries(&anchor_addr, &dummy_agent_addr, "registered")?;

    let id_anchor_entry = Entry::App(
        "anchor".into(),
        anchor::Anchor {
            name,
        }
        .into(),
    );
    let id_anchor_addr = hdk::commit_entry(&id_anchor_entry)?;  
    hdk::link_entries(&id_anchor_addr, &dummy_agent_addr, "belongs_to")?;
    Ok(dummy_agent_addr.to_string().into())
}

pub fn def() -> ValidatingEntryType {
    entry!(
        name: "identity",
        description: "Extra information attached to an agent address",
        sharing: Sharing::Public,
        native_type: Identity,

        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },

        validation: |_identity: Identity, _ctx: hdk::ValidationData| {
            Ok(())
        },

        links: [
            from!(
                "%agent_id",
                tag: "registered",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_base: Address, _target: Address, _ctx: hdk::ValidationData| {
                    Ok(())
                }
            ),
            from!(// delete this later. This is just because test users are anchors and don't have a real agent_address
                "anchor",
                tag: "registered",

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
