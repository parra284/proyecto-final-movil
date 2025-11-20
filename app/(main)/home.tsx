import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { ArrowDownToLine, Coffee, Plus, ShoppingBag, TrendingUp, Zap } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
  onOpenChat: () => void;
}

export default function DashboardScreen({
  onNavigate,
  onOpenChat,
}: DashboardScreenProps) {
  const transactions = [
    {
      id: 1,
      name: 'Supermercado Éxito',
      category: 'Alimentos',
      amount: -45.5,
      icon: ShoppingBag,
      color: '#00C48C',
      type: 'Manual',
    },
    {
      id: 2,
      name: 'Café Juan Valdez',
      category: 'Entretenimiento',
      amount: -8.0,
      icon: Coffee,
      color: '#FBBF24',
      type: 'Factura',
    },
    {
      id: 3,
      name: 'Codensa - Electricidad',
      category: 'Servicios',
      amount: -120.0,
      icon: Zap,
      color: '#1F2937',
      type: 'Factura',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={styles.balanceWrapper}>
          <Card delay={0.1}>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Tu gasto de hoy</Text>
              <Text style={styles.balanceValue}>$75,000 COP</Text>
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
                  <TrendingUp size={24} color="#00C48C" />
                </View>
                <Text style={styles.summaryValuePositive}>+$350</Text>
                <Text style={styles.summaryLabel}>Ingresos</Text>
              </View>

              {/* Gastos */}
              <View style={styles.summaryItem}>
                <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <ShoppingBag size={24} color="#EF4444" />
                </View>
                <Text style={styles.summaryValueNeutral}>-$173</Text>
                <Text style={styles.summaryLabel}>Gastos</Text>
              </View>

              {/* Puntos */}
              <View style={styles.summaryItem}>
                <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={{ fontSize: 22 }}>⭐</Text>
                </View>
                <Text style={styles.summaryValuePoints}>+25</Text>
                <Text style={styles.summaryLabel}>Puntos</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Transactions */}
        <View style={styles.transactionsHeaderWrapper}>
          <Text style={styles.transactionsTitle}>Transacciones recientes</Text>
          <Pressable onPress={() => onNavigate('history')}>
            <Text style={styles.seeAll}>Ver todo</Text>
          </Pressable>
        </View>

        <View style={styles.transactionsList}>
          {transactions.map((transaction, index) => (
            <Card key={transaction.id} delay={0.4 + index * 0.1} hover>
              <View style={styles.transactionItem}>
                <View
                  style={[
                    styles.transactionIconCircle,
                    { backgroundColor: transaction.color + '20' },
                  ]}
                >
                  <transaction.icon size={24} color={transaction.color} />
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName} numberOfLines={1}>
                    {transaction.name}
                  </Text>

                  <View style={styles.transactionMeta}>
                    <Text style={styles.transactionCategory}>
                      {transaction.category}
                    </Text>

                    <View
                      style={[
                        styles.transactionTag,
                        transaction.type === 'Factura'
                          ? styles.tagFactura
                          : styles.tagManual,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          transaction.type === 'Factura'
                            ? styles.tagTextFactura
                            : styles.tagTextManual,
                        ]}
                      >
                        {transaction.type}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.transactionAmount}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsWrapper}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<Plus size={20} color="#FFF" />}
          >
            Agregar Ingreso
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            icon={<ArrowDownToLine size={20} color="#00C48C" />}
          >
            Registrar Gasto
          </Button>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------- */
/* STYLES */
/* -------------------------------------------- */

const styles = StyleSheet.create({
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

  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    width: '30%',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryValuePositive: {
    fontSize: 22,
    color: '#00C48C',
    marginBottom: 2,
  },
  summaryValueNeutral: {
    fontSize: 22,
    color: '#111827',
    marginBottom: 2,
  },
  summaryValuePoints: {
    fontSize: 22,
    color: '#FBBF24',
    marginBottom: 2,
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 12,
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
  tagFactura: {
    backgroundColor: '#00C48C20',
  },
  tagManual: {
    backgroundColor: '#F3F4F6',
  },
  tagText: {
    fontSize: 12,
  },
  tagTextFactura: {
    color: '#00C48C',
  },
  tagTextManual: {
    color: '#6B7280',
  },
  transactionAmount: {
    color: '#111827',
    fontWeight: '600',
  },

  /* Buttons section */
  actionsWrapper: {
    marginTop: 32
  },

  registerExpenseButton: {
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
