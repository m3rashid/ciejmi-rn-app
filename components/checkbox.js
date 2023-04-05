import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants';
import CheckBox from 'react-native-check-box';

const CheckBoxContainer = ({ checked, setValue, label }) => {
	return (
		<Pressable style={styles.container} onPress={() => setValue((p) => !p)}>
			<CheckBox
				onClick={() => setValue((p) => !p)}
				isChecked={checked}
			/>	
			<Text style={styles.text}>This is a {label}</Text>
		</Pressable>
	);
};

export default CheckBoxContainer;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 10,
		marginTop: 8,
		width: '102.3%',
		backgroundColor: colors.white,
		elevation: 2,
		borderRadius: 5,
		height: 45,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingLeft: 12,
	},
	text: {
		color: colors.dark,
		fontWeight: 600
	},
});
