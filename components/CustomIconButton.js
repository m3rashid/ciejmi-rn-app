import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { colors } from '../constants';

const CustomIconButton = ({ text, image, onPress, active }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				styles.container,
				{ backgroundColor: active ? colors.primary_light : colors.white },
			]}
		>
			{image ? (
				<Image
					source={{ uri: image }}
					style={styles.buttonIcon}
				/>
			) : (
					<Text style={{ marginLeft: 10, color: colors.muted, marginHorizontal: 5 }} />
			)}
			<Text
				style={[
					styles.buttonText,
					{ color: active ? colors.dark : colors.muted, marginHorizontal: 8 },
				]}
			>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

export default CustomIconButton;

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.white,
		borderRadius: 5,
		height: 35,
		elevation: 2,
		marginRight: 5,
	},
	buttonText: {
		fontSize: 12,
		color: colors.muted,
		fontWeight: 'bold',
	},
	buttonIcon: {
		height: 35,
		width: 35,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
		resizeMode: 'contain',
	},
});
