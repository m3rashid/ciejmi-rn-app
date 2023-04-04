import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants';

const CheckBox = ({ value, setValue, label }) => {
	return (
		<Pressable style={styles.container} onPress={() => setValue((p) => !p)}>
			<View
				styles={[value ? styles.viewOnSelect : viewOnUnSelect, baseStyles]}
			/>
			<Text style={styles.text}>{label}</Text>
		</Pressable>
	);
};

export default CheckBox;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		elevation: 2,
		borderRadius: 5,
		backgroundColor: colors.white,
	},
	baseStyles: {
		borderColor: colors.muted,
		height: 20,
		width: 20,
		marginRight: 20,
	},
	viewOnSelect: {
		backgroundColor: colors.primary,
	},
	viewOnUnSelect: {
		backgroundColor: colors.white,
	},
	text: {
		color: colors.dark,
	},
});
