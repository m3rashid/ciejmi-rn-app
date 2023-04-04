import { Image, StyleSheet, Text, View } from "react-native"
import emptyBox from '../assets/image/emptybox.jpg';

const Empty = ({ message }) => {
	return (
		<View style={styles.noItemContainer}>
			<View
				style={styles.container}
			>
				<Image
					source={emptyBox}
					style={styles.emptyBox}
				/>
				<Text style={styles.emptyBoxText}>
					{message}
				</Text>
			</View>
		</View>
	)
}

export default Empty

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.white,
		height: 200,
		width: 200,
		borderRadius: 5,
		gap: 10,
	},
	noItemContainer: {
		width: '100%',
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
	},
	emptyBoxText: {
		fontSize: 11,
		color: colors.muted,
		textAlign: 'center',
	},
	emptyBox: {
		height: 80,
		width: 80,
		resizeMode: 'contain'
	}
})