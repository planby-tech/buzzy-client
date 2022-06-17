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
} from 'react-native';
import {
  ExpandableCalendar,
  Calendar,
  LocaleConfig,
  Agenda,
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
  Heading5,
  Tiny,
} from '../../../components/design-system/FontSystem';
import {
  ClockIcon,
  LeafIcon,
  MenuDotsIcon,
  PersonIcon,
} from '../../../components/design-system/IconSystem';
import GardenerImage from '../../../assets/images/Gardener';
import {GREEN_COLOR} from '../../../common/colors';
import NoFlower from '../../../assets/images/no-flower.png';

import {createMeeting} from '../../../redux/slices/meeting';
import {findByGroup, readMeetings} from '../../../redux/slices/group';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {API_URL} from '../../../common/constant';

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
  const [selectedMeeting, setSelectedMeeting] = useState(null);
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
    selectedDayBackgroundColor: '#1c1c1e',
    dotColor: GREEN_COLOR,
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
    setSourceDate(new Date());

    console.log(today.dateString);

    const groupId = groupInfo.id;

    const loadedUserList = groupInfo.users.map(val => val.UserGroups.userId);
    setUserList(loadedUserList);

    dispatch(readMeetings({userId, groupId, month: '06'}))
      .unwrap()
      .then(meetingArray => {
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
        console.log(JSON.stringify(meetingInfoArray));
        const cp = {...meetingDates};
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
        console.log(cp);
        setMeetingDates(cp);
      });
  }, [isFocused]);

  useEffect(() => {
    setMarkedDates({...selectedDate, ...meetingDates});
  }, [selectedDate]);
  useEffect(() => {
    setMarkedDates({...selectedDate, ...meetingDates});
  }, [meetingDates]);

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
    // setGroupSubmitted(false);
    // setIsGroupSelected(false);
    // setSelectedGroup({id: 0});
    setActivityList(initialActivityList);
    setMeetingTitle('');
    setModalVisible(false);
    setDurationAllDayLong(false);
    setMeetingStartDateTime(sourceDate);
    setMeetingEndDateTime(sourceDate);
  };

  const handleSelectDay = day => {
    console.log(day);
    setSelectedDay(day);
    setSelectedDate({});
    const cp = {};
    cp[`${day.dateString}`] = {selected: true};

    console.log(cp);
    setSelectedDate(cp);
    setMeetingBlockVisible(true);
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
        name: '이화여자대학교 조형예술대학 A동',
        latitude: 37.5610609486686,
        longitude: 126.948067642,
      },
    ]);
  };

  const handleCreateMeeting = () => {
    const groupId = groupInfo.id;
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
    dispatch(createMeeting(meetingObject))
      .unwrap()
      .then(res => {
        console.log(res);
        handleModalClose();
      })
      .catch(err => console.log(err));
  };

  const [imageOptions, setImageOptions] = useState({
    // saveToPhotos: true,
    mediaType: 'photo',
    includeBase64: false,
    quality: 0.3,
    selectionLimit: 0,
  });

  const handleChooseImage = (type, options) => {
    if (type === 'capture') {
      launchCamera(options, photos => {
        const data = new FormData();

        data.append('photo', {
          name: photos.assets[0].fileName,
          type: photos.assets[0].type,
          uri: photos.assets[0].uri,
        });

        console.log(JSON.stringify(data));

        fetch(`${API_URL}/image`, {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(response => {
            console.log('response', response.data);
          })
          .catch(error => {
            console.log('error', error);
          });
      });
    } else {
      launchImageLibrary(options, photos => {
        const data = new FormData();
        const imageArray = photos.assets?.map(val => {
          return {
            name: val.fileName,
            type: val.type,
            uri: val.uri,
          };
        });

        console.log(JSON.stringify(imageArray));

        data.append('photo', imageArray);

        console.log(JSON.stringify(data));

        fetch(`${API_URL}/image`, {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(response => {
            console.log('response', response.data);
          })
          .catch(error => {
            console.log('error', error);
          });
      });
    }
  };

  const handleNavigateToPost = () => {
    navigation.navigate('Post', {groupInfo: groupInfo});
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
    <MainWrapper edgeSpacing={16}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15,
        }}>
        <Heading3 style={{flex: 1}}>약속리스트</Heading3>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingHorizontal: 17,
          paddingTop: 14,
          paddingBottom: 12,
          backgroundColor: '#1c1c1e',
          borderRadius: 15,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Heading3>우리 밥 한끼 어때?</Heading3>
            <Body3>
              [우리끼리] 정원의 가드너들을{`\n`}깨우고 약속을 잡아보세요.
            </Body3>
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
      </View>
      {/* <Calendar
        // markingType={'multi-period'}
        theme={calendarTheme}
        onDayPress={day => handleSelectDay(day)}
        markedDates={markedDates}
      /> */}

      {today.dateString.length > 0 && (
        <View style={{height: 130}}>
          <CalendarProvider date={today.dateString}>
            <ExpandableCalendar
              initialPosition="closed"
              allowShadow={false}
              calendarWidth={0.925 * width}
              calendarStyle={{flex: 0}}
              theme={calendarTheme}
              onDayPress={day => handleSelectDay(day)}
              markedDates={markedDates}
              pagingEnabled={true}
              futureScrollRange={0}
              pastScrollRange={0}
              disablePan
              hideKnob
            />
            {/* <WeekCalendar
          theme={calendarTheme}
          calendarWidth={0.925 * width}
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
      {meetingBlockVisible && (
        <View
          style={{
            backgroundColor: '#202225',
            borderRadius: 12,
            padding: 12,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Tiny>이화여자대학교 가든</Tiny>
              <Heading3 style={{marginTop: 4}}>가든 제목 1의 약속</Heading3>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <PersonIcon size={16} />
                <Tiny> 익명 1, 익명 2, 익명 3</Tiny>
              </View>
              <View style={{flexDirection: 'row', marginTop: 4}}>
                <ClockIcon size={16} />
                <Tiny> 하루종일</Tiny>
              </View>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <Image
                source={NoFlower}
                style={{width: 60, height: 60, marginRight: 30, bottom: 15}}
                resizeMode="contain"
              />
            </View>
          </View>
          <TouchableOpacity style={{position: 'absolute', right: 16, top: 16}}>
            <MenuDotsIcon size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#111',
              height: 40,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <Heading5>기록하기</Heading5>
          </TouchableOpacity>
        </View>
      )}
      {/* <Button
        title="이미지 업로드"
        onPress={() => handleChooseImage('capture', imageOptions)}
      />
      <Button
        title="기록하기"
        style={{marginTop: 12}}
        onPress={handleNavigateToPost}
      /> */}

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
            <Text style={styles.modalTitle}>약속 생성</Text>
            <View>
              <TextInput
                onChangeText={e => setMeetingTitle(e)}
                value={meetingTitle}
                placeholder={`${groupInfo.name}의 약속`}
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
                <Body3 style={{marginLeft: 10}}>
                  이화여자대학교 조형예술대학 A동
                </Body3>
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
