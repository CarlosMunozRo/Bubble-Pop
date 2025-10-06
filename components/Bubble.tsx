import * as Haptics from 'expo-haptics';
import { TouchableWithoutFeedback, View } from "react-native";
// import { useState } from "react"; // Removed unused import

type Props = {
    id?: number;
    popped?: boolean;
    onPop?: (id?: number) => void;
};

export default function Bubble({ id, popped = false, onPop }: Props) {
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                if (!popped) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onPop?.(id);
                }
            }}  
        >
            <View
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: 50,
                    backgroundColor: 'rgba(255, 255, 255)',
                    margin: 10,
                    elevation: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // opacity: 0.5,
                }}
            >
                <View
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 50,
                        backgroundColor: !popped ? '#bae1ff' : '#ffb3ba',
                        margin: 10,
                        // boxShadow: !popped ? '0 0px 10px 10px #bae1ff' : '0 0px 5px 5px rgba(0, 0, 0, 0.1)',
                        boxShadow: !popped ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'inset 0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}