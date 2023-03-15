import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomInput = ({
	value,
	setValue,
	placeholder,
	secureTextEntry,
	placeholderTextColor = colors.muted,
	onFocus,
	radius,
	width,
	keyboardType,
	maxLength,
	ioniconName,
	showTitle = true,
}) => {
	const windowWidth = Dimensions.get('window').width;
	if (!width) width = windowWidth - 24;

	return (
		<View style={{ marginTop: 12 }}>
			{showTitle && (
				<Text
					style={{ textAlign: 'left', marginLeft: 5, color: colors.primary }}
				>
					{placeholder}
				</Text>
			)}
			<View
				style={[
					styles.rootContainer,
					{ width: width, ...(ioniconName ? { paddingLeft: 12 } : {}) },
				]}
			>
				{ioniconName && (
					<Icon
						name={ioniconName}
						size={24}
						color={colors.primary}
						style={{ marginLeft: 20 }}
					/>
				)}

				<TextInput
					placeholder={placeholder}
					onChangeText={setValue}
					value={value}
					secureTextEntry={secureTextEntry}
					style={styles.CustomInput}
					placeholderTextColor={placeholderTextColor}
					onFocus={onFocus}
					borderRadius={radius}
					maxLength={maxLength}
					keyboardType={keyboardType}
				/>
			</View>
		</View>
	);
};

export default CustomInput;

const styles = StyleSheet.create({
	rootContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: colors.white,
		height: 45,
		marginTop: 2,
		elevation: 5,
		borderRadius: 5,
	},
	CustomInput: {
		width: '100%',
		padding: 5,
		paddingLeft: 10,
		backgroundColor: colors.white,
		color: colors.dark,
	},
});
