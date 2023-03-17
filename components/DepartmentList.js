import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../constants';

const DepartmentList = ({ department, onDelete, id, authUser }) => {
	return (
		<View style={styles.container}>
			<View style={styles.innerContainer}>
				<Text style={{ color: colors.dark }}>{department}</Text>
			</View>

			<View style={{ display: 'flex', flexDirection: 'row' }}>
				<TouchableOpacity
					style={[styles.actionButton, { backgroundColor: colors.primary }]}
					onPress={() => {
						navigator.navigate('addDepartment', {
							dept: { _id: id, name: department },
							authUser: authUser,
						});
					}}
				>
					<MaterialIcons name='edit' size={18} color={colors.white} />
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.actionButton, { backgroundColor: colors.danger }]}
					onPress={onDelete}
				>
					<MaterialIcons name='delete' size={18} color={colors.white} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default DepartmentList;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: colors.light,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
		backgroundColor: colors.white,
		marginTop: 10,
		borderRadius: 5,
	},
	innerContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	actionButton: {
		padding: 5,
		margin: 5,
		borderRadius: 5,
	},
});
