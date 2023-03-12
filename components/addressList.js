import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../constants';
import { dateFormat, getTime } from './OrderList';

const AddresssList = ({ address, index = 0 }) => {
	// localAddressOne, localAddressTwo, city, state, postalCode

	if (!address) return null

	return (
		<View style={styles.container}>
			<View style={styles.innerRowUpper}>
				<Text style={styles.primaryText}>Address # {index + 1}</Text>

				<View style={styles.timeDateContainer}>
					<Text style={styles.secondaryTextSm}>Added On</Text>
					<Text style={styles.secondaryTextSm}>{dateFormat(address.createdAt)} - {getTime(address.createdAt)}</Text>
				</View>
			</View>

			<View style={styles.innerRow}>
				<Text style={styles.secondaryText}>Address Line One : {address.localAddressOne}</Text>
				<Text style={styles.secondaryText}>Address Line two : {address.localAddressTwo}</Text>
				<Text style={styles.secondaryText}>City : {address.city}</Text>
				<Text style={styles.secondaryText}>State : {address.state}</Text>
				<Text style={styles.secondaryText}>Postal Code : {address.postalCode}</Text>
			</View>
		</View>
	)
}

export default AddresssList;

const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: colors.white,
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
		elevation: 1,
	},
	innerRowUpper: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 15
	},
	innerRow: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
	},
	timeDateContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	secondaryTextSm: {
		fontSize: 11,
		color: colors.muted,
		fontWeight: 'bold',
	},
	secondaryText: {
		fontSize: 14,
		color: colors.muted,
		fontWeight: 'bold',
	},
	primaryText: {
		fontSize: 15,
		color: colors.dark,
		fontWeight: 'bold',
	},
});
