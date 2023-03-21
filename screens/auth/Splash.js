import { StyleSheet, Image, View, Text, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { colors } from '../../constants';
import logo from '../../assets/logo/logo_white.jpg';
import poweredBy from '../../assets/image/poweredByExatorial.jpg';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({ navigation }) => {
	//method to fetch the authUser data from aync storage if there is any and login the Dashboard or Home Screen according to the user type
	_retrieveData = async () => {
		try {
			const value = await AsyncStorage.getItem('authUser');
			if (value !== null) {
				let user = JSON.parse(value); // covert the authUser value to json
				if (user.authType === 'ADMIN') {
					setTimeout(() => {
						navigation.replace('dashboard', { authUser: JSON.parse(value) }); // navigate to Admin dashboard
					}, 2000);
				} else {
					setTimeout(() => {
						navigation.replace('tab', { user: JSON.parse(value) }); // navigate to User Home screen
					}, 2000);
				}
			} else {
				setTimeout(() => {
					navigation.replace('login'); // // navigate to login screen if there is no authUser store in aysnc storage
				}, 2000);
			}
		} catch (error) { }
	};

	// check the authUser and navigate to screens accordingly on initial render
	useEffect(() => {
		_retrieveData();
	}, []);

	return (
		<View style={styles.container}>
			<View
				style={{
					height: Dimensions.get('window').height - 100,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Image style={styles.logo} source={logo} />
			</View>

			<Image source={poweredBy} style={{ height: 40, resizeMode: 'contain' }} />
		</View>
	);
};

export default Splash;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		resizeMode: 'contain',
		width: 80,
		height: 80,
	},
});
