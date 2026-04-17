import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useData(userId) {
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [samples, setSamples] = useState([])
  const [goals, setGoals] = useState([])
  const [topVideos, setTopVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const [p, v, s, g, t] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('videos').select('*').eq('user_id', userId).order('created_at'),
      supabase.from('samples').select('*').eq('user_id', userId).order('created_at'),
      supabase.from('goals').select('*').eq('user_id', userId).order('created_at'),
      supabase.from('top_videos').select('*').eq('user_id', userId).order('display_order'),
    ])
    if (p.data) setProfile(p.data)
    if (v.data) setVideos(v.data)
    if (s.data) setSamples(s.data)
    if (g.data) setGoals(g.data)
    if (t.data) setTopVideos(t.data)
    setLoading(false)
  }, [userId])

  useEffect(() => { loadAll() }, [loadAll])

  // --- PROFILE ---
  async function saveProfile(updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    if (!error && data) setProfile(data)
    return { error }
  }

  // --- VIDEOS ---
  async function saveVideo(video) {
    if (video.id) {
      const { id, user_id, created_at, ...updates } = video
      const { data, error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', video.id)
        .select()
        .single()
      if (!error && data) setVideos(prev => prev.map(v => v.id === data.id ? data : v))
      return { error }
    } else {
      const { data, error } = await supabase
        .from('videos')
        .insert({ ...video, user_id: userId })
        .select()
        .single()
      if (!error && data) setVideos(prev => [...prev, data])
      return { error }
    }
  }

  async function deleteVideo(id) {
    const { error } = await supabase.from('videos').delete().eq('id', id)
    if (!error) setVideos(prev => prev.filter(v => v.id !== id))
    return { error }
  }

  async function moveVideo(id, stage) {
    const { data, error } = await supabase
      .from('videos')
      .update({ stage })
      .eq('id', id)
      .select()
      .single()
    if (!error && data) setVideos(prev => prev.map(v => v.id === data.id ? data : v))
    return { error }
  }

  // --- SAMPLES ---
  async function saveSample(sample) {
    if (sample.id) {
      const { id, user_id, created_at, ...updates } = sample
      const { data, error } = await supabase
        .from('samples')
        .update(updates)
        .eq('id', sample.id)
        .select()
        .single()
      if (!error && data) setSamples(prev => prev.map(s => s.id === data.id ? data : s))
      return { error }
    } else {
      const { data, error } = await supabase
        .from('samples')
        .insert({ ...sample, user_id: userId })
        .select()
        .single()
      if (!error && data) setSamples(prev => [...prev, data])
      return { error }
    }
  }

  async function deleteSample(id) {
    const { error } = await supabase.from('samples').delete().eq('id', id)
    if (!error) setSamples(prev => prev.filter(s => s.id !== id))
    return { error }
  }

  // --- GOALS ---
  async function saveGoal(goal) {
    if (goal.id) {
      const { id, user_id, created_at, ...updates } = goal
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', goal.id)
        .select()
        .single()
      if (!error && data) setGoals(prev => prev.map(g => g.id === data.id ? data : g))
      return { error }
    } else {
      const { data, error } = await supabase
        .from('goals')
        .insert({ ...goal, user_id: userId })
        .select()
        .single()
      if (!error && data) setGoals(prev => [...prev, data])
      return { error }
    }
  }

  async function deleteGoal(id) {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (!error) setGoals(prev => prev.filter(g => g.id !== id))
    return { error }
  }

  // --- TOP VIDEOS ---
  async function saveTopVideo(tv) {
    if (tv.id) {
      const { id, user_id, ...updates } = tv
      const { data, error } = await supabase
        .from('top_videos')
        .update(updates)
        .eq('id', tv.id)
        .select()
        .single()
      if (!error && data) setTopVideos(prev => prev.map(t => t.id === data.id ? data : t))
      return { error }
    } else {
      const { data, error } = await supabase
        .from('top_videos')
        .insert({ ...tv, user_id: userId })
        .select()
        .single()
      if (!error && data) setTopVideos(prev => [...prev, data])
      return { error }
    }
  }

  async function deleteTopVideo(id) {
    const { error } = await supabase.from('top_videos').delete().eq('id', id)
    if (!error) setTopVideos(prev => prev.filter(t => t.id !== id))
    return { error }
  }

  return {
    profile, videos, samples, goals, topVideos, loading,
    saveProfile,
    saveVideo, deleteVideo, moveVideo,
    saveSample, deleteSample,
    saveGoal, deleteGoal,
    saveTopVideo, deleteTopVideo,
    reload: loadAll,
  }
}
