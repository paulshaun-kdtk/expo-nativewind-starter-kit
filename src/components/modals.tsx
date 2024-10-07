import React from 'react';
import { Modal, View, } from 'react-native';

export const InformationModal = ({ visible, onClose, content, modalStyle="" }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-slate-800/95">
        <View className={`rounded-lg p-5 shadow-lg ${modalStyle}`}>
          {content}
        </View>
      </View>
    </Modal>
  );
};

