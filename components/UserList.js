import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants';
import CustomButton from './CustomButton';

const UserList = ({ user, handleBlockUnBlockUser }) => {
	const isAdmin = user.authType === 'ADMIN';
	const isBlocked = user.blocked;

	return (
		<View style={styles.container}>
			<View style={styles.profileContainer}>
				<Ionicons
					name='person-circle-outline'
					size={40}
					color={colors.primary_light}
				/>
			</View>

			<View
				style={{
					flexDirection: 'row',
					gap: 12,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<View style={styles.userInfoContainer}>
					<Text style={styles.usernameText}>{user.name}</Text>
					<Text style={styles.userEmailText}>{user.email}</Text>
				</View>

				<View style={{ flex: 3, marginRight: 20 }}>
					<CustomButton
						{...{
							ioniconName: isAdmin
								? 'ios-person-circle-outline'
								: 'trash-outline',
							text: isAdmin ? 'ADMIN' : isBlocked ? 'Unblock ' : 'Block',
							// disabled: isAdmin,
							// ...(!isAdmin && {
								onPress: () => handleBlockUnBlockUser(user),
							// }),
							style: {
								backgroundColor: isAdmin
									? colors.muted
									: isBlocked
										? colors.primary
										: colors.danger,
								width: 100,
								marginVertical: 10,
								padding: 8,
								paddingVertical: 6,
							},
						}}
					/>
				</View>
			</View>
		</View>
	);
};

export default UserList;

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: colors.white,
		height: 70,
		borderRadius: 5,
		elevation: 2,
		margin: 5,
		padding: 4,
	},
	profileContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	usernameText: {
		fontWeight: 'bold',
		fontSize: 15,
		color: colors.muted,
	},
	userEmailText: {
		fontSize: 13,
		fontWeight: '600',
		color: colors.muted,
	},
	userInfoContainer: {
		marginLeft: 5,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flex: 5,
	},
});
