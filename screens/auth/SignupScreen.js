import {
	StyleSheet,
	Text,
	Image,
	StatusBar,
	View,
	KeyboardAvoidingView,
	ScrollView,
	TouchableOpacity,
	FlatList,
	Dimensions,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { colors, network } from '../../constants';
import CustomInput from '../../components/CustomInput';
import header_logo from '../../assets/logo/logo.jpg';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../components/CustomAlert';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import debounce from 'lodash.debounce';
import RBSheet from 'react-native-raw-bottom-sheet';

const SignupScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [name, setName] = useState('');
	const [department, setDepartment] = useState('');
	const [error, setError] = useState('');
	const [courses, setCourses] = useState([]);
	const [searchItems, setSearchItems] = useState([]);
	const refRBSheet = useRef();

	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	const signUpHandle = () => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (email == '') {
			return setError('Please enter your email');
		}
		if (name == '') {
			return setError('Please enter your name');
		}
		if (password == '') {
			return setError('Please enter your password');
		}
		if (!email.match(emailRegex)) {
			return setError('Email is not valid');
		}
		if (password.length < 5) {
			return setError('Password must be 6 characters long');
		}
		if (password != confirmPassword) {
			return setError('password does not match');
		}

		fetch(network.serverip + '/register', {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify({
				email,
				password,
				name,
				department,
			}),
			redirect: 'follow',
		})
			.then((response) => response.json())
			.then((result) => {
				if (result.data.email == email) {
					navigation.navigate('login');
				}
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	const getCourses = async () => {
		fetch(network.serverip + '/departments')
			.then((r) => r.json())
			.then((result) => {
				setCourses(result.data);
				setSearchItems(result.data);
			})
			.catch(console.log);
	};

	const filter = debounce((text) => {
		if (!text || text === '') {
			setSearchItems(courses);
			return;
		}

		const payload = (courses || []).filter((item) => {
			return item.name.includes(text);
		});
		setSearchItems(payload);
	}, 500);

	const handleSetDepartment = (item) => {
		setDepartment(item.name);
		refRBSheet.current.close();
	};

	useEffect(() => {
		getCourses();
	}, []);

	return (
		<InternetConnectionAlert>
			<RBSheet
				ref={refRBSheet}
				closeOnDragDown={true}
				closeOnPressMask={false}
				customStyles={{
					draggableIcon: {
						backgroundColor: colors.muted,
					},
				}}
				height={Dimensions.get('window').height * 0.7}
			>
				<View style={{ width: '103%', padding: 12 }}>
					<CustomInput
						setValue={(v) => filter(v)}
						placeholder='Search Department'
						placeholderTextColor={colors.muted}
						radius={5}
						ioniconName='search'
						showTitle={false}
					/>

					<FlatList
						style={{
							width: '100%',
							backgroundColor: colors.white,
							padding: 8,
							borderRadius: 5,
							elevation: 2,
						}}
						data={searchItems}
						renderItem={({ item }) => {
							return (
								<TouchableOpacity
									key={item._id}
									style={{ padding: 8 }}
									onPress={() => handleSetDepartment(item)}
								>
									<Text style={{ color: colors.dark }} key={item._id}>
										{item.name}
									</Text>
								</TouchableOpacity>
							);
						}}
						keyExtractor={(item) => item._id}
					/>
				</View>
			</RBSheet>

			<KeyboardAvoidingView style={styles.container}>
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

				<ScrollView style={{ width: '100%' }} nestedScrollEnabled>
					<View style={styles.welconeContainer}>
						<Image style={styles.logo} source={header_logo} />
					</View>

					<View style={styles.screenNameContainer}>
						<Text style={styles.screenNameText}>Sign up</Text>
						<View>
							<Text style={styles.screenNameParagraph}>
								Create your account on CIE-JMI to get an access all its products
							</Text>
						</View>
					</View>

					<View style={styles.formContainer}>
						<CustomAlert message={error} type='error' />
						<CustomInput
							isRequired
							ioniconName='person-outline'
							value={name}
							setValue={setName}
							placeholder='Name'
							placeholderTextColor={colors.muted}
							radius={5}
						/>
						<CustomInput
							isRequired
							ioniconName='ios-at-outline'
							value={email}
							setValue={setEmail}
							placeholder='Email'
							placeholderTextColor={colors.muted}
							radius={5}
						/>
						<CustomInput
							isRequired
							ioniconName='ios-lock-closed-outline'
							value={password}
							setValue={setPassword}
							secureTextEntry={true}
							placeholder='Password'
							placeholderTextColor={colors.muted}
							radius={5}
						/>
						<CustomInput
							isRequired
							ioniconName='ios-lock-closed-outline'
							value={confirmPassword}
							setValue={setConfirmPassword}
							secureTextEntry={true}
							placeholder='Confirm Password'
							placeholderTextColor={colors.muted}
							radius={5}
						/>

						{department && (
							<View style={{ marginVertical: 10 }}>
								<Text
									style={{
										color: colors.primary,
										fontSize: department ? 18 : 14,
									}}
								>
									{department}
								</Text>
							</View>
						)}

						<CustomButton
							text={`${department ? 'Change' : 'Choose'} Department`}
							style={{
								backgroundColor: colors.white,
								width: '103%',
								elevation: 2,
								marginTop: 6,
								marginBottom: 6,
							}}
							textStyles={{ color: colors.dark }}
							onPress={() => refRBSheet.current.open()}
						/>
					</View>
				</ScrollView>

				<View style={styles.buttomContainer}>
					<CustomButton text='Sign Up' onPress={signUpHandle} />
				</View>
				<View style={styles.bottomContainer}>
					<Text style={{ color: colors.muted }}>Already have an account? </Text>
					<Text
						onPress={() => navigation.navigate('login')}
						style={styles.signupText}
					>
						Login
					</Text>
				</View>
			</KeyboardAvoidingView>
		</InternetConnectionAlert>
	);
};

export default SignupScreen;

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
	welconeContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '15%',
	},
	formContainer: {
		flex: 2,
		justifyContent: 'flex-start',
		alignItems: 'center',
		display: 'flex',
		width: '100%',
		flexDirecion: 'row',
		padding: 5,
		gap: -5,
	},
	logo: {
		resizeMode: 'contain',
		width: 80,
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
		color: colors.muted,
	},
	inputContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'row',
		backgroundColor: colors.white,
		height: '100%',
		borderRadius: 5,
		maxHeight: 350,
		elevation: 2,
		padding: 3,
	},
});
