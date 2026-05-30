import React, { useEffect, useState } from 'react';
import { Gamepad2, Plus, Edit2, Trash2, Star, Save, X } from 'lucide-react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import { adminFetch, logoutAdmin } from '../lib/adminAuth';

const emptyProject = {
  title: '',
  description: '',
  thumbnail: '',
  tags: '',
  liveUrl: '',
  repoUrl: '',
  isFeatured: false,
  categoryIds: [],
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProject);

  const fetchData = async () => {
    try {
      const [projectRes, categoryRes] = await Promise.all([
        adminFetch('/api/admin/projects'),
        adminFetch('/api/admin/categories'),
      ]);

      if (projectRes.status === 401 || projectRes.status === 403 || categoryRes.status === 401 || categoryRes.status === 403) {
        window.location.href = '/admin/login';
        return;
      }

      if (projectRes.ok) {
        setProjects(await projectRes.json());
      }
      if (categoryRes.ok) {
        setCategories(await categoryRes.json());
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm(emptyProject);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/admin/login';
  };

  const handleToggleFeatured = async (project) => {
    try {
      const res = await adminFetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !project.isFeatured }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProjects((current) => current.map((item) => (item.id === project.id ? updated : item)));
      }
    } catch (err) {
      console.error('Failed to toggle project status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Game Over! Apakah Anda yakin ingin menghapus level (project) ini?')) {
      return;
    }

    try {
      const res = await adminFetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((current) => current.filter((item) => item.id !== id));
        if (editingId === id) {
          resetForm();
        }
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleStartAdd = () => {
    setEditingId(null);
    setIsAdding((current) => {
      const next = !current;
      setForm(next ? { ...emptyProject, categoryIds: categories[0] ? [categories[0].id] : [] } : emptyProject);
      return next;
    });
  };

  const handleStartEdit = (project) => {
    setIsAdding(false);
    setEditingId(project.id);
    setForm({
      title: project.title || '',
      description: project.description || '',
      thumbnail: project.thumbnail || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
      liveUrl: project.liveUrl || '',
      repoUrl: project.repoUrl || '',
      isFeatured: Boolean(project.isFeatured),
      categoryIds: Array.isArray(project.categories) ? project.categories.map((category) => category.id) : [],
    });
  };

  const handleCategoryToggle = (categoryId) => {
    setForm((current) => {
      const exists = current.categoryIds.includes(categoryId);
      return {
        ...current,
        categoryIds: exists ? current.categoryIds.filter((id) => id !== categoryId) : [...current.categoryIds, categoryId],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      thumbnail: form.thumbnail,
      tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
      liveUrl: form.liveUrl,
      repoUrl: form.repoUrl,
      isFeatured: form.isFeatured,
      categoryIds: form.categoryIds,
    };

    try {
      const res = await adminFetch(editingId ? `/api/admin/projects/${editingId}` : '/api/admin/projects', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan project');
      }

      setProjects((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? data : item));
        }

        return [data, ...current];
      });
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EFE6', color: 'var(--color-text)' }}>
      <header style={{ borderBottom: '4px solid var(--color-border)', backgroundColor: '#FFF', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="font-retro-game">
            <Gamepad2 size={24} style={{ color: 'var(--color-highlight)' }} />
            <span style={{ fontSize: '13px' }}>CMS HUD</span>
          </div>

          <nav style={{ display: 'flex', gap: '20px' }} className="admin-nav">
            <a href="/admin/dashboard" className="font-retro-label">DASHBOARD</a>
            <a href="/admin/experiences" className="font-retro-label">EXPERIENCES</a>
            <a href="/admin/projects" className="font-retro-label active-nav">PROJECTS</a>
            <a href="/admin/inquiries" className="font-retro-label">INBOX</a>
            <a href="/admin/settings" className="font-retro-label">SETTINGS</a>
          </nav>

          <PixelButton variant="gray" onClick={handleLogout} style={{ minHeight: '36px', minWidth: '90px', padding: '6px 12px', fontSize: '9px' }}>
            LOGOUT
          </PixelButton>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 24px', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 className="font-retro-game" style={{ fontSize: '18px' }}>PROJECTS CONFIG</h2>
          <PixelButton variant="orange" onClick={handleStartAdd} style={{ minHeight: '40px', padding: '8px 16px', fontSize: '10px' }}>
            <Plus size={14} style={{ marginRight: '4px' }} /> {isAdding ? 'CANCEL LEVEL' : 'ADD NEW QUEST'}
          </PixelButton>
        </div>

        {(isAdding || editingId) && (
          <div style={{ marginBottom: '40px' }} className="animate-jump">
            <PixelCard stageLabel={editingId ? 'EDIT QUEST' : 'NEW LEVEL BLOCK SETUP'}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                <div>
                  <label className="pixel-label" htmlFor="title">PROJECT TITLE</label>
                  <input id="title" type="text" className="pixel-input" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} required />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="tags">TECH TAGS (COMMA SEPARATED)</label>
                  <input id="tags" type="text" className="pixel-input" value={form.tags} onChange={(e) => setForm((current) => ({ ...current, tags: e.target.value }))} required />
                </div>

                <div>
                  <label className="pixel-label">CATEGORY LINKS (MINIMAL 1)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                    {categories.map((category) => {
                      const checked = form.categoryIds.includes(category.id);
                      return (
                        <label key={category.id} className="pixel-box" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', borderWidth: '2px', boxShadow: checked ? '2px 2px 0px var(--color-border)' : 'none', backgroundColor: checked ? '#fff6d3' : '#fff' }}>
                          <input type="checkbox" checked={checked} onChange={() => handleCategoryToggle(category.id)} style={{ width: '16px', height: '16px' }} />
                          <span className="font-retro-label" style={{ fontSize: '10px' }}>{category.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="pixel-label" htmlFor="thumbnail">THUMBNAIL URL</label>
                  <input id="thumbnail" type="url" className="pixel-input" value={form.thumbnail} onChange={(e) => setForm((current) => ({ ...current, thumbnail: e.target.value }))} />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="liveUrl">LIVE URL</label>
                  <input id="liveUrl" type="url" className="pixel-input" value={form.liveUrl} onChange={(e) => setForm((current) => ({ ...current, liveUrl: e.target.value }))} />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="repoUrl">REPO URL</label>
                  <input id="repoUrl" type="url" className="pixel-input" value={form.repoUrl} onChange={(e) => setForm((current) => ({ ...current, repoUrl: e.target.value }))} />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="desc">PROJECT DESCRIPTION</label>
                  <textarea id="desc" rows="3" className="pixel-input" style={{ resize: 'none', padding: '12px' }} value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} required />
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <input id="featured-toggle" type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((current) => ({ ...current, isFeatured: e.target.checked }))} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label className="font-retro-label" htmlFor="featured-toggle" style={{ fontSize: '11px', cursor: 'pointer' }}>SET AS FEATURED LEVEL (SHOWN FIRST)</label>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <PixelButton variant="orange" type="submit" ariaLabel="Simpan project" style={{ width: '200px', marginTop: '12px', fontSize: '11px' }}>
                    <Save size={14} style={{ marginRight: '6px' }} /> {editingId ? 'UPDATE PROJECT' : 'SAVE PROJECT'}
                  </PixelButton>
                  <PixelButton variant="gray" type="button" onClick={resetForm} style={{ width: '180px', marginTop: '12px', fontSize: '11px' }}>
                    <X size={14} style={{ marginRight: '6px' }} /> CANCEL EDIT
                  </PixelButton>
                </div>
              </form>
            </PixelCard>
          </div>
        )}

        <PixelCard stageLabel="LOADED PROJECT QUESTS">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '980px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>TITLE</th>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>CATEGORIES</th>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>TECH STACK</th>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>LINKS</th>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px', textAlign: 'center' }}>FEATURED</th>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px', textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} style={{ borderBottom: '1px solid #CCC' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div className="font-retro-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>{project.title}</div>
                      <div style={{ fontSize: '12px', marginTop: '6px', color: '#555' }}>{project.description}</div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(Array.isArray(project.categories) ? project.categories : []).map((category) => (
                          <span key={category.id} className="font-retro-label" style={{ fontSize: '8px', border: '1px solid var(--color-border)', padding: '1px 5px', backgroundColor: '#FFF' }}>
                            {category.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(Array.isArray(project.tags) ? project.tags : []).map((tag, index) => (
                          <span key={index} className="font-retro-label" style={{ fontSize: '8px', border: '1px solid var(--color-border)', padding: '1px 5px', backgroundColor: '#FFF' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '12px' }}>
                      <div>{project.liveUrl || '-'}</div>
                      <div style={{ marginTop: '6px', color: '#666' }}>{project.repoUrl || '-'}</div>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <button onClick={() => handleToggleFeatured(project)} className="pixel-box cursor-pointer" style={{ padding: '6px 10px', fontSize: '9px', borderWidth: '2px', boxShadow: '1px 1px 0px var(--color-border)', backgroundColor: project.isFeatured ? 'var(--color-highlight)' : '#FFF', color: project.isFeatured ? '#FFF' : 'var(--color-text)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }} title={project.isFeatured ? 'Unset featured' : 'Set featured'}>
                        <Star size={12} fill={project.isFeatured ? '#FFF' : 'none'} /> {project.isFeatured ? 'FEATURED' : 'NORMAL'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleStartEdit(project)} className="pixel-box cursor-pointer" style={{ padding: '6px', borderWidth: '2px', boxShadow: '1px 1px 0px var(--color-border)', backgroundColor: '#FFF' }} title="Edit level">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="pixel-box cursor-pointer" style={{ padding: '6px', borderWidth: '2px', boxShadow: '1px 1px 0px var(--color-border)', backgroundColor: '#F44336', color: '#FFF' }} title="Delete level">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PixelCard>
      </main>

      <style>{`
        .admin-nav a {
          text-decoration: none;
          color: var(--color-text);
          font-size: 11px;
          padding: 4px 8px;
          border-bottom: 3px solid transparent;
        }
        .admin-nav a:hover {
          color: var(--color-highlight);
        }
        .admin-nav a.active-nav {
          color: var(--color-highlight);
          border-bottom: 3px solid var(--color-highlight);
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default AdminProjects;
