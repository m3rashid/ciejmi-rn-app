import {
	StyleSheet,
	Text,
	StatusBar,
	View,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors, network } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../components/CustomAlert';
import CustomInput from '../../components/CustomInput';
import ProgressDialog from 'react-native-progress-dialog';
import OrderList from '../../components/OrderList';

const ViewOrdersScreen = ({ navigation, route }) => {
	const { authUser } = route.params;
	const [user, setUser] = useState({});
	const [isloading, setIsloading] = useState(false);
	const [refeshing, setRefreshing] = useState(false);
	const [alertType, setAlertType] = useState('error');
	const [label, setLabel] = useState('Loading . . .');
	const [error, setError] = useState('');
	const [orders, setOrders] = useState([]);
	const [foundItems, setFoundItems] = useState([]);
	const [filterItem, setFilterItem] = useState('');

	//method to convert the authUser to json object
	const getToken = (obj) => {
		try {
			setUser(JSON.parse(obj));
		} catch (e) {
			setUser(obj);
			return obj.token;
		}
		return JSON.parse(obj).token;
	};

	//method call on pull refresh
	const handleOnRefresh = () => {
		setRefreshing(true);
		fetchOrders();
		setRefreshing(false);
	};

	//method to navigate to order detail screen of specific order
	const handleOrderDetail = (item) => {
		navigation.navigate('vieworderdetails', {
			orderDetail: item,
			Token: getToken(authUser),
		});
	};

	//method the fetch the order data from server using API call
	const fetchOrders = () => {
		var myHeaders = new Headers();
		myHeaders.append('x-auth-token', getToken(authUser));

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};
		setIsloading(true);
		fetch(`${network.serverip}/admin/orders`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				if (result.success) {
					setOrders(result.data);
					setFoundItems(result.data);
					setError('');
				} else {
					setError(result.message);
				}
				setIsloading(false);
			})
			.catch((error) => {
				setIsloading(false);
				setError(error.message);
			});
	};

	//method to filer the orders for by title [search bar]
	const filter = () => {
		const keyword = filterItem;
		if (keyword !== '') {
			const results = orders?.filter((item) => {
				return item?.orderId.toLowerCase().includes(keyword.toLowerCase());
			});
			setFoundItems(results);
		} else {
			setFoundItems(orders);
		}
	};
	useEffect(() => {
		filter();
	}, [filterItem]);

	useEffect(() => {
		fetchOrders();
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
						color={colors.primary}
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.screenNameContainer}>
				<Text style={styles.screenNameText}>Orders</Text>
			</View>
			<CustomAlert message={error} type={alertType} />
			<CustomInput
				radius={5}
				ioniconName='search'
				placeholder='Search . . .'
				value={filterItem}
				setValue={setFilterItem}
				showTitle={false}
			/>
			<ScrollView
				style={{ flex: 1, width: '100%', padding: 2 }}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
				}
			>
				{foundItems && foundItems.length == 0 ? (
					<Text>{`No order found with the order ${filterItem}!`}</Text>
				) : (
					foundItems.map((order, index) => {
						return (
							<OrderList
								item={order}
								key={index}
								onPress={() => handleOrderDetail(order)}
							/>
						);
					})
				)}
			</ScrollView>
		</View>
	);
};

export default ViewOrdersScreen;

const styles = StyleSheet.create({
	container: {
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 12,
		flex: 1,
	},
	TopBarContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	formContainer: {
		flex: 2,
		justifyContent: 'flex-start',
		alignItems: 'center',
		display: 'flex',
		width: '100%',
		flexDirecion: 'row',
		padding: 5,
	},

	buttomContainer: {
		width: '100%',
	},
	bottomContainer: {
		marginTop: 10,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
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
});
