import {
	StyleSheet,
	Image,
	TouchableOpacity,
	View,
	StatusBar,
	Text,
	FlatList,
	RefreshControl,
	Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import cartIcon from '../../assets/icons/cart_beg.jpg';
import { colors, network } from '../../constants';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreaters from '../../states/actionCreaters/actionCreaters';
import CustomIconButton from '../../components/CustomIconButton';
import ProductCard from '../../components/ProductCard';
import CustomInput from '../../components/CustomInput';
import Empty from '../../components/empty';

const CategoriesScreen = ({ navigation, route }) => {
	const { categoryID } = route.params;
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [refeshing, setRefreshing] = useState(false);
	const [error, setError] = useState('');
	const [foundItems, setFoundItems] = useState([]);
	const [filterItem, setFilterItem] = useState('');
	const windowWidth = Dimensions.get('window').width;
	const cartproduct = useSelector((state) => state.product);
	const dispatch = useDispatch();

	const { addCartItem } = bindActionCreators(actionCreaters, dispatch);
	const handleProductPress = (product) => {
		navigation.navigate('productdetail', { product: product });
	};

	const handleAddToCat = (product) => {
		addCartItem(product);
	};

	const handleOnRefresh = () => {
		setRefreshing(true);
		fetchProduct();
		setRefreshing(false);
	};

	const [selectedTab, setSelectedTab] = useState(categories[0]);

	const fetchProduct = () => {
		var headerOptions = {
			method: 'GET',
			redirect: 'follow',
		};
		fetch(`${network.serverip}/products`, headerOptions)
			.then((response) => response.json())
			.then((result) => {
				if (result.success) {
					setProducts(result.data);
					setFoundItems(result.data);
					setError('');
				} else {
					setError(result.message);
				}
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	const getCategories = () => {
		fetch(`${network.serverip}/categories`, {
			method: 'GET',
			redirect: 'follow',
		})
			.then((response) => response.json())
			.then((result) => {
				if (result.success) {
					setCategories(result.categories);
					setError('');
				} else {
					setError(result.message);
				}
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	navigation.addListener('focus', () => {
		if (categoryID) {
			setSelectedTab(categoryID);
		}
	});

	const filter = () => {
		if (filterItem !== '') {
			const results = (products || []).filter((product) => {
				return (product?.title || '')
					.toLowerCase()
					.includes(filterItem.toLowerCase());
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
		getCategories();
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar />
			<View style={styles.topBarContainer}>
				<TouchableOpacity
					onPress={() => {
						navigation.jumpTo('home');
					}}
				>
					<Ionicons
						name='arrow-back-circle-outline'
						size={30}
						color={colors.muted}
					/>
				</TouchableOpacity>

				<View />
				<TouchableOpacity
					style={styles.cartIconContainer}
					onPress={() => navigation.navigate('cart')}
				>
					{cartproduct?.length > 0 ? (
						<View style={styles.cartItemCountContainer}>
							<Text style={styles.cartItemCountText}>{cartproduct.length}</Text>
						</View>
					) : (
						<></>
					)}
					<Image source={cartIcon} />
				</TouchableOpacity>
			</View>
			<View style={styles.bodyContainer}>
				<View
					style={{
						padding: 0,
						paddingLeft: 12,
						paddingRight: 12,
						marginBottom: 10,
					}}
				>
					<CustomInput
						radius={5}
						ioniconName='search'
						placeholder='Search . . .'
						value={filterItem}
						setValue={setFilterItem}
						showTitle={false}
					/>
				</View>

				<FlatList
					data={categories}
					keyExtractor={(index, item) => `${index}-${item}`}
					horizontal
					style={{ flexGrow: 0 }}
					contentContainerStyle={{ paddingLeft: 10 }}
					showsHorizontalScrollIndicator={false}
					renderItem={({ item: tab }) => (
						<CustomIconButton
							key={tab}
							text={tab.title}
							image={tab.image}
							active={selectedTab?.title === tab.title ? true : false}
							onPress={() => {
								setSelectedTab(tab);
							}}
						/>
					)}
				/>

				{foundItems.filter(
					(product) => product?.category?._id === selectedTab?._id
				).length === 0 ? (
						<Empty message={'No Products\nfound in this category'} />
				) : (
					<FlatList
						data={foundItems.filter(
							(product) => product?.category?._id === selectedTab?._id
						)}
						refreshControl={
							<RefreshControl
								refreshing={refeshing}
								onRefresh={handleOnRefresh}
							/>
						}
						keyExtractor={(index, item) => `${index}-${item}`}
							numColumns={1}
							renderItem={({ item: product }) => (
								<View style={styles.productCartContainer}>
								<ProductCard
									cardSize='large'
									name={product.title}
									image={product.image}
									price={product.price}
									quantity={product.quantity}
										description={product.description}
									onPress={() => handleProductPress(product)}
									onPressSecondary={() => handleAddToCat(product)}
									/>
							</View>
						)}
					/>
				)}
			</View>
		</View>
	);
};

export default CategoriesScreen;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirecion: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'flex-start',
		flex: 1,
	},
	topBarContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
	},
	toBarText: {
		fontSize: 15,
		fontWeight: '600',
	},
	bodyContainer: {
		flex: 1,
		width: '100%',
		flexDirecion: 'row',
		backgroundColor: colors.light,

		justifyContent: 'flex-start',
		flex: 1,
	},
	cartIconContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	cartItemCountContainer: {
		position: 'absolute',
		zIndex: 10,
		top: -10,
		left: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 22,
		width: 22,
		backgroundColor: colors.danger,
		borderRadius: 11,
	},
	cartItemCountText: {
		color: colors.white,
		fontWeight: 'bold',
		fontSize: 10,
	},
	productCartContainer: {
		width: '100%',
		borderRadius: 10,
		paddingHorizontal: 12,
	},
	emptyView: {
		height: 20,
	},
});
