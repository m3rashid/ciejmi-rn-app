import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	TouchableOpacity,
	Alert,
	Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import UserProfileCard from '../../components/UserProfileCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OptionList from '../../components/OptionList';
import { colors } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import poweredBy from '../../assets/image/poweredByExatorialWhite.jpg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const UserProfileScreen = ({ navigation, route }) => {
	const [userInfo, setUserInfo] = useState({});
	const { user } = route.params;
	const userID = user?._id;

	const handleLogout = async () => {
		return Alert.alert(
			'Logout from CIE-JMI ?',
			'Are you sure you want to logout ?',
			[
				{
					text: 'Cancel',
				},
				{
					text: 'Logout',
					onPress: async () => {
						await AsyncStorage.removeItem('authUser');
						navigation.replace('login');
					},
				},
			]
		);
	};

	const handleMyAddresses = () => { };

	const convertToJSON = (obj) => {
		try {
			setUserInfo(JSON.parse(obj));
		} catch (e) {
			setUserInfo(obj);
		}
	};

	const DeleteAccontHandle = (userID) => {
		let fetchURL = network.serverip + '/delete-user?id=' + String(userID);
		fetch(fetchURL, {
			method: 'GET',
			redirect: 'follow',
		})
			.then((response) => response.json())
			.then((result) => {
				if (result.success == true) {
					AsyncStorage.removeItem('authUser').then(() => {
						navigation.navigate('login');
					});
				} else {
					setError(result.message);
				}
			})
			.catch(console.log);
	};

	const showConfirmDialog = (id) => {
		return Alert.alert(
			'Are your sure?',
			'Are you sure you want to remove your account?',
			[
				{
					text: 'Yes',
					onPress: () => {
						setShowBox(false);
						DeleteAccontHandle(id);
					},
				},
				{
					text: 'No',
					onPress: () => { },
				},
			]
		);
	};

	useEffect(() => {
		convertToJSON(user);
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar style='auto' />
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
				<Text style={styles.screenNameText}>Profile</Text>
			</View>

			<View style={styles.UserProfileCardContianer}>
				<UserProfileCard
					Icon={Ionicons}
					name={userInfo?.name}
					email={userInfo?.email}
				/>
			</View>

			<View style={styles.OptionsContainer}>
				<OptionList
					text='My Addresses'
					Icon={Ionicons}
					iconName='md-navigate-circle-outline'
					onPress={() => navigation.navigate('myaddress', { user: userInfo, number: Math.random() })}
					style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
				/>
				<OptionList
					text='Wishlist'
					Icon={Ionicons}
					iconName='heart'
					onPress={() => navigation.navigate('mywishlist', { user: userInfo })}
				/>
				<OptionList
					text='Delete My Account'
					Icon={MaterialIcons}
					iconName='delete'
					type='danger'
					onPress={() => showConfirmDialog(userID)}
				/>
				<OptionList
					text='Change Password'
					Icon={Ionicons}
					iconName='key-sharp'
					onPress={() =>
						navigation.navigate('updatepassword', { userID: userID })
					}
				/>
				<OptionList
					text='Logout'
					Icon={Ionicons}
					iconName='log-out'
					onPress={handleLogout}
					style={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}
				/>
			</View>

			<View style={{ marginTop: 'auto' }}>
				<Image
					source={poweredBy}
					style={{ height: 35, resizeMode: 'contain' }}
				/>
			</View>
		</View>
	);
};

export default UserProfileScreen;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'flex-start',
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
	UserProfileCardContianer: {
		width: '100%',
		height: '25%',
	},
	screenNameContainer: {
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 10,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginBottom: 15,
	},
	screenNameText: {
		fontSize: 20,
		fontWeight: '800',
		color: colors.muted,
		paddingLeft: 3,
	},
	OptionsContainer: {
		width: '100%',
	},
});
