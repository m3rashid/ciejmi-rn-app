import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../constants';
import CustomButton from './CustomButton';

const BasicProductList = ({ title, price, quantity, image }) => {
	return (
		<View style={styles.container}>
			<View style={styles.innerContainer}>
				<View style={styles.IconContainer}>
					<Image source={{ uri: image }} style={{ height: 30, width: 30 }} />
				</View>
				<View style={styles.productInfoContainer}>
					<Text style={styles.secondaryText}>{title}</Text>
					<Text style={{ color: colors.dark }}>x{quantity}</Text>
				</View>
			</View>
			<View>
				<Text style={styles.primaryText}>₹ {Number(quantity * price).toFixed(2)}</Text>
			</View>
		</View>
	);
};

export default BasicProductList;

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		backgroundColor: colors.white,
		height: 70,
		borderBottomWidth: 1,
		borderBottomColor: colors.light,
		padding: 5,
	},
	innerContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	productInfoContainer: {
		justifyContent: 'center',
		alignItems: 'flex-start',
		marginLeft: 10,
	},
	IconContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.light,
		height: 40,
		width: 40,
		borderRadius: 5,
	},
	primaryText: {
		fontSize: 15,
		fontWeight: '600',
		color: colors.primary,
	},
	secondaryText: {
		fontSize: 15,
		fontWeight: '600',
		color: colors.dark,
	},
});
