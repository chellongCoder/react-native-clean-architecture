/* eslint-disable react/react-in-jsx-scope */
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';
import {SharedValue} from 'react-native-reanimated';
import DragItem from './DragSendItem';

export type DragItemT = {
  id: number;
  value: string;
  posX: number;
  posY: number;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  isFocus: boolean;
  isSelected: boolean;
  parentId: number;
  isMatch: boolean;
  canSwap: boolean;
  createItem: (params: {
    value: string;
    isFocus: boolean;
    index: number;
  }) => React.ReactNode;
};

export type DragStateT = {
  listDragItem: Record<number, DragItemT>;
  attachSendView: (item: DragItemT) => void;
  onDrag: (id: number) => void;
  onDragEnd: (id: number) => void;
  onAnimationEnd: (id: number) => void;
  rollback: (id: number) => void;
  getValue: (id: number) => string;
  clear: () => void;
};

const DragContext = createContext<DragStateT>({
  listDragItem: {},
  attachSendView: () => {
    //
  },
  onDrag: () => {
    //
  },
  onDragEnd: () => {
    //
  },
  onAnimationEnd: () => {
    //
  },
  rollback: () => {
    //
  },
  getValue: () => '',
  clear: () => {
    //
  },
});

export const useDragContext = () => {
  return useContext(DragContext);
};

const DragProvider = ({children}: PropsWithChildren) => {
  const [_, setState] = useState(0);
  const listItem = useRef<Record<number, DragItemT>>({});

  const attachSendView = useCallback((item: DragItemT) => {
    listItem.current[item.id] = item;
  }, []);

  const detachSendView = useCallback((item: DragItemT) => {
    delete listItem.current[item.id];
  }, []);

  // kiểm tra nếu item có vị trí pos + translate gần khi vực item có pos khác thì return true
  const getNearItem = (id: number) => {
    const item = listItem.current[id];
    if (item) {
      const posX = item.posX + item.translateX.value;
      const posY = item.posY + item.translateY.value;
      return Object.values(listItem.current).find(i => {
        if (i.id !== id && i.canSwap) {
          const distance = Math.sqrt(
            Math.pow(posX - i.posX, 2) + Math.pow(posY - i.posY, 2),
          );

          if (distance < 50) {
            return true;
          }
        }
        return false;
      });
    }
  };

  const getItemMatch = (id: number) => {
    return Object.values(listItem.current).filter(
      i => i.id !== id && i.canSwap && i.isMatch,
    );
  };

  const onDrag = useCallback((id: number) => {
    const item = listItem.current[id];
    if (item) {
      if (!item.isFocus) {
        item.isFocus = true;
        setState(prev => prev + 1);
      }
      const nearItem = getNearItem(id);
      const itemMatch = getItemMatch(id);
      if (nearItem) {
        if (!nearItem?.isMatch) {
          if (itemMatch.length > 0) {
            itemMatch.forEach(i => {
              i.isMatch = false;
            });
          }
          nearItem.isMatch = true;
          setState(prev => prev + 1);
        }
      } else if (itemMatch.length > 0) {
        itemMatch.forEach(i => {
          i.isMatch = false;
        });
        setState(prev => prev + 1);
      }
    }
  }, []);

  const onDragEnd = useCallback((id: number) => {
    const item = listItem.current[id];
    if (item) {
      const itemMatch = getItemMatch(id);
      if (itemMatch.length > 0) {
        item.isSelected = !item.canSwap;
        item.isFocus = false;
        Object.values(listItem.current).forEach(i => {
          if (i.value === itemMatch[0].value && i.isSelected && !i.canSwap) {
            i.isSelected = false;
          }
        });
        //swap
        const temp =
          itemMatch[0].parentId > -1 ? itemMatch[0].parentId : itemMatch[0].id;
        itemMatch[0].parentId = item.parentId > -1 ? item.parentId : id;
        if (item.canSwap) {
          item.parentId = temp;
        }
        if (listItem.current[temp].isSelected) {
          listItem.current[temp].isSelected = false;
        }
        itemMatch[0].isMatch = false;
      }
      setState(prev => prev + 1);
    }
  }, []);

  const onAnimationEnd = useCallback((id: number) => {
    const item = listItem.current[id];
    if (item && item.isFocus) {
      item.isFocus = false;
      setState(prev => prev + 1);
    }
  }, []);

  const rollback = useCallback((id: number) => {
    const item = listItem.current[id];
    if (item && item.parentId > -1) {
      const parentItem = listItem.current[item.parentId];
      parentItem.parentId = -1;
      if (parentItem.isSelected) {
        parentItem.isSelected = false;
      }
      item.parentId = -1;
      setState(prev => prev + 1);
    }
  }, []);

  const getValue = useCallback((id: number) => {
    const item = listItem.current[id];
    if (item) {
      return item.parentId > -1
        ? listItem.current[item.parentId]?.value
        : item.value;
    }
    return '';
  }, []);

  const clear = useCallback(() => {
    listItem.current = {};
    setState(prev => prev + 1);
  }, []);

  const dragState = {
    listDragItem: listItem.current,
    attachSendView,
    detachSendView,
    onDrag,
    onDragEnd,
    onAnimationEnd,
    rollback,
    getValue,
    clear,
  };

  return (
    <DragContext.Provider value={dragState}>
      {children}
      <View
        style={{position: 'absolute', top: 0, left: 0, zIndex: 100000}}
        pointerEvents="box-none">
        {Object.values(listItem.current).map((item, index) => {
          return (
            <View
              key={index}
              pointerEvents="none"
              style={{
                opacity: item.isFocus ? 1 : 0,
                position: 'absolute',
                top: item.posY,
                left: item.posX,
              }}>
              <DragItem
                value={item.value}
                translateX={item.translateX}
                translateY={item.translateY}
                createItem={() =>
                  item.createItem({
                    value: getValue(item.id),
                    isFocus: false,
                    index,
                  })
                }
              />
            </View>
          );
        })}
      </View>
    </DragContext.Provider>
  );
};

export default DragProvider;
