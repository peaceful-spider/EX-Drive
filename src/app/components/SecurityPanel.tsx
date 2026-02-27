import React, { useState } from 'react';
import { Shield, Lock, Key, Eye, EyeOff, AlertTriangle, CheckCircle2, X, Fingerprint, Smartphone } from 'lucide-react';
import { FileItem } from '../types';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface SecurityPanelProps {
  file: FileItem;
  onUpdateSecurity: (fileId: string, settings: SecuritySettings) => void;
  onClose: () => void;
}

export interface SecuritySettings {
  encrypted: boolean;
  encryptionType: 'client' | 'server' | 'zero-knowledge';
  requirePassword: boolean;
  requireBiometric: boolean;
  allowScreenshots: boolean;
  watermark: boolean;
  expiryDate?: Date;
}

export function SecurityPanel({ file, onUpdateSecurity, onClose }: SecurityPanelProps) {
  const [settings, setSettings] = useState<SecuritySettings>({
    encrypted: file.encrypted || false,
    encryptionType: file.encryptionType || 'server',
    requirePassword: false,
    requireBiometric: false,
    allowScreenshots: true,
    watermark: false,
  });

  const [showEncryptionKey, setShowEncryptionKey] = useState(false);

  const handleSave = () => {
    onUpdateSecurity(file.id, settings);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Security Settings</h2>
              <p className="text-sm text-slate-500">{file.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Encryption Status */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                settings.encrypted ? "bg-green-500" : "bg-slate-400"
              )}>
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">
                  {settings.encrypted ? 'Encryption Active' : 'Encryption Disabled'}
                </h3>
                <p className="text-sm text-slate-600">
                  {settings.encrypted
                    ? 'This file is protected with end-to-end encryption'
                    : 'Enable encryption to protect this file'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.encrypted}
                  onChange={e => setSettings({ ...settings, encrypted: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>

          {/* Encryption Type */}
          {settings.encrypted && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Encryption Method</label>
              <div className="space-y-2">
                {[
                  { value: 'server', label: 'Server-Side', desc: 'Encrypted at rest on our servers (AES-256)' },
                  { value: 'client', label: 'Client-Side', desc: 'Encrypted on your device before upload' },
                  { value: 'zero-knowledge', label: 'Zero-Knowledge', desc: 'Only you have the decryption key' },
                ].map(option => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all",
                      settings.encryptionType === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="encryptionType"
                      value={option.value}
                      checked={settings.encryptionType === option.value}
                      onChange={e => setSettings({ ...settings, encryptionType: e.target.value as any })}
                      className="mt-1 w-4 h-4 text-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{option.label}</div>
                      <div className="text-xs text-slate-600">{option.desc}</div>
                    </div>
                    {settings.encryptionType === option.value && (
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Encryption Key */}
          {settings.encrypted && settings.encryptionType === 'zero-knowledge' && (
            <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-900 mb-1">Your Encryption Key</h4>
                  <p className="text-xs text-orange-700 mb-3">
                    Save this key securely. If you lose it, your data cannot be recovered.
                  </p>
                  <div className="relative">
                    <input
                      type={showEncryptionKey ? 'text' : 'password'}
                      value="ZK-AES256-abc123def456ghi789jkl012mno345pqr678"
                      readOnly
                      className="w-full px-3 py-2 pr-10 bg-white border border-orange-300 rounded-lg text-xs font-mono"
                    />
                    <button
                      onClick={() => setShowEncryptionKey(!showEncryptionKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-orange-100 rounded"
                    >
                      {showEncryptionKey ? (
                        <EyeOff className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-orange-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                <Key className="w-4 h-4 inline mr-2" />
                Download Backup Key
              </button>
            </div>
          )}

          {/* Access Controls */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Access Controls</label>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium text-slate-900">Require Password</div>
                    <div className="text-xs text-slate-600">Users must enter a password to access</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requirePassword}
                  onChange={e => setSettings({ ...settings, requirePassword: e.target.checked })}
                  className="w-5 h-5 text-blue-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium text-slate-900">Require Biometric</div>
                    <div className="text-xs text-slate-600">Fingerprint or Face ID required</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireBiometric}
                  onChange={e => setSettings({ ...settings, requireBiometric: e.target.checked })}
                  className="w-5 h-5 text-blue-500 rounded"
                />
              </label>
            </div>
          </div>

          {/* View Controls */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">View Controls</label>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium text-slate-900">Allow Screenshots</div>
                    <div className="text-xs text-slate-600">Permit screen captures on mobile devices</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowScreenshots}
                  onChange={e => setSettings({ ...settings, allowScreenshots: e.target.checked })}
                  className="w-5 h-5 text-blue-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium text-slate-900">Apply Watermark</div>
                    <div className="text-xs text-slate-600">Overlay viewer's email on preview</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.watermark}
                  onChange={e => setSettings({ ...settings, watermark: e.target.checked })}
                  className="w-5 h-5 text-blue-500 rounded"
                />
              </label>
            </div>
          </div>

          {/* Security Score */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Security Score</span>
              <span className="text-2xl font-bold text-blue-600">
                {(settings.encrypted ? 40 : 0) +
                 (settings.requirePassword ? 20 : 0) +
                 (settings.requireBiometric ? 20 : 0) +
                 (!settings.allowScreenshots ? 10 : 0) +
                 (settings.watermark ? 10 : 0)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                style={{
                  width: `${(settings.encrypted ? 40 : 0) +
                    (settings.requirePassword ? 20 : 0) +
                    (settings.requireBiometric ? 20 : 0) +
                    (!settings.allowScreenshots ? 10 : 0) +
                    (settings.watermark ? 10 : 0)}%`
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
