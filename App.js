import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const [pin, setPin] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [screen, setScreen] = useState('dashboard'); // 'dashboard', 'month', 'year', 'combine', 'khaata'
  const [filter, setFilter] = useState('All'); // 'All', 'Cash', 'Credit'
  const [search, setSearch] = useState('');
  const [curD, setCurD] = useState(null);
  
  // States for Input Forms
  const [newName, setNewName] = useState('');
  const [newShop, setNewShop] = useState('');
  const [newAmt, setNewAmt] = useState('');
  const [saleAmt, setSaleAmt] = useState('');
  const [payType, setPayType] = useState('Credit');
  const [prodName, setProdName] = useState('');
  const [saleDt, setSaleDt] = useState('27/06/2026');

  // Dealers Database Structure
  const [dealers, setDealers] = useState([
    { id: '1', name: 'Zeeshan Traders', shop: 'Al-Siddique Seeds', balance: 57000 },
    { id: '2', name: 'Asif Khan', shop: 'Kisan Pesticides', balance: 27000 },
    { id: '3', name: 'Bismillah Seed Store', shop: 'Grain Market', balance: 15000 }
  ]);

  // 12 Farzi (Mock) Ledger Entries for Spreadsheet Grid Testing
  const [transactions, setTransactions] = useState([
    { id: 'm1', d_id: '1', prod: 'Pesticide Alpha', type: 'Credit', amt: 25000, mo: '06', yr: '2026', date: '10/06/2026' },
    { id: 'm2', d_id: '1', prod: 'Spray Pump X', type: 'Cash', amt: 15000, mo: '06', yr: '2026', date: '12/06/2026' },
    { id: 'm3', d_id: '1', prod: 'Weed Killer B', type: 'Credit', amt: 32000, mo: '06', yr: '2026', date: '18/06/2026' },
    { id: 'm4', d_id: '2', prod: 'Fungicide Super', type: 'Credit', amt: 12000, mo: '06', yr: '2026', date: '05/06/2026' },
    { id: 'm5', d_id: '2', prod: 'Zinc Fertilizer', type: 'Cash', amt: 8500, mo: '06', yr: '2026', date: '14/06/2026' },
    { id: 'm6', d_id: '2', prod: 'Pesticide Alpha', type: 'Credit', amt: 15000, mo: '06', yr: '2026', date: '22/06/2026' },
    { id: 'm7', d_id: '3', prod: 'Cotton Special', type: 'Credit', amt: 15000, mo: '05', yr: '2026', date: '10/05/2026' },
    { id: 'm8', d_id: '1', prod: 'Wheat Booster', type: 'Cash', amt: 22000, mo: '05', yr: '2026', date: '15/05/2026' },
    { id: 'm9', d_id: '2', prod: 'Spray Pump X', type: 'Cash', amt: 15000, mo: '04', yr: '2026', date: '20/04/2026' },
    { id: 'm10', d_id: '3', prod: 'Weed Killer B', type: 'Cash', amt: 30000, mo: '12', yr: '2025', date: '15/12/2025' },
    { id: 'm11', d_id: '1', prod: 'Zinc Fertilizer', type: 'Credit', amt: 40000, mo: '10', yr: '2025', date: '05/10/2025' },
    { id: 'm12', d_id: '2', prod: 'Fungicide Super', type: 'Credit', amt: 25000, mo: '08', yr: '2025', date: '18/08/2025' }
  ]);

  const totalCombineBalance = dealers.reduce((sum, d) => sum + parseFloat(d.balance || 0), 0);

  // Helper function to filter list by Cash / Credit tabs
  const applyFilter = (list) => {
    if (filter === 'All') return list;
    return list.filter(t => t.type === filter);
  };

  // Add New Profile to Directory
  const addDealer = () => {
    if (!newName || !newShop || !newAmt) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }
    const id = Math.random().toString();
    const amt = parseFloat(newAmt);
    setDealers([...dealers, { id, name: newName, shop: newShop, balance: amt }]);
    setTransactions([{ id: Math.random().toString(), d_id: id, prod: 'Opening Balance', type: 'Credit', amt: amt, mo: '06', yr: '2026', date: '27/06/2026' }, ...transactions]);
    setNewName(''); setNewShop(''); setNewAmt('');
    Alert.alert("Success", "New dealer profile saved successfully!");
  };

  // Record Sale and Update Outstanding Credit
  const recordSale = () => {
    if (!saleDt || !prodName || !saleAmt) {
      Alert.alert("Error", "Please enter Date, Product and Amount!");
      return;
    }
    const amt = parseFloat(saleAmt);
    const parts = saleDt.split('/');
    const mo = parts[1] || '06';
    const yr = parts[2] || '2026';

    setDealers(dealers.map(d => {
      if (d.id === curD.id && payType === 'Credit') {
        return { ...d, balance: d.balance + amt };
      }
      return d;
    }));

    setTransactions([{ id: Math.random().toString(), d_id: curD.id, prod: prodName, type: payType, amt, mo, yr, date: saleDt }, ...transactions]);
    if (payType === 'Credit') curD.balance += amt;
    setSaleAmt(''); setProdName('');
    Alert.alert("Success", "Transaction recorded successfully!");
  };

  const openKhaata = (dealer) => {
    setCurD(dealer);
    setScreen('khaata');
    setFilter('All');
  };

  // Rendering UI Component Parts
  const renderFilterTabs = () => (
    <View style={styles.filterBar}>
      <TouchableOpacity style={[styles.filterTab, filter === 'All' && styles.actFilter]} onPress={() => setFilter('All')}>
        <Text style={{ color: filter === 'All' ? '#fff' : '#333', fontWeight: 'bold', fontSize: 12 }}>All Logs</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.filterTab, filter === 'Cash' && styles.actFilter]} onPress={() => setFilter('Cash')}>
        <Text style={{ color: filter === 'Cash' ? '#fff' : '#333', fontWeight: 'bold', fontSize: 12 }}>Cash Only</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.filterTab, filter === 'Credit' && styles.actFilter]} onPress={() => setFilter('Credit')}>
        <Text style={{ color: filter === 'Credit' ? '#fff' : '#333', fontWeight: 'bold', fontSize: 12 }}>Credit Only</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => setScreen('dashboard')}>
        <Text style={[styles.navText, screen === 'dashboard' && styles.activeNav]}>🏠 Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => { setScreen('month'); setFilter('All'); }}>
        <Text style={[styles.navText, screen === 'month' && styles.activeNav]}>📅 Month</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => { setScreen('year'); setFilter('All'); }}>
        <Text style={[styles.navText, screen === 'year' && styles.activeNav]}>🗓️ Year</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => { setScreen('combine'); setFilter('All'); }}>
        <Text style={[styles.navText, screen === 'combine' && styles.activeNav]}>📊 Combine</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSpreadsheet = (list) => (
    <View style={styles.sheet}>
      <View style={styles.sHead}>
        <Text style={[styles.sHCell, { width: '30%' }]}>Dealer Name</Text>
        <Text style={[styles.sHCell, { width: '30%' }]}>Product</Text>
        <Text style={[styles.sHCell, { width: '20%' }]}>Type</Text>
        <Text style={[styles.sHCell, { width: '20%', textAlign: 'right' }]}>Amount</Text>
      </View>
      {list.map((t) => {
        const d = dealers.find(dl => dl.id === t.d_id);
        return (
          <View key={t.id} style={styles.sRow}>
            <Text style={[styles.sCell, { width: '30%', fontWeight: 'bold' }]} numberOfLines={1}>{d ? d.name : 'Deleted'}</Text>
            <Text style={[styles.sCell, { width: '30%' }]} numberOfLines={1}>{t.prod}</Text>
            <Text style={[styles.sCell, { width: '20%', color: t.type === 'Credit' ? '#d32f2f' : '#2e7d32', fontWeight: 'bold' }]}>{t.type}</Text>
            <Text style={[styles.sCell, { width: '20%', textAlign: 'right', fontWeight: 'bold' }]}>{t.amt}</Text>
          </View>
        );
      })}
      {list.length === 0 && <Text style={styles.empty}>No transaction records match this spreadsheet view.</Text>}
    </View>
  );

  if (isLocked) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>AgriKhaata Secure Lock</Text>
        <TextInput secureTextEntry placeholder="Enter 4-Digit PIN" value={pin} onChangeText={setPin} keyboardType="numeric" style={styles.input} />
        <TouchableOpacity style={styles.button} onPress={() => pin === '1234' ? setIsLocked(false) : Alert.alert('Error', 'Wrong PIN')}>
          <Text style={styles.btnText}>Unlock App</Text>
        </TouchableOpacity>
      </View>
    );
  }
  // ------------------ SCREEN: MONTH-WISE WINDOW ------------------
  if (screen === 'month') {
    const rawList = transactions.filter(t => t.mo === '06' && t.yr === '2026');
    const filtered = applyFilter(rawList);
    const totalSales = filtered.reduce((s, t) => s + t.amt, 0);
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.mainContainer}>
          <Text style={styles.header}>June 2026 Financial Sheet</Text>
          <View style={[styles.totalCard, { backgroundColor: '#2e7d32' }]}>
            <Text style={styles.totalLabel}>TOTAL SALES FOR THIS MONTH</Text>
            <Text style={styles.totalValue}>Rs {totalSales}</Text>
          </View>
          {renderFilterTabs()}
          {renderSpreadsheet(filtered)}
          <View style={{ height: 100 }} />
        </ScrollView>
        {renderBottomBar()}
      </View>
    );
  }

  // ------------------ SCREEN: YEAR-WISE WINDOW ------------------
  if (screen === 'year') {
    const rawList = transactions.filter(t => t.yr === '2026');
    const filtered = applyFilter(rawList);
    const totalSales = filtered.reduce((s, t) => s + t.amt, 0);
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.mainContainer}>
          <Text style={styles.header}>Year 2026 Financial Sheet</Text>
          <View style={[styles.totalCard, { backgroundColor: '#1565c0' }]}>
            <Text style={styles.totalLabel}>TOTAL SALES FOR THIS YEAR</Text>
            <Text style={styles.totalValue}>Rs {totalSales}</Text>
          </View>
          {renderFilterTabs()}
          {renderSpreadsheet(filtered)}
          <View style={{ height: 100 }} />
        </ScrollView>
        {renderBottomBar()}
      </View>
    );
  }

  // ------------------ SCREEN: OVERALL COMBINE REPORT WINDOW ------------------
  if (screen === 'combine') {
    const filtered = applyFilter(transactions);
    const totalSales = filtered.reduce((s, t) => s + t.amt, 0);
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.mainContainer}>
          <Text style={styles.header}>All-Time Overall Financial Sheet</Text>
          <View style={[styles.totalCard, { backgroundColor: '#37474f' }]}>
            <Text style={styles.totalLabel}>OVERALL MARKET CREDIT BALANCE</Text>
            <Text style={styles.totalValue}>Rs {totalCombineBalance}</Text>
            <Text style={[styles.totalLabel, { marginTop: 5 }]}>COMBINE SALES (FILTERED): Rs {totalSales}</Text>
          </View>
          {renderFilterTabs()}
          {renderSpreadsheet(filtered)}
          <View style={{ height: 100 }} />
        </ScrollView>
        {renderBottomBar()}
      </View>
    );
  }

  // ------------------ SCREEN: INDIVIDUAL KHAATA WINDOW ------------------
  if (screen === 'khaata') {
    const list = transactions.filter(t => t.d_id === curD.id);
    const filtered = applyFilter(list);
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.mainContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('dashboard')}>
            <Text style={styles.btnText}>← Back Home</Text>
          </TouchableOpacity>
          <Text style={styles.header}>{curD.name}</Text>
          <View style={[styles.totalCard, { backgroundColor: '#d32f2f' }]}>
            <Text style={styles.totalLabel}>DEALER OUTSTANDING CREDIT</Text>
            <Text style={styles.totalValue}>Rs {curD.balance}</Text>
          </View>
          
          <View style={[styles.card, { backgroundColor: '#e8f5e9' }]}>
            <Text style={styles.cardTitle}>Record New Sale</Text>
            <TextInput placeholder="Date (e.g. 27/06/2026)" value={saleDt} onChangeText={setSaleDt} style={styles.formInput} />
            <TextInput placeholder="Product Name" value={prodName} onChangeText={setProdName} style={styles.formInput} />
            <TextInput placeholder="Amount (Rs)" value={saleAmt} onChangeText={setSaleAmt} keyboardType="numeric" style={styles.formInput} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 6 }}>
              <TouchableOpacity style={[styles.toggleBtn, payType === 'Credit' && styles.actToggle]} onPress={() => setPayType('Credit')}>
                <Text style={payType === 'Credit' ? styles.actText : styles.inactText}>Credit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, payType === 'Cash' && styles.actToggle]} onPress={() => setPayType('Cash')}>
                <Text style={payType === 'Cash' ? styles.actText : styles.inactText}>Cash</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: '#1b5e20' }]} onPress={recordSale}>
              <Text style={styles.btnText}>Save Transaction</Text>
            </TouchableOpacity>
          </View>

          {renderFilterTabs()}
          {renderSpreadsheet(filtered)}
          <View style={{ height: 100 }} />
        </ScrollView>
        {renderBottomBar()}
      </View>
    );
  }

  // ------------------ DEFAULT: MAIN DASHBOARD SCREEN (HOME) ------------------
  const sortedDealers = [...dealers].sort((a, b) => a.name.localeCompare(b.name));
  const filteredDealers = sortedDealers.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.mainContainer}>
        <Text style={styles.header}>AgriKhaata Dashboard</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>+ Add New Dealer (Khaata)</Text>
          <TextInput placeholder="Dealer Name" value={newName} onChangeText={setNewName} style={styles.formInput} />
          <TextInput placeholder="Shop Name / Location" value={newShop} onChangeText={setNewShop} style={styles.formInput} />
          <TextInput placeholder="Starting Udhaar Amount (Rs)" value={newAmt} onChangeText={setNewAmt} keyboardType="numeric" style={styles.formInput} />
          <TouchableOpacity style={styles.addBtn} onPress={addDealer}>
            <Text style={styles.btnText}>Save Profile To Directory</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.secTitle}>Dealers Directory (A to Z Sorted)</Text>
        <TextInput placeholder="🔍 Search Dealer by Name..." value={search} onChangeText={setSearch} style={styles.searchBar} />
        
        {filteredDealers.map((d) => (
          <TouchableOpacity key={d.id} style={styles.dCard} onPress={() => openKhaata(d)}>
            <View>
              <Text style={styles.dName}>{d.name} 📋</Text>
              <Text style={styles.shopName}>{d.shop}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.balLabel}>Outstanding</Text>
              <Text style={styles.dBal}>Rs {d.balance}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {filteredDealers.length === 0 && <Text style={{ textAlign: 'center', marginTop: 10, color: '#777' }}>No dealers found matching search.</Text>}
        <View style={{ height: 100 }} />
      </ScrollView>
      {renderBottomBar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3f20' },
  mainContainer: { flex: 1, padding: 15, backgroundColor: '#f4f4f4' },
  title: { fontSize: 20, color: '#fff', marginBottom: 15, fontWeight: 'bold' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1e3f20', marginTop: 15, textAlign: 'center', marginBottom: 10 },
  input: { backgroundColor: '#fff', width: '80%', padding: 10, borderRadius: 5, marginBottom: 15, textAlign: 'center' },
  button: { backgroundColor: '#2e7d32', padding: 10, borderRadius: 5, width: '80%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  backBtn: { backgroundColor: '#777', padding: 8, borderRadius: 5, alignSelf: 'flex-start', marginTop: 15, marginBottom: 10 },
  totalCard: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  totalLabel: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  totalValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 12, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e3f20', marginBottom: 5 },
  formInput: { borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 4, marginBottom: 8, fontSize: 14, color: '#000' },
  addBtn: { backgroundColor: '#2e7d32', padding: 8, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  searchBar: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 15, fontSize: 14, borderWidth: 1, borderColor: '#ddd' },
  secTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 5 },
  dCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  dName: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  shopName: { fontSize: 12, color: '#666' },
  balLabel: { fontSize: 10, color: '#999' },
  dBal: { fontSize: 14, fontWeight: 'bold', color: '#d32f2f' },
  toggleBtn: { padding: 6, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, width: '45%', alignItems: 'center' },
  actToggle: { backgroundColor: '#2e7d32', borderColor: '#2e7d32' },
  actText: { color: '#fff', fontWeight: 'bold' },
  inactText: { color: '#333' },
  bottomBar: { flexDirection: 'row', height: 60, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', justifyContent: 'space-around', alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
  navItem: { alignItems: 'center', padding: 10 },
navText: { fontSize: 13, color: '#666', fontWeight: '500' },activeNav: { color: '#2e7d32', fontWeight: 'bold' },filterBar: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },filterTab: { paddingVertical: 6, borderRadius: 20, backgroundColor: '#e0e0e0', width: '30%', alignItems: 'center' },actFilter: { backgroundColor: '#2e7d32' },sheet: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginTop: 10, overflow: 'hidden' },sHead: { flexDirection: 'row', backgroundColor: '#1e3f20', padding: 8 },sHCell: { color: '#fff', fontWeight: 'bold', fontSize: 12 },sRow: { flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },sCell: { fontSize: 12, color: '#333' },empty: { textAlign: 'center', padding: 15, color: '#777' }});
