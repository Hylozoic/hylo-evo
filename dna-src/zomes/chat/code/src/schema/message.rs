use juniper::{FieldResult, ID};

use crate::Context;
use crate::message;

use super::person::Person;
use super::message_thread::MessageThread;

/*
type Message {
  id: ID
  text: String
  creator: Person
  messageThread: MessageThread
  createdAt: String
}
*/
#[derive(Constructor, Clone)]
pub struct Message {
    pub id: ID,
}
graphql_object!(Message: Context |&self| {
	field id(&executor) -> ID {
		self.id.clone()
	}

	field text(&executor) -> FieldResult<String> {
		let text = message::get_text(
			executor.context().cache.borrow_mut(), 
			&self.id.to_string().into())?;
		Ok(text)
	}

	field creator(&executor) -> FieldResult<Person> {
		let id = message::get_message_creator(
			executor.context().cache.borrow_mut(), 
			&self.id.to_string().into())?;
		Ok(Person{id: id.to_string().into()})
	}

	field messageThread(&executor) -> FieldResult<MessageThread> {
		let id = message::get_thread_id(
			executor.context().cache.borrow_mut(), 
			&self.id.to_string().into())?;
		Ok(MessageThread{id: id.to_string().into()})
	}

	field createdAt(&executor) -> String {
		"2019-01-14T07:52:22+0000".into()
	}
});

/*
type MessageQuerySet {
  total: Int
  hasMore: Boolean
  items: [Message]
}
*/
#[derive(Constructor, Clone)]
pub struct MessageQuerySet {
    pub total: i32,
    pub items: Vec<Message>,
}

graphql_object!(MessageQuerySet: Context |&self| {
	field total(&executor) -> i32 {
		self.total
	}

	field hasMore(&executor) -> bool {
		false
	}

	field items(&executor) -> Option<Vec<Option<Message>>> {
		Some(self.items.iter().map(|item| Some(item.clone())).collect())
	}
});