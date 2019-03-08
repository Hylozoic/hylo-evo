use std::rc::Rc;
use std::cell::RefCell;

use juniper::{FieldError, FieldResult, Value, ID};

use crate::cache::Cache;
use crate::identity;
use crate::thread;
use crate::message::post_message_to_thread;

mod person;
mod message_thread;
mod message;
mod me;

use person::{Person, PersonQuerySet};
use message::{Message};
use message_thread::{MessageThread};
use me::Me;


/*=====================================
=            Input Objects            =
=====================================*/

#[derive(GraphQLInputObject)]
struct MessageThreadInput {
    participant_ids: Option<Vec<Option<String>>>,
	created_at: Option<String>
}

#[derive(GraphQLInputObject)]
struct MessageInput {
    message_thread_id: Option<String>,
    text: Option<String>,
	created_at: Option<String>
}

/*=====  End of Input Objects  ======*/


/*
 * This is the macro for defining the query schema for the graphQL provider
 * Each field is something that can be queried. These take parameters to filter as needed
 */

pub struct Query;
graphql_object!(Query: Context |&self| {

    field apiVersion(&executor) -> FieldResult<String> {
        Ok("0.0.1".to_string())
    }

    field me(&executor) -> FieldResult<Me> {
    	Ok(Me)
    }

    field messageThread(&executor, id: Option<ID>) -> FieldResult<MessageThread> {
    	match id {
    		Some(id) => Ok(MessageThread{id}),
    		None => Err(FieldError::new("Must call with an id parameter", Value::Null))
    	}
    }

    field people(
        &executor,
	    first: Option<i32>,
	    order: Option<String>,
	    sort_by: Option<String>,
	    offset: Option<i32>,
	    search: Option<String>,
	    autocomplete: Option<String>,
	    filter: Option<String>
	) -> FieldResult<PersonQuerySet> {
    	let people: Vec<Person> = identity::get_people()?
	    	.iter()
	    	.map(|id| {
        		Person { 
	    			id: id.to_string().into(), 
    			}
	    	})
    		.collect();
    	Ok(
    		PersonQuerySet{
    			total: people.len() as i32,
    			items: people,
    		}
    	)
	}

});

/*
 * This mutation object is what allows the consumer to change the data stored in the store
 * In holochain the store is the DHT. You also need to be sure you allow some pattern (such as links)
 * such that the values can be retrieved again later
 */

 #[derive(GraphQLObject)]
struct Success {
    success: bool,
    data: String,
}
impl Success {
    pub fn new(data: String) -> Self {
        Success{
            success: true,
            data,
        }
    }
}

pub struct Mutation;
graphql_object!(Mutation: Context |&self| {

    field createMessage(&executor, data: MessageInput) -> FieldResult<Message> {
    	let id = post_message_to_thread(
            executor.context().cache.borrow_mut(),
    		&data.message_thread_id.unwrap_or("".into()).into(), 
    		data.text.unwrap_or("".into())
    	)?;
    	Ok(Message{
    		id: id.to_string().into(),
    	})
    }

    field findOrCreateThread(&executor, data: MessageThreadInput) -> FieldResult<MessageThread> {
    	let participant_hylo_ids = data.participant_ids.unwrap().into_iter().map(|elem| elem.unwrap()).collect();
    	thread::get_or_create_thread(
            &executor.context().cache,
            participant_hylo_ids
        )
    		.map(|id| MessageThread{id: id.to_string().into()})
    		.map_err(|err| FieldError::new(err.to_string(), Value::Null))
    }

    field registerUser(id: Option<ID>, name: Option<String>, avatar_url: Option<String>) -> FieldResult<Success> {
    	let id = identity::register_user(
    		name.unwrap_or("?".into()), 
    		avatar_url.unwrap_or("".into()),
    		id.unwrap_or(juniper::ID::new("")).to_string(),
    	)?;
    	Ok(Success::new(id.to_string()))
    }

});

// define the context struct that is passed between all field calls in a query
// This is used to cache holochain calls to make queries much more efficient
pub struct Context {
    pub cache: Rc<RefCell<Cache>>
}
impl juniper::Context for Context {}

// A root schema consists of a query and a mutation.
// Request queries can be executed against a RootNode.
pub type Schema = juniper::RootNode<'static, Query, Mutation>;
