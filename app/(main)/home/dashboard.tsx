import React, { useContext, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { ArrowDownToLine, Plus, ShoppingBag, TrendingUp } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import TransactionForm from '@/components/TransactionForm';
import { DataContext } from '@/contexts/DataContext';
import { CATEGORIES } from '@/types/categories';
import { Transaction, UserStats } from '@/types/data.types';
import { router } from 'expo-router';

export default function Dashboard() {
  const { getTransactions, getUserStats, createTransaction } = useContext(DataContext);

  const [stats, setStats] = useState<UserStats>({
    income: 0,
    expense: 0,
    balance: 0
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [showForm, setShowForm] = useState(false);
  const [presetType, setPresetType] = useState<"income" | "expense">("income");

  useEffect(() => {
    const loadData = async () => {
      const statsData = await getUserStats();
      setStats(statsData)
      const transData = await getTransactions({ daily: true });
      setTransactions(transData);
    };

    loadData();
  }, []);


  const onNavigate = () => {
    router.push("/(main)/home/transactions")
  }

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={styles.balanceWrapper}>
          <Card delay={0.1}>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Tu gasto de hoy</Text>
              <Text style={styles.balanceValue}>${stats.balance.toLocaleString("es-CO")} COP</Text>
            </View>
          </Card>
        </View>

        {/* Quick Summary */}
        <Card delay={0.2}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen rápido del día</Text>

            <View style={styles.summaryGrid}>
              {/* Ingresos */}
              <View style={styles.summaryItem}>
                <View style={[styles.iconCircle, { backgroundColor: '#BBF7D0' }]}>
                  <TrendingUp size={28} color="#00C48C" />
                </View>
                <Text style={styles.summaryValuePositive}>+${stats.income.toLocaleString("es-CO")}</Text>
                <Text style={styles.summaryLabel}>Ingresos</Text>
              </View>

              {/* Gastos */}
              <View style={styles.summaryItem}>
                <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <ShoppingBag size={28} color="#EF4444" />
                </View>
                <Text style={styles.summaryValueNeutral}>-${stats.expense.toLocaleString("es-CO")}</Text>
                <Text style={styles.summaryLabel}>Gastos</Text>
              </View>
            </View>
          </View>
        </Card>



        {/* Transactions */}
        <View style={styles.transactionsHeaderWrapper}>
          <Text style={styles.transactionsTitle}>Transacciones recientes</Text>
          <Pressable onPress={() => onNavigate()}>
            <Text style={styles.seeAll}>Ver todo</Text>
          </Pressable>
        </View>

        <View style={styles.transactionsList}>
          {transactions.length === 0 ? (
            <Text style={{ color: '#6B7280', textAlign: 'center', marginVertical: 20 }}>
              No has tenido transacciones hoy
            </Text>
          ) : (
            transactions.map((transaction, index) => {
              const isIncome = transaction.type.name === "income";
              const color = isIncome ? "#00C48C" : "#EF4444";
              const tagText = isIncome ? "Ingreso" : transaction.expensetype?.name ?? "Gasto";
              const CategoryIcon = CATEGORIES[isIncome ? "income" : "expense"]
                .find(c => c.key === transaction.category)?.icon || ShoppingBag;

              return (
                <Card key={transaction.id} delay={0.4 + index * 0.1} hover>
                  <View style={styles.transactionItem}>
                    <View style={[styles.transactionIconCircle, { backgroundColor: color + "20" }]}>
                      <CategoryIcon size={24} color={color} />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionName} numberOfLines={1}>
                        {transaction.description}
                      </Text>
                      <View style={styles.transactionMeta}>
                        <Text style={styles.transactionCategory}>
                          {transaction.category ?? "Sin categoría"}
                        </Text>
                        <View style={[styles.transactionTag, isIncome ? styles.tagIncome : styles.tagExpense]}>
                          <Text style={[styles.tagText, isIncome ? styles.tagTextIncome : styles.tagTextExpense]}>
                            {tagText}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.transactionAmount}>
                      ${transaction.value.toLocaleString("es-CO")} COP
                    </Text>
                  </View>
                </Card>
              );
            })
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsWrapper}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<Plus size={20} color="#FFF" />}
            onClick={() => {
              setPresetType("income");
              setShowForm(true);
            }}
          >
            Agregar Ingreso
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            icon={<ArrowDownToLine size={20} color="#00C48C" />}
            onClick={() => {
              setPresetType("expense");
              setShowForm(true);
            }}
          >
            Registrar Gasto
          </Button>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
      <TransactionForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        presetType={presetType}
        onSubmit={async (data) => {
          await createTransaction(
            data.type,
            data.description,
            data.value,
            data.category,
            data.expenseType
          );

          // Refrescar datos
          const updatedStats = await getUserStats();
          setStats(updatedStats);
          const updatedTrans = await getTransactions({ daily: true });
          setTransactions(updatedTrans);
        }}
      />
    </View>
  );
}

/* -------------------------------------------- */
/* STYLES */
/* -------------------------------------------- */

const styles = StyleSheet.create({
  summaryGrid: {
  flexDirection: 'row',
  justifyContent: 'space-around', // espacio uniforme entre items
  alignItems: 'center',
  marginTop: 8,
},
summaryItem: {
    alignItems: 'center',
    minWidth: 120, // asegura que cada item tenga espacio suficiente
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  summaryValuePositive: {
    fontSize: 24,
    color: '#00C48C',
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  summaryValueNeutral: {
    fontSize: 24,
    color: '#EF4444',
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },


  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 80,
  },

  /* Balance Card */
  balanceWrapper: {
    marginTop: -32,
    marginBottom: 24,
  },
  balanceCard: {
    padding: 24,
  },
  balanceLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 32,
    color: '#111827',
    fontWeight: '700',
  },

  /* Summary */
  summaryCard: {
    padding: 24,
  },
  summaryTitle: {
    color: '#111827',
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
  },
  summaryValuePoints: {
    fontSize: 22,
    color: '#FBBF24',
    marginBottom: 2,
  },
  /* Transactions */
  transactionsHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  transactionsTitle: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
  },
  seeAll: {
    color: '#00C48C',
    fontSize: 14,
  },

  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  transactionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 14,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  transactionCategory: {
    color: '#6B7280',
    fontSize: 12,
  },
  transactionTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  tagText: {
    fontSize: 12,
  },
    // TAG estilos corregidos
  tagIncome: {
    backgroundColor: '#00C48C20', // verde claro
  },
  tagExpense: {
    backgroundColor: '#FEE2E2', // rojo claro
  },

  tagTextIncome: {
    color: '#00C48C',
  },
  tagTextExpense: {
    color: '#EF4444',
  },
  transactionAmount: {
    color: '#111827',
    fontWeight: '600',
  },

  /* Buttons section */
  actionsWrapper: {
    marginTop: 32
  },

  registertransactionButton: {
    borderWidth: 2,
    borderColor: '#00C48C',
  },

  /* Floating Chat Button */
  chatButton: {
    position: 'absolute',
    bottom: 44,
    right: 24,
    zIndex: 10,
  },
  chatButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    backgroundColor: '#00C48C',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
