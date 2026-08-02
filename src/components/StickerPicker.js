import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';

const STICKER_PACKS = [
  {
    id: 'pack1',
    name: 'Cute Animals',
    stickers: [
      'https://cdn.jsdelivr.net/npm/@stickerbook/emoji@1.0.0/assets/png/1f431.png',
      'https://cdn.jsdelivr.net/npm/@stickerbook/emoji@1.0.0/assets/png/1f436.png',
      'https://cdn.jsdelivr.net/npm/@stickerbook/emoji@1.0.0/assets/png/1f43a.png',
      'https://cdn.jsdelivr.net/npm/@stickerbook/emoji@1.0.0/assets/png/1f43b.png',
    ]
  },
  {
    id: 'pack2',
    name: 'Emoji Pack',
    stickers: [
      'https://cdn.jsdelivr.net/npm/@stickerbook/emoji@1.0.0/assets/png/1f600.png',
      'https://cdn.jsdelivr.net/npm/@stickerbook/emoji@1.0.0/assets/png/1f602.png',
      'https://cdn.jsdelivr.net/npm/@stickerbook/emoji@1.0.0/assets/png/1f603.png',
      'https://cdn.jsdelivr.net/npm/@stickerbook/emoji@1.0.0/assets/png/1f606.png',
    ]
  }
];

const StickerPicker = ({ onStickerSelect, onClose }) => {
  const [selectedPack, setSelectedPack] = useState(STICKER_PACKS[0]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stickers</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.packs}
      >
        {STICKER_PACKS.map((pack) => (
          <TouchableOpacity
            key={pack.id}
            style={[
              styles.packButton,
              selectedPack.id === pack.id && styles.packButtonActive,
            ]}
            onPress={() => setSelectedPack(pack)}
          >
            <Text style={[
              styles.packText,
              selectedPack.id === pack.id && styles.packTextActive,
            ]}>
              {pack.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.stickersContainer}>
        <View style={styles.stickersGrid}>
          {selectedPack.stickers.map((sticker, index) => (
            <TouchableOpacity
              key={index}
              style={styles.stickerButton}
              onPress={() => onStickerSelect(sticker)}
            >
              <Image source={{ uri: sticker }} style={styles.sticker} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    padding: 16,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  packs: {
    marginBottom: 12,
  },
  packButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  packButtonActive: {
    backgroundColor: COLORS.primary,
  },
  packText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  packTextActive: {
    color: '#FFF',
  },
  stickersContainer: {
    maxHeight: 250,
  },
  stickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
  stickerButton: {
    width: '20%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  sticker: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});

export default StickerPicker;
