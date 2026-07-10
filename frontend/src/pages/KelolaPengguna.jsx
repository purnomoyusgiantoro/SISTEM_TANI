import { useState, useEffect } from 'react';
import * as Mock from '../data/mockData';
import { useToast } from '../context/ToastContext';
import usersApi from '../api/users';
import { useApi, useMutation } from '../hooks/useApi';
import { Plus, Edit, Trash2, Shield, UserX, UserCheck } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';

export default function KelolaPengguna() {
  const [usersList, setUsersList] = useState(Mock.users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Form State
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('petani');
  const [status, setStatus] = useState('aktif');

  const handleCreate = (e) => {
    e.preventDefault();
    const newUser = {
      id: usersList.length + 1,
      nama,
      email,
      role,
      status,
      avatar: null,
      lastLogin: '-'
    };
    setUsersList([...usersList, newUser]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setUsersList(prev => prev.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          nama,
          email,
          role,
          status
        };
      }
      return u;
    }));
    setSelectedUser(null);
    resetForm();
  };

  const toggleUserStatus = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'aktif' ? 'nonaktif' : 'aktif' };
      }
      return u;
    }));
  };

  const handleDelete = () => {
    setUsersList(prev => prev.filter(u => u.id !== showDeleteModal.id));
    setShowDeleteModal(null);
  };

  const resetForm = () => {
    setNama('');
    setEmail('');
    setRole('petani');
    setStatus('aktif');
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setNama(user.nama);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="admin-card">
        {/* Header Row Inside Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Manajemen Akun Pengguna</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setShowAddModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: 'var(--color-primary)', color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', height: '38px', boxSizing: 'border-box' }}
            >
              <Plus size={16} /> Tambah Akun
            </button>
            <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ fontWeight: '500' }}>kelolapengguna</span>
            </nav>
          </div>
        </div>
        
        <div style={{ padding: '20px' }}>

      {/* Main Table List */}
      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: '700' }}>
              <th style={{ padding: '12px 16px' }}>Nama Lengkap</th>
              <th style={{ padding: '12px 16px' }}>Email Instansi</th>
              <th style={{ width: 140, padding: '12px 16px', textAlign: 'center' }}>Role Akses</th>
              <th style={{ width: 170, padding: '12px 16px', textAlign: 'center' }}>Login Terakhir</th>
              <th style={{ width: 140, padding: '12px 16px', textAlign: 'center' }}>Status Akun</th>
              <th style={{ width: 130, padding: '12px 16px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border-light)', fontSize: '0.875rem' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>{user.nama}</td>
                <td style={{ padding: '12px 16px' }}>{user.email}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    display: 'inline-block',
                    width: '90px',
                    textAlign: 'center',
                    background: user.role === 'admin' ? 'var(--color-danger-50)' : user.role === 'bpp' ? 'var(--color-accent-50)' : user.role === 'pengurus' ? 'var(--color-primary-50)' : 'var(--color-secondary-50)',
                    color: user.role === 'admin' ? 'var(--color-danger)' : user.role === 'bpp' ? 'var(--color-accent)' : user.role === 'pengurus' ? 'var(--color-primary)' : 'var(--color-secondary)'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', textAlign: 'center' }}>{user.lastLogin}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <StatusBadge status={user.status} />
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button 
                      onClick={() => openEditModal(user)}
                      style={{ padding: '4px', color: 'var(--color-text-secondary)' }}
                      title="Edit Akun"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => toggleUserStatus(user.id)}
                      style={{ padding: '4px', color: user.status === 'aktif' ? 'var(--color-warning)' : 'var(--color-success)' }}
                      title={user.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {user.status === 'aktif' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => setShowDeleteModal(user)}
                        style={{ padding: '4px', color: 'var(--color-danger)' }}
                        title="Hapus Akun"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal title="Tambah Akun Pengguna Baru" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Nama Lengkap</label>
              <input 
                type="text" 
                required 
                placeholder="Contoh: Pratama Wijaya" 
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Alamat Email</label>
              <input 
                type="email" 
                required 
                placeholder="pratama@simantan.id" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Tipe Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="petani">Petani (Anggota)</option>
                  <option value="pengurus">Pengurus Kelompok</option>
                  <option value="bpp">Penyuluh BPP</option>
                  <option value="admin">Superadmin</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Status Awal</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="aktif">Aktif Langsung</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: '6px', fontWeight: '600' }}
              >
                Batal
              </button>
              <button 
                type="submit" 
                style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: '6px', fontWeight: '600' }}
              >
                Simpan Akun
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit User Modal */}
      {selectedUser && (
        <Modal title={`Edit Akun: ${selectedUser.nama}`} onClose={() => setSelectedUser(null)}>
          <form onSubmit={handleEdit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Nama Lengkap</label>
              <input 
                type="text" 
                required 
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Alamat Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Tipe Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="petani">Petani (Anggota)</option>
                  <option value="pengurus">Pengurus Kelompok</option>
                  <option value="bpp">Penyuluh BPP</option>
                  <option value="admin">Superadmin</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Status Akun</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => setSelectedUser(null)}
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

      {/* Delete User Modal */}
      {showDeleteModal && (
        <Modal title="Hapus Akun Pengguna" onClose={() => setShowDeleteModal(null)}>
          <p style={{ marginBottom: '20px' }}>
            Apakah Anda yakin ingin menghapus akun <strong>"{showDeleteModal.nama}"</strong> ({showDeleteModal.email})? Tindakan ini akan menghapus akses pengguna dari sistem secara permanen.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(null)}
              style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: '6px', fontWeight: '600' }}
            >
              Batal
            </button>
            <button 
              onClick={handleDelete}
              style={{ padding: '8px 16px', background: 'var(--color-danger)', color: 'white', borderRadius: '6px', fontWeight: '600' }}
            >
              Hapus Akun
            </button>
          </div>
        </Modal>
      )}
          </div>
        </div>
    </div>
  );
}
