import { Transaction } from "@/types/data.types";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
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
  onFinish: (data: Transaction) => void;
}

export const ModalScanner = ({ visible, onClose, onFinish }: Props) => {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");

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
      setExtractedText(fullText);

      const parsed = parseInvoice(fullText);

      onFinish(parsed);

      console.log(parsed);

      setLoading(false);
    } catch (err) {
      console.error("OCR ERROR:", err);
      setLoading(false);
    }
  };

  // -------------------------
  // Lógica para extraer datos
  // -------------------------
  const parseInvoice = (text: string): Transaction => {
    // Buscar valor tipo $45.900 o 45.900
    const valueMatch = text.match(/(\$)?\s?(\d{2,}[.,]\d{2,})/);

    const description = text.split("\n")[0] ?? "Purchase";

    return {
      id: crypto.randomUUID(),
      user_id: "USER123", // <-- o tu user real
      type: { id: "1", name: "expense" },
      expensetype: { id: "F1", name: "Factura" },
      description: description,
      category: "General",
      value: valueMatch ? Number(valueMatch[2].replace(",", ".")) : 0,
      created_at: new Date(),
    };
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

          {extractedText !== "" && (
            <Text style={styles.extracted}>
              Extracted text:{"\n"}{extractedText}
            </Text>
          )}
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
