import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../constants';

const UserProfileCard = ({ Icon, name, email }) => {
	return (
		<View style={styles.Container}>
			<View style={styles.avatarContainer}>
				<Icon name="person" size={80} color={colors.primary} />
			</View>
			<View style={styles.infoContainer}>
				<Text style={styles.usernameText}>{name}</Text>
				<Text style={styles.secondaryText}>{email}</Text>
			</View>
		</View>
	);
};

export default UserProfileCard;

const styles = StyleSheet.create({
	Container: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	avatarContainer: {
		display: 'flex',
		width: 120,
		height: 120,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.primary_light,
		borderRadius: 15,
		padding: 15,
	},
	infoContainer: {
		display: 'flex',
		width: '50%',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		backgroundColor: colors.light,
		paddingLeft: 20,
	},
	usernameText: {
		fontWeight: 'bold',
		fontSize: 25,
		color: colors.dark
	},
	secondaryText: {
		fontWeight: 'bold',
		fontSize: 12,
		color: colors.muted
	},
});
