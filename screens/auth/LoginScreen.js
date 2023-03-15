import {
	StyleSheet,
	Image,
	Text,
	View,
	StatusBar,
	KeyboardAvoidingView,
	ScrollView,
} from 'react-native';

import React, { useState } from 'react';
import { colors, network } from '../../constants';
import CustomInput from '../../components/CustomInput';
import header_logo from '../../assets/logo/logo.png';
import CustomButton from '../../components/CustomButton';
import CustomAlert from '../../components/CustomAlert';
import ProgressDialog from 'react-native-progress-dialog';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isloading, setIsloading] = useState(false);

	//method to store the authUser to aync storage
	_storeData = async (user) => {
		try {
			AsyncStorage.setItem('authUser', JSON.stringify(user));
		} catch (error) {
			setError(error);
		}
	};

	var myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	var raw = JSON.stringify({
		email: email,
		password: password,
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	};

	//method to validate the user credentials and navigate to Home Screen / Dashboard
	const loginHandle = () => {
		setIsloading(true);

		if (email == '') {
			setIsloading(false);
			return setError('Please enter your email');
		}
		if (password == '') {
			setIsloading(false);
			return setError('Please enter your password');
		}
		if (!email.includes('@')) {
			setIsloading(false);
			return setError('Email is not valid');
		}
		if (email.length < 6) {
			setIsloading(false);
			return setError('Email is too short');
		}

		fetch(network.serverip + '/login', requestOptions) // API call
			.then((response) => response.json())
			.then((result) => {
				if (
					result.status == 200 ||
					(result.status == 1 && result.success != false)
				) {
					if (result?.data?.authType == 'ADMIN') {
						//check the user type if the type is ADMIN then navigate to Dashboard else navigate to User Home
						_storeData(result.data);
						setIsloading(false);
						navigation.replace('dashboard', { authUser: result.data }); // naviagte to Admin Dashboard
					} else {
						_storeData(result.data);
						setIsloading(false);
						navigation.replace('tab', { user: result.data }); // naviagte to User Dashboard
					}
				} else {
					setIsloading(false);
					return setError(result.message);
				}
			})
			.catch((error) => {
				setIsloading(false);
			});
	};

	return (
		<InternetConnectionAlert>
			<KeyboardAvoidingView style={styles.container}>
				<ScrollView style={{ flex: 1, width: '100%' }}>
					<ProgressDialog visible={isloading} label={'Login ...'} />
					<StatusBar />
					<View style={styles.welconeContainer}>
						<View>
							<Text style={styles.welcomeText}>Welcome to CIE-JMI</Text>
						</View>

						<View>
							<Image style={styles.logo} source={header_logo} />
						</View>
					</View>
					<View style={styles.screenNameContainer}>
						<Text style={styles.screenNameText}>Login</Text>
					</View>
					<View style={styles.formContainer}>
						<CustomAlert message={error} type={'error'} />
						<CustomInput
							ioniconName='ios-at-outline'
							value={email}
							setValue={setEmail}
							placeholder='Email'
							placeholderTextColor={colors.muted}
							radius={5}
						/>
						<CustomInput
							ioniconName='ios-lock-closed-outline'
							value={password}
							setValue={setPassword}
							secureTextEntry={true}
							placeholder='Password'
							placeholderTextColor={colors.muted}
							radius={5}
						/>
						<View style={styles.forgetPasswordContainer}>
							<Text
								onPress={() => navigation.navigate('forgetpassword')}
								style={styles.ForgetText}
							>
								Forgot Password ?
							</Text>
						</View>
					</View>
				</ScrollView>
				<View style={styles.buttomContainer}>
					<CustomButton text='Login' onPress={loginHandle} />
				</View>
				<View style={styles.bottomContainer}>
					<Text style={{ color: colors.dark }}>Don't have an account ? </Text>
					<Text
						onPress={() => navigation.navigate('signup')}
						style={styles.signupText}
					>
						Signup
					</Text>
				</View>
			</KeyboardAvoidingView>
		</InternetConnectionAlert>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 12,
		flex: 1,
	},
	welconeContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		height: '30%',
	},
	formContainer: {
		flex: 3,
		justifyContent: 'flex-start',
		alignItems: 'center',
		display: 'flex',
		width: '100%',
		flexDirecion: 'row',
		padding: 5,
	},
	logo: {
		resizeMode: 'contain',
		width: 80,
	},
	welcomeText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: colors.muted,
	},
	welcomeParagraph: {
		fontSize: 15,
		fontWeight: '500',
		color: colors.primary_shadow,
	},
	forgetPasswordContainer: {
		marginTop: 10,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	ForgetText: {
		fontSize: 15,
		fontWeight: '600',
		color: colors.dark,
	},
	buttomContainer: {
		display: 'flex',
		justifyContent: 'center',
		width: '100%',
	},
	bottomContainer: {
		marginTop: 10,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	signupText: {
		marginLeft: 2,
		color: colors.primary,
		fontSize: 15,
		fontWeight: '600',
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
	},
	screenNameText: {
		fontSize: 25,
		fontWeight: '800',
		color: colors.muted,
	},
});
