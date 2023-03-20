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
					style={[styles.buttonIcon, { marginRight: 10 }]}
				/>
			) : (
				<Text style={{ marginLeft: 10, color: colors.muted }} />
			)}
			<Text
				style={[
					styles.buttonText,
					{ color: active ? colors.dark : colors.muted },
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
		height: 40,
		elevation: 2,
		margin: 5,
		paddingLeft: 5,
		paddingRight: 10,
	},
	buttonText: {
		fontSize: 12,
		color: colors.muted,
		fontWeight: 'bold',
	},
	buttonIcon: {
		height: 20,
		width: 35,
		resizeMode: 'contain',
	},
});
