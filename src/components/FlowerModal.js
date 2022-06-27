import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  Body3,
  Heading3,
  Heading4,
  Heading5,
  Tiny,
} from './design-system/FontSystem';
import {
  CalendarIcon,
  ChevronLeftIcon,
  MapMarkerIcon,
} from './design-system/IconSystem';
import {
  NEUTRAL_800,
  NEUTRAL_850,
  NEUTRAL_900,
  NEUTRAL_950,
  PRIMARY_500,
} from './design-system/ColorSystem';
import LinearGradient from 'react-native-linear-gradient';
import {gardenFlowerImagePath} from '../screens/main-tabs/garden-tab/imagePath';
import {useDispatch} from 'react-redux';
import {findPosts} from '../redux/slices/flower';

const FlowerModal = ({groupId, flowerId, isVisible, onClose, modalStyle}) => {
  const [postsInfo, setPostsInfo] = useState(null);
  const sizeIndex = flowerId % 3;

  const dispatch = useDispatch();

  const colors = [
    '#A396FF',
    '#D3F463',
    '#406AFF',
    // '#FF5E3A',
    // '#FFD7B1',
    // '#47FE7A',
    // '#F7C1CF',
    '#0ABAAB',
    '#FDBC2A',
    '#C6B8F5',
  ];

  const optionId = [1, 2, 3, 4];

  const onModalShow = () => {
    console.log(groupId, flowerId);
    dispatch(findPosts({groupId, flowerId}))
      .unwrap()
      .then(res => {
        // console.log(JSON.stringify(res));
        setPostsInfo(res);
      })
      .catch(err => console.log(err));
  };
  const [categories, setCategories] = useState('');
  const [meetingInfo, setMeetingInfo] = useState(null);

  useEffect(() => {
    if (postsInfo) {
      console.log(JSON.stringify(postsInfo));
      setMeetingInfo([
        {head: '약속 제목', tail: postsInfo.meeting.title},
        {
          head: '참여자',
          // tail: postsInfo.meeting.users.map(users => users.name).toString(),
          tail: '김혜령, 김채린, 류하경',
        },
        {head: '기간', tail: postsInfo.meeting.start.split('/')[0]},
        {
          head: '장소',
          tail: postsInfo.meeting.places.map(places => places.name).toString(),
        },
      ]);
      setCategories(postsInfo.meeting.activities.map(act => act.category));
    }
  }, [postsInfo]);

  const handleModalClose = () => {
    setPostsInfo(null);
    setMeetingInfo(null);
  };

  const questionCardLayout = ({item, index}) => {
    const answersArray = postsInfo.posts[0].answers.map(
      answer => answer.content,
    );
    const answersWithQ = postsInfo.posts[0].answers.map(answer => {
      return {content: answer.content, questionId: answer.questionId};
    });

    const freeAnswer = answersWithQ.filter(val => val.questionId === item.id);

    return (
      <View
        style={{
          width: 0.6 * width,
          height: 0.4 * height,
          backgroundColor: colors[index],
          padding: 12,
          borderRadius: 16,
          marginRight: 6,
          marginTop: 12,
        }}>
        <Tiny style={{color: NEUTRAL_950}}>
          {index + 1}/{postsInfo.posts[0].questions.length}
        </Tiny>
        <Heading5 style={{color: NEUTRAL_950, marginTop: 5}} numberOfLines={2}>
          {item.content}
        </Heading5>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            marginTop: 7,
          }}
        />
        {Object.keys(item.options).length > 0 ? (
          optionId.map(val => {
            const selected = answersArray.includes(item.options[val]);
            return (
              <View
                key={val}
                style={{
                  height: 35,
                  borderRadius: 6,
                  marginTop: val === 1 ? 16 : 8,
                  padding: 10,
                  backgroundColor: selected ? '#fff' : '#111214',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'SUIT-Regular',
                    fontSize: 9,
                    color: selected ? '#111214' : '#fff',
                  }}>
                  {item.options[val]}
                </Text>
              </View>
            );
          })
        ) : (
          <View
            style={{
              height: 164,
              backgroundColor: 'rgba(255,255,255,0.3)',
              marginTop: 16,
              borderRadius: 6,
              padding: 10,
            }}>
            <Text
              style={{
                fontFamily: 'SUIT-Regular',
                fontSize: 12,
                color: '#111214',
              }}>
              {freeAnswer[0].content}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const {width, height} = Dimensions.get('window');

  return (
    <Modal
      isVisible={isVisible}
      style={modalStyle}
      onModalHide={handleModalClose}
      onModalShow={onModalShow}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      onBackButtonPress={onClose}
      propagateSwipe>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '95%',
          backgroundColor: NEUTRAL_850,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: width,
            justifyContent: 'space-around',
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
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 16,
          }}>
          <TouchableOpacity onPress={onClose}>
            <ChevronLeftIcon />
          </TouchableOpacity>
          <Heading3>기록보기</Heading3>
          <TouchableOpacity disabled>
            <Heading5 style={{color: PRIMARY_500}}>편집</Heading5>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={['rgba(255,255,255,0)', '#010101']}
            style={{
              paddingTop: 16,
              width: '100%',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            {sizeIndex === 1 && (
              <Image
                source={gardenFlowerImagePath[flowerId]}
                style={{width: 52, height: 72}}
                resizeMode="contain"
              />
            )}
            {sizeIndex === 2 && (
              <Image
                source={gardenFlowerImagePath[flowerId]}
                style={{width: 52, height: 104}}
                resizeMode="contain"
              />
            )}
            {sizeIndex === 0 && (
              <Image
                source={gardenFlowerImagePath[flowerId]}
                style={{width: 58, height: 148}}
                resizeMode="contain"
              />
            )}
          </LinearGradient>
          {postsInfo && (
            <View style={{marginTop: 24, marginHorizontal: 16}}>
              <Heading4>약속 정보</Heading4>
              <View style={{marginTop: 12}}>
                {meetingInfo &&
                  meetingInfo.map((val, idx) => {
                    const first = idx === 0;
                    const last = idx === meetingInfo.length - 1;
                    return (
                      <View
                        key={idx}
                        style={{
                          backgroundColor: NEUTRAL_900,
                          borderTopLeftRadius: first ? 8 : 0,
                          borderTopRightRadius: first ? 8 : 0,
                          borderBottomLeftRadius: last ? 8 : 0,
                          borderBottomRightRadius: last ? 8 : 0,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 16,
                          borderBottomColor: NEUTRAL_800,
                          borderBottomWidth: last ? 0 : 1,
                        }}>
                        <Body3>{val.head}</Body3>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          {idx === 2 && <CalendarIcon size={24} color="#fff" />}
                          {idx === 3 && (
                            <MapMarkerIcon size={20} color="#fff" />
                          )}
                          <Body3 style={{marginLeft: idx === 2 ? 5 : 0}}>
                            {val.tail}
                          </Body3>
                        </View>
                      </View>
                    );
                  })}
              </View>
              <Heading4 style={{marginTop: 24}}>카테고리</Heading4>
              <View style={{flexDirection: 'row'}}>
                {categories
                  ? categories.map((val, idx) => {
                      return (
                        <View
                          key={val}
                          style={{
                            backgroundColor: NEUTRAL_900,
                            width: 74,
                            height: 44,
                            marginRight: 8,
                            marginTop: 12,
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Heading5 style={{color: colors[idx]}}>
                            {val}
                          </Heading5>
                        </View>
                      );
                    })
                  : null}
              </View>
              <View
                style={{
                  marginTop: 24,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Heading4>기록</Heading4>
                <TouchableOpacity disabled>
                  <Body3 style={{color: PRIMARY_500}}>모두 보기</Body3>
                </TouchableOpacity>
              </View>
              <FlatList
                data={postsInfo.posts[0].questions}
                renderItem={questionCardLayout}
                keyExtractor={(item, index) => item.content}
                horizontal
              />
              <View
                style={{
                  marginTop: 24,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Heading4>사진 기록</Heading4>
                <TouchableOpacity disabled>
                  <Body3 style={{color: PRIMARY_500}}>모두 보기</Body3>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: width * 0.25,
                  height: width * 0.25,
                  marginBottom: 30,
                  marginTop: 12,
                }}>
                {postsInfo.meeting.images.map((image, idx) => {
                  console.log(image.location);
                  return (
                    <Image
                      key={idx}
                      source={{uri: image.location}}
                      style={{
                        flex: 1,
                        marginRight: 12,
                        marginBottom: 12,
                        borderRadius: 8,
                      }}
                    />
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default FlowerModal;
