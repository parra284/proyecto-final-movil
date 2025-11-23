import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraType, CameraView } from "expo-camera";
import React, { useRef, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

type ModalCameraProps = {
  onClose: () => void;
  onCapture: (uri: string) => void;
};

export default function ModalCamera({ onClose, onCapture }: ModalCameraProps) {
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync({ base64: true });
    if (photo?.uri) {
      setCapturedUri(photo.uri); // Guardamos la foto para mostrar el preview
    }
  };

  const confirmPhoto = () => {
    if (capturedUri) {
      onCapture(capturedUri);
      onClose();
    }
  };

  const cancelPhoto = () => {
    setCapturedUri(null); // Volvemos a la cámara
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <Modal animationType="slide" transparent={false}>
      <View style={styles.container}>
        {capturedUri ? (
          // Preview de la foto con opciones
          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedUri }} style={styles.previewImage} />
            <View style={styles.previewControls}>
              <Pressable onPress={cancelPhoto} style={styles.previewBtn}>
                <Text style={styles.previewBtnText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={confirmPhoto} style={styles.previewBtn}>
                <Text style={styles.previewBtnText}>Aceptar</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          // Cámara activa
          <>
            <CameraView
              style={styles.camera}
              ref={ref}
              facing={facing}
              mute={false}
            />

            <View style={styles.controls}>
              <Pressable onPress={onClose}>
                <AntDesign name="close" size={36} color="white" />
              </Pressable>

              <Pressable onPress={takePicture}>
                <View style={styles.shutterBtn}>
                  <View style={styles.shutterBtnInner} />
                </View>
              </Pressable>

              <Pressable onPress={toggleFacing}>
                <FontAwesome6 name="rotate-left" size={36} color="white" />
              </Pressable>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { ...StyleSheet.absoluteFillObject },
  controls: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: { width: 70, height: 70, borderRadius: 50, backgroundColor: "white" },
  previewContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  previewImage: { width: "100%", height: "80%", resizeMode: "contain" },
  previewControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
  },
  previewBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "white",
    borderRadius: 8,
  },
  previewBtnText: { fontSize: 16, fontWeight: "bold", color: "black" },
});
