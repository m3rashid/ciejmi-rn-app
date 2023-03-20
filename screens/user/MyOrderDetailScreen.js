import {
	StyleSheet,
	Text,
	StatusBar,
	View,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors, network } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../components/CustomAlert';
import ProgressDialog from 'react-native-progress-dialog';
import BasicProductList from '../../components/BasicProductList';
import StepIndicator from 'react-native-step-indicator';

const MyOrderDetailScreen = ({ navigation, route }) => {
	const { orderDetail } = route.params;
	const [isloading, setIsloading] = useState(false);
	const [label, setLabel] = useState('Loading..');
	const [error, setError] = useState('');
	const [alertType, setAlertType] = useState('error');
	const [address, setAddress] = useState('');
	const [statusDisable, setStatusDisable] = useState(false);
	const labels = ['Processing', 'Shipping', 'Delivery'];
	const [trackingState, setTrackingState] = useState(1);

	const customStyles = {
		stepIndicatorSize: 25,
		currentStepIndicatorSize: 30,
		separatorStrokeWidth: 2,
		currentStepStrokeWidth: 3,
		stepStrokeCurrentColor: colors.primary,
		stepStrokeWidth: 3,
		stepStrokeFinishedColor: colors.primary,
		stepStrokeUnFinishedColor: '#aaaaaa',
		separatorFinishedColor: '#fe7013',
		separatorUnFinishedColor: '#aaaaaa',
		stepIndicatorFinishedColor: '#fe7013',
		stepIndicatorUnFinishedColor: '#ffffff',
		stepIndicatorCurrentColor: colors.white,
		stepIndicatorLabelFontSize: 13,
		currentStepIndicatorLabelFontSize: 13,
		stepIndicatorLabelCurrentColor: '#fe7013',
		stepIndicatorLabelFinishedColor: '#ffffff',
		stepIndicatorLabelUnFinishedColor: '#aaaaaa',
		labelColor: '#999999',
		labelSize: 13,
		currentStepLabelColor: '#fe7013',
	};

	//method to convert time to AM PM format
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

	//method to convert data to dd-mm-yyyy  format
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

	// set total cost, order detail, order status on initial render
	useEffect(() => {
		setError('');
		setAlertType('error');
		if (orderDetail?.status == 'DELIVERED') {
			setStatusDisable(true);
		} else {
			setStatusDisable(false);
		}
		if (orderDetail?.status === 'PENDING') {
			setTrackingState(1);
		} else if (orderDetail?.status === 'SHIPPED') {
			setTrackingState(2);
		} else {
			setTrackingState(3);
		}
	}, []);

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
			</View>

			<CustomAlert message={error} type={alertType} />
			<ScrollView
				style={styles.bodyContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.containerNameContainer}>
					<View>
						<Text style={styles.containerNameText}>Shipping Address</Text>
					</View>
				</View>
				<View style={styles.ShipingInfoContainer}>
					<Text
						style={styles.secondarytextSm}
					>{`${orderDetail?.shippingAddress?.localAddressOne}, ${orderDetail?.shippingAddress?.localAddressTwo}, ${orderDetail?.shippingAddress?.city}, ${orderDetail?.shippingAddress?.state}`}</Text>
					<Text style={styles.secondarytextSm}>
						{orderDetail?.shippingAddress?.postalCode}
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
					<View style={{ marginTop: 15, width: '100%' }}>
						<StepIndicator
							customStyles={customStyles}
							currentPosition={trackingState}
							stepCount={3}
							labels={labels}
						/>
					</View>
				</View>

				<View style={styles.containerNameContainer}>
					<View>
						<Text style={styles.containerNameText}>Package Details</Text>
					</View>
				</View>
				<View style={styles.orderItemsContainer}>
					<View style={styles.orderItemContainer}>
						<Text style={styles.orderItemText}>Package</Text>
						<Text style={{ color: colors.dark, fontWeight: 'bold' }}>
							{orderDetail?.status}
						</Text>
					</View>
					<View style={styles.orderItemContainer}>
						<Text style={styles.orderItemText}>
							Order on : {dateFormat(orderDetail?.createdAt)}
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
					</ScrollView>
					<View style={styles.orderItemContainer}>
						<Text style={styles.orderItemText}>Total</Text>
						<Text style={{ color: colors.dark }}>₹ {Number(orderDetail?.amount).toFixed(2)}</Text>
					</View>
				</View>
				<View style={styles.emptyView} />
			</ScrollView>
		</View>
	);
};

export default MyOrderDetailScreen;

const styles = StyleSheet.create({
	container: {
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 12,
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
		marginTop: 10,
		fontSize: 15,
	},
	bodyContainer: { flex: 1, width: '100%' },
	ShipingInfoContainer: {
		marginTop: 5,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: colors.white,
		padding: 10,
		borderRadius: 5,
		borderColor: colors.muted,
		elevation: 5,
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
		fontSize: 16,
		fontWeight: 'bold',
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
		elevation: 3,
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
		width: '110%',
		height: 70,
		borderTopLeftRadius: 10,
		borderTopEndRadius: 10,
		elevation: 5,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',

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
		padding: 10,
		borderRadius: 5,

		borderColor: colors.muted,
		elevation: 1,
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
