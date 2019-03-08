use core::cell::RefMut;
use core::convert::TryFrom;
use std::collections::HashMap;
use hdk::{
    self,
    error::{ZomeApiResult, ZomeApiError},
    holochain_core_types::{
        cas::content::{Address, AddressableContent},
        entry::{Entry, AppEntryValue},
    },
};
use holochain_wasm_utils::api_serialization::get_links::GetLinksResult;


pub trait Cache {
	fn get_entry(&mut self, address: &Address) -> ZomeApiResult<Option<Entry>>;
	fn commit_entry(&mut self, entry: &Entry) -> ZomeApiResult<Address>;
	fn get_links(&self, base: &Address, tag: &str) -> ZomeApiResult<GetLinksResult>;
	fn get_links_and_load(
		&mut self,
	    base: &Address,
	    tag: &str,
	) -> ZomeApiResult<GetLinksLoadResult<Entry>>;
	fn link_entries(
		&mut self,
	    a: &Address,
	    b: &Address,
	    tag: &str,
	) -> ZomeApiResult<()>;	
	fn link_entries_bidir(
		&mut self,
	    a: &Address,
	    b: &Address,
	    tag_a_b: &str,
	    tag_b_a: &str,
	) -> ZomeApiResult<()>;
}

#[allow(dead_code)]
pub struct HolochainEntity {
	entry: Entry,
	links: HashMap<String, Vec<Address>>
}

impl Cache for HashMap<Address, HolochainEntity> {

	//
	// These four functions wrap the holochain functionality and provide caching
	//

	fn get_entry(&mut self, address: &Address) -> ZomeApiResult<Option<Entry>> {
		match self.get(address) {
			Some(entity) => {
				cache_debug("Loading from cache".into());
				Ok(Some(entity.entry.clone()))
			},
			None => {
				cache_debug("Loading from DHT".into());
				let result = hdk::get_entry(address);
				match result {
					Ok(Some(ref entry)) => { self.insert(address.to_owned(), HolochainEntity{entry: entry.clone(), links: HashMap::new()}); },
					_ => { () }
				};
				result
			},
		}
	}

	fn commit_entry(&mut self, entry: &Entry) -> ZomeApiResult<Address> {
		self.insert(entry.address(), HolochainEntity {
			entry: entry.clone(),
			links: HashMap::new(),
		});
		cache_debug(format!("Inserted {:?} in cache", entry));
		hdk::commit_entry(entry)
	}

	fn get_links(&self, base: &Address, tag: &str) -> ZomeApiResult<GetLinksResult> {
		match self.get(base) {
			Some(entity) => {
				let links = match entity.links.get(tag) {
					Some(links) => links.to_vec(),
					None => hdk::get_links(base, tag)?.addresses().to_owned(),
				};
				Ok(GetLinksResult::new(links))
			}
			None => hdk::get_links(base, tag),
		}
	}

	fn link_entries(
		&mut self,
	    a: &Address,
	    b: &Address,
	    tag: &str,
	) -> ZomeApiResult<()> {
		match self.get_mut(a) {
			Some(entity) => {
				match entity.links.get_mut(tag.into()) {
					Some(link_vec) => {
						link_vec.push(b.clone());
					},
					None => { 
						entity.links.insert(tag.into(), vec![b.clone()]);
					},
				};
				cache_debug(format!("Added link from {} to {} in cache", a, b));
			},
			None => {
				cache_debug("Base for link not found in cache".into());
			},
		}
		hdk::link_entries(a, b, tag)
	}

	//
	// The rest are just sugar functions really
	// 

	fn get_links_and_load(
		&mut self,
	    base: &Address,
	    tag: &str,
	) -> ZomeApiResult<GetLinksLoadResult<Entry>> {
	    let get_links_result = self.get_links(base, tag)?;

	    Ok(get_links_result
	        .addresses()
	        .iter()
	        .map(|address| {
	            self.get_entry(&address.to_owned()).map(|entry: Option<Entry>| GetLinksLoadElement {
	                address: address.to_owned(),
	                entry: entry.unwrap(),
	            })
	        })
	        .filter_map(Result::ok)
	        .collect())
	}


	fn link_entries_bidir(
		&mut self,
	    a: &Address,
	    b: &Address,
	    tag_a_b: &str,
	    tag_b_a: &str,
	) -> ZomeApiResult<()> {
		self.link_entries(a, b, tag_a_b)?;
    	self.link_entries(b, a, tag_b_a)?;
    	Ok(())
	}

}

pub fn get_as_type<R: TryFrom<AppEntryValue>>(mut cache: RefMut<Cache>, address: &Address) -> ZomeApiResult<R> {
    let get_result = cache.get_entry(address)?;
    let entry = get_result.ok_or(ZomeApiError::Internal("No entry at this address".into()))?;
    match entry {
        Entry::App(_, entry_value) => R::try_from(entry_value.to_owned()).map_err(|_| {
            ZomeApiError::Internal(
                "Could not convert get_links result to requested type".to_string(),
            )
        }),
        _ => Err(ZomeApiError::Internal(
            "get_links did not return an app entry".to_string(),
        )),
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GetLinksLoadElement<T> {
    pub address: Address,
    pub entry: T,
}

pub type GetLinksLoadResult<T> = Vec<GetLinksLoadElement<T>>;

pub fn get_links_and_load_type<R: TryFrom<AppEntryValue>>(
	mut cache: RefMut<Cache>,
    base: &Address,
    tag: &str,
) -> ZomeApiResult<GetLinksLoadResult<R>> {
    let link_load_results = cache.get_links_and_load(base, tag)?;

    Ok(link_load_results
        .iter()
        .map(|get_links_result| match get_links_result.entry.clone() {
            Entry::App(_, entry_value) => {
                let entry = R::try_from(entry_value).map_err(|_| {
                    ZomeApiError::Internal(
                        "Could not convert get_links result to requested type".to_string(),
                    )
                })?;

                Ok(GetLinksLoadElement::<R> {
                    entry: entry,
                    address: get_links_result.address.clone(),
                })
            }
            _ => Err(ZomeApiError::Internal(
                "get_links did not return an app entry".to_string(),
            )),
        })
        .filter_map(Result::ok)
        .collect())
}

fn cache_debug(message: String) {
	hdk::debug(format!("CACHE: {}", message)).expect("Could not write debug");
}

