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
import React, { useState } from 'react';
import { colors, network } from '../../constants';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { launchImageLibrary } from 'react-native-image-picker';
import ProgressDialog from 'react-native-progress-dialog';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import RNFS from 'react-native-fs';
import CustomAlert from '../../components/CustomAlert';

const AddProductScreen = ({ navigation, route }) => {
	const { authUser } = route.params;
	const [isloading, setIsloading] = useState(false);
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');
	const [sku, setSku] = useState('');
	const [image, setImage] = useState('');
	const [error, setError] = useState('');
	const [quantity, setQuantity] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [alertType, setAlertType] = useState('error');
	const [user, setUser] = useState({});
	const [categories, setCategories] = useState([]);
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [statusDisable, setStatusDisable] = useState(false);
	const [items, setItems] = useState([
		{ label: 'Pending', value: 'pending' },
		{ label: 'Shipped', value: 'shipped' },
		{ label: 'Delivered', value: 'delivered' },
	]);

	const myHeaders = new Headers();
	myHeaders.append('x-auth-token', authUser.token);
	myHeaders.append('Content-Type', 'application/json');

	var payload = [];

	//method to convert the authUser to json object.
	const getToken = (obj) => {
		try {
			setUser(JSON.parse(obj));
		} catch (e) {
			setUser(obj);
			return obj.token;
		}
		return JSON.parse(obj).token;
	};

	const fetchCategories = () => {
		var myHeaders = new Headers();
		myHeaders.append('x-auth-token', getToken(authUser));

		const requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};
		setIsloading(true);
		fetch(`${network.serverip}/categories`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				if (result.success) {
					setCategories(result.categories);
					result.categories.forEach((cat) => {
						let obj = {
							label: cat.title,
							value: cat._id,
						};
						payload.push(obj);
					});
					setItems(payload);
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

	const upload = async (file) => {
		if (!file) return;
		setIsloading(true)
		const fileToUpload = {
			name: 'images',
			filetype: 'image/jpeg',
			filename: file.name || file.fileName,
			filepath: file.uri.replace('file://', ''),
		};

		RNFS.uploadFiles({
			toUrl: network.serverip + '/upload',
			files: [fileToUpload],
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: authUser.token,
				'x-auth-token': authUser.token,
			},
		}).promise.then((response) => {
			if (response.statusCode === 200) {
				// request successfully completed
				const data = JSON.parse(response.body);
				setImage(data.data)
			} else {
				// server error
			}
			setIsloading(false)
		})
	};

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await launchImageLibrary({
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});

		if (!result.cancelled) {
			upload(result.assets[0]).then().catch(console.log);
		}
	};

	//Method for imput validation and post data to server to insert product using API call
	const addProductHandle = () => {
		setIsloading(true);

		//[check validation] -- Start
		if (title == '') {
			setError('Please enter the product title');
			setIsloading(false);
		} else if (price == 0) {
			setError('Please enter the product price');
			setIsloading(false);
		} else if (quantity <= 0) {
			setError('Quantity must be greater then 1');
			setIsloading(false);
		} else if (!image) {
			setError('Please upload the product image');
			setIsloading(false);
		} else {
			const requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: JSON.stringify({
					title: title,
					sku: sku,
					price: price,
					image: image,
					description: description,
					category: category,
					quantity: quantity,
				}),
				redirect: 'follow',
			};

			fetch(network.serverip + '/product', requestOptions)
				.then((response) => response.json())
				.then((result) => {
					if (result.success == true) {
						setIsloading(false);
						setAlertType('success');
						setError(result.message);
						setTitle('');
						setSku('');
						setPrice(0);
						setImage('');
						setDescription('');
						setCategory('');
						setQuantity(0);
					}
				})
				.catch((error) => {
					setIsloading(false);
					setError(error.message);
					setAlertType('error');
				});
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

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
				<Text style={styles.screenNameText}>Add Product</Text>
			</View>

			<CustomAlert message={error} type={alertType} />
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, width: '100%' }}
			>
				<View style={styles.formContainer}>
					<View style={styles.imageContainer}>
						{image ? (
							<TouchableOpacity style={styles.imageHolder} onPress={pickImage}>
								<Image
									source={{ uri: image }}
									style={{ width: 200, height: 200 }}
								/>
							</TouchableOpacity>
						) : (
							<TouchableOpacity style={styles.imageHolder} onPress={pickImage}>
								<AntDesign name='pluscircle' size={50} color={colors.muted} />
							</TouchableOpacity>
						)}
					</View>

					<CustomInput
						value={sku}
						setValue={setSku}
						placeholder='SKU (Stock Keeping Unit)'
						placeholderTextColor={colors.muted}
						radius={5}
					/>
					<CustomInput
						value={title}
						setValue={setTitle}
						placeholder='Title'
						placeholderTextColor={colors.muted}
						radius={5}
					/>
					<CustomInput
						value={price}
						setValue={setPrice}
						placeholder={'Price'}
						keyboardType={'number-pad'}
						placeholderTextColor={colors.muted}
						radius={5}
					/>
					<CustomInput
						value={quantity}
						setValue={setQuantity}
						placeholder={'Quantity'}
						keyboardType={'number-pad'}
						placeholderTextColor={colors.muted}
						radius={5}
					/>
					<CustomInput
						value={description}
						setValue={setDescription}
						placeholder={'Description'}
						placeholderTextColor={colors.muted}
						radius={5}
					/>
				</View>

				<DropDownPicker
					placeholder='Select Product Category'
					placeholderStyle={{ color: colors.muted }}
					open={open}
					value={category}
					items={items}
					setOpen={setOpen}
					setValue={setCategory}
					setItems={setItems}
					disabled={statusDisable}
					disabledStyle={{
						backgroundColor: colors.light,
						borderColor: colors.white,
					}}
					containerStyle={{ borderWidth: 0, borderColor: '#fff' }}
					labelStyle={{ color: colors.muted }}
					style={{
						borderColor: '#fff',
						elevation: 5,
						margin: 5,
						marginBottom: 100,
					}}
				/>
			</ScrollView>
			<View style={styles.buttomContainer}>
				<CustomButton text='Add Product' onPress={addProductHandle} />
			</View>
		</KeyboardAvoidingView>
	);
};

export default AddProductScreen;

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
