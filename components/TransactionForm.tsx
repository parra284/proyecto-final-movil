import { Button } from "@/components/Button";
import { ModalScanner } from "@/components/ModalScanner";
import { CATEGORIES } from "@/types/categories";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: string;
    description: string;
    value: number;
    category?: string;
    expenseType?: string;
  }) => Promise<void>;
  presetType: "income" | "expense";
}

export default function TransactionForm({ visible, onClose, onSubmit, presetType }: Props) {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false); // Para saber si vino de OCR

  const handleSave = async () => {
    await onSubmit({
      type: presetType,
      description,
      value: Number(value),
      category,
      expenseType: presetType === "expense" ? (scanned ? "Factura" : "Manual") : undefined,
    });

    onClose();
    setDescription("");
    setValue("");
    setCategory("");
    setScanned(false);
  };

  const handleScanFinish = (data: {
    type: string;
    description: string;
    value: number;
    category?: string;
    expenseType?: string;
  }) => {
    setDescription(data.description);
    setValue(data.value.toString());

    if (data.category) setCategory(data.category);

    setScanned(true); // viene del escaneo
    setScannerVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {presetType === "income" ? "Agregar ingreso" : "Registrar gasto"}
          </Text>

          {presetType === "expense" && (
            <Button variant="outline" onClick={() => setScannerVisible(true)} fullWidth>
              Escanear factura
            </Button>
          )}

          <TextInput
            placeholder="Descripción"
            placeholderTextColor="#6B7280"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            placeholder="Valor"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            style={styles.input}
            value={value}
            onChangeText={setValue}
          />

          <Picker
            selectedValue={category}
            onValueChange={(v: any) => setCategory(v)}
            style={styles.picker}
          >
            {CATEGORIES[presetType].map((c) => (
              <Picker.Item key={c.key} label={c.key} value={c.key} />
            ))}
          </Picker>

          <View style={styles.buttons}>
            <Button variant="outline" onClick={onClose} fullWidth>Cancelar</Button>
            <Button variant="primary" onClick={handleSave} fullWidth>Guardar</Button>
          </View>

          <ModalScanner
            visible={scannerVisible}
            onClose={() => setScannerVisible(false)}
            onFinish={handleScanFinish}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },
  input: {
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: "#000000ff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  picker: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginBottom: 12,
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  buttons: {
    flexDirection: "column",
    gap: 12,
    marginTop: 8,
  },
});
