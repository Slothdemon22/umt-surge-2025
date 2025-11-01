'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Send, X, Plus } from 'lucide-react'

const JOB_TYPES = [
  { value: 'ACADEMIC_PROJECT', label: 'Academic Project', description: 'Research, coursework, or academic collaborations' },
  { value: 'STARTUP_COLLABORATION', label: 'Startup/Collaboration', description: 'Join a startup or collaborative venture' },
  { value: 'PART_TIME_JOB', label: 'Part-time Job', description: 'Paid part-time work opportunities' },
  { value: 'COMPETITION_HACKATHON', label: 'Competition/Hackathon', description: 'Team formation for competitions and hackathons' },
]

const SUGGESTED_TAGS = [
  'React', 'Node.js', 'Python', 'AI/ML', 'Mobile App', 'Web Dev',
  'Data Science', 'UI/UX', 'Blockchain', 'IoT', 'Cloud', 'DevOps',
  'Research', 'Design', 'Marketing', 'Business', 'Remote', 'Paid'
]

interface TagsInputProps {
  tags: string
  onChange: (tags: string) => void
}

function TagsInput({ tags, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []

  const addTag = (tag: string): void => {
    if (tag && !tagsArray.includes(tag)) {
      const newTags = [...tagsArray, tag].join(', ')
      onChange(newTags)
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string): void => {
    const newTags = tagsArray.filter(t => t !== tagToRemove).join(', ')
    onChange(newTags)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue.trim())
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a tag and press Enter"
          className="flex-1 glass-input"
        />
        <button
          type="button"
          onClick={() => addTag(inputValue.trim())}
          className="btn-gradient px-4 py-2 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Selected Tags */}
      {tagsArray.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tagsArray.map((tag) => (
            <span
              key={tag}
              className="glass-card px-3 py-1 text-sm flex items-center gap-2"
              style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent)' }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggested Tags */}
      <div>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          Suggested tags (click to add):
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS.filter(tag => !tagsArray.includes(tag)).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="glass-card px-3 py-1 text-sm hover:shadow-md transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface CreateJobFormProps {
  profileId: string
}

export function CreateJobForm({ profileId }: CreateJobFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    requirements: '',
    duration: '',
    compensation: '',
    location: '',
    teamSize: '',
    tags: '',
  })

  const handleSubmit = async (isDraft: boolean) => {
    setError(null)
    setLoading(true)

    try {
      // Validate required fields for published jobs
      if (!isDraft) {
        if (!formData.title || !formData.type || !formData.description) {
          setError('Please fill in all required fields (Title, Type, Description)')
          setLoading(false)
          return
        }
      }

      const tagsArray = formData.tags
        ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : []

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          isDraft,
          profileId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job')
      }

      // Redirect based on draft status
      if (isDraft) {
        router.push('/jobs/my-jobs?tab=drafts')
      } else {
        router.push(`/jobs/${data.job.id}`)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {error && (
        <div className="glass-card p-4" style={{ 
          background: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
        }}>
          <p className="text-sm font-medium" style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="glass-card p-8 space-y-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          Basic Information
        </h2>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            Job Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g., Looking for Full-Stack Developer for EdTech Startup"
            className="w-full glass-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            Opportunity Type *
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {JOB_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => updateField('type', type.value)}
                className={`glass-card p-4 text-left transition-all ${
                  formData.type === type.value ? 'ring-2' : ''
                }`}
                style={{
                  ringColor: formData.type === type.value ? 'var(--accent)' : 'transparent',
                  borderColor: formData.type === type.value ? 'var(--accent)' : 'var(--border)',
                }}
              >
                <h3 className="font-semibold mb-1" style={{ 
                  color: formData.type === type.value ? 'var(--accent)' : 'var(--foreground)' 
                }}>
                  {type.label}
                </h3>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe the opportunity, responsibilities, and what you're looking for..."
            rows={6}
            className="w-full glass-input resize-none"
            required
          />
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
            Provide a detailed description to attract the right candidates
          </p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="glass-card p-8 space-y-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          Additional Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Requirements/Skills
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => updateField('requirements', e.target.value)}
              placeholder="e.g., React, Node.js, 2+ years experience"
              rows={4}
              className="w-full glass-input resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Duration/Timeline
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => updateField('duration', e.target.value)}
              placeholder="e.g., 3-6 months, Full semester"
              className="w-full glass-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Compensation (Optional)
            </label>
            <input
              type="text"
              value={formData.compensation}
              onChange={(e) => updateField('compensation', e.target.value)}
              placeholder="e.g., Unpaid, $500/month, Equity"
              className="w-full glass-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Location
            </label>
            <select
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full glass-input"
            >
              <option value="">Select location</option>
              <option value="Remote">Remote</option>
              <option value="On-campus">On-campus</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Team Size Needed
            </label>
            <input
              type="text"
              value={formData.teamSize}
              onChange={(e) => updateField('teamSize', e.target.value)}
              placeholder="e.g., 2-3 members, 1 developer"
              className="w-full glass-input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Tags
            </label>
            <TagsInput
              tags={formData.tags}
              onChange={(tags: string) => updateField('tags', tags)}
            />
            <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
              Add relevant tags to help candidates find your opportunity
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="glass-card px-8 py-3 font-semibold flex items-center gap-2 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span>Save as Draft</span>
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="btn-gradient px-8 py-3 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span>Publish Job</span>
        </button>
      </div>
    </form>
  )
}

