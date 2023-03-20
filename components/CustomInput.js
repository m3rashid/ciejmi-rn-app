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

	return (
		<View style={{ marginTop: 12, marginBottom: 6 }}>
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
					{
						width: width || windowWidth - 24,
						...(ioniconName ? { paddingLeft: 12 } : {}),
					},
				]}
			>
				{ioniconName && (
					<Icon
						name={ioniconName}
						size={24}
						color={colors.primary}
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
		justifyContent: 'space-between',
		flexDirection: 'row',
		backgroundColor: colors.white,
		height: 45,
		marginTop: 2,
		borderRadius: 5,
		elevation: 2,
	},
	CustomInput: {
		flex: 1,
		padding: 5,
		paddingLeft: 10,
		backgroundColor: colors.white,
		color: colors.dark,
	},
});
