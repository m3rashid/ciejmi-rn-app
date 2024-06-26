import {
	StyleSheet,
	Image,
	TouchableOpacity,
	View,
	StatusBar,
	Text,
	Dimensions,
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
	const [onWishlist, setOnWishlist] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const [wishlistItems, setWishlistItems] = useState([]);
	const [error, setError] = useState('');
	const [isDisable, setIsDisbale] = useState(true);
	const [alertType, setAlertType] = useState('error');

	const handleAddToCart = async (item) => {
		addCartItem(item, quantity);
		setAlertType('success');
		setError('Item added to cart');
	};

	const logout = async () => {
		await AsyncStorage.removeItem('authUser');
		navigation.replace('login');
	};

	const fetchWishlist = async () => {
		try {
			const value = await AsyncStorage.getItem('authUser');
			let user = JSON.parse(value);
			var myHeaders = new Headers();
			myHeaders.append('x-auth-token', user.token);

			const response = await fetch(network.serverip + '/wishlist', {
				method: 'GET',
				headers: myHeaders,
				redirect: 'follow',
			});
			if (!response.ok) throw new Error('Error fetching wishlist');
			const result = await response.json();
			if (result?.err === 'jwt expired') logout();
			if (result.success) {
				setWishlistItems(result.data[0].wishlist);
				setIsDisbale(false);

				result.data[0].wishlist.map((item) => {
					if (item?.productId?._id === product?._id) {
						setOnWishlist(true);
					}
				});
				setError('');
			}
		} catch (error) {
			setError(error.message || 'An error occured');
		}
	};

	const handleIncreaseButton = (quantity, nonInventoryItem) => {
		if (nonInventoryItem) setQuantity(quantity + 1);
		else if (quantity >= 1 && product.quantity > quantity) {
			setQuantity(quantity + 1);
		}
	};

	const handleDecreaseButton = (quantity) => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	const handleWishlistBtn = async () => {
		setIsDisbale(true);
		const value = await AsyncStorage.getItem('authUser');
		let user = JSON.parse(value);

		if (onWishlist) {
			fetch(`${network.serverip}/remove-from-wishlist?id=${product?._id}`, {
				method: 'GET',
				headers: {
					'x-auth-token': user.token,
				},
				redirect: 'follow',
			})
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
			fetch(`${network.serverip}/add-to-wishlist`, {
				method: 'POST',
				headers: {
					'x-auth-token': user.token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: product?._id }),
				redirect: 'follow',
			})
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

	useEffect(() => {
		fetchWishlist();
	}, []);

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
							<Text style={styles.primaryTextSm}>
								₹ {Number(product?.price).toFixed(2)}
							</Text>
						</View>
						{product?.description && (
							<View style={styles.productDetailContainer}>
								<Text style={styles.secondaryTextSm}>Description :</Text>
								<Text style={{ color: colors.muted }}>
									{product?.description}
								</Text>
							</View>
						)}
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
										handleIncreaseButton(quantity, product.nonInventoryItem);
									}}
								>
									<Text style={styles.counterButtonText}>+</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.productButtonContainer}>
							<CustomButton
								{...{
									text:
										product.nonInventoryItem || product.quantity > 0
											? 'Add to Cart'
											: 'Out of Stock',
									...(product.nonInventoryItem || product.quantity > 0
										? { onPress: () => handleAddToCart(product) }
										: { disabled: true }),
								}}
							/>
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
		maxHeight: 450,
	},
	productImage: {
		width: Dimensions.get('window').width - 20,
		height: '100%',
		maxHeight: 500,
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
		marginTop: 10,
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
		color: colors.dark,
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
