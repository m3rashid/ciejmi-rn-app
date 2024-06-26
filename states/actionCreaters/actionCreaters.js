import * as actions from '../actionTypes/actionTypes';

export const addCartItem = (product, quantity = 1) => {
	return (dispatch) => {
		dispatch({
			type: actions.CART_ADD,
			payload: {
				item: product,
				number: quantity,
			},
		});
	};
};

export const removeCartItem = (id) => {
	return (dispatch) => {
		dispatch({
			type: actions.CART_REMOVE,
			payload: id,
		});
	};
};

export const increaseCartItemQuantity = (id) => {
	return (dispatch) => {
		dispatch({
			type: actions.INCREASE_CART_ITEM_QUANTITY,
			payload: id,
		});
	};
};

export const decreaseCartItemQuantity = (id) => {
	return (dispatch) => {
		dispatch({
			type: actions.DECREASE_CART_ITEM_QUANTITY,
			payload: id,
		});
	};
};

export const emptyCart = (type) => {
	return (dispatch) => {
		dispatch({
			type: actions.EMPTY_CART,
			payload: type,
		});
	};
};
