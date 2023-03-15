import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomButton = ({ text, onPress, ioniconName, disabled = false, style = {} }) => {
	return (
		<TouchableOpacity
			disabled={disabled}
			style={[disabled ? styles.containerDisabled : styles.container, style]}
			onPress={onPress}>
			{ioniconName &&
				<Icon name={ioniconName} size={24} color={colors.white} />
			}
			<Text style={disabled ? styles.buttonTextDisabled : styles.buttonText}>{text}</Text>
		</TouchableOpacity>
	)
};

export default CustomButton;

const commons = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'row',
	gap: 10,
	marginBottom: 10,
	width: '100%',
	padding: 12,
	borderRadius: 5,
}

const styles = StyleSheet.create({
	container: {
		...commons,
		backgroundColor: colors.primary,
	},
	buttonText: {
		fontWeight: 'bold',
		color: '#fff',
	},
	containerDisabled: {
		...commons,
		backgroundColor: colors.muted,
	},
	buttonTextDisabled: {
		fontWeight: 'bold',
		color: colors.light,
	},
});
