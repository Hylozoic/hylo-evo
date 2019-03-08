use juniper::{FieldResult, ID};
use crate::Context;
use crate::identity;

/*
type Person {
  id: ID
  name: String
  avatarUrl: String
  ...
}
*/
#[derive(Constructor, Clone)]
pub struct Person {
    pub id: ID,
}
graphql_object!(Person: Context |&self| {
	field id(&executor) -> FieldResult<ID> {
		// be careful. This field is the Hylo ID not the holochain ID
		Ok(identity::get_identity(executor.context().cache.borrow_mut(), &self.id.to_string().into())?.hylo_id.into())
	}

	field name(&executor) -> FieldResult<String> {
		Ok(identity::get_identity(executor.context().cache.borrow_mut(), &self.id.to_string().into())?.name)
	}

	field avatarUrl(&executor) -> FieldResult<String> {
		Ok(identity::get_identity(executor.context().cache.borrow_mut(), &self.id.to_string().into())?.avatar_url)
	}

	field memberships(&executor, first: Option<i32>, cursor: Option<ID>, order: Option<String>) -> FieldResult<Vec<Membership>> {
		Ok(vec![
			Membership{
				id: self.id.clone().to_string().into(),
				community: Community::default()
			}
		])
	}
});


/*
type PersonQuerySet {
  total: Int
  hasMore: Boolean
  items: [Person]
}
*/
#[derive(Constructor, Clone)]
pub struct PersonQuerySet {
    pub total: i32,
    pub items: Vec<Person>,
}
graphql_object!(PersonQuerySet: Context |&self| {
	field total(&executor) -> i32 {
		self.total
	}

	field hasMore(&executor) -> bool {
		false
	}

	field items(&executor) -> Option<Vec<Option<Person>>> {
		Some(self.items.iter().map(|item| Some(item.clone())).collect())
	}
});



#[derive(GraphQLObject)]
pub struct Community {
    pub id: ID,
    pub name: String,
}

impl Default for Community {
    fn default() -> Self { 
    	Community {
			id: "999999".to_string().into(),
			name: "Holochain!".to_string()
		}
	}
}

#[derive(GraphQLObject)]
pub struct Membership {
    pub id: ID,
    pub community: Community,
}
