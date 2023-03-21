import React from 'react';
import {
	Text,
	View,
	Alert,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
	Image,
	Dimensions,
} from 'react-native';
import UserProfileCard from '../../components/UserProfileCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OptionList from '../../components/OptionList';
import { colors, network } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import poweredBy from '../../assets/image/poweredByExatorialWhite.jpg';

const AdminProfileScreen = ({ navigation, route }) => {
	const { authUser } = route.params;

	const logout = async () => {
		await AsyncStorage.removeItem('authUser');
		navigation.replace('login');
	};

	const handleLogout = async () => {
		return Alert.alert(
			'Logout from CIE-JMI ?',
			'Are you sure you want to logout ?',
			[{ text: 'Cancel' }, { text: 'Logout', onPress: logout }]
		);
	};

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
				<Text style={styles.screenNameText}>Admin Profile</Text>
			</View>

			<View style={styles.UserProfileCardContianer}>
				<UserProfileCard
					Icon={Ionicons}
					name={authUser?.name}
					email={authUser?.email}
				/>
			</View>

			<View style={styles.OptionsContainer}>
				<OptionList
					text='Logout'
					Icon={Ionicons}
					iconName='log-out'
					onPress={handleLogout}
					style={{ borderRadius: 5 }}
				/>
			</View>

			<View style={{ marginTop: 'auto' }}>
				<Image source={poweredBy} style={{ height: 40, resizeMode: 'contain' }} />
			</View>
		</View>
	);
};

export default AdminProfileScreen;

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
