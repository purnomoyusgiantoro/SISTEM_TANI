import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import organisasiApi from '../api/organisasi';
import { useApi, useMutation } from '../hooks/useApi';
import Modal from '../components/shared/Modal';
import { User, Plus, Edit, Trash2 } from 'lucide-react';
import '../styles/pages/StrukturOrganisasi.css';


export default function StrukturOrganisasi() {
  const { currentUser } = useAuth();
  const toast = useToast();

  const { data: orgData, loading, execute: fetchOrg } = useApi(organisasiApi.getAll);
  const { mutate: updateOrg } = useMutation(organisasiApi.update);

  useEffect(() => {
    fetchOrg().catch(() => {});
  }, [fetchOrg]);

  const treeData = orgData || null;

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
            if (currentUser?.role === 'pengurus') {
              setSelectedNode(node);
              setEditName(node.nama);
              setEditJabatan(node.jabatan);
            }
          }}
          style={{
            cursor: currentUser?.role === 'pengurus' ? 'pointer' : 'default'
          }}
        >
          <div className="org-node-details">
            <h4 className="org-node-name">{node.nama}</h4>
            <span className="org-node-title">{node.jabatan}</span>
          </div>
          {currentUser?.role === 'pengurus' && (
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

  const handleSaveNode = async (e) => {
    e.preventDefault();
    if (!selectedNode) return;
    try {
      await updateOrg(selectedNode.id, { nama: editName, jabatan: editJabatan });
      toast.success('Data organisasi berhasil diperbarui');
      fetchOrg();
      setSelectedNode(null);
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui organisasi');
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      

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
            {loading ? (
              <li style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Memuat struktur organisasi...</li>
            ) : Array.isArray(treeData) && treeData.length > 0 ? (
              treeData.map(node => renderNode(node))
            ) : (
              <li style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Data struktur organisasi belum tersedia.</li>
            )}
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

