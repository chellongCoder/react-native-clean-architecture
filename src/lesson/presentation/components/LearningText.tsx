import React, {useState, useEffect} from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';

interface TextCarouselProps {
  texts?: string[];
  style?: StyleProp<TextStyle>;
}

const LearningText: React.FC<TextCarouselProps> = ({texts = [], style}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % texts.length);
    }, 5000 / 3); // Change image every 1 second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [texts.length]);

  return <Text style={style}>{texts[currentIndex]}</Text>;
};

export default LearningText;
