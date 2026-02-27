import React, { useState } from 'react';
import { Sparkles, Plus, X, Trash2, Play } from 'lucide-react';
import { SmartCollection, CollectionRule, FileItem } from '../types';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface SmartCollectionsProps {
  collections: SmartCollection[];
  files: FileItem[];
  onCreateCollection: (collection: Omit<SmartCollection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteCollection: (id: string) => void;
  onSelectCollection: (id: string) => void;
  onClose: () => void;
}

const FIELD_OPTIONS = [
  { value: 'type', label: 'File Type' },
  { value: 'size', label: 'File Size' },
  { value: 'date', label: 'Date Modified' },
  { value: 'tags', label: 'Tags' },
  { value: 'name', label: 'Name' },
  { value: 'starred', label: 'Starred' },
  { value: 'shared', label: 'Shared' },
];

const OPERATOR_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  type: [{ value: 'equals', label: 'is' }, { value: 'in', label: 'is one of' }],
  size: [{ value: 'greaterThan', label: '>' }, { value: 'lessThan', label: '<' }],
  date: [{ value: 'after', label: 'after' }, { value: 'before', label: 'before' }],
  tags: [{ value: 'contains', label: 'contains' }, { value: 'in', label: 'has any of' }],
  name: [{ value: 'contains', label: 'contains' }, { value: 'equals', label: 'equals' }],
  starred: [{ value: 'equals', label: 'is' }],
  shared: [{ value: 'equals', label: 'is' }],
};

export function SmartCollections({ collections, files, onCreateCollection, onDeleteCollection, onSelectCollection, onClose }: SmartCollectionsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [rules, setRules] = useState<Omit<CollectionRule, 'id'>[]>([{
    field: 'type',
    operator: 'equals',
    value: 'document',
    conjunction: 'AND'
  }]);

  const addRule = () => {
    setRules([...rules, { field: 'type', operator: 'equals', value: '', conjunction: 'AND' }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, updates: Partial<CollectionRule>) => {
    setRules(rules.map((rule, i) => i === index ? { ...rule, ...updates } : rule));
  };

  const evaluateRules = () => {
    return files.filter(file => {
      let match = true;
      rules.forEach((rule, index) => {
        let ruleMatch = false;
        
        switch (rule.field) {
          case 'type':
            ruleMatch = rule.operator === 'equals' ? file.type === rule.value : true;
            break;
          case 'size':
            const sizeValue = Number(rule.value);
            ruleMatch = rule.operator === 'greaterThan' ? file.size > sizeValue : file.size < sizeValue;
            break;
          case 'name':
            ruleMatch = rule.operator === 'contains' ? file.name.toLowerCase().includes(String(rule.value).toLowerCase()) : file.name === rule.value;
            break;
          case 'starred':
            ruleMatch = file.starred === (rule.value === 'true');
            break;
          case 'shared':
            ruleMatch = file.shared === (rule.value === 'true');
            break;
          case 'tags':
            ruleMatch = file.tags.some(tag => String(rule.value).includes(tag));
            break;
        }

        if (index === 0) {
          match = ruleMatch;
        } else {
          match = rule.conjunction === 'AND' ? match && ruleMatch : match || ruleMatch;
        }
      });
      return match;
    });
  };

  const matchingFiles = evaluateRules();

  const handleCreate = () => {
    if (!newCollectionName.trim() || rules.length === 0) return;
    
    onCreateCollection({
      name: newCollectionName,
      icon: 'sparkles',
      color: '#8b5cf6',
      rules: rules.map((rule, index) => ({ ...rule, id: `rule-${index}` }))
    });
    
    setNewCollectionName('');
    setRules([{ field: 'type', operator: 'equals', value: 'document', conjunction: 'AND' }]);
    setIsCreating(false);
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Smart Collections</h2>
              <p className="text-sm text-slate-500">Auto-organize files with dynamic rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isCreating ? (
            <>
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all mb-6 group"
              >
                <Plus className="w-5 h-5 text-slate-400 group-hover:text-purple-500" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-purple-700">Create New Smart Collection</span>
              </button>

              <div className="space-y-3">
                {collections.map(collection => (
                  <div key={collection.id} className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: collection.color + '20' }}>
                      <Sparkles className="w-5 h-5" style={{ color: collection.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{collection.name}</h3>
                      <p className="text-xs text-slate-500">{collection.rules.length} rules</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onSelectCollection(collection.id)}
                        className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-medium hover:bg-purple-600"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => onDeleteCollection(collection.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
                {collections.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <Sparkles className="w-16 h-16 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No smart collections yet. Create one to get started!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Collection Name</label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={e => setNewCollectionName(e.target.value)}
                  placeholder="e.g., Recent Documents"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-700">Rules</label>
                  <button onClick={addRule} className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium">
                    <Plus className="w-3 h-3" /> Add Rule
                  </button>
                </div>

                <div className="space-y-3">
                  {rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      {index > 0 && (
                        <select
                          value={rule.conjunction}
                          onChange={e => updateRule(index, { conjunction: e.target.value as 'AND' | 'OR' })}
                          className="px-2 py-1 text-xs font-bold border border-slate-300 rounded bg-white"
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      )}
                      <select
                        value={rule.field}
                        onChange={e => updateRule(index, { field: e.target.value as any })}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded bg-white"
                      >
                        {FIELD_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <select
                        value={rule.operator}
                        onChange={e => updateRule(index, { operator: e.target.value as any })}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded bg-white"
                      >
                        {(OPERATOR_OPTIONS[rule.field] || []).map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={String(rule.value)}
                        onChange={e => updateRule(index, { value: e.target.value })}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded"
                      />
                      <button onClick={() => removeRule(index)} className="p-2 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">Preview Results</span>
                </div>
                <p className="text-sm text-blue-700">
                  This collection will contain <strong>{matchingFiles.length}</strong> file{matchingFiles.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newCollectionName.trim()}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Collection
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
