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
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../components/CustomAlert';
import * as ImagePicker from 'react-native-image-picker';
import ProgressDialog from 'react-native-progress-dialog';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CheckBoxContainer from '../../components/checkbox';

const EditProductScreen = ({ navigation, route }) => {
	const { product, authUser } = route.params;
	const [isloading, setIsloading] = useState(false);
	const [label, setLabel] = useState('Updating...');
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');
	const [nonInventoryItem, setNonInventoryItem] = useState(true);
	const [image, setImage] = useState('');
	const [error, setError] = useState('');
	const [quantity, setQuantity] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('garments');

	//Method for selecting the image from device gallery
	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});
		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	//Method for imput validation and post data to server to edit product using API call
	const editProductHandle = () => {
		if (title == '') {
			setError('Please enter the product title');
		} else if (price == 0) {
			setError('Please enter the product price');
		} else if (quantity <= 0) {
			setError('Quantity must be greater then 1');
		} else if (image == null) {
			setError('Please upload the product image');
		} else {
			setIsloading(true);

			fetch(`${network.serverip}/update-product?id=${product._id}`, {
				method: 'POST',
				headers: {
					'x-auth-token': authUser.token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					_id: product._id,
					image,
					title,
					price,
					quantity,
					description,
					category: product.category._id,
					nonInventoryItem,
				}),
				redirect: 'follow',
			})
				.then((r) => {
					if (!r.ok || r.status < 200 || r.status >= 300) {
						throw new Error('Something went wrong!');
					}
					return r.json();
				})
				.then((result) => {
					if (result.success == true) {
						setIsloading(false);
						setError(result.message);
						setPrice('');
						setQuantity('');
						setTitle('');
					}
				})
				.catch((error) => {
					setIsloading(false);
					setError(error.message);
				});
		}
	};

	// set all the input fields and image on initial render
	useEffect(() => {
		setImage(product?.image);
		setTitle(product.title);
		setQuantity(product.quantity.toString());
		setPrice(product.price.toString());
		setDescription(product.description);
		setNonInventoryItem(product.nonInventoryItem);
	}, []);

	return (
		<KeyboardAvoidingView style={styles.container}>
			<StatusBar />
			<ProgressDialog visible={isloading} label={label} />
			<View style={styles.TopBarContainer}>
				<TouchableOpacity
					onPress={() => {
						// navigation.replace("viewproduct", { authUser: authUser });
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
				<Text style={styles.screenNameText}>Edit Product</Text>
			</View>
			<CustomAlert message={error} type={'error'} />
			<ScrollView style={{ flex: 1, width: '100%' }}>
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
						isRequired
						value={title}
						setValue={setTitle}
						placeholder={'Title'}
						placeholderTextColor={colors.muted}
						radius={5}
					/>
					<CustomInput
						isRequired
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
					<CheckBoxContainer
						checked={nonInventoryItem}
						setValue={setNonInventoryItem}
						label='Non Inventory Item'
					/>
				</View>
			</ScrollView>
			<View style={styles.buttomContainer}>
				<CustomButton text={'Edit Product'} onPress={editProductHandle} />
			</View>
		</KeyboardAvoidingView>
	);
};

export default EditProductScreen;

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
