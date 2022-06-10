import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  TextInput,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {useSelector, useDispatch} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {MainWrapper} from '../../../components/common/MainWrapper';
import Button from '../../../components/common/SubmitButton';
import {Body3} from '../../../components/design-system/FontSystem';
import GardenerImage from '../../../assets/images/Gardener';
import LeafIcon from '../../../assets/images/Leaf';
import {GREEN_COLOR} from '../../../common/colors';

import {createMeeting} from '../../../redux/slices/meeting';
import {findByGroup} from '../../../redux/slices/group';

const MeetingListScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const userId = user.user.id;
  const {groupArray} = useSelector(state => state.user);

  const dateToStr = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return {year: year, month: month, day: day};
  };

  const [sourceDate, setSourceDate] = useState(new Date());

  const [today, setToday] = useState(dateToStr(sourceDate));
  const [selectedDay, setSelectedDay] = useState(today); // to initialize the meeting start and end day as the selected day on the calendar.
  const [selectedDate, setSelectedDate] = useState({}); // to express the selected day on the calendar with green circle background.
  const [markedDates, setMarkedDates] = useState({});
  const [selectedGroup, setSelectedGroup] = useState({id: 0});
  const [modalVisible, setModalVisible] = useState(false);
  const [isGroupSelected, setIsGroupSelected] = useState(false);
  const [groupSubmitted, setGroupSubmitted] = useState(false);
  const [durationAllDayLong, setDurationAllDayLong] = useState(false);

  //States for 'Create Meeting'
  const isPlatformIOS = Platform.OS === 'ios';
  const [startDatePickerVisible, setStartDatePickerVisible] =
    useState(isPlatformIOS); // 'true' for ios, 'false' for android
  const [startTimePickerVisible, setStartTimePickerVisible] =
    useState(isPlatformIOS);
  const [endDatePickerVisible, setEndDatePickerVisible] =
    useState(isPlatformIOS);
  const [endTimePickerVisible, setEndTimePickerVisible] =
    useState(isPlatformIOS);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingStartDateTime, setMeetingStartDateTime] = useState(sourceDate);
  const [meetingEndDateTime, setMeetingEndDateTime] = useState(sourceDate);
  const [placeList, setPlaceList] = useState([]);
  const [userList, setUserList] = useState([]);
  // const [meetingObject, setMeetingObject] = useState({
  //   name: '',
  //   start: new Date(),
  //   end: new Date(),
  //   allDay: false,
  //   places: [],
  //   activities: [],
  // });

  LocaleConfig.locales['kr'] = {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  };
  LocaleConfig.defaultLocale = 'kr';

  const initialActivityList = [
    {name: '식사', id: 1, selected: false},
    {name: '영화', id: 2, selected: false},
    {name: '쇼핑', id: 3, selected: false},
    {name: '여행', id: 4, selected: false},
    {name: '독서', id: 5, selected: false},
    {name: '미용', id: 6, selected: false},
    {name: '드라이브', id: 7, selected: false},
    {name: '피크닉', id: 8, selected: false},
    {name: '캠핑', id: 9, selected: false},
    {name: '게임', id: 10, selected: false},
    {name: '전시회', id: 11, selected: false},
    {name: '기타', id: 12, selected: false},
  ];

  const [activityList, setActivityList] = useState(initialActivityList);

  const {width, height} = Dimensions.get('screen');

  const dispatch = useDispatch();

  useEffect(() => {
    const groupId = selectedGroup.id;
    if (groupId !== 0) {
      dispatch(findByGroup({userId: userId, groupId: groupId})).then(res => {
        const loadedUserList = res.payload.map(val => val.id);
        setUserList(loadedUserList);
      });
    }
  }, [selectedGroup]);

  const isFocused = useIsFocused();
  useEffect(() => {
    setSourceDate(new Date());
  }, [isFocused]);

  useEffect(() => {
    if (durationAllDayLong) {
      const meetingYear = meetingStartDateTime.getFullYear();
      const meetingMonthIdx = meetingStartDateTime.getMonth();
      const meetingDate = meetingStartDateTime.getDate();
      setMeetingEndDateTime(
        new Date(meetingYear, meetingMonthIdx, meetingDate, 23, 59),
      );
    }
    if (!durationAllDayLong) setMeetingEndDateTime(meetingStartDateTime);
  }, [meetingStartDateTime]);

  useEffect(() => {
    if (durationAllDayLong) {
      const meetingYear = meetingStartDateTime.getFullYear();
      const meetingMonthIdx = meetingStartDateTime.getMonth();
      const meetingDate = meetingStartDateTime.getDate();

      setMeetingStartDateTime(
        new Date(meetingYear, meetingMonthIdx, meetingDate, 0, 0),
      );
      setMeetingEndDateTime(
        new Date(meetingYear, meetingMonthIdx, meetingDate, 23, 59),
      );
    }
  }, [durationAllDayLong]);

  const handleModalClose = () => {
    setGroupSubmitted(false);
    setIsGroupSelected(false);
    setSelectedGroup({id: 0});
    setActivityList(initialActivityList);
    setMeetingTitle('');
    setModalVisible(false);
    setDurationAllDayLong(false);
    setMeetingStartDateTime(sourceDate);
    setMeetingEndDateTime(sourceDate);
  };

  const handleSelectDay = day => {
    setSelectedDay(day);
    setSelectedDate({});
    const cp = {};
    cp[`${day.dateString}`] = {selected: true};
    setSelectedDate(cp);
  };

  const handleAllDayLong = () => {
    setDurationAllDayLong(prev => !prev);
  };

  const handleNavigateToNFC = () => {
    navigation.navigate('NFCTag');
  };

  const handleStartPicker = (event, selectedStartDate) => {
    const currentDate = selectedStartDate || meetingStartDateTime;
    if (Platform.OS === 'android') {
      setStartDatePickerVisible(false);
      setStartTimePickerVisible(false);
    }
    if (event.type === 'neutralButtonPressed') {
      setMeetingStartDateTime(new Date(0));
    } else {
      setMeetingStartDateTime(currentDate);
    }
  };

  const handleEndPicker = (event, selectedEndDate) => {
    const currentDate = selectedEndDate || meetingEndDateTime;
    if (Platform.OS === 'android') {
      setEndDatePickerVisible(false);
      setEndTimePickerVisible(false);
    }
    if (event.type === 'neutralButtonPressed') {
      setMeetingEndDateTime(new Date(0));
    } else {
      setMeetingEndDateTime(currentDate);
    }
  };

  const handleAddPlace = () => {
    setPlaceList([
      {
        name: '이화여자대학교',
        latitude: 37.562544705628845,
        longitude: 126.94765009467245,
      },
      {
        name: '역삼역 1번 출구',
        latitude: 37.500479553579,
        longitude: 127.0372632678719,
      },
    ]);
  };

  const handleCreateMeeting = () => {
    const groupId = selectedGroup.id;
    const activityIdList = activityList
      .filter(val => val.selected)
      .map(val => val.id);
    const meetingObject = {
      groupId: groupId,
      title: meetingTitle,
      start: meetingStartDateTime,
      end: meetingEndDateTime,
      allDay: durationAllDayLong,
      places: placeList,
      activities: activityIdList,
      users: userList,
    };
    console.log(meetingObject);
    dispatch(createMeeting(meetingObject))
      .unwrap()
      .then(res => {
        console.log(res);
        handleModalClose();
      });
  };

  const groupListLayout = ({item}) => {
    const handleSelectGroup = () => {
      setSelectedGroup(item);
      setIsGroupSelected(true);
    };
    const checkColor = item.id === selectedGroup.id ? GREEN_COLOR : '#fff';

    return (
      <TouchableOpacity
        style={{
          width: 0.9 * width,
          height: 68,
          backgroundColor: '#3A3A3A',
          borderRadius: 12,
          padding: 12,
          paddingRight: 16,
          marginBottom: 20,
        }}
        onPress={handleSelectGroup}
        activeOpacity={0.5}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontFamily: 'Pretendard-SemiBold',
              lineHeight: 20,
            }}
            numberOfLines={3}>
            {item.name}
          </Text>
          <View>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={24}
              color={checkColor}
            />
          </View>
        </View>
        <Text style={{color: '#fff', fontSize: 12}}>{item.users[0].name}</Text>
      </TouchableOpacity>
    );
  };

  const activityListLayout = ({item}) => {
    const handleMultiSelect = activityId => {
      const cp = [...activityList];
      cp[activityId - 1].selected = !cp[activityId - 1].selected;
      setActivityList(cp);
    };

    return (
      <TouchableOpacity
        style={
          item.id % 4 === 0
            ? item.selected
              ? {
                  ...styles.activityCell,
                  marginRight: 0,
                  backgroundColor: GREEN_COLOR,
                }
              : {...styles.activityCell, marginRight: 0}
            : item.selected
            ? {
                ...styles.activityCell,
                backgroundColor: GREEN_COLOR,
              }
            : styles.activityCell
        }
        onPress={() => handleMultiSelect(item.id)}>
        <Text style={{color: '#fff'}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <MainWrapper style={{padding: 20}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Text style={{color: '#fff', fontSize: 26, flex: 1}}>약속</Text>
        <TouchableOpacity style={{marginRight: 10}}>
          <MaterialCommunityIcons
            name="filter-outline"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          padding: 13,
          backgroundColor: '#3A3A3A',
          borderRadius: 15,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={{color: 'white', fontSize: 20, marginBottom: 5}}>
              우리 밥 한끼 어때?
            </Text>
            <Text style={{color: 'white', fontSize: 14, lineHeight: 20}}>
              [가든 제목] 정원의 가드너들을{`\n`}깨우고 약속을 잡아보세요.
            </Text>
          </View>
          <View style={{marginRight: 32}}>
            <GardenerImage />
          </View>
        </View>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: '#000',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => setModalVisible(true)}>
          <LeafIcon />
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              lineHeight: 20,
              marginLeft: 10,
            }}>
            흔들기
          </Text>
        </TouchableOpacity>
      </View>
      <Calendar
        theme={{
          backgroundColor: '#000',
          calendarBackground: '#000',
          monthTextColor: '#fff',
          arrowColor: GREEN_COLOR,
          dayTextColor: '#fff',
          textDisabledColor: '#2b2b2b',
          todayTextColor: GREEN_COLOR,
          selectedDayBackgroundColor: GREEN_COLOR,
        }}
        onDayPress={day => handleSelectDay(day)}
        markedDates={{...selectedDate}}
      />
      <Button title="NFC 기록하기" onPress={handleNavigateToNFC} />
      <Modal
        isVisible={modalVisible}
        onModalHide={handleModalClose}
        onBackdropPress={handleModalClose}
        onSwipeComplete={handleModalClose}
        onBackButtonPress={handleModalClose}
        swipeDirection="down"
        style={{margin: 0, padding: 0}}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            alignItems: 'center',
            width: '100%',
            height: '95%',
            backgroundColor: '#202020',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View
            style={{
              backgroundColor: '#aaa',
              width: 100,
              height: 2,
              borderRadius: 1,
              marginTop: 15,
            }}
          />
          {!groupSubmitted ? (
            <>
              <Text style={styles.modalTitle}>가든 선택하기</Text>
              <FlatList
                data={groupArray}
                renderItem={groupListLayout}
                keyExtractor={(item, index) => index}
              />
              <View style={{padding: 10, width: width * 0.95}}>
                <Button
                  title={isGroupSelected ? '다음' : '그룹을 선택해 주세요.'}
                  onPress={() => setGroupSubmitted(true)}
                  style={
                    isGroupSelected
                      ? {
                          borderWidth: 0,
                          marginBottom: 20,
                          backgroundColor: GREEN_COLOR,
                        }
                      : {borderWidth: 0, marginBottom: 20}
                  }
                  disabled={!isGroupSelected}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>약속 생성</Text>
              <View>
                <TextInput
                  onChangeText={e => setMeetingTitle(e)}
                  value={meetingTitle}
                  placeholder={`${selectedGroup.name}의 약속`}
                  placeholderTextColor={`rgba(255, 255, 255, 0.42)`}
                  style={{
                    color: '#fff',
                    borderBottomColor: '#fff',
                    borderBottomWidth: 1,
                    width: width * 0.9,
                    fontSize: 20,
                    paddingVertical: 12,
                  }}
                />
                <Text style={styles.durationTitle}>기간</Text>
                <View>
                  <View
                    style={{
                      ...styles.durationCell,
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}>
                    <Text style={styles.durationText}>하루 종일</Text>
                    <Switch
                      onValueChange={handleAllDayLong}
                      value={durationAllDayLong}
                    />
                  </View>
                  <View style={styles.durationCell}>
                    {isPlatformIOS ? (
                      <Body3>시작하는 시간</Body3>
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() => setStartDatePickerVisible(true)}>
                          <Text style={styles.durationText}>
                            {`${meetingStartDateTime.getFullYear()}년 ${
                              meetingStartDateTime.getMonth() + 1
                            }월 ${meetingStartDateTime.getDate()}일`}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={durationAllDayLong}
                          onPress={() => setStartTimePickerVisible(true)}>
                          <Text
                            style={
                              durationAllDayLong
                                ? {...styles.durationText, color: 'gray'}
                                : styles.durationText
                            }>
                            {`${meetingStartDateTime.getHours()}시 ${meetingStartDateTime.getMinutes()}분부터`}
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {startDatePickerVisible && (
                      <DateTimePicker
                        value={meetingStartDateTime}
                        minimumDate={sourceDate}
                        onChange={handleStartPicker}
                        style={{width: 250}}
                        themeVariant="dark"
                        minuteInterval={5}
                        locale="ko-KR"
                        mode={isPlatformIOS ? 'datetime' : 'date'}
                      />
                    )}
                    {!isPlatformIOS && startTimePickerVisible && (
                      <DateTimePicker
                        value={meetingStartDateTime}
                        minimumDate={sourceDate}
                        onChange={handleStartPicker}
                        minuteInterval={5}
                        locale="ko-KR"
                        mode="time"
                        display="spinner"
                      />
                    )}
                  </View>
                  <View
                    style={{
                      ...styles.durationCell,
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                      borderBottomWidth: 0,
                    }}>
                    {isPlatformIOS ? (
                      <Body3>끝나는 시간</Body3>
                    ) : (
                      <>
                        <TouchableOpacity
                          disabled={durationAllDayLong}
                          onPress={() => setEndDatePickerVisible(true)}>
                          <Text
                            style={
                              durationAllDayLong
                                ? {...styles.durationText, color: 'gray'}
                                : styles.durationText
                            }>
                            {`${meetingEndDateTime.getFullYear()}년 ${
                              meetingEndDateTime.getMonth() + 1
                            }월 ${meetingEndDateTime.getDate()}일`}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={durationAllDayLong}
                          onPress={() => setEndTimePickerVisible(true)}>
                          <Text
                            style={
                              durationAllDayLong
                                ? {...styles.durationText, color: 'gray'}
                                : styles.durationText
                            }>
                            {`${meetingEndDateTime.getHours()}시 ${meetingEndDateTime.getMinutes()}분까지`}
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {endDatePickerVisible && (
                      <DateTimePicker
                        value={meetingEndDateTime}
                        minimumDate={meetingStartDateTime}
                        onChange={handleEndPicker}
                        style={{width: 250}}
                        themeVariant="dark"
                        minuteInterval={5}
                        locale="ko-KR"
                        mode={isPlatformIOS ? 'datetime' : 'date'}
                        disabled={durationAllDayLong}
                      />
                    )}
                    {!isPlatformIOS && endTimePickerVisible && (
                      <DateTimePicker
                        value={meetingEndDateTime}
                        minimumDate={meetingStartDateTime}
                        onChange={handleEndPicker}
                        minuteInterval={5}
                        locale="ko-KR"
                        mode="time"
                        display="spinner"
                      />
                    )}
                  </View>
                </View>
                <Text style={styles.durationTitle}>장소</Text>
                <TouchableOpacity
                  style={styles.placeContainer}
                  onPress={handleAddPlace}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={26}
                    color="#fff"
                  />
                  <Text style={{color: '#fff', marginLeft: 10}}>장소 검색</Text>
                </TouchableOpacity>
                <Text style={styles.durationTitle}>활동</Text>
                <View
                  style={{
                    width: 0.9 * width,
                  }}>
                  <FlatList
                    data={activityList}
                    renderItem={activityListLayout}
                    numColumns={4}
                  />
                </View>
                <Button
                  title="저장"
                  onPress={handleCreateMeeting}
                  style={{
                    width: width * 0.9,
                    borderWidth: 0,
                    marginTop: 20,
                  }}
                />
              </View>
            </>
          )}
        </View>
      </Modal>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  durationTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  durationCell: {
    backgroundColor: '#3a3a3a',
    height: 50,
    alignItems: 'center',
    padding: 12,
    borderBottomColor: `rgba(255, 255, 255, 0.42)`,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationText: {
    color: '#fff',
  },
  placeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    padding: 12,
    borderRadius: 12,
  },
  activityCell: {
    flex: 1,
    height: 44,
    backgroundColor: '#3a3a3a',
    marginBottom: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default MeetingListScreen;
