import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants';

const WishList = ({
	image = '',
	title = ' ',
	description = '',
	onPressRemove,
	onPressView,
}) => {
	const handleChangeState = () => {
		onPressRemove();
	};

	return (
		<TouchableOpacity style={styles.container} onPress={onPressView}>
			<View style={styles.detailContainer}>
				<View style={styles.imageContainer}>
					<Image style={styles.image} source={{ uri: image }} />
				</View>
				<View style={styles.categoryInfo}>
					<Text style={styles.categoryTitle}>{title}</Text>
					{description && (
						<Text style={styles.categoryDescription}>{`${description.substring(
							0,
							30
						)}..`}</Text>
					)}
				</View>
			</View>
			<View style={styles.categoryActionContainer}>
				<View style={styles.infoButtonContainer}>
					<View style={styles.wishlistButtonContainer}>
						<TouchableOpacity onPress={() => handleChangeState()}>
							<Ionicons name='heart' size={25} color={colors.danger} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default WishList;

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingRight: 12,
		backgroundColor: colors.white,
		height: 80,
		borderRadius: 5,
		elevation: 2,
		margin: 5,
	},
	detailContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		backgroundColor: colors.white,
		height: 80,
		borderRadius: 5,
		margin: 5,
		marginLeft: 0,
		paddingLeft: 0,
		borderBottomLeftRadius: 10,
		borderTopLeftRadius: 10,
	},
	imageContainer: {
		width: 80,
		height: 80,
		display: 'flex',
		backgroundColor: colors.light,
	},
	image: {
		height: 80,
		width: 80,
		resizeMode: 'contain',
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
	categoryTitle: {
		fontSize: 15,
		fontWeight: '500',
		color: colors.dark,
	},
	categoryDescription: {
		fontSize: 12,
		color: colors.muted,
	},

	categoryInfo: {
		marginLeft: 10,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
	},

	actionButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 5,
		height: 30,
		width: 30,
		backgroundColor: colors.primary,
		borderRadius: 5,
		elevation: 2,
	},

	infoButtonContainer: {
		padding: 5,
		paddingRight: 0,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},

	wishlistButtonContainer: {
		height: 50,
		width: 50,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.light,
		borderRadius: 10,
	},
});
