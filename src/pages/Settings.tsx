import { useState } from 'react';
import { Trash2, AlertTriangle, Download, Upload } from 'lucide-react';
import { useAppStore } from '../lib/store';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Settings() {
  const [confirmReset, setConfirmReset] = useState(false);
  const { resetProgress, questionHistory, examHistory } = useAppStore();

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
  };

  const handleExport = () => {
    const data = localStorage.getItem('cissp-trainer');
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cissp-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = ev.target?.result as string;
          JSON.parse(text); // validate
          localStorage.setItem('cissp-trainer', text);
          window.location.reload();
        } catch {
          alert('Invalid backup file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground-muted mt-1">Manage your data and preferences</p>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Data</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-elevated/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-foreground">{questionHistory.length}</p>
              <p className="text-xs text-foreground-muted mt-1">Questions Answered</p>
            </div>
            <div className="bg-surface-elevated/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-foreground">{examHistory.length}</p>
              <p className="text-xs text-foreground-muted mt-1">Exams Taken</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export / Import */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground mb-4">Backup & Restore</h2>
          <p className="text-sm text-foreground-muted mb-4">
            Export your progress to a JSON file or restore from a previous backup.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button variant="secondary" onClick={handleImport}>
              <Upload className="w-4 h-4" />
              Import Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      <Card className="border-destructive/20">
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground mb-2">Reset All Progress</h2>
          <p className="text-sm text-foreground-muted mb-4">
            This permanently deletes all your question history, exam results, study plan progress, and streak data. This cannot be undone.
          </p>

          {!confirmReset ? (
            <Button variant="destructive" onClick={() => setConfirmReset(true)}>
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </Button>
          ) : (
            <div className="bg-destructive-muted border border-destructive/30 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium">
                  Are you sure? This will erase {questionHistory.length} question answers and {examHistory.length} exam results.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="destructive" onClick={handleReset}>
                  Yes, Reset Everything
                </Button>
                <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
