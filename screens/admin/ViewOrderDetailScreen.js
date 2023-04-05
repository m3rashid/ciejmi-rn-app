import {
	StyleSheet,
	Text,
	StatusBar,
	View,
	ScrollView,
	TouchableOpacity,
	Share,
	Linking,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors, network } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../components/CustomAlert';
import ProgressDialog from 'react-native-progress-dialog';
import BasicProductList from '../../components/BasicProductList';
import CustomButton from '../../components/CustomButton';
import DropDownPicker from 'react-native-dropdown-picker';

const ViewOrderDetailScreen = ({ navigation, route }) => {
	const { orderDetail, Token } = route.params;
	const [isloading, setIsloading] = useState(false);
	const [label, setLabel] = useState('Loading . . .');
	const [error, setError] = useState('');
	const [alertType, setAlertType] = useState('error');
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [statusDisable, setStatusDisable] = useState(false);
	const [items, setItems] = useState([
		{ label: 'Pending', value: 'PENDING' },
		{ label: 'Shipped', value: 'SHIPPED' },
		{ label: 'Delivered', value: 'DELIVERED' },
	]);

	//method to convert the time into AM PM format
	function tConvert(time) {
		time = time
			.toString()
			.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
		if (time.length > 1) {
			time = time.slice(1); // Remove full string match value
			time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
			time[0] = +time[0] % 12 || 12; // Adjust hours
		}
		return time.join('');
	}

	//method to convert the Data into dd-mm-yyyy format
	const dateFormat = (datex) => {
		let t = new Date(datex);
		const date = ('0' + t.getDate()).slice(-2);
		const month = ('0' + (t.getMonth() + 1)).slice(-2);
		const year = t.getFullYear();
		const hours = ('0' + t.getHours()).slice(-2);
		const minutes = ('0' + t.getMinutes()).slice(-2);
		const seconds = ('0' + t.getSeconds()).slice(-2);
		const time = tConvert(`${hours}:${minutes}:${seconds}`);
		const newDate = `${date}-${month}-${year}, ${time}`;

		return newDate;
	};

	//method to update the status using API call
	const handleUpdateStatus = (id) => {
		if (!id) return;

		setIsloading(true);
		setError('');
		setAlertType('error');

		fetch(
			`${network.serverip}/admin/order-status?orderId=${id}&status=${value}`,
			{
				method: 'GET',
				headers: {
					'x-auth-token': Token,
				},
				redirect: 'follow',
			}
		) //API call
			.then((response) => response.json())
			.then((result) => {
				if (result.success == true) {
					setError(`Order status is successfully updated to ${value}`);
					setAlertType('success');
				}
				setIsloading(false);
			})
			.catch((error) => {
				setAlertType('error');
				setError(error);
				setIsloading(false);
			});
	};

	const handleShareInvoice = async () => {
		if (!orderDetail?.invoiceUrl) {
			// handle the error
			return;
		}
		const result = await Share.share({
			message: `Here is your invoice for order # ${orderDetail?._id} ordered from CIE-JMI : ${orderDetail?.invoiceUrl}`,
		});
	};

	const handleDownloadInvoice = () => {
		if (!orderDetail?.invoiceUrl) {
			// handle the error
			return;
		}

		Linking.openURL(`${orderDetail?.invoiceUrl}`).catch((err) =>
			console.error('Error', err)
		);
	};

	// calculate the total cost and set the all requried variables on initial render
	useEffect(() => {
		setError('');
		setAlertType('error');
		if (orderDetail?.status == 'DELIVERED') {
			setStatusDisable(true);
		} else {
			setStatusDisable(false);
		}
		setValue(orderDetail?.status);
	}, []);

	const handleViewInvoice = () => {
		navigation.navigate('pdf', { pdfUrl: orderDetail?.invoiceUrl });
	};

	return (
		<View style={styles.container}>
			<ProgressDialog visible={isloading} label={label} />
			<StatusBar />
			<View style={styles.TopBarContainer}>
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
			</View>
			<View style={styles.screenNameContainer}>
				<Text style={styles.screenNameText}>Order Details</Text>
				<View>
					<Text style={[styles.screenNameParagraph, { color: colors.dark }]}>
						View all detail about order
					</Text>
				</View>
			</View>
			<CustomAlert message={error} type={alertType} />
			<ScrollView
				style={styles.bodyContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.containerNameContainer}>
					<View>
						<Text style={styles.containerNameText}>Ship & Bill to</Text>
					</View>
				</View>
				<View style={styles.ShipingInfoContainer}>
					<Text style={styles.secondarytextMedian}>
						{orderDetail?.user?.name}
					</Text>
					<Text style={styles.secondarytextMedian}>
						{orderDetail?.user?.email}
					</Text>
					<Text style={styles.secondarytextSm}>
						{orderDetail?.shippingAddress.localAddressOne},{' '}
						{orderDetail?.shippingAddress.localAddressTwo},{' '}
						{orderDetail?.shippingAddress.city},{' '}
						{orderDetail?.shippingAddress.state},{' '}
					</Text>
					<Text style={styles.secondarytextSm}>
						{orderDetail?.shippingAddress.postalCode}
					</Text>
				</View>
				<View>
					<Text style={styles.containerNameText}>Order Info</Text>
				</View>
				<View style={styles.orderInfoContainer}>
					<Text style={styles.secondarytextMedian}>
						Order # {orderDetail?._id}
					</Text>
					<Text style={styles.secondarytextSm}>
						Ordered on {dateFormat(orderDetail?.updatedAt)}
					</Text>
					{orderDetail?.shippedOn && (
						<Text style={styles.secondarytextSm}>
							Shipped on {orderDetail?.shippedOn}
						</Text>
					)}
					{orderDetail?.deliveredOn && (
						<Text style={styles.secondarytextSm}>
							Delivered on {orderDetail?.deliveredOn}
						</Text>
					)}
				</View>
				<View style={styles.containerNameContainer}>
					<View>
						<Text style={styles.containerNameText}>Package Details</Text>
					</View>
				</View>
				<View style={styles.orderItemsContainer}>
					<View style={styles.orderItemContainer}>
						<Text style={styles.orderItemText}>Package</Text>
						<Text style={{ color: colors.dark }}>{value}</Text>
					</View>
					<View style={styles.orderItemContainer}>
						<Text style={styles.orderItemText}>
							Order on : {dateFormat(orderDetail?.updatedAt)}
						</Text>
					</View>
					<ScrollView
						style={styles.orderSummaryContainer}
						nestedScrollEnabled={true}
					>
						{orderDetail?.items.map((product, index) => (
							<View key={index}>
								<BasicProductList
									title={product?.productId?.title}
									price={product?.productId?.price}
									quantity={product?.quantity}
									image={product?.productId?.image}
								/>
							</View>
						))}

						<View style={{ marginTop: 12 }}>
							<Text
								style={{
									color: colors.muted,
									fontWeight: 'bold',
									fontSize: 15,
									paddingLeft: 5,
								}}
							>
								Order Invoice
							</Text>
						</View>

						<View
							style={{
								marginTop: 10,
								flexDirection: 'row',
								justifyContent: 'center',
								gap: 12,
							}}
						>
							<CustomButton
								onPress={handleViewInvoice}
								text='View'
								style={{
									flex: 1,
									padding: 8,
									backgroundColor: colors.primary,
								}}
							/>
							<CustomButton
								onPress={handleDownloadInvoice}
								text='Download'
								style={{
									padding: 8,
									flex: 1,
									backgroundColor: colors.primary,
								}}
							/>
							<CustomButton
								onPress={handleShareInvoice}
								text='Share'
								style={{
									padding: 8,
									flex: 1,
									backgroundColor: colors.primary,
								}}
							/>
						</View>
					</ScrollView>
					<View style={styles.orderItemContainer}>
						<Text style={styles.orderItemText}>Total</Text>
						<Text style={{ color: colors.dark }}>
							₹ {Number(orderDetail.amount).toFixed(2)}
						</Text>
					</View>
				</View>
				<View style={styles.emptyView} />
			</ScrollView>

			<View style={styles.bottomContainer}>
				<View style={{ marginRight: 10 }}>
					<DropDownPicker
						style={{
							width: 180,
							borderColor: colors.white,
							marginTop: -10,
							backgroundColor: colors.light,
							borderColor: colors.white,
						}}
						open={open}
						value={value}
						items={items}
						setOpen={setOpen}
						setValue={setValue}
						placeholder='Change Status'
						setItems={setItems}
						disabled={statusDisable}
						containerStyle={{ borderColor: colors.white }}
						dropDownContainerStyle={{ borderColor: colors.white }}
						labelStyle={{ color: colors.muted }}
					/>
				</View>
				<CustomButton
					style={{ width: 200 }}
					text='Update'
					{...(statusDisable == false
						? { onPress: () => handleUpdateStatus(orderDetail?._id) }
						: { disabled: true })}
				/>
			</View>
		</View>
	);
};

export default ViewOrderDetailScreen;

const styles = StyleSheet.create({
	container: {
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		paddingBottom: 0,
		flex: 1,
	},
	TopBarContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	screenNameContainer: {
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 10,
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		marginBottom: 5,
	},
	screenNameText: {
		fontSize: 20,
		fontWeight: '800',
		color: colors.muted,
	},
	screenNameParagraph: {
		marginTop: 5,
		fontSize: 15,
	},
	bodyContainer: { flex: 1, width: '100%', padding: 5 },
	ShipingInfoContainer: {
		marginTop: 5,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: colors.white,
		padding: 12,
		borderRadius: 5,
		borderColor: colors.muted,
		elevation: 2,
		marginBottom: 10,
	},
	containerNameContainer: {
		marginTop: 10,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	containerNameText: {
		fontSize: 18,
		fontWeight: '800',
		color: colors.muted,
	},
	secondarytextSm: {
		color: colors.muted,
		fontSize: 13,
	},
	orderItemsContainer: {
		marginTop: 5,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: colors.white,
		padding: 10,
		borderRadius: 5,
		borderColor: colors.muted,
		elevation: 2,
		marginBottom: 10,
	},
	orderItemContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	orderItemText: {
		fontSize: 13,
		color: colors.muted,
	},
	orderSummaryContainer: {
		backgroundColor: colors.white,
		borderRadius: 5,
		padding: 10,
		maxHeight: 220,
		width: '100%',
		marginBottom: 5,
	},
	bottomContainer: {
		backgroundColor: colors.white,
		width: '105%',
		height: 100,
		borderTopLeftRadius: 15,
		borderTopEndRadius: 15,
		elevation: 2,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
	},
	orderInfoContainer: {
		marginTop: 5,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: colors.white,
		padding: 12,
		borderRadius: 5,
		borderColor: colors.muted,
		elevation: 2,
		marginBottom: 10,
	},
	primarytextMedian: {
		color: colors.primary,
		fontSize: 15,
		fontWeight: 'bold',
	},
	secondarytextMedian: {
		color: colors.muted,
		fontSize: 15,
		fontWeight: 'bold',
	},
	emptyView: {
		height: 20,
	},
});
