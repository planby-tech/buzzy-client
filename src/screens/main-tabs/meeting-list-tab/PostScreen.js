import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {MainWrapper} from '../../../components/common/MainWrapper';
import ScreenHeader from '../../../components/common/ScreenHeader';
import {
  Body3,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
} from '../../../components/design-system/FontSystem';

import VisualDesign from '../../../assets/images/visual-design.png';
import EwhaLogo from '../../../assets/images/ewha-logo.png';
import Capture from '../../../assets/images/capture.png';
import NoFlower from '../../../assets/images/no-flower.png';
import Button from '../../../components/common/SubmitButton';
import {generateQuestion} from '../../../redux/slices/question';
import {useDispatch} from 'react-redux';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {API_URL} from '../../../common/constant';
import {createPost} from '../../../redux/slices/post';
import {uploadPostImage} from '../../../redux/slices/image';
import {postFlowerImagePath} from '../garden-tab/imagePath';
import {NEUTRAL_WHITE} from '../../../components/design-system/ColorSystem';

const PostScreen = ({navigation, route}) => {
  const {width, height} = Dimensions.get('window');
  const meetingId = route.params.meetingInfo.id;
  const userId = route.params.userId;
  const groupInfo = route.params.groupInfo;
  const groupId = route.params.groupInfo.id;

  const dispatch = useDispatch();

  const backgroundColors = [
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

  const optionsId = [1, 2, 3, 4];

  const [questionArray, setQuestionArray] = useState([]);
  const [answerArray, setAnswerArray] = useState([]);
  const [cardRef, setCardRef] = useState(null);
  const [photoData, setPhotoData] = useState(new FormData());
  const [photoUri, setPhotoUri] = useState(null);

  const [isPostSubmitted, setIsPostSubmitted] = useState(false);
  const [flowerId, setFlowerId] = useState(0);

  const [goNext, setGoNext] = useState(false);

  useEffect(() => {
    dispatch(generateQuestion({meetingId, userId}))
      .unwrap()
      .then(questionArray => {
        questionArray.push({
          content: '사진을 직접 촬영해서 기록해 주세요.',
          options: {},
        });
        questionArray.push({});
        setQuestionArray(questionArray);
      });
  }, []);

  useEffect(() => {
    console.log(answerArray);
  }, [answerArray]);

  const handleSelectOption = (index, val) => {
    // index = 문제 번호 - 1, val = 옵션 번호
    let cp = [...answerArray];
    const answerObject = {
      question: questionArray[index].content,
      answer: questionArray[index].options[val],
    };
    const filteredAnswer = answerArray.filter(
      qa => qa.question !== answerObject.question,
    ); //질문이 같은 object를 걸러냄.
    if (filteredAnswer.length < cp.length) {
      // 질문이 같은 걸 걸러냈는데 원래보다 길이가 짧아짐, 즉 이미 답변이 된 질문에 대한 답을 다시 고른 경우
      cp = [...filteredAnswer];
      // cp를 걸러낸 배열로 다시 설정함으로써 해당 질문이 같은 object를 cp에서 제거함.
    }
    cp.push(answerObject);
    setAnswerArray(cp);
    if (index < questionArray.length - 1)
      cardRef.scrollToIndex({
        animated: true,
        index: index + 1,
        viewPosition: 0.5,
      });
  };

  const handleInputText = (input, index) => {
    console.log(input, index);
    let cp = [...answerArray];
    const answerObject = {
      question: questionArray[index].content,
      answer: input,
    };
    const filteredAnswer = cp.filter(
      qa => qa.question !== questionArray[index].content,
    );
    if (filteredAnswer.length < cp.length) {
      cp = [...filteredAnswer];
    }
    cp.push(answerObject);
    setAnswerArray(cp);
    if (index < questionArray.length - 1)
      cardRef.scrollToIndex({
        animated: true,
        index: index + 1,
        viewPosition: 0.5,
      });
  };

  const handleCreatePost = () => {
    setIsPostSubmitted(true);
    const postObject = {
      groupId: groupId,
      meetingId: meetingId,
      userId: userId,
      questionAnswers: answerArray,
    };
    dispatch(createPost(postObject))
      .unwrap()
      .then(res => {
        console.log(res);
        setFlowerId(res.flower.id);
        setIsPostSubmitted(false);
        console.log(JSON.stringify(photoData));
        dispatch(uploadPostImage({postId: res.post.id, photoData: photoData}))
          .unwrap()
          .then(res => {
            console.log(res);
          })
          .catch(err => console.log(err));
        setPhotoData(null);
        cardRef.scrollToIndex({
          index: questionArray.length - 1,
          viewPosition: 0.5,
        });
      })
      .catch(err => {
        console.log(err);
        setIsPostSubmitted(false);
      });
  };

  const onSwipeRight = index => {
    setGoNext(true);
    if (index > 0)
      cardRef.scrollToIndex({
        index: index - 1,
        viewPosition: 0.5,
      });
  };

  const onSwipeLeft = index => {
    if (index < questionArray.length - 1) {
      const filteredAnswer = answerArray.filter(
        qa => qa.question === questionArray[index + 1].content,
      );
      // 질문이 같은 object를 탐색함.
      if (filteredAnswer.length === 0) {
        // 탐색 결과 없음, 즉 아직 답변이 안 된 질문
        setGoNext(false);
        // 다음으로 못 가게 막음.
      }
      if (goNext)
        cardRef.scrollToIndex({
          index: index + 1,
          viewPosition: 0.5,
        });
    }
  };

  const [imageOptions, setImageOptions] = useState({
    // saveToPhotos: true,
    mediaType: 'photo',
    includeBase64: false,
    quality: 1,
    selectionLimit: 0,
  });

  const handleChooseImage = (type, options) => {
    if (type === 'capture') {
      launchCamera(options, photos => {
        const data = new FormData();
        data.append('post', {
          name: photos.assets[0].fileName,
          type: photos.assets[0].type,
          uri: photos.assets[0].uri,
        });
        setPhotoUri(photos.assets[0].uri);
        setPhotoData(data);

        // fetch(`${API_URL}/posts/1/images`, {
        //   method: 'post',
        //   body: photoData,
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // })
        //   .then(response => {
        //     console.log('response', response.data);
        //   })
        //   .catch(error => {
        //     console.log('error', error);
        //   });
      });
    }
    // else {
    //   launchImageLibrary(options, photos => {
    //     const data = new FormData();
    //     if (photos.assets.length > 0) {
    //       const imageArray = photos.assets?.map(val => {
    //         return {
    //           name: val.fileName,
    //           type: val.type,
    //           uri: val.uri,
    //         };
    //       });

    //       console.log(JSON.stringify(imageArray));

    //       data.append('post', imageArray);

    //       console.log(JSON.stringify(data));

    //       fetch(`${API_URL}/posts/${postId}/image`, {
    //         method: 'post',
    //         body: data,
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         },
    //       })
    //         .then(response => {
    //           console.log('response', response.data);
    //         })
    //         .catch(error => {
    //           console.log('error', error);
    //         });
    //     }
    //   });
    // }
  };

  const Greetings = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          height: '80%',
          width: width * 0.9,
          marginLeft: 16,
          marginRight: 8,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={VisualDesign}
            style={{width: 33, height: 38}}
            resizeMode="contain"
          />
          <View
            style={{
              width: 1,
              height: 30,
              backgroundColor: NEUTRAL_WHITE,
              marginHorizontal: 11,
            }}
          />
          <Image
            source={EwhaLogo}
            style={{width: 33, height: 38}}
            resizeMode="contain"
          />
        </View>
        <View style={{marginTop: 20}}>
          <Heading3>해당 기록하기는</Heading3>
          <Heading3>2022 이화여자대학교 졸업전시에서</Heading3>
          <Heading3>설문으로 대체됩니다.</Heading3>
        </View>
        <View style={{marginTop: 16}}>
          <Body3>본 설문은 Buzzy 앱 사용자 대상으로 간단한 의견을 알</Body3>
          <Body3>아보기 위해 작성되었습니다. 6월 21일부터 26일까지, 6</Body3>
          <Body3>일동안 실시됩니다. 설문 내용은 Buzzy의 사용성과 디</Body3>
          <Body3>자인 향상을 위해 사용될 예정입니다. 감사합니다.</Body3>
        </View>
        <Button
          title="설문 시작하기"
          style={{marginTop: '50%', width: '50%', bottom: 0}}
          onPress={() =>
            cardRef.scrollToIndex({
              animated: true,
              index: 0,
              viewPosition: 0.5,
            })
          }
        />
      </View>
    );
  };

  const questionCardLayout = ({item, index}) => {
    if (index === questionArray.length - 1) {
      return (
        <View
          style={{
            width: width * 0.85,
            height: '62%',
            backgroundColor: '#202225',
            marginTop: '20%',
            marginLeft: width * 0.023,
            marginRight: width * 0.046,
            padding: 12,
            borderRadius: 20,
            alignItems: 'center',
          }}>
          <Heading4 style={{marginTop: 74}}>
            모든 기록을 완료하셨습니다!
          </Heading4>
          <Heading4>소중한 의견 주셔서 감사합니다.</Heading4>
          <Heading4> </Heading4>
          <Heading4>어떤 꽃을 획득했는지</Heading4>
          <Heading4>[{groupInfo.name}] 가든으로</Heading4>
          <Heading4>이동해서 알아볼까요?</Heading4>
          <Image
            source={postFlowerImagePath[flowerId]}
            style={{width: 70, height: 70, marginTop: '20%'}}
            resizeMode="contain"
          />
          <Button
            title="정원으로 이동"
            style={{
              width: width * 0.75,
              height: '25%',
              borderRadius: 8,
              marginTop: '20%',
            }}
            onPress={() => {
              navigation.reset({
                routes: [
                  {
                    name: 'GardenTabs',
                    params: groupInfo,
                  },
                ],
              });
            }}
          />
        </View>
      );
    }
    return (
      <GestureRecognizer
        onSwipeRight={() => onSwipeRight(index)}
        onSwipeLeft={() => onSwipeLeft(index)}
        style={{
          width: width * 0.85,
          height: '62%',
          backgroundColor: backgroundColors[index],
          marginTop: '20%',
          marginHorizontal: width * 0.023,
          padding: 12,
          paddingTop: 26,
          borderRadius: 20,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Body3 style={{color: '#000'}}>
            {index + 1}/{questionArray.length - 1}
          </Body3>
          {(index === 3 || index === 4) && (
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  if (index < questionArray.length - 1)
                    cardRef.scrollToIndex({
                      animated: true,
                      index: index + 1,
                      viewPosition: 0.5,
                    });
                }}>
                <Heading5 style={{color: '#000'}}>SKIP {'>'}</Heading5>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Heading2
          style={{
            color: '#000',
            marginTop: 16,
          }}>
          {item.content}
        </Heading2>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: `rgba(0,0,0,0.2)`,
              marginTop: 20,
            }}
          />
        </View>
        <View style={{alignItems: 'center', marginTop: 16}}>
          {Object.keys(item.options).length > 0 ? (
            optionsId.map(val => {
              const chosenQuestion = answerArray.filter(
                qa => qa.question === item.content,
              );
              const selected =
                chosenQuestion.length > 0 &&
                item.options[val] === chosenQuestion[0].answer;

              return (
                <TouchableOpacity
                  key={item.options[val]}
                  style={{
                    width: '100%',
                    backgroundColor: selected ? NEUTRAL_WHITE : '#111214',
                    marginTop: '4%',
                    justifyContent: 'center',
                    borderRadius: 8,
                    padding: 14,
                  }}
                  onPress={() => handleSelectOption(index, val)}>
                  {selected ? (
                    <Heading5 style={{color: '#111214'}}>
                      {item.options[val]}
                    </Heading5>
                  ) : (
                    <Body3>{item.options[val]}</Body3>
                  )}
                </TouchableOpacity>
              );
            })
          ) : index !== questionArray.length - 2 ? (
            <TextInput
              placeholder={
                index === 3
                  ? 'Buzzy에 추가되었으면 하는 기능을 마음껏 적\n어주세요. Buzzy 제작자들은 귀 기울일 준비가\n되어 있어요!'
                  : '저희는 응원을 먹고 자란답니다. ٩(•̤̀ᵕ•̤́๑)૭ Buzzy 제작자들에게 응원의 한마디를 적어주\n세요.'
              }
              placeholderTextColor="#474c52"
              onEndEditing={val => handleInputText(val.nativeEvent.text, index)}
              style={{
                width: '100%',
                height: '70%',
                backgroundColor: `rgba(255,255,255,0.3)`,
                marginTop: '4%',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 16,
                color: '#000',
                fontFamily: 'SUIT-Regular',
              }}
              multiline
              blurOnSubmit
              textAlignVertical="top"
              onSubmitEditing={() => {
                if (index < questionArray.length - 1)
                  cardRef.scrollToIndex({
                    animated: true,
                    index: index + 1,
                    viewPosition: 0.5,
                  });
              }}
            />
          ) : photoUri ? (
            <Image
              source={{uri: photoUri}}
              style={{
                width: '100%',
                height: '70%',
                marginTop: '4%',
                borderRadius: 8,
              }}
              resizeMode="cover"
            />
          ) : (
            <TouchableOpacity
              style={{
                width: '100%',
                height: '70%',
                backgroundColor: '#18191b',
                marginTop: '4%',
                borderRadius: 8,
                padding: 14,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.6}
              onPress={() => handleChooseImage('capture', imageOptions)}>
              <Image
                source={Capture}
                style={{width: 48, height: 48}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

        {index === 5 && (
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#3a3e44',
                height: 48,
                width: 140,
                marginTop: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 24,
              }}
              disabled={isPostSubmitted}
              onPress={handleCreatePost}>
              <Heading5>완료하기</Heading5>
            </TouchableOpacity>
          </View>
        )}
      </GestureRecognizer>
    );
  };

  return (
    <MainWrapper>
      <ScreenHeader
        title={`이화여자대학교의 기록`}
        navigation={navigation}
        style={{margin: 16, marginBottom: 0}}
      />
      <View
        style={{
          top: 40,
          height: '100%',
          alignItems: 'center',
        }}>
        {questionArray.length > 0 && (
          <FlatList
            ListHeaderComponent={Greetings}
            data={questionArray}
            ref={ref => {
              setCardRef(ref);
            }}
            renderItem={questionCardLayout}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            scrollEnabled={false}
          />
        )}
      </View>
    </MainWrapper>
  );
};

export default PostScreen;
