use hdk::{
    self,
    entry_definition::ValidatingEntryType,
    holochain_core_types::{
        cas::content::Address, dna::entry_types::Sharing, error::HolochainError, json::JsonString,
    },
};

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct Anchor {
    pub name: String,
}

pub fn def() -> ValidatingEntryType {
    entry!(
        name: "anchor",
        description: "",
        sharing: Sharing::Public,
        native_type: Anchor,

        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },

        validation: |_name: Anchor, _ctx: hdk::ValidationData| {
            Ok(())
        },

        links: [
            to!(
                "%agent_id",
                tag: "registered",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_base: Address, _target: Address, _ctx: hdk::ValidationData| {
                    Ok(())
                }
            ),
            to!(// delete this later. This is just because test users are anchors and don't have a real agent_address
                "anchor",
                tag: "registered",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_base: Address, _target: Address, _ctx: hdk::ValidationData| {
                    Ok(())
                }
            ),
            to!(
                "%agent_id",
                tag: "belongs_to",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_base: Address, _target: Address, _ctx: hdk::ValidationData| {
                    Ok(())
                }
            ),
            to!(// delete this later. This is just because test users are anchors and don't have a real agent_address
                "anchor",
                tag: "belongs_to",

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
