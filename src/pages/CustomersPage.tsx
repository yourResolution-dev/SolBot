import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Trash2,
  Edit2,
  Mail,
  Phone,
  Building,
  MapPin,
  Clock,
  Star,
  Tag,
  ExternalLink,
  ChevronRight,
  X,
  FileSpreadsheet,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Copy,
} from 'lucide-react'
import { ActionMenu } from '@/components/ui/ActionMenu'
import {
  initialContacts,
  initialSegments,
  type ContactRecord,
  type CustomerSegment,
  type CustomerSegmentKey,
} from '@/lib/crmData'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableWrapper, TablePagination } from '@/components/ui/Table'
import { Badge, CustomerStatusBadge } from '@/components/ui/Badge'
import { ChannelIcon } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatRelativeTime } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

export function CustomersPage() {
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [contacts, setContacts] = useState<ContactRecord[]>(initialContacts)
  const [segments, setSegments] = useState<CustomerSegment[]>(initialSegments)
  const [activeSegment, setActiveSegment] = useState<CustomerSegmentKey>('all')
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 5

  // Selected contact for detail profile drawer
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null)

  // Listen for search params from Command Palette or Universal Search
  useEffect(() => {
    const contactParam = searchParams.get('contact')
    if (contactParam) {
      const match = contacts.find(
        (c) =>
          c.id.toLowerCase() === contactParam.toLowerCase() ||
          c.name.toLowerCase().includes(contactParam.toLowerCase())
      )
      if (match) {
        setSelectedContact(match)
      }
    }
  }, [searchParams, contacts])

  // Modals state
  const [createContactModal, setCreateContactModal] = useState(false)
  const [createSegmentModal, setCreateSegmentModal] = useState(false)
  const [importModal, setImportModal] = useState(false)

  // Form states for new contact
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formCompany, setFormCompany] = useState('')
  const [formTier, setFormTier] = useState<ContactRecord['tier']>('Growth')
  const [formLocation, setFormLocation] = useState('')
  const [formSpecialist, setFormSpecialist] = useState('Alex Rivera')

  // Form states for new segment
  const [newSegmentName, setNewSegmentName] = useState('')
  const [newSegmentDesc, setNewSegmentDesc] = useState('')

  // New Note state on drawer
  const [newNoteText, setNewNoteText] = useState('')

  // Filtered contacts
  const filtered = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    const matchesSegment =
      activeSegment === 'all' ||
      c.segment === activeSegment ||
      (activeSegment === 'vip' && parseFloat(c.lifetimeValue.replace(/[$,]/g, '')) > 10000)
    const matchesTier = tierFilter === 'all' || c.tier === tierFilter

    return matchesSearch && matchesSegment && matchesTier
  })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  // Handlers
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formEmail.trim()) {
      toast({ type: 'error', title: 'Validation', description: 'Name and email are required.' })
      return
    }

    const initials = formName
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

    const newContact: ContactRecord = {
      id: `CUST-00${contacts.length + 1}`,
      name: formName,
      email: formEmail,
      phone: formPhone || '+1 555 0100',
      company: formCompany || formName,
      location: formLocation || 'Global',
      avatarInitials: initials,
      avatarGradient: 'from-violet-600 to-indigo-600',
      tier: formTier,
      status: 'active',
      segment: 'all',
      tags: ['New Lead', 'WhatsApp Cloud'],
      lifetimeValue: '$0',
      ordersCount: 0,
      satisfactionScore: 5.0,
      lastContactDate: new Date().toISOString(),
      lastContactChannel: 'whatsapp',
      joinedDate: 'Today',
      assignedSpecialist: formSpecialist,
      customFields: [],
      timeline: [
        {
          id: `t-${Date.now()}`,
          type: 'whatsapp',
          title: 'Contact Profile Enrolled',
          description: 'Profile created and provisioned for WhatsApp Cloud API messaging.',
          timestamp: 'Just now',
        },
      ],
      notes: [],
    }

    setContacts([newContact, ...contacts])
    setCreateContactModal(false)
    setFormName('')
    setFormEmail('')
    setFormPhone('')
    setFormCompany('')
    toast({
      type: 'success',
      title: 'Contact Created',
      description: `${newContact.name} added to WhatsApp subscriber directory.`,
    })
  }

  const handleDeleteContact = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setContacts((prev) => prev.filter((c) => c.id !== id))
    if (selectedContact?.id === id) setSelectedContact(null)
    toast({
      type: 'info',
      title: 'Contact Removed',
      description: 'Profile and associated WhatsApp tags deleted.',
    })
  }

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Email,Phone,Company,Tier,LTV,Score']
        .concat(
          contacts.map(
            (c) =>
              `"${c.name}","${c.email}","${c.phone}","${c.company}","${c.tier}","${c.lifetimeValue}","${c.satisfactionScore}"`
          )
        )
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Resolution_Contacts_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      type: 'success',
      title: 'Contacts Exported',
      description: `Downloaded ${contacts.length} records in CSV format.`,
    })
  }

  const handleAddNoteToContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteText.trim() || !selectedContact) return

    const updated = {
      ...selectedContact,
      notes: [newNoteText, ...selectedContact.notes],
      timeline: [
        {
          id: `t-${Date.now()}`,
          type: 'note' as const,
          title: 'Internal Note Added',
          description: newNoteText,
          timestamp: 'Just now',
          author: 'Julian Sterling',
        },
        ...selectedContact.timeline,
      ],
    }

    setContacts((prev) => prev.map((c) => (c.id === selectedContact.id ? updated : c)))
    setSelectedContact(updated)
    setNewNoteText('')
    toast({
      type: 'success',
      title: 'Note Logged',
      description: 'Internal team note saved to contact timeline.',
    })
  }

  const handleCreateSegment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSegmentName.trim()) return

    const id = newSegmentName.toLowerCase().replace(/\s+/g, '_') as CustomerSegmentKey
    const newSeg: CustomerSegment = {
      id,
      name: newSegmentName,
      description: newSegmentDesc || 'Custom filtered audience group',
      badgeColor: 'bg-violet-100 text-violet-700',
      count: 0,
    }

    setSegments([...segments, newSeg])
    setActiveSegment(id)
    setCreateSegmentModal(false)
    setNewSegmentName('')
    setNewSegmentDesc('')
    toast({
      type: 'success',
      title: 'Segment Saved',
      description: `Created audience segment "${newSeg.name}".`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
              {contacts.length} Profiles
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Omnichannel customer records, WhatsApp identity resolution, purchase history, and custom CRM attributes
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Upload size={14} />}
            onClick={() => setImportModal(true)}
          >
            Import CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={handleExportCSV}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={15} />}
            onClick={() => setCreateContactModal(true)}
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Customer Audience Segments Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {segments.map((seg) => {
          const isActive = activeSegment === seg.id
          return (
            <button
              key={seg.id}
              onClick={() => {
                setActiveSegment(seg.id)
                setPage(1)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-violet-600 text-white font-semibold border-violet-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span>{seg.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {seg.id === 'all'
                  ? contacts.length
                  : contacts.filter(
                      (c) =>
                        c.segment === seg.id ||
                        (seg.id === 'vip' && parseFloat(c.lifetimeValue.replace(/[$,]/g, '')) > 10000)
                    ).length}
              </span>
            </button>
          )
        })}

        <button
          onClick={() => setCreateSegmentModal(true)}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200/70 whitespace-nowrap flex items-center gap-1 transition-colors"
        >
          <Plus size={12} /> New Segment
        </button>
      </div>

      {/* Search and Filters Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-full sm:w-80 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by name, email, phone, company..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={tierFilter}
            onChange={(e) => {
              setTierFilter(e.target.value)
              setPage(1)
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="Enterprise">Enterprise Tier</option>
            <option value="Growth">Growth Tier</option>
            <option value="Starter">Starter Tier</option>
          </select>
        </div>
      </div>

      {/* Contacts Data Table */}
      <TableWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Profile</TableHead>
              <TableHead>WhatsApp & Email</TableHead>
              <TableHead>Company & Region</TableHead>
              <TableHead>Account Tier</TableHead>
              <TableHead>Orders & LTV</TableHead>
              <TableHead>CSAT</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((contact) => (
              <TableRow
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className="cursor-pointer group"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-tr ${contact.avatarGradient} text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0`}
                    >
                      {contact.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate group-hover:text-violet-900">
                        {contact.name}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 block">
                        {contact.id}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-xs space-y-0.5">
                    <div className="font-medium text-emerald-700 flex items-center gap-1.5">
                      <Phone size={11} className="text-emerald-500 shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <Mail size={11} className="text-slate-400 shrink-0" />
                      <span className="truncate max-w-[140px]">{contact.email}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 block truncate">
                      {contact.company}
                    </span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {contact.location}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      contact.tier === 'Enterprise'
                        ? 'violet'
                        : contact.tier === 'Growth'
                        ? 'blue'
                        : 'slate'
                    }
                  >
                    {contact.tier}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">{contact.lifetimeValue}</span>
                    <span className="text-[10px] text-slate-400">
                      {contact.ordersCount} orders placed
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{contact.satisfactionScore}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ChannelIcon channel={contact.lastContactChannel} />
                    <span className="text-[11px]">{formatRelativeTime(contact.lastContactDate)}</span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setSelectedContact(contact)}
                    >
                      View
                    </Button>
                    <ActionMenu
                      items={[
                        {
                          id: 'open-ticket',
                          label: 'Message via WhatsApp',
                          icon: <MessageSquare size={13} className="text-violet-600" />,
                          onClick: () => {
                            navigate('/tickets')
                            toast({
                              type: 'info',
                              title: 'Navigated to Inbox',
                              description: `Opening WhatsApp thread with ${contact.name}.`,
                            })
                          },
                        },
                        {
                          id: 'copy-email',
                          label: 'Copy Email Address',
                          icon: <Mail size={13} className="text-slate-500" />,
                          onClick: () => {
                            navigator.clipboard?.writeText(contact.email)
                            toast({
                              type: 'info',
                              title: 'Email Copied',
                              description: `${contact.email} copied to clipboard.`,
                            })
                          },
                        },
                        {
                          id: 'copy-phone',
                          label: 'Copy Phone Number',
                          icon: <Phone size={13} className="text-emerald-600" />,
                          onClick: () => {
                            navigator.clipboard?.writeText(contact.phone)
                            toast({
                              type: 'info',
                              title: 'Phone Copied',
                              description: `${contact.phone} copied to clipboard.`,
                            })
                          },
                        },
                      ]}
                      buttonClassName="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    />
                    <button
                      onClick={(e) => handleDeleteContact(contact.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete contact"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </TableWrapper>

      {/* ─── Detailed Customer Profile Drawer ───────────────────────────────── */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedContact(null)}
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 z-10 flex flex-col overflow-hidden animate-slide-down">
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-violet-50/60 to-indigo-50/40">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedContact.avatarGradient} text-white font-bold flex items-center justify-center text-lg shadow-sm`}
                >
                  {selectedContact.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedContact.name}</h3>
                    <Badge variant={selectedContact.tier === 'Enterprise' ? 'violet' : 'blue'}>
                      {selectedContact.tier}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedContact.company} &bull; Joined {selectedContact.joinedDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedContact(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
              {/* Quick Contact & WhatsApp Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">WhatsApp Phone:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Phone size={12} className="text-emerald-500" /> {selectedContact.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email Address:</span>
                  <span className="font-medium text-slate-800">{selectedContact.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-700">{selectedContact.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned Agent:</span>
                  <span className="font-semibold text-violet-700">{selectedContact.assignedSpecialist}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Tags & Customer Badges
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedContact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-100 font-medium text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Custom CRM Fields */}
              {selectedContact.customFields.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Custom Enterprise Attributes
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedContact.customFields.map((field) => (
                      <div key={field.key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">{field.label}</span>
                        <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                          {field.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interaction Timeline */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Interaction Timeline & Activity
                </span>
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedContact.timeline.map((event) => (
                    <div key={event.id} className="relative pl-7">
                      <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-violet-600 ring-4 ring-white" />
                      <p className="font-semibold text-slate-900 text-xs">{event.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {event.description}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {event.timestamp} {event.author && `&bull; By ${event.author}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes & Team Annotations */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Private Support Notes
                </span>
                <form onSubmit={handleAddNoteToContact} className="space-y-2 mb-3">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Log conversation memo or WhatsApp VIP instruction..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-400 bg-slate-50/50"
                  />
                  <Button variant="secondary" size="xs" type="submit" className="w-full">
                    Log Private Note
                  </Button>
                </form>

                <div className="space-y-2">
                  {selectedContact.notes.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-slate-800 text-[11px] leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Contact Modal ───────────────────────────────────────────────── */}
      <Modal
        open={createContactModal}
        onClose={() => setCreateContactModal(false)}
        title="Add Customer Contact"
        subtitle="Provision profile for WhatsApp notifications and automated order lookups"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCreateContactModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateContact}>
              Create Contact Record
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateContact} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Full Name *</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="input-base text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address *</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="maya@company.com"
                className="input-base text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">WhatsApp Phone *</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+1 555 0199"
                className="input-base text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Company / Brand</label>
              <input
                type="text"
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="Business entity"
                className="input-base text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Account Tier</label>
              <select
                value={formTier}
                onChange={(e) => setFormTier(e.target.value as any)}
                className="input-base text-xs"
              >
                <option value="Enterprise">Enterprise ($999/mo)</option>
                <option value="Growth">Growth ($299/mo)</option>
                <option value="Starter">Starter ($99/mo)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Location / City</label>
            <input
              type="text"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              placeholder="e.g. London, UK or San Francisco, USA"
              className="input-base text-xs"
            />
          </div>
        </form>
      </Modal>

      {/* ─── Add Segment Modal ───────────────────────────────────────────────── */}
      <Modal
        open={createSegmentModal}
        onClose={() => setCreateSegmentModal(false)}
        title="Create Audience Segment"
        subtitle="Group customers for targeted WhatsApp broadcasting and custom SLA rules"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCreateSegmentModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateSegment}>
              Save Segment
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSegment} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Segment Name</label>
            <input
              type="text"
              value={newSegmentName}
              onChange={(e) => setNewSegmentName(e.target.value)}
              placeholder="e.g. Q4 High Value Wholesale"
              className="input-base text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Description</label>
            <textarea
              rows={2}
              value={newSegmentDesc}
              onChange={(e) => setNewSegmentDesc(e.target.value)}
              placeholder="Criteria for audience inclusion"
              className="input-base text-xs"
            />
          </div>
        </form>
      </Modal>

      {/* ─── Import Modal ────────────────────────────────────────────────────── */}
      <Modal
        open={importModal}
        onClose={() => setImportModal(false)}
        title="Import Customer Contacts"
        subtitle="Upload CSV file with Name, WhatsApp Phone, Email, and Company"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setImportModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast({
                  type: 'success',
                  title: 'Import Simulated',
                  description: 'Validated 15 customer rows with WhatsApp phone numbers.',
                })
                setImportModal(false)
              }}
            >
              Parse & Ingest CSV
            </Button>
          </>
        }
      >
        <div className="p-8 border-2 border-dashed border-violet-200 rounded-2xl flex flex-col items-center justify-center text-center bg-violet-50/40 cursor-pointer hover:bg-violet-50 transition-colors">
          <FileSpreadsheet size={32} className="text-violet-600 mb-2" />
          <p className="text-xs font-bold text-slate-800">Drag & drop your CSV file here</p>
          <p className="text-[11px] text-slate-400 mt-1">Supports Shopify, HubSpot, or Salesforce exports</p>
        </div>
      </Modal>
    </div>
  )
}
