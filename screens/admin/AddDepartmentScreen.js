import {
	StyleSheet,
	Text,
	StatusBar,
	View,
	KeyboardAvoidingView,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { colors, network } from '../../constants';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressDialog from 'react-native-progress-dialog';
import CustomAlert from '../../components/CustomAlert';

const AddDepartmentScreen = ({ navigation, route }) => {
	const { authUser, dept } = route.params;
	const [isloading, setIsloading] = useState(false);
	const [department, setDepartment] = useState(dept?.name || '');
	const [error, setError] = useState('');
	const [alertType, setAlertType] = useState('error');

	const handleEdit = async (_id) => {
		try {
			setIsloading(true);
			if (!department) {
				setError('All fields are required');
				setAlertType('error');
			}

			const r = await fetch(network.serverip + '/edit-department', {
				method: 'POST',
				headers: {
					'x-auth-token': authUser.token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ _id: _id, name: department }),
				redirect: 'follow',
			});
			const res = await r.json();

			if (res.success) {
				setError(res.message);
				setAlertType('success');
				setTimeout(() => {
					navigation.goBack();
				}, 1500);
			}
		} catch (err) {
			setError(err.message || 'An error occured');
			setAlertType('error');
		} finally {
			setIsloading(false);
		}
	};

	const addDepartmentHandle = () => {
		try {
			setIsloading(true);
			if (!department) {
				setError('All fields are required');
				setAlertType('error');
			}

			fetch(network.serverip + '/department', {
				method: 'POST',
				headers: {
					'x-auth-token': authUser.token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: department,
				}),
				redirect: 'follow',
			})
				.then((res) => res.json())
				.then((result) => {
					if (result.success) {
						setError(result.message);
						setAlertType('success');
						setIsloading(false);
						setTimeout(() => {
							navigation.goBack();
						}, 1500);
					}
				});
		} catch (err) {
			setError(err.message || 'An error occured');
			setAlertType('error');
		} finally {
			setIsloading(false);
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container}>
			<StatusBar />
			<ProgressDialog visible={isloading} label='Adding . . .' />
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
				<Text style={styles.screenNameText}>
					{!!dept ? 'Edit Department' : 'Add Department'}
				</Text>
			</View>

			<CustomAlert message={error} type={alertType} />

			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, width: '100%' }}
			>
				<View style={styles.formContainer}>
					<CustomInput
						isRequired
						value={department}
						setValue={setDepartment}
						placeholder='Department Name'
						placeholderTextColor={colors.muted}
						radius={5}
					/>
				</View>
			</ScrollView>
			<View style={styles.buttomContainer}>
				<CustomButton
					text={`${!!dept ? 'Edit' : 'Add'} Department`}
					onPress={() => {
						!!dept ? handleEdit(dept._id) : addDepartmentHandle();
					}}
				/>
			</View>
		</KeyboardAvoidingView>
	);
};

export default AddDepartmentScreen;

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
