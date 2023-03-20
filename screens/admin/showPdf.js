import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';
import ProgressDialog from 'react-native-progress-dialog';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants';

const ViewPDFScreen = ({ navigation, route }) => {
	const { pdfUrl } = route.params;
	const [loading, setLoading] = React.useState(true);

	return (
		<View style={styles.container}>
			<View style={styles.TopBarContainer}>
				<TouchableOpacity
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Ionicons
						name='arrow-back-circle-outline'
						size={30}
						color={colors.muted}
					/>
				</TouchableOpacity>
			</View>
			<ProgressDialog visible={loading} label='Loading . . .' />
			<Pdf
				source={{ uri: pdfUrl, cache: true }}
				trustAllCerts={false}
				onError={(error) => {
					console.log(error);
					navigation.goBack();
				}}
				onLoadComplete={() => {
					setLoading(false);
				}}
				style={styles.pdf}
			/>
		</View>
	);
};

export default ViewPDFScreen;

const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	pdf: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	TopBarContainer: {
		width: '100%',
		marginLeft: 30,
		marginTop: 15,
		marginBottom: 10,
	},
});
