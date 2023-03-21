import * as actions from '../actionTypes/actionTypes';

/** {
 * "__v": 0, 
 * "_id": "6412ff827ff7f216107c7d6c", 
 * "createdAt": "2023-03-16T11:37:38.507Z", 
 * "description": "", 
 * "image": "https://ciejmi-exatorial-ecomm.s3.ap-south-1.amazonaws.com/1678966632292", 
 * "price": 45, 
 * "quantity": 29, 
 * "sku": "22", 
 * "title": "Code App", 
 * "updatedAt": "2023-03-17T11:34:26.136Z"
 * "category": {
			"__v": 0, 
			"_id": "6412ff607ff7f216107c7d67", 
			"createdAt": "2023-03-16T11:37:04.105Z", 
			"description": "code code code", 
			"image": "https://ciejmi-exatorial-ecomm.s3.amazonaws.com/1678966610495", 
			"title": "Code", 
			"updatedAt": "2023-03-16T11:37:04.105Z"
		},
 * }
 */

const reducer = (state = [], action) => {
	let done = false;
	switch (action.type) {
		case actions.CART_ADD:
			state.map((item, index) => {
				if (item._id === action.payload.item._id) {
					done = true;
					if (item.avaiableQuantity > item.quantity) {
						state[index].quantity = action.payload.number;
					} else {
					}
					return state;
				}
			});
			if (!done) {
				return [
					...state,
					{
						_id: action.payload.item._id,
						category: action.payload.item.category.title,
						createdAt: action.payload.item.createdAt,
						description: action.payload.item.description,
						image: action.payload.item.image,
						price: action.payload.item.price,
						sku: action.payload.item.sku,
						title: action.payload.item.title,
						updatedAt: action.payload.item.updatedAt,
						avaiableQuantity: action.payload.item.quantity,
						quantity: action.payload.number,
					},
				];
			}

		case actions.CART_REMOVE:
			return state.filter((item) => item._id !== action.payload);

		case actions.INCREASE_CART_ITEM_QUANTITY:
			if (action.payload.type === 'increase') {
				state.map((item, index) => {
					if (item._id === action.payload.id) {
						return (state[index].quantity = state[index].quantity + 1);
					}
				});
			}

		case actions.DECREASE_CART_ITEM_QUANTITY:
			if (action.payload.type === 'decrease') {
				state.map((item, index) => {
					if (item._id === action.payload.id) {
						return (state[index].quantity = state[index].quantity - 1);
					}
				});
			}
		case actions.EMPTY_CART:
			if (action.payload === 'empty') {
				state.splice(0, state.length);
				return state;
			}

		default:
			return state;
	}
};

export default reducer;
