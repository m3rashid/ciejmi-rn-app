import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors, network } from '../constants';
import { dateFormat, getTime } from './OrderList';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AddresssList = ({
	address,
	index = 0,
	setIsloading,
	refresh,
	authUser,
	handleEditAddress,
}) => {
	// localAddressOne, localAddressTwo, city, state, postalCode

	const removeAddress = async () => {
		if (!address._id) return;
		setIsloading(true);
		try {
			fetch(network.serverip + '/remove-address', {
				method: 'POST',
				headers: {
					'x-auth-token': authUser.token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ _id: address._id }),
				redirect: 'follow',
			})
				.then((res) => res.json())
				.then(refresh)
				.catch(console.log)
				.finally(() => {
					setIsloading(false);
				});
		} catch (err) {
			setIsloading(false);
		}
	};

	const handleRemoveAddress = async () => {
		return Alert.alert(
			'Delete address ?',
			'Are you sure you want to delete this address ?',
			[{ text: 'Cancel' }, { text: 'Delete', onPress: removeAddress }]
		);
	};

	if (!address) return null;

	return (
		<View style={styles.container}>
			<View style={styles.innerRowUpper}>
				<Text style={styles.primaryText}>Address # {index + 1}</Text>

				<View style={styles.timeDateContainer}>
					<Text style={styles.secondaryTextSm}>Added On</Text>
					<Text style={styles.secondaryTextSm}>
						{dateFormat(address.createdAt)} - {getTime(address.createdAt)}
					</Text>
				</View>
			</View>

			<View style={styles.innerRowUpper}>
				<View style={[styles.innerRow, { width: '70%' }]}>
					<Text style={styles.secondaryText}>
						Address Line One : {address.localAddressOne}
					</Text>
					{address.localAddressTwo && (
						<Text style={styles.secondaryText}>
							Address Line two : {address.localAddressTwo}
						</Text>
					)}
					<Text style={styles.secondaryText}>City : {address.city}</Text>
					<Text style={styles.secondaryText}>State : {address.state}</Text>
					<Text style={styles.secondaryText}>
						Postal Code : {address.postalCode}
					</Text>
				</View>

				<View style={styles.timeDateContainer}>
					<TouchableOpacity onPress={handleRemoveAddress}>
						<AntDesign name='closecircle' size={40} color={colors.danger} />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => handleEditAddress(address)}
						style={{ marginTop: 20 }}
					>
						<AntDesign
							name='edit'
							size={30}
							color={colors.white}
							style={{
								backgroundColor: colors.primary,
								padding: 6,
								borderRadius: 30,
							}}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

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
		marginBottom: 15,
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
