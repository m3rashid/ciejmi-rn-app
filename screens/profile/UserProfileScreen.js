import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import UserProfileCard from '../../components/UserProfileCard/UserProfileCard';
import Ionicons from 'react-native-vector-icons/Ionicons';;
import OptionList from '../../components/OptionList/OptionList';
import { colors } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState({});
  const { user } = route.params;

  const handleLogout = async () => {
    return Alert.alert(
      'Logout from CIE-JMI ?',
      'Are you sure you want to logout ?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('authUser');
            navigation.replace('login');
          },
        },
      ],
    );
  }

  const convertToJSON = obj => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  useEffect(() => {
    convertToJSON(user);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Profile</Text>
      </View>

      <View style={styles.UserProfileCardContianer}>
        <UserProfileCard
          Icon={Ionicons}
          name={userInfo?.name}
          email={userInfo?.email}
        />
      </View>

      <View style={styles.OptionsContainer}>
        <OptionList
          text='My Account'
          Icon={Ionicons}
          iconName='person'
          onPress={() => navigation.navigate('myaccount', { user: userInfo })}
        />

        <OptionList
          text='Wishlist'
          Icon={Ionicons}
          iconName='heart'
          onPress={() => navigation.navigate('mywishlist', { user: userInfo })}
        />

        <OptionList
          text='Logout'
          Icon={Ionicons}
          iconName='log-out'
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirecion: 'row',
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 12,
    flex: 1,
  },
  TopBarContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  UserProfileCardContianer: {
    width: '100%',
    height: '25%',
  },
  screenNameContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15,
  },
  screenNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.muted,
    paddingLeft: 3,
  },
  OptionsContainer: {
    width: '100%',
  },
});
