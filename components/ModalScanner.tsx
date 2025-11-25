import { ExtraContext } from "@/contexts/ExtraContext";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MlkitOcr from "react-native-mlkit-ocr";

// -----------------------------------------

interface Props {
  visible: boolean;
  onClose: () => void;
  onFinish: (data: {
    type: string;
    description: string;
    value: number;
    category?: string;
    expenseType?: string;
  }) => void;
}

export const ModalScanner = ({ visible, onClose, onFinish }: Props) => {
  const { getTransactionData } = useContext(ExtraContext);

  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      base64: false,
      allowsEditing: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      processOCR(uri);
    }
  };

  const processOCR = async (uri: string) => {
    try {
      setLoading(true);

      const ocr = await MlkitOcr.detectFromUri(uri);

      const fullText = ocr.map((b) => b.text).join("\n");

      // 👇 AQUI EL FIX
      const parsed = await parseInvoice(fullText);

      if (parsed) {
        onFinish(parsed); // ahora sí recibe un objeto real, no una Promise
      }

      setLoading(false);
    } catch (err) {
      console.error("OCR ERROR:", err);
      setLoading(false);
    }
  };


  // -------------------------
  // Lógica para extraer datos
  // -------------------------
  const parseInvoice = async (
    text: string
  ): Promise<{
    type: string;
    description: string;
    value: number;
    category: string;
    expenseType: string;
  } | null> => {
    if (!text || text.trim().length === 0) return null;

    try {
      // 🔥 Llamamos a la IA para obtener description, value y category
      const aiData = await getTransactionData(text);

      return {
        type: "expense",
        description: aiData.description || "Purchase",
        value: aiData.value || 0,
        category: aiData.category || "General",
        expenseType: "Factura",
      };
    } catch (error) {
      console.error("Error in parseInvoice:", error);

      // fallback seguro si algo falla
      return {
        type: "expense",
        description: "Purchase",
        value: 0,
        category: "General",
        expenseType: "Factura",
      };
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.title}>Scan your Invoice</Text>

          {!imageUri && (
            <Pressable style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </Pressable>
          )}

          {imageUri && <Image source={{ uri: imageUri }} style={styles.img} />}

          {loading && <ActivityIndicator size="large" />}

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

// ----------------------------
// Styles
// ----------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  box: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  closeBtn: {
    padding: 10,
    marginTop: 10,
  },
  closeText: {
    textAlign: "center",
    color: "red",
  },
  img: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 15,
  },
  extracted: {
    marginTop: 10,
    fontSize: 12,
  },
});
