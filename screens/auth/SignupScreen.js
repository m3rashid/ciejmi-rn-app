import {
	StyleSheet,
	Text,
	Image,
	StatusBar,
	View,
	KeyboardAvoidingView,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, network } from '../../constants';
import CustomInput from '../../components/CustomInput';
import header_logo from '../../assets/logo/logo.png';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../components/CustomAlert';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import SearchableDropDown from 'react-native-searchable-dropdown';
import {
	doctoralProgrammes,
	mastersProgrammes,
	postgraduateDiplomaProgrammes,
	undergraduateProgrammes,
	advancedDiplomaProgrammes,
	diplomaProgrammes,
} from 'jamia-all-courses';
import DropDownPicker from 'react-native-dropdown-picker';

const SignupScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [name, setName] = useState('');
	const [department, setDepartment] = useState('');
	const [error, setError] = useState('');
	const [programmeOpen, setProgramOpen] = useState(false);
	const [courseOpen, setCourseOpen] = useState(false);

	var myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	//method to post the user data to server for user signup using API call
	const signUpHandle = () => {
		if (email == '') {
			return setError('Please enter your email');
		}
		if (name == '') {
			return setError('Please enter your name');
		}
		if (password == '') {
			return setError('Please enter your password');
		}
		if (!email.includes('@')) {
			return setError('Email is not valid');
		}
		if (email.length < 6) {
			return setError('Email is too short');
		}
		if (password.length < 5) {
			return setError('Password must be 6 characters long');
		}
		if (password != confirmPassword) {
			return setError('password does not match');
		}

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify({
				email,
				password,
				name,
				department,
			}),
			redirect: 'follow',
		};

		fetch(network.serverip + '/register', requestOptions) // API call
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

	const programmes = [
		{ label: 'Doctoral', value: 'doctoral' },
		{ label: 'Masters', value: 'masters' },
		{ label: 'PG Diploma', value: 'postGraduateDiploma' },
		{ label: 'Undergraduate', value: 'undergraduate' },
		{ label: 'Advanced Diploma', value: 'advancedDiploma' },
		{ label: 'Diploma', value: 'diploma' },
	];

	const [programme, setProgramme] = useState('doctoral');
	const [courses, setCourses] = useState([]);

	const getCourses = (programme) => {
		let courses = [];
		switch (programme) {
			case 'doctoral': {
				courses = doctoralProgrammes;
				break;
			}
			case 'masters': {
				courses = mastersProgrammes;
				break;
			}
			case 'postGraduateDiploma': {
				courses = postgraduateDiplomaProgrammes;
				break;
			}
			case 'undergraduate': {
				courses = undergraduateProgrammes;
				break;
			}
			case 'advancedDiploma': {
				courses = advancedDiplomaProgrammes;
				break;
			}
			case 'diploma': {
				courses = diplomaProgrammes;
				beak;
			}
		}

		if (!courses || courses.length == 0) {
			return;
		}

		const actualCourses = courses.courses.reduce((acc, c) => {
			return [
				...acc,
				...c.specializations.map((sp) => ({
					label: `${courses.name} in ${sp.name}`,
					value: `${courses.name} in ${sp.name}`,
				})),
			];
		}, []);
		setCourses(actualCourses);
	};

	useEffect(() => {
		getCourses(programme);
	}, [programme]);

	return (
		<InternetConnectionAlert>
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
				<ScrollView style={{ flex: 1, width: '100%' }} nestedScrollEnabled>
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
						<CustomAlert message={error} type={'error'} />
						<CustomInput
							ioniconName='person-outline'
							value={name}
							setValue={setName}
							placeholder='Name'
							placeholderTextColor={colors.muted}
							radius={5}
						/>
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
						<CustomInput
							ioniconName='ios-lock-closed-outline'
							value={confirmPassword}
							setValue={setConfirmPassword}
							secureTextEntry={true}
							placeholder='Confirm Password'
							placeholderTextColor={colors.muted}
							radius={5}
						/>

						<View style={{ marginTop: 15, width: '103%', zIndex: 0 }}>
							<Text style={{ color: colors.primary, marginBottom: 5 }}>Programme Name</Text>

							<DropDownPicker
								style={{ borderColor: colors.white, elevation: 5 }}
								open={programmeOpen}
								value={programme}
								items={programmes}
								setOpen={setProgramOpen}
								placeholderStyle={{ color: colors.muted }}
								setValue={setProgramme}
								placeholder='Select Programme'
								labelStyle={{ color: colors.muted }}
								containerStyle={{
									borderColor: colors.white,
								}}
								dropDownContainerStyle={{
									borderColor: colors.white,
								}}
							/>
						</View>

						<View style={{ marginTop: 15, width: '103%', ...(programmeOpen ? { display: 'none' } : {}) }}>
							<Text style={{ color: colors.primary, marginBottom: 5 }}>Course Name</Text>

							<DropDownPicker
								style={{ borderColor: colors.white, elevation: 5 }}
								open={courseOpen}
								value={department}
								items={courses}
								placeholder='Select Course'
								placeholderStyle={{ color: colors.muted }}
								setOpen={setCourseOpen}
								setValue={setDepartment}
								labelStyle={{ color: colors.muted }}
								containerStyle={{
									borderColor: colors.white,
								}}
								dropDownContainerStyle={{
									borderColor: colors.white,
									zIndex: 1000
								}}
								onChangeValue={(value) => {
									setDepartment(value);
								}}
							/>
						</View>
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
});
