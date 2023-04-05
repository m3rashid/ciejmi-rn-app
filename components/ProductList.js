import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../constants';

const ProductList = ({
	category,
	price,
	title,
	image,
	quantity,
	onPressView,
	onPressEdit,
	onPressDelete,
}) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPressView}>
			<View style={styles.innerContainer}>
				<View>
					{image ? (
						<Image source={{ uri: image }} style={styles.productImage} />
					) : (
						<View style={styles.ImageContainer} />
					)}
				</View>

				<View style={styles.productInfoContainer}>
					<Text style={styles.productTitle}>{title}</Text>
					<View style={styles.productInfoItem}>
						<Text style={styles.productInfoItemText}>Category: </Text>
						<Text style={{ color: colors.dark }}>{category}</Text>
					</View>
					<View style={styles.productInfoItem}>
						<Text style={styles.productInfoItemText}>Price: </Text>
						<Text style={{ color: colors.dark }}>{price}</Text>
					</View>

					{product.nonInventoryItem ? (
						<View style={styles.productInfoItem}>
							<Text style={styles.productInfoItemText}>Quantity: </Text>
							<Text style={{ color: colors.dark }}>
								{quantity <= 0 ? 'Out of Stock' : quantity}
							</Text>
						</View>
					) : null}
				</View>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={[styles.actionButton, { backgroundColor: colors.primary }]}
					onPress={onPressEdit}
				>
					<MaterialIcons name={'edit'} size={20} color={colors.white} />
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.actionButton, { backgroundColor: colors.danger }]}
					onPress={onPressDelete}
				>
					<MaterialIcons name={'delete'} size={20} color={colors.white} />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};

export default ProductList;

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: colors.white,
		borderRadius: 5,
		marginTop: 10,
		elevation: 5,
	},
	innerContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	productImage: {
		height: 100,
		width: 100,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
	ImageContainer: {
		backgroundColor: colors.light,
		borderRadius: 5,
		height: 100,
		width: 100,
	},
	productInfoContainer: {
		padding: 5,
		paddingLeft: 12,
	},
	buttonContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		marginTop: 10,
	},
	actionButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
		height: 35,
		width: 35,
		backgroundColor: colors.primary,
		borderRadius: 5,
		elevation: 2,
	},
	productInfoItem: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	productTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		color: colors.dark,
	},
	productInfoItemText: {
		fontSize: 13,
		fontWeight: '500',
		color: colors.muted,
	},
});
