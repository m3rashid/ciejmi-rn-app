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
import ProgressDialog from 'react-native-progress-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WishList from '../../components/WishList';

const MyWishlistScreen = ({ navigation, route }) => {
	const { user } = route.params;
	const [isloading, setIsloading] = useState(false);
	const [label, setLabel] = useState('Please wait...');
	const [refeshing, setRefreshing] = useState(false);
	const [alertType, setAlertType] = useState('error');
	const [error, setError] = useState('');
	const [wishlist, setWishlist] = useState([]);
	const [onWishlist, setOnWishlist] = useState(true);

	const handleView = (product) => {
		navigation.navigate('productdetail', { product: product });
	};

	const logout = async () => {
		await AsyncStorage.removeItem('authUser');
		navigation.replace('login');
	};

	const handleOnRefresh = () => {
		setRefreshing(true);
		fetchWishlist();
		setRefreshing(false);
	};

	const fetchWishlist = () => {
		var myHeaders = new Headers();
		myHeaders.append('x-auth-token', user.token);

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};
		setIsloading(true);
		fetch(`${network.serverip}/wishlist`, requestOptions) // API call
			.then((response) => response.json())
			.then((result) => {
				if (result?.err === 'jwt expired') {
					logout();
				}
				if (result.success) {
					setWishlist(result.data[0].wishlist);
					setError('');
				}
				setIsloading(false);
			})
			.catch((error) => {
				setIsloading(false);
				setError(error.message);
			});
	};

	const handleRemoveFromWishlist = (id) => {
		var myHeaders = new Headers();
		myHeaders.append('x-auth-token', user.token);

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};

		fetch(`${network.serverip}/remove-from-wishlist?id=${id}`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				if (result.success) {
					setError(result.message);
					setAlertType('success');
				} else {
					setError(result.message);
					setAlertType('error');
				}
				setOnWishlist(!onWishlist);
			})
			.catch((error) => {
				setError(result.message);
				setAlertType('error');
			});
	};

	useEffect(() => {
		setError('');
		fetchWishlist();
	}, []);

	useEffect(() => {
		fetchWishlist();
	}, [onWishlist]);

	return (
		<View style={styles.container}>
			<StatusBar />
			<ProgressDialog visible={isloading} label={label} />
			<View style={styles.topBarContainer}>
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
				<View />
			</View>

			<View style={styles.screenNameContainer}>
				<Text style={styles.screenNameText}>My Wishlist</Text>
			</View>

			<CustomAlert message={error} type={alertType} />
			{wishlist.length == 0 ? (
				<View style={styles.ListContiainerEmpty}>
					<Text style={styles.secondaryTextSmItalic}>
						"There are no product in wishlist yet."
					</Text>
				</View>
			) : (
				<ScrollView
					style={{ flex: 1, width: '100%', paddingVertical: 12 }}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refeshing}
							onRefresh={handleOnRefresh}
						/>
					}
				>
					{wishlist.map((item) => {
						return (
							<WishList
								image={item?.image}
								title={item?.title}
								description={item?.description}
								key={item._id}
								onPressView={() => handleView(item)}
								onPressRemove={() =>
									handleRemoveFromWishlist(item?._id)
								}
							/>
						);
					})}
					<View style={styles.emptyView} />
				</ScrollView>
			)}
		</View>
	);
};

export default MyWishlistScreen;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'flex-start',
		flex: 1,
		padding: 12,
	},
	topBarContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	toBarText: {
		fontSize: 15,
		fontWeight: '600',
	},
	screenNameContainer: {
		paddingTop: 12,
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
	bodyContainer: {
		width: '100%',
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'flex-start',
		flex: 1,
	},
	emptyView: {
		height: 20,
	},
	ListContiainerEmpty: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	secondaryTextSmItalic: {
		fontStyle: 'italic',
		fontSize: 15,
		color: colors.muted,
	},
});
