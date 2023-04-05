import * as actions from '../actionTypes/actionTypes';

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
						nonInventoryItem: action.payload.item.nonInventoryItem,
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
