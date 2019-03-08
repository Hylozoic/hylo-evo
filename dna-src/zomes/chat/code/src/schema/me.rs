use juniper::{FieldResult, ID};
use hdk::AGENT_ADDRESS;

use crate::identity;
use crate::thread;
use crate::Context;

use super::message_thread::{MessageThread, MessageThreadQuerySet};

/*
type Me {
  id: ID
  ...
  messageThreads(first: Int, offset: Int, order: String, sortBy: String): MessageThreadQuerySet
  ...
}
*/
pub struct Me;
graphql_object!(Me: Context |&self| {
	field id(&executor) -> FieldResult<ID> {
		Ok(identity::get_identity(executor.context().cache.borrow_mut(), &AGENT_ADDRESS)?.hylo_id.into())
	}

	field messageThreads(&executor, first: Option<i32>, offset: Option<i32>, order: Option<String>, sort_by: Option<String>) -> FieldResult<MessageThreadQuerySet> {
		let thread_ids = thread::get_my_threads()?;
		Ok(MessageThreadQuerySet{
			total: thread_ids.len() as i32,
			items: thread_ids.iter().map(|id| MessageThread{id: id.to_string().into()}).collect(),
		})
	}
});
