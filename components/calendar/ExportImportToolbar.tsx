'use client';

import { useState, useRef } from 'react';
import { Download, Upload, ChevronDown, Image as ImageIcon, FileText, FileImage, Loader2, Check, X } from 'lucide-react';
import { importSelections, generateFilename, type ITUSchedData } from '@/lib/export/import';
import type { Course } from '@/lib/data/courseData';
import { useI18n } from '@/components/i18n/LocaleProvider';

interface ExportImportToolbarProps {
    courses: Course[];
    onImport: (courses: Course[]) => void;
}

export default function ExportImportToolbar({ courses, onImport }: ExportImportToolbarProps) {
    const { t } = useI18n();
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [showImportConfirm, setShowImportConfirm] = useState(false);
    const [pendingImport, setPendingImport] = useState<ITUSchedData | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleExport = async (format: 'png' | 'jpg' | 'svg' | 'pdf' | 'itusched') => {
        setShowExportMenu(false);
        setExporting(true);

        try {
            const filename = generateFilename(courses, 'itu_schedule');
            // Loaded on click: jsPDF is ~400 KB and is not needed to view or
            // build a schedule.
            const { exportToImage, exportToPDF, exportSelections } = await import('@/lib/export/export');

            if (format === 'itusched') {
                exportSelections(courses, 'calendar', filename);
                showNotification('success', t.calendar.toolbar.exported);
                return;
            }

            const metadata: ITUSchedData = {
                version: '1.0',
                exportedAt: new Date().toISOString(),
                type: 'calendar',
                courses
            };

            if (format === 'pdf') {
                await exportToPDF(courses, filename, metadata);
            } else {
                await exportToImage(courses, format, filename, metadata);
            }
            showNotification('success', t.calendar.toolbar.exportedAs(format.toUpperCase()));
        } catch (e) {
            console.error('Export failed', e);
            showNotification('error', t.calendar.toolbar.exportFailed);
        } finally {
            setExporting(false);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            const data = await importSelections(file);
            if (data && data.courses && data.courses.length > 0) {
                if (courses.length > 0) {
                    // Show confirmation dialog
                    setPendingImport(data);
                    setShowImportConfirm(true);
                } else {
                    // No existing courses, import directly
                    onImport(data.courses);
                    showNotification('success', t.calendar.toolbar.imported(data.courses.length));
                }
            } else {
                showNotification('error', t.calendar.toolbar.noData);
            }
        } catch (e) {
            console.error('Import failed', e);
            showNotification('error', t.calendar.toolbar.importFailed);
        } finally {
            setImporting(false);
            // Reset file input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const confirmImport = () => {
        if (pendingImport) {
            onImport(pendingImport.courses);
            showNotification('success', t.calendar.toolbar.imported(pendingImport.courses.length));
        }
        setPendingImport(null);
        setShowImportConfirm(false);
    };

    const cancelImport = () => {
        setPendingImport(null);
        setShowImportConfirm(false);
    };

    return (
        <div className="relative flex items-center gap-2">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 ${notification.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    {notification.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}

            {/* Import Confirmation Dialog */}
            {showImportConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={cancelImport} />
                    <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t.calendar.toolbar.replaceTitle}</h3>
                        <p className="text-slate-600 text-sm mb-6">
                            {t.calendar.toolbar.replaceBody(courses.length, pendingImport?.courses.length ?? 0)}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelImport}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                {t.calendar.toolbar.cancel}
                            </button>
                            <button
                                onClick={confirmImport}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {t.calendar.toolbar.replace}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Button with Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={courses.length === 0 || exporting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-500/20"
                >
                    {exporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    {t.calendar.toolbar.export}
                    <ChevronDown className="w-3 h-3" />
                </button>

                {showExportMenu && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="py-1">
                                <button
                                    onClick={() => handleExport('png')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <ImageIcon className="w-4 h-4 text-blue-500" />
                                    {t.calendar.toolbar.png}
                                </button>
                                <button
                                    onClick={() => handleExport('jpg')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <FileImage className="w-4 h-4 text-amber-500" />
                                    {t.calendar.toolbar.jpg}
                                </button>
                                <button
                                    onClick={() => handleExport('svg')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <FileImage className="w-4 h-4 text-purple-500" />
                                    {t.calendar.toolbar.svg}
                                </button>
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <FileText className="w-4 h-4 text-red-500" />
                                    {t.calendar.toolbar.pdf}
                                </button>
                                <div className="border-t border-slate-100 my-1" />
                                <button
                                    onClick={() => handleExport('itusched')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <FileText className="w-4 h-4 text-emerald-500" />
                                    {t.calendar.toolbar.itusched}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Import Button */}
            <button
                onClick={handleImportClick}
                disabled={importing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {importing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Upload className="w-4 h-4" />
                )}
                {t.calendar.toolbar.import}
            </button>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".itusched,.json,.png,.svg,.pdf"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
