import { useEffect, useMemo, useState } from 'react'
import { cmsConfigured, mediaPublicUrl, supabase } from '../lib/supabase'

const emptyInterest = { title: '', slug: '', description: '', cover_path: '', sort_order: 0, published: false }
const emptyBlock = { type: 'text', content: '', media_url: '', media_path: '', caption: '', sort_order: 0, published: true }

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function uploadMedia(file, folder = 'interests') {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = folder + '/' + crypto.randomUUID() + '-' + safeName
  const { error } = await supabase.storage.from('portfolio-media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw error
  return path
}

function Login({ onSession }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setMessage('Signing in…')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return setMessage(error.message)

    const { data: adminRow } = await supabase.from('admins').select('user_id').eq('user_id', data.user.id).maybeSingle()
    if (!adminRow) {
      await supabase.auth.signOut()
      return setMessage('This account is authenticated but is not authorized as an administrator.')
    }

    setMessage('')
    onSession(data.session)
  }

  return (
    <section className="admin-login-shell">
      <form className="admin-login-card" onSubmit={submit}>
        <p className="kicker">Administrator</p>
        <h1>Portfolio CMS</h1>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
        <button className="button primary" type="submit">Sign in</button>
        {message && <p className="admin-message">{message}</p>}
      </form>
    </section>
  )
}

function AboutEditor() {
  const [form, setForm] = useState({ heading: '', body: '', image_path: '', image_caption: '', published: true })
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.from('about_profile').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setForm(data)
    })
  }, [])

  const save = async () => {
    setMessage('Saving…')
    const { error } = await supabase.from('about_profile').upsert({ ...form, id: 1, updated_at: new Date().toISOString() })
    setMessage(error ? error.message : 'Saved.')
  }

  const onImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setMessage('Uploading image…')
    try {
      const path = await uploadMedia(file, 'about')
      setForm((prev) => ({ ...prev, image_path: path }))
      setMessage('Image uploaded. Save to publish the change.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="admin-editor-card">
      <div className="admin-editor-head"><div><p className="eyebrow">Profile</p><h2>About page</h2></div><button className="button primary" onClick={save}>Save</button></div>
      <label>Heading<input value={form.heading || ''} onChange={(e) => setForm({ ...form, heading: e.target.value })} /></label>
      <label>Body<textarea rows="12" value={form.body || ''} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Write your personal statement here…" /></label>
      <label>Photo<input type="file" accept="image/*" onChange={onImage} /></label>
      {form.image_path && <img className="admin-image-preview" src={mediaPublicUrl(form.image_path)} alt="" />}
      <label>Photo caption<input value={form.image_caption || ''} onChange={(e) => setForm({ ...form, image_caption: e.target.value })} /></label>
      <label className="admin-check"><input type="checkbox" checked={Boolean(form.published)} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
      {message && <p className="admin-message">{message}</p>}
    </div>
  )
}

function BlockEditor({ page }) {
  const [blocks, setBlocks] = useState([])
  const [draft, setDraft] = useState(emptyBlock)
  const [message, setMessage] = useState('')

  const refresh = async () => {
    const { data } = await supabase.from('content_blocks').select('*').eq('page_id', page.id).order('sort_order')
    setBlocks(data || [])
  }

  useEffect(() => { refresh() }, [page.id])

  const createBlock = async () => {
    if (draft.type === 'text' && !draft.content.trim()) return setMessage('Text block cannot be empty.')
    const { error } = await supabase.from('content_blocks').insert({ ...draft, page_id: page.id })
    if (error) return setMessage(error.message)
    setDraft({ ...emptyBlock, sort_order: blocks.length })
    setMessage('Block added.')
    refresh()
  }

  const uploadForDraft = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setMessage('Uploading…')
    try {
      const path = await uploadMedia(file, 'interests/' + page.slug)
      setDraft((prev) => ({ ...prev, media_path: path }))
      setMessage('Uploaded. Add the block when ready.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const updateBlock = async (id, patch) => {
    await supabase.from('content_blocks').update(patch).eq('id', id)
    refresh()
  }

  const removeBlock = async (block) => {
    if (!window.confirm('Delete this block?')) return
    if (block.media_path) await supabase.storage.from('portfolio-media').remove([block.media_path])
    await supabase.from('content_blocks').delete().eq('id', block.id)
    refresh()
  }

  return (
    <div className="block-editor">
      <h3>Content blocks</h3>
      <div className="block-list">
        {blocks.map((block) => (
          <article key={block.id}>
            <div><strong>{block.type}</strong><span>#{block.sort_order}</span></div>
            {block.type === 'text' ? <p>{block.content?.slice(0, 160)}</p> : <p>{block.caption || block.media_url || block.media_path}</p>}
            <div className="block-actions">
              <button onClick={() => updateBlock(block.id, { published: !block.published })}>{block.published ? 'Unpublish' : 'Publish'}</button>
              <button onClick={() => updateBlock(block.id, { sort_order: Math.max(0, block.sort_order - 1) })}>↑</button>
              <button onClick={() => updateBlock(block.id, { sort_order: block.sort_order + 1 })}>↓</button>
              <button className="danger-link" onClick={() => removeBlock(block)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      <div className="new-block-card">
        <p className="eyebrow">Add block</p>
        <div className="block-type-tabs">
          {['text', 'image', 'video'].map((type) => <button className={draft.type === type ? 'active' : ''} key={type} onClick={() => setDraft({ ...emptyBlock, type, sort_order: blocks.length })}>{type}</button>)}
        </div>
        {draft.type === 'text' ? (
          <label>Text<textarea rows="8" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></label>
        ) : (
          <>
            <label>Upload {draft.type}<input type="file" accept={draft.type === 'image' ? 'image/*' : 'video/*'} onChange={uploadForDraft} /></label>
            <label>Or external media URL<input value={draft.media_url} onChange={(e) => setDraft({ ...draft, media_url: e.target.value })} placeholder="https://…" /></label>
            <label>Caption<input value={draft.caption} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} /></label>
          </>
        )}
        <label className="admin-check"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Publish immediately</label>
        <button className="button secondary" onClick={createBlock}>Add block</button>
        {message && <p className="admin-message">{message}</p>}
      </div>
    </div>
  )
}

function ProjectAssetsEditor() {
  const [assets, setAssets] = useState({})
  const [message, setMessage] = useState('')

  const refresh = async () => {
    const { data, error } = await supabase
      .from('project_assets')
      .select('*')
      .eq('project_id', 'production-scheduling')
    if (error) return setMessage(error.message)
    setAssets(Object.fromEntries((data || []).map((item) => [item.asset_key, item])))
  }

  useEffect(() => { refresh() }, [])

  const uploadAsset = async (assetKey, file) => {
    if (!file) return
    setMessage('Uploading ' + file.name + '…')
    try {
      const path = await uploadMedia(file, 'projects/production-scheduling')
      const previous = assets[assetKey]
      const { error } = await supabase
        .from('project_assets')
        .upsert({
          project_id: 'production-scheduling',
          asset_key: assetKey,
          media_path: path,
          caption: assetKey === 'dashboard_demo'
            ? 'Synthetic dashboard demonstration'
            : 'Synthetic scheduling workbook',
          published: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'project_id,asset_key' })
      if (error) throw error
      if (previous?.media_path && previous.media_path !== path) {
        await supabase.storage.from('portfolio-media').remove([previous.media_path])
      }
      setMessage('Uploaded and published.')
      refresh()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const removeAsset = async (assetKey) => {
    const item = assets[assetKey]
    if (!item || !window.confirm('Remove this published asset?')) return
    if (item.media_path) await supabase.storage.from('portfolio-media').remove([item.media_path])
    await supabase.from('project_assets').delete().eq('id', item.id)
    setMessage('Removed.')
    refresh()
  }

  const AssetRow = ({ assetKey, title, accept, help }) => {
    const item = assets[assetKey]
    return (
      <article className="project-asset-row">
        <div>
          <p className="eyebrow">Capstone asset</p>
          <h3>{title}</h3>
          <p>{help}</p>
          {item && <span className="asset-live">Published · {item.media_path}</span>}
        </div>
        <div className="project-asset-actions">
          <label className="button secondary">
            {item ? 'Replace' : 'Upload'}
            <input type="file" accept={accept} onChange={(e) => uploadAsset(assetKey, e.target.files?.[0])} hidden />
          </label>
          {item && <button className="danger-link" onClick={() => removeAsset(assetKey)}>Remove</button>}
        </div>
      </article>
    )
  }

  return (
    <div className="admin-editor-card">
      <div className="admin-editor-head">
        <div><p className="eyebrow">Curated work</p><h2>Capstone project assets</h2></div>
      </div>
      <p className="admin-help">These files appear inside the hand-designed Production Scheduling case study. They are separate from Interests so the story layout stays curated.</p>
      <AssetRow assetKey="dashboard_demo" title="Redacted dashboard video" accept="video/*" help="Upload the synthetic-data dashboard recording with the location-specific label redacted." />
      <AssetRow assetKey="scheduler_excel" title="Synthetic scheduler workbook" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" help="Upload the public synthetic Excel deliverable." />
      {message && <p className="admin-message">{message}</p>}
    </div>
  )
}

function InterestsEditor() {
  const [pages, setPages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [draft, setDraft] = useState(emptyInterest)
  const [message, setMessage] = useState('')

  const selected = useMemo(() => pages.find((page) => page.id === selectedId), [pages, selectedId])

  const refresh = async () => {
    const { data } = await supabase.from('interest_pages').select('*').order('sort_order')
    setPages(data || [])
    if (!selectedId && data?.length) setSelectedId(data[0].id)
  }

  useEffect(() => { refresh() }, [])

  const createPage = async () => {
    const title = draft.title.trim()
    if (!title) return setMessage('Title is required.')
    const slug = (draft.slug || slugify(title)).trim()
    const { data, error } = await supabase.from('interest_pages').insert({ ...draft, title, slug }).select().single()
    if (error) return setMessage(error.message)
    setDraft(emptyInterest)
    setMessage('Interest created.')
    await refresh()
    setSelectedId(data.id)
  }

  const updatePage = async (page, patch) => {
    const { error } = await supabase.from('interest_pages').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', page.id)
    if (error) setMessage(error.message)
    else refresh()
  }

  const uploadCover = async (page, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const path = await uploadMedia(file, 'interest-covers')
      await updatePage(page, { cover_path: path })
    } catch (error) {
      setMessage(error.message)
    }
  }

  const removePage = async (page) => {
    if (!window.confirm('Delete "' + page.title + '" and its blocks?')) return
    await supabase.from('interest_pages').delete().eq('id', page.id)
    setSelectedId(null)
    refresh()
  }

  return (
    <div className="admin-interest-layout">
      <aside className="admin-interest-list">
        <div className="admin-editor-head"><div><p className="eyebrow">Content</p><h2>Interests</h2></div></div>
        {pages.map((page) => <button key={page.id} className={selectedId === page.id ? 'active' : ''} onClick={() => setSelectedId(page.id)}><strong>{page.title}</strong><span>{page.published ? 'Published' : 'Draft'}</span></button>)}
        <div className="new-interest-mini">
          <input placeholder="New interest title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: slugify(e.target.value) })} />
          <button onClick={createPage}>+ Create</button>
        </div>
      </aside>

      <div>
        {selected ? (
          <div className="admin-editor-card">
            <div className="admin-editor-head"><div><p className="eyebrow">Edit interest</p><h2>{selected.title}</h2></div><button className="danger-link" onClick={() => removePage(selected)}>Delete</button></div>
            <label>Title<input value={selected.title} onChange={(e) => updatePage(selected, { title: e.target.value })} /></label>
            <label>Slug<input value={selected.slug} onChange={(e) => updatePage(selected, { slug: slugify(e.target.value) })} /></label>
            <label>Description<textarea rows="4" value={selected.description || ''} onChange={(e) => updatePage(selected, { description: e.target.value })} /></label>
            <label>Cover image<input type="file" accept="image/*" onChange={(e) => uploadCover(selected, e)} /></label>
            {selected.cover_path && <img className="admin-image-preview" src={mediaPublicUrl(selected.cover_path)} alt="" />}
            <div className="admin-inline">
              <label>Sort order<input type="number" value={selected.sort_order} onChange={(e) => updatePage(selected, { sort_order: Number(e.target.value) })} /></label>
              <label className="admin-check"><input type="checkbox" checked={selected.published} onChange={(e) => updatePage(selected, { published: e.target.checked })} /> Published</label>
            </div>
            <BlockEditor page={selected} />
          </div>
        ) : <div className="admin-editor-card"><p>Create or select an interest.</p></div>}
        {message && <p className="admin-message">{message}</p>}
      </div>
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(cmsConfigured)
  const [tab, setTab] = useState('about')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(async ({ data }) => {
      const current = data.session
      if (!current) {
        setChecking(false)
        return
      }
      const { data: adminRow } = await supabase.from('admins').select('user_id').eq('user_id', current.user.id).maybeSingle()
      if (adminRow) {
        setSession(current)
        setAuthorized(true)
      } else {
        await supabase.auth.signOut()
      }
      setChecking(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => subscription.subscription.unsubscribe()
  }, [])

  if (!cmsConfigured) {
    return <section className="page-hero"><p className="kicker">Administrator</p><h1>CMS is not connected yet.</h1><p className="hero-copy">Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to the deployment environment after creating the Supabase project.</p></section>
  }

  if (checking) return <section className="page-hero"><p className="cms-status">Checking administrator session…</p></section>
  if (!session || !authorized) return <Login onSession={(next) => { setSession(next); setAuthorized(true) }} />

  return (
    <section className="admin-shell">
      <header className="admin-topbar">
        <div><p className="kicker">Administrator</p><h1>Portfolio CMS</h1></div>
        <button className="button secondary" onClick={async () => { await supabase.auth.signOut(); setSession(null); setAuthorized(false) }}>Sign out</button>
      </header>
      <div className="admin-tabs">
        <button className={tab === 'about' ? 'active' : ''} onClick={() => setTab('about')}>About</button>
        <button className={tab === 'interests' ? 'active' : ''} onClick={() => setTab('interests')}>Interests</button>
        <button className={tab === 'projects' ? 'active' : ''} onClick={() => setTab('projects')}>Project assets</button>
      </div>
      {tab === 'about' ? <AboutEditor /> : tab === 'interests' ? <InterestsEditor /> : <ProjectAssetsEditor />}
    </section>
  )
}
