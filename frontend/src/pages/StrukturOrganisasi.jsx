import { useState, useEffect } from 'react';
import * as Mock from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import organisasiApi from '../api/organisasi';
import { useApi, useMutation } from '../hooks/useApi';
import Modal from '../components/shared/Modal';
import { User, Plus, Edit, Trash2 } from 'lucide-react';

export default function StrukturOrganisasi() {
  const { currentUser } = useAuth();
  const [treeData, setTreeData] = useState(Mock.strukturOrganisasi);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form Edit State
  const [editName, setEditName] = useState('');
  const [editJabatan, setEditJabatan] = useState('');

  // Recursive node rendering for org chart
  const renderNode = (node) => {
    const isLevelRoot = node.id === 1;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <li key={node.id} className="org-tree-item">
        <div 
          className={`org-node-card ${isLevelRoot ? 'root' : ''}`}
          onClick={() => {
            if (currentUser.role === 'pengurus') {
              setSelectedNode(node);
              setEditName(node.nama);
              setEditJabatan(node.jabatan);
            }
          }}
          style={{
            cursor: currentUser.role === 'pengurus' ? 'pointer' : 'default'
          }}
        >
          <div className="org-node-details">
            <h4 className="org-node-name">{node.nama}</h4>
            <span className="org-node-title">{node.jabatan}</span>
          </div>
          {currentUser.role === 'pengurus' && (
            <div className="org-node-actions-hint">
              <Edit size={12} /> Edit
            </div>
          )}
        </div>
        {hasChildren && (
          <ul className="org-tree-children">
            {node.children.map((child) => renderNode(child))}
          </ul>
        )}
      </li>
    );
  };

  // Helper recursive tree updater
  const updateNodeInTree = (rootNode, nodeId, updatedFields) => {
    if (rootNode.id === nodeId) {
      return { ...rootNode, ...updatedFields };
    }
    if (rootNode.children) {
      return {
        ...rootNode,
        children: rootNode.children.map(child => updateNodeInTree(child, nodeId, updatedFields))
      };
    }
    return rootNode;
  };

  const handleSaveNode = (e) => {
    e.preventDefault();
    const updated = updateNodeInTree(treeData, selectedNode.id, {
      nama: editName,
      jabatan: editJabatan
    });
    setTreeData(updated);
    setSelectedNode(null);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <style>{`
        /* --- Chart CSS layout tree --- */
        .org-chart-wrapper {
          width: 100%;
          background: white;
          border-radius: 8px;
          padding: 40px 20px;
          border: 1px solid var(--color-border);
          overflow-x: auto;
          text-align: center;
        }
        
        .org-tree {
          display: inline-block;
          margin: 0 auto;
          text-align: center;
          padding-left: 0;
        }
        
        .org-tree ul {
          padding-top: 20px;
          position: relative;
          transition: all 0.5s;
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        
        .org-tree li {
          float: left;
          text-align: center;
          list-style-type: none;
          position: relative;
          padding: 20px 5px 0 5px;
          transition: all 0.5s;
        }
        
        /* Connector lines lines */
        .org-tree li::before, .org-tree li::after {
          content: '';
          position: absolute;
          top: 0;
          right: 50%;
          border-top: 1px solid var(--color-border);
          width: 50%;
          height: 20px;
        }
        
        .org-tree li::after {
          right: auto;
          left: 50%;
          border-left: 1px solid var(--color-border);
        }
        
        .org-tree li:only-child::after, .org-tree li:only-child::before {
          display: none;
        }
        
        .org-tree li:only-child {
          padding-top: 0;
        }
        
        .org-tree li:first-child::before, .org-tree li:last-child::after {
          border: 0 none;
        }
        
        .org-tree li:last-child::before {
          border-right: 1px solid var(--color-border);
          border-radius: 0 5px 0 0;
        }
        
        .org-tree li:first-child::after {
          border-radius: 5px 0 0 0;
        }
        
        .org-tree ul ul::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          border-left: 1px solid var(--color-border);
          width: 0;
          height: 20px;
        }
        
        /* Node Cards */
        .org-node-card {
          border: 1px solid var(--color-border);
          padding: 12px;
          background: white;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          width: 220px;
          box-shadow: var(--shadow-sm);
          position: relative;
          transition: all 0.2s;
        }
        
        .org-node-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--color-primary-light);
          transform: translateY(-2px);
        }
        
        .org-node-card.root {
          background: var(--color-primary-50);
          border-color: var(--color-primary-light);
        }
        
        .org-node-avatar {
          width: 36px;
          height: 36px;
          background: var(--color-primary);
          color: white;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .org-node-card.root .org-node-avatar {
          background: var(--color-secondary);
        }
        
        .org-node-details {
          flex: 1;
          min-width: 0;
        }
        
        .org-node-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .org-node-title {
          font-size: 0.7rem;
          color: var(--color-text-secondary);
          display: block;
        }
        
        .org-node-actions-hint {
          position: absolute;
          bottom: 2px;
          right: 6px;
          font-size: 0.65rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          gap: 2px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .org-node-card:hover .org-node-actions-hint {
          opacity: 1;
        }

        @media (max-width: 768px) {
          /* Stack org vertically for mobile screens */
          .org-tree ul {
            flex-direction: column !important;
            align-items: center !important;
            padding-top: 10px !important;
            gap: 12px !important;
          }
          .org-tree li {
            padding-top: 10px !important;
          }
          .org-tree li::before, .org-tree li::after, .org-tree ul ul::before {
            display: none !important;
          }
        }
      `}</style>

      <div className="admin-card">
        {/* Header Row Inside Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Struktur Organisasi</h1>
          </div>
          <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ fontWeight: '500' }}>strukturorganisasi</span>
          </nav>
        </div>
        
        <div style={{ padding: '20px' }}>
          <div className="org-chart-wrapper">
        <div className="org-tree">
          <ul>
            {renderNode(treeData)}
          </ul>
        </div>
      </div>

      {/* Edit Node Modal */}
      {selectedNode && (
        <Modal 
          title={`Edit Anggota: ${selectedNode.jabatan}`} 
          onClose={() => setSelectedNode(null)}
        >
          <form onSubmit={handleSaveNode}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Nama Lengkap</label>
              <input 
                type="text" 
                required 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Jabatan / Struktur</label>
              <input 
                type="text" 
                required 
                value={editJabatan} 
                onChange={(e) => setEditJabatan(e.target.value)} 
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => setSelectedNode(null)}
                style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: '6px', fontWeight: '600' }}
              >
                Batal
              </button>
              <button 
                type="submit" 
                style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: '6px', fontWeight: '600' }}
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </Modal>
      )}
          </div>
        </div>
    </div>
  );
}
