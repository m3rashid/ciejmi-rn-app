import { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	StatusBar,
	View,
	KeyboardAvoidingView,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import { network } from '../../constants';
import ProgressDialog from "react-native-progress-dialog"
import Ionicons from "react-native-vector-icons/Ionicons"
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddAdressScreen = ({ navigation, route }) => {
	const [isloading, setIsloading] = useState(false);
	const [localAddressOne, setLocalAddressOne] = useState('')
	const [localAddressTwo, setLocalAddressTwo] = useState('')
	const [city, setCity] = useState('')
	const [state, setState] = useState('')
	const [postalCode, setPostalCode] = useState('')
	const [error, setError] = useState('');
	const [authUser, setAuthUser] = useState(null);

	useEffect(() => {
		//fetch the authUser from async storage
		const fetchUser = async () => {
			const value = await AsyncStorage.getItem('authUser');
			let user = JSON.parse(value);
			setAuthUser(user);
		};
		fetchUser();
	}, [])

	const addAddresshandle = async () => {
		setIsloading(true);
		if (!localAddressOne || !city || !state || !postalCode) {
			setError("Insufficient data")
			return
		}
		try {
			fetch(network.serverip + '/add-address', {
				method: 'POST',
				headers: {
					'x-auth-token': authUser.token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					localAddressOne,
					localAddressTwo,
					city,
					state,
					postalCode
				}),
				redirect: 'follow'
			}).then((response) => response.json()).then((result) => {
				if (result.success) {
					navigation.goBack()
				} else {
					setError(result.message || "Something went wrong")
				}
			}).catch((error) => {
				setError(error.message || "Something went wrong")
			}).finally(() => {
				setIsloading(false)
			})
		} catch (err) { }
	}

	return (
		<KeyboardAvoidingView style={styles.container}>
			<StatusBar />
			<ProgressDialog visible={isloading} label='Adding . . .' />

			<View style={styles.TopBarContainer}>
				<TouchableOpacity
					onPress={() => { navigation.goBack() }}>
					<Ionicons
						name="arrow-back-circle-outline"
						size={30}
						color={colors.muted}
					/>
				</TouchableOpacity>
			</View>

			<View style={styles.screenNameContainer}>
				<Text style={styles.screenNameText}>Add Address</Text>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, width: '100%' }}>
				<View style={styles.formContainer}>
					<CustomInput
						value={localAddressOne}
						setValue={setLocalAddressOne}
						ioniconName='location'
						placeholder='Address Line One'
						placeholderTextColor={colors.muted}
						radius={5}
					/>
					<CustomInput
						value={localAddressTwo}
						setValue={setLocalAddressTwo}
						ioniconName='location'
						placeholder='Address Line Two'
						placeholderTextColor={colors.muted}
						radius={5}
					/>
					<CustomInput
						value={city}
						setValue={setCity}
						ioniconName='location'
						placeholder='City'
						placeholderTextColor={colors.muted}
						radius={5}
					/>
					<CustomInput
						value={state}
						setValue={setState}
						ioniconName='location'
						placeholder='State'
						placeholderTextColor={colors.muted}
						radius={5}
					/>
					<CustomInput
						value={postalCode}
						setValue={setPostalCode}
						ioniconName='location'
						keyboardType='number-pad'
						placeholder='Enter your 6 digit Postal Code'
						placeholderTextColor={colors.muted}
						radius={5}
					/>
				</View>
			</ScrollView>
			<View style={styles.buttomContainer}>
				<CustomButton text='Add Address' onPress={addAddresshandle} />
			</View>

		</KeyboardAvoidingView>
	)
}

export default AddAdressScreen

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
		justifyContent: 'flex-start',
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
		marginTop: 10,
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
	imageContainer: {
		display: 'flex',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		width: '100%',
		height: 250,
		backgroundColor: colors.white,
		borderRadius: 10,
		elevation: 5,
		paddingLeft: 20,
		paddingRight: 20,
	},
	imageHolder: {
		height: 200,
		width: 200,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.light,
		borderRadius: 10,
		elevation: 5,
	},
});
