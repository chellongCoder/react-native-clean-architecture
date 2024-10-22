import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {verticalScale} from 'react-native-size-matters';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';

const GeometryComponent = () => {
  const globalStyle = useGlobalStyle();
  const listAnswer = ['15', '30', '45', '60'];

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const onSelectAnswer = (item: string) => {
    setSelectedAnswer(item);
  };

  const onSubmit = () => {
    console.log('onSubmit');
  };

  return (
    <View style={styles.container}>
      <Text style={[globalStyle.txtLabel, styles.pb16, styles.textColor]}>
        Choose the correct answer
      </Text>

      {/* Question container */}
      <View style={styles.wrapBodyContainer}>
        {/* Image question */}
        <View style={[{flex: 1}, styles.questionContainer]}>
          <View style={{alignItems: 'center'}}>
            <Text style={[globalStyle.txtModule, styles.questionTitle]}>
              B = ?
            </Text>
          </View>

          <Image
            source={require('../../../../../assets/images/triangleGemetryQuestion.png')}
            style={{marginTop: 16}}
          />
        </View>

        {/* List answer */}
        <View style={[{flex: 0.7}, styles.listAnswerContainer]}>
          {listAnswer.map(item => {
            return (
              <TouchableOpacity
                style={[
                  styles.answerContainer,
                  item === selectedAnswer ? {backgroundColor: '#66C270'} : {},
                ]}
                onPress={() => onSelectAnswer(item)}
                disabled={item === selectedAnswer}>
                <Text style={[globalStyle.txtModule, styles.answerTitle]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Submit button container */}
      <View style={styles.wrapButtonContainer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={onSubmit}>
          <Text style={[styles.buttonTitle, globalStyle.txtModule]}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pb16: {
    paddingBottom: verticalScale(16),
  },
  textColor: {
    color: '#003C82',
  },
  wrapBodyContainer: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: '#FBF8CC',
    flexDirection: 'row',
    padding: 16,
  },
  questionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  questionTitle: {
    fontSize: 35,
    color: '#FE311F',
  },
  listAnswerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  answerContainer: {
    backgroundColor: '#F2B559',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  answerTitle: {
    fontSize: 35,
    color: '#FBF8CC',
  },
  wrapButtonContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: 52,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#0877B6',
  },
  buttonTitle: {
    color: '#FBF8CC',
    fontSize: 20,
  },
});

export default GeometryComponent;
