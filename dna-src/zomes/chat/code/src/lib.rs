#![feature(try_from)]

use std::rc::Rc;
use std::cell::RefCell;

#[macro_use]
extern crate hdk;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
#[macro_use]
extern crate holochain_core_types_derive;
#[macro_use]
extern crate juniper;
#[macro_use]
extern crate derive_more;

use hdk::{
    error::{ZomeApiError, ZomeApiResult},
    holochain_core_types::{
        json::{JsonString, RawString},
        error::HolochainError,
    }
};

mod anchor;
mod identity;
mod message;
mod schema;
mod thread;
mod cache;

use crate::schema::{Mutation, Query, Schema, Context};


define_zome! {
    entries: [
        message::def(),
        anchor::def(),
        thread::def(),
        identity::def()
    ]

    genesis: || { Ok(()) }

    functions: [
        graphql: {
            inputs: |query: String, variables: juniper::Variables|,
            outputs: |result: ZomeApiResult<RawString>|,
            handler: handle_query
        }
    ]
    traits: { hc_public [graphql] }
}


pub fn handle_query(query: String, variables: juniper::Variables) -> ZomeApiResult<RawString> {
    // execute query using juniper on this zomes schema

    hdk::debug(format!("{:?}", variables))?;

    let ctx = Context{
        cache: Rc::new(RefCell::new(HashMap::new())),
    };

    let (res, errors) =
        juniper::execute(&query, None, &Schema::new(Query, Mutation), &variables, &ctx)
            .map_err(|e| ZomeApiError::Internal(format!("{:?}", e)))?;

    match errors.len() {
        0 => {
            let result_string =
                serde_json::to_string(&res)
                .map_err(|e| ZomeApiError::Internal(e.to_string()))?;

            Ok(RawString::from(result_string))
        },
        _ => {
            hdk::debug(format!("{:?}", errors))?;
            Err(ZomeApiError::Internal(format!("{:?}", errors)))
        }
    }
}
