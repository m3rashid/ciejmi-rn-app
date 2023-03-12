import {
	StyleSheet,
	Text,
	StatusBar,
	View,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
} from 'react-native';
import React, { useEffect, useState, } from 'react';
import { colors, network } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomAlert from '../../components/CustomAlert/CustomAlert';
import ProgressDialog from 'react-native-progress-dialog';
import OrderList from '../../components/OrderList/OrderList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddresssList from '../../components/addressList';

const defaultDemoAddresses = [
	{
		localAddressOne: "aksjdhfasds faksjdf asdfk",
		localAddressTwo: "ksdjf asdkfjhsdk fasd",
		city: "okhla",
		state: "delhi",
		postalCode: "110025",
	},
	{
		localAddressOne: "aksjdhfasds faksjdf asdfk",
		localAddressTwo: "ksdjf asdkfjhsdk fasd",
		city: "okhla",
		state: "delhi",
		postalCode: "110025",
	},
	{
		localAddressOne: "aksjdhfasds faksjdf asdfk",
		localAddressTwo: "ksdjf asdkfjhsdk fasd",
		city: "okhla",
		state: "delhi",
		postalCode: "110025",
	}
]

const MyAddressScreen = ({ navigation, route }) => {
	const { user } = route.params;
	const [isloading, setIsloading] = useState(false);
	const [label, setLabel] = useState('Please wait...');
	const [error, setError] = useState('');
	const [refeshing, setRefreshing] = useState(false);
	const [alertType, setAlertType] = useState('error');
	const [addresses, setAddresses] = useState([])

	const fetchAddresses = async () => {
		setAddresses(defaultDemoAddresses)
	}

	useEffect(() => {
		fetchAddresses().then().catch(console.log)
	}, [])

	const handleOnRefresh = () => {
		setRefreshing(true);
		fetchAddresses();
		setRefreshing(false);
	};

	const handleAddAddress = () => { }

	const logout = async () => {
		await AsyncStorage.removeItem('authUser');
		navigation.replace('login');
	};

	return (
		<View style={styles.container}>
			<StatusBar />
			<ProgressDialog visible={isloading} label={label} />
			<View style={styles.topBarContainer}>
				<TouchableOpacity
					onPress={() => {
						navigation.goBack();
					}}>
					<Ionicons
						name="arrow-back-circle-outline"
						size={30}
						color={colors.muted}
					/>
				</TouchableOpacity>
				<View />
				<TouchableOpacity onPress={handleAddAddress}>
					<AntDesign name="plussquare" size={30} color={colors.primary} />
				</TouchableOpacity>
			</View>

			<View style={styles.screenNameContainer}>
				<Text style={styles.screenNameText}>My Addresses</Text>
			</View>

			<CustomAlert message={error} type={alertType} />
			{addresses.length == 0 ? (
				<View style={styles.ListContiainerEmpty}>
					<Text style={styles.secondaryTextSmItalic}>
						"There are no addresses added yet."
					</Text>
				</View>
			) : (
				<ScrollView
					style={{ flex: 1, width: '100%', padding: 12 }}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refeshing}
							onRefresh={handleOnRefresh}
						/>
					}>
					{addresses.map((address, index) => {
						return (
							<AddresssList
								address={address}
								index={index}
								key={index}
							/>
						)
					})}
					<View style={styles.emptyView} />
				</ScrollView>
			)}
		</View>
	)
}

export default MyAddressScreen

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
		padding: 20,
	},
	toBarText: {
		fontSize: 15,
		fontWeight: '600',
	},
	screenNameContainer: {
		padding: 12,
		marginBottom: 10,
		marginLeft: 10,
		paddingTop: 0,
		paddingBottom: 0,
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
	bodyContainer: {
		width: '100%',
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'flex-start',
		flex: 1,
	},
	emptyView: {
		height: 20,
	},
	ListContiainerEmpty: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	secondaryTextSmItalic: {
		fontStyle: 'italic',
		fontSize: 15,
		color: colors.muted,
	},
});
