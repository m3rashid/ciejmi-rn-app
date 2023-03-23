import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors } from '../constants';
import CustomButton from './CustomButton';

export const getTime = (date) => {
	let t = new Date(date);
	const hours = ('0' + t.getHours()).slice(-2);
	const minutes = ('0' + t.getMinutes()).slice(-2);
	const seconds = ('0' + t.getSeconds()).slice(-2);
	let time = `${hours}:${minutes}:${seconds}`;

	time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
		time,
	];

	if (time.length > 1) {
		time = time.slice(1); // Remove full string match value
		time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
		time[0] = +time[0] % 12 || 12; // Adjust hours
	}
	return time.join(''); // return adjusted time or original string
};

export const dateFormat = (datex) => {
	let t = new Date(datex);
	const date = ('0' + t.getDate()).slice(-2);
	const month = ('0' + (t.getMonth() + 1)).slice(-2);
	const year = t.getFullYear();
	const newDate = `${date}-${month}-${year}`;

	return newDate;
};

const OrderList = ({ item, onPress }) => {
	const items = item.items.map((t) => ({
		id: t.productId._id,
		name: t.productId.title,
		quantity: t.quantity,
	}));
	const quantity = 0;

	return (
		<View style={styles.container}>
			<View style={styles.innerRow}>
				<View>
					<Text style={styles.primaryText}>Order # {item?._id}</Text>
				</View>
				<View style={styles.timeDateContainer}>
					<Text style={styles.secondaryTextSm}>
						{dateFormat(item?.createdAt)}
					</Text>
					<Text style={styles.secondaryTextSm}>{getTime(item?.createdAt)}</Text>
				</View>
			</View>
			{item?.user?.name && (
				<View style={styles.innerRow}>
					<Text style={styles.secondaryText}>{item?.user?.name} </Text>
				</View>
			)}
			{item?.user?.email && (
				<View style={styles.innerRow}>
					<Text style={styles.secondaryText}>{item?.user?.email} </Text>
				</View>
			)}

			<View style={{ marginTop: 8 }} />
			{items.map((t) => (
				<View key={t.id} style={styles.innerRow}>
					<Text style={styles.secondaryText}>{t.name}</Text>
					<Text style={styles.secondaryText}>Quantity: {t.quantity}</Text>
				</View>
			))}
			<View style={{ marginTop: 8 }} />


			<View style={styles.innerRow}>
				<Text style={styles.secondaryText}></Text>
				<Text style={styles.secondaryText}>
					Total Amount : ₹ {Number(item?.amount).toFixed(2)}
				</Text>
			</View>

			<View style={styles.innerRow}>
				<CustomButton
					style={styles.detailButton}
					onPress={onPress}
					text='Details'
				/>
				<Text style={styles.secondaryText}>{item?.status}</Text>
			</View>
		</View>
	);
};

export default OrderList;

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
		height: 'auto',
		backgroundColor: colors.white,
		borderRadius: 5,
		padding: 10,
		marginTop: 10,
		elevation: 1,
	},
	innerRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	primaryText: {
		fontSize: 15,
		color: colors.dark,
		fontWeight: 'bold',
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
	timeDateContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	detailButton: {
		marginTop: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		padding: 6,
		width: 100,
	},
});
