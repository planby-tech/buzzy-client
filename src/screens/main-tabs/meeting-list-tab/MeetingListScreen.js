import React, {useEffect, useState, useCallback} from 'react';
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
  Image,
  Keyboard,
} from 'react-native';
import {
  ExpandableCalendar,
  LocaleConfig,
  CalendarProvider,
  WeekCalendar,
} from 'react-native-calendars';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {useSelector, useDispatch} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {MainWrapper} from '../../../components/common/MainWrapper';
import Button from '../../../components/common/SubmitButton';
import {
  Body3,
  Heading3,
  Heading4,
} from '../../../components/design-system/FontSystem';
import {GREEN_COLOR} from '../../../common/colors';

import {createMeeting} from '../../../redux/slices/meeting';
import {readMeetings} from '../../../redux/slices/group';

import Profile1 from '../../../assets/images/Profile-1.png';

import MeetingBlock from '../../../components/MeetingBlock';
import {PlusIcon} from '../../../components/design-system/IconSystem';

const MeetingListScreen = ({groupInfo}) => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const userId = user.user?.id;
  // const userId =
  const {groupArray} = useSelector(state => state.user);

  const dateToStr = date => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    return {
      year: year,
      month: month,
      day: day,
      dateString: `${year}-${month.length > 1 ? month : '0' + month}-${
        day.length > 1 ? day : '0' + day
      }`,
    };
  };

  const [sourceDate, setSourceDate] = useState(new Date());

  const [today, setToday] = useState(dateToStr(sourceDate));
  const [selectedDay, setSelectedDay] = useState(today); // to initialize the meeting start and end day as the selected day on the calendar.
  const [selectedDate, setSelectedDate] = useState({}); // to express the selected day on the calendar with green circle background.
  const [markedDates, setMarkedDates] = useState({});
  const [meetingDates, setMeetingDates] = useState({});
  const [meetingBlockVisible, setMeetingBlockVisible] = useState(false);
  const [meetingArray, setMeetingArray] = useState(null);
  const [selectedMeetings, setSelectedMeetings] = useState(null);
  // const [selectedGroup, setSelectedGroup] = useState({id: 0});
  const [modalVisible, setModalVisible] = useState(false);
  // const [isGroupSelected, setIsGroupSelected] = useState(false);
  // const [groupSubmitted, setGroupSubmitted] = useState(false);
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
    monthNamesShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  };
  LocaleConfig.defaultLocale = 'kr';

  const calendarTheme = {
    backgroundColor: '#000',
    calendarBackground: '#000',
    monthTextColor: '#fff',
    arrowColor: GREEN_COLOR,
    dayTextColor: '#fff',
    textDisabledColor: '#2b2b2b',
    todayTextColor: GREEN_COLOR,
    selectedDayBackgroundColor: '#202225',
    dotColor: GREEN_COLOR,
    selectedDotColor: GREEN_COLOR,
    textDayFontFamily: 'SUIT-Regular',
    textMonthFontFamily: 'SUIT-Regular',
    textDayHeaderFontFamily: 'SUIT-Regular',
    textDayFontSize: 14,
  };

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

  // useEffect(() => {
  //   const groupId = groupInfo.id;
  //   if (groupId !== 0) {
  //     dispatch(findByGroup({userId: userId, groupId: groupId})).then(res => {
  //       const loadedUserList = res.payload.map(val => val.id);
  //       setUserList(loadedUserList);
  //     });
  //   }
  // }, [selectedGroup]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setSourceDate(new Date());

      setToday(dateToStr(sourceDate));

      const groupId = groupInfo.id;

      const loadedUserList = groupInfo.users.map(val => val.UserGroups.userId);
      setUserList(loadedUserList);

      dispatch(readMeetings({userId, groupId, month: '06'}))
        .unwrap()
        .then(meetingArray => {
          console.log(JSON.stringify(meetingArray));
          setMeetingArray(meetingArray);
          const meetingInfoArray = meetingArray.map(val => {
            const startArray = val.start.split('/');
            const endArray = val.end.split('/');
            return {
              startDate: startArray[0],
              startTime: startArray[1],
              endDate: endArray[0],
              endTime: endArray[1],
              title: val.title,
              duration: val.duration,
            };
          });
          let cp = {...meetingDates};
          for (let meetingInfo of meetingInfoArray) {
            cp[`${meetingInfo.startDate}`] = {
              marked: true,
              // startingDay:
              //   meetingInfo.duration &&
              //   meetingInfo.duration[`${meetingInfo.startDate}`]?.start,
            };
            // cp[`${meetingInfo.endDate}`] = {
            //   marked: true,
            //   // endingDay:
            //   //   meetingInfo.duration &&
            //   //   meetingInfo.duration[`${meetingInfo.endDate}`]?.end,
            // };
          }
          setMeetingDates(cp);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    setMarkedDates({...selectedDate, ...meetingDates});
  }, [selectedDate]);
  useEffect(() => {
    setMarkedDates({...selectedDate, ...meetingDates});
  }, [meetingDates]);

  useEffect(() => {
    const meetingYear = meetingStartDateTime.getFullYear();
    const meetingMonthIdx = meetingStartDateTime.getMonth();
    const meetingDate = meetingStartDateTime.getDate();
    if (durationAllDayLong) {
      setMeetingEndDateTime(
        new Date(meetingYear, meetingMonthIdx, meetingDate, 23, 59),
      );
    }
    if (!durationAllDayLong) {
      const meetingHour = meetingStartDateTime.getHours();
      const meetingMinute = meetingStartDateTime.getMinutes();

      setMeetingEndDateTime(
        new Date(
          meetingYear,
          meetingMonthIdx,
          meetingDate,
          meetingHour + 1,
          meetingMinute,
        ),
      );
    }
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
    // setGroupSubmitted(false);
    // setIsGroupSelected(false);
    // setSelectedGroup({id: 0});
    setModalVisible(false);
    setActivityList(initialActivityList);
    setMeetingTitle('');
    setDurationAllDayLong(false);
    setMeetingStartDateTime(sourceDate);
    setMeetingEndDateTime(sourceDate);
  };

  const handleSelectDay = day => {
    console.log(day);
    setSelectedDay(day);
    const filtered = meetingArray.filter(
      val => val.start.split('/')[0] === day.dateString,
    );
    setSelectedMeetings(filtered);
    setSelectedDate({});
    const cp = {};
    cp[`${day.dateString}`] = {selected: true};
    setSelectedDate(cp);
    setMeetingBlockVisible(true);
  };

  const handleAllDayLong = () => {
    setDurationAllDayLong(prev => !prev);
  };

  // const handleNavigateToNFC = () => {
  //   navigation.navigate('NFCTag');
  // };

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
        name: '이화여자대학교 조형예술대학 A동',
        latitude: 37.5610609486686,
        longitude: 126.948067642,
      },
    ]);
  };

  const handleCreateMeeting = () => {
    const groupId = groupInfo.id;
    // const activityIdList = activityList
    //   .filter(val => val.selected)
    //   .map(val => val.id);
    const meetingObject = {
      groupId: groupId,
      title: meetingTitle === '' ? `${groupInfo.name}의 약속` : meetingTitle,
      start: meetingStartDateTime,
      end: meetingEndDateTime,
      allDay: durationAllDayLong,
      // places: placeList,
      places: [
        {
          name: '이화여자대학교 조형예술대학 A동',
          latitude: 37.5610609486686,
          longitude: 126.948067642,
        },
      ],
      // activities: activityIdList,
      activities: [999],
      users: [1],
    };
    dispatch(createMeeting(meetingObject))
      .unwrap()
      .then(res => {
        console.log(res);
        handleModalClose();
      })
      .catch(err => console.log(err));
  };

  // const groupListLayout = ({item}) => {
  //   const handleSelectGroup = () => {
  //     // setSelectedGroup(item);
  //     setIsGroupSelected(true);
  //   };
  //   const checkColor = item.id === groupInfo.id ? GREEN_COLOR : '#fff';

  //   return (
  //     <TouchableOpacity
  //       style={{
  //         width: 0.9 * width,
  //         height: 68,
  //         backgroundColor: '#3A3A3A',
  //         borderRadius: 12,
  //         padding: 12,
  //         paddingRight: 16,
  //         marginBottom: 20,
  //       }}
  //       onPress={handleSelectGroup}
  //       activeOpacity={0.5}>
  //       <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
  //         <Text
  //           style={{
  //             color: '#fff',
  //             fontSize: 16,
  //             fontFamily: 'Pretendard-SemiBold',
  //             lineHeight: 20,
  //           }}
  //           numberOfLines={3}>
  //           {item.name}
  //         </Text>
  //         <View>
  //           <MaterialCommunityIcons
  //             name="check-circle-outline"
  //             size={24}
  //             color={checkColor}
  //           />
  //         </View>
  //       </View>
  //       <Text style={{color: '#fff', fontSize: 12}}>{item.users[0].name}</Text>
  //     </TouchableOpacity>
  //   );
  // };

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
        <Body3>{item.name}</Body3>
      </TouchableOpacity>
    );
  };

  return (
    <MainWrapper>
      <View
        style={{
          margin: 16,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 0,
        }}>
        <Image
          source={Profile1}
          style={{width: 28, height: 28, marginRight: 12}}
          resizeMode="contain"
        />
        <Heading3 style={{flex: 1}}>약속리스트</Heading3>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{width: 28, height: 28}}>
          <PlusIcon size={28} />
        </TouchableOpacity>
      </View>
      {/* <View
        style={{
          margin: 16,
          marginBottom: 12,
          paddingHorizontal: 17,
          paddingTop: 14,
          paddingBottom: 12,
          backgroundColor: '#1c1c1e',
          borderRadius: 15,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Heading3>우리 밥 한끼 어때?</Heading3>
            <Body3>[{groupInfo.name}] 정원의 가드너들을</Body3>
            <Body3>깨우고 약속을 잡아보세요.</Body3>
          </View>
          <View style={{marginRight: 25}}>
            <GardenerImage />
          </View>
        </View>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: '#111',
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
            콕 찔러보기
          </Text>
        </TouchableOpacity>
      </View> */}

      {/* <Calendar
        // markingType={'multi-period'}
        theme={calendarTheme}
        onDayPress={day => handleSelectDay(day)}
        markedDates={markedDates}
      /> */}

      {today.dateString.length > 0 && (
        <View style={{height: 135, marginTop: 16}}>
          <CalendarProvider date={today.dateString}>
            <ExpandableCalendar
              initialDate={today.dateString}
              initialPosition="closed"
              allowShadow={false}
              // calendarWidth={0.925 * width}
              theme={calendarTheme}
              onDayPress={day => handleSelectDay(day)}
              markedDates={markedDates}
              futureScrollRange={0}
              pastScrollRange={0}
              disablePan
              hideKnob
            />
            {/* <WeekCalendar
              theme={calendarTheme}
              // calendarWidth={0.925 * width}
              allowShadow={false}
              onDayPress={day => handleSelectDay(day)}
              markedDates={{...selectedDate}}
              pastScrollRange={0}
              futureScrollRange={0}
              scrollEnabled={false}
            /> */}
          </CalendarProvider>
        </View>
      )}
      {meetingBlockVisible && selectedMeetings.length > 0 ? (
        <ScrollView
          style={{
            margin: 16,
            marginBottom: 8,
            borderRadius: 16,
          }}>
          {selectedMeetings.map((val, idx) => {
            return (
              <MeetingBlock
                groupInfo={groupInfo}
                meetingInfo={val}
                navigation={navigation}
                key={idx}
              />
            );
          })}
        </ScrollView>
      ) : (
        <View
          style={{
            width: '100%',
            height: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Heading4 style={{color: '#ccc'}}>약속이 없는 상태입니다.</Heading4>
        </View>
      )}

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
            height: '93%',
            backgroundColor: '#121415',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View
            style={{
              backgroundColor: '#414141',
              width: 48,
              height: 5,
              borderRadius: 3,
              marginTop: 8,
            }}
          />
          {/* {!groupSubmitted ? (
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
          ) : ( */}
          <>
            <Heading3 style={styles.modalTitle}>약속 생성</Heading3>
            <View>
              <TextInput
                onChangeText={e => setMeetingTitle(e)}
                value={meetingTitle}
                placeholder={`${groupInfo.name}의 약속`}
                placeholderTextColor={`rgba(255, 255, 255, 0.42)`}
                onEndEditing={Keyboard.dismiss}
                style={{
                  color: '#fff',
                  borderBottomColor: '#fff',
                  borderBottomWidth: 1,
                  width: width * 0.9,
                  fontSize: 20,
                  paddingVertical: 12,
                }}
              />
              <Heading4 style={styles.durationTitle}>기간</Heading4>
              <View>
                <View
                  style={{
                    ...styles.durationCell,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}>
                  <Body3>하루 종일</Body3>
                  <Switch
                    onValueChange={handleAllDayLong}
                    value={durationAllDayLong}
                    thumbColor={durationAllDayLong ? GREEN_COLOR : '#fff'}
                  />
                </View>
                <View style={styles.durationCell}>
                  {isPlatformIOS ? (
                    <Body3>시작하는 시간</Body3>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => setStartDatePickerVisible(true)}>
                        <Body3>
                          {`${meetingStartDateTime.getFullYear()}년 ${
                            meetingStartDateTime.getMonth() + 1
                          }월 ${meetingStartDateTime.getDate()}일`}
                        </Body3>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={durationAllDayLong}
                        onPress={() => setStartTimePickerVisible(true)}>
                        <Body3
                          style={
                            durationAllDayLong
                              ? {...styles.durationText, color: 'gray'}
                              : styles.durationText
                          }>
                          {`${meetingStartDateTime.getHours()}시 ${meetingStartDateTime.getMinutes()}분부터`}
                        </Body3>
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
                        <Body3
                          style={
                            durationAllDayLong
                              ? {...styles.durationText, color: 'gray'}
                              : styles.durationText
                          }>
                          {`${meetingEndDateTime.getFullYear()}년 ${
                            meetingEndDateTime.getMonth() + 1
                          }월 ${meetingEndDateTime.getDate()}일`}
                        </Body3>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={durationAllDayLong}
                        onPress={() => setEndTimePickerVisible(true)}>
                        <Body3
                          style={
                            durationAllDayLong
                              ? {...styles.durationText, color: 'gray'}
                              : styles.durationText
                          }>
                          {`${meetingEndDateTime.getHours()}시 ${meetingEndDateTime.getMinutes()}분까지`}
                        </Body3>
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
              <Heading4 style={styles.durationTitle}>장소</Heading4>
              <TouchableOpacity
                style={styles.placeContainer}
                onPress={handleAddPlace}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={26}
                  color="#fff"
                />
                <Body3 style={{marginLeft: 10}}>
                  이화여자대학교 조형예술대학 A동
                </Body3>
              </TouchableOpacity>
              <Heading4 style={styles.durationTitle}>활동</Heading4>
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
        </View>
      </Modal>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  durationTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  durationCell: {
    backgroundColor: '#202225',
    height: 50,
    alignItems: 'center',
    padding: 12,
    borderBottomColor: `rgba(255, 255, 255, 0.42)`,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202225',
    padding: 12,
    borderRadius: 12,
  },
  activityCell: {
    flex: 1,
    height: 44,
    backgroundColor: '#202225',
    marginBottom: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default MeetingListScreen;
