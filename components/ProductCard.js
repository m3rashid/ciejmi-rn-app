import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import React from 'react';
import { colors, network } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductCard = ({
	name,
	price,
	image,
	quantity,
	onPress,
	onPressSecondary,
	description,
	cardSize,
}) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<View style={styles.imageContainer}>
				<Image source={{ uri: image }} style={styles.productImage} />
			</View>

			<View style={styles.infoContainer}>
				<View style={{}}>
					<Text style={styles.secondaryTextSm}>{name}</Text>
					{description && (
						<Text
							style={[
								styles.secondaryTextSm,
								{ color: colors.muted, fontWeight: 400 },
							]}
						>
							{description}
						</Text>
					)}
					<Text style={styles.primaryTextSm}>₹ {Number(price).toFixed(2)}</Text>
				</View>

				<View style={{}}>
					<TouchableOpacity
						{...{
							style: styles.iconContainer,
							onPress: onPressSecondary,
							...(quantity > 0 && { disabled: true })
						}}
					>
						<Ionicons name='cart' size={28} color='white' />
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default ProductCard;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.white,
		height: 100,
		borderRadius: 5,
		elevation: 2,
		marginTop: 10,
		flexDirection: 'row',
	},
	imageContainer: {
		backgroundColor: colors.white,
		borderRadius: 5,
	},
	productImage: {
		height: 100,
		width: 100,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
	infoContainer: {
		width: Dimensions.get('window').width - 124,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 12,
	},
	secondaryTextSm: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.dark,
	},
	primaryTextSm: {
		fontSize: 15,
		fontWeight: 'bold',
		color: colors.primary,
	},
	iconContainer: {
		backgroundColor: colors.primary,
		width: 38,
		height: 38,
		borderRadius: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconContainerDisable: {
		backgroundColor: colors.muted,
		width: 30,
		height: 30,
		borderRadius: 5,
		display: 'flex',

		justifyContent: 'center',
		alignItems: 'center',
	},
});
