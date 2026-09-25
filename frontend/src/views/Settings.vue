<script setup>
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const currency = ref('USD')
const dateFormat = ref('MM/DD/YYYY')
const darkMode = ref(true)
const notifications = ref(true)
const autoSave = ref(true)
const apiUrl = ref(import.meta.env.PROD ? window.location.origin : 'http://localhost:3000')

const saved = ref(false)
const exporting = ref(false)

const save = () => {
  saved.value = true
  setTimeout(() => saved.value = false, 2500)
}

const clearData = () => {
  if (confirm('Are you sure? This will clear all local settings.')) {
    currency.value = 'USD'
    dateFormat.value = 'MM/DD/YYYY'
    notifications.value = true
    autoSave.value = true
  }
}

const exportPDF = async () => {
  exporting.value = true
  try {
    const fetchUrl = import.meta.env.PROD ? '/api/transactions' : 'http://localhost:3000/api/transactions'
    const res = await fetch(fetchUrl)
    const transactions = await res.json()

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    // Header banner
    doc.setFillColor(20, 22, 39)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setFillColor(99, 102, 241)
    doc.rect(0, 0, 6, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('FinDash', 18, 18)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(148, 163, 184)
    doc.text('Personal Finance Dashboard — Transaction Report', 18, 27)
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 18, 34)

    // Summary boxes
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + parseFloat(t.amount), 0)
    const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + parseFloat(t.amount), 0)
    const balance = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : '0.0'
    const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const boxes = [
      { label: 'NET BALANCE', value: fmt(balance), color: [99, 102, 241] },
      { label: 'TOTAL INCOME', value: fmt(totalIncome), color: [16, 185, 129] },
      { label: 'TOTAL EXPENSES', value: fmt(totalExpenses), color: [239, 68, 68] },
      { label: 'SAVINGS RATE', value: savingsRate + '%', color: [245, 158, 11] },
    ]
    const boxW = 43, boxH = 22, boxStartY = 48, gap = 4
    boxes.forEach((b, i) => {
      const x = 14 + i * (boxW + gap)
      doc.setFillColor(17, 22, 39)
      doc.roundedRect(x, boxStartY, boxW, boxH, 3, 3, 'F')
      doc.setDrawColor(...b.color)
      doc.setLineWidth(0.5)
      doc.roundedRect(x, boxStartY, boxW, boxH, 3, 3, 'S')
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(148, 163, 184)
      doc.text(b.label, x + 4, boxStartY + 8)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...b.color)
      doc.text(b.value, x + 4, boxStartY + 17)
    })

    // Table title
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(241, 245, 249)
    doc.text('Transaction History', 14, 82)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(`${transactions.length} total records`, 14, 87)

    const rows = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(t => [
        new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        t.description,
        t.category,
        t.type,
        (t.type === 'Income' ? '+' : '-') + fmt(t.amount)
      ])

    autoTable(doc, {
      startY: 90,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
      body: rows,
      theme: 'grid',
      styles: {
        font: 'helvetica', fontSize: 9, cellPadding: 4,
        textColor: [241, 245, 249], fillColor: [17, 22, 39],
        lineColor: [30, 35, 60], lineWidth: 0.3
      },
      headStyles: { fillColor: [20, 22, 50], textColor: [148, 163, 184], fontStyle: 'bold', fontSize: 8 },
      alternateRowStyles: { fillColor: [13, 16, 32] },
      columnStyles: {
        0: { cellWidth: 32 },
        1: { cellWidth: 65 },
        2: { cellWidth: 30 },
        3: { cellWidth: 22 },
        4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 4) {
          data.cell.styles.textColor = data.cell.raw.startsWith('+') ? [52, 211, 153] : [248, 113, 113]
        }
        if (data.section === 'body' && data.column.index === 3) {
          data.cell.styles.textColor = data.cell.raw === 'Income' ? [52, 211, 153] : [248, 113, 113]
        }
      }
    })

    // Footer on each page
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      const pageH = doc.internal.pageSize.height
      doc.setFillColor(17, 22, 39)
      doc.rect(0, pageH - 12, 210, 12, 'F')
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(71, 85, 105)
      doc.text('FinDash — Personal Finance Dashboard', 14, pageH - 4)
      doc.text(`Page ${i} of ${pageCount}`, 196, pageH - 4, { align: 'right' })
    }

    doc.save(`findash-report-${new Date().toISOString().slice(0, 10)}.pdf`)
  } catch (err) {
    console.error(err)
    alert('Export failed. Make sure your backend is running on http://localhost:3000')
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Settings Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">

      <!-- Preferences -->
      <div class="add-form-card" style="margin-bottom: 0;">
        <div class="form-title">
          <span class="material-symbols-rounded title-icon">tune</span>
          Preferences
        </div>
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div class="form-field">
            <label>Currency</label>
            <select v-model="currency">
              <option value="USD">🇺🇸 USD — US Dollar ($)</option>
              <option value="THB">🇹🇭 THB — Thai Baht (฿)</option>
              <option value="EUR">🇪🇺 EUR — Euro (€)</option>
              <option value="GBP">🇬🇧 GBP — British Pound (£)</option>
              <option value="JPY">🇯🇵 JPY — Japanese Yen (¥)</option>
            </select>
          </div>
          <div class="form-field">
            <label>Date Format</label>
            <select v-model="dateFormat">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div class="form-field">
            <label>API Server URL</label>
            <input v-model="apiUrl" type="text" placeholder="http://localhost:3000" />
          </div>
        </div>
      </div>

      <!-- Toggles -->
      <div class="add-form-card" style="margin-bottom: 0;">
        <div class="form-title">
          <span class="material-symbols-rounded title-icon">toggle_on</span>
          App Settings
        </div>
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div v-for="item in [
            { label: 'Dark Mode', sub: 'Use the dark interface theme', key: 'darkMode', model: darkMode },
            { label: 'Notifications', sub: 'Show in-app notifications', key: 'notifications', model: notifications },
            { label: 'Auto Save', sub: 'Save changes automatically', key: 'autoSave', model: autoSave },
          ]" :key="item.key" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border);">
            <div>
              <div style="font-size: 0.9rem; font-weight: 500; margin-bottom: 3px;">{{ item.label }}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">{{ item.sub }}</div>
            </div>
            <label style="position:relative; display:inline-block; width:44px; height:24px; cursor:pointer; flex-shrink:0;">
              <input type="checkbox" v-model="item.model.value" style="opacity:0; width:0; height:0; position:absolute;" />
              <span :style="{ position:'absolute', top:0, left:0, right:0, bottom:0, borderRadius:'24px', transition:'background 0.3s', background: item.model.value ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }"></span>
              <span :style="{ position:'absolute', top:'3px', left: item.model.value ? '23px' : '3px', width:'18px', height:'18px', background:'white', borderRadius:'50%', transition:'left 0.3s', boxShadow:'0 2px 4px rgba(0,0,0,0.3)' }"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- About & Danger Zone -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">

      <!-- About -->
      <div class="add-form-card" style="margin-bottom: 0;">
        <div class="form-title">
          <span class="material-symbols-rounded title-icon">info</span>
          About FinDash
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.88rem;">
          <div style="display:flex; justify-content:space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
            <span style="color: var(--text-muted);">Version</span>
            <span style="font-weight:600; color: var(--accent-light);">1.0.0</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
            <span style="color: var(--text-muted);">Frontend</span>
            <span>Vue 3 + Vite</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
            <span style="color: var(--text-muted);">Backend</span>
            <span>Node.js + Express</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
            <span style="color: var(--text-muted);">Database</span>
            <span>SQLite (zero-config)</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding: 10px 0;">
            <span style="color: var(--text-muted);">Charts</span>
            <span>Chart.js + Vue-Chartjs</span>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="add-form-card" style="margin-bottom: 0; border-color: rgba(239,68,68,0.2);">
        <div class="form-title" style="color: var(--danger-light);">
          <span class="material-symbols-rounded title-icon" style="color: var(--danger-light);">warning</span>
          Danger Zone
        </div>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="padding: 16px; background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15); border-radius: 12px;">
            <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">Reset Settings</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px;">This will reset all preferences back to defaults.</div>
            <button @click="clearData" style="padding: 8px 18px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: var(--danger-light); border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor:pointer; transition: all 0.2s;">
              Reset All Settings
            </button>
          </div>
          <div style="padding: 16px; background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px;">
            <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">Export Report</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px;">Download a beautifully formatted PDF report with all your transactions and a financial summary.</div>
            <button @click="exportPDF" :disabled="exporting" :style="{ opacity: exporting ? 0.6 : 1 }" style="padding: 8px 18px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: var(--accent-light); border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor:pointer; transition: all 0.2s;">
              <span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; margin-right:4px;">{{ exporting ? 'hourglass_empty' : 'picture_as_pdf' }}</span>
              {{ exporting ? 'Generating PDF...' : 'Export PDF' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div style="margin-top: 24px; display: flex; align-items: center; gap: 14px;">
      <button class="btn-save" @click="save">
        <span class="material-symbols-rounded" style="font-size:18px; vertical-align:middle; margin-right:6px;">save</span>
        Save Settings
      </button>
      <span v-if="saved" style="color: var(--success-light); font-size: 0.88rem; font-weight: 500;">
        <span class="material-symbols-rounded" style="font-size:16px; vertical-align:middle;">check_circle</span>
        Settings saved!
      </span>
    </div>
  </div>
</template>
