import {
	StyleSheet,
	Image,
	TouchableOpacity,
	View,
	StatusBar,
	Text,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import cartIcon from '../../assets/icons/cart_beg.jpg';
import { colors, network } from '../../constants';
import CustomButton from '../../components/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreaters from '../../states/actionCreaters/actionCreaters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../components/CustomAlert';

const ProductDetailScreen = ({ navigation, route }) => {
	const { product } = route.params;
	const cartproduct = useSelector((state) => state.product);
	const dispatch = useDispatch();

	const { addCartItem } = bindActionCreators(actionCreaters, dispatch);

	//method to add item to cart(redux)
	const handleAddToCat = (item) => {
		addCartItem(item);
		setAlertType('success');
		setError('Item added to cart');
	};

	//remove the authUser from async storage and navigate to login
	const logout = async () => {
		await AsyncStorage.removeItem('authUser');
		navigation.replace('login');
	};

	const [onWishlist, setOnWishlist] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const [wishlistItems, setWishlistItems] = useState([]);
	const [error, setError] = useState('');
	const [isDisable, setIsDisbale] = useState(true);
	const [alertType, setAlertType] = useState('error');

	//method to fetch wishlist from server using API call
	const fetchWishlist = async () => {
		const value = await AsyncStorage.getItem('authUser'); // get authUser from async storage
		let user = JSON.parse(value);
		var myHeaders = new Headers();
		myHeaders.append('x-auth-token', user.token);

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};
		fetch(`${network.serverip}/wishlist`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				if (result?.err === 'jwt expired') {
					logout();
				}
				if (result.success) {
					setWishlistItems(result.data[0].wishlist);
					setIsDisbale(false);

					//check if the current active product is already in wishlish or not
					result.data[0].wishlist.map((item) => {
						if (item?.productId?._id === product?._id) {
							setOnWishlist(true);
						}
					});

					setError('');
				}
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	//method to increase the product quantity
	const handleIncreaseButton = (quantity) => {
		if (quantity >= 1 && product.quantity > quantity) {
			setQuantity(quantity + 1);
		}
	};

	//method to decrease the product quantity
	const handleDecreaseButton = (quantity) => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	//method to add or remove item from wishlist
	const handleWishlistBtn = async () => {
		setIsDisbale(true);
		const value = await AsyncStorage.getItem('authUser');
		let user = JSON.parse(value);

		if (onWishlist) {
			var myHeaders = new Headers();
			myHeaders.append('x-auth-token', user.token);

			var requestOptions = {
				method: 'GET',
				headers: myHeaders,
				redirect: 'follow',
			};

			//API call to remove a item in wishlish
			fetch(
				`${network.serverip}/remove-from-wishlist?id=${product?._id}`,
				requestOptions
			)
				.then((response) => response.json())
				.then((result) => {
					if (result.success) {
						setError(result.message);
						setAlertType('success');
						setOnWishlist(false);
					} else {
						setError(result.message);
						setAlertType('error');
					}
					setOnWishlist(!onWishlist);
				})
				.catch((error) => {
					setError(result.message);
					setAlertType('error');
				});
			setIsDisbale(false);
		} else {
			var myHeaders2 = new Headers();
			myHeaders2.append('x-auth-token', user.token);
			myHeaders2.append('Content-Type', 'application/json');

			var raw2 = JSON.stringify({
				productId: product?._id,
				quantity: 1,
			});

			var addrequestOptions = {
				method: 'POST',
				headers: myHeaders2,
				body: raw2,
				redirect: 'follow',
			};

			//API call to add a item in wishlish
			fetch(`${network.serverip}/add-to-wishlist`, addrequestOptions)
				.then((response) => response.json())
				.then((result) => {
					if (result.success) {
						setError(result.message);
						setAlertType('success');
						setOnWishlist(true);
					} else {
						setError(result.message);
						setAlertType('error');
					}
					setOnWishlist(!onWishlist);
				})
				.catch((error) => {
					setError(result.message);
					setAlertType('error');
				});
			setIsDisbale(false);
		}
	};

	//set quantity, avaiableQuantity, product image and fetch wishlist on initial render
	useEffect(() => {
		fetchWishlist();
	}, []);

	//render whenever the value of wishlistItems change
	useEffect(() => { }, [wishlistItems]);

	return (
		<View style={styles.container}>
			<StatusBar />
			<View style={styles.topBarContainer}>
				<TouchableOpacity
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Ionicons
						name='arrow-back-circle-outline'
						size={30}
						color={colors.muted}
					/>
				</TouchableOpacity>

				<View />
				<TouchableOpacity
					style={styles.cartIconContainer}
					onPress={() => navigation.navigate('cart')}
				>
					{cartproduct.length > 0 ? (
						<View style={styles.cartItemCountContainer}>
							<Text style={styles.cartItemCountText}>{cartproduct.length}</Text>
						</View>
					) : (
						<></>
					)}
					<Image source={cartIcon} />
				</TouchableOpacity>
			</View>
			<View style={styles.bodyContainer}>
				<View style={styles.productImageContainer}>
					<Image source={{ uri: product?.image }} style={styles.productImage} />
				</View>

				{error && <CustomAlert message={error} type={alertType} />}

				<View style={styles.productInfoContainer}>
					<View style={styles.productInfoTopContainer}>
						<View style={styles.productNameContaier}>
							<Text style={styles.productNameText}>{product?.title}</Text>
						</View>
						<View style={styles.infoButtonContainer}>
							<View style={styles.wishlistButtonContainer}>
								<TouchableOpacity
									disabled={isDisable}
									style={styles.iconContainer}
									onPress={() => handleWishlistBtn()}
								>
									{onWishlist == false ? (
										<Ionicons name='heart' size={25} color={colors.muted} />
									) : (
										<Ionicons name='heart' size={25} color={colors.danger} />
									)}
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.productDetailContainer}>
							<Text style={styles.secondaryTextSm}>Price :</Text>
							<Text style={styles.primaryTextSm}>₹ {product?.price}</Text>
						</View>
						<View style={styles.productDetailContainer}>
							<Text style={styles.secondaryTextSm}>Description :</Text>
							<Text style={{ color: colors.muted }}>{product?.description}</Text>
						</View>
					</View>

					<View style={styles.productInfoBottomContainer}>
						<View style={styles.counterContainer}>
							<View style={styles.counter}>
								<TouchableOpacity
									style={styles.counterButtonContainer}
									onPress={() => {
										handleDecreaseButton(quantity);
									}}
								>
									<Text style={styles.counterButtonText}>-</Text>
								</TouchableOpacity>
								<Text style={styles.counterCountText}>{quantity}</Text>
								<TouchableOpacity
									style={styles.counterButtonContainer}
									onPress={() => {
										handleIncreaseButton(quantity);
									}}
								>
									<Text style={styles.counterButtonText}>+</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.productButtonContainer}>
							{product.quantity > 0 ? (
								<CustomButton
									text={'Add to Cart'}
									onPress={() => {
										handleAddToCat(product);
									}}
								/>
							) : (
								<CustomButton text='Out of Stock' disabled={true} />
							)}
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'flex-start',
		flex: 1,
	},
	topBarContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 12,
	},
	toBarText: {
		fontSize: 15,
		fontWeight: '600',
	},
	bodyContainer: {
		width: '100%',
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'flex-start',
		flex: 1,
	},
	productImageContainer: {
		width: '100%',
		flex: 2,
		backgroundColor: colors.light,
		flexDirecion: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: 0,
		marginBottom: 30,
	},
	productInfoContainer: {
		width: '100%',
		flex: 3,
		backgroundColor: colors.white,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'center',
		elevation: 25,
		maxHeight: 450
	},
	productImage: {
		height: 300,
		width: 300,
		resizeMode: 'contain',
	},
	productInfoTopContainer: {
		marginTop: 20,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		height: '100%',
		width: '100%',
		flex: 1,
	},
	productInfoBottomContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: colors.light,
		width: '100%',
		height: 150,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		elevation: 10,
	},
	productButtonContainer: {
		padding: 12,
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: colors.white,
		width: '100%',
		height: 80,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
	},
	productNameContaier: {
		padding: 5,
		paddingLeft: 20,
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	productNameText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.dark,
	},
	infoButtonContainer: {
		padding: 5,
		paddingRight: 0,
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	wishlistButtonContainer: {
		height: 50,
		width: 80,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.light,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
	},
	productDetailContainer: {
		padding: 5,
		paddingLeft: 20,
		paddingRight: 20,
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		elevation: 5,
	},
	secondaryTextSm: { fontSize: 15, fontWeight: 'bold', color: colors.dark },
	primaryTextSm: { color: colors.primary, fontSize: 15, fontWeight: 'bold' },
	productDescriptionContainer: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingLeft: 20,
		paddingRight: 20,
	},
	iconContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 40,
		height: 40,
		backgroundColor: colors.white,
		borderRadius: 20,
	},
	counterContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginRight: 50,
	},
	counter: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 5,
	},
	counterButtonContainer: {
		display: 'flex',
		width: 30,
		height: 30,
		marginLeft: 10,
		marginRight: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.muted,
		borderRadius: 15,
		elevation: 2,
	},
	counterButtonText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.white,
	},
	counterCountText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.dark
	},
	cartIconContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	cartItemCountContainer: {
		position: 'absolute',
		zIndex: 10,
		top: -10,
		left: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 22,
		width: 22,
		backgroundColor: colors.danger,
		borderRadius: 11,
	},
	cartItemCountText: {
		color: colors.dark,
		fontWeight: 'bold',
		fontSize: 10,
	},
});
