import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text, TouchableOpacity, Alert} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PuzzlePiece, {PuzzlePieceData} from './PuzzlePiece';

const {width: screenWidth} = Dimensions.get('window');
const PIECE_SIZE = (screenWidth - 60) / 3;

const JigsawPuzzle: React.FC = () => {
  const [pieces, setPieces] = useState<PuzzlePieceData[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const initialPuzzleData: PuzzlePieceData[] = [
    {id: 0, currentPosition: 0, correctPosition: 0, color: '#87CEEB', content: 'Sky', icon: '☁️'},
    {id: 1, currentPosition: 1, correctPosition: 1, color: '#98FB98', content: 'Tree', icon: '🌳'},
    {id: 2, currentPosition: 2, correctPosition: 2, color: '#87CEEB', content: 'Clouds', icon: '🐦'},
    {id: 3, currentPosition: 3, correctPosition: 3, color: '#F0E68C', content: 'Ground', icon: '🌱'},
    {id: 4, currentPosition: 4, correctPosition: 4, color: '#8B4513', content: 'Trunk', icon: '🌿'},
    {id: 5, currentPosition: 5, correctPosition: 5, color: '#DDA0DD', content: 'Flowers', icon: '🌸'},
    {id: 6, currentPosition: 6, correctPosition: 6, color: '#87CEFA', content: 'Water', icon: '🌊'},
    {id: 7, currentPosition: 7, correctPosition: 7, color: '#98FB98', content: 'Grass', icon: '🌾'},
    {id: 8, currentPosition: 8, correctPosition: 8, color: '#DDA0DD', content: 'Garden', icon: '🦋'},
  ];

  useEffect(() => {
    // Shuffle the pieces initially
    const shuffledPieces = [...initialPuzzleData];
    for (let i = shuffledPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPieces[i], shuffledPieces[j]] = [shuffledPieces[j], shuffledPieces[i]];
    }
    
    // Update current positions after shuffle
    shuffledPieces.forEach((piece, index) => {
      piece.currentPosition = index;
    });
    
    setPieces(shuffledPieces);
  }, []);

  const handleSwap = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setPieces(prevPieces => {
      const newPieces = [...prevPieces];
      
      // Swap the pieces
      [newPieces[fromIndex], newPieces[toIndex]] = [newPieces[toIndex], newPieces[fromIndex]];
      
      // Update current positions
      newPieces[fromIndex].currentPosition = fromIndex;
      newPieces[toIndex].currentPosition = toIndex;
      
      return newPieces;
    });
  };

  const checkCompletion = () => {
    const isCompleted = pieces.every(piece => 
      piece.currentPosition === piece.correctPosition
    );
    
    if (isCompleted && !isComplete) {
      setIsComplete(true);
      Alert.alert(
        'Congratulations! 🎉',
        'You completed the jigsaw puzzle!',
        [{text: 'Great!', style: 'default'}]
      );
    }
    
    return isCompleted;
  };

  useEffect(() => {
    if (pieces.length > 0) {
      checkCompletion();
    }
  }, [pieces]);

  const resetPuzzle = () => {
    const shuffledPieces = [...initialPuzzleData];
    for (let i = shuffledPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPieces[i], shuffledPieces[j]] = [shuffledPieces[j], shuffledPieces[i]];
    }
    
    shuffledPieces.forEach((piece, index) => {
      piece.currentPosition = index;
    });
    
    setPieces(shuffledPieces);
    setIsComplete(false);
  };

  const getGridPosition = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      left: col * PIECE_SIZE + 20,
      top: row * PIECE_SIZE + 20,
    };
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧩 Nature Jigsaw Puzzle</Text>
        <Text style={styles.subtitle}>Drag pieces to swap positions</Text>
        {isComplete && (
          <Text style={styles.completionText}>🎉 Puzzle Complete! 🎉</Text>
        )}
      </View>

      <View style={styles.puzzleContainer}>
        <View style={styles.board}>
          {pieces.map((piece, index) => (
            <View
              key={piece.id}
              style={[
                styles.slot,
                getGridPosition(index),
                piece.currentPosition === piece.correctPosition && styles.correctSlot
              ]}
            >
              <PuzzlePiece
                piece={piece}
                position={index}
                onSwap={handleSwap}
                isCorrect={piece.currentPosition === piece.correctPosition}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.resetButton} onPress={resetPuzzle}>
          <Text style={styles.resetButtonText}>🔄 Shuffle Again</Text>
        </TouchableOpacity>
        
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            Correct Pieces: {pieces.filter(p => p.currentPosition === p.correctPosition).length} / {pieces.length}
          </Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  completionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6347',
    marginTop: 10,
    textAlign: 'center',
  },
  puzzleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    width: PIECE_SIZE * 3 + 40,
    height: PIECE_SIZE * 3 + 40,
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    position: 'relative',
  },
  slot: {
    position: 'absolute',
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  correctSlot: {
    borderColor: '#4CAF50',
    borderStyle: 'solid',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  controls: {
    marginTop: 30,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stats: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statsText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});

export default JigsawPuzzle;