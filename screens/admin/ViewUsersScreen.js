import {
	StyleSheet,
	Text,
	StatusBar,
	View,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors, network } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../components/CustomAlert';
import CustomInput from '../../components/CustomInput';
import ProgressDialog from 'react-native-progress-dialog';
import UserList from '../../components/UserList';

const ViewUsersScreen = ({ navigation, route }) => {
	const [name, setName] = useState('');
	const { authUser } = route.params;
	const [user, setUser] = useState({});
	const [isloading, setIsloading] = useState(false);
	const [refeshing, setRefreshing] = useState(false);
	const [alertType, setAlertType] = useState('error');
	const [label, setLabel] = useState('Loading . . .');
	const [error, setError] = useState('');
	const [users, setUsers] = useState([]);
	const [foundItems, setFoundItems] = useState([]);
	const [filterItem, setFilterItem] = useState('');

	const getToken = (obj) => {
		try {
			setUser(JSON.parse(obj));
		} catch (e) {
			setUser(obj);
			return obj.token;
		}
		return JSON.parse(obj).token;
	};

	const fetchUsers = () => {
		var myHeaders = new Headers();
		myHeaders.append('x-auth-token', getToken(authUser));

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};
		setIsloading(true);
		fetch(`${network.serverip}/admin/users`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				if (result.success) {
					setUsers(result.data);
					setFoundItems(result.data);
					setError('');
				} else {
					setError(result.message);
				}
				setIsloading(false);
			})
			.catch((error) => {
				setIsloading(false);
				setError(error.message);
			});
	};

	//method call on pull refresh
	const handleOnRefresh = () => {
		setRefreshing(true);
		fetchUsers();
		setRefreshing(false);
	};

	//method to filer the orders for by title [search bar]
	const filter = () => {
		const keyword = filterItem;
		if (keyword !== '') {
			const results = (users || []).filter((user) => {
				return (user.name || '').toLowerCase().includes(keyword.toLowerCase());
			});

			setFoundItems(results);
		} else {
			setFoundItems(users);
		}
		setName(keyword);
	};

	const handleBlockUnBlockUser = async (currentUser) => {
		if (!currentUser._id) {
			// do nothing
			return;
		}

		const endpoint = currentUser.blocked
			? network.serverip + '/admin/unblock'
			: network.serverip + '/admin/block';

		try {
			setIsloading(true);
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'x-auth-token': authUser.token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: currentUser._id }),
				redirect: 'follow',
			});
			if (!res.ok) throw new Error('Something went wrong!');
			const result = await res.json();
			if (result.success) {
				setError('');
				setAlertType('success');
				setLabel('Success');
				handleOnRefresh();
			} else {
				throw new Error('Something went wrong!');
			}
		} catch (err) {
			setError(err.message || 'Internal server error');
			setAlertType('error');
		} finally {
			setIsloading(false);
		}
	};

	//filter the data whenever filteritem value change
	useEffect(() => {
		filter();
	}, [filterItem]);

	//fetch the orders on initial render
	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<View style={styles.container}>
			<ProgressDialog visible={isloading} label={label} />
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

			<View style={styles.screenNameContainer}>
				<Text style={styles.screenNameText}>Users</Text>
			</View>
			<CustomAlert message={error} type={alertType} />

			<CustomInput
				radius={5}
				ioniconName='search'
				placeholder='Search . . .'
				value={filterItem}
				setValue={setFilterItem}
				showTitle={false}
			/>

			<ScrollView
				style={{ flex: 1, width: '100%', marginTop: 10 }}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
				}
			>
				{foundItems && foundItems.length == 0 ? (
					<Text
						style={{ color: colors.dark }}
					>{`No user found with the name of ${filterItem}!`}</Text>
				) : (
					foundItems.map((item, index) => (
						<UserList
							key={index}
							user={item}
							handleBlockUnBlockUser={handleBlockUnBlockUser}
						/>
					))
				)}
			</ScrollView>
		</View>
	);
};

export default ViewUsersScreen;

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
		marginBottom: 10,
		marginLeft: 10,
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		marginBottom: 10,
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
