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
import React, { useState, useEffect } from 'react';
import { colors, network } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProductList from '../../components/ProductList';
import CustomAlert from '../../components/CustomAlert';
import CustomInput from '../../components/CustomInput/';
import ProgressDialog from 'react-native-progress-dialog';

const ViewProductScreen = ({ navigation, route }) => {
	const { authUser } = route.params;
	const [isloading, setIsloading] = useState(false);
	const [refeshing, setRefreshing] = useState(false);
	const [alertType, setAlertType] = useState('error');

	const [label, setLabel] = useState('Loading . . .');
	const [error, setError] = useState('');
	const [products, setProducts] = useState([]);
	const [foundItems, setFoundItems] = useState([]);
	const [filterItem, setFilterItem] = useState('');

	var myHeaders = new Headers();
	myHeaders.append('x-auth-token', authUser.token);

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow',
	};

	var ProductListRequestOptions = {
		method: 'GET',
		redirect: 'follow',
	};

	//method call on pull refresh
	const handleOnRefresh = () => {
		setRefreshing(true);
		fetchProduct();
		setRefreshing(false);
	};

	//method to delete the specific order
	const handleDelete = (id) => {
		setIsloading(true);
		fetch(`${network.serverip}/delete-product?id=${id}`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				if (result.success) {
					fetchProduct();
					setError(result.message);
					setAlertType('success');
				} else {
					setError(result.message);
					setAlertType('error');
				}
				setIsloading(false);
			})
			.catch((error) => {
				setIsloading(false);
				setError(error.message);
			});
	};

	//method for alert
	const showConfirmDialog = (id) => {
		return Alert.alert(
			'Are your sure?',
			'Are you sure you want to delete the category?',
			[
				{
					text: 'Yes',
					onPress: () => {
						handleDelete(id);
					},
				},
				{
					text: 'No',
				},
			]
		);
	};

	//method the fetch the product data from server using API call
	const fetchProduct = () => {
		setIsloading(true);
		fetch(`${network.serverip}/products`, ProductListRequestOptions)
			.then((response) => response.json())
			.then((result) => {
				if (result.success) {
					setProducts(result.data);
					setFoundItems(result.data);
					setError('');
					setIsloading(false);
				} else {
					setError(result.message);
					setIsloading(false);
				}
			})
			.catch((error) => {
				setError(error.message);
				setIsloading(false);
			});
	};

	//method to filer the orders for by title [search bar]
	const filter = () => {
		const keyword = filterItem;
		if (keyword !== '') {
			const results = products?.filter((product) => {
				return product?.title.toLowerCase().includes(keyword.toLowerCase());
			});
			setFoundItems(results);
		} else {
			setFoundItems(products);
		}
	};

	useEffect(() => {
		filter();
	}, [filterItem]);

	useEffect(() => {
		fetchProduct();
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
						color={colors.primary}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('addproduct', { authUser: authUser });
					}}
				>
					<AntDesign name='plussquare' size={30} color={colors.primary} />
				</TouchableOpacity>
			</View>

			<View style={styles.screenNameContainer}>
				<Text style={styles.screenNameText}>Products</Text>
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
				style={{ flex: 1, width: '100%' }}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
				}
			>
				{foundItems && foundItems.length == 0 ? (
					<Text>{`No product found with the name of ${filterItem}!`}</Text>
				) : (
					foundItems.map((product, index) => {
						return (
							<ProductList
								key={index}
								image={product?.image}
								title={product?.title}
								category={product?.category?.title}
								price={product?.price}
								qantity={product?.sku}
								onPressView={() => { }}
								onPressEdit={() => {
									navigation.navigate('editproduct', {
										product: product,
										authUser: authUser,
									});
								}}
								onPressDelete={() => {
									showConfirmDialog(product._id);
								}}
							/>
						);
					})
				)}
			</ScrollView>
		</View>
	);
};

export default ViewProductScreen;

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
