import { Button } from "@/components/Button";
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
  const [expenseType, setExpenseType] = useState("");

  const handleSave = async () => {
    await onSubmit({
      type: presetType,
      description,
      value: Number(value),
      category,
      expenseType: presetType === "expense" ? expenseType : undefined
    });

    onClose();
    setDescription("");
    setValue("");
    setCategory("");
    setExpenseType("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {presetType === "income" ? "Agregar ingreso" : "Registrar gasto"}
          </Text>

          <TextInput
            placeholder="Descripción"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            placeholder="Valor"
            keyboardType="numeric"
            style={styles.input}
            value={value}
            onChangeText={setValue}
          />

          <TextInput
            placeholder="Categoría"
            style={styles.input}
            value={category}
            onChangeText={setCategory}
          />

          {presetType === "expense" && (
            <TextInput
              placeholder="Tipo de gasto (opcional)"
              style={styles.input}
              value={expenseType}
              onChangeText={setExpenseType}
            />
          )}

          <View style={styles.buttons}>
            <Button variant="outline" onClick={onClose} fullWidth>Cancelar</Button>
            <Button variant="primary" onClick={handleSave} fullWidth>Guardar</Button>
          </View>
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
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: "#111827"
  },
  buttons: {
    flexDirection: "column",
    gap: 12,
    marginTop: 8,
  },
});
