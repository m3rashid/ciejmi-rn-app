import {
	StyleSheet,
	Text,
	StatusBar,
	View,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
	Alert,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { colors, network } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressDialog from 'react-native-progress-dialog';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomAlert from '../../components/CustomAlert';
import CustomInput from '../../components/CustomInput/';
import DepartmentList from '../../components/DepartmentList';
import debounce from 'lodash.debounce';

const ViewDepartmentScreen = ({ navigation, route }) => {
	const { authUser } = route.params;
	const [isloading, setIsloading] = useState(false);
	const [alertType, setAlertType] = useState('error');
	const [error, setError] = useState('');
	const [departments, setDepartments] = useState([]);
	const [foundItems, setFoundItems] = useState([]);

	const handleDelete = (_id) => {
		if (!_id) return;
		try {
			setIsloading(true);
			fetch(`${network.serverip}/delete-department`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-auth-token': authUser.token,
				},
				body: JSON.stringify({ _id }),
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.success) {
						setError(res.message);
						setAlertType('success');
						setIsloading(false);
					}
				});
		} catch (error) {
			setError(error.message || 'An error occured');
			setAlertType('error');
		} finally {
			setIsloading(false);
		}
	};

	const getDepartments = async () => {
		try {
			setIsloading(true);
			const result = await fetch(`${network.serverip}/departments`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'x-auth-token': authUser.token,
				},
			});
			const res = await result.json();
			if (res.success) {
				setDepartments(res.data);
				return res.data;
			}
		} catch (error) {
			setError(error.message || 'An error occured');
			setAlertType('error');
		} finally {
			setIsloading(false);
		}
	};

	const handleOnRefresh = () => {
		getDepartments();
	};

	const filter = useCallback(debounce(() => {
		if (!departments || departments.length == 0) {
			getDepartments().then((data) => {
				if (!data) return;
				setFoundItems(data);
			});
			return;
		}
		if (filterItem !== '') {
			const results = departments?.filter((dept) => {
				return dept?.name.toLowerCase().includes(filterItem.toLowerCase());
			});
			setFoundItems(results);
		} else {
			setFoundItems(departments);
		}
	}, 500))

	useEffect(() => {
		getDepartments().then((data) => {
			if (!data) return;
			setFoundItems(data);
		});
	}, []);

	const showConfirmDialog = (id) => {
		return Alert.alert(
			'Are your sure?',
			'Are you sure you want to delete the department ?',
			[{ text: 'Yes', onPress: () => handleDelete(id) }, { text: 'No' }]
		);
	};

	return (
		<View style={styles.container}>
			<ProgressDialog visible={isloading} label='Loading . . .' />
			<StatusBar />
			<View style={styles.TopBarContainer}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Ionicons
						name='arrow-back-circle-outline'
						size={30}
						color={colors.primary}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('addDepartment', {
							authUser: authUser,
							dept: null,
							editFn: null,
						});
					}}
				>
					<AntDesign name='plussquare' size={30} color={colors.primary} />
				</TouchableOpacity>
			</View>

			<View style={styles.screenNameContainer}>
				<Text style={styles.screenNameText}>Departments</Text>
			</View>
			<CustomAlert message={error} type={alertType} />

			<CustomInput
				radius={5}
				ioniconName='search'
				placeholder='Search . . .'
				// value={filterItem}
				setValue={(v) => filter(v)}
				showTitle={false}
			/>

			<ScrollView
				style={{ flex: 1, width: '100%', marginTop: 10 }}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={isloading} onRefresh={handleOnRefresh} />
				}
			>
				{!foundItems || foundItems.length === 0 ? (
					<Text style={{ color: colors.dark }}>{`No departments found !`}</Text>
				) : (
					foundItems.map((dept) => {
						return (
							<DepartmentList
								key={dept._id}
								department={dept.name}
								authUser={authUser}
								id={dept._id}
								onDelete={() => showConfirmDialog(dept._id)}
							/>
						);
					})
				)}
			</ScrollView>
		</View>
	);
};

export default ViewDepartmentScreen;

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
