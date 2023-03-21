import {
	StyleSheet,
	StatusBar,
	View,
	TouchableOpacity,
	Text,
	ScrollView,
	Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import BasicProductList from '../../components/BasicProductList';
import { colors, network } from '../../constants';
import CustomButton from '../../components/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import * as actionCreaters from '../../states/actionCreaters/actionCreaters';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressDialog from 'react-native-progress-dialog';
import CustomAlert from '../../components/CustomAlert';

const CheckoutScreen = ({ navigation, route }) => {
	const [isloading, setIsloading] = useState(false);
	const cartproduct = useSelector((state) => state.product);
	const dispatch = useDispatch();
	const { emptyCart } = bindActionCreators(actionCreaters, dispatch);

	const [user, setUser] = useState({});
	const [deliveryCost, setDeliveryCost] = useState(0);
	const [totalCost, setTotalCost] = useState(0);
	const [address, setAddress] = useState('');
	const [error, setError] = useState('');
	const [alertType, setAlertType] = useState('error');

	//method to remove the authUser from aysnc storage and navigate to login
	const logout = async () => {
		await AsyncStorage.removeItem('authUser');
		navigation.replace('login');
	};

	useEffect(() => {
		//fetch the authUser from async storage
		const fetchUser = async () => {
			const value = await AsyncStorage.getItem('authUser');
			let user = JSON.parse(value);
			const dd = await fetch(network.serverip + '/get-all-address', {
				method: 'GET',
				headers: {
					'x-auth-token': user.token,
				},
			});
			return dd.json();
		};
		fetchUser()
			.then((d) => setUser(d.data))
			.catch(console.log);
	}, [route]);

	//method to handle checkout
	const handleCheckout = async () => {
		if (!user || !address === 0) {
			setError('Please add an address to proceed');
			setAlertType('error');
			return;
		}

		setIsloading(true);
		const myHeaders = new Headers();
		myHeaders.append('x-auth-token', user.token);
		myHeaders.append('Content-Type', 'application/json');

		const payload = [];
		let totalamount = 0;

		// fetch the cart items from redux and set the total cost
		cartproduct.forEach((product) => {
			let obj = {
				productId: product._id,
				quantity: product.quantity,
			};
			totalamount += parseInt(product.price) * parseInt(product.quantity);
			payload.push(obj);
		});

		fetch(network.serverip + '/checkout', {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify({
				items: payload,
				amount: totalamount,
				shippingAddress: address,
				status: 'PENDING',
				paymentType: 'COD',
			}),
			redirect: 'follow',
		})
			.then((response) => response.json())
			.then((result) => {
				if (result.err === 'jwt expired') {
					logout();
				}
				if (result.success == true) {
					emptyCart('empty');
					navigation.replace('orderconfirm');
				}
			})
			.catch((error) => {
				console.log(error);
				setIsloading(false);
			})
			.finally(() => {
				setIsloading(false);
			});
	};

	// set the address and total cost on initital render
	useEffect(() => {
		setTotalCost(
			cartproduct.reduce((accumulator, object) => {
				return accumulator + object.price * object.quantity;
			}, 0)
		);
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar />
			<ProgressDialog visible={isloading} label='Placing Order . . .' />
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
				<View />
			</View>

			<CustomAlert message={error} type={alertType} />

			<ScrollView style={styles.bodyContainer} nestedScrollEnabled={true}>
				<Text style={[styles.primaryText, { fontSize: 20, marginBottom: 10 }]}>
					Order Summary
				</Text>
				<ScrollView
					style={styles.orderSummaryContainer}
					nestedScrollEnabled={true}
				>
					{cartproduct.map((product, index) => (
						<BasicProductList
							key={index}
							image={product.image}
							title={product.title}
							price={product.price}
							quantity={product.quantity}
						/>
					))}
				</ScrollView>

				<Text style={styles.primaryText}>Total</Text>
				<View style={styles.totalOrderInfoContainer}>
					<View style={styles.list}>
						<Text style={{ color: colors.muted }}>Order</Text>
						<Text style={{ color: colors.muted }}>
							₹ {Number(totalCost).toFixed(2)}
						</Text>
					</View>
					<View style={styles.list}>
						<Text style={{ color: colors.muted }}>Delivery Charges</Text>
						<Text style={{ color: colors.muted }}>
							₹ {Number(deliveryCost).toFixed(2)}
						</Text>
					</View>
					<View style={styles.list}>
						<Text style={styles.primaryTextSm}>Total</Text>
						<Text style={styles.secondaryTextSm}>
							₹ {Number(totalCost + deliveryCost).toFixed(2)}
						</Text>
					</View>
				</View>
				<Text style={styles.primaryText}>Contact</Text>
				<View style={styles.listContainer}>
					<View style={styles.list}>
						<Text style={styles.secondaryTextSm}>Email</Text>
						<Text style={styles.secondaryTextSm}>{user.email}</Text>
					</View>
				</View>

				<Text style={styles.primaryText}>Address</Text>
				<View
					style={[
						styles.listContainer,
						{
							flexDirection: 'row',
							justifyContent: 'space-between',
							padding: 10,
						},
					]}
				>
					<Text style={styles.secondaryTextSm}>All Address</Text>
					<TouchableOpacity
						// style={styles.list}
						onPress={() => navigation.navigate('addAddress')}
					>
						<Text style={styles.primaryTextSm}>Add Address</Text>
					</TouchableOpacity>
				</View>

				<View style={{ backgroundColor: colors.white }}>
					{(user.addresses || []).map((a) => {
						return (
							<View
								key={a._id}
								style={{
									padding: 8,
									borderRadius: 5,
									...(a._id === address
										? { backgroundColor: colors.primary_light }
										: { backgroundColor: colors.white }),
								}}
							>
								<TouchableOpacity
									style={[
										styles.list,
										{
											borderBottomWidth: 0,
											flexDirection: 'column',
											alignItems: 'flex-start',
											...(a._id === address
												? { backgroundColor: colors.primary_light }
												: { backgroundColor: colors.white }),
										},
									]}
									onPress={() => {
										setAddress(a._id);
									}}
								>
									<Text style={[styles.secondaryTextSm, { textAlign: 'left' }]}>
										{a.localAddressOne}, {a.localAddressTwo}, {a.city},{' '}
										{a.state}, {a.postalCode}
									</Text>
								</TouchableOpacity>
							</View>
						);
					})}

					{(user.addresses || []).length === 0 && (
						<Text
							style={{ color: colors.muted, padding: 8, textAlign: 'center' }}
						>
							Please add an address to continue
						</Text>
					)}
				</View>

				<Text style={styles.primaryText}>Payment</Text>
				<View style={styles.listContainer}>
					<View style={styles.list}>
						<Text style={styles.secondaryTextSm}>Method</Text>
						<Text style={styles.primaryTextSm}>Cash On Delivery</Text>
					</View>
				</View>

				<View style={styles.emptyView} />
			</ScrollView>
			<View style={styles.buttomContainer}>
				{!address && (
					<Text
						style={{
							color: colors.muted,
							textAlign: 'center',
							marginBottom: 8,
						}}
					>
						Please Choose an address to continue
					</Text>
				)}

				{address ? (
					<CustomButton
						text='Confirm Order'
						onPress={() => {
							handleCheckout();
						}}
					/>
				) : (
					<CustomButton text='Confirm Order' disabled />
				)}
			</View>
		</View>
	);
};

export default CheckoutScreen;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingBottom: 0,
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
		flex: 1,
		paddingLeft: 12,
		paddingRight: 12,
	},
	orderSummaryContainer: {
		backgroundColor: colors.white,
		borderRadius: 10,
		padding: 10,
		maxHeight: 220,
	},
	totalOrderInfoContainer: {
		borderRadius: 10,
		padding: 10,
		backgroundColor: colors.white,
	},
	primaryText: {
		marginBottom: 5,
		marginTop: 12,
		marginLeft: 5,
		fontSize: 18,
		fontWeight: 'bold',
		color: colors.muted,
	},
	list: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: colors.white,
		height: 35,
		borderBottomWidth: 1,
		borderBottomColor: colors.light,
		padding: 5,
	},
	primaryTextSm: {
		fontSize: 15,
		fontWeight: 'bold',
		color: colors.primary,
	},
	secondaryTextSm: {
		fontSize: 15,
		fontWeight: 'bold',
		color: colors.muted,
	},
	listContainer: {
		backgroundColor: colors.white,
		borderRadius: 10,
		padding: 5,
	},
	buttomContainer: {
		width: '100%',
		padding: 12,
	},
	emptyView: {
		width: '100%',
		height: 12,
	},
	modelBody: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modelAddressContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12,
		width: 320,
		height: 400,
		backgroundColor: colors.white,
		borderRadius: 10,
		elevation: 3,
	},
});
