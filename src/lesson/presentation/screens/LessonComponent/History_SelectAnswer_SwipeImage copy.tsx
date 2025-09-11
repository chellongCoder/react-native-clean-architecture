import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import SlideSwipeImages from '../../components/History/SlideSwipeImages';

// Example usage of SlideSwipeImages component
const History_SelectAnswer_SwipeImage: React.FC = () => {
  // Sample data - replace with your actual image URLs and content
  const slideData = [
    {
      id: '1',
      imageUrl: 'https://example.com/image1.jpg', // Replace with your actual image URLs
      title: 'Lạc Long Quân và Âu Cơ gặp gỡ',
      subtitle: 'Câu chuyện bắt đầu từ cuộc gặp gỡ định mệnh',
    },
    {
      id: '2',
      imageUrl: 'https://example.com/image2.jpg',
      title: 'Kết duyên cùng nhau',
      subtitle: 'Hai người kết hôn và sinh ra 100 người con',
    },
    {
      id: '3',
      imageUrl: 'https://example.com/image3.jpg',
      title: 'Chia tay để về quê hương',
      subtitle: '50 người con theo mẹ lên núi, 50 người theo cha xuống biển',
    },
    {
      id: '4',
      imageUrl: 'https://example.com/image4.jpg',
      title: 'Tạo nên dân tộc Việt Nam',
      subtitle: 'Từ đó hình thành nên dân tộc Việt Nam ngày nay',
    },
  ];

  const handleSlideChange = (index: number) => {
    console.log('Current slide index:', index);
    // Handle slide change logic here
  };

  const handleSlidePress = (item: any, index: number) => {
    console.log('Slide pressed:', item, index);
    // Handle slide press logic here
  };

  return (
    <View style={styles.container}>
      <SlideSwipeImages
        data={slideData}
        onSlideChange={handleSlideChange}
        onSlidePress={handleSlidePress}
        autoPlay={false} // Set to true for auto-play
        loop={true} // Enable looping
        showPagination={true}
        showSwipeHint={true}
        backgroundColor="#6B4E3D" // Match your design background
        containerStyle={styles.carouselContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B4E3D',
  },
  carouselContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingVertical: scale(20),
  },
});

export default History_SelectAnswer_SwipeImage;