'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, Users, Briefcase, Star, Info, ArrowRight, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import api from '@/lib/api'

export default function AdminExportPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.adminExport

  const EXPORT_OPTIONS = [
    {
      id: 'partners',
      icon: Briefcase,
      title: t(d.partnersTitle),
      desc: t(d.partnersDesc),
      color: 'from-[#C2517A] to-[#a8365f]',
      formats: ['CSV', 'Excel'],
    },
    {
      id: 'clients',
      icon: Users,
      title: t(d.clientsTitle),
      desc: t(d.clientsDesc),
      color: 'from-[#7F77DD] to-[#6059c4]',
      formats: ['CSV', 'Excel'],
    },
    {
      id: 'reviews',
      icon: Star,
      title: t(d.reviewsTitle),
      desc: t(d.reviewsDesc),
      color: 'from-amber-400 to-orange-500',
      formats: ['CSV', 'Excel'],
    },
    {
      id: 'subscriptions',
      icon: FileSpreadsheet,
      title: t(d.subsTitle),
      desc: t(d.subsDesc),
      color: 'from-green-500 to-emerald-600',
      formats: ['CSV', 'Excel'],
    },
  ]

  const [exporting, setExporting] = useState<string | null>(null)
  const [dateFrom, setDateFrom] = useState('2025-01-01')
  const [dateTo, setDateTo]   = useState(new Date().toISOString().split('T')[0])

  const handleExport = async (id: string, format: string) => {
    setExporting(`${id}-${format}`);
    try {
      let data: any[] = [];
      
      if (id === 'partners') {
        const res = await api.get('/admin/export/partners');
        data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      } else if (id === 'clients') {
        const res = await api.get('/admin/export/clients');
        data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      } else if (id === 'reviews') {
        const res = await api.get('/reviews/pending?page=1').catch(() => ({ data: { data: [] } }));
        data = res.data?.data || [];
      } else if (id === 'subscriptions') {
        const res = await api.get('/admin/partners?status=ACTIVE&page=1');
        data = (res.data?.data?.data || []).map((p: any) => ({
          businessName: p.businessName,
          plan: p.isPro ? 'PRO' : 'SIMPLE',
          wilaya: p.wilaya?.name || '',
          phone: p.phone || '',
          email: p.email || p.user?.email || '',
        }));
      }
      
      if (!data || data.length === 0) {
        toast('No data available for this export', { icon: 'ℹ️' });
        return;
      }
      
      // Flatten nested objects for CSV
      const flatData = data.map((row: any) => {
        const flat: any = {};
        const flatten = (obj: any, prefix = '') => {
          for (const [key, val] of Object.entries(obj)) {
            const newKey = prefix ? `${prefix}_${key}` : key;
            if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
              flatten(val, newKey);
            } else if (Array.isArray(val)) {
              flat[newKey] = val.map((v: any) => (typeof v === 'object' ? v?.name || JSON.stringify(v) : v)).join('; ');
            } else {
              flat[newKey] = val ?? '';
            }
          }
        };
        flatten(row);
        return flat;
      });
      
      // Convert to CSV
      const headers = Object.keys(flatData[0]);
      const csvRows = [headers.join(',')];
      for (const row of flatData) {
        const values = headers.map(h => {
          const strVal = String(row[h] ?? '').replace(/"/g, '""');
          return `"${strVal}"`;
        });
        csvRows.push(values.join(','));
      }
      const csvString = csvRows.join('\n');
      
      // Determine MIME type and extension
      const isExcel = format === 'Excel';
      const mimeType = isExcel ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;';
      const ext = isExcel ? 'xls' : 'csv';
      
      const blob = new Blob(['\uFEFF' + csvString], { type: mimeType }); // BOM for Excel UTF-8
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${id}_export_${new Date().toISOString().split('T')[0]}.${ext}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`${t(d.exportedMsg)} (${format}) — ${data.length} lignes`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Échec de l\'export. Réessayez.');
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Download size={28} className="text-[#C2517A]" />
          {t(d.title)}
        </h1>
        <p className="page-subtitle">{t(d.sub)}</p>
      </div>

      {/* Date range */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-900 mb-4">{t(d.period)}</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="form-group flex-1">
            <label className="label">{t(d.from)}</label>
            <input type="date" className="input-field text-sm" value={dateFrom}
              onChange={e => setDateFrom(e.target.value)} />
          </div>
          {lang === 'ar'
            ? <ArrowLeft size={14} className="text-gray-400 mt-5 hidden sm:block" />
            : <ArrowRight size={14} className="text-gray-400 mt-5 hidden sm:block" />
          }
          <div className="form-group flex-1">
            <label className="label">{t(d.to)}</label>
            <input type="date" className="input-field text-sm" value={dateTo}
              onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Export options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {EXPORT_OPTIONS.map(opt => {
          const Icon = opt.icon
          return (
            <div key={opt.id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center shadow-md`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{opt.title}</h3>
                  <p className="text-xs text-gray-400">{opt.desc}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {opt.formats.map(fmt => {
                  const key = `${opt.id}-${fmt}`
                  const isLoading = exporting === key
                  return (
                    <button key={fmt} onClick={() => handleExport(opt.id, fmt)} disabled={!!exporting}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium
                                 border border-pink-200 text-[#C2517A] hover:bg-[#C2517A] hover:text-white hover:border-[#C2517A]
                                 disabled:opacity-50 transition-all duration-200">
                      {isLoading
                        ? <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        : <FileText size={13} />
                      }
                      {isLoading ? t(d.exportingBtn) : fmt}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="flex items-start text-sm text-blue-700">
          <Info size={18} className="mr-1.5 rtl:ml-1.5 rtl:mr-0 shrink-0 mt-0.5" />
          <span>{t(d.note)}</span>
        </p>
      </div>
    </div>
  )
}
